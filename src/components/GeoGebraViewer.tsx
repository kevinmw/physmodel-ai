"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface GeoGebraViewerProps {
  ggbCommands: string[];
  physicsType: string;
}

declare global {
  interface Window {
    ggbApplet?: {
      evalCommand: (cmd: string) => boolean;
      setAnimating: (obj: string, anim: boolean) => void;
      startAnimation: () => void;
      stopAnimation: () => void;
      reset: () => void;
      exists: (obj: string) => boolean;
      getAllObjectNames: (type: number) => string[];
    };
  }
}

export default function GeoGebraViewer({ ggbCommands, physicsType }: GeoGebraViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appletRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const loadedDataId = useRef<string | null>(null);

  const cleanupApplet = useCallback(() => {
    if (appletRef.current && appletRef.current.parentNode) {
      appletRef.current.parentNode.removeChild(appletRef.current);
    }
    appletRef.current = null;
  }, []);

  const injectGeoGebra = useCallback(() => {
    if (!containerRef.current) return;
    const dataId = ggbCommands.join(",");
    if (loadedDataId.current === dataId) return;
    loadedDataId.current = dataId;

    cleanupApplet();

    const container = containerRef.current;
    const w = container.clientWidth;
    const h = Math.max(500, Math.min(700, window.innerHeight * 0.6));

    const appletDiv = document.createElement("div");
    appletDiv.id = "ggb-applet";
    container.appendChild(appletDiv);
    appletRef.current = appletDiv;

    const ggbApp = new (window as any).GGBApplet(
      {
        appName: "classic",
        width: w,
        height: h,
        showToolBar: false,
        showAlgebraInput: false,
        showMenuBar: false,
        allowStyleBar: false,
        showLogging: false,
        useBrowserForJS: false,
        allowUpscaling: true,
        capturingThreshold: null,
        enableFileFeatures: false,
        enablingJavaScript: false,
        appletOnLoad: (api: any) => {
          setLoaded(true);
          if (ggbCommands.length > 0) {
            const nameMap: Record<string, string> = {
              spring: "s1", mass: "m0", force: "f0", gravity: "g0",
              friction: "fr0", velocity: "vel", acceleration: "acc",
              energy: "e0", momentum: "mom", block: "blk", ball: "b0",
              wall: "w0", ground: "gnd", start: "s0", top: "t0",
              bottom: "bt0", pivot: "p0", bob: "b1",
            };
            const sanitized = ggbCommands.map((cmd) => {
              let s = cmd;
              for (const [bad, good] of Object.entries(nameMap)) {
                s = s.replace(new RegExp(`\\b${bad}\\b`, "g"), good);
              }
              // Skip commands that don't work in embed API
              if (/\w+\.\w+/.test(s) && !s.includes("Slider")) return null;
              if (/\bSegment\b/i.test(s)) return null;
              if (/\bVector\b/i.test(s)) return null;
              if (/\bLine\b/i.test(s) && !s.includes("Slider")) return null;
              return s;
            }).filter(Boolean) as string[];

            sanitized.forEach((cmd) => {
              try {
                api.evalCommand(cmd);
              } catch {
                // GeoGebra embed API may reject some commands silently
              }
            });
            try {
              api.startAnimation();
              setIsPlaying(true);
            } catch {
              // ignore
            }
          }
        },
      },
      true
    );
    ggbApp.inject("ggb-applet");
  }, [ggbCommands, cleanupApplet]);

  useEffect(() => {
    setLoaded(false);
    const loadAndInject = () => {
      if (typeof (window as any).GGBApplet === "undefined") {
        const existingScript = document.querySelector('script[src*="deployggb.js"]');
        if (existingScript) {
          existingScript.addEventListener("load", () => injectGeoGebra());
        } else {
          const script = document.createElement("script");
          script.src = "https://www.geogebra.org/apps/deployggb.js";
          script.async = true;
          script.onload = () => injectGeoGebra();
          document.head.appendChild(script);
        }
      } else {
        injectGeoGebra();
      }
    };
    loadAndInject();
    return () => {
      cleanupApplet();
    };
  }, [injectGeoGebra, cleanupApplet]);

  const handlePlay = useCallback(() => {
    if (window.ggbApplet) {
      if (isPlaying) {
        window.ggbApplet.stopAnimation();
        setIsPlaying(false);
      } else {
        window.ggbApplet.startAnimation();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const handleReset = useCallback(() => {
    loadedDataId.current = null;
    setLoaded(false);
    setIsPlaying(false);
    injectGeoGebra();
  }, [injectGeoGebra]);

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

  if (ggbCommands.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border text-center text-gray-400">
        请先拍照分析物理题目
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">⚙️ 动态物理模型</h2>
          <p className="text-xs text-gray-500">{physicsType || "自定义模型"}</p>
        </div>
        <div className="flex gap-2">
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
          <div className="text-center text-gray-400 absolute inset-0 flex items-center justify-center bg-gray-50 z-10 pointer-events-none">
            <div>
              <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Loading GeoGebra...</p>
            </div>
          </div>
        )}
      </div>

      {ggbCommands.length > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <details>
            <summary className="text-sm font-medium text-gray-600 cursor-pointer">
              查看 GeoGebra 命令
            </summary>
            <pre className="mt-2 text-xs bg-white p-3 rounded-lg overflow-x-auto">
              {ggbCommands.map((cmd, i) => (
                <div key={i} className="py-0.5">
                  <span className="text-gray-400">{i + 1}.</span> {cmd}
                </div>
              ))}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
