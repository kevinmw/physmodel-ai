"use client";

import { useState, useEffect } from "react";

interface ApiConfig {
  vlmUrl: string;
  vlmKey: string;
  vlmModel: string;
  llmUrl: string;
  llmKey: string;
  llmModel: string;
  desmosKey: string;
}

const DEFAULT_CONFIG: ApiConfig = {
  vlmUrl: "",
  vlmKey: "",
  vlmModel: "gpt-4o",
  llmUrl: "",
  llmKey: "",
  llmModel: "gpt-4o",
  desmosKey: "",
};

interface ApiConfigDialogProps {
  onClose: () => void;
}

export default function ApiConfigDialog({ onClose }: ApiConfigDialogProps) {
  const [config, setConfig] = useState<ApiConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem("physmodel_api_config");
    if (savedConfig) {
      try {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) });
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("physmodel_api_config", JSON.stringify(config));
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleChange = (field: keyof ApiConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">⚙️ API 配置</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-700"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          配置视觉语言模型（VLM）和文本语言模型（LLM）的API地址和密钥。
          支持所有兼容OpenAI API格式的服务。
        </p>

        {/* VLM Config */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-blue-600 mb-3">👁️ 视觉语言模型 (VLM)</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">API 地址</label>
              <input
                type="url"
                value={config.vlmUrl}
                onChange={(e) => handleChange("vlmUrl", e.target.value)}
                placeholder="https://api.openai.com/v1/chat/completions"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">API 密钥</label>
              <input
                type="password"
                value={config.vlmKey}
                onChange={(e) => handleChange("vlmKey", e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">模型名称</label>
              <input
                type="text"
                value={config.vlmModel}
                onChange={(e) => handleChange("vlmModel", e.target.value)}
                placeholder="gpt-4o"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* LLM Config */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-purple-600 mb-3">💬 文本语言模型 (LLM) <span className="text-xs font-normal text-gray-700">可选 - 仅用于未识别的物理类型</span></h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">API 地址</label>
              <input
                type="url"
                value={config.llmUrl}
                onChange={(e) => handleChange("llmUrl", e.target.value)}
                placeholder="https://api.openai.com/v1/chat/completions"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">API 密钥</label>
              <input
                type="password"
                value={config.llmKey}
                onChange={(e) => handleChange("llmKey", e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">模型名称</label>
              <input
                type="text"
                value={config.llmModel}
                onChange={(e) => handleChange("llmModel", e.target.value)}
                placeholder="gpt-4o"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!config.vlmUrl || !config.vlmKey}
            className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
          >
            {saved ? "✅ 已保存" : "保存配置"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            取消
          </button>
        </div>

        {/* Desmos Config */}
        <div className="mb-6 mt-6 pt-6 border-t">
          <h3 className="text-sm font-semibold text-green-600 mb-3">
            📊 Desmos API Key <span className="text-xs font-normal text-gray-700">免费 - 用于渲染动态模型</span>
          </h3>
          <p className="text-xs text-gray-700 mb-2">
            在 <a href="https://www.desmos.com/my-api" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">desmos.com/my-api</a> 免费注册获取（选择 School/Personal Project）
          </p>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">API Key</label>
            <input
              type="text"
              value={config.desmosKey}
              onChange={(e) => handleChange("desmosKey", e.target.value)}
              placeholder="dcb31709b452b1cf..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
