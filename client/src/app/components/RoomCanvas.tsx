"use client"

import { useMemo, Suspense } from "react"
import { useSearchParams } from "react-router-dom"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useTexture } from "@react-three/drei"
import * as THREE from "three"
import FurnitureItem from "./FurnitureItem"
import type { RoomType } from "./RoomSelector"
import type { RoomProps } from "../types/room"

// Assets
import wall1Img from "../../assets/Wall 1.jpeg"
import wall2Img from "../../assets/Wall 2.jpeg"
import wall3Img from "../../assets/Wall 3.jpg"
import floor1Img from "../../assets/Floor 1.jpeg"
import floor2Img from "../../assets/Floor 2.jpeg"
import floor3Img from "../../assets/Floor 3.jpg"

// --- Helper components ---

function Wall({ position, rotation = [0, 0, 0], scale, texture }: { position: [number, number, number], rotation?: [number, number, number], scale: [number, number, number], texture?: THREE.Texture | null }) {
    const wallTexture = useMemo(() => {
        if (!texture) return null
        const tex = texture.clone()
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping
        // Map texture so it doesn't stretch. 1 repeat per 2 meters approx.
        const repeatX = scale[0] > scale[2] ? scale[0] / 2 : scale[2] / 2
        tex.repeat.set(repeatX, scale[1] / 2)
        tex.needsUpdate = true
        return tex
    }, [texture, scale])

    return (
        <mesh position={position} rotation={rotation}>
            <boxGeometry args={scale} />
            <meshStandardMaterial color="#ffffff" map={wallTexture} />
        </mesh>
    )
}

function Floor({ width, depth, texture }: { width: number, depth: number, texture?: THREE.Texture | null }) {
    const floorTexture = useMemo(() => {
        if (!texture) return null
        const tex = texture.clone()
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping
        tex.repeat.set(width / 2, depth / 2)
        tex.needsUpdate = true
        return tex
    }, [texture, width, depth])

    return (
        <mesh position={[0, -1.4, 0]}>
            <boxGeometry args={[width, 0.2, depth]} />
            <meshStandardMaterial color="#ffffff" map={floorTexture} />
        </mesh>
    )
}

// --- Room mesh components ---

function SquareRoom({ props, wallTex, floorTex }: { props: RoomProps, wallTex?: THREE.Texture | null, floorTex?: THREE.Texture | null }) {
    const { wallHeight } = props
    return (
        <group>
            <Floor width={10} depth={10} texture={floorTex} />
            {/* Walls */}
            <Wall position={[0, (wallHeight / 2) - 1.5, -5]} scale={[10, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[0, (wallHeight / 2) - 1.5, 5]} scale={[10, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[-5, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 10]} texture={wallTex} />
            <Wall position={[5, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 10]} texture={wallTex} />
        </group>
    )
}

function RectangleRoom({ props, wallTex, floorTex }: { props: RoomProps, wallTex?: THREE.Texture | null, floorTex?: THREE.Texture | null }) {
    const { wallHeight } = props
    return (
        <group>
            <Floor width={14} depth={9} texture={floorTex} />
            <Wall position={[0, (wallHeight / 2) - 1.5, -4.5]} scale={[14, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[0, (wallHeight / 2) - 1.5, 4.5]} scale={[14, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[-7, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 9]} texture={wallTex} />
            <Wall position={[7, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 9]} texture={wallTex} />
        </group>
    )
}

function LShapeRoom({ props, wallTex, floorTex }: { props: RoomProps, wallTex?: THREE.Texture | null, floorTex?: THREE.Texture | null }) {
    const { wallHeight } = props
    return (
        <group>
            {/* Floors */}
            <mesh position={[-3, -1.4, 0]}>
                <boxGeometry args={[8, 0.2, 12]} />
                <meshStandardMaterial color="#ffffff" map={floorTex || null} />
            </mesh>
            <mesh position={[4, -1.4, 3]}>
                <boxGeometry args={[6, 0.2, 6]} />
                <meshStandardMaterial color="#ffffff" map={floorTex || null} />
            </mesh>
            {/* Exterior Walls */}
            <Wall position={[-7, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 12]} texture={wallTex} />
            <Wall position={[-3, (wallHeight / 2) - 1.5, -6]} scale={[8, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[1, (wallHeight / 2) - 1.5, -3]} scale={[0.2, wallHeight, 6]} texture={wallTex} />
            <Wall position={[4, (wallHeight / 2) - 1.5, 0]} scale={[6, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[7, (wallHeight / 2) - 1.5, 3]} scale={[0.2, wallHeight, 6]} texture={wallTex} />
            <Wall position={[2, (wallHeight / 2) - 1.5, 6]} scale={[10, wallHeight, 0.2]} texture={wallTex} />
        </group>
    )
}

function UShapeRoom({ props, wallTex, floorTex }: { props: RoomProps, wallTex?: THREE.Texture | null, floorTex?: THREE.Texture | null }) {
    const { wallHeight } = props
    return (
        <group>
            {/* Floors */}
            <mesh position={[-4, -1.4, 0]}>
                <boxGeometry args={[6, 0.2, 12]} />
                <meshStandardMaterial color="#ffffff" map={floorTex || null} />
            </mesh>
            <mesh position={[4, -1.4, 0]}>
                <boxGeometry args={[6, 0.2, 12]} />
                <meshStandardMaterial color="#ffffff" map={floorTex || null} />
            </mesh>
            <mesh position={[0, -1.4, 4]}>
                <boxGeometry args={[2, 0.2, 4]} />
                <meshStandardMaterial color="#ffffff" map={floorTex || null} />
            </mesh>
            {/* Exterior Walls */}
            <Wall position={[-7, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 12]} texture={wallTex} />
            <Wall position={[-4, (wallHeight / 2) - 1.5, -6]} scale={[6, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[-1, (wallHeight / 2) - 1.5, -2]} scale={[0.2, wallHeight, 8]} texture={wallTex} />
            <Wall position={[0, (wallHeight / 2) - 1.5, 2]} scale={[2, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[1, (wallHeight / 2) - 1.5, -2]} scale={[0.2, wallHeight, 8]} texture={wallTex} />
            <Wall position={[4, (wallHeight / 2) - 1.5, -6]} scale={[6, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[7, (wallHeight / 2) - 1.5, 0]} scale={[0.2, wallHeight, 12]} texture={wallTex} />
            <Wall position={[0, (wallHeight / 2) - 1.5, 6]} scale={[14, wallHeight, 0.2]} texture={wallTex} />
        </group>
    )
}

function TShapeRoom({ props, wallTex, floorTex }: { props: RoomProps, wallTex?: THREE.Texture | null, floorTex?: THREE.Texture | null }) {
    const { wallHeight } = props
    return (
        <group>
            {/* Floors */}
            <mesh position={[0, -1.4, -3]}>
                <boxGeometry args={[14, 0.2, 6]} />
                <meshStandardMaterial color="#ffffff" map={floorTex || null} />
            </mesh>
            <mesh position={[0, -1.4, 3]}>
                <boxGeometry args={[6, 0.2, 6]} />
                <meshStandardMaterial color="#ffffff" map={floorTex || null} />
            </mesh>
            {/* Exterior Walls */}
            <Wall position={[0, (wallHeight / 2) - 1.5, -6]} scale={[14, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[-7, (wallHeight / 2) - 1.5, -3]} scale={[0.2, wallHeight, 6]} texture={wallTex} />
            <Wall position={[-3.5, (wallHeight / 2) - 1.5, 0]} scale={[7, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[3.5, (wallHeight / 2) - 1.5, 0]} scale={[7, wallHeight, 0.2]} texture={wallTex} />
            <Wall position={[7, (wallHeight / 2) - 1.5, -3]} scale={[0.2, wallHeight, 6]} texture={wallTex} />
            <Wall position={[-3, (wallHeight / 2) - 1.5, 3]} scale={[0.2, wallHeight, 6]} texture={wallTex} />
            <Wall position={[3, (wallHeight / 2) - 1.5, 3]} scale={[0.2, wallHeight, 6]} texture={wallTex} />
            <Wall position={[0, (wallHeight / 2) - 1.5, 6]} scale={[6, wallHeight, 0.2]} texture={wallTex} />
        </group>
    )
}

function CircularRoom({ props, wallTex, floorTex }: { props: RoomProps, wallTex?: THREE.Texture | null, floorTex?: THREE.Texture | null }) {
    const { wallHeight } = props
    const radius = 6
    const segments = 24
    const segmentAngle = (Math.PI * 2) / segments
    const segmentWidth = 2 * radius * Math.tan(segmentAngle / 2)

    return (
        <group>
            {/* Rotunda Floor */}
            <mesh position={[0, -1.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[radius, radius, 0.2, segments]} />
                <meshStandardMaterial color="#ffffff" map={floorTex || null} />
            </mesh>
            {/* Curved Walls (Segmented) */}
            {Array.from({ length: segments }).map((_, i) => {
                const angle = i * segmentAngle
                const x = Math.sin(angle) * radius
                const z = Math.cos(angle) * radius
                return (
                    <Wall
                        key={i}
                        position={[x, (wallHeight / 2) - 1.5, z]}
                        rotation={[0, angle, 0]}
                        scale={[segmentWidth, wallHeight, 0.2]}
                        texture={wallTex}
                    />
                )
            })}
        </group>
    )
}

function RoomMesh({ type, props, wallTex, floorTex }: { type: RoomType, props: RoomProps, wallTex?: THREE.Texture | null, floorTex?: THREE.Texture | null }) {
    if (type === "rectangle") return <RectangleRoom props={props} wallTex={wallTex} floorTex={floorTex} />
    if (type === "l-shape") return <LShapeRoom props={props} wallTex={wallTex} floorTex={floorTex} />
    if (type === "u-shape") return <UShapeRoom props={props} wallTex={wallTex} floorTex={floorTex} />
    if (type === "t-shape") return <TShapeRoom props={props} wallTex={wallTex} floorTex={floorTex} />
    if (type === "circular") return <CircularRoom props={props} wallTex={wallTex} floorTex={floorTex} />
    return <SquareRoom props={props} wallTex={wallTex} floorTex={floorTex} />
}

const cameraPositions: Record<RoomType, [number, number, number]> = {
    square: [12, 12, 12],
    rectangle: [15, 12, 12],
    "l-shape": [15, 15, 15],
    "u-shape": [15, 15, 15],
    "t-shape": [15, 15, 15],
    circular: [15, 15, 15],
}

function RoomContent({ roomType, roomProps }: { roomType: RoomType, roomProps: RoomProps }) {
    const textures = useTexture({
        "wall-1": wall1Img,
        "wall-2": wall2Img,
        "wall-3": wall3Img,
        "floor-1": floor1Img,
        "floor-2": floor2Img,
        "floor-3": floor3Img,
    })

    const wallTex = textures[roomProps.wallTexture as keyof typeof textures] || null
    const floorTex = textures[roomProps.floorTexture as keyof typeof textures] || null

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={1} />
            <gridHelper args={[50, 50, "#1e293b", "#0f172a"]} position={[0, -1.5, 0]} />
            <RoomMesh type={roomType} props={roomProps} wallTex={wallTex} floorTex={floorTex} />
            <FurnitureItem position={[0, 0.5, 0]} />
            <FurnitureItem position={[3, 0.5, 1]} />
            <OrbitControls />
        </>
    )
}

export default function RoomCanvas({ roomProps }: { roomProps: RoomProps }) {
    const [searchParams] = useSearchParams()
    const rawRoom = searchParams.get("room") ?? "square"
    const roomType = (["square", "rectangle", "l-shape", "u-shape", "t-shape", "circular"].includes(rawRoom) ? rawRoom : "square") as RoomType

    return (
        <div className="w-full h-full relative">
            <Canvas
                key={roomType + JSON.stringify(roomProps)}
                camera={{ position: cameraPositions[roomType], fov: 60 }}
                style={{ width: "100%", height: "100%", background: "#0f121c" }}
            >
                <Suspense fallback={null}>
                    <RoomContent roomType={roomType} roomProps={roomProps} />
                </Suspense>
            </Canvas>
        </div>
    )
}