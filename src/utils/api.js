import { LORE_DOCUMENT } from './lore.js';

export async function generateStoryResponse(messages) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      system: LORE_DOCUMENT
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'API call failed');
  }

  return data.content[0]?.text || '';
}