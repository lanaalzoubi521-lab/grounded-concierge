// Raml Home: a fictional Dubai ceramics studio. Demo catalogue.
// Every object is a single profile line turned 360° on a wheel, rendered live from that line.
// Profiles are [radius, height] pairs in cm, from foot to rim, outer wall.

export const STOCK_AS_OF = '2026-11-19T06:00:00+04:00';
export const EMIRATES = { DXB: { en: 'Dubai', ar: 'دبي' }, AUH: { en: 'Abu Dhabi', ar: 'أبوظبي' }, SHJ: { en: 'Sharjah', ar: 'الشارقة' } };

export const GLAZES = {
  sand: { en: 'Sand', ar: 'رملي', color: '#CDBDA0', rough: 0.82, clear: 0.0, speckle: 0.55 },
  cobalt: { en: 'Cobalt', ar: 'كوبالت', color: '#1F2C8F', rough: 0.18, clear: 0.9, speckle: 0.08 },
  ivory: { en: 'Ivory', ar: 'عاجي', color: '#EDE7DA', rough: 0.35, clear: 0.6, speckle: 0.25 },
  clay: { en: 'Raw clay', ar: 'طين خام', color: '#A9583A', rough: 0.95, clear: 0.0, speckle: 0.35 },
  olive: { en: 'Olive', ar: 'زيتي', color: '#6B6A3C', rough: 0.3, clear: 0.7, speckle: 0.15 },
  charcoal: { en: 'Charcoal', ar: 'فحمي', color: '#2A2927', rough: 0.6, clear: 0.2, speckle: 0.3 },
  pearl: { en: 'Pearl', ar: 'لؤلؤي', color: '#E4E2DC', rough: 0.22, clear: 0.85, speckle: 0.1 },
};

export const KINDS = {
  vase: { en: 'Vase', ar: 'مزهرية', words: ['vase', 'vases', 'flower', 'مزهرية', 'مزهريات', 'فازة', 'ورد'] },
  bowl: { en: 'Bowl', ar: 'وعاء', words: ['bowl', 'bowls', 'serving', 'salad', 'وعاء', 'زبدية', 'صحن تقديم', 'سلطة'] },
  cup: { en: 'Cups', ar: 'أكواب', words: ['cup', 'cups', 'mug', 'mugs', 'tumbler', 'coffee', 'tea', 'كوب', 'أكواب', 'اكواب', 'فنجان', 'قهوة', 'شاي'] },
  planter: { en: 'Planter', ar: 'حوض نبات', words: ['planter', 'pot', 'plant', 'plants', 'حوض', 'نبات', 'زرع', 'أصيص'] },
  jug: { en: 'Jug', ar: 'إبريق', words: ['jug', 'pitcher', 'carafe', 'water', 'إبريق', 'ابريق', 'دورق', 'ماء'] },
  candle: { en: 'Candle holder', ar: 'حامل شموع', words: ['candle', 'candles', 'holder', 'شمعة', 'شموع', 'شمعدان'] },
  plate: { en: 'Plates', ar: 'أطباق', words: ['plate', 'plates', 'dinner', 'dish', 'صحن', 'صحون', 'أطباق', 'اطباق', 'عشاء'] },
};

export const PRODUCTS = [
  { sku: 'RH-VS-101', kind: 'vase', glaze: 'sand', price: 240, stock: { DXB: 6, AUH: 2, SHJ: 0 },
    name: { en: 'Dune vase, tall', ar: 'مزهرية الكثبان، طويلة' }, h: 42, set: 1,
    profile: [[6, 0], [7.5, 1], [10, 6], [12.5, 14], [12, 22], [8.5, 30], [5.2, 36], [4.6, 39], [5.4, 42]],
    desc: { en: 'A tall bottle form in a dry, speckled sand glaze. Holds long stems and dried palm.', ar: 'شكل قارورة طويل بطلاء رملي مطفي منقط. يناسب الأغصان الطويلة وسعف النخيل المجفف.' } },
  { sku: 'RH-VS-102', kind: 'vase', glaze: 'cobalt', price: 310, stock: { DXB: 3, AUH: 4, SHJ: 1 },
    name: { en: 'Moon jar, cobalt', ar: 'جرة القمر، كوبالت' }, h: 30, set: 1,
    profile: [[5.5, 0], [7, 1], [11, 5], [14, 11], [14.5, 16], [13, 22], [9.5, 27], [7, 29], [7.6, 30]],
    desc: { en: 'A full, round body in deep cobalt with a glossy finish that pools darker at the curve.', ar: 'جسم دائري ممتلئ بلون الكوبالت العميق ولمعة تزداد قتامة عند الانحناء.' } },
  { sku: 'RH-VS-103', kind: 'vase', glaze: 'charcoal', price: 95, stock: { DXB: 14, AUH: 0, SHJ: 5 },
    name: { en: 'Bud vase, charcoal', ar: 'مزهرية زهرة واحدة، فحمي' }, h: 15, set: 1,
    profile: [[3, 0], [3.6, 0.6], [5, 3], [5.6, 6], [4.6, 9], [2.2, 12], [1.7, 13.6], [2.1, 15]],
    desc: { en: 'Small and weighted, for a single stem on a desk or bedside table.', ar: 'صغيرة وثابتة، لزهرة واحدة على المكتب أو بجانب السرير.' } },
  { sku: 'RH-BW-201', kind: 'bowl', glaze: 'cobalt', price: 185, stock: { DXB: 9, AUH: 3, SHJ: 2 },
    name: { en: 'Serving bowl, cobalt', ar: 'وعاء تقديم، كوبالت' }, h: 11, set: 1,
    profile: [[5, 0], [6, 0.6], [9, 2.5], [13, 6], [15.5, 9.5], [16.2, 11]],
    desc: { en: 'Wide and shallow, made for salads and sharing plates. Food safe and dishwasher safe.', ar: 'واسع وقليل العمق، للسلطات وأطباق المشاركة. آمن للطعام ولغسالة الصحون.' } },
  { sku: 'RH-BW-202', kind: 'bowl', glaze: 'ivory', price: 140, stock: { DXB: 0, AUH: 0, SHJ: 0 },
    name: { en: 'Deep bowl, ivory', ar: 'وعاء عميق، عاجي' }, h: 13, set: 1,
    profile: [[4.5, 0], [5.5, 0.7], [8.5, 3], [11, 7], [12, 11], [12.3, 13]],
    desc: { en: 'A deep everyday bowl in a soft satin ivory.', ar: 'وعاء عميق للاستخدام اليومي بلون عاجي ساتان ناعم.' } },
  { sku: 'RH-CP-301', kind: 'cup', glaze: 'ivory', price: 120, stock: { DXB: 22, AUH: 8, SHJ: 6 },
    name: { en: 'Tumbler set of 2, ivory', ar: 'طقم كوبين، عاجي' }, h: 10, set: 2,
    profile: [[3, 0], [3.6, 0.5], [3.9, 3], [4.1, 7], [4.3, 10]],
    desc: { en: 'Two handleless cups for coffee, tea or water. 250 ml each.', ar: 'كوبان بدون مقبض للقهوة أو الشاي أو الماء. سعة كل كوب 250 مل.' } },
  { sku: 'RH-PL-401', kind: 'planter', glaze: 'clay', price: 160, stock: { DXB: 7, AUH: 5, SHJ: 3 },
    name: { en: 'Planter, raw clay', ar: 'حوض نبات، طين خام' }, h: 20, set: 1,
    profile: [[7, 0], [7.8, 0.6], [9.5, 8], [11, 16], [12.2, 17], [12.4, 20]],
    desc: { en: 'Unglazed terracotta that breathes. Drainage hole in the base.', ar: 'فخار غير مطلي يسمح بتنفس التربة. فيه فتحة تصريف في القاعدة.' } },
  { sku: 'RH-JG-501', kind: 'jug', glaze: 'olive', price: 210, stock: { DXB: 4, AUH: 1, SHJ: 0 },
    name: { en: 'Water jug, olive', ar: 'إبريق ماء، زيتي' }, h: 26, set: 1,
    profile: [[5.5, 0], [6.5, 0.7], [8.5, 5], [9, 11], [7.5, 17], [4.6, 21], [4.4, 23], [5.4, 26]],
    desc: { en: 'Holds one litre. A flared lip pours cleanly.', ar: 'يتسع لتر واحد. الحافة المفتوحة تصب بدون تنقيط.' } },
  { sku: 'RH-CH-601', kind: 'candle', glaze: 'charcoal', price: 85, stock: { DXB: 11, AUH: 6, SHJ: 4 },
    name: { en: 'Candle holder, charcoal', ar: 'حامل شموع، فحمي' }, h: 12, set: 1,
    profile: [[4.5, 0], [5, 0.6], [3, 2], [1.6, 4], [1.5, 8], [2.6, 10], [3.2, 12]],
    desc: { en: 'A pedestal for a standard dinner candle.', ar: 'قاعدة مرتفعة لشمعة عشاء قياسية.' } },
  { sku: 'RH-PT-701', kind: 'plate', glaze: 'pearl', price: 260, stock: { DXB: 5, AUH: 2, SHJ: 2 },
    name: { en: 'Dinner plate set of 4, pearl', ar: 'طقم 4 أطباق عشاء، لؤلؤي' }, h: 3, set: 4,
    profile: [[8, 0], [9, 0.4], [11, 0.9], [12.5, 1.6], [13.5, 2.6], [13.8, 3]],
    desc: { en: 'Four 27 cm plates with a soft pearl glaze and a raised rim.', ar: 'أربعة أطباق بقطر 27 سم بطلاء لؤلؤي ناعم وحافة مرتفعة.' } },
];

export const POLICIES = {
  delivery: { en: 'Dubai: next working day. Abu Dhabi and Sharjah: 2 to 3 working days. Free delivery on orders over AED 500, otherwise AED 25.', ar: 'دبي: يوم العمل التالي. أبوظبي والشارقة: من 2 إلى 3 أيام عمل. التوصيل مجاني للطلبات فوق 500 درهم، وغير ذلك 25 درهم.' },
  returns: { en: 'Unused items can be returned within 14 days in their original box.', ar: 'يمكن إرجاع القطع غير المستخدمة خلال 14 يوما في علبتها الأصلية.' },
  pickup: { en: 'Free pickup from the studio in Al Quoz, Dubai, from stock held in Dubai.', ar: 'استلام مجاني من الاستوديو في القوز، دبي، من المخزون الموجود في دبي.' },
  care: { en: 'Glazed pieces are food safe and dishwasher safe. Raw clay planters are not for food.', ar: 'القطع المطلية آمنة للطعام ولغسالة الصحون. أحواض الطين الخام ليست للطعام.' },
};

export const totalStock = p => Object.values(p.stock).reduce((a, b) => a + b, 0);

// Shared retrieval used by both the agent's tools and the offline responder.
export function searchProducts({ kind, glaze, maxPrice, minPrice, emirate, inStockOnly } = {}) {
  return PRODUCTS.filter(p =>
    (!kind || p.kind === kind) && (!glaze || p.glaze === glaze) &&
    (maxPrice == null || p.price <= maxPrice) && (minPrice == null || p.price >= minPrice) &&
    (!inStockOnly || (emirate ? p.stock[emirate] > 0 : totalStock(p) > 0)));
}

export function productFacts(p) {
  return { sku: p.sku, name: p.name.en, nameAr: p.name.ar, kind: p.kind, glaze: GLAZES[p.glaze].en, priceAED: p.price, piecesInSet: p.set,
    heightCm: p.h, stockByEmirate: p.stock, description: p.desc.en };
}

// Demo orders. Status is only released when the order number AND the last four digits
// of the phone on the order both match.
export const ORDERS = [
  { id: 'RH-4101', phone4: '4417', status: 'delivered', emirate: 'DXB', placed: '2026-11-12', eta: '2026-11-13', items: [['RH-VS-101', 1], ['RH-CP-301', 2]] },
  { id: 'RH-4102', phone4: '9032', status: 'out_for_delivery', emirate: 'AUH', placed: '2026-11-17', eta: '2026-11-19', items: [['RH-BW-201', 1]] },
  { id: 'RH-4103', phone4: '1188', status: 'processing', emirate: 'SHJ', placed: '2026-11-18', eta: '2026-11-21', items: [['RH-PL-401', 2], ['RH-CH-601', 1]] },
  { id: 'RH-4104', phone4: '5521', status: 'cancelled', emirate: 'DXB', placed: '2026-11-10', eta: null, items: [['RH-JG-501', 1]] },
];
export const ORDER_STATUS = {
  processing: { en: 'Being packed', ar: 'قيد التجهيز' }, out_for_delivery: { en: 'Out for delivery', ar: 'خرج للتوصيل' },
  delivered: { en: 'Delivered', ar: 'تم التوصيل' }, cancelled: { en: 'Cancelled', ar: 'ملغي' },
};
export function lookupOrder(orderNumber, phone4, attempts) {
  const id = String(orderNumber || '').toUpperCase().replace(/\s/g, '');
  const key = id || '_';
  attempts[key] = (attempts[key] || 0) + 1;
  if (attempts[key] > 3) return { ok: false, reason: 'too_many_attempts' };
  const o = ORDERS.find(x => x.id === id && x.phone4 === String(phone4 || '').replace(/\D/g, '').slice(-4));
  // Same answer whether the order exists or the phone is wrong: no way to probe order numbers.
  if (!o) return { ok: false, reason: 'not_verified' };
  return { ok: true, order: { id: o.id, status: o.status, statusText: ORDER_STATUS[o.status].en, emirate: o.emirate, placed: o.placed, expectedDelivery: o.eta, items: o.items.map(([sku, qty]) => ({ sku, qty })) } };
}
