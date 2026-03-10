import { useState } from 'react';
import { generateStoryResponse } from './utils/api.js';

function parseResponse(text) {
  const choiceLineMatch = text.match(/1\..+\|.+\|.+/);
  
  if (!choiceLineMatch) {
    return { storyText: text, choices: [] };
  }

  const choiceLine = choiceLineMatch[0];
  const storyText = text.slice(0, text.indexOf(choiceLine)).trim();
  
  const choices = choiceLine
    .split('|')
    .map(c => c.trim())
    .map(c => c.replace(/^\d+\.\s*/, '').trim());

  return { storyText, choices };
}

export default function App() {
  const [storyText, setStoryText] = useState('');
  const [choices, setChoices] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);

  const sendMessage = async (userMessage, currentHistory) => {
    setLoading(true);
    setError(null);

    const newHistory = [
      ...currentHistory,
      { role: 'user', content: userMessage }
    ];

    try {
      const responseText = await generateStoryResponse(newHistory);
      const { storyText: newStory, choices: newChoices } = parseResponse(responseText);

      setHistory([
        ...newHistory,
        { role: 'assistant', content: responseText }
      ]);

      setStoryText(newStory);
      setChoices(newChoices);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startStory = () => {
    setStarted(true);
    sendMessage('Begin the story. Set the scene of Kennit at the base of the cliffs, about to begin his climb.', []);
  };

  const handleChoice = (choice) => {
    sendMessage(choice, history);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      <h1>Story Engine</h1>

      {!started && (
        <button onClick={startStory} disabled={loading}>
          Begin Story
        </button>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading && <p style={{ color: 'grey' }}>...</p>}

      {storyText && (
        <div>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {storyText}
          </p>

          {choices.length > 0 && !loading && (
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(choice)}
                  style={{ padding: '10px 16px', textAlign: 'left', cursor: 'pointer' }}
                >
                  {i + 1}. {choice}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}