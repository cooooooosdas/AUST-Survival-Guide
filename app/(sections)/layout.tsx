import SectionSidebar from "@/components/SectionSidebar";

export default function SectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-10 md:grid-cols-[180px_1fr]">
        <SectionSidebar />
        <div className="glass-card p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
