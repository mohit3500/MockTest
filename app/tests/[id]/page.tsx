import { notFound } from "next/navigation";
import { getTest } from "@/lib/History1-8";
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

    const test = getTest(id);

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