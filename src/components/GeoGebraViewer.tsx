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
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const loadedDataId = useRef<string | null>(null);

  const injectGeoGebra = useCallback(() => {
    if (!containerRef.current) return;
    const dataId = ggbCommands.join(",");
    if (loadedDataId.current === dataId) return;
    loadedDataId.current = dataId;

    containerRef.current.innerHTML = "";

    const appletDiv = document.createElement("div");
    appletDiv.id = "ggb-applet";
    containerRef.current.appendChild(appletDiv);

    const ggbApp = new (window as any).GGBApplet(
      {
        appName: "classic",
        width: 800,
        height: 500,
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
            ggbCommands.forEach((cmd) => {
              try {
                const success = api.evalCommand(cmd);
                if (!success) console.warn("GGB command failed:", cmd);
              } catch (e) {
                console.error("GGB command error:", cmd, e);
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
  }, [ggbCommands]);

  useEffect(() => {
    if (typeof (window as any).GGBApplet === "undefined") {
      const script = document.createElement("script");
      script.src = "https://www.geogebra.org/apps/deployggb.js";
      script.async = true;
      script.onload = () => injectGeoGebra();
      document.head.appendChild(script);
    } else {
      injectGeoGebra();
    }
  }, [injectGeoGebra]);

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

      <div ref={containerRef} className="w-full flex items-center justify-center bg-gray-50 min-h-[500px]">
        {!loaded && (
          <div className="text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>加载 GeoGebra...</p>
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
