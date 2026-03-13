import { IMAGE_STYLE_PROMPT } from './imageStyle.js';

export async function generateSceneImage(storyText) {
  // Step 1: Ask Claude to write an image prompt from the story beat
  const promptResponse = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: IMAGE_STYLE_PROMPT,
      messages: [
        { role: 'user', content: storyText }
      ]
    })
  });

  const promptData = await promptResponse.json();

  if (!promptResponse.ok) {
    throw new Error(promptData?.error || 'Failed to generate image prompt');
  }

  const imagePrompt = promptData.content[0]?.text || '';

  // Step 2: Send that prompt to DALL-E via our proxy
  const imageResponse = await fetch('/api/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: imagePrompt })
  });

  const imageData = await imageResponse.json();

  if (!imageResponse.ok) {
    throw new Error(imageData?.error || 'Failed to generate image');
  }

  return imageData.url;
}