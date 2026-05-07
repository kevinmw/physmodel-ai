export interface DesmosExpr {
  id: string;
  latex: string;
  sliderBounds?: { min: number; max: number; step: number };
  parametricDomain?: { min: string; max: string };
  color?: string;
  hidden?: boolean;
  label?: string;
  showLabel?: boolean;
  pointStyle?: string;
  lineStyle?: string;
  playing?: boolean;
}

export interface Viewport3D {
  xMin: number; xMax: number;
  yMin: number; yMax: number;
  zMin: number; zMax: number;
}

export interface TemplateResult {
  expressions: DesmosExpr[];
  viewport?: { left: number; right: number; top: number; bottom: number };
  viewport3d?: Viewport3D;
  dimension?: '2d' | '3d';
}

type TemplateFn = (kv: Record<string, number>, forces?: string[]) => TemplateResult;

const C = {
  RED: "#c74440",
  BLUE: "#2d70b3",
  GREEN: "#388c46",
  PURPLE: "#6042a6",
  ORANGE: "#fa7e19",
  BLACK: "#000000",
  GRAY: "#999999",
};

// --- Helpers ---

function kvLookup(kv: Record<string, number>, keys: string[], fallback: number): number {
  for (const k of keys) {
    if (k in kv && typeof kv[k] === "number" && isFinite(kv[k])) return kv[k];
  }
  return fallback;
}

function makeSlider(
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

function degToRad(d: number) { return d * Math.PI / 180; }

function buildForceVector(
  id: string,
  ox: string, oy: string,
  dx: string, dy: string,
  color: string,
  label: string
): DesmosExpr {
  return {
    id,
    latex: `(${ox}+t(${dx}),\\ ${oy}+t(${dy}))`,
    parametricDomain: { min: "0", max: "1" },
    color,
    label,
    showLabel: true,
  };
}

/** Build a 3D force vector as a parametric line segment */
function buildForceVector3D(
  id: string,
  ox: string, oy: string, oz: string,
  dx: string, dy: string, dz: string,
  color: string,
  label: string
): DesmosExpr {
  return {
    id,
    latex: `(${ox}+t(${dx}),\\ ${oy}+t(${dy}),\\ ${oz}+t(${dz}))`,
    parametricDomain: { min: "0", max: "1" },
    color,
    label,
    showLabel: true,
  };
}

/** Build a velocity-time graph to the right of the spatial view */
function makeVTGraph(
  xOffset: number,
  vLatex: string,
  vMin: number,
  vMax: number,
  tMax: number,
  label?: string
): DesmosExpr[] {
  return [
    { id: "tgraph_axis", latex: `x=${xOffset}`, color: C.GRAY, lineStyle: "DASHED", hidden: true },
    { id: "tgraph_v", latex: `y=${vLatex}`, color: C.ORANGE },
    { id: "tgraph_v_curve", latex: `(s+${xOffset},\\ ${vLatex})`, parametricDomain: { min: "0", max: String(tMax) }, color: C.ORANGE, lineStyle: "SOLID" },
    { id: "tgraph_origin", latex: `(${xOffset},0)`, color: C.GRAY, pointStyle: "CROSS", label: label || "t", showLabel: true },
  ];
}

/** Build a position-time graph alongside v-t */
function makeSTGraph(
  xOffset: number,
  sLatex: string,
  tMax: number
): DesmosExpr[] {
  return [
    { id: "tgraph_s", latex: `y=${sLatex}`, color: C.GREEN, lineStyle: "DASHED" },
    { id: "tgraph_s_curve", latex: `(s+${xOffset},\\ ${sLatex})`, parametricDomain: { min: "0", max: String(tMax) }, color: C.GREEN, lineStyle: "DASHED" },
  ];
}

// --- Templates ---

const TEMPLATES: Record<string, TemplateFn> = {

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
      ],
      viewport: { left: -xRange * 0.05, right: xRange * 1.1, bottom: -yMax * 0.15, top: yMax * 1.3 },
    };
  },

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
        { id: "omega0_def", latex: `\\omega_{0}=\\sqrt{\\frac{g}{L}}`, hidden: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        buildForceVector("force_g", "L\\sin(\\alpha_{0}\\cos(\\omega_{0}t))", "-L\\cos(\\alpha_{0}\\cos(\\omega_{0}t))", "0", "-1.5", C.PURPLE, "mg"),
      ],
      viewport: { left: -L * 1.3, right: L * 1.3, bottom: -L * 1.4, top: L * 0.3 },
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
        // v-t graph
        ...makeVTGraph(xOffset, "-gs", -vMax, 0, tMax, "v"),
        { id: "tgraph_label", latex: "(0,0)", hidden: true },
      ],
      viewport: { left: -3, right: xOffset + tMax * 1.05, bottom: -Math.max(h * 0.1, vMax * 0.3), top: h * 1.1 },
    };
  },

  inclined_plane: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const angle = kvLookup(kv, ["angle", "alpha"], 30);
    const mu = kvLookup(kv, ["mu"], 0.2);
    const aRad = degToRad(angle);
    const accel = g * (Math.sin(aRad) - mu * Math.cos(aRad));
    const slopeLen = 5;
    const tMax = accel > 0 ? Math.ceil(Math.sqrt(2 * slopeLen / accel) * 10) / 10 + 0.5 : 10;
    return {
      expressions: [
        makeSlider("angle", "\\alpha", angle, { min: 10, max: 60, step: 5 }),
        makeSlider("mu", "\\mu", mu, { min: 0, max: 1, step: 0.05 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "accel", latex: "a=g(\\sin(\\alpha)-\\mu\\cos(\\alpha))", hidden: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "top", latex: "(0,5)", color: C.GREEN, pointStyle: "CROSS", label: "S", showLabel: true },
        {
          id: "slope",
          latex: "(5s\\cos(\\alpha),\\ 5-5s\\sin(\\alpha))",
          parametricDomain: { min: "0", max: "1" },
          color: C.BLACK,
        },
        { id: "block", latex: "(\\frac{1}{2}at^{2}\\cos(\\alpha),\\ 5-\\frac{1}{2}at^{2}\\sin(\\alpha))", color: C.RED },
        // Force vectors at block position
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
        // v-t graph
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

  elastic_collision: (kv) => {
    const m1 = kvLookup(kv, ["m1"], 2);
    const m2 = kvLookup(kv, ["m2"], 3);
    const v1 = kvLookup(kv, ["v1", "v0"], 5);
    const tMax = 10;
    return {
      expressions: [
        makeSlider("m1", "m_{1}", m1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("m2", "m_{2}", m2, { min: 1, max: 10, step: 0.5 }),
        makeSlider("v1", "v_{1}", v1, { min: 1, max: 10, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "v1f", latex: "v_{1f}=\\frac{m_{1}-m_{2}}{m_{1}+m_{2}}v_{1}", hidden: true },
        { id: "v2f", latex: "v_{2f}=\\frac{2m_{1}}{m_{1}+m_{2}}v_{1}", hidden: true },
        {
          id: "p1",
          latex: "(\\left\\{t<4:-5+v_{1}t,\\ -5+4v_{1}+v_{1f}(t-4)\\right\\},\\ 0)",
          color: C.RED,
        },
        {
          id: "p2",
          latex: "(\\left\\{t<4:5,\\ 5+v_{2f}(t-4)\\right\\},\\ 0)",
          color: C.BLUE,
        },
        { id: "wall_l", latex: "(-5,0)", color: C.GRAY, pointStyle: "CROSS" },
        { id: "wall_r", latex: "(5,0)", color: C.GRAY, pointStyle: "CROSS" },
      ],
      viewport: { left: -8, right: 15, bottom: -3, top: 3 },
    };
  },

  magnetic_field: (kv) => {
    const v0 = kvLookup(kv, ["v0", "v"], 5);
    const B = kvLookup(kv, ["B"], 2);
    const q = kvLookup(kv, ["q"], 1);
    const m = kvLookup(kv, ["m"], 1);
    const r = m * v0 / (q * B);
    const tMax = Math.ceil(2 * Math.PI * m / (q * B) * 2 * 10) / 10;
    return {
      expressions: [
        makeSlider("v0", "v_{0}", v0, { min: 1, max: 10, step: 0.5 }),
        makeSlider("B", "B", B, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "r", latex: "r=\\frac{v_{0}}{B}", hidden: true },
        { id: "center", latex: "(0,r)", color: C.GREEN, pointStyle: "CROSS" },
        { id: "point", latex: "(r\\sin(Bt),\\ r-r\\cos(Bt))", color: C.RED },
        { id: "circle", latex: "x^{2}+(y-r)^{2}=r^{2}", color: C.BLUE, lineStyle: "DASHED" },
        buildForceVector("force_l", "r\\sin(Bt)", "r-r\\cos(Bt)", "-1.2\\sin(Bt+\\frac{\\pi}{2})", "-1.2\\cos(Bt+\\frac{\\pi}{2})", C.PURPLE, "F"),
      ],
      viewport: { left: -r * 1.4, right: r * 1.4, bottom: -r * 0.3, top: r * 2.2 },
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

  binary_star: (kv) => {
    const m1 = kvLookup(kv, ["m1"], 3);
    const m2 = kvLookup(kv, ["m2"], 5);
    const d = kvLookup(kv, ["d"], 6);
    const r1 = m2 / (m1 + m2) * d;
    const r2 = m1 / (m1 + m2) * d;
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

  electric_deflection: (kv) => {
    const v0 = kvLookup(kv, ["v0", "v"], 5);
    const E = kvLookup(kv, ["E"], 3);
    const q = kvLookup(kv, ["q"], 1);
    const m = kvLookup(kv, ["m"], 1);
    const accel = q * E / m;
    const tMax = 10;
    const yDeflect = 0.5 * accel * tMax * tMax;
    return {
      expressions: [
        makeSlider("v0", "v_{0}", v0, { min: 1, max: 10, step: 0.5 }),
        makeSlider("E", "E", E, { min: 1, max: 10, step: 0.5 }),
        makeSlider("q", "q", q, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("m", "m", m, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "accel", latex: "a=\\frac{qE}{m}", hidden: true },
        { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
        { id: "point", latex: "(v_{0}t,\\ \\frac{1}{2}at^{2})", color: C.RED },
        {
          id: "curve",
          latex: "(v_{0}s,\\ \\frac{1}{2}as^{2})",
          parametricDomain: { min: "0", max: String(tMax) },
          color: C.BLUE,
          lineStyle: "DASHED",
        },
        buildForceVector("force_e", "v_{0}t", "\\frac{1}{2}at^{2}", "0", "1.5", C.PURPLE, "qE"),
      ],
      viewport: { left: -1, right: v0 * tMax * 1.1, bottom: -1, top: Math.max(yDeflect * 1.1, 5) },
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
        {
          id: "amp",
          latex: "B=\\frac{A_{0}}{\\sqrt{(f_{0}^{2}-f^{2})^{2}+(\\gamma f)^{2}}}",
          hidden: true,
        },
        { id: "point", latex: "(t,\\ B\\sin(ft))", color: C.RED },
        {
          id: "wave",
          latex: "(s,\\ B\\sin(fs))",
          parametricDomain: { min: "0", max: String(tMax) },
          color: C.BLUE,
        },
      ],
      viewport: { left: -1, right: tMax * 1.05, bottom: -Bmax * 1.3, top: Bmax * 1.3 },
    };
  },

  conical_motion: (kv) => {
    const g = kvLookup(kv, ["g"], 9.8);
    const h = kvLookup(kv, ["h"], 2);
    const theta = kvLookup(kv, ["theta", "alpha"], 45);
    const rad = degToRad(theta);
    const tanTheta = Math.tan(rad);
    const r = h * tanTheta;
    const omega = Math.sqrt(g / h);
    const tMax = Math.ceil(2 * Math.PI / omega * 2 * 10) / 10;
    const maxR = 5 * tanTheta;

    return {
      expressions: [
        makeSlider("h", "h", h, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("theta", "\\theta", theta, { min: 20, max: 70, step: 5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },

        // Hidden relationships
        { id: "r_def", latex: "r=h\\tan(\\theta)", hidden: true },
        { id: "omega_def", latex: "\\omega=\\sqrt{\\frac{g}{h}}", hidden: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },

        // Cone surface (implicit): z^2 = tan^2(theta) * (x^2 + y^2)
        { id: "cone_surface", latex: "z^{2}=\\tan^{2}(\\theta)(x^{2}+y^{2})", color: C.BLUE, hidden: true },

        // Orbit circle at height h: x^2 + z^2 = r^2
        { id: "orbit_circle", latex: `x^{2}+z^{2}=(${r})^{2}`, color: C.BLUE, lineStyle: "DASHED" },

        // Ball orbiting: parametric 3D curve (x, y, z) = (r*cos(omega*t), h, r*sin(omega*t))
        { id: "ball", latex: `(r\\cos(\\omega t),\\ h,\\ r\\sin(\\omega t))`, color: C.RED },

        // Full orbit path
        {
          id: "orbit_path",
          latex: `(r\\cos(s),\\ h,\\ r\\sin(s))`,
          parametricDomain: { min: "0", max: String(2 * Math.PI) },
          color: C.BLUE,
          lineStyle: "DASHED",
        },

        // Force vectors at ball position
        buildForceVector3D("force_g", "r\\cos(\\omega t)", "h", "r\\sin(\\omega t)", "0", "-2", "0", C.PURPLE, "mg"),
        buildForceVector3D("force_n", "r\\cos(\\omega t)", "h", "r\\sin(\\omega t)", "-1.2\\sin(\\theta)\\cos(\\omega t)", "1.2\\cos(\\theta)", "-1.2\\sin(\\theta)\\sin(\\omega t)", C.ORANGE, "N"),
        buildForceVector3D("force_fc", "r\\cos(\\omega t)", "h", "r\\sin(\\omega t)", "-1.2\\cos(\\omega t)", "0", "-1.2\\sin(\\omega t)", C.RED, "F_{c}"),

        // Height indicator
        { id: "height_line", latex: `(0,\\ s,\\ 0)`, parametricDomain: { min: "0", max: "h" }, color: C.GREEN, lineStyle: "DASHED" },
        { id: "h_label", latex: `(0.3,\\ h,\\ 0)`, color: C.GREEN, label: "h", showLabel: true, pointStyle: "NONE" },
      ],
      viewport3d: {
        xMin: -maxR - 1,
        xMax: maxR + 1,
        yMin: -0.5,
        yMax: h + 1.5,
        zMin: -maxR - 1,
        zMax: maxR + 1,
      },
      dimension: '3d' as const,
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
        {
          id: "curve",
          latex: "(A_{x}\\sin(f_{x}s),\\ A_{y}\\sin(f_{y}s))",
          parametricDomain: { min: "0", max: String(tMax) },
          color: C.BLUE,
        },
      ],
      viewport: { left: -Ax * 1.3, right: Ax * 1.3, bottom: -Ay * 1.3, top: Ay * 1.3 },
    };
  },
};

// --- Public API ---

export function getDesmosExpressions(
  physicsType: string,
  knownValues: Record<string, number>,
  forces?: string[]
): TemplateResult | null {
  const template = TEMPLATES[physicsType];
  if (!template) return null;
  return template(knownValues || {}, forces);
}

export function isSupportedType(physicsType: string): boolean {
  return physicsType in TEMPLATES;
}

export const SUPPORTED_TYPES = Object.keys(TEMPLATES);
