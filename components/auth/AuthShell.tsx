import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Bookmark, MessageCircle } from "lucide-react";
import campus from "@/public/images/editorial/aust-real/opening-ceremony-2024.webp";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page">
      <Link className="back-link" href="/">
        <ArrowLeft size={16} aria-hidden />
        返回首页
      </Link>
      <div className="auth-shell">
        <aside className="auth-story" aria-label="欢迎来到安理指南">
          <span className="eyebrow">AUST · 同学之间</span>
          <h2>
            大学很大，
            <br />
            从这里熟悉起来。
          </h2>
          <p>把有用的经验留下来，让下一位同学少走一点弯路。</p>
          <div className="auth-benefits">
            <span>
              <Bookmark size={18} aria-hidden />
              收藏想读的内容
            </span>
            <span>
              <BookOpen size={18} aria-hidden />
              记录自己的学习
            </span>
            <span>
              <MessageCircle size={18} aria-hidden />
              交流经验与疑问
            </span>
          </div>
          <figure className="auth-photo">
            <Image
              src={campus}
              loading="eager"
              alt="安徽理工大学开学典礼现场"
              sizes="(max-width: 767px) 0px, 450px"
              className="object-cover"
            />
            <figcaption>
              2024 开学典礼 ·{" "}
              <a
                href="https://news.aust.edu.cn/info/1011/41807.htm"
                target="_blank"
                rel="noreferrer"
              >
                安徽理工大学新闻网 / 新媒体中心
              </a>
            </figcaption>
          </figure>
        </aside>
        <section className="auth-content">{children}</section>
      </div>
      <p className="auth-footnote">
        同学自发维护的非官方网站 · <Link href="/privacy">隐私政策</Link> ·{" "}
        <Link href="/disclaimer">使用声明</Link>
      </p>
    </div>
  );
}
