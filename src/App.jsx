import { useState, useEffect, useRef } from 'react';
import { generateStoryResponse } from './utils/parseResponse.js';

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
  const [storyLog, setStoryLog] = useState([]);
  const [choices, setChoices] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);

  // Auto scroll to bottom after each new scene
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

      // Append new scene to the log
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

      {/* Story log — all previous scenes */}
      <div style={{ marginTop: 24 }}>
        {storyLog.map((entry, i) => {
          const isCurrent = i === storyLog.length - 1;
          return (
            <div key={i} style={{ marginBottom: 32 }}>

              {/* Player choice that led to this scene */}
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

              {/* Scene text — faded if not current */}
              <p style={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                opacity: isCurrent ? 1 : 0.45,
                transition: 'opacity 0.3s'
              }}>
                {entry.scene}
              </p>

              {/* Divider between scenes */}
              {!isCurrent && (
                <hr style={{ marginTop: 24, borderColor: '#eee' }} />
              )}
            </div>
          );
        })}

        {/* Loading indicator */}
        {loading && (
          <p style={{ color: '#aaa', fontStyle: 'italic' }}>
            Kennit presses on...
          </p>
        )}

        {/* Choice buttons — only shown for current scene */}
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

        {/* Invisible anchor for auto scroll */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}