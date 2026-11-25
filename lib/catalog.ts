import type { Test } from "@/lib/types";

import { test1 } from "@/lib/History1-8Part1";
import { test7 } from "@/lib/History1-8Part2";
import { test2 } from "@/lib/History9-15Part1";
import { test8 } from "@/lib/History9-15Part2";
import { test3 } from "@/lib/Medieval1-3";
import { test4 } from "@/lib/Medieval4-6";
import { test5 } from "@/lib/Medieval7-9";
import { test6 } from "@/lib/Medieval10-12";
import { test9 } from "@/lib/Medieval13-15";
import { test10 } from "@/lib/Medieval16-18";
import { test11 } from "@/lib/Medieval19-22";
import { test12 } from "@/lib/Medieval23-25";
import { test13 } from "@/lib/Modern1-5";
import { test14 } from "@/lib/Modern6-10";
import { test15 } from "@/lib/Modern11-15";
import { test16 } from "@/lib/Modern16-20";
import { geo1_10 } from "./Geo1-10";
import { geo11_20 } from "./Geo11-20";
import { geo21_30 } from "./Geo21-30";
import { worldGeo1_13 } from "./WorldGeo1-13";
import { worldGeo14_26 } from "./World14-26";
import { worldGeo27_39 } from "./World27-39";
import { worldGeo40_52 } from "./World40-52";
import { testModern2130 } from "./Modern21-30";
import { testModern3140 } from "./Modern31-40";
import { testModern4152 } from "./Modern41-52";
import { testModern5355 } from "./Modern53-54";
import { GeoPyq1 } from "./GeoPyq1";
import { GeoPyq2 } from "./GeoPyq2";
import { GeoPyq3 } from "./GeoPyq3";
import { GeoPyq4 } from "./GeoPyq4";
import { GeoPyq5 } from "./GeoPyq5";
import { ancient_part1 } from "./ancient-history-pyq-part-1";
import { ancient_part2 } from "./ancient-history-pyq-part-2";
import { economic_social_development_part1 } from "./economic-social-development-pyq-part-1";
import { economic_social_development_part2 } from "./economic-social-development-pyq-part-2";
import { economic_social_development_part3 } from "./economic-social-development-pyq-part-3";
import { economic_social_development_part4 } from "./economic-social-development-pyq-part-4";
import { environment_ecology_part1 } from "./environment-ecology-pyq-part-1";
import { environment_ecology_part2 } from "./environment-ecology-pyq-part-2";
import { general_science_part1 } from "./general-science-pyq-part-1";
import { general_science_part2 } from "./general-science-pyq-part-2";
import { general_science_part3 } from "./general-science-pyq-part-3";
import { general_science_part4 } from "./general-science-pyq-part-4";
import { medieval_history_part1 } from "./medieval-history-pyq-part-1";
import { medieval_history_part2 } from "./medieval-history-pyq-part-2";
import { uttar_pradesh_special_part1 } from "./uttar-pradesh-special-pyq-part-1";
import { uttar_pradesh_special_part2 } from "./uttar-pradesh-special-pyq-part-2";
import { polity_part1 } from "./polity-pyq-part-1";
import { polity_part2 } from "./polity-pyq-part-2";
import { polity_part3 } from "./polity-pyq-part-3";

/*
 * =========================================================
 * CATALOG — the single place that organises every test.
 * =========================================================
 *
 * Subject (History, Geography, PYQs ...)
 *   └── Section (Ancient, Medieval, Modern ...)
 *         └── Tests
 *
 * To add a new test:
 *   1. Create the file in /lib (same shape as the others).
 *   2. Import its array above.
 *   3. Spread it into the `tests` of the right section.
 *
 * A section with `tests: []` shows as "Coming soon".
 * `icon` is any lucide-react icon name listed in
 * components/SubjectIcon.tsx.
 */

export interface Section {
    id: string;
    title: string;
    description: string;
    tests: Test[];
}

export interface Subject {
    id: string;
    title: string;
    description: string;
    icon: string;
    sections: Section[];
}

export const subjects: Subject[] = [
    {
        id: "history",
        title: "History",
        description: "Ancient, Medieval and Modern Indian History.",
        icon: "Landmark",
        sections: [
            {
                id: "ancient",
                title: "Ancient History",
                description: "Indian History chapters 1–15.",
                tests: [...test1, ...test7, ...test2, ...test8],
            },
            {
                id: "medieval",
                title: "Medieval History",
                description: "Medieval Indian History chapters 1–25.",
                tests: [
                    ...test3,
                    ...test4,
                    ...test5,
                    ...test6,
                    ...test9,
                    ...test10,
                    ...test11,
                    ...test12,
                ],
            },
            {
                id: "modern",
                title: "Modern History",
                description: "Modern Indian History chapters 1–20.",
                tests: [...test13, ...test14, ...test15, ...test16, ...testModern2130, ...testModern3140, ...testModern4152, ...testModern5355],
            },
            {
                id: "art-culture",
                title: "Art & Culture",
                description: "Architecture, painting, music, dance and literature.",
                tests: [],
            },
        ],
    },
    {
        id: "geography",
        title: "Geography",
        description: "Physical, Indian and World Geography.",
        icon: "Earth",
        sections: [
            {
                id: "physical",
                title: "Physical Geography",
                description: "Earth, landforms, climate and oceans.",
                tests: [],
            },
            {
                id: "indian",
                title: "Indian Geography",
                description: "Rivers, soils, agriculture and resources of India.",
                tests: [
                    ...geo1_10,
                    ...geo11_20,
                    ...geo21_30
                ],
            },
            {
                id: "world",
                title: "World Geography",
                description: "Continents, countries and world regions.",
                tests: [
                    ...worldGeo1_13,
                    ...worldGeo14_26,
                    ...worldGeo27_39,
                    ...worldGeo40_52
                ],
            },
        ],
    },
    {
        id: "polity",
        title: "Polity",
        description: "Constitution, governance and political system.",
        icon: "Scale",
        sections: [
            {
                id: "constitution",
                title: "Indian Constitution",
                description: "Articles, schedules, amendments and rights.",
                tests: [],
            },
            {
                id: "governance",
                title: "Governance",
                description: "Parliament, judiciary, executive and local bodies.",
                tests: [],
            },
        ],
    },
    {
        id: "economy",
        title: "Economy",
        description: "Indian economy, budget and banking.",
        icon: "IndianRupee",
        sections: [
            {
                id: "indian-economy",
                title: "Indian Economy",
                description: "Planning, budget, banking and schemes.",
                tests: [],
            },
        ],
    },
    {
        id: "science",
        title: "General Science",
        description: "Physics, Chemistry and Biology.",
        icon: "FlaskConical",
        sections: [
            {
                id: "physics",
                title: "Physics",
                description: "Motion, energy, light, sound and electricity.",
                tests: [],
            },
            {
                id: "chemistry",
                title: "Chemistry",
                description: "Elements, compounds and reactions.",
                tests: [],
            },
            {
                id: "biology",
                title: "Biology",
                description: "Human body, plants and diseases.",
                tests: [],
            },
        ],
    },
    {
        id: "pyqs",
        title: "PYQs",
        description: "Previous year question papers.",
        icon: "FileClock",
        sections: [
            {
                id: "full-papers",
                title: "Full Papers",
                description: "Complete previous year papers, year by year.",
                tests: [
                ],
            },
            {
                id: "topic-wise",
                title: "Topic-wise PYQs",
                description: "Previous year questions grouped by topic.",
                tests: [
                    ...GeoPyq1,
                ...GeoPyq2,
                ...GeoPyq3,
                ...GeoPyq4,
                ...GeoPyq5,
                ...ancient_part1,
                ...ancient_part2,
                ...economic_social_development_part1,
                ...economic_social_development_part2,
                ...economic_social_development_part3,
                ...economic_social_development_part4,
                ...environment_ecology_part1,
                ...environment_ecology_part2,
                ...general_science_part1,
                ...general_science_part2,
                ...general_science_part3,
                ...general_science_part4,
                ...medieval_history_part1,
                ...medieval_history_part2,
                ...polity_part1,
                ...polity_part2,
                ...polity_part3,
                ...uttar_pradesh_special_part1,
                ...uttar_pradesh_special_part2,
                ],
            },
        ],
    },
];

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

export function getSubject(subjectId: string): Subject | undefined {
    return subjects.find((subject) => subject.id === subjectId);
}

export function getSection(
    subjectId: string,
    sectionId: string
): { subject: Subject; section: Section } | undefined {
    const subject = getSubject(subjectId);
    const section = subject?.sections.find((s) => s.id === sectionId);

    if (!subject || !section) return undefined;

    return { subject, section };
}

/** Where a test lives — used for the "back" link on the test page. */
export function findTestLocation(
    testId: string
): { subject: Subject; section: Section } | undefined {
    for (const subject of subjects) {
        for (const section of subject.sections) {
            if (section.tests.some((test) => test.id === testId)) {
                return { subject, section };
            }
        }
    }

    return undefined;
}

export function countSubjectTests(subject: Subject): number {
    return subject.sections.reduce(
        (total, section) => total + section.tests.length,
        0
    );
}
