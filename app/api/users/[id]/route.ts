import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";

export async function GET(req: Request, { params }: any) {
  await connectDB();
  const user = await User.findById(params.id);
  return NextResponse.json(user);
}

export async function PATCH(req: Request, { params }: any) {
  await connectDB();

  const { name } = await req.json();

  const user = await User.findByIdAndUpdate(params.id, { name }, { new: true });

  return NextResponse.json({ message: "Updated", user });
}

export async function DELETE(req: Request, { params }: any) {
  await connectDB();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "User deleted" });
}
