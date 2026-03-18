import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { RoomType } from "./RoomSelector"

const rooms: {
    type: RoomType
    label: string
    desc: string
    dimensions: string
    icon: React.ReactNode
}[] = [
        {
            type: "square",
            label: "Square",
            desc: "A symmetrical, balanced layout perfect for compact spaces",
            dimensions: "10 × 10 m",
            icon: (
                <svg viewBox="0 0 100 100" width="80" height="80" fill="none">
                    <rect x="12" y="12" width="76" height="76" rx="4" stroke="currentColor" strokeWidth="5" />
                    <line x1="12" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" opacity="0.4" />
                    <line x1="50" y1="12" x2="50" y2="88" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" opacity="0.4" />
                </svg>
            ),
        },
        {
            type: "rectangle",
            label: "Rectangle",
            desc: "A wider open layout ideal for living rooms and studios",
            dimensions: "14 × 9 m",
            icon: (
                <svg viewBox="0 0 130 86" width="100" height="70" fill="none">
                    <rect x="8" y="8" width="114" height="70" rx="4" stroke="currentColor" strokeWidth="5" />
                    <line x1="8" y1="43" x2="122" y2="43" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" opacity="0.4" />
                    <line x1="65" y1="8" x2="65" y2="78" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" opacity="0.4" />
                </svg>
            ),
        },
        {
            type: "l-shape",
            label: "L-Shape",
            desc: "An open-concept layout with a distinctive corner nook",
            dimensions: "8+6 × 12+6 m",
            icon: (
                <svg viewBox="0 0 100 100" width="80" height="80" fill="none">
                    <polyline
                        points="12,12 12,88 88,88 88,50 50,50 50,12 12,12"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            type: "u-shape",
            label: "U-Shape",
            desc: "A wraparound layout with a center opening, perfect for courtyards",
            dimensions: "14 × 12 m",
            icon: (
                <svg viewBox="0 0 100 100" width="80" height="80" fill="none">
                    <polyline
                        points="15,15 15,85 85,85 85,15 65,15 65,55 35,55 35,15 15,15"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            type: "t-shape",
            label: "T-Shape",
            desc: "A symmetric cross-style layout with great zoning potential",
            dimensions: "14 × 12 m",
            icon: (
                <svg viewBox="0 0 100 100" width="80" height="80" fill="none">
                    <polyline
                        points="15,15 85,15 85,45 65,45 65,85 35,85 35,45 15,45 15,15"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            type: "circular",
            label: "Circular",
            desc: "A modern rotunda design for unique, organic interior spaces",
            dimensions: "12 m Diameter",
            icon: (
                <svg viewBox="0 0 100 100" width="80" height="80" fill="none">
                    <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="currentColor"
                        strokeWidth="5"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="12"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="5 5"
                        opacity="0.4"
                    />
                </svg>
            ),
        },
    ]

export default function RoomSelectionPage() {

    const [hovered, setHovered] = useState<RoomType | null>(null)
    const navigate = useNavigate()

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center relative bg-bg">
            {/* Background grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                    backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Heading */}
            <div className="text-center mb-10 max-w-4xl px-6 relative z-10">
                <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-text">
                    Choose Your Room Shape
                </h1>
                <p className="text-lg text-text-muted">
                    Select a floor plan to start designing. Drag, drop and furnish in 2D or 3D.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-3 gap-6 max-w-6xl w-full px-8 relative z-10">
                {rooms.map((room) => {
                    const isHovered = hovered === room.type

                    return (
                        <button
                            key={room.type}
                            onMouseEnter={() => setHovered(room.type)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => navigate(`/editor?room=${room.type}`)}
                            className={`flex flex-col items-center text-center p-8 gap-4 rounded-[32px] transition-all duration-300 bg-white/80 backdrop-blur-sm border-[1.5px] cursor-pointer w-full
                                ${isHovered
                                    ? "border-accent -translate-y-2 scale-[1.03] shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                                    : "border-border shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                                }`}
                        >
                            <div className={`transition-colors duration-300 mb-2 ${isHovered ? "text-accent" : "text-[#8A8270]"}`}>
                                {room.icon}
                            </div>

                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-bold text-text">
                                    {room.label}
                                </h3>
                                <div className="flex justify-center">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E4DDCF] text-[#6F6758] uppercase tracking-wider">
                                        {room.dimensions}
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs leading-relaxed text-text-muted line-clamp-2">
                                {room.desc}
                            </p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}