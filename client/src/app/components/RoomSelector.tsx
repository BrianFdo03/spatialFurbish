import React from "react";

export type RoomType = "square" | "rectangle" | "l-shape" | "square-large" | "rectangle-large" | "l-shape-large";

interface RoomSelectorProps {
    selected: RoomType;
    onChange: (type: RoomType) => void;
}

const rooms: { type: RoomType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
        type: "square",
        label: "Square",
        desc: "Equal sides, balanced layout",
        icon: (
            <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
                <rect x="8" y="8" width="44" height="44" rx="3" stroke="currentColor" strokeWidth="3" />
            </svg>
        ),
    },
    {
        type: "rectangle",
        label: "Rectangle",
        desc: "Wider layout, great for living rooms",
        icon: (
            <svg viewBox="0 0 70 50" width="54" height="40" fill="none">
                <rect x="5" y="5" width="60" height="40" rx="3" stroke="currentColor" strokeWidth="3" />
            </svg>
        ),
    },
    {
        type: "l-shape",
        label: "L-Shape",
        desc: "Open concept with a corner nook",
        icon: (
            <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
                <polyline
                    points="8,8 8,52 52,52 52,32 28,32 28,8 8,8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        type: "square-large",
        label: "Grand Square",
        desc: "Massive 20×20m open space",
        icon: (
            <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
                <rect x="5" y="5" width="50" height="50" rx="3" stroke="currentColor" strokeWidth="4" />
                <rect x="15" y="15" width="30" height="30" rx="2" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            </svg>
        ),
    },
    {
        type: "rectangle-large",
        label: "Double Suite",
        desc: "Expansive 28×18m floor plan",
        icon: (
            <svg viewBox="0 0 80 50" width="54" height="34" fill="none">
                <rect x="5" y="5" width="70" height="40" rx="3" stroke="currentColor" strokeWidth="4" />
                <line x1="40" y1="5" x2="40" y2="45" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            </svg>
        ),
    },
    {
        type: "l-shape-large",
        label: "L-Grand",
        desc: "Extensive 28×24m corner layout",
        icon: (
            <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
                <polyline
                    points="5,5 5,55 55,55 55,35 30,35 30,5 5,5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
];

export default function RoomSelector({ selected, onChange }: RoomSelectorProps) {
    return (
        <div className="absolute top-6 left-6 z-[100] pointer-events-none">
            <div className="pointer-events-auto bg-[#0F121C]/82 backdrop-blur-[18px] border border-white/10 rounded-[24px] p-6 w-[280px] shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_0_0_0.5px_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#818cf8] shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
                    <span className="font-sans text-[13px] font-bold tracking-[0.08em] uppercase text-text-muted">
                        Room Type
                    </span>
                </div>
                <p className="font-sans text-lg font-bold text-white mb-4 leading-tight">
                    Select your floor plan shape
                </p>
                <div className="flex flex-col gap-3">
                    {rooms.map((room) => {
                        const isSelected = selected === room.type;
                        return (
                            <button
                                key={room.type}
                                onClick={() => onChange(room.type)}
                                className={`relative flex items-center gap-4 px-5 py-4 rounded-[16px] border transition-all duration-200 cursor-pointer text-left outline-none w-full
                                    ${isSelected
                                        ? "bg-[#a78bfa]/10 border-[#a78bfa]/40 shadow-[0_0_20px_rgba(167,139,250,0.12)]"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                    }`}
                            >
                                <div className={`shrink-0 flex items-center justify-center transition-colors duration-200 ${isSelected ? "text-[#a78bfa]" : "text-[#94a3b8]"}`}>
                                    {room.icon}
                                </div>
                                <span className={`font-sans text-sm font-bold transition-colors duration-200 ${isSelected ? "text-white" : "text-[#cbd5e1]"}`}>
                                    {room.label}
                                </span>
                                {isSelected && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#818cf8] shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
