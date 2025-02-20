import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/helper";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { email: email! },
      data: {
        password: hashedPassword,
        isForgetPassword: false,
        isVerified: true,
        verifyCode: undefined,
        verifyCodeExpire: undefined,
      },
    });
    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to change password" },
      { status: 500 }
    );
  }
}
