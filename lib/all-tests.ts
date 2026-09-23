import type { Test } from "@/lib/types";

import { test1 } from "@/lib/History1-8Part1";
import { test7 } from "@/lib/History1-8Part2";
import { test2 } from "@/lib/History9-15Part1";
import { test3 } from "@/lib/Medieval1-3"
import { test4 } from "@/lib/Medieval4-6"
import { test5 } from "@/lib/Medieval7-9"
import { test6 } from "@/lib/Medieval10-12"
import { test8 } from "@/lib/History9-15Part2"

export const allTests: Test[] = [
    ...test1,
    ...test7,
    ...test2,
    ...test8,
    ...test3,
    ...test4,
    ...test5,
    ...test6,
];

export function getTestById(id: string): Test | undefined {
    return allTests.find((test) => test.id === id);
}