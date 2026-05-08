## Mục tiêu
Chuyển dự án từ dữ liệu tĩnh sang Lovable Cloud, có trang `/admin` quản lý đầy đủ Sản phẩm, Bài viết, Đơn hàng.

## 1. Cơ sở dữ liệu (migration)

Tạo các bảng trong Lovable Cloud:

- **`products`** — id, slug (unique), name, price, category, image, short_desc, description, specs (jsonb), created_at
- **`posts`** — id, slug (unique), title, excerpt, content, author, image, date, created_at
- **`orders`** — id, customer_name, phone, address, note, items (jsonb: [{product_id, name, price, qty}]), total, status (`pending`/`confirmed`/`shipped`/`done`/`cancelled`), created_at
- **`profiles`** — id (= auth user id), email, full_name, created_at + trigger tự tạo khi đăng ký
- **`user_roles`** — (user_id, role enum `admin`/`user`) + hàm `has_role()` (security definer) để chống đệ quy RLS

**RLS:**
- `products`, `posts`: ai cũng SELECT được; chỉ admin INSERT/UPDATE/DELETE.
- `orders`: ai cũng INSERT (khách đặt hàng không cần đăng nhập); chỉ admin SELECT/UPDATE.
- `profiles`: user xem/sửa bản thân; admin xem tất cả.
- `user_roles`: chỉ admin quản lý.

**Seed**: chèn sẵn 8 sản phẩm + 3 bài viết hiện có vào DB.

## 2. Xác thực

- Login bằng **email/password** + **Google** (mặc định Lovable Cloud).
- Trang `/dang-nhap` cho admin.
- Khách mua hàng **không** cần đăng nhập (giữ nguyên trải nghiệm).
- Tài khoản admin đầu tiên: bạn đăng ký xong, mình hướng dẫn cách gán role `admin` (hoặc tự động gán cho email đầu tiên).

## 3. Refactor frontend (giữ giao diện hiện tại)

- Bỏ `src/data/products.ts`, `src/data/posts.ts` (giữ làm nguồn seed một lần).
- Các trang `/san-pham`, `/san-pham/$slug`, `/bai-viet`, `/bai-viet/$slug`, trang chủ → fetch từ Supabase qua server function.
- Trang `/thanh-toan` → khi submit, INSERT vào bảng `orders` thay vì chỉ lưu `localStorage`.
- Giỏ hàng vẫn dùng `localStorage` (không cần backend).

## 4. Trang quản trị `/admin` (layout `_authenticated/_admin`)

- **`/admin`** — dashboard tóm tắt: số sản phẩm, bài viết, đơn hàng mới.
- **`/admin/san-pham`** — bảng danh sách + nút Thêm/Sửa/Xoá (dialog form).
- **`/admin/bai-viet`** — bảng danh sách + Thêm/Sửa/Xoá (textarea cho nội dung).
- **`/admin/don-hang`** — bảng đơn hàng, xem chi tiết, đổi trạng thái.
- Route guard: chưa đăng nhập → `/dang-nhap`; đã đăng nhập nhưng không phải admin → trang "Không có quyền".

## 5. Lưu ý về deploy

Sau khi bật Lovable Cloud, dự án **không còn deploy lên Shared Hosting** được nữa (cần backend). Bạn sẽ dùng nút **Publish** của Lovable hoặc gắn domain riêng trỏ về Lovable.

## Phạm vi KHÔNG bao gồm (có thể làm sau)
- Upload ảnh sản phẩm (giờ vẫn nhập URL ảnh)
- Phân trang/SEO sitemap
- Email thông báo đơn hàng mới
- Thanh toán online

Sau khi bạn duyệt, mình sẽ làm tuần tự: migration DB → auth → refactor trang công khai → trang admin.
