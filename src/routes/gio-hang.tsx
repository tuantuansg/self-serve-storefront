import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart } from "@/hooks/use-cart";
import { formatVND } from "@/lib/format";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/gio-hang")({
  head: () => ({ meta: [{ title: "Giỏ hàng — Kệ Sắt Tiến Phát" }] }),
  component: () => (
    <SiteLayout>
      <CartPage />
    </SiteLayout>
  ),
});

function CartPage() {
  const { items, totalPrice, update, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 font-display text-3xl font-bold">Giỏ hàng trống</h1>
        <p className="mt-2 text-muted-foreground">Hãy thêm sản phẩm để tiếp tục mua sắm.</p>
        <Link to="/san-pham" className="mt-6 inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Giỏ hàng</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
              <img src={product.image} alt={product.name} className="h-24 w-24 rounded-lg object-cover" />
              <div className="flex flex-1 flex-col">
                <Link to="/san-pham/$slug" params={{ slug: product.slug }} className="font-semibold hover:text-primary">
                  {product.name}
                </Link>
                <span className="text-sm text-muted-foreground">{product.category}</span>
                <div className="mt-auto flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border border-border">
                    <button onClick={() => update(product.id, quantity - 1)} className="p-2 hover:bg-accent">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                    <button onClick={() => update(product.id, quantity + 1)} className="p-2 hover:bg-accent">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-semibold text-primary">{formatVND(product.price * quantity)}</span>
                </div>
              </div>
              <button
                onClick={() => remove(product.id)}
                className="self-start text-muted-foreground hover:text-destructive"
                aria-label="Xoá"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-semibold">Tổng đơn hàng</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tạm tính</dt>
              <dd>{formatVND(totalPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Phí vận chuyển</dt>
              <dd>Liên hệ</dd>
            </div>
          </dl>
          <div className="my-4 border-t border-border" />
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng</span>
            <span className="text-primary">{formatVND(totalPrice)}</span>
          </div>
          <Link
            to="/thanh-toan"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
          >
            Tiến hành đặt hàng
          </Link>
        </aside>
      </div>
    </div>
  );
}
