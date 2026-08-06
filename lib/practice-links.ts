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
  // ==================== 简单题 ====================
  { id: "lg-e1", title: "P5738 【深基7.例4】歌唱比赛", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5738", difficulty: "easy", tags: ["数组", "极值"], description: "n 名同学 m 个评委打分，去掉最高最低分求平均，输出最高分。数组极值入门。" },
  { id: "lg-e2", title: "P5703 【深基2.例5】苹果采购", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5703", difficulty: "easy", tags: ["输入输出", "乘法"], description: "已知同学数和每人分到的苹果数，求需采购多少苹果。最基础的输入输出乘法。" },
  { id: "lg-e3", title: "P5704 【深基2.例6】字母转换", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5704", difficulty: "easy", tags: ["字符串", "ASCII"], description: "输入一个小写字母，输出对应大写字母。ASCII 码转换入门。" },
  { id: "lg-e4", title: "P5705 【深基2.例7】数字反转", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5705", difficulty: "easy", tags: ["字符串", "浮点"], description: "输入一个带一位小数的浮点数（如 123.4），翻转成 4.321 输出。字符串处理练习。" },
  { id: "lg-e5", title: "P5706 【深基2.例8】再分肥宅水", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5706", difficulty: "easy", tags: ["数学", "除法"], description: "t 毫升饮料均分给 n 名同学，每人 2 个杯子，求每份毫升数和总杯数。除法练习。" },
  { id: "lg-e6", title: "P5707 【深基2.例12】上学迟到", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5707", difficulty: "easy", tags: ["数学", "时间"], description: "已知距离 s 和速度 v，还要花 10 分钟垃圾分类，求不迟到的最晚出门时间。时间计算。" },
  { id: "lg-e7", title: "P5708 【深基2.习2】三角形面积", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5708", difficulty: "easy", tags: ["数学", "海伦公式"], description: "给定三角形三边 a,b,c，用海伦公式求面积，保留 1 位小数。" },
  { id: "lg-e8", title: "P5709 【深基2.习6】Apples Prologue / 苹果和虫子", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5709", difficulty: "easy", tags: ["数学", "除法取整"], description: "m 个苹果每个吃 t 分钟，s 分钟后还剩几个完整苹果。除法取整练习。" },
  { id: "lg-e9", title: "P5710 【深基3.例2】数的性质", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5710", difficulty: "easy", tags: ["分支", "逻辑"], description: "判断整数 x 是否满足偶数、大于 4 且不大于 12 等组合性质。逻辑条件练习。" },
  { id: "lg-e10", title: "P5711 【深基3.例3】闰年判断", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5711", difficulty: "easy", tags: ["分支", "闰年"], description: "输入年份判断是否闰年（4 的倍数且非 100 倍数，或 400 的倍数）。" },
  { id: "lg-e11", title: "P5712 【深基3.例4】Apples", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5712", difficulty: "easy", tags: ["分支", "输出格式"], description: "吃了 x 个苹果，输出 Today, I ate x apple(s). 注意单复数 s。输出格式练习。" },
  { id: "lg-e12", title: "P5713 【深基3.例5】洛谷团队系统", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5713", difficulty: "easy", tags: ["分支", "比较"], description: "本地每题 5 分钟 vs 洛谷团队每题 3 分钟+11 分钟建团，n 题比哪个快。" },
  { id: "lg-e13", title: "P5714 【深基3.例7】肥胖问题", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5714", difficulty: "easy", tags: ["数学", "BMI"], description: "给体重 m 千克和身高 h 米，算 BMI 判断体型。浮点计算与分支。" },
  { id: "lg-e14", title: "P5715 【深基3.例8】三位数排序", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5715", difficulty: "easy", tags: ["排序"], description: "给三个整数，从小到大排序输出。排序入门。" },
  { id: "lg-e15", title: "P5716 【深基3.例9】月份天数", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5716", difficulty: "easy", tags: ["分支", "闰年"], description: "输入年份和月份，输出这个月有多少天，需考虑闰年。" },
  { id: "lg-e16", title: "P5717 【深基3.习8】三角形分类", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5717", difficulty: "easy", tags: ["分支", "几何"], description: "给三条线段，判断能否组成三角形及形状（直角/锐角/钝角/等腰/等边）。" },
  { id: "lg-e17", title: "P5718 【深基4.例2】找最小值", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5718", difficulty: "easy", tags: ["循环", "数组"], description: "给 n 个整数，找出最小值。循环遍历入门。" },
  { id: "lg-e18", title: "P5719 【深基4.例3】分类平均", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5719", difficulty: "easy", tags: ["循环", "数学"], description: "1 到 n 中能被 k 整除为 A 类否则 B 类，分别求平均，保留 1 位小数。" },
  { id: "lg-e19", title: "P5720 【深基4.例4】一尺之棰", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5720", difficulty: "easy", tags: ["循环", "除法"], description: "长度 a 的木棍每天锯掉一半（向下取整），第几天变为 1。" },
  { id: "lg-e20", title: "P5721 【深基4.例6】数字直角三角形", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5721", difficulty: "easy", tags: ["嵌套循环", "输出格式"], description: "输出直角边长 n 的数字直角三角形，数字均为 2 位（补前导 0）。嵌套循环。" },
  { id: "lc-e1", title: "LC 1. Two Sum", platform: "leetcode", url: "https://leetcode.cn/problems/two-sum/", difficulty: "easy", tags: ["数组", "哈希表"], description: "给定数组和目标值，找出两数之和。哈希表入门经典。" },
  { id: "lc-e2", title: "LC 20. Valid Parentheses", platform: "leetcode", url: "https://leetcode.cn/problems/valid-parentheses/", difficulty: "easy", tags: ["栈", "字符串"], description: "判断括号是否有效配对。栈的经典应用。" },
  { id: "lc-e3", title: "LC 121. Best Time to Buy and Sell Stock", platform: "leetcode", url: "https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/", difficulty: "easy", tags: ["数组", "DP"], description: "买卖股票的最佳时机。一次遍历，维护最小值。" },
  { id: "lc-e4", title: "LC 136. Single Number", platform: "leetcode", url: "https://leetcode.cn/problems/single-number/", difficulty: "easy", tags: ["位运算", "数组"], description: "只出现一次的数字。异或运算技巧：a ^ a = 0。" },
  { id: "lc-e5", title: "LC 344. Reverse String", platform: "leetcode", url: "https://leetcode.cn/problems/reverse-string/", difficulty: "easy", tags: ["双指针", "字符串"], description: "反转字符串。双指针原地交换，O(1) 空间。" },
  { id: "lc-e6", title: "LC 387. First Unique Character in a String", platform: "leetcode", url: "https://leetcode.cn/problems/first-unique-character-in-a-string/", difficulty: "easy", tags: ["哈希表", "字符串"], description: "字符串中第一个不重复字符。计数哈希表。" },
  { id: "lc-e7", title: "LC 704. Binary Search", platform: "leetcode", url: "https://leetcode.cn/problems/binary-search/", difficulty: "easy", tags: ["二分查找", "数组"], description: "二分查找模板题。有序数组查找目标值。" },
  { id: "lc-e8", title: "LC 876. Middle of the Linked List", platform: "leetcode", url: "https://leetcode.cn/problems/middle-of-the-linked-list/", difficulty: "easy", tags: ["链表", "双指针"], description: "链表的中间结点。快慢指针经典应用。" },
  { id: "lc-e9", title: "LC 1603. Design Parking System", platform: "leetcode", url: "https://leetcode.cn/problems/design-parking-system/", difficulty: "easy", tags: ["设计", "模拟"], description: "设计停车系统。简单的对象状态管理。" },

  // ==================== 中等题 ====================
  { id: "lg-m1", title: "P1047 [NOIP 2005 普及组] 校门外的树", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1047", difficulty: "medium", tags: ["差分", "区间标记", "NOIP"], description: "马路上 l+1 棵树，多个区域砍树，求剩下多少棵。差分/区间标记经典。" },
  { id: "lg-m2", title: "P1085 [NOIP 2004 普及组] 不高兴的津津", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1085", difficulty: "medium", tags: ["模拟", "NOIP"], description: "津津每天上课超 8 小时就不高兴，找一周最不高兴的一天。模拟入门。" },
  { id: "lg-m3", title: "P1087 [NOIP 2004 普及组] FBI 树", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1087", difficulty: "medium", tags: ["递归", "二叉树", "NOIP"], description: "由 01 串递归构造 FBI 树（B/I/F 三类结点），后序遍历输出。" },
  { id: "lg-m4", title: "P1149 [NOIP 2008 提高组] 火柴棒等式", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1149", difficulty: "medium", tags: ["枚举", "NOIP"], description: "n 根火柴拼 A+B=C 等式，求能拼出多少个不同等式。枚举。" },
  { id: "lg-m5", title: "P1219 [USACO1.5] 八皇后 Checker Challenge", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1219", difficulty: "medium", tags: ["回溯", "DFS", "USACO"], description: "棋盘放棋子使每行每列每对角线至多一个，输出前 3 个解及总数。回溯经典。" },
  { id: "lg-m6", title: "P1200 [USACO1.1] 你的飞碟在这儿 Your Ride Is Here", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1200", difficulty: "medium", tags: ["字符串", "模拟", "USACO"], description: "把彗星名和队伍名字母乘积对 47 取模，相等则 GO 否则 STAY。USACO 入门。" },
  { id: "lg-m7", title: "P2089 烤鸡", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2089", difficulty: "medium", tags: ["暴力枚举"], description: "10 种配料各放 1~3 克，给定美味度 n，输出所有搭配方案。暴力枚举。" },
  { id: "lg-m8", title: "P2550 [AHOI2001] 彩票摇奖", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2550", difficulty: "medium", tags: ["模拟"], description: "7 个号码比对中奖号码，按命中数判断奖项。模拟。" },
  { id: "lg-m9", title: "P2249 【深基13.例1】查找", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2249", difficulty: "medium", tags: ["二分查找"], description: "单调不减序列中多次查询某数第一次出现的位置，没有则输出 -1。二分查找。" },
  { id: "lg-m10", title: "P2032 扫描", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2032", difficulty: "medium", tags: ["单调队列", "滑动窗口"], description: "长度 k 的木板在 1×n 矩阵上滑动，每次求覆盖区域最大值。单调队列模板。" },
  { id: "lg-m11", title: "P1031 [NOIP 2002 提高组] 均分纸牌", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1031", difficulty: "medium", tags: ["贪心", "NOIP"], description: "N 堆纸牌只能相邻移动，求最少移动次数使每堆相同。贪心。" },
  { id: "lg-m12", title: "P3367 【模板】并查集", platform: "luogu", url: "https://www.luogu.com.cn/problem/P3367", difficulty: "medium", tags: ["并查集", "模板"], description: "实现并查集的合并与查询操作。并查集入门模板题。" },
  { id: "lg-m13", title: "P3371 【模板】单源最短路径（弱化版）", platform: "luogu", url: "https://www.luogu.com.cn/problem/P3371", difficulty: "medium", tags: ["最短路", "Dijkstra", "模板"], description: "有向图求某点到所有点最短路。Dijkstra/SPFA 模板。" },
  { id: "lg-m14", title: "P1255 数楼梯", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1255", difficulty: "medium", tags: ["递推", "高精度"], description: "N 阶楼梯每次走 1 或 2 阶，求多少种走法。递推+高精度（斐波那契）。" },
  { id: "lg-m15", title: "P2142 高精度减法", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2142", difficulty: "medium", tags: ["高精度"], description: "给两个正整数 a,b，求 a-b。高精度减法模板。" },
  { id: "lg-m16", title: "P1591 阶乘数码", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1591", difficulty: "medium", tags: ["高精度", "数位统计"], description: "求 n! 中某数码出现的次数。高精度阶乘+数位统计。" },
  { id: "lg-m17", title: "P1822 魔法指纹", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1822", difficulty: "medium", tags: ["搜索", "找规律"], description: "magic(n) 为相邻数字差的绝对值拼接，求区间内 magic 链最终落到 1 的数个数。" },
  { id: "lg-m18", title: "P2910 [USACO08OPEN] Clear And Present Danger S", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2910", difficulty: "medium", tags: ["最短路", "Floyd", "USACO"], description: "N 个岛屿已知两两距离，按给定序列访问，求实际最短总路程。Floyd 最短路。" },
  { id: "lg-m19", title: "P1918 保龄球", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1918", difficulty: "medium", tags: ["模拟"], description: "DL 数清前方各位置瓶子数，从某位置发球求能击倒的瓶子数。模拟。" },
  { id: "lc-m1", title: "LC 53. Maximum Subarray", platform: "leetcode", url: "https://leetcode.cn/problems/maximum-subarray/", difficulty: "medium", tags: ["DP", "数组"], description: "最大子数组和。动态规划入门题。" },
  { id: "lc-m2", title: "LC 102. Binary Tree Level Order Traversal", platform: "leetcode", url: "https://leetcode.cn/problems/binary-tree-level-order-traversal/", difficulty: "medium", tags: ["BFS", "二叉树"], description: "二叉树层序遍历。BFS 经典应用。" },
  { id: "lc-m3", title: "LC 200. Number of Islands", platform: "leetcode", url: "https://leetcode.cn/problems/number-of-islands/", difficulty: "medium", tags: ["DFS", "BFS"], description: "岛屿数量。DFS/BFS flood fill 算法经典题。" },
  { id: "lc-m4", title: "LC 3. Longest Substring Without Repeating Characters", platform: "leetcode", url: "https://leetcode.cn/problems/longest-substring-without-repeating-characters/", difficulty: "medium", tags: ["滑动窗口", "哈希表"], description: "无重复字符的最长子串。滑动窗口标准模板。" },
  { id: "lc-m5", title: "LC 15. 3Sum", platform: "leetcode", url: "https://leetcode.cn/problems/3sum/", difficulty: "medium", tags: ["双指针", "数组"], description: "三数之和。排序后双指针，去重处理是关键。" },
  { id: "lc-m6", title: "LC 46. Permutations", platform: "leetcode", url: "https://leetcode.cn/problems/permutations/", difficulty: "medium", tags: ["回溯", "DFS"], description: "全排列。回溯法标准模板，标记数组避免重复。" },

  // ==================== 困难题 ====================
  { id: "lg-h1", title: "P2024 [NOI2001] 食物链", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2024", difficulty: "hard", tags: ["并查集", "种类并查集", "NOI"], description: "三类动物 A 吃 B 吃 C 吃 A，N 个动物两种说法，判断多少句假话。种类并查集经典。" },
  { id: "lg-h2", title: "P1462 通往奥格瑞玛的道路", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1462", difficulty: "hard", tags: ["二分答案", "最短路"], description: "城市间双向公路收费且掉血，血量上限 b，求最大过路费最小化。二分答案+最短路。" },
  { id: "lg-h3", title: "P3160 [CQOI2012] 局部极小值", platform: "luogu", url: "https://www.luogu.com.cn/problem/P3160", difficulty: "hard", tags: ["状压DP", "容斥", "CQOI"], description: "n×m 矩阵 1 到 nm 排列，给定所有局部极小值位置，求可能矩阵数。状压 DP+容斥。" },
  { id: "lg-h4", title: "P3292 [SCOI2016] 幸运数字", platform: "luogu", url: "https://www.luogu.com.cn/problem/P3292", difficulty: "hard", tags: ["线性基", "LCA", "SCOI"], description: "树上图 x 到 y 路径上选若干点使异或和最大。线性基+LCA。" },
  { id: "lg-h5", title: "P1262 [POI 1996 R3] 间谍网络", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1262", difficulty: "hard", tags: ["缩点", "拓扑", "POI"], description: "间谍可被收买或被揭发，求收买哪些能控制整个网络及最小成本。缩点+拓扑。" },
  { id: "lg-h6", title: "P5701 [CTSC1998] 站牌位置", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5701", difficulty: "hard", tags: ["模拟", "搜索", "CTSC"], description: "网格城市中划分游览区域，公共汽车绕区域四周运行，求站牌编号关系。CTSC 历史题。" },
  { id: "lg-h7", title: "P5702 调和级数求和", platform: "luogu", url: "https://www.luogu.com.cn/problem/P5702", difficulty: "hard", tags: ["数论", "原根", "逆元"], description: "求 sum(1/i) for i=1..n 对 p 取模，给定 p 的最小原根 g。数论+逆元。" },
  { id: "lg-h8", title: "P1508 Likecloud-吃、吃、吃", platform: "luogu", url: "https://www.luogu.com.cn/problem/P1508", difficulty: "hard", tags: ["DP"], description: "n×m 餐桌从底部中点出发，每步向上一行左/中/右，求吃到食物最大值。DP。" },
  { id: "lg-h9", title: "P2015 二叉苹果树", platform: "luogu", url: "https://www.luogu.com.cn/problem/P2015", difficulty: "hard", tags: ["树形DP", "二叉树", "NOIP"], description: "二叉苹果树保留 Q 条枝，求能保留的最大苹果数。树形 DP 经典。NOIP2005 提高组。" },
  { id: "lc-h1", title: "LC 42. Trapping Rain Water", platform: "leetcode", url: "https://leetcode.cn/problems/trapping-rain-water/", difficulty: "hard", tags: ["双指针", "栈"], description: "接雨水。经典 hard 题，双指针或单调栈解法。" },
  { id: "lc-h2", title: "LC 23. Merge k Sorted Lists", platform: "leetcode", url: "https://leetcode.cn/problems/merge-k-sorted-lists/", difficulty: "hard", tags: ["链表", "堆"], description: "合并 k 个升序链表。优先队列（最小堆）应用。" },
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

