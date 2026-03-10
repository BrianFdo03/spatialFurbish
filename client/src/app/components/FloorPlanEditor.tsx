import { useState, useReducer } from "react"
import { useSearchParams } from "react-router-dom"
import EditorTopBar from "./EditorTopBar"
import FurniturePanel from "./FurniturePanel"
import PropertiesPanel from "./PropertiesPanel"
import type { FurnitureDef, PlacedItem } from "../types/furniture"
import type { RoomProps } from "../types/room"
import FloorPlanCanvas from "./FloorPlanCanvas"
import RoomCanvas from "./RoomCanvas"
import type { RoomType } from "./RoomSelector"

type Action =
    | { type: 'ADD_ITEM', payload: FurnitureDef }
    | { type: 'UPDATE_ITEM', payload: { id: string, updates: Partial<PlacedItem> } }
    | { type: 'DELETE_ITEM', payload: string }
    | { type: 'UNDO' }

function reducer(state: PlacedItem[], action: Action): PlacedItem[] {
    switch (action.type) {
        case 'ADD_ITEM': {
            const def = action.payload
            return [...state, {
                ...def,
                instanceId: crypto.randomUUID(),
                x: 100, // default spawn pos
                y: 100,
                rotation: 0,
                color: "#3B82F6"
            }]
        }
        case 'UPDATE_ITEM':
            return state.map(item =>
                item.instanceId === action.payload.id
                    ? { ...item, ...action.payload.updates }
                    : item
            )
        case 'DELETE_ITEM':
            return state.filter(item => item.instanceId !== action.payload)
        default:
            return state
    }
}

export default function FloorPlanEditor() {
    const [searchParams] = useSearchParams()
    const [view, setView] = useState<"2d" | "3d">("2d")
    const [title, setTitle] = useState("Untitled Design")
    const [items, dispatch] = useReducer(reducer, [])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [roomProps, setRoomProps] = useState<RoomProps>({
        wallColor: "#ffffff",
        wallTexture: "wall-1",
        floorColor: "#ffffff",
        floorTexture: "floor-1",
        wallHeight: 3,
    })

    const rawRoom = searchParams.get("room") ?? "square"
    const roomType = (["square", "rectangle", "l-shape", "u-shape", "t-shape", "circular"].includes(rawRoom) ? rawRoom : "square") as RoomType

    const selectedItem = items.find(i => i.instanceId === selectedId) || null

    const handleAdd = (def: FurnitureDef) => {
        dispatch({ type: 'ADD_ITEM', payload: def })
    }

    const handleUpdate = (id: string, updates: Partial<PlacedItem>) => {
        dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } })
    }

    const handleDelete = (id: string) => {
        dispatch({ type: 'DELETE_ITEM', payload: id })
        setSelectedId(null)
    }

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg text-text">
            <EditorTopBar
                title={title}
                onTitleChange={setTitle}
                view={view}
                onViewChange={setView}
                onUndo={() => { }}
                onSave={() => alert("Design saved locally!")}
            />

            <div className="flex flex-1 overflow-hidden">
                <FurniturePanel onAdd={handleAdd} />

                {view === "2d" ? (
                    <FloorPlanCanvas
                        roomType={roomType}
                        items={items}
                        selectedId={selectedId}
                        onSelectItem={setSelectedId}
                        onUpdateItem={handleUpdate}
                    />
                ) : (
                    <div className="flex-1 relative">
                        <RoomCanvas roomProps={roomProps} items={items} />
                        <div className="absolute top-4 left-4 z-10 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-border shadow-lg max-w-[200px]">
                            <p className="text-xs font-bold text-accent mb-1 uppercase tracking-wider">3D Real-time View</p>
                            <p className="text-[10px] text-text-muted">Interactive walk-through of your current layout.</p>
                        </div>
                    </div>
                )}

                <PropertiesPanel
                    selectedItem={selectedItem}
                    onUpdate={(updates) => selectedId && handleUpdate(selectedId, updates)}
                    onDelete={handleDelete}
                    roomProps={roomProps}
                    onUpdateRoom={(updates) => setRoomProps(prev => ({ ...prev, ...updates }))}
                />
            </div>
        </div>
    )
}
