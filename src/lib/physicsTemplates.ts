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
        "P = (0, h - 0.5*9.8*t^2)",
        `Curve(0.5*9.8*t^2, h - 0.5*9.8*t^2, t, 0, ${tMax})`,
      ];
    },
  },

  inclined_plane: {
    type: "inclined_plane",
    commands: () => [
      "angle = Slider(10, 60, 5)",
      "mu = Slider(0, 1, 0.05)",
      "t = Slider(0, 10, 0.1)",
      "a = 9.8*(sin(angle) - mu*cos(angle))",
      "P = (0.5*a*t^2*cos(angle), 5 - 0.5*a*t^2*sin(angle))",
      "Curve(0.5*a*t^2*cos(angle), 5 - 0.5*a*t^2*sin(angle), t, 0, 10)",
    ],
  },

  circular_motion: {
    type: "circular_motion",
    commands: () => [
      "r = Slider(1, 5, 0.1)",
      "omega = Slider(0.5, 5, 0.5)",
      "t = Slider(0, 10, 0.1)",
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
      "P = (amp*sin(omega*t), 0)",
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
      "v1f = (m1-m2)/(m1+m2)*v1",
      "v2f = 2*m1/(m1+m2)*v1",
      "P = (If(t<4, -5+v1*t, -5+v1*4+v1f*(t-4)), 0)",
      "Q = (If(t<4, 5, 5+v2f*(t-4)), 0)",
    ],
  },

  magnetic_field: {
    type: "magnetic_field",
    commands: () => [
      "v0 = Slider(1, 10, 0.5)",
      "B = Slider(0.5, 5, 0.5)",
      "r = v0/B",
      "t = Slider(0, 10, 0.1)",
      "P = (r*sin(v0/r*t), r-r*cos(v0/r*t))",
      "C = Circle((0, r), r)",
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
      "P = (0, If(h - 0.5*9.8*t^2>0, h - 0.5*9.8*t^2, 0))",
      "Curve(t, If(h - 0.5*9.8*t^2>0, h - 0.5*9.8*t^2, 0), t, 0, 5)",
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
