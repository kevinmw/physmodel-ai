type CommandGenerator = (kv: Record<string, number>) => string[];

interface PhysicsTemplate {
  type: string;
  commands: CommandGenerator;
}

const TEMPLATES: Record<string, PhysicsTemplate> = {
  projectile_motion: {
    type: "projectile_motion",
    commands: () => [
      "v0 = Slider(1, 50, 1)",
      "theta = Slider(5, 85, 5)",
      "t = Slider(0, 10, 0.1)",
      "O = (0, 0)",
      "P = (v0*cos(theta)*t, v0*sin(theta)*t - 0.5*9.8*t^2)",
      "Curve(v0*cos(theta)*t, v0*sin(theta)*t - 0.5*9.8*t^2, t, 0, 10)",
    ],
  },

  pendulum: {
    type: "pendulum",
    commands: () => [
      "L = Slider(1, 5, 0.1)",
      "alpha0 = Slider(10, 60, 5)",
      "t = Slider(0, 10, 0.1)",
      "O = (0, 0)",
      "P = (L*sin(alpha0*cos(1.5*t)), -L*cos(alpha0*cos(1.5*t)))",
      "Curve(L*sin(alpha0*cos(1.5*t)), -L*cos(alpha0*cos(1.5*t)), t, 0, 10)",
    ],
  },

  free_fall: {
    type: "free_fall",
    commands: (kv) => {
      const h = kv.h || 45;
      const tMax = Math.round(Math.sqrt(2 * h / 9.8) * 10) / 10;
      return [
        "h = Slider(10, 100, 5)",
        "t = Slider(0, 5, 0.1)",
        "A = (0, h)",
        "P = (0, h - 0.5*9.8*t^2)",
        `Curve(t, h - 0.5*9.8*t^2, t, 0, ${tMax})`,
      ];
    },
  },

  inclined_plane: {
    type: "inclined_plane",
    commands: () => [
      "angle = Slider(10, 60, 5)",
      "mu = Slider(0, 1, 0.05)",
      "t = Slider(0, 10, 0.1)",
      "S = (0, 5)",
      "P = (0.5*9.8*(sin(angle)-mu*cos(angle))*t^2*cos(angle), 5 - 0.5*9.8*(sin(angle)-mu*cos(angle))*t^2*sin(angle))",
      "Curve(0.5*9.8*(sin(angle)-mu*cos(angle))*t^2*cos(angle), 5 - 0.5*9.8*(sin(angle)-mu*cos(angle))*t^2*sin(angle), t, 0, 10)",
    ],
  },

  circular_motion: {
    type: "circular_motion",
    commands: () => [
      "r = Slider(1, 5, 0.1)",
      "omega = Slider(0.5, 5, 0.5)",
      "t = Slider(0, 10, 0.1)",
      "O = (0, 0)",
      "P = (r*cos(omega*t), r*sin(omega*t))",
      "C = Circle((0,0), r)",
    ],
  },

  spring: {
    type: "spring",
    commands: () => [
      "amp = Slider(0.5, 3, 0.1)",
      "omega = Slider(0.5, 5, 0.5)",
      "t = Slider(0, 10, 0.1)",
      "O = (0, 0)",
      "P = (0, amp*sin(omega*t))",
      "Curve(t, amp*sin(omega*t), t, 0, 10)",
    ],
  },

  vertical_throw: {
    type: "vertical_throw",
    commands: (kv) => {
      const v0 = kv.v0 || 20;
      const tMax = Math.round(2 * v0 / 9.8 * 10) / 10;
      return [
        "v0 = Slider(5, 40, 1)",
        "t = Slider(0, 10, 0.1)",
        "O = (0, 0)",
        "P = (0, v0*t - 0.5*9.8*t^2)",
        `Curve(t, v0*t - 0.5*9.8*t^2, t, 0, ${tMax})`,
      ];
    },
  },

  horizontal_throw: {
    type: "horizontal_throw",
    commands: (kv) => {
      const h = kv.h || 20;
      const tMax = Math.round(Math.sqrt(2 * h / 9.8) * 10) / 10;
      return [
        "v0 = Slider(1, 30, 1)",
        "h = Slider(5, 50, 5)",
        "t = Slider(0, 5, 0.1)",
        "A = (0, h)",
        "P = (v0*t, h - 0.5*9.8*t^2)",
        `Curve(v0*t, h - 0.5*9.8*t^2, t, 0, ${tMax})`,
      ];
    },
  },

  elastic_collision: {
    type: "elastic_collision",
    commands: () => [
      "m1 = Slider(1, 10, 0.5)",
      "m2 = Slider(1, 10, 0.5)",
      "v1 = Slider(1, 10, 0.5)",
      "t = Slider(0, 10, 0.1)",
      "P = (If(t<4, -5+v1*t, -5+v1*4+(m1-m2)/(m1+m2)*v1*(t-4)), 0)",
      "Q = (If(t<4, 5, 5+2*m1/(m1+m2)*v1*(t-4)), 0)",
    ],
  },

  magnetic_field: {
    type: "magnetic_field",
    commands: () => [
      "v0 = Slider(1, 10, 0.5)",
      "B = Slider(0.5, 5, 0.5)",
      "t = Slider(0, 10, 0.1)",
      "O = (0, 0)",
      "P = (v0/B*sin(B*t), v0/B-v0/B*cos(B*t))",
      "C = Circle((0, v0/B), v0/B)",
    ],
  },

  wave_superposition: {
    type: "wave_superposition",
    commands: () => [
      "A1 = Slider(0.5, 5, 0.5)",
      "A2 = Slider(0.5, 5, 0.5)",
      "t = Slider(0, 10, 0.1)",
      "f1 = Slider(0.5, 5, 0.5)",
      "f2 = Slider(0.5, 5, 0.5)",
      "Curve(x, A1*sin(f1*x - t) + A2*sin(f2*x - t), x, -10, 10)",
      "Curve(x, A1*sin(f1*x - t), x, -10, 10)",
      "Curve(x, A2*sin(f2*x - t), x, -10, 10)",
    ],
  },

  energy_conservation: {
    type: "energy_conservation",
    commands: () => [
      "h = Slider(2, 15, 1)",
      "t = Slider(0, 5, 0.1)",
      "G = (0, 0)",
      "P = (0, If(h - 0.5*9.8*t^2>0, h - 0.5*9.8*t^2, 0))",
      "Curve(t, If(h - 0.5*9.8*t^2>0, h - 0.5*9.8*t^2, 0), t, 0, 5)",
    ],
  },

  damped_oscillation: {
    type: "damped_oscillation",
    commands: () => [
      "A = Slider(1, 5, 0.1)",
      "b = Slider(0.1, 2, 0.1)",
      "omega = Slider(0.5, 5, 0.5)",
      "t = Slider(0, 10, 0.1)",
      "P = (t, A*exp(-b*t)*sin(omega*t))",
      "Curve(t, A*exp(-b*t)*sin(omega*t), t, 0, 10)",
      "Curve(t, A*exp(-b*t), t, 0, 10)",
      "Curve(t, -A*exp(-b*t), t, 0, 10)",
    ],
  },

  uniform_acceleration: {
    type: "uniform_acceleration",
    commands: () => [
      "v0 = Slider(0, 20, 1)",
      "a = Slider(-5, 5, 0.5)",
      "t = Slider(0, 10, 0.1)",
      "P = (t, v0 + a*t)",
      "Curve(t, v0 + a*t, t, 0, 10)",
    ],
  },

  binary_star: {
    type: "binary_star",
    commands: () => [
      "m1 = Slider(1, 10, 0.5)",
      "m2 = Slider(1, 10, 0.5)",
      "d = Slider(2, 10, 0.5)",
      "t = Slider(0, 10, 0.1)",
      "O = (0, 0)",
      "P = (m2/(m1+m2)*d*cos(t), m2/(m1+m2)*d*sin(t))",
      "Q = (-m1/(m1+m2)*d*cos(t), -m1/(m1+m2)*d*sin(t))",
      "C1 = Circle((0,0), m2/(m1+m2)*d)",
      "C2 = Circle((0,0), m1/(m1+m2)*d)",
    ],
  },

  electric_deflection: {
    type: "electric_deflection",
    commands: () => [
      "v0 = Slider(1, 10, 0.5)",
      "E = Slider(1, 10, 0.5)",
      "q = Slider(0.5, 5, 0.5)",
      "m = Slider(0.5, 5, 0.5)",
      "t = Slider(0, 10, 0.1)",
      "O = (0, 0)",
      "P = (v0*t, 0.5*q*E/m*t^2)",
      "Curve(v0*t, 0.5*q*E/m*t^2, t, 0, 10)",
    ],
  },

  forced_oscillation: {
    type: "forced_oscillation",
    commands: () => [
      "f0 = Slider(0.5, 5, 0.5)",
      "f = Slider(0.5, 5, 0.5)",
      "A0 = Slider(0.5, 3, 0.5)",
      "gamma = Slider(0.1, 2, 0.1)",
      "t = Slider(0, 10, 0.1)",
      "P = (t, A0/sqrt((f0^2-f^2)^2 + (gamma*f)^2)*sin(f*t))",
      "Curve(t, A0/sqrt((f0^2-f^2)^2 + (gamma*f)^2)*sin(f*t), t, 0, 10)",
    ],
  },

  lissajous: {
    type: "lissajous",
    commands: () => [
      "Ax = Slider(1, 5, 0.5)",
      "Ay = Slider(1, 5, 0.5)",
      "fx = Slider(1, 5, 1)",
      "fy = Slider(1, 5, 1)",
      "t = Slider(0, 10, 0.1)",
      "P = (Ax*sin(fx*t), Ay*sin(fy*t))",
      "Curve(Ax*sin(fx*t), Ay*sin(fy*t), t, 0, 10)",
    ],
  },
};

export function getTemplateCommands(
  physicsType: string,
  knownValues: Record<string, number>
): string[] | null {
  const template = TEMPLATES[physicsType];
  if (!template) return null;
  return template.commands(knownValues || {});
}

export function isSupportedType(physicsType: string): boolean {
  return physicsType in TEMPLATES;
}

export const SUPPORTED_TYPES = Object.keys(TEMPLATES);
