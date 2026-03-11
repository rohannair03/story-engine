export default function MusicBrief({ brief, loading, error }) {
  if (loading) {
    return (
      <div style={styles.panel}>
        <div style={styles.label}>SCORE COMPANION</div>
        <div style={styles.empty}>Scoring the scene...</div>
      </div>
    );
  }

  if (error || !brief) {
    return (
      <div style={styles.panel}>
        <div style={styles.label}>SCORE COMPANION</div>
        <div style={styles.empty}>No score available</div>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      <div style={styles.label}>SCORE COMPANION</div>
      <div style={styles.moodRow}>
        {brief.moods?.map((mood, i) => (
          <span key={i} style={styles.moodTag}>{mood}</span>
        ))}
        <span style={styles.pacingTag}>{brief.pacing}</span>
      </div>
      <div style={styles.divider} />
      {brief.matches?.map((piece, i) => (
        <div key={i} style={styles.pieceRow}>
          <div style={styles.pieceNumber}>0{i + 1}</div>
          <div style={styles.pieceInfo}>
            <div style={styles.pieceTitle}>{piece.title}</div>
            <div style={styles.pieceComposer}>{piece.composer}</div>
            <div style={styles.pieceNote}>{piece.notes}</div>
            <div style={styles.pieceLinks}>
              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(piece.youtubeSearch)}`} target="_blank" rel="noreferrer" style={styles.link}>YouTube</a>
              <a href={`https://open.spotify.com/search/${encodeURIComponent(piece.spotifySearch)}`} target="_blank" rel="noreferrer" style={styles.link}>Spotify</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  panel: { width: 280, flexShrink: 0, background: '#0d0f14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, padding: '20px 16px', alignSelf: 'flex-start', position: 'sticky', top: 24, fontFamily: 'Georgia, serif' },
  label: { fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#5a5040', marginBottom: 12, fontFamily: 'monospace' },
  moodRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  moodTag: { fontSize: 10, padding: '3px 8px', background: 'rgba(196,169,106,0.08)', border: '1px solid rgba(196,169,106,0.2)', color: '#a08858', borderRadius: 2, fontFamily: 'monospace', letterSpacing: '0.1em' },
  pacingTag: { fontSize: 10, padding: '3px 8px', background: 'rgba(100,120,180,0.08)', border: '1px solid rgba(100,120,180,0.2)', color: '#7888a8', borderRadius: 2, fontFamily: 'monospace', letterSpacing: '0.1em' },
  divider: { height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 14 },
  pieceRow: { display: 'flex', gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.04)' },
  pieceNumber: { fontSize: 10, color: '#3a3530', fontFamily: 'monospace', flexShrink: 0, paddingTop: 2 },
  pieceInfo: { flex: 1 },
  pieceTitle: { fontSize: '0.85rem', color: '#d0c8b8', marginBottom: 2 },
  pieceComposer: { fontSize: 10, color: '#5a5040', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 6 },
  pieceNote: { fontSize: '0.75rem', color: '#6a6058', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 8 },
  pieceLinks: { display: 'flex', gap: 6 },
  link: { fontSize: 9, color: '#7888a8', textDecoration: 'none', fontFamily: 'monospace', letterSpacing: '0.1em', padding: '2px 6px', border: '1px solid rgba(100,120,180,0.2)', borderRadius: 2 },
  empty: { fontSize: '0.85rem', color: '#3a3530', fontStyle: 'italic' }
};
