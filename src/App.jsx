import { useState } from 'react';
import { generateStoryResponse } from './utils/api.js';

export default function App() {
  const [storyText, setStoryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startStory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateStoryResponse([
        { role: 'user', content: 'Begin the story.' }
      ]);
      setStoryText(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      <h1>Story Engine</h1>

      {!storyText && (
        <button onClick={startStory} disabled={loading}>
          {loading ? 'Loading...' : 'Begin Story'}
        </button>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {storyText && (
        <div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{storyText}</p>
        </div>
      )}
    </div>
  );
}