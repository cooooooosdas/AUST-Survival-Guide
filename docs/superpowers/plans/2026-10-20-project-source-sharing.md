# 两个项目源码分享 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 整理 B站收藏夹分类器、二课提醒的可分享源码包，在主站提供介绍和下载，不提供在线演示。

**Architecture:** 原始目录只读；按白名单直接生成 ZIP，再解压到项目 `_working/source-sharing/` 中验证，避免复制个人运行数据。B站单独一个 ZIP，二课电脑端和 Android 端合为一个 ZIP；成品放在 `public/downloads/source/`。复用现有项目列表和 MDX 介绍页，下载入口使用原生下载链接，不新增服务端功能。

**Tech Stack:** Python 标准库（筛选、ZIP、SHA-256、包校验），现有 Next.js / TypeScript / MDX。

**Spec:** 用户在本对话批准的范围：寻找本机两个项目源码、整理打包、主站提供源码，不要在线演示。

## Global Constraints

- 只读来源：`D:/bilibili-fav-classifier`、`D:/项目/erke-helper`、`D:/项目/erke-app`。
- 不包含账号配置、Cookie、学号、密码、API Key、凭据密文、数据库、收藏记录、通知目标、签名私钥、运行日志。
- 不包含 Git / IDE 元数据、虚拟环境、依赖缓存、构建输出、第三方逆向下载脚本、EXE 或 APK；保留 Android Gradle wrapper 所需 JAR。
- 测试用虚构凭据必须识别为测试样例，不能误称为真实泄露。
- 保留代码、依赖清单、空配置模板、必要图标、测试和经过检查的文档；不复制未经检查的真实数据截图。
- 补充中文分享说明、平台要求、启动步骤和边界；不新增未经确认的开源许可证。
- 不改动源项目或无关工作区文件；用户已于 2026-10-20 授权执行并推送主站 main。

## Review Focus

- 历史配置隐藏在包目录内：归档完整清单检查，禁用运行时配置文件。
- Android 签名与本机路径：排除 local.properties、密钥、Gradle 缓存，检查构建说明在其他电脑可用。
- 分享压缩包无法运行：解压后检查相对资源、依赖、入口，运行可用的离线自检；不使用真实账号。
- README 版本与旧成品包冲突：本次标明“源码快照 2026-10-20”，不沿用旧 EXE 包版本。
- 下载导航失效或手机溢出：验证主站项目页、ZIP URL、下载 SHA-256 和手机宽度。

### Task 1: 制作和校验干净源码包

**Files:** `scripts/package_project_sources.py`、`scripts/test_package_project_sources.py`、`_working/source-sharing/`、`public/downloads/source/`。

**Interfaces:** 打包脚本输入三个只读源目录，输出两个 ZIP、包内中文说明、文件清单与 SHA-256；路径白名单与敏感文件拒绝规则可独立测试。

- [x] 先写临时目录测试：真实源码进入包；嵌套配置、凭据、数据库、日志、私钥、符号链接和构建目录不进入包；必须依赖的模板与 Gradle wrapper 保留。
- [x] 执行测试观察失败，最小实现筛选、路径校验、归档和校验功能，再运行通过。
- [x] 检查选入文本与图片；在副本补好快速开始、说明未提供二课开源许可，不打包个人 UP 主映射。
- [x] 解压归档验证完整性，运行 B站离线测试、二课可用离线自检；Flutter 工具链可用并执行 Android 测试，不假定构建成功。

### Task 2: 接入主站介绍与下载

**Files:** `lib/projects.ts`、`content/projects/bilibili-fav-classifier.mdx`、`content/projects/erke-helper.mdx`、`content/links/software.ts`、`components/SourceDownload.tsx`。

**Interfaces:** 两个项目项不设置 `demo`；软件资源入口指向介绍页，介绍页指向版本化 ZIP 文件和 SHA-256 清单。

- [x] 添加功能、适用平台、安装运行、隐私及误操作提示，区分局域网界面与公共在线服务。
- [x] 下载使用原生 `<a download>`，避免将 ZIP 当作 Next 客户端页面预取。通过服务端组件保留下载属性，避免全局 MDX 链接映射丢弃该属性。
- [x] 检查主站搜索可发现、项目列表可到达、无新增在线演示按钮、手机布局无溢出。

### Task 3: 最终验证与交付

- [x] 运行打包测试、ZIP CRC 和禁用文件检查、相关 ESLint、生产构建。
- [x] 通过浏览器验证两页及下载，HTTP 获取字节校验与磁盘 SHA-256 一致。
- [x] 准备两个本地 ZIP 及介绍页路径，说明测试与未验证项；保留所有无关改动，仅暂存本轮交付物。最终 main 推送结果以 Git 远端状态及交付答复为准。

## 验证记录

- 打包单元测试：5 项通过；1 项符号链接测试因 Windows 当前账号无创建权限跳过。
- 两包 CRC、外层 SHA-256、包内逐文件 SHA-256、禁用路径与 Python 语法检查通过（155 个文件，61 个 Python 文件）。
- 从最终 ZIP 解压验证：B站 `pytest tests -q` 214 项通过；电脑二课 `tools/smoke.py` 58 项通过，组织范围检查通过；Flutter 3.27.4 / Dart 3.6.2 的 Android 测试 51 项通过。
- 相关 ESLint、Next.js 生产构建通过。未修改或宣称修复其他模块。
- 浏览器验证两页原生下载、HTTP 字节和 SHA-256、无在线演示、320 / 375 / 768 / 1440 宽度展开校验值不溢出、浅 / 深主题下载按钮对比度、项目列表 / 软件资源 / 全站搜索入口通过；本地生产模式 HTTP 再次验证通过。
- 未使用真实账号验证登录、收藏移动、通知发送或报名；未构建 EXE / APK，未验证全部操作系统及设备。

重新生成源码快照（打包脚本需要 Python 3.12+，与源项目运行版本要求不同）：

```powershell
python scripts/package_project_sources.py --bilibili 'D:/bilibili-fav-classifier' --helper 'D:/项目/erke-helper' --android 'D:/项目/erke-app' --output public/downloads/source
python -m unittest discover -s scripts -p test_package_project_sources.py -v
```

发布后分享介绍页 `/projects/bilibili-fav-classifier` 与 `/projects/erke-helper`，接收者可从页内下载源码与校验清单。

## 最终审查

- 独立只读审查未发现真实硬编码凭据或主入口缺失文件。
- Important：分享包 Android Gradle wrapper 依赖作者本机 ZIP。已补 CLI 归档回归测试，观察到本机路径导致失败，再以分享包 overlay 改为 Gradle 8.7 官方地址及 SHA-256；原目录不变，重包后测试、归档校验通过。
- 截图检查发现新下载按钮的 Tailwind 文字颜色被全局链接规则覆盖，对比度仅 1.88。改用现有 `ui-button-primary`，浅 / 深主题对比度回归通过，不改全局样式。
- Deferred minor：B站可选 `tools/capture_mobile.py` 保留了本机 Chromium 路径和用户名，接收者运行此辅助截图脚本前需自行修改；不影响主程序和离线测试。

实现取舍与验证边界：

- 按用户明确要求在原 main 工作区整合并直接推送，仅暂存本次文件；若以后需要隔离开发，可另建工作区。无关删除项未提交。
- PowerShell 环境用 `_working/source-sharing` 手工记录进度；相比技能的 Bash 辅助脚本，需要人工维护记录。
- 白名单直接写入 ZIP 再解压检查，避免复制私密运行数据；需要复查时需再次解压。
- 真实账号登录、收藏移动、报名和通知没有验证，不承诺成功率；错误使用仍可能影响账号数据。
- 本次不是原应用认证、加密、局域网服务的全面安全审计；本地运行提示不能替代安全审计。
- 不验证旧 PyInstaller 的全部兼容性，不提供 EXE；自行构建可能仍需适配。
- 原双端固定设备 UUID 作为协议参数保留，没有证据表明它是账号凭据；若平台行为变化，可能影响兼容性。
- 未验证完整 APK 构建和全设备提醒可靠性；确定的 Gradle 本机路径问题已修复，不据此扩大兼容承诺。
- 按钮样式由执行者实测浅 / 深主题及浏览器回归；独立审查查看组件但未重复浏览器操作。
