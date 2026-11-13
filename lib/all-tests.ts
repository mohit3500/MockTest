import type { Test } from "@/lib/types";
import { subjects } from "@/lib/catalog";

/*
 * Every test, collected from lib/catalog.ts.
 * Add new tests in catalog.ts — they show up here automatically.
 */
export const allTests: Test[] = subjects.flatMap((subject) =>
    subject.sections.flatMap((section) => section.tests)
);

export function getTestById(id: string): Test | undefined {
    return allTests.find((test) => test.id === id);
}
