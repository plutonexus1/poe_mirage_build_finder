import React, { useState, useEffect, useCallback } from 'react';
import BuildCard from './BuildCard';

const API_BASE = 'http://localhost:3001';

const SOURCES = ['reddit', 'youtube', 'forums'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'discussed', label: 'Most Discussed' },
];

export default function App() {
  const [builds, setBuilds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSources, setActiveSources] = useState(['reddit', 'youtube', 'forums']);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/builds/top`)
      .then(r => r.json())
      .then(data => { setBuilds(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const src = activeSources.join(',');
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(searchQuery)}&sources=${src}`);
      const data = await res.json();
      setBuilds(data);
    } catch {
      setBuilds([]);
    }
    setLoading(false);
  }, [searchQuery, activeSources]);

  const resetToTop = () => {
    setSearchQuery('');
    setSearched(false);
    setLoading(true);
    fetch(`${API_BASE}/api/builds/top`)
      .then(r => r.json())
      .then(data => { setBuilds(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/research/regenerate`, { method: 'POST' });
      const data = await res.json();
      setLastUpdated(data.timestamp);
      // Merge with existing builds, dedup by URL
      setBuilds(prev => {
        const existing = new Map(prev.map(b => [b.url.toLowerCase(), b]));
        for (const b of data.builds) {
          const key = b.url.toLowerCase();
          if (!existing.has(key)) existing.set(key, b);
        }
        return Array.from(existing.values());
      });
    } catch (err) {
      console.error('Regenerate failed:', err);
    }
    setRegenerating(false);
  };

  const toggleSource = (source) => {
    setActiveSources(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const filteredBuilds = builds.filter(b => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'forums') return b.source === 'forum';
    return b.source === activeFilter;
  });

  const sortedBuilds = [...filteredBuilds].sort((a, b) => {
    if (sortBy === 'popular') return b.score - a.score;
    if (sortBy === 'newest') return (b.date || '').localeCompare(a.date || '');
    if (sortBy === 'discussed') return (b.replies || 0) - (a.replies || 0);
    return 0;
  });

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <h1 style={styles.logo} onClick={resetToTop}>
            <span style={styles.logoIcon}>⚔️</span> PoE Mirage Build Finder
          </h1>
          <div style={styles.searchRow}>
            <input
              style={styles.searchInput}
              placeholder="Search builds... (e.g. Hierophant, Chieftain, RF, Spark)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button style={styles.searchBtn} onClick={handleSearch}>Search</button>
          </div>
          <div style={styles.sourceFiltersRow}>
            <div style={styles.sourceFilters}>
              {SOURCES.map(src => (
                <label key={src} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={activeSources.includes(src)}
                    onChange={() => toggleSource(src)}
                    style={styles.checkbox}
                  />
                  <span style={{ color: sourceColor(src) }}>{capitalize(src)}</span>
                </label>
              ))}
            </div>
            <div style={styles.regenRow}>
              <button
                style={{
                  ...styles.regenBtn,
                  opacity: regenerating ? 0.7 : 1,
                  cursor: regenerating ? 'not-allowed' : 'pointer',
                }}
                onClick={handleRegenerate}
                disabled={regenerating}
              >
                {regenerating ? (
                  <span style={styles.regenSpinner} />
                ) : (
                  '🔄'
                )}
                {' '}{regenerating ? 'Researching...' : 'Regenerate Research'}
              </button>
              {lastUpdated && (
                <span style={styles.lastUpdated}>
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.filterTabs}>
          {['all', 'reddit', 'youtube', 'forums'].map(f => (
            <button
              key={f}
              style={activeFilter === f ? { ...styles.tab, ...styles.tabActive } : styles.tab}
              onClick={() => setActiveFilter(f)}
            >
              {capitalize(f)}
            </button>
          ))}
        </div>
        <div style={styles.sortRow}>
          <span style={styles.sortLabel}>Sort:</span>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              style={sortBy === opt.value ? { ...styles.sortBtn, ...styles.sortBtnActive } : styles.sortBtn}
              onClick={() => setSortBy(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={styles.main}>
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner} />
            <p style={{ color: '#888' }}>Loading builds...</p>
          </div>
        ) : sortedBuilds.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ color: '#888', fontSize: 18 }}>
              {searched ? 'No builds found. Try a different search.' : 'No builds available.'}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {sortedBuilds.map(build => (
              <BuildCard key={build.id} build={build} />
            ))}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>PoE Mirage Build Finder — Community build research dashboard for PoE 1 Mirage League (3.28)</p>
      </footer>
    </div>
  );
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function sourceColor(s) {
  if (s === 'reddit') return '#ff4500';
  if (s === 'youtube') return '#ff0000';
  return '#6c8ebf';
}

const styles = {
  app: {
    minHeight: '100vh',
    background: '#0a0a0f',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
  },
  header: {
    background: 'linear-gradient(180deg, #12121f 0%, #0a0a0f 100%)',
    borderBottom: '1px solid #2a2a4e',
    padding: '20px 0 16px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
  },
  logo: {
    color: '#d4a835',
    fontSize: 28,
    margin: '0 0 16px',
    cursor: 'pointer',
    fontWeight: 700,
    letterSpacing: 1,
  },
  logoIcon: {
    fontSize: 28,
  },
  searchRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    fontSize: 15,
    background: '#1a1a2e',
    border: '1px solid #2a2a4e',
    borderRadius: 6,
    color: '#e0e0e0',
    outline: 'none',
  },
  searchBtn: {
    padding: '10px 24px',
    fontSize: 15,
    background: '#d4a835',
    color: '#0a0a0f',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
  },
  sourceFiltersRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  sourceFilters: {
    display: 'flex',
    gap: 16,
  },
  regenRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  regenBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: 600,
    background: 'linear-gradient(135deg, #d4a835 0%, #e8922d 100%)',
    color: '#0a0a0f',
    border: 'none',
    borderRadius: 6,
    transition: 'all 0.2s ease',
  },
  regenSpinner: {
    display: 'inline-block',
    width: 14,
    height: 14,
    border: '2px solid rgba(10,10,15,0.3)',
    borderTop: '2px solid #0a0a0f',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  lastUpdated: {
    fontSize: 11,
    color: '#888',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#d4a835',
  },
  toolbar: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterTabs: {
    display: 'flex',
    gap: 4,
  },
  tab: {
    padding: '6px 16px',
    fontSize: 13,
    background: 'transparent',
    border: '1px solid #2a2a4e',
    borderRadius: 4,
    color: '#888',
    cursor: 'pointer',
  },
  tabActive: {
    background: '#d4a835',
    color: '#0a0a0f',
    borderColor: '#d4a835',
    fontWeight: 600,
  },
  sortRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  sortLabel: {
    fontSize: 13,
    color: '#888',
  },
  sortBtn: {
    padding: '4px 12px',
    fontSize: 12,
    background: 'transparent',
    border: '1px solid #2a2a4e',
    borderRadius: 4,
    color: '#888',
    cursor: 'pointer',
  },
  sortBtnActive: {
    borderColor: '#d4a835',
    color: '#d4a835',
  },
  main: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px 40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: 20,
  },
  loading: {
    textAlign: 'center',
    padding: 60,
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid #2a2a4e',
    borderTop: '3px solid #d4a835',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  },
  empty: {
    textAlign: 'center',
    padding: 60,
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#555',
    fontSize: 13,
    borderTop: '1px solid #1a1a2e',
  },
};
