import { useGLTF, Edges } from "@react-three/drei"
import * as THREE from "three"
const oldChairModel = new URL('../../assets/Furniture/Chair.glb', import.meta.url).href

interface FurnitureProps {
    position: [number, number, number]
    rotation?: [number, number, number]
    onPointerDown?: (e: any) => void
    isSelected?: boolean
}

export default function FurnitureItem({
    position,
    rotation = [0, 0, 0],
    onPointerDown,
    isSelected
}: FurnitureProps) {
    const { scene } = useGLTF(oldChairModel)
    
    // Ensure the scene is ready and clone it
    if (!scene) return null
    const clonedScene = scene.clone()

    // Calculate bounding box to find the bottom of the model
    const box = new THREE.Box3().setFromObject(clonedScene)
    const bottomY = box.min.y

    return (
        <group 
            position={position} 
            rotation={rotation}
            scale={[1.5, 1.5, 1.5]}
            onPointerDown={onPointerDown}
        >
            {/* Offset the primitive by -bottomY to ground it */}
            <primitive object={clonedScene} position={[0, -bottomY, 0]} />
            
            {isSelected && (
                <mesh position={[0, box.getCenter(new THREE.Vector3()).y - bottomY, 0]}>
                    <boxGeometry args={[box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z]} />
                    <meshStandardMaterial transparent opacity={0} />
                    <Edges 
                        color="#3B82F6" 
                        lineWidth={3}
                        threshold={15}
                    />
                </mesh>
            )}
        </group>
    )
}


// Removed preload to avoid potential Vite module loading issues