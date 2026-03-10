import { useState } from "react";
import "./FurnitureSidebar.css";
import { furnitureCatalog } from "../../data/furnitureData";

export default function FurnitureSidebar({ addFurniture }) {

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filters = [
    "All",
    "Chairs",
    "Tables",
    "Sofas",
    "Beds",
    "Storage",
    "Lighting"
  ];

  /* FILTER + SEARCH */

  const filteredFurniture = furnitureCatalog.filter((item) => {

    const matchFilter =
      activeFilter === "All" || item.type === activeFilter;

    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;

  });

  return (

    <div className="furnitureSidebar">

      <h3 className="sidebarTitle">Furniture</h3>

      {/* SEARCH */}

      <input
        className="searchInput"
        placeholder="Search furniture..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
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

        {filteredFurniture.map((item) => (

          <FurnitureItem
            key={item.id}
            name={item.name}
            size={item.size}
            price={item.price}
            thumb={item.thumb}
            model={item.id}
            addFurniture={addFurniture}
          />

        ))}

      </div>

    </div>

  );
}


/* ================= CARD ================= */

function FurnitureItem({ name, size, price, thumb, model, addFurniture }) {

  return (

    <div
      className="furnitureItem"
      onClick={() => addFurniture(model)}
    >

      <img
        src={thumb}
        alt={name}
        className="furnitureThumb"
        onError={(e)=>{e.target.src="/thumbs/placeholder.png"}}
      />

      <div className="furnitureInfo">

        <div className="furnitureName">
          {name}
        </div>

        <div className="furnitureSize">
          {size}
        </div>

        <div className="furniturePrice">
          {price}
        </div>

      </div>

    </div>

  );
}