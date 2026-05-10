"use client";

import { useCallback, useState } from "react";
import { getDesmosExpressions } from "@/lib/desmosTemplates";
import type { DesmosExpr, Viewport3D } from "@/lib/desmosTemplates";

interface PhysicsAnalysis {
  ocrText: string;
  concepts: string[];
  knownValues: Record<string, number>;
  forces: string[];
  physicsType: string;
  desmosExprs: DesmosExpr[];
  viewport?: { left: number; right: number; top: number; bottom: number };
  viewport3d?: Viewport3D;
  dimension?: '2d' | '3d';
  description: string;
}

interface ExampleProblem {
  title: string;
  icon: string;
  category: string;
  physicsType: string;
  analysis: Omit<PhysicsAnalysis, "desmosExprs"> & { knownValues: Record<string, number> };
}

const CATEGORIES = [
  { key: "all", label: "全部" },
  { key: "kinematics", label: "运动学" },
  { key: "dynamics", label: "力学" },
  { key: "oscillations", label: "振动与波" },
  { key: "em", label: "电磁学" },
  { key: "optics", label: "光学" },
];

const EXAMPLE_PROBLEMS: ExampleProblem[] = [
  // === 运动学 ===
  {
    title: "抛体运动",
    icon: "🎯",
    category: "kinematics",
    physicsType: "projectile_motion",
    analysis: {
      ocrText: "一物体以初速度v0=20m/s，与水平方向成45°角抛出，求运动轨迹。",
      concepts: ["抛体运动", "运动分解", "匀变速运动"],
      knownValues: { v0: 20, theta: 45, g: 9.8 },
      forces: ["重力"],
      physicsType: "projectile_motion",
      description: "物体以初速度v0斜抛，分解为水平和竖直方向的运动",
    },
  },
  {
    title: "自由落体",
    icon: "⬇️",
    category: "kinematics",
    physicsType: "free_fall",
    analysis: {
      ocrText: "一物体从h=45m高处自由下落，求下落过程。",
      concepts: ["自由落体", "匀加速运动", "重力加速度"],
      knownValues: { h: 45, g: 9.8 },
      forces: ["重力"],
      physicsType: "free_fall",
      description: "物体仅在重力作用下从静止开始自由下落",
    },
  },
  {
    title: "竖直上抛",
    icon: "⬆️",
    category: "kinematics",
    physicsType: "vertical_throw",
    analysis: {
      ocrText: "一物体以初速度v0=20m/s竖直上抛，求运动过程。",
      concepts: ["竖直上抛", "匀减速运动", "重力加速度"],
      knownValues: { v0: 20, g: 9.8 },
      forces: ["重力"],
      physicsType: "vertical_throw",
      description: "物体以初速度v0竖直上抛，先减速上升再加速下落",
    },
  },
  {
    title: "平抛运动",
    icon: "↗️",
    category: "kinematics",
    physicsType: "horizontal_throw",
    analysis: {
      ocrText: "一物体从h=20m高处以v0=10m/s水平抛出，求运动轨迹。",
      concepts: ["平抛运动", "运动的合成与分解", "匀速直线运动与自由落体"],
      knownValues: { v0: 10, h: 20, g: 9.8 },
      forces: ["重力"],
      physicsType: "horizontal_throw",
      description: "物体从高处水平抛出，水平匀速+竖直自由落体的合运动",
    },
  },
  {
    title: "匀变速直线运动",
    icon: "📊",
    category: "kinematics",
    physicsType: "uniform_acceleration",
    analysis: {
      ocrText: "一物体初速度v0=5m/s，加速度a=2m/s²，求v-t和s-t图像。",
      concepts: ["匀变速直线运动", "v-t图像", "s-t图像"],
      knownValues: { v0: 5, a: 2 },
      forces: ["恒力"],
      physicsType: "uniform_acceleration",
      description: "匀变速直线运动的v-t图像（直线）和s-t图像（抛物线）",
    },
  },
  {
    title: "多段匀变速运动",
    icon: "📈",
    category: "kinematics",
    physicsType: "two_stage_motion",
    analysis: {
      ocrText: "汽车先以a1=3m/s²加速4s，再以a2=-2m/s²减速，求v-t图像。",
      concepts: ["多段运动", "v-t图像", "匀变速运动"],
      knownValues: { v0: 0, a1: 3, a2: -2, t1: 4 },
      forces: ["牵引力", "阻力"],
      physicsType: "two_stage_motion",
      description: "两段匀变速运动的v-t图像，展示加速度突变",
    },
  },
  {
    title: "相对运动",
    icon: "↔️",
    category: "kinematics",
    physicsType: "relative_motion",
    analysis: {
      ocrText: "两车沿同方向运动，v1=10m/s，v2=6m/s，初始间距d0=20m。",
      concepts: ["相对运动", "位移关系"],
      knownValues: { v1: 10, v2: 6, d0: 20 },
      forces: [],
      physicsType: "relative_motion",
      description: "两物体相对运动，观察距离随时间的变化",
    },
  },
  {
    title: "追及相遇",
    icon: "🚗",
    category: "kinematics",
    physicsType: "pursuit_problem",
    analysis: {
      ocrText: "A车以vA=8m/s匀速运动，前方d0=15m处B车以vB=5m/s匀速运动，求何时追上。",
      concepts: ["追及问题", "相对运动", "位移关系"],
      knownValues: { vA: 8, vB: 5, d0: 15 },
      forces: [],
      physicsType: "pursuit_problem",
      description: "两车追及问题：追上时刻取决于速度差和初始距离",
    },
  },
  // === 力学 ===
  {
    title: "斜面滑块",
    icon: "📐",
    category: "dynamics",
    physicsType: "inclined_plane",
    analysis: {
      ocrText: "一滑块从倾角30°的斜面顶端由静止下滑，摩擦系数0.2，求运动过程。",
      concepts: ["斜面", "摩擦力", "牛顿第二定律"],
      knownValues: { angle: 30, mu: 0.2, g: 9.8 },
      forces: ["重力", "支持力", "摩擦力"],
      physicsType: "inclined_plane",
      description: "滑块在斜面上受重力、支持力和摩擦力作用下滑",
    },
  },
  {
    title: "匀速圆周运动",
    icon: "⭕",
    category: "dynamics",
    physicsType: "circular_motion",
    analysis: {
      ocrText: "一物体做半径r=3m的匀速圆周运动，角速度ω=2rad/s，求运动轨迹。",
      concepts: ["圆周运动", "向心力", "角速度"],
      knownValues: { r: 3, omega: 2 },
      forces: ["向心力"],
      physicsType: "circular_motion",
      description: "物体在向心力作用下做匀速圆周运动",
    },
  },
  {
    title: "竖直圆周运动",
    icon: "🎡",
    category: "dynamics",
    physicsType: "vertical_circular",
    analysis: {
      ocrText: "物体在竖直面内做半径r=3m的圆周运动，最低点速度v0=8m/s。",
      concepts: ["竖直圆周运动", "向心力", "临界速度"],
      knownValues: { r: 3, v0: 8, g: 9.8 },
      forces: ["重力", "弹力/支持力"],
      physicsType: "vertical_circular",
      description: "竖直面内圆周运动，重力和弹力合力提供向心力",
    },
  },
  {
    title: "弹性碰撞",
    icon: "💥",
    category: "dynamics",
    physicsType: "elastic_collision",
    analysis: {
      ocrText: "质量m1=2kg的小球以v1=5m/s与静止的m2=3kg小球发生弹性碰撞，求碰撞前后运动。",
      concepts: ["弹性碰撞", "动量守恒", "能量守恒"],
      knownValues: { m1: 2, m2: 3, v1: 5, v2: 0 },
      forces: ["碰撞力"],
      physicsType: "elastic_collision",
      description: "两球弹性碰撞，动量和动能均守恒",
    },
  },
  {
    title: "能量守恒(过山车)",
    icon: "🎢",
    category: "dynamics",
    physicsType: "energy_conservation",
    analysis: {
      ocrText: "一物体从h=10m高处沿光滑曲面滑下，求各位置的速率。",
      concepts: ["机械能守恒", "动能", "势能"],
      knownValues: { h: 10, g: 9.8, m: 1 },
      forces: ["重力", "支持力"],
      physicsType: "energy_conservation",
      description: "物体沿光滑曲面下滑，动能和势能相互转化，总机械能守恒",
    },
  },
  {
    title: "力的合成与分解",
    icon: "🔀",
    category: "dynamics",
    physicsType: "vector_addition",
    analysis: {
      ocrText: "两个力F1=5N方向30°，F2=4N方向120°，求合力。",
      concepts: ["力的合成", "平行四边形法则", "力的分解"],
      knownValues: { F1: 5, F2: 4, theta1: 30, theta2: 120 },
      forces: ["F1", "F2", "合力"],
      physicsType: "vector_addition",
      description: "两力合成：平行四边形法则求合力，可调角度和大小",
    },
  },
  {
    title: "阿特伍德机",
    icon: "🏗",
    category: "dynamics",
    physicsType: "atwood_machine",
    analysis: {
      ocrText: "阿特伍德机两端悬挂m1=3kg和m2=5kg的重物，求加速度和张力。",
      concepts: ["阿特伍德机", "牛顿第二定律", "连接体"],
      knownValues: { m1: 3, m2: 5, g: 9.8 },
      forces: ["重力", "绳的张力"],
      physicsType: "atwood_machine",
      description: "跨过滑轮的两物体，质量不同产生加速度",
    },
  },
  {
    title: "杠杆平衡",
    icon: "⚖",
    category: "dynamics",
    physicsType: "lever_balance",
    analysis: {
      ocrText: "杠杆左臂L1=3m挂F1=6N重物，右臂L2=4m挂F2=4N重物，判断是否平衡。",
      concepts: ["力矩", "杠杆平衡", "转动平衡条件"],
      knownValues: { F1: 6, F2: 4, L1: 3, L2: 4 },
      forces: ["F1", "F2"],
      physicsType: "lever_balance",
      description: "杠杆平衡条件：F1×L1 = F2×L2，可调力和力臂",
    },
  },
  {
    title: "连接体",
    icon: "🔗",
    category: "dynamics",
    physicsType: "connected_bodies",
    analysis: {
      ocrText: "两物块m1=2kg和m2=4kg用轻绳连接，水平拉力F=12N，摩擦系数μ=0.2。",
      concepts: ["连接体", "整体法与隔离法", "牛顿第二定律"],
      knownValues: { m1: 2, m2: 4, F: 12, mu: 0.2 },
      forces: ["拉力F", "摩擦力", "绳的张力"],
      physicsType: "connected_bodies",
      description: "两物块通过绳连接，整体加速度相同，隔离法求张力",
    },
  },
  {
    title: "斜面连接体",
    icon: "⛰",
    category: "dynamics",
    physicsType: "inclined_connected",
    analysis: {
      ocrText: "斜面倾角30°，m2=2kg在斜面上通过绳子跨过滑轮连接悬挂的m1=3kg。",
      concepts: ["斜面", "连接体", "滑轮"],
      knownValues: { m1: 3, m2: 2, angle: 30, mu: 0, g: 9.8 },
      forces: ["重力", "支持力", "张力"],
      physicsType: "inclined_connected",
      description: "斜面+滑轮+悬挂物的连接体问题",
    },
  },
  {
    title: "双星系统",
    icon: "⭐",
    category: "dynamics",
    physicsType: "binary_star",
    analysis: {
      ocrText: "两颗恒星组成双星系统，质量分别为m1和m2，间距为d，求运动轨迹。",
      concepts: ["双星系统", "万有引力", "质心"],
      knownValues: { m1: 3, m2: 5, d: 6 },
      forces: ["万有引力"],
      physicsType: "binary_star",
      description: "双星绕公共质心做圆周运动，质量越大离质心越近",
    },
  },
  // === 振动与波 ===
  {
    title: "单摆运动",
    icon: "🔄",
    category: "oscillations",
    physicsType: "pendulum",
    analysis: {
      ocrText: "一单摆摆长L=2m，最大偏角30°，求摆动过程。",
      concepts: ["单摆", "简谐运动", "周期"],
      knownValues: { L: 2, alpha0: 30, g: 9.8 },
      forces: ["重力", "绳的拉力"],
      physicsType: "pendulum",
      description: "单摆在重力作用下做简谐运动",
    },
  },
  {
    title: "弹簧振子",
    icon: "〰️",
    category: "oscillations",
    physicsType: "spring",
    analysis: {
      ocrText: "一弹簧振子劲度系数k=50N/m，质量m=2kg，振幅A=0.1m，求振动过程。",
      concepts: ["弹簧振子", "简谐运动", "胡克定律"],
      knownValues: { k: 50, m: 2, A: 0.1 },
      forces: ["弹力", "重力"],
      physicsType: "spring",
      description: "弹簧振子在弹力作用下做简谐运动",
    },
  },
  {
    title: "竖直弹簧振子",
    icon: "🔧",
    category: "oscillations",
    physicsType: "vertical_spring",
    analysis: {
      ocrText: "竖直弹簧劲度系数k=20N/m，挂质量m=2kg物体，振幅A=1.5m。",
      concepts: ["竖直弹簧", "简谐运动", "平衡位置"],
      knownValues: { k: 20, m: 2, A: 1.5, g: 9.8 },
      forces: ["重力", "弹力"],
      physicsType: "vertical_spring",
      description: "竖直弹簧振子：平衡位置下移mg/k，仍在做简谐运动",
    },
  },
  {
    title: "阻尼振动",
    icon: "📉",
    category: "oscillations",
    physicsType: "damped_oscillation",
    analysis: {
      ocrText: "一弹簧振子做阻尼振动，振幅逐渐衰减，求振动图像。",
      concepts: ["阻尼振动", "振幅衰减", "包络线"],
      knownValues: { A: 3, b: 0.3, omega: 3 },
      forces: ["弹力", "阻力"],
      physicsType: "damped_oscillation",
      description: "阻尼振动：振幅随时间指数衰减，包络线为e^(-bt)",
    },
  },
  {
    title: "受迫振动/共振",
    icon: "📢",
    category: "oscillations",
    physicsType: "forced_oscillation",
    analysis: {
      ocrText: "一振动系统的固有频率f0=2Hz，受周期性驱动力作用，频率f可调，求稳态振幅。",
      concepts: ["受迫振动", "共振", "固有频率"],
      knownValues: { f0: 2, f: 2, A0: 2, gamma: 0.5 },
      forces: ["驱动力", "回复力", "阻力"],
      physicsType: "forced_oscillation",
      description: "驱动力频率接近固有频率时振幅急剧增大，产生共振",
    },
  },
  {
    title: "波的叠加",
    icon: "🌊",
    category: "oscillations",
    physicsType: "wave_superposition",
    analysis: {
      ocrText: "两列波y1=2sin(2x)和y2=2sin(3x)在某区域叠加，求合成波形。",
      concepts: ["波的叠加", "干涉", "波的合成"],
      knownValues: { A1: 2, A2: 2, k1: 2, k2: 3 },
      forces: [],
      physicsType: "wave_superposition",
      description: "两列波的叠加，红线为合成波，展示干涉现象",
    },
  },
  {
    title: "李萨如图形",
    icon: "🔮",
    category: "oscillations",
    physicsType: "lissajous",
    analysis: {
      ocrText: "两个相互垂直的简谐运动x=3sin(2t), y=3sin(3t)，求合运动轨迹。",
      concepts: ["简谐运动合成", "李萨如图形", "频率比"],
      knownValues: { Ax: 3, Ay: 3, fx: 2, fy: 3 },
      forces: [],
      physicsType: "lissajous",
      description: "两个垂直方向简谐运动的合成，频率比决定图形形状",
    },
  },
  {
    title: "圆锥摆运动",
    icon: "🔻",
    category: "oscillations",
    physicsType: "conical_motion",
    analysis: {
      ocrText: "小球在圆锥漏斗内做匀速圆周运动，圆锥高度h=2m，锥角θ=45°，求运动轨迹。",
      concepts: ["圆锥摆", "匀速圆周运动", "向心力", "受力分析"],
      knownValues: { h: 2, theta: 45, g: 9.8 },
      forces: ["重力", "支持力", "向心力"],
      physicsType: "conical_motion",
      description: "小球在圆锥漏斗内做匀速圆周运动，3D立体场景",
    },
  },
  // === 电磁学 ===
  {
    title: "带电粒子在磁场中",
    icon: "🧲",
    category: "em",
    physicsType: "magnetic_field",
    analysis: {
      ocrText: "一带电粒子质量m=1kg，电荷量q=1C，以v=5m/s垂直进入B=2T的匀强磁场，求运动轨迹。",
      concepts: ["洛伦兹力", "圆周运动", "带电粒子在磁场中运动"],
      knownValues: { m: 1, q: 1, v: 5, B: 2 },
      forces: ["洛伦兹力"],
      physicsType: "magnetic_field",
      description: "带电粒子在匀强磁场中受洛伦兹力做匀速圆周运动",
    },
  },
  {
    title: "电场偏转",
    icon: "⚡",
    category: "em",
    physicsType: "electric_deflection",
    analysis: {
      ocrText: "一带电粒子以v0垂直进入匀强电场E，求偏转轨迹。",
      concepts: ["电场偏转", "类平抛运动", "电场力"],
      knownValues: { v0: 5, E: 3, q: 1, m: 1 },
      forces: ["电场力"],
      physicsType: "electric_deflection",
      description: "带电粒子在匀强电场中偏转，轨迹为抛物线",
    },
  },
  {
    title: "动生电动势",
    icon: "🔋",
    category: "em",
    physicsType: "motional_emf",
    analysis: {
      ocrText: "导体棒长L=2m在B=1T磁场中以v=3m/s运动，电阻R=5Ω，求感应电动势和电流。",
      concepts: ["动生电动势", "法拉第电磁感应", "感应电流"],
      knownValues: { B: 1, L: 2, v: 3, R: 5 },
      forces: ["安培力"],
      physicsType: "motional_emf",
      description: "导体棒在磁场中运动产生感应电动势 ε=BLv",
    },
  },
  {
    title: "电磁波",
    icon: "📡",
    category: "em",
    physicsType: "em_wave",
    analysis: {
      ocrText: "电磁波中E场和B场相互激发传播，振幅E0=3V/m，频率f=1Hz。",
      concepts: ["电磁波", "电场振荡", "磁场振荡"],
      knownValues: { E0: 3, f: 1 },
      forces: [],
      physicsType: "em_wave",
      description: "电磁波中E场和B场垂直振荡，同频率传播",
    },
  },
  // === 光学 ===
  {
    title: "凸透镜成像",
    icon: "🔍",
    category: "optics",
    physicsType: "thin_lens",
    analysis: {
      ocrText: "凸透镜焦距f=3cm，物体距透镜do=6cm，物高ho=2cm，求成像位置和大小。",
      concepts: ["薄透镜", "透镜成像公式", "光线追迹"],
      knownValues: { f: 3, d: 6, h: 2 },
      forces: [],
      physicsType: "thin_lens",
      description: "薄透镜成像：1/f=1/di+1/do，三条特征光线追迹",
    },
  },
  {
    title: "平面镜成像",
    icon: "🪞",
    category: "optics",
    physicsType: "plane_mirror",
    analysis: {
      ocrText: "物体高ho=2cm，距平面镜d=3cm，求像的位置和性质。",
      concepts: ["平面镜成像", "反射定律", "虚像"],
      knownValues: { h: 2, d: 3 },
      forces: [],
      physicsType: "plane_mirror",
      description: "平面镜成等大正立虚像，像距等于物距",
    },
  },
  {
    title: "双缝干涉",
    icon: "🌈",
    category: "optics",
    physicsType: "double_slit",
    analysis: {
      ocrText: "双缝间距d=4mm，屏距L=10m，波长λ=1单位，求干涉条纹强度分布。",
      concepts: ["双缝干涉", "光程差", "明暗条纹"],
      knownValues: { d: 4, L: 10, lambda: 1, I0: 3 },
      forces: [],
      physicsType: "double_slit",
      description: "双缝干涉：明纹条件d·sinθ=kλ，强度I∝cos²(πdy/λL)",
    },
  },
  // === 新增振动与波 ===
  {
    title: "驻波",
    icon: "🎸",
    category: "oscillations",
    physicsType: "standing_wave",
    analysis: {
      ocrText: "弦长L=4m上形成驻波，n=2个波腹，振幅A=2，求驻波振动。",
      concepts: ["驻波", "波节", "波腹", "驻波条件"],
      knownValues: { L: 4, n: 2, A: 2, f: 1 },
      forces: [],
      physicsType: "standing_wave",
      description: "驻波：两端固定弦上的驻波振动，波节和波腹清晰可见",
    },
  },
  {
    title: "拍频",
    icon: "🎵",
    category: "oscillations",
    physicsType: "beats",
    analysis: {
      ocrText: "两列波频率分别为f1=5Hz和f2=5.5Hz，振幅A=2，求拍频现象。",
      concepts: ["拍频", "频率差", "振幅调制"],
      knownValues: { f1: 5, f2: 5.5, A: 2 },
      forces: [],
      physicsType: "beats",
      description: "拍频：两个频率接近的波叠加产生振幅周期性变化",
    },
  },
  {
    title: "多普勒效应",
    icon: "🚑",
    category: "oscillations",
    physicsType: "doppler_effect",
    analysis: {
      ocrText: "波源以vs=2m/s运动，声速v=5m/s，频率f0=2Hz，求观察者接收频率。",
      concepts: ["多普勒效应", "频率变化", "波源运动"],
      knownValues: { vs: 2, v: 5, f0: 2 },
      forces: [],
      physicsType: "doppler_effect",
      description: "多普勒效应：波源运动导致波前压缩/拉伸，频率改变",
    },
  },
  {
    title: "谐波合成",
    icon: "🎶",
    category: "oscillations",
    physicsType: "harmonics",
    analysis: {
      ocrText: "弦长L=4m上前三个谐波叠加，基频f=1Hz，振幅A=2。",
      concepts: ["谐波", "傅里叶级数", "基频与泛音"],
      knownValues: { L: 4, A: 2, f: 1 },
      forces: [],
      physicsType: "harmonics",
      description: "前三个谐波及其合成：基频+二次谐波+三次谐波",
    },
  },
  {
    title: "傅里叶合成方波",
    icon: "🔳",
    category: "oscillations",
    physicsType: "fourier_synthesis",
    analysis: {
      ocrText: "用傅里叶级数前5项逼近方波，基频f=1Hz，振幅A=3。",
      concepts: ["傅里叶级数", "方波", "谐波逼近"],
      knownValues: { f: 1, A: 3 },
      forces: [],
      physicsType: "fourier_synthesis",
      description: "傅里叶级数逼近方波：逐步增加谐波项改善逼近",
    },
  },
  // === 新增运动学 ===
  {
    title: "滚动上坡",
    icon: "⛰",
    category: "kinematics",
    physicsType: "rolling_incline",
    analysis: {
      ocrText: "物体以v0=5m/s初速度沿30°斜面上滑，摩擦系数μ=0.1，求运动过程。",
      concepts: ["斜面运动", "摩擦力", "匀减速运动"],
      knownValues: { angle: 30, v0: 5, mu: 0.1, g: 9.8 },
      forces: ["重力", "摩擦力"],
      physicsType: "rolling_incline",
      description: "物体沿斜面上滑，受重力分量和摩擦力减速至停止",
    },
  },
  {
    title: "空气阻力下落",
    icon: "🪂",
    category: "kinematics",
    physicsType: "falling_air",
    analysis: {
      ocrText: "质量m=1kg物体下落，空气阻力系数b=0.5，求收尾速度和运动过程。",
      concepts: ["空气阻力", "收尾速度", "指数衰减"],
      knownValues: { m: 1, b: 0.5, g: 9.8 },
      forces: ["重力", "空气阻力"],
      physicsType: "falling_air",
      description: "空气阻力下落：速度指数趋近收尾速度v_t=mg/b",
    },
  },
  // === 新增力学 ===
  {
    title: "梯子平衡",
    icon: "🪜",
    category: "dynamics",
    physicsType: "ladder_equilibrium",
    analysis: {
      ocrText: "梯子长L=5m靠在光滑墙上，与地面成60°角，求受力平衡条件。",
      concepts: ["力矩平衡", "受力分析", "静摩擦"],
      knownValues: { L: 5, angle: 60, g: 9.8 },
      forces: ["重力", "墙壁支持力", "地面支持力", "摩擦力"],
      physicsType: "ladder_equilibrium",
      description: "梯子靠墙平衡：受力分析+力矩平衡条件",
    },
  },
  {
    title: "倾斜弯道",
    icon: "🏎",
    category: "dynamics",
    physicsType: "banked_turn",
    analysis: {
      ocrText: "汽车在半径r=20m的倾斜弯道上行驶，路面倾角30°，求安全速度。",
      concepts: ["倾斜弯道", "圆周运动", "向心力"],
      knownValues: { r: 20, angle: 30, g: 9.8 },
      forces: ["重力", "支持力"],
      physicsType: "banked_turn",
      description: "倾斜弯道：支持力和重力的合力提供向心力",
    },
  },
  {
    title: "势能曲线",
    icon: "📊",
    category: "dynamics",
    physicsType: "potential_energy",
    analysis: {
      ocrText: "弹簧振子势能U(x)=kx²/2，总能量E=10J，求振动范围。",
      concepts: ["势能曲线", "能量守恒", "回复力"],
      knownValues: { k: 10, E: 10 },
      forces: ["弹力"],
      physicsType: "potential_energy",
      description: "势能曲线：总能量水平线与势能曲线的交点为转折点",
    },
  },
  // === camphortree.net 新增 ===
  {
    title: "点积与投影",
    icon: "📐",
    category: "dynamics",
    physicsType: "dot_product",
    analysis: {
      ocrText: "向量A=4，方向20°，向量B=3，方向50°，求A·B和投影。",
      concepts: ["点积", "向量投影", "夹角"],
      knownValues: { F1: 4, F2: 3, theta1: 20, theta2: 50 },
      forces: [],
      physicsType: "dot_product",
      description: "向量点积A·B=|A||B|cosθ，可视化投影和夹角",
    },
  },
  {
    title: "力矩(3D)",
    icon: "🔄",
    category: "dynamics",
    physicsType: "torque_3d",
    analysis: {
      ocrText: "力臂r=3m，力F=4N，夹角φ=30°，求力矩τ。",
      concepts: ["力矩", "叉积", "右手定则"],
      knownValues: { r: 3, F: 4, phi: 30 },
      forces: ["力F", "力矩τ"],
      physicsType: "torque_3d",
      description: "力矩τ=r×F，3D可视化展示叉积方向",
    },
  },
  {
    title: "碰撞解空间",
    icon: "📊",
    category: "dynamics",
    physicsType: "collision_phase_space",
    analysis: {
      ocrText: "m1=2kg v1=5m/s, m2=3kg v2=-3m/s，弹性碰撞后的速度。",
      concepts: ["动量守恒", "能量守恒", "碰撞解空间"],
      knownValues: { m1: 2, m2: 3, v1: 5, v2: -3 },
      forces: [],
      physicsType: "collision_phase_space",
      description: "v1-v2相图：红线=动量守恒，绿椭圆=能量守恒",
    },
  },
  {
    title: "双源干涉(2D)",
    icon: "🌊",
    category: "oscillations",
    physicsType: "two_source_interference",
    analysis: {
      ocrText: "两个相干波源间距d=4，频率f=2Hz，观察空间干涉图样。",
      concepts: ["双源干涉", "波前", "干涉图样"],
      knownValues: { d: 4, f: 2 },
      forces: [],
      physicsType: "two_source_interference",
      description: "两个点源的波前叠加，观察空间干涉加强/减弱",
    },
  },
  {
    title: "串联电路",
    icon: "🔌",
    category: "em",
    physicsType: "series_circuit",
    analysis: {
      ocrText: "三个电阻R1=4Ω, R2=6Ω, R3=2Ω串联，电源V=12V，求各电阻电压。",
      concepts: ["串联电路", "分压", "欧姆定律"],
      knownValues: { V: 12, R1: 4, R2: 6, R3: 2 },
      forces: [],
      physicsType: "series_circuit",
      description: "串联电路电势图：各电阻上的电压降之和等于电源电压",
    },
  },
  {
    title: "点电荷电场",
    icon: "⚡",
    category: "em",
    physicsType: "electric_field",
    analysis: {
      ocrText: "q1=+1C在(-2,0)，q2=-1C在(2,0)，求等势线和电场分布。",
      concepts: ["电场", "等势线", "库仑定律"],
      knownValues: { q1: 1, q2: -1, d: 4 },
      forces: ["电场力"],
      physicsType: "electric_field",
      description: "两个点电荷的等势线分布，观察电场方向",
    },
  },
  {
    title: "系外行星凌星",
    icon: "🌟",
    category: "optics",
    physicsType: "exoplanet_transit",
    analysis: {
      ocrText: "恒星半径Rs=3，行星半径Rp=1，凌星时求光变曲线深度。",
      concepts: ["凌星法", "光变曲线", "行星探测"],
      knownValues: { Rs: 3, Rp: 1, b: 0 },
      forces: [],
      physicsType: "exoplanet_transit",
      description: "系外行星凌星：行星遮挡恒星导致亮度下降δ=(Rp/Rs)²",
    },
  },
  {
    title: "壳层定理",
    icon: "🔵",
    category: "dynamics",
    physicsType: "shell_theorem",
    analysis: {
      ocrText: "质量均匀球壳半径R=3，N=12个质点，测试粒子在r=5处，求引力。",
      concepts: ["壳层定理", "万有引力", "球壳内部场为零"],
      knownValues: { N: 12, R: 3, r: 5 },
      forces: ["万有引力"],
      physicsType: "shell_theorem",
      description: "牛顿壳层定理：球壳内引力为零，球壳外等效于质心处质点",
    },
  },
  {
    title: "高斯定律",
    icon: "🟡",
    category: "em",
    physicsType: "gauss_law",
    analysis: {
      ocrText: "两个点电荷q1=1C和q2=-1C间距d=4，高斯面半径R=3，求通量。",
      concepts: ["高斯定律", "电通量", "包围电荷"],
      knownValues: { q1: 1, q2: -1, d: 4, R: 3 },
      forces: ["电场力"],
      physicsType: "gauss_law",
      description: "高斯定律：通过闭合面的电通量=包围电荷/ε₀",
    },
  },
  {
    title: "安培定律",
    icon: "🔴",
    category: "em",
    physicsType: "amperes_law",
    analysis: {
      ocrText: "两根平行导线I1=2A和I2=-1A间距d=4，安培环路半径R=3，求积分。",
      concepts: ["安培定律", "磁场环路积分", "包围电流"],
      knownValues: { I1: 2, I2: -1, d: 4, R: 3 },
      forces: ["磁场力"],
      physicsType: "amperes_law",
      description: "安培定律：磁场沿闭合路径的线积分=μ₀×包围电流",
    },
  },
];

interface ExampleProblemsProps {
  onSelect: (example: { analysis: PhysicsAnalysis }) => void;
}

export default function ExampleProblems({ onSelect }: ExampleProblemsProps) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all"
    ? EXAMPLE_PROBLEMS
    : EXAMPLE_PROBLEMS.filter((e) => e.category === filter);

  const handleSelect = useCallback(
    (example: ExampleProblem) => {
      const result = getDesmosExpressions(
        example.physicsType,
        example.analysis.knownValues
      );
      onSelect({
        analysis: {
          ...example.analysis,
          desmosExprs: result?.expressions || [],
          viewport: result?.viewport,
          viewport3d: result?.viewport3d,
          dimension: result?.dimension,
        },
      });
    },
    [onSelect]
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">示例物理模型</h2>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === c.key
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {c.label}
            <span className="ml-1 text-xs opacity-70">
              {c.key === "all"
                ? EXAMPLE_PROBLEMS.length
                : EXAMPLE_PROBLEMS.filter((e) => e.category === c.key).length}
            </span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((example) => (
          <button
            key={example.physicsType}
            onClick={() => handleSelect(example)}
            className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-left transition-all"
          >
            <div className="text-2xl mb-2">{example.icon}</div>
            <div className="font-medium text-sm text-gray-900">{example.title}</div>
            <div className="text-xs text-gray-800 mt-1">{example.analysis.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
