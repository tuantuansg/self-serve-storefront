import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";

const navItems = [
  { to: "/", label: "Trang chủ" },
  { to: "/san-pham", label: "Sản phẩm" },
  { to: "/bai-viet", label: "Bài viết" },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/lien-he", label: "Liên hệ" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold">
              TP
            </div>
            <span className="font-display text-lg font-semibold">Kệ Sắt Tiến Phát</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary bg-accent" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/gio-hang"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-primary" }}
                  className="rounded-md px-3 py-3 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="mt-16 border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold">
                TP
              </div>
              <span className="font-display text-lg font-semibold">Kệ Sắt Tiến Phát</span>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Chuyên cung cấp kệ sắt V lỗ, kệ siêu thị, kệ kho hàng công nghiệp với chất lượng cao và giá thành cạnh tranh.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Liên kết</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {navItems.map((i) => (
                <li key={i.to}>
                  <Link to={i.to} className="hover:text-foreground">{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Hotline: 0900 123 456</li>
              <li>Email: info@kesattienphat.vn</li>
              <li>Địa chỉ: TP. Hồ Chí Minh</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Kệ Sắt Tiến Phát. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
