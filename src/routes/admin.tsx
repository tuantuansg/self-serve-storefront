import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Quản trị — Kệ Sắt Tiến Phát" }] }),
  component: AdminLayout,
});
