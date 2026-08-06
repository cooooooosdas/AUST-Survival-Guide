import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 md:grid-cols-[160px_1fr] md:gap-10">
        <aside className="md:sticky md:top-20 md:h-[calc(100vh-6rem)] md:overflow-auto">
          <AdminSidebar />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}