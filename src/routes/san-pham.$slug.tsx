import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { products } from "@/data/products";
import { formatVND } from "@/lib/format";
import { cartStore } from "@/hooks/use-cart";
import { ProductCard } from "@/components/ProductCard";
import { ShoppingCart, Minus, Plus, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/san-pham/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Kệ Sắt Tiến Phát` },
          { name: "description", content: loaderData.product.shortDesc },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.shortDesc },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  component: () => (
    <SiteLayout>
      <ProductDetail />
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Không tìm thấy sản phẩm</h1>
        <Link to="/san-pham" className="mt-4 inline-block text-primary hover:underline">← Về danh sách</Link>
      </div>
    </SiteLayout>
  ),
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Trang chủ</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/san-pham" className="hover:text-foreground">Sản phẩm</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">{product.category}</span>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{product.name}</h1>
          <p className="mt-3 text-3xl font-bold text-primary">{formatVND(product.price)}</p>
          <p className="mt-5 text-muted-foreground">{product.description}</p>

          <div className="mt-6 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold">Thông số kỹ thuật</h3>
            <dl className="grid gap-2 text-sm">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between border-b border-border/50 py-1.5 last:border-0">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="inline-flex items-center rounded-lg border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:bg-accent" aria-label="Giảm">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-3 hover:bg-accent" aria-label="Tăng">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                cartStore.add(product, qty);
                toast.success(`Đã thêm ${qty} sản phẩm vào giỏ hàng`);
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
            >
              <ShoppingCart className="h-5 w-5" /> Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">Sản phẩm liên quan</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
