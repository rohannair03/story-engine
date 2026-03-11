export async function analyzeSceneMood(sceneText) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Analyze this story scene and return ONLY a JSON object. No explanation, no markdown.

Scene: "${sceneText}"

Return exactly this structure:
{
  "moods": ["primary_mood", "secondary_mood"],
  "pacing": "one_of: slow|flowing|building|urgent|stillness"
}

Mood options: melancholic, tense, mysterious, epic, eerie, romantic, hopeful, grief, longing, serene, desperate, triumphant, ominous, bittersweet, introspective, searching, driven, vast, unsettled, primal, relentless, wrathful, transcendent

Choose the 2 most fitting moods and the most fitting pacing.`
      }]
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'Music analysis failed');

  const text = data.content[0]?.text || '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in music analysis response');

  return JSON.parse(match[0]);
}