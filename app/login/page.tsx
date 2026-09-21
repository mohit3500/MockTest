"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    signInWithPopup,
    onAuthStateChanged,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";

import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace("/tests");
            } else {
                setCheckingAuth(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError("");

            await signInWithPopup(auth, googleProvider);

            router.replace("/tests");
        } catch (error: unknown) {
            console.error("Google login error:", error);

            if (
                error &&
                typeof error === "object" &&
                "code" in error
            ) {
                const firebaseError = error as { code: string };

                if (
                    firebaseError.code ===
                    "auth/popup-closed-by-user"
                ) {
                    setError("Login popup was closed.");
                } else if (
                    firebaseError.code ===
                    "auth/popup-blocked"
                ) {
                    setError(
                        "The popup was blocked by your browser. Please allow popups and try again."
                    );
                } else {
                    setError("Unable to login. Please try again.");
                }
            } else {
                setError("Unable to login. Please try again.");
            }

            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f7f7fa]">
                <Loader2 className="h-7 w-7 animate-spin text-[#5b4bdb]" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f7fa] px-4">
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-md">
                    {/* Logo / Brand */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5b4bdb] text-2xl font-extrabold text-white shadow-lg">
                            M
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-[#17171c]">
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-sm text-[#697386]">
                            Login to continue your mock test journey
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-3xl border border-[#e5e5eb] bg-white p-6 shadow-xl sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-[#17171c]">
                                Login
                            </h2>

                            <p className="mt-1 text-sm text-[#697386]">
                                Use your Google account to continue.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#dedee5] bg-white px-5 py-3.5 text-sm font-semibold text-[#17171c] shadow-sm transition hover:bg-[#f8f8fa] hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <FcGoogle className="h-5 w-5" />
                                    Continue with Google
                                </>
                            )}
                        </button>

                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#eeeeF2]" />
                            <span className="text-xs text-[#9a9aa6]">
                                Secure Login
                            </span>
                            <div className="h-px flex-1 bg-[#eeeeF2]" />
                        </div>

                        <p className="text-center text-xs leading-5 text-[#9a9aa6]">
                            By continuing, you agree to use this platform
                            responsibly for test preparation and practice.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="mx-auto mt-6 block text-sm font-semibold text-[#5b4bdb] transition hover:text-[#4939c5]"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </main>
    );
}