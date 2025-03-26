import { NextResponse } from "next/server";
import { getCheckIns } from "@/server/actions/checkIns/getCheckIns";
import { getUser } from "@/server/actions/users/getUser";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit")!)
      : null;
    const newest = searchParams.get("newest") === "true";

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await getUser();

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checkIns = await getCheckIns(user, limit, newest);

    // Add cache control headers
    const headers = new Headers();
    headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    return NextResponse.json({ checkIns }, { headers });
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    return NextResponse.json(
      { error: "Failed to fetch check-ins" },
      { status: 500 }
    );
  }
}
