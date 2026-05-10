import type { TemplateFn } from "./types";
import { C, kvLookup, makeSlider } from "./helpers";

export const opticsTemplates: Record<string, TemplateFn> = {

  /** 薄透镜成像 (凸透镜) */
  thin_lens: (kv) => {
    const f = kvLookup(kv, ["f"], 3);
    const do_ = kvLookup(kv, ["d", "do"], 6);
    const ho = kvLookup(kv, ["h", "ho"], 2);
    const di = f * do_ / (do_ - f);
    const hi = -di * ho / do_;
    const xMax = Math.max(Math.abs(do_), Math.abs(di)) * 1.3 + 2;
    const yMax = Math.max(ho, Math.abs(hi)) * 1.5;
    return {
      expressions: [
        makeSlider("f", "f", f, { min: 1, max: 8, step: 0.5 }),
        makeSlider("d", "d_{o}", do_, { min: 2, max: 15, step: 0.5 }),
        makeSlider("h", "h_{o}", ho, { min: 0.5, max: 4, step: 0.5 }),
        { id: "di_def", latex: "d_{i}=\\frac{fd_{o}}{d_{o}-f}", hidden: true },
        { id: "hi_def", latex: "h_{i}=-\\frac{d_{i}h_{o}}{d_{o}}", hidden: true },
        // Lens (vertical line at x=0)
        { id: "lens", latex: `(0,\\ u${yMax.toFixed(1)})`, parametricDomain: { min: "-1", max: "1" }, color: C.BLUE },
        // Focal points
        { id: "f1", latex: "(f,0)", color: C.BLUE, pointStyle: "CROSS", label: "F", showLabel: true },
        { id: "f2", latex: "(-f,0)", color: C.BLUE, pointStyle: "CROSS", label: "F'", showLabel: true },
        // Optical axis
        { id: "axis", latex: "y=0", color: C.GRAY, lineStyle: "DASHED" },
        // Object (arrow at x=-do)
        { id: "obj_base", latex: "(-d_{o},\\ 0)", color: C.RED },
        { id: "obj_tip", latex: "(-d_{o},\\ h_{o})", color: C.RED },
        { id: "obj_arrow", latex: `(-d_{o},\\ uh_{o})`, parametricDomain: { min: "0", max: "1" }, color: C.RED, label: "Object", showLabel: true },
        // Ray 1: parallel to axis, then through F
        { id: "ray1a", latex: `(-d_{o}+u\\cdot d_{o},\\ h_{o})`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN },
        { id: "ray1b", latex: `(u\\cdot d_{i},\\ h_{o}+u(-h_{o}-h_{i}))`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN },
        // Ray 2: through center of lens (undeviated)
        { id: "ray2", latex: `(-d_{o}+u(d_{o}+d_{i}),\\ h_{o}+u(-h_{o}-h_{i}))`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        // Image (arrow at x=di)
        { id: "img_base", latex: "(d_{i},\\ 0)", color: C.PURPLE },
        { id: "img_arrow", latex: `(d_{i},\\ u h_{i})`, parametricDomain: { min: "0", max: "1" }, color: C.PURPLE, label: "Image", showLabel: true },
      ],
      viewport: { left: -xMax, right: xMax, bottom: -yMax, top: yMax },
    };
  },

  /** 平面镜成像 */
  plane_mirror: (kv) => {
    const ho = kvLookup(kv, ["h", "ho"], 2);
    const d = kvLookup(kv, ["d"], 3);
    const mirrorH = 5;
    return {
      expressions: [
        makeSlider("h", "h_{o}", ho, { min: 0.5, max: 4, step: 0.5 }),
        makeSlider("d", "d", d, { min: 1, max: 8, step: 0.5 }),
        // Mirror (vertical line at x=0)
        { id: "mirror", latex: `(0,\\ u${mirrorH.toFixed(1)})`, parametricDomain: { min: "-1", max: "1" }, color: C.BLUE },
        // Object arrow
        { id: "obj_base", latex: "(-d,\\ 0)", color: C.RED },
        { id: "obj_arrow", latex: `(-d,\\ u h_{o})`, parametricDomain: { min: "0", max: "1" }, color: C.RED, label: "Object", showLabel: true },
        // Image arrow (virtual, at x=+d)
        { id: "img_base", latex: "(d,\\ 0)", color: C.PURPLE },
        { id: "img_arrow", latex: `(d,\\ u h_{o})`, parametricDomain: { min: "0", max: "1" }, color: C.PURPLE, lineStyle: "DASHED", label: "Image", showLabel: true },
        // Incident ray from object tip to mirror
        { id: "ray1_in", latex: `(-d+u\\cdot d,\\ h_{o}+u(1-h_{o}))`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN },
        { id: "ray1_out", latex: `(u\\cdot d,\\ 1+u(h_{o}-1))`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN },
        // Virtual ray extension (dashed, behind mirror)
        { id: "ray1_virtual", latex: `(u\\cdot d,\\ 1+u(h_{o}-1))`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN, lineStyle: "DASHED" },
        // Second ray (horizontal)
        { id: "ray2_in", latex: `(-d+u\\cdot d,\\ h_{o})`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        { id: "ray2_out", latex: `(u\\cdot d,\\ h_{o})`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        // Virtual extension
        { id: "ray2_virtual", latex: `(u\\cdot d,\\ h_{o})`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE, lineStyle: "DASHED" },
      ],
      viewport: { left: -d * 1.5, right: d * 1.5, bottom: -1, top: Math.max(ho, mirrorH) + 1 },
    };
  },

  /** 双缝干涉 */
  double_slit: (kv) => {
    const d = kvLookup(kv, ["d"], 4);
    const L = kvLookup(kv, ["L", "l"], 10);
    const lambda = kvLookup(kv, ["lambda"], 1);
    const I0 = kvLookup(kv, ["I0", "A"], 3);
    const xMax = Math.ceil(L * 1.2);
    return {
      expressions: [
        makeSlider("d", "d", d, { min: 1, max: 10, step: 0.5 }),
        makeSlider("L", "L", L, { min: 5, max: 20, step: 1 }),
        makeSlider("lambda", "\\lambda", lambda, { min: 0.5, max: 3, step: 0.5 }),
        makeSlider("I0", "I_{0}", I0, { min: 1, max: 5, step: 0.5 }),
        // Barrier with two slits at x=0
        { id: "slit_top", latex: `(0,\\ u\\cdot 10+d/2)`, parametricDomain: { min: "0", max: "1" }, color: C.BLACK },
        { id: "slit_mid", latex: `(0,\\ -d/2+u\\cdot d)`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        { id: "slit_bot", latex: `(0,\\ -10+u\\cdot (10-d/2))`, parametricDomain: { min: "0", max: "1" }, color: C.BLACK },
        // Slit points
        { id: "s1", latex: "(0,\\ d/2)", color: C.RED, label: "S_{1}", showLabel: true },
        { id: "s2", latex: "(0,\\ -d/2)", color: C.RED, label: "S_{2}", showLabel: true },
        // Screen at x=L
        { id: "screen", latex: `(L,\\ u\\cdot 10)`, parametricDomain: { min: "-1", max: "1" }, color: C.GRAY },
        // Intensity pattern on screen: I = I0 * cos^2(πdy/(λL))
        { id: "intensity", latex: `y=I_{0}\\cos^{2}\\left(\\frac{\\pi d x}{\\lambda L}\\right)`, color: C.RED },
        // Central maximum indicator
        { id: "center", latex: "(0,\\ 0)", color: C.GRAY, pointStyle: "CROSS" },
      ],
      viewport: { left: -xMax * 0.1, right: xMax, bottom: -5, top: 5 },
    };
  },

  /** 系外行星凌星光变曲线 */
  exoplanet_transit: (kv) => {
    const Rs = kvLookup(kv, ["Rs", "R1"], 3);
    const Rp = kvLookup(kv, ["Rp", "R2"], 1);
    const b = kvLookup(kv, ["b"], 0);
    const tMax = 10;
    const depth = (Rp / Rs) * (Rp / Rs);
    return {
      expressions: [
        makeSlider("Rs", "R_{s}", Rs, { min: 1, max: 5, step: 0.5 }),
        makeSlider("Rp", "R_{p}", Rp, { min: 0.2, max: 3, step: 0.2 }),
        makeSlider("b", "b", b, { min: 0, max: 4, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "depth", latex: "\\delta=\\left(\\frac{R_{p}}{R_{s}}\\right)^{2}", hidden: true },
        // Star (fixed circle at origin)
        { id: "star", latex: "x^{2}+y^{2}=R_{s}^{2}", color: C.ORANGE },
        { id: "star_c", latex: "(0,0)", color: C.ORANGE, label: "Star", showLabel: true },
        // Planet (moving across star from left to right)
        { id: "planet", latex: `((t-5)\\cdot R_{s}/2,\\ b)`, color: C.BLACK, label: "Planet", showLabel: true },
        { id: "planet_c", latex: `(x-(t-5)\\cdot R_{s}/2)^{2}+(y-b)^{2}=R_{p}^{2}`, color: C.BLACK },
        // Light curve (brightness vs time)
        // When planet overlaps star: brightness drops by δ
        // Overlap condition: distance between centers < Rs + Rp
        { id: "light_curve", latex: "y=\\left\\{\\left((x-5)\\cdot R_{s}/2\\right)^{2}+b^{2}<\\left(R_{s}-R_{p}\\right)^{2}:1-\\delta,\\ 1\\right\\}", color: C.BLUE },
        { id: "baseline", latex: "y=1", color: C.GRAY, lineStyle: "DASHED" },
        // Depth marker
        { id: "depth_label", latex: "(5,\\ 1-\\delta/2)", color: C.RED, label: "\\delta", showLabel: true },
      ],
      viewport: { left: -1, right: tMax, bottom: 1 - depth * 2, top: 1.3 },
    };
  },
};
