import { prisma } from "@/helper";
import { sendEmail } from "@/helper/sendemail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  try {
    const code = Math.ceil(Math.random() * 900000 + 100000).toString();
    const user = await prisma.user.findUnique({
      where: {
        email: email!,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await prisma.user.update({
      where: {
        email: email!,
      },
      data: {
        verifyCode: code,
        verifyCodeExpire: new Date(Date.now() + 5 * 60 * 1000),
        isForgetPassword: true,
      },
    });

    const verifymail = await sendEmail(email!, code);
    if (!verifymail.success) {
      return NextResponse.json(
        { message: verifymail.message },
        { status: 403 }
      );
    }
    return NextResponse.json({ message: verifymail.message }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
