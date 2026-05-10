# Desmos 高中物理模拟示例汇总

汇总来自三个优质来源的 Desmos 物理模拟，按物理类别整理。每个示例附原始链接和中文描述。

> 本文档供开发参考，用于扩展 physmodel-ai 的模板库。

---

## 一、来源概览

| 来源 | 作者 | 网址 | 示例数 |
|------|------|------|--------|
| camphortree.net | Steve Stonebraker | https://www.camphortree.net/blog/desmos/ | 20 |
| afreeparticle.com | (教师匿名) | https://www.afreeparticle.com | 20 |
| Dan Hosey Google Sheets | Dan Hosey | https://www.desmos.com/calculator/l1bebrtvgo | 170+ |

---

## 二、按物理类别分类

### 1. 运动学 (Kinematics)

#### 1.1 抛体运动

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 抛体轨迹 | camphortree | https://camphortree.net/goto/projectile | 灵活的动画抛体模拟，含运动图标记、向量/标签、初始高度可调，可显示最大射程角度 |
| 彩虹抛体 | afreeparticle | https://www.desmos.com/calculator/omfaqlgeyd | 多角度同时发射的抛体轨迹对比，形成彩虹状图案 |
| 弹射器 (Springshot) | afreeparticle | https://www.desmos.com/calculator/njl6dkrc3o | 弹簧弹射物体的抛体运动 |
| 抓住走鹃 | afreeparticle | https://www.desmos.com/calculator/lgemwsoexu | 追及与抛体的趣味结合 |

#### 1.2 自由落体与竖直运动

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 穿过空气下落 | afreeparticle | https://www.desmos.com/calculator/kxx4u88nbs | 考虑空气阻力的下落运动，展示收尾速度 |
| 圆柱体下落 | afreeparticle | https://www.desmos.com/calculator/jlfsetdl1g | 圆柱体（转动惯量）的下落对比 |

#### 1.3 匀变速运动

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 小车运动 | afreeparticle | https://www.desmos.com/calculator/xavnciqlh1 | 小车的匀变速直线运动 |
| 传送带上的车 | afreeparticle | https://www.desmos.com/calculator/al1vfflgqj | 传送带参考系下的1D运动 |
| 滚动上坡对比 | afreeparticle | https://www.desmos.com/calculator/i9nhqmpxaq | 不同物体沿斜面上滚的速度对比 |
| 弹珠小车 | afreeparticle | https://www.desmos.com/calculator/apoerrtcho | 弹珠在小车上的运动（相对运动） |

---

### 2. 力学 (Dynamics)

#### 2.1 碰撞与动量

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 碰撞解集 | camphortree | https://camphortree.net/goto/collision-solution-sets | 一维碰撞最终速度解集可视化，展示弹性碰撞是完整解集的子集 |
| 碰撞小车 | afreeparticle | https://www.desmos.com/calculator/pitgzyinlk | 两辆小车的弹性/非弹性碰撞 |

#### 2.2 力的平衡与力矩

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 扭矩与叉积 | camphortree | https://camphortree.net/goto/torque-crossproduct | 杆一端固定，可调节力的位置/方向/大小，显示力矩和叉积向量 |
| 猴子静力学 | afreeparticle | https://www.desmos.com/calculator/i0b5j2ttfp | 猴子攀绳的静力平衡问题 |
| 悬挂杆 | afreeparticle | https://www.desmos.com/calculator/kb2vx1467u | 杆的力矩平衡 |

#### 2.3 万有引力

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 牛顿壳层定理 | camphortree | https://camphortree.net/goto/shelltheorem | 圆形外壳粒子吸引测试粒子，展示壳层定理，可切换1/r与1/r^2 |

#### 2.4 能量与功

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| U(x) 势能函数 | camphortree | https://camphortree.net/goto/u-of-x | 一维势能函数中粒子的能量与运动，含力/速度箭头，内置多个U(x)函数 |

#### 2.5 滑轮与连接体

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 滑轮 | afreeparticle | https://www.desmos.com/calculator/rub85txanf | 阿特伍德机/滑轮系统 |

#### 2.6 旋转运动

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 旋转 | afreeparticle | https://www.desmos.com/calculator/biddvsbmhw | 刚体旋转运动学 |

---

### 3. 振动与波 (Oscillations & Waves)

#### 3.1 简谐运动

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 2D弹簧 | afreeparticle | https://www.desmos.com/calculator/d2qpkgrfcx | 二维弹簧振动 |
| 简谐运动 (SHM) | afreeparticle | https://www.desmos.com/calculator/fodkpxsuol | 经典简谐运动，位移-时间图 |
| 振子 | afreeparticle | https://www.desmos.com/calculator/szujmzvbuv | 阻尼/受迫振动 |

#### 3.2 波动

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 波脉冲竞赛 | afreeparticle | https://www.desmos.com/calculator/alx3t0dyz0 | 不同介质中波脉冲传播速度对比 |
| 波脉冲干涉 | afreeparticle | https://www.desmos.com/calculator/avq6khuru5 | 两波脉冲的叠加与干涉 |
| 拍频 | camphortree | https://camphortree.net/goto/beats | 两个可调频率纯音的拍频现象，含tone()函数播放 |
| 傅里叶方波 | camphortree | https://camphortree.net/goto/fourier-square | 正弦波叠加构建方波，含tone()函数播放 |

#### 3.3 干涉与衍射

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 双源干涉 | camphortree | https://camphortree.net/goto/interference-2-sources | 两个圆形波源的空间干涉图样，含波前动画和tone()函数 |
| 多普勒效应与激波 | camphortree | https://www.camphortree.net/goto/doppler | 运动波源的多普勒效应，超音速产生激波，含tone()和频率变化图 |
| 驻波模式 | camphortree | https://camphortree.net/goto/modes | 弦/开管/闭管的驻波共振模式，拖动调节波长 |

---

### 4. 电磁学 (Electromagnetism)

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 电路高度（电势） | camphortree | https://www.desmos.com/calculator/ii99lugy3i | 串联电路的"电势=高度"比喻，三个电阻分压可视化 |
| 高斯定律 | camphortree | https://camphortree.net/goto/gauss | 通量与包围电荷的关系，两个可调粒子+三种高斯面，2D模拟(1/r) |
| 等势线与场向量 | camphortree | https://www.desmos.com/calculator/a7apwfceec | 四个可调电荷的等势线和电场向量阵列，含测试探针 |
| 安培定律 | camphortree | http://www.camphortree.net/goto/b-field-ampere | 两根长直电流的磁场，沿选定路径执行安培定律离散求和 |
| 电磁波 | afreeparticle | https://www.desmos.com/calculator/ih7e6svq61 | E场和B场振荡的电磁波可视化 |
| 救狗 | afreeparticle | https://www.desmos.com/calculator/n17r36ycwo | 电磁学趣味问题 |

---

### 5. 光学 (Optics)

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 平面镜成像（含观察者） | camphortree | https://camphortree.net/goto/plane-mirror | 平面镜成像原理，含观察者眼球、视野可视化、光线追踪 |
| 透镜/镜子成像 | camphortree | https://camphortree.net/goto/optics | 主光线追踪，焦距可调，透镜/镜子切换，会聚/发散切换 |

---

### 6. 向量工具 (Vector Tools)

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 箭头/向量函数 | camphortree | https://camphortree.net/goto/vectors-full | 极坐标/直角坐标/两点坐标三种输入形式绘制向量 |
| 向量函数（可导入版） | camphortree | https://camphortree.net/goto/vectors-importable | 无文件夹版本，可直接导入其他图表 |
| 点积图解 | camphortree | https://camphortree.net/goto/dotproduct | 向量投影与点积计算，含结果面板 |

---

### 7. 天体物理 (Astrophysics)

| 名称 | 来源 | 链接 | 描述 |
|------|------|------|------|
| 系外行星凌星光变曲线 | camphortree | https://camphortree.net/goto/exoplanet | 系外行星凌星时的光变曲线，含临边昏暗模型 |

---

## 三、afreeparticle.com 完整 Desmos URL 列表

| # | 页面 | Desmos URL |
|---|------|-----------|
| 1 | Rolling Up Comparisons | https://www.desmos.com/calculator/i9nhqmpxaq |
| 2 | 2D Spring | https://www.desmos.com/calculator/d2qpkgrfcx |
| 3 | Monkey Statics | https://www.desmos.com/calculator/i0b5j2ttfp |
| 4 | Wave Pulse Race | https://www.desmos.com/calculator/alx3t0dyz0 |
| 5 | Falling Through Air | https://www.desmos.com/calculator/kxx4u88nbs |
| 6 | Hanging Rod | https://www.desmos.com/calculator/kb2vx1467u |
| 7 | Car on Conveyor 1D | https://www.desmos.com/calculator/al1vfflgqj |
| 8 | Electromagnetic Wave | https://www.desmos.com/calculator/ih7e6svq61 |
| 9 | Catch the Roadrunner! | https://www.desmos.com/calculator/lgemwsoexu |
| 10 | Cylinder Drop | https://www.desmos.com/calculator/jlfsetdl1g |
| 11 | Cart | https://www.desmos.com/calculator/xavnciqlh1 |
| 12 | Rainbow Projectiles | https://www.desmos.com/calculator/omfaqlgeyd |
| 13 | Collision Carts | https://www.desmos.com/calculator/pitgzyinlk |
| 14 | Pulse Interference | https://www.desmos.com/calculator/avq6khuru5 |
| 15 | Pulley | https://www.desmos.com/calculator/rub85txanf |
| 16 | Rotation | https://www.desmos.com/calculator/biddvsbmhw |
| 17 | SHM | https://www.desmos.com/calculator/fodkpxsuol |
| 18 | Save Dog | https://www.desmos.com/calculator/n17r36ycwo |
| 19 | Oscillator | https://www.desmos.com/calculator/szujmzvbuv |
| 20 | Marble Cart | https://www.desmos.com/calculator/apoerrtcho |

---

## 四、camphortree.net 外部推荐资源

| 作者 | 链接 | 说明 |
|------|------|------|
| Brian Frank | https://teacher.desmos.com/collection/5f29b0d4f191a016b880dc94 | 物理 I 卡片分类活动 |
| Brian Frank | https://teacher.desmos.com/collection/5f2d3af1918fb8539c787718 | 物理 II 卡片分类活动 |
| Frank Noschese | https://teacher.desmos.com/collection/5f806f2321fa660ca84cf129 | 物理教学收藏 |
| Kristin Newton | https://teacher.desmos.com/collection/5f2ef3c13575523004734725 | 物理教学收藏 |
| Marco Almeida | https://teacher.desmos.com/collection/5e3b7e9dad257577feb17aab | 物理教学收藏 |
| Dan Hosey | https://www.desmos.com/calculator/l1bebrtvgo | 大量物理模拟汇总（120+） |
| Michael Freeman | https://www.desmos.com/calculator/r0i8gofv7o | 物理图表收藏 |

---

## 五、本项目已实现的模板

以下模板已在 `src/lib/templates/` 中实现，可直接从图片识别后调用：

### 运动学 (10)
- `projectile_motion` - 斜抛运动
- `free_fall` - 自由落体
- `vertical_throw` - 竖直上抛
- `horizontal_throw` - 平抛运动
- `uniform_acceleration` - 匀变速直线运动
- `two_stage_motion` - 两段变速运动
- `relative_motion` - 相对运动
- `pursuit_problem` - 追及问题
- `rolling_incline` - 滚动上坡
- `falling_air` - 空气阻力下落

### 力学 (18)
- `inclined_plane` - 斜面滑块
- `circular_motion` - 匀速圆周运动
- `vertical_circular` - 竖直圆周运动
- `elastic_collision` - 弹性碰撞
- `energy_conservation` - 能量守恒（过山车）
- `vector_addition` - 力的合成/分解
- `atwood_machine` - 阿特伍德机
- `lever_balance` - 杠杆平衡
- `connected_bodies` - 连接体
- `inclined_connected` - 斜面连接体
- `binary_star` - 双星系统
- `collision_phase_space` - 碰撞解空间
- `ladder_equilibrium` - 梯子平衡
- `banked_turn` - 倾斜弯道
- `potential_energy` - 势能曲线
- `dot_product` - 向量点积
- `torque_3d` - 力矩（3D）
- `conical_motion` - 圆锥摆

### 振动与波 (14)
- `pendulum` - 单摆
- `spring` - 弹簧简谐运动
- `vertical_spring` - 竖直弹簧
- `damped_oscillation` - 阻尼振动
- `forced_oscillation` - 受迫振动/共振
- `wave_superposition` - 波的叠加
- `lissajous` - 李萨如图形
- `standing_wave` - 驻波
- `beats` - 拍频
- `doppler_effect` - 多普勒效应
- `harmonics` - 谐波
- `fourier_synthesis` - 傅里叶合成
- `two_source_interference` - 双源干涉
- `em_wave` - 电磁波

### 电磁学 (8)
- `magnetic_field` - 磁场中带电粒子
- `electric_deflection` - 电场偏转
- `motional_emf` - 动生电动势
- `series_circuit` - 串联电路
- `electric_field` - 点电荷电场/等势线
- `gauss_law` - 高斯定律
- `amperes_law` - 安培定律
- `shell_theorem` - 壳层定理

### 光学 (4)
- `thin_lens` - 薄透镜成像
- `plane_mirror` - 平面镜成像
- `double_slit` - 双缝干涉
- `exoplanet_transit` - 系外行星凌星

---

## 六、Dan Hosey 完整 Desmos 模拟列表

> 来源: https://docs.google.com/spreadsheets/d/e/2PACX-1vTu3C5_0CvE9MU8KsSr1wT4p1-Gp5cS_myaj2YZylWQNJXlTWgqaUCak9yYIik9jpJSL48W2dO_phCy/pubhtml
> 共 170+ 条模拟，以下按物理类别分类整理（仅列最新/最佳版本，历史版本省略）

### 6.1 运动学

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 15.001 | 两抛体同时发射 | https://www.desmos.com/calculator/2fxjisw9gp |
| 15.002 | 多方向仰角发射抛体 | https://www.desmos.com/calculator/r21xwdq5bf |
| 15.003 | 仰角抛体射移动目标挑战 | https://www.desmos.com/calculator/zajzyzpedg |
| 15.005-7 | 抛体穿环辅助工具 | https://www.desmos.com/calculator/nz2wkdvkto |
| 18.001 | 汽车超车（追及问题） | https://www.desmos.com/calculator/pwqtfwnxsz |
| 23.01 | 近地g与能量 | https://www.desmos.com/calculator/rtvqamgufz |
| 3.003-5 | 收尾速度（多次迭代） | https://www.desmos.com/calculator/ny6zivrfk6 |
| 34.004 | 穿过地球隧道SHM | https://www.desmos.com/calculator/ynqsqvjgy9 |
| 43.02 | 单车道桥模拟（含动画） | https://www.desmos.com/calculator/9nadjwhhbv |
| 55.03 | 加速参考系中的斜面滑块 | https://www.desmos.com/calculator/t9rpeekcv1 |
| 57 | 智能风扇车上斜面（变加速） | https://www.desmos.com/calculator/654r0moaov |
| 59.02 | 运动图匹配（含车辆动画） | https://www.desmos.com/calculator/s8fzebolch |
| 62 | 两种速度驾驶时间差 | https://www.desmos.com/calculator/ta3ltbuxrc |
| 67 | 弦隧道地球过境SHM | https://www.desmos.com/calculator/wdgpqazn3a |
| 80 | 抛体作为下落圆 | https://www.desmos.com/calculator/cre3zpoidn |
| 84 | 多抛体同时发射（列表推导） | https://www.desmos.com/calculator/1z3uonk8jl |
| 116 | 卡车接不同速度同角抛体 | https://www.desmos.com/calculator/jkhbrzd998 |

### 6.2 力学 — 碰撞与动量

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 12.001 | 实验室系与质心系1D碰撞（完全/部分弹性） | https://www.desmos.com/calculator/ipbybk9na8 |
| 25.002 | 4球堆叠下落碰撞 | https://www.desmos.com/calculator/sk7reaakl4 |
| 28.003 | 实验验室系与质心系4车碰撞 | https://www.desmos.com/calculator/pxbkyzu5kz |
| 32.02 | 2D碰撞（恢复系数可调） | https://www.desmos.com/calculator/xgho5qwj2v |
| 35.03 | 1D碰撞相空间 | https://www.desmos.com/calculator/xu8xx2rw6a |
| 117 | 弹跳球恢复系数 | (Dropbox链接) |
| 118 | 3片爆炸2D（动量守恒） | https://www.desmos.com/calculator/xwt3dwwzsl |
| 128 | 1D碰撞—实验验室系与质心系图形+向量 | https://www.desmos.com/calculator/xp8mysxxmo |

### 6.3 力学 — 旋转与力矩

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 10.001 | 可调旋转木马问题 | https://www.desmos.com/calculator/8ridsnvwa8 |
| 33.02 | 保龄球滑移→滚动转变（图缩放版） | https://www.desmos.com/calculator/lp5gnecunf |
| 47.01 | 圆盘转动惯量 | https://www.desmos.com/calculator/zz9yx46hda |
| 49.001 | 角加速圆盘上的滑移 | https://www.desmos.com/calculator/cifuesgujs |
| 63 | 下落米尺 | https://www.desmos.com/calculator/hnfhqqm9tx |
| 65 | 旋转盘上的瓢虫 | https://www.desmos.com/calculator/zrle3mss2w |
| 66 | 瓢虫在旋转盘上向内走 | https://www.desmos.com/calculator/pm7fg5nfqx |
| 70 | 绕某点的角动量 | https://www.desmos.com/calculator/q4ezrdkfcj |
| 99 | 花滑运动员角动量 | https://www.desmos.com/calculator/wmk4gsbaqq |
| 100 | 向心加速度 | https://www.desmos.com/calculator/u7m6hehpzz |
| 107 | 硬币悖论（小硬币绕大硬币） | https://www.desmos.com/calculator/2lvaqzocoy |

### 6.4 力学 — 力的平衡

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 41.04 | 交通灯张力问题（可拖动） | https://www.desmos.com/calculator/jqipenyxat |
| 44.02 | 最优拉力角（有摩擦） | https://www.desmos.com/calculator/aon7iptlcu |
| 46.03 | Lire塔（堆叠平衡） | https://www.desmos.com/calculator/lsphvqqlgo |
| 61.03 | 梯子靠墙平衡（含向量） | https://www.desmos.com/calculator/eviobnhie3 |
| 97 | 刹车时前后轮力 | https://www.desmos.com/calculator/pvpbozkzfr |
| 98 | 斜面上上坡/下坡法向力 | https://www.desmos.com/calculator/skgb7hgd2d |
| 122 | 杆+悬挂质量平衡（旋转+线性） | https://www.desmos.com/calculator/ouezutcmov |
| 127 | 旋转+线性平衡场景 | https://www.desmos.com/calculator/xwsmltwslr |

### 6.5 力学 — 能量与势能

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 14.003 | 力与势能（输入E(x)显示力/TME/K） | https://www.desmos.com/calculator/25h0brwckf |
| 20.002 | 能量赛跑2轨道vs现实 | https://www.desmos.com/calculator/qowkw94bfv |
| 60 | 粒子F vs X图 | https://www.desmos.com/calculator/74m31ltge4 |
| 86 | 力与势能动画 | https://www.desmos.com/calculator/wsx8y0bbh5 |

### 6.6 力学 — 天体与引力

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 9.003 | 圆轨道（2颗卫星） | https://www.desmos.com/calculator/udbgcjbewp |
| 11.001 | 旋转地球表面力偏离法线 | https://www.desmos.com/calculator/eywh3htjhs |
| 109 | 旋转行星上的法向力 | https://www.desmos.com/calculator/ivuoytkcii |

### 6.7 力学 — 连接体与滑轮

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 31.004 | 绳子/太空列车（5物体连接） | https://www.desmos.com/calculator/7appnljnsb |
| 40.02 | 多动滑轮模拟（机械优势1-6） | https://www.desmos.com/calculator/ruhzscg1bb |

### 6.8 力学 — 向量

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 82.1 | 向量加法（含目标+评分） | https://www.desmos.com/calculator/3jg7nyzr41 |
| 83.1 | 质心模拟（100个随机质量） | https://www.desmos.com/calculator/0oltoxpc7z |
| 124 | 向量加法（分量+平行四边形） | https://www.desmos.com/geometry/ynezn6rmx7 |

### 6.9 振动与波

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 1.202 | 弹簧SHM（1质量） | https://www.desmos.com/calculator/oliyk3m203 |
| 1.001-2 | 两质量一弹簧振荡 | https://www.desmos.com/calculator/4wogflzgju |
| 2.1 | Bocce摆模拟 | https://www.desmos.com/calculator/3cwoejgrh9 |
| 5.001 | 驻波与拍频 | https://www.desmos.com/calculator/cek8rl9tbx |
| 5.002 | 驻波与拍频（不同振幅） | https://www.desmos.com/calculator/lbf3aszohw |
| 13.001 | 物理摆数据拟合 | https://www.desmos.com/calculator/oonfa87jcj |
| 26.003 | 谐波模拟（横波+纵波+压强） | https://www.desmos.com/calculator/8b4l1pvfxb |
| 26.5 | 纵波谐波（含前进波/播放按钮） | https://www.desmos.com/calculator/t1rrebbnws |
| 27.001 | 质量落上弹簧SHM | https://www.desmos.com/calculator/9kduigeykr |
| 37.01 | 驻波与振子位置 | https://www.desmos.com/calculator/frvwvmdjn2 |
| 48.01 | 傅里叶=加圆圈 | https://www.desmos.com/calculator/q98jsgnt49 |
| 71 | 大质量"绳"摆（杆模型） | https://www.desmos.com/calculator/g0z6fnzwvg |
| 72 | 物理摆模拟（杆+可调轴+点质量） | https://www.desmos.com/calculator/qeqa5gn8jq |
| 88.2 | 大角度单摆（Runge-Kutta） | https://www.desmos.com/calculator/on8wfbr9rc |
| 93 | 滚动圆柱体上弹簧SHM | https://www.desmos.com/calculator/b95c2rigso |
| 110 | SHM类型—UCM/弹簧/单摆 | https://www.desmos.com/calculator/oeugmj5l3g |

### 6.10 电磁学

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 29.03 | LC振荡电路（含图+时钟） | https://www.desmos.com/calculator/6uykzbnfgo |
| 50.01 | 范德格拉夫起电机 | https://www.desmos.com/calculator/kymlkljzho |
| 51.03 | 感应电荷 | https://www.desmos.com/calculator/5nlufcqdhr |
| 53.01 | 直线上最多3个电荷的V和E | https://www.desmos.com/calculator/zz0yadbsnm |
| 54.01 | RC充电（2电阻） | https://www.desmos.com/calculator/cxcvwgbr34 |
| 56 | 球形非导体E和V | https://www.desmos.com/calculator/dvpzyotgqa |
| 89.2 | 近地表场与势（含等势线） | https://www.desmos.com/calculator/p47lonp6ob |
| 91.06 | 电场与电势（同心球/柱+电容） | https://www.desmos.com/calculator/q3lmgt9ajn |
| 92.02 | E&V（平面/球/柱+高斯面+介质） | https://www.desmos.com/calculator/vnjt7ekas9 |
| 101 | 右手定则练习（洛伦兹力方向） | https://www.desmos.com/calculator/xuaqjhfvno |
| 102 | 法拉第/楞次定律（感应电流方向） | https://www.desmos.com/calculator/eysdnrckww |
| 120 | 4个自由电荷的运动 | https://www.desmos.com/calculator/cgmnjatsxz |
| 121 | 电容器直觉构建器 | https://www.desmos.com/calculator/scioqnuxiu |
| 125 | 球对称电荷的p(r)/Q/E 3D | https://www.desmos.com/3d/wmp7fkjdyh |

### 6.11 光学

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 38.01 | 双缝干涉图样 | https://www.desmos.com/calculator/dgebokioky |
| 52.04 | 几何光学（透镜+球面镜，含树图像） | https://www.desmos.com/calculator/ugj1odtxxq |
| 52.2 | 球面透镜与镜子 | https://www.desmos.com/calculator/nrcvzh1pg9 |
| 112 | 日食亮度 | https://www.desmos.com/calculator/gzsbwjgaph |

### 6.12 滚动与斜面

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 7.001 | 斜面滚下（含LED闪烁） | https://www.desmos.com/calculator/hzm2fnhlg6 |
| 36.06 | 滚上斜面（无滑vs无摩擦） | https://www.desmos.com/calculator/jbwehb9caf |
| 94.02 | 附带点质量盘滚下坡 | https://www.desmos.com/calculator/sbtjdhtbcv |
| 113 | 斜面滚动3D | https://www.desmos.com/3d/z84yfzfh6p |
| 123 | 斜面上滚动与滑移 | https://www.desmos.com/calculator/9ggc7gbif5 |

### 6.13 3D 模拟

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 103 | 多圆锥摆不同速度3D | https://www.desmos.com/3d/c55ba27155 |
| 104 | 多摆/波蛇/落杆+质量/大角度3D（Runge-Kutta） | https://www.desmos.com/3d/4cad37dccd |
| 105 | N双摆3D（探索释放角敏感度） | https://www.desmos.com/3d/70e585e2c7 |
| 106 | 倾斜弯道3D | https://www.desmos.com/3d/74c96f1237 |
| 126 | 3D质心模拟 | https://www.desmos.com/3d/y2obxrav2a |

### 6.14 其他/工具

| ID | 描述 | Desmos 链接 |
|----|------|------------|
| 4.001 | 转动鱼模拟 | https://www.desmos.com/calculator/83lktpim82 |
| 8.003 | AP1第3题模拟（角动量+碰撞过程） | https://www.desmos.com/calculator/eem6ojpnbt |
| 16.001 | 线性化模拟（C vs 直径） | https://www.desmos.com/calculator/amuqbyj6gs |
| 19.001 | 不同线性化方法是否有影响？ | https://www.desmos.com/calculator/82vmyuryiu |
| 21.001 | 电磁成形硬币 | https://www.desmos.com/calculator/zoja4gvabg |
| 22.002 | 3种成绩曲线/缩放方法 | https://www.desmos.com/calculator/klbhahdbhk |
| 30.002 | 橡皮筋vs弹簧能量衰减 | https://www.desmos.com/calculator/6iwsova3ir |
| 74 | Slip N Fly 水滑梯 | https://www.desmos.com/calculator/hrtvoqcx1h |
| 77 | 球在盒子内弹跳 | https://www.desmos.com/calculator/zgyu5vb23t |
| 81 | 心电图EKG动画 | https://www.desmos.com/calculator/q1qcjceiyl |
| 87 | 两质量弹簧振荡+质心匀速运动 | https://www.desmos.com/calculator/rnuncdcnqk |
| 95 | 钟罩内蜡烛 | https://www.desmos.com/calculator/7n8tqwongl |
| 96 | 猜线性回归游戏 | https://www.desmos.com/calculator/i8fcylknnl |
| 108 | 逻辑斯蒂增长（人口） | https://www.desmos.com/calculator/ap97d1orj0 |
| 114 | 2024 AP Physics C 题3（道路平衡） | https://www.desmos.com/calculator/2eogz6gnpn |
| 115 | 长度收缩与时间膨胀 | https://www.desmos.com/calculator/3ogeg2ahii |
| 119 | 跑步配速图（田径） | https://www.desmos.com/calculator/iysao5c22j |

---

## 七、待实现/可借鉴的模板

以下为外部资源中值得参考但尚未实现的模板方向：

| 物理主题 | 参考来源 | 优先级 | Desmos 参考 | 说明 |
|----------|----------|--------|-------------|------|
| 旋转运动学 | afreeparticle/rotation, DH#10 | P1 | https://www.desmos.com/calculator/biddvsbmhw | 角速度、角加速度、转动惯量 |
| LC振荡电路 | DH#29 | P1 | https://www.desmos.com/calculator/6uykzbnfgo | 电磁振荡+能量图 |
| 大角度单摆 | DH#88 | P1 | https://www.desmos.com/calculator/on8wfbr9rc | 非线性摆，Runge-Kutta |
| 2D碰撞 | DH#32 | P1 | https://www.desmos.com/calculator/xgho5qwj2v | 二维弹性/非弹性碰撞 |
| 滚动与滑移 | DH#123 | P1 | https://www.desmos.com/calculator/9ggc7gbif5 | 刚体滚动条件 |
| 电容器直觉 | DH#121 | P1 | https://www.desmos.com/calculator/scioqnuxiu | 电容充放电可视化 |
| 法拉第/楞次定律 | DH#102 | P1 | https://www.desmos.com/calculator/eysdnrckww | 感应电流方向预测 |
| 质心系碰撞 | DH#128 | P2 | https://www.desmos.com/calculator/xp8mysxxmo | 实验验室系+质心系对照 |
| 物理摆 | DH#72 | P2 | https://www.desmos.com/calculator/qeqa5gn8jq | 杆+可调轴+点质量 |
| 转动鱼 | DH#4 | P2 | https://www.desmos.com/calculator/83lktpim82 | 趣味旋转运动 |
| 堆叠球碰撞 | DH#25 | P2 | https://www.desmos.com/calculator/sk7reaakl4 | 多球碰撞超级球效应 |
| 高斯面电场 | DH#92 | P2 | https://www.desmos.com/calculator/vnjt7ekas9 | 平面/球/柱+介质 |
| 3D圆锥摆 | DH#103 | P3 | https://www.desmos.com/3d/c55ba27155 | 3D Desmos |
| 3D双摆 | DH#105 | P3 | https://www.desmos.com/3d/70e585e2c7 | 混沌系统3D |
| 穿地隧道SHM | DH#34 | P2 | https://www.desmos.com/calculator/ynqsqvjgy9 | 趣味应用 |

---

*文档生成日期：2026-05-10*
*Dan Hosey 数据更新日期：2026-05-10*
