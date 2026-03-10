import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('https://api.anthropic.com/v1/messages', () => {
    return HttpResponse.json({
      content: [
        {
          type: 'text',
          text: `You stand at the base of the cliffs. Rain hammers your shoulders as you look up into the grey void above. Somewhere up there, if Aragorn is right, lies the only hope for Mirileth. You grip the wet stone and begin.

1. Climb towards the dark shape that might be a cave | 2. Study the cliff face carefully before moving | 3. Check your pack one final time`
        }
      ]
    });
  })
];