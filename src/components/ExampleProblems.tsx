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
        "A = (0, 0)",
        "Segment(A, P)",
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
        "bob = (L*sin(alpha0*cos(1.5*t)), -L*cos(alpha0*cos(1.5*t)))",
        "pivot = (0, 0)",
        "Segment(pivot, bob)",
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
        "ball = (0, h - 0.5*9.8*t^2)",
        "start = (0, h)",
        "ground = (0, 0)",
        "Segment(start, ball)",
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
        "block = (0.5*a*t^2*cos(angle), 5 - 0.5*a*t^2*sin(angle))",
        "top = (0, 5)",
        "Segment(top, (5*cos(angle), 5 - 5*sin(angle)))",
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
        "A = Slider(0.5, 3, 0.1)",
        "omega = Slider(0.5, 5, 0.5)",
        "t = Slider(0, 10, 0.1)",
        "ball = (A*sin(omega*t), 0)",
        "wall = (-3, 0)",
        "Segment(wall, ball)",
      ],
      description: "弹簧振子在弹力作用下做简谐运动",
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
