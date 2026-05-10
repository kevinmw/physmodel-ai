import type { TemplateFn } from "./types";
import { C, kvLookup, makeSlider, buildForceVector } from "./helpers";

export const emTemplates: Record<string, TemplateFn> = {

  magnetic_field: (kv) => {
    const m = kvLookup(kv, ["m"], 1);
    const q = kvLookup(kv, ["q"], 1);
    const v0 = kvLookup(kv, ["v0", "v"], 5);
    const B = kvLookup(kv, ["B"], 2);
    const r = m * v0 / (q * B);
    const omega = q * B / m;
    const tMax = Math.ceil(2 * Math.PI / omega * 2 * 10) / 10;
    return {
      expressions: [
        makeSlider("v0", "v_{0}", v0, { min: 1, max: 10, step: 0.5 }),
        makeSlider("B", "B", B, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("m", "m", m, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("q", "q", q, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "r_def", latex: "r=\\frac{mv_{0}}{qB}", hidden: true },
        { id: "omega_def", latex: "\\omega=\\frac{qB}{m}", hidden: true },
        { id: "center", latex: "(0,r)", color: C.GRAY, pointStyle: "CROSS", label: "O", showLabel: true },
        { id: "track", latex: "x^{2}+(y-r)^{2}=r^{2}", color: C.BLUE, lineStyle: "DASHED" },
        { id: "particle", latex: "(r\\sin(\\omega t),\\ r-r\\cos(\\omega t))", color: C.RED },
        buildForceVector("force_l", "r\\sin(\\omega t)", "r-r\\cos(\\omega t)", "-1.5\\sin(\\omega t)", "1.5\\cos(\\omega t)", C.PURPLE, "qvB"),
      ],
      viewport: { left: -r * 1.5, right: r * 1.5, bottom: -r * 0.5, top: r * 2.5 },
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

  /** 动生电动势 (导体棒在磁场中运动) */
  motional_emf: (kv) => {
    const B = kvLookup(kv, ["B"], 1);
    const L = kvLookup(kv, ["L", "l"], 2);
    const v = kvLookup(kv, ["v", "v0"], 3);
    const R = kvLookup(kv, ["R"], 5);
    const emf = B * L * v;
    const current = emf / R;
    const tMax = 6;
    return {
      expressions: [
        makeSlider("B", "B", B, { min: 0.5, max: 3, step: 0.5 }),
        makeSlider("L", "L", L, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("v", "v", v, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("R", "R", R, { min: 1, max: 20, step: 1 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "emf_def", latex: "\\varepsilon=BLv", hidden: true },
        { id: "current_def", latex: "I=\\frac{\\varepsilon}{R}", hidden: true },
        // Rails (two horizontal lines)
        { id: "rail_top", latex: `(vt+u\\cdot 6,\\ L)`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        { id: "rail_bot", latex: `(vt+u\\cdot 6,\\ 0)`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        // Moving bar (vertical line at position vt)
        { id: "bar", latex: `(vt+u(0),\\ uL)`, parametricDomain: { min: "0", max: "1" }, color: C.RED },
        // Resistor at left end
        { id: "resistor", latex: `(0,\\ uL)`, parametricDomain: { min: "0", max: "1" }, color: C.PURPLE },
        // Velocity arrow
        buildForceVector("force_v", "vt", "L/2", "2", "0", C.GREEN, "v"),
        // B field indicators (dots for "out of page")
        { id: "b1", latex: "(vt+2,\\ 1)", color: C.BLUE, label: "B\\odot", showLabel: true },
        { id: "b2", latex: "(vt+2,\\ L-1)", color: C.BLUE, label: "B\\odot", showLabel: true },
      ],
      viewport: { left: -2, right: v * tMax + 4, bottom: -1, top: L + 2 },
    };
  },

  /** 电磁波 (E和B场振荡) */
  em_wave: (kv) => {
    const E0 = kvLookup(kv, ["E0", "A"], 3);
    const f = kvLookup(kv, ["f"], 1);
    const tMax = 8;
    return {
      expressions: [
        makeSlider("E0", "E_{0}", E0, { min: 1, max: 5, step: 0.5 }),
        makeSlider("f", "f", f, { min: 0.5, max: 3, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        // E field oscillation (in y direction)
        { id: "e_field", latex: "y=E_{0}\\sin\\left(2\\pi f(x-t)\\right)", color: C.RED },
        // B field oscillation (shown as separate curve, phase locked but perpendicular)
        { id: "b_field", latex: "y=-E_{0}\\sin\\left(2\\pi f(x-t)\\right)", color: C.BLUE, lineStyle: "DASHED" },
        // Propagation direction arrow
        { id: "x_axis", latex: "y=0", color: C.GRAY, lineStyle: "DASHED" },
        // Labels
        { id: "e_label", latex: "(tMax,\\ E_{0})", color: C.RED, label: "E", showLabel: true },
        { id: "b_label", latex: "(tMax,\\ -E_{0})", color: C.BLUE, label: "B", showLabel: true },
      ],
      viewport: { left: -1, right: tMax, bottom: -E0 * 1.5, top: E0 * 1.5 },
    };
  },

  /** 串联电路电势 */
  series_circuit: (kv) => {
    const V = kvLookup(kv, ["V", "V0"], 12);
    const R1 = kvLookup(kv, ["R1"], 4);
    const R2 = kvLookup(kv, ["R2"], 6);
    const R3 = kvLookup(kv, ["R3"], 2);
    return {
      expressions: [
        makeSlider("V", "V", V, { min: 1, max: 24, step: 1 }),
        makeSlider("R1", "R_{1}", R1, { min: 1, max: 20, step: 1 }),
        makeSlider("R2", "R_{2}", R2, { min: 1, max: 20, step: 1 }),
        makeSlider("R3", "R_{3}", R3, { min: 1, max: 20, step: 1 }),
        // Hidden definitions
        { id: "i_def", latex: "I=\\frac{V}{R_{1}+R_{2}+R_{3}}", hidden: true },
        { id: "v1_def", latex: "V_{1}=IR_{1}", hidden: true },
        { id: "v2_def", latex: "V_{2}=IR_{2}", hidden: true },
        { id: "v3_def", latex: "V_{3}=IR_{3}", hidden: true },
        // Wires (top at V, bottom at 0)
        { id: "wire_top", latex: `(u\\cdot 6,\\ V)`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        { id: "wire_bot", latex: `(u\\cdot 6,\\ 0)`, parametricDomain: { min: "0", max: "1" }, color: C.GRAY },
        // Battery at x=0
        { id: "battery", latex: `(0,\\ uV)`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN, label: "V", showLabel: true },
        // R1 drop bar at x=2: from V down to V-V1
        { id: "r1_drop", latex: `(2,\\ V-uV_{1})`, parametricDomain: { min: "0", max: "1" }, color: C.RED, label: "R_{1}", showLabel: true },
        // R2 drop bar at x=4: from V-V1 down to V-V1-V2
        { id: "r2_drop", latex: `(4,\\ V-V_{1}-uV_{2})`, parametricDomain: { min: "0", max: "1" }, color: C.BLUE, label: "R_{2}", showLabel: true },
        // R3 drop bar at x=6: from V3 down to 0
        { id: "r3_drop", latex: `(6,\\ V_{3}-uV_{3})`, parametricDomain: { min: "0", max: "1" }, color: C.PURPLE, label: "R_{3}", showLabel: true },
        // Voltage drop labels
        { id: "v1_lbl", latex: `(1,\\ V-V_{1}/2)`, color: C.RED, label: "V_{1}", showLabel: true },
        { id: "v2_lbl", latex: `(3,\\ V-V_{1}-V_{2}/2)`, color: C.BLUE, label: "V_{2}", showLabel: true },
        { id: "v3_lbl", latex: `(5,\\ V_{3}/2)`, color: C.PURPLE, label: "V_{3}", showLabel: true },
      ],
      viewport: { left: -2, right: 8, bottom: -V * 0.15, top: V * 1.15 },
    };
  },

  /** 点电荷电场 */
  electric_field: (kv) => {
    const q1 = kvLookup(kv, ["q1"], 1);
    const q2 = kvLookup(kv, ["q2"], -1);
    const d = kvLookup(kv, ["d"], 4);
    const k = 9; // k in arbitrary units
    const fieldRange = 6;
    return {
      expressions: [
        makeSlider("q1", "q_{1}", q1, { min: -3, max: 3, step: 0.5 }),
        makeSlider("q2", "q_{2}", q2, { min: -3, max: 3, step: 0.5 }),
        makeSlider("d", "d", d, { min: 1, max: 8, step: 0.5 }),
        { id: "k_def", latex: "k=9", hidden: true },
        // Charge positions
        { id: "c1", latex: "(-d/2,\\ 0)", color: C.RED, label: "q_{1}", showLabel: true, pointStyle: "CROSS" },
        { id: "c2", latex: "(d/2,\\ 0)", color: C.BLUE, label: "q_{2}", showLabel: true, pointStyle: "CROSS" },
        // Equipotential circles around q1
        { id: "eq1_1", latex: "(x+d/2)^{2}+y^{2}=1", color: C.RED, lineStyle: "DASHED" },
        { id: "eq1_2", latex: "(x+d/2)^{2}+y^{2}=4", color: C.RED, lineStyle: "DASHED" },
        { id: "eq1_3", latex: "(x+d/2)^{2}+y^{2}=9", color: C.RED, lineStyle: "DASHED" },
        // Equipotential circles around q2
        { id: "eq2_1", latex: "(x-d/2)^{2}+y^{2}=1", color: C.BLUE, lineStyle: "DASHED" },
        { id: "eq2_2", latex: "(x-d/2)^{2}+y^{2}=4", color: C.BLUE, lineStyle: "DASHED" },
        { id: "eq2_3", latex: "(x-d/2)^{2}+y^{2}=9", color: C.BLUE, lineStyle: "DASHED" },
        // Field direction vectors (sample grid)
        // Force lines along axis
        { id: "f_line_pos", latex: "y=0", color: C.GREEN },
        // Potential formula
        { id: "v_pot", latex: "V=\\frac{kq_{1}}{r_{1}}+\\frac{kq_{2}}{r_{2}}", hidden: true },
      ],
      viewport: { left: -fieldRange, right: fieldRange, bottom: -fieldRange * 0.7, top: fieldRange * 0.7 },
    };
  },

  /** 高斯定律 (通量与包围电荷) */
  gauss_law: (kv) => {
    const q1 = kvLookup(kv, ["q1"], 1);
    const q2 = kvLookup(kv, ["q2"], -1);
    const d = kvLookup(kv, ["d"], 4);
    const surfR = kvLookup(kv, ["R", "r"], 3);
    return {
      expressions: [
        makeSlider("q1", "q_{1}", q1, { min: -3, max: 3, step: 0.5 }),
        makeSlider("q2", "q_{2}", q2, { min: -3, max: 3, step: 0.5 }),
        makeSlider("d", "d", d, { min: 0, max: 6, step: 0.5 }),
        makeSlider("R", "R", surfR, { min: 1, max: 6, step: 0.5 }),
        // Charges
        { id: "c1", latex: "(-d/2,\\ 0)", color: C.RED, label: "q_{1}", showLabel: true, pointStyle: "CROSS" },
        { id: "c2", latex: "(d/2,\\ 0)", color: C.BLUE, label: "q_{2}", showLabel: true, pointStyle: "CROSS" },
        // Gaussian surface (circle)
        { id: "surface", latex: "x^{2}+y^{2}=R^{2}", color: C.GREEN },
        // Field vectors on surface (sample at 8 points)
        { id: "fv1", latex: `(R\\cos(0)+u\\cdot 0.8,\\ R\\sin(0))`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        { id: "fv2", latex: `(R\\cos(\\pi/4)+u\\cdot 0.6,\\ R\\sin(\\pi/4)+u\\cdot 0.6)`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        { id: "fv3", latex: `(u\\cdot 0.8,\\ R)`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        { id: "fv4", latex: `(-u\\cdot 0.8,\\ R)`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        { id: "fv5", latex: `(-R+u\\cdot 0.8,\\ 0)`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        { id: "fv6", latex: `(u\\cdot 0.8,\\ -R)`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        { id: "fv7", latex: `(R\\cos(-\\pi/4)+u\\cdot 0.6,\\ R\\sin(-\\pi/4)-u\\cdot 0.6)`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        { id: "fv8", latex: `(R\\cos(\\pi/4)+u\\cdot 0.6,\\ -R\\sin(\\pi/4)-u\\cdot 0.6)`, parametricDomain: { min: "0", max: "1" }, color: C.ORANGE },
        // Gauss's law formula
        { id: "gauss", latex: "\\Phi=\\oint E\\cdot dA=\\frac{q_{enc}}{\\varepsilon_{0}}", hidden: true },
        // Enclosed charge check
        { id: "qenc", latex: "q_{enc}=\\left\\{d/2<R:q_{1},\\ 0\\right\\}+\\left\\{d/2<R:q_{2},\\ 0\\right\\}", hidden: true },
      ],
      viewport: { left: -6, right: 6, bottom: -5, top: 5 },
    };
  },

  /** 安培定律 (电流磁场) */
  amperes_law: (kv) => {
    const I1 = kvLookup(kv, ["I1"], 2);
    const I2 = kvLookup(kv, ["I2"], -1);
    const d = kvLookup(kv, ["d"], 4);
    const loopR = kvLookup(kv, ["R", "r"], 3);
    return {
      expressions: [
        makeSlider("I1", "I_{1}", I1, { min: -3, max: 3, step: 0.5 }),
        makeSlider("I2", "I_{2}", I2, { min: -3, max: 3, step: 0.5 }),
        makeSlider("d", "d", d, { min: 0, max: 6, step: 0.5 }),
        makeSlider("R", "R", loopR, { min: 1, max: 6, step: 0.5 }),
        // Current positions (out of page - dots, into page - crosses)
        { id: "wire1", latex: "(-d/2,\\ 0)", color: C.RED, label: "I_{1}", showLabel: true, pointStyle: "CROSS" },
        { id: "wire2", latex: "(d/2,\\ 0)", color: C.BLUE, label: "I_{2}", showLabel: true, pointStyle: "CROSS" },
        // Amperian loop (circle)
        { id: "loop", latex: "x^{2}+y^{2}=R^{2}", color: C.GREEN },
        // B field circles around I1
        { id: "b1_1", latex: "(x+d/2)^{2}+y^{2}=2", color: C.RED, lineStyle: "DASHED" },
        { id: "b1_2", latex: "(x+d/2)^{2}+y^{2}=5", color: C.RED, lineStyle: "DASHED" },
        // B field circles around I2
        { id: "b2_1", latex: "(x-d/2)^{2}+y^{2}=2", color: C.BLUE, lineStyle: "DASHED" },
        { id: "b2_2", latex: "(x-d/2)^{2}+y^{2}=5", color: C.BLUE, lineStyle: "DASHED" },
        // Ampere's law formula
        { id: "ampere", latex: "\\oint B\\cdot dl=\\mu_{0}I_{enc}", hidden: true },
        // B direction arrows on loop (tangential)
        { id: "bdir1", latex: `(R+u\\cdot 0.8,\\ u\\cdot 0.8)`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN },
        { id: "bdir2", latex: `(-u\\cdot 0.8,\\ R+u\\cdot 0.8)`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN },
        { id: "bdir3", latex: `(-R-u\\cdot 0.8,\\ -u\\cdot 0.8)`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN },
        { id: "bdir4", latex: `(u\\cdot 0.8,\\ -R-u\\cdot 0.8)`, parametricDomain: { min: "0", max: "1" }, color: C.GREEN },
      ],
      viewport: { left: -6, right: 6, bottom: -5, top: 5 },
    };
  },

  /** LC振荡电路 */
  lc_circuit: (kv) => {
    const Cval = kvLookup(kv, ["C", "c"], 1);
    const Lval = kvLookup(kv, ["L", "l"], 1);
    const Q0 = kvLookup(kv, ["Q0", "Q", "q0"], 5);
    const omega0 = 1 / Math.sqrt(Lval * Cval);
    const tMax = Math.ceil(2 * Math.PI / omega0 * 3 * 10) / 10;
    return {
      expressions: [
        makeSlider("C", "C", Cval, { min: 0.1, max: 5, step: 0.1 }),
        makeSlider("L", "L", Lval, { min: 0.1, max: 5, step: 0.1 }),
        makeSlider("Q0", "Q_{0}", Q0, { min: 1, max: 10, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "omega_def", latex: "\\omega=\\frac{1}{\\sqrt{LC}}", hidden: true },
        // Charge on capacitor
        { id: "q_graph", latex: "y=Q_{0}\\cos(\\omega t)", color: C.RED },
        // Current through inductor
        { id: "i_graph", latex: "y=-Q_{0}\\omega\\sin(\\omega t)", color: C.BLUE, lineStyle: "DASHED" },
        // Capacitor energy: EC = Q^2/(2C)
        { id: "ec_def", latex: "E_{C}=\\frac{Q_{0}^{2}\\cos^{2}(\\omega t)}{2C}", hidden: true },
        // Inductor energy: EL = LI^2/2
        { id: "el_def", latex: "E_{L}=\\frac{LQ_{0}^{2}\\omega^{2}\\sin^{2}(\\omega t)}{2}", hidden: true },
        // Total energy (constant)
        { id: "et_def", latex: "E_{T}=\\frac{Q_{0}^{2}}{2C}", hidden: true },
        // Energy bars (shifted to right panel)
        { id: "e_cap_bar", latex: `(t,\\ \\frac{Q_{0}^{2}\\cos^{2}(\\omega t)}{2C})`, color: C.RED },
        { id: "e_ind_bar", latex: `(t,\\ \\frac{LQ_{0}^{2}\\omega^{2}\\sin^{2}(\\omega t)}{2})`, color: C.BLUE, lineStyle: "DASHED" },
        // Labels
        { id: "q_label", latex: `(-0.5,\\ ${Q0})`, color: C.RED, label: "q(t)", showLabel: true },
        { id: "i_label", latex: `(-0.5,\\ ${-Q0 * omega0})`, color: C.BLUE, label: "I(t)", showLabel: true },
      ],
      viewport: { left: -1, right: tMax * 1.1, bottom: -Q0 * omega0 * 1.3, top: Q0 * 1.3 },
    };
  },

  /** 法拉第电磁感应定律 */
  faraday_law: (kv) => {
    const B = kvLookup(kv, ["B"], 1);
    const v = kvLookup(kv, ["v", "v0"], 2);
    const R = kvLookup(kv, ["R"], 5);
    const w = kvLookup(kv, ["w", "L", "l"], 2);
    const tMax = 8;
    return {
      expressions: [
        makeSlider("B", "B", B, { min: 0.5, max: 3, step: 0.5 }),
        makeSlider("v", "v", v, { min: 0.5, max: 5, step: 0.5 }),
        makeSlider("R", "R", R, { min: 1, max: 20, step: 1 }),
        makeSlider("w", "w", w, { min: 0.5, max: 4, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        // Magnetic field region (shown as shaded box from x=2 to x=6)
        { id: "field_left", latex: "x=2", color: C.BLUE, lineStyle: "DASHED" },
        { id: "field_right", latex: "x=6", color: C.BLUE, lineStyle: "DASHED" },
        { id: "field_label", latex: "(4,\\ 4)", color: C.BLUE, label: "B\\odot", showLabel: true },
        // Loop position (moving right at velocity v)
        { id: "loop_left", latex: "(vt,\\ u\\cdot w-\\frac{w}{2})", parametricDomain: { min: "0", max: "1" }, color: C.RED },
        { id: "loop_right", latex: "(vt+w,\\ u\\cdot w-\\frac{w}{2})", parametricDomain: { min: "0", max: "1" }, color: C.RED },
        { id: "loop_top", latex: "(vt+u\\cdot w,\\ \\frac{w}{2})", parametricDomain: { min: "0", max: "1" }, color: C.RED },
        { id: "loop_bot", latex: "(vt+u\\cdot w,\\ -\\frac{w}{2})", parametricDomain: { min: "0", max: "1" }, color: C.RED },
        // Induced EMF = -dPhi/dt = B*w*v (when entering/exiting field region)
        { id: "emf_def", latex: "\\varepsilon=Bwv", hidden: true },
        { id: "i_def", latex: "I=\\frac{\\varepsilon}{R}", hidden: true },
        // EMF graph (shifted down)
        { id: "emf_graph", latex: "y=If(vt+w<2,\\ 0,\\ If(vt<6,\\ Bwv,\\ If(vt+w<6,\\ -Bwv,\\ 0)))-5", color: C.ORANGE },
        { id: "zero_line", latex: "y=-5", color: C.GRAY, lineStyle: "DASHED" },
        { id: "emf_label", latex: `(-1,\\ ${-5 + B * w * v})`, color: C.ORANGE, label: "\\varepsilon", showLabel: true },
      ],
      viewport: { left: -2, right: v * tMax + 2, bottom: -10, top: 5 },
    };
  },

  /** 电容器充放电 */
  capacitor: (kv) => {
    const V = kvLookup(kv, ["V", "V0", "E"], 10);
    const R = kvLookup(kv, ["R"], 5);
    const Cval = kvLookup(kv, ["C", "c"], 1);
    const tau = R * Cval;
    const tMax = Math.ceil(tau * 5 * 10) / 10;
    const Imax = V / R;
    return {
      expressions: [
        makeSlider("V", "V", V, { min: 1, max: 24, step: 1 }),
        makeSlider("R", "R", R, { min: 1, max: 20, step: 1 }),
        makeSlider("C", "C", Cval, { min: 0.5, max: 5, step: 0.5 }),
        { id: "t", latex: "t=0", sliderBounds: { min: 0, max: tMax, step: 0.05 }, playing: true },
        { id: "tau_def", latex: "\\tau=RC", hidden: true },
        // Capacitor voltage during charging: Vc = V(1 - e^(-t/RC))
        { id: "vc_graph", latex: "y=V\\left(1-e^{-\\frac{t}{RC}}\\right)", color: C.RED },
        // Current during charging: I = (V/R)e^(-t/RC)
        { id: "i_graph", latex: "y=\\frac{V}{R}e^{-\\frac{t}{RC}}", color: C.BLUE, lineStyle: "DASHED" },
        // Source voltage line
        { id: "v_source", latex: "y=V", color: C.GREEN, lineStyle: "DASHED" },
        // Tau marker
        { id: "tau_marker", latex: "(RC,\\ 0)", color: C.PURPLE, pointStyle: "CROSS", label: "\\tau", showLabel: true },
        { id: "tau_63", latex: `(RC,\\ ${V * 0.632})`, color: C.RED, pointStyle: "CROSS", label: "63.2\\%", showLabel: true },
        // Energy stored
        { id: "energy_def", latex: "E=\\frac{1}{2}CV_{c}^{2}=\\frac{CV^{2}}{2}\\left(1-e^{-\\frac{t}{RC}}\\right)^{2}", hidden: true },
        // Labels
        { id: "vc_label", latex: `(-0.5,\\ ${V})`, color: C.RED, label: "V_{C}", showLabel: true },
        { id: "i_label", latex: `(-0.5,\\ ${Imax})`, color: C.BLUE, label: "I", showLabel: true },
        { id: "v_label", latex: `(${tMax * 0.8},\\ ${V * 1.05})`, color: C.GREEN, label: "V_{source}", showLabel: true },
      ],
      viewport: { left: -1, right: tMax * 1.1, bottom: -0.5, top: V * 1.3 },
    };
  },
};
