import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/lien-he")({
  head: () => ({
    meta: [
      { title: "Liên hệ — Kệ Sắt Tiến Phát" },
      { name: "description", content: "Liên hệ với Kệ Sắt Tiến Phát để được tư vấn." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <Contact />
    </SiteLayout>
  ),
});

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100),
  email: z.string().trim().email("Email không hợp lệ").max(255),
  message: z.string().trim().min(5, "Vui lòng nhập nội dung").max(1000),
});

function Contact() {
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
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tienphat_messages_v1");
        const list = raw ? JSON.parse(raw) : [];
        list.push({ ...parsed.data, date: new Date().toISOString() });
        localStorage.setItem("tienphat_messages_v1", JSON.stringify(list));
      } catch {}
    }
    toast.success("Đã gửi tin nhắn. Chúng tôi sẽ liên hệ lại sớm.");
    e.currentTarget.reset();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Liên hệ với chúng tôi</h1>
      <p className="mt-2 text-muted-foreground">Để lại thông tin, đội ngũ Tiến Phát sẽ liên hệ tư vấn trong 24h.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          {[
            { icon: Phone, title: "Hotline", value: "0900 123 456" },
            { icon: Mail, title: "Email", value: "info@kesattienphat.vn" },
            { icon: MapPin, title: "Địa chỉ", value: "123 Đường ABC, Q.12, TP. Hồ Chí Minh" },
          ].map((c) => (
            <div key={c.title} className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{c.title}</div>
                <div className="font-semibold">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-card" noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Họ và tên *</label>
            <input name="name" maxLength={100} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email *</label>
            <input name="email" type="email" maxLength={255} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nội dung *</label>
            <textarea name="message" rows={5} maxLength={1000} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30" />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft hover:bg-primary/90">
            Gửi tin nhắn
          </button>
        </form>
      </div>
    </div>
  );
}
