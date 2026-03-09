import "./Header.css";

export default function Header({ viewMode, setViewMode }) {

  return (

    <header className="header">

      {/* LEFT SECTION */}

      <div className="headerLeft">

        <button className="iconButton">
          ←
        </button>

        <div className="projectTitle">

          <span className="titleText">
            Untitled Design
          </span>

          <span className="statusDot">
            ●
          </span>

        </div>

      </div>


      {/* CENTER SECTION */}

      <div className="viewToggle">

        <button
          className={`toggleButton ${viewMode === "2D" ? "active" : ""}`}
          onClick={() => setViewMode("2D")}
        >
          2D Layout
        </button>

        <button
          className={`toggleButton ${viewMode === "3D" ? "active" : ""}`}
          onClick={() => setViewMode("3D")}
        >
          3D View
        </button>

      </div>


      {/* RIGHT SECTION */}

      <div className="headerRight">

        <button className="iconButton">
          ↺
        </button>

        <button className="saveButton">
          Save
        </button>

      </div>

    </header>

  );

}