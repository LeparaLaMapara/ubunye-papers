// Ubunye Papers — shared catalogue helpers (used by the list and the viewer).
// Pulls the real index from the Sekhoto Multiversity vault (Supabase edu-papers).

const LANG = {
  isizulu: 'IsiZulu', isixhosa: 'IsiXhosa', isindebele: 'IsiNdebele',
  siswati: 'Siswati', sesotho: 'Sesotho', sepedi: 'Sepedi', setswana: 'Setswana',
  tshivenda: 'Tshivenda', xitsonga: 'Xitsonga', afrikaans: 'Afrikaans',
};

const TAGS = {
  mathematics: 'MAT', 'mathematical-literacy': 'MLI', 'technical-mathematics': 'TMA',
  'physical-sciences': 'PHY', 'technical-sciences': 'TSC', 'life-sciences': 'LIF',
  'agricultural-sciences': 'AGR', 'business-studies': 'BUS', accounting: 'ACC',
  economics: 'ECO', geography: 'GEO', history: 'HIS', tourism: 'TOU',
  'information-technology': 'IT', 'computer-applications-technology': 'CAT',
  'consumer-studies': 'CON', 'hospitality-studies': 'HOS', 'religion-studies': 'REL',
  'dramatic-arts': 'DRA', 'dance-studies': 'DAN', 'visual-arts': 'VIS', music: 'MUS',
  'civil-technology': 'CIV', 'electrical-technology': 'ELE', 'mechanical-technology': 'MEC',
  english: 'ENG', 'english-home-language': 'ENG', afrikaans: 'AFR', isizulu: 'ZUL',
  isixhosa: 'XHO', isindebele: 'NDE', siswati: 'SWA', sesotho: 'SOT', sepedi: 'PED',
  setswana: 'TSW', tshivenda: 'VEN', xitsonga: 'TSO',
};

function prettySubject(key) {
  const parts = key.split('-');
  const suffix = parts[parts.length - 1];
  let base = key, suf = '';
  if (suffix === 'hl') { suf = ' HL'; base = parts.slice(0, -1).join('-'); }
  else if (suffix === 'fal') { suf = ' FAL'; base = parts.slice(0, -1).join('-'); }
  if (LANG[base]) return LANG[base] + suf;
  const title = base.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return title + suf;
}

function tagFor(key) {
  const base = key.replace(/-(hl|fal)$/, '');
  return TAGS[base] || base.slice(0, 3).toUpperCase();
}

function pdfUrl(cfg, subject, year, n, kind) {
  return `${cfg.base}/storage/v1/object/public/${cfg.bucket}/` +
    `${subject}/${year}/${subject}-p${n}-${kind}-${year}-english.pdf`;
}

function expand(cfg) {
  return cfg.papers.map(([subject, year, n, hasPaper, hasMemo]) => ({
    id: `${subject}-p${n}-${year}`,
    subject,
    subjectName: prettySubject(subject),
    tag: tagFor(subject),
    year,
    paperNo: n,
    hasPaper, hasMemo,
    paperUrl: hasPaper ? pdfUrl(cfg, subject, year, n, 'paper') : null,
    memoUrl: hasMemo ? pdfUrl(cfg, subject, year, n, 'memo') : null,
  }));
}

async function loadCatalogue() {
  const res = await fetch('catalogue.json', { cache: 'no-cache' });
  const cfg = await res.json();
  return { cfg, entries: expand(cfg) };
}
