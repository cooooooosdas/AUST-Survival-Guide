import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UploadForm from "./UploadForm";

export const metadata = { title: "上传资源" };

const CATEGORIES = [
  { value: "high-math", label: "高数笔记" },
  { value: "cs-courseware", label: "计算机课件" },
  { value: "software", label: "软件安装包" },
  { value: "review", label: "期末复习" },
  { value: "latex", label: "LaTeX 模板" },
  { value: "other", label: "其他" },
];

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-serif font-semibold text-text">上传资源</h1>
      <p className="mt-1 text-sm text-muted">
        上传文件供全站同学下载。支持 PDF、Markdown、压缩包、软件安装包等格式。
      </p>

      <UploadForm categories={CATEGORIES} />
    </div>
  );
}
