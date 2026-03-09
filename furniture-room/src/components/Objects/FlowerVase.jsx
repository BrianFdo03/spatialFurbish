export default function FlowerVase() {

  return (

    <mesh position={[2, 0.5, 2]}>

      <cylinderGeometry args={[0.3, 0.3, 1, 32]} />

      <meshStandardMaterial color="pink" />

    </mesh>

  );

}