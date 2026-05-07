import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Award, Users, Factory, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/gioi-thieu")({
  head: () => ({
    meta: [
      { title: "Giới thiệu — Kệ Sắt Tiến Phát" },
      { name: "description", content: "Tiến Phát — đơn vị sản xuất kệ sắt uy tín hơn 10 năm." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <About />
    </SiteLayout>
  ),
});

function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Về Kệ Sắt Tiến Phát</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Kệ Sắt Tiến Phát là đơn vị sản xuất và phân phối các loại kệ sắt công nghiệp, kệ siêu thị, kệ V lỗ
        đa năng với hơn 10 năm kinh nghiệm. Chúng tôi cam kết mang đến giải pháp lưu trữ tối ưu, bền bỉ
        và phù hợp với mọi nhu cầu của khách hàng.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Factory, value: "10+", label: "Năm kinh nghiệm" },
          { icon: Users, value: "5,000+", label: "Khách hàng tin dùng" },
          { icon: Award, value: "ISO", label: "Tiêu chuẩn chất lượng" },
          { icon: HeartHandshake, value: "24/7", label: "Hỗ trợ tận tâm" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-6 text-center shadow-card">
            <s.icon className="mx-auto h-8 w-8 text-primary" />
            <div className="mt-3 font-display text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold">Sứ mệnh</h2>
      <p className="mt-3 text-muted-foreground">
        Cung cấp giải pháp kệ sắt chất lượng cao với giá thành hợp lý, góp phần tối ưu hoá không gian
        lưu trữ cho doanh nghiệp và gia đình Việt.
      </p>

      <h2 className="mt-8 font-display text-2xl font-bold">Giá trị cốt lõi</h2>
      <ul className="mt-3 space-y-2 text-muted-foreground">
        <li>• <strong className="text-foreground">Chất lượng:</strong> Sản phẩm đạt chuẩn, bền vững theo thời gian.</li>
        <li>• <strong className="text-foreground">Uy tín:</strong> Cam kết đúng tiến độ, đúng cam kết.</li>
        <li>• <strong className="text-foreground">Tận tâm:</strong> Đồng hành cùng khách hàng từ tư vấn đến bảo hành.</li>
      </ul>
    </div>
  );
}
