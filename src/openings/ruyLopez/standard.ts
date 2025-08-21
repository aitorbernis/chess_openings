import type { Opening } from "../types";

const ruyLopez: Opening = {
  moves: [
    { from: "e2", to: "e4" },
    { from: "e7", to: "e5" },
    { from: "g1", to: "f3" },
    { from: "b8", to: "c6" },
    { from: "f1", to: "b5" },
  ],
  family: {
    code: "ruyLopez",
    name: "Ruy López",
  },
  isDefault: true,
  code: "ruyLopez",
  name: "Ruy Lopez",
  endFen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
};

export default ruyLopez;
