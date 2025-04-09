import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: Request) {
  try {
    const { name, description, parentId } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Role name is required" },
        { status: 400 },
      );
    }

    // Create a new role
    const role = await db.role.create({
      data: {
        name,
        description,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(
      { message: "Role created successfully", role },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all roles
    const roles = await db.role.findMany({
      include: {
        permissions: true,
      },
    });

    return NextResponse.json({ roles }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
