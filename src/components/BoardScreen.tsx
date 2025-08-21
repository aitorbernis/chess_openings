import { useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import type { Opening } from "../openings/types";

type Props = {
  code: Opening["code"];
  items: Record<string, Opening>;
  onBack: () => void;
  footer?: React.ReactNode; // (queda por compatibilidad; no lo usamos)
  sideRight?: React.ReactNode; // 👈 NUEVO: panel lateral derecho
};

const getPly = (game: Chess) => game.history().length;

export const BoardScreen = ({ code, items, onBack, sideRight }: Props) => {
  const opening = items[code];
  const chessGameRef = useRef(new Chess());
  const [fen, setFen] = useState(chessGameRef.current.fen());

  useEffect(() => {
    chessGameRef.current = new Chess();
    setFen(chessGameRef.current.fen());
  }, [code]);

  const arrows = useMemo(() => {
    const game = chessGameRef.current;
    const ply = getPly(game);
    const mv = opening?.moves[ply];
    if (!mv) return [];
    const color = game.turn() === "w" ? "blue" : "red";
    return [{ startSquare: mv.from, endSquare: mv.to, color }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opening, fen]);

  const resetGame = () => {
    chessGameRef.current = new Chess();
    setFen(chessGameRef.current.fen());
  };

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

  if (!opening) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111",
          color: "#eee",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div>
          <p style={{ marginBottom: 12 }}>No encontré la apertura “{code}”.</p>
          <button
            onClick={onBack}
            style={{
              background: "#222",
              color: "#eee",
              border: "none",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

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
        alignItems: "flex-start",
        gap: GAP,
        flexWrap: "wrap", // en pantallas muy estrechas el panel caerá debajo (deseado)
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

      {/* Panel derecho (árbol) con ancho fijo */}

      {sideRight && (
        <aside
          style={{
            flex: `0 0 ${SIDEBAR_W}px`,
            width: SIDEBAR_W,
            maxHeight: "calc(100vh - 170px)",
            overflow: "auto",
            background: "#151515",
            border: "1px solid #2a2a2a",
            borderRadius: 12,
            padding: 8,
          }}
        >
          <div style={{ justifySelf: "end" }}>
            <button
              onClick={resetGame}
              style={{
                background: "#222",
                color: "#eee",
                border: "none",
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
          {sideRight}
        </aside>
      )}
    </div>
  );
};

export default BoardScreen;
