import type { Opening } from "../types";
import ruyLopez from "./standard";

const exchange: Opening = {
  moves: [
    ...ruyLopez.moves,
    { from: "a7", to: "a6" },
    { from: "b5", to: "c6" },
    { from: "d7", to: "c6" },
    { from: "e1", to: "g1" },
    { from: "f7", to: "f6" },
    { from: "d2", to: "d4" },
    { from: "e5", to: "d4" },
    { from: "d1", to: "d4" },
  ],
  family: {
    code: "ruyLopez",
    name: "Ruy López",
  },
  isDefault: false,
  code: "exchange",
  name: "Ruy López (Variante del Cambio)",
};

export default exchange;
