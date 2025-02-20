import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export const config = { matcher: ["/sign-in", "/sign-up", "/chat"] };

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (
    token &&
    (req.nextUrl.pathname === "/sign-in" ||
      req.nextUrl.pathname === "/sign-up" ||
      req.nextUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  if (!token && req.nextUrl.pathname === "/chat") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  return NextResponse.next();
}
