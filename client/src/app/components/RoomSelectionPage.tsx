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
                <svg viewBox="0 0 100 100" width="72" height="72" fill="none">
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
                <svg viewBox="0 0 130 86" width="104" height="68" fill="none">
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
                <svg viewBox="0 0 100 100" width="72" height="72" fill="none">
                    <polyline
                        points="12,12 12,88 88,88 88,50 50,50 50,12 12,12"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
    ]

export default function RoomSelectionPage() {
    const [hovered, setHovered] = useState<RoomType | null>(null)
    const navigate = useNavigate()

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: "#F5F0E8" }}>

            {/* Subtle dot grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle, #C8BFB0 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                    opacity: 0.5,
                }}
            />

            {/* Brand badge */}
            <div className="relative flex items-center gap-3 mb-12">
                <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: "#4A6B42" }}
                />
                <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: "#7A7A6E" }}
                >
                    Spatial Furbish
                </span>
            </div>

            {/* Heading */}
            <div className="relative text-center mb-16 px-8 max-w-3xl">
                <h1
                    className="text-7xl font-extrabold mb-8 tracking-tighter"
                    style={{ color: "#2C2C2C" }}
                >
                    Choose Your Room Shape
                </h1>
                <p className="text-xl font-medium leading-relaxed max-w-2xl mx-auto" style={{ color: "#7A7A6E" }}>
                    Select the floor plan that matches your space — then drag, drop <br /> and furnish it in 2D and 3D.
                </p>
            </div>

            {/* Cards */}
            <div className="relative flex gap-10 flex-wrap justify-center px-8">
                {rooms.map((room) => {
                    const isHovered = hovered === room.type
                    return (
                        <button
                            key={room.type}
                            onMouseEnter={() => setHovered(room.type)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => navigate(`/editor?room=${room.type}`)}
                            className="relative flex flex-col items-start w-80 p-12 rounded-[40px] outline-none cursor-pointer transition-all duration-500"
                            style={{
                                backgroundColor: isHovered ? "#FFFFFF" : "rgba(237, 231, 217, 0.6)",
                                border: `2px solid ${isHovered ? "#4A6B42" : "#D8D0C4"}`,
                                transform: isHovered ? "translateY(-12px)" : "translateY(0)",
                                boxShadow: isHovered
                                    ? "0 40px 80px rgba(74,107,66,0.12), 0 8px 20px rgba(0,0,0,0.05)"
                                    : "0 4px 12px rgba(0,0,0,0.02)",
                            }}
                        >
                            {/* Icon Container - Centered at top */}
                            <div
                                style={{ color: isHovered ? "#4A6B42" : "#8A8270" }}
                                className="w-full flex justify-center transition-colors duration-500 mb-12"
                            >
                                <div className="transform scale-125">
                                    {room.icon}
                                </div>
                            </div>

                            {/* Label + dimensions */}
                            <div className="w-full mt-auto">
                                <div className="flex items-end justify-between mb-3">
                                    <span
                                        className="text-2xl font-bold tracking-tight"
                                        style={{ color: "#2C2C2C" }}
                                    >
                                        {room.label}
                                    </span>
                                    <span
                                        className="text-[11px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-1"
                                        style={{
                                            backgroundColor: "#D8D0C4",
                                            color: "#7A7A6E",
                                        }}
                                    >
                                        {room.dimensions}
                                    </span>
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-left" style={{ color: "#7A7A6E" }}>
                                    {room.desc}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
