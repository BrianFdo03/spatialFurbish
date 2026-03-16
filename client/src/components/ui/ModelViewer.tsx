import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei";
import { useEffect, Suspense, Component, type ReactNode } from "react";
import * as THREE from "three";

// Catches Three.js / GLTF errors so the page doesn't vanish
class ModelErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
          3D model could not be loaded.
        </div>
      );
    }
    return this.props.children;
  }
}

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
  // Never render the 3D canvas if URL is empty — prevents useGLTF crash
  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
        No 3D model available.
      </div>
    );
  }

  return (
    <ModelErrorBoundary>
      <div className="w-full h-full min-h-[300px]">
        <Canvas camera={{ position: [2, 1, 3], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Suspense fallback={null}>
            <GLTFModel url={url} textureUrl={textureUrl} />
          </Suspense>
          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
    </ModelErrorBoundary>
  );
}
