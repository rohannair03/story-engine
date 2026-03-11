import { matchMusic } from '../../src/utils/musicMatcher.js';

describe('matchMusic', () => {
  it('returns an array', () => {
    const results = matchMusic(['melancholic'], 'slow');
    expect(Array.isArray(results)).toBe(true);
  });

  it('returns at most 3 results by default', () => {
    const results = matchMusic(['melancholic'], 'slow');
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it('respects a custom limit', () => {
    const results = matchMusic(['melancholic'], 'slow', 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('returns results with required fields', () => {
    const results = matchMusic(['melancholic'], 'slow');
    results.forEach(piece => {
      expect(piece).toHaveProperty('id');
      expect(piece).toHaveProperty('title');
      expect(piece).toHaveProperty('composer');
      expect(piece).toHaveProperty('moods');
      expect(piece).toHaveProperty('pacing');
      expect(piece).toHaveProperty('notes');
      expect(piece).toHaveProperty('youtubeSearch');
      expect(piece).toHaveProperty('spotifySearch');
    });
  });

  it('returns empty array when no moods match', () => {
    const results = matchMusic(['nonexistentmood'], 'slow');
    expect(results).toHaveLength(0);
  });

  it('prioritises pieces with matching pacing', () => {
    const results = matchMusic(['melancholic'], 'slow');
    const topPiece = results[0];
    expect(topPiece.pacing).toBe('slow');
  });

  it('returns tense pieces for tense mood', () => {
    const results = matchMusic(['tense'], 'urgent');
    const moods = results.flatMap(p => p.moods);
    expect(moods).toContain('tense');
  });

  it('returns different results for different moods', () => {
    const melancholic = matchMusic(['melancholic'], 'slow').map(p => p.id);
    const epic = matchMusic(['epic'], 'building').map(p => p.id);
    expect(melancholic).not.toEqual(epic);
  });

  it('handles multiple mood inputs', () => {
    const results = matchMusic(['melancholic', 'longing'], 'slow');
    expect(results.length).toBeGreaterThan(0);
  });

it('scores pieces with multiple mood overlaps higher', () => {
  // Use romantic + longing which Rachmaninoff matches both of
  const results = matchMusic(['romantic', 'longing'], 'flowing');
  const ids = results.map(p => p.id);
  expect(ids).toContain('rachmaninoff_pc2');
  });
});