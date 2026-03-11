import { musicDatabase } from './musicDatabase.js';

// Score a single piece against the user's mood and pacing selection
function scorePiece(piece, targetMoods, targetPacing) {
  let score = 0;

  // Mood overlap is most important — 3 points per matching mood
  const moodOverlap = targetMoods.filter(m => piece.moods.includes(m));
  score += moodOverlap.length * 3;

  // Exact pacing match — 2 points
  if (piece.pacing === targetPacing) score += 2;

  // Partial pacing match for adjacent pacing values — 1 point
  const pacingAdjacency = {
    slow: ['flowing', 'stillness'],
    flowing: ['slow', 'building'],
    building: ['flowing', 'urgent'],
    urgent: ['building'],
    stillness: ['slow']
  };
  if (pacingAdjacency[targetPacing]?.includes(piece.pacing)) score += 1;

  return score;
}

export function matchMusic(targetMoods, targetPacing, limit = 3) {
  return musicDatabase
    .map(piece => ({ piece, score: scorePiece(piece, targetMoods, targetPacing) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ piece }) => piece);
}