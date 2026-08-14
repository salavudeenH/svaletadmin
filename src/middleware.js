import { NextResponse } from "next/server";

const COOKIE_NAME = "svalet_admin_token";
const ROLE_COOKIE_NAME = "svalet_admin_role";
const VALET_COOKIE_NAME = "svalet_valet_token";

// Sections réservées aux admins complets : un manager n'a accès qu'aux réservations, voituriers et avis clients.
const FULL_ADMIN_PATHS = ["/tarifs", "/promocodes", "/users"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Espace voiturier : auth totalement séparée du back-office admin.
  if (pathname.startsWith("/voiturier")) {
    const hasValetSession = request.cookies.has(VALET_COOKIE_NAME);

    if (pathname === "/voiturier/login") {
      if (hasValetSession) {
        return NextResponse.redirect(new URL("/voiturier", request.url));
      }
      return NextResponse.next();
    }

    if (!hasValetSession) {
      return NextResponse.redirect(new URL("/voiturier/login", request.url));
    }
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(COOKIE_NAME);

  if (pathname === "/login") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const role = request.cookies.get(ROLE_COOKIE_NAME)?.value;
  if (role === "manager") {
    const isRestricted =
      pathname === "/" ||
      pathname === "/valets/new" ||
      FULL_ADMIN_PATHS.some((p) => pathname.startsWith(p));
    if (isRestricted) {
      return NextResponse.redirect(new URL("/reservations", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
