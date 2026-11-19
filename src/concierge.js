// The concierge. It may only state what its tools returned in this turn.
// A grounding check then verifies every price, stock count and SKU in the reply against those tool results.
import { PRODUCTS, GLAZES, KINDS, EMIRATES, POLICIES, STOCK_AS_OF, searchProducts, productFacts, totalStock } from './catalog.js';

export function conciergeTools(trace) {
  const rec = (name, input, out) => { trace.push({ name, input, out }); return out; };
  return [
    { name: 'search_products', description: 'Search the Raml Home catalogue. Returns matching products with price in AED and stock by emirate (DXB, AUH, SHJ). All filters optional.',
      inputSchema: { type: 'object', properties: {
        kind: { type: 'string', enum: Object.keys(KINDS) }, glaze: { type: 'string', enum: Object.keys(GLAZES) },
        maxPrice: { type: 'number' }, minPrice: { type: 'number' }, emirate: { type: 'string', enum: Object.keys(EMIRATES) }, inStockOnly: { type: 'boolean' } } },
      execute: input => rec('search_products', input, { stockAsOf: STOCK_AS_OF, results: searchProducts({ ...input, maxPrice: input.maxPrice ?? undefined, minPrice: input.minPrice ?? undefined }).map(productFacts) }) },
    { name: 'get_product', description: 'Full facts for one product by SKU, including stock by emirate.',
      inputSchema: { type: 'object', properties: { sku: { type: 'string' } }, required: ['sku'] },
      execute: ({ sku }) => { const p = PRODUCTS.find(x => x.sku === String(sku).toUpperCase()); if (!p) throw new Error('Unknown SKU'); return rec('get_product', { sku }, { stockAsOf: STOCK_AS_OF, ...productFacts(p) }); } },
    { name: 'get_policy', description: 'Store policy text. Topics: delivery, returns, pickup, care.',
      inputSchema: { type: 'object', properties: { topic: { type: 'string', enum: Object.keys(POLICIES) } }, required: ['topic'] },
      execute: ({ topic }) => { const t = POLICIES[topic]; if (!t) throw new Error('Unknown topic'); return rec('get_policy', { topic }, { topic, en: t.en, ar: t.ar }); } },
  ];
}

export function conciergeRules(lang) {
  return `You are the concierge for Raml Home, a ceramics studio in Dubai. You help customers find pieces and answer questions about stock, prices, delivery, returns, pickup and care.

Rules:
- State a price, stock number, size or policy ONLY if a tool returned it in this conversation. Call the tools first.
- If the tools cannot answer, say you do not have that information and offer to connect the customer with the studio team. Never guess.
- When you mention a product, write its SKU in square brackets right after its name, like Dune vase, tall [RH-VS-101]. The page turns these into product cards.
- Stock is by emirate: DXB Dubai, AUH Abu Dhabi, SHJ Sharjah. If an item is out of stock where the customer is, say so and offer an emirate that has it or a similar piece.
- Reply in ${lang === 'ar' ? 'Arabic (clear Modern Standard Arabic, warm and simple). Prices as "240 درهم".' : 'English. Prices as "AED 240".'} Reply in the customer's language if they switch.
- Two to five short sentences. No markdown, no lists unless comparing more than two products.`;
}

// Grounding check: every number and SKU in the reply must appear in this turn's tool results.
export function groundingCheck(reply, trace) {
  const toArabicDigits = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const text = toArabicDigits(reply);
  const blob = JSON.stringify(trace.map(t => t.out));
  const known = new Set((blob.match(/\d+(\.\d+)?/g) || []).map(Number));
  const skus = [...new Set(text.match(/RH-[A-Z]{2}-\d{3}/g) || [])];
  const facts = [];
  for (const m of text.matchAll(/(?:AED\s?(\d[\d,]*))|(?:(\d[\d,]*)\s?(?:درهم|د\.إ|AED))/g)) facts.push(Number((m[1] || m[2]).replace(/,/g, '')));
  for (const m of text.matchAll(/(\d+)\s?(?:in stock|left|pieces|available|قطع|قطعة|متوفر|متوفرة)/gi)) facts.push(Number(m[1]));
  const badSku = skus.filter(s => !blob.includes(s));
  const badFacts = facts.filter(n => !known.has(n));
  return { stock: trace.some(t => t.name !== 'get_policy'), skus: skus.filter(s => !badSku.includes(s)), checked: facts.length + skus.length, failed: badFacts.length + badSku.length, badFacts, badSku, tools: trace.length };
}

// Offline responder: same retrieval, no language model. Used where the page runs outside Claude.
export function offlineAnswer(q, lang) {
  const s = q.toLowerCase();
  const find = (dict, key = 'words') => Object.entries(dict).find(([, v]) => (v[key] || [v.en.toLowerCase(), v.ar]).some(w => s.includes(String(w).toLowerCase())))?.[0];
  const kind = find(KINDS);
  const glaze = Object.entries(GLAZES).find(([k, v]) => s.includes(k) || s.includes(v.en.toLowerCase()) || s.includes(v.ar))?.[0];
  const emirate = Object.entries(EMIRATES).find(([k, v]) => s.includes(k.toLowerCase()) || s.includes(v.en.toLowerCase()) || s.includes(v.ar))?.[0];
  const price = s.match(/(?:under|below|less than|max|تحت|أقل من|اقل من|حتى)\s*(?:aed\s*)?(\d+)/);
  const ar = lang === 'ar';
  const trace = [];
  for (const [topic, words] of Object.entries({ delivery: ['deliver', 'shipping', 'توصيل', 'شحن'], returns: ['return', 'refund', 'إرجاع', 'ارجاع', 'استرجاع'], pickup: ['pickup', 'pick up', 'collect', 'استلام'], care: ['dishwasher', 'food safe', 'care', 'غسالة', 'آمن', 'تنظيف'] })) {
    if (words.some(w => s.includes(w))) { trace.push({ name: 'get_policy', out: POLICIES[topic] }); return { text: POLICIES[topic][ar ? 'ar' : 'en'], trace }; }
  }
  if (!kind && !glaze && !price) return { text: ar ? 'أستطيع المساعدة في القطع والأسعار والمخزون والتوصيل. جرب مثلا: مزهرية تحت 300 درهم متوفرة في دبي.' : 'I can help with pieces, prices, stock and delivery. Try: a vase under AED 300 in stock in Dubai.', trace };
  const res = searchProducts({ kind, glaze, maxPrice: price ? Number(price[1]) : undefined, emirate, inStockOnly: !!emirate });
  trace.push({ name: 'search_products', out: res.map(productFacts) });
  if (!res.length) return { text: ar ? 'لا توجد قطعة تطابق هذا الطلب حاليا. هل أبحث بلون أو سعر مختلف؟' : 'Nothing matches that right now. Shall I look in another glaze or price range?', trace };
  const em = emirate || 'DXB';
  const lines = res.slice(0, 3).map(p => {
    const n = p.stock[em];
    return ar ? `${p.name.ar} [${p.sku}] بسعر ${p.price} درهم، ${n ? `${n} قطع متوفرة في ${EMIRATES[em].ar}` : `غير متوفرة في ${EMIRATES[em].ar}`}.`
      : `${p.name.en} [${p.sku}] is AED ${p.price}, ${n ? `${n} in stock in ${EMIRATES[em].en}` : `out of stock in ${EMIRATES[em].en}`}.`;
  });
  return { text: lines.join(' '), trace };
}

export { totalStock };
