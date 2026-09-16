// One-off merge: live regular/sale prices + folder photos + 4 SiMiLi + A5 price; new/no-price items -> markdown.
import fs from 'node:fs';
import path from 'node:path';

const DIR = '/Users/nom/Downloads/Sản phẩm Vĩnh Cường. Zip-1';
const ROOT = '/Users/nom/Documents/GitHub Desktop/VCV';
const SC = '/private/tmp/claude-501/-Applications-XAMPP-xamppfiles-htdocs-wordpress/d5cbb1ec-2960-4bad-847a-f03572cddbeb/scratchpad';
const IMG_OUT = path.join(ROOT, 'public/img/products');
fs.mkdirSync(IMG_OUT, { recursive: true });

const liveRaw = JSON.parse(fs.readFileSync(SC + '/live1.json', 'utf8'));
const decode = s => s.replace(/&#8211;/g, '–').replace(/&amp;/g, '&').replace(/&#8217;/g, '’');
const live = liveRaw.map(p => {
  const pr = p.prices || {};
  return { slug: p.slug, name: decode(p.name), regular: Number(pr.regular_price), sale: Number(pr.sale_price || pr.price),
    cats: (p.categories || []).map(c => decode(c.name)), images: (p.images || []).map(i => i.src) };
});
const products = JSON.parse(fs.readFileSync(ROOT + '/src/data/products.json', 'utf8'));

function norm(s) {
  s = s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  s = s.replace(/(^|\s)b\.\s*/g, '$1bia ').replace(/5\s*mau|5\s*m\b|5mau/g, '5mau');
  return s.replace(/[^a-z0-9]+/g, ' ').trim();
}
const stop = new Set(['bia', 'nhua', 'mau', 'co', 'va', 'cai', 'loai']);
const toks = s => norm(s).split(' ').filter(w => w && !stop.has(w));
const jac = (a, b) => { const A = new Set(toks(a)), B = new Set(toks(b)); if (!A.size || !B.size) return 0; let i = 0; A.forEach(x => { if (B.has(x)) i++; }); return i / (A.size + B.size - i); };

// ---------- 1) PRICES: regular + sale from live ----------
const bySlug = new Map(live.map(p => [p.slug, p]));
for (const p of products) {
  let m = bySlug.get(p.slug);
  if (!m) { let best = null, bs = -1; for (const L of live) { const s = jac(p.name_vi, L.name); if (s > bs) { bs = s; best = L; } } if (bs >= 0.6) m = best; }
  if (m) { p.price = m.sale; p.price_regular = m.regular > m.sale ? m.regular : null; }
  else { p.price = p.price_min; p.price_regular = null; }
  p.price_min = p.price; p.price_max = p.price; p.has_range = false;
}
// A5 override (not on live): regular 16.500 -> sale 13.050
for (const p of products) if (/nhua don.*a5|don.*a5.*5 mau|a5.*thuoc/i.test(norm(p.name_vi)) && p.slug.includes('a5')) { p.price = 13050; p.price_regular = 16500; p.price_min = 13050; p.price_max = 13050; }

// ---------- 2) ADD 4 SiMiLi box files (from live) ----------
const CATMAP = { 'bia album': 'bia-album', 'bia 12 ngan': 'bia-12-ngan', 'bia lo': 'bia-lo', 'bia nut': 'bia-nut',
  'bia acco bao cao': 'bia-acco-bao-cao', 'bia la nhieu la': 'bia-la-nhieu-la', 'bia cong': 'bia-cong', 'bia kep': 'bia-kep',
  'bia trinh ky': 'bia-trinh-ky', 'bia cay': 'bia-cay', 'bia hop': 'bia-hop', 'bia phan trang': 'bia-phan-trang' };
const catSlug = names => { for (const n of names) { const k = norm(n); if (CATMAP[k]) return CATMAP[k]; } return 'bia-hop'; };
const EN_SIMILI = { '7': 'SiMiLi Box File – 7cm', '10': 'SiMiLi Box File – 10cm', '15': 'SiMiLi Box File – 15cm', '20': 'SiMiLi Box File – 20cm' };
async function dl(url, dest) { try { const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }); if (!r.ok) return null; const b = Buffer.from(await r.arrayBuffer()); fs.writeFileSync(path.join(IMG_OUT, dest), b); return 'img/products/' + dest; } catch (e) { return null; } }
const similiLive = live.filter(L => /simili/i.test(norm(L.name)) && !products.some(p => p.slug === L.slug));
let added = [];
for (const L of similiLive) {
  const sizeM = L.name.match(/(\d+)\s*Ph/i); const size = sizeM ? sizeM[1] : '';
  const cat = catSlug(L.cats);
  const imgs = [];
  for (let i = 0; i < L.images.length; i++) { const d = await dl(L.images[i], `${L.slug}-${i + 1}.jpg`); if (d) imgs.push(d); }
  const rec = { id: 90000 + Number(size || added.length), slug: L.slug, name_vi: L.name, name_en: EN_SIMILI[size] || 'SiMiLi Box File',
    category: cat, categories: [cat], price: L.sale, price_regular: L.regular > L.sale ? L.regular : null,
    price_min: L.sale, price_max: L.sale, has_range: false, variable: false, image: imgs[0] || null, gallery: imgs.slice(1),
    featured: false, short_vi: '' };
  products.push(rec); added.push(rec.name_vi);
}

// ---------- 3) FOLDER PHOTO SWAP ----------
const folders = fs.readdirSync(DIR).filter(f => { try { return fs.statSync(DIR + '/' + f).isDirectory(); } catch (e) { return false; } });
const PIN = { 'bia 20 la nhua mau duc': 'bia-20-la-loai-b', 'bia 40 la nhua mau duc': 'bia-40-la-loai-b',
  'bia 60 la nhua mau duc': 'bia-60-la-loai-b', 'bia 80 la nhua mau duc': 'bia-80-la-loai-b',
  'bia 100 la nhua mau duc': 'bia-100-la-loai-b', 'bia 100 la nhua trong': 'bia-100-la',
  'bia cap 12 ngan quai': 'cap-12-ngan-quai', 'bia cap 12 ngan day thun': 'bia-12-ngan-day-5-mau',
  'bia cay q 311': 'bia-cay-q311', 'bia cay q 324': 'bia-cay-q324',
  'bia 1 kep a 5mau': 'bia-01-kep-5-mau', 'bia nut a5 co in': 'bia-kiem-tra-a5-co-in',
  '5f 2 mat si da rap cong': 'bia-cong-5f-7f-thai-2-mat-si', '7f 2 mat si da rap cong': 'bia-cong-7f-2-mat-si',
  '9f 2 mat si da rap cong': 'bia-cong-9f-l1-2-mat-si' };
const EXCLUDE = new Set(['cai cong 5p', 'cai cong 7p', 'cai cong 9p', 'bao sach k26', 'bao tap nai tron', 'bao tap nai 7c co in',
  'bia ban do', 'bia cao cap', 'bia si don', 'bia si doi', 'bia nut a2 6mau day',
  'bia hop giay 10f', 'bia hop giay 20f', 'bia hop nhua 3.5f', 'bia hop nhua 5.5f', 'bia hop nhua 7f', 'bia hop nhua 10f', 'bia hop nhua 15f',
  '9f simili 3 day', '15f simili 3 day', 'bia cap 1 ngan co quai nhua', 'bia cap nhua 1 ngan', 'bia 1 kep file loai trong',
  'bia don a', 'bia don b', 'bia doi a', 'bia doi b',
  'bia 20 la nhua trong', 'bia 40 la nhua trong', 'bia 60 la nhua trong', 'bia 80 la nhua trong',
  'bia cap 12 ngan 8214', 'bia cap 12 ngan nap xam'].map(x => norm(x)));
const bySlugP = new Map(products.map(p => [p.slug, p]));

// resolve each folder -> {product, pinned} unless excluded
const candidates = [];
for (const f of folders) {
  const nf = norm(f);
  if (EXCLUDE.has(nf)) { candidates.push({ f, kind: 'exclude' }); continue; }
  if (PIN[nf]) { candidates.push({ f, kind: 'pin', prod: bySlugP.get(PIN[nf]), score: 1 }); continue; }
  let best = null, bs = -1; for (const p of products) { const s = jac(f, p.name_vi); if (s > bs) { bs = s; best = p; } }
  candidates.push({ f, kind: 'auto', prod: best, score: +bs.toFixed(2) });
}
// assign greedily by score; one product gets one folder (highest score)
candidates.sort((a, b) => (b.score || 0) - (a.score || 0));
const takenProd = new Set(), swapped = [], toMd = [];
for (const c of candidates) {
  if (c.kind === 'exclude') { toMd.push({ f: c.f, reason: 'new / no online price' }); continue; }
  if (!c.prod || (c.kind === 'auto' && c.score < 0.5)) { toMd.push({ f: c.f, reason: `no confident match (best ${c.prod ? c.prod.name_vi : '-'} @${c.score})` }); continue; }
  if (takenProd.has(c.prod.slug)) { toMd.push({ f: c.f, reason: `alternate photos of "${c.prod.name_vi}" (already got another folder)` }); continue; }
  takenProd.add(c.prod.slug);
  // copy images
  const files = fs.readdirSync(DIR + '/' + c.f).filter(x => /\.(jpe?g|png|webp)$/i.test(x)).sort();
  const newImgs = [];
  files.forEach((fn, i) => { const dest = `${c.prod.slug}-f${i + 1}${path.extname(fn).toLowerCase()}`; try { fs.copyFileSync(`${DIR}/${c.f}/${fn}`, path.join(IMG_OUT, dest)); newImgs.push('img/products/' + dest); } catch (e) {} });
  if (newImgs.length) { c.prod.image = newImgs[0]; c.prod.gallery = newImgs.slice(1); }
  swapped.push({ f: c.f, prod: c.prod.name_vi, n: newImgs.length, score: c.score, pinned: c.kind === 'pin' });
}

// ---------- 4) write products.json ----------
fs.writeFileSync(ROOT + '/src/data/products.json', JSON.stringify(products, null, 2));

// ---------- 5) NEW-PRODUCTS.md ----------
const guessCat = f => { const n = norm(f); if (/cong|simili/.test(n)) return 'Bìa Còng'; if (/hop/.test(n)) return 'Bìa Hộp'; if (/bao (sach|tap)/.test(n)) return 'Bao Sách/Vở (mới)'; if (/nut/.test(n)) return 'Bìa Nút'; if (/kep|lo xo/.test(n)) return 'Bìa Kẹp'; if (/don|doi|trinh|si/.test(n)) return 'Bìa Trình Ký'; if (/cap|ngan/.test(n)) return 'Bìa 12 Ngăn'; if (/ban do/.test(n)) return 'Khác'; if (/la/.test(n)) return 'Bìa Album'; return 'Chưa rõ'; };
const imgCount = f => { try { return fs.readdirSync(DIR + '/' + f).filter(x => /\.(jpe?g|png|webp)$/i.test(x)).length; } catch (e) { return 0; } };
let md = `# Sản phẩm cần bổ sung (chưa có trên website)\n\n`;
md += `> Các sản phẩm dưới đây có trong thư mục ảnh nhưng **không có giá trên vinhcuongvina.com**, nên **chưa được thêm vào website**. Vui lòng bổ sung **giá** (và xác nhận **danh mục**) để thêm sau.\n\n`;
md += `_Cập nhật: ${new Date().toISOString().slice(0, 10)} — ${toMd.length} sản phẩm_\n\n`;
md += `| # | Tên (thư mục) | Danh mục đề xuất | Số ảnh | Ghi chú |\n|---|---|---|---|---|\n`;
toMd.sort((a, b) => a.f.localeCompare(b.f)).forEach((r, i) => { md += `| ${i + 1} | ${r.f} | ${guessCat(r.f)} | ${imgCount(r.f)} | ${r.reason} |\n`; });
md += `\n## Giá cần bổ sung\n\n`;
toMd.forEach(r => { md += `- **${r.f}** — Giá gốc: ______  → Giá bán: ______\n`; });
fs.writeFileSync(ROOT + '/NEW-PRODUCTS.md', md);

// ---------- report ----------
console.log('ADDED SiMiLi:', added.length, added.join(', '));
console.log('PHOTO-SWAPPED products:', swapped.length);
swapped.forEach(s => console.log(`  ${s.pinned ? '[pin]' : '[' + s.score + ']'} "${s.f}" -> ${s.prod} (${s.n} imgs)`));
console.log('\nTO NEW-PRODUCTS.md (not added):', toMd.length);
toMd.forEach(r => console.log(`  - ${r.f}  (${r.reason})`));
console.log('\nproducts.json now has', products.length, 'products.');
