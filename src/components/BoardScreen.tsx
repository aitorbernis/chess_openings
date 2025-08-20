import { useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import type { Opening } from "../openings/types";

type Props = {
  code: Opening["code"];
  items: Record<string, Opening>;
  onBack: () => void;
  footer?: React.ReactNode;
  fullHeight?: boolean;
};

function getPly(game: Chess) {
  return game.history().length;
}

export default function BoardScreen({
  code,
  items,
  onBack,
  footer,
  fullHeight = true,
}: Props) {
  const opening = items[code];
  const chessGameRef = useRef(new Chess());
  const [fen, setFen] = useState(chessGameRef.current.fen());

  // Reset al cambiar de apertura
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

  function resetGame() {
    chessGameRef.current = new Chess();
    setFen(chessGameRef.current.fen()); // recalcula arrows por dependencia en fen
  }

  function expectedMove(ply: number) {
    return opening?.moves[ply];
  }

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
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
  }

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
          <p style={{ marginBottom: 12 }}>
            No encontré la apertura &ldquo;{code}&rdquo;.
          </p>
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

  const boardSize = "min(720px, calc(100vw - 40px))";

  return (
    <div
      style={{
        minHeight: fullHeight ? "100vh" : "auto", // 👈 clave
        background: "#111",
        color: "#eee",
        padding: 16,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12, // 16 -> 12 para compactar
          gap: 12,
        }}
      >
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

        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
          {opening.name}
        </h1>

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
      </header>

      <div style={{ display: "flex", justifyContent: "center" }}>
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
              width: boardSize,
              height: boardSize,
            },
          }}
        />
      </div>

      {/* Footer interno: queda pegado al tablero, sin scroll extra */}
      {footer && (
        <div
          style={{
            marginTop: 12, // compacto
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
