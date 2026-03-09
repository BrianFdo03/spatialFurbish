import React from "react";

export type RoomType = "square" | "rectangle" | "l-shape" | "u-shape" | "t-shape" | "circular";

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
        type: "u-shape",
        label: "U-Shape",
        desc: "Wraparound layout with center courtyard",
        icon: (
            <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
                <polyline
                    points="10,10 10,50 50,50 50,10 35,10 35,35 25,35 25,10 10,10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        type: "t-shape",
        label: "T-Shape",
        desc: "Symmetric cross-style layout",
        icon: (
            <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
                <polyline
                    points="10,10 50,10 50,25 35,25 35,50 25,50 25,25 10,25 10,10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        type: "circular",
        label: "Circular",
        desc: "Modern rotunda style design",
        icon: (
            <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
                <circle
                    cx="30"
                    cy="30"
                    r="22"
                    stroke="currentColor"
                    strokeWidth="3"
                />
                <circle
                    cx="30"
                    cy="30"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.4"
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
