import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";
import { generateVerificationCode } from "@/app/lib/generateKeys";
import { sendVerificationEmail } from "@/app/lib/email";

export async function POST(req: Request) {
  await connectDB();

  const { email } = await req.json();

  const user = await User.findOne({ email });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 400 });

  if (user.isVerified)
    return NextResponse.json(
      { error: "User already verified" },
      { status: 400 }
    );

  const newCode = generateVerificationCode();

  user.verificationCode = newCode;
  user.verificationCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  await sendVerificationEmail(email, newCode);

  return NextResponse.json({ message: "Verification code resent" });
}
