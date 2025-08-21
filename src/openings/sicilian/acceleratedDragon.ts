import type { Opening } from "../types";

const acceleratedDragon: Opening = {
  code: "acceleratedDragon",
  name: "Dragón Acelerado",
  family: { code: "sicilian", name: "Siciliana" },
  moves: [
    { from: "e2", to: "e4" },
    { from: "c7", to: "c5" },
    { from: "g1", to: "f3" },
    { from: "b8", to: "c6" },
    { from: "d2", to: "d4" },
    { from: "c5", to: "d4" },
    { from: "f3", to: "d4" },
    { from: "g7", to: "g6" },
  ],
};

export default acceleratedDragon;
