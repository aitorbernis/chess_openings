import type { Opening } from "../types";

const exchangeRuyLopez: Opening = {
  moves: [
    { from: "e2", to: "e4" },
    { from: "e7", to: "e5" },
    { from: "g1", to: "f3" },
    { from: "b8", to: "c6" },
    { from: "f1", to: "b5" },
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
  code: "exchangeRuyLopez",
  name: "Ruy López (Variante del Cambio)",
};

export default exchangeRuyLopez;
