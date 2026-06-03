export default function NotFound() {
    return (
        <main className="flex flex-col items-center">
            <h1 className="text-4xl my-8 font-semibold">404</h1>
            <p>This page could not be found.</p>
            <a href="/" className="link mt-4">
                Home
            </a>
        </main>
    );
}
