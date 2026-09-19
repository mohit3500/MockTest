import Link from "next/link";

import {
    ArrowRight,
    Clock3,
    FileQuestion,
} from "lucide-react";

import { INDIAN_HISTORY_FIRST_8_CHAPTERS } from "@/lib/History1-8";

export default function TestsPage() {
    const test = INDIAN_HISTORY_FIRST_8_CHAPTERS;

    const totalQuestions = test.questions.length;

    // 30 seconds per question
    const totalSeconds = totalQuestions * 30;

    const hours = Math.floor(
        totalSeconds / 3600
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;

    let durationText = "";

    if (hours > 0) {
        durationText += `${hours} hr`;
    }

    if (minutes > 0) {
        durationText += `${durationText ? " " : ""
            }${minutes} min`;
    }

    if (seconds > 0) {
        durationText += `${durationText ? " " : ""
            }${seconds} sec`;
    }

    return (
        <main>

            {/* Header */}
            <header className="border-b bg-white">
                <div className="container-page flex h-16 items-center justify-between">

                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tight"
                    >
                        Quiz
                        <span className="text-[#5b4bdb]">
                            Simulator
                        </span>
                    </Link>

                    <Link
                        href="/"
                        className="text-sm text-[#697386]"
                    >
                        Home
                    </Link>

                </div>
            </header>

            {/* Tests */}
            <section className="container-page py-10 sm:py-14">

                <p className="text-sm font-semibold text-[#5b4bdb]">
                    AVAILABLE TEST
                </p>

                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                    Choose your test
                </h1>

                <p className="mt-3 text-[#697386]">
                    Select a test below and start attempting
                    the questions.
                </p>

                {/* Test Grid */}
                <div className="mt-8 grid gap-5 md:grid-cols-2">

                    <article
                        key={test.id}
                        className="card p-6"
                    >

                        {/* Top */}
                        <div className="flex items-start justify-between">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0efff] text-[#5b4bdb]">
                                <FileQuestion size={23} />
                            </div>

                            <span className="rounded-full bg-[#f2f3f7] px-3 py-1 text-xs font-semibold text-[#697386]">
                                {test.category}
                            </span>

                        </div>

                        {/* Title */}
                        <h2 className="mt-5 text-xl font-bold">
                            {test.title}
                        </h2>

                        {/* Description */}
                        <p className="mt-2 text-sm leading-6 text-[#697386]">
                            {test.description}
                        </p>

                        {/* Test Information */}
                        <div className="mt-5 flex flex-wrap gap-5 text-sm text-[#697386]">

                            {/* Questions */}
                            <span className="inline-flex items-center gap-1.5">
                                <FileQuestion size={16} />

                                {totalQuestions}
                                {" "}
                                Questions
                            </span>

                            {/* Duration */}
                            <span className="inline-flex items-center gap-1.5">
                                <Clock3 size={16} />

                                {durationText}
                            </span>

                        </div>

                        {/* Marking Scheme */}
                        <div className="mt-5 grid grid-cols-3 gap-2">

                            <div className="rounded-lg bg-[#f0fdf4] px-3 py-2 text-center">
                                <p className="text-sm font-bold text-green-700">
                                    +1
                                </p>

                                <p className="text-[11px] text-green-700">
                                    Correct
                                </p>
                            </div>

                            <div className="rounded-lg bg-[#fef2f2] px-3 py-2 text-center">
                                <p className="text-sm font-bold text-red-700">
                                    -0.25
                                </p>

                                <p className="text-[11px] text-red-700">
                                    Wrong
                                </p>
                            </div>

                            <div className="rounded-lg bg-[#f3f4f6] px-3 py-2 text-center">
                                <p className="text-sm font-bold text-gray-700">
                                    0
                                </p>

                                <p className="text-[11px] text-gray-600">
                                    Unattempted
                                </p>
                            </div>

                        </div>

                        {/* Timer Information */}
                        <div className="mt-4 rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-3">

                            <div className="flex items-center gap-2">

                                <Clock3
                                    size={16}
                                    className="text-[#5b4bdb]"
                                />

                                <span className="text-sm font-semibold text-[#374151]">
                                    30 seconds per question
                                </span>

                            </div>

                            <p className="mt-1 pl-6 text-xs text-[#697386]">
                                Total time: {durationText}
                            </p>

                        </div>

                        {/* Start Test */}
                        <Link
                            href={`/tests/${test.id}`}
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b4bdb] px-5 py-3 font-semibold text-white transition hover:bg-[#4939c5]"
                        >
                            Start Test

                            <ArrowRight size={18} />
                        </Link>

                    </article>

                </div>

            </section>

        </main>
    );
}