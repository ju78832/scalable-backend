import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export const config = { matcher: ["/sign-in", "/sign-up", "/chat"] };

export async function middleware(req: NextRequest) {
  return NextResponse.next();
}
