import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

function GLTFModel({ url, textureUrl }: { url: string; textureUrl?: string }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    if (scene && textureUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(textureUrl, (texture) => {
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
        
        // Sometimes the texture needs to repeat correctly
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        // Optionally scale the texture if it's too large/small
        // texture.repeat.set(2, 2); 

        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material) {
              child.material.map = texture;
              // Ensure the underlying color is white so the texture holds its true color
              if (child.material.color) {
                  child.material.color.set(0xffffff);
              }
              child.material.needsUpdate = true;
            }
          }
        });
      });
    }
  }, [scene, textureUrl]);

  return (
    <Center>
      <primitive object={scene} scale={1} />
    </Center>
  );
}

export function ModelViewer({ url, textureUrl }: { url: string; textureUrl?: string }) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [2, 1, 3], fov: 45 }}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        <GLTFModel url={url} textureUrl={textureUrl} />

        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
