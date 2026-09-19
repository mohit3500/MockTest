import { notFound } from "next/navigation";

import { getTest } from "@/lib/tests";

import QuizClient from "@/components/QuizClient";

export default async function TestPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;

    const test = getTest(id);

    if (!test) {
        notFound();
    }

    return (
        <QuizClient test={test} />
    );
}