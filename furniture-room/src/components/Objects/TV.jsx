export default function TV() {

  return (
    <mesh castShadow receiveShadow>

      <boxGeometry args={[3, 2, 0.1]} />

      <meshStandardMaterial color="black" />

    </mesh>
  );

}