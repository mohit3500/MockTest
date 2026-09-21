import Navbar from "@/components/Navbar";
import TestCard from "@/components/TestCard";
import { allTests } from "@/lib/all-tests";

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
                            Practice, improve your score and track your
                            performance.
                        </p>
                    </div>

                    <div className="mt-2 grid gap-6">
                        {allTests.map((test) => (
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