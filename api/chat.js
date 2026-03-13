module.exports = async function handler(req, res) {
  console.log('Method:', req.method);
  console.log('Body type:', typeof req.body);
  console.log('Body:', JSON.stringify(req.body));
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const { messages, system } = body || {};
  console.log('Messages:', messages ? messages.length : 'undefined');

  if (!messages) {
    return res.status(400).json({ error: 'messages is required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: body.model || 'claude-opus-4-6',
        max_tokens: 1024,
        system: system || '',
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'API call failed' });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}