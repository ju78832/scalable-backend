import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/helper";
import { createClient } from "redis";
import { RedisClientType } from "@redis/client";
import { error } from "console";

let client: RedisClientType;
let cacheData: any;

(async () => {
  client = createClient();
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
})();

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  try {
    const body = await req.json();
    const { message } = body;
    const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const user = await prisma.user.findUnique({
      where: {
        email: email!,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.chat.create({
      data: {
        content: message,
        role: "user",
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);

    const chatResponse = await prisma.chat.create({
      data: {
        content: result.response.text(),
        role: "assistance",
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const data = await prisma.chat.findMany({
      where: {
        user: {
          email: email!,
        },
      },
    });

    cacheData = await client.set("chat", JSON.stringify(data));

    return NextResponse.json(
      { message: chatResponse, email: email },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    cacheData = await client.get("chat");
    if (cacheData) {
      return NextResponse.json({ chat: cacheData }, { status: 200 });
    }

    const chat = await prisma.chat.findMany({
      where: {
        user: {
          email: email!,
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    cacheData = await client.set("chat", JSON.stringify(chat));

    return NextResponse.json({ chat: cacheData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
