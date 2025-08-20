import type { Opening } from "./types";

// Estructura de familias agrupadas
export type FamilyGroup = {
  code: string;
  name: string;
  variants: Record<string, Opening>;
  defaultCode: string;
};

export const families: Record<string, FamilyGroup> = {};

// Carga todos los módulos de aperturas (cada archivo exporta `default: Opening`)
const modules = import.meta.glob("./**/*.ts", { eager: true });

for (const [, mod] of Object.entries(modules)) {
  const opening = (mod as { default?: Opening }).default;
  if (!opening || !opening.family) continue;

  const famCode = opening.family.code;
  if (!families[famCode]) {
    families[famCode] = {
      code: famCode,
      name: opening.family.name,
      variants: {},
      defaultCode: "",
    };
  }

  families[famCode].variants[opening.code] = opening;

  // La primera marcada como default gana; si ninguna lo está, quedará la primera que entre
  if (opening.isDefault || !families[famCode].defaultCode) {
    families[famCode].defaultCode = opening.code;
  }
}
