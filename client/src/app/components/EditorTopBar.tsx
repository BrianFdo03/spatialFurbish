import { useNavigate } from "react-router-dom"

interface EditorTopBarProps {
    title: string
    onTitleChange: (t: string) => void
    view: "2d" | "3d"
    onViewChange: (v: "2d" | "3d") => void
    onUndo: () => void
    onSave: () => void
}

export default function EditorTopBar({
    title,
    onTitleChange,
    view,
    onViewChange,
    onUndo,
    onSave,
}: EditorTopBarProps) {
    const navigate = useNavigate()

    return (
        <header
            className="flex items-center px-6 h-16 shrink-0 border-b shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#D8D0C4" }}
        >
            {/* Left — back + title */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-150 cursor-pointer"
                    style={{ color: "#7A7A6E" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EDE7D9")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                    title="Back to room selection"
                >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <input
                    className="text-sm font-bold bg-transparent border-none outline-none truncate hover:bg-[#F5F0E8] px-2 py-1 rounded transition-colors"
                    style={{ color: "#2C2C2C", maxWidth: "220px" }}
                    value={title}
                    onChange={e => onTitleChange(e.target.value)}
                />

                {/* Status dot */}
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#E07A3A" }} />
            </div>

            {/* Center — 2D / 3D toggle */}
            <div
                className="flex items-center gap-1 rounded-xl p-1"
                style={{ backgroundColor: "#EDE7D9" }}
            >
                {(["2d", "3d"] as const).map(v => (
                    <button
                        key={v}
                        onClick={() => onViewChange(v)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer"
                        style={
                            view === v
                                ? { backgroundColor: "#4A6B42", color: "#FFFFFF" }
                                : { backgroundColor: "transparent", color: "#7A7A6E" }
                        }
                    >
                        {v === "2d" ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                2D Layout
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 3L21 8.5V15.5L12 21L3 15.5V8.5L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M12 3v18M3 8.5l9 6 9-6" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                3D View
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Right — undo + save */}
            <div className="flex items-center gap-2 flex-1 justify-end">
                <button
                    onClick={onUndo}
                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150 cursor-pointer"
                    style={{ color: "#7A7A6E" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EDE7D9")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                    title="Undo"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M3 10h10a5 5 0 0 1 0 10H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 10l4-4M3 10l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <button
                    onClick={onSave}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer"
                    style={{ backgroundColor: "#4A6B42", color: "#FFFFFF" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3A5534")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#4A6B42")}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                    Save
                </button>
            </div>
        </header>
    )
}
