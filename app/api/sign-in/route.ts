"use server";

import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import argon2 from "argon2";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { password, token } = body;

        if (typeof password !== "string" || typeof token !== "string") {
            return NextResponse.json(
                { error: "入力内容が正しくありません" },
                { status: 400 },
            );
        }

        if (!token) {
            return NextResponse.json(
                { error: "Turnstileの検証が必要です" },
                { status: 400 },
            );
        }

        const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
        const expected = process.env.RC_PULSE_HASHED_PASSWORD;
        const jwtSecret = process.env.JWT_SECRET;

        if (!turnstileSecret || !expected || !jwtSecret) {
            console.error("Required authentication environment variables are missing");
            return NextResponse.json(
                { error: "サーバー設定エラーが発生しました" },
                { status: 500 },
            );
        }

        const verifyRes = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    secret: turnstileSecret,
                    response: token,
                }),
            },
        );

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
            console.error("Turnstile検証失敗:", verifyData["error-codes"]);
            return NextResponse.json(
                { error: "接続エラー: 時間をおいてからやり直して下さい。" },
                { status: 403 },
            );
        }

        const ok = await argon2.verify(expected, password);

        if (!ok) {
            return NextResponse.json(
                { error: "パスワードが一致しませんでした" },
                { status: 401 },
            );
        }

        const jwt = await new SignJWT({ role: "admin" })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("60d")
            .sign(new TextEncoder().encode(jwtSecret));

        const res = NextResponse.json({ ok: true });

        res.cookies.set({
            name: "auth_token",
            value: jwt,
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 60,
        });

        return res;
    } catch (err) {
        console.error("APIエラー:", err);
        return NextResponse.json(
            { error: "サーバーエラーが発生しました" },
            { status: 500 },
        );
    }
}
