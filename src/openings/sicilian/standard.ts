import type { Opening } from "../types";

const sicilian: Opening = {
  code: "sicilian",
  name: "Siciliana (Najdorf)",
  family: { code: "sicilian", name: "Siciliana" },
  isDefault: true,
  moves: [
    { from: "e2", to: "e4" },
    { from: "c7", to: "c5" },
    { from: "g1", to: "f3" },
    { from: "d7", to: "d6" },
    { from: "d2", to: "d4" },
    { from: "c5", to: "d4" },
    { from: "f3", to: "d4" },
    { from: "g8", to: "f6" },
    { from: "b1", to: "c3" },
    { from: "a7", to: "a6" },
  ],
};

export default sicilian;
