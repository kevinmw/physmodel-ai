"use client";

import { useState, useCallback, useEffect } from "react";
import ExpressionEditor from "./ExpressionEditor";
import AIAssistantPanel from "./AIAssistantPanel";
import DesmosViewer from "./DesmosViewer";
import type { DesmosExpr } from "@/lib/desmosTemplates";

interface HistoryItem {
  id: string;
  timestamp: number;
  thumbnail: string;
  analysis: {
    ocrText: string;
    concepts: string[];
    knownValues: Record<string, number>;
    forces: string[];
    physicsType: string;
    desmosExprs: DesmosExpr[];
    viewport?: { left: number; right: number; top: number; bottom: number };
    description: string;
  };
}

interface EditPanelProps {
  historyItem: HistoryItem;
  onSave: (item: HistoryItem, mode: "overwrite" | "new") => void;
  onCancel: () => void;
}

export default function EditPanel({
  historyItem,
  onSave,
  onCancel,
}: EditPanelProps) {
  const analysis = historyItem.analysis;

  const [editExprs, setEditExprs] = useState<DesmosExpr[]>(
    analysis.desmosExprs || []
  );
  const [previewExprs, setPreviewExprs] = useState<DesmosExpr[]>(
    analysis.desmosExprs || []
  );
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  // Throttle preview updates to avoid Desmos calculator thrashing
  useEffect(() => {
    const timer = setTimeout(() => setPreviewExprs(editExprs), 500);
    return () => clearTimeout(timer);
  }, [editExprs]);

  // Close save menu on outside click
  useEffect(() => {
    if (!showSaveMenu) return;
    const handler = () => setShowSaveMenu(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showSaveMenu]);

  const handleApplyAI = useCallback((exprs: DesmosExpr[]) => {
    setEditExprs(exprs);
  }, []);

  const handleSave = useCallback(
    (mode: "overwrite" | "new") => {
      const updatedItem: HistoryItem = {
        ...historyItem,
        analysis: {
          ...analysis,
          desmosExprs: editExprs,
        },
        ...(mode === "new"
          ? { id: Date.now().toString(), timestamp: Date.now() }
          : {}),
      };
      onSave(updatedItem, mode);
    },
    [historyItem, analysis, editExprs, onSave]
  );

  const exprCount = editExprs.length;
  const sliderCount = editExprs.filter((e) => e.sliderBounds).length;
  const hiddenCount = editExprs.filter((e) => e.hidden).length;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-1 text-gray-700 hover:text-gray-900 text-sm"
          >
            ← 返回
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              编辑: {analysis.description || analysis.physicsType}
            </h2>
            <div className="flex gap-2 text-xs text-gray-800">
              <span>{exprCount} 个表达式</span>
              {sliderCount > 0 && <span>{sliderCount} 个滑块</span>}
              {hiddenCount > 0 && <span>{hiddenCount} 个隐藏</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSaveMenu(!showSaveMenu);
              }}
              className="px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
              保存 ▾
            </button>
            {showSaveMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-[160px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave("overwrite");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-t-lg"
                >
                  覆盖原记录
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave("new");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-b-lg border-t"
                >
                  另存为新记录
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onCancel}
            className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            取消
          </button>
        </div>
      </div>

      {/* Main content: split view */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: ExpressionEditor */}
        <div className="w-1/2 flex flex-col border-r overflow-hidden">
          <ExpressionEditor
            expressions={editExprs}
            onChange={setEditExprs}
          />
        </div>

        {/* Right: DesmosViewer live preview */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <DesmosViewer
            expressions={previewExprs}
            physicsType={analysis.physicsType}
            viewport={analysis.viewport}
            editable
          />
        </div>
      </div>

      {/* Bottom: AI Assistant */}
      <div className="h-[140px] shrink-0 overflow-hidden">
        <AIAssistantPanel
          expressions={editExprs}
          physicsType={analysis.physicsType}
          knownValues={analysis.knownValues || {}}
          onApply={handleApplyAI}
        />
      </div>
    </div>
  );
}
