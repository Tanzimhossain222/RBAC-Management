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

    console.log("Creating role with data:", {
      name,
      description,
      parentId,
    });
    

    // Create a new role
    const role = await db.role.create({
      data: {
        name,
        description,
        parentId: parentId ?? null,
      },
    });

    return NextResponse.json(
        role ,
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

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Role ID is required" },
        { status: 400 },
      );
    }

    // Delete the role
    await db.role.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Role deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, description, parentId } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Role ID is required" },
        { status: 400 },
      );
    }

    // Update the role
    const role = await db.role.update({
      where: { id },
      data: {
        name,
        description,
        parentId: parentId ?? null,
      },
    });

    return NextResponse.json(
      { message: "Role updated successfully", role },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
