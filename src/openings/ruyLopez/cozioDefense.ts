import type { Opening } from "../types";
import ruyLopez from "./standard";

const cozioDefense: Opening = {
  moves: [...ruyLopez.moves, { from: "g8", to: "e7" }],
  family: {
    code: "ruyLopez",
    name: "Ruy López",
  },
  isDefault: false,
  code: "cozioDefense",
  name: "Defensa Cozio",
};

export default cozioDefense;
