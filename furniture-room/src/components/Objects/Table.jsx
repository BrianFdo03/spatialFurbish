export default function Table() {

  return (

    <group>

      {/* TABLE TOP */}

      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.3, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* LEG 1 */}

      <mesh position={[-1.8, 0.35, -0.8]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* LEG 2 */}

      <mesh position={[1.8, 0.35, -0.8]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* LEG 3 */}

      <mesh position={[-1.8, 0.35, 0.8]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* LEG 4 */}

      <mesh position={[1.8, 0.35, 0.8]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

    </group>

  );

}