import { useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import FurnitureItem from "./FurnitureItem";
import type { RoomType } from "./RoomSelector";
import type { RoomProps } from "../types/room";
import type { PlacedItem } from "../types/furniture";

// Assets
import wall1Img from "../../assets/WallTextures/Wall 1.jpeg";
import wall2Img from "../../assets/WallTextures/Wall 2.jpeg";
import wall3Img from "../../assets/WallTextures/Wall 3.jpg";
import floor1Img from "../../assets/FloorTextures/Floor 1.jpeg";
import floor2Img from "../../assets/FloorTextures/Floor 2.jpeg";
import floor3Img from "../../assets/FloorTextures/Floor 3.jpg";

// --- Helper components ---

function Wall({
  position,
  rotation = [0, 0, 0],
  scale,
  texture,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number, number];
  texture?: THREE.Texture | null;
}) {
  const wallTexture = useMemo(() => {
    if (!texture) return null;
    const tex = texture.clone();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    // Map texture so it doesn't stretch. 1 repeat per 2 meters approx.
    const repeatX = scale[0] > scale[2] ? scale[0] / 2 : scale[2] / 2;
    tex.repeat.set(repeatX, scale[1] / 2);
    tex.needsUpdate = true;
    return tex;
  }, [texture, scale]);

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#ffffff" map={wallTexture} />
    </mesh>
  );
}

function Floor({
  width,
  depth,
  texture,
}: {
  width: number;
  depth: number;
  texture?: THREE.Texture | null;
}) {
  const floorTexture = useMemo(() => {
    if (!texture) return null;
    const tex = texture.clone();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(width / 2, depth / 2);
    tex.needsUpdate = true;
    return tex;
  }, [texture, width, depth]);

  return (
    <mesh position={[0, -1.4, 0]}>
      <boxGeometry args={[width, 0.2, depth]} />
      <meshStandardMaterial color="#ffffff" map={floorTexture} />
    </mesh>
  );
}

// --- Room mesh components ---

function SquareRoom({
  props,
  wallTex,
  floorTex,
}: {
  props: RoomProps;
  wallTex?: THREE.Texture | null;
  floorTex?: THREE.Texture | null;
}) {
  const { wallHeight } = props;
  return (
    <group>
      <Floor width={10} depth={10} texture={floorTex} />
      {/* Walls */}
      <Wall
        position={[0, wallHeight / 2 - 1.5, -5]}
        scale={[10, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[0, wallHeight / 2 - 1.5, 5]}
        scale={[10, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[-5, wallHeight / 2 - 1.5, 0]}
        scale={[0.2, wallHeight, 10]}
        texture={wallTex}
      />
      <Wall
        position={[5, wallHeight / 2 - 1.5, 0]}
        scale={[0.2, wallHeight, 10]}
        texture={wallTex}
      />
    </group>
  );
}

function RectangleRoom({
  props,
  wallTex,
  floorTex,
}: {
  props: RoomProps;
  wallTex?: THREE.Texture | null;
  floorTex?: THREE.Texture | null;
}) {
  const { wallHeight } = props;
  return (
    <group>
      <Floor width={14} depth={9} texture={floorTex} />
      <Wall
        position={[0, wallHeight / 2 - 1.5, -4.5]}
        scale={[14, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[0, wallHeight / 2 - 1.5, 4.5]}
        scale={[14, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[-7, wallHeight / 2 - 1.5, 0]}
        scale={[0.2, wallHeight, 9]}
        texture={wallTex}
      />
      <Wall
        position={[7, wallHeight / 2 - 1.5, 0]}
        scale={[0.2, wallHeight, 9]}
        texture={wallTex}
      />
    </group>
  );
}

function LShapeRoom({
  props,
  wallTex,
  floorTex,
}: {
  props: RoomProps;
  wallTex?: THREE.Texture | null;
  floorTex?: THREE.Texture | null;
}) {
  const { wallHeight } = props;
  return (
    <group>
      {/* Floors */}
      <mesh position={[-3, -1.4, 0]}>
        <boxGeometry args={[8, 0.2, 12]} />
        <meshStandardMaterial color="#ffffff" map={floorTex || null} />
      </mesh>
      <mesh position={[4, -1.4, 3]}>
        <boxGeometry args={[6, 0.2, 6]} />
        <meshStandardMaterial color="#ffffff" map={floorTex || null} />
      </mesh>
      {/* Exterior Walls */}
      <Wall
        position={[-7, wallHeight / 2 - 1.5, 0]}
        scale={[0.2, wallHeight, 12]}
        texture={wallTex}
      />
      <Wall
        position={[-3, wallHeight / 2 - 1.5, -6]}
        scale={[8, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[1, wallHeight / 2 - 1.5, -3]}
        scale={[0.2, wallHeight, 6]}
        texture={wallTex}
      />
      <Wall
        position={[4, wallHeight / 2 - 1.5, 0]}
        scale={[6, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[7, wallHeight / 2 - 1.5, 3]}
        scale={[0.2, wallHeight, 6]}
        texture={wallTex}
      />
      <Wall
        position={[0, wallHeight / 2 - 1.5, 6]}
        scale={[14, wallHeight, 0.2]}
        texture={wallTex}
      />
    </group>
  );
}

function UShapeRoom({
  props,
  wallTex,
  floorTex,
}: {
  props: RoomProps;
  wallTex?: THREE.Texture | null;
  floorTex?: THREE.Texture | null;
}) {
  const { wallHeight } = props;
  return (
    <group>
      {/* Floors */}
      <mesh position={[-4, -1.4, 0]}>
        <boxGeometry args={[6, 0.2, 12]} />
        <meshStandardMaterial color="#ffffff" map={floorTex || null} />
      </mesh>
      <mesh position={[4, -1.4, 0]}>
        <boxGeometry args={[6, 0.2, 12]} />
        <meshStandardMaterial color="#ffffff" map={floorTex || null} />
      </mesh>
      <mesh position={[0, -1.4, 4]}>
        <boxGeometry args={[2, 0.2, 4]} />
        <meshStandardMaterial color="#ffffff" map={floorTex || null} />
      </mesh>
      {/* Exterior Walls */}
      <Wall
        position={[-7, wallHeight / 2 - 1.5, 0]}
        scale={[0.2, wallHeight, 12]}
        texture={wallTex}
      />
      <Wall
        position={[-4, wallHeight / 2 - 1.5, -6]}
        scale={[6, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[-1, wallHeight / 2 - 1.5, -2]}
        scale={[0.2, wallHeight, 8]}
        texture={wallTex}
      />
      <Wall
        position={[0, wallHeight / 2 - 1.5, 2]}
        scale={[2, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[1, wallHeight / 2 - 1.5, -2]}
        scale={[0.2, wallHeight, 8]}
        texture={wallTex}
      />
      <Wall
        position={[4, wallHeight / 2 - 1.5, -6]}
        scale={[6, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[7, wallHeight / 2 - 1.5, 0]}
        scale={[0.2, wallHeight, 12]}
        texture={wallTex}
      />
      <Wall
        position={[0, wallHeight / 2 - 1.5, 6]}
        scale={[14, wallHeight, 0.2]}
        texture={wallTex}
      />
    </group>
  );
}

function TShapeRoom({
  props,
  wallTex,
  floorTex,
}: {
  props: RoomProps;
  wallTex?: THREE.Texture | null;
  floorTex?: THREE.Texture | null;
}) {
  const { wallHeight } = props;
  return (
    <group>
      {/* Floors */}
      <mesh position={[0, -1.4, -3]}>
        <boxGeometry args={[14, 0.2, 6]} />
        <meshStandardMaterial color="#ffffff" map={floorTex || null} />
      </mesh>
      <mesh position={[0, -1.4, 3]}>
        <boxGeometry args={[6, 0.2, 6]} />
        <meshStandardMaterial color="#ffffff" map={floorTex || null} />
      </mesh>
      {/* Exterior Walls */}
      <Wall
        position={[0, wallHeight / 2 - 1.5, -6]}
        scale={[14, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[-7, wallHeight / 2 - 1.5, -3]}
        scale={[0.2, wallHeight, 6]}
        texture={wallTex}
      />
      <Wall
        position={[-5, wallHeight / 2 - 1.5, 0]}
        scale={[4, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[5, wallHeight / 2 - 1.5, 0]}
        scale={[4, wallHeight, 0.2]}
        texture={wallTex}
      />
      <Wall
        position={[7, wallHeight / 2 - 1.5, -3]}
        scale={[0.2, wallHeight, 6]}
        texture={wallTex}
      />
      <Wall
        position={[-3, wallHeight / 2 - 1.5, 3]}
        scale={[0.2, wallHeight, 6]}
        texture={wallTex}
      />
      <Wall
        position={[3, wallHeight / 2 - 1.5, 3]}
        scale={[0.2, wallHeight, 6]}
        texture={wallTex}
      />
      <Wall
        position={[0, wallHeight / 2 - 1.5, 6]}
        scale={[6, wallHeight, 0.2]}
        texture={wallTex}
      />
    </group>
  );
}

function CircularRoom({
  props,
  wallTex,
  floorTex,
}: {
  props: RoomProps;
  wallTex?: THREE.Texture | null;
  floorTex?: THREE.Texture | null;
}) {
  const { wallHeight } = props;
  const radius = 6;
  const segments = 24;
  const segmentAngle = (Math.PI * 2) / segments;
  const segmentWidth = 2 * radius * Math.tan(segmentAngle / 2);

  return (
    <group>
      {/* Rotunda Floor */}
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[radius, radius, 0.2, segments]} />
        <meshStandardMaterial color="#ffffff" map={floorTex || null} />
      </mesh>
      {/* Curved Walls (Segmented) */}
      {Array.from({ length: segments }).map((_, i) => {
        const angle = i * segmentAngle;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        return (
          <Wall
            key={i}
            position={[x, wallHeight / 2 - 1.5, z]}
            rotation={[0, angle, 0]}
            scale={[segmentWidth, wallHeight, 0.2]}
            texture={wallTex}
          />
        );
      })}
    </group>
  );
}

function RoomMesh({
  type,
  props,
  wallTex,
  floorTex,
}: {
  type: RoomType;
  props: RoomProps;
  wallTex?: THREE.Texture | null;
  floorTex?: THREE.Texture | null;
}) {
  if (type === "rectangle")
    return (
      <RectangleRoom props={props} wallTex={wallTex} floorTex={floorTex} />
    );
  if (type === "l-shape")
    return <LShapeRoom props={props} wallTex={wallTex} floorTex={floorTex} />;
  if (type === "u-shape")
    return <UShapeRoom props={props} wallTex={wallTex} floorTex={floorTex} />;
  if (type === "t-shape")
    return <TShapeRoom props={props} wallTex={wallTex} floorTex={floorTex} />;
  if (type === "circular")
    return <CircularRoom props={props} wallTex={wallTex} floorTex={floorTex} />;
  return <SquareRoom props={props} wallTex={wallTex} floorTex={floorTex} />;
}

const cameraPositions: Record<RoomType, [number, number, number]> = {
  square: [12, 12, 12],
  rectangle: [15, 12, 12],
  "l-shape": [15, 15, 15],
  "u-shape": [15, 15, 15],
  "t-shape": [15, 15, 15],
  circular: [15, 15, 15],
};

const ROOM_METERS: Record<RoomType, { w: number; d: number }> = {
  square: { w: 10, d: 10 },
  rectangle: { w: 14, d: 9 },
  "l-shape": { w: 14, d: 12 },
  "u-shape": { w: 14, d: 12 },
  "t-shape": { w: 14, d: 12 },
  circular: { w: 12, d: 12 },
};

const ROOM_SCALES: Record<RoomType, number> = {
  square: 40,
  rectangle: 40,
  "l-shape": 40,
  "u-shape": 40,
  "t-shape": 35,
  circular: 40,
};

function RoomContent({
  roomType,
  roomProps,
  items,
  selectedId,
  onSelectItem,
  onUpdateItem,
}: {
  roomType: RoomType;
  roomProps: RoomProps;
  items: PlacedItem[];
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  onUpdateItem: (id: string, updates: Partial<PlacedItem>) => void;
}) {
  const roomDim = ROOM_METERS[roomType];
  const roomScale = ROOM_SCALES[roomType];

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;

      const selectedItem = items.find((i) => i.instanceId === selectedId);
      if (!selectedItem) return;

      const MOVE_STEP = 5; // pixels
      const ROT_STEP = 15; // degrees

      let nextX = selectedItem.x;
      let nextY = selectedItem.y;
      let nextRotation = selectedItem.rotation;

      switch (e.key) {
        case "ArrowLeft":
          nextX -= MOVE_STEP;
          break;
        case "ArrowRight":
          nextX += MOVE_STEP;
          break;
        case "ArrowUp":
          nextY -= MOVE_STEP;
          break;
        case "ArrowDown":
          nextY += MOVE_STEP;
          break;
        case "r":
        case "R":
          nextRotation = e.shiftKey
            ? (nextRotation - ROT_STEP) % 360
            : (nextRotation + ROT_STEP) % 360;
          break;
        default:
          return; // No match
      }

      e.preventDefault();
      onUpdateItem(selectedId, { x: nextX, y: nextY, rotation: nextRotation });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, items, onUpdateItem]);

  const textures = useTexture({
    "wall-1": wall1Img,
    "wall-2": wall2Img,
    "wall-3": wall3Img,
    "floor-1": floor1Img,
    "floor-2": floor2Img,
    "floor-3": floor3Img,
  });

  const wallTex =
    textures[roomProps.wallTexture as keyof typeof textures] || null;
  const floorTex =
    textures[roomProps.floorTexture as keyof typeof textures] || null;

  const { lightsOn } = roomProps;

  return (
    <>
      <ambientLight
        intensity={lightsOn ? 1.5 : 0.4}
        color={lightsOn ? "#ffffff" : "#4f5b93"}
      />
      <directionalLight
        position={[10, 10, 5]}
        intensity={lightsOn ? 2 : 0.3}
        color={lightsOn ? "#ffffff" : "#2a3b5a"}
      />
      <pointLight position={[-5, 5, -5]} intensity={lightsOn ? 1 : 0.1} />
      <Environment preset={lightsOn ? "city" : "night"} />
      <gridHelper
        args={[50, 50, "#1e293b", "#0f172a"]}
        position={[0, -1.5, 0]}
      />
      {/* {!isVR && <gridHelper args={[50, 50, "#1e293b", "#0f172a"]} position={[0, -1.5, 0]} />} */}

      {/* Click floor to deselect */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.41, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onSelectItem(null);
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>

      <RoomMesh
        type={roomType}
        props={roomProps}
        wallTex={wallTex}
        floorTex={floorTex}
      />

      {items.map((item) => {
        // Map top-left 2D pixels to centered 3D meters
        const x3d =
          (item.x + (item.w * roomScale) / 2) / roomScale - roomDim.w / 2;
        const z3d =
          (item.y + (item.d * roomScale) / 2) / roomScale - roomDim.d / 2;

        // Strict clamping to prevent wall clipping in 3D
        const wallBuffer = 0.2;
        const clampedX = Math.max(
          -(roomDim.w / 2) + wallBuffer,
          Math.min(roomDim.w / 2 - wallBuffer, x3d),
        );
        const clampedZ = Math.max(
          -(roomDim.d / 2) + wallBuffer,
          Math.min(roomDim.d / 2 - wallBuffer, z3d),
        );

        const furnitureComponent = (
          <FurnitureItem
            key={item.instanceId}
            modelUrl={item.model}
            color={item.color}
            texture={item.texture}
            position={[clampedX, -1.4, clampedZ]}
            rotation={[0, -((item.rotation * Math.PI) / 180), 0]}
            isSelected={item.instanceId === selectedId}
            onPointerDown={(e) => {
              e.stopPropagation();
              onSelectItem(item.instanceId);
            }}
          />
        );

        return furnitureComponent;
      })}

      <OrbitControls />
    </>
  );
}

export default function RoomCanvas({
  roomProps,
  items,
  selectedId,
  onSelectItem,
  onUpdateItem,
}: {
  roomProps: RoomProps;
  items: PlacedItem[];
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  onUpdateItem: (id: string, updates: Partial<PlacedItem>) => void;
}) {
  const [searchParams] = useSearchParams();
  const rawRoom = searchParams.get("room") ?? "square";
  const roomType = (
    [
      "square",
      "rectangle",
      "l-shape",
      "u-shape",
      "t-shape",
      "circular",
    ].includes(rawRoom)
      ? rawRoom
      : "square"
  ) as RoomType;

  return (
    <div className="w-full h-full relative">
      {/* {isVR && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <XRButton 
                        store={store}
                        mode="immersive-vr"
                        className="px-10 py-5 bg-accent text-white rounded-3xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all animate-bounce pointer-events-auto"
                    >
                        ENTER VR SPACE
                    </XRButton>
                </div>
            )} */}
      <Canvas
        key={roomType + JSON.stringify(roomProps)}
        camera={{ position: cameraPositions[roomType], fov: 60 }}
        style={{ width: "100%", height: "100%", background: "#0f121c" }}
      >
        <Suspense fallback={null}>
          <RoomContent
            roomType={roomType}
            roomProps={roomProps}
            items={items}
            selectedId={selectedId}
            onSelectItem={onSelectItem}
            onUpdateItem={onUpdateItem}
          />
        </Suspense>
      </Canvas>

      {/* Keyboard Controls Overlay */}
      {selectedId && (
        <div className="absolute bottom-6 right-6 z-10 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-xs font-bold text-accent mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            KEYBOARD CONTROLS
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-8">
              <span className="text-[11px] text-text-muted font-medium">
                Move
              </span>
              <div className="flex gap-1">
                <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-[10px] text-text font-bold">
                  ↑
                </span>
                <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-[10px] text-text font-bold">
                  ↓
                </span>
                <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-[10px] text-text font-bold">
                  ←
                </span>
                <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-[10px] text-text font-bold">
                  →
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-[11px] text-text-muted font-medium">
                Rotate
              </span>
              <div className="flex gap-1 items-center">
                <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-[10px] text-text font-bold uppercase">
                  R
                </span>
                <span className="text-[10px] text-text-muted">/</span>
                <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-[10px] text-text font-bold flex items-center gap-1">
                  <span className="text-[8px] opacity-60">SHIFT</span>
                  <span>R</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
