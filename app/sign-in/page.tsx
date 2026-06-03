"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import LoginForm from "./ClientForm";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function SignInPage() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth_token")?.value;

    let shouldRedirectTo = null;

    if (authCookie) {
        try {
            const { payload } = await jwtVerify(authCookie, secret);

            if (payload.role !== "admin") {
                shouldRedirectTo = "/sign-in";
            } else {
                shouldRedirectTo = "/";
            }
        } catch (error) {
            console.error("JWT verification failed:", error);
        }
    }

    if (shouldRedirectTo) {
        redirect(shouldRedirectTo);
    }

    return (
        <div className="justify-center main flex flex-col items-center">
            <h1 className="title">サインイン</h1>
            <LoginForm />
        </div>
    );
}
