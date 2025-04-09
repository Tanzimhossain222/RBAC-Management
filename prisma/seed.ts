import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Cleanup
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.permissionGroup.deleteMany();

  // Permission Group
  const postGroup = await prisma.permissionGroup.create({
    data: { name: "Post Permissions" },
  });

  // Permissions
  await prisma.permission.createMany({
    data: [
      { action: "read", resource: "post", groupId: postGroup.id },
      { action: "write", resource: "post", groupId: postGroup.id },
      { action: "delete", resource: "post", groupId: postGroup.id },
      { action: "manage", resource: "users", groupId: postGroup.id },
    ],
  });

  // Fetch permissions
  const [readPost, writePost, deletePost, manageUsers] = await Promise.all([
    prisma.permission.findUnique({
      where: { action_resource: { action: "read", resource: "post" } },
    }),
    prisma.permission.findUnique({
      where: { action_resource: { action: "write", resource: "post" } },
    }),
    prisma.permission.findUnique({
      where: { action_resource: { action: "delete", resource: "post" } },
    }),
    prisma.permission.findUnique({
      where: { action_resource: { action: "manage", resource: "users" } },
    }),
  ]);

  if (!readPost || !writePost || !deletePost || !manageUsers) {
    throw new Error("One or more permissions were not found.");
  }

  // Create Roles with hierarchy and permissions
  const guestRole = await prisma.role.create({
    data: {
      name: "guest",
      permissions: { connect: [{ id: readPost.id }] },
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: "user",
      parentId: guestRole.id,
      permissions: { connect: [{ id: writePost.id }] },
    },
  });

  const editorRole = await prisma.role.create({
    data: {
      name: "editor",
      parentId: userRole.id,
    },
  });

  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
      parentId: editorRole.id,
      permissions: {
        connect: [{ id: deletePost.id }, { id: manageUsers.id }],
      },
    },
  });

  // Create Users and assign roles
  await Promise.all([
    prisma.user.create({
      data: {
        email: "guest@example.com",
        password: "hashedpassword",
        roles: { connect: [{ id: guestRole.id }] },
      },
    }),
    prisma.user.create({
      data: {
        email: "user@example.com",
        password: "hashedpassword",
        roles: { connect: [{ id: userRole.id }] },
      },
    }),
    prisma.user.create({
      data: {
        email: "editor@example.com",
        password: "hashedpassword",
        roles: { connect: [{ id: editorRole.id }] },
      },
    }),
    prisma.user.create({
      data: {
        email: "admin@example.com",
        password: "hashedpassword",
        roles: { connect: [{ id: adminRole.id }] },
      },
    }),
  ]);

  console.log(
    "✅ Seeded dynamic hierarchy with users, roles, and permissions!",
  );
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
  })
  .finally(() => prisma.$disconnect());
