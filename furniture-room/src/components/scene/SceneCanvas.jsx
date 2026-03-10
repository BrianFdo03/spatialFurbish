import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useEffect } from "react";

import Floor from "./Floor";
import DraggableItem from "./DraggableItem";
import GLBFurniture from "../furniture/GLBFurniture";

import TV from "../objects/TV";
import FlowerVase from "../objects/FlowerVase";
import Table from "../objects/Table";


/* ================= CAMERA CONTROLLER ================= */

function CameraController() {

  const { camera } = useThree();

  useEffect(() => {

    camera.position.set(7, 6, 7);
    camera.lookAt(0, 0, 0);

  }, [camera]);

  return null;

}


/* ================= SCENE CANVAS ================= */

export default function SceneCanvas({

  lightOn,
  roomWidth,
  roomDepth,
  roomHeight,
  floorType,
  floorColor,
  backWallColor,
  leftWallColor,
  rightWallColor,

  cushionColor,
  fabricType,

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
        onPointerMissed={()=>{
          setSelectedObject(null)
          setSelectedType(null)
          setSelectedObjectRef(null)
        }}
      >

        <CameraController />


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


        {/* ================= CONTACT SHADOW ================= */}

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.6}
          scale={50}
          blur={2}
          far={20}
        />


        {/* ================= FLOOR ================= */}

        <Floor
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          floorType={floorType}
          floorColor={floorColor}

          onClick={()=>{

            setSelectedObject(null)
            setSelectedType(null)
            setSelectedObjectRef(null)
          }}
        />


        {/* ================= BACK WALL ================= */}

        <mesh
          position={[0, roomHeight / 2, -roomDepth / 2]}
          receiveShadow

          onClick={()=>{

            setSelectedObject(null)
            setSelectedType(null)
            setSelectedObjectRef(null)
          }}

        >

          <boxGeometry args={[roomWidth, roomHeight, 0.2]} />

          <meshStandardMaterial color={backWallColor} />

        </mesh>


        {/* ================= LEFT WALL ================= */}

        <mesh
          position={[-roomWidth / 2, roomHeight / 2, 0]}
          receiveShadow

          onClick={()=>{

            setSelectedObject(null)
            setSelectedType(null)
            setSelectedObjectRef(null)
          }}

        >

          <boxGeometry args={[0.2, roomHeight, roomDepth]} />

          <meshStandardMaterial color={leftWallColor} />

        </mesh>



        {/* ================= CHAIR ================= */}

        <DraggableItem
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          initialPosition={[0, 0, 0]}
          setIsDragging={setIsDragging}
          objectsRef={objectsRef}

          setSelectedObjectRef={setSelectedObjectRef}

          onClick={() => {

            setSelectedObject("chair");
            setSelectedType("furniture");

          }}

        >

          <GLBFurniture
            cushionColor={cushionColor}
            fabricType={fabricType}
          />

        </DraggableItem>



        {/* ================= TV ================= */}

        {showTV && (

          <DraggableItem
            roomWidth={roomWidth}
            roomDepth={roomDepth}
            initialPosition={[0, 1.5, -roomDepth / 2 + 0.3]}
            setIsDragging={setIsDragging}
            objectsRef={objectsRef}

            setSelectedObjectRef={setSelectedObjectRef}

            onClick={() => {

              setSelectedObject("tv");
              setSelectedType("furniture");

            }}

          >

            <TV roomHeight={roomHeight} roomDepth={roomDepth} />

          </DraggableItem>

        )}



        {/* ================= VASE ================= */}

        {showVase && (

          <DraggableItem
            roomWidth={roomWidth}
            roomDepth={roomDepth}
            initialPosition={[0, 0, -roomDepth / 2 + 0.3]}
            setIsDragging={setIsDragging}
            objectsRef={objectsRef}

            setSelectedObjectRef={setSelectedObjectRef}

            onClick={() => {

              setSelectedObject("vase");
              setSelectedType("furniture");

            }}

          >

            <FlowerVase />

          </DraggableItem>

        )}



        {/* ================= TABLE ================= */}

        {showTable && (

          <DraggableItem
            roomWidth={roomWidth}
            roomDepth={roomDepth}
            initialPosition={[0, 0, -roomDepth / 2 + 0.3]}
            setIsDragging={setIsDragging}
            objectsRef={objectsRef}

            setSelectedObjectRef={setSelectedObjectRef}

            onClick={() => {

              setSelectedObject("table");
              setSelectedType("furniture");

            }}

          >

            <Table />

          </DraggableItem>

        )}

        



        {/* ================= CONTROLS ================= */}

        <OrbitControls
          enabled={!isDragging}
          target={[0, 0, 0]}
          minDistance={4}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.05}
        />


      </Canvas>

    </div>

  );

}