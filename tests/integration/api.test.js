import { generateStoryResponse } from '../../src/utils/api.js';

const mockSuccessResponse = {
  content: [
    {
      type: 'text',
      text: `You stand at the base of the cliffs. Rain hammers your shoulders as you look up into the grey void above.

1. Climb towards the dark shape that might be a cave | 2. Study the cliff face carefully before moving | 3. Check your pack one final time`
    }
  ]
};

const mockFetch = (responseBody, status = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(responseBody)
    })
  );
};

describe('generateStoryResponse', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns story text from API response', async () => {
    mockFetch(mockSuccessResponse);
    const messages = [{ role: 'user', content: 'Begin the story.' }];
    const result = await generateStoryResponse(messages);
    expect(result).toContain('You stand at the base of the cliffs');
  });

  test('returns a non empty string on success', async () => {
    mockFetch(mockSuccessResponse);
    const messages = [{ role: 'user', content: 'Begin the story.' }];
    const result = await generateStoryResponse(messages);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('sends a POST request to the Anthropic API', async () => {
    mockFetch(mockSuccessResponse);
    const messages = [{ role: 'user', content: 'Begin the story.' }];
    await generateStoryResponse(messages);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('includes messages in the request body', async () => {
    mockFetch(mockSuccessResponse);
    const messages = [{ role: 'user', content: 'Begin the story.' }];
    await generateStoryResponse(messages);
    const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(callBody.messages).toEqual(messages);
  });

  test('throws an error on API 500 response', async () => {
    mockFetch({ error: { message: 'Internal server error' } }, 500);
    const messages = [{ role: 'user', content: 'Begin the story.' }];
    await expect(generateStoryResponse(messages)).rejects.toThrow('Internal server error');
  });

  test('throws a fallback error when no error message returned', async () => {
    mockFetch({}, 500);
    const messages = [{ role: 'user', content: 'Begin the story.' }];
    await expect(generateStoryResponse(messages)).rejects.toThrow('API call failed');
  });

  test('returns empty string when content array is empty', async () => {
    mockFetch({ content: [] });
    const messages = [{ role: 'user', content: 'Begin the story.' }];
    const result = await generateStoryResponse(messages);
    expect(result).toBe('');
  });

});