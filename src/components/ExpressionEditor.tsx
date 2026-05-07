"use client";

import { useState, useCallback } from "react";
import type { DesmosExpr } from "@/lib/desmosTemplates";

interface ExpressionEditorProps {
  expressions: DesmosExpr[];
  onChange: (expressions: DesmosExpr[]) => void;
}

let idCounter = 1000;
function nextId(base: string): string {
  return `${base}_${++idCounter}`;
}

export default function ExpressionEditor({
  expressions,
  onChange,
}: ExpressionEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateExpr = useCallback(
    (id: string, patch: Partial<DesmosExpr>) => {
      onChange(expressions.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    },
    [expressions, onChange]
  );

  const deleteExpr = useCallback(
    (id: string) => {
      onChange(expressions.filter((e) => e.id !== id));
    },
    [expressions, onChange]
  );

  const moveExpr = useCallback(
    (index: number, direction: -1 | 1) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= expressions.length) return;
      const arr = [...expressions];
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      onChange(arr);
    },
    [expressions, onChange]
  );

  const addExpr = useCallback(() => {
    onChange([
      ...expressions,
      { id: nextId("expr"), latex: "", color: "#000000" },
    ]);
  }, [expressions, onChange]);

  const addSlider = useCallback(() => {
    onChange([
      ...expressions,
      {
        id: nextId("slider"),
        latex: "a=1",
        sliderBounds: { min: 0, max: 10, step: 0.1 },
        color: "#2d70b3",
      },
    ]);
  }, [expressions, onChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50 shrink-0">
        <span className="text-sm font-medium text-gray-800">
          表达式 ({expressions.length})
        </span>
        <div className="flex gap-1">
          <button
            onClick={addSlider}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            + 滑块
          </button>
          <button
            onClick={addExpr}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            + 表达式
          </button>
        </div>
      </div>

      {/* Expression List */}
      <div className="flex-1 overflow-y-auto">
        {expressions.map((expr, i) => (
          <div
            key={expr.id}
            className={`border-b last:border-b-0 ${
              expr.hidden ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start gap-2 px-3 py-2">
              {/* Number badge */}
              <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 text-xs rounded-full mt-0.5 font-medium">
                {i + 1}
              </span>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                {/* LaTeX input */}
                <textarea
                  value={expr.latex}
                  onChange={(e) => updateExpr(expr.id, { latex: e.target.value })}
                  className="w-full text-sm font-mono text-gray-900 bg-transparent border border-transparent focus:border-blue-300 rounded px-2 py-1 resize-none focus:outline-none placeholder:text-gray-800"
                  rows={Math.max(1, expr.latex.split("\n").length)}
                  placeholder="输入 LaTeX 公式..."
                />

                {/* Quick toggles */}
                <div className="flex gap-2 mt-1">
                  {expr.sliderBounds && (
                    <span className="text-xs text-gray-800 font-medium">
                      滑块 [{expr.sliderBounds.min}~{expr.sliderBounds.max}]
                    </span>
                  )}
                  {expr.parametricDomain && (
                    <span className="text-xs text-gray-800 font-medium">
                      参数 t∈[{expr.parametricDomain.min},{expr.parametricDomain.max}]
                    </span>
                  )}
                  {expr.playing && (
                    <span className="text-xs bg-green-100 text-green-700 px-1 rounded">
                      动画
                    </span>
                  )}
                </div>
              </div>

              {/* Row actions */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() =>
                    updateExpr(expr.id, { hidden: !expr.hidden })
                  }
                  className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
                    expr.hidden
                      ? "bg-gray-100 text-gray-800"
                      : "bg-green-100 text-green-700"
                  }`}
                  title={expr.hidden ? "显示" : "隐藏"}
                >
                  {expr.hidden ? "👁" : "👁️"}
                </button>
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === expr.id ? null : expr.id
                    )
                  }
                  className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
                    expandedId === expr.id
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  title="高级设置"
                >
                  ⚙
                </button>
                <button
                  onClick={() => moveExpr(i, -1)}
                  disabled={i === 0}
                  className="w-6 h-6 flex items-center justify-center rounded text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-30"
                  title="上移"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveExpr(i, 1)}
                  disabled={i === expressions.length - 1}
                  className="w-6 h-6 flex items-center justify-center rounded text-xs text-gray-800 hover:bg-gray-100 disabled:opacity-30"
                  title="下移"
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteExpr(expr.id)}
                  className="w-6 h-6 flex items-center justify-center rounded text-xs text-gray-800 hover:bg-red-100 hover:text-red-500"
                  title="删除"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Advanced settings */}
            {expandedId === expr.id && (
              <div className="px-3 pb-2 pl-11 bg-gray-50">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Color */}
                  <div>
                    <label className="block text-gray-700 mb-1">颜色</label>
                    <div className="flex gap-1">
                      {["#2d70b3", "#c74440", "#388c51", "#6042a6", "#fa7e19", "#000000"].map(
                        (c) => (
                          <button
                            key={c}
                            onClick={() => updateExpr(expr.id, { color: c })}
                            className={`w-5 h-5 rounded-full border-2 ${
                              expr.color === c
                                ? "border-gray-800 scale-110"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* Slider bounds */}
                  {expr.sliderBounds && (
                    <>
                      <div>
                        <label className="block text-gray-700 mb-1">最小值</label>
                        <input
                          type="number"
                          value={expr.sliderBounds.min}
                          onChange={(e) =>
                            updateExpr(expr.id, {
                              sliderBounds: {
                                ...expr.sliderBounds!,
                                min: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full px-2 py-1 border rounded text-sm text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">最大值</label>
                        <input
                          type="number"
                          value={expr.sliderBounds.max}
                          onChange={(e) =>
                            updateExpr(expr.id, {
                              sliderBounds: {
                                ...expr.sliderBounds!,
                                max: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full px-2 py-1 border rounded text-sm text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">步长</label>
                        <input
                          type="number"
                          value={expr.sliderBounds.step}
                          onChange={(e) =>
                            updateExpr(expr.id, {
                              sliderBounds: {
                                ...expr.sliderBounds!,
                                step: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full px-2 py-1 border rounded text-sm text-gray-900"
                        />
                      </div>
                    </>
                  )}

                  {/* Parametric domain */}
                  {expr.parametricDomain && (
                    <>
                      <div>
                        <label className="block text-gray-700 mb-1">
                          t 最小值
                        </label>
                        <input
                          type="text"
                          value={expr.parametricDomain.min}
                          onChange={(e) =>
                            updateExpr(expr.id, {
                              parametricDomain: {
                                ...expr.parametricDomain!,
                                min: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2 py-1 border rounded text-sm font-mono text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1">
                          t 最大值
                        </label>
                        <input
                          type="text"
                          value={expr.parametricDomain.max}
                          onChange={(e) =>
                            updateExpr(expr.id, {
                              parametricDomain: {
                                ...expr.parametricDomain!,
                                max: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2 py-1 border rounded text-sm font-mono text-gray-900"
                        />
                      </div>
                    </>
                  )}

                  {/* Playing toggle */}
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={expr.playing || false}
                        onChange={(e) =>
                          updateExpr(expr.id, { playing: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span className="text-gray-800">动画播放</span>
                    </label>
                  </div>

                  {/* Hidden toggle */}
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={expr.hidden || false}
                        onChange={(e) =>
                          updateExpr(expr.id, { hidden: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span className="text-gray-800">隐藏</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {expressions.length === 0 && (
          <div className="p-8 text-center text-gray-800 text-sm">
            暂无表达式，点击上方按钮添加
          </div>
        )}
      </div>
    </div>
  );
}
