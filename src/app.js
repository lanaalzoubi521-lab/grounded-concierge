// Raml Home storefront + grounded concierge.
const T = {
  en: { lang: 'العربية', bag: 'Bag', search: 'Search', ask: 'Ask the studio', kicker: 'Ceramics studio · Al Quoz, Dubai',
    h1a: 'One line,', h1b: 'turned on a wheel.', sub: 'Every piece starts as a single profile and is fired in small batches. Drag any piece to turn it.',
    cta1: 'Shop the collection', cta2: 'Ask what is in stock', newIn: 'In the studio now', viewAll: 'View all',
    shop: 'Shop', all: 'All pieces', type: 'Type', glaze: 'Glaze', price: 'Price', avail: 'Available in', items: n => `${n} piece${n === 1 ? '' : 's'}`,
    sort: 'Sort', featured: 'Featured', low: 'Price: low to high', high: 'Price: high to low', clear: 'Clear filters',
    p1: 'Under AED 100', p2: 'AED 100 to 200', p3: 'Over AED 200',
    aed: v => `AED ${v}`, inStock: e => `In stock in ${e}`, soldOut: 'Sold out', onlyIn: e => `Available in ${e}`, left: n => `Only ${n} left`,
    deliverTo: 'Deliver to', qty: 'Quantity', add: 'Add to bag', added: 'Added to bag', maxed: 'All available stock is in your bag', askThis: 'Ask about this piece',
    details: 'Details', care: 'Care', delivery: 'Delivery', height: h => `${h} cm tall`, set: n => n > 1 ? `Set of ${n}` : 'Single piece', related: 'You may also like', angles: 'Angles',
    asOf: 'Stock as of 06:00 today, from the ERP', stockHere: (n, e) => n ? `${n} in stock in ${e}` : `Out of stock in ${e}`,
    placeholder: 'Ask about pieces, stock, delivery or an order', send: 'Ask',
    hello: 'Ask about any piece, stock in your emirate, delivery, returns or an order. I only answer from the live catalogue, and every reply is checked against it.',
    tries: ['A vase under AED 300 in stock in Abu Dhabi', 'Where is my order RH-4102?', 'Can I get a discount?'],
    checked: (n, t) => `${n} fact${n === 1 ? '' : 's'} checked against ${t} live lookup${t === 1 ? '' : 's'}`, unverified: n => `${n} detail${n === 1 ? '' : 's'} could not be verified and ${n === 1 ? 'was' : 'were'} removed`,
    offline: 'Public demo: answers come from catalogue search with the same grounding check, without a language model.', thinking: 'Checking the catalogue…',
    human: 'Talk to a person', hName: 'Your name', hContact: 'Phone or email', hQ: 'Your question', hSend: 'Send to the studio team', hDone: id => `Request ${id} sent. The studio team replies within one working day.`, hNeed: 'Please fill in all three.',
    slow: 'You are sending messages very fast. Please wait a moment.', cap: 'This chat has reached its limit. Please use "Talk to a person".',
    empty: 'Your bag is empty.', subtotal: 'Subtotal', deliveryFee: 'Delivery', free: 'Free', total: 'Total', checkout: 'Checkout is disabled in this demo store.', remove: 'Remove',
    inbox: 'Studio inbox', inboxSub: 'Requests the concierge handed to the team. In production these go to the CRM or WhatsApp.', noTickets: 'No requests yet.', demo: 'Demo store. Raml Home is a fictional company.', close: 'Close', back: 'Back' },
  ar: { lang: 'English', bag: 'السلة', search: 'بحث', ask: 'اسأل الاستوديو', kicker: 'استوديو خزف · القوز، دبي',
    h1a: 'خط واحد،', h1b: 'يدور على عجلة الفخار.', sub: 'كل قطعة تبدأ بخط جانبي واحد وتحرق بكميات صغيرة. اسحب أي قطعة لتديرها.',
    cta1: 'تسوق المجموعة', cta2: 'اسأل عن المتوفر', newIn: 'في الاستوديو الآن', viewAll: 'عرض الكل',
    shop: 'تسوق', all: 'كل القطع', type: 'النوع', glaze: 'الطلاء', price: 'السعر', avail: 'متوفر في', items: n => `${n} قطعة`,
    sort: 'ترتيب', featured: 'المميز', low: 'السعر: من الأقل', high: 'السعر: من الأعلى', clear: 'مسح الفلاتر',
    p1: 'أقل من 100 درهم', p2: 'من 100 إلى 200 درهم', p3: 'أكثر من 200 درهم',
    aed: v => `${v} درهم`, inStock: e => `متوفر في ${e}`, soldOut: 'نفدت الكمية', onlyIn: e => `متوفر في ${e}`, left: n => `بقي ${n} فقط`,
    deliverTo: 'التوصيل إلى', qty: 'الكمية', add: 'أضف إلى السلة', added: 'تمت الإضافة', maxed: 'كل الكمية المتوفرة في سلتك', askThis: 'اسأل عن هذه القطعة',
    details: 'التفاصيل', care: 'العناية', delivery: 'التوصيل', height: h => `الارتفاع ${h} سم`, set: n => n > 1 ? `طقم من ${n}` : 'قطعة واحدة', related: 'قد يعجبك أيضا', angles: 'الزوايا',
    asOf: 'المخزون حتى الساعة 6 صباح اليوم، من نظام ERP', stockHere: (n, e) => n ? `${n} متوفرة في ${e}` : `غير متوفرة في ${e}`,
    placeholder: 'اسأل عن القطع أو المخزون أو التوصيل أو طلبك', send: 'اسأل',
    hello: 'اسأل عن أي قطعة، أو المخزون في إمارتك، أو التوصيل والإرجاع، أو حالة طلبك. أجيب فقط من الكتالوج المباشر، وكل رد يتم التحقق منه.',
    tries: ['مزهرية تحت 300 درهم متوفرة في أبوظبي', 'أين طلبي RH-4102؟', 'هل يوجد خصم؟'],
    checked: (n, t) => `تم التحقق من ${n} معلومة مقابل ${t} استعلام مباشر`, unverified: n => `تم حذف ${n} معلومة لم يمكن التحقق منها`,
    offline: 'نسخة عرض عامة: الإجابات من البحث في الكتالوج مع نفس فحص الدقة، بدون نموذج لغوي.', thinking: 'جار التحقق من الكتالوج…',
    human: 'تحدث مع موظف', hName: 'الاسم', hContact: 'الهاتف أو البريد', hQ: 'سؤالك', hSend: 'أرسل إلى فريق الاستوديو', hDone: id => `تم إرسال الطلب ${id}. يرد فريق الاستوديو خلال يوم عمل واحد.`, hNeed: 'يرجى تعبئة الحقول الثلاثة.',
    slow: 'ترسل الرسائل بسرعة كبيرة. انتظر قليلا.', cap: 'وصلت المحادثة إلى الحد. يرجى استخدام "تحدث مع موظف".',
    empty: 'سلتك فارغة.', subtotal: 'المجموع الفرعي', deliveryFee: 'التوصيل', free: 'مجاني', total: 'المجموع', checkout: 'الدفع غير متاح في هذا المتجر التجريبي.', remove: 'إزالة',
    inbox: 'صندوق الاستوديو', inboxSub: 'الطلبات التي حولها المساعد إلى الفريق. في التشغيل الفعلي تذهب إلى نظام CRM أو واتساب.', noTickets: 'لا توجد طلبات بعد.', demo: 'متجر تجريبي. رمل هوم شركة غير حقيقية.', close: 'إغلاق', back: 'رجوع' },
};
const S = { userMsgs: 0, lang: 'en', f: { kinds: new Set(), glazes: new Set(), price: null, em: null }, sort: 'featured', em: 'DXB', bag: {}, turns: [], thumbs: {}, angles: {}, sample: null, busy: false, sent: [], env: { attempts: {}, tickets: [] }, q: '' };
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = () => T[S.lang];
const P = sku => PRODUCTS.find(p => p.sku === sku);
const bagCount = () => Object.values(S.bag).reduce((a, b) => a + b, 0);
let hero, big, shot;

function profilePath(p, w = 120, h = 220) {
  const H = p.h, R = Math.max(...p.profile.map(q => q[0])), sc = Math.min((h - 10) / H, (w - 10) / R);
  const pt = p.profile.map(([r, y]) => [5 + r * sc, h - 5 - y * sc]);
  let d = `M${pt[0][0].toFixed(1)},${pt[0][1].toFixed(1)}`;
  for (let i = 0; i < pt.length - 1; i++) {
    const p0 = pt[i - 1] || pt[i], p1 = pt[i], p2 = pt[i + 1], p3 = pt[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1.map(v => v.toFixed(1))} ${c2.map(v => v.toFixed(1))} ${p2.map(v => v.toFixed(1))}`;
  }
  return d;
}
const profileSVG = (p, w, h, cls = '') => `<svg class="prof ${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><path d="${profilePath(p, w, h)}" pathLength="1"/></svg>`;

function stockLine(p) {
  const e = Object.entries(p.stock).filter(([, n]) => n > 0).map(([k]) => EMIRATES[k][S.lang]);
  if (!e.length) return `<span class="so">${t().soldOut}</span>`;
  return p.stock[S.em] > 0 ? t().inStock(EMIRATES[S.em][S.lang]) : t().onlyIn(e.join(S.lang === 'ar' ? '، ' : ', '));
}
const tile = (p, i = 0) => `<a class="tile" href="#p-${p.sku}" style="--d:${i * 40}ms"><div class="img"><img src="${S.thumbs[p.sku]}" alt="${esc(p.name[S.lang])}" loading="lazy">${profileSVG(p, 70, 130, 'tp')}</div>
  <div class="meta"><b>${esc(p.name[S.lang])}</b><span>${t().aed(p.price)}</span></div><div class="st">${stockLine(p)}</div></a>`;

// Routing
function route() {
  const h = location.hash.slice(1);
  if (h.startsWith('p-') && P(h.slice(2))) return show('product', h.slice(2));
  if (h.startsWith('shop')) { const k = h.split('-')[1]; if (k && Object.hasOwn(KINDS, k)) { S.f.kinds = new Set([k]); } else if (h === 'shop') S.f.kinds = new Set(); return show('shop'); }
  if (h === 'inbox') return show('inbox');
  show('home');
}
function show(view, sku) {
  if (view === 'product') renderProduct(sku);
  if (view === 'shop') renderShop();
  if (view === 'home') renderHome();
  if (view === 'inbox') renderInbox();
  const cur = document.querySelector('.view.on'), next = $('#v-' + view);
  if (cur !== next) {
    if (cur) { cur.classList.add('out'); setTimeout(() => cur.classList.remove('on', 'out'), 380); }
    setTimeout(() => { next.classList.add('on'); hero[view === 'home' ? 'play' : 'stop'](); big[view === 'product' ? 'play' : 'stop'](); }, cur ? 220 : 0);
  }
  window.scrollTo(0, 0);
  document.querySelectorAll('[data-k]').forEach(a => a.classList.toggle('on', view === 'shop' && S.f.kinds.size === 1 && S.f.kinds.has(a.dataset.k)));
}

function renderHome() { $('#newin').innerHTML = PRODUCTS.filter(p => totalStock(p)).slice(0, 4).map(tile).join(''); }

function renderShop() {
  const L = t();
  const kinds = [...new Set(PRODUCTS.map(p => p.kind))], glazes = [...new Set(PRODUCTS.map(p => p.glaze))];
  const chk = (group, val, label) => `<label class="chk"><input type="checkbox" data-g="${group}" value="${val}" ${S.f[group].has(val) ? 'checked' : ''}><span>${label}</span></label>`;
  const rad = (group, val, label) => `<label class="chk"><input type="radio" name="${group}" data-r="${group}" value="${val}" ${S.f[group] === val ? 'checked' : ''}><span>${label}</span></label>`;
  $('#filters').innerHTML = `
    <div class="fg"><b>${L.type}</b>${kinds.map(k => chk('kinds', k, KINDS[k][S.lang])).join('')}</div>
    <div class="fg"><b>${L.glaze}</b><div class="sw">${glazes.map(g => `<label class="swatch ${S.f.glazes.has(g) ? 'on' : ''}" title="${GLAZES[g][S.lang]}"><input type="checkbox" data-g="glazes" value="${g}" ${S.f.glazes.has(g) ? 'checked' : ''}><i style="background:${GLAZES[g].color}"></i><span>${GLAZES[g][S.lang]}</span></label>`).join('')}</div></div>
    <div class="fg"><b>${L.price}</b>${rad('price', 'p1', L.p1)}${rad('price', 'p2', L.p2)}${rad('price', 'p3', L.p3)}</div>
    <div class="fg"><b>${L.avail}</b>${Object.keys(EMIRATES).map(e => rad('em', e, EMIRATES[e][S.lang])).join('')}</div>
    <button class="link sm" id="clr">${L.clear}</button>`;
  document.querySelectorAll('[data-g]').forEach(i => i.onchange = () => { const s = S.f[i.dataset.g]; i.checked ? s.add(i.value) : s.delete(i.value); renderShop(); });
  document.querySelectorAll('[data-r]').forEach(i => i.onchange = () => { S.f[i.dataset.r] = i.value; renderShop(); });
  $('#clr').onclick = () => { S.f = { kinds: new Set(), glazes: new Set(), price: null, em: null }; S.q = ''; $('#q2').value = ''; renderShop(); };
  const q = S.q.toLowerCase();
  let list = PRODUCTS.filter(p => (!S.f.kinds.size || S.f.kinds.has(p.kind)) && (!S.f.glazes.size || S.f.glazes.has(p.glaze))
    && (!S.f.price || (S.f.price === 'p1' ? p.price < 100 : S.f.price === 'p2' ? p.price >= 100 && p.price <= 200 : p.price > 200))
    && (!S.f.em || p.stock[S.f.em] > 0) && (!q || (p.name.en + ' ' + p.name.ar + ' ' + p.sku).toLowerCase().includes(q)));
  if (S.sort === 'low') list = list.slice().sort((a, b) => a.price - b.price);
  if (S.sort === 'high') list = list.slice().sort((a, b) => b.price - a.price);
  $('#count').textContent = L.items(list.length);
  $('#shop-title').textContent = S.f.kinds.size === 1 ? KINDS[[...S.f.kinds][0]][S.lang] : L.all;
  $('#grid').innerHTML = list.map(tile).join('') || `<p class="none">${L.clear}</p>`;
}

function renderProduct(sku) {
  const p = P(sku), L = t(); S.current = sku;
  big.show(p);
  $('#pd-crumb').innerHTML = `<a href="#shop">${L.shop}</a> / <a href="#shop-${p.kind}">${KINDS[p.kind][S.lang]}</a>`;
  $('#pd-name').textContent = p.name[S.lang];
  $('#pd-price').textContent = L.aed(p.price);
  $('#pd-glaze').innerHTML = `<i style="background:${GLAZES[p.glaze].color}"></i>${GLAZES[p.glaze][S.lang]} · ${L.set(p.set)}`;
  $('#pd-desc').textContent = p.desc[S.lang];
  $('#pd-angles').innerHTML = (S.angles[sku] || []).map((src, i) => `<button data-a="${[0.6, 2.2, 3.9][i]}" aria-label="${L.angles} ${i + 1}"><img src="${src}" alt=""></button>`).join('');
  document.querySelectorAll('#pd-angles button').forEach(b => b.onclick = () => big.setAngle(Number(b.dataset.a)));
  $('#pd-em').innerHTML = Object.keys(EMIRATES).map(e => `<option value="${e}" ${S.em === e ? 'selected' : ''}>${EMIRATES[e][S.lang]}</option>`).join('');
  $('#pd-em').onchange = e => { S.em = e.target.value; renderProduct(sku); };
  const here = p.stock[S.em], inBag = S.bag[sku] || 0, max = Math.max(0, here - inBag);
  $('#pd-stock').innerHTML = `<span class="${here ? 'ok' : 'so'}">${L.stockHere(here, EMIRATES[S.em][S.lang])}</span>${here && here <= 3 ? ` · ${L.left(here)}` : ''}`;
  $('#pd-ship').textContent = POLICIES.delivery[S.lang];
  $('#pd-care').textContent = POLICIES.care[S.lang];
  $('#pd-dims').textContent = `${L.height(p.h)} · ${L.set(p.set)} · ${p.sku}`;
  const qty = $('#pd-qty'); qty.max = String(Math.max(1, max)); qty.value = '1'; qty.disabled = !max;
  const add = $('#pd-add');
  add.disabled = !max; add.textContent = !here ? L.soldOut : !max ? L.maxed : L.add;
  add.onclick = () => { const n = Math.min(max, Math.max(1, parseInt(qty.value, 10) || 1)); S.bag[sku] = inBag + n; renderBag(); renderProduct(sku); toast(L.added); };
  $('#pd-ask').onclick = () => openChat(S.lang === 'ar' ? `أخبرني عن ${p.name.ar}` : `Tell me about the ${p.name.en}`);
  $('#pd-prof').innerHTML = profileSVG(p, 22, 40, 'draw');
  $('#related').innerHTML = PRODUCTS.filter(x => x.sku !== sku && (x.kind === p.kind || x.glaze === p.glaze)).slice(0, 4).map(tile).join('');
}

function renderBag() {
  const L = t(); $('#bagn').textContent = bagCount();
  const items = Object.entries(S.bag).filter(([, n]) => n > 0);
  const sub = items.reduce((a, [s, n]) => a + P(s).price * n, 0);
  const fee = sub === 0 || sub > 500 ? 0 : 25; // from the delivery policy: free over AED 500, otherwise AED 25
  $('#bag-list').innerHTML = items.length ? items.map(([s, n]) => { const p = P(s), max = p.stock[S.em]; return `<li><img src="${S.thumbs[s]}" alt=""><div><b>${esc(p.name[S.lang])}</b><span>${L.aed(p.price)}</span>
    <div class="stepper"><button data-dec="${s}" aria-label="-">−</button><span>${n}</span><button data-inc="${s}" ${n >= max ? 'disabled' : ''} aria-label="+">+</button><button class="rm" data-rm="${s}">${L.remove}</button></div></div><b>${L.aed(p.price * n)}</b></li>`; }).join('') : `<li class="e">${L.empty}</li>`;
  document.querySelectorAll('[data-inc]').forEach(b => b.onclick = () => { const s = b.dataset.inc; if (S.bag[s] < P(s).stock[S.em]) S.bag[s]++; renderBag(); });
  document.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => { const s = b.dataset.dec; S.bag[s] = Math.max(0, S.bag[s] - 1); if (!S.bag[s]) delete S.bag[s]; renderBag(); });
  document.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { delete S.bag[b.dataset.rm]; renderBag(); });
  $('#b-sub').textContent = L.aed(sub); $('#b-fee').textContent = fee ? L.aed(fee) : L.free; $('#b-tot').textContent = L.aed(sub + fee);
}

function renderInbox() {
  const L = t();
  $('#tickets').innerHTML = S.env.tickets.length ? S.env.tickets.slice().reverse().map(x => `<tr><td class="mono">${esc(x.id)}</td><td>${esc(x.name)}<span class="sub">${esc(x.contact)}</span></td><td>${esc(x.question)}</td><td class="mute">${esc(x.at.slice(11, 16))}</td></tr>`).join('') : `<tr><td colspan="4" class="mute">${L.noTickets}</td></tr>`;
}

function applyLang() {
  const L = t();
  document.documentElement.lang = S.lang; document.documentElement.dir = S.lang === 'ar' ? 'rtl' : 'ltr'; hero?.resize();
  document.querySelectorAll('[data-t]').forEach(el => { const v = L[el.dataset.t]; el.textContent = typeof v === 'function' ? v() : v; });
  document.querySelectorAll('[data-k]').forEach(a => a.textContent = KINDS[a.dataset.k][S.lang] + (S.lang === 'en' && !/s$/.test(KINDS[a.dataset.k].en) ? 's' : ''));
  $('#q').placeholder = L.placeholder; $('#q2').placeholder = L.search;
  $('#sort').innerHTML = ['featured', 'low', 'high'].map(v => `<option value="${v}" ${S.sort === v ? 'selected' : ''}>${L[v]}</option>`).join('');
  $('#tries').innerHTML = L.tries.map(x => `<button>${esc(x)}</button>`).join('');
  document.querySelectorAll('#tries button').forEach(b => b.onclick = () => ask(b.textContent));
  $('#mode').textContent = S.sample ? '' : L.offline;
  $('#announce').textContent = POLICIES.delivery[S.lang];
  renderBag(); route();
}

// Concierge
function openChat(q) { document.body.classList.add('chat-open'); document.body.classList.remove('bag-open'); if (q) ask(q); else setTimeout(() => $('#q').focus(), 300); }
function renderReply(text, check, handoff) {
  const skus = [];
  const html = esc(text).replace(/\s*\[(RH-[A-Z]{2}-\d{3})\]/g, (m, s) => { if (P(s)) skus.push(s); return ''; });
  const cards = [...new Set(skus)].map(s => { const p = P(s); return `<a class="card" href="#p-${s}"><img src="${S.thumbs[s]}" alt=""><span><b>${esc(p.name[S.lang])}</b>${t().aed(p.price)} · ${stockLine(p)}</span></a>`; }).join('');
  const g = check && (check.checked || check.failed) ? `<em class="g ${check.failed ? 'warn' : ''}">${check.failed ? t().unverified(check.failed) : t().checked(check.checked, check.tools)}</em>` : '';
  return `<p>${html}</p>${cards}${g}${check?.stock ? `<em class="g">${t().asOf}</em>` : ''}${handoff ? `<button class="link sm" data-human>${t().human}</button>` : ''}`;
}
function bubble(cls, html) { const li = document.createElement('li'); li.className = cls; li.innerHTML = html; $('#msgs').appendChild(li); $('#msgs').scrollTop = 1e9; return li; }
function wireHuman() { document.querySelectorAll('[data-human]').forEach(b => b.onclick = humanForm); }

function rateOk() {
  const now = Date.now(); S.sent = S.sent.filter(x => now - x < 60000);
  if (S.userMsgs >= 40) return t().cap;
  if (S.sent.length >= 8) return t().slow;
  S.sent.push(now); return null;
}

async function ask(q) {
  q = String(q).trim().slice(0, 600); if (!q || S.busy) return;
  const limit = rateOk(); if (limit) { bubble('bot', `<p>${esc(limit)}</p><button class="link sm" data-human>${t().human}</button>`); wireHuman(); return; }
  S.busy = true; S.userMsgs++; $('#q').value = ''; $('#tries').style.display = 'none';
  bubble('me', `<p>${esc(q)}</p>`);
  const out = bubble('bot', `<p class="wait">${t().thinking}</p>`);
  if (!S.sample) {
    const r = offlineAnswer(q, S.lang);
    setTimeout(() => { const g = groundingCheck(r.text, r.trace, q); out.innerHTML = renderReply(redactSpans(r.text, g.spans), g, r.handoff); wireHuman(); S.busy = false; $('#msgs').scrollTop = 1e9; }, 300);
    return;
  }
  const trace = [];
  S.turns.push({ role: 'user', content: q });
  const steps = { search_products: ['Searching the catalogue', 'البحث في الكتالوج'], get_product: ['Checking a piece', 'التحقق من قطعة'], get_policy: ['Reading the store policy', 'قراءة سياسة المتجر'], get_order_status: ['Verifying the order', 'التحقق من الطلب'], handoff_to_team: ['Opening a request for the team', 'فتح طلب للفريق'] };
  const tools = conciergeTools(trace, S.env).map(tl => ({ ...tl, execute: (input, c) => { out.querySelector('.wait').textContent = steps[tl.name]?.[S.lang === 'ar' ? 1 : 0] + '…'; return tl.execute(input, c); } }));
  try {
    // Nothing is shown until the full reply has passed the grounding check.
    const { text } = await S.sample([{ role: 'user', content: conciergeRules(S.lang) }, ...S.turns.slice(-10)], { tools });
    const check = groundingCheck(text, trace, q);
    const shown = check.promises.length ? (S.lang === 'ar' ? 'لا أستطيع تقديم هذا العرض. يمكنني تحويل طلبك إلى فريق الاستوديو.' : "I can't offer that. I can pass your request to the studio team.") : redactSpans(text, check.spans);
    out.innerHTML = renderReply(shown, check, check.promises.length || /studio team|فريق الاستوديو/.test(shown));
    wireHuman();
    S.turns.push({ role: 'assistant', content: shown });
  } catch (e) {
    out.innerHTML = `<p>${esc(e.text || '')}</p><em class="g warn">${e.code === 'not_granted' ? (S.lang === 'ar' ? 'يحتاج المساعد إلى إذن لاستخدام حسابك في Claude.' : 'The concierge needs your permission to use your Claude account.') : (S.lang === 'ar' ? 'تعذر الرد الآن. حاول مرة أخرى.' : 'Could not answer just now. Try again.')}</em>`;
    S.turns.pop();
  } finally { S.busy = false; $('#msgs').scrollTop = 1e9; }
}

function humanForm() {
  const L = t();
  const li = bubble('bot form', `<form class="hf"><b>${L.human}</b><input name="n" placeholder="${L.hName}" maxlength="80" autocomplete="name"><input name="c" placeholder="${L.hContact}" maxlength="80" autocomplete="tel"><textarea name="q" placeholder="${L.hQ}" maxlength="500" rows="3"></textarea><button class="primary sm">${L.hSend}</button><em class="g"></em></form>`);
  const f = li.querySelector('form');
  f.onsubmit = e => {
    e.preventDefault();
    const n = f.n.value.trim(), c = f.c.value.trim(), q = f.q.value.trim();
    if (!n || !c || !q) { f.querySelector('em').textContent = L.hNeed; return; }
    const tool = conciergeTools([], S.env).find(x => x.name === 'handoff_to_team');
    const r = tool.execute({ name: n, contact: c, question: q });
    li.innerHTML = `<p>${esc(L.hDone(r.ticket))}</p>`;
  };
}
function toast(m) { const el = $('#toast'); el.textContent = m; el.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove('on'), 2200); }

document.addEventListener('DOMContentLoaded', () => {
  const bg = '#ECE8E0';
  shot = createStage($('#shot'), { bg, fit: 0.92 });
  for (const p of PRODUCTS) { S.angles[p.sku] = [0.6, 2.2, 3.9].map(a => shot.snapshot(p, a)); S.thumbs[p.sku] = S.angles[p.sku][0]; }
  hero = createStage($('#hero'), { interactive: true, bg, fit: 0.6, shiftX: innerWidth > 900 ? 0.2 : 0 }); hero.show(P('RH-VS-102'));
  big = createStage($('#big'), { interactive: true, bg, fit: 0.9 });
  $('#hero-prof').innerHTML = profileSVG(P('RH-VS-102'), 140, 240, 'draw');
  window.addEventListener('hashchange', route);
  $('#langbtn').onclick = () => { S.lang = S.lang === 'en' ? 'ar' : 'en'; S.turns = []; $('#msgs').innerHTML = `<li class="bot"><p>${esc(T[S.lang].hello)}</p></li>`; $('#tries').style.display = ''; applyLang(); };
  document.querySelectorAll('[data-chat]').forEach(b => b.onclick = e => { e.preventDefault(); openChat(); });
  $('#chat-x').onclick = () => document.body.classList.remove('chat-open');
  $('#bagbtn').onclick = () => { document.body.classList.toggle('bag-open'); document.body.classList.remove('chat-open'); };
  $('#bag-x').onclick = () => document.body.classList.remove('bag-open');
  $('#form').onsubmit = e => { e.preventDefault(); ask($('#q').value); };
  $('#human').onclick = humanForm;
  $('#sort').onchange = e => { S.sort = e.target.value; renderShop(); };
  $('#q2').oninput = e => { S.q = e.target.value; if (!location.hash.startsWith('#shop')) location.hash = 'shop'; else renderShop(); };
  S.env.onTicket = () => { $('#inbox-n').textContent = S.env.tickets.length; if (location.hash === '#inbox') renderInbox(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') document.body.classList.remove('chat-open', 'bag-open'); });
  $('#msgs').innerHTML = `<li class="bot"><p>${esc(T.en.hello)}</p></li>`;
  applyLang();
  if (window.claude?.use) window.claude.use('sample').then(async s => {
    if (!s) return; const lim = await s.limits().catch(() => null); if (!lim?.tools) return;
    S.sample = s; $('#mode').textContent = '';
  }).catch(() => {});
});
