import type { Test } from "@/lib/types";

import { tests1 } from "@/lib/History1-8";
import { tests2 } from "@/lib/History9-15";
import { test3 } from "@/lib/Medieval1-3"

export const allTests: Test[] = [
    ...tests1,
    ...tests2,
    ...test3,
];

export function getTestById(id: string): Test | undefined {
    return allTests.find((test) => test.id === id);
}