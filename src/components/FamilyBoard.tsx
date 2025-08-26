import { useEffect, useState, useMemo } from "react";
import type { FamilyGroup } from "../openings/openings";
import type { Opening } from "../openings/types";
import BoardScreen from "./OpeningAnalysis";

type Props = {
  family: FamilyGroup;
  onBack: () => void;
};

export const FamilyBoard = ({ family, onBack }: Props) => {
  const [variantCode, setVariantCode] = useState<Opening["code"]>(
    family.defaultCode
  );
  useEffect(
    () => setVariantCode(family.defaultCode),
    [family.code, family.defaultCode]
  );

  const variants = Object.values(family.variants);
  const parent = family.variants[family.defaultCode];
  const children = variants.filter((v) => v.code !== family.defaultCode);

  // ————— utils —————
  const movesToText = (moves?: Opening["moves"], max = 16) =>
    moves
      ? moves
          .slice(0, max)
          .map((m) => m.to)
          .join(" ")
      : "";

  // Componemos una tabla {code: "e4 e5 Cf3 ..."} para no recalcular en cada render
  const toLinesByCode = useMemo(() => {
    const map: Record<string, string> = {};
    for (const op of variants) {
      const moves = op.isDefault
        ? op.moves
        : op.moves.slice(variants.find((v) => v.isDefault)?.moves.length);
      map[op.code] = movesToText(moves);
    }
    return map;
  }, [variants]);

  const TreeButton = ({
    label,
    active,
    onClick,
    level = 0,
    hint,
  }: {
    label: string;
    active?: boolean;
    onClick: () => void;
    level?: number;
    hint?: string;
  }) => {
    const onHintWheel: React.WheelEventHandler<HTMLSpanElement> = (e) => {
      // Convierte el scroll vertical del trackpad en horizontal del hint
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.currentTarget.scrollLeft += e.deltaY;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    return (
      <button
        onClick={onClick}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "8px 10px",
          marginLeft: level * 12,
          borderRadius: 8,
          border: 0,
          background: active ? "#223344" : "transparent",
          color: "#eee",
          cursor: "pointer",
          boxShadow: active
            ? "inset 0 0 0 2px #6cf"
            : "inset 0 0 0 1px #2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>

        {hint && (
          <span
            onWheel={onHintWheel}
            title={hint}
            style={{
              opacity: 0.7,
              fontSize: 12,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
              maxWidth: "55%",
              whiteSpace: "nowrap",
              overflowX: "auto", // ← sólo el hint scrollea
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin", // Firefox
            }}
          >
            {hint}
          </span>
        )}
      </button>
    );
  };

  const sideRight = (
    <nav>
      <div
        style={{
          padding: "6px 8px",
          fontSize: 12,
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        {family.name}
      </div>

      {/* Padre (standard) */}
      {parent && (
        <TreeButton
          label={parent.name}
          active={variantCode === parent.code}
          onClick={() => setVariantCode(parent.code)}
          level={0}
          hint={toLinesByCode[parent.code]}
        />
      )}

      {/* Hijos */}
      <div style={{ marginTop: 4 }}>
        {children.map((op) => (
          <TreeButton
            key={op.code}
            label={op.name}
            active={variantCode === op.code}
            onClick={() => setVariantCode(op.code)}
            level={1}
            hint={toLinesByCode[op.code]}
          />
        ))}
      </div>
    </nav>
  );

  return (
    <div style={{ marginLeft: 200 }}>
      <BoardScreen
        code={variantCode}
        items={family.variants}
        onBack={onBack}
        sideRight={sideRight}
      />
    </div>
  );
};

export default FamilyBoard;
