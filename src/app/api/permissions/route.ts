import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: Request) {
  const { action, resource, description, groupId } = await req.json();

  if (!action || !resource || !groupId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // Unique check
  const existing = await db.permission.findUnique({
    where: {
      action_resource: { action, resource },
    },
  });

  if (existing)
    return NextResponse.json(
      { error: "Permission already exists" },
      { status: 400 },
    );

  const permission = await db.permission.create({
    data: { action, resource, description, groupId },
  });

  return NextResponse.json({ permission }, { status: 201 });
}

export async function GET() {
  const permissions = await db.permission.findMany({
    include: {
      group: true,
      roles: true,
    },
  });
  return NextResponse.json({ permissions }, { status: 200 });
}
