import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, FileText, ShoppingBag } from "lucide-react";
import { formatVND } from "@/lib/format";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [p, b, o, recent] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("id, customer_name, total, status, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      return {
        products: p.count ?? 0,
        posts: b.count ?? 0,
        pendingOrders: o.count ?? 0,
        recent: recent.data ?? [],
      };
    },
  });

  const cards = [
    { label: "Sản phẩm", value: data?.products ?? 0, icon: Package, to: "/admin/san-pham" as const },
    { label: "Bài viết", value: data?.posts ?? 0, icon: FileText, to: "/admin/bai-viet" as const },
    { label: "Đơn hàng chờ xử lý", value: data?.pendingOrders ?? 0, icon: ShoppingBag, to: "/admin/don-hang" as const },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold md:text-3xl">Tổng quan</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="rounded-xl border border-border bg-card p-5 shadow-card hover:border-primary">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-3 font-display text-3xl font-bold">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="font-semibold">Đơn hàng mới nhất</h2>
        {(data?.recent ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Chưa có đơn hàng.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border text-sm">
            {(data?.recent ?? []).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-2.5">
                <div>
                  <div className="font-medium">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleString("vi-VN")} • {ORDER_STATUS_LABEL[o.status as OrderStatus]}
                  </div>
                </div>
                <span className="font-semibold text-primary">{formatVND(Number(o.total))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
