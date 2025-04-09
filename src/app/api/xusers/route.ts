import { db } from "~/server/db";

export async function GET(request: Request) {
  try {
    const res = await db.user.findMany({
      include: {
        roles: true,
      },
    });

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
