import { useState } from "react"

export interface FurnitureDef {
    id: string
    name: string
    category: string
    w: number  // metres
    d: number  // metres
}

export const FURNITURE_CATALOG: FurnitureDef[] = [
    { id: "sofa-3", name: "3-Seat Sofa", category: "Sofas", w: 2.2, d: 0.9 },
    { id: "bookshelf", name: "Bookshelf", category: "Storage", w: 0.8, d: 0.3 },
    { id: "coffee-table", name: "Coffee Table", category: "Tables", w: 1.2, d: 0.6 },
    { id: "desk", name: "Desk", category: "Tables", w: 1.4, d: 0.7 },
    { id: "dining-chair", name: "Dining Chair", category: "Chairs", w: 0.5, d: 0.5 },
    { id: "dining-table", name: "Dining Table", category: "Tables", w: 1.6, d: 0.9 },
    { id: "armchair", name: "Armchair", category: "Chairs", w: 0.9, d: 0.9 },
    { id: "bed-double", name: "Bed (Double)", category: "Beds", w: 1.6, d: 2.0 },
    { id: "wardrobe", name: "Wardrobe", category: "Storage", w: 1.8, d: 0.6 },
    { id: "floor-lamp", name: "Floor Lamp", category: "Lighting", w: 0.3, d: 0.3 },
    { id: "tv-unit", name: "TV Unit", category: "Storage", w: 1.6, d: 0.4 },
    { id: "side-table", name: "Side Table", category: "Tables", w: 0.5, d: 0.5 },
]

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
        <aside
            className="flex flex-col w-64 shrink-0 border-r h-full shadow-sm"
            style={{ backgroundColor: "#F5F0E8", borderColor: "#D8D0C4" }}
        >
            {/* Heading */}
            <div className="px-5 pt-6 pb-4 border-b" style={{ borderColor: "#D8D0C4" }}>
                <h2 className="text-sm font-bold mb-4" style={{ color: "#2C2C2C" }}>Furniture</h2>

                {/* Search */}
                <div
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all focus-within:ring-2 focus-within:ring-[#4A6B42] focus-within:ring-opacity-20"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D8D0C4" }}
                >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ color: "#B0A898", flexShrink: 0 }}>
                        <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M15 15l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="text-xs bg-transparent outline-none border-none w-full"
                        style={{ color: "#2C2C2C" }}
                    />
                </div>
            </div>

            {/* Category chips */}
            <div className="px-4 py-5 flex flex-wrap gap-2 border-b" style={{ borderColor: "#D8D0C4" }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors duration-120 cursor-pointer"
                        style={
                            category === cat
                                ? { backgroundColor: "#4A6B42", color: "#FFFFFF" }
                                : { backgroundColor: "#EDE7D9", color: "#7A7A6E" }
                        }
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
                        className="w-full flex items-center gap-4 px-5 py-3 text-left transition-colors duration-150 cursor-pointer"
                        style={{ backgroundColor: "transparent" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EDE7D9")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                        <div
                            className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                            style={{ backgroundColor: "#EDE7D9", color: "#7A7A6E" }}
                        >
                            <FurnitureIcon />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: "#2C2C2C" }}>
                                {item.name}
                            </p>
                            <p className="text-xs" style={{ color: "#B0A898" }}>
                                {item.w}m × {item.d}m
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    )
}
