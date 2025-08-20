import type { Opening } from "../openings/types";

type Props = {
  items: Record<string, Opening>;
  onSelect: (code: Opening["code"]) => void;
};

export default function OpeningPicker({ items, onSelect }: Props) {
  const list = Object.values(items);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#eee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        Selecciona una apertura
      </h1>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          width: "100%",
          maxWidth: 780,
        }}
      >
        {list.map((op) => (
          <button
            key={op.code}
            onClick={() => onSelect(op.code)}
            style={{
              padding: "16px 18px",
              fontSize: 16,
              borderRadius: 10,
              border: "1px solid #333",
              background: "#1c1c1c",
              color: "#eee",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.15s, transform 0.08s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#262626")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1c1c1c")}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.98)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{op.name}</div>
            <div style={{ opacity: 0.7, fontSize: 13 }}>{op.code}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
