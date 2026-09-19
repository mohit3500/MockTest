export type Question = {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
};

export type Test = {
    id: string;
    title: string;
    description: string;
    category: string;
    durationMinutes: number;
    questions: Question[];
};