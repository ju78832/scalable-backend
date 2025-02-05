import { prisma } from "@/helper";
import { sendEmail } from "@/helper/sendemail";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const { name, email, password } = body;
    const emailExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (emailExists) {
      return new Response("Email already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.ceil(Math.random() * 900000 + 100000).toString();
    const time = new Date(Date.now() + 5 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        verifyCode: code,
        verifyCodeExpire: time,
      },
    });

    const verifymail = await sendEmail(email, code);
    if (!verifymail.success) {
      return NextResponse.json(
        { message: verifymail.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        message: "User created Successfully. Make sure to verify your email.",
        user: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
