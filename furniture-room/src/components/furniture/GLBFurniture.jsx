import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export default function GLBFurniture({
  frameColor,
  cushionColor,
  fabricType,
}) {

  const gltf = useGLTF("/models/old_chair.glb");

  const fabric1 = useLoader(THREE.TextureLoader, "/textures/fabric1.jpg");
  const fabric2 = useLoader(THREE.TextureLoader, "/textures/fabric2.jpg");

  useEffect(() => {

    const selectedFabric =
      fabricType === "fabric1" ? fabric1 : fabric2;

    selectedFabric.wrapS = selectedFabric.wrapT = THREE.RepeatWrapping;

    selectedFabric.repeat.set(2, 2);

    selectedFabric.colorSpace = THREE.SRGBColorSpace;

    gltf.scene.traverse((child) => {

      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      child.material = new THREE.MeshStandardMaterial({
        color: cushionColor,
        map: selectedFabric,
        roughness: 0.6,
      });

    });

  }, [gltf, cushionColor, fabricType, fabric1, fabric2]);

  /* ================= FLOOR ALIGNMENT ================= */

  useEffect(() => {

    const box = new THREE.Box3().setFromObject(gltf.scene);

    const size = new THREE.Vector3();

    box.getSize(size);

    gltf.scene.position.y = size.y / 2;

  }, [gltf]);

  return (
    <group scale={2}>
      <primitive object={gltf.scene} />
    </group>
  );

}