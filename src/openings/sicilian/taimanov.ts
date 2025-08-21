import type { Opening } from "../types";

const taimanov: Opening = {
  code: "taimanov",
  name: "Siciliana (Taimanov)",
  family: { code: "sicilian", name: "Siciliana" },
  moves: [
    { from: "e2", to: "e4" },
    { from: "c7", to: "c5" },
    { from: "g1", to: "f3" },
    { from: "e7", to: "e6" },
    { from: "d2", to: "d4" },
    { from: "c5", to: "d4" },
    { from: "f3", to: "d4" },
    { from: "b8", to: "c6" },
  ],
};

export default taimanov;
