export interface ToolResult {
  originalInput: string;
  refinedPrompt: string;
  selectedTool: string;
  toolOutput: string;
  finalMessage: string;
  confidence: number;
  metadata?: {
    processingTime?: number;
    toolVersion?: string;
    additionalInfo?: string;
  };
}

export interface ToolClassification {
  tool: string;
  confidence: number;
  reasoning: string;
  parameters?: Record<string, any>;
}