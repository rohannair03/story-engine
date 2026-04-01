import { analyzeSceneMood } from '../../src/utils/musicAnalyzer.js';

const mockValidResponse = {
  ok: true,
  json: async () => ({
    content: [{ text: '{"moods": ["melancholic", "searching"], "pacing": "slow"}' }]
  })
};

const mockErrorResponse = {
  ok: false,
  json: async () => ({ error: 'API error'})
};

const mockMalformedResponse = {
  ok: true,
  json: async () => ({
    content: [{ text: 'Here is your analysis: no json here' }]
  })
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('analyzeSceneMood', () => {
  it('returns moods and pacing on success', async () => {
    global.fetch.mockResolvedValue(mockValidResponse);
    const result = await analyzeSceneMood('The rain fell heavily on the cliffs.');
    expect(result).toHaveProperty('moods');
    expect(result).toHaveProperty('pacing');
  });

  it('returns an array of moods', async () => {
    global.fetch.mockResolvedValue(mockValidResponse);
    const result = await analyzeSceneMood('The rain fell heavily on the cliffs.');
    expect(Array.isArray(result.moods)).toBe(true);
  });

  it('returns a string pacing value', async () => {
    global.fetch.mockResolvedValue(mockValidResponse);
    const result = await analyzeSceneMood('The rain fell heavily on the cliffs.');
    expect(typeof result.pacing).toBe('string');
  });

  it('returns the correct moods from the response', async () => {
    global.fetch.mockResolvedValue(mockValidResponse);
    const result = await analyzeSceneMood('The rain fell heavily on the cliffs.');
    expect(result.moods).toContain('melancholic');
    expect(result.moods).toContain('searching');
  });

  it('returns the correct pacing from the response', async () => {
    global.fetch.mockResolvedValue(mockValidResponse);
    const result = await analyzeSceneMood('The rain fell heavily on the cliffs.');
    expect(result.pacing).toBe('slow');
  });

  it('throws on API error response', async () => {
    global.fetch.mockResolvedValue(mockErrorResponse);
    await expect(analyzeSceneMood('test')).rejects.toThrow('API error');
  });

  it('throws when response contains no JSON', async () => {
    global.fetch.mockResolvedValue(mockMalformedResponse);
    await expect(analyzeSceneMood('test')).rejects.toThrow('No JSON in music analysis response');
  });

  it('calls the proxy API endpoint', async () => {
    global.fetch.mockResolvedValue(mockValidResponse);
    await analyzeSceneMood('test scene');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/chat',
      expect.any(Object)
    );
  });

  it('uses claude-haiku model', async () => {
    global.fetch.mockResolvedValue(mockValidResponse);
    await analyzeSceneMood('test scene');
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.model).toBe('claude-haiku-4-5-20251001');
  });

  it('includes the scene text in the prompt', async () => {
    global.fetch.mockResolvedValue(mockValidResponse);
    const scene = 'Kennit gripped the wet rock.';
    await analyzeSceneMood(scene);
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.messages[0].content).toContain(scene);
  });
});