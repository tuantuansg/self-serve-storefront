import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { posts } from "@/data/posts";

export const Route = createFileRoute("/bai-viet/")({
  head: () => ({
    meta: [
      { title: "Bài viết — Kệ Sắt Tiến Phát" },
      { name: "description", content: "Tin tức và kiến thức về kệ sắt, kho hàng." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <BlogIndex />
    </SiteLayout>
  ),
});

function BlogIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Bài viết</h1>
      <p className="mt-2 text-muted-foreground">Cập nhật tin tức, kiến thức và mẹo sử dụng kệ sắt.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
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
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
