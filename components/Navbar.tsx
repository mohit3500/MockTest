import Link from "next/link";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-[#e5e5eb] bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5b4bdb] text-lg font-extrabold text-white">
                        M
                    </div>
                    <span className="text-lg font-extrabold text-[#17171c]">
                        MockTest
                    </span>
                </Link>

                <Link
                    href="/tests"
                    className="rounded-xl bg-[#5b4bdb] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4939c5]"
                >
                    Subjects
                </Link>
            </div>
        </header>
    );
}
