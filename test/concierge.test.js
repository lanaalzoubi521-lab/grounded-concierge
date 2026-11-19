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
