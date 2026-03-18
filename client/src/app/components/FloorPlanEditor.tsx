// import { useState, useReducer } from "react"
// import { useSearchParams } from "react-router-dom"
// import EditorTopBar from "./EditorTopBar"
// import FurniturePanel from "./FurniturePanel"
// import PropertiesPanel from "./PropertiesPanel"
// import type { FurnitureDef, PlacedItem } from "../types/furniture"
// import type { RoomProps } from "../types/room"
// import FloorPlanCanvas from "./FloorPlanCanvas"
// import RoomCanvas from "./RoomCanvas"
// import type { RoomType } from "./RoomSelector"

// type Action =
//     | { type: 'ADD_ITEM', payload: FurnitureDef }
//     | { type: 'UPDATE_ITEM', payload: { id: string, updates: Partial<PlacedItem> } }
//     | { type: 'DELETE_ITEM', payload: string }
//     // | { type: "LOAD_ITEMS"; payload: PlacedItem[] }
//     | { type: 'UNDO' }

// function reducer(state: PlacedItem[], action: Action): PlacedItem[] {
//     switch (action.type) {
//         case 'ADD_ITEM': {
//             return [...state, {
//                 ...action.payload,
//                 instanceId: crypto.randomUUID(),
//                 x: 100, // default spawn pos
//                 y: 100,
//                 rotation: 0,
//                 color: action.payload.allowedColors?.[0] ?? "#3B82F6", // TODO: Need to have color selected by user when cart item is added
//             }]
//         }
//         case 'UPDATE_ITEM':
//             return state.map(item =>
//                 item.instanceId === action.payload.id
//                     ? { ...item, ...action.payload.updates }
//                     : item
//             )
//         case 'DELETE_ITEM':
//             return state.filter(item => item.instanceId !== action.payload)
//         // case "LOAD_ITEMS":
//         //     return action.payload
//         default:
//             return state
//     }
// }

// export default function FloorPlanEditor() {
//     const [searchParams] = useSearchParams()
//     const [view, setView] = useState<"2d" | "3d">("2d")
//     const [title, setTitle] = useState("Untitled Design")
//     const [items, dispatch] = useReducer(reducer, [])
//     const [selectedId, setSelectedId] = useState<string | null>(null)
//     const [roomProps, setRoomProps] = useState<RoomProps>({
//         wallColor: "#ffffff",
//         wallTexture: "wall-1",
//         floorColor: "#ffffff",
//         floorTexture: "floor-1",
//         wallHeight: 3,
//         lightsOn: true,
//     })

//     const rawRoom = searchParams.get("room") ?? "square"
//     const roomType = (["square", "rectangle", "l-shape", "u-shape", "t-shape", "circular"].includes(rawRoom) ? rawRoom : "square") as RoomType

//     const selectedItem = items.find(i => i.instanceId === selectedId) || null

//     const handleAdd = (def: FurnitureDef) => {
//         dispatch({ type: 'ADD_ITEM', payload: def })
//     }

//     const handleUpdate = (id: string, updates: Partial<PlacedItem>) => {
//         dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } })
//     }

//     const handleDelete = (id: string) => {
//         dispatch({ type: 'DELETE_ITEM', payload: id })
//         setSelectedId(null)
//     }

//     return (
//         <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg text-text">
//             <EditorTopBar
//                 title={title}
//                 onTitleChange={setTitle}
//                 view={view}
//                 onViewChange={setView}
//                 onUndo={() => { }}
//                 onSave={() => alert("Design saved locally!")}
//             />

//             <div className="flex flex-1 overflow-hidden">
//                 <FurniturePanel onAdd={handleAdd} />

//                 {view === "2d" ? (
//                     <FloorPlanCanvas
//                         roomType={roomType}
//                         roomProps={roomProps}
//                         items={items}
//                         selectedId={selectedId}
//                         onSelectItem={setSelectedId}
//                         onUpdateItem={handleUpdate}
//                     />
//                 ) : (
//                     <div className="flex-1 relative">
//                         <RoomCanvas
//                             roomProps={roomProps}
//                             items={items}
//                             selectedId={selectedId}
//                             onSelectItem={setSelectedId}
//                             onUpdateItem={handleUpdate}
//                         />
//                         <div className="absolute top-4 left-4 z-10 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-border shadow-lg max-w-[200px]">
//                             <p className="text-xs font-bold text-accent mb-1 uppercase tracking-wider">3D Real-time View</p>
//                             <p className="text-[10px] text-text-muted">Interactive walk-through of your current layout.</p>
//                         </div>
//                     </div>
//                 )}

//                 <PropertiesPanel
//                     selectedItem={selectedItem}
//                     onUpdate={(updates) => selectedId && handleUpdate(selectedId, updates)}
//                     onDelete={handleDelete}
//                     roomProps={roomProps}
//                     onUpdateRoom={(updates) => setRoomProps(prev => ({ ...prev, ...updates }))}
//                 />
//             </div>
//         </div>
//     )
// }

import { useState, useReducer, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import EditorTopBar from "./EditorTopBar";
import FurniturePanel from "./FurniturePanel";
import PropertiesPanel from "./PropertiesPanel";
import FloorPlanCanvas from "./FloorPlanCanvas";
import RoomCanvas from "./RoomCanvas";
import type { FurnitureDef, PlacedItem } from "../types/furniture";
import type { RoomProps } from "../types/room";
import type { RoomType } from "./RoomSelector";
import { roomDesignAPI } from "@/services/roomDesign.service";
import { sceneObjectAPI } from "@/services/sceneObject.service";
import toast from "react-hot-toast";

type Action =
  | { type: "ADD_ITEM"; payload: FurnitureDef }
  | {
      type: "UPDATE_ITEM";
      payload: { id: string; updates: Partial<PlacedItem> };
    }
  | { type: "DELETE_ITEM"; payload: string }
  | { type: "LOAD_ITEMS"; payload: PlacedItem[] };

function reducer(state: PlacedItem[], action: Action): PlacedItem[] {
  switch (action.type) {
    case "ADD_ITEM":
      return [
        ...state,
        {
          ...action.payload,
          instanceId: crypto.randomUUID(),
          x: 100,
          y: 100,
          rotation: 0,
          color: action.payload.allowedColors?.[0] ?? "#3B82F6",
        },
      ];
    case "UPDATE_ITEM":
      return state.map((item) =>
        item.instanceId === action.payload.id
          ? { ...item, ...action.payload.updates }
          : item,
      );
    case "DELETE_ITEM":
      return state.filter((item) => item.instanceId !== action.payload);
    case "LOAD_ITEMS":
      return action.payload;
    default:
      return state;
  }
}

export default function FloorPlanEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [view, setView] = useState<"2d" | "3d">("2d");
  const [title, setTitle] = useState("Untitled Design");
  const [items, dispatch] = useReducer(reducer, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [designId, setDesignId] = useState<string | null>(null); // tracks saved design's DB id
  const [isSaving, setIsSaving] = useState(false);
  const [roomProps, setRoomProps] = useState<RoomProps>({
    wallColor: "#ffffff",
    wallTexture: "wall-1",
    floorColor: "#ffffff",
    floorTexture: "floor-1",
    wallHeight: 3,
    lightsOn: true,
  });

  const rawRoom = searchParams.get("room") ?? "square";
  const loadId = searchParams.get("id"); // /editor?room=square&id=<designId> for loading existing
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

  const selectedItem = items.find((i) => i.instanceId === selectedId) ?? null;

  // Access localStorage to get `user` object
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const user_id = user?._id;

  // Load existing design if ?id= is present in URL
  useEffect(() => {
    if (!loadId) return;

    const loadDesign = async () => {
      try {
        const res = await roomDesignAPI.getById(loadId);
        const design = res.data;

        setDesignId(design._id);
        setTitle(design.name);

        // Map DB scene objects back to PlacedItem shape
        const loaded: PlacedItem[] = design.sceneObjects.map((obj: any) => ({
          instanceId: obj._id, // use DB _id as instanceId so updates go to right record
          id: obj.productId?._id ?? "",
          name: obj.productId?.name ?? "Item",
          category: obj.productId?.category ?? "",
          price: obj.productId?.price ?? 0,
          image: obj.productId?.images?.[0] ?? "",
          model: obj.productId?.productModel ?? "",
          w: 1.2,
          d: 1.2,
          size: "",
          allowedColors: obj.productId?.allowedColors ?? [],
          allowedTextures: obj.productId?.allowedTextures ?? [],
          x: obj.position?.x ?? 100,
          y: obj.position?.y ?? 100,
          rotation: obj.position?.rotation ?? 0,
          color: obj.color ?? "#ffffff",
          texture: obj.texture,
        }));

        dispatch({ type: "LOAD_ITEMS", payload: loaded });
      } catch (err) {
        console.error("Failed to load design", err);
      }
    };

    loadDesign();
  }, [loadId]);

  const handleAdd = (def: FurnitureDef) => {
    dispatch({ type: "ADD_ITEM", payload: def });
  };

  const handleUpdate = (id: string, updates: Partial<PlacedItem>) => {
    dispatch({ type: "UPDATE_ITEM", payload: { id, updates } });
  };

  const handleDelete = async (id: string) => {
    // If design is already saved and this item has a DB record, delete from DB too
    if (designId) {
      try {
        await sceneObjectAPI.delete(designId, id);
      } catch (err) {
        console.error("Failed to delete scene object from DB", err);
      }
    }
    dispatch({ type: "DELETE_ITEM", payload: id });
    setSelectedId(null);
  };

  // Save: creates design + scene objects if first save, updates if already saved
  const handleSave = useCallback(async () => {
    // Log the available items to the console
    setIsSaving(true);
    try {
      const objectsPayload = items.map((item) => ({
        productId: item.id,
        position: { x: item.x, y: item.y },
        rotation: item.rotation,
        color: item.color,
        texture: item.texture,
        isPlaced: true,
        roomDesignId: designId ?? undefined, // only include if designId exists (i.e. not first save)
      }));

      // Log the available items to the console
      console.log("Items to be saved:", items);

      if (!designId) {
        // First save — create design with all objects in one call
        const res = await roomDesignAPI.create({
          name: title,
          roomType,
          userId: user_id,
          sceneObjects: objectsPayload,
        });
        const newId = res.data._id;
        setDesignId(newId);
        // Reflect the new DB id in the URL without re-mounting
        navigate(`/editor?room=${roomType}&id=${newId}`, { replace: true });
      } else {
        // Subsequent save — update design name + all scene objects
        await roomDesignAPI.update(designId, {
          name: title,
          updatedSceneObjects: items.map((item) => ({
            sceneObjectId: item.instanceId,
            productId: item.id,
            position: { x: item.x, y: item.y },
            rotation: item.rotation,
            color: item.color,
            texture: item.texture,
            isPlaced: true,
            roomDesignId: designId,
          })),
        });
      }

      toast.success("Design Saved Succefully!", {
        duration: 3000,
      });
    } catch (err) {
      toast.error("Failed to save design", {
        duration: 3000,
      });
      console.error("Failed to save design", err);
    } finally {
      setIsSaving(false);
    }
  }, [designId, title, roomType, items, navigate]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg text-text">
      <EditorTopBar
        title={title}
        onTitleChange={setTitle}
        view={view}
        onViewChange={setView}
        onUndo={() => {}}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <div className="flex flex-1 overflow-hidden">
        <FurniturePanel onAdd={handleAdd} />

        {view === "2d" ? (
          <FloorPlanCanvas
            roomType={roomType}
            roomProps={roomProps}
            items={items}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
            onUpdateItem={handleUpdate}
          />
        ) : (
          <div className="flex-1 relative">
            <RoomCanvas
              roomProps={roomProps}
              items={items}
              selectedId={selectedId}
              onSelectItem={setSelectedId}
              onUpdateItem={handleUpdate}
            />
            <div className="absolute top-4 left-4 z-10 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-border shadow-lg max-w-[200px]">
              <p className="text-xs font-bold text-accent mb-1 uppercase tracking-wider">
                3D Real-time View
              </p>
              <p className="text-[10px] text-text-muted">
                Interactive walk-through of your current layout.
              </p>
            </div>
          </div>
        )}

        <PropertiesPanel
          selectedItem={selectedItem}
          onUpdate={(updates) =>
            selectedId && handleUpdate(selectedId, updates)
          }
          onDelete={handleDelete}
          roomProps={roomProps}
          onUpdateRoom={(updates) =>
            setRoomProps((prev) => ({ ...prev, ...updates }))
          }
        />
      </div>
    </div>
  );
}
