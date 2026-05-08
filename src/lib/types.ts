export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  short_desc: string;
  description: string;
  specs: Spec[];
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  date: string;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "done" | "cancelled";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao",
  done: "Hoàn tất",
  cancelled: "Đã huỷ",
};
