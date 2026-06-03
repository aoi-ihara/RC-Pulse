"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Contents } from "./Contents";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function Dashboard() {
    await checkAuth();
    return <DataFetcher />;
}

async function checkAuth() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth_token")?.value;
    if (!authCookie) redirect("/sign-in");
    try {
        const { payload } = await jwtVerify(authCookie, secret);
        if (payload.role !== "admin") redirect("/sign-in");
    } catch {
        redirect("/sign-in");
    }
}

async function DataFetcher() {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const { data, error } = await supabaseAdmin
        .from("rc_pulse")
        .select("id, sent_at, body, heading")
        .eq("id", "11111111-1111-1111-1111-111111111100")
        .limit(1);

    if (error) {
        console.error("Error:", error.message);
        return (
            <main className="main">
                <h1 className="title">Error</h1>
            </main>
        );
    }

    if (!data || data.length === 0) {
        return (
            <main className="main">
                <h1 className="title">データが送信されていません</h1>
            </main>
        );
    }

    const latest = data[0];

    return (
        <div className="w-full">
            <Contents
                heading={latest.heading}
                body={latest.body}
                sent_at={latest.sent_at}
            />
        </div>
    );
}
