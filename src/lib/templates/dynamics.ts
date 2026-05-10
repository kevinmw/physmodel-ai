import type { TemplateFn } from "./types";
import { C, kvLookup, makeSlider, degToRad, buildForceVector, buildForceVector3D } from "./helpers";

export const dynamicsTemplates: Record<string, TemplateFn> = {

  inclined_plane: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const angle = kvLookup(kv, ["angle", "alpha"], 30);
    const mu = kvLookup(kv, ["mu"], 0.2);
    const aRad = degToRad(angle);
    const accel = g * (Math.sin(aRad) - mu * Math.cos(aRad));
    const tMax = accel > 0 ? Math.ceil(Math.sqrt(10 / accel) * 10) / 10 + 0.5 : 10;
    return {
      expressions: [
        makeSlider("angle", "\\alpha", angle, { min: 10, max: 60, step: 5 }),
        makeSlider("mu", "\\mu", mu, { min: 0, max: 1, step: 0.05 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "accel", latex: "a=g(\\sin(\\alpha)-\\mu\\cos(\\alpha))", hidden: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "top", latex: "(0,5)", color: C.GREEN, pointStyle: "CROSS", label: "S", showLabel: true },
        { id: "slope", latex: "(5s\\cos(\\alpha),\\ 5-5s\\sin(\\alpha))", parametricDomain: { min: "0", max: "1" }, color: C.BLACK },
        { id: "block", latex: "(\\frac{1}{2}at^{2}\\cos(\\alpha),\\ 5-\\frac{1}{2}at^{2}\\sin(\\alpha))", color: C.RED },
        buildForceVector("force_g", "\\frac{1}{2}at^{2}\\cos(\\alpha)", "5-\\frac{1}{2}at^{2}\\sin(\\alpha)", "0", "-2", C.PURPLE, "mg"),
        buildForceVector("force_n", "\\frac{1}{2}at^{2}\\cos(\\alpha)", "5-\\frac{1}{2}at^{2}\\sin(\\alpha)", "1.5\\cos(\\alpha+90)", "1.5\\sin(\\alpha+90)", C.GREEN, "N"),
        buildForceVector("force_f", "\\frac{1}{2}at^{2}\\cos(\\alpha)", "5-\\frac{1}{2}at^{2}\\sin(\\alpha)", "-1.2\\cos(\\alpha)", "-1.2\\sin(\\alpha)", C.ORANGE, "f"),
      ],
      viewport: { left: -1, right: 6, bottom: -1, top: 6 },
    };
  },

  circular_motion: (kv) => {
    const r = kvLookup(kv, ["r"], 3);
    const omega = kvLookup(kv, ["omega"], 2);
    const tMax = Math.ceil(2 * Math.PI / omega * 2 * 10) / 10;
    return {
      expressions: [
        makeSlider("r", "r", r, { min: 1, max: 5, step: 0.1 }),
        makeSlider("omega", "\\omega", omega, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
        { id: "point", latex: "(r\\cos(\\omega t),\\ r\\sin(\\omega t))", color: C.RED },
        { id: "circle", latex: "x^{2}+y^{2}=r^{2}", color: C.BLUE, lineStyle: "DASHED" },
        buildForceVector("force_c", "r\\cos(\\omega t)", "r\\sin(\\omega t)", "-1.2\\cos(\\omega t)", "-1.2\\sin(\\omega t)", C.PURPLE, "F"),
      ],
      viewport: { left: -r * 1.4, right: r * 1.4, bottom: -r * 1.4, top: r * 1.4 },
    };
  },

  vertical_circular: (kv) => {
    const r = kvLookup(kv, ["r"], 3);
    const g = kvLookup(kv, ["g"], 9.8);
    const v0 = kvLookup(kv, ["v0"], 8);
    const tMax = Math.ceil(2 * Math.PI * r / v0 * 2 * 10) / 10;
    return {
      expressions: [
        makeSlider("r", "r", r, { min: 1, max: 5, step: 0.5 }),
        makeSlider("v0", "v_{0}", v0, { min: 2, max: 15, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "omega", latex: "\\omega=\\frac{v_{0}}{r}", hidden: true },
        { id: "center", latex: "(0,r)", color: C.GRAY, pointStyle: "CROSS", label: "O", showLabel: true },
        { id: "track", latex: "x^{2}+(y-r)^{2}=r^{2}", color: C.BLUE, lineStyle: "DASHED" },
        { id: "ball", latex: "(r\\sin(\\omega t),\\ r-r\\cos(\\omega t))", color: C.RED },
        buildForceVector("force_g", "r\\sin(\\omega t)", "r-r\\cos(\\omega t)", "0", "-2", C.PURPLE, "mg"),
        buildForceVector("force_n", "r\\sin(\\omega t)", "r-r\\cos(\\omega t)", "-1.2\\sin(\\omega t)", "1.2\\cos(\\omega t)", C.GREEN, "N"),
      ],
      viewport: { left: -r * 1.5, right: r * 1.5, bottom: -r * 0.5, top: r * 2.5 },
    };
  },

  elastic_collision: (kv) => {
    const m1 = kvLookup(kv, ["m1"], 2);
    const m2 = kvLookup(kv, ["m2"], 3);
    const v1 = kvLookup(kv, ["v1", "v0"], 5);
    return {
      expressions: [
        makeSlider("m1", "m_{1}", m1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("m2", "m_{2}", m2, { min: 1, max: 10, step: 0.5 }),
        makeSlider("v1", "v_{1}", v1, { min: 1, max: 10, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.05 }, playing: true },
        { id: "v1f", latex: "v_{1f}=\\frac{m_{1}-m_{2}}{m_{1}+m_{2}}v_{1}", hidden: true },
        { id: "v2f", latex: "v_{2f}=\\frac{2m_{1}}{m_{1}+m_{2}}v_{1}", hidden: true },
        { id: "p1", latex: "(\\left\\{t<4:-5+v_{1}t,\\ -5+4v_{1}+v_{1f}(t-4)\\right\\},\\ 0)", color: C.RED },
        { id: "p2", latex: "(\\left\\{t<4:5,\\ 5+v_{2f}(t-4)\\right\\},\\ 0)", color: C.BLUE },
        { id: "wall_l", latex: "(-5,0)", color: C.GRAY, pointStyle: "CROSS" },
        { id: "wall_r", latex: "(5,0)", color: C.GRAY, pointStyle: "CROSS" },
      ],
      viewport: { left: -8, right: 15, bottom: -3, top: 3 },
    };
  },

  energy_conservation: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const h = kvLookup(kv, ["h"], 10);
    const tMax = Math.ceil(Math.sqrt(2 * h / g) * 10) / 10 + 0.5;
    return {
      expressions: [
        makeSlider("h", "h", h, { min: 2, max: 15, step: 1 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "top", latex: "(0,h)", color: C.GREEN, pointStyle: "CROSS", label: "H", showLabel: true },
        { id: "ground", latex: "(0,0)", color: C.BLACK, pointStyle: "CROSS", label: "G", showLabel: true },
        { id: "ball", latex: "(0,\\max(h-\\frac{g}{2}t^{2},0))", color: C.RED },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "vel", latex: "v=\\sqrt{2g(h-\\max(h-\\frac{g}{2}t^{2},0))}", hidden: true },
      ],
      viewport: { left: -3, right: 3, bottom: -h * 0.1, top: h * 1.15 },
    };
  },

  vector_addition: (kv) => {
    const F1 = kvLookup(kv, ["F1"], 5);
    const F2 = kvLookup(kv, ["F2"], 4);
    const theta1 = kvLookup(kv, ["theta1"], 30);
    const theta2 = kvLookup(kv, ["theta2"], 120);
    const maxF = Math.max(F1, F2) * 2;
    return {
      expressions: [
        makeSlider("F1", "F_{1}", F1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("F2", "F_{2}", F2, { min: 1, max: 10, step: 0.5 }),
        makeSlider("theta1", "\\theta_{1}", theta1, { min: 0, max: 360, step: 5 }),
        makeSlider("theta2", "\\theta_{2}", theta2, { min: 0, max: 360, step: 5 }),
        { id: "origin", latex: "(0,0)", color: C.BLACK, pointStyle: "CROSS", label: "O", showLabel: true },
        { id: "f1_vec", latex: `(uF_{1}\\cos(\\theta_{1}),\\ uF_{1}\\sin(\\theta_{1}))`, parametricDomain: { min: "0", max: "1" }, color: C.RED, label: "F_{1}", showLabel: true },
        { id: "f2_vec", latex: `(uF_{2}\\cos(\\theta_{2}),\\ uF_{2}\\sin(\\theta_{2}))`, parametricDomain: { min: "0", max: "1" }, color: C.BLUE, label: "F_{2}", showLabel: true },
        { id: "fr_vec", latex: `(u(F_{1}\\cos(\\theta_{1})+F_{2}\\cos(\\theta_{2})),\\ u(F_{1}\\sin(\\theta_{1})+F_{2}\\sin(\\theta_{2})))`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN, label: "F_{合}", showLabel: true },
        { id: "pg_line1", latex: `(F_{1}\\cos(\\theta_{1})+uF_{2}\\cos(\\theta_{2}),\\ F_{1}\\sin(\\theta_{1})+uF_{2}\\sin(\\theta_{2}))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY, lineStyle: "DASHED" },
        { id: "pg_line2", latex: `(F_{2}\\cos(\\theta_{2})+uF_{1}\\cos(\\theta_{1}),\\ F_{2}\\sin(\\theta_{2})+uF_{1}\\sin(\\theta_{1}))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY, lineStyle: "DASHED" },
      ],
      viewport: { left: -maxF * 0.3, right: maxF, bottom: -maxF * 0.5, top: maxF * 0.7 },
    };
  },

  atwood_machine: (kv) => {
    const m1 = kvLookup(kv, ["m1"], 3);
    const m2 = kvLookup(kv, ["m2"], 5);
    const g = kvLookup(kv, ["g"], 9.8);
    const accel = (m2 - m1) / (m1 + m2) * g;
    const tMax = 3;
    const dMax = 0.5 * Math.abs(accel) * tMax * tMax;
    return {
      expressions: [
        makeSlider("m1", "m_{1}", m1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("m2", "m_{2}", m2, { min: 1, max: 10, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "accel", latex: "a=\\frac{m_{2}-m_{1}}{m_{1}+m_{2}}g", hidden: true },
        { id: "pulley", latex: "(0,5)", color: C.GRAY, pointStyle: "CROSS", label: "P", showLabel: true },
        { id: "rope_l", latex: `(-1,\\ 5-u(5-\\frac{1}{2}at^{2}))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        { id: "mass1", latex: "(-1,\\ \\frac{1}{2}at^{2})", color: C.RED, label: "m_{1}", showLabel: true },
        { id: "rope_r", latex: `(1,\\ 5-u(5+\\frac{1}{2}at^{2}))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        { id: "mass2", latex: `(1,\\ -\\frac{1}{2}at^{2})`, color: C.BLUE, label: "m_{2}", showLabel: true },
      ],
      viewport: { left: -3, right: 3, bottom: -dMax - 2, top: 6 },
    };
  },

  lever_balance: (kv) => {
    const F1 = kvLookup(kv, ["F1"], 6);
    const F2 = kvLookup(kv, ["F2"], 4);
    const L1 = kvLookup(kv, ["L1"], 3);
    const L2 = kvLookup(kv, ["L2"], 4);
    const leverLen = L1 + L2;
    return {
      expressions: [
        makeSlider("F1", "F_{1}", F1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("F2", "F_{2}", F2, { min: 1, max: 10, step: 0.5 }),
        makeSlider("L1", "L_{1}", L1, { min: 1, max: 8, step: 0.5 }),
        makeSlider("L2", "L_{2}", L2, { min: 1, max: 8, step: 0.5 }),
        { id: "lever", latex: `(-L_{1}+u(L_{1}+L_{2}),\\ 0)`, parametricDomain: { min: "0", max: "1" }, color: C.BLACK },
        { id: "pivot", latex: "(0,0)", color: C.GRAY, pointStyle: "CROSS", label: "O", showLabel: true },
        { id: "f1_vec", latex: `(-L_{1},\\ uF_{1})`, parametricDomain: { min: "0", max: "1" }, color: C.RED, label: "F_{1}", showLabel: true },
        { id: "f2_vec", latex: `(L_{2},\\ uF_{2})`, parametricDomain: { min: "0", max: "1" }, color: C.BLUE, label: "F_{2}", showLabel: true },
        { id: "torque1", latex: "M_{1}=F_{1}L_{1}", hidden: true },
        { id: "torque2", latex: "M_{2}=F_{2}L_{2}", hidden: true },
        { id: "balance", latex: `(0,\\ \\left\\{F_{1}L_{1}=F_{2}L_{2}:2,\\ -2\\right\\})`, color: C.GREEN, label: "\\left\\{F_{1}L_{1}=F_{2}L_{2}:\\text{平衡},\\text{不平衡}\\right\\}", showLabel: true },
      ],
      viewport: { left: -leverLen, right: leverLen, bottom: -Math.max(F1, F2) - 1, top: Math.max(F1, F2) + 2 },
    };
  },

  connected_bodies: (kv) => {
    const m1 = kvLookup(kv, ["m1"], 2);
    const m2 = kvLookup(kv, ["m2"], 4);
    const F = kvLookup(kv, ["F"], 12);
    const mu = kvLookup(kv, ["mu"], 0.2);
    const g = kvLookup(kv, ["g"], 9.8);
    const accel = F / (m1 + m2) - mu * g;
    const tMax = accel > 0 ? 4 : 2;
    const dMax = accel > 0 ? 0.5 * accel * tMax * tMax : 0;
    return {
      expressions: [
        makeSlider("m1", "m_{1}", m1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("m2", "m_{2}", m2, { min: 1, max: 10, step: 0.5 }),
        makeSlider("F", "F", F, { min: 1, max: 30, step: 1 }),
        makeSlider("mu", "\\mu", mu, { min: 0, max: 1, step: 0.05 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "accel", latex: "a=\\frac{F}{m_{1}+m_{2}}-\\mu g", hidden: true },
        { id: "ground", latex: "(-2,0)", color: C.BLACK, pointStyle: "CROSS" },
        { id: "block1", latex: "(\\frac{1}{2}at^{2},\\ 0.5)", color: C.RED, label: "m_{1}", showLabel: true },
        { id: "rope", latex: `(\\frac{1}{2}at^{2}+u2,\\ 0.5)`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        { id: "block2", latex: `(\\frac{1}{2}at^{2}+2,\\ 0.5)`, color: C.BLUE, label: "m_{2}", showLabel: true },
        buildForceVector("force_F", "\\frac{1}{2}at^{2}", "0.5", "-2", "0", C.GREEN, "F"),
        buildForceVector("force_f1", "\\frac{1}{2}at^{2}", "0.5", "1.5", "0", C.ORANGE, "f_{1}"),
        buildForceVector("force_f2", "\\frac{1}{2}at^{2}+2", "0.5", "1.5", "0", C.ORANGE, "f_{2}"),
        buildForceVector("force_T", "\\frac{1}{2}at^{2}", "0.5", "1.5", "0", C.PURPLE, "T"),
      ],
      viewport: { left: -4, right: dMax + 6, bottom: -1, top: 3 },
    };
  },

  inclined_connected: (kv) => {
    const m1 = kvLookup(kv, ["m1"], 3);
    const m2 = kvLookup(kv, ["m2"], 2);
    const angle = kvLookup(kv, ["angle", "alpha"], 30);
    const g = kvLookup(kv, ["g"], 9.8);
    const mu = kvLookup(kv, ["mu"], 0);
    const aRad = degToRad(angle);
    const accel = (m1 * g - m2 * g * (Math.sin(aRad) + mu * Math.cos(aRad))) / (m1 + m2);
    const tMax = Math.abs(accel) > 0.1 ? 3 : 5;
    return {
      expressions: [
        makeSlider("m1", "m_{1}", m1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("m2", "m_{2}", m2, { min: 1, max: 10, step: 0.5 }),
        makeSlider("angle", "\\alpha", angle, { min: 10, max: 60, step: 5 }),
        makeSlider("mu", "\\mu", mu, { min: 0, max: 1, step: 0.05 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "accel", latex: "a=\\frac{m_{1}g-m_{2}g(\\sin(\\alpha)+\\mu\\cos(\\alpha))}{m_{1}+m_{2}}", hidden: true },
        { id: "slope", latex: `(5s\\cos(\\alpha),\\ 5-5s\\sin(\\alpha))`, parametricDomain: { min: "0", max: "1" }, color: C.BLACK },
        { id: "pulley", latex: `(5\\cos(\\alpha),\\ 5-5\\sin(\\alpha))`, color: C.GRAY, pointStyle: "CROSS", label: "P", showLabel: true },
        { id: "block2", latex: `(5\\cos(\\alpha)-\\frac{1}{2}at^{2}\\cos(\\alpha),\\ 5-5\\sin(\\alpha)+\\frac{1}{2}at^{2}\\sin(\\alpha))`, color: C.BLUE, label: "m_{2}", showLabel: true },
        { id: "block1", latex: `(5\\cos(\\alpha),\\ 5-5\\sin(\\alpha)-\\frac{1}{2}at^{2})`, color: C.RED, label: "m_{1}", showLabel: true },
      ],
      viewport: { left: -2, right: 7, bottom: -3, top: 7 },
    };
  },

  binary_star: (kv) => {
    const m1 = kvLookup(kv, ["m1"], 3);
    const m2 = kvLookup(kv, ["m2"], 5);
    const d = kvLookup(kv, ["d"], 6);
    const tMax = 2 * Math.PI * 2;
    return {
      expressions: [
        makeSlider("m1", "m_{1}", m1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("m2", "m_{2}", m2, { min: 1, max: 10, step: 0.5 }),
        makeSlider("d", "d", d, { min: 2, max: 10, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "r1", latex: "r_{1}=\\frac{m_{2}}{m_{1}+m_{2}}d", hidden: true },
        { id: "r2", latex: "r_{2}=\\frac{m_{1}}{m_{1}+m_{2}}d", hidden: true },
        { id: "p1", latex: "(r_{1}\\cos(t),\\ r_{1}\\sin(t))", color: C.RED },
        { id: "p2", latex: "(-r_{2}\\cos(t),\\ -r_{2}\\sin(t))", color: C.BLUE },
        { id: "orbit1", latex: "x^{2}+y^{2}=r_{1}^{2}", color: C.RED, lineStyle: "DASHED" },
        { id: "orbit2", latex: "x^{2}+y^{2}=r_{2}^{2}", color: C.BLUE, lineStyle: "DASHED" },
      ],
      viewport: { left: -d * 0.8, right: d * 0.8, bottom: -d * 0.8, top: d * 0.8 },
    };
  },

  /** 梯子平衡 */
  ladder_equilibrium: (kv) => {
    const angle = kvLookup(kv, ["angle", "theta"], 60);
    const L = kvLookup(kv, ["L", "l"], 5);
    const m = kvLookup(kv, ["m"], 10);
    const g = kvLookup(kv, ["g"], 9.8);
    const aRad = degToRad(angle);
    const topY = L * Math.sin(aRad);
    return {
      expressions: [
        makeSlider("angle", "\\theta", angle, { min: 20, max: 80, step: 5 }),
        makeSlider("L", "L", L, { min: 2, max: 10, step: 0.5 }),
        { id: "g_def", latex: `g=${g}`, hidden: true },
        // Wall and ground
        { id: "wall", latex: "(0,\\ uL\\cdot 1.2)", parametricDomain: { min: "0", max: "1" }, color: C.BLACK },
        { id: "ground", latex: `(uL\\cdot 1.2,\\ 0)`, parametricDomain: { min: "-0.1", max: "1" }, color: C.BLACK },
        // Ladder
        { id: "ladder", latex: `(L\\cos(\\theta)(1-s),\\ L\\sin(\\theta)s)`, parametricDomain: { min: "0", max: "1" }, color: C.RED },
        { id: "base", latex: `(L\\cos(\\theta),0)`, color: C.RED, pointStyle: "CROSS", label: "A", showLabel: true },
        { id: "top_pt", latex: `(0,L\\sin(\\theta))`, color: C.RED, pointStyle: "CROSS", label: "B", showLabel: true },
        { id: "cm", latex: `(\\frac{L\\cos(\\theta)}{2},\\ \\frac{L\\sin(\\theta)}{2})`, color: C.ORANGE, label: "G", showLabel: true },
        buildForceVector("force_g", "\\frac{L\\cos(\\theta)}{2}", "\\frac{L\\sin(\\theta)}{2}", "0", "-2", C.PURPLE, "mg"),
        buildForceVector("force_ng", "L\\cos(\\theta)", "0", "0", "1.5", C.GREEN, "N_{1}"),
        buildForceVector("force_nw", "0", "L\\sin(\\theta)", "1.5", "0", C.BLUE, "N_{2}"),
        buildForceVector("force_f", "L\\cos(\\theta)", "0", "-1.5", "0", C.ORANGE, "f"),
      ],
      viewport: { left: -2, right: L * 1.3, bottom: -3, top: topY * 1.3 + 1 },
    };
  },

  /** 倾斜弯道 */
  banked_turn: (kv) => {
    const angle = kvLookup(kv, ["angle", "theta"], 30);
    const r = kvLookup(kv, ["r"], 5);
    const g = kvLookup(kv, ["g"], 9.8);
    const vDesign = Math.sqrt(r * g * Math.tan(degToRad(angle)));
    const tMax = vDesign > 0 ? Math.ceil(2 * Math.PI * r / vDesign * 2 * 10) / 10 : 10;
    return {
      expressions: [
        makeSlider("angle", "\\theta", angle, { min: 10, max: 60, step: 5 }),
        makeSlider("r", "r", r, { min: 2, max: 15, step: 1 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "v_design", latex: "v_{0}=\\sqrt{rg\\tan(\\theta)}", hidden: true },
        // Circular track (top view)
        { id: "track", latex: "x^{2}+y^{2}=r^{2}", color: C.BLUE, lineStyle: "DASHED" },
        { id: "car", latex: "(r\\cos(t),\\ r\\sin(t))", color: C.RED },
        buildForceVector("force_v", "r\\cos(t)", "r\\sin(t)", "-1.5\\sin(t)", "1.5\\cos(t)", C.GREEN, "v"),
        buildForceVector("force_c", "r\\cos(t)", "r\\sin(t)", "-1.2\\cos(t)", "-1.2\\sin(t)", C.PURPLE, "a_{c}"),
        // Side view inset (bottom right)
        { id: "bank", latex: `(r+2+2s\\cos(\\theta),\\ -r-1+2s\\sin(\\theta))`, parametricDomain: { min: "0", max: "1" }, color: C.BLACK },
        { id: "bank_car", latex: `(r+2+\\cos(\\theta),\\ -r-1+\\sin(\\theta))`, color: C.RED },
        buildForceVector("bf_g", "r+2+\\cos(\\theta)", "-r-1+\\sin(\\theta)", "0", "-1.5", C.PURPLE, "mg"),
        buildForceVector("bf_n", "r+2+\\cos(\\theta)", "-r-1+\\sin(\\theta)", "-1.2\\sin(\\theta)", "1.2\\cos(\\theta)", C.GREEN, "N"),
      ],
      viewport: { left: -r * 1.4, right: r * 1.4 + 5, bottom: -r * 1.4 - 3, top: r * 1.4 },
    };
  },

  /** 势能曲线 */
  potential_energy: (kv) => {
    const k = kvLookup(kv, ["k"], 5);
    const E = kvLookup(kv, ["E"], 10);
    const xMax = Math.sqrt(2 * E / k) * 1.3;
    const tMax = 6;
    return {
      expressions: [
        makeSlider("k", "k", k, { min: 1, max: 20, step: 1 }),
        makeSlider("E", "E", E, { min: 2, max: 30, step: 1 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        // U(x) = kx²/2
        { id: "U_curve", latex: "y=\\frac{k}{2}x^{2}", color: C.BLUE },
        // Total energy line
        { id: "E_line", latex: "y=E", color: C.RED, lineStyle: "DASHED" },
        // Turning points
        { id: "turn_l", latex: "(-\\sqrt{2E/k},\\ E)", color: C.ORANGE, pointStyle: "CROSS", label: "x_{1}", showLabel: true },
        { id: "turn_r", latex: "(\\sqrt{2E/k},\\ E)", color: C.ORANGE, pointStyle: "CROSS", label: "x_{2}", showLabel: true },
        // Ball oscillating on the curve
        { id: "x_ball", latex: "x_{b}=\\sqrt{2E/k}\\sin(t)", hidden: true },
        { id: "ball", latex: "(x_{b},\\ \\frac{k}{2}x_{b}^{2})", color: C.RED },
      ],
      viewport: { left: -xMax, right: xMax, bottom: -E * 0.15, top: E * 1.3 },
    };
  },

  /** 点积与投影 */
  dot_product: (kv) => {
    const F1 = kvLookup(kv, ["F1", "A"], 4);
    const F2 = kvLookup(kv, ["F2", "B"], 3);
    const theta1 = kvLookup(kv, ["theta1"], 20);
    const theta2 = kvLookup(kv, ["theta2"], 50);
    const maxV = Math.max(F1, F2) * 1.5;
    return {
      expressions: [
        makeSlider("F1", "\\vec{A}", F1, { min: 1, max: 8, step: 0.5 }),
        makeSlider("F2", "\\vec{B}", F2, { min: 1, max: 8, step: 0.5 }),
        makeSlider("theta1", "\\alpha", theta1, { min: 0, max: 360, step: 5 }),
        makeSlider("theta2", "\\beta", theta2, { min: 0, max: 360, step: 5 }),
        { id: "dot_def", latex: "\\vec{A}\\cdot\\vec{B}=|\\vec{A}||\\vec{B}|\\cos(\\beta-\\alpha)", hidden: true },
        { id: "origin", latex: "(0,0)", color: C.BLACK, pointStyle: "CROSS", label: "O", showLabel: true },
        // Vector A
        { id: "vec_a", latex: `(u\\vec{A}\\cos(\\alpha),\\ u\\vec{A}\\sin(\\alpha))`, parametricDomain: { min: "0", max: "1" }, color: C.RED, label: "A", showLabel: true },
        // Vector B
        { id: "vec_b", latex: `(u\\vec{B}\\cos(\\beta),\\ u\\vec{B}\\sin(\\beta))`, parametricDomain: { min: "0", max: "1" }, color: C.BLUE, label: "B", showLabel: true },
        // Projection of B onto A: A·B/|A| * (cos α, sin α)
        { id: "proj", latex: `(u\\vec{B}\\cos(\\beta-\\alpha)\\cos(\\alpha),\\ u\\vec{B}\\cos(\\beta-\\alpha)\\sin(\\alpha))`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN, lineStyle: "DASHED" },
        // Dashed line from B tip to projection
        { id: "drop", latex: `(\\vec{B}\\cos(\\beta)+u(\\vec{B}\\cos(\\beta-\\alpha)\\cos(\\alpha)-\\vec{B}\\cos(\\beta)),\\ \\vec{B}\\sin(\\beta)+u(\\vec{B}\\cos(\\beta-\\alpha)\\sin(\\alpha)-\\vec{B}\\sin(\\beta)))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY, lineStyle: "DASHED" },
        // Angle arc
        { id: "angle_arc", latex: `(u\\cos(\\alpha+u(\\beta-\\alpha)),\\ u\\sin(\\alpha+u(\\beta-\\alpha)))`, parametricDomain: { min: "0.5", max: "1" }, color: C.ORANGE },
      ],
      viewport: { left: -maxV, right: maxV, bottom: -maxV, top: maxV },
    };
  },

  /** 力矩与叉积 (3D) */
  torque_3d: (kv) => {
    const r = kvLookup(kv, ["r", "L"], 3);
    const F = kvLookup(kv, ["F"], 4);
    const phi = kvLookup(kv, ["phi"], 30);
    return {
      expressions: [
        makeSlider("r", "r", r, { min: 1, max: 5, step: 0.5 }),
        makeSlider("F", "F", F, { min: 1, max: 8, step: 0.5 }),
        makeSlider("phi", "\\phi", phi, { min: 0, max: 90, step: 5 }),
        { id: "torque_def", latex: "\\tau=rF\\sin(\\phi)", hidden: true },
        // Position vector r (along x-axis)
        { id: "r_vec", latex: `(ur\\cos(0),\\ 0,\\ 0)`, parametricDomain: { min: "0", max: "1" }, color: C.RED, label: "r", showLabel: true },
        // Force vector F at angle phi from r (in x-y plane)
        { id: "f_vec", latex: `(r+uF\\cos(\\phi),\\ uF\\sin(\\phi),\\ 0)`, parametricDomain: { min: "0", max: "1" }, color: C.BLUE, label: "F", showLabel: true },
        // Torque vector (perpendicular, along z-axis)
        { id: "tau_vec", latex: `(r,\\ 0,\\ uF\\cdot r\\cdot\\sin(\\phi)/3)`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN, label: "\\tau", showLabel: true },
        // Angle arc between r and F
        { id: "angle_arc", latex: `(r+u\\cos(u\\phi),\\ u\\sin(u\\phi),\\ 0)`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        // Pivot point
        { id: "pivot", latex: "(0,0,0)", color: C.GRAY, pointStyle: "CROSS", label: "O", showLabel: true },
        // Bar
        { id: "bar", latex: `(ur,\\ 0,\\ 0)`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
      ],
      viewport3d: { xMin: -1, xMax: r + F + 2, yMin: -F - 1, yMax: F + 1, zMin: -1, zMax: F * r / 3 + 2 },
      dimension: '3d' as const,
    };
  },

  /** 碰撞解空间 (v1-v2 相图) */
  collision_phase_space: (kv) => {
    const m1 = kvLookup(kv, ["m1"], 2);
    const m2 = kvLookup(kv, ["m2"], 3);
    const v1i = kvLookup(kv, ["v1", "v1i"], 5);
    const v2i = kvLookup(kv, ["v2", "v2i"], -3);
    const pTotal = m1 * v1i + m2 * v2i;
    const keTotal = 0.5 * m1 * v1i * v1i + 0.5 * m2 * v2i * v2i;
    const vMax = Math.max(Math.abs(v1i), Math.abs(v2i)) * 2;
    return {
      expressions: [
        makeSlider("m1", "m_{1}", m1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("m2", "m_{2}", m2, { min: 1, max: 10, step: 0.5 }),
        makeSlider("v1i", "v_{1i}", v1i, { min: -10, max: 10, step: 0.5 }),
        makeSlider("v2i", "v_{2i}", v2i, { min: -10, max: 10, step: 0.5 }),
        { id: "p_def", latex: "p=m_{1}v_{1i}+m_{2}v_{2i}", hidden: true },
        { id: "ke_def", latex: "K=\\frac{1}{2}m_{1}v_{1i}^{2}+\\frac{1}{2}m_{2}v_{2i}^{2}", hidden: true },
        // Momentum conservation line: m1*v1 + m2*v2 = p
        { id: "p_line", latex: `y=\\frac{p-m_{1}x}{m_{2}}`, color: C.RED, label: "p=const", showLabel: true },
        // Energy conservation ellipse: 0.5*m1*v1^2 + 0.5*m2*v2^2 = K
        { id: "ke_ellipse", latex: `\\frac{m_{1}x^{2}}{2K}+\\frac{m_{2}y^{2}}{2K}=1`, color: C.GREEN, lineStyle: "DASHED" },
        // Initial state point
        { id: "init", latex: `(v_{1i},\\ v_{2i})`, color: C.PURPLE, label: "Initial", showLabel: true },
        // Elastic final point (on both line and ellipse)
        { id: "elastic", latex: `(\\frac{(m_{1}-m_{2})v_{1i}+2m_{2}v_{2i}}{m_{1}+m_{2}},\\ \\frac{2m_{1}v_{1i}+(m_{2}-m_{1})v_{2i}}{m_{1}+m_{2}})`, color: C.GREEN, label: "Elastic", showLabel: true },
        // Axes labels
        { id: "v1_axis", latex: "(0,0)", color: C.GRAY, label: "v_{1}", showLabel: true },
      ],
      viewport: { left: -vMax, right: vMax, bottom: -vMax, top: vMax },
    };
  },

  /** 牛顿壳层定理 (2D演示) */
  shell_theorem: (kv) => {
    const N = kvLookup(kv, ["N"], 12);
    const R = kvLookup(kv, ["R"], 3);
    const testR = kvLookup(kv, ["r", "d"], 5);
    const totalMass = N;
    const fieldRange = 8;
    return {
      expressions: [
        makeSlider("N", "N", N, { min: 4, max: 30, step: 1 }),
        makeSlider("R", "R", R, { min: 1, max: 5, step: 0.5 }),
        makeSlider("testR", "r_{t}", testR, { min: 0, max: 8, step: 0.5 }),
        // Shell particles arranged in a circle
        { id: "shell", latex: `(R\\cos(s),\\ R\\sin(s))`, parametricDomain: { min: "0", max: String(2 * Math.PI) }, color: C.BLUE, lineStyle: "DASHED" },
        // Individual particles on shell (show first N as points)
        // Use a list comprehension approach: show shell circle
        { id: "p1", latex: `(R\\cos(0),\\ R\\sin(0))`, color: C.BLUE },
        { id: "p2", latex: `(R\\cos(\\frac{2\\pi}{N}),\\ R\\sin(\\frac{2\\pi}{N}))`, color: C.BLUE },
        { id: "p3", latex: `(R\\cos(\\frac{4\\pi}{N}),\\ R\\sin(\\frac{4\\pi}{N}))`, color: C.BLUE },
        { id: "p4", latex: `(R\\cos(\\frac{6\\pi}{N}),\\ R\\sin(\\frac{6\\pi}{N}))`, color: C.BLUE },
        { id: "p5", latex: `(R\\cos(\\frac{8\\pi}{N}),\\ R\\sin(\\frac{8\\pi}{N}))`, color: C.BLUE },
        { id: "p6", latex: `(R\\cos(\\frac{10\\pi}{N}),\\ R\\sin(\\frac{10\\pi}{N}))`, color: C.BLUE },
        // Test particle
        { id: "test", latex: "(r_{t},\\ 0)", color: C.RED, label: "m", showLabel: true },
        // Ideal force line: F = GMm/r^2 outside, 0 inside (2D: F ∝ 1/r)
        { id: "force_outside", latex: "y=\\left\\{x>R:\\frac{N}{x},\\ 0\\right\\}", color: C.GREEN, lineStyle: "DASHED" },
        // Force arrow on test particle
        buildForceVector("force_v", "r_{t}", "0", "\\left\\{r_{t}>R:\\frac{3N}{r_{t}},\\ 0\\right\\}", "0", C.PURPLE, "F"),
        // Labels
        { id: "inside_label", latex: "(0,\\ -R-1)", color: C.GREEN, label: "F=0\\ (inside)", showLabel: true },
        { id: "outside_label", latex: "(R+2,\\ 2)", color: C.GREEN, label: "F\\propto 1/r\\ (outside)", showLabel: true },
      ],
      viewport: { left: -fieldRange, right: fieldRange, bottom: -fieldRange * 0.7, top: fieldRange * 0.7 },
    };
  },

  /** 2D弹性碰撞 */
  "2d_collision": (kv) => {
    const m1 = kvLookup(kv, ["m1"], 2);
    const m2 = kvLookup(kv, ["m2"], 3);
    const v1 = kvLookup(kv, ["v1", "v0"], 5);
    const theta = kvLookup(kv, ["theta", "angle"], 30);
    const e = kvLookup(kv, ["e"], 1); // coefficient of restitution
    const tCol = 3;
    const tMax = 8;
    return {
      expressions: [
        makeSlider("m1", "m_{1}", m1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("m2", "m_{2}", m2, { min: 1, max: 10, step: 0.5 }),
        makeSlider("v1", "v_{1}", v1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("theta", "\\theta", theta, { min: 0, max: 60, step: 5 }),
        makeSlider("e", "e", e, { min: 0, max: 1, step: 0.1 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: "9.8", hidden: true },
        // Pre-collision positions
        { id: "b1_pre", latex: "(-5+v_{1}t,\\ 0)", color: C.RED },
        { id: "b2_pre", latex: "(3,\\ 0)", color: C.BLUE },
        // After collision velocities (using 1D formula with restitution)
        { id: "v1f_def", latex: "v_{1f}=\\frac{m_{1}-e\\cdot m_{2}}{m_{1}+m_{2}}v_{1}", hidden: true },
        { id: "v2f_def", latex: "v_{2f}=\\frac{(1+e)m_{1}}{m_{1}+m_{2}}v_{1}", hidden: true },
        // B1 actual position with If
        { id: "b1", latex: "(If(t<3,\\ -5+v_{1}t,\\ -5+3v_{1}+v_{1f}(t-3)),\\ 0)", color: C.RED, label: "m_{1}", showLabel: true },
        // B2 deflected at angle theta
        { id: "b2", latex: "(If(t<3,\\ 3,\\ 3+v_{2f}\\cos(\\theta)(t-3)),\\ If(t<3,\\ 0,\\ v_{2f}\\sin(\\theta)(t-3)))", color: C.BLUE, label: "m_{2}", showLabel: true },
        // Trajectory traces
        { id: "b1_trace", latex: "(x,\\ 0)", color: C.RED, lineStyle: "DASHED" },
        { id: "b2_trace", latex: "(3+v_{2f}\\cos(\\theta)s,\\ v_{2f}\\sin(\\theta)s)", parametricDomain: { min: "0", max: "5" }, color: C.BLUE, lineStyle: "DASHED" },
      ],
      viewport: { left: -8, right: 12, bottom: -6, top: 6 },
    };
  },

  /** 滚动与滑移转变 */
  rolling_slipping: (kv) => {
    const v0 = kvLookup(kv, ["v0", "v"], 8);
    const mu = kvLookup(kv, ["mu"], 0.3);
    const R = kvLookup(kv, ["R"], 0.5);
    const g = kvLookup(kv, ["g"], 9.8);
    const tSlide = v0 / (3 * mu * g);
    const vRoll = 2 * v0 / 3;
    const tMax = Math.ceil(tSlide * 3 * 10) / 10;
    return {
      expressions: [
        makeSlider("v0", "v_{0}", v0, { min: 1, max: 15, step: 0.5 }),
        makeSlider("mu", "\\mu", mu, { min: 0.1, max: 0.8, step: 0.05 }),
        makeSlider("R", "R", R, { min: 0.2, max: 1, step: 0.1 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "t_slide", latex: "t_{s}=\\frac{v_{0}}{3\\mu g}", hidden: true },
        // Velocity during sliding phase (decreasing), then constant
        { id: "v_cm", latex: "v=If(t<t_{s},\\ v_{0}-\\mu g t,\\ \\frac{2v_{0}}{3})", hidden: true },
        // Position of center
        { id: "ball", latex: "(v_{0}t-\\frac{1}{2}\\mu g t^{2},\\ R)", color: C.RED },
        // Ground line
        { id: "ground", latex: "y=0", color: C.BLACK },
        // Friction direction during sliding
        buildForceVector("force_f", "v_{0}t-\\frac{1}{2}\\mu g t^{2}", "R", "If(t<t_{s},\\ -1.5,\\ 0)", "0", C.ORANGE, "f"),
        // Angular velocity indicator (rotation marker on ball)
        { id: "marker", latex: "(v_{0}t-\\frac{1}{2}\\mu g t^{2}+R\\cos(5t),\\ R+R\\sin(5t))", color: C.BLUE },
        // Phase label
        { id: "phase", latex: "(2,\\ 2R+1)", color: C.PURPLE, label: "If(t<t_{s},\\ Sliding,\\ Rolling)", showLabel: true },
      ],
      viewport: { left: -1, right: v0 * tMax * 0.3, bottom: -0.5, top: 3 * R + 2 },
    };
  },

  /** 物理摆（杆） */
  physical_pendulum: (kv) => {
    const L = kvLookup(kv, ["L", "l"], 2);
    const theta0 = kvLookup(kv, ["theta0", "alpha0", "theta", "alpha"], 45);
    const g = kvLookup(kv, ["g"], 9.8);
    // For uniform rod pivoting at end: I = mL^2/3, omega0 = sqrt(3g/(2L))
    const omega0 = Math.sqrt(3 * g / (2 * L));
    const tMax = Math.ceil(2 * Math.PI / omega0 * 3 * 10) / 10;
    return {
      expressions: [
        makeSlider("L", "L", L, { min: 0.5, max: 5, step: 0.1 }),
        makeSlider("theta0", "\\theta_{0}", theta0, { min: 10, max: 90, step: 5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "omega0_def", latex: "\\omega_{0}=\\sqrt{\\frac{3g}{2L}}", hidden: true },
        { id: "I_def", latex: "I=\\frac{1}{3}mL^{2}", hidden: true },
        // Pivot point
        { id: "pivot", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
        // Rod as a parametric line
        { id: "rod", latex: "(Ls\\sin(\\theta_{0}\\cos(\\omega_{0}t)),\\ -Ls\\cos(\\theta_{0}\\cos(\\omega_{0}t)))", parametricDomain: { min: "0", max: "1" }, color: C.BLUE },
        // End of rod (center of mass for uniform rod at L/2)
        { id: "end", latex: "(L\\sin(\\theta_{0}\\cos(\\omega_{0}t)),\\ -L\\cos(\\theta_{0}\\cos(\\omega_{0}t)))", color: C.RED },
        // Center of mass marker (at L/2)
        { id: "cm", latex: "(\\frac{L}{2}\\sin(\\theta_{0}\\cos(\\omega_{0}t)),\\ -\\frac{L}{2}\\cos(\\theta_{0}\\cos(\\omega_{0}t)))", color: C.PURPLE, label: "CM", showLabel: true },
        // Trajectory of end
        { id: "trail", latex: "(L\\sin(\\theta_{0}\\cos(\\omega_{0}s)),\\ -L\\cos(\\theta_{0}\\cos(\\omega_{0}s)))", parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE, lineStyle: "DASHED" },
        // Gravity force at CM
        buildForceVector("force_g", "\\frac{L}{2}\\sin(\\theta_{0}\\cos(\\omega_{0}t))", "-\\frac{L}{2}\\cos(\\theta_{0}\\cos(\\omega_{0}t))", "0", "-1.5", C.PURPLE, "mg"),
      ],
      viewport: { left: -L * 1.3, right: L * 1.3, bottom: -L * 1.4, top: L * 0.3 },
    };
  },

  /** 大角度单摆 */
  large_angle_pendulum: (kv) => {
    const L = kvLookup(kv, ["L", "l"], 2);
    const theta0 = kvLookup(kv, ["theta0", "alpha0", "theta", "alpha"], 90);
    const g = kvLookup(kv, ["g"], 9.8);
    // For large angles, period increases. Approximate with: T ~ T0 * (1 + theta0^2/16 + ...)
    const omega0 = Math.sqrt(g / L);
    // Use an approximation for large angle: theta(t) ~ theta0 * cn(omega0*t) where cn is Jacobi elliptic
    // In Desmos we approximate with sum of harmonics
    const tMax = Math.ceil(2 * Math.PI / omega0 * 3 * 10) / 10;
    return {
      expressions: [
        makeSlider("L", "L", L, { min: 0.5, max: 5, step: 0.1 }),
        makeSlider("theta0", "\\theta_{0}", theta0, { min: 10, max: 170, step: 5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "omega0_def", latex: "\\omega_{0}=\\sqrt{\\frac{g}{L}}", hidden: true },
        // Large angle: use Fourier series approximation for actual motion
        // theta(t) ~ theta0*(a1*cos(w*t) + a3*cos(3w*t) + a5*cos(5w*t))
        // where a1, a3, a5 are functions of theta0
        { id: "k_def", latex: "k=\\sin\\left(\\frac{\\theta_{0}}{2}\\right)", hidden: true },
        { id: "theta_approx", latex: "\\theta(t)=\\theta_{0}\\left(\\cos(\\omega_{0}t)+\\frac{k^{2}}{4}(\\cos(\\omega_{0}t)-\\cos(3\\omega_{0}t))\\right)", hidden: true },
        // Pivot
        { id: "pivot", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
        // String
        { id: "string", latex: "(Ls\\sin(\\theta(t)),\\ -Ls\\cos(\\theta(t)))", parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        // Bob
        { id: "bob", latex: "(L\\sin(\\theta(t)),\\ -L\\cos(\\theta(t)))", color: C.RED },
        // Trail
        { id: "trail", latex: "(L\\sin(\\theta(t)),\\ -L\\cos(\\theta(t)))", parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE, lineStyle: "DASHED" },
        // Compare with small angle approximation (dashed)
        { id: "small_angle", latex: "(L\\sin(\\theta_{0}\\cos(\\omega_{0}s)),\\ -L\\cos(\\theta_{0}\\cos(\\omega_{0}s)))", parametricDomain: { min: "0", max: String(tMax) }, color: C.ORANGE, lineStyle: "DASHED" },
        // Labels
        { id: "label_exact", latex: `(L+0.5,\\ 0.5)`, color: C.BLUE, label: "Large\\ angle", showLabel: true },
        { id: "label_small", latex: `(L+0.5,\\ -0.5)`, color: C.ORANGE, label: "Small\\ angle", showLabel: true },
        buildForceVector("force_g", "L\\sin(\\theta(t))", "-L\\cos(\\theta(t))", "0", "-1.5", C.PURPLE, "mg"),
      ],
      viewport: { left: -L * 1.3, right: L * 1.8, bottom: -L * 1.4, top: L * 0.5 },
    };
  },

  /** 堆叠球下落（超级球效应） */
  stacked_ball: (kv) => {
    const h = kvLookup(kv, ["h"], 2);
    const g = kvLookup(kv, ["g"], 9.8);
    const tImpact = Math.sqrt(2 * h / g);
    const tMax = Math.ceil(tImpact * 4 * 10) / 10;
    // For n balls stacked (equal mass), top ball velocity after bounce = (3^n - 1)/(3^n + 1) * v_impact ~ v * (2n-1)/n simplified
    // 2 balls: v_top = 3v, height = 9h
    // 3 balls: v_top ~ 7v, height = 49h
    // 4 balls: v_top ~ 15v
    return {
      expressions: [
        makeSlider("h", "h", h, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "t_impact", latex: "t_{i}=\\sqrt{\\frac{2h}{g}}", hidden: true },
        { id: "v_impact", latex: "v_{i}=\\sqrt{2gh}", hidden: true },
        // Ground
        { id: "ground", latex: "y=0", color: C.BLACK },
        // Ball 1 (bottom) - bounces back with v1 = -v_impact (simplified)
        { id: "b1", latex: "(0,\\ If(t<t_{i},\\ h-\\frac{1}{2}gt^{2},\\ \\frac{1}{2}g(t-t_{i})^{2}))", color: C.RED, label: "m_{1}", showLabel: true },
        // Ball 2 (top) - launched upward with 3*v_impact
        { id: "v_top", latex: "v_{top}=3v_{i}", hidden: true },
        { id: "h_top", latex: "h_{top}=\\frac{v_{top}^{2}}{2g}", hidden: true },
        { id: "b2", latex: "(0.3,\\ If(t<t_{i},\\ h+0.3-\\frac{1}{2}gt^{2},\\ h+0.3+v_{top}(t-t_{i})-\\frac{1}{2}g(t-t_{i})^{2}))", color: C.BLUE, label: "m_{2}", showLabel: true },
        // Max height marker
        { id: "max_h", latex: `(0.3,\\ h+h_{top})`, color: C.PURPLE, pointStyle: "CROSS", label: "9h!", showLabel: true },
        // Labels
        { id: "label_9h", latex: `(1,\\ h+h_{top}/2)`, color: C.BLUE, label: "9h", showLabel: true },
      ],
      viewport: { left: -2, right: 3, bottom: -0.5, top: h * 10 + 2 },
    };
  },
};
