# 二课提醒 · 电脑端源码

## 本机启动

建议 Python 3.10 及以上，在当前 `desktop` 目录执行：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m backend.main
```

浏览器访问 `http://127.0.0.1:8848/`。保持终端运行；退出可按 Ctrl+C。不要直接双击前端 HTML，它依赖本地 API。macOS/Linux 可将 Python 路径替换为 `.venv/bin/python`。

默认使用演示数据。需要真实数据时，在设置中选学校并用自己的账号登录，确认检索策略和画像。凭据机制详见 `backend/security.py`；不要把凭据密文、数据库或个人配置分享出去。启用第三方提醒渠道前，需自己了解所发送的数据和接收方。

## 工程

- `backend/`：API、活动存储、匹配、轮询、提醒和凭据处理。
- `frontend/`：本地 Web 界面及必要资源。
- `config.example.json`：空白配置参考，程序会另行生成运行配置。
- `tools/smoke.py`：离线核心自检。
- `tools/check_org_scope.py`：组织范围匹配检查。
- `tools/build_exe.py`：可选 Windows PyInstaller 构建脚本，需额外安装 PyInstaller。

## 离线自检

```powershell
.\.venv\Scripts\python.exe tools/smoke.py
.\.venv\Scripts\python.exe tools/check_org_scope.py
```

自检应在此分享副本里执行，不要指向含真实账号数据的目录。真实登录、通知发送与活动报名未作为源码打包的验证步骤。

## 隐私与限制

`config.json`、`data/` 都是用户运行后产生的个人数据，不在源码包中。不要公开部署这套个人本地服务，不要把端口转发到公网。学校接口变化可能导致功能失效；活动信息和报名规则以官方平台为准。许可说明见上一级 README。
