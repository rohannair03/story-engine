import { useState, useEffect, useRef } from 'react';
import { generateStoryResponse } from './utils/api.js';
import { parseResponse } from './utils/parseResponse.js';
import { analyzeSceneMood } from './utils/musicAnalyzer.js';
import { matchMusic } from './utils/musicMatcher.js';
import MusicBrief from './components/MusicBrief.jsx';

export default function App() {
  const [storyLog, setStoryLog] = useState([]);
  const [choices, setChoices] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const [musicBrief, setMusicBrief] = useState(null);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicError, setMusicError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [storyLog, loading]);

  const analyzeMusicForScene = async (sceneText) => {
    setMusicLoading(true);
    setMusicError(null);
    try {
      const analysis = await analyzeSceneMood(sceneText);
      const matches = matchMusic(analysis.moods, analysis.pacing);
      setMusicBrief({ ...analysis, matches });
    } catch (err) {
      setMusicError(err.message);
    } finally {
      setMusicLoading(false);
    }
  };

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
      analyzeMusicForScene(newStory);

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
    <div style={{ display: 'flex', gap: 32, maxWidth: 1100, margin: '0 auto', padding: 32 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', marginBottom: 24 }}>Story Engine</h1>

        {!started && (
          <button onClick={startStory} disabled={loading}>
            Begin Story
          </button>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ marginTop: 24 }}>
          {storyLog.map((entry, i) => {
            const isCurrent = i === storyLog.length - 1;
            return (
              <div key={i} style={{ marginBottom: 32 }}>
                {entry.playerChoice && (
                  <p style={{ fontStyle: 'italic', color: '#888', marginBottom: 12, paddingLeft: 12, borderLeft: '2px solid #ddd', fontFamily: 'Georgia, serif' }}>
                    &gt; {entry.playerChoice}
                  </p>
                )}
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, opacity: isCurrent ? 1 : 0.45, transition: 'opacity 0.3s', fontFamily: 'Georgia, serif' }}>
                  {entry.scene}
                </p>
                {!isCurrent && (
                  <hr style={{ marginTop: 24, borderColor: '#eee' }} />
                )}
              </div>
            );
          })}

          {loading && (
            <p style={{ color: '#aaa', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
              Kennit presses on...
            </p>
          )}

          {choices.length > 0 && !loading && (
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {choices.map((choice, i) => (
                <button key={i} onClick={() => handleChoice(choice)} style={{ padding: '10px 16px', textAlign: 'left', cursor: 'pointer' }}>
                  {i + 1}. {choice}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {started && (
        <MusicBrief brief={musicBrief} loading={musicLoading} error={musicError} />
      )}
    </div>
  );
}
