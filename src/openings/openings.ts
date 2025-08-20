import type { Opening } from "../openings/types";

// 🔎 Importa automáticamente todos los .ts dentro de ruyLopez
const modules = import.meta.glob("../openings/ruyLopez/*.ts", { eager: true });

const openings: Record<string, Opening> = Object.entries(modules).reduce(
  (acc, [, mod]) => {
    // Cada módulo debería exportar un objeto Opening como "default"
    const opening = (mod as { default: Opening }).default;
    acc[opening.code] = opening;
    return acc;
  },
  {} as Record<string, Opening>
);

export { openings };
