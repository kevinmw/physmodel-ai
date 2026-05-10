import type { TemplateFn } from "./types";
import { C, kvLookup, makeSlider, degToRad, buildForceVector, buildForceVector3D } from "./helpers";

export const oscillationsTemplates: Record<string, TemplateFn> = {

  pendulum: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const L = kvLookup(kv, ["L", "l"], 2);
    const alpha0 = kvLookup(kv, ["alpha0", "alpha"], 30);
    const omega0 = Math.sqrt(g / L);
    const tMax = Math.ceil(2 * Math.PI / omega0 * 3 * 10) / 10;
    return {
      expressions: [
        makeSlider("L", "L", L, { min: 1, max: 5, step: 0.1 }),
        makeSlider("alpha0", "\\alpha_{0}", alpha0, { min: 10, max: 60, step: 5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "pivot", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
        { id: "string", latex: "(Ls\\sin(\\alpha_{0}\\cos(\\omega_{0}t)),\\ -Ls\\cos(\\alpha_{0}\\cos(\\omega_{0}t)))", parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        { id: "bob", latex: "(L\\sin(\\alpha_{0}\\cos(\\omega_{0}t)),\\ -L\\cos(\\alpha_{0}\\cos(\\omega_{0}t)))", color: C.RED },
        {
          id: "curve",
          latex: "(L\\sin(\\alpha_{0}\\cos(\\omega_{0}s)),\\ -L\\cos(\\alpha_{0}\\cos(\\omega_{0}s)))",
          parametricDomain: { min: "0", max: String(tMax) },
          color: C.BLUE,
          lineStyle: "DASHED",
        },
        { id: "omega0_def", latex: "\\omega_{0}=\\sqrt{\\frac{g}{L}}", hidden: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        buildForceVector("force_g", "L\\sin(\\alpha_{0}\\cos(\\omega_{0}t))", "-L\\cos(\\alpha_{0}\\cos(\\omega_{0}t))", "0", "-1.5", C.PURPLE, "mg"),
      ],
      viewport: { left: -L * 1.3, right: L * 1.3, bottom: -L * 1.4, top: L * 0.3 },
    };
  },

  spring: (kv) => {
    const A = kvLookup(kv, ["A"], 2);
    const omega = kvLookup(kv, ["omega"], 3);
    const tMax = Math.ceil(2 * Math.PI / omega * 3 * 10) / 10;
    return {
      expressions: [
        makeSlider("amp", "A", A, { min: 0.5, max: 3, step: 0.1 }),
        makeSlider("omega", "\\omega", omega, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
        { id: "point", latex: "(0,\\ A\\sin(\\omega t))", color: C.RED },
        {
          id: "curve",
          latex: "(s,\\ A\\sin(\\omega s))",
          parametricDomain: { min: "0", max: String(tMax) },
          color: C.BLUE,
          lineStyle: "DASHED",
        },
      ],
      viewport: { left: -1, right: tMax * 1.05, bottom: -A * 1.5, top: A * 1.5 },
    };
  },

  vertical_spring: (kv) => {
    const k = kvLookup(kv, ["k"], 20);
    const m = kvLookup(kv, ["m"], 2);
    const A = kvLookup(kv, ["A"], 1.5);
    const g = kvLookup(kv, ["g"], 9.8);
    const omega = Math.sqrt(k / m);
    const tMax = Math.ceil(2 * Math.PI / omega * 3 * 10) / 10;
    const eqOffset = m * g / k;
    return {
      expressions: [
        makeSlider("k", "k", k, { min: 5, max: 50, step: 5 }),
        makeSlider("m", "m", m, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("A", "A", A, { min: 0.5, max: 3, step: 0.1 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "omega", latex: "\\omega=\\sqrt{\\frac{k}{m}}", hidden: true },
        { id: "ceiling", latex: "(-1,5)", color: C.GRAY },
        { id: "ceiling2", latex: "(1,5)", color: C.GRAY },
        { id: "spring_top", latex: `(0,\\ 5-u(5-\\frac{mg}{k}-A\\sin(\\omega t)))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        { id: "eq_line", latex: `y=5-\\frac{mg}{k}`, color: C.GRAY, lineStyle: "DASHED" },
        { id: "mass", latex: `(0,\\ 5-\\frac{mg}{k}-A\\sin(\\omega t))`, color: C.RED, label: "m", showLabel: true },
        { id: "trail", latex: `(s,\\ 5-\\frac{mg}{k}-A\\sin(\\omega s))`, parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE, lineStyle: "DASHED" },
      ],
      viewport: { left: -2, right: tMax * 0.3, bottom: 5 - eqOffset - A * 1.5, top: 6 },
    };
  },

  damped_oscillation: (kv) => {
    const A = kvLookup(kv, ["A"], 3);
    const b = kvLookup(kv, ["b"], 0.3);
    const omega = kvLookup(kv, ["omega"], 3);
    const tMax = Math.min(Math.ceil(5 / b * 10) / 10, 30);
    return {
      expressions: [
        makeSlider("A", "A", A, { min: 1, max: 5, step: 0.1 }),
        makeSlider("b", "b", b, { min: 0.1, max: 2, step: 0.1 }),
        makeSlider("omega", "\\omega", omega, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "point", latex: "(t,\\ Ae^{-bt}\\sin(\\omega t))", color: C.RED },
        {
          id: "wave",
          latex: "(s,\\ Ae^{-bs}\\sin(\\omega s))",
          parametricDomain: { min: "0", max: String(tMax) },
          color: C.BLUE,
        },
        { id: "env1", latex: "y=Ae^{-bx}", color: C.ORANGE, lineStyle: "DASHED" },
        { id: "env2", latex: "y=-Ae^{-bx}", color: C.ORANGE, lineStyle: "DASHED" },
      ],
      viewport: { left: -1, right: tMax * 1.05, bottom: -A * 1.5, top: A * 1.5 },
    };
  },

  forced_oscillation: (kv) => {
    const f0 = kvLookup(kv, ["f0"], 2);
    const f = kvLookup(kv, ["f"], 2);
    const A0 = kvLookup(kv, ["A0"], 2);
    const gamma = kvLookup(kv, ["gamma"], 0.5);
    const tMax = Math.min(Math.ceil(4 / gamma * 10) / 10, 30);
    const Bmax = A0 / (gamma * f0) * 1.2;
    return {
      expressions: [
        makeSlider("f0", "f_{0}", f0, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("f", "f", f, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("A0", "A_{0}", A0, { min: 0.5, max: 3, step: 0.5 }),
        makeSlider("gamma", "\\gamma", gamma, { min: 0.1, max: 2, step: 0.1 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "amp", latex: "B=\\frac{A_{0}}{\\sqrt{(f_{0}^{2}-f^{2})^{2}+(\\gamma f)^{2}}}", hidden: true },
        { id: "point", latex: "(t,\\ B\\sin(ft))", color: C.RED },
        { id: "wave", latex: "(s,\\ B\\sin(fs))", parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE },
      ],
      viewport: { left: -1, right: tMax * 1.05, bottom: -Bmax * 1.3, top: Bmax * 1.3 },
    };
  },

  wave_superposition: (kv) => {
    const A1 = kvLookup(kv, ["A1"], 2);
    const A2 = kvLookup(kv, ["A2"], 2);
    const f1 = kvLookup(kv, ["f1", "k1"], 2);
    const f2 = kvLookup(kv, ["f2", "k2"], 3);
    const tMax = Math.ceil(2 * Math.PI * 3 * 10) / 10;
    const Asum = A1 + A2;
    return {
      expressions: [
        makeSlider("A1", "A_{1}", A1, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("A2", "A_{2}", A2, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("f1", "f_{1}", f1, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("f2", "f_{2}", f2, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "wave_sum", latex: "y=A_{1}\\sin(f_{1}x-t)+A_{2}\\sin(f_{2}x-t)", color: C.RED },
        { id: "wave1", latex: "y=A_{1}\\sin(f_{1}x-t)", color: C.BLUE, lineStyle: "DASHED" },
        { id: "wave2", latex: "y=A_{2}\\sin(f_{2}x-t)", color: C.GREEN, lineStyle: "DASHED" },
      ],
      viewport: { left: -10, right: 10, bottom: -Asum * 1.3, top: Asum * 1.3 },
    };
  },

  lissajous: (kv) => {
    const Ax = kvLookup(kv, ["Ax"], 3);
    const Ay = kvLookup(kv, ["Ay"], 3);
    const fx = kvLookup(kv, ["fx"], 2);
    const fy = kvLookup(kv, ["fy"], 3);
    const tMax = 2 * Math.PI * 2;
    return {
      expressions: [
        makeSlider("Ax", "A_{x}", Ax, { min: 1, max: 5, step: 0.5 }),
        makeSlider("Ay", "A_{y}", Ay, { min: 1, max: 5, step: 0.5 }),
        makeSlider("fx", "f_{x}", fx, { min: 1, max: 5, step: 1 }),
        makeSlider("fy", "f_{y}", fy, { min: 1, max: 5, step: 1 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "point", latex: "(A_{x}\\sin(f_{x}t),\\ A_{y}\\sin(f_{y}t))", color: C.RED },
        { id: "curve", latex: "(A_{x}\\sin(f_{x}s),\\ A_{y}\\sin(f_{y}s))", parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE },
      ],
      viewport: { left: -Ax * 1.3, right: Ax * 1.3, bottom: -Ay * 1.3, top: Ay * 1.3 },
    };
  },

  conical_motion: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const h = kvLookup(kv, ["h"], 2);
    const theta = kvLookup(kv, ["theta", "alpha"], 45);
    const rad = degToRad(theta);
    const r = h * Math.tan(rad);
    const omega = Math.sqrt(g / h);
    const tMax = Math.ceil(2 * Math.PI / omega * 2 * 10) / 10;
    const maxR = 5 * Math.tan(rad);
    const rStr = r.toFixed(3);
    const wStr = omega.toFixed(3);
    const hStr = h.toFixed(2);
    return {
      expressions: [
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "ball", latex: `(${rStr}\\cos(${wStr}t),\\ ${hStr},\\ ${rStr}\\sin(${wStr}t))`, color: C.RED },
        { id: "orbit_path", latex: `(${rStr}\\cos(s),\\ ${hStr},\\ ${rStr}\\sin(s))`, parametricDomain: { min: "0", max: String(2 * Math.PI) }, color: C.BLUE, lineStyle: "DASHED" },
        buildForceVector3D("force_g", `${rStr}\\cos(${wStr}t)`, hStr, `${rStr}\\sin(${wStr}t)`, "0", "-2", "0", C.PURPLE, "mg"),
      ],
      viewport3d: { xMin: -maxR - 1, xMax: maxR + 1, yMin: -0.5, yMax: h + 1.5, zMin: -maxR - 1, zMax: maxR + 1 },
      dimension: '3d' as const,
    };
  },

  /** 驻波 */
  standing_wave: (kv) => {
    const L = kvLookup(kv, ["L", "l"], 4);
    const n = kvLookup(kv, ["n"], 2);
    const A = kvLookup(kv, ["A"], 2);
    const f = kvLookup(kv, ["f"], 1);
    const tMax = 4;
    return {
      expressions: [
        makeSlider("L", "L", L, { min: 1, max: 10, step: 0.5 }),
        makeSlider("n", "n", n, { min: 1, max: 6, step: 1 }),
        makeSlider("A", "A", A, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("f", "f", f, { min: 0.2, max: 3, step: 0.2 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "wave", latex: "y=A\\sin\\left(\\frac{n\\pi x}{L}\\right)\\cos\\left(2\\pi ft\\right)", color: C.RED },
        { id: "env1", latex: "y=A\\sin\\left(\\frac{n\\pi x}{L}\\right)", color: C.BLUE, lineStyle: "DASHED" },
        { id: "env2", latex: "y=-A\\sin\\left(\\frac{n\\pi x}{L}\\right)", color: C.BLUE, lineStyle: "DASHED" },
        { id: "end_l", latex: "(0,0)", color: C.BLACK, pointStyle: "CROSS" },
        { id: "end_r", latex: "(L,0)", color: C.BLACK, pointStyle: "CROSS" },
      ],
      viewport: { left: -0.5, right: L * 1.15, bottom: -A * 1.5, top: A * 1.5 },
    };
  },

  /** 拍频 */
  beats: (kv) => {
    const f1 = kvLookup(kv, ["f1"], 5);
    const f2 = kvLookup(kv, ["f2"], 5.5);
    const A = kvLookup(kv, ["A"], 2);
    const tMax = 8;
    return {
      expressions: [
        makeSlider("f1", "f_{1}", f1, { min: 1, max: 10, step: 0.1 }),
        makeSlider("f2", "f_{2}", f2, { min: 1, max: 10, step: 0.1 }),
        makeSlider("A", "A", A, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "sum", latex: "y=A\\sin\\left(2\\pi f_{1}x\\right)+A\\sin\\left(2\\pi f_{2}x\\right)", color: C.RED },
        { id: "w1", latex: "y=A\\sin\\left(2\\pi f_{1}x\\right)", color: C.BLUE, lineStyle: "DASHED" },
        { id: "w2", latex: "y=A\\sin\\left(2\\pi f_{2}x\\right)", color: C.GREEN, lineStyle: "DASHED" },
        { id: "env1", latex: "y=2A\\cos\\left(\\pi\\left(f_{1}-f_{2}\\right)x\\right)", color: C.ORANGE, lineStyle: "DASHED" },
        { id: "env2", latex: "y=-2A\\cos\\left(\\pi\\left(f_{1}-f_{2}\\right)x\\right)", color: C.ORANGE, lineStyle: "DASHED" },
      ],
      viewport: { left: -0.5, right: tMax, bottom: -2 * A * 1.3, top: 2 * A * 1.3 },
    };
  },

  /** 多普勒效应 */
  doppler_effect: (kv) => {
    const vs = kvLookup(kv, ["vs"], 2);
    const vSound = kvLookup(kv, ["v", "c"], 5);
    const f0 = kvLookup(kv, ["f0"], 2);
    const tMax = 6;
    return {
      expressions: [
        makeSlider("vs", "v_{s}", vs, { min: 0, max: 4, step: 0.5 }),
        makeSlider("v", "v_{snd}", vSound, { min: 1, max: 10, step: 0.5 }),
        makeSlider("f0", "f_{0}", f0, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "source", latex: "(v_{s}t,\\ 0)", color: C.RED, label: "S", showLabel: true },
        { id: "trail", latex: "(v_{s}s,\\ 0)", parametricDomain: { min: "0", max: String(tMax) }, color: C.RED, lineStyle: "DASHED" },
        // Wavefronts
        { id: "wf1", latex: "\\left(x-v_{s}\\max(t-1,0)\\right)^{2}+y^{2}=\\left(v_{snd}\\max(t-1,0)\\right)^{2}", color: C.BLUE, lineStyle: "DASHED" },
        { id: "wf2", latex: "\\left(x-v_{s}\\max(t-2,0)\\right)^{2}+y^{2}=\\left(v_{snd}\\max(t-2,0)\\right)^{2}", color: C.BLUE, lineStyle: "DASHED" },
        { id: "wf3", latex: "\\left(x-v_{s}\\max(t-3,0)\\right)^{2}+y^{2}=\\left(v_{snd}\\max(t-3,0)\\right)^{2}", color: C.BLUE, lineStyle: "DASHED" },
        { id: "wf4", latex: "\\left(x-v_{s}\\max(t-4,0)\\right)^{2}+y^{2}=\\left(v_{snd}\\max(t-4,0)\\right)^{2}", color: C.BLUE, lineStyle: "DASHED" },
        { id: "observer", latex: "(12,0)", color: C.GREEN, label: "O", showLabel: true },
        { id: "f_obs", latex: "f'=\\frac{f_{0}v_{snd}}{v_{snd}-v_{s}}", hidden: true },
      ],
      viewport: { left: -5, right: 15, bottom: -10, top: 10 },
    };
  },

  /** 谐波合成 */
  harmonics: (kv) => {
    const L = kvLookup(kv, ["L", "l"], 4);
    const A = kvLookup(kv, ["A"], 2);
    const n = kvLookup(kv, ["n"], 3);
    const f = kvLookup(kv, ["f"], 1);
    const tMax = 4;
    return {
      expressions: [
        makeSlider("L", "L", L, { min: 1, max: 10, step: 0.5 }),
        makeSlider("A", "A", A, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("f", "f", f, { min: 0.2, max: 3, step: 0.2 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        // Harmonics 1-3
        { id: "h1", latex: "y=A\\sin\\left(\\frac{\\pi x}{L}\\right)\\cos\\left(2\\pi ft\\right)", color: C.RED },
        { id: "h2", latex: "y=\\frac{A}{2}\\sin\\left(\\frac{2\\pi x}{L}\\right)\\cos\\left(4\\pi ft\\right)", color: C.BLUE, lineStyle: "DASHED" },
        { id: "h3", latex: "y=\\frac{A}{3}\\sin\\left(\\frac{3\\pi x}{L}\\right)\\cos\\left(6\\pi ft\\right)", color: C.GREEN, lineStyle: "DASHED" },
        // Sum
        { id: "sum", latex: "y=A\\left(\\sin\\left(\\frac{\\pi x}{L}\\right)\\cos(2\\pi ft)+\\frac{1}{2}\\sin\\left(\\frac{2\\pi x}{L}\\right)\\cos(4\\pi ft)+\\frac{1}{3}\\sin\\left(\\frac{3\\pi x}{L}\\right)\\cos(6\\pi ft)\\right)", color: C.PURPLE },
        { id: "end_l", latex: "(0,0)", color: C.BLACK, pointStyle: "CROSS" },
        { id: "end_r", latex: "(L,0)", color: C.BLACK, pointStyle: "CROSS" },
      ],
      viewport: { left: -0.5, right: L * 1.15, bottom: -A * 1.8, top: A * 1.8 },
    };
  },

  /** 傅里叶合成方波 */
  fourier_synthesis: (kv) => {
    const f = kvLookup(kv, ["f"], 1);
    const A = kvLookup(kv, ["A"], 3);
    const tMax = 4;
    return {
      expressions: [
        makeSlider("f", "f", f, { min: 0.2, max: 3, step: 0.2 }),
        makeSlider("A", "A", A, { min: 1, max: 5, step: 0.5 }),
        // Square wave from Fourier: (4A/π) Σ sin((2k-1)ωx)/(2k-1)
        { id: "sum", latex: "y=\\frac{4A}{\\pi}\\left(\\sin(2\\pi fx)+\\frac{1}{3}\\sin(6\\pi fx)+\\frac{1}{5}\\sin(10\\pi fx)+\\frac{1}{7}\\sin(14\\pi fx)+\\frac{1}{9}\\sin(18\\pi fx)\\right)", color: C.RED },
        // Target square wave
        { id: "square", latex: "y=A\\cdot\\text{sgn}\\left(\\sin(2\\pi fx)\\right)", color: C.GRAY, lineStyle: "DASHED" },
        // Individual harmonics
        { id: "h1", latex: "y=\\frac{4A}{\\pi}\\sin(2\\pi fx)", color: C.BLUE, lineStyle: "DASHED" },
        { id: "h3", latex: "y=\\frac{4A}{3\\pi}\\sin(6\\pi fx)", color: C.GREEN, lineStyle: "DASHED" },
      ],
      viewport: { left: -0.5, right: tMax, bottom: -A * 1.5, top: A * 1.5 },
    };
  },

  /** 双源干涉 (2D空间干涉图样) */
  two_source_interference: (kv) => {
    const d = kvLookup(kv, ["d"], 4);
    const f = kvLookup(kv, ["f"], 2);
    const lambda = 1 / f;
    const tMax = 4;
    const yMax = 8;
    return {
      expressions: [
        makeSlider("d", "d", d, { min: 1, max: 8, step: 0.5 }),
        makeSlider("f", "f", f, { min: 0.5, max: 4, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        // Source points
        { id: "s1", latex: "(0,\\ d/2)", color: C.RED, label: "S_{1}", showLabel: true },
        { id: "s2", latex: "(0,\\ -d/2)", color: C.RED, label: "S_{2}", showLabel: true },
        // Wavefronts from S1 (expanding circles)
        { id: "wf1_1", latex: "x^{2}+(y-d/2)^{2}=(t)^{2}", color: C.BLUE, lineStyle: "DASHED" },
        { id: "wf1_2", latex: "x^{2}+(y-d/2)^{2}=(t-1)^{2}", color: C.BLUE, lineStyle: "DASHED" },
        { id: "wf1_3", latex: "x^{2}+(y-d/2)^{2}=(t-2)^{2}", color: C.BLUE, lineStyle: "DASHED" },
        // Wavefronts from S2
        { id: "wf2_1", latex: "x^{2}+(y+d/2)^{2}=(t)^{2}", color: C.GREEN, lineStyle: "DASHED" },
        { id: "wf2_2", latex: "x^{2}+(y+d/2)^{2}=(t-1)^{2}", color: C.GREEN, lineStyle: "DASHED" },
        { id: "wf2_3", latex: "x^{2}+(y+d/2)^{2}=(t-2)^{2}", color: C.GREEN, lineStyle: "DASHED" },
        // Screen at x=L showing intensity pattern
        { id: "screen", latex: `(8,\\ u\\cdot 16)`, parametricDomain: { min: "-1", max: "1" }, color: C.GRAY },
        // Intensity on screen: I ∝ cos²(πd·y/(λ·L))
        { id: "intensity", latex: `x=8+2\\cos^{2}\\left(\\pi f(\\sqrt{64+(y-d/2)^{2}}-\\sqrt{64+(y+d/2)^{2}})\\right)`, color: C.RED },
        // Wavelength label
        { id: "lambda_def", latex: "\\lambda=1/f", hidden: true },
      ],
      viewport: { left: -5, right: 12, bottom: -yMax, top: yMax },
    };
  },

  /** 质量落上弹簧 */
  mass_spring_drop: (kv) => {
    const m = kvLookup(kv, ["m"], 1);
    const k = kvLookup(kv, ["k"], 20);
    const h = kvLookup(kv, ["h"], 2);
    const g = kvLookup(kv, ["g"], 9.8);
    const omega = Math.sqrt(k / m);
    const xEq = m * g / k; // equilibrium compression
    // Mass falls from h, hits spring at y=0, velocity at impact = sqrt(2gh)
    const vImpact = Math.sqrt(2 * g * h);
    // SHM around equilibrium: amplitude = sqrt(xEq^2 + vImpact^2/omega^2)
    const A = Math.sqrt(xEq * xEq + vImpact * vImpact / (omega * omega));
    const tMax = Math.ceil(2 * Math.PI / omega * 3 * 10) / 10;
    return {
      expressions: [
        makeSlider("m", "m", m, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("k", "k", k, { min: 5, max: 50, step: 5 }),
        makeSlider("h", "h", h, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "omega_def", latex: "\\omega=\\sqrt{\\frac{k}{m}}", hidden: true },
        { id: "xeq_def", latex: "x_{eq}=\\frac{mg}{k}", hidden: true },
        { id: "v_impact", latex: "v_{0}=\\sqrt{2gh}", hidden: true },
        // Time to fall
        { id: "t_fall", latex: "t_{f}=\\sqrt{\\frac{2h}{g}}", hidden: true },
        // Amplitude of oscillation
        { id: "A_def", latex: "A=\\sqrt{x_{eq}^{2}+\\frac{v_{0}^{2}}{\\omega^{2}}}", hidden: true },
        // Natural spring rest position
        { id: "spring_rest", latex: "y=0", color: C.GRAY, lineStyle: "DASHED" },
        // Equilibrium position
        { id: "eq_pos", latex: `(0.5,\\ ${-xEq})`, color: C.GREEN, pointStyle: "CROSS", label: "x_{eq}", showLabel: true },
        // Phase 1: Free fall
        { id: "ball_fall", latex: "(0,\\ h-\\frac{1}{2}gt^{2})", color: C.RED },
        // Spring (zigzag, drawn as line from 0 to mass when in contact)
        { id: "spring_line", latex: `(0,\\ u(If(t<t_{f},\\ 0,\\ -x_{eq}+A\\cos(\\omega(t-t_{f})-\\frac{\\pi}{2}))))`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        // Phase 2: SHM after contact
        { id: "ball_shm", latex: "(0,\\ If(t<t_{f},\\ h-\\frac{1}{2}gt^{2},\\ -x_{eq}+A\\cos(\\omega(t-t_{f})-\\frac{\\pi}{2})))", color: C.RED },
        // Trajectory trace
        { id: "trace", latex: `(s-3,\\ If(s<t_{f},\\ h-\\frac{1}{2}gs^{2},\\ -x_{eq}+A\\cos(\\omega(s-t_{f})-\\frac{\\pi}{2})))`, parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE, lineStyle: "DASHED" },
      ],
      viewport: { left: -1, right: 2, bottom: -(xEq + A) * 1.3, top: h * 1.3 },
    };
  },
};
