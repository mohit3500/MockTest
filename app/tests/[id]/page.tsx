import { notFound } from "next/navigation";

import { getTestById } from "@/lib/all-tests";

import QuizClient from "@/components/QuizClient";
import Navbar from "@/components/Navbar";

export default async function TestPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;

    const test = getTestById(id);

    if (!test) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <QuizClient test={test} />
        </>
    );
}