import type { DesmosExpr, TemplateResult } from "./types";

export const C = {
  RED: "#c74440",
  BLUE: "#2d70b3",
  GREEN: "#388c46",
  PURPLE: "#6042a6",
  ORANGE: "#fa7e19",
  BLACK: "#000000",
  GRAY: "#999999",
};

export function kvLookup(kv: Record<string, number>, keys: string[], fallback: number): number {
  for (const k of keys) {
    if (k in kv && typeof kv[k] === "number" && isFinite(kv[k])) return kv[k];
  }
  return fallback;
}

export function makeSlider(
  id: string,
  latexSym: string,
  val: number,
  defaultBounds: { min: number; max: number; step: number }
): DesmosExpr {
  let { min, max, step } = defaultBounds;
  if (val > max * 0.9) max = Math.ceil(val * 1.5 / step) * step;
  if (val < min * 1.1 && min < 0) min = Math.floor(val * 1.5 / step) * step;
  return { id, latex: `${latexSym}=${val}`, sliderBounds: { min, max, step } };
}

export function degToRad(d: number) { return d * Math.PI / 180; }

export function buildForceVector(
  id: string,
  ox: string, oy: string,
  dx: string, dy: string,
  color: string,
  label: string
): DesmosExpr {
  return {
    id,
    latex: `(${ox}+u(${dx}),\\ ${oy}+u(${dy}))`,
    parametricDomain: { min: "0", max: "1" },
    color,
    label,
    showLabel: true,
  };
}

export function buildForceVector3D(
  id: string,
  ox: string, oy: string, oz: string,
  dx: string, dy: string, dz: string,
  color: string,
  label: string
): DesmosExpr {
  return {
    id,
    latex: `(${ox}+u(${dx}),\\ ${oy}+u(${dy}),\\ ${oz}+u(${dz}))`,
    parametricDomain: { min: "0", max: "1" },
    color,
    label,
    showLabel: true,
  };
}

export function makeVTGraph(
  xOffset: number,
  vLatex: string,
  vMin: number,
  vMax: number,
  tMax: number,
  label?: string
): DesmosExpr[] {
  return [
    { id: "tgraph_axis", latex: `x=${xOffset}`, color: C.GRAY, lineStyle: "DASHED", hidden: true },
    { id: "tgraph_v_curve", latex: `(s+${xOffset},\\ ${vLatex})`, parametricDomain: { min: "0", max: String(tMax) }, color: C.ORANGE, lineStyle: "SOLID" },
    { id: "tgraph_origin", latex: `(${xOffset},0)`, color: C.GRAY, pointStyle: "CROSS", label: label || "t", showLabel: true },
  ];
}

export function makeSTGraph(
  xOffset: number,
  sLatex: string,
  tMax: number
): DesmosExpr[] {
  const sAsFunctionOfX = sLatex.replace(/s\b/g, "x");
  return [
    { id: "tgraph_s", latex: `y=${sAsFunctionOfX}`, color: C.GREEN, lineStyle: "DASHED" },
    { id: "tgraph_s_curve", latex: `(s+${xOffset},\\ ${sLatex})`, parametricDomain: { min: "0", max: String(tMax) }, color: C.GREEN, lineStyle: "DASHED" },
  ];
}
