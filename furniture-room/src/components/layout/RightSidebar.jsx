import "./RightSidebar.css";
import * as THREE from "three";

export default function RightSidebar({

  roomType,
  setRoomType,

  roomWidth,
  setRoomWidth,

  roomDepth,
  setRoomDepth,

  roomHeight,
  setRoomHeight,

  floorType,
  setFloorType,

  floorColor,
  setFloorColor,

  backWallColor,
  setBackWallColor,

  leftWallColor,
  setLeftWallColor,

  rightWallColor,
  setRightWallColor,

  showTV,
  setShowTV,

  showVase,
  setShowVase,

  showTable,
  setShowTable,

  lightOn,
  setLightOn,

  selectedObject,
  selectedType,

  setSelectedObject,
  setSelectedType,

  selectedObjectRef,

  sceneObjects,
  updateFurniture,
  removeFurniture

}) {

  const selectedFurniture = sceneObjects.find(
    obj => obj.id === selectedObjectRef?.current?.userData?.id
  );

  return (

<div className="rightSidebar">


{/* ================= ROOM SETTINGS ================= */}

{selectedType === null && (

<>

<h2 className="sidebarTitle">Room Settings</h2>


{/* ROOM TYPE */}

<div className="card">

<div className="sectionTitle">Room Type</div>

<select
value={roomType}
onChange={(e)=>setRoomType(e.target.value)}
className="dropdown"
>

<option value="living">Living Room</option>
<option value="dining">Dining Room</option>
<option value="bedroom">Master Bedroom</option>
<option value="family">Family Room</option>
<option value="kitchen">Kitchen</option>

</select>

</div>



{/* ROOM SIZE */}

<div className="card">

<div className="sectionTitle">Room Size</div>

<label>Width {roomWidth}m</label>
<input
type="range"
min="5"
max="30"
value={roomWidth}
onChange={(e)=>setRoomWidth(Number(e.target.value))}
className="slider"
/>

<label>Depth {roomDepth}m</label>
<input
type="range"
min="5"
max="30"
value={roomDepth}
onChange={(e)=>setRoomDepth(Number(e.target.value))}
className="slider"
/>

<label>Height {roomHeight}m</label>
<input
type="range"
min="3"
max="15"
value={roomHeight}
onChange={(e)=>setRoomHeight(Number(e.target.value))}
className="slider"
/>

</div>



{/* FLOOR */}

<div className="card">

<div className="sectionTitle">Floor</div>

<select
value={floorType}
onChange={(e)=>setFloorType(e.target.value)}
className="dropdown"
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
onChange={(e)=>setFloorColor(e.target.value)}
className="colorPicker"
/>

)}

</div>



{/* WALL COLORS */}

<div className="card">

<div className="sectionTitle">Wall Colors</div>

<div className="colorRow">

<input type="color" value={backWallColor} onChange={(e)=>setBackWallColor(e.target.value)}/>
<input type="color" value={leftWallColor} onChange={(e)=>setLeftWallColor(e.target.value)}/>
<input type="color" value={rightWallColor} onChange={(e)=>setRightWallColor(e.target.value)}/>

</div>

</div>



</>

)}



{/* ================= FURNITURE SETTINGS ================= */}

{selectedType === "furniture" && selectedFurniture && (

<>

<div className="furnitureHeader">

<h3>{selectedObject}</h3>

<button
className="deleteBtn"
onClick={()=>{

if(selectedObjectRef?.current){

const id = selectedObjectRef.current.userData.id;

removeFurniture(id);

setSelectedObject(null);
setSelectedType(null);

}

}}
>
Delete
</button>

</div>



<div className="card">

<div className="sectionTitle">Color</div>

<div className="colorRow">

{["#5B86E5","#001BFF","#F58A2E","#F4B942","#67E16E","#7B5BFF"]
.map((color)=>(
<div
key={color}
className="colorSwatch"
style={{background:color}}
onClick={()=>
updateFurniture(selectedFurniture.id,"cushionColor",color)
}
/>
))}

</div>

</div>



<div className="card">

<div className="sectionTitle">Fabric</div>

<select
value={selectedFurniture.fabricType}
onChange={(e)=>
updateFurniture(selectedFurniture.id,"fabricType",e.target.value)
}
className="dropdown"
>

<option value="fabric1">Fabric 1</option>
<option value="fabric2">Fabric 2</option>

</select>

</div>



<div className="card">

<div className="sectionTitle">Rotation</div>

<div className="rotationRow">

{[0,45,90,135,180].map((deg)=>(
<button
key={deg}
className="greenButton"
onClick={()=>{

if(selectedObjectRef?.current){

selectedObjectRef.current.rotation.y =
THREE.MathUtils.degToRad(deg)

}

}}
>
{deg}°
</button>
))}

</div>

</div>

</>

)}



{/* LIGHT CONTROL */}

<button
onClick={()=>setLightOn(!lightOn)}
className={`lightButton ${lightOn ? "on" : "off"}`}
>

{lightOn ? "Lights ON" : "Lights OFF"}

</button>

</div>

);

}