const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Pre-populated top builds
const topBuilds = [
  {
    id: 1,
    title: 'Kinetic Fusillade Ballista Hierophant',
    class: 'Templar',
    ascendancy: 'Hierophant',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=1W8Tnjkugko',
    score: 185000,
    replies: 469,
    pobLink: 'https://maxroll.gg/poe/build-guides/kinetic-fusillade-ballista-hierophant-league-starter',
    description: '8 Ballistas firing Kinetic Fusillade gatling guns. No uniques needed to start, transitions into Aegis Aurora endgame. #1 most popular starter this league.',
    thumbnail: 'https://i.ytimg.com/vi/1W8Tnjkugko/hqdefault.jpg',
    author: 'Palsteron',
    date: '2026-03-01'
  },
  {
    id: 2,
    title: 'Shock Nova Archmage Hierophant',
    class: 'Templar',
    ascendancy: 'Hierophant',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=6vyNa69RjUs',
    score: 137000,
    replies: 389,
    pobLink: 'https://pobb.in/Hmlt9phwV-hw',
    description: 'Shock Nova of Procession with built-in spell echo + Archmage. Repeat casts cost no extra mana. Pledge of Hands for defense. The bait build of the league.',
    thumbnail: 'https://i.ytimg.com/vi/6vyNa69RjUs/hqdefault.jpg',
    author: 'Goratha',
    date: '2026-03-01'
  },
  {
    id: 3,
    title: 'Absolution Guardian',
    class: 'Templar',
    ascendancy: 'Guardian',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=Z4tVWAIqOkE',
    score: 129000,
    replies: 0,
    pobLink: 'https://www.youtube.com/watch?v=Z4tVWAIqOkE',
    description: 'Absolution summons sentinels dealing lightning damage. Guardian aura-stacking support. Detailed leveling guide included. Proven league starter.',
    thumbnail: 'https://i.ytimg.com/vi/Z4tVWAIqOkE/hqdefault.jpg',
    author: 'ronarray',
    date: '2026-03-01'
  },
  {
    id: 4,
    title: 'Righteous Fire Chieftain',
    class: 'Marauder',
    ascendancy: 'Chieftain',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=7flriI9ltHM',
    score: 52000,
    replies: 140,
    pobLink: 'https://pohx.net/',
    description: 'The definitive RF build. Walk through maps with damaging fire aura. Extremely tanky, low-button playstyle. Full website guide at pohx.net.',
    thumbnail: 'https://i.ytimg.com/vi/7flriI9ltHM/hqdefault.jpg',
    author: 'Pohx',
    date: '2026-03-01'
  },
  {
    id: 5,
    title: 'Spark Archmage Hierophant',
    class: 'Templar',
    ascendancy: 'Hierophant',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=9wr3f1Khdio',
    score: 40000,
    replies: 0,
    pobLink: 'https://www.youtube.com/watch?v=9wr3f1Khdio',
    description: 'Mana stacking Hierophant shooting Spark projectiles powered by Archmage. Strong all-around with good clear and boss damage scaling.',
    thumbnail: 'https://i.ytimg.com/vi/9wr3f1Khdio/hqdefault.jpg',
    author: 'Big Ducks',
    date: '2026-03-01'
  },
  {
    id: 6,
    title: 'CWS (Cast When Stunned) Chieftain',
    class: 'Marauder',
    ascendancy: 'Chieftain',
    source: 'youtube',
    url: 'https://mobalytics.gg/poe/builds/cws-chieftain-3-28',
    score: 48000,
    replies: 75,
    pobLink: 'https://pobb.in/JK3kksNTM0Fq',
    description: 'AFK-style build for high density content (Simulacrum, Ritual). RF + Firestorm of Pelting triggered by Cast When Stunned. Multiple PoB progression stages.',
    thumbnail: 'https://i.ytimg.com/vi/YAERMZwQj5g/hqdefault.jpg',
    author: 'Big Ducks',
    date: '2026-03-01'
  },
  {
    id: 7,
    title: 'Mana Stacker Hierophant (Comprehensive Guide)',
    class: 'Templar',
    ascendancy: 'Hierophant',
    source: 'forums',
    url: 'https://mobalytics.gg/poe/builds/mana-stacker-hierophant-comprehensive-leaguestart-guide',
    score: 30000,
    replies: 0,
    pobLink: 'https://mobalytics.gg/poe/builds/mana-stacker-hierophant-comprehensive-leaguestart-guide',
    description: 'Zero-to-hero Mana Stacker progression. Levels with Rolling Magma into Firestorm, transitions into endgame mana stacking. Act-by-act campaign guide.',
    thumbnail: null,
    author: 'anime princess',
    date: '2026-03-01'
  },
  {
    id: 8,
    title: '3.28 Mirage League Start Build Index (60+ Builds)',
    class: 'Multiple',
    ascendancy: 'Multiple',
    source: 'reddit',
    url: 'https://www.reddit.com/r/PathOfExileBuilds/comments/1rk0s9m/328_mirage_league_start_build_index/',
    score: 530,
    replies: 530,
    pobLink: 'https://www.reddit.com/r/PathOfExileBuilds/comments/1rk0s9m/328_mirage_league_start_build_index/',
    description: 'Community-curated index of 60+ league starters organized by archetype. Features builds from Pohx, Palsteron, Goratha, Zizaran, GhazzyTV, and more.',
    thumbnail: null,
    author: 'r/PathOfExileBuilds',
    date: '2026-03-01'
  }
];

// GET /api/builds/top
app.get('/api/builds/top', (req, res) => {
  res.json(topBuilds);
});

// GET /api/search
app.get('/api/search', async (req, res) => {
  const { q, sources } = req.query;
  if (!q) return res.status(400).json({ error: 'Search query required' });

  const enabledSources = sources ? sources.split(',') : ['reddit', 'youtube', 'forums'];
  const results = [];

  // Search pre-populated builds first
  const query = q.toLowerCase();
  const localMatches = topBuilds.filter(b => {
    const matchesQuery = b.title.toLowerCase().includes(query) ||
      b.class.toLowerCase().includes(query) ||
      b.ascendancy.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query);
    const matchesSource = enabledSources.includes(b.source) ||
      (enabledSources.includes('forums') && b.source === 'forum') ||
      (enabledSources.includes('forums') && b.source === 'forums');
    return matchesQuery && matchesSource;
  });
  results.push(...localMatches);

  // Reddit search
  if (enabledSources.includes('reddit')) {
    try {
      const subreddits = ['pathofexile', 'PathOfExileBuilds'];
      const redditQuery = `poe 3.28 mirage build ${q}`;
      const response = await axios.get('https://www.reddit.com/search.json', {
        params: {
          q: redditQuery,
          restrict_sr: false,
          sort: 'relevance',
          limit: 10
        },
        headers: { 'User-Agent': 'PoEMirageBuildFinder/1.0' },
        timeout: 5000
      });

      if (response.data?.data?.children) {
        const redditResults = response.data.data.children
          .filter(post => {
            const sub = post.data.subreddit.toLowerCase();
            return subreddits.some(s => sub === s.toLowerCase());
          })
          .map((post, idx) => ({
            id: `reddit-${Date.now()}-${idx}`,
            title: post.data.title,
            class: extractClass(post.data.title + ' ' + (post.data.selftext || '')),
            ascendancy: extractAscendancy(post.data.title + ' ' + (post.data.selftext || '')),
            source: 'reddit',
            url: `https://reddit.com${post.data.permalink}`,
            score: post.data.ups,
            replies: post.data.num_comments,
            pobLink: extractPobLink(post.data.selftext || ''),
            description: (post.data.selftext || '').substring(0, 200),
            thumbnail: post.data.thumbnail?.startsWith('http') ? post.data.thumbnail : null,
            author: post.data.author,
            date: new Date(post.data.created_utc * 1000).toISOString().split('T')[0]
          }));
        results.push(...redditResults);
      }
    } catch (err) {
      console.log('Reddit search error:', err.message);
    }
  }

  // YouTube search (mock — API key not configured yet)
  if (enabledSources.includes('youtube')) {
    const ytMock = generateYouTubeMock(q);
    results.push(...ytMock);
  }

  // Forum search (mock for now — scraping requires more complex parsing)
  if (enabledSources.includes('forums')) {
    const forumMock = generateForumMock(q);
    results.push(...forumMock);
  }

  // Deduplicate by title similarity
  const seen = new Set();
  const unique = results.filter(r => {
    const key = r.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 30);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  res.json(unique);
});

function extractClass(text) {
  const classes = ['Templar', 'Marauder', 'Witch', 'Shadow', 'Ranger', 'Duelist', 'Scion'];
  for (const c of classes) {
    if (text.toLowerCase().includes(c.toLowerCase())) return c;
  }
  return 'Unknown';
}

function extractAscendancy(text) {
  const ascendancies = [
    'Hierophant', 'Inquisitor', 'Guardian',
    'Chieftain', 'Berserker', 'Juggernaut',
    'Necromancer', 'Elementalist', 'Occultist',
    'Assassin', 'Saboteur', 'Trickster',
    'Deadeye', 'Raider', 'Pathfinder',
    'Slayer', 'Gladiator', 'Champion',
    'Ascendant'
  ];
  for (const a of ascendancies) {
    if (text.toLowerCase().includes(a.toLowerCase())) return a;
  }
  return '';
}

function extractPobLink(text) {
  const patterns = [
    /https?:\/\/pobb\.in\/[^\s)]+/,
    /https?:\/\/pastebin\.com\/[^\s)]+/,
    /https?:\/\/poe\.ninja\/[^\s)]+/,
    /https?:\/\/maxroll\.gg\/poe\/[^\s)]+/,
    /https?:\/\/mobalytics\.gg\/poe\/builds\/[^\s)]+/
  ];
  for (const p of patterns) {
    const match = text.match(p);
    if (match) return match[0];
  }
  return null;
}

function generateYouTubeMock(query) {
  const q = query.toLowerCase();
  const mocks = [
    {
      title: `${query} Build Guide - PoE 1 Mirage League (3.28)`,
      class: extractClass(query),
      score: Math.floor(Math.random() * 50000) + 10000,
      author: 'PoEBuilds'
    },
    {
      title: `Best ${query} Build - Path of Exile Mirage League 3.28`,
      class: extractClass(query),
      score: Math.floor(Math.random() * 30000) + 5000,
      author: 'ExileGuides'
    }
  ];

  return mocks.map((m, idx) => ({
    id: `yt-mock-${Date.now()}-${idx}`,
    title: m.title,
    class: m.class,
    ascendancy: extractAscendancy(query),
    source: 'youtube',
    url: '#',
    score: m.score,
    replies: 0,
    pobLink: null,
    description: `YouTube search result for "${query}". Connect YouTube API key for real results.`,
    thumbnail: null,
    author: m.author,
    date: new Date().toISOString().split('T')[0]
  }));
}

function generateForumMock(query) {
  return [{
    id: `forum-mock-${Date.now()}`,
    title: `[Build Guide] ${query} - Forum Build`,
    class: extractClass(query),
    ascendancy: extractAscendancy(query),
    source: 'forum',
    url: 'https://www.pathofexile.com/forum',
    score: Math.floor(Math.random() * 20000) + 3000,
    replies: Math.floor(Math.random() * 50) + 10,
    pobLink: null,
    description: `Forum search result for "${query}". Full scraping integration coming soon.`,
    thumbnail: null,
    author: 'Forum User',
    date: new Date().toISOString().split('T')[0]
  }];
}

// POST /api/research/regenerate
app.post('/api/research/regenerate', async (req, res) => {
  const results = [];
  const searches = [
    { subreddit: 'pathofexile', q: '3.28 mirage build pob', sort: 'top', t: 'month' },
    { subreddit: 'PathOfExileBuilds', q: '3.28 mirage build pob', sort: 'top', t: 'month' },
    { subreddit: 'pathofexile', q: 'mirage league starter pob', sort: 'top', t: 'month' },
    { subreddit: 'PathOfExileBuilds', q: 'mirage league starter pob', sort: 'top', t: 'month' },
  ];

  for (const search of searches) {
    try {
      const response = await axios.get(`https://www.reddit.com/r/${search.subreddit}/search.json`, {
        params: {
          q: search.q,
          restrict_sr: true,
          sort: search.sort,
          t: search.t,
          limit: 25,
        },
        headers: { 'User-Agent': 'PoEMirageBuildFinder/1.0' },
        timeout: 8000,
      });

      if (response.data?.data?.children) {
        for (const child of response.data.data.children) {
          const post = child.data;
          const selftext = post.selftext || '';
          const pobLink = extractPobLink(selftext);
          if (!pobLink) continue;

          results.push({
            id: `reddit-regen-${post.id}`,
            title: post.title,
            class: extractClass(post.title + ' ' + selftext),
            ascendancy: extractAscendancy(post.title + ' ' + selftext),
            source: 'reddit',
            url: `https://reddit.com${post.permalink}`,
            score: post.ups,
            replies: post.num_comments,
            pobLink,
            description: selftext.substring(0, 200),
            thumbnail: post.thumbnail?.startsWith('http') ? post.thumbnail : null,
            author: post.author,
            date: new Date(post.created_utc * 1000).toISOString().split('T')[0],
          });
        }
      }
    } catch (err) {
      console.log(`Reddit research error (${search.subreddit} / ${search.q}):`, err.message);
    }
  }

  // Deduplicate by URL
  const seen = new Set();
  const unique = results.filter(r => {
    const key = r.url.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  res.json({ builds: unique, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`PoE Mirage Build Finder API running on http://localhost:${PORT}`);
});
