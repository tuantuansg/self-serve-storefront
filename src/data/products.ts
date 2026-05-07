export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  shortDesc: string;
  description: string;
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "ke-sat-v-lo-da-nang",
    name: "Kệ sắt V lỗ đa năng 4 tầng",
    price: 850000,
    category: "Kệ V lỗ",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    shortDesc: "Kệ V lỗ 4 tầng, chịu tải 80kg/tầng, dễ lắp ráp.",
    description:
      "Kệ sắt V lỗ đa năng được sản xuất từ thép sơn tĩnh điện, thiết kế thông minh dễ tháo lắp. Phù hợp cho gia đình, văn phòng, kho hàng nhỏ.",
    specs: [
      { label: "Kích thước", value: "70 x 40 x 150 cm" },
      { label: "Số tầng", value: "4 tầng" },
      { label: "Tải trọng", value: "80 kg/tầng" },
      { label: "Chất liệu", value: "Thép sơn tĩnh điện" },
    ],
  },
  {
    id: "p2",
    slug: "ke-sieu-thi-don",
    name: "Kệ siêu thị đơn 5 tầng",
    price: 1850000,
    category: "Kệ siêu thị",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
    shortDesc: "Kệ trưng bày hàng hoá cho cửa hàng tiện lợi.",
    description:
      "Kệ siêu thị đơn 5 tầng dùng trong các cửa hàng tạp hoá, mini mart. Khung thép chắc chắn, mâm tầng có thể điều chỉnh độ cao.",
    specs: [
      { label: "Kích thước", value: "90 x 40 x 180 cm" },
      { label: "Số tầng", value: "5 tầng" },
      { label: "Tải trọng", value: "60 kg/tầng" },
      { label: "Màu sắc", value: "Trắng kem" },
    ],
  },
  {
    id: "p3",
    slug: "ke-kho-hang-cong-nghiep",
    name: "Kệ kho hàng công nghiệp Selective",
    price: 5200000,
    category: "Kệ kho hàng",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
    shortDesc: "Kệ Selective tải trọng nặng cho kho công nghiệp.",
    description:
      "Hệ kệ Selective tiêu chuẩn, dùng cho pallet, lưu kho hàng nặng. Lắp đặt linh hoạt theo diện tích kho.",
    specs: [
      { label: "Kích thước", value: "270 x 100 x 300 cm" },
      { label: "Tải trọng", value: "1500 kg/tầng" },
      { label: "Beam", value: "Step beam 100x50mm" },
    ],
  },
  {
    id: "p4",
    slug: "ke-trung-bay-nuoc-hoa",
    name: "Kệ trưng bày mỹ phẩm mini",
    price: 690000,
    category: "Kệ trưng bày",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    shortDesc: "Kệ mini đặt bàn cho shop mỹ phẩm.",
    description:
      "Thiết kế thanh lịch, phù hợp shop mỹ phẩm, nước hoa. Bề mặt sơn tĩnh điện trắng sáng tinh tế.",
    specs: [
      { label: "Kích thước", value: "40 x 25 x 60 cm" },
      { label: "Số tầng", value: "3 tầng" },
    ],
  },
  {
    id: "p5",
    slug: "ke-sach-gia-dinh",
    name: "Kệ sách gia đình 5 tầng",
    price: 1250000,
    category: "Kệ V lỗ",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
    shortDesc: "Kệ sách 5 tầng phong cách tối giản.",
    description:
      "Kệ sách 5 tầng phù hợp phòng đọc, văn phòng làm việc tại nhà. Khung sắt chắc chắn, không cong vênh.",
    specs: [
      { label: "Kích thước", value: "80 x 30 x 180 cm" },
      { label: "Số tầng", value: "5 tầng" },
      { label: "Tải trọng", value: "40 kg/tầng" },
    ],
  },
  {
    id: "p6",
    slug: "ke-de-giay-thong-minh",
    name: "Kệ để giày thông minh 6 tầng",
    price: 720000,
    category: "Kệ gia đình",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80",
    shortDesc: "Kệ giày 6 tầng tiết kiệm không gian.",
    description:
      "Kệ giày 6 tầng với khung thép sơn tĩnh điện, vải Oxford chống bụi.",
    specs: [
      { label: "Kích thước", value: "60 x 30 x 120 cm" },
      { label: "Sức chứa", value: "18 - 24 đôi" },
    ],
  },
  {
    id: "p7",
    slug: "ke-trung-bay-thoi-trang",
    name: "Kệ trưng bày thời trang chữ A",
    price: 2150000,
    category: "Kệ trưng bày",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
    shortDesc: "Kệ shop thời trang đứng độc lập.",
    description:
      "Kệ chữ A treo quần áo và trưng bày phụ kiện. Thiết kế hiện đại cho shop thời trang.",
    specs: [
      { label: "Kích thước", value: "120 x 50 x 170 cm" },
      { label: "Tải trọng", value: "80 kg" },
    ],
  },
  {
    id: "p8",
    slug: "ke-drive-in-kho-lanh",
    name: "Kệ Drive-in kho lạnh",
    price: 7800000,
    category: "Kệ kho hàng",
    image: "https://images.unsplash.com/photo-1601598851547-4302969d0614?w=800&q=80",
    shortDesc: "Kệ Drive-in dành cho kho lạnh, lưu trữ mật độ cao.",
    description:
      "Kệ Drive-in cho phép xe nâng đi vào trong, tối ưu lưu kho lạnh, kho thực phẩm đông.",
    specs: [
      { label: "Tải trọng", value: "1200 kg/pallet" },
      { label: "Chiều cao", value: "Tuỳ chỉnh đến 8m" },
    ],
  },
];

export const categories = Array.from(new Set(products.map((p) => p.category)));
