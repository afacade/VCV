// UI dictionary + i18n/url helpers. VI is the default locale (no URL prefix); EN lives under /en/.
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // e.g. "/VCV"

export const ui = {
  vi: {
    'nav.home': 'Trang Chủ', 'nav.products': 'Sản Phẩm', 'nav.about': 'Giới Thiệu',
    'nav.contact': 'Liên Hệ', 'nav.faq': 'Câu Hỏi Thường Gặp', 'nav.news': 'Tin Tức',
    'cta.categories': 'Danh Mục Sản Phẩm', 'cta.search': 'Tìm kiếm sản phẩm…',
    'cta.order': 'Đặt hàng', 'cta.quote': 'Nhận báo giá', 'cta.call': 'Gọi đặt hàng',
    'cta.zalo': 'Nhắn Zalo', 'cta.viewall': 'Xem tất cả', 'cta.viewmore': 'Xem thêm',
    'cta.details': 'Xem chi tiết', 'cta.sendEmail': 'Gửi email',
    'label.hotline': 'Hotline', 'label.price': 'Giá',
    'label.contact': 'Liên hệ', 'label.category': 'Danh mục', 'label.related': 'Sản phẩm liên quan',
    'label.bestsellers': 'Sản phẩm bán chạy',
    'label.allProducts': 'Tất cả sản phẩm', 'label.products': 'sản phẩm',
    'hero.title': 'Chuyên sản xuất & cung cấp các loại bìa hồ sơ',
    'hero.sub': 'Hơn 80 mẫu bìa: bìa nút, bìa lá, trình ký, bìa còng, album, 12 ngăn… Chất lượng cao — giá tận xưởng — giao hàng toàn quốc.',
    'usp.factory': 'Sản xuất trực tiếp', 'usp.factory.d': 'Không qua trung gian',
    'usp.ship': 'Giao hàng toàn quốc', 'usp.ship.d': 'Nhanh chóng, an toàn',
    'usp.return': 'Đổi trả dễ dàng', 'usp.return.d': 'Chính sách rõ ràng',
    'usp.support': 'Hỗ trợ tận tình', 'usp.support.d': 'Qua Zalo & điện thoại',
    'brands.title': 'Thương hiệu chúng tôi phân phối',
    'foot.links': 'Liên kết', 'foot.policies': 'Chính sách', 'foot.contact': 'Liên hệ',
    'foot.notified': 'Đã thông báo Bộ Công Thương',
    'prod.variants': 'Sản phẩm có nhiều tùy chọn (giá lẻ & giá sỉ). Liên hệ để nhận báo giá chi tiết.',
    'prod.order.title': 'Đặt hàng sản phẩm này',
    'prod.order.sub': 'Gọi, nhắn Zalo hoặc gửi email — chúng tôi phản hồi nhanh.',
    'news.title': 'Tin Tức', 'news.readmore': 'Đọc tiếp',
    'search.placeholder': 'Nhập tên sản phẩm…', 'search.empty': 'Không tìm thấy sản phẩm phù hợp.',
    'quote.subject': 'Yêu cầu báo giá',
    'nav.fav': 'Yêu thích',
    'fav.title': 'Sản phẩm yêu thích', 'fav.count': 'sản phẩm đã lưu',
    'fav.empty': 'Bạn chưa lưu sản phẩm nào. Nhấn vào biểu tượng trái tim trên sản phẩm để thêm vào yêu thích.',
    'fav.browse': 'Xem sản phẩm',
    'zalo.title': 'Chat với chúng tôi', 'zalo.msg': 'Xin chào! Liên hệ Vĩnh Cường Vina qua Zalo để được tư vấn & báo giá nhanh nhất.',
    'zalo.open': 'Mở Zalo ngay',
    'contract.title': 'Cần báo giá hoặc hợp đồng cung cấp dài hạn?',
    'contract.sub': 'Chúng tôi báo giá nhanh và nhận hợp tác cung cấp số lượng lớn, ổn định lâu dài cho doanh nghiệp, trường học và văn phòng.',
    'contract.cta': 'Liên hệ hợp tác',
    'label.company': 'Nhà sản xuất bìa hồ sơ', 'label.warehouse': 'Kho hàng', 'label.factory': 'Nhà máy',
    'zoom.hint': 'Bấm để phóng to',
  },
  en: {
    'nav.home': 'Home', 'nav.products': 'Products', 'nav.about': 'About',
    'nav.contact': 'Contact', 'nav.faq': 'FAQ', 'nav.news': 'News',
    'cta.categories': 'Product Categories', 'cta.search': 'Search products…',
    'cta.order': 'Order now', 'cta.quote': 'Get a quote', 'cta.call': 'Call to order',
    'cta.zalo': 'Chat on Zalo', 'cta.viewall': 'View all', 'cta.viewmore': 'View more',
    'cta.details': 'View details', 'cta.sendEmail': 'Send email',
    'label.hotline': 'Hotline', 'label.price': 'Price',
    'label.contact': 'Contact', 'label.category': 'Category', 'label.related': 'Related products',
    'label.bestsellers': 'Best sellers',
    'label.allProducts': 'All products', 'label.products': 'products',
    'hero.title': 'Manufacturer & supplier of office folders',
    'hero.sub': '80+ folder models — snap, sheet, signature, lever-arch, display books, 12-pocket cases and more. High quality, factory-direct prices, nationwide delivery.',
    'usp.factory': 'Own factory', 'usp.factory.d': 'No middleman',
    'usp.ship': 'Nationwide delivery', 'usp.ship.d': 'Fast & safe',
    'usp.return': 'Easy returns', 'usp.return.d': 'Clear policy',
    'usp.support': 'Dedicated support', 'usp.support.d': 'Via Zalo & phone',
    'brands.title': 'Brands we distribute',
    'foot.links': 'Links', 'foot.policies': 'Policies', 'foot.contact': 'Contact',
    'foot.notified': 'Registered with the Ministry of Industry & Trade',
    'prod.variants': 'This product has multiple options (retail & wholesale pricing). Contact us for a detailed quote.',
    'prod.order.title': 'Order this product',
    'prod.order.sub': 'Call, message on Zalo, or email — we reply quickly.',
    'news.title': 'News', 'news.readmore': 'Read more',
    'search.placeholder': 'Type a product name…', 'search.empty': 'No matching products found.',
    'quote.subject': 'Quote request',
    'nav.fav': 'Favorites',
    'fav.title': 'Your favorites', 'fav.count': 'saved products',
    'fav.empty': 'You have no saved products yet. Tap the heart on a product to add it to your favorites.',
    'fav.browse': 'Browse products',
    'zalo.title': 'Chat with us', 'zalo.msg': 'Hi there! Message Vĩnh Cường Vina on Zalo for fast advice & quotes.',
    'zalo.open': 'Open Zalo now',
    'contract.title': 'Need a quote or a long-term supply contract?',
    'contract.sub': 'We provide fast quotes and long-term bulk supply partnerships for businesses, schools and offices.',
    'contract.cta': 'Get in touch',
    'label.company': 'Office folder manufacturer', 'label.warehouse': 'Warehouse', 'label.factory': 'Factory',
    'zoom.hint': 'Click to zoom',
  },
};

export function useT(lang) {
  const dict = ui[lang] || ui.vi;
  return (key) => dict[key] ?? ui.vi[key] ?? key;
}

// Build an internal URL: base + (/en for en) + path. path starts with '/'.
export function href(lang, path = '/') {
  const p = path === '/' ? '' : path.replace(/\/$/, '');
  return `${BASE}${lang === 'en' ? '/en' : ''}${p}` || `${BASE}/`;
}
// Asset in /public
export const asset = (p) => `${BASE}/${p.replace(/^\//, '')}`;

// Vietnamese-style price formatting: 36540 -> "36.540 ₫"
export function money(n) {
  if (n == null) return '';
  return new Intl.NumberFormat('vi-VN').format(Math.round(n)) + ' ₫';
}
