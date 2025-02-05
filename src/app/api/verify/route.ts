import { prisma } from "@/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const body = await req.json();
  const { code } = body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email!,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValidCode = user.verifyCode === code;
    const isCodeExpired = new Date() > new Date(user.verifyCodeExpire!);
    if (!isValidCode || isCodeExpired) {
      return NextResponse.json({ message: "Invalid code" }, { status: 400 });
    }

    const isVerified = await prisma.user.update({
      where: {
        email: email!,
      },
      data: {
        isVerified: true,
        verifyCode: undefined,
        verifyCodeExpire: undefined,
      },
    });
    if (!isVerified) {
      return NextResponse.json({ error: "Failed to verify" }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: "Verified Successfully",
        isForgetPassword: user.isForgetPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
