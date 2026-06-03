"use client";

import { motion } from "framer-motion";
import { TaskItems } from "./TaskItems";
import * as amplitude from "@amplitude/analytics-browser";

interface ContentsProps {
    heading: string;
    body: string;
    sent_at: string;
}

type Task = {
    date: string;
    heading: string;
    title: string;
    explanation?: string;
    url?: string;
};

function getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const rtf = new Intl.RelativeTimeFormat("ja", { numeric: "auto" });

    if (seconds < 60) return rtf.format(-seconds, "second");
    if (minutes < 60) return rtf.format(-minutes, "minute");
    if (hours < 24) return rtf.format(-hours, "hour");
    if (days < 30) return rtf.format(-days, "day");

    return date.toLocaleDateString("ja-JP");
}

export function Contents({ body, sent_at }: ContentsProps) {
    const today: Task[] = parseTask(
        body.match(/\$0\n([^$]+)/)?.[1].split("\n") ?? [],
    );
    const precipitationChance: string = body.match(/\$1([^$]+)/)?.[1] ?? "";
    const tomorrow: Task[] = parseTask(
        body.match(/\$2\n([^$]+)/)?.[1].split("\n") ?? [],
    );
    const homeworks: Task[] = parseTask(
        body.match(/\$3\n([^$]+)/)?.[1].split("\n") ?? [],
    )
        .concat(parseTask(body.match(/\$4\n([^$]+)/)?.[1].split("\n") ?? []))
        .sort(
            (a, b) =>
                Number(a.date.split("日")[0]) - Number(b.date.split("日")[0]),
        );

    function parseTask(items: string[]): Task[] {
        return items.map((item) => {
            const [date, heading, title, explanation, url] = item
                .split("|")
                .map((p) => p.trim());
            return {
                date,
                heading,
                title,
                explanation: explanation,
                url,
            };
        });
    }

    return (
        <div className="relative w-full leading-loose">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, origin: "top" }}
                animate={{ opacity: 1, scale: 1, origin: "top" }}
                transition={{ duration: 0.2, delay: 0.0, ease: "easeOut" }}
                className="justify-center flex h-dvh"
            >
                <main className="justify-center max-w-[min(100%,512px)] flex w-full">
                    <div className="w-full max-w-fit px-4">
                        <div className="font-bold cursor-default mt-4 flex items-center gap-1 text-[calc(14px+0.1dvw)]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20px"
                                fill="currentColor"
                                className="text-(--color-foreground)"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.5 3A1.501 1.501 0 0 0 9 4.5h6A1.5 1.5 0 0 0 13.5 3h-3Zm-2.693.178A3 3 0 0 1 10.5 1.5h3a3 3 0 0 1 2.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V6.257c0-1.47 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.15Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            今日
                        </div>
                        <TaskItems tasks={today} />
                        <div className="font-bold flex cursor-default mt-4 text-[calc(14px+0.1dvw)]">
                            <div className="font-bold w-20 cursor-default mt-4 flex items-center gap-1 text-[calc(14px+0.1dvw)]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="20px"
                                    fill="currentColor"
                                    className="text-(--color-foreground)"
                                >
                                    <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                                </svg>
                                明日
                            </div>
                            <div className="font-bold w-full justify-end cursor-default mt-4 flex items-center gap-1 text-[calc(14px+0.1dvw)]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="20px"
                                    fill="currentColor"
                                    className="text-(--color-foreground)"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.5 9.75a6 6 0 0 1 11.573-2.226 3.75 3.75 0 0 1 4.133 4.303A4.5 4.5 0 0 1 18 20.25H6.75a5.25 5.25 0 0 1-2.23-10.004 6.072 6.072 0 0 1-.02-.496Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {precipitationChance}%
                            </div>
                        </div>
                        <TaskItems tasks={tomorrow} />
                        <div className="font-bold w-20 cursor-default mt-4 flex items-center gap-1 text-[calc(14px+0.1dvw)]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20px"
                                fill="currentColor"
                                className="text-(--color-foreground)"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                                    clipRule="evenodd"
                                />
                                <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
                            </svg>
                            今後
                        </div>
                        <TaskItems tasks={homeworks} />

                        <div className="opacity-50 pt-6 pb-4 text-xs">
                            {getRelativeTime(new Date(sent_at))}
                        </div>

                        <button
                            className="link mb-4 mt-2"
                            onClick={async () => {
                                amplitude.track("sign-out", {});

                                await fetch("/api/sign-out", {
                                    method: "POST",
                                    credentials: "include",
                                });

                                window.location.href = "/";
                            }}
                        >
                            ログアウト
                        </button>

                        <div className="opacity-50 pb-8 pt-2 text-xs">
                            v2.3.0
                        </div>
                    </div>
                </main>
            </motion.div>

            <div className="absolute items-center top-0 pointer-events-none left-0 w-full h-dvh overflow-clip">
                <motion.div
                    initial={{ opacity: 1, scale: 1, origin: "top" }}
                    animate={{ opacity: 0, scale: 1.052, origin: "top" }}
                    transition={{ duration: 0.2, delay: 0.0, ease: "easeOut" }}
                    className="w-full h-full"
                >
                    <h1 className="title">RC Pulse</h1>
                    <p className="w-full text-center">Loading…</p>
                </motion.div>
            </div>
        </div>
    );
}
