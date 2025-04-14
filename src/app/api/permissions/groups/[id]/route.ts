import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { name } = await req.json();

  if (!name)
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const updatedGroup = await db.permissionGroup.update({
    where: { id },
    data: { name },
  });

  return NextResponse.json(updatedGroup, { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id)
    return NextResponse.json(
      { error: "Group ID is required" },
      { status: 400 },
    );

  await db.permissionGroup.delete({ where: { id } });

  return NextResponse.json(
    { message: "Group deleted successfully" },
    { status: 200 },
  );
}
