import { useGLTF, Edges, useTexture } from "@react-three/drei"
import * as THREE from "three"

interface FurnitureProps {
  modelUrl: string
  position: [number, number, number]
  rotation?: [number, number, number]
  onPointerDown?: (e: any) => void
  isSelected?: boolean
  color?: string
  texture?: string
}

export default function FurnitureItem({
  modelUrl,
  position,
  rotation = [0, 0, 0],
  onPointerDown,
  isSelected,
  color,
  texture
}: FurnitureProps) {

  const { scene } = useGLTF(modelUrl)

  const textureMap = texture ? useTexture(texture) : null

  if (!scene) return null

  // Clone scene to allow multiple instances
  const clonedScene = scene.clone()

  clonedScene.traverse((child: any) => {

  if(child.isMesh){

    child.material = child.material.clone()

    if(textureMap){
      child.material.map = textureMap
      child.material.needsUpdate = true
    }

    if(color){
      child.material.color = new THREE.Color(color)
    }

  }

})
  
  // Apply selected color to all meshes
  clonedScene.traverse((child: any) => {
    if (child.isMesh && child.material) {
      child.material = child.material.clone() // prevent shared material bug
      child.material.color = new THREE.Color(color || "#ffffff")
  }
})

  // Compute bounding box
  const box = new THREE.Box3().setFromObject(clonedScene)
  const bottomY = box.min.y

  const size = new THREE.Vector3()
  box.getSize(size)

  const center = new THREE.Vector3()
  box.getCenter(center)

  return (
    <group
      position={position}
      rotation={rotation}
      scale={[1.5, 1.5, 1.5]}
      onPointerDown={onPointerDown}
    >
      {/* Ground model correctly */}
      <primitive object={clonedScene} position={[0, -bottomY, 0]} />

      

      {/* Selection outline */}
      {isSelected && (
        <mesh position={[0, center.y - bottomY, 0]}>
          <boxGeometry args={[size.x, size.y, size.z]} />
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