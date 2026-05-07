import { NextRequest, NextResponse } from "next/server";
import { getDesmosExpressions, isSupportedType } from "@/lib/desmosTemplates";

interface ApiConfig {
  vlmUrl: string;
  vlmKey: string;
  vlmModel: string;
  llmUrl: string;
  llmKey: string;
  llmModel: string;
}

const VLM_SYSTEM_PROMPT = `你是一个高中物理题目分析专家。分析图片中的物理题目，提取以下信息并以JSON格式返回：

{
  "ocrText": "题目完整文字",
  "concepts": ["涉及的核心物理概念"],
  "knownValues": {"符号": 数值},
  "forces": ["受力分析"],
  "physicsType": "类型字符串",
  "description": "物理场景的文字描述"
}

常见物理类型映射：
- 抛体运动/斜抛 → projectile_motion
- 单摆/摆动 → pendulum
- 弹簧/简谐运动/弹簧振子 → spring
- 斜面/摩擦力/滑块 → inclined_plane
- 圆周运动/匀速圆周 → circular_motion
- 自由落体/下落 → free_fall
- 竖直上抛/上抛运动 → vertical_throw
- 平抛/水平抛出 → horizontal_throw
- 弹性碰撞/碰撞/动量守恒 → elastic_collision
- 磁场/带电粒子/洛伦兹力 → magnetic_field
- 波的叠加/干涉/波的合成 → wave_superposition
- 能量守恒/机械能守恒/过山车 → energy_conservation
- 阻尼振动/衰减振动 → damped_oscillation
- 匀变速直线运动/匀加速/匀减速 → uniform_acceleration
- 双星/双星系统/万有引力双体 → binary_star
- 电场偏转/带电粒子在电场/电偏转 → electric_deflection
- 受迫振动/共振 → forced_oscillation
- 李萨如/简谐合成/垂直简谐/频率比图形 → lissajous
- 其他 → other

每种物理类型的已知量标准键名（请严格使用这些键名）：
- projectile_motion: v0(初速度m/s), theta(角度deg), g
- pendulum: L(摆长m), alpha0(初始偏角deg), g
- free_fall: h(高度m), g
- vertical_throw: v0(初速度m/s), g
- horizontal_throw: v0(初速度m/s), h(高度m), g
- inclined_plane: angle(斜面角度deg), mu(摩擦系数), g
- circular_motion: r(半径m), omega(角速度rad/s)
- spring: k(劲度系数N/m), m(质量kg), A(振幅m), omega(角频率)
- elastic_collision: m1(kg), m2(kg), v1(m/s), v2(m/s)
- magnetic_field: v0或v(速度m/s), B(磁感应强度T), m(kg), q(电荷量C)
- wave_superposition: A1, A2(振幅), f1或k1, f2或k2(频率或波数)
- energy_conservation: h(高度m), g, m(kg)
- damped_oscillation: A(振幅), b(阻尼系数), omega(角频率)
- uniform_acceleration: v0(初速度m/s), a(加速度m/s²)
- binary_star: m1, m2(质量kg), d(间距m)
- electric_deflection: v0(速度m/s), E(电场强度V/m), q(电荷C), m(kg)
- forced_oscillation: f0(固有频率Hz), f(驱动力频率Hz), A0(力幅), gamma(阻尼)
- lissajous: Ax, Ay(振幅), fx, fy(频率)

注意：
1. 角度值用度数(deg)，不要转弧度
2. g默认取9.8，除非题目指定其他值
3. 如果题目没有给出某个参数的具体数值，不要编造，只提取明确给出的
4. 如果无法判断物理类型，使用"other"

只返回JSON，不要其他内容。`;

function refineClassification(analysis: any): string {
  const type = analysis.physicsType || "other";
  if (type !== "other") return type;
  const text = (analysis.ocrText || "").toLowerCase();
  const concepts = (analysis.concepts || []).join(" ");
  if (text.includes("斜抛") || text.includes("抛体") || concepts.includes("抛体")) return "projectile_motion";
  if (text.includes("平抛") || concepts.includes("平抛")) return "horizontal_throw";
  if (text.includes("上抛") || text.includes("竖直上抛")) return "vertical_throw";
  if (text.includes("自由落体") || text.includes("下落") && !text.includes("斜面")) return "free_fall";
  if (text.includes("单摆") || text.includes("摆动")) return "pendulum";
  if (text.includes("弹簧") || text.includes("简谐")) return "spring";
  if (text.includes("斜面") || text.includes("滑块") && text.includes("摩擦")) return "inclined_plane";
  if (text.includes("圆周") || concepts.includes("圆周运动")) return "circular_motion";
  if (text.includes("碰撞") || concepts.includes("动量守恒")) return "elastic_collision";
  if (text.includes("磁场") || text.includes("洛伦兹")) return "magnetic_field";
  if (text.includes("波的叠加") || text.includes("干涉")) return "wave_superposition";
  if (text.includes("能量守恒") || text.includes("机械能")) return "energy_conservation";
  if (text.includes("阻尼")) return "damped_oscillation";
  if (text.includes("匀变速") || text.includes("匀加速") || text.includes("匀减速")) return "uniform_acceleration";
  if (text.includes("双星")) return "binary_star";
  if (text.includes("电场") && text.includes("偏转")) return "electric_deflection";
  if (text.includes("受迫") || text.includes("共振")) return "forced_oscillation";
  if (text.includes("李萨如")) return "lissajous";
  return "other";
}

const LLM_SYSTEM_PROMPT = `你是一个GeoGebra物理模型命令生成专家。根据物理分析结果，生成简化的GeoGebra命令序列。

## 关键规则：
1. 每个模型最多7-8条命令
2. 只使用以下经过验证的命令格式：
   - 滑块: slider_name = Slider(最小值, 最大值, 步长)
   - 点: point_name = (x, y)
   - 线段: Segment(点1, 点2)
   - 向量: Vector(点1, 点2)
   - 圆: Circle(圆心, 半径)
   - 参数曲线: Curve(expr_x, expr_y, t, t_min, t_max)
   - 轨迹: Locus(点, 参数点)
   - 文本: Text("内容", (x, y))
3. 不要使用 SetCaption, SetFixed, SetColor, SetPointSize 等辅助命令
4. 不要使用下标变量名如 P_x, B_x（GeoGebra不支持）
5. 用简单英文变量名: a,b,c,t,v,theta 等。不要用 spring, mass, force 等可能与GeoGebra内部冲突的变量名
6. 角度用度数，GeoGebra默认接受度数
7. 曲线参数 t 范围要合理
8. Segment/Vector 等命令不能使用内联坐标如 Segment(A, (1,2))，必须先定义命名点再引用
9. 不要使用点属性语法如 P.x 或 P[1]，GeoGebra evalCommand 不支持

## 示例：

### 抛体运动:
v0 = Slider(1, 50, 1)
theta = Slider(5, 85, 5)
t = Slider(0, 10, 0.1)
P = (v0*cos(theta)*t, v0*sin(theta)*t - 0.5*9.8*t^2)
Curve(v0*cos(theta)*t, v0*sin(theta)*t - 0.5*9.8*t^2, t, 0, 10)
A = (0, 0)
Segment(A, P)

### 单摆:
L = Slider(1, 5, 0.1)
alpha0 = Slider(10, 60, 5)
t = Slider(0, 10, 0.1)
bob = (L*sin(alpha0*cos(1.5*t)), -L*cos(alpha0*cos(1.5*t)))
pivot = (0, 0)
Segment(pivot, bob)
Curve(L*sin(alpha0*cos(1.5*t)), -L*cos(alpha0*cos(1.5*t)), t, 0, 10)

### 自由落体:
h = Slider(10, 100, 5)
t = Slider(0, 5, 0.1)
ball = (0, h - 0.5*9.8*t^2)
start = (0, h)
ground = (0, 0)
Segment(start, ball)

### 斜面滑块:
angle = Slider(10, 60, 5)
mu = Slider(0, 1, 0.05)
t = Slider(0, 10, 0.1)
a = 9.8*(sin(angle) - mu*cos(angle))
top = (0, 5)
bottom = (5*cos(angle), 5 - 5*sin(angle))
block = (0.5*a*t^2*cos(angle), 5 - 0.5*a*t^2*sin(angle))
Segment(top, bottom)

### 匀速圆周运动:
r = Slider(1, 5, 0.1)
omega = Slider(0.5, 5, 0.5)
t = Slider(0, 10, 0.1)
P = (r*cos(omega*t), r*sin(omega*t))
C = Circle((0,0), r)

### 竖直上抛:
v0 = Slider(5, 40, 1)
t = Slider(0, 10, 0.1)
ball = (0, v0*t - 0.5*9.8*t^2)
start = (0, 0)
top = (0, v0^2/(2*9.8))
Segment(start, ball)

### 平抛运动:
v0 = Slider(1, 30, 1)
h = Slider(5, 50, 5)
t = Slider(0, 5, 0.1)
P = (v0*t, h - 0.5*9.8*t^2)
A = (0, h)
Curve(v0*t, h - 0.5*9.8*t^2, t, 0, sqrt(2*h/9.8))
Segment(A, P)

### 弹性碰撞:
m1 = Slider(1, 10, 0.5)
m2 = Slider(1, 10, 0.5)
v1 = Slider(1, 10, 0.5)
t = Slider(0, 10, 0.1)
v1f = (m1-m2)/(m1+m2)*v1
v2f = 2*m1/(m1+m2)*v1
tcol = 4
b1 = (If(t<tcol, -5+v1*t, -5+v1*tcol+v1f*(t-tcol)), 0)
b2 = (If(t<tcol, 5, 5+v2f*(t-tcol)), 0)

### 带电粒子在磁场中:
v0 = Slider(1, 10, 0.5)
B = Slider(0.5, 5, 0.5)
r = v0/B
t = Slider(0, 10, 0.1)
P = (r*sin(v0/r*t), r-r*cos(v0/r*t))
center = (0, r)
C = Circle(center, r)

### 波的叠加:
A1 = Slider(0.5, 5, 0.5)
A2 = Slider(0.5, 5, 0.5)
t = Slider(0, 10, 0.1)
f1 = Slider(0.5, 5, 0.5)
f2 = Slider(0.5, 5, 0.5)
Curve(x, A1*sin(f1*x - t) + A2*sin(f2*x - t), x, -10, 10)
Curve(x, A1*sin(f1*x - t), x, -10, 10)
Curve(x, A2*sin(f2*x - t), x, -10, 10)

### 能量守恒(过山车):
h = Slider(2, 15, 1)
t = Slider(0, 5, 0.1)
y = h - 0.5*9.8*t^2
v = sqrt(2*9.8*(h-y))
ball = (0, If(y>0, y, 0))
top = (0, h)
ground = (0, 0)
Segment(top, ball)

请根据分析结果，返回JSON格式：
{
  "ggbCommands": ["命令1", "命令2", ...],
  "description": "模型说明"
}

只返回JSON。`;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    const configStr = request.headers.get("x-api-config");
    let config: ApiConfig | null = null;
    try {
      config = configStr ? JSON.parse(configStr) : null;
    } catch {
      config = null;
    }

    if (!config || !config.vlmUrl || !config.vlmKey) {
      return NextResponse.json(
        { error: "请先在设置中配置VLM的API地址和密钥" },
        { status: 400 }
      );
    }

    // Step 1: VLM - 视觉理解
    const vlmResponse = await fetch(config.vlmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.vlmKey}`,
      },
      body: JSON.stringify({
        model: config.vlmModel || "gpt-4o",
        messages: [
          { role: "system", content: VLM_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: image, detail: "high" },
              },
              {
                type: "text",
                text: "请分析这道物理题目，提取所有物理信息。",
              },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!vlmResponse.ok) {
      const errText = await vlmResponse.text();
      return NextResponse.json(
        { error: `VLM调用失败: ${vlmResponse.status} - ${errText}` },
        { status: 500 }
      );
    }

    const vlmData = await vlmResponse.json();
    const vlmContent = vlmData.choices?.[0]?.message?.content || "{}";

    let analysisResult;
    try {
      const jsonMatch = vlmContent.match(/\{[\s\S]*\}/);
      analysisResult = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      analysisResult = { ocrText: vlmContent, physicsType: "other" };
    }

    // Step 2: Use template for known physics types, fall back to LLM for "other"
    const physicsType = refineClassification(analysisResult);
    analysisResult.physicsType = physicsType;
    const knownValues = analysisResult.knownValues || {};

    // Validate knownValues
    const cleanKV: Record<string, number> = {};
    for (const [k, v] of Object.entries(knownValues)) {
      if (typeof v === "number" && isFinite(v)) cleanKV[k] = v;
    }

    if (physicsType !== "other" && isSupportedType(physicsType)) {
      const result = getDesmosExpressions(physicsType, cleanKV, analysisResult.forces);
      return NextResponse.json({
        analysis: {
          ...analysisResult,
          desmosExprs: result?.expressions || [],
          viewport: result?.viewport || null,
          description: analysisResult.description || "",
        },
      });
    }

    // Fallback: LLM for unsupported types
    if (!config.llmUrl || !config.llmKey) {
      return NextResponse.json({
        analysis: {
          ...analysisResult,
          desmosExprs: [],
          description: analysisResult.description || "该类型暂不支持自动建模，请尝试示例中的物理模型",
        },
      });
    }

    const llmResponse = await fetch(config.llmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.llmKey}`,
      },
      body: JSON.stringify({
        model: config.llmModel || "gpt-4o",
        messages: [
          { role: "system", content: LLM_SYSTEM_PROMPT },
          {
            role: "user",
            content: `物理分析结果：${JSON.stringify(analysisResult)}\n\n请生成GeoGebra动态模型命令。`,
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!llmResponse.ok) {
      const errText = await llmResponse.text();
      return NextResponse.json(
        { error: `LLM调用失败: ${llmResponse.status} - ${errText}` },
        { status: 500 }
      );
    }

    const llmData = await llmResponse.json();
    const llmContent = llmData.choices?.[0]?.message?.content || "{}";

    let ggbResult;
    try {
      const match = llmContent.match(/\{[\s\S]*\}/);
      ggbResult = match ? JSON.parse(match[0]) : {};
    } catch {
      ggbResult = { ggbCommands: [] };
    }

    // Sanitize and filter commands
    const nameMap: Record<string, string> = {
      spring: "s1", mass: "m0", force: "f0", gravity: "g0",
      friction: "fr0", velocity: "vel", acceleration: "acc",
      energy: "e0", momentum: "mom", block: "blk", ball: "b0",
      wall: "w0", ground: "gnd", start: "s0", top: "t0",
      bottom: "bt0", pivot: "p0", bob: "b1",
    };
    const invalidPatterns = [
      /SetCaption/i,
      /SetFixed/i,
      /SetColor/i,
      /SetPointSize/i,
      /_[xy]_/i,
      /_\w{2,}/,
      /\w+\.\w+/,
      /\bSegment\b/i,
      /\bVector\b/i,
      /\bLine\b(?!.*Slider)/i,
    ];
    let commands = (ggbResult.ggbCommands || []).filter(
      (cmd: string) => !invalidPatterns.some((p) => p.test(cmd))
    );
    // Rename reserved/conflicting variable names
    commands = commands.map((cmd: string) => {
      let sanitized = cmd;
      for (const [bad, good] of Object.entries(nameMap)) {
        const regex = new RegExp(`\\b${bad}\\b`, "g");
        sanitized = sanitized.replace(regex, good);
      }
      return sanitized;
    });

    return NextResponse.json({
      analysis: {
        ...analysisResult,
        desmosExprs: [],
        ggbCommands: commands,
        description: ggbResult.description || analysisResult.description || "",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `服务器错误: ${error instanceof Error ? error.message : "未知错误"}`,
      },
      { status: 500 }
    );
  }
}
