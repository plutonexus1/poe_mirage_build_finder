const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Pre-populated top builds for PoE 1 Mirage League (3.28) — updated mid-March 2026
const topBuilds = [
  {
    id: 1,
    title: 'Kinetic Fusillade Ballista Hierophant',
    class: 'Templar',
    ascendancy: 'Hierophant',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=1W8Tnjkugko',
    score: 190000,
    replies: 512,
    pobLink: 'https://maxroll.gg/poe/build-guides/kinetic-fusillade-ballista-hierophant-league-starter',
    description: '9.5% poe.ninja share — the most popular build in Mirage League. 8 ballistas firing gatling-gun projectiles. Safe totem playstyle with massive single-target DPS. Transitions into Aegis Aurora endgame.',
    thumbnail: 'https://i.ytimg.com/vi/1W8Tnjkugko/hqdefault.jpg',
    author: 'Palsteron',
    date: '2026-03-15'
  },
  {
    id: 2,
    title: 'Righteous Fire Chieftain',
    class: 'Marauder',
    ascendancy: 'Chieftain',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=7flriI9ltHM',
    score: 98000,
    replies: 287,
    pobLink: 'https://pohx.net/',
    description: '4.9% poe.ninja share, #2 in HC. Walk-and-burn lazy mapper with Fire Trap for single target. Extremely tanky Chieftain with full website guide at pohx.net.',
    thumbnail: 'https://i.ytimg.com/vi/7flriI9ltHM/hqdefault.jpg',
    author: 'Pohx',
    date: '2026-03-15'
  },
  {
    id: 3,
    title: 'Holy Hammers Inquisitor',
    class: 'Templar',
    ascendancy: 'Inquisitor',
    source: 'forums',
    url: 'https://maxroll.gg/poe/build-guides/holy-hammers-inquisitor-league-starter',
    score: 90000,
    replies: 341,
    pobLink: 'https://maxroll.gg/poe/build-guides/holy-hammers-inquisitor-league-starter',
    description: 'Triple-tagged (Bossing+Mapping+Endgame) on Maxroll, Reddit S-tier. Lightning slam cascading hammers behind targets. Power Charge consumption doubles cascades.',
    thumbnail: null,
    author: 'Maxroll',
    date: '2026-03-15'
  },
  {
    id: 4,
    title: 'Shock Nova of Procession Archmage Hierophant',
    class: 'Templar',
    ascendancy: 'Hierophant',
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=6vyNa69RjUs',
    score: 60000,
    replies: 389,
    pobLink: 'https://maxroll.gg/poe/build-guides/shock-nova-of-procession-archmage-hierophant-league-starter',
    description: '3% poe.ninja share. Overlapping Shock Novas with Archmage mana scaling. Pledge of Hands for Greater Spell Echo. All researchers agree on this build.',
    thumbnail: 'https://i.ytimg.com/vi/6vyNa69RjUs/hqdefault.jpg',
    author: 'Goratha',
    date: '2026-03-15'
  },
  {
    id: 5,
    title: 'Elemental Hit of the Spectrum Deadeye',
    class: 'Ranger',
    ascendancy: 'Deadeye',
    source: 'forums',
    url: 'https://maxroll.gg/poe/build-guides/elemental-hit-of-the-spectrum-deadeye-league-starter',
    score: 132000,
    replies: 276,
    pobLink: 'https://maxroll.gg/poe/build-guides/elemental-hit-of-the-spectrum-deadeye-league-starter',
    description: 'Combined 6.6% poe.ninja share (Slayer+Deadeye). Tri-element ranged projectiles with More Damage per ailment. No required uniques to get started.',
    thumbnail: null,
    author: 'Maxroll',
    date: '2026-03-15'
  },
  {
    id: 6,
    title: 'Lightning Arrow Deadeye',
    class: 'Ranger',
    ascendancy: 'Deadeye',
    source: 'youtube',
    url: 'https://maxroll.gg/poe/build-guides/lightning-arrow-deadeye-league-starter',
    score: 64000,
    replies: 198,
    pobLink: 'https://maxroll.gg/poe/build-guides/lightning-arrow-deadeye-league-starter',
    description: '3.2% poe.ninja share, premier mapper of the league. Screen-wide clear with tailwind. Fast, satisfying bow gameplay.',
    thumbnail: null,
    author: 'Palsteron',
    date: '2026-03-15'
  },
  {
    id: 7,
    title: 'Kinetic Blast of Clustering Necromancer',
    class: 'Witch',
    ascendancy: 'Necromancer',
    source: 'reddit',
    url: 'https://maxroll.gg/poe/build-guides/league-starter/kinetic-blast-of-clustering-necromancer-league-starter',
    score: 98000,
    replies: 415,
    pobLink: 'https://pobb.in/mUh6-imqP-ih',
    description: '4.9% combined poe.ninja share (Necro+Hiero). Screen-filling explosions, Corpse Pact attack speed, capped block via Bone Offering. Ritual farming meta (16.7 div/hr).',
    thumbnail: null,
    author: 'Neeko',
    date: '2026-03-15'
  },
  {
    id: 8,
    title: 'Penance Brand of Dissipation Inquisitor',
    class: 'Templar',
    ascendancy: 'Inquisitor',
    source: 'forums',
    url: 'https://maxroll.gg/poe/build-guides/penance-brand-of-dissipation-inquisitor-league-starter',
    score: 50000,
    replies: 223,
    pobLink: 'https://maxroll.gg/poe/build-guides/penance-brand-of-dissipation-inquisitor-league-starter',
    description: 'Perennial favorite brand build. Inevitable Judgement ignores resistances. Massive screen-clearing explosions with smooth brand playstyle.',
    thumbnail: null,
    author: 'Maxroll',
    date: '2026-03-15'
  },
  {
    id: 9,
    title: 'Poisonous Concoction of Bouncing Pathfinder',
    class: 'Ranger',
    ascendancy: 'Pathfinder',
    source: 'forums',
    url: 'https://maxroll.gg/poe/build-guides/poisonous-concoction-of-bouncing-pathfinder-league-starter',
    score: 40000,
    replies: 167,
    pobLink: 'https://maxroll.gg/poe/build-guides/poisonous-concoction-of-bouncing-pathfinder-league-starter',
    description: 'Triple-tagged, zero uniques needed. Unarmed build using flask charges. Bouncing bottles hit 5-10+ times per throw. Fully SSF-viable league starter.',
    thumbnail: null,
    author: 'Maxroll',
    date: '2026-03-15'
  },
  {
    id: 10,
    title: 'Lightning Trap of Sparking Elementalist',
    class: 'Witch',
    ascendancy: 'Elementalist',
    source: 'forums',
    url: 'https://maxroll.gg/poe/build-guides/lightning-trap-of-sparking-elementalist-league-starter',
    score: 36000,
    replies: 142,
    pobLink: 'https://maxroll.gg/poe/build-guides/lightning-trap-of-sparking-elementalist-league-starter',
    description: 'Triple-tagged endgame build. Piercing/chaining projectiles from traps. Low-Life transition with Shavronne\'s Wrappings + Pain Attunement for massive damage.',
    thumbnail: null,
    author: 'Maxroll',
    date: '2026-03-15'
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
