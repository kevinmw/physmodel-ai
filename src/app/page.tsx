"use client";

import { useState, useCallback } from "react";
import PhotoCapture from "@/components/PhotoCapture";
import AnalysisPanel from "@/components/AnalysisPanel";
import GeoGebraViewer from "@/components/GeoGebraViewer";
import ExampleProblems from "@/components/ExampleProblems";
import ApiConfigDialog from "@/components/ApiConfigDialog";

interface PhysicsAnalysis {
  ocrText: string;
  concepts: string[];
  knownValues: Record<string, number>;
  forces: string[];
  physicsType: string;
  ggbCommands: string[];
  description: string;
}

interface HistoryItem {
  id: string;
  timestamp: number;
  thumbnail: string;
  analysis: PhysicsAnalysis;
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PhysicsAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "analysis" | "model">("upload");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);

  const checkApiConfig = useCallback(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("physmodel_api_config");
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setApiConfigured(!!(config.vlmUrl && config.vlmKey && config.llmUrl && config.llmKey));
      } catch {
        setApiConfigured(false);
      }
    }
  }, []);

  // Check API config on mount
  useState(() => {
    checkApiConfig();
  });

  const handleImageCapture = useCallback(async (dataUrl: string) => {
    setImageUrl(dataUrl);
    setLoading(true);
    setError(null);
    setActiveTab("analysis");

    try {
      const saved = localStorage.getItem("physmodel_api_config");
      const apiConfig = saved ? JSON.parse(saved) : {};

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-config": JSON.stringify(apiConfig),
        },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "分析失败");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setActiveTab("model");
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析失败，请检查API配置");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleExampleSelect = useCallback(
    (example: { analysis: PhysicsAnalysis }) => {
      setAnalysis(example.analysis);
      setImageUrl(null);
      setActiveTab("model");
    },
    []
  );

  const handleSaveToHistory = useCallback(() => {
    if (!analysis) return;
    const item: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      thumbnail: imageUrl || "",
      analysis,
    };
    setHistory((prev) => [item, ...prev]);
  }, [analysis, imageUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              ⚛
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PhysModel AI</h1>
              <p className="text-xs text-gray-500">高中物理动态模型生成器</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!apiConfigured && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full animate-pulse">
                请先配置API
              </span>
            )}
            <button
              onClick={() => setShowApiConfig(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
            >
              ⚙️ API设置
            </button>
          </div>
        </div>
      </header>

      {/* API Config Dialog */}
      {showApiConfig && (
        <ApiConfigDialog
          onClose={() => {
            setShowApiConfig(false);
            checkApiConfig();
          }}
        />
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "upload", label: "📷 拍照上传", desc: "拍摄物理题目" },
            { key: "analysis", label: "🤖 AI分析", desc: "理解物理场景" },
            { key: "model", label: "⚙️ 动态模型", desc: "交互式动画" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 py-3 px-4 rounded-xl text-left transition-all ${
                activeTab === tab.key
                  ? "bg-white shadow-md border-2 border-blue-500"
                  : "bg-white/60 border border-gray-200 hover:bg-white/80"
              }`}
            >
              <div className="font-semibold text-sm">{tab.label}</div>
              <div className="text-xs text-gray-500">{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "upload" && (
          <div className="space-y-6">
            <PhotoCapture onCapture={handleImageCapture} loading={loading} />
            <ExampleProblems onSelect={handleExampleSelect} />
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-4">
            {loading && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">AI 正在分析物理题目...</p>
                <p className="text-sm text-gray-400 mt-1">
                  识别文字 → 理解物理场景 → 生成模型数据
                </p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 font-medium">❌ {error}</p>
              </div>
            )}
            <AnalysisPanel analysis={analysis} />
          </div>
        )}

        {activeTab === "model" && (
          <div className="space-y-4">
            <AnalysisPanel analysis={analysis} />
            <GeoGebraViewer
              ggbCommands={analysis?.ggbCommands || []}
              physicsType={analysis?.physicsType || ""}
            />
            {analysis && (
              <div className="flex gap-3">
                <button
                  onClick={handleSaveToHistory}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                >
                  💾 保存到历史
                </button>
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">📜 历史记录</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setAnalysis(item.analysis);
                    setActiveTab("model");
                  }}
                  className="bg-white rounded-xl p-3 shadow-sm border text-left hover:shadow-md transition-shadow"
                >
                  <div className="font-medium text-sm">{item.analysis.physicsType}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
