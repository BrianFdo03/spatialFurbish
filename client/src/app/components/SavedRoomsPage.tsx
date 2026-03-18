import { useNavigate } from "react-router-dom"
import RoomCard from "./RoomCard"
import { useEffect, useState } from "react"
import { roomDesignAPI } from "@/services/roomDesign.service"

export default function SavedRoomsPage() {

  const navigate = useNavigate()

  const [rooms, setRooms] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {

    const loadRooms = async () => {
      try {

        const user = JSON.parse(localStorage.getItem("user") ?? "{}")

        const res = await roomDesignAPI.getUserDesigns(user._id)

        setRooms(res.data)

      } catch (err) {
        console.error("Failed to load rooms", err)
      }
    }

    loadRooms()

  }, [])

  // Filter rooms by search
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(search.toLowerCase()) ||
    room.roomType.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-screen min-h-screen flex flex-col items-center pt-6 relative bg-bg">

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top Navigation */}
      <div className="w-full max-w-7xl flex justify-between items-center px-8 mb-10 relative z-10">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-md transition"
        >
          ← Home
        </button>

        {/* Create Button */}
        <button
          onClick={() => navigate("/room-selection")}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-md transition"
        >
          + Create Room
        </button>

      </div>

      {/* Header */}
      <div className="text-center mb-10 max-w-3xl px-6 relative z-10">

        <h1 className="text-5xl font-extrabold mb-3 tracking-tight text-text">
          Your Room Designs
        </h1>

        <p className="text-lg text-text-muted mb-3">
          Create, edit and manage your saved room layouts
        </p>

        <p className="text-sm text-text-muted">
          {rooms.length} designs
        </p>

      </div>

      {/* Search Bar */}
      <div className="w-full max-w-3xl px-6 mb-10 relative z-10">

        <input
          type="text"
          placeholder="Search designs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
        />

      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl w-full px-8 relative z-10">

        {filteredRooms.length === 0 ? (

          <div className="col-span-3 flex flex-col items-center justify-center p-20 border border-border rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm text-center">

            <p className="text-lg text-text-muted mb-6">
              No designs found
            </p>

            <button
              onClick={() => navigate("/room-selection")}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 transition rounded-md shadow-sm"
            >
              Create Your First Room
            </button>

          </div>

        ) : (

          filteredRooms.map((room) => (
            <RoomCard
              key={room._id}
              id={room._id}
              name={room.name}
              type={room.roomType}
              createdAt={new Date(room.createdAt).toLocaleDateString()}
              previewImage={room.previewImage}
            />
          ))

        )}

      </div>

    </div>
  )
}