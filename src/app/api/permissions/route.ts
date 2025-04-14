import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: Request) {
  const { action, resource, description, groupId, name } = await req.json();

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
    data: { action, resource, description, groupId, name },
  });

  return NextResponse.json(permission, { status: 201 });
}

export async function GET() {
  const permissions = await db.permission.findMany({
    include: {
      group: true,
      roles: true,
    },
  });
  return NextResponse.json(permissions, { status: 200 });
}

export async function PATCH(req: Request) {
  const { id, action, resource, description, groupId, name } = await req.json();

  if (!id || !action || !resource || !groupId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const permission = await db.permission.update({
    where: { id },
    data: { action, resource, description, groupId, name },
  });

  return NextResponse.json(permission, { status: 200 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const permission = await db.permission.delete({ where: { id } });

  return NextResponse.json(permission, { status: 200 });
}
