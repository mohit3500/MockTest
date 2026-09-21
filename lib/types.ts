export type Question = {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
};

export interface Test {
    id: string;
    title: string;
    description: string;
    category: string;
    durationMinutes: number;
    questions: Question[];

    isPaid?: boolean;
    price?: number;
}