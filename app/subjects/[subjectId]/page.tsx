import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Layers } from "lucide-react";

import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import SubjectIcon from "@/components/SubjectIcon";
import { getSubject, subjects } from "@/lib/catalog";

export function generateStaticParams() {
    return subjects.map((subject) => ({ subjectId: subject.id }));
}

export default async function SubjectPage({
    params,
}: {
    params: Promise<{ subjectId: string }>;
}) {
    const { subjectId } = await params;
    const subject = getSubject(subjectId);

    if (!subject) notFound();

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#f7f7fa] px-4 py-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs
                        items={[
                            { label: "Subjects", href: "/tests" },
                            { label: subject.title },
                        ]}
                    />

                    <div className="mb-8 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0efff]">
                            <SubjectIcon
                                name={subject.icon}
                                className="h-7 w-7 text-[#5b4bdb]"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-[#17171c]">
                                {subject.title}
                            </h1>
                            <p className="mt-1 text-[#697386]">
                                {subject.description}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {subject.sections.map((section) => {
                            const count = section.tests.length;
                            const questionCount = section.tests.reduce(
                                (total, test) => total + test.questions.length,
                                0
                            );

                            const body = (
                                <>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0efff]">
                                            <Layers className="h-5 w-5 text-[#5b4bdb]" />
                                        </div>
                                        {count === 0 && (
                                            <span className="rounded-full bg-[#f5f5f8] px-2.5 py-1 text-xs font-bold text-[#697386]">
                                                Coming soon
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="mt-4 text-lg font-bold text-[#17171c]">
                                        {section.title}
                                    </h2>
                                    <p className="mt-1 flex-1 text-sm leading-6 text-[#697386]">
                                        {section.description}
                                    </p>

                                    {count > 0 && (
                                        <div className="mt-5 flex items-center justify-between text-sm">
                                            <span className="font-semibold text-[#454554]">
                                                {count} {count === 1 ? "test" : "tests"} · {questionCount} questions
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-[#5b4bdb] transition group-hover:translate-x-1" />
                                        </div>
                                    )}
                                </>
                            );

                            return count > 0 ? (
                                <Link
                                    key={section.id}
                                    href={`/subjects/${subject.id}/${section.id}`}
                                    className="group flex flex-col rounded-2xl border border-[#e5e5eb] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#5b4bdb] hover:shadow-md"
                                >
                                    {body}
                                </Link>
                            ) : (
                                <div
                                    key={section.id}
                                    className="flex flex-col rounded-2xl border border-dashed border-[#dedee6] bg-white/60 p-6"
                                >
                                    {body}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </>
    );
}
