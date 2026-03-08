import React from "react";

export type RoomType = "square" | "rectangle" | "l-shape";

interface RoomSelectorProps {
    selected: RoomType;
    onChange: (type: RoomType) => void;
}

const rooms: { type: RoomType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
        type: "square",
        label: "Square",
        desc: "Equal sides, balanced layout",
        icon: (
            <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
                <rect x="8" y="8" width="44" height="44" rx="3" stroke="currentColor" strokeWidth="3" />
            </svg>
        ),
    },
    {
        type: "rectangle",
        label: "Rectangle",
        desc: "Wider layout, great for living rooms",
        icon: (
            <svg viewBox="0 0 70 50" width="54" height="40" fill="none">
                <rect x="5" y="5" width="60" height="40" rx="3" stroke="currentColor" strokeWidth="3" />
            </svg>
        ),
    },
    {
        type: "l-shape",
        label: "L-Shape",
        desc: "Open concept with a corner nook",
        icon: (
            <svg viewBox="0 0 60 60" width="44" height="44" fill="none">
                <polyline
                    points="8,8 8,52 52,52 52,32 28,32 28,8 8,8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
];

export default function RoomSelector({ selected, onChange }: RoomSelectorProps) {
    return (
        <div style={styles.overlay}>
            <div style={styles.panel}>
                <div style={styles.header}>
                    <div style={styles.headerDot} />
                    <span style={styles.headerLabel}>Room Type</span>
                </div>
                <p style={styles.subtitle}>Select your floor plan shape</p>
                <div style={styles.cardGrid}>
                    {rooms.map((room) => {
                        const isSelected = selected === room.type;
                        return (
                            <button
                                key={room.type}
                                onClick={() => onChange(room.type)}
                                style={{
                                    ...styles.card,
                                    ...(isSelected ? styles.cardSelected : styles.cardIdle),
                                }}
                            >
                                <div style={{ ...styles.iconWrapper, color: isSelected ? "#a78bfa" : "#94a3b8" }}>
                                    {room.icon}
                                </div>
                                <span style={{ ...styles.cardLabel, color: isSelected ? "#f1f5f9" : "#cbd5e1" }}>
                                    {room.label}
                                </span>
                                <span style={styles.cardDesc}>{room.desc}</span>
                                {isSelected && <div style={styles.selectedIndicator} />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    overlay: {
        position: "absolute",
        top: "24px",
        left: "24px",
        zIndex: 100,
        pointerEvents: "none",
    },
    panel: {
        pointerEvents: "all",
        background: "rgba(15, 18, 28, 0.82)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(148, 163, 184, 0.12)",
        borderRadius: "20px",
        padding: "20px",
        width: "240px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.05) inset",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "4px",
    },
    headerDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #a78bfa, #818cf8)",
        boxShadow: "0 0 8px rgba(167,139,250,0.6)",
    },
    headerLabel: {
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: "#94a3b8",
    },
    subtitle: {
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "18px",
        fontWeight: 700,
        color: "#f1f5f9",
        margin: "0 0 16px 0",
        lineHeight: 1.3,
    },
    cardGrid: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    card: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "12px 14px",
        borderRadius: "14px",
        border: "1px solid transparent",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s ease",
        outline: "none",
        width: "100%",
    },
    cardIdle: {
        background: "rgba(255,255,255,0.04)",
        borderColor: "rgba(255,255,255,0.07)",
    },
    cardSelected: {
        background: "rgba(167, 139, 250, 0.1)",
        borderColor: "rgba(167, 139, 250, 0.4)",
        boxShadow: "0 0 20px rgba(167,139,250,0.12)",
    },
    iconWrapper: {
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 0.2s",
    },
    cardLabel: {
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        display: "flex",
        flexDirection: "column",
        transition: "color 0.2s",
    },
    cardDesc: {
        display: "none",
    },
    selectedIndicator: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #a78bfa, #818cf8)",
        boxShadow: "0 0 8px rgba(167,139,250,0.8)",
    },
};
