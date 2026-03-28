import { useNavigate } from "react-router-dom"
import { roomDesignAPI } from "@/services/roomDesign.service"
import Swal from "sweetalert2"

interface RoomCardProps {
  id: string
  name: string
  type: string
  createdAt: string
  previewImage?: string
}

export default function RoomCard({ id, name, type, createdAt, previewImage }: RoomCardProps) {

  const navigate = useNavigate()

  const handleDelete = async () => {

    const result = await Swal.fire({
      title: "Delete Design?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1c1917",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true
    })

    if (!result.isConfirmed) return

    try{
      await roomDesignAPI.delete(id)
      window.location.reload()
    }catch(err){
      console.error("Delete failed", err)
    }

  }

  return (
    <div className="group rounded-2xl border border-border bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">

      {/* Preview */}
      <div className="relative w-full h-40 bg-stone-100 overflow-hidden">

        {previewImage ? (
          <img
            src={previewImage}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400 text-sm">
            Preview
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

      </div>

      {/* Content */}
      <div className="p-5">

        <h3 className="text-lg font-bold text-text mb-1 truncate">
          {name}
        </h3>

        <p className="text-sm text-text-muted capitalize">
          {type} layout
        </p>

        <p className="text-xs text-text-muted mt-1 mb-4">
          Created {createdAt}
        </p>

        {/* Actions */}
        <div className="flex gap-2">

          <button
            onClick={() => navigate(`/editor?room=${type}&id=${id}`)}
            className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition"
          >
            Open
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-2 text-xs font-semibold border border-border rounded-md hover:bg-stone-100 transition"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  )
}