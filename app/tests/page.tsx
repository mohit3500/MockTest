import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import SubjectIcon from "@/components/SubjectIcon";
import { countSubjectTests, subjects } from "@/lib/catalog";

export default function TestsPage() {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#f7f7fa] px-4 py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-[#17171c]">
                            Subjects
                        </h1>
                        <p className="mt-2 text-[#697386]">
                            Pick a subject, then a section, then start a test.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((subject) => {
                            const testCount = countSubjectTests(subject);

                            return (
                                <Link
                                    key={subject.id}
                                    href={`/subjects/${subject.id}`}
                                    className="group flex flex-col rounded-2xl border border-[#e5e5eb] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#5b4bdb] hover:shadow-md"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0efff]">
                                        <SubjectIcon
                                            name={subject.icon}
                                            className="h-6 w-6 text-[#5b4bdb]"
                                        />
                                    </div>

                                    <h2 className="mt-4 text-xl font-bold text-[#17171c]">
                                        {subject.title}
                                    </h2>

                                    <p className="mt-1 flex-1 text-sm leading-6 text-[#697386]">
                                        {subject.description}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between text-sm">
                                        <span className="font-semibold text-[#454554]">
                                            {subject.sections.length}{" "}
                                            {subject.sections.length === 1 ? "section" : "sections"} ·{" "}
                                            {testCount > 0
                                                ? `${testCount} ${testCount === 1 ? "test" : "tests"}`
                                                : "Coming soon"}
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-[#5b4bdb] transition group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>
        </>
    );
}
