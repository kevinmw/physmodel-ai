"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { DesmosExpr } from "@/lib/desmosTemplates";

interface ChatMessage {
  role: "user" | "assistant" | "error";
  content: string;
}

interface AIAssistantPanelProps {
  expressions: DesmosExpr[];
  physicsType: string;
  knownValues: Record<string, number>;
  onApply: (expressions: DesmosExpr[]) => void;
}

export default function AIAssistantPanel({
  expressions,
  physicsType,
  knownValues,
  onApply,
}: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingExprs, setPendingExprs] = useState<DesmosExpr[] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    setPendingExprs(null);

    try {
      const saved = localStorage.getItem("physmodel_api_config");
      const apiConfig = saved ? JSON.parse(saved) : {};

      const response = await fetch("/api/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-config": JSON.stringify(apiConfig),
        },
        body: JSON.stringify({
          expressions,
          physicsType,
          knownValues,
          prompt: userMsg,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "请求失败");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.explanation },
      ]);
      setPendingExprs(data.expressions);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: err instanceof Error ? err.message : "未知错误",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, expressions, physicsType, knownValues]);

  const handleApply = useCallback(() => {
    if (pendingExprs) {
      onApply(pendingExprs);
      setPendingExprs(null);
    }
  }, [pendingExprs, onApply]);

  const handleDiscard = useCallback(() => {
    setPendingExprs(null);
  }, []);

  return (
    <div className="flex flex-col h-full border-t bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : msg.role === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-400">
              AI 思考中...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Pending changes bar */}
      {pendingExprs && (
        <div className="flex items-center justify-between px-3 py-2 bg-green-50 border-t border-green-200">
          <span className="text-sm text-green-800">
            AI 已生成修改方案，点击"应用"生效
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleDiscard}
              className="px-3 py-1 text-xs bg-white text-gray-600 rounded-lg border hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              应用修改
            </button>
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-t bg-gray-50 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="用自然语言描述想做的修改，如'把初速度改成30'..."
          className="flex-1 text-sm px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? "发送中..." : "发送"}
        </button>
      </div>
    </div>
  );
}
