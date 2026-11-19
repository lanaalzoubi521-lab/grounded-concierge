// Raml Home storefront + grounded concierge.
const T = {
  en: { shop: 'Collection', ask: 'Concierge', bag: 'Bag', lang: 'العربية', kicker: 'Raml Home · Ceramics studio, Al Quoz, Dubai',
    h1a: 'One line,', h1b: 'turned on a wheel.', sub: 'Every piece starts as a single profile. What you see is drawn live from that line, in the glaze it is fired in.',
    cta1: 'See the collection', cta2: 'Ask what is in stock', all: 'All', aed: v => `AED ${v}`, inStock: e => `In stock in ${e}`, soldOut: 'Sold out', onlyIn: e => `Available in ${e}`,
    stockBy: 'Stock by emirate', add: 'Add to bag', added: 'Added', askThis: 'Ask about this piece', profile: 'Profile', set: n => n > 1 ? `Set of ${n}` : '', height: h => `${h} cm tall`,
    asOf: 'Stock as of 06:00 today, from the ERP', placeholder: 'Ask about pieces, stock or delivery', send: 'Ask',
    hello: 'Ask me about any piece, what is in stock in your emirate, delivery or returns. I only answer from the live catalogue.',
    tries: ['A vase under AED 300 in stock in Abu Dhabi', 'Is the ivory deep bowl available?', 'How long is delivery to Sharjah?'],
    checked: (n, t) => `${n} fact${n === 1 ? '' : 's'} checked against ${t} live lookup${t === 1 ? '' : 's'}`, unverified: n => `${n} detail${n === 1 ? '' : 's'} could not be verified and ${n === 1 ? 'was' : 'were'} hidden`,
    offline: 'Catalogue search mode. The full concierge runs when this page is opened inside Claude.', thinking: 'Checking the catalogue…', empty: 'Your bag is empty.', total: 'Total', checkout: 'Checkout is disabled in this demo store.', demo: 'Demo store. Raml Home is a fictional company.', close: 'Close', view: 'View' },
  ar: { shop: 'المجموعة', ask: 'المساعد', bag: 'السلة', lang: 'English', kicker: 'رمل هوم · استوديو خزف، القوز، دبي',
    h1a: 'خط واحد،', h1b: 'يدور على عجلة الفخار.', sub: 'كل قطعة تبدأ بخط جانبي واحد. ما تراه مرسوم مباشرة من هذا الخط، بالطلاء الذي تحرق به.',
    cta1: 'شاهد المجموعة', cta2: 'اسأل عن المتوفر', all: 'الكل', aed: v => `${v} درهم`, inStock: e => `متوفر في ${e}`, soldOut: 'نفدت الكمية', onlyIn: e => `متوفر في ${e}`,
    stockBy: 'المخزون حسب الإمارة', add: 'أضف إلى السلة', added: 'تمت الإضافة', askThis: 'اسأل عن هذه القطعة', profile: 'الخط الجانبي', set: n => n > 1 ? `طقم من ${n}` : '', height: h => `الارتفاع ${h} سم`,
    asOf: 'المخزون حتى الساعة 6 صباح اليوم، من نظام ERP', placeholder: 'اسأل عن القطع أو المخزون أو التوصيل', send: 'اسأل',
    hello: 'اسألني عن أي قطعة، أو ما هو متوفر في إمارتك، أو التوصيل والإرجاع. أجيب فقط من الكتالوج المباشر.',
    tries: ['مزهرية تحت 300 درهم متوفرة في أبوظبي', 'هل الوعاء العميق العاجي متوفر؟', 'كم يستغرق التوصيل إلى الشارقة؟'],
    checked: (n, t) => `تم التحقق من ${n} معلومة مقابل ${t} استعلام مباشر`, unverified: n => `تم إخفاء ${n} معلومة لم يمكن التحقق منها`,
    offline: 'وضع البحث في الكتالوج. المساعد الكامل يعمل عند فتح الصفحة داخل Claude.', thinking: 'جار التحقق من الكتالوج…', empty: 'سلتك فارغة.', total: 'المجموع', checkout: 'الدفع غير متاح في هذا المتجر التجريبي.', demo: 'متجر تجريبي. رمل هوم شركة غير حقيقية.', close: 'إغلاق', view: 'عرض' },
};
const S = { lang: 'en', kind: null, bag: [], turns: [], thumbs: {}, sample: null, busy: false };
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = () => T[S.lang];
const P = sku => PRODUCTS.find(p => p.sku === sku);
let hero, big, shot;

function profilePath(p, w = 120, h = 220) {
  const H = p.h, R = Math.max(...p.profile.map(q => q[0]));
  const sc = Math.min((h - 10) / H, (w - 10) / R);
  const pt = p.profile.map(([r, y]) => [5 + r * sc, h - 5 - y * sc]);
  let d = `M${pt[0][0].toFixed(1)},${pt[0][1].toFixed(1)}`;
  for (let i = 0; i < pt.length - 1; i++) { // Catmull-Rom to Bezier, same smoothing family as the 3D spline
    const p0 = pt[i - 1] || pt[i], p1 = pt[i], p2 = pt[i + 1], p3 = pt[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1.map(v => v.toFixed(1))} ${c2.map(v => v.toFixed(1))} ${p2.map(v => v.toFixed(1))}`;
  }
  return d;
}
const profileSVG = (p, w, h, cls = '') => `<svg class="prof ${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><path d="${profilePath(p, w, h)}" pathLength="1"/></svg>`;

function stockLine(p) {
  const e = Object.entries(p.stock).filter(([, n]) => n > 0).map(([k]) => EMIRATES[k][S.lang]);
  if (!e.length) return `<span class="so">${t().soldOut}</span>`;
  return p.stock.DXB > 0 ? t().inStock(EMIRATES.DXB[S.lang]) : t().onlyIn(e.join(S.lang === 'ar' ? '، ' : ', '));
}

function route() {
  const h = location.hash.slice(1);
  if (h.startsWith('p-') && P(h.slice(2))) return show('product', h.slice(2));
  if (h === 'collection') return show('collection');
  show('home');
}

function show(view, sku) {
  const cur = document.querySelector('.view.on'), next = $('#v-' + view);
  if (view === 'product') renderProduct(sku);
  if (view === 'collection') renderCollection();
  if (cur !== next) {
    if (cur) { cur.classList.add('out'); setTimeout(() => cur.classList.remove('on', 'out'), 420); }
    setTimeout(() => { next.classList.add('on'); window.scrollTo(0, 0); if (view === 'home') hero.play(); else hero.stop(); if (view === 'product') big.play(); else big.stop(); }, cur ? 260 : 0);
  }
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === view));
}

function renderCollection() {
  const kinds = [...new Set(PRODUCTS.map(p => p.kind))];
  $('#kinds').innerHTML = [`<button class="${!S.kind ? 'on' : ''}" data-k="">${t().all}</button>`, ...kinds.map(k => `<button class="${S.kind === k ? 'on' : ''}" data-k="${k}">${KINDS[k][S.lang]}</button>`)].join('');
  document.querySelectorAll('#kinds button').forEach(b => b.onclick = () => { S.kind = b.dataset.k || null; renderCollection(); });
  const list = PRODUCTS.filter(p => !S.kind || p.kind === S.kind);
  $('#grid').innerHTML = list.map((p, i) => `
    <a class="tile" href="#p-${p.sku}" style="--d:${i * 50}ms">
      <div class="img"><img src="${S.thumbs[p.sku]}" alt="${esc(p.name[S.lang])}">${profileSVG(p, 80, 150, 'tp')}</div>
      <div class="meta"><b>${esc(p.name[S.lang])}</b><span>${t().aed(p.price)}</span></div>
      <div class="st">${stockLine(p)}</div>
    </a>`).join('');
}

function renderProduct(sku) {
  const p = P(sku); S.current = sku;
  big.show(p);
  $('#pd-kind').textContent = `${KINDS[p.kind][S.lang]} · ${GLAZES[p.glaze][S.lang]}`;
  $('#pd-name').textContent = p.name[S.lang];
  $('#pd-price').textContent = t().aed(p.price);
  $('#pd-desc').textContent = p.desc[S.lang];
  $('#pd-spec').textContent = [t().height(p.h), t().set(p.set)].filter(Boolean).join(' · ');
  $('#pd-prof').innerHTML = profileSVG(p, 60, 110, 'draw');
  $('#pd-stock').innerHTML = Object.entries(p.stock).map(([k, n]) => `<div><dt>${EMIRATES[k][S.lang]}</dt><dd class="${n ? '' : 'z'}">${n || '0'}</dd></div>`).join('');
  const add = $('#pd-add'); add.disabled = totalStock(p) === 0; add.textContent = totalStock(p) ? t().add : t().soldOut;
  add.onclick = () => { S.bag.push(sku); renderBag(); add.textContent = t().added; setTimeout(() => (add.textContent = t().add), 1400); };
  $('#pd-ask').onclick = () => openChat(S.lang === 'ar' ? `أخبرني عن ${p.name.ar}` : `Tell me about the ${p.name.en}`);
}

function renderBag() {
  $('#bagn').textContent = S.bag.length;
  const items = S.bag.map(P);
  $('#bag-list').innerHTML = items.length ? items.map(p => `<li><img src="${S.thumbs[p.sku]}" alt=""><span>${esc(p.name[S.lang])}</span><b>${t().aed(p.price)}</b></li>`).join('') : `<li class="e">${t().empty}</li>`;
  $('#bag-total').textContent = t().aed(items.reduce((a, p) => a + p.price, 0));
}

function applyLang() {
  const L = t();
  document.documentElement.lang = S.lang; document.documentElement.dir = S.lang === 'ar' ? 'rtl' : 'ltr'; hero?.resize();
  document.querySelectorAll('[data-t]').forEach(el => { const v = L[el.dataset.t]; el.textContent = typeof v === 'function' ? v() : v; });
  $('#q').placeholder = L.placeholder;
  $('#tries').innerHTML = L.tries.map(x => `<button>${esc(x)}</button>`).join('');
  document.querySelectorAll('#tries button').forEach(b => b.onclick = () => ask(b.textContent));
  $('#mode').textContent = S.sample ? '' : L.offline;
  renderBag(); route();
}

// Concierge
function openChat(q) { document.body.classList.add('chat-open'); if (q) ask(q); else setTimeout(() => $('#q').focus(), 300); }
function renderReply(text, check) {
  const skus = [];
  const html = esc(text).replace(/\s*\[(RH-[A-Z]{2}-\d{3})\]/g, (m, s) => { if (P(s)) { skus.push(s); return ''; } return ''; });
  const cards = [...new Set(skus)].map(s => { const p = P(s); return `<a class="card" href="#p-${s}"><img src="${S.thumbs[s]}" alt=""><span><b>${esc(p.name[S.lang])}</b>${t().aed(p.price)} · ${stockLine(p)}</span></a>`; }).join('');
  const g = check ? `<em class="g ${check.failed ? 'warn' : ''}">${check.failed ? t().unverified(check.failed) : check.checked ? t().checked(check.checked, check.tools) : ''}</em>` : '';
  return `<p>${html}</p>${cards}${g}<em class="g">${check?.stock ? t().asOf : ''}</em>`;
}
function bubble(cls, html) { const li = document.createElement('li'); li.className = cls; li.innerHTML = html; $('#msgs').appendChild(li); $('#msgs').scrollTop = 1e9; return li; }

async function ask(q) {
  q = q.trim(); if (!q || S.busy) return;
  S.busy = true; $('#q').value = ''; $('#tries').style.display = 'none';
  bubble('me', `<p>${esc(q)}</p>`);
  const out = bubble('bot', `<p class="wait">${t().thinking}</p>`);
  if (!S.sample) {
    const r = offlineAnswer(q, S.lang);
    setTimeout(() => { out.innerHTML = renderReply(r.text, groundingCheck(r.text, r.trace)); S.busy = false; $('#msgs').scrollTop = 1e9; }, 350);
    return;
  }
  const trace = [];
  S.turns.push({ role: 'user', content: q });
  try {
    const { text } = await S.sample([{ role: 'user', content: conciergeRules(S.lang) }, ...S.turns.slice(-8)], {
      tools: conciergeTools(trace),
      onText: ({ text }) => { out.innerHTML = `<p>${esc(text.replace(/\s*\[RH-[A-Z]{2}-\d{3}\]/g, ''))}</p>`; $('#msgs').scrollTop = 1e9; },
    });
    const check = groundingCheck(text, trace);
    let shown = text;
    for (const n of check.badFacts) shown = shown.replace(new RegExp(`(AED\\s?)?${n}(\\s?درهم)?`, 'g'), '…');
    out.innerHTML = renderReply(shown, check);
    S.turns.push({ role: 'assistant', content: text });
  } catch (e) {
    out.innerHTML = `<p>${esc(e.text || '')}</p><em class="g warn">${e.code === 'not_granted' ? (S.lang === 'ar' ? 'يحتاج المساعد إلى إذن لاستخدام حسابك في Claude.' : 'The concierge needs your permission to use your Claude account.') : (S.lang === 'ar' ? 'تعذر الرد الآن. حاول مرة أخرى.' : 'Could not answer just now. Try again.')}</em>`;
    S.turns.pop();
  } finally { S.busy = false; $('#msgs').scrollTop = 1e9; }
}

document.addEventListener('DOMContentLoaded', () => {
  const bg = '#ECE8E0';
  shot = createStage($('#shot'), { bg, fit: 0.92 });
  for (const p of PRODUCTS) S.thumbs[p.sku] = shot.snapshot(p);
  hero = createStage($('#hero'), { interactive: true, bg, fit: 0.6, shiftX: innerWidth > 900 ? 0.2 : 0 }); hero.show(P('RH-VS-102'));
  big = createStage($('#big'), { interactive: true, bg, fit: 0.9 });
  $('#hero-prof').innerHTML = profileSVG(P('RH-VS-102'), 140, 240, 'draw');
  window.addEventListener('hashchange', route);
  $('#langbtn').onclick = () => { S.lang = S.lang === 'en' ? 'ar' : 'en'; S.turns = []; $('#msgs').innerHTML = `<li class="bot"><p>${esc(T[S.lang].hello)}</p></li>`; $('#tries').style.display = ''; applyLang(); };
  document.querySelectorAll('[data-chat]').forEach(b => b.onclick = e => { e.preventDefault(); openChat(); });
  $('#chat-x').onclick = () => document.body.classList.remove('chat-open');
  $('#bagbtn').onclick = () => document.body.classList.toggle('bag-open');
  $('#bag-x').onclick = () => document.body.classList.remove('bag-open');
  $('#form').onsubmit = e => { e.preventDefault(); ask($('#q').value); };
  $('#msgs').innerHTML = `<li class="bot"><p>${esc(T.en.hello)}</p></li>`;
  applyLang();
  if (window.claude?.use) window.claude.use('sample').then(async s => {
    if (!s) return; const lim = await s.limits().catch(() => null); if (!lim?.tools) return;
    S.sample = s; $('#mode').textContent = '';
  }).catch(() => {});
});
