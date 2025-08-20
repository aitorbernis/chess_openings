export interface Opening {
  moves: Array<{ from: string; to: string }>;
  arrows: Array<{ startSquare: string; endSquare: string; color: string }>;
  code: string;
  name: string;
}

const pastor: Opening = {
  moves: [
    { from: "e2", to: "e4" },
    { from: "e7", to: "e5" },
    { from: "f1", to: "c4" },
    { from: "b8", to: "c6" },
    { from: "d1", to: "f3" },
    { from: "d7", to: "d6" },
    { from: "f3", to: "f7" },
  ],
  arrows: [
    { startSquare: "e2", endSquare: "e4", color: "blue" },
    { startSquare: "e7", endSquare: "e5", color: "red" },
    { startSquare: "f1", endSquare: "c4", color: "blue" },
    { startSquare: "b8", endSquare: "c6", color: "red" },
    { startSquare: "d1", endSquare: "f3", color: "blue" },
    { startSquare: "d7", endSquare: "d6", color: "red" },
    { startSquare: "f3", endSquare: "f7", color: "blue" },
  ],
  code: "pastor",
  name: "Pastor",
};

const ruyLopez: Opening = {
  moves: [
    { from: "e2", to: "e4" },
    { from: "e7", to: "e5" },
    { from: "g1", to: "f3" },
    { from: "b8", to: "c6" },
    { from: "f1", to: "b5" },
  ],
  arrows: [
    { startSquare: "e2", endSquare: "e4", color: "blue" },
    { startSquare: "e7", endSquare: "e5", color: "red" },
    { startSquare: "g1", endSquare: "f3", color: "blue" },
    { startSquare: "b8", endSquare: "c6", color: "red" },
    { startSquare: "f1", endSquare: "b5", color: "blue" },
  ],
  code: "ruyLopez",
  name: "Ruy Lopez",
};

export const openings = {
  pastor,
  ruyLopez,
};
