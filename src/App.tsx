import { useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { PieceDropHandlerArgs } from "react-chessboard";
import { openings, type Opening } from "./openings";

/**
 * App.tsx — Minimal board based on chessboard.js example #5002
 * - Drag & drop with legal move check via chess.js
 * - Snap back on illegal moves
 * - Reset + Flip
 */

export default function App() {
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;
  const [chessPosition, setChessPosition] = useState(chessGame.fen());

  const [selectedOpening, setSelectedOpening] = useState<{
    code: Opening["code"];
    name: Opening["name"];
  }>({ code: openings.ruyLopez.code, name: openings.ruyLopez.name });

  const opening = openings[selectedOpening.code as keyof typeof openings];

  // handle piece drop
  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }

    // try to make the move according to chess.js logic
    try {
      const isMoveAllowed =
        opening.moves[chessGame.history().length].from === sourceSquare &&
        opening.moves[chessGame.history().length].to === targetSquare;

      if (isMoveAllowed) {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q", // always promote to a queen for example simplicity
        });
        setChessPosition(chessGame.fen());
      } else {
        return false;
      }

      const move = opening.moves[chessGame.history().length];

      setTimeout(() => {
        chessGame.move({
          from: move.from,
          to: move.to,
        });
        setChessPosition(chessGame.fen());
      }, 500);
      // update the position state upon successful move to trigger a re-render of the chessboard

      // return true as the move was successful
      return true;
    } catch {
      // return false as the move was not successful
      return false;
    }
  }

  // set the chessboard options
  const value = opening.arrows?.[chessGame.history().length];
  const arrows = value ? [value] : [];

  const resetGame = () => {
    chessGameRef.current = new Chess();
    setChessPosition(chessGameRef.current.fen());
  };

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#eee" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <select
            value={selectedOpening.code}
            onChange={(e) => {
              resetGame();
              console.log(openings[e.target.value as keyof typeof openings]);
              setSelectedOpening({
                name: openings[e.target.value as keyof typeof openings].name,
                code: e.target.value as Opening["code"],
              });
            }}
            className="border rounded p-1"
          >
            <option value={openings.ruyLopez.code}>
              {openings.ruyLopez.name}
            </option>
            <option value={openings.pastor.code}>{openings.pastor.name}</option>
          </select>
          <h1 style={{ fontSize: 18, fontWeight: 600 }}>
            Chess Board (Minimal)
          </h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => resetGame()}
              style={{
                background: "#2d2d2d",
                border: 0,
                padding: "8px 12px",
                borderRadius: 8,
                color: "#eee",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </header>

        <Chessboard
          options={{
            position: chessPosition,
            onPieceDrop,
            id: "play-vs-random",
            allowDragging: chessGame.turn() === "w",
            animationDurationInMs: 0,
            allowDrawingArrows: true,
            arrows,
          }}
        />
      </div>
    </div>
  );
}
