import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: Request) {
  const { name } = await req.json();

  if (!name)
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const existing = await db.permissionGroup.findUnique({ where: { name } });
  if (existing)
    return NextResponse.json(
      { error: "Group already exists" },
      { status: 400 },
    );

  const group = await db.permissionGroup.create({ data: { name } });

  return NextResponse.json(group, { status: 201 });
}

export async function GET() {
  const groups = await db.permissionGroup.findMany();
  return NextResponse.json(groups, { status: 200 });
}
