import { useState, useEffect, useRef } from "react";

import Header from "../components/layout/Header";
import FurnitureSidebar from "../components/layout/FurnitureSidebar";
import RightSidebar from "../components/layout/RightSidebar";
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

  // ================= OBJECT REFERENCES =================

  const objectsRef = useRef([]);

  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [selectedObjectRef, setSelectedObjectRef] = useState(null);

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

  const [viewMode, setViewMode] = useState("3D");

  return (

    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw" }}>

      {/* HEADER */}
      <Header viewMode={viewMode} setViewMode={setViewMode} />

      {/* MAIN CONTENT */}

      <div style={{ display: "flex", flex: 1, height: "100%" }}>

        {/* LEFT SIDEBAR */}
        <FurnitureSidebar />

        {/* CENTER CANVAS */}

        <div style={{ flex: 1, height: "100%" }}>

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

            cushionColor={cushionColor}
            fabricType={fabricType}

            setIsDragging={setIsDragging}
            isDragging={isDragging}

            showTV={showTV}
            showVase={showVase}
            showTable={showTable}

            objectsRef={objectsRef}

            selectedObject={selectedObject}
            setSelectedObject={setSelectedObject}

            selectedType={selectedType}
            setSelectedType={setSelectedType}

            selectedObjectRef={selectedObjectRef}
            setSelectedObjectRef={setSelectedObjectRef}
          />

        </div>

        {/* RIGHT SIDEBAR */}

        <RightSidebar
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

          selectedObject={selectedObject}
          selectedType={selectedType}
          selectedObjectRef={selectedObjectRef}

          setSelectedObject={setSelectedObject}
        />

      </div>

    </div>

  );

}