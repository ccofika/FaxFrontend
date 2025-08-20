"use client";

import { cn } from "../../lib/utils";
import {
    GraduationCap,
    BookOpen,
    Clock,
    BarChart3,
} from "lucide-react";

export interface BentoItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
}

interface BentoGridProps {
    items?: BentoItem[];
}

const itemsSample: BentoItem[] = [
    {
        title: "Prilagođeno tvom smeru",
        meta: "AI analiza",
        description:
            "AI razume specifičnosti tvog fakulteta i smer",
        icon: <GraduationCap className="w-4 h-4 text-zinc-400" />,
        status: "Aktivno",
        tags: ["AI", "Personalizacija"],
        colSpan: 2,
        hasPersistentHover: true,
    },
    {
        title: "Radi sa tvojim knjigama",
        meta: "Svi formati",
        description: "Upload-uj materijale i dobij odgovore iz tvojih izvora",
        icon: <BookOpen className="w-4 h-4 text-zinc-400" />,
        status: "Dostupno",
        tags: ["Upload", "Analiza"],
    },
    {
        title: "Dostupno 24/7",
        meta: "Non-stop",
        description: "Tvoj AI asistent ne spava - učiš kad god želiš",
        icon: <Clock className="w-4 h-4 text-zinc-400" />,
        tags: ["24/7", "Podrška"],
        colSpan: 2,
    },
    {
        title: "Napredna analitika",
        meta: "Prati napredak",
        description: "Prati napredak i identifikuje oblasti za poboljšanje",
        icon: <BarChart3 className="w-4 h-4 text-zinc-400" />,
        status: "Novo",
        tags: ["Analitika", "Napredak"],
    },
];

function BentoGrid({ items = itemsSample }: BentoGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 max-w-7xl mx-auto">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={cn(
                        "group relative p-4 rounded-xl overflow-hidden transition-all duration-300",
                        "border border-zinc-800/50 bg-zinc-900/50",
                        "hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
                        "hover:-translate-y-0.5 will-change-transform",
                        item.colSpan || "col-span-1",
                        item.colSpan === 2 ? "md:col-span-2" : "",
                        {
                            "shadow-[0_2px_12px_rgba(255,255,255,0.03)] -translate-y-0.5":
                                item.hasPersistentHover,
                        }
                    )}
                >
                    <div
                        className={`absolute inset-0 ${
                            item.hasPersistentHover
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                        } transition-opacity duration-300`}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
                    </div>

                    <div className="relative flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                                {item.icon}
                            </div>
                            <span
                                className={cn(
                                    "text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm",
                                    "bg-white/10 text-zinc-300",
                                    "transition-colors duration-300 group-hover:bg-white/20"
                                )}
                            >
                                {item.status || "Active"}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium text-white tracking-tight text-[15px]">
                                {item.title}
                                <span className="ml-2 text-xs text-zinc-400 font-normal">
                                    {item.meta}
                                </span>
                            </h3>
                            <p className="text-sm text-zinc-300 leading-snug font-[425]">
                                {item.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2 text-xs text-zinc-400">
                                {item.tags?.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <span className="text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.cta || "Saznaj više →"}
                            </span>
                        </div>
                    </div>

                    <div
                        className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-white/10 to-transparent ${
                            item.hasPersistentHover
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                        } transition-opacity duration-300`}
                    />
                </div>
            ))}
        </div>
    );
}

export { BentoGrid }
