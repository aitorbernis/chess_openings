import { useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import type { Opening } from "../openings/types";

type Props = {
  code: Opening["code"];
  items: Record<string, Opening>;
  onBack: () => void;
  sideRight?: React.ReactNode; // 👈 NUEVO: panel lateral derecho
};

const getPly = (game: Chess) => game.history().length;

export const Board = ({ code, items }: Props) => {
  const opening = items[code];
  const chessGameRef = useRef(new Chess());
  const [fen, setFen] = useState(chessGameRef.current.fen());

  useEffect(() => {
    const game = new Chess();

    if (!opening.isDefault) {
      // 1) reproducir la línea estándar de la familia
      const standard = items[opening.family.code];
      for (const mv of standard.moves) {
        game.move({ from: mv.from, to: mv.to });
      }

      const nextMove = opening?.moves[getPly(game)];

      setFen(game.fen());
      setTimeout(() => {
        game.move({ from: nextMove.from, to: nextMove.to });
        setFen(game.fen());
      }, 450);
    } else {
      setFen(game.fen());
    }

    chessGameRef.current = game;
  }, [opening, items]);

  const arrows = useMemo(() => {
    const game = chessGameRef.current;
    const ply = getPly(game);
    const mv = opening?.moves[ply];
    if (!mv) return [];
    const color = game.turn() === "w" ? "blue" : "red";
    return [{ startSquare: mv.from, endSquare: mv.to, color }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opening, fen]);

  const expectedMove = (ply: number) => opening?.moves[ply];

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    if (!targetSquare || !opening) return false;
    const game = chessGameRef.current;
    const ply = getPly(game);
    const mustPlay = expectedMove(ply);
    if (!mustPlay) return false;

    const isExact =
      mustPlay.from === sourceSquare && mustPlay.to === targetSquare;
    if (!isExact) return false;

    game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    setFen(game.fen());

    const reply = expectedMove(getPly(game));
    if (reply) {
      setTimeout(() => {
        game.move({ from: reply.from, to: reply.to });
        setFen(game.fen());
      }, 450);
    }
    return true;
  };

  // --- constants para el layout ---
  const SIDEBAR_W = 350; // ancho del panel derecho
  const GAP = 16; // separación entre tablero y panel
  const PADDING_X = 32; // padding horizontal del contenedor principal (16 + 16)

  // 👇 el tablero usará todo el ancho disponible menos panel+gap+padding
  const boardSize = `min(720px, calc(100vw - ${
    SIDEBAR_W + GAP + PADDING_X
  }px))`;

  return (
    // Fila: tablero + panel
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Columna del tablero, con el mismo boardSize */}
      <div style={{ width: boardSize }}>
        <Chessboard
          options={{
            id: "opening-script",
            position: fen,
            onPieceDrop,
            allowDragging:
              chessGameRef.current.turn() === "w" &&
              Boolean(opening.moves[getPly(chessGameRef.current)]),
            animationDurationInMs: 150,
            allowDrawingArrows: true,
            arrows,
            boardStyle: {
              width: "100%", // ocupa TODO el contenedor de la izquierda
              height: boardSize, // cuadrado exacto, acoplado al cálculo anterior
            },
          }}
        />
      </div>
    </div>
  );
};

export default Board;
