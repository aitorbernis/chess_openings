import type { Opening } from "../types";
import ruyLopez from "./standard";

const open: Opening = {
  moves: [
    ...ruyLopez.moves,
    { from: "a7", to: "a6" },
    { from: "b5", to: "a4" },
    { from: "g8", to: "f6" },
    { from: "e1", to: "g1" },
    { from: "f6", to: "e4" },
    { from: "d2", to: "d4" },
    { from: "b7", to: "b5" },
    { from: "a4", to: "b3" },
    { from: "d7", to: "d5" },
    { from: "d4", to: "e5" },
    { from: "c8", to: "e6" },
  ],
  family: {
    code: "ruyLopez",
    name: "Ruy López",
  },
  isDefault: false,
  code: "open",
  name: "Ruy López Abierta",
};

export default open;
