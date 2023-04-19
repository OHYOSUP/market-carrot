/* eslint-disable @next/next/no-server-import-in-page */
import { getIronSession } from "iron-session/edge";
import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent,
} from "next/server";


export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
  // if (!userAgent(req).isBot) {
  //   return new Response("로봇은 입장이 안됩니다🤖", { status: 403 })
  // }



  // if (!req.url.includes("api")) {
  //   if (!req.url.includes("/enter") && !req.cookies.has("carrotsession")) {
  //     req.nextUrl.pathname = "/enter"

  //     return NextResponse.redirect(req.nextUrl)
  //   }
  //   return NextResponse.next();
  // }

  if (req.nextUrl.pathname.startsWith("/")) {
    const ua = userAgent(req);
    if (ua?.isBot) {
      return new Response("Plz don't be a bot. Be human.", { status: 403 });
    }
  }
  if (req.nextUrl.pathname.startsWith("/api")) {
    if (!req.url.includes("/enter") && !req.cookies.get("carrotsession")) {
      console.log("carrotsession");
      NextResponse.redirect(`${req.nextUrl.origin}/enter`);
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|favicon.ico).*)',
  ],
};