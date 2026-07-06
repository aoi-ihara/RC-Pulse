import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex flex-col items-center">
            <h1 className="text-4xl my-8 font-semibold">404</h1>
            <p>This page could not be found.</p>
            <Link href="/" className="link mt-4">
                Home
            </Link>
        </main>
    );
}
