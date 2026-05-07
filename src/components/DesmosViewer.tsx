"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { DesmosExpr, Viewport3D } from "@/lib/desmosTemplates";

interface DesmosViewerProps {
  expressions: DesmosExpr[];
  physicsType: string;
  viewport?: { left: number; right: number; top: number; bottom: number };
  viewport3d?: Viewport3D;
  dimension?: '2d' | '3d';
  editable?: boolean;
}

declare global {
  interface Window {
    Desmos?: any;
  }
}

export default function DesmosViewer({
  expressions,
  physicsType,
  viewport,
  viewport3d,
  dimension = '2d',
  editable = false,
}: DesmosViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calcEltRef = useRef<HTMLDivElement | null>(null);
  const calculatorRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [showForces, setShowForces] = useState(true);
  const loadedExprsId = useRef<string | null>(null);

  const destroyCalc = useCallback(() => {
    if (calculatorRef.current) {
      try {
        calculatorRef.current.destroy();
      } catch {}
      calculatorRef.current = null;
    }
    if (calcEltRef.current && calcEltRef.current.parentNode) {
      calcEltRef.current.parentNode.removeChild(calcEltRef.current);
      calcEltRef.current = null;
    }
  }, []);

  const initCalculator = useCallback(() => {
    if (!containerRef.current || !window.Desmos) return;

    const exprsId = `${dimension}|${editable
      ? expressions.map((e) => e.id).join("|")
      : expressions.map((e) => e.id + ":" + e.latex).join("|")}`;
    if (exprsId === loadedExprsId.current && calculatorRef.current) return;
    loadedExprsId.current = exprsId;

    destroyCalc();

    const elt = document.createElement("div");
    elt.style.width = "100%";
    elt.style.height = "500px";
    containerRef.current.appendChild(elt);
    calcEltRef.current = elt;

    const is3D = dimension === '3d';
    const CalculatorClass = is3D ? window.Desmos.Calculator3D : window.Desmos.GraphingCalculator;
    const calculator = CalculatorClass(elt, {
      keypad: false,
      expressions: true,
      expressionsTopbar: false,
      settingsMenu: false,
      zoomButtons: true,
      border: false,
      language: "zh-CN",
      autosize: true,
    });
    calculatorRef.current = calculator;

    expressions.forEach((expr) => {
      try {
        calculator.setExpression(expr);
      } catch (e) {
        console.warn("Desmos setExpression error:", e, expr);
      }
    });

    if (is3D && viewport3d) {
      setTimeout(() => {
        try {
          calculator.setMathBounds(viewport3d);
        } catch {}
      }, 200);
    } else if (viewport) {
      setTimeout(() => {
        try {
          calculator.setMathBounds(viewport);
        } catch {}
      }, 200);
    }

    setLoaded(true);
    setIsPlaying(true);
    setLoadError(false);
  }, [expressions, destroyCalc, viewport, viewport3d, dimension]);

  useEffect(() => {
    setLoaded(false);

    const loadScript = () => {
      if (window.Desmos) {
        initCalculator();
        return;
      }

      // Remove any previous failed Desmos script tags
      document.querySelectorAll('script[src*="desmos.com/api"]').forEach((s) => s.remove());

      let apiKey = "";
      try {
        const saved = localStorage.getItem("physmodel_api_config");
        if (saved) apiKey = JSON.parse(saved).desmosKey || "";
      } catch {}

      const apiVersion = dimension === '3d' ? 'v1.13/3d' : 'v1.12';
      const script = document.createElement("script");
      script.src = `https://www.desmos.com/api/${apiVersion}/calculator.js${apiKey ? "?apiKey=" + apiKey : ""}`;
      script.async = true;
      script.onload = () => {
        if (window.Desmos) {
          initCalculator();
        } else {
          setLoadError(true);
        }
      };
      script.onerror = () => setLoadError(true);
      document.head.appendChild(script);
    };

    if (expressions.length > 0) {
      loadScript();
    }

    return () => {
      destroyCalc();
    };
  }, [initCalculator, destroyCalc, expressions]);

  // Incremental updates when in editable mode (only latex/bounds changed, not ids)
  useEffect(() => {
    if (!editable || !calculatorRef.current || !loaded) return;
    expressions.forEach((expr) => {
      try {
        calculatorRef.current.setExpression(expr);
      } catch (e) {
        console.warn("Desmos setExpression error:", e, expr);
      }
    });
  }, [expressions, editable, loaded]);

  const handlePlay = useCallback(() => {
    if (!calculatorRef.current) return;
    const newState = !isPlaying;
    expressions.forEach((expr) => {
      if (expr.playing) {
        try {
          calculatorRef.current.setExpression({ id: expr.id, playing: newState });
        } catch {}
      }
    });
    setIsPlaying(newState);
  }, [isPlaying, expressions]);

  const handleReset = useCallback(() => {
    loadedExprsId.current = null;
    setLoaded(false);
    setIsPlaying(false);
    initCalculator();
  }, [initCalculator]);

  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  const handleToggleForces = useCallback(() => {
    if (!calculatorRef.current) return;
    const show = !showForces;
    expressions.forEach((expr) => {
      if (expr.id.startsWith("force_")) {
        try {
          calculatorRef.current.setExpression({ id: expr.id, hidden: !show });
        } catch {}
      }
    });
    setShowForces(show);
  }, [showForces, expressions]);

  const hasForces = expressions.some((e) => e.id.startsWith("force_"));

  if (expressions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border text-center text-gray-800">
        请先拍照分析物理题目
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
        <p className="text-red-500 mb-2">Desmos 加载失败</p>
        <p className="text-sm text-gray-800">请检查网络连接，或在 API 设置中配置 Desmos API Key</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Desmos 动态模型</h2>
            {dimension === '3d' && (
              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">3D</span>
            )}
          </div>
          <p className="text-xs text-gray-800">{physicsType || "自定义模型"}</p>
        </div>
        <div className="flex gap-2">
          {hasForces && (
            <button
              onClick={handleToggleForces}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                showForces ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-800"
              }`}
              title={showForces ? "隐藏力的矢量" : "显示力的矢量"}
            >
              {showForces ? "F on" : "F off"}
            </button>
          )}
          <button
            onClick={handlePlay}
            className="p-2 rounded-lg hover:bg-gray-100"
            title={isPlaying ? "暂停" : "播放"}
          >
            {isPlaying ? "⏸️" : "▶️"}
          </button>
          <button onClick={handleReset} className="p-2 rounded-lg hover:bg-gray-100" title="重置">
            🔄
          </button>
          <button
            onClick={handleFullscreen}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="全屏"
          >
            🔲
          </button>
        </div>
      </div>

      <div ref={containerRef} className="w-full bg-gray-50 relative" style={{ minHeight: "500px" }}>
        {!loaded && (
          <div className="text-center text-gray-800 absolute inset-0 flex items-center justify-center bg-gray-50 z-10 pointer-events-none">
            <div>
              <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Loading Desmos...</p>
            </div>
          </div>
        )}
      </div>

      {expressions.length > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <details>
            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
              查看 Desmos 表达式
            </summary>
            <pre className="mt-2 text-xs bg-white p-3 rounded-lg overflow-x-auto">
              {expressions.map((expr, i) => (
                <div key={expr.id} className="py-0.5">
                  <span className="text-gray-800">{i + 1}.</span>{" "}
                  <span className={expr.hidden ? "text-gray-600 line-through" : "text-gray-900"}>{expr.latex}</span>
                  {expr.sliderBounds &&
                    ` [${expr.sliderBounds.min} ~ ${expr.sliderBounds.max}]`}
                  {expr.parametricDomain &&
                    ` {${expr.parametricDomain.min} ~ ${expr.parametricDomain.max}}`}
                </div>
              ))}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
