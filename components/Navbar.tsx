"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
    const router = useRouter();
    const { user, loading } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-[#e5e5eb] bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5b4bdb] text-lg font-extrabold text-white">
                        M
                    </div>

                    <span className="text-lg font-extrabold text-[#17171c]">
                        MockTest
                    </span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {!loading && !user && (
                        <Link
                            href="/login"
                            className="rounded-xl bg-[#5b4bdb] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4939c5]"
                        >
                            Login
                        </Link>
                    )}

                    {!loading && user && (
                        <div className="flex items-center gap-3">
                            <div className="hidden items-center gap-2 sm:flex">
                                {user.photoURL ? (
                                    <Image
                                        src={user.photoURL}
                                        alt={user.displayName || "User"}
                                        width={34}
                                        height={34}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0efff] text-[#5b4bdb]">
                                        <UserIcon className="h-4 w-4" />
                                    </div>
                                )}

                                <span className="max-w-[160px] truncate text-sm font-semibold text-[#17171c]">
                                    {user.displayName || "User"}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-xl border border-[#e5e5eb] px-4 py-2.5 text-sm font-semibold text-[#454554] transition hover:bg-[#f7f7fa]"
                            >
                                <LogOut className="h-4 w-4" />

                                <span className="hidden sm:inline">
                                    Logout
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}