import Link from "next/link";
import {
  ArrowRight,
  FileText,
} from "lucide-react";

export default function HomePage() {
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
            href="/tests"
            className="rounded-xl bg-[#5b4bdb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4939c5]"
          >
            Tests
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eeecff] text-[#5b4bdb]">
            <FileText size={28} />
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Practice.
            <br />

            Submit.

            <span className="text-[#5b4bdb]">
              {" "}Learn.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#697386] sm:text-lg">
            Choose a test, attempt the questions,
            submit your answers and immediately
            check your score, correct answers and
            complete solutions.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/tests"
              className="inline-flex items-center gap-2 rounded-xl bg-[#5b4bdb] px-6 py-3.5 font-semibold text-white hover:bg-[#4939c5]"
            >
              Explore Tests

              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-5 sm:grid-cols-3">

          <Feature
            number="01"
            title="Choose a Test"
            description="Pick any mock test from the tests page."
          />

          <Feature
            number="02"
            title="Attempt"
            description="Answer questions one by one with an optional timer."
          />

          <Feature
            number="03"
            title="Check Solutions"
            description="See your marks, correct answers and explanations."
          />

        </div>
      </section>
    </main>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="card p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0efff] text-sm font-bold text-[#5b4bdb]">
        {number}
      </div>

      <h2 className="font-bold">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#697386]">
        {description}
      </p>
    </div>
  );
}