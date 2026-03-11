import { useState, useEffect, useRef } from 'react';
import { generateStoryResponse } from './utils/api.js';
import { parseResponse } from './utils/parseResponse.js';

export default function App() {
  const [storyLog, setStoryLog] = useState([]);
  const [choices, setChoices] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [storyLog, loading]);

  const sendMessage = async (userMessage, currentHistory) => {
    setLoading(true);
    setError(null);
    setChoices([]);

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

      setStoryLog(prev => [...prev, {
        playerChoice: currentHistory.length > 0 ? userMessage : null,
        scene: newStory
      }]);

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

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      <div style={{ marginTop: 24 }}>
        {storyLog.map((entry, i) => {
          const isCurrent = i === storyLog.length - 1;
          return (
            <div key={i} style={{ marginBottom: 32 }}>

              {entry.playerChoice && (
                <p style={{
                  fontStyle: 'italic',
                  color: '#888',
                  marginBottom: 12,
                  paddingLeft: 12,
                  borderLeft: '2px solid #ddd'
                }}>
                  &gt; {entry.playerChoice}
                </p>
              )}

              <p style={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                opacity: isCurrent ? 1 : 0.45,
                transition: 'opacity 0.3s'
              }}>
                {entry.scene}
              </p>

              {!isCurrent && (
                <hr style={{ marginTop: 24, borderColor: '#eee' }} />
              )}
            </div>
          );
        })}

        {loading && (
          <p style={{ color: '#aaa', fontStyle: 'italic' }}>
            Kennit presses on...
          </p>
        )}

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

        <div ref={bottomRef} />
      </div>
    </div>
  );
}