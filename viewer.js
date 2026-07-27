// Ubunye Papers — single paper viewer. Reads ?id= and renders from the catalogue.
// Supports a memo view (?memo=1). For real papers set type:'pdf' + file (embedded).

function param(name) { return new URLSearchParams(location.search).get(name); }

const id = param('id');
const showMemo = param('memo') === '1';
const paper = (window.CATALOGUE || []).find(p => p.id === id);
const sheet = document.getElementById('sheet');
const barTitle = document.getElementById('barTitle');
const toggle = document.getElementById('toggle');

if (!paper) {
  barTitle.textContent = 'Not found';
  toggle.style.display = 'none';
  sheet.innerHTML = '<p class="demo">This paper is not in the catalogue. <a href="index.html">Go back</a>.</p>';
} else {
  barTitle.textContent = `${paper.subject} ${paper.paper} · ${paper.year}`;

  // Memo toggle in the top bar (only if the paper has a memo)
  if (paper.hasMemo && paper.memo) {
    toggle.textContent = showMemo ? 'Paper' : 'Memo';
    toggle.href = showMemo ? `paper.html?id=${id}` : `paper.html?id=${id}&memo=1`;
  } else {
    toggle.style.display = 'none';
  }

  const demoNote = `<div class="demo"><b>Demo sample.</b> Illustrative content for the Ubunye Papers offline demo — not the official DBE document.</div>`;

  if (showMemo && paper.memo) {
    sheet.innerHTML = demoNote +
      `<h1>${paper.subject}: ${paper.paper}</h1>` +
      `<p class="subhead">Marking guideline (memo) · ${paper.year}</p>` +
      `<div class="rule"></div>` +
      paper.memo.map(m => `<div class="q"><span class="n">Question ${m.n}</span><br>${m.text}</div>`).join('') +
      `<p class="foot">End of demo memo · saved on your phone · 0 MB to reopen</p>`;
  } else {
    sheet.innerHTML = demoNote +
      `<h1>${paper.subject}: ${paper.paper}</h1>` +
      `<p class="subhead">Grade 12 · National Senior Certificate · Time: ${paper.duration} · ${paper.marks} marks</p>` +
      `<div class="rule"></div>` +
      paper.questions.map(q => {
        const parts = q.parts ? `<ol type="a">${q.parts.map(p => `<li>${p}</li>`).join('')}</ol>` : '';
        return `<div class="q"><span class="marks">(${q.marks})</span><span class="n">Question ${q.n}</span><br>${q.text}${parts}</div>`;
      }).join('') +
      `<p class="foot">End of demo extract · saved on your phone · 0 MB to reopen</p>`;
  }
}

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
