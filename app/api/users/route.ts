import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";
import { hashPassword } from "@/app/lib/hash";
import {
  generateApiKey,
  generateApiToken,
  generateVerificationCode,
} from "@/app/lib/generateKeys";

export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  await connectDB();

  const { name, email, password } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const exists = await User.findOne({ email });

  if (exists)
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    passwordHash,
    apiKey: generateApiKey(),
    apiToken: generateApiToken(),
    isVerified: false,
    verificationCode: generateVerificationCode(),
    verificationCodeExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // ⬅ ADDED
  });

  return NextResponse.json({ message: "User created", user });
}
