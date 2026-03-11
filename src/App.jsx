import { useState, useEffect, useRef } from 'react';
import { generateStoryResponse } from './utils/api.js';
import { parseResponse } from './utils/parseResponse.js';
import { analyzeSceneMood } from './utils/musicAnalyzer.js';
import { matchMusic } from './utils/musicMatcher.js';
import MusicBrief from './components/MusicBrief.jsx';

const INITIAL_CHOICES = [
  "Begin the ascent",
  "Scout the cliff face first",
  "Make camp and wait for dawn",
];

export default function App() {
  const [storyLog, setStoryLog] = useState([]);
  const [choices, setChoices] = useState(INITIAL_CHOICES);
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

      setChoices(newChoices.length > 0 ? newChoices : INITIAL_CHOICES);
      analyzeMusicForScene(newStory);

    } catch (err) {
      setError('The story faltered. Check your connection and try again.');
      setChoices(INITIAL_CHOICES);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = (choice) => {
    setStarted(true);
    sendMessage(choice, history);
  };

  return (
    <div className="app-shell">
      {/* ── Left: Story Engine ─────────────────────────────── */}
      <main className="story-pane">
        <header className="story-header">
          <div className="header-eyebrow">A chronicle of the last city</div>
          <h1 className="header-title">
            <span className="title-accent">VALDRIS</span>
          </h1>
          <div className="header-sub">
            Seven years of rain&ensp;·&ensp;One impossible climb&ensp;·&ensp;No way back
          </div>
          <div className="header-rule" />
        </header>

        {!started && (
          <div className="opening-card" data-testid="opening-card">
            <p className="opening-text">
              The cliff face rises into grey mist. Kennit's fingers are already
              raw from the first handhold. Somewhere above, three hundred feet of
              wet limestone separate him from whatever the king won't name aloud.
              The rain, as always, doesn't care.
            </p>
          </div>
        )}

        {/* Story log */}
        <div className="story-log" data-testid="story-log">
          {storyLog.map((entry, i) => {
            const isCurrent = i === storyLog.length - 1;
            return (
              <div key={i}>
                {entry.playerChoice && (
                  <div className="log-choice">
                    <span className="choice-arrow">›</span>
                    {entry.playerChoice}
                  </div>
                )}
                <div className="log-story" style={{ opacity: isCurrent ? 1 : 0.45 }}>
                  {entry.scene.split('\n\n').map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="log-loading" data-testid="loading-indicator">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner" data-testid="error-message">
            {error}
          </div>
        )}

        {/* Choices */}
        <div className="choices-area" data-testid="choices-container">
          {choices.map((choice, i) => (
            <button
              key={i}
              className="choice-btn"
              onClick={() => handleChoice(choice)}
              disabled={loading}
              data-testid={`choice-button-${i}`}
            >
              <span className="choice-num">{i + 1}</span>
              <span className="choice-text">{choice}</span>
            </button>
          ))}
        </div>
      </main>

      {/* ── Right: Score Companion ─────────────────────────── */}
      <aside className="sidebar-pane">
        <MusicBrief brief={musicBrief} loading={musicLoading} error={musicError} />
      </aside>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-base:      #0d0f14;
    --bg-surface:   #13161e;
    --bg-elevated:  #1a1e2a;
    --border:       #2a2e3d;
    --text-primary: #e8e0d0;
    --text-muted:   #7a7a8a;
    --text-faint:   #4a4a5a;
    --gold:         #c9a84c;
    --gold-dim:     #8a6f30;
    --rain:         #4a7fa5;
    --rain-dim:     #2d5270;
    --danger:       #8b3a3a;
    --font-serif:   Georgia, 'Times New Roman', serif;
    --font-mono:    'Courier New', Courier, monospace;
  }

  html, body, #root {
    height: 100%;
    background: var(--bg-base);
    color: var(--text-primary);
  }

  .app-shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
    font-family: var(--font-serif);
  }

  .story-pane {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--bg-base);
    border-right: 1px solid var(--border);
  }

  .sidebar-pane {
    width: 340px;
    flex-shrink: 0;
    overflow-y: auto;
    background: var(--bg-surface);
    padding: 24px 16px;
  }

  .story-header {
    padding: 28px 36px 20px;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .header-eyebrow {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
    margin-bottom: 6px;
  }

  .header-title {
    font-family: var(--font-serif);
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 0.12em;
    line-height: 1;
    margin-bottom: 8px;
  }

  .title-accent { color: var(--gold); }

  .header-sub {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.06em;
  }

  .header-rule {
    margin-top: 16px;
    height: 1px;
    background: linear-gradient(to right, var(--gold-dim), transparent);
  }

  .opening-card {
    margin: 24px 36px 0;
    padding: 20px 24px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-left: 3px solid var(--gold-dim);
  }

  .opening-text {
    font-size: 15px;
    line-height: 1.75;
    color: var(--text-muted);
    font-style: italic;
  }

  .story-log {
    flex: 1;
    overflow-y: auto;
    padding: 20px 36px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .story-log::-webkit-scrollbar { width: 4px; }
  .story-log::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .log-story {
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: opacity 0.3s;
  }

  .log-story p {
    font-size: 15.5px;
    line-height: 1.8;
    color: var(--text-primary);
  }

  .log-choice {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--rain);
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 8px;
  }

  .choice-arrow {
    color: var(--gold);
    font-size: 16px;
    line-height: 1;
  }

  .log-loading {
    display: flex;
    gap: 6px;
    padding: 8px 0;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--gold-dim);
    animation: pulse 1.2s ease-in-out infinite;
  }

  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50%       { opacity: 1;   transform: scale(1.1); }
  }

  .error-banner {
    margin: 0 36px 12px;
    padding: 12px 16px;
    background: rgba(139, 58, 58, 0.15);
    border: 1px solid var(--danger);
    border-left: 3px solid var(--danger);
    font-family: var(--font-mono);
    font-size: 12px;
    color: #c47a7a;
    letter-spacing: 0.03em;
  }

  .choices-area {
    padding: 16px 36px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;
    border-top: 1px solid var(--border);
    background: var(--bg-surface);
  }

  .choice-btn {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    width: 100%;
    padding: 13px 18px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-left: 3px solid var(--gold-dim);
    color: var(--text-primary);
    font-family: var(--font-serif);
    font-size: 14px;
    line-height: 1.5;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }

  .choice-btn:hover:not(:disabled) {
    border-color: var(--gold);
    border-left-color: var(--gold);
    background: #1e2230;
    color: var(--gold);
  }

  .choice-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .choice-num {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--gold-dim);
    padding-top: 2px;
    flex-shrink: 0;
    letter-spacing: 0.08em;
  }

  .choice-btn:hover:not(:disabled) .choice-num { color: var(--gold); }
  .choice-text { flex: 1; }

  @media (max-width: 900px) {
    .app-shell { flex-direction: column; }
    .story-pane { height: 60vh; border-right: none; border-bottom: 1px solid var(--border); }
    .sidebar-pane { width: 100%; height: 40vh; }
    .story-header { padding: 18px 20px 14px; }
    .story-log { padding: 16px 20px; }
    .choices-area { padding: 12px 20px 16px; }
    .opening-card { margin: 16px 20px 0; }
    .error-banner { margin: 0 20px 12px; }
  }
`;
