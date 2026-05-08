import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/lib/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bai-viet")({
  component: AdminPosts,
});

type Form = { slug: string; title: string; excerpt: string; content: string; author: string; image: string; date: string };
const empty: Form = { slug: "", title: "", excerpt: "", content: "", author: "Tiến Phát", image: "", date: new Date().toISOString().slice(0, 10) };

function AdminPosts() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);

  const { data: posts = [] } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await supabase.from("posts").select("*").order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Post[];
    },
  });

  function openEdit(p: Post) {
    setEditing(p);
    setForm({ slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content, author: p.author, image: p.image, date: p.date });
    setOpen(true);
  }
  function openCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.slug.trim() || !form.title.trim()) return toast.error("Slug và Tiêu đề bắt buộc");
    const payload = { ...form, slug: form.slug.trim(), title: form.title.trim() };
    const res = editing
      ? await supabase.from("posts").update(payload).eq("id", editing.id)
      : await supabase.from("posts").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Đã lưu");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin", "posts"] });
    qc.invalidateQueries({ queryKey: ["posts"] });
  }

  async function remove(id: string) {
    if (!confirm("Xoá bài viết này?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Đã xoá");
    qc.invalidateQueries({ queryKey: ["admin", "posts"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Bài viết</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Thêm bài viết
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr><th className="p-3">Tiêu đề</th><th className="p-3">Ngày</th><th className="p-3 text-right">Thao tác</th></tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">/{p.slug}</div>
                </td>
                <td className="p-3 text-muted-foreground">{new Date(p.date).toLocaleDateString("vi-VN")}</td>
                <td className="p-3 text-right">
                  <button onClick={() => openEdit(p)} className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(p.id)} className="inline-flex h-8 w-8 items-center justify-center rounded text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-lg">
            <h2 className="font-display text-xl font-bold">{editing ? "Sửa bài viết" : "Thêm bài viết"}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Inp label="Slug *" v={form.slug} on={(v) => setForm({ ...form, slug: v })} />
              <Inp label="Tiêu đề *" v={form.title} on={(v) => setForm({ ...form, title: v })} />
              <Inp label="Tác giả" v={form.author} on={(v) => setForm({ ...form, author: v })} />
              <Inp label="Ngày" v={form.date} on={(v) => setForm({ ...form, date: v })} type="date" />
              <div className="sm:col-span-2"><Inp label="URL ảnh" v={form.image} on={(v) => setForm({ ...form, image: v })} /></div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">Tóm tắt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">Nội dung</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-border px-4 py-2 text-sm">Huỷ</button>
              <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Inp({ label, v, on, type = "text" }: { label: string; v: string; on: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input type={type} value={v} onChange={(e) => on(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
    </div>
  );
}
