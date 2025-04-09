import { NextResponse } from "next/server";
// Your Prisma client instance
import bcrypt from "bcryptjs"; // For password hashing
import { db } from "~/server/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        // set default role to 'user'
      roles: {
        
      }
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
