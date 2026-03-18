import { useNavigate } from "react-router-dom";

interface EditorTopBarProps {
  title: string;
  onTitleChange: (t: string) => void;
  view: "2d" | "3d";
  onViewChange: (v: "2d" | "3d") => void;
  onUndo: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function EditorTopBar({
  title,
  onTitleChange,
  view,
  onViewChange,
  onUndo,
  onSave,
  isSaving = false,
}: EditorTopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center px-6 h-16 shrink-0 border-b shadow-sm bg-surface border-border">
      {/* Left — back + title */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md text-text-muted hover:bg-bg-deep"
          title="Back to room selection"
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 15l-5-5 5-5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <input
          className="text-sm font-bold bg-transparent border-none outline-none truncate hover:bg-bg px-2 py-1 rounded transition-colors text-text max-w-[220px]"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      {/* Center — 2D / 3D toggle */}
      <div className="flex items-center bg-bg-deep p-1.5 rounded-full shadow-inner h-[42px]">
        {(["2d", "3d"] as const).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`flex items-center gap-2 px-6 h-full rounded-full text-[13px] font-bold transition-all duration-300 cursor-pointer ${
              view === v
                ? "bg-accent text-white shadow-md"
                : "text-text-muted hover:bg-black/5"
            }`}
          >
            {v === "2d" ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    strokeWidth="2.5"
                  />
                  <path d="M3 9h18M9 3v18" strokeWidth="2.5" />
                </svg>
                <span>2D Layout</span>
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 3L21 8.5V15.5L12 21L3 15.5V8.5L12 3Z"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <path d="M12 3v18M3 8.5l9 6 9-6" strokeWidth="2.5" />
                </svg>
                <span>3D View</span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Right — undo + save */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <button
          onClick={onUndo}
          className="flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md text-text-muted hover:bg-bg-deep"
          title="Undo"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 10h10a5 5 0 0 1 0 10H9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 10l4-4M3 10l4 4"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-95 bg-accent text-white hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M21 12a9 9 0 1 1-6.219-8.56"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M17 21v-8H7v8M7 3v5h8"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {isSaving ? "Saving..." : "Save"}
        </button>
        <div className="w-2" />
      </div>
    </header>
  );
}
