import { NextResponse } from "next/server";

type Question = {
  id: string;
  type: "choice" | "coding";
  difficulty: "easy" | "medium" | "hard";
  title: string;
  content: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  tags: string[];
};

const QUESTIONS: Question[] = [
  {
    id: "c1",
    type: "choice",
    difficulty: "easy",
    title: "变量赋值",
    content: "在 Python 中，执行 a = [1,2,3]; b = a; b.append(4) 后，a 的值是？",
    options: ["[1,2,3]", "[1,2,3,4]", "[4]", "报错"],
    answer: "B",
    explanation: "Python 中列表是可变对象，赋值是引用传递。",
    tags: ["Python", "基础"],
  },
  {
    id: "c2",
    type: "choice",
    difficulty: "easy",
    title: "HTML 标签",
    content: "以下哪个 HTML 标签用于定义文档的标题？",
    options: ["<head>", "<title>", "<header>", "<h1>"],
    answer: "B",
    explanation: "<title> 定义浏览器标签页标题，<h1> 是页面内一级标题。",
    tags: ["HTML", "基础"],
  },
  {
    id: "c3",
    type: "choice",
    difficulty: "easy",
    title: "Git 命令",
    content: "git commit 后想修改提交信息，应该使用哪个命令？",
    options: ["git amend", "git commit --amend", "git redo", "git fix"],
    answer: "B",
    explanation: "git commit --amend 可以修改最后一次提交。",
    tags: ["Git", "工具"],
  },
  {
    id: "c4",
    type: "choice",
    difficulty: "medium",
    title: "时间复杂度",
    content: "以下代码的时间复杂度是？\nfor i in range(n):\n  for j in range(i, n):\n    print(i, j)",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
    answer: "C",
    explanation: "外层 n 次，内层平均 n/2 次，总约 n²/2 → O(n²)。",
    tags: ["算法", "复杂度"],
  },
  {
    id: "c5",
    type: "choice",
    difficulty: "medium",
    title: "闭包",
    content: "以下 JavaScript 代码输出什么？\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}",
    options: ["0 1 2", "3 3 3", "undefined undefined undefined", "报错"],
    answer: "B",
    explanation: "var 是函数作用域，循环结束后 i = 3，三个回调都打印 3。",
    tags: ["JavaScript", "闭包"],
  },
  {
    id: "c6",
    type: "choice",
    difficulty: "medium",
    title: "HTTP 状态码",
    content: "HTTP 状态码 301 表示什么？",
    options: ["未找到资源", "服务器错误", "永久重定向", "临时重定向"],
    answer: "C",
    explanation: "301 Moved Permanently，资源已永久移动到新 URL。",
    tags: ["HTTP", "网络"],
  },
  {
    id: "c7",
    type: "choice",
    difficulty: "hard",
    title: "事件循环",
    content: "以下代码输出顺序是？\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);",
    options: ["1 2 3 4", "1 3 4 2", "1 4 3 2", "1 4 2 3"],
    answer: "C",
    explanation: "同步先执行 1 4，微任务 Promise 3，宏任务 setTimeout 2。",
    tags: ["JavaScript", "事件循环"],
  },
  {
    id: "c8",
    type: "choice",
    difficulty: "hard",
    title: "数据库索引",
    content: "以下哪种情况下 B+ 树索引最可能失效？",
    options: ["使用 = 查询", "使用 LIKE '%abc'", "使用 > 比较", "使用 ORDER BY"],
    answer: "B",
    explanation: "前缀通配符 %abc 无法利用 B+ 树的排序特性。",
    tags: ["数据库", "索引"],
  },
  {
    id: "p1",
    type: "coding",
    difficulty: "easy",
    title: "两数之和",
    content: "给定一个整数数组 nums 和一个目标值 target，找出和为目标值的那两个整数。\n\n示例：\n输入: nums = [2, 7, 11, 15], target = 9\n输出: [0, 1]",
    answer: "使用哈希表，遍历一次即可。\n\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n}",
    explanation: "时间复杂度 O(n)，空间复杂度 O(n)。",
    tags: ["算法", "数组", "哈希表"],
  },
  {
    id: "p2",
    type: "coding",
    difficulty: "easy",
    title: "反转字符串",
    content: "编写一个函数，反转输入的字符串。\n\n示例：\n输入: \"hello\"\n输出: \"olleh\"",
    answer: "// 方法一：双指针\nfunction reverseString(s) {\n  let l = 0, r = s.length - 1;\n  const arr = s.split('');\n  while (l < r) {\n    [arr[l], arr[r]] = [arr[r], arr[l]];\n    l++; r--;\n  }\n  return arr.join('');\n}",
    explanation: "双指针法，O(n) 时间 O(1) 额外空间（如果允许修改原数组）。",
    tags: ["算法", "字符串"],
  },
  {
    id: "p3",
    type: "coding",
    difficulty: "medium",
    title: "有效的括号",
    content: "给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。\n\n有效字符串需满足：左括号必须用相同类型的右括号闭合。",
    answer: "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if ('({['.includes(c)) { stack.push(c); }\n    else {\n      if (stack.pop() !== map[c]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
    explanation: "栈的经典应用。时间复杂度 O(n)。",
    tags: ["算法", "栈", "字符串"],
  },
  {
    id: "p4",
    type: "coding",
    difficulty: "medium",
    title: "二叉树层序遍历",
    content: "给你二叉树的根节点 root，返回其节点值的层序遍历（从左到右，逐层）。",
    answer: "function levelOrder(root) {\n  if (!root) return [];\n  const result = [];\n  const queue = [root];\n  while (queue.length) {\n    const level = [];\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(level);\n  }\n  return result;\n}",
    explanation: "BFS 层序遍历，用队列实现。",
    tags: ["算法", "二叉树", "BFS"],
  },
  {
    id: "p5",
    type: "coding",
    difficulty: "hard",
    title: "最长递增子序列",
    content: "给你一个整数数组 nums，找到其中最长严格递增子序列的长度。\n\n示例：\n输入: nums = [10,9,2,5,3,7,101,18]\n输出: 4（子序列 [2,3,7,101]）",
    answer: "// 动态规划 O(n²)\nfunction lengthOfLIS(nums) {\n  const dp = new Array(nums.length).fill(1);\n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[i] > nums[j]) dp[i] = Math.max(dp[i], dp[j] + 1);\n    }\n  }\n  return Math.max(...dp);\n}",
    explanation: "DP 解法 O(n²)，贪心 + 二分可优化到 O(n log n)。",
    tags: ["算法", "动态规划", "二分"],
  },
  {
    id: "p6",
    type: "coding",
    difficulty: "hard",
    title: "LRU 缓存",
    content: "设计一个 LRU 缓存机制，支持 get 和 put 操作，要求两个操作的平均时间复杂度为 O(1)。",
    answer: "class LRUCache {\n  constructor(capacity) {\n    this.cap = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.cap) {\n      this.map.delete(this.map.keys().next().value);\n    }\n  }\n}",
    explanation: "利用 Map 的有序性（ES6），实现 O(1) 的 LRU。",
    tags: ["算法", "设计", "数据结构"],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type"); // choice | coding
  const difficulty = url.searchParams.get("difficulty"); // easy | medium | hard
  const count = Number(url.searchParams.get("count") || "5");

  let pool = QUESTIONS;
  if (type && (type === "choice" || type === "coding")) {
    pool = pool.filter((q) => q.type === type);
  }
  if (difficulty && ["easy", "medium", "hard"].includes(difficulty)) {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }

  const shuffled = shuffle(pool);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return NextResponse.json({
    questions: selected,
    total: selected.length,
    totalPool: pool.length,
  });
}
