import React, { useState, useRef, useEffect } from "react"
import type { RoomType } from "./RoomSelector"
import type { PlacedItem } from "../types/furniture"

interface FloorPlanCanvasProps {
    roomType: RoomType
    items: PlacedItem[]
    selectedId: string | null
    onSelectItem: (id: string | null) => void
    onUpdateItem: (id: string, updates: Partial<PlacedItem>) => void
}

// Room dimensions in meters
const ROOM_METERS: Record<RoomType, { w: number; d: number }> = {
    square: { w: 10, d: 10 },
    rectangle: { w: 14, d: 9 },
    "l-shape": { w: 14, d: 12 },
    "u-shape": { w: 14, d: 12 },
    "t-shape": { w: 14, d: 12 },
    circular: { w: 12, d: 12 },
}

const ROOM_SCALES: Record<RoomType, number> = {
    square: 40,
    rectangle: 40,
    "l-shape": 40,
    "u-shape": 40,
    "t-shape": 35,
    circular: 40,
}

export default function FloorPlanCanvas({
    roomType,
    items,
    selectedId,
    onSelectItem,
    onUpdateItem,
}: FloorPlanCanvasProps) {
    const [isDragging, setIsDragging] = useState(false)
    const dragStartPos = useRef({ x: 0, y: 0 })
    const itemStartPos = useRef({ x: 0, y: 0 })

    const roomScale = ROOM_SCALES[roomType]
    const roomDim = ROOM_METERS[roomType]
    const pixelWidth = roomDim.w * roomScale
    const pixelHeight = roomDim.d * roomScale

    // Handle outside click to deselect
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onSelectItem(null)
        }
    }

    const handleMouseDown = (e: React.MouseEvent, item: PlacedItem) => {
        e.stopPropagation()
        onSelectItem(item.instanceId)
        setIsDragging(true)
        dragStartPos.current = { x: e.clientX, y: e.clientY }
        itemStartPos.current = { x: item.x, y: item.y }
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !selectedId) return

            const dx = e.clientX - dragStartPos.current.x
            const dy = e.clientY - dragStartPos.current.y

            onUpdateItem(selectedId, {
                x: itemStartPos.current.x + dx,
                y: itemStartPos.current.y + dy,
            })
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove)
            window.addEventListener("mouseup", handleMouseUp)
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isDragging, selectedId, onUpdateItem])

    return (
        <main className="flex-1 relative overflow-hidden bg-[#EDE7D9] flex items-center justify-center cursor-default">

            <div
                onClick={handleCanvasClick}
                className="relative shadow-2xl transition-all duration-300 pointer-events-auto"
                style={{
                    width: `${pixelWidth}px`,
                    height: `${pixelHeight}px`,
                    backgroundColor: "#DCD5C9",
                    border: "2px solid #B0A093",
                    borderRadius: roomType === "circular" ? "50%" : roomType === "l-shape" || roomType === "u-shape" || roomType === "t-shape" ? "0" : "8px",
                    clipPath: roomType === "l-shape"
                        ? "polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 100%, 0 100%)"
                        : roomType === "u-shape"
                            ? "polygon(0 0, 30% 0, 30% 70%, 70% 70%, 70% 0, 100% 0, 100% 100%, 0 100%)"
                            : roomType === "t-shape"
                                ? "polygon(0 0, 100% 0, 100% 30%, 65% 30%, 65% 100%, 35% 100%, 35% 30%, 0 30%)"
                                : "none"
                }}
            >
                {items.map((item) => (
                    <div
                        key={item.instanceId}
                        onMouseDown={(e) => handleMouseDown(e, item)}
                        className={`absolute flex items-center justify-center text-[10px] font-bold transition-shadow cursor-move ${selectedId === item.instanceId ? "z-50" : "z-10"
                            }`}
                        style={{
                            left: `${item.x}px`,
                            top: `${item.y}px`,
                            width: `${item.w * roomScale}px`,
                            height: `${item.d * roomScale}px`,
                            backgroundColor: item.color,
                            color: "#FFFFFF",
                            transform: `rotate(${item.rotation}deg)`,
                            borderRadius: "4px",
                            boxShadow: selectedId === item.instanceId
                                ? "0 0 0 3px #FFFFFF, 0 0 0 6px rgba(59, 130, 246, 0.5), 0 8px 16px rgba(0,0,0,0.2)"
                                : "0 2px 4px rgba(0,0,0,0.1)",
                            border: "1px solid rgba(0,0,0,0.1)"
                        }}
                    >
                        {item.name}
                        {selectedId === item.instanceId && (
                            <>
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full border-2 border-blue-500 shadow-md pointer-events-none" />
                                <div className="absolute -left-1 opacity-50 w-2 h-2 bg-white rounded-full pointer-events-none" />
                                <div className="absolute -right-1 opacity-50 w-2 h-2 bg-white rounded-full pointer-events-none" />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </main>
    )
}
