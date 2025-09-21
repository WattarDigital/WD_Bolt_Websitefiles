/**
 * Prompt Refinement Service
 * 
 * This service simulates using Bolt's built-in LLM to analyze and rewrite
 * raw user input into clear, precise prompts optimized for external AI tools.
 */

export async function refinePrompt(userInput: string): Promise<string> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate prompt refinement logic
  const refinedPrompt = analyzeAndRefine(userInput);
  
  console.log('Prompt Refinement:', {
    original: userInput,
    refined: refinedPrompt
  });

  return refinedPrompt;
}

function analyzeAndRefine(input: string): string {
  const lowercaseInput = input.toLowerCase();
  
  // Remove filler words and improve clarity
  let refined = input
    .replace(/\b(um|uh|like|you know|basically|actually)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Enhance based on detected intent
  if (containsImageKeywords(lowercaseInput)) {
    refined = enhanceForImageGeneration(refined, lowercaseInput);
  } else if (containsVideoKeywords(lowercaseInput)) {
    refined = enhanceForVideoGeneration(refined, lowercaseInput);
  } else if (containsDesignKeywords(lowercaseInput)) {
    refined = enhanceForDesignTools(refined, lowercaseInput);
  } else if (containsTextKeywords(lowercaseInput)) {
    refined = enhanceForTextGeneration(refined, lowercaseInput);
  }

  // Ensure the prompt is actionable
  if (!refined.match(/^(create|generate|make|design|write|produce|build)/i)) {
    if (containsImageKeywords(lowercaseInput) || containsDesignKeywords(lowercaseInput)) {
      refined = `Create ${refined}`;
    } else if (containsVideoKeywords(lowercaseInput)) {
      refined = `Generate ${refined}`;
    } else if (containsTextKeywords(lowercaseInput)) {
      refined = `Write ${refined}`;
    } else {
      refined = `Create ${refined}`;
    }
  }

  return refined;
}

function containsImageKeywords(input: string): boolean {
  const imageKeywords = ['image', 'picture', 'photo', 'illustration', 'artwork', 'drawing', 'painting', 'graphic'];
  return imageKeywords.some(keyword => input.includes(keyword));
}

function containsVideoKeywords(input: string): boolean {
  const videoKeywords = ['video', 'animation', 'movie', 'clip', 'footage', 'motion', 'animated'];
  return videoKeywords.some(keyword => input.includes(keyword));
}

function containsDesignKeywords(input: string): boolean {
  const designKeywords = ['logo', 'banner', 'poster', 'flyer', 'brochure', 'card', 'design', 'layout'];
  return designKeywords.some(keyword => input.includes(keyword));
}

function containsTextKeywords(input: string): boolean {
  const textKeywords = ['write', 'article', 'blog', 'content', 'copy', 'text', 'description', 'story'];
  return textKeywords.some(keyword => input.includes(keyword));
}

function enhanceForImageGeneration(prompt: string, input: string): string {
  let enhanced = prompt;
  
  // Add style specifications if missing
  if (!input.includes('style') && !input.includes('artistic')) {
    enhanced += ', professional quality, high resolution';
  }
  
  // Add lighting specifications for portraits/objects
  if (input.includes('portrait') || input.includes('person') || input.includes('face')) {
    enhanced += ', studio lighting, detailed';
  }
  
  return enhanced;
}

function enhanceForVideoGeneration(prompt: string, input: string): string {
  let enhanced = prompt;
  
  // Add duration if not specified
  if (!input.includes('second') && !input.includes('minute')) {
    enhanced += ', 30 seconds duration';
  }
  
  // Add quality specifications
  enhanced += ', high quality, smooth motion';
  
  return enhanced;
}

function enhanceForDesignTools(prompt: string, input: string): string {
  let enhanced = prompt;
  
  // Add format specifications
  if (!input.includes('format') && !input.includes('size')) {
    enhanced += ', professional format, print-ready';
  }
  
  return enhanced;
}

function enhanceForTextGeneration(prompt: string, input: string): string {
  let enhanced = prompt;
  
  // Add length specifications if missing
  if (!input.includes('word') && !input.includes('paragraph') && !input.includes('page')) {
    enhanced += ', approximately 200-300 words';
  }
  
  // Add tone if missing
  if (!input.includes('tone') && !input.includes('style')) {
    enhanced += ', professional and engaging tone';
  }
  
  return enhanced;
}