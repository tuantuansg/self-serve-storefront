import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { posts } from "@/data/posts";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/bai-viet/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Kệ Sắt Tiến Phát` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:image", content: loaderData.post.image },
        ]
      : [],
  }),
  component: () => (
    <SiteLayout>
      <PostDetail />
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Không tìm thấy bài viết</h1>
        <Link to="/bai-viet" className="mt-4 inline-block text-primary hover:underline">← Về danh sách</Link>
      </div>
    </SiteLayout>
  ),
});

function PostDetail() {
  const { post } = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Trang chủ</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/bai-viet" className="hover:text-foreground">Bài viết</Link>
      </nav>
      <h1 className="font-display text-3xl font-bold md:text-4xl">{post.title}</h1>
      <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
        <span>{post.author}</span>
        <span>•</span>
        <time>{new Date(post.date).toLocaleDateString("vi-VN")}</time>
      </div>
      <img src={post.image} alt={post.title} className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover" />
      <div className="prose mt-8 max-w-none whitespace-pre-line text-foreground">
        {post.content}
      </div>
    </article>
  );
}
