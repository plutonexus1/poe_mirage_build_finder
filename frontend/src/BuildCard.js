import React, { useState } from 'react';

const SOURCE_ICONS = {
  reddit: '🔴',
  youtube: '▶️',
  forum: '📋',
};

const SOURCE_COLORS = {
  reddit: '#ff4500',
  youtube: '#ff0000',
  forum: '#6c8ebf',
};

const SOURCE_LABELS = {
  reddit: 'Reddit',
  youtube: 'YouTube',
  forum: 'Forums',
};

function formatScore(score) {
  if (score >= 1000) return `${(score / 1000).toFixed(score >= 10000 ? 0 : 1)}K`;
  return score.toString();
}

function scoreLabel(source) {
  if (source === 'reddit') return 'upvotes';
  if (source === 'youtube') return 'views';
  return 'views';
}

export default function BuildCard({ build }) {
  const [hovered, setHovered] = useState(false);
  const srcColor = SOURCE_COLORS[build.source] || '#6c8ebf';

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      {build.thumbnail && (
        <div style={styles.thumbWrap}>
          <img src={build.thumbnail} alt="" style={styles.thumb} />
        </div>
      )}

      {/* Header row */}
      <div style={styles.cardHeader}>
        <div style={styles.sourceBadge}>
          <span>{SOURCE_ICONS[build.source] || '📋'}</span>
          <span style={{ color: srcColor, fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>
            {SOURCE_LABELS[build.source] || build.source}
          </span>
        </div>
        {build.ascendancy && (
          <span style={styles.ascBadge}>{build.ascendancy}</span>
        )}
      </div>

      {/* Title */}
      <h3 style={styles.title}>{build.title}</h3>

      {/* Class */}
      <div style={styles.classRow}>
        <span style={styles.classBadge}>{build.class}</span>
        {build.author && <span style={styles.author}>by {build.author}</span>}
      </div>

      {/* Description */}
      {build.description && (
        <p style={styles.desc}>{build.description}</p>
      )}

      {/* Stats */}
      <div style={styles.stats}>
        <span style={styles.stat}>
          {build.source === 'reddit' ? '⬆️' : '👁️'} {formatScore(build.score)} {scoreLabel(build.source)}
        </span>
        {build.replies > 0 && (
          <span style={styles.stat}>💬 {build.replies} replies</span>
        )}
      </div>

      {/* Buttons */}
      <div style={styles.buttons}>
        {build.pobLink && (
          <a href={build.pobLink} target="_blank" rel="noopener noreferrer" style={styles.pobBtn}>
            📋 Build Planner
          </a>
        )}
        <a href={build.url} target="_blank" rel="noopener noreferrer" style={{ ...styles.sourceBtn, borderColor: srcColor, color: srcColor }}>
          🔗 Source
        </a>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#1a1a2e',
    border: '1px solid #2a2a4e',
    borderRadius: 10,
    padding: 20,
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  cardHover: {
    borderColor: '#d4a835',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(212, 168, 53, 0.15)',
  },
  thumbWrap: {
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  thumb: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    display: 'block',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
  },
  ascBadge: {
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 4,
    background: 'rgba(212, 168, 53, 0.15)',
    color: '#d4a835',
    fontWeight: 600,
  },
  title: {
    color: '#d4a835',
    fontSize: 18,
    margin: 0,
    lineHeight: 1.3,
    fontWeight: 700,
  },
  classRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  classBadge: {
    fontSize: 12,
    padding: '2px 10px',
    borderRadius: 4,
    background: '#2a2a4e',
    color: '#aaa',
    fontWeight: 500,
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
  desc: {
    fontSize: 13,
    color: '#999',
    margin: 0,
    lineHeight: 1.5,
  },
  stats: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  stat: {
    fontSize: 13,
    color: '#bbb',
  },
  buttons: {
    display: 'flex',
    gap: 8,
    marginTop: 4,
  },
  pobBtn: {
    padding: '6px 14px',
    fontSize: 13,
    background: 'rgba(0, 255, 136, 0.1)',
    border: '1px solid #00ff88',
    borderRadius: 5,
    color: '#00ff88',
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
  },
  sourceBtn: {
    padding: '6px 14px',
    fontSize: 13,
    background: 'transparent',
    border: '1px solid',
    borderRadius: 5,
    textDecoration: 'none',
    fontWeight: 500,
    cursor: 'pointer',
  },
};
