import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Package, FileText, ShoppingBag, LogOut, Home } from "lucide-react";

const adminNav = [
  { to: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { to: "/admin/san-pham", label: "Sản phẩm", icon: Package, exact: false },
  { to: "/admin/bai-viet", label: "Bài viết", icon: FileText, exact: false },
  { to: "/admin/don-hang", label: "Đơn hàng", icon: ShoppingBag, exact: false },
] as const;

export function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/dang-nhap" });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Đang tải...</div>;
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Không có quyền truy cập</h1>
        <p className="mt-2 text-muted-foreground">Tài khoản của bạn không phải quản trị viên.</p>
        <Link to="/" className="mt-6 inline-block text-primary hover:underline">← Về trang chủ</Link>
      </div>
    );
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen bg-secondary/20">
      <aside className="hidden w-60 flex-col border-r border-border bg-background p-4 md:flex">
        <Link to="/admin" className="mb-6 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold">TP</div>
          <span className="font-display font-semibold">Quản trị</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {adminNav.map((it) => {
            const active = it.exact ? location.pathname === it.to : location.pathname.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <it.icon className="h-4 w-4" /> {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-1 border-t border-border pt-4">
          <Link to="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent">
            <Home className="h-4 w-4" /> Về website
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
          <Link to="/admin" className="font-display font-semibold">Quản trị</Link>
          <button onClick={logout} className="text-sm text-muted-foreground"><LogOut className="h-4 w-4" /></button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-background px-2 py-2 md:hidden">
          {adminNav.map((it) => (
            <Link key={it.to} to={it.to} className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm">{it.label}</Link>
          ))}
        </nav>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
