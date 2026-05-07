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

type TemplateFn = (kv: Record<string, number>) => DesmosExpr[];

const C = {
  RED: "#c74440",
  BLUE: "#2d70b3",
  GREEN: "#388c46",
  PURPLE: "#6042a6",
  ORANGE: "#fa7e19",
  BLACK: "#000000",
};

const TEMPLATES: Record<string, TemplateFn> = {
  projectile_motion: () => [
    { id: "v0", latex: "v_{0}=20", sliderBounds: { min: 1, max: 50, step: 1 } },
    { id: "theta", latex: "\\theta=45", sliderBounds: { min: 5, max: 85, step: 5 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
    { id: "point", latex: "(v_{0}\\cos(\\theta)t,\\ v_{0}\\sin(\\theta)t-4.9t^{2})", color: C.RED },
    {
      id: "curve",
      latex: "(v_{0}\\cos(\\theta)s,\\ v_{0}\\sin(\\theta)s-4.9s^{2})",
      parametricDomain: { min: "0", max: "10" },
      color: C.BLUE,
      lineStyle: "DASHED",
    },
  ],

  pendulum: () => [
    { id: "L", latex: "L=2", sliderBounds: { min: 1, max: 5, step: 0.1 } },
    { id: "alpha0", latex: "\\alpha_{0}=30", sliderBounds: { min: 10, max: 60, step: 5 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "pivot", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
    { id: "bob", latex: "(L\\sin(\\alpha_{0}\\cos(1.5t)),\\ -L\\cos(\\alpha_{0}\\cos(1.5t)))", color: C.RED },
    {
      id: "curve",
      latex: "(L\\sin(\\alpha_{0}\\cos(1.5s)),\\ -L\\cos(\\alpha_{0}\\cos(1.5s)))",
      parametricDomain: { min: "0", max: "10" },
      color: C.BLUE,
      lineStyle: "DASHED",
    },
  ],

  free_fall: (kv) => {
    const h = kv.h || 45;
    const tMax = Math.ceil(Math.sqrt(2 * h / 9.8)) + 1;
    return [
      { id: "h", latex: "h=45", sliderBounds: { min: 10, max: 100, step: 5 } },
      { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.1 }, playing: true },
      { id: "start", latex: "(0,h)", color: C.GREEN, pointStyle: "CROSS", label: "A", showLabel: true },
      { id: "ground", latex: "(0,0)", color: C.BLACK, pointStyle: "CROSS", label: "G", showLabel: true },
      { id: "ball", latex: "(0,\\max(h-4.9t^{2},0))", color: C.RED },
      {
        id: "curve",
        latex: "(s,\\max(h-4.9s^{2},0))",
        parametricDomain: { min: "0", max: String(tMax) },
        color: C.BLUE,
        lineStyle: "DASHED",
      },
    ];
  },

  inclined_plane: () => [
    { id: "angle", latex: "\\alpha=30", sliderBounds: { min: 10, max: 60, step: 5 } },
    { id: "mu", latex: "\\mu=0.2", sliderBounds: { min: 0, max: 1, step: 0.05 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "accel", latex: "a=4.9(\\sin(\\alpha)-\\mu\\cos(\\alpha))", hidden: true },
    { id: "top", latex: "(0,5)", color: C.GREEN, pointStyle: "CROSS", label: "S", showLabel: true },
    {
      id: "slope",
      latex: "(5s\\cos(\\alpha),\\ 5-5s\\sin(\\alpha))",
      parametricDomain: { min: "0", max: "1" },
      color: C.BLACK,
    },
    { id: "block", latex: "(0.5at^{2}\\cos(\\alpha),\\ 5-0.5at^{2}\\sin(\\alpha))", color: C.RED },
  ],

  circular_motion: () => [
    { id: "r", latex: "r=3", sliderBounds: { min: 1, max: 5, step: 0.1 } },
    { id: "omega", latex: "\\omega=2", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
    { id: "point", latex: "(r\\cos(\\omega t),\\ r\\sin(\\omega t))", color: C.RED },
    { id: "circle", latex: "x^{2}+y^{2}=r^{2}", color: C.BLUE, lineStyle: "DASHED" },
  ],

  spring: () => [
    { id: "amp", latex: "A=2", sliderBounds: { min: 0.5, max: 3, step: 0.1 } },
    { id: "omega", latex: "\\omega=3", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
    { id: "point", latex: "(0,\\ A\\sin(\\omega t))", color: C.RED },
    {
      id: "curve",
      latex: "(s,\\ A\\sin(\\omega s))",
      parametricDomain: { min: "0", max: "10" },
      color: C.BLUE,
      lineStyle: "DASHED",
    },
  ],

  vertical_throw: (kv) => {
    const v0 = kv.v0 || 20;
    const tMax = Math.ceil(2 * v0 / 9.8) + 1;
    return [
      { id: "v0", latex: "v_{0}=20", sliderBounds: { min: 5, max: 40, step: 1 } },
      { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.1 }, playing: true },
      { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
      { id: "top", latex: "(0,\\ v_{0}^{2}/19.6)", color: C.PURPLE, pointStyle: "CROSS", label: "H", showLabel: true },
      { id: "ball", latex: "(0,\\ v_{0}t-4.9t^{2})", color: C.RED },
      {
        id: "curve",
        latex: "(s,\\ v_{0}s-4.9s^{2})",
        parametricDomain: { min: "0", max: String(tMax) },
        color: C.BLUE,
        lineStyle: "DASHED",
      },
    ];
  },

  horizontal_throw: (kv) => {
    const h = kv.h || 20;
    const tMax = Math.ceil(Math.sqrt(2 * h / 9.8)) + 1;
    return [
      { id: "v0", latex: "v_{0}=10", sliderBounds: { min: 1, max: 30, step: 1 } },
      { id: "h", latex: "h=20", sliderBounds: { min: 5, max: 50, step: 5 } },
      { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.1 }, playing: true },
      { id: "start", latex: "(0,h)", color: C.GREEN, pointStyle: "CROSS", label: "A", showLabel: true },
      { id: "ground", latex: "(0,0)", color: C.BLACK, pointStyle: "CROSS", label: "G", showLabel: true },
      { id: "point", latex: "(v_{0}t,\\ h-4.9t^{2})", color: C.RED },
      {
        id: "curve",
        latex: "(v_{0}s,\\ h-4.9s^{2})",
        parametricDomain: { min: "0", max: String(tMax) },
        color: C.BLUE,
        lineStyle: "DASHED",
      },
    ];
  },

  elastic_collision: () => [
    { id: "m1", latex: "m_{1}=2", sliderBounds: { min: 1, max: 10, step: 0.5 } },
    { id: "m2", latex: "m_{2}=3", sliderBounds: { min: 1, max: 10, step: 0.5 } },
    { id: "v1", latex: "v_{1}=5", sliderBounds: { min: 1, max: 10, step: 0.5 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "v1f", latex: "v_{1f}=(m_{1}-m_{2})/(m_{1}+m_{2})v_{1}", hidden: true },
    { id: "v2f", latex: "v_{2f}=2m_{1}/(m_{1}+m_{2})v_{1}", hidden: true },
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
  ],

  magnetic_field: () => [
    { id: "v0", latex: "v_{0}=5", sliderBounds: { min: 1, max: 10, step: 0.5 } },
    { id: "B", latex: "B=2", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "r", latex: "r=v_{0}/B", hidden: true },
    { id: "center", latex: "(0,r)", color: C.GREEN, pointStyle: "CROSS" },
    { id: "point", latex: "(r\\sin(Bt),\\ r-r\\cos(Bt))", color: C.RED },
    { id: "circle", latex: "x^{2}+(y-r)^{2}=r^{2}", color: C.BLUE, lineStyle: "DASHED" },
  ],

  wave_superposition: () => [
    { id: "A1", latex: "A_{1}=2", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "A2", latex: "A_{2}=2", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "f1", latex: "f_{1}=2", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "f2", latex: "f_{2}=3", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "wave_sum", latex: "y=A_{1}\\sin(f_{1}x-t)+A_{2}\\sin(f_{2}x-t)", color: C.RED },
    { id: "wave1", latex: "y=A_{1}\\sin(f_{1}x-t)", color: C.BLUE, lineStyle: "DASHED" },
    { id: "wave2", latex: "y=A_{2}\\sin(f_{2}x-t)", color: C.GREEN, lineStyle: "DASHED" },
  ],

  energy_conservation: () => [
    { id: "h", latex: "h=10", sliderBounds: { min: 2, max: 15, step: 1 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 5, step: 0.1 }, playing: true },
    { id: "top", latex: "(0,h)", color: C.GREEN, pointStyle: "CROSS", label: "H", showLabel: true },
    { id: "ground", latex: "(0,0)", color: C.BLACK, pointStyle: "CROSS", label: "G", showLabel: true },
    { id: "ball", latex: "(0,\\max(h-4.9t^{2},0))", color: C.RED },
  ],

  damped_oscillation: () => [
    { id: "A", latex: "A=3", sliderBounds: { min: 1, max: 5, step: 0.1 } },
    { id: "b", latex: "b=0.3", sliderBounds: { min: 0.1, max: 2, step: 0.1 } },
    { id: "omega", latex: "\\omega=3", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "point", latex: "(t,\\ Ae^{-bt}\\sin(\\omega t))", color: C.RED },
    {
      id: "wave",
      latex: "(s,\\ Ae^{-bs}\\sin(\\omega s))",
      parametricDomain: { min: "0", max: "10" },
      color: C.BLUE,
    },
    { id: "env1", latex: "y=Ae^{-bx}", color: C.ORANGE, lineStyle: "DASHED" },
    { id: "env2", latex: "y=-Ae^{-bx}", color: C.ORANGE, lineStyle: "DASHED" },
  ],

  uniform_acceleration: () => [
    { id: "v0", latex: "v_{0}=5", sliderBounds: { min: 0, max: 20, step: 1 } },
    { id: "a", latex: "a=2", sliderBounds: { min: -5, max: 5, step: 0.5 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
    { id: "point", latex: "(t,\\ v_{0}+at)", color: C.RED },
    { id: "line", latex: "y=v_{0}+ax", color: C.BLUE },
  ],

  binary_star: () => [
    { id: "m1", latex: "m_{1}=3", sliderBounds: { min: 1, max: 10, step: 0.5 } },
    { id: "m2", latex: "m_{2}=5", sliderBounds: { min: 1, max: 10, step: 0.5 } },
    { id: "d", latex: "d=6", sliderBounds: { min: 2, max: 10, step: 0.5 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "r1", latex: "r_{1}=m_{2}/(m_{1}+m_{2})d", hidden: true },
    { id: "r2", latex: "r_{2}=m_{1}/(m_{1}+m_{2})d", hidden: true },
    { id: "p1", latex: "(r_{1}\\cos(t),\\ r_{1}\\sin(t))", color: C.RED },
    { id: "p2", latex: "(-r_{2}\\cos(t),\\ -r_{2}\\sin(t))", color: C.BLUE },
    { id: "orbit1", latex: "x^{2}+y^{2}=r_{1}^{2}", color: C.RED, lineStyle: "DASHED" },
    { id: "orbit2", latex: "x^{2}+y^{2}=r_{2}^{2}", color: C.BLUE, lineStyle: "DASHED" },
  ],

  electric_deflection: () => [
    { id: "v0", latex: "v_{0}=5", sliderBounds: { min: 1, max: 10, step: 0.5 } },
    { id: "E", latex: "E=3", sliderBounds: { min: 1, max: 10, step: 0.5 } },
    { id: "q", latex: "q=1", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "m", latex: "m=1", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "accel", latex: "a=qE/m", hidden: true },
    { id: "origin", latex: "(0,0)", color: C.GREEN, pointStyle: "CROSS", label: "O", showLabel: true },
    { id: "point", latex: "(v_{0}t,\\ 0.5at^{2})", color: C.RED },
    {
      id: "curve",
      latex: "(v_{0}s,\\ 0.5as^{2})",
      parametricDomain: { min: "0", max: "10" },
      color: C.BLUE,
      lineStyle: "DASHED",
    },
  ],

  forced_oscillation: () => [
    { id: "f0", latex: "f_{0}=2", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "f", latex: "f=2", sliderBounds: { min: 0.5, max: 5, step: 0.5 } },
    { id: "A0", latex: "A_{0}=2", sliderBounds: { min: 0.5, max: 3, step: 0.5 } },
    { id: "gamma", latex: "\\gamma=0.5", sliderBounds: { min: 0.1, max: 2, step: 0.1 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    {
      id: "amp",
      latex: "B=A_{0}/\\sqrt{(f_{0}^{2}-f^{2})^{2}+(\\gamma f)^{2}}",
      hidden: true,
    },
    { id: "point", latex: "(t,\\ B\\sin(ft))", color: C.RED },
    {
      id: "wave",
      latex: "(s,\\ B\\sin(fs))",
      parametricDomain: { min: "0", max: "10" },
      color: C.BLUE,
    },
  ],

  lissajous: () => [
    { id: "Ax", latex: "A_{x}=3", sliderBounds: { min: 1, max: 5, step: 0.5 } },
    { id: "Ay", latex: "A_{y}=3", sliderBounds: { min: 1, max: 5, step: 0.5 } },
    { id: "fx", latex: "f_{x}=2", sliderBounds: { min: 1, max: 5, step: 1 } },
    { id: "fy", latex: "f_{y}=3", sliderBounds: { min: 1, max: 5, step: 1 } },
    { id: "t", latex: "t=0", sliderBounds: { min: 0, max: 10, step: 0.1 }, playing: true },
    { id: "point", latex: "(A_{x}\\sin(f_{x}t),\\ A_{y}\\sin(f_{y}t))", color: C.RED },
    {
      id: "curve",
      latex: "(A_{x}\\sin(f_{x}s),\\ A_{y}\\sin(f_{y}s))",
      parametricDomain: { min: "0", max: "10" },
      color: C.BLUE,
    },
  ],
};

export function getDesmosExpressions(
  physicsType: string,
  knownValues: Record<string, number>
): DesmosExpr[] | null {
  const template = TEMPLATES[physicsType];
  if (!template) return null;
  return template(knownValues || {});
}

export function isSupportedType(physicsType: string): boolean {
  return physicsType in TEMPLATES;
}

export const SUPPORTED_TYPES = Object.keys(TEMPLATES);
