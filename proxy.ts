import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    if (!pathname.startsWith("/")) {
        return NextResponse.next();
    }
    if (pathname === "/sign-in") {
        return NextResponse.next();
    }
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    try {
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch {
        const response = NextResponse.redirect(
            new URL("/sign-in", request.url),
        );
        response.cookies.delete({
            name: "auth_token",
            path: "/",
        });
        return response;
    }
}

export const config = {
    matcher: ["/"],
};
