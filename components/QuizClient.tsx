"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock3,
    RotateCcw,
    Send,
    XCircle,
} from "lucide-react";

import type { Test } from "@/lib/types";

type QuizMode = "attempt" | "review" | "result";

interface QuizClientProps {
    test: Test;
}

const SECONDS_PER_QUESTION = 30;

export default function QuizClient({ test }: QuizClientProps) {
    const totalTestSeconds =
        test.questions.length * SECONDS_PER_QUESTION;

    const [mode, setMode] = useState<QuizMode>("attempt");
    const [secondsLeft, setSecondsLeft] =
        useState(totalTestSeconds);

    const [answers, setAnswers] = useState<(number | null)[]>(
        () => test.questions.map(() => null)
    );

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [expandedQuestion, setExpandedQuestion] =
        useState<number | null>(null);

    /*
     * ---------------------------------------------------------
     * TIMER
     * ---------------------------------------------------------
     */

    useEffect(() => {
        if (mode !== "attempt") return;

        if (secondsLeft <= 0) {
            setMode("review");
            return;
        }

        const timer = window.setInterval(() => {
            setSecondsLeft((previous) => {
                if (previous <= 1) {
                    window.clearInterval(timer);
                    return 0;
                }

                return previous - 1;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [mode, secondsLeft]);

    /*
     * ---------------------------------------------------------
     * FORMAT TIMER
     * ---------------------------------------------------------
     */

    const formattedTime = useMemo(() => {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;

        if (hours > 0) {
            return `${String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "0")}:${String(seconds).padStart(
                2,
                "0"
            )}`;
        }

        return `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;
    }, [secondsLeft]);

    /*
     * ---------------------------------------------------------
     * ANSWER HELPERS
     * ---------------------------------------------------------
     */

    const handleAnswer = (optionIndex: number) => {
        if (mode !== "attempt") return;

        setAnswers((previous) => {
            const updated = [...previous];
            updated[currentQuestion] = optionIndex;
            return updated;
        });
    };

    const answeredCount = answers.filter(
        (answer) => answer !== null
    ).length;

    const unansweredCount =
        test.questions.length - answeredCount;

    /*
     * ---------------------------------------------------------
     * NAVIGATION
     * ---------------------------------------------------------
     */

    const handlePrevious = () => {
        setCurrentQuestion((previous) =>
            Math.max(previous - 1, 0)
        );
    };

    const handleNext = () => {
        setCurrentQuestion((previous) =>
            Math.min(
                previous + 1,
                test.questions.length - 1
            )
        );
    };

    /*
     * ---------------------------------------------------------
     * CONTINUE TEST
     * ---------------------------------------------------------
     *
     * Continue Test takes the user back from the review
     * screen to the test.
     */

    const handleContinue = () => {
        setMode("attempt");
    };

    /*
     * ---------------------------------------------------------
     * SUBMIT TEST
     * ---------------------------------------------------------
     */

    const handleSubmit = () => {
        setMode("review");
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleConfirmSubmit = () => {
        setMode("result");
        setExpandedQuestion(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
     * ---------------------------------------------------------
     * RESTART TEST
     * ---------------------------------------------------------
     */

    const handleRestart = () => {
        setAnswers(test.questions.map(() => null));
        setCurrentQuestion(0);
        setSecondsLeft(totalTestSeconds);
        setExpandedQuestion(null);
        setMode("attempt");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
     * ---------------------------------------------------------
     * SCORE
     * +1 correct
     * -0.25 wrong
     * 0 unattempted
     * ---------------------------------------------------------
     */

    const score = useMemo(() => {
        return test.questions.reduce(
            (total, question, index) => {
                const userAnswer = answers[index];

                if (userAnswer === null) {
                    return total;
                }

                if (
                    userAnswer === question.correctAnswer
                ) {
                    return total + 1;
                }

                return total - 0.25;
            },
            0
        );
    }, [answers, test.questions]);

    const correctCount = useMemo(() => {
        return test.questions.reduce(
            (total, question, index) => {
                if (
                    answers[index] !== null &&
                    answers[index] === question.correctAnswer
                ) {
                    return total + 1;
                }

                return total;
            },
            0
        );
    }, [answers, test.questions]);

    const wrongCount = useMemo(() => {
        return test.questions.reduce(
            (total, question, index) => {
                if (
                    answers[index] !== null &&
                    answers[index] !== question.correctAnswer
                ) {
                    return total + 1;
                }

                return total;
            },
            0
        );
    }, [answers, test.questions]);

    const attemptedCount = correctCount + wrongCount;

    const percentage =
        test.questions.length > 0
            ? (score / test.questions.length) * 100
            : 0;

    /*
     * ---------------------------------------------------------
     * CURRENT QUESTION
     * ---------------------------------------------------------
     */

    const question = test.questions[currentQuestion];

    /*
     * ---------------------------------------------------------
     * ATTEMPT MODE
     * ---------------------------------------------------------
     */

    if (mode === "attempt") {
        return (
            <main className="min-h-screen bg-[#f7f7fa]">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b bg-white">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div>
                            <h1 className="text-base font-bold text-[#17171c] sm:text-lg">
                                {test.title}
                            </h1>

                            <p className="hidden text-xs text-[#697386] sm:block">
                                {answeredCount} of{" "}
                                {test.questions.length} answered
                            </p>
                        </div>

                        <div
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${secondsLeft <= 60
                                    ? "bg-red-50 text-red-600"
                                    : "bg-[#f0efff] text-[#5b4bdb]"
                                }`}
                        >
                            <Clock3 size={18} />

                            <span>{formattedTime}</span>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
                    {/* =================================================
                        TOP ACTION BAR
                    ================================================= */}

                    <div className="sticky top-16 z-30 mb-5 rounded-2xl border border-[#e5e5eb] bg-white/95 p-3 shadow-sm backdrop-blur-md sm:top-16 sm:p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {/* Question Counter */}
                            <div className="flex items-center justify-between sm:justify-start">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#697386]">
                                        Current Question
                                    </p>

                                    <p className="mt-0.5 text-sm font-bold text-[#17171c]">
                                        Question{" "}
                                        {currentQuestion + 1}{" "}
                                        of{" "}
                                        {test.questions.length}
                                    </p>
                                </div>

                                <div className="ml-auto rounded-lg bg-[#f5f5f8] px-3 py-1.5 text-xs font-semibold text-[#697386] sm:hidden">
                                    {answeredCount}/
                                    {test.questions.length}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex w-full gap-2 sm:w-auto">
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    disabled={
                                        currentQuestion === 0
                                    }
                                    className="quiz-action-btn flex-1 border border-[#dedee6] bg-white text-[#454554] hover:bg-[#f7f7fa] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                                >
                                    <ArrowLeft size={17} />
                                    <span>Previous</span>
                                </button>

                                {currentQuestion <
                                    test.questions.length -
                                    1 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="quiz-action-btn flex-1 bg-[#5b4bdb] text-white hover:bg-[#4939c5] sm:flex-none"
                                    >
                                        <span>
                                            Next Question
                                        </span>
                                        <ArrowRight
                                            size={17}
                                        />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="quiz-action-btn flex-1 bg-[#5b4bdb] text-white hover:bg-[#4939c5] sm:flex-none"
                                    >
                                        <Send size={17} />
                                        <span>
                                            Submit Test
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        QUESTION AREA
                    ================================================= */}

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                        <section>
                            <article className="rounded-2xl border border-[#e5e5eb] bg-white p-5 shadow-sm sm:p-7">
                                {/* Question Number */}
                                <div className="mb-5 flex items-center justify-between">
                                    <span className="rounded-lg bg-[#f0efff] px-3 py-1.5 text-xs font-bold text-[#5b4bdb]">
                                        Question{" "}
                                        {currentQuestion + 1}
                                    </span>

                                    <span className="text-xs font-medium text-[#697386]">
                                        +1 Correct · -0.25
                                        Wrong
                                    </span>
                                </div>

                                {/* Question */}
                                <h2 className="text-lg font-bold leading-8 text-[#17171c] sm:text-xl">
                                    {question.question}
                                </h2>

                                {/* Options */}
                                <div className="mt-7 space-y-3">
                                    {question.options.map(
                                        (
                                            option,
                                            optionIndex
                                        ) => {
                                            const selected =
                                                answers[
                                                currentQuestion
                                                ] ===
                                                optionIndex;

                                            return (
                                                <button
                                                    key={
                                                        optionIndex
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleAnswer(
                                                            optionIndex
                                                        )
                                                    }
                                                    className={`flex min-h-[58px] w-full items-center gap-4 rounded-xl border p-4 text-left transition ${selected
                                                            ? "border-[#5b4bdb] bg-[#f0efff] text-[#5b4bdb]"
                                                            : "border-[#e3e3e9] bg-white text-[#30303a] hover:border-[#c8c5f5] hover:bg-[#fafaff]"
                                                        }`}
                                                >
                                                    <span
                                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${selected
                                                                ? "border-[#5b4bdb] bg-[#5b4bdb] text-white"
                                                                : "border-[#d8d8e0] bg-white text-[#697386]"
                                                            }`}
                                                    >
                                                        {String.fromCharCode(
                                                            65 +
                                                            optionIndex
                                                        )}
                                                    </span>

                                                    <span className="text-sm font-medium leading-6 sm:text-base">
                                                        {option}
                                                    </span>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>

                                {/* Bottom Navigation */}
                                <div className="mt-8 flex items-center justify-between border-t border-[#eeeeF2] pt-5">
                                    <button
                                        type="button"
                                        onClick={
                                            handlePrevious
                                        }
                                        disabled={
                                            currentQuestion ===
                                            0
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-[#dedee6] bg-white px-4 py-2.5 text-sm font-semibold text-[#454554] transition hover:bg-[#f7f7fa] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ArrowLeft
                                            size={17}
                                        />
                                        Previous
                                    </button>

                                    {currentQuestion <
                                        test.questions.length -
                                        1 ? (
                                        <button
                                            type="button"
                                            onClick={
                                                handleNext
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#5b4bdb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4939c5]"
                                        >
                                            Next
                                            <ArrowRight
                                                size={17}
                                            />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={
                                                handleSubmit
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#5b4bdb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4939c5]"
                                        >
                                            <Send
                                                size={17}
                                            />
                                            Submit Test
                                        </button>
                                    )}
                                </div>
                            </article>
                        </section>

                        {/* =================================================
                            QUESTION NAVIGATOR
                        ================================================= */}

                        <aside className="hidden lg:block">
                            <div className="sticky top-36 rounded-2xl border border-[#e5e5eb] bg-white p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-[#17171c]">
                                    Questions
                                </h3>

                                <div className="mt-3 grid grid-cols-5 gap-2">
                                    {test.questions.map(
                                        (_, index) => {
                                            const answered =
                                                answers[
                                                index
                                                ] !== null;

                                            const active =
                                                currentQuestion ===
                                                index;

                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() =>
                                                        setCurrentQuestion(
                                                            index
                                                        )
                                                    }
                                                    className={`h-9 rounded-lg text-xs font-semibold transition ${active
                                                            ? "bg-[#5b4bdb] text-white"
                                                            : answered
                                                                ? "bg-[#e8e5ff] text-[#5b4bdb]"
                                                                : "bg-[#f3f3f6] text-[#697386] hover:bg-[#e9e9ee]"
                                                        }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>

                                <div className="mt-5 space-y-2 border-t border-[#eeeeF2] pt-4 text-xs text-[#697386]">
                                    <div className="flex items-center justify-between">
                                        <span>
                                            Answered
                                        </span>

                                        <span className="font-bold text-[#5b4bdb]">
                                            {answeredCount}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span>
                                            Unanswered
                                        </span>

                                        <span className="font-bold text-[#697386]">
                                            {unansweredCount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * =========================================================
     * REVIEW MODE
     * =========================================================
     */

    if (mode === "review") {
        return (
            <main className="min-h-screen bg-[#f7f7fa]">
                <header className="sticky top-0 z-40 border-b bg-white">
                    <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                        <div>
                            <h1 className="text-base font-bold text-[#17171c] sm:text-lg">
                                Review Test
                            </h1>

                            <p className="text-xs text-[#697386]">
                                Check your answers before
                                submitting
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#f0efff] px-4 py-2 text-sm font-bold text-[#5b4bdb]">
                            {answeredCount}/
                            {test.questions.length} Answered
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
                    {/* TOP REVIEW ACTIONS */}
                    <div className="sticky top-16 z-30 mb-5 rounded-2xl border border-[#e5e5eb] bg-white/95 p-3 shadow-sm backdrop-blur-md sm:p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-bold text-[#17171c]">
                                    Ready to submit?
                                </p>

                                <p className="mt-1 text-xs text-[#697386]">
                                    You can continue the test or
                                    submit it now.
                                </p>
                            </div>

                            <div className="flex w-full gap-2 sm:w-auto">
                                <button
                                    type="button"
                                    onClick={
                                        handleContinue
                                    }
                                    className="quiz-action-btn flex-1 border border-[#dedee6] bg-white text-[#454554] hover:bg-[#f7f7fa] sm:flex-none"
                                >
                                    <ArrowLeft
                                        size={17}
                                    />
                                    Continue Test
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleConfirmSubmit
                                    }
                                    className="quiz-action-btn flex-1 bg-[#5b4bdb] text-white hover:bg-[#4939c5] sm:flex-none"
                                >
                                    <Send size={17} />
                                    Submit Test
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Review Summary */}
                    <div className="mb-6 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-[#e5e5eb] bg-white p-4">
                            <p className="text-xs text-[#697386]">
                                Answered
                            </p>
                            <p className="mt-1 text-2xl font-bold text-[#5b4bdb]">
                                {answeredCount}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#e5e5eb] bg-white p-4">
                            <p className="text-xs text-[#697386]">
                                Unanswered
                            </p>
                            <p className="mt-1 text-2xl font-bold text-[#697386]">
                                {unansweredCount}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#e5e5eb] bg-white p-4">
                            <p className="text-xs text-[#697386]">
                                Total
                            </p>
                            <p className="mt-1 text-2xl font-bold text-[#17171c]">
                                {test.questions.length}
                            </p>
                        </div>
                    </div>

                    {/* Review Questions */}
                    <div className="space-y-4">
                        {test.questions.map(
                            (reviewQuestion, index) => {
                                const answer =
                                    answers[index];

                                return (
                                    <button
                                        key={
                                            reviewQuestion.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            setCurrentQuestion(
                                                index
                                            )
                                        }
                                        className="w-full rounded-2xl border border-[#e5e5eb] bg-white p-5 text-left shadow-sm transition hover:border-[#c9c6f5] hover:shadow-md"
                                    >
                                        <div className="flex items-start gap-4">
                                            <span
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${answer !==
                                                        null
                                                        ? "bg-[#f0efff] text-[#5b4bdb]"
                                                        : "bg-[#f3f3f6] text-[#697386]"
                                                    }`}
                                            >
                                                {index + 1}
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold leading-6 text-[#17171c]">
                                                    {
                                                        reviewQuestion.question
                                                    }
                                                </p>

                                                <p className="mt-2 text-xs text-[#697386]">
                                                    {answer !==
                                                        null
                                                        ? `Your answer: ${reviewQuestion
                                                            .options[
                                                        answer
                                                        ]
                                                        }`
                                                        : "Not attempted"}
                                                </p>
                                            </div>

                                            {answer !==
                                                null ? (
                                                <CheckCircle2
                                                    size={
                                                        20
                                                    }
                                                    className="shrink-0 text-[#5b4bdb]"
                                                />
                                            ) : (
                                                <Clock3
                                                    size={
                                                        20
                                                    }
                                                    className="shrink-0 text-[#9a9aa6]"
                                                />
                                            )}
                                        </div>
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>
            </main>
        );
    }

    /*
     * =========================================================
     * RESULT MODE
     * =========================================================
     */

    return (
        <main className="min-h-screen bg-[#f7f7fa]">
            <header className="border-b bg-white">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                    <div>
                        <h1 className="text-base font-bold text-[#17171c] sm:text-lg">
                            Test Result
                        </h1>

                        <p className="text-xs text-[#697386]">
                            {test.title}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRestart}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#dedee6] bg-white px-4 py-2 text-sm font-semibold text-[#454554] hover:bg-[#f7f7fa]"
                    >
                        <RotateCcw size={16} />
                        Restart
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
                {/* Score */}
                <section className="rounded-2xl border border-[#e5e5eb] bg-white p-6 text-center shadow-sm sm:p-10">
                    <p className="text-sm font-semibold text-[#697386]">
                        Your Score
                    </p>

                    <p className="mt-2 text-5xl font-bold text-[#5b4bdb] sm:text-6xl">
                        {Number.isInteger(score)
                            ? score
                            : score.toFixed(2)}
                    </p>

                    <p className="mt-2 text-sm text-[#697386]">
                        out of {test.questions.length}
                    </p>

                    <div className="mx-auto mt-5 h-3 max-w-md overflow-hidden rounded-full bg-[#eeeeF3]">
                        <div
                            className="h-full rounded-full bg-[#5b4bdb]"
                            style={{
                                width: `${Math.max(
                                    0,
                                    Math.min(
                                        percentage,
                                        100
                                    )
                                )}%`,
                            }}
                        />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#454554]">
                        {percentage.toFixed(2)}%
                    </p>
                </section>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-[#e5e5eb] bg-white p-5">
                        <CheckCircle2
                            size={20}
                            className="text-green-600"
                        />

                        <p className="mt-3 text-xs text-[#697386]">
                            Correct
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#17171c]">
                            {correctCount}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#e5e5eb] bg-white p-5">
                        <XCircle
                            size={20}
                            className="text-red-500"
                        />

                        <p className="mt-3 text-xs text-[#697386]">
                            Wrong
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#17171c]">
                            {wrongCount}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#e5e5eb] bg-white p-5">
                        <Clock3
                            size={20}
                            className="text-[#697386]"
                        />

                        <p className="mt-3 text-xs text-[#697386]">
                            Unattempted
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#17171c]">
                            {test.questions.length -
                                attemptedCount}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#e5e5eb] bg-white p-5">
                        <CheckCircle2
                            size={20}
                            className="text-[#5b4bdb]"
                        />

                        <p className="mt-3 text-xs text-[#697386]">
                            Attempted
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#17171c]">
                            {attemptedCount}
                        </p>
                    </div>
                </div>

                {/* Solutions */}
                <section className="mt-8">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-[#17171c]">
                            Solutions
                        </h2>

                        <p className="mt-1 text-sm text-[#697386]">
                            Click any question to view your
                            answer, correct answer and
                            explanation.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {test.questions.map(
                            (resultQuestion, index) => {
                                const userAnswer =
                                    answers[index];

                                const isCorrect =
                                    userAnswer !== null &&
                                    userAnswer ===
                                    resultQuestion.correctAnswer;

                                const isWrong =
                                    userAnswer !== null &&
                                    userAnswer !==
                                    resultQuestion.correctAnswer;

                                const isExpanded =
                                    expandedQuestion ===
                                    index;

                                return (
                                    <div
                                        key={
                                            resultQuestion.id
                                        }
                                        className="overflow-hidden rounded-2xl border border-[#e5e5eb] bg-white"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpandedQuestion(
                                                    isExpanded
                                                        ? null
                                                        : index
                                                )
                                            }
                                            className="flex w-full items-center gap-4 p-5 text-left"
                                        >
                                            <span
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isCorrect
                                                        ? "bg-green-50 text-green-700"
                                                        : isWrong
                                                            ? "bg-red-50 text-red-600"
                                                            : "bg-[#f3f3f6] text-[#697386]"
                                                    }`}
                                            >
                                                {index + 1}
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-semibold leading-6 text-[#17171c]">
                                                    {
                                                        resultQuestion.question
                                                    }
                                                </span>

                                                <span
                                                    className={`mt-1 block text-xs font-semibold ${isCorrect
                                                            ? "text-green-600"
                                                            : isWrong
                                                                ? "text-red-500"
                                                                : "text-[#697386]"
                                                        }`}
                                                >
                                                    {isCorrect
                                                        ? "Correct"
                                                        : isWrong
                                                            ? "Wrong"
                                                            : "Unattempted"}
                                                </span>
                                            </span>

                                            {isExpanded ? (
                                                <ChevronUp
                                                    size={
                                                        20
                                                    }
                                                    className="shrink-0 text-[#697386]"
                                                />
                                            ) : (
                                                <ChevronDown
                                                    size={
                                                        20
                                                    }
                                                    className="shrink-0 text-[#697386]"
                                                />
                                            )}
                                        </button>

                                        {isExpanded && (
                                            <div className="border-t border-[#eeeeF2] px-5 pb-5 pt-4">
                                                {/* Your Answer */}
                                                <div className="mb-4 rounded-xl bg-[#f7f7fa] p-4">
                                                    <p className="text-xs font-bold uppercase tracking-wide text-[#697386]">
                                                        Your
                                                        Answer
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-[#17171c]">
                                                        {userAnswer !==
                                                            null
                                                            ? resultQuestion
                                                                .options[
                                                            userAnswer
                                                            ]
                                                            : "Not attempted"}
                                                    </p>
                                                </div>

                                                {/* Correct Answer */}
                                                <div className="mb-5 rounded-xl bg-green-50 p-4">
                                                    <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                                                        Correct
                                                        Answer
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-green-800">
                                                        {
                                                            resultQuestion
                                                                .options[
                                                            resultQuestion.correctAnswer
                                                            ]
                                                        }
                                                    </p>
                                                </div>

                                                {/* Options */}
                                                <div className="space-y-2">
                                                    {resultQuestion.options.map(
                                                        (
                                                            option,
                                                            optionIndex
                                                        ) => {
                                                            const isAnswer =
                                                                userAnswer ===
                                                                optionIndex;

                                                            const isCorrectOption =
                                                                resultQuestion.correctAnswer ===
                                                                optionIndex;

                                                            let optionClass =
                                                                "border-[#e5e5eb] bg-white";

                                                            if (
                                                                isCorrectOption
                                                            ) {
                                                                optionClass =
                                                                    "border-green-300 bg-green-50";
                                                            } else if (
                                                                isAnswer
                                                            ) {
                                                                optionClass =
                                                                    "border-red-300 bg-red-50";
                                                            }

                                                            return (
                                                                <div
                                                                    key={
                                                                        optionIndex
                                                                    }
                                                                    className={`flex items-center gap-3 rounded-xl border p-3 ${optionClass}`}
                                                                >
                                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                                                                        {String.fromCharCode(
                                                                            65 +
                                                                            optionIndex
                                                                        )}
                                                                    </span>

                                                                    <span className="text-sm font-medium text-[#30303a]">
                                                                        {
                                                                            option
                                                                        }
                                                                    </span>

                                                                    {isCorrectOption && (
                                                                        <CheckCircle2
                                                                            size={
                                                                                18
                                                                            }
                                                                            className="ml-auto shrink-0 text-green-600"
                                                                        />
                                                                    )}

                                                                    {isAnswer &&
                                                                        !isCorrectOption && (
                                                                            <XCircle
                                                                                size={
                                                                                    18
                                                                                }
                                                                                className="ml-auto shrink-0 text-red-500"
                                                                            />
                                                                        )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>

                                                {/* Explanation */}
                                                <div className="mt-5 rounded-xl border border-[#e5e5eb] bg-[#fafafa] p-4">
                                                    <p className="text-xs font-bold uppercase tracking-wide text-[#697386]">
                                                        Explanation
                                                    </p>

                                                    <p className="mt-2 text-sm leading-6 text-[#454554]">
                                                        {
                                                            resultQuestion.explanation
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}