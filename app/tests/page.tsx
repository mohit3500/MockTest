import Navbar from "@/components/Navbar";
import TestCard from "@/components/TestCard";
import { tests } from "@/lib/History1-8";

export default function TestsPage() {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#f7f7fa] px-4 py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-[#17171c]">
                            Mock Tests
                        </h1>

                        <p className="mt-2 text-[#697386]">
                            Practice, improve your score and track
                            your performance.
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {tests.map((test) => (
                            <TestCard
                                key={test.id}
                                test={test}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}