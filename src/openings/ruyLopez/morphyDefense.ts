import type { Opening } from "../types";
import ruyLopez from "./standard";

const morphyDefense: Opening = {
  moves: [...ruyLopez.moves, { from: "a7", to: "a6" }],
  family: {
    code: "ruyLopez",
    name: "Ruy López",
  },
  isDefault: false,
  code: "morphyDefense",
  name: "Defensa Morphy",
};

export default morphyDefense;
