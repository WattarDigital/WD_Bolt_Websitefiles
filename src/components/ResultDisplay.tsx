import React from 'react';
import { ToolResult } from '../types';
import { Copy, ExternalLink, Clock, Zap, CheckCircle } from 'lucide-react';

interface ResultDisplayProps {
  result: ToolResult;
  getToolIcon: (tool: string) => React.ReactNode;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, getToolIcon }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatToolOutput = () => {
    try {
      const parsed = JSON.parse(result.toolOutput);
      return parsed;
    } catch {
      return { raw_output: result.toolOutput };
    }
  };

  const toolOutput = formatToolOutput();
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const renderToolSpecificContent = () => {
    switch (result.selectedTool) {
      case 'canva':
        return (
          <div className="space-y-4">
            {toolOutput.preview_url && (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={toolOutput.preview_url} 
                  alt="Generated design preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Design ID</label>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded">{toolOutput.design_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Template</label>
                <p className="capitalize">{toolOutput.template_used}</p>
              </div>
            </div>
            {toolOutput.design_url && (
              <a 
                href={toolOutput.design_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
              >
                <ExternalLink className="w-4 h-4" />
                Edit in Canva
              </a>
            )}
          </div>
        );

      case 'openai-image':
        return (
          <div className="space-y-4">
            {toolOutput.image_url && (
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden max-w-md mx-auto">
                <img 
                  src={toolOutput.image_url} 
                  alt="AI generated image"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Style</label>
                <p className="capitalize">{toolOutput.style}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Resolution</label>
                <p>{toolOutput.resolution}</p>
              </div>
            </div>
          </div>
        );

      case 'veo3-video':
        return (
          <div className="space-y-4">
            {toolOutput.thumbnail_url && (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={toolOutput.thumbnail_url} 
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-8 border-l-white border-y-4 border-y-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Duration</label>
                <p>{toolOutput.duration}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Quality</label>
                <p className="capitalize">{toolOutput.quality}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">File Size</label>
                <p>{toolOutput.file_size}</p>
              </div>
            </div>
          </div>
        );

      case 'openai-text':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">{toolOutput.text}</pre>
            </div>
            <div className="flex justify-between items-center">
              <div className="grid grid-cols-3 gap-4 flex-1">
                <div>
                  <label className="text-sm font-medium text-gray-600">Words</label>
                  <p>{toolOutput.word_count}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tone</label>
                  <p className="capitalize">{toolOutput.tone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Length</label>
                  <p className="capitalize">{toolOutput.length}</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(toolOutput.text)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{result.toolOutput}</pre>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getToolIcon(result.selectedTool)}
            <div>
              <h2 className="text-xl font-bold">Generation Complete!</h2>
              <p className="opacity-90">Powered by {result.metadata?.toolVersion}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">Success</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Final Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{result.finalMessage}</p>
        </div>

        {/* Tool Output */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Generated Content</h3>
          {renderToolSpecificContent()}
        </div>

        {/* Process Details */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Process Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Refined Prompt</label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{result.refinedPrompt}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Selected Tool</label>
                <p className="flex items-center gap-2">
                  {getToolIcon(result.selectedTool)}
                  <span className="capitalize">{result.selectedTool.replace('-', ' ')}</span>
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Confidence Score</label>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                    {Math.round(result.confidence * 100)}%
                  </div>
                  <Zap className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              {result.metadata?.processingTime && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Processing Time</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{(result.metadata.processingTime / 1000).toFixed(1)}s</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {result.metadata?.additionalInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Classification Reasoning</h4>
            <p className="text-sm text-blue-800">{result.metadata.additionalInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;