import { useState } from "react";
import { openings } from "./openings/openings";
import type { Opening } from "./openings/types";
import OpeningPicker from "./components/OpeningPicker";
import BoardScreen from "./components/BoardScreen";

export default function App() {
  const [openingCode, setOpeningCode] = useState<Opening["code"] | null>(null);

  // “Routing” súper simple: null => picker, code => tablero
  if (!openingCode) {
    return (
      <OpeningPicker
        items={openings}
        onSelect={(code) => setOpeningCode(code)}
      />
    );
  }

  return (
    <BoardScreen
      code={openingCode}
      items={openings}
      onBack={() => setOpeningCode(null)}
    />
  );
}
