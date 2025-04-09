import { db } from "~/server/db";

export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          permissions: true,
          parent: {
            include: {
              permissions: true,
            },
          },
        },
      },
    },
  });

  if (!user) return [];

  const permissionsSet = new Set<string>();

  for (const role of user.roles) {
    // Direct permissions
    role.permissions.forEach((p) =>
      permissionsSet.add(`${p.action}:${p.resource}`),
    );

    // Parent role permissions
    if (role.parent) {
      role.parent.permissions.forEach((p) =>
        permissionsSet.add(`${p.action}:${p.resource}`),
      );
    }
  }

  return [...permissionsSet];
}
