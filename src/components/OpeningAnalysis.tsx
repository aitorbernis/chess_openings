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

export const BoardScreen = ({ code, items, onBack, sideRight }: Props) => {
  const opening = items[code];
  const chessGameRef = useRef(new Chess());
  const [fen, setFen] = useState(chessGameRef.current.fen());
  const opponentMovementDelay = 450;

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
      }, opponentMovementDelay);
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
      }, opponentMovementDelay);
    }
    return true;
  };

  const goToPly = (targetPly: number) => {
    if (!opening) return false;
    const line = opening.moves ?? [];
    const game = new Chess();

    // Reproducir movimientos hasta targetPly (clamp por seguridad)
    const upto = Math.min(Math.max(0, targetPly), line.length);
    for (let i = 0; i < upto; i++) {
      const mv = line[i];
      try {
        game.move({ from: mv.from, to: mv.to, promotion: "q" });
      } catch {
        break; // por si algo fuese ilegal en datos
      }
    }
    chessGameRef.current = game;
    setFen(game.fen());
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

  const WHITE_ARROW_COLOR = "blue";
  const BLACK_ARROW_COLOR = "red";

  const plyNow = getPly(chessGameRef.current);
  const fullIdxNow = Math.floor(plyNow / 2);
  const isWhitesTurnNow = chessGameRef.current.turn() === "w";

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
      {/* Título con coloreado dinámico y navegación por click (antes de la jugada) */}
      <div style={{ width: "100%", textAlign: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 28, marginBottom: 24, lineHeight: 1.4 }}>
          {opening?.algebraic?.map((mv, i) => {
            const isThisWhite = i === fullIdxNow && isWhitesTurnNow;
            const isThisBlack = i === fullIdxNow && !isWhitesTurnNow;

            // Objetivo: dejar el tablero ANTES de esa jugada
            const whiteIdxBefore = 2 * i; // 0, 2, 4, ...
            const blackIdxBefore = 2 * i + 1; // 1, 3, 5, ...

            return (
              <span
                key={i}
                style={{ display: "inline-block", marginRight: 12 }}
              >
                <span style={{ opacity: 0.6, marginRight: 6 }}>{i + 1}.</span>

                {/* BLANCAS (clic: volver a la posición anterior a este SAN) */}
                <span
                  role="button"
                  aria-label={`Ir antes de ${i + 1}. ${mv.white}`}
                  onClick={() => goToPly(whiteIdxBefore)}
                  style={{
                    color: isThisWhite ? WHITE_ARROW_COLOR : "#eee",
                    fontWeight: isThisWhite ? 700 : 400,
                    cursor: "pointer",
                    userSelect: "none",
                    padding: "2px 4px",
                    borderRadius: 6,
                    transition: "color 120ms linear, background 120ms linear",
                    background: isThisWhite
                      ? "rgba(0,0,255,0.08)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.textDecoration = "none")
                  }
                >
                  {mv.white}
                </span>

                {/* NEGRAS (clic: posición tras 1 jugada de blancas, toca negras) */}
                {mv.black && (
                  <>
                    {" "}
                    <span
                      role="button"
                      aria-label={`Ir antes de ${i + 1}... ${mv.black}`}
                      onClick={() => goToPly(blackIdxBefore)}
                      style={{
                        color: isThisBlack ? BLACK_ARROW_COLOR : "#eee",
                        fontWeight: isThisBlack ? 700 : 400,
                        cursor: "pointer",
                        userSelect: "none",
                        padding: "2px 4px",
                        borderRadius: 6,
                        transition:
                          "color 120ms linear, background 120ms linear",
                        background: isThisBlack
                          ? "rgba(255,0,0,0.08)"
                          : "transparent",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.textDecoration = "underline")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.textDecoration = "none")
                      }
                    >
                      {mv.black}
                    </span>
                  </>
                )}
              </span>
            );
          })}
        </h1>
      </div>

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
            flex: `0 0 400px`,
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
