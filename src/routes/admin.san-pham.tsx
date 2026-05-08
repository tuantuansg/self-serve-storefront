import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product, Spec } from "@/lib/types";
import { formatVND } from "@/lib/format";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/san-pham")({
  component: AdminProducts,
});

type Form = {
  slug: string;
  name: string;
  price: string;
  category: string;
  image: string;
  short_desc: string;
  description: string;
  specs: string; // "Label|Value" mỗi dòng
};

const empty: Form = { slug: "", name: "", price: "0", category: "", image: "", short_desc: "", description: "", specs: "" };

function specsToText(specs: Spec[]) {
  return specs.map((s) => `${s.label}|${s.value}`).join("\n");
}
function textToSpecs(text: string): Spec[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [label, ...rest] = l.split("|");
      return { label: label.trim(), value: rest.join("|").trim() };
    })
    .filter((s) => s.label);
}

function AdminProducts() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Form>(empty);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setCreating(true);
  }
  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      slug: p.slug,
      name: p.name,
      price: String(p.price),
      category: p.category,
      image: p.image,
      short_desc: p.short_desc,
      description: p.description,
      specs: specsToText(p.specs ?? []),
    });
    setCreating(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      price: Number(form.price) || 0,
      category: form.category.trim(),
      image: form.image.trim(),
      short_desc: form.short_desc.trim(),
      description: form.description.trim(),
      specs: textToSpecs(form.specs),
    };
    if (!payload.slug || !payload.name) return toast.error("Slug và Tên bắt buộc");
    const res = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Đã cập nhật" : "Đã thêm sản phẩm");
    setCreating(false);
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function remove(id: string) {
    if (!confirm("Xoá sản phẩm này?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Đã xoá");
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Sản phẩm</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Thêm sản phẩm
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr>
              <th className="p-3">Sản phẩm</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Giá</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Đang tải...</td></tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {p.image && <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />}
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">/{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{p.category}</td>
                <td className="p-3 font-semibold text-primary">{formatVND(p.price)}</td>
                <td className="p-3 text-right">
                  <button onClick={() => openEdit(p)} className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(p.id)} className="inline-flex h-8 w-8 items-center justify-center rounded text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setCreating(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-lg">
            <h2 className="font-display text-xl font-bold">{editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Slug *" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
              <Field label="Tên *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Giá (VNĐ)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" />
              <Field label="Danh mục" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
              <div className="sm:col-span-2"><Field label="URL ảnh" value={form.image} onChange={(v) => setForm({ ...form, image: v })} /></div>
              <div className="sm:col-span-2"><Field label="Mô tả ngắn" value={form.short_desc} onChange={(v) => setForm({ ...form, short_desc: v })} /></div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">Mô tả chi tiết</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">Thông số (mỗi dòng: Tên|Giá trị)</label>
                <textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} rows={4} placeholder="Kích thước|70 x 40 x 150 cm" className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs" />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setCreating(false)} className="rounded-md border border-border px-4 py-2 text-sm">Huỷ</button>
              <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
    </div>
  );
}
