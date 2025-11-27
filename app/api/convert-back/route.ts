import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";
import { toonToJson } from "@/app/lib/toonToJson";

export async function POST(req: Request) {
  try {
    await connectDB();

    // -----------------------------------------------
    // CHECK AUTH (API KEY REQUIRED)
    // -----------------------------------------------
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.split(" ")[1];

    // Find user
    const user = await User.findOne({ apiKey });

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Email not verified. Please verify to use this API." },
        { status: 403 }
      );
    }

    // -----------------------------------------------
    // READ BODY
    // -----------------------------------------------
    const body = await req.json();
    const { toon } = body;

    if (!toon || typeof toon !== "string") {
      return NextResponse.json(
        { error: "TOON field is required and must be a string" },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // CONVERT TO JSON
    // -----------------------------------------------
    let jsonOutput: any;

    try {
      jsonOutput = toonToJson(toon);
    } catch (err: any) {
      return NextResponse.json(
        { error: "Failed to convert TOON → JSON", details: err.message },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // SUCCESS RESPONSE
    // -----------------------------------------------
    return NextResponse.json({
      success: true,
      json: jsonOutput,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
