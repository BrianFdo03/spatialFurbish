import type { FurnitureDef } from "./FurniturePanel"

export interface PlacedItem extends FurnitureDef {
    instanceId: string
    x: number // pixels in canvas
    y: number // pixels in canvas
    rotation: number // degrees
    color: string
}

interface PropertiesPanelProps {
    selectedItem: PlacedItem | null
    onUpdate: (updates: Partial<PlacedItem>) => void
    onDelete: (id: string) => void
}

const COLORS = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Dark Blue", value: "#1E40AF" },
    { name: "Orange", value: "#F97316" },
    { name: "Yellow", value: "#EAB308" },
    { name: "Green", value: "#22C55E" },
    { name: "Purple", value: "#A855F7" },
]

export default function PropertiesPanel({
    selectedItem,
    onUpdate,
    onDelete,
}: PropertiesPanelProps) {
    if (!selectedItem) {
        return (
            <aside
                className="w-64 shrink-0 border-l h-full flex items-center justify-center p-6 text-center"
                style={{ backgroundColor: "#F5F0E8", borderColor: "#D8D0C4" }}
            >
                <p className="text-sm" style={{ color: "#7A7A6E" }}>
                    Select an item on the canvas to edit its properties
                </p>
            </aside>
        )
    }

    return (
        <aside
            className="w-72 shrink-0 border-l h-full overflow-y-auto shadow-sm"
            style={{ backgroundColor: "#F5F0E8", borderColor: "#D8D0C4" }}
        >
            <div className="p-6 flex flex-col gap-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold truncate pr-3" style={{ color: "#2C2C2C" }}>
                        {selectedItem.name}
                    </h2>
                    <button
                        onClick={() => onDelete(selectedItem.instanceId)}
                        className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-all cursor-pointer border border-transparent hover:border-red-100"
                        title="Delete item"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path
                                d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#7A7A6E]">
                        Finishing Color
                    </h3>
                    <div className="flex flex-wrap gap-3.5">
                        {COLORS.map((c) => (
                            <button
                                key={c.value}
                                className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${selectedItem.color === c.value ? "ring-2 ring-offset-2 ring-[#4A6B42] shadow-md" : "shadow-sm"
                                    }`}
                                style={{
                                    backgroundColor: c.value,
                                    borderColor: selectedItem.color === c.value ? "#FFFFFF" : "rgba(0,0,0,0.05)",
                                }}
                                onClick={() => onUpdate({ color: c.value })}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Shading */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-semibold" style={{ color: "#7A7A6E" }}>
                            <span>Roughness</span>
                            <span>0.50</span>
                        </div>
                        <input type="range" className="w-full accent-sage-600" />
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider" style={{ color: "#B0A898" }}>
                            <span>Shiny</span>
                            <span>Matte</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-semibold" style={{ color: "#7A7A6E" }}>
                            <span>Metalness</span>
                            <span>0.00</span>
                        </div>
                        <input type="range" className="w-full accent-sage-600" />
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider" style={{ color: "#B0A898" }}>
                            <span>Non-metal</span>
                            <span>Metal</span>
                        </div>
                    </div>
                </div>

                {/* Scale */}
                <div className="space-y-3">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#7A7A6E" }}>
                        Scale
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {["W", "H", "D"].map((dim) => (
                            <div key={dim} className="space-y-1">
                                <label className="block text-[9px] text-center font-bold" style={{ color: "#B0A898" }}>
                                    {dim}
                                </label>
                                <div
                                    className="px-2 py-1.5 rounded-lg border text-center text-xs font-semibold"
                                    style={{ backgroundColor: "#EDE7D9", borderColor: "#D8D0C4", color: "#5A5248" }}
                                >
                                    1.0
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="w-full py-2 text-[11px] font-bold rounded-lg border flex items-center justify-center gap-1.5 hover:bg-white transition-colors cursor-pointer"
                        style={{ borderColor: "#D8D0C4", color: "#7A7A6E" }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 4v6h6M23 20v-6h-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Reset Scale
                    </button>
                </div>

                {/* Rotation */}
                <div className="space-y-3">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#7A7A6E" }}>
                        Rotation
                    </h3>
                    <div className="grid grid-cols-5 gap-1.5">
                        {[0, 45, 90, 135, 180].map((deg) => (
                            <button
                                key={deg}
                                onClick={() => onUpdate({ rotation: deg })}
                                className="py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                                style={{
                                    backgroundColor: selectedItem.rotation === deg ? "#4A6B42" : "#EDE7D9",
                                    color: selectedItem.rotation === deg ? "#FFFFFF" : "#5A5248",
                                }}
                            >
                                {deg}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    )
}
