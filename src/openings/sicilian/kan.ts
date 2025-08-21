import type { Opening } from "../types";

const kan: Opening = {
  code: "kan",
  name: "Siciliana (Kan)",
  family: { code: "sicilian", name: "Siciliana" },
  moves: [
    { from: "e2", to: "e4" },
    { from: "c7", to: "c5" },
    { from: "g1", to: "f3" },
    { from: "e7", to: "e6" },
    { from: "d2", to: "d4" },
    { from: "c5", to: "d4" },
    { from: "f3", to: "d4" },
    { from: "a7", to: "a6" },
  ],
};

export default kan;
