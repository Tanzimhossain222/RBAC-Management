import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: Request) {
  try {
    const { email, password, roles } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.$transaction(async (tx) => {
      let roleConnectData;

      if (roles?.length) {
        // Validate role IDs exist (optional but recommended)
        const foundRoles = await tx.role.findMany({
          where: { id: { in: roles } },
          select: { id: true },
        });

        if (foundRoles.length !== roles.length) {
          throw new Error("One or more roles not found");
        }

        roleConnectData = foundRoles.map((r) => ({ id: r.id }));
      } else {
        // No roles passed, assign default role
        const defaultRole = await tx.role.findUnique({
          where: { name: "user" },
          select: { id: true },
        });

        if (!defaultRole) {
          throw new Error("Default role not found");
        }

        roleConnectData = [{ id: defaultRole.id }];
      }

      // Create the user with roles inside the transaction
      return await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          roles: {
            connect: roleConnectData,
          },
        },
      });
    });

    return NextResponse.json(
      { message: "User created successfully", userId: result.id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[REGISTER_ERROR]", error);
    const message = error?.message ?? "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
