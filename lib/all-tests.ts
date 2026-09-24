import type { Test } from "@/lib/types";

import { test1 } from "@/lib/History1-8Part1";
import { test7 } from "@/lib/History1-8Part2";
import { test2 } from "@/lib/History9-15Part1";
import { test3 } from "@/lib/Medieval1-3"
import { test4 } from "@/lib/Medieval4-6"
import { test5 } from "@/lib/Medieval7-9"
import { test6 } from "@/lib/Medieval10-12"
import { test8 } from "@/lib/History9-15Part2"
import { test9 } from "@/lib/Medieval13-15"
import { test10 } from "@/lib/Medieval16-18"
import { test11 } from "@/lib/Medieval19-22"
import { test12 } from "@/lib/Medieval23-25"

export const allTests: Test[] = [
    ...test1,
    ...test7,
    ...test2,
    ...test8,
    ...test3,
    ...test4,
    ...test5,
    ...test6,
    ...test9,
    ...test10,
    ...test11,
    ...test12
];

export function getTestById(id: string): Test | undefined {
    return allTests.find((test) => test.id === id);
}