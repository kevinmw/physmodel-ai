import type { TemplateFn } from "./types";
import { C, kvLookup, makeSlider, degToRad, buildForceVector, makeVTGraph, makeSTGraph } from "./helpers";

export const kinematicsTemplates: Record<string, TemplateFn> = {

  projectile_motion: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const v0 = kvLookup(kv, ["v0"], 20);
    const theta = kvLookup(kv, ["theta", "alpha"], 45);
    const tMax = Math.ceil(2 * v0 * Math.sin(degToRad(theta)) / g) + 1;
    const xRange = v0 * Math.cos(degToRad(theta)) * tMax;
    const yMax = v0 * v0 * Math.sin(degToRad(theta)) * Math.sin(degToRad(theta)) / (2 * g);
    return {
      expressions: [
        makeSlider("v0", "v_{0}", v0, { min: 1, max: 50, step: 1 }),
        makeSlider("theta", "\\theta", theta, { min: 5, max: 85, step: 5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
        { id: "point", latex: "(v_{0}\\cos(\\theta)t,\\ v_{0}\\sin(\\theta)t-\\frac{g}{2}t^{2})", color: C.RED },
        {
          id: "curve",
          latex: "(v_{0}\\cos(\\theta)s,\\ v_{0}\\sin(\\theta)s-\\frac{g}{2}s^{2})",
          parametricDomain: { min: "0", max: String(tMax) },
          color: C.BLUE,
          lineStyle: "DASHED",
        },
        buildForceVector("force_g", "v_{0}\\cos(\\theta)t", "v_{0}\\sin(\\theta)t-\\frac{g}{2}t^{2}", "0", "-2", C.PURPLE, "mg"),
        { id: "g_def", latex: `g=${g}`, hidden: true },
      ],
      viewport: { left: -xRange * 0.05, right: xRange * 1.1, bottom: -yMax * 0.15, top: yMax * 1.3 },
    };
  },

  free_fall: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const h = kvLookup(kv, ["h"], 45);
    const tMax = Math.ceil(Math.sqrt(2 * h / g) * 10) / 10 + 0.5;
    const xOffset = 4;
    const vMax = g * tMax;
    return {
      expressions: [
        makeSlider("h", "h", h, { min: 10, max: 100, step: 5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "start", latex: "(0,h)", color: C.GREEN, pointStyle: "CROSS", label: "A", showLabel: true },
        { id: "ground", latex: "(0,0)", color: C.BLACK, pointStyle: "CROSS", label: "G", showLabel: true },
        { id: "ball", latex: "(0,\\max(h-\\frac{g}{2}t^{2},0))", color: C.RED },
        {
          id: "curve",
          latex: "(s,\\max(h-\\frac{g}{2}s^{2},0))",
          parametricDomain: { min: "0", max: String(tMax) },
          color: C.BLUE,
          lineStyle: "DASHED",
        },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        buildForceVector("force_g", "0", "\\max(h-\\frac{g}{2}t^{2},0)", "0", "-2", C.PURPLE, "mg"),
        ...makeVTGraph(xOffset, "-gs", -vMax, 0, tMax, "v"),
        { id: "tgraph_label", latex: "(0,0)", hidden: true },
      ],
      viewport: { left: -3, right: xOffset + tMax * 1.05, bottom: -Math.max(h * 0.1, vMax * 0.3), top: h * 1.1 },
    };
  },

  vertical_throw: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const v0 = kvLookup(kv, ["v0"], 20);
    const tMax = Math.ceil(2 * v0 / g * 10) / 10 + 0.5;
    const hMax = v0 * v0 / (2 * g);
    const xOffset = 3;
    return {
      expressions: [
        makeSlider("v0", "v_{0}", v0, { min: 5, max: 40, step: 1 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
        { id: "top", latex: "(0,\\ \\frac{v_{0}^{2}}{2g})", color: C.PURPLE, pointStyle: "CROSS", label: "H", showLabel: true },
        { id: "ball", latex: "(0,\\ v_{0}t-\\frac{g}{2}t^{2})", color: C.RED },
        {
          id: "curve",
          latex: "(s,\\ v_{0}s-\\frac{g}{2}s^{2})",
          parametricDomain: { min: "0", max: String(tMax) },
          color: C.BLUE,
          lineStyle: "DASHED",
        },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        buildForceVector("force_g", "0", "v_{0}t-\\frac{g}{2}t^{2}", "0", "-2", C.PURPLE, "mg"),
        ...makeVTGraph(xOffset, "v_{0}-gs", v0, -v0 * 0.5, tMax, "v"),
      ],
      viewport: { left: -3, right: xOffset + tMax * 1.05, bottom: -hMax * 0.15, top: hMax * 1.3 },
    };
  },

  horizontal_throw: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const v0 = kvLookup(kv, ["v0"], 10);
    const h = kvLookup(kv, ["h"], 20);
    const tMax = Math.ceil(Math.sqrt(2 * h / g) * 10) / 10 + 0.5;
    const xRange = v0 * tMax;
    return {
      expressions: [
        makeSlider("v0", "v_{0}", v0, { min: 1, max: 30, step: 1 }),
        makeSlider("h", "h", h, { min: 5, max: 50, step: 5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "start", latex: "(0,h)", color: C.GREEN, pointStyle: "CROSS", label: "A", showLabel: true },
        { id: "ground", latex: "(0,0)", color: C.BLACK, pointStyle: "CROSS", label: "G", showLabel: true },
        { id: "point", latex: "(v_{0}t,\\ h-\\frac{g}{2}t^{2})", color: C.RED },
        {
          id: "curve",
          latex: "(v_{0}s,\\ h-\\frac{g}{2}s^{2})",
          parametricDomain: { min: "0", max: String(tMax) },
          color: C.BLUE,
          lineStyle: "DASHED",
        },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        buildForceVector("force_g", "v_{0}t", "h-\\frac{g}{2}t^{2}", "0", "-2", C.PURPLE, "mg"),
      ],
      viewport: { left: -xRange * 0.05, right: xRange * 1.1, bottom: -h * 0.1, top: h * 1.15 },
    };
  },

  uniform_acceleration: (kv) => {
    const v0 = kvLookup(kv, ["v0"], 5);
    const a = kvLookup(kv, ["a"], 2);
    const tMax = 10;
    const vMax = v0 + a * tMax;
    return {
      expressions: [
        makeSlider("v0", "v_{0}", v0, { min: 0, max: 20, step: 1 }),
        makeSlider("a", "a", a, { min: -5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
        { id: "point", latex: "(t,\\ v_{0}+at)", color: C.RED },
        { id: "line", latex: "y=v_{0}+ax", color: C.BLUE },
      ],
      viewport: { left: -1, right: tMax * 1.05, bottom: Math.min(0, vMax * -0.1) - 1, top: Math.max(vMax, v0) * 1.2 },
    };
  },

  two_stage_motion: (kv) => {
    const v0 = kvLookup(kv, ["v0"], 0);
    const a1 = kvLookup(kv, ["a1"], 3);
    const a2 = kvLookup(kv, ["a2"], -2);
    const t1 = kvLookup(kv, ["t1"], 4);
    const tMax = 12;
    const v1 = v0 + a1 * t1;
    const vMax = Math.max(v0, v1, v1 + a2 * (tMax - t1));
    const vMin = Math.min(0, v0, v1, v1 + a2 * (tMax - t1));
    return {
      expressions: [
        makeSlider("v0", "v_{0}", v0, { min: 0, max: 20, step: 1 }),
        makeSlider("a1", "a_{1}", a1, { min: -5, max: 5, step: 0.5 }),
        makeSlider("a2", "a_{2}", a2, { min: -5, max: 5, step: 0.5 }),
        makeSlider("t1", "t_{1}", t1, { min: 1, max: 10, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "vt_curve", latex: "y=\\left\\{x<t_{1}:v_{0}+a_{1}x,\\ v_{0}+a_{1}t_{1}+a_{2}(x-t_{1})\\right\\}", color: C.BLUE },
        { id: "point", latex: "(t,\\ \\left\\{t<t_{1}:v_{0}+a_{1}t,\\ v_{0}+a_{1}t_{1}+a_{2}(t-t_{1})\\right\\})", color: C.RED },
        { id: "divider", latex: "x=t_{1}", color: C.GRAY, lineStyle: "DASHED" },
        { id: "zero_line", latex: "y=0", color: C.BLACK, lineStyle: "SOLID" },
      ],
      viewport: { left: -1, right: tMax * 1.05, bottom: vMin * 1.2 - 1, top: vMax * 1.2 + 1 },
    };
  },

  relative_motion: (kv) => {
    const v1 = kvLookup(kv, ["v1"], 10);
    const v2 = kvLookup(kv, ["v2"], 6);
    const d0 = kvLookup(kv, ["d0", "d"], 20);
    const tMax = Math.ceil(d0 / Math.abs(v1 - v2) * 2 * 10) / 10;
    const xMax = Math.max(v1, v2) * tMax + d0;
    return {
      expressions: [
        makeSlider("v1", "v_{1}", v1, { min: 1, max: 30, step: 1 }),
        makeSlider("v2", "v_{2}", v2, { min: 1, max: 30, step: 1 }),
        makeSlider("d0", "d_{0}", d0, { min: 5, max: 50, step: 5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "car_a", latex: "(v_{1}t,\\ 1)", color: C.RED, label: "A", showLabel: true },
        { id: "trail_a", latex: "(v_{1}s,\\ 1)", parametricDomain: { min: "0", max: String(tMax) }, color: C.RED, lineStyle: "DASHED" },
        { id: "car_b", latex: "(d_{0}+v_{2}t,\\ -1)", color: C.BLUE, label: "B", showLabel: true },
        { id: "trail_b", latex: `(d_{0}+v_{2}s,\\ -1)`, parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE, lineStyle: "DASHED" },
        { id: "dist_line", latex: `(v_{1}t+u(d_{0}+v_{2}t-v_{1}t),\\ 1+u(-2))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY, lineStyle: "DASHED" },
        { id: "dist_val", latex: `(\\frac{v_{1}t+d_{0}+v_{2}t}{2},\\ 0)`, color: C.GRAY, label: "\\Delta d", showLabel: true },
      ],
      viewport: { left: -5, right: xMax * 0.6, bottom: -3, top: 3 },
    };
  },

  pursuit_problem: (kv) => {
    const vA = kvLookup(kv, ["vA", "v1"], 8);
    const aA = kvLookup(kv, ["aA", "a"], 0);
    const vB = kvLookup(kv, ["vB", "v2"], 5);
    const d0 = kvLookup(kv, ["d0", "d"], 15);
    const tMax = 8;
    const xMax = (vA + 0.5 * aA * tMax) * tMax;
    return {
      expressions: [
        makeSlider("vA", "v_{A}", vA, { min: 0, max: 20, step: 1 }),
        makeSlider("aA", "a_{A}", aA, { min: -3, max: 5, step: 0.5 }),
        makeSlider("vB", "v_{B}", vB, { min: 0, max: 20, step: 1 }),
        makeSlider("d0", "d_{0}", d0, { min: 5, max: 50, step: 5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "posA", latex: "(v_{A}t+\\frac{1}{2}a_{A}t^{2},\\ 1)", color: C.RED, label: "A", showLabel: true },
        { id: "trailA", latex: `(v_{A}s+\\frac{1}{2}a_{A}s^{2},\\ 1)`, parametricDomain: { min: "0", max: String(tMax) }, color: C.RED, lineStyle: "DASHED" },
        { id: "posB", latex: "(d_{0}+v_{B}t,\\ -1)", color: C.BLUE, label: "B", showLabel: true },
        { id: "trailB", latex: `(d_{0}+v_{B}s,\\ -1)`, parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE, lineStyle: "DASHED" },
        { id: "gap", latex: `(v_{A}t+\\frac{1}{2}a_{A}t^{2}+u(d_{0}+v_{B}t-v_{A}t-\\frac{1}{2}a_{A}t^{2}),\\ 1-2u)`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN, lineStyle: "DASHED" },
      ],
      viewport: { left: -3, right: Math.min(xMax, 80), bottom: -3, top: 3 },
    };
  },

  /** 滚动上坡 */
  rolling_incline: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const angle = kvLookup(kv, ["angle", "alpha"], 30);
    const v0 = kvLookup(kv, ["v0", "v"], 5);
    const mu = kvLookup(kv, ["mu"], 0.1);
    const aRad = degToRad(angle);
    const accel = g * (Math.sin(aRad) + mu * Math.cos(aRad));
    const tMax = accel > 0 ? Math.ceil(v0 / accel * 2.5 * 10) / 10 : 5;
    const slopeLen = v0 * v0 / (2 * accel);
    return {
      expressions: [
        makeSlider("angle", "\\alpha", angle, { min: 10, max: 60, step: 5 }),
        makeSlider("v0", "v_{0}", v0, { min: 1, max: 15, step: 1 }),
        makeSlider("mu", "\\mu", mu, { min: 0, max: 0.5, step: 0.05 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "accel", latex: "a=g\\left(\\sin(\\alpha)+\\mu\\cos(\\alpha)\\right)", hidden: true },
        // Slope line
        { id: "slope", latex: `(s\\cos(\\alpha),\\ s\\sin(\\alpha))`, parametricDomain: { min: "0", max: String(Math.ceil(slopeLen * 1.5)) }, color: C.BLACK },
        // Ball: s = v0*t - 0.5*a*t², clamped at 0
        { id: "dist", latex: "s_{b}=\\max(v_{0}t-\\frac{1}{2}at^{2},\\ 0)", hidden: true },
        { id: "ball", latex: `(s_{b}\\cos(\\alpha),\\ s_{b}\\sin(\\alpha))`, color: C.RED },
        // Velocity vector
        buildForceVector("force_v", "s_{b}\\cos(\\alpha)", "s_{b}\\sin(\\alpha)", "1.5\\cos(\\alpha)", "1.5\\sin(\\alpha)", C.GREEN, "v"),
        // Gravity
        buildForceVector("force_g", "s_{b}\\cos(\\alpha)", "s_{b}\\sin(\\alpha)", "0", "-2", C.PURPLE, "mg"),
      ],
      viewport: { left: -2, right: slopeLen * Math.cos(aRad) * 1.5 + 2, bottom: -1, top: slopeLen * Math.sin(aRad) * 1.5 + 2 },
    };
  },

  /** 空气阻力下落 */
  falling_air: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const m = kvLookup(kv, ["m"], 1);
    const b = kvLookup(kv, ["b"], 0.5);
    const vTerm = m * g / b;
    const tMax = Math.min(Math.ceil(5 * m / b * 10) / 10, 20);
    return {
      expressions: [
        makeSlider("m", "m", m, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("b", "b", b, { min: 0.1, max: 2, step: 0.1 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        // Terminal velocity
        { id: "vt", latex: "v_{t}=\\frac{mg}{b}", hidden: true },
        // Velocity: v(t) = vt(1 - e^(-bt/m))
        { id: "v_func", latex: "v=v_{t}\\left(1-e^{-bt/m}\\right)", hidden: true },
        // Position: y(t) = vt*t + (vt*m/b)(e^(-bt/m) - 1)
        { id: "y_func", latex: "y=v_{t}t+\\frac{v_{t}m}{b}\\left(e^{-bt/m}-1\\right)", hidden: true },
        // Ball
        { id: "ball", latex: "(0,\\ -y)", color: C.RED },
        // v-t graph (offset to right)
        { id: "vt_curve", latex: `(s+3,\\ v_{t}\\left(1-e^{-bs/m}\\right))`, parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE },
        { id: "vt_line", latex: "y=v_{t}", color: C.RED, lineStyle: "DASHED" },
        // Forces
        buildForceVector("force_g", "0", "-y", "0", "-2", C.PURPLE, "mg"),
        buildForceVector("force_d", "0", "-y", "0", `2\\left(1-e^{-bt/m}\\right)`, C.GREEN, "f_{d}"),
      ],
      viewport: { left: -3, right: 3 + tMax * 1.05, bottom: -vTerm * tMax * 0.4, top: 3 },
    };
  },
};
