import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, fetchPosts } from "@/data/static";
import heroImg from "@/assets/hero-shelving.jpg";
import { ArrowRight, ShieldCheck, Truck, Wrench, Award } from "lucide-react";

export const Route = createFileRoute("/")({
  component: () => (
    <SiteLayout>
      <Index />
    </SiteLayout>
  ),
});

function Index() {
  const { data: products = [] } = useQuery({
    queryKey: ["products", "all"],
    queryFn: fetchProducts,
  });
  const featured = products.slice(0, 4);

  const { data: posts = [] } = useQuery({
    queryKey: ["posts", "all"],
    queryFn: fetchPosts,
  });
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      <section className="bg-hero-gradient">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Nhà sản xuất kệ sắt uy tín
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Giải pháp kệ sắt <span className="text-primary">tối ưu</span> cho kho hàng & cửa hàng
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
              Kệ V lỗ, kệ siêu thị, kệ kho hàng công nghiệp — chất lượng cao, lắp đặt nhanh, bảo hành dài hạn.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/san-pham"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary/90"
              >
                Xem sản phẩm <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/lien-he"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Kho kệ sắt công nghiệp"
              width={1600}
              height={1024}
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Bảo hành 24 tháng", desc: "Cam kết chất lượng từng sản phẩm." },
            { icon: Truck, title: "Giao hàng toàn quốc", desc: "Vận chuyển nhanh, đóng gói cẩn thận." },
            { icon: Wrench, title: "Lắp đặt tận nơi", desc: "Đội kỹ thuật chuyên nghiệp." },
            { icon: Award, title: "Sản xuất tại VN", desc: "Tiêu chuẩn ISO, giá xuất xưởng." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Sản phẩm nổi bật</h2>
            <p className="mt-1 text-muted-foreground">Những mẫu kệ được khách hàng yêu thích nhất</p>
          </div>
          <Link to="/san-pham" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:inline-flex">
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold">Tin tức & kiến thức</h2>
          <p className="mt-1 text-muted-foreground">Cập nhật xu hướng và mẹo sử dụng kệ sắt</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {latestPosts.map((post) => (
            <Link
              key={post.id}
              to="/bai-viet/$slug"
              params={{ slug: post.slug }}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img src={post.image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <time className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString("vi-VN")}</time>
                <h3 className="mt-2 line-clamp-2 font-semibold leading-snug group-hover:text-primary">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
