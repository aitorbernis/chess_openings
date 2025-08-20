import type { Opening } from "../types";

const berlinDefense: Opening = {
  moves: [
    { from: "e2", to: "e4" },
    { from: "e7", to: "e5" },
    { from: "g1", to: "f3" },
    { from: "b8", to: "c6" },
    { from: "f1", to: "b5" },
    { from: "g8", to: "f6" },
  ],
  family: {
    code: "ruyLopez",
    name: "Ruy López",
  },
  isDefault: false,
  code: "berlinDefense",
  name: "Defensa Berlín",
};

export default berlinDefense;
