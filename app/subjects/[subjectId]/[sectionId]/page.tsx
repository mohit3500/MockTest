import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import TestCard from "@/components/TestCard";
import { getSection, subjects } from "@/lib/catalog";

export function generateStaticParams() {
    return subjects.flatMap((subject) =>
        subject.sections.map((section) => ({
            subjectId: subject.id,
            sectionId: section.id,
        }))
    );
}

export default async function SectionPage({
    params,
}: {
    params: Promise<{ subjectId: string; sectionId: string }>;
}) {
    const { subjectId, sectionId } = await params;
    const found = getSection(subjectId, sectionId);

    if (!found) notFound();

    const { subject, section } = found;

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#f7f7fa] px-4 py-8">
                <div className="mx-auto max-w-7xl">
                    <Breadcrumbs
                        items={[
                            { label: "Subjects", href: "/tests" },
                            { label: subject.title, href: `/subjects/${subject.id}` },
                            { label: section.title },
                        ]}
                    />

                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-[#17171c]">
                            {section.title}
                        </h1>
                        <p className="mt-2 text-[#697386]">
                            {section.description}
                        </p>
                    </div>

                    {section.tests.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#dedee6] bg-white p-10 text-center text-[#697386]">
                            Tests for this section are coming soon.
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {section.tests.map((test) => (
                                <TestCard key={test.id} test={test} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
