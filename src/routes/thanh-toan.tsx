import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart } from "@/hooks/use-cart";
import { formatVND } from "@/lib/format";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/thanh-toan")({
  head: () => ({ meta: [{ title: "Đặt hàng — Kệ Sắt Tiến Phát" }] }),
  component: () => (
    <SiteLayout>
      <CheckoutPage />
    </SiteLayout>
  ),
});

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,15}$/, "Số điện thoại không hợp lệ"),
  email: z.string().trim().email("Email không hợp lệ").max(255).or(z.literal("")),
  address: z.string().trim().min(5, "Vui lòng nhập địa chỉ").max(300),
  note: z.string().trim().max(500).optional(),
});

type OrderRecord = {
  id: string;
  date: string;
  customer: z.infer<typeof schema>;
  items: { name: string; quantity: number; price: number }[];
  total: number;
};

function saveOrderLocal(order: OrderRecord) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("tienphat_orders_v1");
    const list: OrderRecord[] = raw ? JSON.parse(raw) : [];
    list.push(order);
    localStorage.setItem("tienphat_orders_v1", JSON.stringify(list));
  } catch {}
}

function CheckoutPage() {
  const { items, totalPrice, clear } = useCart();
  const navigate = useNavigate();
  const [done, setDone] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    const orderId = "DH" + Date.now().toString().slice(-8);
    saveOrderLocal({
      id: orderId,
      date: new Date().toISOString(),
      customer: parsed.data,
      items: items.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
      total: totalPrice,
    });
    clear();
    setDone(orderId);
    toast.success("Đặt hàng thành công");
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-primary" />
        <h1 className="mt-6 font-display text-3xl font-bold">Đặt hàng thành công!</h1>
        <p className="mt-3 text-muted-foreground">
          Mã đơn hàng: <span className="font-semibold text-foreground">{done}</span>
        </p>
        <p className="mt-2 text-muted-foreground">Chúng tôi sẽ liên hệ bạn để xác nhận đơn hàng trong thời gian sớm nhất.</p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Giỏ hàng đang trống</h1>
        <Link to="/san-pham" className="mt-4 inline-block text-primary hover:underline">Mua sắm ngay →</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Thông tin đặt hàng</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card" noValidate>
          {[
            { name: "name", label: "Họ và tên", type: "text", required: true },
            { name: "phone", label: "Số điện thoại", type: "tel", required: true },
            { name: "email", label: "Email (tuỳ chọn)", type: "email" },
            { name: "address", label: "Địa chỉ giao hàng", type: "text", required: true },
          ].map((f) => (
            <div key={f.name}>
              <label className="mb-1.5 block text-sm font-medium">
                {f.label} {f.required && <span className="text-destructive">*</span>}
              </label>
              <input
                name={f.name}
                type={f.type}
                maxLength={300}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              {errors[f.name] && <p className="mt-1 text-xs text-destructive">{errors[f.name]}</p>}
            </div>
          ))}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Ghi chú</label>
            <textarea
              name="note"
              rows={3}
              maxLength={500}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
          >
            Xác nhận đặt hàng
          </button>
        </form>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-semibold">Đơn hàng của bạn</h2>
          <ul className="mt-4 divide-y divide-border text-sm">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between gap-2 py-2">
                <span className="line-clamp-2">{product.name} × {quantity}</span>
                <span className="whitespace-nowrap font-medium">{formatVND(product.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
            <span>Tổng</span>
            <span className="text-primary">{formatVND(totalPrice)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
