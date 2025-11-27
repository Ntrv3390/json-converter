import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";

export async function POST(req: Request) {
  await connectDB();

  const { email, code } = await req.json();

  const user = await User.findOne({ email });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 400 });

  // Optional but recommended
  if (user.verificationCodeExpiresAt < new Date()) {
    return NextResponse.json(
      { error: "Verification code expired" },
      { status: 400 }
    );
  }

  if (user.verificationCode !== code)
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });

  user.isVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpiresAt = null;

  await user.save();

  return NextResponse.json({ message: "Verified", user });
}
