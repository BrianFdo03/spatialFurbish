import { useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export default function Floor({ roomWidth, roomDepth, floorType, floorColor }) {

  const cementTexture = useLoader(THREE.TextureLoader, "/textures/cement.jpg");
  const tileTexture = useLoader(THREE.TextureLoader, "/textures/tile.jpg");
  const woodTexture = useLoader(THREE.TextureLoader, "/textures/wood.jpg");

  useEffect(() => {

    [cementTexture, tileTexture, woodTexture].forEach((texture) => {

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.colorSpace = THREE.SRGBColorSpace;

      texture.repeat.set(roomWidth / 2, roomDepth / 2);

      texture.needsUpdate = true;

    });

  }, [roomWidth, roomDepth, cementTexture, tileTexture, woodTexture]);

  const getMaterial = () => {

    if (floorType === "cement") return { map: cementTexture };

    if (floorType === "tile") return { map: tileTexture };

    if (floorType === "wood") return { map: woodTexture };

    return { color: floorColor };

  };

  return (

    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>

      <planeGeometry args={[roomWidth, roomDepth]} />

      <meshStandardMaterial {...getMaterial()} />

    </mesh>

  );
}