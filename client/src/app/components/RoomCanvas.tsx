"use client"

import { useSearchParams } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import FurnitureItem from "./FurnitureItem"
import type { RoomType } from "./RoomSelector"
import type { RoomProps } from "../types/room"

// --- Helper components ---

function Wall({ position, rotation = [0, 0, 0], scale, color }: { position: [number, number, number], rotation?: [number, number, number], scale: [number, number, number], color: string }) {
    return (
        <mesh position={position} rotation={rotation}>
            <boxGeometry args={scale} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

function Floor({ width, depth, color }: { width: number, depth: number, color: string }) {
    return (
        <mesh position={[0, -1.4, 0]}>
            <boxGeometry args={[width, 0.2, depth]} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

// --- Room mesh components ---

function SquareRoom({ props }: { props: RoomProps }) {
    const { wallColor, floorColor, wallHeight } = props
    return (
        <group>
            <Floor width={10} depth={10} color={floorColor} />
            {/* Walls */}
            <Wall position={[0, (wallHeight / 2) - 1.5, -5]} scale={[10, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[0, (wallHeight / 2) - 1.5, 5]} scale={[10, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[-5, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 10]} color={wallColor} />
            <Wall position={[5, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 10]} color={wallColor} />
        </group>
    )
}

function RectangleRoom({ props }: { props: RoomProps }) {
    const { wallColor, floorColor, wallHeight } = props
    return (
        <group>
            <Floor width={14} depth={9} color={floorColor} />
            <Wall position={[0, (wallHeight / 2) - 1.5, -4.5]} scale={[14, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[0, (wallHeight / 2) - 1.5, 4.5]} scale={[14, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[-7, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 9]} color={wallColor} />
            <Wall position={[7, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 9]} color={wallColor} />
        </group>
    )
}

function LShapeRoom({ props }: { props: RoomProps }) {
    const { wallColor, floorColor, wallHeight } = props
    return (
        <group>
            {/* Floors */}
            <mesh position={[-3, -1.4, 0]}>
                <boxGeometry args={[8, 0.2, 12]} />
                <meshStandardMaterial color={floorColor} />
            </mesh>
            <mesh position={[4, -1.4, 3]}>
                <boxGeometry args={[6, 0.2, 6]} />
                <meshStandardMaterial color={floorColor} />
            </mesh>
            {/* Exterior Walls */}
            <Wall position={[-7, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 12]} color={wallColor} />
            <Wall position={[-3, (wallHeight / 2) - 1.5, -6]} scale={[8, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[1, (wallHeight / 2) - 1.5, -3]} scale={[0.2, wallHeight, 6]} color={wallColor} />
            <Wall position={[4, (wallHeight / 2) - 1.5, 0]} scale={[6, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[7, (wallHeight / 2) - 1.5, 3]} scale={[0.2, wallHeight, 6]} color={wallColor} />
            <Wall position={[2, (wallHeight / 2) - 1.5, 6]} scale={[10, wallHeight, 0.2]} color={wallColor} />
        </group>
    )
}

function SquareLargeRoom({ props }: { props: RoomProps }) {
    const { wallColor, floorColor, wallHeight } = props
    return (
        <group>
            <Floor width={20} depth={20} color={floorColor} />
            <Wall position={[0, (wallHeight / 2) - 1.5, -10]} scale={[20, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[0, (wallHeight / 2) - 1.5, 10]} scale={[20, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[-10, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 20]} color={wallColor} />
            <Wall position={[10, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 20]} color={wallColor} />
        </group>
    )
}

function RectangleLargeRoom({ props }: { props: RoomProps }) {
    const { wallColor, floorColor, wallHeight } = props
    return (
        <group>
            <Floor width={28} depth={18} color={floorColor} />
            <Wall position={[0, (wallHeight / 2) - 1.5, -9]} scale={[28, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[0, (wallHeight / 2) - 1.5, 9]} scale={[28, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[-14, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 18]} color={wallColor} />
            <Wall position={[14, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 18]} color={wallColor} />
        </group>
    )
}

function LShapeLargeRoom({ props }: { props: RoomProps }) {
    const { wallColor, floorColor, wallHeight } = props
    return (
        <group>
            <mesh position={[-6, -1.4, 0]}>
                <boxGeometry args={[16, 0.2, 24]} />
                <meshStandardMaterial color={floorColor} />
            </mesh>
            <mesh position={[8, -1.4, 6]}>
                <boxGeometry args={[12, 0.2, 12]} />
                <meshStandardMaterial color={floorColor} />
            </mesh>
            <Wall position={[-14, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 24]} color={wallColor} />
            <Wall position={[-6, (wallHeight / 2) - 1.5, -12]} scale={[16, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[2, (wallHeight / 2) - 1.5, -6]} scale={[0.2, wallHeight, 12]} color={wallColor} />
            <Wall position={[8, (wallHeight / 2) - 1.5, 0]} scale={[12, wallHeight, 0.2]} color={wallColor} />
            <Wall position={[14, (wallHeight / 2) - 1.5, 6]} scale={[0.2, wallHeight, 12]} color={wallColor} />
            <Wall position={[0, (wallHeight / 2) - 1.5, 12]} scale={[28, wallHeight, 0.2]} color={wallColor} />
        </group>
    )
}

function RoomMesh({ type, props }: { type: RoomType, props: RoomProps }) {
    if (type === "rectangle") return <RectangleRoom props={props} />
    if (type === "l-shape") return <LShapeRoom props={props} />
    if (type === "square-large") return <SquareLargeRoom props={props} />
    if (type === "rectangle-large") return <RectangleLargeRoom props={props} />
    if (type === "l-shape-large") return <LShapeLargeRoom props={props} />
    return <SquareRoom props={props} />
}

const cameraPositions: Record<RoomType, [number, number, number]> = {
    square: [5, 5, 5],
    rectangle: [8, 5, 6],
    "l-shape": [9, 7, 9],
    "square-large": [16, 15, 16],
    "rectangle-large": [20, 15, 12],
    "l-shape-large": [22, 18, 22],
}

export default function RoomCanvas({ roomProps }: { roomProps: RoomProps }) {
    const [searchParams] = useSearchParams()
    const rawRoom = searchParams.get("room") ?? "square"
    const roomType = (["square", "rectangle", "l-shape", "square-large", "rectangle-large", "l-shape-large"].includes(rawRoom) ? rawRoom : "square") as RoomType

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Canvas
                key={roomType + JSON.stringify(roomProps)}
                camera={{ position: cameraPositions[roomType], fov: 60 }}
                style={{ width: "100%", height: "100%", background: "#0f121c" }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 8, 5]} intensity={1} />
                <RoomMesh type={roomType} props={roomProps} />
                <FurnitureItem position={[0, 0.5, 0]} />
                <FurnitureItem position={[3, 0.5, 1]} />
                <OrbitControls />
            </Canvas>
        </div>
    )
}