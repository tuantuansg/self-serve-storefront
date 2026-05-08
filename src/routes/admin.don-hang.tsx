import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatVND } from "@/lib/format";
import { ORDER_STATUS_LABEL, type OrderItem, type OrderStatus } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/don-hang")({
  component: AdminOrders,
});

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  note: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
};

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "done", "cancelled"];

function AdminOrders() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Order | null>(null);

  const { data: orders = [] } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Order[];
    },
  });

  async function changeStatus(id: string, status: OrderStatus) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Đã cập nhật trạng thái");
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    if (selected?.id === id) setSelected({ ...selected, status });
  }

  async function remove(id: string) {
    if (!confirm("Xoá đơn hàng này?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Đã xoá");
    setSelected(null);
    qc.invalidateQueries({ queryKey: ["admin", "orders"] });
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold md:text-3xl">Đơn hàng</h1>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr>
              <th className="p-3">Mã</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Thời gian</th>
              <th className="p-3">Tổng</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Chưa có đơn hàng nào.</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} onClick={() => setSelected(o)} className="cursor-pointer border-t border-border hover:bg-accent/50">
                <td className="p-3 font-mono text-xs">DH-{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="p-3">
                  <div className="font-medium">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{o.phone}</div>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("vi-VN")}</td>
                <td className="p-3 font-semibold text-primary">{formatVND(Number(o.total))}</td>
                <td className="p-3">
                  <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{ORDER_STATUS_LABEL[o.status]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Mã đơn</div>
                <div className="font-display text-xl font-bold">DH-{selected.id.slice(0, 8).toUpperCase()}</div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {new Date(selected.created_at).toLocaleString("vi-VN")}
              </div>
            </div>

            <div className="mt-4 grid gap-3 rounded-lg border border-border bg-secondary/30 p-4 text-sm sm:grid-cols-2">
              <div><span className="text-muted-foreground">Khách hàng:</span> <b>{selected.customer_name}</b></div>
              <div><span className="text-muted-foreground">SĐT:</span> {selected.phone}</div>
              <div className="sm:col-span-2"><span className="text-muted-foreground">Địa chỉ:</span> {selected.address}</div>
              {selected.note && <div className="sm:col-span-2"><span className="text-muted-foreground">Ghi chú:</span> {selected.note}</div>}
            </div>

            <h3 className="mt-5 font-semibold">Sản phẩm</h3>
            <ul className="mt-2 divide-y divide-border text-sm">
              {selected.items.map((it, idx) => (
                <li key={idx} className="flex justify-between py-2">
                  <span>{it.name} × {it.quantity}</span>
                  <span className="font-medium">{formatVND(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-bold">
              <span>Tổng</span>
              <span className="text-primary">{formatVND(Number(selected.total))}</span>
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium">Trạng thái</label>
              <select
                value={selected.status}
                onChange={(e) => changeStatus(selected.id, e.target.value as OrderStatus)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>)}
              </select>
            </div>

            <div className="mt-5 flex justify-between">
              <button onClick={() => remove(selected.id)} className="rounded-md border border-destructive px-4 py-2 text-sm text-destructive hover:bg-destructive/10">Xoá đơn</button>
              <button onClick={() => setSelected(null)} className="rounded-md border border-border px-4 py-2 text-sm">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
