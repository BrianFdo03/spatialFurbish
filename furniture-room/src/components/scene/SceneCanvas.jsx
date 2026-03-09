import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";

import Floor from "./Floor";
import DraggableItem from "./DraggableItem";
import GLBFurniture from "../furniture/GLBFurniture";

import TV from "../objects/TV";
import FlowerVase from "../objects/FlowerVase";
import Table from "../objects/Table";

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
  frameColor,
  cushionColor,
  fabricType,
  setIsDragging,
  isDragging,
  showTV,
  showVase,
  showTable
}) {

  return (

    <div style={{ flex: 1 }}>

      <Canvas
        shadows
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [15, 10, 15], fov: 50 }}
      >

        {/* LIGHT */}

        {lightOn && (
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
        )}

        <ambientLight intensity={0.6} />

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.6}
          scale={50}
          blur={2}
          far={20}
        />

        {/* FLOOR */}

        <Floor
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          floorType={floorType}
          floorColor={floorColor}
        />

        {/* BACK WALL */}

        <mesh position={[0, roomHeight / 2, -roomDepth / 2]} receiveShadow>

          <boxGeometry args={[roomWidth, roomHeight, 0.2]} />

          <meshStandardMaterial color={backWallColor} />

        </mesh>

        {/* LEFT WALL */}

        <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} receiveShadow>

          <boxGeometry args={[0.2, roomHeight, roomDepth]} />

          <meshStandardMaterial color={leftWallColor} />

        </mesh>

        {/* GLB MODEL */}

        <GLBFurniture
          frameColor={frameColor}
          cushionColor={cushionColor}
          fabricType={fabricType}
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          setIsDragging={setIsDragging}
        />

        {/* TV */}

        {showTV && (

          <DraggableItem
            roomWidth={roomWidth}
            roomDepth={roomDepth}
            initialPosition={[0, 1.5, -roomDepth / 2 + 0.3]}
            setIsDragging={setIsDragging}
          >

            <TV roomHeight={roomHeight} roomDepth={roomDepth} />

          </DraggableItem>

        )}

        {/* VASE */}

        {showVase && (

          <DraggableItem
            roomWidth={roomWidth}
            roomDepth={roomDepth}
            initialPosition={[0, 0, -roomDepth / 2 + 0.3]}
            setIsDragging={setIsDragging}
          >

            <FlowerVase />

          </DraggableItem>

        )}

        {/* TABLE */}

        {showTable && (

          <DraggableItem
            roomWidth={roomWidth}
            roomDepth={roomDepth}
            initialPosition={[0, 0, -roomDepth / 2 + 0.3]}
            setIsDragging={setIsDragging}
          >

            <Table />

          </DraggableItem>

        )}

        {/* CONTROLS */}

        <OrbitControls enabled={!isDragging} />

      </Canvas>

    </div>

  );
}