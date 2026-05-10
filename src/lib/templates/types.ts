export interface DesmosExpr {
  id: string;
  latex: string;
  sliderBounds?: { min: number; max: number; step: number };
  parametricDomain?: { min: string; max: string };
  color?: string;
  hidden?: boolean;
  label?: string;
  showLabel?: boolean;
  pointStyle?: string;
  lineStyle?: string;
  playing?: boolean;
}

export interface Viewport3D {
  xMin: number; xMax: number;
  yMin: number; yMax: number;
  zMin: number; zMax: number;
}

export interface TemplateResult {
  expressions: DesmosExpr[];
  viewport?: { left: number; right: number; top: number; bottom: number };
  viewport3d?: Viewport3D;
  dimension?: '2d' | '3d';
}

export type TemplateFn = (kv: Record<string, number>, forces?: string[]) => TemplateResult;
