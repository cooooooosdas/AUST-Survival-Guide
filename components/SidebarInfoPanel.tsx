"use client";

import { useEffect, useMemo, useState } from "react";

/* ================================================================
   配置区 — 建站起始日期（可按需修改）
   ================================================================ */
const SITE_START_DATE = new Date("2025-09-01");
/* ================================================================ */

const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

const QUOTES = [
  /* ===== 中二热血（60 条）===== */
  "我命由我不由天。 —— 哪吒",
  "爆裂吧，现实！粉碎吧，精神！——《魔法少女小圆》",
  "弱小的人才害怕失败，而我从未成功过，又谈何失败？ —— 佚名",
  "站在最高处，俯瞰这个破碎的世界。 ——《罪恶王冠》",
  "就算是地狱，我也要闯给你看。 —— 佚名",
  "如果结果不如你所愿，那就在尘埃落定前奋力一搏。 —— 佚名",
  "纵有疾风起，人生不言弃。 ——《诗选》",
  "弱小与无知不是生存的障碍，傲慢才是。 —— 刘慈欣《三体》",
  "凡是到达了的地方，都属于昨天。 —— 汪国真",
  "星辰坠落之处，即是吾等前进之路。 —— 佚名",
  "我要成为海贼王的男人！ —— 路飞《海贼王》",
  "教练，我想打篮球。 —— 三井寿《灌篮高手》",
  "不相信自己的人，连努力的价值都没有。 —— 佚名",
  "能哭的地方只有厕所和爸爸的怀里。 —— 冈崎汐《Clannad》",
  "正因为生来什么都没有，因此我们能拥有一切。 —— 佚名",
  "奇迹不是免费的。 —— 佚名",
  "我站在这段路的尽头，回望那消逝在夕阳下的背影。 —— 佚名",
  "就算全世界都与我对抗，我也要为自己而战。 —— 佚名",
  "痛苦的时候，假装快乐是一种坚强。 —— 佚名",
  "我要用这双手，托住属于我的黎明。 —— 佚名",
  "世界这么大，人生这么长，总会有这么一个人，让你想要温柔地对待。 —— 佚名",
  "凡是过去，皆为序章。 —— 佚名",
  "我们一路奋战，不是为了改变世界，而是为了不让世界改变我们。 ——《熔炉》",
  "就算失败，我也想知道自己倒在距离终点多远的地方。 —— 佚名",
  "命运是大地，走到哪你都在命运中。 —— 佚名",
  "人不是什么时候都能活得光明正大，本想挺直胸膛往前走，却又不知在什么时候，沾上了一身的泥巴。 —— 佚名",
  "当你手中抓住一件东西不放时，你只能拥有这件东西。 —— 佚名",
  "时光总有一天会将我们拆散。 —— 佚名",
  "无法摆脱的是那纠缠的过去。 —— 佚名",
  "深渊之下，仍有星辰。 —— 佚名",
  "所谓强者，不是别人眼中的强者，而是自己心中的强者。 —— 佚名",
  "既然选择了远方，便只顾风雨兼程。 —— 汪国真",
  "即使翅膀折了，心也要飞翔。 —— 佚名",
  "燃烧吧，我的小宇宙！ —— 星矢《圣斗士星矢》",
  "集中一点，登峰造极。 —— 佚名",
  "我所认为的坚强，是从心酸里熬出来的。 —— 佚名",
  "真正的强大，不是不流泪，而是含泪奔跑。 —— 佚名",
  "当你凝视深渊时，深渊也在凝视你。 —— 尼采",
  "在绝望之中绽放的花，才叫真正的美。 —— 佚名",
  "黑夜给了我黑色的眼睛，我却用它寻找光明。 —— 顾城",
  "真正的勇气，是恐惧之后依然前行。 —— 佚名",
  "逆风的方向，更适合飞翔。 —— 佚名",
  "生活不止眼前的苟且，还有诗和远方。 —— 佚名",
  "你永远不知道，你的哪个决定，会改变你的一生。 —— 佚名",
  "世界以痛吻我，要我报之以歌。 —— 泰戈尔",
  "没有付出就没有收获，这道理很简单。 —— 佚名",
  "别低头，皇冠会掉；别流泪，坏人会笑。 —— 佚名",
  "活着本身就是一种战斗。 —— 佚名",
  "你的名字，是我写过最美的情书。 ——《你的名字》",
  "就算被夺走一切，我也要夺回来。 —— 佚名",
  "人类的赞歌就是勇气的赞歌。 ——《JOJO的奇妙冒险》",
  "你没有梦想，和咸鱼有什么区别？ ——《少林足球》",
  "真正重要的东西，用眼睛是看不见的。 —— 圣埃克苏佩里《小王子》",
  "我们总是在注意错过太多，却不注意自己拥有多少。 ——《未闻花名》",
  "就算折断骨头，我也要活到最后。 —— 佚名",
  "世界很吵，我只想要一个安静的角落。 —— 佚名",
  "希望是个好东西，也许是世间最好的东西。 ——《肖申克的救赎》",
  "不要因为走得太远，而忘记当初为什么出发。 —— 纪伯伦",
  "前进！前进！不择手段地前进！ —— 刘慈欣《三体》",
  "你所浪费的今天，是昨天死去的人奢望的明天。 —— 佚名",
  "世界上最稳定的关系，就是没有关系。 —— 佚名",
  "失败不是终点，放弃才是。 —— 佚名",
  "与其诅咒黑暗，不如点亮蜡烛。 —— 佚名",
  "梦想什么的，用语言表达不出来。 —— 佚名",
  "不为模糊不清的未来担忧，只为清清楚楚的现在努力。 —— 佚名",
  "这世上本没有路，走的人多了，也便成了路。 —— 鲁迅《故乡》",
  "愿中国青年都摆脱冷气，只是向上走。 —— 鲁迅《热风》",
  "真的猛士，敢于直面惨淡的人生。 —— 鲁迅《纪念刘和珍君》",
  "寄意寒星荃不察，我以我血荐轩辕。 —— 鲁迅《自题小像》",

  /* ===== 古文短句（50 条）===== */
  "路漫漫其修远兮，吾将上下而求索。 —— 屈原《离骚》",
  "长风破浪会有时，直挂云帆济沧海。 —— 李白《行路难》",
  "山重水复疑无路，柳暗花明又一村。 —— 陆游《游山西村》",
  "落霞与孤鹜齐飞，秋水共长天一色。 —— 王勃《滕王阁序》",
  "人生如逆旅，我亦是行人。 —— 苏轼《临江仙》",
  "纵有千古，横有八荒，前途似海，来日方长。 —— 梁启超《少年中国说》",
  "追风赶月莫停留，平芜尽处是春山。 —— 佚名（宋·欧阳詹《赋得秋江晚渡》化用）",
  "须知少时凌云志，曾许人间第一流。 —— 吴庆坻《题三十小像》",
  "浮云一别后，流水十年间。 —— 韦应物《淮上喜会梁川故人》",
  "玻璃晴朗，橘子辉煌。 —— 北岛《过节》",
  "天生我材必有用，千金散尽还复来。 —— 李白《将进酒》",
  "海内存知己，天涯若比邻。 —— 王勃《送杜少府之任蜀州》",
  "会当凌绝顶，一览众山小。 —— 杜甫《望岳》",
  "宝剑锋从磨砺出，梅花香自苦寒来。 ——《警世贤文》",
  "书山有路勤为径，学海无涯苦作舟。 —— 韩愈",
  "三人行，必有我师焉。 —— 孔子《论语》",
  "己所不欲，勿施于人。 —— 孔子《论语》",
  "穷则独善其身，达则兼善天下。 —— 孟子",
  "天行健，君子以自强不息。 ——《周易》",
  "地势坤，君子以厚德载物。 ——《周易》",
  "博学之，审问之，慎思之，明辨之，笃行之。 ——《中庸》",
  "工欲善其事，必先利其器。 —— 孔子《论语》",
  "温故而知新，可以为师矣。 —— 孔子《论语》",
  "学而不思则罔，思而不学则殆。 —— 孔子《论语》",
  "青，取之于蓝，而青于蓝。 —— 荀子《劝学》",
  "锲而不舍，金石可镂。 —— 荀子《劝学》",
  "不积跬步，无以至千里；不积小流，无以成江海。 —— 荀子《劝学》",
  "落红不是无情物，化作春泥更护花。 —— 龚自珍《己亥杂诗》",
  "千磨万击还坚劲，任尔东西南北风。 —— 郑燮《竹石》",
  "不要人夸好颜色，只留清气满乾坤。 —— 王冕《墨梅》",
  "粉身碎骨浑不怕，要留清白在人间。 —— 于谦《石灰吟》",
  "沉舟侧畔千帆过，病树前头万木春。 —— 刘禹锡《酬乐天扬州初逢席上见赠》",
  "纸上得来终觉浅，绝知此事要躬行。 —— 陆游《冬夜读书示子聿》",
  "僵卧孤村不自哀，尚思为国戍轮台。 —— 陆游《十一月四日风雨大作》",
  "先天下之忧而忧，后天下之乐而乐。 —— 范仲淹《岳阳楼记》",
  "不以物喜，不以己悲。 —— 范仲淹《岳阳楼记》",
  "出师未捷身先死，长使英雄泪满襟。 —— 杜甫《蜀相》",
  "感时花溅泪，恨别鸟惊心。 —— 杜甫《春望》",
  "同是天涯沦落人，相逢何必曾相识。 —— 白居易《琵琶行》",
  "在天愿作比翼鸟，在地愿为连理枝。 —— 白居易《长恨歌》",
  "此情可待成追忆，只是当时已惘然。 —— 李商隐《锦瑟》",
  "春蚕到死丝方尽，蜡炬成灰泪始干。 —— 李商隐《无题》",
  "身无彩凤双飞翼，心有灵犀一点通。 —— 李商隐《无题》",
  "夕阳无限好，只是近黄昏。 —— 李商隐《登乐游原》",
  "衣带渐宽终不悔，为伊消得人憔悴。 —— 柳永《蝶恋花》",
  "人生自古谁无死，留取丹心照汗青。 —— 文天祥《过零丁洋》",
  "采菊东篱下，悠然见南山。 —— 陶渊明《饮酒·其五》",
  "问渠那得清如许？为有源头活水来。 —— 朱熹《观书有感》",
  "等闲识得东风面，万紫千红总是春。 —— 朱熹《春日》",
  "不畏浮云遮望眼，自缘身在最高层。 —— 王安石《登飞来峰》",
  "但愿人长久，千里共婵娟。 —— 苏轼《水调歌头·明月几时有》",
  "大江东去，浪淘尽，千古风流人物。 —— 苏轼《念奴娇·赤壁怀古》",
  "十年生死两茫茫，不思量，自难忘。 —— 苏轼《江城子·乙卯正月二十日夜记梦》",
  "世事一场大梦，人生几度秋凉。 —— 苏轼《西江月·世事一场大梦》",
  "且将新火试新茶，诗酒趁年华。 —— 苏轼《望江南·超然台作》",
];

/* ---------- 小图标（二次元线稿风，14px 统一描边） ---------- */
const ICONS: Record<string, React.ReactNode> = {
  days: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="14" height="12" rx="2" />
      <line x1="1" y1="6" x2="15" y2="6" />
      <line x1="5" y1="1" x2="5" y2="4" />
      <line x1="11" y1="1" x2="11" y2="4" />
    </svg>
  ),
  words: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 1L15 5L5 15L1 14L11 1Z" />
      <polyline points="9 3 13 7" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5" />
      <polyline points="8 4.5 8 8 10.5 10" />
    </svg>
  ),
  visits: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8C3 4 5 2 8 2s5 2 7 6-2 4-5 6-5 2-8 6" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  ),
  uptime: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 1 2 9 9 9 7 15 14 7 9 7 11 1" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2H14V11C14 12 13 13 12 13H5L2 15V2Z" />
      <line x1="6" y1="5.5" x2="10" y2="5.5" />
      <line x1="6" y1="8.5" x2="9" y2="8.5" />
    </svg>
  ),
};

/* ---------- 条目渐变配色 ---------- */
const ITEM_GRADIENTS: Record<string, string> = {
  days: "from-primary-light/80 to-primary/5",
  words: "from-accent-light/80 to-accent/5",
  clock: "from-secondary-light/80 to-secondary/5",
  visits: "from-primary-light/60 to-accent-light/40",
  uptime: "from-secondary-light/60 to-primary-light/40",
  quote: "from-accent-light/60 to-secondary-light/40",
};

const ITEM_LABEL_COLORS: Record<string, string> = {
  days: "text-primary",
  words: "text-accent-hover",
  clock: "text-secondary-hover",
  visits: "text-primary",
  uptime: "text-secondary",
  quote: "text-accent-hover",
};

/* ---------- 工具函数 ---------- */
function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = [];
  if (d > 0) parts.push(`${d} 天`);
  if (h > 0 || d > 0) parts.push(`${h} 时`);
  if (m > 0 || h > 0 || d > 0) parts.push(`${m} 分`);
  parts.push(`${sec} 秒`);
  return parts.join(" ");
}

function loadVisits(): { today: number; total: number } {
  try {
    const raw = localStorage.getItem("aust_visits");
    if (!raw) return { today: 0, total: 0 };
    const v = JSON.parse(raw);
    const today = new Date().toDateString();
    if (v.date !== today) {
      return { today: 0, total: v.total ?? 0 };
    }
    return { today: v.today ?? 0, total: v.total ?? 0 };
  } catch {
    return { today: 0, total: 0 };
  }
}

function saveVisits(v: { today: number; total: number }) {
  try {
    localStorage.setItem("aust_visits", JSON.stringify({ ...v, date: new Date().toDateString() }));
  } catch {
    // quota exceeded — ignore
  }
}

/* ---------- 主组件 ---------- */
export default function SidebarInfoPanel() {
  const [now, setNow] = useState(() => new Date());
  const sessionStart = useMemo(() => Date.now(), []);
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [visits, setVisits] = useState<{ today: number; total: number }>({ today: 0, total: 0 });
  const [quote, setQuote] = useState("");

  // 时钟 & 运行时长：每秒刷新
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // 访问量（只跑一次）
  useEffect(() => {
    const current = loadVisits();
    const next = { today: current.today + 1, total: current.total + 1 };
    saveVisits(next);
    setVisits(next);
  }, []);

  // 字数（拉一次接口）
  useEffect(() => {
    fetch("/api/stats/word-count", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.resolve({ count: 0 })))
      .then((d) => setWordCount(d.count))
      .catch(() => {});
  }, []);

  // 一言（刷新随机）
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // 建站天数（随时间自然增长）
  const siteDays = useMemo(
    () => Math.floor((now.getTime() - SITE_START_DATE.getTime()) / 86400000),
    [now]
  );
  const sessionUptime = useMemo(() => formatDuration(Date.now() - sessionStart), [now]);

  const dateLine = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${WEEKDAYS[now.getDay()]}`;
  const timeLine = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  /* ---------- 条目 ---------- */
  type Item = {
    key: string;
    label: string;
    primary: React.ReactNode;
    secondary?: React.ReactNode;
  };

  const items: Item[] = [
    {
      key: "days",
      label: "建站运行天数",
      primary: <>{siteDays.toLocaleString("zh-CN")} <span className="text-xs font-normal opacity-80">天</span></>,
    },
    {
      key: "words",
      label: "全站文章总字数",
      primary: <>{wordCount !== null ? wordCount.toLocaleString("zh-CN") : "..."} <span className="text-xs font-normal opacity-80">字</span></>,
    },
    {
      key: "clock",
      label: "电子时钟",
      primary: <span className="tabular-nums">{timeLine}</span>,
      secondary: <span className="text-[11px]">{dateLine}</span>,
    },
    {
      key: "visits",
      label: "访问统计",
      primary: <>{visits.total.toLocaleString("zh-CN")} <span className="text-xs font-normal opacity-70">累计</span></>,
      secondary: <>{visits.today} 次今日浏览</>,
    },
    {
      key: "uptime",
      label: "本次停留时长",
      primary: <span className="text-sm">{sessionUptime}</span>,
    },
    {
      key: "quote",
      label: "一言",
      primary: <span className="text-sm italic">"{quote}"</span>,
    },
  ];

  return (
    <div className="mt-6">
      <p className="mb-3 text-xs font-medium tracking-widest text-muted uppercase">
        站点信息
      </p>

      <ul className="space-y-2.5">
        {items.map((item) => {
          const grad = ITEM_GRADIENTS[item.key];
          const labelColor = ITEM_LABEL_COLORS[item.key];
          return (
            <li
              key={item.key}
              className={`rounded-xl bg-gradient-to-br ${grad} px-3.5 py-3`}
            >
              <div className="flex items-center gap-2">
                <span className={`opacity-75 ${labelColor}`}>{ICONS[item.key]}</span>
                <span className="text-[11px] font-medium tracking-wide text-muted">
                  {item.label}
                </span>
              </div>
              <p className={`mt-1.5 text-base font-semibold leading-snug ${labelColor}`}>
                {item.primary}
              </p>
              {item.secondary && (
                <p className="mt-0.5 text-[11px] text-muted/80">{item.secondary}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
