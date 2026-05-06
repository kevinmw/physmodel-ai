"use client";

import { useCallback } from "react";

interface PhysicsAnalysis {
  ocrText: string;
  concepts: string[];
  knownValues: Record<string, number>;
  forces: string[];
  physicsType: string;
  ggbCommands: string[];
  description: string;
}

interface ExampleProblem {
  title: string;
  icon: string;
  physicsType: string;
  analysis: PhysicsAnalysis;
}

const EXAMPLE_PROBLEMS: ExampleProblem[] = [
  {
    title: "抛体运动",
    icon: "🎯",
    physicsType: "projectile_motion",
    analysis: {
      ocrText: "一物体以初速度v0=20m/s，与水平方向成45°角抛出，求运动轨迹。",
      concepts: ["抛体运动", "运动分解", "匀变速运动"],
      knownValues: { v0: 20, theta: 45, g: 9.8 },
      forces: ["重力"],
      physicsType: "projectile_motion",
      ggbCommands: [
        "v0 = Slider(1, 50, 1)",
        "theta = Slider(5, 85, 5)",
        "t = Slider(0, 10, 0.1)",
        "P = (v0*cos(theta)*t, v0*sin(theta)*t - 0.5*9.8*t^2)",
        "Curve(v0*cos(theta)*t, v0*sin(theta)*t - 0.5*9.8*t^2, t, 0, 10)",
      ],
      description: "物体以初速度v0斜抛，分解为水平和竖直方向的运动",
    },
  },
  {
    title: "单摆运动",
    icon: "🔄",
    physicsType: "pendulum",
    analysis: {
      ocrText: "一单摆摆长L=2m，最大偏角30°，求摆动过程。",
      concepts: ["单摆", "简谐运动", "周期"],
      knownValues: { L: 2, alpha0: 30, g: 9.8 },
      forces: ["重力", "绳的拉力"],
      physicsType: "pendulum",
      ggbCommands: [
        "L = Slider(1, 5, 0.1)",
        "alpha0 = Slider(10, 60, 5)",
        "t = Slider(0, 10, 0.1)",
        "P = (L*sin(alpha0*cos(1.5*t)), -L*cos(alpha0*cos(1.5*t)))",
        "Curve(L*sin(alpha0*cos(1.5*t)), -L*cos(alpha0*cos(1.5*t)), t, 0, 10)",
      ],
      description: "单摆在重力作用下做简谐运动",
    },
  },
  {
    title: "自由落体",
    icon: "⬇️",
    physicsType: "free_fall",
    analysis: {
      ocrText: "一物体从h=45m高处自由下落，求下落过程。",
      concepts: ["自由落体", "匀加速运动", "重力加速度"],
      knownValues: { h: 45, g: 9.8 },
      forces: ["重力"],
      physicsType: "free_fall",
      ggbCommands: [
        "h = Slider(10, 100, 5)",
        "t = Slider(0, 5, 0.1)",
        "P = (0, h - 0.5*9.8*t^2)",
        "Curve(0.5*9.8*t^2, h - 0.5*9.8*t^2, t, 0, sqrt(2*h/9.8))",
      ],
      description: "物体仅在重力作用下从静止开始自由下落",
    },
  },
  {
    title: "斜面滑块",
    icon: "📐",
    physicsType: "inclined_plane",
    analysis: {
      ocrText: "一滑块从倾角30°的斜面顶端由静止下滑，摩擦系数0.2，求运动过程。",
      concepts: ["斜面", "摩擦力", "牛顿第二定律"],
      knownValues: { angle: 30, mu: 0.2, g: 9.8 },
      forces: ["重力", "支持力", "摩擦力"],
      physicsType: "inclined_plane",
      ggbCommands: [
        "angle = Slider(10, 60, 5)",
        "mu = Slider(0, 1, 0.05)",
        "t = Slider(0, 10, 0.1)",
        "a = 9.8*(sin(angle) - mu*cos(angle))",
        "P = (0.5*a*t^2*cos(angle), 5 - 0.5*a*t^2*sin(angle))",
        "Curve(0.5*a*t^2*cos(angle), 5 - 0.5*a*t^2*sin(angle), t, 0, 10)",
      ],
      description: "滑块在斜面上受重力、支持力和摩擦力作用下滑",
    },
  },
  {
    title: "匀速圆周运动",
    icon: "⭕",
    physicsType: "circular_motion",
    analysis: {
      ocrText: "一物体做半径r=3m的匀速圆周运动，角速度ω=2rad/s，求运动轨迹。",
      concepts: ["圆周运动", "向心力", "角速度"],
      knownValues: { r: 3, omega: 2 },
      forces: ["向心力"],
      physicsType: "circular_motion",
      ggbCommands: [
        "r = Slider(1, 5, 0.1)",
        "omega = Slider(0.5, 5, 0.5)",
        "t = Slider(0, 10, 0.1)",
        "P = (r*cos(omega*t), r*sin(omega*t))",
        "C = Circle((0,0), r)",
      ],
      description: "物体在向心力作用下做匀速圆周运动",
    },
  },
  {
    title: "弹簧振子",
    icon: "〰️",
    physicsType: "spring",
    analysis: {
      ocrText: "一弹簧振子劲度系数k=50N/m，质量m=2kg，振幅A=0.1m，求振动过程。",
      concepts: ["弹簧振子", "简谐运动", "胡克定律"],
      knownValues: { k: 50, m: 2, A: 0.1 },
      forces: ["弹力", "重力"],
      physicsType: "spring",
      ggbCommands: [
        "amp = Slider(0.5, 3, 0.1)",
        "omega = Slider(0.5, 5, 0.5)",
        "t = Slider(0, 10, 0.1)",
        "P = (amp*sin(omega*t), 0)",
        "Curve(t, amp*sin(omega*t), t, 0, 10)",
      ],
      description: "弹簧振子在弹力作用下做简谐运动",
    },
  },
  {
    title: "竖直上抛",
    icon: "⬆️",
    physicsType: "vertical_throw",
    analysis: {
      ocrText: "一物体以初速度v0=20m/s竖直上抛，求运动过程。",
      concepts: ["竖直上抛", "匀减速运动", "重力加速度"],
      knownValues: { v0: 20, g: 9.8 },
      forces: ["重力"],
      physicsType: "vertical_throw",
      ggbCommands: [
        "v0 = Slider(5, 40, 1)",
        "t = Slider(0, 10, 0.1)",
        "P = (0, v0*t - 0.5*9.8*t^2)",
        "Curve(t, v0*t - 0.5*9.8*t^2, t, 0, 2*v0/9.8)",
      ],
      description: "物体以初速度v0竖直上抛，先减速上升再加速下落",
    },
  },
  {
    title: "平抛运动",
    icon: "↗️",
    physicsType: "horizontal_throw",
    analysis: {
      ocrText: "一物体从h=20m高处以v0=10m/s水平抛出，求运动轨迹。",
      concepts: ["平抛运动", "运动的合成与分解", "匀速直线运动与自由落体"],
      knownValues: { v0: 10, h: 20, g: 9.8 },
      forces: ["重力"],
      physicsType: "horizontal_throw",
      ggbCommands: [
        "v0 = Slider(1, 30, 1)",
        "h = Slider(5, 50, 5)",
        "t = Slider(0, 5, 0.1)",
        "P = (v0*t, h - 0.5*9.8*t^2)",
        "Curve(v0*t, h - 0.5*9.8*t^2, t, 0, sqrt(2*h/9.8))",
      ],
      description: "物体从高处水平抛出，水平匀速+竖直自由落体的合运动",
    },
  },
  {
    title: "弹性碰撞",
    icon: "💥",
    physicsType: "elastic_collision",
    analysis: {
      ocrText: "质量m1=2kg的小球以v1=5m/s与静止的m2=3kg小球发生弹性碰撞，求碰撞前后运动。",
      concepts: ["弹性碰撞", "动量守恒", "能量守恒"],
      knownValues: { m1: 2, m2: 3, v1: 5, v2: 0 },
      forces: ["碰撞力"],
      physicsType: "elastic_collision",
      ggbCommands: [
        "m1 = Slider(1, 10, 0.5)",
        "m2 = Slider(1, 10, 0.5)",
        "v1 = Slider(1, 10, 0.5)",
        "t = Slider(0, 10, 0.1)",
        "v1f = (m1-m2)/(m1+m2)*v1",
        "v2f = 2*m1/(m1+m2)*v1",
        "P = (If(t<4, -5+v1*t, -5+v1*4+v1f*(t-4)), 0)",
        "Q = (If(t<4, 5, 5+v2f*(t-4)), 0)",
      ],
      description: "两球弹性碰撞，动量和动能均守恒",
    },
  },
  {
    title: "带电粒子在磁场中",
    icon: "🧲",
    physicsType: "magnetic_field",
    analysis: {
      ocrText: "一带电粒子质量m=1kg，电荷量q=1C，以v=5m/s垂直进入B=2T的匀强磁场，求运动轨迹。",
      concepts: ["洛伦兹力", "圆周运动", "带电粒子在磁场中运动"],
      knownValues: { m: 1, q: 1, v: 5, B: 2 },
      forces: ["洛伦兹力"],
      physicsType: "magnetic_field",
      ggbCommands: [
        "v0 = Slider(1, 10, 0.5)",
        "B = Slider(0.5, 5, 0.5)",
        "r = v0/B",
        "t = Slider(0, 10, 0.1)",
        "P = (r*sin(v0/r*t), r-r*cos(v0/r*t))",
        "C = Circle((0, r), r)",
      ],
      description: "带电粒子在匀强磁场中受洛伦兹力做匀速圆周运动",
    },
  },
  {
    title: "波的叠加",
    icon: "🌊",
    physicsType: "wave_superposition",
    analysis: {
      ocrText: "两列波y1=2sin(2x)和y2=2sin(3x)在某区域叠加，求合成波形。",
      concepts: ["波的叠加", "干涉", "波的合成"],
      knownValues: { A1: 2, A2: 2, k1: 2, k2: 3 },
      forces: [],
      physicsType: "wave_superposition",
      ggbCommands: [
        "A1 = Slider(0.5, 5, 0.5)",
        "A2 = Slider(0.5, 5, 0.5)",
        "t = Slider(0, 10, 0.1)",
        "f1 = Slider(0.5, 5, 0.5)",
        "f2 = Slider(0.5, 5, 0.5)",
        "Curve(x, A1*sin(f1*x - t) + A2*sin(f2*x - t), x, -10, 10)",
        "Curve(x, A1*sin(f1*x - t), x, -10, 10)",
        "Curve(x, A2*sin(f2*x - t), x, -10, 10)",
      ],
      description: "两列波的叠加，红线为合成波，展示干涉现象",
    },
  },
  {
    title: "能量守恒(过山车)",
    icon: "🎢",
    physicsType: "energy_conservation",
    analysis: {
      ocrText: "一物体从h=10m高处沿光滑曲面滑下，求各位置的速率。",
      concepts: ["机械能守恒", "动能", "势能"],
      knownValues: { h: 10, g: 9.8, m: 1 },
      forces: ["重力", "支持力"],
      physicsType: "energy_conservation",
      ggbCommands: [
        "h = Slider(2, 15, 1)",
        "t = Slider(0, 5, 0.1)",
        "P = (0, If(h - 0.5*9.8*t^2>0, h - 0.5*9.8*t^2, 0))",
        "Curve(t, If(h - 0.5*9.8*t^2>0, h - 0.5*9.8*t^2, 0), t, 0, 5)",
      ],
      description: "物体沿光滑曲面下滑，动能和势能相互转化，总机械能守恒",
    },
  },
  {
    title: "阻尼振动",
    icon: "📉",
    physicsType: "damped_oscillation",
    analysis: {
      ocrText: "一弹簧振子做阻尼振动，振幅逐渐衰减，求振动图像。",
      concepts: ["阻尼振动", "振幅衰减", "包络线"],
      knownValues: { A: 3, b: 0.3, omega: 3 },
      forces: ["弹力", "阻力"],
      physicsType: "damped_oscillation",
      ggbCommands: [
        "A = Slider(1, 5, 0.1)",
        "b = Slider(0.1, 2, 0.1)",
        "omega = Slider(0.5, 5, 0.5)",
        "t = Slider(0, 10, 0.1)",
        "P = (t, A*exp(-b*t)*sin(omega*t))",
        "Curve(t, A*exp(-b*t)*sin(omega*t), t, 0, 10)",
        "Curve(t, A*exp(-b*t), t, 0, 10)",
        "Curve(t, -A*exp(-b*t), t, 0, 10)",
      ],
      description: "阻尼振动：振幅随时间指数衰减，包络线为e^(-bt)",
    },
  },
  {
    title: "匀变速直线运动",
    icon: "📊",
    physicsType: "uniform_acceleration",
    analysis: {
      ocrText: "一物体初速度v0=5m/s，加速度a=2m/s²，求v-t和s-t图像。",
      concepts: ["匀变速直线运动", "v-t图像", "s-t图像"],
      knownValues: { v0: 5, a: 2 },
      forces: ["恒力"],
      physicsType: "uniform_acceleration",
      ggbCommands: [
        "v0 = Slider(0, 20, 1)",
        "a = Slider(-5, 5, 0.5)",
        "t = Slider(0, 10, 0.1)",
        "P = (t, v0 + a*t)",
        "Curve(t, v0 + a*t, t, 0, 10)",
        "Curve(t, v0*t + 0.5*a*t^2, t, 0, 10)",
      ],
      description: "匀变速直线运动的v-t图像（直线）和s-t图像（抛物线）",
    },
  },
  {
    title: "双星系统",
    icon: "⭐",
    physicsType: "binary_star",
    analysis: {
      ocrText: "两颗恒星组成双星系统，质量分别为m1和m2，间距为d，求运动轨迹。",
      concepts: ["双星系统", "万有引力", "质心"],
      knownValues: { m1: 3, m2: 5, d: 6 },
      forces: ["万有引力"],
      physicsType: "binary_star",
      ggbCommands: [
        "m1 = Slider(1, 10, 0.5)",
        "m2 = Slider(1, 10, 0.5)",
        "d = Slider(2, 10, 0.5)",
        "t = Slider(0, 10, 0.1)",
        "r1 = m2/(m1+m2)*d",
        "r2 = m1/(m1+m2)*d",
        "P = (r1*cos(t), r1*sin(t))",
        "Q = (-r2*cos(t), -r2*sin(t))",
        "C1 = Circle((0,0), r1)",
        "C2 = Circle((0,0), r2)",
      ],
      description: "双星绕公共质心做圆周运动，质量越大离质心越近",
    },
  },
  {
    title: "电场偏转",
    icon: "⚡",
    physicsType: "electric_deflection",
    analysis: {
      ocrText: "一带电粒子以v0垂直进入匀强电场E，求偏转轨迹。",
      concepts: ["电场偏转", "类平抛运动", "电场力"],
      knownValues: { v0: 5, E: 3, q: 1, m: 1 },
      forces: ["电场力"],
      physicsType: "electric_deflection",
      ggbCommands: [
        "v0 = Slider(1, 10, 0.5)",
        "E = Slider(1, 10, 0.5)",
        "q = Slider(0.5, 5, 0.5)",
        "m = Slider(0.5, 5, 0.5)",
        "t = Slider(0, 10, 0.1)",
        "a = q*E/m",
        "P = (v0*t, 0.5*a*t^2)",
        "Curve(v0*t, 0.5*a*t^2, t, 0, 10)",
      ],
      description: "带电粒子在匀强电场中偏转，轨迹为抛物线",
    },
  },
  {
    title: "受迫振动/共振",
    icon: "📢",
    physicsType: "forced_oscillation",
    analysis: {
      ocrText: "一振动系统的固有频率f0=2Hz，受周期性驱动力作用，频率f可调，求稳态振幅。",
      concepts: ["受迫振动", "共振", "固有频率"],
      knownValues: { f0: 2, f: 2, A0: 2, gamma: 0.5 },
      forces: ["驱动力", "回复力", "阻力"],
      physicsType: "forced_oscillation",
      ggbCommands: [
        "f0 = Slider(0.5, 5, 0.5)",
        "f = Slider(0.5, 5, 0.5)",
        "A0 = Slider(0.5, 3, 0.5)",
        "gamma = Slider(0.1, 2, 0.1)",
        "t = Slider(0, 10, 0.1)",
        "A = A0/sqrt((f0^2-f^2)^2 + (gamma*f)^2)",
        "P = (t, A*sin(f*t))",
        "Curve(t, A*sin(f*t), t, 0, 10)",
      ],
      description: "驱动力频率接近固有频率时振幅急剧增大，产生共振",
    },
  },
  {
    title: "李萨如图形",
    icon: "🔮",
    physicsType: "lissajous",
    analysis: {
      ocrText: "两个相互垂直的简谐运动x=3sin(2t), y=3sin(3t)，求合运动轨迹。",
      concepts: ["简谐运动合成", "李萨如图形", "频率比"],
      knownValues: { Ax: 3, Ay: 3, fx: 2, fy: 3 },
      forces: [],
      physicsType: "lissajous",
      ggbCommands: [
        "Ax = Slider(1, 5, 0.5)",
        "Ay = Slider(1, 5, 0.5)",
        "fx = Slider(1, 5, 1)",
        "fy = Slider(1, 5, 1)",
        "t = Slider(0, 10, 0.1)",
        "P = (Ax*sin(fx*t), Ay*sin(fy*t))",
        "Curve(Ax*sin(fx*t), Ay*sin(fy*t), t, 0, 10)",
      ],
      description: "两个垂直方向简谐运动的合成，频率比决定图形形状",
    },
  },
];

interface ExampleProblemsProps {
  onSelect: (example: { analysis: PhysicsAnalysis }) => void;
}

export default function ExampleProblems({ onSelect }: ExampleProblemsProps) {
  const handleSelect = useCallback(
    (example: ExampleProblem) => {
      onSelect({ analysis: example.analysis });
    },
    [onSelect]
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">📚 示例物理模型</h2>
      <p className="text-sm text-gray-500 mb-3">
        选择一个示例，快速预览动态物理模型效果
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {EXAMPLE_PROBLEMS.map((example) => (
          <button
            key={example.physicsType}
            onClick={() => handleSelect(example)}
            className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-left transition-all"
          >
            <div className="text-2xl mb-2">{example.icon}</div>
            <div className="font-medium text-sm">{example.title}</div>
            <div className="text-xs text-gray-500 mt-1">{example.analysis.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
