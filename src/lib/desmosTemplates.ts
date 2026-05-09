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
    latex: `(${ox}+u(${dx}),\\ ${oy}+u(${dy}))`,
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
    latex: `(${ox}+u(${dx}),\\ ${oy}+u(${dy}),\\ ${oz}+u(${dz}))`,
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
  // Replace 's' parametric variable with 'x' for standard y=f(x) plotting
  // so 's' isn't treated as an undefined free variable
  const vAsFunctionOfX = vLatex.replace(/s\b/g, "x");
  return [
    { id: "tgraph_axis", latex: `x=${xOffset}`, color: C.GRAY, lineStyle: "DASHED", hidden: true },
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
  const sAsFunctionOfX = sLatex.replace(/s\b/g, "x");
  return [
    { id: "tgraph_s", latex: `y=${sAsFunctionOfX}`, color: C.GREEN, lineStyle: "DASHED" },
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
        { id: "g_def", latex: `g=${g}`, hidden: true },
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
    const gStr = String(g.toFixed(2));
    const rStr = String(r.toFixed(3));
    const wStr = String(omega.toFixed(3));
    const hStr = String(h.toFixed(2));
    const thStr = String(theta.toFixed(1));
    const sinTh = Math.sin(rad).toFixed(4);
    const cosTh = Math.cos(rad).toFixed(4);

    return {
      expressions: [
        // Only one slider: animated time. All constants baked into LaTeX strings.
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },

        // Ball orbiting at height h (all numeric values baked in)
        { id: "ball", latex: `(${rStr}\\cos(${wStr}t),\\ ${hStr},\\ ${rStr}\\sin(${wStr}t))`, color: C.RED },

        // Full orbit path (parametric circle at height h)
        {
          id: "orbit_path",
          latex: `(${rStr}\\cos(s),\\ ${hStr},\\ ${rStr}\\sin(s))`,
          parametricDomain: { min: "0", max: String(2 * Math.PI) },
          color: C.BLUE,
          lineStyle: "DASHED",
        },

        // Single gravity vector
        buildForceVector3D("force_g", `${rStr}\\cos(${wStr}t)`, hStr, `${rStr}\\sin(${wStr}t)`, "0", "-2", "0", C.PURPLE, "mg"),
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

  // ========== 运动与力学新增模板 ==========

  /** 力的合成与分解 */
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
        // F1 vector
        { id: "f1_vec", latex: `(uF_{1}\\cos(\\theta_{1}),\\ uF_{1}\\sin(\\theta_{1}))`, parametricDomain: { min: "0", max: "1" }, color: C.RED, label: "F_{1}", showLabel: true },
        // F2 vector
        { id: "f2_vec", latex: `(uF_{2}\\cos(\\theta_{2}),\\ uF_{2}\\sin(\\theta_{2}))`, parametricDomain: { min: "0", max: "1" }, color: C.BLUE, label: "F_{2}", showLabel: true },
        // Resultant F = F1 + F2
        { id: "fr_vec", latex: `(u(F_{1}\\cos(\\theta_{1})+F_{2}\\cos(\\theta_{2})),\\ u(F_{1}\\sin(\\theta_{1})+F_{2}\\sin(\\theta_{2})))`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN, label: "F_{合}", showLabel: true },
        // Parallelogram dashed lines
        { id: "pg_line1", latex: `(F_{1}\\cos(\\theta_{1})+uF_{2}\\cos(\\theta_{2}),\\ F_{1}\\sin(\\theta_{1})+uF_{2}\\sin(\\theta_{2}))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY, lineStyle: "DASHED" },
        { id: "pg_line2", latex: `(F_{2}\\cos(\\theta_{2})+uF_{1}\\cos(\\theta_{1}),\\ F_{2}\\sin(\\theta_{2})+uF_{1}\\sin(\\theta_{1}))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY, lineStyle: "DASHED" },
      ],
      viewport: { left: -maxF * 0.3, right: maxF, bottom: -maxF * 0.5, top: maxF * 0.7 },
    };
  },

  /** 多段匀变速运动 (v-t图) */
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
        // Velocity piecewise: stage 1 and stage 2
        { id: "vt_curve", latex: "y=\\left\\{x<t_{1}:v_{0}+a_{1}x,\\ v_{0}+a_{1}t_{1}+a_{2}(x-t_{1})\\right\\}", color: C.BLUE },
        // Moving point on v-t graph
        { id: "point", latex: "(t,\\ \\left\\{t<t_{1}:v_{0}+a_{1}t,\\ v_{0}+a_{1}t_{1}+a_{2}(t-t_{1})\\right\\})", color: C.RED },
        // Stage divider
        { id: "divider", latex: `x=t_{1}`, color: C.GRAY, lineStyle: "DASHED" },
        // Zero line
        { id: "zero_line", latex: "y=0", color: C.BLACK, lineStyle: "SOLID" },
      ],
      viewport: { left: -1, right: tMax * 1.05, bottom: vMin * 1.2 - 1, top: vMax * 1.2 + 1 },
    };
  },

  /** 阿特伍德机 */
  atwood_machine: (kv) => {
    const m1 = kvLookup(kv, ["m1"], 3);
    const m2 = kvLookup(kv, ["m2"], 5);
    const g = kvLookup(kv, ["g"], 9.8);
    const accel = (m2 - m1) / (m1 + m2) * g;
    const tMax = 3;
    const dMax = 0.5 * Math.abs(accel) * tMax * tMax;
    const hPulley = 5;
    return {
      expressions: [
        makeSlider("m1", "m_{1}", m1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("m2", "m_{2}", m2, { min: 1, max: 10, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "accel", latex: "a=\\frac{m_{2}-m_{1}}{m_{1}+m_{2}}g", hidden: true },
        // Pulley
        { id: "pulley", latex: "(0,5)", color: C.GRAY, pointStyle: "CROSS", label: "P", showLabel: true },
        // Left rope + mass m1 (goes down when a<0, up when a>0)
        { id: "rope_l", latex: `(-1,\\ 5-u(5-\\frac{1}{2}at^{2}))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        { id: "mass1", latex: "(-1,\\ \\frac{1}{2}at^{2})", color: C.RED, label: "m_{1}", showLabel: true },
        // Right rope + mass m2
        { id: "rope_r", latex: `(1,\\ 5-u(5+\\frac{1}{2}at^{2}))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        { id: "mass2", latex: `(1,\\ -\\frac{1}{2}at^{2})`, color: C.BLUE, label: "m_{2}", showLabel: true },
      ],
      viewport: { left: -3, right: 3, bottom: -dMax - 2, top: hPulley + 1 },
    };
  },

  /** 竖直面圆周运动 (过山车) */
  vertical_circular: (kv) => {
    const r = kvLookup(kv, ["r"], 3);
    const g = kvLookup(kv, ["g"], 9.8);
    const v0 = kvLookup(kv, ["v0"], 8);
    const tMax = Math.ceil(2 * Math.PI * r / v0 * 2 * 10) / 10;
    const omega0 = v0 / r;
    return {
      expressions: [
        makeSlider("r", "r", r, { min: 1, max: 5, step: 0.5 }),
        makeSlider("v0", "v_{0}", v0, { min: 2, max: 15, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "omega", latex: "\\omega=\\frac{v_{0}}{r}", hidden: true },
        // Center of circle
        { id: "center", latex: "(0,r)", color: C.GRAY, pointStyle: "CROSS", label: "O", showLabel: true },
        // Circle track
        { id: "track", latex: "x^{2}+(y-r)^{2}=r^{2}", color: C.BLUE, lineStyle: "DASHED" },
        // Ball at angle ωt from bottom: (r*sin(ωt), r - r*cos(ωt))
        { id: "ball", latex: "(r\\sin(\\omega t),\\ r-r\\cos(\\omega t))", color: C.RED },
        // Gravity force
        buildForceVector("force_g", "r\\sin(\\omega t)", "r-r\\cos(\\omega t)", "0", "-2", C.PURPLE, "mg"),
        // Centripetal direction (toward center)
        buildForceVector("force_n", "r\\sin(\\omega t)", "r-r\\cos(\\omega t)", "-1.2\\sin(\\omega t)", "1.2\\cos(\\omega t)", C.GREEN, "N"),
      ],
      viewport: { left: -r * 1.5, right: r * 1.5, bottom: -r * 0.5, top: r * 2.5 },
    };
  },

  /** 相对运动 (两车追及) */
  relative_motion: (kv) => {
    const v1 = kvLookup(kv, ["v1"], 10);
    const v2 = kvLookup(kv, ["v2"], 6);
    const d0 = kvLookup(kv, ["d0", "d"], 20);
    const a1 = kvLookup(kv, ["a1"], 0);
    const tMax = Math.ceil(d0 / Math.abs(v1 - v2) * 2 * 10) / 10;
    const xMax = Math.max(v1, v2) * tMax + d0;
    return {
      expressions: [
        makeSlider("v1", "v_{1}", v1, { min: 1, max: 30, step: 1 }),
        makeSlider("v2", "v_{2}", v2, { min: 1, max: 30, step: 1 }),
        makeSlider("d0", "d_{0}", d0, { min: 5, max: 50, step: 5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        // Car A starts at origin, moves right
        { id: "car_a", latex: "(v_{1}t,\\ 1)", color: C.RED, label: "A", showLabel: true },
        { id: "trail_a", latex: "(v_{1}s,\\ 1)", parametricDomain: { min: "0", max: String(tMax) }, color: C.RED, lineStyle: "DASHED" },
        // Car B starts at d0 ahead, moves right
        { id: "car_b", latex: "(d_{0}+v_{2}t,\\ -1)", color: C.BLUE, label: "B", showLabel: true },
        { id: "trail_b", latex: `(d_{0}+v_{2}s,\\ -1)`, parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE, lineStyle: "DASHED" },
        // Distance between them
        { id: "dist_line", latex: `(v_{1}t+u(d_{0}+v_{2}t-v_{1}t),\\ 1+u(-2))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY, lineStyle: "DASHED" },
        // Distance value
        { id: "dist_val", latex: `(\\frac{v_{1}t+d_{0}+v_{2}t}{2},\\ 0)`, color: C.GRAY, label: "Δd", showLabel: true },
      ],
      viewport: { left: -5, right: xMax * 0.6, bottom: -3, top: 3 },
    };
  },

  /** 力矩与杠杆平衡 */
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
        // Lever bar
        { id: "lever", latex: `(-L_{1}+u(L_{1}+L_{2}),\\ 0)`, parametricDomain: { min: "0", max: "1" }, color: C.BLACK },
        // Pivot point
        { id: "pivot", latex: "(0,0)", color: C.GRAY, pointStyle: "CROSS", label: "O", showLabel: true },
        // Triangle support under pivot
        { id: "support", latex: "(-0.3,-0.5)", color: C.GRAY },
        { id: "support_r", latex: "(0.3,-0.5)", color: C.GRAY },
        // F1 downward arrow at x=-L1
        { id: "f1_vec", latex: `(-L_{1},\\ uF_{1})`, parametricDomain: { min: "0", max: "1" }, color: C.RED, label: "F_{1}", showLabel: true },
        // F2 downward arrow at x=L2
        { id: "f2_vec", latex: `(L_{2},\\ uF_{2})`, parametricDomain: { min: "0", max: "1" }, color: C.BLUE, label: "F_{2}", showLabel: true },
        // Torque values (hidden, for reference)
        { id: "torque1", latex: `M_{1}=F_{1}L_{1}`, hidden: true },
        { id: "torque2", latex: `M_{2}=F_{2}L_{2}`, hidden: true },
        // Balance indicator
        { id: "balance", latex: `(0,\\ \\left\\{F_{1}L_{1}=F_{2}L_{2}:2,\\ -2\\right\\})`, color: C.GREEN, label: "\\left\\{F_{1}L_{1}=F_{2}L_{2}:\\ 平衡,\\ 不平衡\\right\\}", showLabel: true },
      ],
      viewport: { left: -leverLen, right: leverLen, bottom: -Math.max(F1, F2) - 1, top: Math.max(F1, F2) + 2 },
    };
  },

  /** 连接体 (两物块通过绳连接) */
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
        // Ground line
        { id: "ground", latex: "(-2,0)", color: C.BLACK, pointStyle: "CROSS" },
        // Block 1 (left, pulled by F)
        { id: "block1", latex: "(\\frac{1}{2}at^{2},\\ 0.5)", color: C.RED, label: "m_{1}", showLabel: true },
        // Rope connecting blocks
        { id: "rope", latex: `(\\frac{1}{2}at^{2}+u2,\\ 0.5)`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        // Block 2 (right)
        { id: "block2", latex: `(\\frac{1}{2}at^{2}+2,\\ 0.5)`, color: C.BLUE, label: "m_{2}", showLabel: true },
        // Applied force F on block1
        buildForceVector("force_F", "\\frac{1}{2}at^{2}", "0.5", "-2", "0", C.GREEN, "F"),
        // Friction on block1
        buildForceVector("force_f1", "\\frac{1}{2}at^{2}", "0.5", "1.5", "0", C.ORANGE, "f_{1}"),
        // Friction on block2
        buildForceVector("force_f2", "\\frac{1}{2}at^{2}+2", "0.5", "1.5", "0", C.ORANGE, "f_{2}"),
        // Tension between blocks
        buildForceVector("force_T", "\\frac{1}{2}at^{2}", "0.5", "1.5", "0", C.PURPLE, "T"),
      ],
      viewport: { left: -4, right: dMax + 6, bottom: -1, top: 3 },
    };
  },

  /** 竖直弹簧振子 */
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
        // Ceiling
        { id: "ceiling", latex: "(-1,5)", color: C.GRAY },
        { id: "ceiling2", latex: "(1,5)", color: C.GRAY },
        // Spring: zigzag from ceiling to mass
        { id: "spring_top", latex: `(0,\\ 5-u(5-\\frac{mg}{k}-A\\sin(\\omega t)))`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        // Equilibrium line
        { id: "eq_line", latex: `y=5-\\frac{mg}{k}`, color: C.GRAY, lineStyle: "DASHED" },
        // Mass position
        { id: "mass", latex: `(0,\\ 5-\\frac{mg}{k}-A\\sin(\\omega t))`, color: C.RED, label: "m", showLabel: true },
        // Trail of mass (x-t graph style, offset to right)
        { id: "trail", latex: `(s,\\ 5-\\frac{mg}{k}-A\\sin(\\omega s))`, parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE, lineStyle: "DASHED" },
      ],
      viewport: { left: -2, right: tMax * 0.3, bottom: 5 - eqOffset - A * 1.5, top: 6 },
    };
  },

  /** 斜面上的连接体 */
  inclined_connected: (kv) => {
    const m1 = kvLookup(kv, ["m1"], 3);
    const m2 = kvLookup(kv, ["m2"], 2);
    const angle = kvLookup(kv, ["angle", "alpha"], 30);
    const g = kvLookup(kv, ["g"], 9.8);
    const mu = kvLookup(kv, ["mu"], 0);
    const aRad = degToRad(angle);
    // m2 on slope, m1 hanging off pulley at top
    const accel = (m1 * g - m2 * g * (Math.sin(aRad) + mu * Math.cos(aRad))) / (m1 + m2);
    const tMax = accel > 0.1 ? 3 : 5;
    return {
      expressions: [
        makeSlider("m1", "m_{1}", m1, { min: 1, max: 10, step: 0.5 }),
        makeSlider("m2", "m_{2}", m2, { min: 1, max: 10, step: 0.5 }),
        makeSlider("angle", "\\alpha", angle, { min: 10, max: 60, step: 5 }),
        makeSlider("mu", "\\mu", mu, { min: 0, max: 1, step: 0.05 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "g_def", latex: `g=${g}`, hidden: true },
        { id: "accel", latex: "a=\\frac{m_{1}g-m_{2}g(\\sin(\\alpha)+\\mu\\cos(\\alpha))}{m_{1}+m_{2}}", hidden: true },
        // Slope
        { id: "slope", latex: `(5s\\cos(\\alpha),\\ 5-5s\\sin(\\alpha))`, parametricDomain: { min: "0", max: "1" }, color: C.BLACK },
        // Pulley at top of slope
        { id: "pulley", latex: `(5\\cos(\\alpha),\\ 5-5\\sin(\\alpha))`, color: C.GRAY, pointStyle: "CROSS", label: "P", showLabel: true },
        // Block m2 on slope
        { id: "block2", latex: `(5\\cos(\\alpha)-\\frac{1}{2}at^{2}\\cos(\\alpha),\\ 5-5\\sin(\\alpha)+\\frac{1}{2}at^{2}\\sin(\\alpha))`, color: C.BLUE, label: "m_{2}", showLabel: true },
        // Block m1 hanging
        { id: "block1", latex: `(5\\cos(\\alpha),\\ 5-5\\sin(\\alpha)-\\frac{1}{2}at^{2})`, color: C.RED, label: "m_{1}", showLabel: true },
      ],
      viewport: { left: -2, right: 7, bottom: -3, top: 7 },
    };
  },

  /** 追及与相遇问题 (匀变速追匀速) */
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
        // A: starts at origin, velocity vA, acceleration aA
        { id: "posA", latex: "(v_{A}t+\\frac{1}{2}a_{A}t^{2},\\ 1)", color: C.RED, label: "A", showLabel: true },
        { id: "trailA", latex: `(v_{A}s+\\frac{1}{2}a_{A}s^{2},\\ 1)`, parametricDomain: { min: "0", max: String(tMax) }, color: C.RED, lineStyle: "DASHED" },
        // B: starts at d0, constant velocity vB
        { id: "posB", latex: "(d_{0}+v_{B}t,\\ -1)", color: C.BLUE, label: "B", showLabel: true },
        { id: "trailB", latex: `(d_{0}+v_{B}s,\\ -1)`, parametricDomain: { min: "0", max: String(tMax) }, color: C.BLUE, lineStyle: "DASHED" },
        // Distance between them
        { id: "gap", latex: `(v_{A}t+\\frac{1}{2}a_{A}t^{2}+u(d_{0}+v_{B}t-v_{A}t-\\frac{1}{2}a_{A}t^{2}),\\ 1-2u)`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN, lineStyle: "DASHED" },
        // v-t graph for A (offset to right)
        { id: "vt_A", latex: `y=v_{A}+a_{A}x`, color: C.RED, lineStyle: "DASHED" },
        { id: "vt_B", latex: `y=v_{B}`, color: C.BLUE, lineStyle: "DASHED" },
      ],
      viewport: { left: -3, right: Math.min(xMax, 80), bottom: -3, top: 3 },
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
