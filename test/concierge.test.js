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
