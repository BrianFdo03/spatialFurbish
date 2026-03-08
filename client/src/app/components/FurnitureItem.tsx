interface FurnitureProps {
    position: [number, number, number]
    color?: string
}

export default function FurnitureItem({
    position,
    color = "#8D7154"
}: FurnitureProps) {

    return (
        <mesh position={position}>
            <boxGeometry args={[2, 1, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}