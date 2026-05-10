import type { TemplateFn, TemplateResult, DesmosExpr, Viewport3D } from "./types";
import { kinematicsTemplates } from "./kinematics";
import { dynamicsTemplates } from "./dynamics";
import { oscillationsTemplates } from "./oscillations";
import { emTemplates } from "./em";
import { opticsTemplates } from "./optics";

const TEMPLATES: Record<string, TemplateFn> = {
  ...kinematicsTemplates,
  ...dynamicsTemplates,
  ...oscillationsTemplates,
  ...emTemplates,
  ...opticsTemplates,
};

export function getDesmosExpressions(
  physicsType: string,
  knownValues: Record<string, number>,
  forces?: string[]
): TemplateResult | null {
  const template = TEMPLATES[physicsType];
  if (!template) return null;
  return template(knownValues || {}, forces);
}

export function isSupportedType(physicsType: string): boolean {
  return physicsType in TEMPLATES;
}

export const SUPPORTED_TYPES = Object.keys(TEMPLATES);

export type { DesmosExpr, Viewport3D, TemplateResult, TemplateFn };
