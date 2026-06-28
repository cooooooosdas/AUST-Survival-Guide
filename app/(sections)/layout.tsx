import SectionSidebar from "@/components/SectionSidebar";

export default function SectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-10 md:grid-cols-[180px_1fr]">
        <aside className="md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:overflow-auto">
          <SectionSidebar />
        </aside>
        <div className="card p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
