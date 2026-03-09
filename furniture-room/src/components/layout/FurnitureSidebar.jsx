import { useState } from "react";
import "./FurnitureSidebar.css";

export default function FurnitureSidebar() {

  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Chairs",
    "Tables",
    "Sofas",
    "Beds",
    "Storage",
    "Lighting"
  ];

  const furniture = [
    {
      name: "3-Seat Sofa",
      size: "2.2m × 0.9m",
      icon: "🛋",
      type: "Sofas"
    },
    {
      name: "Bookshelf",
      size: "0.8m × 0.3m",
      icon: "📚",
      type: "Storage"
    },
    {
      name: "Coffee Table",
      size: "1.2m × 0.6m",
      icon: "🪑",
      type: "Tables"
    },
    {
      name: "Desk",
      size: "1.4m × 0.7m",
      icon: "🖥",
      type: "Tables"
    },
    {
      name: "Dining Chair",
      size: "0.5m × 0.5m",
      icon: "🪑",
      type: "Chairs"
    }
  ];

  const filteredFurniture =
    activeFilter === "All"
      ? furniture
      : furniture.filter((f) => f.type === activeFilter);

  return (

    <div className="furnitureSidebar">

      <h3 className="sidebarTitle">Furniture</h3>

      {/* SEARCH */}

      <input
        className="searchInput"
        placeholder="Search..."
      />

      {/* FILTER BUTTONS */}

      <div className="filterContainer">

        {filters.map((filter) => (

          <button
            key={filter}
            className={`filterButton ${
              activeFilter === filter ? "filterActive" : ""
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>

        ))}

      </div>

      {/* FURNITURE LIST */}

      <div className="furnitureList">

        {filteredFurniture.map((item, index) => (

          <FurnitureItem
            key={index}
            name={item.name}
            size={item.size}
            icon={item.icon}
          />

        ))}

      </div>

    </div>

  );
}


function FurnitureItem({ name, size, icon }) {

  return (

    <div className="furnitureItem">

      <div className="furnitureIcon">
        {icon}
      </div>

      <div className="furnitureInfo">

        <div className="furnitureName">
          {name}
        </div>

        <div className="furnitureSize">
          {size}
        </div>

      </div>

    </div>

  );
}