// Central company info — edit here (or later via the CMS) to update it everywhere.
export const site = {
  brand: 'Vĩnh Cường Vina',
  company_vi: 'Công Ty TNHH Sản Xuất Và Kinh Doanh Vĩnh Cường Vina',
  company_en: 'Vinh Cuong Vina Manufacturing & Trading Co., Ltd',
  phone: '0903 738 133',
  phone_tel: '0903738133',
  zalo: 'https://zalo.me/0903738133',
  hotline: '08.1565.1111',
  email: 'vinhcuongvina@gmail.com',
  facebook: 'https://www.facebook.com/xuongsanxuatvanphongphamvinhcuongvina/',
  address_factory_vi: 'Nhà máy: 898 Ấp Hậu Hòa, Xã Đức Hòa Thượng, Huyện Đức Hòa, Tỉnh Long An',
  address_factory_en: 'Factory: 898 Hau Hoa, Duc Hoa Thuong, Duc Hoa District, Long An Province',
  address_warehouse_vi: 'Kho hàng: 198/52 Thoại Ngọc Hầu, Phường Phú Thạnh, Quận Tân Phú, TP.HCM',
  address_warehouse_en: 'Warehouse: 198/52 Thoai Ngoc Hau, Phu Thanh Ward, Tan Phu District, HCMC',
  founded: 2010,
  brands: [
    { name: 'Deli', img: 'img/brand-deli.png' },
    { name: 'Double A', img: 'img/brand-doublea.png' },
    { name: 'Hồng Hà', img: 'img/brand-hongha.png' },
    { name: 'King Jim', img: 'img/brand-kingjim.png' },
    { name: 'Plus', img: 'img/brand-plus.png' },
  ],
};

// Info + policy pages: slug → { vi, en } title, and which WordPress page id backs it.
export const infoPages = {
  'gioi-thieu':      { vi: 'Giới Thiệu', en: 'About Us', wp: 2494 },
  'lien-he':         { vi: 'Liên Hệ',    en: 'Contact',  wp: 2508 },
  'cau-hoi-thuong-gap': { vi: 'Câu Hỏi Thường Gặp', en: 'FAQ', wp: 2505 },
};
export const policyPages = {
  'chinh-sach-bao-mat':               { vi: 'Chính Sách Bảo Mật', en: 'Privacy Policy', wp: 6363 },
  'chinh-sach-van-chuyen':            { vi: 'Chính Sách Vận Chuyển', en: 'Shipping Policy', wp: 6376 },
  'chinh-sach-kiem-hang':             { vi: 'Chính Sách Kiểm Hàng', en: 'Inspection Policy', wp: 6378 },
  'chinh-sach-bao-hanh-doi-tra-hang': { vi: 'Chính Sách Bảo Hành Và Đổi Trả Hàng', en: 'Warranty & Returns', wp: 6374 },
  'phuong-thuc-thanh-toan':           { vi: 'Phương Thức Thanh Toán', en: 'Payment Methods', wp: 6380 },
  'dieu-khoan-dich-vu':               { vi: 'Điều Khoản Dịch Vụ', en: 'Terms of Service', wp: 6384 },
};
