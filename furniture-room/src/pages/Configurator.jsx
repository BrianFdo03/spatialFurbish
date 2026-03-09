import { useState, useEffect, useRef } from "react";

import Sidebar from "../components/layout/Sidebar";
import SceneCanvas from "../components/scene/SceneCanvas";

export default function Configurator() {

  // ================= WALL COLORS =================

  const [backWallColor, setBackWallColor] = useState("#ffffff");
  const [leftWallColor, setLeftWallColor] = useState("#f5f5f5");
  const [rightWallColor, setRightWallColor] = useState("#eeeeee");


  // ================= ROOM SIZE =================

  const [roomWidth, setRoomWidth] = useState(10);
  const [roomDepth, setRoomDepth] = useState(10);
  const [roomHeight, setRoomHeight] = useState(5);


  // ================= FLOOR =================

  const [floorType, setFloorType] = useState("cement");
  const [floorColor, setFloorColor] = useState("#cccccc");


  // ================= FURNITURE =================

  const [furnitureColor, setFurnitureColor] = useState("#8B4513");

  const [frameColor, setFrameColor] = useState("#8B4513");
  const [cushionColor, setCushionColor] = useState("#ffffff");
  const [fabricType, setFabricType] = useState("fabric1");


  // ================= LIGHT =================

  const [lightOn, setLightOn] = useState(true);
  const [isDragging, setIsDragging] = useState(false);


  // ================= ROOM TYPE =================

  const [roomType, setRoomType] = useState("living");


  // ================= OBJECT VISIBILITY =================

  const [showTV, setShowTV] = useState(false);
  const [showVase, setShowVase] = useState(false);
  const [showTable, setShowTable] = useState(false);


  const objectsRef = useRef([]);


  // ================= ROOM PRESETS =================

  useEffect(() => {

    if (roomType === "living") {
      setShowTV(true);
      setShowVase(true);
      setShowTable(false);
    }

    if (roomType === "dining") {
      setShowTV(false);
      setShowVase(false);
      setShowTable(true);
    }

    if (roomType === "bedroom") {
      setShowTV(false);
      setShowVase(true);
      setShowTable(false);
    }

    if (roomType === "family") {
      setShowTV(true);
      setShowVase(true);
      setShowTable(true);
    }

    if (roomType === "kitchen") {
      setShowTV(false);
      setShowVase(false);
      setShowTable(true);
    }

  }, [roomType]);


  // ================= UI =================

  return (

    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#121212",
      }}
    >

      {/* SIDEBAR */}

      <Sidebar

        roomType={roomType}
        setRoomType={setRoomType}

        roomWidth={roomWidth}
        setRoomWidth={setRoomWidth}

        roomDepth={roomDepth}
        setRoomDepth={setRoomDepth}

        roomHeight={roomHeight}
        setRoomHeight={setRoomHeight}

        floorType={floorType}
        setFloorType={setFloorType}

        floorColor={floorColor}
        setFloorColor={setFloorColor}

        backWallColor={backWallColor}
        setBackWallColor={setBackWallColor}

        leftWallColor={leftWallColor}
        setLeftWallColor={setLeftWallColor}

        rightWallColor={rightWallColor}
        setRightWallColor={setRightWallColor}

        furnitureColor={furnitureColor}
        setFurnitureColor={setFurnitureColor}

        frameColor={frameColor}
        setFrameColor={setFrameColor}

        cushionColor={cushionColor}
        setCushionColor={setCushionColor}

        fabricType={fabricType}
        setFabricType={setFabricType}

        showTV={showTV}
        setShowTV={setShowTV}

        showVase={showVase}
        setShowVase={setShowVase}

        showTable={showTable}
        setShowTable={setShowTable}

        lightOn={lightOn}
        setLightOn={setLightOn}

      />


      {/* 3D SCENE */}

      <SceneCanvas

        lightOn={lightOn}

        roomWidth={roomWidth}
        roomDepth={roomDepth}
        roomHeight={roomHeight}

        floorType={floorType}
        floorColor={floorColor}

        backWallColor={backWallColor}
        leftWallColor={leftWallColor}
        rightWallColor={rightWallColor}

        frameColor={frameColor}
        cushionColor={cushionColor}
        fabricType={fabricType}

        setIsDragging={setIsDragging}
        isDragging={isDragging}

        showTV={showTV}
        showVase={showVase}
        showTable={showTable}

      />

    </div>

  );

}