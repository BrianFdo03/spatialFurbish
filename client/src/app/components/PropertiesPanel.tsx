import type { PlacedItem } from "../types/furniture"
import type { RoomProps, TextureType } from "../types/room"

interface PropertiesPanelProps {
    selectedItem: PlacedItem | null
    onUpdate: (updates: Partial<PlacedItem>) => void
    onDelete: (id: string) => void
    roomProps: RoomProps
    onUpdateRoom: (updates: Partial<RoomProps>) => void
}

const COLORS = [
    { name: "Off White", value: "#F1EADB" },
    { name: "Soft Grey", value: "#DCD5C9" },
    { name: "Warm Beige", value: "#E8DDD0" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Dark Blue", value: "#1E40AF" },
    { name: "Orange", value: "#F97316" },
    { name: "Yellow", value: "#EAB308" },
    { name: "Green", value: "#22C55E" },
    { name: "Purple", value: "#A855F7" },
    { name: "Dark Grey", value: "#4A4A4A" },
]

const WALL_TEXTURES = [
    { id: "wall-1", name: "Cream Plaster" },
    { id: "wall-2", name: "Brown Concrete" },
    { id: "wall-3", name: "Grey Brick" },
]

const FLOOR_TEXTURES = [
    { id: "floor-1", name: "Tan Tiles" },
    { id: "floor-2", name: "Natural Wood" },
    { id: "floor-3", name: "Grey Wood" },
]

export default function PropertiesPanel({
    selectedItem,
    onUpdate,
    onDelete,
    roomProps,
    onUpdateRoom,
}: PropertiesPanelProps) {
    if (!selectedItem) {
        return (
            <aside className="w-72 shrink-0 border-l h-full overflow-y-auto shadow-sm bg-bg border-border">
                <div className="p-6 flex flex-col gap-8">
                    <h2 className="text-base font-bold text-text">Room Customization</h2>

                    {/* Wall Customization */}
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Wall Texture</h3>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                            {WALL_TEXTURES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => onUpdateRoom({ wallTexture: t.id as TextureType })}
                                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${roomProps.wallTexture === t.id ? "bg-accent text-white border-accent shadow-sm" : "bg-bg-deep text-[#5A5248] border-border hover:bg-white"}`}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Floor Customization */}
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Floor Texture</h3>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                            {FLOOR_TEXTURES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => onUpdateRoom({ floorTexture: t.id as TextureType })}
                                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${roomProps.floorTexture === t.id ? "bg-accent text-white border-accent shadow-sm" : "bg-bg-deep text-[#5A5248] border-border hover:bg-white"}`}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Wall Height */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-semibold text-text-muted">
                            <span>Wall Height</span>
                            <span>{roomProps.wallHeight.toFixed(1)}m</span>
                        </div>
                        <input
                            type="range"
                            min="2"
                            max="5"
                            step="0.1"
                            value={roomProps.wallHeight}
                            onChange={(e) => onUpdateRoom({ wallHeight: parseFloat(e.target.value) })}
                            className="w-full accent-accent"
                        />
                    </div>
                </div>
            </aside>
        )
    }

    return (
        <aside className="w-72 shrink-0 border-l h-full overflow-y-auto shadow-sm bg-bg border-border">
            <div className="p-6 flex flex-col gap-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold truncate pr-3 text-text">
                        {selectedItem.name}
                    </h2>
                    <button
                        onClick={() => onDelete(selectedItem.instanceId)}
                        className="p-3 rounded-2xl hover:bg-red-50 text-[#D47068] transition-all cursor-pointer border border-transparent hover:border-red-100 shadow-sm hover:shadow-md"
                        title="Delete item"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M15 9l-6 6M9 9l6 6" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
                        Finishing Color
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {COLORS.map((c) => (
                            <button
                                key={c.value}
                                className={`w-11 h-11 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${selectedItem.color === c.value ? "ring-2 ring-offset-2 ring-accent shadow-md border-white" : "shadow-sm border-black/5"
                                    }`}
                                style={{ backgroundColor: c.value }}
                                onClick={() => onUpdate({ color: c.value })}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Shading */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-semibold text-text-muted">
                            <span>Roughness</span>
                            <span>0.50</span>
                        </div>
                        <input type="range" className="w-full accent-accent" />
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-[#B0A898]">
                            <span>Shiny</span>
                            <span>Matte</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-semibold text-text-muted">
                            <span>Metalness</span>
                            <span>0.00</span>
                        </div>
                        <input type="range" className="w-full accent-accent" />
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-[#B0A898]">
                            <span>Non-metal</span>
                            <span>Metal</span>
                        </div>
                    </div>
                </div>

                {/* Scale */}
                <div className="space-y-3">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Scale
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {["W", "H", "D"].map((dim) => (
                            <div key={dim} className="space-y-1">
                                <label className="block text-[9px] text-center font-bold text-[#B0A898]">
                                    {dim}
                                </label>
                                <div className="px-2 py-1.5 rounded-lg border text-center text-xs font-semibold bg-bg-deep border-border text-[#5A5248]">
                                    1.0
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-3 text-[11px] font-bold rounded-xl border flex items-center justify-center gap-1.5 hover:bg-white transition-all cursor-pointer shadow-sm border-border text-text-muted">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 4v6h6M23 20v-6h-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Reset Scale
                    </button>
                </div>

                {/* Rotation */}
                <div className="space-y-3">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Rotation
                    </h3>
                    <div className="grid grid-cols-5 gap-2.5">
                        {[0, 45, 90, 135, 180].map((deg) => (
                            <button
                                key={deg}
                                onClick={() => onUpdate({ rotation: deg })}
                                className={`py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-sm hover:scale-105 ${selectedItem.rotation === deg
                                    ? "bg-accent text-white"
                                    : "bg-bg-deep text-[#5A5248]"}`}
                            >
                                {deg}°
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    )
}
