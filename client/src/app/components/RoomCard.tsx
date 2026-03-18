import { useNavigate } from "react-router-dom"

interface RoomCardProps {
  id: string
  name: string
  type: string
  createdAt: string
}

export default function RoomCard({ id, name, type, createdAt }: RoomCardProps) {

  const navigate = useNavigate()

  return (
    <div className="p-6 rounded-2xl border border-border bg-white/80 backdrop-blur-sm shadow-sm transition hover:shadow-md">

      <div className="w-full h-32 bg-stone-100 rounded-lg mb-4 flex items-center justify-center text-stone-400 text-sm">
        Preview
      </div>

      <h3 className="text-lg font-bold text-text mb-1">
        {name}
      </h3>

      <p className="text-sm text-text-muted mb-3">
        {type} layout
      </p>

      <p className="text-xs text-text-muted mb-4">
        Created: {createdAt}
      </p>

      <div className="flex gap-2">

        <button
          onClick={() => navigate(`/editor?id=${id}`)}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded"
        >
          Open
        </button>

        <button
          className="px-3 py-1.5 text-xs font-semibold border border-border rounded hover:bg-stone-100"
        >
          Delete
        </button>

      </div>

    </div>
  )
}