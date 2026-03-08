"use client"

import { useSearchParams } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import FurnitureItem from "./FurnitureItem"
import type { RoomType } from "./RoomSelector"

// --- Room mesh components ---

function SquareRoom() {
    return (
        <mesh>
            <boxGeometry args={[10, 3, 10]} />
            <meshStandardMaterial color="#F1EADB" />
        </mesh>
    )
}

function RectangleRoom() {
    return (
        <mesh>
            <boxGeometry args={[14, 3, 9]} />
            <meshStandardMaterial color="#F1EADB" />
        </mesh>
    )
}

function LShapeRoom() {
    return (
        <group>
            <mesh position={[-3, 0, 0]}>
                <boxGeometry args={[8, 3, 12]} />
                <meshStandardMaterial color="#F1EADB" />
            </mesh>
            <mesh position={[4, 0, 3]}>
                <boxGeometry args={[6, 3, 6]} />
                <meshStandardMaterial color="#E8DDD0" />
            </mesh>
        </group>
    )
}

function RoomMesh({ type }: { type: RoomType }) {
    if (type === "rectangle") return <RectangleRoom />
    if (type === "l-shape") return <LShapeRoom />
    return <SquareRoom />
}

const cameraPositions: Record<RoomType, [number, number, number]> = {
    square: [5, 5, 5],
    rectangle: [8, 5, 6],
    "l-shape": [9, 7, 9],
}

export default function RoomCanvas() {
    const [searchParams] = useSearchParams()
    const rawRoom = searchParams.get("room") ?? "square"
    const roomType = (["square", "rectangle", "l-shape"].includes(rawRoom) ? rawRoom : "square") as RoomType

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Canvas
                key={roomType}
                camera={{ position: cameraPositions[roomType], fov: 60 }}
                style={{ width: "100%", height: "100%", background: "#0f121c" }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 8, 5]} intensity={1} />
                <RoomMesh type={roomType} />
                <FurnitureItem position={[0, 0.5, 0]} />
                <FurnitureItem position={[3, 0.5, 1]} />
                <OrbitControls />
            </Canvas>
        </div>
    )
}