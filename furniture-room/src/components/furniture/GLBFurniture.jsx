import { useGLTF } from "@react-three/drei";
import { useLoader, useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GLBFurniture({
  frameColor,
  cushionColor,
  fabricType,
  roomWidth,
  roomDepth,
  setIsDragging,
}) {

  const groupRef = useRef();

  const { camera, gl } = useThree();

  const gltf = useGLTF("/models/old_chair.glb");

  const fabric1 = useLoader(THREE.TextureLoader, "/textures/fabric1.jpg");

  const fabric2 = useLoader(THREE.TextureLoader, "/textures/fabric2.jpg");

  const dragging = useRef(false);

  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));

  const raycaster = new THREE.Raycaster();

  const mouse = new THREE.Vector2();

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);


  useEffect(() => {

    const box = new THREE.Box3().setFromObject(gltf.scene);

    const size = new THREE.Vector3();

    box.getSize(size);

    gltf.scene.position.y = size.y / 2;

  }, [gltf]);


  useEffect(() => {

    const selectedFabric = fabricType === "fabric1" ? fabric1 : fabric2;

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


  const onPointerDown = (e) => {

    e.stopPropagation();

    dragging.current = true;

    setIsDragging(true);

    gl.domElement.style.cursor = "grabbing";

  };


  const onPointerUp = () => {

    dragging.current = false;

    setIsDragging(false);

    gl.domElement.style.cursor = "auto";

  };


  const onPointerMove = (event) => {

    if (!dragging.current) return;

    const rect = gl.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersectPoint = new THREE.Vector3();

    raycaster.ray.intersectPlane(plane, intersectPoint);

    if (intersectPoint) {

      const maxX = roomWidth / 2 - 1;

      const maxZ = roomDepth / 2 - 1;

      targetPosition.current.x = THREE.MathUtils.clamp(
        intersectPoint.x,
        -maxX,
        maxX
      );

      targetPosition.current.z = THREE.MathUtils.clamp(
        intersectPoint.z,
        -maxZ,
        maxZ
      );
    }
  };

  useFrame(() => {

    if (!groupRef.current) return;

    groupRef.current.position.lerp(targetPosition.current, 0.2);

  });

  return (

    <group
      ref={groupRef}
      scale={2}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >

      <primitive object={gltf.scene} />

    </group>

  );
}