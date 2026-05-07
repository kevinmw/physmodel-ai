import { NextRequest, NextResponse } from "next/server";
import type { DesmosExpr } from "@/lib/desmosTemplates";

interface ApiConfig {
  llmUrl: string;
  llmKey: string;
  llmModel: string;
  vlmUrl: string;
  vlmKey: string;
  vlmModel: string;
  desmosKey: string;
}

function buildSystemPrompt(
  physicsType: string,
  knownValues: Record<string, number>
): string {
  return `你是一个Desmos表达式编辑器，专门为高中物理动态模型服务。

当前模型的物理类型: ${physicsType}
已知参数: ${JSON.stringify(knownValues)}

规则：
1. 返回完整的表达式数组，不只是修改过的
2. 保持原有的 id 不变（除非新增或删除表达式）
3. 新增表达式时，使用唯一的 id（如 "expr_1", "slider_1"）
4. LaTeX 必须是有效的 Desmos 语法：\\frac{}{}, \\sqrt{}, \\sin, \\cos, 下标用 _{}
5. 滑块表达式格式: 变量名=值，需要有合理的 sliderBounds
6. 参数曲线格式: (x表达式, y表达式)，需要有 parametricDomain
7. 颜色值: "#2d70b3"(蓝), "#c74440"(红), "#388c51"(绿), "#6042a6"(紫), "#fa7e19"(橙), "#000000"(黑)
8. 用户请求无关的表达式不要改动
9. 修改一个影响全局的参数时（如滑块值），同步更新依赖它的所有表达式
10. 只返回合法 JSON，不要使用 markdown 代码块

返回格式:
{
  "expressions": [{ "id": "...", "latex": "...", ... }, ...],
  "explanation": "简短说明修改了什么"
}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expressions, physicsType, knownValues, prompt } = body;

    if (!expressions || !prompt) {
      return NextResponse.json(
        { error: "缺少必要参数: expressions, prompt" },
        { status: 400 }
      );
    }

    const configStr = request.headers.get("x-api-config");
    let config: ApiConfig | null = null;
    try {
      config = configStr ? JSON.parse(configStr) : null;
    } catch {
      config = null;
    }

    if (!config || !config.llmUrl || !config.llmKey) {
      return NextResponse.json(
        { error: "请先在设置中配置LLM的API地址和密钥" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(physicsType, knownValues || {});

    const contextLines = expressions
      .map(
        (e: DesmosExpr) =>
          `{ id: "${e.id}", latex: "${e.latex}"${e.sliderBounds ? `, sliderBounds: {min:${e.sliderBounds.min}, max:${e.sliderBounds.max}, step:${e.sliderBounds.step}}` : ""}${e.parametricDomain ? `, parametricDomain: {min:${e.parametricDomain.min}, max:${e.parametricDomain.max}}` : ""}${e.color ? `, color: "${e.color}"` : ""}${e.playing ? `, playing: true` : ""}${e.hidden ? `, hidden: true` : ""} }`
      )
      .join("\n");

    const userMessage = `当前表达式列表：
${contextLines}

用户指令：${prompt}

请根据用户指令修改表达式，返回完整的表达式数组。`;

    const llmResponse = await fetch(config.llmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.llmKey}`,
      },
      body: JSON.stringify({
        model: config.llmModel || "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 3000,
        temperature: 0.2,
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

    let result;
    try {
      // Try to extract JSON from the response
      const match = llmContent.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        result = { expressions: expressions, explanation: llmContent };
      }
    } catch {
      return NextResponse.json(
        { error: `AI返回的格式有误，无法解析JSON: ${llmContent.slice(0, 200)}` },
        { status: 500 }
      );
    }

    if (!result.expressions || !Array.isArray(result.expressions)) {
      return NextResponse.json(
        { error: "AI返回的表达式格式无效" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      expressions: result.expressions as DesmosExpr[],
      explanation: result.explanation || "已根据指令更新表达式",
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
