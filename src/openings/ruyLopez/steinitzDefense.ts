import type { Opening } from "../types";
import ruyLopez from "./standard";

const steinitzDefense: Opening = {
  moves: [...ruyLopez.moves, { from: "d7", to: "d6" }],
  family: {
    code: "ruyLopez",
    name: "Ruy López",
  },
  isDefault: false,
  code: "steinitzDefense",
  name: "Defensa Steinitz",
};

export default steinitzDefense;
