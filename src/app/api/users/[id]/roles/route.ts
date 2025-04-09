import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { roles } = await req.json();
    const { id } = await params;

    if (!roles || roles.length === 0) {
      return NextResponse.json(
        { message: "Roles are required" },
        { status: 400 },
      );
    }

    // Find the user
    const user = await db.user.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Assign roles to the user
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        roles: {
          set: roles.map((roleId: string) => ({ id: roleId })),
        },
      },
      include: { roles: true },
    });

    return NextResponse.json(
      { message: "User roles updated", updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
