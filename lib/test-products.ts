export interface TestProduct {
    testId: string;
    title: string;
    price: number;
    currency: "INR";
}

export const TEST_PRODUCTS: Record<string, TestProduct> = {
    "indian-history-first-8-chapters": {
        testId: "indian-history-first-8-chapters",
        title: "Indian History — First 8 Chapters",
        price: 1,
        currency: "INR",
    },
};

export function getTestProduct(
    testId: string
): TestProduct | undefined {
    return TEST_PRODUCTS[testId];
}