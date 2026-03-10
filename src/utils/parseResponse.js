export function parseResponse(text) {
  const choiceLineMatch = text.match(/1\..+\|.+\|.+/);
  
  if (!choiceLineMatch) {
    return { storyText: text, choices: [] };
  }

  const choiceLine = choiceLineMatch[0];
  const storyText = text.slice(0, text.indexOf(choiceLine)).trim();
  
  const choices = choiceLine
    .split('|')
    .map(c => c.trim())
    .map(c => c.replace(/^\d+\.\s*/, '').trim());

  return { storyText, choices };
}