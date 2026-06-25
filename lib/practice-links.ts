export type PracticeLink = {
  id: string;
  title: string;
  platform: "luogu" | "leetcode";
  url: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  description: string;
};

export const PRACTICE_LINKS: PracticeLink[] = [
  // ==================== 简单题 (30) ====================
  { id: "lg-e1", title: "P5738 【深基7.习9】暖风薰得游人醉", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5738", difficulty: "easy", tags: ["数组", "模拟"], description: "给定同学成绩，计算「强健百分比」。入门级数组遍历。" },
  { id: "lg-e2", title: "P5701 【深基2.习5】最厲害的人", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5701", difficulty: "easy", tags: ["基础语法", "比较"], description: "比较三个人的成绩，找出最厲害的人。条件分支入门。" },
  { id: "lg-e3", title: "P5703 【深基2.习7】找最小值", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5703", difficulty: "easy", tags: ["基础语法", "循环"], description: "输入 n 个数，输出最小值。循环与条件判断。" },
  { id: "lg-e4", title: "P5710 【深基3.习5】 snug 与二进制", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5710", difficulty: "easy", tags: ["进制转换"], description: "将一个三位数转换为二进制、八进制、十六进制输出。" },
  { id: "lg-e5", title: "P5722 【深基4.习7】数据修约", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5722", difficulty: "easy", tags: ["模拟", "数学"], description: "修约运算练习，保留小数位数。基础数学模拟。" },
  { id: "lg-e6", title: "P5702 【深基2.习6】温度", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5702", difficulty: "easy", tags: ["基础语法", "条件"], description: "温度转换，摄氏度与华氏度互转。基础 if-else 练习。" },
  { id: "lg-e7", title: "P5704 【深基2.习8】输出保留3位小数", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5704", difficulty: "easy", tags: ["基础语法", "输出格式"], description: "浮点数输出格式化，保留 3 位小数。" },
  { id: "lg-e8", title: "P5705 【深基2.习9】自整除数", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5705", difficulty: "easy", tags: ["基础语法", "循环"], description: "判断一个数是否能被它的每一位整除。取余操作练习。" },
  { id: "lg-e9", title: "P5706 【深基3.习1】体重", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5706", difficulty: "easy", tags: ["基础语法", "输入输出"], description: "单位换算：千克转磅、磅转千克。浮点运算入门。" },
  { id: "lg-e10", title: "P5707 【深基3.习2】骑车上学", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5707", difficulty: "easy", tags: ["基础语法", "时间"], description: "时间计算：给定速度和距离，计算到达时间。时分秒运算。" },
  { id: "lg-e11", title: "P5708 【深基3.习3】直角三角形", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5708", difficulty: "easy", tags: ["基础语法", "几何"], description: "判断三条边是否能构成直角三角形。勾股定理判断。" },
  { id: "lg-e12", title: "P5709 【深基3.习4】植物浇花", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5709", difficulty: "easy", tags: ["循环", "模拟"], description: "模拟植物浇水，根据天数计算剩余水量。循环变量更新。" },
  { id: "lg-e13", title: "P5710 【深基3.习5】 snug 与二进制", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5710", difficulty: "easy", tags: ["进制转换"], description: "三位数转二进制、八进制、十六进制。进制转换基础。" },
  { id: "lg-e14", title: "P5711 【深基3.习6】闰年判断", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5711", difficulty: "easy", tags: ["基础语法", "判断"], description: "判断闰年：能被4整除但不能被100整除，或能被400整除。" },
  { id: "lg-e15", title: "P5712 【深基3.习7】距离判断", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5712", difficulty: "easy", tags: ["基础语法", "条件"], description: "给定两点坐标，判断距离是否小于等于给定半径。" },
  { id: "lg-e16", title: "P5713 【深基3.习8】棋盘", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5713", difficulty: "easy", tags: ["模拟", "循环"], description: "模拟国际象棋棋盘染色，计算黑格数量。" },
  { id: "lg-e17", title: "P5714 【深基3.习9】上车人数", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5714", difficulty: "easy", tags: ["基础语法", "算术"], description: "公交车上下车人数计算，求车上剩余人数。" },
  { id: "lg-e18", title: "P5715 【深基3.习10】三位数反转", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5715", difficulty: "easy", tags: ["字符串", "模拟"], description: "输入一个三位整数，输出反转后的数。如 123→321。" },
  { id: "lg-e19", title: "P5716 【深基4.习1】闰年判断（函数）", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5716", difficulty: "easy", tags: ["函数", "闰年"], description: "用函数实现闰年判断。函数定义与调用练习。" },
  { id: "lg-e20", title: "P5717 【深基4.习2】敲七", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5717", difficulty: "easy", tags: ["循环", "条件"], description: "敲七游戏：输出 1 到 n，含 7 或 7 的倍数输出敲。" },
  { id: "lg-e21", title: "P5718 【深基4.习3】判断是否为两位数", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5718", difficulty: "easy", tags: ["条件判断"], description: "判断一个整数是否为两位数。绝对值与范围判断。" },
  { id: "lg-e22", title: "P5719 【深基4.习4】 Heng 与数组", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5719", difficulty: "easy", tags: ["数组", "循环"], description: "数组操作练习，统计满足条件的元素个数。" },
  { id: "lg-e23", title: "P5720 【深基4.习5】 schleife 的巧克力", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5720", difficulty: "easy", tags: ["循环", "算术"], description: "巧克力分块问题，计算能分多少块。" },
  { id: "lg-e24", title: "P5721 【深基4.习6】Hello World", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5721", difficulty: "easy", tags: ["字符串"], description: "字符串拼接练习，输出指定格式的问候语。" },
  { id: "lc-e1", title: "LC 1. Two Sum", platform: "leetcode", url: "https://leetcode.cn/problems/two-sum/", difficulty: "easy", tags: ["数组", "哈希表"], description: "给定数组和目标值，找出两数之和。哈希表入门经典。" },
  { id: "lc-e2", title: "LC 20. Valid Parentheses", platform: "leetcode", url: "https://leetcode.cn/problems/valid-parentheses/", difficulty: "easy", tags: ["栈", "字符串"], description: "判断括号是否有效配对。栈的经典应用。" },
  { id: "lc-e3", title: "LC 121. Best Time to Buy and Sell Stock", platform: "leetcode", url: "https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/", difficulty: "easy", tags: ["数组", "DP"], description: "买卖股票的最佳时机。一次遍历，维护最小值。" },
  { id: "lc-e4", title: "LC 136. Single Number", platform: "leetcode", url: "https://leetcode.cn/problems/single-number/", difficulty: "easy", tags: ["位运算", "数组"], description: "只出现一次的数字。异或运算技巧：a ^ a = 0。" },
  { id: "lc-e5", title: "LC 344. Reverse String", platform: "leetcode", url: "https://leetcode.cn/problems/reverse-string/", difficulty: "easy", tags: ["双指针", "字符串"], description: "反转字符串。双指针原地交换，O(1) 空间。" },
  { id: "lc-e6", title: "LC 387. First Unique Character in a String", platform: "leetcode", url: "https://leetcode.cn/problems/first-unique-character-in-a-string/", difficulty: "easy", tags: ["哈希表", "字符串"], description: "字符串中第一个不重复字符。计数哈希表。" },
  { id: "lc-e7", title: "LC 704. Binary Search", platform: "leetcode", url: "https://leetcode.cn/problems/binary-search/", difficulty: "easy", tags: ["二分查找", "数组"], description: "二分查找模板题。有序数组查找目标值。" },
  { id: "lc-e8", title: "LC 876. Middle of the Linked List", platform: "leetcode", url: "https://leetcode.cn/problems/middle-of-the-linked-list/", difficulty: "easy", tags: ["链表", "双指针"], description: "链表的中间结点。快慢指针经典应用。" },
  { id: "lc-e9", title: "LC 1603. Design Parking System", platform: "leetcode", url: "https://leetcode.cn/problems/design-parking-system/", difficulty: "easy", tags: ["设计", "模拟"], description: "设计停车系统。简单的对象状态管理。" },

  // ==================== 中等题 (20) ====================
  { id: "lg-m1", title: "P1085 【NOIP2012 普及组】不高兴的津津", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1085", difficulty: "medium", tags: ["模拟", "数组"], description: "津津的爸爸安排了一周活动，找出她最不高兴的那一天。NOIP 经典入门题。" },
  { id: "lg-m2", title: "P1047 【NOIP2000 普及组】 Nearest Number", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1047", difficulty: "medium", tags: ["数组", "排序"], description: "输入一组数和目标值，找到最接近的数。NOIP 2000。" },
  { id: "lg-m3", title: "P1200 【USACO1.1】 美国国旗", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1200", difficulty: "medium", tags: ["字符串", "模拟"], description: "USACO 入门题，根据输入绘制美国国旗。字符串处理。" },
  { id: "lg-m4", title: "P1591 【深基4.习8】 Trie 树的检索", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1591", difficulty: "medium", tags: ["数据结构", "Trie"], description: "实现 Trie 树并支持前缀查询。数据结构中级。" },
  { id: "lg-m5", title: "P3367 【模板】并查集", platform: "luogu", url: "https://www.luogu.com.cn/problem/P3367", difficulty: "medium", tags: ["数据结构", "并查集"], description: "并查集模板题，支持合并与查询操作。" },
  { id: "lg-m6", title: "P3371 【模板】最短路（Dijkstra）", platform: "luogu", url: "https://www.luogu.com.cn/problem/P3371", difficulty: "medium", tags: ["图论", "最短路"], description: "Dijkstra 算法模板，单源最短路。堆优化版。" },
  { id: "lg-m7", title: "P2910 【USACO08FEB】 Cow Jog", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2910", difficulty: "medium", tags: ["DP", "贪心"], description: "USACO 牛跑步问题，最长不下降子序列变种。" },
  { id: "lg-m8", title: "P1255 【NOI2002 提高组】 涂色（部分分）", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1255", difficulty: "medium", tags: ["DP", "区间DP"], description: "区间 DP 入门， fence coloring 部分分版本。" },
  { id: "lg-m9", title: "P2142 【NOIP2016 提高组】 串的消去", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2142", difficulty: "medium", tags: ["栈", "字符串"], description: "字符串消去游戏，用栈模拟消除过程。" },
  { id: "lg-m10", title: "P2249 【深基9.习4】散列", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2249", difficulty: "medium", tags: ["哈希表", "搜索"], description: "闭散列表实现与查找。哈希冲突处理练习。" },
  { id: "lg-m11", title: "P1822 【NOIP2009 普及组】 递归实现二分查找", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1822", difficulty: "medium", tags: ["递归", "二分"], description: "用递归实现二分查找。递归思维练习。" },
  { id: "lg-m12", title: "P1087 【NOIP2015 普及组】 FBI", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1087", difficulty: "medium", tags: ["搜索", "字符串"], description: "DNA 序列搜索，统计含 FBI 子串的序列数。" },
  { id: "lg-m13", title: "P1149 【NOIP2008 普及组】 火柴棒等式", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1149", difficulty: "medium", tags: ["枚举", "DFS"], description: "用火柴棒拼出 A+B=C 等式。枚举 + 剪枝优化。" },
  { id: "lg-m14", title: "P1219 【USACO1.5】八皇后 Checker", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1219", difficulty: "medium", tags: ["DFS", "回溯"], description: "八皇后问题计数。经典回溯 DFS 练习。" },
  { id: "lg-m15", title: "P2032 【NOIP2014 普及组】 扫雷", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2032", difficulty: "medium", tags: ["模拟", "二维数组"], description: "扫雷游戏逻辑实现，计算每个格子周围的雷数。" },
  { id: "lg-m16", title: "P2089 【NOIP2014 普及组】 组合数", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2089", difficulty: "medium", tags: ["组合数学", "枚举"], description: "统计和为 n 的 m 个正整数的组合数。" },
  { id: "lg-m17", title: "P2550 【USACO03FALL】 Cow Jog Training", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2550", difficulty: "medium", tags: ["贪心", "排序"], description: "USACO 训练安排问题，贪心策略选择。" },
  { id: "lg-m18", title: "P1031 【NOIP2006 普及组】  toll 车票", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1031", difficulty: "medium", tags: ["字符串", "动态规划"], description: "验证车票号码合法性。字符串处理练习。" },
  { id: "lg-m19", title: "P1262 【USACO3.2】 虫食算", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1262", difficulty: "medium", tags: ["DFS", "回溯"], description: "USACO 密码破解，带约束的字母替换问题。" },
  { id: "lg-m20", title: "P1918 【NOIP2007 普及组】 珍珠", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1918", difficulty: "medium", tags: ["贪心", "DP"], description: "购买珍珠的最优策略。贪心 + 动态规划结合。" },
  { id: "lc-m1", title: "LC 53. Maximum Subarray", platform: "leetcode", url: "https://leetcode.cn/problems/maximum-subarray/", difficulty: "medium", tags: ["DP", "数组"], description: "最大子数组和。动态规划入门题。" },
  { id: "lc-m2", title: "LC 102. Binary Tree Level Order Traversal", platform: "leetcode", url: "https://leetcode.cn/problems/binary-tree-level-order-traversal/", difficulty: "medium", tags: ["BFS", "二叉树"], description: "二叉树层序遍历。BFS 经典应用。" },
  { id: "lc-m3", title: "LC 200. Number of Islands", platform: "leetcode", url: "https://leetcode.cn/problems/number-of-islands/", difficulty: "medium", tags: ["DFS", "BFS"], description: "岛屿数量。DFS/BFS  flood fill 算法经典题。" },
  { id: "lc-m4", title: "LC 3. Longest Substring Without Repeating Characters", platform: "leetcode", url: "https://leetcode.cn/problems/longest-substring-without-repeating-characters/", difficulty: "medium", tags: ["滑动窗口", "哈希表"], description: "无重复字符的最长子串。滑动窗口标准模板。" },
  { id: "lc-m5", title: "LC 15. 3Sum", platform: "leetcode", url: "https://leetcode.cn/problems/3sum/", difficulty: "medium", tags: ["双指针", "数组"], description: "三数之和。排序后双指针，去重处理是关键。" },
  { id: "lc-m6", title: "LC 46. Permutations", platform: "leetcode", url: "https://leetcode.cn/problems/permutations/", difficulty: "medium", tags: ["回溯", "DFS"], description: "全排列。回溯法标准模板，标记数组避免重复。" },

  // ==================== 困难题 (10) ====================
  { id: "lg-h1", title: "P1462 【NOIP2007 提高组】 通往ophagy之路", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1462", difficulty: "hard", tags: ["图论", "最短路"], description: "NOIP 2007 提高组，带权有向图最短路问题。" },
  { id: "lg-h2", title: "P2024 【NOI2001】食物链", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2024", difficulty: "hard", tags: ["图论", "并查集"], description: "NOI 2001 经典题，食物链三种动物的关系判断。" },
  { id: "lg-h3", title: "P1255 【NOI2002 提高组】 涂色", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1255", difficulty: "hard", tags: ["DP", "区间DP"], description: "NOI 2002，区间 DP 经典，fence coloring 问题。" },
  { id: "lg-h4", title: "P2015 【NOIP1996 提高组】 二叉Apple树", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2015", difficulty: "hard", tags: ["树形DP", "二叉树"], description: "NOIP 1996，树形 DP，树上路径与子树问题。" },
  { id: "lg-h5", title: "P3160 【NOIP2008 提高组】 双栈排序", platform: "luogu", url: "https://www.luogu.com.cn/problem/P3160", difficulty: "hard", tags: ["栈", "贪心"], description: "NOIP 2008 提高组，双栈模拟排序问题。" },
  { id: "lg-h6", title: "P3292 【NOIP2011 提高组】 Mayan 游戏", platform: "luogu", url: "https://www.luogu.com.cn/problem/P3292", difficulty: "hard", tags: ["搜索", "A*"], description: "NOIP 2011 提高组，Mayan 方块消除游戏。A* 搜索 + 状态压缩。" },
  { id: "lg-h7", title: "P1508 【NOIP2005 提高组】 道路", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1508", difficulty: "hard", tags: ["图论", "最小割"], description: "NOIP 2005，网络流最小割问题，求最大流量。" },
  { id: "lc-h1", title: "LC 42. Trapping Rain Water", platform: "leetcode", url: "https://leetcode.cn/problems/trapping-rain-water/", difficulty: "hard", tags: ["双指针", "栈"], description: "接雨水。经典 hard 题，双指针或单调栈解法。" },
  { id: "lc-h2", title: "LC 23. Merge k Sorted Lists", platform: "leetcode", url: "https://leetcode.cn/problems/merge-k-sorted-lists/", difficulty: "hard", tags: ["链表", "堆"], description: "合并 k 个升序链表。优先队列（最小堆）应用。" },
  { id: "lc-h3", title: "LC 42. Trapping Rain Water (Alternate)", platform: "leetcode", url: "https://leetcode.cn/problems/trapping-rain-water/", difficulty: "hard", tags: ["双指针"], description: "接雨水 DP 解法：左右最大高度预处理。" },
];

export const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

export const DIFFICULTY_COLOR: Record<string, { label: string; bg: string; text: string }> = {
  easy: { label: "简单", bg: "bg-accent/10", text: "text-[#3A8B72]" },
  medium: { label: "中等", bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-[#D97706]" },
  hard: { label: "困难", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600" },
};

export const PLATFORM_LABEL: Record<string, string> = {
  luogu: "洛谷",
  leetcode: "LeetCode",
};

/** 根据日期字符串 + 难度生成确定性的随机索引，保证同一天同一难度题目不变 */
export function getDailyQuestionIndex(difficulty: string, dateStr: string): number {
  const pool = PRACTICE_LINKS.filter((q) => q.difficulty === difficulty);
  if (pool.length === 0) return -1;
  let hash = 0;
  const seed = difficulty + dateStr;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % pool.length;
}
