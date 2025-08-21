import { useEffect, useState, useMemo } from "react";
import type { FamilyGroup } from "../openings/openings";
import type { Opening } from "../openings/types";
import BoardScreen from "./BoardScreen";

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
  const movesToText = (op?: Opening, max = 16) =>
    op?.moves
      ? op.moves
          .slice(0, max)
          .map((m) => m.to)
          .join(" ")
      : "";

  // Componemos una tabla {code: "e4 e5 Cf3 ..."} para no recalcular en cada render
  const toLinesByCode = useMemo(() => {
    const map: Record<string, string> = {};
    for (const op of variants) map[op.code] = movesToText(op);
    return map;
  }, [variants]);

  const TreeButton = ({
    label,
    active,
    onClick,
    level = 0,
    hint,
    title,
  }: {
    label: string;
    active?: boolean;
    onClick: () => void;
    level?: number;
    hint?: string; // ← secuencia de “to”
    title?: string; // ← tooltip completo
  }) => (
    <button
      onClick={onClick}
      title={title ?? hint}
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
        boxShadow: active ? "inset 0 0 0 2px #6cf" : "inset 0 0 0 1px #2a2a2a",

        // — sin cambiar la apariencia base, solo distribuimos el contenido —
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

      {/* pista con la secuencia de 'to' */}
      {hint ? (
        <span
          style={{
            opacity: 0.7,
            fontSize: 12,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
            maxWidth: "55%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {hint}
        </span>
      ) : null}
    </button>
  );

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
          title={toLinesByCode[parent.code]}
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
            title={toLinesByCode[op.code]}
          />
        ))}
      </div>
    </nav>
  );

  return (
    <BoardScreen
      code={variantCode}
      items={family.variants}
      onBack={onBack}
      sideRight={sideRight}
    />
  );
};

export default FamilyBoard;
