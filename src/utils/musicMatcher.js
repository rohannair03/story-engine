import { musicDatabase } from './musicDatabase.js';

function scorePiece(piece, targetMoods, targetPacing) {
  let score = 0;

  const moodOverlap = targetMoods.filter(m => piece.moods.includes(m));
  score += moodOverlap.length * 3;

  // Only award pacing points if there is at least one mood match
  if (moodOverlap.length > 0) {
    if (piece.pacing === targetPacing) score += 2;

    const pacingAdjacency = {
      slow: ['flowing', 'stillness'],
      flowing: ['slow', 'building'],
      building: ['flowing', 'urgent'],
      urgent: ['building'],
      stillness: ['slow']
    };
    if (pacingAdjacency[targetPacing]?.includes(piece.pacing)) score += 1;
  }

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