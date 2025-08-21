import type { Opening } from "../types";

const sveshnikov: Opening = {
  code: "sveshnikov",
  name: "Siciliana (Sveshnikov)",
  family: { code: "sicilian", name: "Siciliana" },
  moves: [
    { from: "e2", to: "e4" },
    { from: "c7", to: "c5" },
    { from: "g1", to: "f3" },
    { from: "b8", to: "c6" },
    { from: "d2", to: "d4" },
    { from: "c5", to: "d4" },
    { from: "f3", to: "d4" },
    { from: "g8", to: "f6" },
    { from: "b1", to: "c3" },
    { from: "e7", to: "e5" },
    { from: "d4", to: "b5" },
    { from: "d7", to: "d6" },
  ],
};

export default sveshnikov;
