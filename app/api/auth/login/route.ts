import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { comparePassword } from "@/app/lib/hash";
import { connectDB } from "@/app/lib/db";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const match = await comparePassword(password, user.passwordHash);
  if (!match)
    return NextResponse.json({ error: "Wrong password" }, { status: 400 });

  return NextResponse.json({
    message: "Login success",
    user,
  });
}
