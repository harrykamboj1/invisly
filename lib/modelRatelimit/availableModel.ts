import { GEMINI_MODELS } from "../constants";
import rateLimitTracker from "./RateLimitTracker";

export function selectAvailableModel(preferredModels = null) {
    const modelsToCheck = preferredModels || Object.keys(GEMINI_MODELS);
    const sortedModels = preferredModels 
    ? modelsToCheck 
    : modelsToCheck.sort((a, b) => GEMINI_MODELS[a as keyof typeof GEMINI_MODELS].priority - GEMINI_MODELS[b as keyof typeof GEMINI_MODELS].priority);

  for (const modelName of sortedModels) {
    if (rateLimitTracker.canUseModel(modelName as keyof typeof GEMINI_MODELS)) {
      return modelName;
    }
  }

  return null;
}

export async function generateWithFallback(step, taskName, prompt, options = {}) {
    const {
      preferredModels = null,
      maxRetries = 3,
      retryDelay = 1000,
      onModelSwitch = null
    } = options;
  
    let lastError = null;
    let attempts = 0;
  
    while (attempts < maxRetries) {
      const selectedModel = selectAvailableModel(preferredModels);
  
      if (!selectedModel) {
        throw new Error('No models available within rate limits. Please try again later.');
      }
  
      try {
        if (onModelSwitch && attempts > 0) {
          onModelSwitch(selectedModel);
        }
  
        const response = await step.ai.infer(taskName, {
          model: step.ai.models.gemini({ model: selectedModel }),
          body: {
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }]
              }
            ]
          }
        });
        console.log(selectedModel + ' succeeded');
        const estimatedTokens = Math.ceil(prompt.length / 4);
        console.log(estimatedTokens + ' tokens used');
        rateLimitTracker.recordUsage(selectedModel, estimatedTokens);
  
        return {
          response
        };
  
      } catch (error) {
        lastError = error;
        attempts++;
  
        if (error.message?.includes('rate limit') || error.status === 429) {
          console.warn(`Rate limit hit for ${selectedModel}, trying fallback...`);
          rateLimitTracker.recordUsage(selectedModel, 0);
          
          if (attempts < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
            continue;
          }
        } else {
          throw error;
        }
      }
    }
  
    throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError}`);
  }