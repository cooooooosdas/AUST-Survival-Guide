# 二课提醒 · Android 源码

## 工具链与运行

该工程的 `pubspec.yaml` 要求 Dart `^3.6.2`，原工程使用 Flutter 3.27.4。请安装匹配的 Flutter SDK、Android SDK、JDK，并先通过 `flutter doctor` 检查本机环境。Android 工程的 compileSdk 为 35，minSdk 为 23（Android 6.0）；能安装不代表所有系统版本的后台提醒都可靠。

解压到尽量不含中文、空格的目录，在本目录执行：

```text
flutter doctor
flutter pub get
flutter test
flutter run
```

构建用于本机测试的 APK：

```text
flutter build apk --release
```

`android/local.properties` 应由 Flutter 根据接收者本机 SDK 路径生成，未从作者电脑复制。未附带签名私钥：当前 Gradle release 配置使用本机 debug 签名，仅适合自测；正式分发前请自行配置签名、应用标识与授权信息。不要据此直接上架。

分享包已将 Gradle wrapper 的本机 ZIP 路径改为 Gradle 8.7 官方 HTTPS 分发地址，并固定 [官方 SHA-256](https://gradle.org/release-checksums/)。首次构建仍需联网下载 Gradle 和 Android 依赖；本次未验证完整 APK 构建。

## 工程

- `lib/core/`：接口访问、匹配、存储、凭据、同步和提醒。
- `lib/ui/`：活动列表、详情、设置和首次引导。
- `test/`：纯逻辑及界面测试。
- `android/`：Android 壳、Gradle 配置、必要资源和 Gradle wrapper。
- `pubspec.yaml` / `pubspec.lock`：依赖与锁定信息。

未提供 iOS 工程或 iOS 安装包。原本依赖作者电脑绝对路径的 APK 辅助脚本未收录，直接使用 Flutter 标准命令即可。

## 使用边界

仅使用自己的账号，通知权限和系统省电策略会影响后台检索。该 App 不依赖主站代管登录信息，也不应将主站理解为远程同步后台。原项目没有附开源许可证，授权说明见上一级 README。
