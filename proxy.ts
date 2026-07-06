import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const jwtSecret = process.env.JWT_SECRET;
const secret = jwtSecret ? new TextEncoder().encode(jwtSecret) : null;

export async function proxy(request: NextRequest) {
    if (!secret) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    try {
        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== "admin") {
            throw new Error("Invalid role");
        }
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
    matcher: [
        "/((?!sign-in|api/sign-in|_next/static|_next/image|favicon.ico|apple-icon.png|robots.txt).*)",
    ],
};
