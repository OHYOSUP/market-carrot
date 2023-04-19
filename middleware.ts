/* eslint-disable @next/next/no-server-import-in-page */
import { getIronSession } from "iron-session/edge";
import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent,
} from "next/server";


export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
  if (userAgent(req).isBot) {
    return NextResponse.rewrite(new URL('/enter', req.url))
  }

  if (!req.cookies.has("carrotsession") && !req.url.includes("/enter")) {
    const res = NextResponse.next();
    const session = await getIronSession(req, res, {
      cookieName: "carrotsession",
      password: process.env.IRON_PW!,
      cookieOptions: {
        secure: process.env.NODE_ENV! === "production",
      },
    });


    req.nextUrl.searchParams.set("from", req.nextUrl.pathname);
    req.nextUrl.pathname = "/enter";
    return NextResponse.redirect(req.nextUrl);
  }
};
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};