import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GLBFurniture({
  modelPath,
  scale = 1,
  yOffset = 0,
  cushionColor,
  fabricType
}) {

  const groupRef = useRef();

  const gltf = useGLTF(modelPath);

  const fabric1 = useLoader(THREE.TextureLoader, "/textures/fabric1.jpg");
  const fabric2 = useLoader(THREE.TextureLoader, "/textures/fabric2.jpg");



  /* ================= MODEL NORMALIZATION ================= */


    useEffect(() => {

      const model = gltf.scene;

      // reset transforms first
      model.position.set(0,0,0);

      // apply scale first
      model.scale.setScalar(scale);

      // compute bounding box AFTER scaling
      const box = new THREE.Box3().setFromObject(model);

      const size = new THREE.Vector3();
      const center = new THREE.Vector3();

      box.getSize(size);
      box.getCenter(center);

      // center horizontally
      model.position.x = -center.x;
      model.position.z = -center.z;

      // place bottom on floor
      const bottom = box.min.y;
      model.position.y = -bottom;

    }, [gltf, scale]);



  /* ================= MATERIAL CUSTOMIZATION ================= */

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
        roughness: 0.7
      });

    });

  }, [gltf, cushionColor, fabricType, fabric1, fabric2]);



  return (

    <group 
    ref={groupRef}
      scale={scale}
      position={[0,yOffset,0]}
    >
      <primitive object={gltf.scene} />
    </group>

  );

}