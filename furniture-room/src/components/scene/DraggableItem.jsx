import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useState } from "react";

export default function DraggableItem({
  children,
  roomWidth,
  roomDepth,
  initialPosition,
  setIsDragging,
}) {

  const groupRef = useRef();

  const [selected, setSelected] = useState(false);

  const { camera, gl } = useThree();

  const dragging = useRef(false);

  const targetPosition = useRef(new THREE.Vector3(...initialPosition));

  const raycaster = new THREE.Raycaster();

  const mouse = new THREE.Vector2();

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);


  /* ================= START DRAG ================= */

  const onPointerDown = (e) => {

    e.stopPropagation();

    dragging.current = true;

    setIsDragging(true);

    gl.domElement.style.cursor = "grabbing";

  };


  /* ================= STOP DRAG ================= */

  const stopDrag = () => {

    dragging.current = false;

    setIsDragging(false);

    gl.domElement.style.cursor = "auto";

  };


  /* ================= ROTATE  ================= */

  const rotateObject = () => {

    if (!groupRef.current) return;

    groupRef.current.rotation.y += Math.PI / 2;

  };


  /* ================= GLOBAL POINTER MOVE ================= */

  const onPointerMove = (event) => {

    if (!dragging.current) return;

    const rect = gl.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersectPoint = new THREE.Vector3();

    raycaster.ray.intersectPlane(plane, intersectPoint);

    if (!intersectPoint) return;

    const maxX = roomWidth / 2 - 1;

    const maxZ = roomDepth / 2 - 1;

    const newX = THREE.MathUtils.clamp(intersectPoint.x, -maxX, maxX);

    const newZ = THREE.MathUtils.clamp(intersectPoint.z, -maxZ, maxZ);

    targetPosition.current.set(newX, targetPosition.current.y, newZ);

  };


  /* ================= GLOBAL EVENTS ================= */

  useEffect(() => {

    window.addEventListener("pointermove", onPointerMove);

    window.addEventListener("pointerup", stopDrag);

    return () => {

      window.removeEventListener("pointermove", onPointerMove);

      window.removeEventListener("pointerup", stopDrag);

    };

  }, []);


  /* ================= SMOOTH MOVEMENT ================= */

  useFrame(() => {

    if (!groupRef.current) return;

    groupRef.current.position.lerp(targetPosition.current, 0.15);

  });


  /* ================= RENDER ================= */

  return (

    <group
      ref={groupRef}
      position={initialPosition}
      onPointerDown={(e) => {
        onPointerDown(e);
        setSelected(true);
      }}
      
    >

      {children}

      {selected && (
        <mesh
          position={[0, 2, 0]}
          onClick={(e) => {
            e.stopPropagation();
            rotateObject();
          }}
        >
          <boxGeometry args={[0.5, 0.2, 0.5]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      )}

    </group>

  );

}