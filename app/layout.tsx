import "./globals.css";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import AmplitudeInit from "./components/AmplitudeContextProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "RC Pulse",
    description: "",
    openGraph: {
        title: "RC Pulse",
        description: "",
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

const lineSeedJp = localFont({
    src: [
        {
            path: "../public/fonts/LINESeedJP-Bold-Subset.woff2",
            weight: "700",
        },
        {
            path: "../public/fonts/LINESeedJP-Regular-Subset.woff2",
            weight: "400",
        },
    ],
    variable: "--font-line-seed-jp",
    display: "swap",
});

const inter = localFont({
    src: [
        {
            path: "../public/fonts/Inter_28pt-Regular.ttf",
            weight: "400",
        },
        {
            path: "../public/fonts/Inter_18pt-Bold.ttf",
            weight: "700",
        },
    ],
    variable: "--font-inter",
    display: "swap",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="ja"
            className={`${lineSeedJp.variable} ${inter.variable} font-line-seed-jp`}
        >
            <head>
                <meta
                    name="google-site-verification"
                    content="sK35d50mCfyOJ0je-ObGnYTC2H2vFYFXYG_xFuB9gh4"
                />
            </head>
            <body className="flex flex-col items-center">
                {children}
                <Analytics />
                <AmplitudeInit />
            </body>
        </html>
    );
}
