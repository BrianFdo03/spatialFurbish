"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import FurnitureItem from "./FurnitureItem"



function Room() {
    return (
        <mesh>
            <boxGeometry args={[10, 3, 10]} />
            <meshStandardMaterial color="#F1EADB" />
        </mesh>
    )
}

export default function RoomCanvas() {
    return (
        <Canvas camera={{ position: [5, 5, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />

            <Room />
            <FurnitureItem position={[0, 0.5, 0]} />
            <FurnitureItem position={[3, 0.5, 1]} />

            <OrbitControls />
        </Canvas>
    )
}