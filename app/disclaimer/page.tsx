import Link from "next/link";

export const metadata = { title: "免责声明" };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold text-primary">免责声明</h1>
      <p className="mt-2 text-xs text-muted">
        生效日期：2026-06-27 · 最后更新：2026-06-27
      </p>

      <div className="mt-10 space-y-8 leading-relaxed text-text">
        <section>
          <h2 className="text-base font-medium text-primary">本站性质</h2>
          <p className="mt-3 text-sm">
            本站（域名 aust.asia，下称「本站」或「AUST 新生生存指南」）由
            安理大在校学生 coolin 以个人身份独立运营，属于个人博客与兴趣项目。
          </p>
          <p className="mt-3 text-sm">
            本站<strong className="text-text">并非安徽理工大学（AUST）官方页面</strong>，
            与学校、各学院、教务处、网络中心等机构无任何隶属或合作关系。
            站长言论与站点内容仅代表个人观点，不代表学校官方立场。
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-primary">内容责任</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>
              本站所有内容（包括但不限于学长来信、FAQ、工具箱链接、留言评论、匿名提问等）
              均由站长个人或普通访客以个人身份创建，不代表学校官方意见。
            </li>
            <li>
              站长会尽力确保内容准确，但不保证信息的时效性、完整性与正确性。
              教务系统、选课、成绩、奖学金等政策以学校官方通知为准，
              本站内容仅供参考，不作为任何决策依据。
            </li>
            <li>
              访客提交的留言、提问、评论由提交者本人负责，与本站及站长无关。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium text-primary">外部链接</h2>
          <p className="mt-3 text-sm">
            工具箱、资源推荐等板块包含指向第三方网站的链接。
            这些链接仅为方便访客而提供，本站不对第三方网站的内容、准确性、合法性负责，
            也不构成对任何产品或服务的背书。访问第三方网站的风险由访客自行承担。
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-primary">知识产权</h2>
          <p className="mt-3 text-sm">
            本站原创内容（学长来信等）版权归站长本人所有。
            转载或引用请注明出处。站外链接所指向的内容版权归 respective
            所有者所有，本站不持有任何第三方内容的版权。
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-primary">联系方式</h2>
          <p className="mt-3 text-sm">
            如需就本站内容与站长联系，请通过{" "}
            <Link href="/about" className="text-primary underline-offset-4 hover:underline">
              关于我
            </Link>{" "}
            页面中的联系方式进行。
          </p>
        </section>
      </div>
    </div>
  );
}
