"use client";

import Link from "next/link";
import {
    BookOpen,
    CheckCircle2,
    Clock3,
    Lock,
} from "lucide-react";

import type { Test } from "@/lib/types";
import { useTestAccess } from "@/components/useTestAccess";
import RazorpayCheckout from "@/components/RazorpayCheckout";

interface TestCardProps {
    test: Test;
}

export default function TestCard({
    test,
}: TestCardProps) {
    const {
        hasAccess,
        authenticated,
        checking,
        refreshAccess,
    } = useTestAccess(test.id);

    const isPaid = test.isPaid === true;
    const price = test.price ?? 0;

    const totalSeconds = Math.round(
        test.questions.length * 30
    );

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;

    const durationText =
        hours > 0
            ? `${hours} hr ${minutes} min ${seconds} sec`
            : `${minutes} min ${seconds} sec`;

    if (checking) {
        return (
            <div className="rounded-2xl border border-[#e5e5eb] bg-white p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-5 w-2/3 rounded bg-[#eeeeF2]" />
                    <div className="mt-3 h-4 w-full rounded bg-[#eeeeF2]" />
                    <div className="mt-2 h-4 w-3/4 rounded bg-[#eeeeF2]" />
                    <div className="mt-6 h-11 w-full rounded-xl bg-[#eeeeF2]" />
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-[#e5e5eb] bg-white shadow-sm">
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0efff]">
                                <BookOpen className="h-5 w-5 text-[#5b4bdb]" />
                            </div>

                            {isPaid && (
                                <span className="rounded-full bg-[#fff7ed] px-2.5 py-1 text-xs font-bold text-orange-600">
                                    Premium
                                </span>
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-[#17171c]">
                            {test.title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#697386]">
                            {test.description}
                        </p>
                    </div>

                    {isPaid && !hasAccess && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed]">
                            <Lock className="h-5 w-5 text-orange-500" />
                        </div>
                    )}

                    {isPaid && hasAccess && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                    )}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-[#f8f8fa] p-3">
                        <p className="text-xs text-[#697386]">
                            Questions
                        </p>
                        <p className="mt-1 font-bold text-[#17171c]">
                            {test.questions.length}
                        </p>
                    </div>

                    <div className="rounded-xl bg-[#f8f8fa] p-3">
                        <p className="text-xs text-[#697386]">
                            Duration
                        </p>
                        <p className="mt-1 font-bold text-[#17171c]">
                            {durationText}
                        </p>
                    </div>

                    <div className="rounded-xl bg-[#f8f8fa] p-3">
                        <p className="text-xs text-[#697386]">
                            Correct
                        </p>
                        <p className="mt-1 font-bold text-green-600">
                            +1
                        </p>
                    </div>

                    <div className="rounded-xl bg-[#f8f8fa] p-3">
                        <p className="text-xs text-[#697386]">
                            Wrong
                        </p>
                        <p className="mt-1 font-bold text-red-500">
                            -0.25
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    {!isPaid || hasAccess ? (
                        <Link
                            href={`/tests/${test.id}`}
                            className="flex w-full items-center justify-center rounded-xl bg-[#5b4bdb] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#4939c5]"
                        >
                            <Clock3 className="mr-2 h-4 w-4" />
                            Start Test
                        </Link>
                    ) : !authenticated ? (
                        <Link
                            href={`/login?redirect=/tests/${test.id}`}
                            className="flex w-full items-center justify-center rounded-xl bg-[#5b4bdb] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#4939c5]"
                        >
                            Login to Unlock
                        </Link>
                    ) : (
                        <div>
                            <RazorpayCheckout
                                testId={test.id}
                                testTitle={test.title}
                                price={price}
                                onSuccess={refreshAccess}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}