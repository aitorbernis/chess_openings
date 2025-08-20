import { useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import { openings } from "./openings/openings";
import type { Opening } from "./openings/types";

/* -------- Helpers -------- */
function getPly(game: Chess) {
  return game.history().length;
}

function expectedMove(opening: Opening, ply: number) {
  return opening.moves[ply];
}

export default function App() {
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;

  const [fen, setFen] = useState(chessGame.fen());
  const [openingCode, setOpeningCode] = useState<Opening["code"]>("ruyLopez");
  const [boardWidth, setBoardWidth] = useState<number>(window.innerWidth - 40);

  const opening = useMemo(
    () => openings[openingCode as keyof typeof openings],
    [openingCode]
  );

  const ply = chessGame.history().length;
  const turn = chessGame.turn();

  const arrows = useMemo(() => {
    const move = opening.moves[ply];
    if (!move) return [];
    return [
      {
        startSquare: move.from,
        endSquare: move.to,
        color: turn === "w" ? "blue" : "red",
      },
    ];
  }, [opening, ply, turn]);

  /* Resize handler para responsive */
  useEffect(() => {
    function handleResize() {
      const padding = 40;
      const maxWidth = 720;
      setBoardWidth(Math.min(window.innerWidth - padding, maxWidth));
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function resetGame() {
    if (chessGame.history().length === 0) return;
    chessGameRef.current = new Chess();
    setFen(chessGameRef.current.fen()); // dispara el recalculo de arrows
  }

  function handleOpeningChange(code: Opening["code"]) {
    setOpeningCode(code);
    chessGameRef.current = new Chess();
    setFen(chessGameRef.current.fen());
  }

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    if (!targetSquare) return false;

    const ply = getPly(chessGame);
    const mustPlay = expectedMove(opening, ply);

    if (!mustPlay) return false;

    const isExact =
      mustPlay.from === sourceSquare && mustPlay.to === targetSquare;

    if (!isExact) return false;

    chessGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    setFen(chessGame.fen());

    const reply = expectedMove(opening, getPly(chessGame));
    if (reply) {
      setTimeout(() => {
        chessGame.move({ from: reply.from, to: reply.to });
        setFen(chessGame.fen());
      }, 450);
    }

    return true;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#eee",
        fontFamily: "system-ui, sans-serif",
        padding: 16,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <select
            value={openingCode}
            onChange={(e) =>
              handleOpeningChange(e.target.value as Opening["code"])
            }
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              background: "#222",
              color: "#eee",
              border: "1px solid #444",
              fontSize: 14,
            }}
          >
            {Object.values(openings).map((op) => (
              <option key={op.code} value={op.code}>
                {op.name}
              </option>
            ))}
          </select>

          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            {opening.name}
          </h1>

          <button
            onClick={resetGame}
            style={{
              background: "#2d2d2d",
              border: 0,
              padding: "8px 16px",
              borderRadius: 8,
              color: "#eee",
              cursor: "pointer",
              fontWeight: 500,
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
                chessGame.turn() === "w" &&
                Boolean(expectedMove(opening, getPly(chessGame))),
              animationDurationInMs: 150,
              arrows,
              allowDrawingArrows: true,
              boardStyle: {
                width: `${boardWidth}px`,
                height: `${boardWidth}px`,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
