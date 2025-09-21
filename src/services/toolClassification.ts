import { ToolClassification } from '../types';

/**
 * Tool Classification Service
 * 
 * Analyzes the refined prompt to determine which AI tool/API should be used
 * and provides confidence scoring for the classification.
 */

export async function classifyTool(refinedPrompt: string): Promise<ToolClassification> {
  // Simulate classification processing time
  await new Promise(resolve => setTimeout(resolve, 800));

  const classification = performClassification(refinedPrompt);
  
  console.log('Tool Classification:', classification);

  return classification;
}

function performClassification(prompt: string): ToolClassification {
  const lowercasePrompt = prompt.toLowerCase();
  
  // Define keyword patterns for each tool
  const toolPatterns = {
    'canva': {
      keywords: ['logo', 'banner', 'poster', 'flyer', 'brochure', 'card', 'presentation', 'social media', 'design'],
      weight: 0,
      description: 'Canva Design Tool - for professional graphic design and marketing materials'
    },
    'openai-image': {
      keywords: ['image', 'picture', 'photo', 'illustration', 'artwork', 'drawing', 'painting', 'visual', 'graphic'],
      weight: 0,
      description: 'OpenAI DALL-E - for AI-generated images and artwork'
    },
    'veo3-video': {
      keywords: ['video', 'animation', 'movie', 'clip', 'footage', 'motion', 'animated', 'film'],
      weight: 0,
      description: 'Veo3 Video Generator - for AI-generated video content'
    },
    'openai-text': {
      keywords: ['write', 'article', 'blog', 'content', 'copy', 'text', 'description', 'story', 'email', 'letter'],
      weight: 0,
      description: 'OpenAI GPT - for text generation and writing assistance'
    }
  };

  // Calculate weights based on keyword matches
  for (const [tool, config] of Object.entries(toolPatterns)) {
    config.weight = config.keywords.reduce((weight, keyword) => {
      if (lowercasePrompt.includes(keyword)) {
        // Give higher weight to exact matches and lower weight to partial matches
        const exactMatch = new RegExp(`\\b${keyword}\\b`).test(lowercasePrompt);
        return weight + (exactMatch ? 2 : 1);
      }
      return weight;
    }, 0);
  }

  // Find the tool with the highest weight
  const sortedTools = Object.entries(toolPatterns)
    .sort(([, a], [, b]) => b.weight - a.weight);

  const [selectedTool, config] = sortedTools[0];
  
  // Calculate confidence based on weight and prompt clarity
  let confidence = Math.min(config.weight * 0.2, 1.0);
  
  // Boost confidence for clear, specific prompts
  if (prompt.length > 20 && config.weight >= 2) {
    confidence = Math.min(confidence + 0.2, 1.0);
  }

  // Default to image generation if no clear classification
  if (confidence < 0.3) {
    return {
      tool: 'openai-image',
      confidence: 0.4,
      reasoning: 'No specific tool keywords detected. Defaulting to image generation as it\'s the most versatile for creative requests.',
      parameters: {
        defaultChoice: true,
        style: 'photorealistic'
      }
    };
  }

  // Generate reasoning
  const reasoning = generateReasoning(selectedTool, config.weight, config.keywords, lowercasePrompt);

  return {
    tool: selectedTool,
    confidence: confidence,
    reasoning: reasoning,
    parameters: generateParameters(selectedTool, prompt)
  };
}

function generateReasoning(tool: string, weight: number, keywords: string[], prompt: string): string {
  const matchedKeywords = keywords.filter(keyword => prompt.includes(keyword));
  
  const toolNames = {
    'canva': 'Canva Design Tool',
    'openai-image': 'OpenAI Image Generation',
    'veo3-video': 'Veo3 Video Generation',
    'openai-text': 'OpenAI Text Generation'
  };

  return `Selected ${toolNames[tool as keyof typeof toolNames]} based on detected keywords: ${matchedKeywords.join(', ')}. Confidence score: ${weight} matches found.`;
}

function generateParameters(tool: string, prompt: string): Record<string, any> {
  const params: Record<string, any> = {};
  
  switch (tool) {
    case 'canva':
      params.template_category = detectDesignCategory(prompt);
      params.style = 'professional';
      break;
    case 'openai-image':
      params.style = detectImageStyle(prompt);
      params.resolution = '1024x1024';
      break;
    case 'veo3-video':
      params.duration = detectVideoDuration(prompt);
      params.quality = 'high';
      break;
    case 'openai-text':
      params.tone = detectWritingTone(prompt);
      params.length = detectContentLength(prompt);
      break;
  }
  
  return params;
}

function detectDesignCategory(prompt: string): string {
  if (prompt.includes('logo')) return 'logo';
  if (prompt.includes('banner')) return 'banner';
  if (prompt.includes('social')) return 'social_media';
  return 'general';
}

function detectImageStyle(prompt: string): string {
  if (prompt.includes('realistic') || prompt.includes('photo')) return 'photorealistic';
  if (prompt.includes('cartoon') || prompt.includes('animated')) return 'cartoon';
  if (prompt.includes('artistic') || prompt.includes('painting')) return 'artistic';
  return 'photorealistic';
}

function detectVideoDuration(prompt: string): string {
  if (prompt.includes('short') || prompt.includes('clip')) return '15s';
  if (prompt.includes('long') || prompt.includes('detailed')) return '60s';
  return '30s';
}

function detectWritingTone(prompt: string): string {
  if (prompt.includes('formal') || prompt.includes('professional')) return 'formal';
  if (prompt.includes('casual') || prompt.includes('friendly')) return 'casual';
  if (prompt.includes('creative') || prompt.includes('fun')) return 'creative';
  return 'professional';
}

function detectContentLength(prompt: string): string {
  if (prompt.includes('brief') || prompt.includes('short')) return 'short';
  if (prompt.includes('detailed') || prompt.includes('long')) return 'long';
  return 'medium';
}