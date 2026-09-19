import Link from "next/link";

import {
    ArrowRight,
    Clock3,
    FileQuestion,
} from "lucide-react";

import { tests } from "@/lib/tests";

export default function TestsPage() {
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
                    AVAILABLE TESTS
                </p>

                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                    Choose your test
                </h1>

                <p className="mt-3 text-[#697386]">
                    Select a test below and start attempting
                    the questions.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">

                    {tests.map((test) => (
                        <article
                            key={test.id}
                            className="card p-6"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0efff] text-[#5b4bdb]">
                                    <FileQuestion size={23} />
                                </div>

                                <span className="rounded-full bg-[#f2f3f7] px-3 py-1 text-xs font-semibold text-[#697386]">
                                    {test.category}
                                </span>

                            </div>

                            <h2 className="mt-5 text-xl font-bold">
                                {test.title}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#697386]">
                                {test.description}
                            </p>

                            <div className="mt-5 flex gap-5 text-sm text-[#697386]">

                                <span className="inline-flex items-center gap-1.5">
                                    <FileQuestion size={16} />
                                    {test.questions.length}
                                    {" "}Questions
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                    <Clock3 size={16} />
                                    {test.durationMinutes}
                                    {" "}Minutes
                                </span>

                            </div>

                            <Link
                                href={`/tests/${test.id}`}
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b4bdb] px-5 py-3 font-semibold text-white hover:bg-[#4939c5]"
                            >
                                Start Test

                                <ArrowRight size={18} />
                            </Link>

                        </article>
                    ))}

                </div>
            </section>
        </main>
    );
}