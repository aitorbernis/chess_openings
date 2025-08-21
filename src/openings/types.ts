export interface Opening {
  code: string; // p.ej. "closedRuyLopez"
  name: string; // p.ej. "Ruy López Cerrada"
  moves: Array<{ from: string; to: string }>;
  family: {
    // 👈 nuevo: familia / grupo
    code: string; // p.ej. "ruyLopez"
    name: string; // p.ej. "Ruy López"
  };
  isDefault?: boolean; // 👈 marca la variante por defecto dentro de la familia
  endFen?: string; // 👈 el fen final de la apertura
}
