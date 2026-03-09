import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function DraggableItem({
  children,
  roomWidth,
  roomDepth,
  initialPosition,
  setIsDragging,
  objectsRef,
  onClick,
  setSelectedObjectRef
}) {

  const groupRef = useRef();
  const boundingBox = useRef(new THREE.Box3());

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


  /* ================= COLLISION CHECK ================= */

  const checkCollision = (newPosition) => {

    if (!groupRef.current) return false;

    const newBox = boundingBox.current;

    newBox.setFromObject(groupRef.current);

    const offset = new THREE.Vector3(
      newPosition.x - groupRef.current.position.x,
      0,
      newPosition.z - groupRef.current.position.z
    );

    newBox.translate(offset);

    for (let obj of objectsRef.current) {

      if (!obj.current) continue;

      if (obj === groupRef) continue;

      const otherBox = new THREE.Box3().setFromObject(obj.current);

      if (newBox.intersectsBox(otherBox)) {

        return true;

      }

    }

    return false;

  };


  /* ================= POINTER MOVE ================= */

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

    const newPosition = new THREE.Vector3(newX, targetPosition.current.y, newZ);

    if (!checkCollision(newPosition)) {

      targetPosition.current.copy(newPosition);

    }

  };


  /* ================= GLOBAL EVENTS ================= */

  useEffect(() => {

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDrag);

    return () => {

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDrag);

    };

  }, [objectsRef]);


  /* ================= SMOOTH MOVEMENT ================= */

  useFrame(() => {

    if (!groupRef.current) return;

    groupRef.current.position.lerp(targetPosition.current, 0.15);

  });


  /* ================= REGISTER OBJECT ================= */

  useEffect(() => {

    if (!groupRef.current || !objectsRef) return;

    objectsRef.current.push(groupRef);

    return () => {

      objectsRef.current = objectsRef.current.filter(
        (obj) => obj !== groupRef
      );

    };

  }, [objectsRef]);


  /* ================= RENDER ================= */

  return (

    <group
      ref={groupRef}
      position={initialPosition}

      onPointerDown={(e) => {

        onPointerDown(e);

        if (onClick) onClick();

        if (setSelectedObjectRef) {

          setSelectedObjectRef(groupRef);

        }

      }}

    >

      {children}

    </group>

  );

}