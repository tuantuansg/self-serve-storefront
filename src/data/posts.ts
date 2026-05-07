export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
};

export const posts: Post[] = [
  {
    id: "b1",
    slug: "cach-chon-ke-sat-cho-kho-hang",
    title: "Cách chọn kệ sắt phù hợp cho kho hàng của bạn",
    excerpt:
      "Hướng dẫn chi tiết các tiêu chí lựa chọn kệ sắt theo diện tích, tải trọng và loại hàng hoá.",
    content:
      "Khi đầu tư kệ sắt cho kho hàng, bạn cần cân nhắc 4 yếu tố: diện tích kho, tải trọng hàng hoá, tần suất xuất nhập, và ngân sách. Bài viết này sẽ phân tích chi tiết từng yếu tố để bạn đưa ra quyết định tối ưu nhất.\n\nĐầu tiên, hãy đo đạc chính xác diện tích sàn và chiều cao trần. Tiếp theo, ước tính khối lượng hàng hoá trung bình trên mỗi pallet. Với hàng nhẹ dưới 500kg, kệ V lỗ là lựa chọn kinh tế. Với hàng nặng trên 1 tấn, bạn cần kệ Selective hoặc Drive-in.",
    date: "2025-04-15",
    author: "Tiến Phát",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80",
  },
  {
    id: "b2",
    slug: "uu-diem-ke-v-lo-da-nang",
    title: "5 ưu điểm vượt trội của kệ V lỗ đa năng",
    excerpt:
      "Tại sao kệ V lỗ là lựa chọn hàng đầu cho gia đình và văn phòng?",
    content:
      "Kệ V lỗ đa năng được ưa chuộng nhờ thiết kế linh hoạt, dễ lắp đặt và giá thành hợp lý. Bài viết tổng hợp 5 ưu điểm nổi bật giúp bạn hiểu rõ vì sao nên chọn loại kệ này.",
    date: "2025-03-22",
    author: "Tiến Phát",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
  },
  {
    id: "b3",
    slug: "bao-tri-ke-sat-dung-cach",
    title: "Hướng dẫn bảo trì kệ sắt đúng cách để dùng lâu dài",
    excerpt:
      "Mẹo bảo dưỡng kệ sắt giúp tăng tuổi thọ và đảm bảo an toàn.",
    content:
      "Việc bảo trì định kỳ giúp kệ sắt luôn vững chắc và an toàn. Hãy kiểm tra ốc vít hàng tháng, vệ sinh bụi bẩn và sơn dặm các vết trầy xước nếu có.",
    date: "2025-02-10",
    author: "Tiến Phát",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&q=80",
  },
];
