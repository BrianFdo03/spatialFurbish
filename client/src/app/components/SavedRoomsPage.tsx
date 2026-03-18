import { useNavigate } from "react-router-dom"
import RoomCard from "./RoomCard"

export default function SavedRoomsPage() {

  const navigate = useNavigate()

  const dummyRooms = [
  {
    id: "1",
    name: "Living Room Design",
    type: "Square",
    createdAt: "Today"
  },
  {
    id: "2",
    name: "Bedroom Layout",
    type: "Rectangle",
    createdAt: "Yesterday"
  }
]

  return (
    <div className="w-screen min-h-screen flex flex-col items-center pt-36 relative bg-bg">

      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="fixed top-24 left-10 z-30">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white bg-stone-900 hover:bg-stone-800 transition rounded-md shadow-sm"
        >
          ← Back to Home
        </button>
      </div>

      <div className="text-center mb-10 max-w-4xl px-6 relative z-10">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-text">
          Your Room Designs
        </h1>

        <p className="text-lg text-text-muted">
          Create, edit and manage your saved room layouts
        </p>
      </div>

      <div className="relative z-10 mb-10">
        <button
          onClick={() => navigate("/room-selection")}
          className="px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white bg-stone-900 hover:bg-stone-800 transition rounded-md shadow-md"
        >
          Create New Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full px-8 relative z-10">

  {dummyRooms.length === 0 ? (

    <div className="col-span-3 flex flex-col items-center justify-center p-20 border border-border rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm text-center">

      <p className="text-lg text-text-muted mb-6">
        No saved rooms yet
      </p>

      <button
        onClick={() => navigate("/room-selection")}
        className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white bg-stone-900 hover:bg-stone-800 transition rounded-md shadow-sm"
      >
        Create Your First Room
      </button>

    </div>

  ) : (

    dummyRooms.map((room) => (
      <RoomCard
        key={room.id}
        id={room.id}
        name={room.name}
        type={room.type}
        createdAt={room.createdAt}
      />
    ))

  )}

</div>

    </div>
  )
}