"use client";

import { motion } from "framer-motion";
import { TaskItems } from "./TaskItems";
import * as amplitude from "@amplitude/analytics-browser";
import Shell from "@/components/layout/Shell";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

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
                <main className="justify-center max-w-[min(100%,512px)] flex w-full py-4">
                    <div className="w-full max-w-fit px-4 flex flex-col gap-4">
                        <div className="font-bold cursor-default flex items-center gap-1 text-[calc(14px+0.1dvw)]">
                            <Icon name="clipboardList" />
                            今日
                        </div>
                        <TaskItems tasks={today} />
                        <div className="font-bold flex cursor-default text-[calc(14px+0.1dvw)]">
                            <div className="font-bold w-20 cursor-default flex items-center gap-2 text-[calc(14px+0.1dvw)]">
                                <Icon name="libraryBig" />
                                明日
                            </div>
                            <div className="font-bold w-full justify-end cursor-default flex items-center gap-2 text-[calc(14px+0.1dvw)]">
                                <Icon name="cloudSunRain" />
                                {precipitationChance}%
                            </div>
                        </div>
                        <TaskItems tasks={tomorrow} />
                        <div className="font-bold w-20 cursor-default flex items-center gap-2 text-[calc(14px+0.1dvw)]">
                            <Icon name="newspaper" />
                            今後
                        </div>
                        <TaskItems tasks={homeworks} />

                        <div className="opacity-50 text-xs">
                            {getRelativeTime(new Date(sent_at))}
                        </div>

                        <Button
                            onClick={async () => {
                                amplitude.track("sign-out", {});

                                await fetch("/api/sign-out", {
                                    method: "POST",
                                    credentials: "include",
                                });

                                window.location.href = "/";
                            }}
                            variant="text"
                            iconName="logOut"
                        >
                            ログアウト
                        </Button>

                        <div className="opacity-50 pb-4 text-xs">v2.4.0</div>
                    </div>
                </main>
            </motion.div>

            <div className="absolute flex flex-col items-center top-0 pointer-events-none left-0 w-full h-dvh overflow-clip">
                <motion.div
                    initial={{ opacity: 1, scale: 1, origin: "top" }}
                    animate={{ opacity: 0, scale: 1.052, origin: "top" }}
                    transition={{ duration: 0.2, delay: 0.0, ease: "easeOut" }}
                    className="w-full h-full flex flex-col items-center"
                >
                    <Shell title="RC Pulse" loading={true}>
                        <h2 className="font-bold">RC Pulse</h2>
                    </Shell>
                </motion.div>
            </div>
        </div>
    );
}
