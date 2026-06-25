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
  {
    id: "lg-1",
    title: "P5738 【深基7.习9】暖风薰得游人醉",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P5738",
    difficulty: "easy",
    tags: ["数组", "模拟"],
    description: "给定同学成绩，计算「强健百分比」。入门级数组遍历。",
  },
  {
    id: "lg-2",
    title: "P5701 【深基2.习5】最厲害的人",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P5701",
    difficulty: "easy",
    tags: ["基础语法", "比较"],
    description: "比较三个人的成绩，找出最厲害的人。条件分支入门。",
  },
  {
    id: "lg-3",
    title: "P5703 【深基2.习7】找最小值",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P5703",
    difficulty: "easy",
    tags: ["基础语法", "循环"],
    description: "输入 n 个数，输出最小值。循环与条件判断。",
  },
  {
    id: "lg-4",
    title: "P5710 【深基3.习5】 snug 与二进制",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P5710",
    difficulty: "easy",
    tags: ["进制转换"],
    description: "将一个三位数转换为二进制、八进制、十六进制输出。",
  },
  {
    id: "lg-5",
    title: "P5722 【深基4.习7】数据修约",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P5722",
    difficulty: "easy",
    tags: ["模拟", "数学"],
    description: "修约运算练习，保留小数位数。基础数学模拟。",
  },
  {
    id: "lg-6",
    title: "P1085 【NOIP2012 普及组】不高兴的津津",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P1085",
    difficulty: "medium",
    tags: ["模拟", "数组"],
    description: "津津的爸爸安排了一周活动，找出她最不高兴的那一天。NOIP 经典入门题。",
  },
  {
    id: "lg-7",
    title: "P1047 【NOIP2000 普及组】 Nearest Number",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P1047",
    difficulty: "medium",
    tags: ["数组", "排序"],
    description: "输入一组数和目标值，找到最接近的数。NOIP 2000。",
  },
  {
    id: "lg-8",
    title: "P1200 【USACO1.1】 美国国旗",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P1200",
    difficulty: "medium",
    tags: ["字符串", "模拟"],
    description: "USACO 入门题，根据输入绘制美国国旗。字符串处理。",
  },
  {
    id: "lg-9",
    title: "P1591 【深基4.习8】 Trie 树的检索",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P1591",
    difficulty: "medium",
    tags: ["数据结构", "Trie"],
    description: "实现 Trie 树并支持前缀查询。数据结构中级。",
  },
  {
    id: "lg-10",
    title: "P3367 【模板】并查集",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P3367",
    difficulty: "medium",
    tags: ["数据结构", "并查集"],
    description: "并查集模板题，支持合并与查询操作。",
  },
  {
    id: "lg-11",
    title: "P1462 【NOIP2007 提高组】 通往ophagy之路",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P1462",
    difficulty: "hard",
    tags: ["图论", "最短路"],
    description: "NOIP 2007 提高组，带权有向图最短路问题。",
  },
  {
    id: "lg-12",
    title: "P2024 【NOI2001】食物链",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P2024",
    difficulty: "hard",
    tags: ["图论", "并查集"],
    description: "NOI 2001 经典题，食物链三种动物的关系判断。",
  },
  {
    id: "lg-13",
    title: "P1255 【NOI2002 提高组】 涂色",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P1255",
    difficulty: "hard",
    tags: ["DP", "区间DP"],
    description: "NOI 2002，区间 DP 经典， fence coloring 问题。",
  },
  {
    id: "lg-14",
    title: "P2015 【NOIP1996 提高组】 二叉Apple树",
    platform: "luogu",
    url: "https://www.luogu.com.cn/problem/P2015",
    difficulty: "hard",
    tags: ["树形DP", "二叉树"],
    description: "NOIP 1996，树形 DP，树上路径与子树问题。",
  },
  {
    id: "lc-1",
    title: "LC 1. Two Sum",
    platform: "leetcode",
    url: "https://leetcode.cn/problems/two-sum/",
    difficulty: "easy",
    tags: ["数组", "哈希表"],
    description: "给定数组和目标值，找出两数之和。哈希表入门经典。",
  },
  {
    id: "lc-2",
    title: "LC 20. Valid Parentheses",
    platform: "leetcode",
    url: "https://leetcode.cn/problems/valid-parentheses/",
    difficulty: "easy",
    tags: ["栈", "字符串"],
    description: "判断括号是否有效配对。栈的经典应用。",
  },
  {
    id: "lc-3",
    title: "LC 53. Maximum Subarray",
    platform: "leetcode",
    url: "https://leetcode.cn/problems/maximum-subarray/",
    difficulty: "medium",
    tags: ["DP", "数组"],
    description: "最大子数组和。动态规划入门题。",
  },
  {
    id: "lc-4",
    title: "LC 102. Binary Tree Level Order Traversal",
    platform: "leetcode",
    url: "https://leetcode.cn/problems/binary-tree-level-order-traversal/",
    difficulty: "medium",
    tags: ["BFS", "二叉树"],
    description: "二叉树层序遍历。BFS 经典应用。",
  },
  {
    id: "lc-5",
    title: "LC 42. Trapping Rain Water",
    platform: "leetcode",
    url: "https://leetcode.cn/problems/trapping-rain-water/",
    difficulty: "hard",
    tags: ["双指针", "栈"],
    description: "接雨水。经典 hard 题，双指针或单调栈解法。",
  },
  {
    id: "lc-6",
    title: "LC 23. Merge k Sorted Lists",
    platform: "leetcode",
    url: "https://leetcode.cn/problems/merge-k-sorted-lists/",
    difficulty: "hard",
    tags: ["链表", "堆"],
    description: "合并 k 个升序链表。优先队列（最小堆）应用。",
  },
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
