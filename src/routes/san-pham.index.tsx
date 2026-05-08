import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/san-pham/")({
  head: () => ({
    meta: [
      { title: "Sản phẩm — Kệ Sắt Tiến Phát" },
      { name: "description", content: "Danh mục kệ sắt: V lỗ, siêu thị, kho hàng, trưng bày." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <ProductsPage />
    </SiteLayout>
  ),
});

function ProductsPage() {
  const [cat, setCat] = useState<string>("Tất cả");
  const [q, setQ] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).filter(Boolean),
    [products],
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = cat === "Tất cả" || p.category === cat;
      const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [products, cat, q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Tất cả sản phẩm</h1>
      <p className="mt-2 text-muted-foreground">Khám phá đầy đủ các dòng kệ sắt chất lượng cao.</p>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["Tất cả", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm sản phẩm..."
          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 md:w-64"
        />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {!isLoading && filtered.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">Không tìm thấy sản phẩm.</p>
      )}
    </div>
  );
}
