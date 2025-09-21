import React, { useState } from 'react';
import { Send, Sparkles, Image, Video, FileText, Palette, Loader2 } from 'lucide-react';
import { refinePrompt } from './services/promptRefinement';
import { classifyTool } from './services/toolClassification';
import { executeToolAPI } from './services/apiSimulation';
import { ToolResult } from './types';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [processingStep, setProcessingStep] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isProcessing) return;

    setIsProcessing(true);
    setResult(null);

    try {
      // Step 1: Refine the prompt
      setProcessingStep('Analyzing and refining your request...');
      const refinedPrompt = await refinePrompt(userInput);
      
      // Step 2: Classify which tool to use
      setProcessingStep('Determining the best tool for your request...');
      const toolClassification = await classifyTool(refinedPrompt);
      
      // Step 3: Execute the appropriate API call
      setProcessingStep(`Generating content with ${toolClassification.tool}...`);
      const toolResult = await executeToolAPI(toolClassification, refinedPrompt);
      
      // Step 4: Present the result
      setProcessingStep('Finalizing your result...');
      setResult(toolResult);
      
    } catch (error) {
      console.error('Error processing request:', error);
      setResult({
        originalInput: userInput,
        refinedPrompt: userInput,
        selectedTool: 'error',
        toolOutput: 'An error occurred while processing your request. Please try again.',
        finalMessage: 'Something went wrong. Please check your input and try again.',
        confidence: 0
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'canva': return <Palette className="w-5 h-5" />;
      case 'openai-image': return <Image className="w-5 h-5" />;
      case 'veo3-video': return <Video className="w-5 h-5" />;
      case 'openai-text': return <FileText className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-indigo-600 rounded-2xl mr-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">AI Tool Router</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Describe what you want to create in plain English. I'll analyze your request, 
            choose the right AI tool, and generate exactly what you need.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your request here... (e.g., 'Create a logo for a coffee shop', 'Generate a video about space exploration', 'Write a blog post about AI trends')"
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none text-gray-700 placeholder-gray-400"
                disabled={isProcessing}
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                {userInput.length}/500
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!userInput.trim() || isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate with AI
                </>
              )}
            </button>
          </form>

          {/* Processing Status */}
          {isProcessing && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span className="text-indigo-700 font-medium">{processingStep}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {result && <ResultDisplay result={result} getToolIcon={getToolIcon} />}

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { icon: <Image />, title: 'Image Generation', desc: 'Create stunning visuals' },
            { icon: <Video />, title: 'Video Creation', desc: 'Generate engaging videos' },
            { icon: <Palette />, title: 'Design Tools', desc: 'Professional graphics' },
            { icon: <FileText />, title: 'Text Content', desc: 'Written content & copy' }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="text-indigo-600 mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;