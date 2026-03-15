import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
}

export function ModelViewer({ url }: { url: string }) {
  return (
    <div className="w-32 h-32">
      <Canvas camera={{ position: [2, 2, 2] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />

        <GLTFModel url={url} />

        <OrbitControls />
      </Canvas>
    </div>
  );
}
