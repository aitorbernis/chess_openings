import type { Opening } from "../types";

const steinitzDefense: Opening = {
  moves: [
    { from: "e2", to: "e4" },
    { from: "e7", to: "e5" },
    { from: "g1", to: "f3" },
    { from: "b8", to: "c6" },
    { from: "f1", to: "b5" },
    { from: "d7", to: "d6" },
  ],
  family: {
    code: "ruyLopez",
    name: "Ruy López",
  },
  isDefault: false,
  code: "steinitzDefense",
  name: "Defensa Steinitz",
};

export default steinitzDefense;
