import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS, searchProducts } from '../src/catalog.js';
import { conciergeTools, groundingCheck, offlineAnswer } from '../src/concierge.js';

test('search filters by kind, price and emirate stock', () => {
  const r = searchProducts({ kind: 'vase', maxPrice: 300, emirate: 'AUH', inStockOnly: true });
  assert.deepEqual(r.map(p => p.sku), ['RH-VS-101']);
});
test('tools record every lookup', () => {
  const trace = [];
  const [search, get, policy] = conciergeTools(trace);
  search.execute({ kind: 'bowl' }); get.execute({ sku: 'rh-bw-202' }); policy.execute({ topic: 'returns' });
  assert.equal(trace.length, 3);
  assert.throws(() => get.execute({ sku: 'RH-XX-000' }));
});
test('grounding passes when every fact came from a tool', () => {
  const trace = []; conciergeTools(trace)[1].execute({ sku: 'RH-VS-101' });
  const g = groundingCheck('The Dune vase, tall [RH-VS-101] is AED 240, with 6 in stock in Dubai.', trace);
  assert.equal(g.failed, 0); assert.equal(g.checked, 3);
});
test('grounding flags an invented price and an unknown SKU', () => {
  const trace = []; conciergeTools(trace)[1].execute({ sku: 'RH-VS-101' });
  const g = groundingCheck('It is AED 199 and also try [RH-VS-999].', trace);
  assert.deepEqual(g.badFacts, [199]); assert.deepEqual(g.badSku, ['RH-VS-999']);
});
test('grounding reads Arabic prices', () => {
  const trace = []; conciergeTools(trace)[1].execute({ sku: 'RH-BW-201' });
  assert.equal(groundingCheck('سعره 185 درهم [RH-BW-201]', trace).failed, 0);
  assert.equal(groundingCheck('سعره 150 درهم', trace).failed, 1);
});
test('offline answers stay grounded', () => {
  for (const [q, l] of [['vase under 300 in Abu Dhabi', 'en'], ['مزهرية تحت 300 درهم في دبي', 'ar'], ['delivery to Sharjah?', 'en'], ['cobalt bowl', 'en']]) {
    const r = offlineAnswer(q, l); assert.equal(groundingCheck(r.text, r.trace).failed, 0, q);
  }
});
test('sold-out product is reported as such', () => {
  const p = PRODUCTS.find(p => p.sku === 'RH-BW-202');
  assert.equal(Object.values(p.stock).reduce((a, b) => a + b, 0), 0);
});

import { lookupOrder } from '../src/catalog.js';
test('order status needs the number and the phone digits', () => {
  const a = {};
  assert.equal(lookupOrder('RH-4102', '9032', a).ok, true);
  assert.equal(lookupOrder('RH-4102', '0000', a).reason, 'not_verified');
  assert.equal(lookupOrder('RH-9999', '9032', a).reason, 'not_verified'); // same answer: cannot probe which orders exist
});
test('order lookups are rate limited', () => {
  const a = {}; for (let i = 0; i < 3; i++) lookupOrder('RH-4103', '0000', a);
  assert.equal(lookupOrder('RH-4103', '1188', a).reason, 'too_many_attempts');
});
test('invented discounts and percentages are flagged', () => {
  const trace = []; conciergeTools(trace)[1].execute({ sku: 'RH-VS-101' });
  const g = groundingCheck('Use code SAND for a 20% discount on [RH-VS-101].', trace);
  assert.ok(g.failed >= 2); assert.ok(g.badFacts.includes(20)); assert.ok(g.promises.length >= 1);
});
test('policy wording is not flagged as a promise', () => {
  const trace = []; conciergeTools(trace)[2].execute({ topic: 'delivery' });
  assert.equal(groundingCheck('Free delivery on orders over AED 500, otherwise AED 25.', trace).failed, 0);
});
test('handoff creates a ticket with bounded fields', () => {
  const env = { attempts: {}, tickets: [] }, trace = [];
  const r = conciergeTools(trace, env).find(t => t.name === 'handoff_to_team').execute({ name: 'A'.repeat(500), contact: '050', question: 'custom glaze?' });
  assert.equal(r.created, true); assert.equal(env.tickets[0].name.length, 80);
});
test('offline order flow verifies before answering', () => {
  assert.match(offlineAnswer('where is my order', 'en').text, /order number/);
  assert.match(offlineAnswer('order RH-4101 phone 4417', 'en').text, /Delivered/);
  assert.match(offlineAnswer('order RH-4102 phone 1111', 'en').text, /could not verify/);
});

import { redactSpans } from '../src/concierge.js';
const look = (...skus) => { const tr = []; const tools = conciergeTools(tr); for (const s of skus) tools[1].execute({ sku: s }); return tr; };
test('price must belong to the product it is said about', () => {
  const tr = look('RH-VS-101', 'RH-VS-103');
  assert.equal(groundingCheck('The Dune vase, tall [RH-VS-101] is AED 95.', tr).failed, 1); // 95 is the bud vase price
  assert.equal(groundingCheck('The Dune vase, tall [RH-VS-101] is AED 240.', tr).failed, 0);
});
test('stock must match the emirate named', () => {
  const tr = look('RH-VS-101');
  assert.equal(groundingCheck('Dune vase [RH-VS-101]: 6 in stock in Sharjah.', tr).failed, 1);
  assert.equal(groundingCheck('Dune vase [RH-VS-101]: 6 in stock in Dubai.', tr).failed, 0);
  assert.equal(groundingCheck('Only 9 left of the Dune vase [RH-VS-101].', tr).failed, 1);
});
test('currency formats the old check missed', () => {
  const tr = look('RH-VS-101');
  for (const r of ['It is aed 199.', 'It costs 199 dirhams.', 'Dhs 199 only.', 'Price: AED 2,400.', 'السعر ٢٤٠٠ درهم.', 'It is two hundred dirhams.', 'السعر ۱۹۹ درهم.'])
    assert.ok(groundingCheck(r, tr).failed >= 1, r);
  assert.equal(groundingCheck('السعر ٢٤٠ درهم [RH-VS-101].', tr).failed, 0);
});
test('decimals, long SKUs and lowercase SKUs are not misread', () => {
  const tr = look('RH-VS-101');
  assert.equal(groundingCheck('It is AED 240.99 [RH-VS-101].', tr).failed, 1);
  assert.equal(groundingCheck('See [RH-VS-1019].', tr).failed, 1);
  assert.equal(groundingCheck('See rh-vs-999.', tr).failed, 1);
});
test('promise wording, plural and Arabic', () => {
  const tr = look('RH-VS-101');
  for (const r of ['These are discounted today.', 'Half price this week!', 'Buy one get one free.', 'A special offer for you.', 'يوجد تخفيض اليوم.', 'عرض خاص لك.', 'نصف السعر.']) assert.ok(groundingCheck(r, tr).promises.length >= 1, r);
});
test('refusals and policy wording are not flagged', () => {
  const tr = look('RH-VS-101');
  assert.equal(groundingCheck("I can't offer a discount, but the studio team can help.", tr).failed, 0);
  assert.equal(groundingCheck('لا أستطيع تقديم خصم.', tr).failed, 0);
  const tp = []; conciergeTools(tp)[2].execute({ topic: 'delivery' });
  assert.equal(groundingCheck('Delivery is free on orders over AED 500.', tp).failed, 0);
  assert.equal(groundingCheck('You get a free vase with this order.', tr).failed, 1);
});
test("the customer's own numbers are allowed", () => {
  const tr = []; conciergeTools(tr)[0].execute({ kind: 'vase', maxPrice: 300 });
  assert.equal(groundingCheck('Here is what we have under AED 300: Dune vase, tall [RH-VS-101] at AED 240.', tr, 'A vase under AED 300 in Abu Dhabi').failed, 0);
});
test('dates and SKU digits are not accepted as prices; sizes are checked', () => {
  const tr = look('RH-VS-101');
  assert.equal(groundingCheck('It is AED 101.', tr).failed, 1);
  assert.equal(groundingCheck('It is AED 2026.', tr).failed, 1);
  assert.equal(groundingCheck('The Dune vase [RH-VS-101] is 42 cm tall.', tr).failed, 0);
  assert.equal(groundingCheck('The Dune vase [RH-VS-101] is 55 cm tall.', tr).failed, 1);
});
test('failed spans are removed exactly, including Arabic digits', () => {
  const tr = look('RH-VS-101');
  for (const r of ['السعر ٢٤٠٠ درهم.', 'Price: AED 2,400 today.']) {
    const g = groundingCheck(r, tr); const out = redactSpans(r, g.spans);
    assert.ok(!/2,?400|٢٤٠٠/.test(out), out);
  }
});
