"use client";

import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Clock3,
    RotateCcw,
    XCircle,
    ClipboardCheck,
    AlertCircle,
    ChevronDown,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import type { Test } from "@/lib/types";

type QuizClientProps = {
    test: Test;
};

type QuizMode = "attempt" | "review" | "result";

export default function QuizClient({
    test,
}: QuizClientProps) {
    const [current, setCurrent] = useState(0);

    const [answers, setAnswers] = useState<
        (number | null)[]
    >(test.questions.map(() => null));

    const [mode, setMode] =
        useState<QuizMode>("attempt");

    const SECONDS_PER_QUESTION = 30;

    const totalTestSeconds =
        test.questions.length * SECONDS_PER_QUESTION;

    const [secondsLeft, setSecondsLeft] =
        useState(totalTestSeconds);

    const [expandedQuestion, setExpandedQuestion] =
        useState<number | null>(null);

    const question = test.questions[current];

    /*
     * --------------------------------------------------
     * TIMER
     * --------------------------------------------------
     */

    useEffect(() => {
        if (mode !== "attempt") {
            return;
        }

        const timer = window.setInterval(() => {
            setSecondsLeft((seconds) => {
                if (seconds <= 1) {
                    window.clearInterval(timer);

                    setMode("review");

                    return 0;
                }

                return seconds - 1;
            });
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [mode]);

    /*
     * --------------------------------------------------
     * SCORE
     *
     * Correct   = +1
     * Wrong     = -0.25
     * Unattempt = 0
     * --------------------------------------------------
     */

    const score = useMemo(() => {
        return test.questions.reduce(
            (total, question, index) => {
                const userAnswer = answers[index];

                // Unattempted
                if (userAnswer === null) {
                    return total;
                }

                // Correct
                if (
                    userAnswer === question.correctAnswer
                ) {
                    return total + 1;
                }

                // Wrong
                return total - 0.25;
            },
            0
        );
    }, [answers, test.questions]);

    /*
     * --------------------------------------------------
     * CORRECT / WRONG / ATTEMPTED COUNTS
     * --------------------------------------------------
     */

    const correctCount = useMemo(() => {
        return test.questions.reduce(
            (total, question, index) => {
                return answers[index] ===
                    question.correctAnswer
                    ? total + 1
                    : total;
            },
            0
        );
    }, [answers, test.questions]);

    const wrongCount = useMemo(() => {
        return test.questions.reduce(
            (total, question, index) => {
                const userAnswer = answers[index];

                if (
                    userAnswer !== null &&
                    userAnswer !== question.correctAnswer
                ) {
                    return total + 1;
                }

                return total;
            },
            0
        );
    }, [answers, test.questions]);

    const answered = answers.filter(
        (answer) => answer !== null
    ).length;

    const unanswered =
        test.questions.length - answered;

    /*
     * --------------------------------------------------
     * SCORE FORMATTING
     * --------------------------------------------------
     */

    const scoreDisplay = Number.isInteger(score)
        ? score.toString()
        : score.toFixed(2);

    const percentage = Math.round(
        (score / test.questions.length) * 100
    );

    /*
     * --------------------------------------------------
     * TIMER FORMATTING
     * --------------------------------------------------
     */

    const minutes = Math.floor(
        secondsLeft / 60
    );

    const seconds = secondsLeft % 60;

    const formattedTime =
        `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;

    /*
     * --------------------------------------------------
     * ANSWER SELECTION
     * --------------------------------------------------
     */

    function chooseAnswer(index: number) {
        if (mode !== "attempt") {
            return;
        }

        const newAnswers = [...answers];

        newAnswers[current] = index;

        setAnswers(newAnswers);
    }

    /*
     * --------------------------------------------------
     * NAVIGATION
     * --------------------------------------------------
     */

    function nextQuestion() {
        if (
            current <
            test.questions.length - 1
        ) {
            setCurrent((value) => value + 1);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }

    function previousQuestion() {
        if (current > 0) {
            setCurrent((value) => value - 1);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }

    /*
     * --------------------------------------------------
     * REVIEW
     * --------------------------------------------------
     */

    function openReview() {
        setMode("review");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    /*
     * --------------------------------------------------
     * SUBMIT
     * --------------------------------------------------
     */

    function submitTest() {
        setMode("result");

        setExpandedQuestion(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    /*
     * --------------------------------------------------
     * CONTINUE TEST
     * --------------------------------------------------
     */

    function continueTest() {
        setMode("attempt");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    /*
     * --------------------------------------------------
     * RESTART
     * --------------------------------------------------
     */

    function restartTest() {
        setAnswers(
            test.questions.map(() => null)
        );

        setCurrent(0);

        setMode("attempt");

        setExpandedQuestion(null);

        setSecondsLeft(totalTestSeconds);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    /*
     * ==================================================
     * RESULT PAGE
     * ==================================================
     */

    if (mode === "result") {
        return (
            <main>
                <QuizHeader
                    title={test.title}
                    time={null}
                />

                <section className="quiz-container">
                    <div className="result-card">

                        {/* RESULT HEADER */}

                        <div className="result-header">

                            <div className="result-icon">
                                <CheckCircle2 size={30} />
                            </div>

                            <p className="result-label">
                                TEST COMPLETED
                            </p>

                            <h1 className="result-score">
                                {scoreDisplay}

                                <span>
                                    / {test.questions.length}
                                </span>
                            </h1>

                            <p className="result-percentage">
                                {percentage}% Score
                            </p>

                            {/* SCORE BREAKDOWN */}

                            <div className="result-marking-info">

                                <div>
                                    <span className="marking-positive">
                                        +1
                                    </span>

                                    <span>
                                        Correct Answer
                                    </span>
                                </div>

                                <div>
                                    <span className="marking-negative">
                                        −0.25
                                    </span>

                                    <span>
                                        Wrong Answer
                                    </span>
                                </div>

                                <div>
                                    <span className="marking-neutral">
                                        0
                                    </span>

                                    <span>
                                        Unattempted
                                    </span>
                                </div>

                            </div>

                            {/* RESULT STATS */}

                            <div className="result-stats">

                                <div>
                                    <strong>
                                        {correctCount}
                                    </strong>

                                    <span>
                                        Correct
                                    </span>

                                    <small>
                                        +{correctCount}
                                    </small>
                                </div>

                                <div>
                                    <strong>
                                        {wrongCount}
                                    </strong>

                                    <span>
                                        Wrong
                                    </span>

                                    <small>
                                        −
                                        {(wrongCount * 0.25).toFixed(
                                            2
                                        )}
                                    </small>
                                </div>

                                <div>
                                    <strong>
                                        {answered}
                                    </strong>

                                    <span>
                                        Attempted
                                    </span>

                                    <small>
                                        {unanswered} skipped
                                    </small>
                                </div>

                            </div>

                            {/* ACTIONS */}

                            <div className="result-actions">

                                <button
                                    onClick={restartTest}
                                    className="secondary-button"
                                >
                                    <RotateCcw size={17} />
                                    Retake Test
                                </button>

                                <Link
                                    href="/tests"
                                    className="primary-button"
                                >
                                    Other Tests
                                </Link>

                            </div>

                        </div>

                        {/* SOLUTIONS */}

                        <div className="solutions-section">

                            <div className="section-heading">
                                <h2>
                                    Answers & Solutions
                                </h2>

                                <p>
                                    Click any question to view
                                    your answer, correct answer
                                    and explanation.
                                </p>
                            </div>

                            <div className="solutions-list">

                                {test.questions.map(
                                    (question, index) => {
                                        const userAnswer =
                                            answers[index];

                                        const isCorrect =
                                            userAnswer ===
                                            question.correctAnswer;

                                        const isUnattempted =
                                            userAnswer === null;

                                        const isExpanded =
                                            expandedQuestion === index;

                                        return (
                                            <article
                                                key={question.id}
                                                className={`solution-card ${isCorrect
                                                    ? "solution-correct"
                                                    : isUnattempted
                                                        ? "solution-unattempted"
                                                        : "solution-wrong"
                                                    }`}
                                            >

                                                {/* CLICKABLE QUESTION HEADER */}

                                                <button
                                                    type="button"
                                                    className="solution-question solution-question-button"
                                                    onClick={() =>
                                                        setExpandedQuestion(
                                                            isExpanded
                                                                ? null
                                                                : index
                                                        )
                                                    }
                                                >

                                                    <div className="solution-status">

                                                        {isUnattempted ? (
                                                            <AlertCircle
                                                                size={23}
                                                            />
                                                        ) : isCorrect ? (
                                                            <CheckCircle2
                                                                size={23}
                                                            />
                                                        ) : (
                                                            <XCircle
                                                                size={23}
                                                            />
                                                        )}

                                                    </div>

                                                    <div className="solution-question-content">

                                                        <span className="question-number">
                                                            QUESTION{" "}
                                                            {index + 1}
                                                        </span>

                                                        <h3>
                                                            {question.question}
                                                        </h3>

                                                        <span
                                                            className={`answer-result-text ${isUnattempted
                                                                ? "result-unattempted"
                                                                : isCorrect
                                                                    ? "result-correct"
                                                                    : "result-wrong"
                                                                }`}
                                                        >
                                                            {isUnattempted
                                                                ? "Not Attempted · 0"
                                                                : isCorrect
                                                                    ? "Correct Answer · +1"
                                                                    : "Wrong Answer · -0.25"}
                                                        </span>

                                                    </div>

                                                    <ChevronDown
                                                        size={21}
                                                        className={`solution-chevron ${isExpanded
                                                            ? "solution-chevron-open"
                                                            : ""
                                                            }`}
                                                    />

                                                </button>

                                                {/* EXPANDED SOLUTION */}

                                                {isExpanded && (
                                                    <div className="solution-details">

                                                        {/* USER ANSWER SUMMARY */}

                                                        <div className="answer-summary">

                                                            <div
                                                                className={
                                                                    isUnattempted
                                                                        ? "summary-item summary-neutral"
                                                                        : isCorrect
                                                                            ? "summary-item summary-correct"
                                                                            : "summary-item summary-wrong"
                                                                }
                                                            >

                                                                <span>
                                                                    Your Answer
                                                                </span>

                                                                <strong>
                                                                    {isUnattempted
                                                                        ? "Not Attempted"
                                                                        : `${String.fromCharCode(
                                                                            65 +
                                                                            (userAnswer ??
                                                                                0)
                                                                        )}. ${question
                                                                            .options[
                                                                        userAnswer ??
                                                                        0
                                                                        ]
                                                                        }`}
                                                                </strong>

                                                            </div>

                                                            <div className="summary-item summary-correct">

                                                                <span>
                                                                    Correct Answer
                                                                </span>

                                                                <strong>
                                                                    {String.fromCharCode(
                                                                        65 +
                                                                        question.correctAnswer
                                                                    )}
                                                                    .{" "}
                                                                    {
                                                                        question.options[
                                                                        question.correctAnswer
                                                                        ]
                                                                    }
                                                                </strong>

                                                            </div>

                                                        </div>

                                                        {/* OPTIONS */}

                                                        <div className="solution-options">

                                                            {question.options.map(
                                                                (
                                                                    option,
                                                                    optionIndex
                                                                ) => {
                                                                    const isCorrectOption =
                                                                        optionIndex ===
                                                                        question.correctAnswer;

                                                                    const isUserOption =
                                                                        optionIndex ===
                                                                        userAnswer;

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                optionIndex
                                                                            }
                                                                            className={`solution-option ${isCorrectOption
                                                                                ? "answer-correct"
                                                                                : ""
                                                                                } ${isUserOption &&
                                                                                    !isCorrectOption
                                                                                    ? "answer-wrong"
                                                                                    : ""
                                                                                }`}
                                                                        >

                                                                            <span className="option-letter">
                                                                                {String.fromCharCode(
                                                                                    65 +
                                                                                    optionIndex
                                                                                )}
                                                                            </span>

                                                                            <span className="option-text">
                                                                                {option}
                                                                            </span>

                                                                            {isCorrectOption && (
                                                                                <span className="answer-label correct-label">
                                                                                    ✓ Correct Answer
                                                                                </span>
                                                                            )}

                                                                            {isUserOption &&
                                                                                !isCorrectOption && (
                                                                                    <span className="answer-label wrong-label">
                                                                                        ✕ Your Answer
                                                                                    </span>
                                                                                )}

                                                                        </div>
                                                                    );
                                                                }
                                                            )}

                                                        </div>

                                                        {/* EXPLANATION */}

                                                        <div className="explanation-box">

                                                            <div className="explanation-title">

                                                                <CheckCircle2
                                                                    size={18}
                                                                />

                                                                <span>
                                                                    Solution /
                                                                    Explanation
                                                                </span>

                                                            </div>

                                                            <p>
                                                                {
                                                                    question.explanation
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>
                                                )}

                                            </article>
                                        );
                                    }
                                )}

                            </div>

                        </div>

                    </div>
                </section>
            </main>
        );
    }

    /*
     * ==================================================
     * REVIEW PAGE
     * ==================================================
     */

    if (mode === "review") {
        return (
            <main>
                <QuizHeader
                    title="Review Test"
                    time={formattedTime}
                />

                <section className="quiz-container">

                    <div className="review-page">

                        <div className="review-header">

                            <div>
                                <p className="review-eyebrow">
                                    FINAL REVIEW
                                </p>

                                <h1>
                                    Review your answers
                                </h1>

                                <p>
                                    Check all your answers before
                                    submitting the test.
                                </p>
                            </div>

                            <div className="review-time">

                                <Clock3 size={20} />

                                <div>
                                    <span>
                                        Time Remaining
                                    </span>

                                    <strong>
                                        {formattedTime}
                                    </strong>
                                </div>

                            </div>

                        </div>

                        {/* REVIEW SUMMARY */}

                        <div className="review-summary">

                            <div className="review-stat">

                                <div className="stat-icon total">
                                    <ClipboardCheck
                                        size={20}
                                    />
                                </div>

                                <div>
                                    <strong>
                                        {test.questions.length}
                                    </strong>

                                    <span>
                                        Total Questions
                                    </span>
                                </div>

                            </div>

                            <div className="review-stat">

                                <div className="stat-icon attempted">
                                    <CheckCircle2 size={20} />
                                </div>

                                <div>
                                    <strong>
                                        {answered}
                                    </strong>

                                    <span>
                                        Attempted
                                    </span>
                                </div>

                            </div>

                            <div className="review-stat">

                                <div className="stat-icon unanswered">
                                    <AlertCircle size={20} />
                                </div>

                                <div>
                                    <strong>
                                        {unanswered}
                                    </strong>

                                    <span>
                                        Unanswered
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* QUESTIONS */}

                        <div className="review-card">

                            <div className="review-card-header">

                                <div>
                                    <h2>
                                        Questions
                                    </h2>

                                    <p>
                                        Click any question to
                                        change your answer.
                                    </p>
                                </div>

                            </div>

                            <div className="review-questions">

                                {test.questions.map(
                                    (item, index) => {
                                        const isAnswered =
                                            answers[index] !== null;

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setCurrent(index);

                                                    setMode("attempt");

                                                    window.scrollTo({
                                                        top: 0,
                                                        behavior: "smooth",
                                                    });
                                                }}
                                                className={`review-question ${isAnswered
                                                    ? "review-answered"
                                                    : "review-unanswered"
                                                    }`}
                                            >

                                                <span className="review-question-number">
                                                    {index + 1}
                                                </span>

                                                <span className="review-question-content">

                                                    <strong>
                                                        Question{" "}
                                                        {index + 1}
                                                    </strong>

                                                    <span>
                                                        {isAnswered
                                                            ? `Answer: ${String.fromCharCode(
                                                                65 +
                                                                (answers[
                                                                    index
                                                                ] ?? 0)
                                                            )}`
                                                            : "Not answered"}
                                                    </span>

                                                </span>

                                                <ArrowRight
                                                    size={18}
                                                />

                                            </button>
                                        );
                                    }
                                )}

                            </div>

                        </div>

                        {/* REVIEW ACTIONS */}

                        <div className="review-actions">

                            <button
                                onClick={continueTest}
                                className="secondary-button large-button"
                            >
                                <ArrowLeft size={18} />
                                Continue Test
                            </button>

                            <button
                                onClick={submitTest}
                                className="submit-button"
                            >
                                Submit Test
                                <ArrowRight size={18} />
                            </button>

                        </div>

                    </div>

                </section>
            </main>
        );
    }

    /*
     * ==================================================
     * ATTEMPT PAGE
     * ==================================================
     */

    return (
        <main>

            <QuizHeader
                title={test.title}
                time={formattedTime}
                warning={secondsLeft <= 60}
            />

            <section className="quiz-container">

                {/* QUESTION TOP */}

                <div className="question-top">

                    <div>
                        <span className="question-counter">
                            QUESTION {current + 1}
                        </span>

                        <p className="question-count">
                            of {test.questions.length}
                        </p>
                    </div>

                    <span className="answered-count">
                        {answered} answered
                    </span>

                </div>

                {/* PROGRESS */}

                <div className="quiz-progress">

                    <div
                        className="quiz-progress-fill"
                        style={{
                            width:
                                `${((current + 1) /
                                    test.questions.length) *
                                100
                                }%`,
                        }}
                    />

                </div>

                <div className="quiz-layout">

                    {/* QUESTION */}

                    <div className="question-card">

                        <div className="question-heading">

                            <span>
                                Question {current + 1}
                            </span>

                            <h1>
                                {question.question}
                            </h1>

                        </div>

                        {/* OPTIONS */}

                        <div className="options-container">

                            {question.options.map(
                                (option, index) => {

                                    const selected =
                                        answers[current] ===
                                        index;

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() =>
                                                chooseAnswer(index)
                                            }
                                            className={`quiz-option ${selected
                                                ? "quiz-option-selected"
                                                : ""
                                                }`}
                                        >

                                            <span
                                                className={`option-letter-large ${selected
                                                    ? "option-letter-selected"
                                                    : ""
                                                    }`}
                                            >
                                                {String.fromCharCode(
                                                    65 + index
                                                )}
                                            </span>

                                            <span className="quiz-option-text">
                                                {option}
                                            </span>

                                            {selected && (
                                                <span className="selected-check">
                                                    <CheckCircle2
                                                        size={20}
                                                    />
                                                </span>
                                            )}

                                        </button>
                                    );
                                }
                            )}

                        </div>

                        {/* NAVIGATION */}

                        <div className="question-navigation">

                            <button
                                type="button"
                                disabled={current === 0}
                                onClick={previousQuestion}
                                className="navigation-secondary"
                            >
                                <ArrowLeft size={18} />
                                Previous
                            </button>

                            {current ===
                                test.questions.length - 1 ? (

                                <button
                                    type="button"
                                    onClick={openReview}
                                    className="navigation-primary"
                                >
                                    Review Test
                                    <ClipboardCheck size={18} />
                                </button>

                            ) : (

                                <button
                                    type="button"
                                    onClick={nextQuestion}
                                    className="navigation-primary"
                                >
                                    Next
                                    <ArrowRight size={18} />
                                </button>

                            )}

                        </div>

                    </div>

                    {/* SIDEBAR */}

                    <aside className="question-sidebar">

                        <div className="sidebar-title">

                            <h3>
                                Questions
                            </h3>

                            <span>
                                {answered}/
                                {test.questions.length}
                            </span>

                        </div>

                        <div className="question-grid">

                            {test.questions.map(
                                (item, index) => {

                                    const selected =
                                        current === index;

                                    const answeredQuestion =
                                        answers[index] !== null;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() =>
                                                setCurrent(index)
                                            }
                                            className={`question-number-button ${selected
                                                ? "question-number-active"
                                                : ""
                                                } ${answeredQuestion
                                                    ? "question-number-answered"
                                                    : ""
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                }
                            )}

                        </div>

                        {/* LEGEND */}

                        <div className="sidebar-legend">

                            <div>
                                <span className="legend-box current" />
                                Current
                            </div>

                            <div>
                                <span className="legend-box answered" />
                                Answered
                            </div>

                            <div>
                                <span className="legend-box pending" />
                                Not Answered
                            </div>

                        </div>

                        {/* REVIEW */}

                        <button
                            onClick={openReview}
                            className="sidebar-review-button"
                        >
                            <ClipboardCheck size={18} />
                            Review Test
                        </button>

                    </aside>

                </div>

            </section>

        </main>
    );
}

/*
 * ==================================================
 * QUIZ HEADER
 * ==================================================
 */

function QuizHeader({
    title,
    time,
    warning = false,
}: {
    title: string;
    time: string | null;
    warning?: boolean;
}) {
    return (
        <header className="quiz-header">

            <div className="quiz-header-inner">

                <Link
                    href="/tests"
                    className="back-to-tests"
                >
                    <ArrowLeft size={18} />
                    Tests
                </Link>

                <div className="quiz-title">
                    {title}
                </div>

                {time !== null && (
                    <div
                        className={`top-timer ${warning
                            ? "top-timer-warning"
                            : ""
                            }`}
                    >
                        <Clock3 size={19} />

                        <div>
                            <span>
                                Time Remaining
                            </span>

                            <strong>
                                {time}
                            </strong>
                        </div>

                    </div>
                )}

            </div>

        </header>
    );
}