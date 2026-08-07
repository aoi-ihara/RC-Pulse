import type { Metadata } from "next";
import "./globals.css";
import { LINE_Seed_JP, JetBrains_Mono } from "next/font/google";

const lineSeedJp = LINE_Seed_JP({
    subsets: ["latin"],
    weight: ["400", "700", "800"],
    variable: "--font-line-seed-jp",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--jetbrains-mono",
});

export const metadata: Metadata = {
    title: "RC Pulse",
    openGraph: {
        title: "RC Pulse",
        url: "pulse.vgnz93hs.com",
        siteName: "RC Pulse",
    },
    icons: {
        icon: [
            {
                url: "/favicon.png",
                sizes: "any",
                type: "image/png",
            },
        ],
        apple: "/apple-icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body
                className={`${lineSeedJp.variable} ${jetbrainsMono.variable} min-h-full flex flex-col`}
            >
                <main className="flex flex-col h-dvh w-full items-center">
                    {children}
                </main>
            </body>
        </html>
    );
}
