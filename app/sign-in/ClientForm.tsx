"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import * as amplitude from "@amplitude/analytics-browser";

export default function LoginForm() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("2026");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const turnstileRef = useRef<TurnstileInstance>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError("Turnstileの検証が必要です。");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/sign-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, token }),
                credentials: "include",
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "サーバーエラー");

                if (turnstileRef.current) {
                    turnstileRef.current.reset();
                }
                setToken(null);

                return;
            }

            amplitude.track("sign-in", {});

            router.push("/");
            router.refresh();
        } catch (err) {
            setError(`サーバーエラー: ${err}`);
            if (turnstileRef.current) {
                turnstileRef.current.reset();
            }
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="justify-center block items-center text-center">
                <form
                    onSubmit={handleSubmit}
                    className="w-xs block text-center mb-4 border mx-auto border-(--color-border) rounded-4xl p-4 font-semibold"
                >
                    <input
                        className="w-full appearance-none outline-0 text-md p-4 rounded-2xl shadow-[inset_0_0_0_1px_var(--color-border)] focus:shadow-[inset_0_0_0_2px_var(--color-foreground)] transition-all disabled:bg-(--color-background-secondary) duration-200 ease-out font-mono disabled:text-[hsl(0,0%,50%)] mb-4"
                        type="text"
                        placeholder="ユーザー名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={true}
                    />
                    <input
                        className="w-full appearance-none outline-0 text-md p-4 rounded-2xl shadow-[inset_0_0_0_1px_var(--color-border)] focus:shadow-[inset_0_0_0_2px_var(--color-foreground)] transition-all duration-200 ease-out font-mono disabled:text-[hsl(0,0%,50%)] mb-4"
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !token}
                        className={`w-full bg-(--color-foreground) text-md p-3 rounded-2xl text-(--color-background) transform active:scale-95 transition-all duration-200 ease-out disabled:opacity-50 font-semibold`}
                    >
                        {loading ? "読み込み中…" : "サインイン"}
                    </button>
                </form>

                <Turnstile
                    ref={turnstileRef}
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(token) => setToken(token)}
                    onExpire={() => {
                        setToken(null);
                        if (turnstileRef.current) turnstileRef.current.reset();
                    }}
                    className="mt-6"
                    onError={(error) =>
                        console.error("Turnstile error:", error)
                    }
                />

                <p
                    className={`text-md transition-all duration-200 transform ease-out ${
                        error
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 display-none"
                    }`}
                >
                    {error}
                </p>

                <p className="text-start">
                    パスワードは、クラスのグループチャットを見てください。
                </p>
            </div>

            <footer className="border-t border-(--color-border) w-xs pb-8 pt-8 mt-2">
                <nav className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(100px,1fr))] opacity-50">
                    <div className="text-start inline-block">
                        <a className="font-bold text-xs inline-block mb-4">
                            規約
                        </a>
                        <br />
                        <a
                            href="https://vgnz93hs.com/terms-of-use"
                            target="_blank"
                            className="text-(--color-foreground) active:no-underline hover:underline text-xs inline-block my-2"
                        >
                            利用規約
                        </a>
                    </div>
                </nav>

                <div className="w-full opacity-25 pt-7 text-center inline-block text-xs">
                    <a>© 2026 vgnz93hs. All rights reserved.</a>
                </div>
            </footer>
        </div>
    );
}
