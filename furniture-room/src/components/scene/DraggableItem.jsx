import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function DraggableItem({
  children,
  roomWidth,
  roomDepth,
  initialPosition,
  setIsDragging,
}) {

  const groupRef = useRef();

  const { camera, gl } = useThree();

  const dragging = useRef(false);

  const targetPosition = useRef(new THREE.Vector3(...initialPosition));

  const raycaster = new THREE.Raycaster();

  const mouse = new THREE.Vector2();

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);


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
      position={initialPosition}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >

      {children}

    </group>

  );
}