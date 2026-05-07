import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { formatVND } from "@/lib/format";
import { cartStore } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <Link
        to="/san-pham/$slug"
        params={{ slug: product.slug }}
        className="aspect-[4/3] overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium text-muted-foreground">{product.category}</span>
        <Link
          to="/san-pham/$slug"
          params={{ slug: product.slug }}
          className="mt-1 line-clamp-2 font-semibold leading-snug hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.shortDesc}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-primary">
            {formatVND(product.price)}
          </span>
          <button
            onClick={() => {
              cartStore.add(product, 1);
              toast.success("Đã thêm vào giỏ hàng");
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
            aria-label="Thêm vào giỏ"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
