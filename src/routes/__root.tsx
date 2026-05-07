import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Không tìm thấy trang</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Trang này không tải được</h1>
        <p className="mt-2 text-sm text-muted-foreground">Đã xảy ra lỗi. Vui lòng thử lại.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Thử lại
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kệ Sắt Tiến Phát — Kệ V lỗ, Kệ siêu thị, Kệ kho hàng" },
      {
        name: "description",
        content:
          "Kệ Sắt Tiến Phát chuyên cung cấp kệ V lỗ, kệ siêu thị, kệ kho hàng công nghiệp chất lượng cao, giá tốt.",
      },
      { property: "og:title", content: "Kệ Sắt Tiến Phát — Kệ V lỗ, Kệ siêu thị, Kệ kho hàng" },
      { property: "og:description", content: "Builds a self-contained React/Vite web app for traditional shared hosting." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Kệ Sắt Tiến Phát — Kệ V lỗ, Kệ siêu thị, Kệ kho hàng" },
      { name: "description", content: "Builds a self-contained React/Vite web app for traditional shared hosting." },
      { name: "twitter:description", content: "Builds a self-contained React/Vite web app for traditional shared hosting." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c88c5fe3-874b-4bef-9c88-03679df84dcc/id-preview-5a9841a9--ee91b360-9805-4588-abe0-fb45c69b8968.lovable.app-1778162512466.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c88c5fe3-874b-4bef-9c88-03679df84dcc/id-preview-5a9841a9--ee91b360-9805-4588-abe0-fb45c69b8968.lovable.app-1778162512466.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
