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

function SquareLargeRoom() {
    return (
        <mesh>
            <boxGeometry args={[20, 3, 20]} />
            <meshStandardMaterial color="#F1EADB" />
        </mesh>
    )
}

function RectangleLargeRoom() {
    return (
        <mesh>
            <boxGeometry args={[28, 3, 18]} />
            <meshStandardMaterial color="#F1EADB" />
        </mesh>
    )
}

function LShapeLargeRoom() {
    return (
        <group>
            <mesh position={[-6, 0, 0]}>
                <boxGeometry args={[16, 3, 24]} />
                <meshStandardMaterial color="#F1EADB" />
            </mesh>
            <mesh position={[8, 0, 6]}>
                <boxGeometry args={[12, 3, 12]} />
                <meshStandardMaterial color="#E8DDD0" />
            </mesh>
        </group>
    )
}

function RoomMesh({ type }: { type: RoomType }) {
    if (type === "rectangle") return <RectangleRoom />
    if (type === "l-shape") return <LShapeRoom />
    if (type === "square-large") return <SquareLargeRoom />
    if (type === "rectangle-large") return <RectangleLargeRoom />
    if (type === "l-shape-large") return <LShapeLargeRoom />
    return <SquareRoom />
}

const cameraPositions: Record<RoomType, [number, number, number]> = {
    square: [5, 5, 5],
    rectangle: [8, 5, 6],
    "l-shape": [9, 7, 9],
    "square-large": [16, 15, 16],
    "rectangle-large": [20, 15, 12],
    "l-shape-large": [22, 18, 22],
}

export default function RoomCanvas() {
    const [searchParams] = useSearchParams()
    const rawRoom = searchParams.get("room") ?? "square"
    const roomType = (["square", "rectangle", "l-shape", "square-large", "rectangle-large", "l-shape-large"].includes(rawRoom) ? rawRoom : "square") as RoomType

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