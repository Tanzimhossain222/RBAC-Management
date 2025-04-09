import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { permissions } = await req.json();
  const { id } = await params;

  if (!permissions || permissions.length === 0) {
    return NextResponse.json(
      { error: "Permission IDs required" },
      { status: 400 },
    );
  }

  const role = await db.role.findUnique({ where: { id } });
  if (!role)
    return NextResponse.json({ error: "Role not found" }, { status: 404 });

  const updated = await db.role.update({
    where: { id },
    data: {
      permissions: {
        set: permissions.map((id: string) => ({ id })),
      },
    },
  });

  return NextResponse.json(
    { message: "Permissions assigned", updated },
    { status: 200 },
  );
}
