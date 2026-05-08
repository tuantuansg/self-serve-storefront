import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dang-nhap")({
  head: () => ({ meta: [{ title: "Đăng nhập — Kệ Sắt Tiến Phát" }] }),
  component: () => (
    <SiteLayout>
      <LoginPage />
    </SiteLayout>
  ),
});

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/admin" });
  }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Đăng nhập thành công");
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: { full_name: fullName },
        },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-xl border border-border bg-card p-8 shadow-card">
        <h1 className="font-display text-2xl font-bold">
          {mode === "signin" ? "Đăng nhập quản trị" : "Đăng ký tài khoản"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Dành cho quản trị viên website."
            : "Tài khoản đầu tiên đăng ký sẽ tự động trở thành Quản trị viên."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium">Họ tên</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={100}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
        </button>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground">
          ← Về trang chủ
        </Link>
      </div>
    </div>
  );
}
