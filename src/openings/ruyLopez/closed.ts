import type { Opening } from "../types";

const closedRuyLopez: Opening = {
  moves: [
    { from: "e2", to: "e4" },
    { from: "e7", to: "e5" },
    { from: "g1", to: "f3" },
    { from: "b8", to: "c6" },
    { from: "f1", to: "b5" },
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

  code: "closedRuyLopez",
  name: "Ruy López Cerrada",
};

export default closedRuyLopez;
