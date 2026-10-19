# B站收藏夹智能分类 · 源码分享版

源码快照：2026-10-20。此包是 Python 源码，不是双击即可运行的 EXE，也没有在线演示。

把默认收藏夹里的视频按规则整理成分类计划，支持 UP 主映射、标签、分区和标题关键词；可选 DeepSeek 辅助分类、标题清理和摘要。桌面界面使用 CustomTkinter，手机界面依赖电脑启动的局域网服务。

## 快速开始

建议 Windows 10/11、Python 3.10 及以上，并预留浏览器安装空间。在解压后的 `bilibili-fav-classifier` 目录中执行：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m playwright install chromium
.\.venv\Scripts\python.exe launcher.py
```

需要网络下载 Python 依赖和浏览器。程序会在本机生成个人配置和登录文件，无需复制作者的配置。

1. 先选择“预览分类”，扫码登录自己的 B站账号。
2. 检查分类结果；必要时在“规则”页调整 UP 主映射。
3. 确认无误后再使用正式整理功能。正式模式会修改真实收藏夹，不能把“开始一键分类”当作只读预览。
4. AI 是可选项：不填 API Key 也能用本地规则。AI 模式会将视频标题、UP 主、标签等文本发送给你配置的模型服务，并可能产生费用。

“离线规则”仅指分类计算不依赖 AI，登录、拉取收藏和移动视频仍需联网。不要把本机服务端口暴露到公网；手机访问应限于可信的同一 Wi-Fi。

## 源码结构

- `launcher.py`：桌面入口。
- `bilibili_fav_classifier/`：采集、规则、分类计划、执行、可选 AI 与手机网页。
- `ui/`：桌面界面。
- `assets/`：图标等必需资源。
- `tests/`：离线回归测试。
- `tools/`：使用虚构数据的截图脚本。
- `build.py`、`build.spec`：原项目的可选 PyInstaller 打包工具；本次不提供 EXE，也不保证旧打包工具兼容任意 PyInstaller 版本。

## 测试

```powershell
.\.venv\Scripts\python.exe -m pytest tests -q
```

测试中的演示账号或虚构 Key 仅用于测试，不是可用凭据。不要将后来生成的 `config.json`、`cookies.json`、收藏记录和分类计划转发给别人。

## 分享范围与许可

本包保留原项目 `LICENSE`（MIT），以该文件为准。未包含真实配置、Cookie、个人 UP 主映射、收藏记录、API Key、浏览器环境、虚拟环境、构建输出和 Git 历史。请遵守平台规则，适度请求；遇到平台限制时停止并检查，不尝试绕过访问控制。

ZIP 根目录的 `SOURCE-MANIFEST.sha256` 可核对包内文件。此日期表示源码整理时间，不等同于新的软件版本或兼容性承诺。
