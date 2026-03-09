import { useState } from "react"
import { FURNITURE_CATALOG } from "../constants/furniture"
import type { FurnitureDef } from "../types/furniture"

const CATEGORIES = ["All", "Chairs", "Tables", "Sofas", "Beds", "Storage", "Lighting"]

interface FurniturePanelProps {
    onAdd: (def: FurnitureDef) => void
}

function FurnitureIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="13" width="20" height="6" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4 13V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4" stroke="currentColor" strokeWidth="1.8" />
            <path d="M6 19v2M18 19v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    )
}

export default function FurniturePanel({ onAdd }: FurniturePanelProps) {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")

    const filtered = FURNITURE_CATALOG.filter(f => {
        const matchCat = category === "All" || f.category === category
        const matchSearch = f.name.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    return (
        <aside className="flex flex-col w-64 shrink-0 border-r h-full shadow-sm bg-bg-deep border-border">
            {/* Heading */}
            <div className="px-5 pt-6 pb-4 border-b border-border">
                <h2 className="text-sm font-bold mb-4 text-text">Furniture</h2>

                {/* Search */}
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all focus-within:ring-2 focus-within:ring-accent focus-within:ring-opacity-20 bg-white border-border">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="text-[#B0A898] shrink-0">
                        <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M15 15l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="text-xs bg-transparent outline-none border-none w-full text-text"
                    />
                </div>
            </div>

            {/* Category chips */}
            <div className="px-4 py-5 flex flex-wrap gap-2 border-b border-border">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${category === cat
                            ? "bg-accent text-white"
                            : "bg-bg-deep text-text-muted"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Furniture list */}
            <div className="flex-1 overflow-y-auto py-3 space-y-1">
                {filtered.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onAdd(item)}
                        className="w-full flex items-center gap-5 px-6 py-4 text-left transition-all duration-200 cursor-pointer border-b border-transparent bg-transparent hover:bg-bg-deep hover:border-border"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0 shadow-sm bg-bg-deep text-text-muted">
                            <FurnitureIcon />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-bold truncate mb-0.5 text-text">
                                {item.name}
                            </p>
                            <p className="text-[11px] font-medium text-[#B0A898]">
                                {item.w}m × {item.d}m
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    )
}
