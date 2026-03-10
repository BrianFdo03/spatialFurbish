import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useEffect } from "react";

import Floor from "./Floor";
import DraggableItem from "./DraggableItem";
import GLBFurniture from "../furniture/GLBFurniture";

import { furnitureCatalog } from "../../data/furnitureData";

import TV from "../objects/TV";
import FlowerVase from "../objects/FlowerVase";
import Table from "../objects/Table";


/* ================= CAMERA CONTROLLER ================= */

function CameraController({ viewMode }) {

  const { camera, controls } = useThree();

  useEffect(() => {

    if (viewMode === "2D") {

      /* Bird-eye camera */

      camera.position.set(0, 25, 0);
      camera.up.set(0, 0, -1);   // ensures correct orientation
      camera.lookAt(0, 0, 0);

      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }

    } 
    else {

      /* Normal 3D view */

      camera.position.set(7, 6, 7);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 0);

      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }

    }

  }, [viewMode, camera, controls]);

  return null;
}


/* ================= SCENE CANVAS ================= */

export default function SceneCanvas({

  viewMode,
  sceneObjects,

  lightOn,
  roomWidth,
  roomDepth,
  roomHeight,

  floorType,
  floorColor,

  backWallColor,
  leftWallColor,
  rightWallColor,

  setIsDragging,
  isDragging,

  showTV,
  showVase,
  showTable,

  objectsRef,

  selectedObject,
  setSelectedObject,

  selectedType,
  setSelectedType,

  selectedObjectRef,
  setSelectedObjectRef

}) {

  return (

    <div style={{ width: "100%", height: "100%" }}>

      <Canvas
        shadows
        camera={{ fov: 60 }}
        style={{ width: "100%", height: "100%" }}

        onPointerMissed={() => {

          setSelectedObject(null);
          setSelectedType(null);
          setSelectedObjectRef(null);

        }}
      >

        <CameraController viewMode={viewMode} />

        {/* ================= LIGHT ================= */}

        {lightOn && (

          <directionalLight
            position={[8, 10, 8]}
            intensity={1.3}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

        )}

        <ambientLight intensity={0.5} />


        {/* ================= SHADOW ================= */}

        {viewMode === "3D" && (

          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.6}
            scale={50}
            blur={2}
            far={20}
          />

        )}


        {/* ================= FLOOR ================= */}

        <Floor
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          floorType={floorType}
          floorColor={floorColor}

          onClick={() => {

            setSelectedObject(null);
            setSelectedType(null);
            setSelectedObjectRef(null);

          }}
        />


        {/* ================= BACK WALL ================= */}

        {viewMode === "3D" && (

          <mesh
            position={[0, roomHeight / 2, -roomDepth / 2]}
            receiveShadow

            onClick={() => {

              setSelectedObject(null);
              setSelectedType(null);
              setSelectedObjectRef(null);

            }}
          >

            <boxGeometry args={[roomWidth, roomHeight, 0.2]} />

            <meshStandardMaterial color={backWallColor} />

          </mesh>

        )}


        {/* ================= LEFT WALL ================= */}

        {viewMode === "3D" && (

          <mesh
            position={[-roomWidth / 2, roomHeight / 2, 0]}
            receiveShadow

            onClick={() => {

              setSelectedObject(null);
              setSelectedType(null);
              setSelectedObjectRef(null);

            }}
          >

            <boxGeometry args={[0.2, roomHeight, roomDepth]} />

            <meshStandardMaterial color={leftWallColor} />

          </mesh>

        )}


        {/* ================= DYNAMIC FURNITURE ================= */}

        {sceneObjects.map((obj) => {

          const furniture = furnitureCatalog.find(
            f => f.id === obj.type
          );

          if (!furniture) return null;

          return (

            <DraggableItem
              key={obj.id}

              roomWidth={roomWidth}
              roomDepth={roomDepth}

              initialPosition={[0, furniture.yOffset || 0, 0]}

              setIsDragging={setIsDragging}

              objectsRef={objectsRef}

              setSelectedObjectRef={setSelectedObjectRef}

              userData={{ id: obj.id }}

              onClick={() => {

                setSelectedObject(obj.type);
                setSelectedType("furniture");

              }}

            >

              {furniture.component === "TV" && (
              <TV roomHeight={roomHeight} roomDepth={roomDepth} />
              )}

              {furniture.component === "Vase" && (
              <FlowerVase />
              )}

              {furniture.component === "Table" && (
              <Table />
              )}

              {furniture.model && (
              <GLBFurniture
              modelPath={furniture.model}
              scale={furniture.scale}
              yOffset={furniture.yOffset}
              cushionColor={obj.cushionColor}
              fabricType={obj.fabricType}
              />
              )}

            </DraggableItem>

          );

        })}


       

        {/* ================= CONTROLS ================= */}

        <OrbitControls

          makeDefault

          enabled={!isDragging}

          target={[0, 0, 0]}

          /* Disable rotation in 2D */

          enableRotate={viewMode === "3D"}

          enablePan={true}

          enableZoom={true}

          /* lock vertical rotation */

          minPolarAngle={viewMode === "2D" ? Math.PI / 2 : 0}
          maxPolarAngle={viewMode === "2D" ? Math.PI / 2 : Math.PI / 2.05}

          /* zoom limits */

          minDistance={viewMode === "2D" ? 10 : 4}
          maxDistance={viewMode === "2D" ? 40 : 15}

        />

      </Canvas>

    </div>

  );

}