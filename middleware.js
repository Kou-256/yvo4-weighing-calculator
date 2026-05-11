import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "4c971c2d-8bd2-4a5e-b891-ae6c52664f9f");
  requestHeaders.set("x-createxyz-project-group-id", "3fee2401-8a5a-4a5b-b8ef-839697f9862f");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}
