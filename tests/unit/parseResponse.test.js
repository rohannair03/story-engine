import { parseResponse } from '../../src/utils/parseResponse.js';

describe('parseResponse', () => {

  test('correctly separates story text from choices', () => {
    const input = `You grip the cold stone and begin your ascent. 
The rain hammers your back.

1. Climb towards the nearest cave | 2. Search the cliff face for handholds | 3. Look down at Mirileth below`;

    const result = parseResponse(input);
    expect(result.storyText).toContain('You grip the cold stone');
    expect(result.choices).toHaveLength(3);
  });

  test('correctly parses all three choices', () => {
    const input = `The cave offers shelter.

1. Rest and eat your rations | 2. Explore deeper into the cave | 3. Continue climbing immediately`;

    const result = parseResponse(input);
    expect(result.choices[0]).toBe('Rest and eat your rations');
    expect(result.choices[1]).toBe('Explore deeper into the cave');
    expect(result.choices[2]).toBe('Continue climbing immediately');
  });

  test('returns empty choices array when no choice line found', () => {
    const input = `You reach the top. There is nothing left to decide.`;
    const result = parseResponse(input);
    expect(result.choices).toHaveLength(0);
    expect(result.storyText).toBe(input);
  });

  test('strips leading numbers from choices correctly', () => {
    const input = `The wind howls.

1. Press on | 2. Take shelter | 3. Check your pack`;

    const result = parseResponse(input);
    expect(result.choices[0]).not.toMatch(/^\d+\./);
    expect(result.choices[1]).not.toMatch(/^\d+\./);
    expect(result.choices[2]).not.toMatch(/^\d+\./);
  });

  test('handles extra whitespace around choices', () => {
    const input = `Rain soaks your boots.

1. Keep moving  |  2. Find shelter  |  3. Study the cliff face`;

    const result = parseResponse(input);
    expect(result.choices[0]).toBe('Keep moving');
    expect(result.choices[1]).toBe('Find shelter');
    expect(result.choices[2]).toBe('Study the cliff face');
  });

});