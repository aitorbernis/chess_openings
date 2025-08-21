import { useState } from "react";
import { families } from "./openings/openings";
import type { FamilyGroup } from "./openings/openings";
import FamilyPicker from "./components/FamilyPicker";
import FamilyBoard from "./components/FamilyBoard";

const App = () => {
  const [familyCode, setFamilyCode] = useState<string | null>(null);

  if (!familyCode) {
    return (
      <FamilyPicker
        families={families}
        onSelectFamily={(code) => setFamilyCode(code)}
      />
    );
  }

  const family: FamilyGroup | undefined = families[familyCode];
  if (!family) {
    return (
      <div style={{ color: "#eee", background: "#111", minHeight: "100vh" }}>
        <p>Familia no encontrada.</p>
        <button onClick={() => setFamilyCode(null)}>Volver</button>
      </div>
    );
  }

  return <FamilyBoard family={family} onBack={() => setFamilyCode(null)} />;
};
export default App;
