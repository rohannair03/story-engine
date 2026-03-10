import { LORE_DOCUMENT } from './lore.js';

export async function generateStoryResponse(messages) {
  const response = await fetch('/api/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: LORE_DOCUMENT,
      messages: messages
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'API call failed');
  }

  return data.content[0].text;
}