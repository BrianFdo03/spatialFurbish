export default function Sidebar({

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

  furnitureColor,
  setFurnitureColor,

  frameColor,
  setFrameColor,

  cushionColor,
  setCushionColor,

  fabricType,
  setFabricType,

  showTV,
  setShowTV,

  showVase,
  setShowVase,

  showTable,
  setShowTable,

  lightOn,
  setLightOn

}) {

  return (

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

      {/* ROOM TYPE */}

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

      {/* ROOM SIZE */}

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

      {/* FLOOR */}

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

      {/* WALL COLORS */}

      <section>

        <h4>Wall Colors</h4>

        <input
          type="color"
          value={backWallColor}
          onChange={(e) => setBackWallColor(e.target.value)}
        />

        <input
          type="color"
          value={leftWallColor}
          onChange={(e) => setLeftWallColor(e.target.value)}
        />

        <input
          type="color"
          value={rightWallColor}
          onChange={(e) => setRightWallColor(e.target.value)}
        />

      </section>

      {/* OBJECTS */}

      <section>

        <h4>Objects</h4>

        <label>

          <input
            type="checkbox"
            checked={showTV}
            onChange={() => setShowTV(!showTV)}
          />

          TV

        </label>

        <label>

          <input
            type="checkbox"
            checked={showVase}
            onChange={() => setShowVase(!showVase)}
          />

          Vase

        </label>

        <label>

          <input
            type="checkbox"
            checked={showTable}
            onChange={() => setShowTable(!showTable)}
          />

          Table

        </label>

      </section>

      {/* LIGHT */}

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

  );
}