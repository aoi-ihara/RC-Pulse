"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import * as amplitude from "@amplitude/analytics-browser";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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
        <div className="flex flex-col items-center gap-4">
            <div className="justify-center flex flex-col gap-4 w-full items-center text-center">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-full gap-4"
                >
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        font="mono"
                        label="Room ID"
                        disabled={true}
                    />
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        font="mono"
                        type="password"
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        loading={loading}
                        iconName="logIn"
                        variant="primary"
                        className="w-full"
                    >
                        サインイン
                    </Button>
                </form>

                <Turnstile
                    ref={turnstileRef}
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(token) => setToken(token)}
                    onExpire={() => {
                        setToken(null);
                        if (turnstileRef.current) turnstileRef.current.reset();
                    }}
                    onError={(error) =>
                        console.error("Turnstile error:", error)
                    }
                />

                {error && (
                    <p
                        className={`text-md text-red-500 transition-all duration-200 transform ease-out`}
                    >
                        {error}
                    </p>
                )}

                <p className="text-start">
                    パスワードは、クラスのグループチャットを見てください。
                </p>
            </div>

            <footer className="border-t border-(--color-border) w-full pb-8 pt-8">
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
