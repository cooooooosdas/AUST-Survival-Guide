import SectionSidebar from "@/components/SectionSidebar";

export default function SectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
        <aside className="min-w-0 md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:overflow-auto">
          <SectionSidebar />
        </aside>
        <div className="card min-w-0 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
