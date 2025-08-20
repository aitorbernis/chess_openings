import { useEffect, useState } from "react";
import type { FamilyGroup } from "../openings/openings";
import type { Opening } from "../openings/types";
import BoardScreen from "./BoardScreen";

type Props = {
  family: FamilyGroup;
  onBack: () => void;
};

export default function FamilyBoard({ family, onBack }: Props) {
  const [variantCode, setVariantCode] = useState<Opening["code"]>(
    family.defaultCode
  );
  useEffect(
    () => setVariantCode(family.defaultCode),
    [family.code, family.defaultCode]
  );

  const variants = Object.values(family.variants);

  const footer = variants.map((op) => {
    const active = op.code === variantCode;
    return (
      <button
        key={op.code}
        onClick={() => setVariantCode(op.code)}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: active ? "2px solid #6cf" : "1px solid #444",
          background: active ? "#223344" : "#1c1c1c",
          color: "#eee",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        {op.name}
      </button>
    );
  });

  return (
    <BoardScreen
      code={variantCode}
      items={family.variants}
      onBack={onBack} // ← vuelve a la lista de familias
      footer={footer} // 👈 botones justo debajo del tablero
      fullHeight={false} // 👈 sin 100vh → sin scroll innecesario
    />
  );
}
