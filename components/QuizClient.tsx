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

interface SavedQuizState {
    answers: (number | null)[];
    currentQuestion: number;
    secondsLeft: number;
    mode: QuizMode;
}

interface QuizAttemptResult {
    id: string;
    attemptedAt: string;
    score: number;
    percentage: number;
    correct: number;
    wrong: number;
    unattempted: number;
    attempted: number;
}

const SECONDS_PER_QUESTION = 30;

export default function QuizClient({ test }: QuizClientProps) {
    const totalTestSeconds =
        test.questions.length * SECONDS_PER_QUESTION;

    /*
     * ---------------------------------------------------------
     * LOCAL STORAGE KEYS
     * ---------------------------------------------------------
     *
     * Each test gets its own storage.
     *
     * Example:
     * quiz-progress-indian-history-first-8-chapters
     * quiz-results-indian-history-first-8-chapters
     */

    const progressStorageKey =
        `quiz-progress-${test.id}`;

    const resultsStorageKey =
        `quiz-results-${test.id}`;

    /*
     * ---------------------------------------------------------
     * STATE
     * ---------------------------------------------------------
     */

    const [mode, setMode] =
        useState<QuizMode>("attempt");

    const [secondsLeft, setSecondsLeft] =
        useState(totalTestSeconds);

    const [answers, setAnswers] =
        useState<(number | null)[]>(
            () => test.questions.map(() => null)
        );

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [expandedQuestion, setExpandedQuestion] =
        useState<number | null>(null);

    const [attemptHistory, setAttemptHistory] =
        useState<QuizAttemptResult[]>([]);

    /*
     * This prevents the timer from starting before we restore
     * the saved state from localStorage.
     */
    const [hydrated, setHydrated] =
        useState(false);

    /*
     * ---------------------------------------------------------
     * RESTORE SAVED STATE
     * ---------------------------------------------------------
     */

    useEffect(() => {
        try {
            /*
             * Restore current quiz progress
             */
            const savedProgress =
                window.localStorage.getItem(
                    progressStorageKey
                );

            if (savedProgress) {
                const parsed: SavedQuizState =
                    JSON.parse(savedProgress);

                if (
                    Array.isArray(parsed.answers) &&
                    parsed.answers.length ===
                    test.questions.length
                ) {
                    setAnswers(parsed.answers);
                }

                if (
                    typeof parsed.currentQuestion ===
                    "number"
                ) {
                    setCurrentQuestion(
                        Math.max(
                            0,
                            Math.min(
                                parsed.currentQuestion,
                                test.questions.length - 1
                            )
                        )
                    );
                }

                if (
                    typeof parsed.secondsLeft ===
                    "number"
                ) {
                    setSecondsLeft(
                        Math.max(
                            0,
                            Math.min(
                                parsed.secondsLeft,
                                totalTestSeconds
                            )
                        )
                    );
                }

                if (
                    parsed.mode === "attempt" ||
                    parsed.mode === "review" ||
                    parsed.mode === "result"
                ) {
                    setMode(parsed.mode);
                }
            }

            /*
             * Restore previous attempt history
             */
            const savedResults =
                window.localStorage.getItem(
                    resultsStorageKey
                );

            if (savedResults) {
                const parsedResults =
                    JSON.parse(savedResults);

                if (Array.isArray(parsedResults)) {
                    setAttemptHistory(
                        parsedResults
                    );
                }
            }
        } catch (error) {
            console.error(
                "Unable to restore quiz state:",
                error
            );
        } finally {
            setHydrated(true);
        }
    }, [
        progressStorageKey,
        resultsStorageKey,
        test.questions.length,
        totalTestSeconds,
    ]);

    /*
     * ---------------------------------------------------------
     * SAVE QUIZ PROGRESS
     * ---------------------------------------------------------
     *
     * Every time answers/current question/timer/mode changes,
     * the current state is saved.
     */

    useEffect(() => {
        if (!hydrated) return;

        try {
            const progress: SavedQuizState = {
                answers,
                currentQuestion,
                secondsLeft,
                mode,
            };

            window.localStorage.setItem(
                progressStorageKey,
                JSON.stringify(progress)
            );
        } catch (error) {
            console.error(
                "Unable to save quiz progress:",
                error
            );
        }
    }, [
        answers,
        currentQuestion,
        secondsLeft,
        mode,
        hydrated,
        progressStorageKey,
    ]);

    /*
     * ---------------------------------------------------------
     * TIMER
     * ---------------------------------------------------------
     */

    useEffect(() => {
        if (!hydrated) return;

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

        return () => {
            window.clearInterval(timer);
        };
    }, [
        hydrated,
        mode,
        secondsLeft,
    ]);

    /*
     * ---------------------------------------------------------
     * TIMER FORMAT
     * ---------------------------------------------------------
     */

    const formattedTime = useMemo(() => {
        const hours = Math.floor(
            secondsLeft / 3600
        );

        const minutes = Math.floor(
            (secondsLeft % 3600) / 60
        );

        const seconds = secondsLeft % 60;

        if (hours > 0) {
            return `${String(hours).padStart(
                2,
                "0"
            )}:${String(minutes).padStart(
                2,
                "0"
            )}:${String(seconds).padStart(
                2,
                "0"
            )}`;
        }

        return `${String(minutes).padStart(
            2,
            "0"
        )}:${String(seconds).padStart(
            2,
            "0"
        )}`;
    }, [secondsLeft]);

    /*
     * ---------------------------------------------------------
     * ANSWER COUNTS
     * ---------------------------------------------------------
     */

    const answeredCount = answers.filter(
        (answer) => answer !== null
    ).length;

    const unansweredCount =
        test.questions.length -
        answeredCount;

    /*
     * ---------------------------------------------------------
     * SELECT ANSWER
     * ---------------------------------------------------------
     */

    const handleAnswer = (
        optionIndex: number
    ) => {
        if (mode !== "attempt") return;

        setAnswers((previous) => {
            const updated = [...previous];

            updated[currentQuestion] =
                optionIndex;

            return updated;
        });
    };

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
     */

    const handleContinue = () => {
        setMode("attempt");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
     * ---------------------------------------------------------
     * SUBMIT / REVIEW
     * ---------------------------------------------------------
     */

    const handleSubmit = () => {
        setMode("review");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
     * ---------------------------------------------------------
     * SCORE
     *
     * Correct     = +1
     * Wrong       = -0.25
     * Unattempted = 0
     * ---------------------------------------------------------
     */

    const score = useMemo(() => {
        return test.questions.reduce(
            (total, question, index) => {
                const userAnswer =
                    answers[index];

                if (userAnswer === null) {
                    return total;
                }

                if (
                    userAnswer ===
                    question.correctAnswer
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
                    answers[index] ===
                    question.correctAnswer
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
                    answers[index] !==
                    question.correctAnswer
                ) {
                    return total + 1;
                }

                return total;
            },
            0
        );
    }, [answers, test.questions]);

    const attemptedCount =
        correctCount + wrongCount;

    const percentage =
        test.questions.length > 0
            ? (score /
                test.questions.length) *
            100
            : 0;

    /*
     * ---------------------------------------------------------
     * SAVE RESULT OF CURRENT ATTEMPT
     * ---------------------------------------------------------
     */

    const handleConfirmSubmit = () => {
        const newResult: QuizAttemptResult = {
            id:
                `${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 9)}`,

            attemptedAt:
                new Date().toISOString(),

            score,

            percentage,

            correct: correctCount,

            wrong: wrongCount,

            unattempted:
                test.questions.length -
                attemptedCount,

            attempted: attemptedCount,
        };

        setAttemptHistory((previous) => {
            const updated = [
                newResult,
                ...previous,
            ];

            /*
             * Keep all attempts saved.
             */
            try {
                window.localStorage.setItem(
                    resultsStorageKey,
                    JSON.stringify(updated)
                );
            } catch (error) {
                console.error(
                    "Unable to save result:",
                    error
                );
            }

            return updated;
        });

        setMode("result");
        setExpandedQuestion(null);

        /*
         * The result is now complete.
         * We keep the result mode in progress storage too,
         * so refreshing the page keeps the result visible.
         */

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
     * ---------------------------------------------------------
     * START NEW ATTEMPT
     * ---------------------------------------------------------
     *
     * Previous results remain untouched.
     */

    const handleRestart = () => {
        const emptyAnswers =
            test.questions.map(
                () => null
            );

        setAnswers(emptyAnswers);

        setCurrentQuestion(0);

        setSecondsLeft(
            totalTestSeconds
        );

        setExpandedQuestion(null);

        setMode("attempt");

        /*
         * Immediately save fresh attempt state.
         */
        try {
            const newProgress: SavedQuizState =
            {
                answers: emptyAnswers,
                currentQuestion: 0,
                secondsLeft:
                    totalTestSeconds,
                mode: "attempt",
            };

            window.localStorage.setItem(
                progressStorageKey,
                JSON.stringify(newProgress)
            );
        } catch (error) {
            console.error(
                "Unable to reset quiz:",
                error
            );
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
     * ---------------------------------------------------------
     * CLEAR SAVED CURRENT PROGRESS
     * ---------------------------------------------------------
     *
     * This does NOT delete attempt history.
     */

    const clearCurrentProgress = () => {
        try {
            window.localStorage.removeItem(
                progressStorageKey
            );
        } catch (error) {
            console.error(
                "Unable to clear progress:",
                error
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * FORMAT RESULT DATE
     * ---------------------------------------------------------
     */

    const formatAttemptDate = (
        date: string
    ) => {
        try {
            return new Intl.DateTimeFormat(
                "en-IN",
                {
                    dateStyle: "medium",
                    timeStyle: "short",
                }
            ).format(new Date(date));
        } catch {
            return date;
        }
    };

    /*
     * ---------------------------------------------------------
     * CURRENT QUESTION
     * ---------------------------------------------------------
     */

    const question =
        test.questions[
        currentQuestion
        ];

    /*
     * ---------------------------------------------------------
     * HYDRATION SCREEN
     * ---------------------------------------------------------
     */

    if (!hydrated) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f7f7fa]">
                <div className="rounded-2xl border border-[#e5e5eb] bg-white px-8 py-6 text-center shadow-sm">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#e5e5eb] border-t-[#5b4bdb]" />

                    <p className="mt-4 text-sm font-semibold text-[#454554]">
                        Restoring your test...
                    </p>
                </div>
            </main>
        );
    }

    /*
     * =========================================================
     * ATTEMPT MODE
     * =========================================================
     */

    if (mode === "attempt") {
        return (
            <main className="min-h-screen bg-[#f7f7fa]">
                {/* HEADER */}
                <header className="sticky top-0 z-40 border-b bg-white">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div>
                            <h1 className="text-base font-bold text-[#17171c] sm:text-lg">
                                {test.title}
                            </h1>

                            <p className="hidden text-xs text-[#697386] sm:block">
                                {answeredCount} of{" "}
                                {
                                    test
                                        .questions
                                        .length
                                }{" "}
                                answered
                            </p>
                        </div>

                        <div
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${secondsLeft <=
                                60
                                ? "bg-red-50 text-red-600"
                                : "bg-[#f0efff] text-[#5b4bdb]"
                                }`}
                        >
                            <Clock3
                                size={18}
                            />

                            <span>
                                {
                                    formattedTime
                                }
                            </span>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
                    {/* =================================================
                        STICKY TOP ACTION BAR
                    ================================================= */}

                    <div className="sticky top-16 z-30 mb-5 rounded-2xl border border-[#e5e5eb] bg-white/95 p-3 shadow-sm backdrop-blur-md sm:p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center justify-between sm:justify-start">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#697386]">
                                        Current
                                        Question
                                    </p>

                                    <p className="mt-0.5 text-sm font-bold text-[#17171c]">
                                        Question{" "}
                                        {
                                            currentQuestion +
                                            1
                                        }{" "}
                                        of{" "}
                                        {
                                            test
                                                .questions
                                                .length
                                        }
                                    </p>
                                </div>

                                <div className="ml-auto rounded-lg bg-[#f5f5f8] px-3 py-1.5 text-xs font-semibold text-[#697386] sm:hidden">
                                    {
                                        answeredCount
                                    }
                                    /
                                    {
                                        test
                                            .questions
                                            .length
                                    }
                                </div>
                            </div>

                            <div className="flex w-full gap-2 sm:w-auto">
                                <button
                                    type="button"
                                    onClick={
                                        handlePrevious
                                    }
                                    disabled={
                                        currentQuestion ===
                                        0
                                    }
                                    className="quiz-action-btn flex-1 border border-[#dedee6] bg-white text-[#454554] hover:bg-[#f7f7fa] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                                >
                                    <ArrowLeft
                                        size={17}
                                    />

                                    <span>
                                        Previous
                                    </span>
                                </button>

                                {currentQuestion <
                                    test
                                        .questions
                                        .length -
                                    1 ? (
                                    <button
                                        type="button"
                                        onClick={
                                            handleNext
                                        }
                                        className="quiz-action-btn flex-1 bg-[#5b4bdb] text-white hover:bg-[#4939c5] sm:flex-none"
                                    >
                                        <span>
                                            Next
                                            Question
                                        </span>

                                        <ArrowRight
                                            size={
                                                17
                                            }
                                        />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={
                                            handleSubmit
                                        }
                                        className="quiz-action-btn flex-1 bg-[#5b4bdb] text-white hover:bg-[#4939c5] sm:flex-none"
                                    >
                                        <Send
                                            size={17}
                                        />

                                        <span>
                                            Submit
                                            Test
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* QUESTION + SIDEBAR */}

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                        <section>
                            <article className="rounded-2xl border border-[#e5e5eb] bg-white p-5 shadow-sm sm:p-7">
                                <div className="mb-5 flex items-center justify-between">
                                    <span className="rounded-lg bg-[#f0efff] px-3 py-1.5 text-xs font-bold text-[#5b4bdb]">
                                        Question{" "}
                                        {
                                            currentQuestion +
                                            1
                                        }
                                    </span>

                                    <span className="text-xs font-medium text-[#697386]">
                                        +1 Correct ·
                                        -0.25 Wrong
                                    </span>
                                </div>

                                <h2 className="text-lg font-bold leading-8 text-[#17171c] sm:text-xl">
                                    {
                                        question.question
                                    }
                                </h2>

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
                                                        {
                                                            option
                                                        }
                                                    </span>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>

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
                                        test
                                            .questions
                                            .length -
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
                                                size={
                                                    17
                                                }
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
                                                size={
                                                    17
                                                }
                                            />
                                            Submit
                                            Test
                                        </button>
                                    )}
                                </div>
                            </article>
                        </section>

                        {/* QUESTION NAVIGATOR */}

                        <aside className="hidden lg:block">
                            <div className="sticky top-36 rounded-2xl border border-[#e5e5eb] bg-white p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-[#17171c]">
                                    Questions
                                </h3>

                                <div className="mt-3 grid grid-cols-5 gap-2">
                                    {test.questions.map(
                                        (
                                            _,
                                            index
                                        ) => {
                                            const answered =
                                                answers[
                                                index
                                                ] !==
                                                null;

                                            const active =
                                                currentQuestion ===
                                                index;

                                            return (
                                                <button
                                                    key={
                                                        index
                                                    }
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
                                                    {
                                                        index +
                                                        1
                                                    }
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
                                            {
                                                answeredCount
                                            }
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span>
                                            Unanswered
                                        </span>

                                        <span className="font-bold text-[#697386]">
                                            {
                                                unansweredCount
                                            }
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
                                Check your answers
                                before submitting
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#f0efff] px-4 py-2 text-sm font-bold text-[#5b4bdb]">
                            {
                                answeredCount
                            }
                            /
                            {
                                test.questions
                                    .length
                            }{" "}
                            Answered
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
                    {/* REVIEW ACTIONS */}

                    <div className="sticky top-16 z-30 mb-5 rounded-2xl border border-[#e5e5eb] bg-white/95 p-3 shadow-sm backdrop-blur-md sm:p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-bold text-[#17171c]">
                                    Ready to submit?
                                </p>

                                <p className="mt-1 text-xs text-[#697386]">
                                    Continue the test
                                    or submit it
                                    now.
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

                                    Continue
                                    Test
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleConfirmSubmit
                                    }
                                    className="quiz-action-btn flex-1 bg-[#5b4bdb] text-white hover:bg-[#4939c5] sm:flex-none"
                                >
                                    <Send
                                        size={17}
                                    />

                                    Submit Test
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SUMMARY */}

                    <div className="mb-6 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-[#e5e5eb] bg-white p-4">
                            <p className="text-xs text-[#697386]">
                                Answered
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#5b4bdb]">
                                {
                                    answeredCount
                                }
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#e5e5eb] bg-white p-4">
                            <p className="text-xs text-[#697386]">
                                Unanswered
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#697386]">
                                {
                                    unansweredCount
                                }
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#e5e5eb] bg-white p-4">
                            <p className="text-xs text-[#697386]">
                                Total
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#17171c]">
                                {
                                    test
                                        .questions
                                        .length
                                }
                            </p>
                        </div>
                    </div>

                    {/* QUESTIONS */}

                    <div className="space-y-4">
                        {test.questions.map(
                            (
                                reviewQuestion,
                                index
                            ) => {
                                const answer =
                                    answers[
                                    index
                                    ];

                                return (
                                    <button
                                        key={
                                            reviewQuestion.id
                                        }
                                        type="button"
                                        onClick={() => {
                                            setCurrentQuestion(
                                                index
                                            );

                                            setMode(
                                                "attempt"
                                            );

                                            window.scrollTo(
                                                {
                                                    top: 0,
                                                    behavior:
                                                        "smooth",
                                                }
                                            );
                                        }}
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
                                                {
                                                    index +
                                                    1
                                                }
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
                                                        ? `Your answer: ${reviewQuestion.options[answer]}`
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
                        onClick={
                            handleRestart
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-[#dedee6] bg-white px-4 py-2 text-sm font-semibold text-[#454554] hover:bg-[#f7f7fa]"
                    >
                        <RotateCcw
                            size={16}
                        />

                        New Attempt
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
                {/* CURRENT RESULT */}

                <section className="rounded-2xl border border-[#e5e5eb] bg-white p-6 text-center shadow-sm sm:p-10">
                    <p className="text-sm font-semibold text-[#697386]">
                        Your Score
                    </p>

                    <p className="mt-2 text-5xl font-bold text-[#5b4bdb] sm:text-6xl">
                        {Number.isInteger(
                            score
                        )
                            ? score
                            : score.toFixed(
                                2
                            )}
                    </p>

                    <p className="mt-2 text-sm text-[#697386]">
                        out of{" "}
                        {
                            test.questions
                                .length
                        }
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
                        {percentage.toFixed(
                            2
                        )}
                        %
                    </p>
                </section>

                {/* CURRENT RESULT STATS */}

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
                            {
                                correctCount
                            }
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
                            {
                                wrongCount
                            }
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
                            {
                                test
                                    .questions
                                    .length -
                                attemptedCount
                            }
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
                            {
                                attemptedCount
                            }
                        </p>
                    </div>
                </div>

                {/* =====================================================
                    ATTEMPT HISTORY
                ===================================================== */}

                {/* =====================================================
    RESULT HISTORY
===================================================== */}

                {attemptHistory.length > 0 && (
                    <section className="mt-8">
                        <div className="mb-5">
                            <h2 className="text-xl font-bold text-[#17171c]">
                                Test Results
                            </h2>

                            <p className="mt-1 text-sm text-[#697386]">
                                Your result after every completed attempt is
                                saved here.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {attemptHistory.map((result, index) => {
                                const maximumMarks =
                                    test.questions.length;

                                const displayScore =
                                    Number.isInteger(result.score)
                                        ? result.score
                                        : result.score.toFixed(2);

                                const isLatest = index === 0;

                                return (
                                    <div
                                        key={result.id}
                                        className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${isLatest
                                                ? "border-[#c9c5ff] ring-1 ring-[#e8e5ff]"
                                                : "border-[#e5e5eb]"
                                            }`}
                                    >
                                        {/* Result Header */}
                                        <div className="flex flex-col gap-4 border-b border-[#eeeeF2] p-5 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold ${isLatest
                                                            ? "bg-[#5b4bdb] text-white"
                                                            : "bg-[#f0efff] text-[#5b4bdb]"
                                                        }`}
                                                >
                                                    {attemptHistory.length -
                                                        index}
                                                </div>

                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-base font-bold text-[#17171c]">
                                                            Attempt{" "}
                                                            {attemptHistory.length -
                                                                index}
                                                        </h3>

                                                        {isLatest && (
                                                            <span className="rounded-full bg-[#f0efff] px-2.5 py-1 text-[11px] font-bold text-[#5b4bdb]">
                                                                Latest Attempt
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-xs text-[#697386]">
                                                        {formatAttemptDate(
                                                            result.attemptedAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Marks */}
                                            <div className="sm:text-right">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-[#697386]">
                                                    Marks Obtained
                                                </p>

                                                <div className="mt-1 flex items-baseline gap-1 sm:justify-end">
                                                    <span className="text-2xl font-extrabold text-[#5b4bdb]">
                                                        {displayScore}
                                                    </span>

                                                    <span className="text-sm font-semibold text-[#697386]">
                                                        /{" "}
                                                        {maximumMarks}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Result Stats */}
                                        <div className="grid grid-cols-2 divide-x divide-y divide-[#eeeeF2] sm:grid-cols-4 sm:divide-y-0">
                                            {/* Percentage */}
                                            <div className="p-4">
                                                <p className="text-xs text-[#697386]">
                                                    Percentage
                                                </p>

                                                <p className="mt-1 text-lg font-bold text-[#17171c]">
                                                    {result.percentage.toFixed(
                                                        2
                                                    )}
                                                    %
                                                </p>
                                            </div>

                                            {/* Correct */}
                                            <div className="p-4">
                                                <p className="text-xs text-[#697386]">
                                                    Correct
                                                </p>

                                                <p className="mt-1 text-lg font-bold text-green-600">
                                                    {result.correct}
                                                </p>
                                            </div>

                                            {/* Wrong */}
                                            <div className="p-4">
                                                <p className="text-xs text-[#697386]">
                                                    Wrong
                                                </p>

                                                <p className="mt-1 text-lg font-bold text-red-500">
                                                    {result.wrong}
                                                </p>
                                            </div>

                                            {/* Unattempted */}
                                            <div className="p-4">
                                                <p className="text-xs text-[#697386]">
                                                    Unattempted
                                                </p>

                                                <p className="mt-1 text-lg font-bold text-[#697386]">
                                                    {result.unattempted}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Marks Breakdown */}
                                        <div className="border-t border-[#eeeeF2] bg-[#fafafa] px-5 py-4">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wide text-[#697386]">
                                                        Marks Breakdown
                                                    </p>

                                                    <p className="mt-1 text-sm text-[#454554]">
                                                        {result.correct} × +1
                                                        {"  "}
                                                        <span className="text-[#697386]">
                                                            correct
                                                        </span>

                                                        {"  "}−{"  "}

                                                        {result.wrong} × 0.25
                                                        {"  "}
                                                        <span className="text-[#697386]">
                                                            wrong
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="text-left sm:text-right">
                                                    <p className="text-xs text-[#697386]">
                                                        Final Marks
                                                    </p>

                                                    <p className="text-lg font-extrabold text-[#5b4bdb]">
                                                        {displayScore} /{" "}
                                                        {maximumMarks}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* =====================================================
                    SOLUTIONS
                ===================================================== */}

                <section className="mt-8">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-[#17171c]">
                            Solutions
                        </h2>

                        <p className="mt-1 text-sm text-[#697386]">
                            Click any question to view
                            your answer, correct answer
                            and explanation.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {test.questions.map(
                            (
                                resultQuestion,
                                index
                            ) => {
                                const userAnswer =
                                    answers[
                                    index
                                    ];

                                const isCorrect =
                                    userAnswer !==
                                    null &&
                                    userAnswer ===
                                    resultQuestion.correctAnswer;

                                const isWrong =
                                    userAnswer !==
                                    null &&
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
                                                {
                                                    index +
                                                    1
                                                }
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