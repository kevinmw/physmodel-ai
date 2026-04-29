"use client";

interface AnalysisPanelProps {
  analysis: {
    ocrText?: string;
    concepts?: string[];
    knownValues?: Record<string, number>;
    forces?: string[];
    physicsType?: string;
    description?: string;
  } | null;
}

export default function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  if (!analysis) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
      <h2 className="text-lg font-semibold">🤖 AI 分析结果</h2>

      {analysis.ocrText && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">📝 识别文字</h3>
          <p className="text-sm bg-gray-50 p-3 rounded-lg">{analysis.ocrText}</p>
        </div>
      )}

      {analysis.concepts && analysis.concepts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">💡 物理概念</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.concepts.map((c, i) => (
              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {analysis.knownValues && Object.keys(analysis.knownValues).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">📊 已知量</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(analysis.knownValues).map(([k, v]) => (
              <span key={k} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                {k} = {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {analysis.forces && analysis.forces.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">→ 受力分析</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.forces.map((f, i) => (
              <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {analysis.description && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">📖 场景描述</h3>
          <p className="text-sm text-gray-600">{analysis.description}</p>
        </div>
      )}
    </div>
  );
}
