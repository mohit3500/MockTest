import {
    BookOpen,
    Earth,
    FileClock,
    FlaskConical,
    IndianRupee,
    Landmark,
    Scale,
    type LucideIcon,
} from "lucide-react";

/*
 * Icons available to subjects in lib/catalog.ts.
 * Add more lucide-react icons here if you need them.
 */
const ICONS: Record<string, LucideIcon> = {
    BookOpen,
    Earth,
    FileClock,
    FlaskConical,
    IndianRupee,
    Landmark,
    Scale,
};

export default function SubjectIcon({
    name,
    className,
}: {
    name: string;
    className?: string;
}) {
    const Icon = ICONS[name] ?? BookOpen;
    return <Icon className={className} />;
}
