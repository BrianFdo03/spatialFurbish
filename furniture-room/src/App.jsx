// ================= IMPORTS =================
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { ContactShadows } from "@react-three/drei";

/* =========================================================
   FLOOR COMPONENT (Cement / Tile / Wood / Color)
========================================================= */
function Floor({ roomWidth, roomDepth, floorType, floorColor }) {
  // Load textures for different floor types
  const cementTexture = useLoader(THREE.TextureLoader, "/textures/cement.jpg");
  const tileTexture = useLoader(THREE.TextureLoader, "/textures/tile.jpg");
  const woodTexture = useLoader(THREE.TextureLoader, "/textures/wood.jpg");

  // Apply texture settings when room dimensions or textures change
  useEffect(() => {
    [cementTexture, tileTexture, woodTexture].forEach((texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      // Repeat texture based on room size to maintain scale
      texture.repeat.set(roomWidth / 2, roomDepth / 2);
      texture.needsUpdate = true;
    });
  }, [roomWidth, roomDepth, cementTexture, tileTexture, woodTexture]);

  // Determine which material to apply based on selected floor type
  const getMaterial = () => {
    if (floorType === "cement") return { map: cementTexture };
    if (floorType === "tile") return { map: tileTexture };
    if (floorType === "wood") return { map: woodTexture };
    // Fallback to solid color if no texture is selected
    return { color: floorColor };
  };

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[roomWidth, roomDepth]} />
      <meshStandardMaterial {...getMaterial()} />
    </mesh>
  );
}

/* =========================================================
   DRAGGABLE ITEM WRAPPER
   Allows any child mesh to be dragged across the floor plane
========================================================= */
function DraggableItem({
  children,
  roomWidth,
  roomDepth,
  initialPosition,
  setIsDragging,
}) {
  const groupRef = useRef();
  const { camera, gl } = useThree();

  // State refs for dragging logic
  const dragging = useRef(false);
  const targetPosition = useRef(new THREE.Vector3(...initialPosition));

  // Raycaster setup for mouse-to-3D space translation
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  // --- Pointer Events ---

  // Start drag
  const onPointerDown = (e) => {
    e.stopPropagation();
    dragging.current = true;
    setIsDragging(true);
    gl.domElement.style.cursor = "grabbing";
  };

  // Stop drag
  const onPointerUp = () => {
    dragging.current = false;
    setIsDragging(false);
    gl.domElement.style.cursor = "auto";
  };

  // Update target position based on mouse movement
  const onPointerMove = (event) => {
    if (!dragging.current) return;

    const rect = gl.domElement.getBoundingClientRect();

    // Normalize mouse coordinates
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectPoint);

    if (intersectPoint) {
      // Keep the item within the room boundaries
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

  // Smooth movement interpolation (runs every frame)
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

/* =========================================================
   GLB FURNITURE COMPONENT
   Loads and renders a custom 3D model with dynamic materials
========================================================= */
function GLBFurniture({
  frameColor,
  cushionColor,
  fabricType,
  roomWidth,
  roomDepth,
  setIsDragging,
}) {
  const groupRef = useRef();
  const { camera, gl } = useThree();

  // Load 3D model and textures
  const gltf = useGLTF("/models/old_chair.glb");
  const fabric1 = useLoader(THREE.TextureLoader, "/textures/fabric1.jpg");
  const fabric2 = useLoader(THREE.TextureLoader, "/textures/fabric2.jpg");

  // Dragging state and raycaster setup
  const dragging = useRef(false);
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  // ================= FLOOR ALIGNMENT =================
  // Ensures the model sits exactly on the floor plane
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    gltf.scene.position.y = size.y / 2;
  }, [gltf]);

  // ================= MATERIAL CUSTOMIZATION =================
  // Applies selected textures and colors to the model meshes
  useEffect(() => {
    const selectedFabric = fabricType === "fabric1" ? fabric1 : fabric2;

    selectedFabric.wrapS = selectedFabric.wrapT = THREE.RepeatWrapping;
    selectedFabric.repeat.set(2, 2);
    selectedFabric.colorSpace = THREE.SRGBColorSpace;

    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;

      // Enable shadows for the mesh
      child.castShadow = true;
      child.receiveShadow = true;

      // Apply dynamic material
      child.material = new THREE.MeshStandardMaterial({
        color: cushionColor,
        map: selectedFabric,
        roughness: 0.6,
      });
    });
  }, [gltf, cushionColor, fabricType, fabric1, fabric2]);

  // ================= POINTER EVENTS =================

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

  // ================= SMOOTH MOVEMENT =================
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

/* =========================================================
   STATIC PRIMITIVE COMPONENTS (TV, Vase, Table)
========================================================= */

// TV Component
function TV({ roomWidth, roomDepth, roomHeight }) {
  return (
    <mesh position={[0, roomHeight / 2, -roomDepth / 2 + 0.15]}>
      <boxGeometry args={[3, 2, 0.1]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
}

// Flower vase Component
function FlowerVase() {
  return (
    <mesh position={[2, 0.5, 2]}>
      <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
      <meshStandardMaterial color="pink" />
    </mesh>
  );
}

// Table Component
function Table() {
  return (
    <mesh position={[0, 1, 3]}>
      <boxGeometry args={[4, 0.3, 2]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
}

/* =========================================================
   MAIN APP COMPONENT
   Handles UI state, sidebar, and 3D Canvas rendering
========================================================= */
export default function App() {
  // ================= STATE: WALL COLORS =================
  const [backWallColor, setBackWallColor] = useState("#ffffff");
  const [leftWallColor, setLeftWallColor] = useState("#f5f5f5");
  const [rightWallColor, setRightWallColor] = useState("#eeeeee");

  // ================= STATE: ROOM DIMENSIONS =================
  const [roomWidth, setRoomWidth] = useState(10);
  const [roomDepth, setRoomDepth] = useState(10);
  const [roomHeight, setRoomHeight] = useState(5);

  // ================= STATE: FLOOR SETTINGS =================
  const [floorType, setFloorType] = useState("cement");
  const [floorColor, setFloorColor] = useState("#cccccc");

  // ================= STATE: FURNITURE & LIGHTING =================
  const [furnitureColor, setFurnitureColor] = useState("#8B4513");
  const [frameColor, setFrameColor] = useState("#8B4513");
  const [cushionColor, setCushionColor] = useState("#ffffff");
  const [fabricType, setFabricType] = useState("fabric1");
  const [lightOn, setLightOn] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // ================= STATE: ROOM TYPE =================
  const [roomType, setRoomType] = useState("living");

  // ================= STATE: EXISTING ITEMS =================
  const [showTV, setShowTV] = useState(false);
  const [showVase, setShowVase] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const objectsRef = useRef([]);

  // ================= LOGIC: ROOM PRESETS =================
  // Updates visible items based on selected room preset
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

  // ================= RENDER =================
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#121212",
      }}
    >
      {/* ================= SIDEBAR UI ================= */}
      <div
        style={{
          width: "320px",
          background: "#1e1e1e",
          color: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          borderRight: "1px solid #333",
          overflowY: "auto",
          height: "100vh",
        }}
      >
        <h2>Room Configurator</h2>

        {/* --- Room Type Selection --- */}
        <section>
          <h4>Room Type</h4>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          >
            <option value="living">Living Room</option>
            <option value="dining">Dining Room</option>
            <option value="bedroom">Master Bedroom</option>
            <option value="family">Family Room</option>
            <option value="kitchen">Kitchen</option>
          </select>
        </section>

        {/* --- Room Size Sliders --- */}
        <section>
          <h4>Room Size</h4>
          <label>Width: {roomWidth}m</label>
          <input
            type="range"
            min="5"
            max="30"
            value={roomWidth}
            onChange={(e) => setRoomWidth(Number(e.target.value))}
            style={{ width: "100%" }}
          />

          <label>Depth: {roomDepth}m</label>
          <input
            type="range"
            min="5"
            max="30"
            value={roomDepth}
            onChange={(e) => setRoomDepth(Number(e.target.value))}
            style={{ width: "100%" }}
          />

          <label>Height: {roomHeight}m</label>
          <input
            type="range"
            min="3"
            max="15"
            value={roomHeight}
            onChange={(e) => setRoomHeight(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </section>

        {/* --- Floor Settings --- */}
        <section>
          <h4>Floor Type</h4>
          <select
            value={floorType}
            onChange={(e) => setFloorType(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          >
            <option value="cement">Cement</option>
            <option value="tile">Tile</option>
            <option value="wood">Wood</option>
            <option value="color">Custom Color</option>
          </select>

          {floorType === "color" && (
            <input
              type="color"
              value={floorColor}
              onChange={(e) => setFloorColor(e.target.value)}
              style={{ width: "100%", height: "40px", marginTop: "10px" }}
            />
          )}
        </section>

        {/* --- Wall Colors --- */}
        <section>
          <h4>Wall Colors</h4>
          <label>Back Wall</label>
          <input
            type="color"
            value={backWallColor}
            onChange={(e) => setBackWallColor(e.target.value)}
            style={{ width: "100%", height: "35px" }}
          />

          <label>Left Wall</label>
          <input
            type="color"
            value={leftWallColor}
            onChange={(e) => setLeftWallColor(e.target.value)}
            style={{ width: "100%", height: "35px" }}
          />

          <label>Right Wall</label>
          <input
            type="color"
            value={rightWallColor}
            onChange={(e) => setRightWallColor(e.target.value)}
            style={{ width: "100%", height: "35px" }}
          />
        </section>

        {/* --- Furniture Customization --- */}
        <section>
          <h4>Furniture Color</h4>
          <input
            type="color"
            value={furnitureColor}
            onChange={(e) => setFurnitureColor(e.target.value)}
            style={{ width: "100%", height: "40px" }}
          />
        </section>

        {/* --- GLB Model Customization --- */}
        <section>
          <h4>GLB Furniture</h4>

          <label>Frame Color</label>
          <input
            type="color"
            value={frameColor}
            onChange={(e) => setFrameColor(e.target.value)}
            style={{ width: "100%", height: "35px" }}
          />

          {/* --- Item Toggles --- */}
          <section>
            <h4>Existing Items</h4>

            <label>
              <input
                type="checkbox"
                checked={showTV}
                onChange={() => setShowTV(!showTV)}
              />
              Add TV
            </label>
            <br />

            <label>
              <input
                type="checkbox"
                checked={showVase}
                onChange={() => setShowVase(!showVase)}
              />
              Add Flower Vase
            </label>
            <br />

            <label>
              <input
                type="checkbox"
                checked={showTable}
                onChange={() => setShowTable(!showTable)}
              />
              Add Table
            </label>
          </section>

          <label>Cushion Color</label>
          <input
            type="color"
            value={cushionColor}
            onChange={(e) => setCushionColor(e.target.value)}
            style={{ width: "100%", height: "35px" }}
          />

          <label>Fabric Type</label>
          <select
            value={fabricType}
            onChange={(e) => setFabricType(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          >
            <option value="fabric1">Fabric 1</option>
            <option value="fabric2">Fabric 2</option>
          </select>
        </section>

        {/* --- Lighting Toggle --- */}
        <button
          onClick={() => setLightOn(!lightOn)}
          style={{
            padding: "12px",
            background: lightOn ? "#e53935" : "#4CAF50",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          {lightOn ? "Lights OFF" : "Lights ON"}
        </button>
      </div>

      {/* ================= 3D CANVAS AREA ================= */}
      <div style={{ flex: 1 }}>
        <Canvas
          shadows
          style={{ width: "100%", height: "100%" }}
          camera={{ position: [15, 10, 15], fov: 50 }}
        >
          {/* --- Lighting --- */}
          {lightOn && (
            <directionalLight
              position={[10, 20, 10]}
              intensity={1.5}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
          )}

          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.6}
            scale={50}
            blur={2}
            far={20}
          />

          <ambientLight intensity={0.6} />

          {/* --- Environment (Floor & Walls) --- */}
          <Floor
            roomWidth={roomWidth}
            roomDepth={roomDepth}
            floorType={floorType}
            floorColor={floorColor}
          />

          {/* Back Wall */}
          <mesh position={[0, roomHeight / 2, -roomDepth / 2]} receiveShadow>
            <boxGeometry args={[roomWidth, roomHeight, 0.2]} />
            <meshStandardMaterial color={backWallColor} />
          </mesh>

          {/* Left Wall */}
          <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} receiveShadow>
            <boxGeometry args={[0.2, roomHeight, roomDepth]} />
            <meshStandardMaterial color={leftWallColor} />
          </mesh>

          {/* Right Wall (Currently Commented Out) */}
          {/* <mesh position={[roomWidth / 2, roomHeight / 2, 0]} receiveShadow>
            <boxGeometry args={[0.2, roomHeight, roomDepth]} />
            <meshStandardMaterial color={rightWallColor} />
          </mesh> */}

          {/* --- Custom GLB Model --- */}
          <GLBFurniture
            frameColor={frameColor}
            cushionColor={cushionColor}
            fabricType={fabricType}
            roomWidth={roomWidth}
            roomDepth={roomDepth}
            setIsDragging={setIsDragging}
          />

          {/* --- Draggable Primitive Items --- */}

          {/* TV Rendering Condition */}
          {showTV && (
            <DraggableItem
              roomWidth={roomWidth}
              roomDepth={roomDepth}
              initialPosition={[0, 1.5, -roomDepth / 2 + 0.3]}
              setIsDragging={setIsDragging}
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[3, 2, 0.1]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </DraggableItem>
          )}

          {/* Vase Rendering Condition */}
          {showVase && (
            <DraggableItem
              roomWidth={roomWidth}
              roomDepth={roomDepth}
              initialPosition={[0, 0.5, -roomDepth / 2 + 0.3]}
              setIsDragging={setIsDragging}
            >
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
                <meshStandardMaterial color="pink" />
              </mesh>
            </DraggableItem>
          )}

          {/* Table Rendering Condition */}
          {showTable && (
            <DraggableItem
              roomWidth={roomWidth}
              roomDepth={roomDepth}
              initialPosition={[0, 1.5, -roomDepth / 2 + 0.3]}
              setIsDragging={setIsDragging}
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[4, 0.3, 2]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
            </DraggableItem>
          )}

          {/* --- Controls --- */}
          {/* Disable OrbitControls while dragging an item to prevent conflict */}
          <OrbitControls enabled={!isDragging} />
        </Canvas>
      </div>
    </div>
  );
}