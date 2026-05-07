"use client";

import { useRef, useState, useCallback } from "react";

interface PhotoCaptureProps {
  onCapture: (dataUrl: string) => void;
  loading: boolean;
}

export default function PhotoCapture({ onCapture, loading }: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        onCapture(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [onCapture]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) processFile(file);
          break;
        }
      }
    },
    [processFile]
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border" onPaste={handlePaste}>
      <h2 className="text-lg font-semibold mb-4">📷 拍照上传物理题目</h2>

      {preview ? (
        <div className="space-y-3">
          <img
            src={preview}
            alt="preview"
            className="w-full max-h-64 object-contain rounded-lg border"
          />
          <button
            onClick={() => {
              setPreview(null);
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
          >
            重新选择
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <div className="text-4xl mb-3">📸</div>
          <p className="text-gray-800 font-medium">拖拽图片到此处，或点击下方按钮</p>
          <p className="text-sm text-gray-700 mt-1">支持拍照、相册选择、截图粘贴</p>
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? "分析中..." : "📁 选择图片"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
