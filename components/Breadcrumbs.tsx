import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
    label: string;
    href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-[#697386]">
            {items.map((item, index) => (
                <span key={index} className="flex items-center gap-1">
                    {index > 0 && <ChevronRight className="h-4 w-4" />}
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="font-medium hover:text-[#5b4bdb]"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-semibold text-[#17171c]">
                            {item.label}
                        </span>
                    )}
                </span>
            ))}
        </nav>
    );
}
