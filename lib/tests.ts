import type { Test } from "./types";

export const tests: Test[] = [
    {
        id: "general-awareness-01",
        title: "General Awareness Mock Test 01",
        description:
            "A short general awareness practice test with answers and explanations.",
        category: "General Awareness",
        durationMinutes: 10,

        questions: [
            {
                id: "q1",
                question: "What is the capital of India?",
                options: [
                    "Mumbai",
                    "New Delhi",
                    "Kolkata",
                    "Chennai"
                ],
                correctAnswer: 1,
                explanation:
                    "New Delhi is the capital of India."
            },

            {
                id: "q2",
                question:
                    "Which planet is known as the Red Planet?",
                options: [
                    "Venus",
                    "Mars",
                    "Jupiter",
                    "Mercury"
                ],
                correctAnswer: 1,
                explanation:
                    "Mars is known as the Red Planet because iron minerals on its surface give it a reddish appearance."
            },

            {
                id: "q3",
                question:
                    "Which language is primarily used to style web pages?",
                options: [
                    "Python",
                    "CSS",
                    "SQL",
                    "C++"
                ],
                correctAnswer: 1,
                explanation:
                    "CSS, or Cascading Style Sheets, is used to control the presentation and layout of web pages."
            },

            {
                id: "q4",
                question: "What is 15 × 4?",
                options: [
                    "45",
                    "50",
                    "60",
                    "75"
                ],
                correctAnswer: 2,
                explanation:
                    "15 multiplied by 4 equals 60."
            },

            {
                id: "q5",
                question:
                    "Which gas is most abundant in Earth's atmosphere?",
                options: [
                    "Oxygen",
                    "Nitrogen",
                    "Carbon dioxide",
                    "Hydrogen"
                ],
                correctAnswer: 1,
                explanation:
                    "Nitrogen makes up approximately 78% of Earth's atmosphere by volume."
            },
            {
                id: "r6",
                question:
                    "Find the next number: 2, 4, 8, 16, ?",
                options: [
                    "20",
                    "24",
                    "32",
                    "36"
                ],
                correctAnswer: 2,
                explanation:
                    "Each number is multiplied by 2. Therefore, 16 × 2 = 32."
            },

            {
                id: "r7",
                question:
                    "If CAT is coded as DBU, how is DOG coded using the same pattern?",
                options: [
                    "EPH",
                    "EOH",
                    "DPG",
                    "FPH"
                ],
                correctAnswer: 0,
                explanation:
                    "Each letter is shifted one position forward: D becomes E, O becomes P, and G becomes H. Therefore, DOG becomes EPH."
            },
        ]
    },

    {
        id: "reasoning-01",
        title: "Reasoning Practice Test 01",
        description:
            "Basic reasoning questions for quick practice.",
        category: "Reasoning",
        durationMinutes: 8,

        questions: [
            {
                id: "r1",
                question:
                    "Find the next number: 2, 4, 8, 16, ?",
                options: [
                    "20",
                    "24",
                    "32",
                    "36"
                ],
                correctAnswer: 2,
                explanation:
                    "Each number is multiplied by 2. Therefore, 16 × 2 = 32."
            },

            {
                id: "r2",
                question:
                    "If CAT is coded as DBU, how is DOG coded using the same pattern?",
                options: [
                    "EPH",
                    "EOH",
                    "DPG",
                    "FPH"
                ],
                correctAnswer: 0,
                explanation:
                    "Each letter is shifted one position forward: D becomes E, O becomes P, and G becomes H. Therefore, DOG becomes EPH."
            },

            {
                id: "r3",
                question:
                    "Which one is different from the others?",
                options: [
                    "Apple",
                    "Mango",
                    "Carrot",
                    "Banana"
                ],
                correctAnswer: 2,
                explanation:
                    "Carrot is a vegetable, while Apple, Mango and Banana are commonly classified as fruits."
            }
        ]
    }
];

export function getTest(id: string) {
    return tests.find((test) => test.id === id);
}