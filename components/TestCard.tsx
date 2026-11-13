import Link from "next/link";
import { BookOpen, Clock3 } from "lucide-react";

import type { Test } from "@/lib/types";

interface TestCardProps {
    test: Test;
}

export default function TestCard({ test }: TestCardProps) {
    const totalSeconds = Math.round(test.questions.length * 30);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const durationText =
        hours > 0
            ? `${hours} hr ${minutes} min ${seconds} sec`
            : `${minutes} min ${seconds} sec`;

    return (
        <div className="overflow-hidden rounded-2xl border border-[#e5e5eb] bg-white shadow-sm">
            <div className="p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0efff]">
                    <BookOpen className="h-5 w-5 text-[#5b4bdb]" />
                </div>

                <h2 className="text-xl font-bold text-[#17171c]">
                    {test.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#697386]">
                    {test.description}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Stat label="Questions" value={String(test.questions.length)} />
                    <Stat label="Duration" value={durationText} />
                    <Stat label="Correct" value="+1" className="text-green-600" />
                    <Stat label="Wrong" value="-0.25" className="text-red-500" />
                </div>

                <Link
                    href={`/tests/${test.id}`}
                    className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#5b4bdb] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#4939c5]"
                >
                    <Clock3 className="mr-2 h-4 w-4" />
                    Start Test
                </Link>
            </div>
        </div>
    );
}

function Stat({
    label,
    value,
    className = "text-[#17171c]",
}: {
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className="rounded-xl bg-[#f8f8fa] p-3">
            <p className="text-xs text-[#697386]">{label}</p>
            <p className={`mt-1 font-bold ${className}`}>{value}</p>
        </div>
    );
}
