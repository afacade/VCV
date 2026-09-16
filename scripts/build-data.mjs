// Normalizes migration/catalog.json → src/data/*.json and copies referenced images to public/img/.
// Re-runnable while the WordPress install exists (reads absolute image paths from the export).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'migration/catalog.json'), 'utf8'));

const IMG_OUT = path.join(ROOT, 'public/img/products');
fs.mkdirSync(IMG_OUT, { recursive: true });
const CAT_OUT = path.join(ROOT, 'public/img/cat');
fs.mkdirSync(CAT_OUT, { recursive: true });

// ---- Category taxonomy (top-level), with EN labels + accent colors ----
const CHILD_TO_PARENT = { 'bia-cong-nhua':'bia-cong', 'bia-cong-simili':'bia-cong',
  'bia-album-nhieu-la-nhua-duc-xanh-den':'bia-album', 'bia-album-nhieu-la-nhua-trong-5-mau':'bia-album' };
const CATS = {
  'bia-lo':            { vi:'Bìa Lỗ',            en:'Punched Folders',     color:'#1B3B96', order:1 },
  'bia-la-nhieu-la':   { vi:'Bìa Lá – Nhiều Lá', en:'Sheet Folders',       color:'#0EA371', order:2 },
  'bia-trinh-ky':      { vi:'Bìa Trình Ký',      en:'Signature Folders',   color:'#E11B22', order:3 },
  'bia-nut':           { vi:'Bìa Nút',           en:'Snap Folders',        color:'#F59E0B', order:4 },
  'bia-cay':           { vi:'Bìa Cây',           en:'Spine Files',         color:'#7C3AED', order:5 },
  'bia-phan-trang':    { vi:'Bìa Phân Trang',    en:'Index Dividers',      color:'#475569', order:6 },
  'bia-cong':          { vi:'Bìa Còng',          en:'Lever-Arch Binders',  color:'#0891B2', order:7 },
  'bia-kep':           { vi:'Bìa Kẹp',           en:'Clip Folders',        color:'#DB2777', order:8 },
  'bia-12-ngan':       { vi:'Bìa 12 Ngăn',       en:'12-Pocket Cases',     color:'#2563EB', order:9 },
  'bia-album':         { vi:'Bìa Album',         en:'Display Books',       color:'#CA8A04', order:10 },
  'bia-hop':           { vi:'Bìa Hộp',           en:'Box Folders',         color:'#16A34A', order:11 },
  'bia-acco-bao-cao':  { vi:'Bìa Acco, Báo Cáo', en:'Report Folders',      color:'#9333EA', order:12 },
};

// ---- Rough VI→EN name translator (phrases first, then tokens). Editable later via CMS. ----
const PHRASES = [
  ['trình ký','Signature'],['phân trang','Divider'],['lò xo','Ring'],['dây thun','Elastic'],
  ['nhiều lá','Multi-Pocket'],['kiểm tra','Inspection'],['cột dây','String-Tie'],['báo cáo','Report'],
  ['có in','Printed'],['không in','Unprinted'],['có file','with File'],['5 màu','5-Color'],
  ['giá lẻ','Retail'],['giá sỉ','Wholesale'],
];
const TOKENS = {
  'bìa':'Folder','còng':'Lever-Arch','nút':'Snap','lá':'Sheet','kẹp':'Clip','album':'Display Book',
  'ngăn':'Pocket','quai':'Handle','nắp':'Flap','acco':'Fastener','hộp':'Box','cây':'Spine',
  'nhựa':'Plastic','trong':'Clear','đục':'Frosted','màu':'Color','mỏng':'Thin','dày':'Thick',
  'đơn':'Single','đôi':'Double','da':'Leather','simili':'Simili','loại':'Type','số':'No.',
  'chữ':'Letters','thước':'Ruler','lỗ':'Punched','cặp':'Case','trơn':'Plain','nhám':'Matte',
  'dây':'String','gáy':'Spine','giấy':'Paper','còng':'Lever-Arch','bìa':'Folder',
  'my':'My','clear':'Clear','bag':'Bag',
};
function titleCase(s){ return s.replace(/\S+/g, w => /^[a-zA-Z]/.test(w) && w.length>1 && w!==w.toUpperCase() ? w[0].toUpperCase()+w.slice(1) : w); }
function translate(vi){
  let s = ' ' + vi.toLowerCase() + ' ';
  for (const [a,b] of PHRASES) s = s.split(a).join(' '+b.toLowerCase()+' ');
  s = s.replace(/[a-zà-ỹ]+/gi, (w)=> TOKENS[w] ? TOKENS[w] : w);
  // keep model codes like a4/f4/a5/vc-a4/l1 uppercased
  s = s.replace(/\b(a4|f4|a5|a3|b5|l1|vc[-\w]*|\d+f)\b/gi, m=>m.toUpperCase());
  s = s.replace(/\s+/g,' ').trim();
  return titleCase(s);
}

const money = (v)=> v==null||v==='' ? null : Math.round(parseFloat(v));
const copyImg = (src, outName) => {
  try { if (src && fs.existsSync(src)) { fs.copyFileSync(src, path.join(IMG_OUT, outName)); return 'img/products/'+outName; } }
  catch(e){}
  return null;
};

const products = [];
for (const p of catalog.products) {
  // resolve primary top-level category
  let primary = null;
  const catSlugs = p.categories.map(c=>c.slug);
  for (const c of catSlugs){ const top = CHILD_TO_PARENT[c] || c; if (CATS[top]){ primary = top; break; } }
  const ext = (p.featured && p.featured.path) ? path.extname(p.featured.path) || '.jpg' : '.jpg';
  const img = p.featured ? copyImg(p.featured.path, `p-${p.id}${ext}`) : null;
  const gallery = [];
  (p.gallery||[]).forEach((g,i)=>{ if(g&&g.path){ const gi = copyImg(g.path, `p-${p.id}-g${i}${path.extname(g.path)||'.jpg'}`); if(gi) gallery.push(gi); }});

  const min = money(p.price_min), max = money(p.price_max);
  products.push({
    id: p.id,
    slug: p.slug,
    name_vi: p.name,
    name_en: translate(p.name),
    category: primary,
    categories: [...new Set(catSlugs.map(c=>CHILD_TO_PARENT[c]||c).filter(c=>CATS[c]))],
    price_min: min, price_max: max,
    has_range: max!=null && min!=null && max!==min,
    variable: p.type==='variable',
    image: img, gallery,
    featured: !!p.featured_flag,
    short_vi: p.short || '',
  });
}

// counts per category
const catIcons = catalog.category_icons || {};
function copyCatIcon(slug){
  const ic = catIcons[slug];
  if (ic && ic.path && fs.existsSync(ic.path)) {
    const ext = path.extname(ic.path) || '.jpg';
    try { fs.copyFileSync(ic.path, path.join(CAT_OUT, slug + ext)); return 'img/cat/' + slug + ext; } catch(e){}
  }
  // fallback: first product image in this category
  const p = products.find(pr => pr.categories.includes(slug) && pr.image);
  return p ? p.image : null;
}
const catList = Object.entries(CATS)
  .map(([slug,meta])=>({ slug, ...meta, icon: copyCatIcon(slug), count: products.filter(p=>p.categories.includes(slug)).length }))
  .sort((a,b)=>a.order-b.order);

const DATA = path.join(ROOT, 'src/data');
fs.mkdirSync(DATA, { recursive: true });
fs.writeFileSync(path.join(DATA,'products.json'), JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(DATA,'categories.json'), JSON.stringify(catList, null, 2));

// pages + posts (text content, for info/policy pages and blog)
const pages = catalog.pages.map(pg=>({ id:pg.id, slug:pg.slug, title:pg.title, text:pg.content_text }));
fs.writeFileSync(path.join(DATA,'pages.json'), JSON.stringify(pages, null, 2));
const posts = catalog.posts.map(bp=>{
  let img=null; if(bp.featured&&bp.featured.path){ const e=path.extname(bp.featured.path)||'.jpg'; img=copyImg(bp.featured.path,`post-${bp.id}${e}`); }
  return { id:bp.id, slug:bp.slug, title:bp.title, date:bp.date, excerpt:bp.excerpt, text:bp.content_text, image:img };
});
fs.writeFileSync(path.join(DATA,'posts.json'), JSON.stringify(posts, null, 2));

const withImg = products.filter(p=>p.image).length;
console.log(`products=${products.length} (with image=${withImg}) categories=${catList.length} pages=${pages.length} posts=${posts.length}`);
console.log('categories:', catList.map(c=>`${c.vi}(${c.count})`).join(', '));
