# Desmos 高中物理模板资源整理

来源：Steve Stonebraker (camphortree.net) + Brian Frank (teachbrianteach.com)

---

## 一、已有模板（19个）

| physicsType | 名称 | 说明 |
|---|---|---|
| projectile_motion | 抛体运动 | 斜抛轨迹 |
| pendulum | 单摆 | 简化单摆 |
| free_fall | 自由落体 | 从高处下落 |
| vertical_throw | 竖直上抛 | 上抛+回落 |
| horizontal_throw | 平抛运动 | 水平初速度 |
| inclined_plane | 斜面滑块 | 含摩擦力 |
| circular_motion | 匀速圆周运动 | 圆轨道 |
| spring | 弹簧简谐运动 | 弹簧振子 |
| elastic_collision | 弹性碰撞 | 一维碰撞 |
| magnetic_field | 磁场中带电粒子 | 洛伦兹力圆周 |
| wave_superposition | 波的叠加 | 两列波合成 |
| energy_conservation | 能量守恒 | 过山车 |
| damped_oscillation | 阻尼振动 | 衰减振荡 |
| uniform_acceleration | 匀变速直线运动 | v-t/a-t图 |
| binary_star | 双星系统 | 万有引力双体 |
| electric_deflection | 电场偏转 | 带电粒子偏转 |
| forced_oscillation | 受迫振动 | 含共振曲线 |
| conical_motion | 圆锥摆 | 3D漏斗 |
| lissajous | 李萨如图形 | 频率比图形 |

---

## 二、推荐新增模板（按优先级排序）

### P0 - 高中物理高频考点，推荐优先实现

#### 1. 驻波 / 共振模式 (standing_wave)
- **来源**: Stonebraker "Standing wave modes" + Frank "Standing Waves in Pipes"
- **高中考点**: 弦上驻波、管中驻波、波长与管长关系 λ=2L/n
- **Desmos 关键表达式**:
  - y = A·sin(nπx/L)·cos(ωt) — 第n阶驻波模式
  - n 滑块控制谐波阶数
  - L 滑块控制弦/管长度
  - 可选：显示波节和波腹位置
- **已知量**: L(弦长m), n(谐波阶数), A(振幅), f(频率)

#### 2. 薄透镜成像 / 几何光学 (thin_lens)
- **来源**: Frank "Thin Lens: Image and Ray Tracing" + Stonebraker "Image formation by mirrors and lenses"
- **高中考点**: 凸透镜三条特征光线、成像公式 1/f=1/u+1/v
- **Desmos 关键表达式**:
  - 透镜（竖直线）、焦点F、物距u滑块
  - 三条光线：平行光线→过焦点、过光心直线、过焦点→平行
  - 像的位置由光线交点决定
  - 支持凸透镜/凹透镜切换（焦点位置正负）
- **已知量**: f(焦距cm), u(物距cm)

#### 3. 多普勒效应 (doppler_effect)
- **来源**: Stonebraker "Doppler effect and shocks"
- **高中考点**: 多普勒频移公式 f'=f·v/(v±vs)
- **Desmos 关键表达式**:
  - 移动声源位置 vs·t
  - 等时间间隔发射的圆形波前
  - 观察者位置可拖动
  - 观察到的频率随位置变化
- **已知量**: vs(声源速度m/s), v(声速m/s), f0(声源频率Hz)

#### 4. 拍频 (beats)
- **来源**: Stonebraker "Beats"
- **高中考点**: 两列频率相近的波叠加，拍频 f_beat=|f1-f2|
- **Desmos 关键表达式**:
  - y1 = A·sin(2πf1·t), y2 = A·sin(2πf2·t)
  - y_sum = y1 + y2
  - 包络线显示拍频周期
- **已知量**: f1(Hz), f2(Hz), A(振幅)

#### 5. 力的合成与分解 (vector_addition)
- **来源**: Frank "Force Vectors (Sum)" + "Vector Component" + Stonebraker "Arrow/vector functions"
- **高中考点**: 平行四边形法则、力的分解
- **Desmos 关键表达式**:
  - 两个力矢量 F1、F2（可调角度和大小）
  - 合力 F = F1 + F2
  - 分量显示
- **已知量**: F1(N), F2(N), θ1(deg), θ2(deg)

### P1 - 有价值的拓展

#### 6. 势能曲线 / U(x) 图 (potential_energy)
- **来源**: Stonebraker "U(x) potential functions"
- **高中考点**: 势能曲线分析、平衡位置、动能与势能转化
- **Desmos 关键表达式**:
  - U(x) = kx²/2 或其他势能函数
  - E 水平线（总能量）
  - 动能 = E - U(x) 阴影区域
  - 小球在势能曲线上运动
- **已知量**: E(总能量J), k(弹性系数)

#### 7. 平面镜成像 (plane_mirror)
- **来源**: Stonebraker "Plane mirror images with observer"
- **高中考点**: 平面镜成像规律、正立等大虚像
- **已知量**: 物距、镜面位置

#### 8. 导体棒在磁场中运动 (motional_emf)
- **来源**: Stonebraker "Moving bar in a magnetic field"
- **高中考点**: 动生电动势 ε=BLv、感应电流、安培力
- **已知量**: B(T), L(棒长m), R(电阻Ω), v0(初速度)

#### 9. 傅里叶合成方波 (fourier_synthesis)
- **来源**: Stonebraker "Fourier square wave"
- **高中考点**: 了解频谱概念、方波=奇次谐波叠加
- **已知量**: f(基频Hz), n(谐波数)

#### 10. 双缝干涉 (double_slit)
- **来源**: Stonebraker "Interference from two sources" + Frank "Two Slit Interference"
- **高中考点**: 双缝干涉条纹间距 Δx=λL/d
- **Desmos 关键表达式**:
  - 两个波源的圆波前
  - 屏上干涉强度分布
  - 明纹/暗纹位置标注
- **已知量**: λ(波长nm), d(缝距mm), L(屏距m)

### P2 - 进阶（适合有余力时添加）

#### 11. 力矩 / 叉乘 (torque)
- **来源**: Stonebraker "Torque and cross products"
- **高中考点**: 力矩 M=r×F、杠杆平衡

#### 12. v-t图多段运动 (two_stage_motion)
- **来源**: Frank "Two-Stage Velocity vs Time Graph"
- **高中考点**: 分段匀变速运动、v-t图面积=位移

#### 13. 竖直弹簧 (vertical_spring)
- **来源**: 可从现有spring模板扩展
- **高中考点**: 竖直弹簧振子、平衡位置偏移

#### 14. 碰撞解集可视化 (collision_solutions)
- **来源**: Stonebraker "Collision solution sets"
- **高中考点**: 动量守恒+能量守恒的解空间（非模拟，教学工具）

---

## 三、Stonebraker 工具类模板（辅助开发）

| 工具 | 用途 | 可借鉴技巧 |
|---|---|---|
| Arrow/Vector functions | 绘制矢量箭头 | 极坐标/直角坐标/两点式矢量 |
| Dot product illustration | 点积可视化 | 矢量投影 |

---

## 四、优先实现建议

**第一批**（5个，覆盖高中物理最常见考点）:
1. `standing_wave` — 驻波是高考必考
2. `thin_lens` — 几何光学核心
3. `doppler_effect` — 波动学重点
4. `beats` — 波的叠加进阶
5. `vector_addition` — 力学基础

**第二批**（5个）:
6. `potential_energy`
7. `double_slit`
8. `motional_emf`
9. `plane_mirror`
10. `fourier_synthesis`
