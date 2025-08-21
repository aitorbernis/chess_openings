import type { Opening } from "../types";
import ruyLopez from "./standard";

const closed: Opening = {
  moves: [
    ...ruyLopez.moves,
    { from: "a7", to: "a6" },
    { from: "b5", to: "a4" },
    { from: "g8", to: "f6" },
    { from: "e1", to: "g1" },
    { from: "f8", to: "e7" },
    { from: "f1", to: "e1" },
    { from: "b7", to: "b5" },
    { from: "a4", to: "b3" },
    { from: "d7", to: "d6" },
    { from: "c2", to: "c3" },
    { from: "e8", to: "g8" },
  ],
  family: {
    code: "ruyLopez",
    name: "Ruy López",
  },
  isDefault: false,
  code: "closed",
  name: "Ruy López Cerrada",
};

export default closed;
