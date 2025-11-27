import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";
import { jsonToToon } from "@/app/lib/jsonToToon";

export async function POST(req: Request) {
  try {
    await connectDB();

    // ---------------------------------------------------
    // PLAYGROUND MODE CHECK USING SECRET
    // ---------------------------------------------------
    const url = new URL(req.url);
    const source = url.searchParams.get("source");
    const playgroundSecret = process.env.PLAYGROUND_BYPASS_SECRET;

    const isPlayground = source && source === playgroundSecret;

    // ---------------------------------------------------
    // REQUIRE API KEY IF NOT PLAYGROUND
    // ---------------------------------------------------
    const authHeader = req.headers.get("authorization");

    if (!isPlayground) {
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Missing API Key. Use: Authorization: Bearer <API_KEY>" },
          { status: 401 }
        );
      }

      const apiKey = authHeader.split(" ")[1];

      const user = await User.findOne({ apiKey });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid API Key" },
          { status: 401 }
        );
      }

      if (!user.isVerified) {
        return NextResponse.json(
          { error: "Email not verified" },
          { status: 403 }
        );
      }
    }

    // ---------------------------------------------------
    // PARSE JSON DATA
    // ---------------------------------------------------
    const { json } = await req.json();

    if (!json)
      return NextResponse.json(
        { error: "JSON field is required" },
        { status: 400 }
      );

    const converted = jsonToToon(json);

    return NextResponse.json({
      success: true,
      toon: converted,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Invalid JSON", details: err.message },
      { status: 400 }
    );
  }
}
