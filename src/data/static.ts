import type { Product, Post } from "@/lib/types";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/data/products.json");
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const all = await fetchProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("/data/articles.json");
  if (!res.ok) throw new Error("Failed to load articles");
  const posts: Post[] = await res.json();
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const all = await fetchPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
