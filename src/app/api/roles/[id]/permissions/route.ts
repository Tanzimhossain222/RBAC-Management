import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await req.json();
  const { permissions } = body;
  const { id } = await params;

  // Check if 'permissions' is missing or not an array
  if (!Array.isArray(permissions)) {
    return NextResponse.json(
      { error: "Permission IDs must be an array" },
      { status: 400 },
    );
  }

  const role = await db.role.findUnique({ where: { id } });
  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  const updated = await db.role.update({
    where: { id },
    data: {
      permissions: {
        set: permissions.map((id: string) => ({ id })),
      },
    },
  });

  return NextResponse.json(
    { message: "Permissions updated", updated },
    { status: 200 },
  );
}
