"""Build allowlisted source snapshots without changing original projects."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import zipfile

SNAPSHOT = "2026-10-20"
BLOCKED_DIRS = {
    ".git", ".idea", ".workbuddy", ".gradle", ".dart_tool", ".pytest_cache",
    "__pycache__", ".venv", ".build-venv", ".pipdl", "node_modules", "build",
    "dist", "data", "browser_data", "_recon", "release", ".build",
}
PRIVATE_NAMES = {
    "config.json", "cookies.json", "favs.json", "plan.json", "apply_log.json",
    "auto_classified.json", "enrich_cache.json", "up_summary.json", "ai_results.json",
    "seed_mappings.json", "token.json", "credentials.json", "credentials.bin",
    "local.properties", "key.properties", "generatedpluginregistrant.java",
}
PRIVATE_SUFFIXES = {".db", ".sqlite", ".sqlite3", ".log", ".pem", ".key", ".jks", ".keystore"}
ROOT_FILES = {
    "bilibili": {"requirements.txt", "LICENSE", "launcher.py", "build.py", "build.spec", ".gitignore"},
    "helper": {"requirements.txt", "config.example.json", "app_launcher.py", "start.bat", "start.sh", "run-server.bat", ".gitignore"},
    "android": {"pubspec.yaml", "pubspec.lock", "analysis_options.yaml", ".metadata", ".gitignore"},
}
SOURCE_DIRS = {
    "bilibili": {"bilibili_fav_classifier", "ui", "assets", "tests"},
    "helper": {"backend", "frontend"},
    "android": {"lib", "test", "android"},
}
HELPER_TOOLS = {"smoke.py", "check_org_scope.py", "build_exe.py"}
SOURCE_SUFFIXES = {".py", ".json", ".html", ".css", ".js", ".png", ".ico", ".svg", ".dart", ".gradle", ".properties", ".xml", ".kt", ".yaml", ".lock"}


def should_include(relative: Path, profile: str) -> bool:
    """Accept only reviewed source areas and reject runtime or machine state."""
    parts = relative.parts
    if profile not in ROOT_FILES or not parts or relative.is_absolute() or ".." in parts:
        return False
    if any(part.lower() in BLOCKED_DIRS for part in parts):
        return False
    name = relative.name.lower()
    if name in PRIVATE_NAMES or relative.suffix.lower() in PRIVATE_SUFFIXES or name.startswith(".env"):
        return False
    if len(parts) == 1:
        return relative.name in ROOT_FILES[profile]
    if profile == "helper" and parts[0] == "tools":
        return len(parts) == 2 and relative.name in HELPER_TOOLS
    if profile == "bilibili" and parts[0] == "tools":
        return len(parts) == 2 and relative.name in {"capture_mobile.py", "capture_desktop.py"}
    if parts[0] not in SOURCE_DIRS[profile]:
        return False
    if relative.as_posix() == "android/gradle/wrapper/gradle-wrapper.jar" and profile == "android":
        return True
    return relative.suffix.lower() in SOURCE_SUFFIXES or relative.as_posix() in {"android/gradlew", "android/gradlew.bat", "android/.gitignore"}


def safe_member(name: str) -> str:
    """Reject archive paths that could escape on extraction."""
    path = PurePosixPath(name)
    if not name or path.is_absolute() or ".." in path.parts or "\\" in name or ":" in name:
        raise ValueError("Unsafe archive path")
    return path.as_posix()


def create_archive(sources: list[tuple[Path, str, str]], output: Path,
                   overlays: dict[str, str]) -> dict[str, str | int]:
    """Create a source ZIP with byte-level hashes for every included file."""
    payload: dict[str, bytes] = {}
    for root, prefix, profile in sources:
        prefix = safe_member(prefix)
        if root.is_symlink() or not root.is_dir():
            raise ValueError("Source must be a real directory")
        root = root.resolve()
        for folder, directories, files in os.walk(root, followlinks=False):
            folder_path = Path(folder)
            directories[:] = [name for name in directories
                              if name.lower() not in BLOCKED_DIRS
                              and not (folder_path / name).is_symlink()
                              and not (folder_path / name).is_junction()]
            for name in files:
                path = folder_path / name
                if path.is_symlink() or not path.resolve().is_relative_to(root):
                    continue
                relative = path.relative_to(root)
                if should_include(relative, profile):
                    member = safe_member(f"{prefix}/{relative.as_posix()}")
                    payload[member] = path.read_bytes()
    for name, content in overlays.items():
        payload[safe_member(name)] = content.encode("utf-8")
    manifest = "".join(f"{hashlib.sha256(data).hexdigest()}  {name}\n"
                       for name, data in sorted(payload.items()))
    payload["SOURCE-MANIFEST.sha256"] = manifest.encode("utf-8")
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, data in sorted(payload.items()):
            info = zipfile.ZipInfo(name, (2026, 10, 20, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (0o100755 if name.endswith(("/gradlew", ".sh")) else 0o100644) << 16
            archive.writestr(info, data)
    with zipfile.ZipFile(output) as archive:
        if archive.testzip() is not None:
            raise ValueError("Archive CRC verification failed")
    return {"file": output.name, "bytes": output.stat().st_size,
            "files": len(payload), "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}


def main() -> None:
    """Package the two projects from explicit local source directories."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bilibili", type=Path, required=True)
    parser.add_argument("--helper", type=Path, required=True)
    parser.add_argument("--android", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    templates = Path(__file__).parent / "source-sharing"
    readme = lambda name: (templates / name).read_text(encoding="utf-8")
    summaries = [
        create_archive([(args.bilibili, "bilibili-fav-classifier", "bilibili")],
                       args.output / f"bilibili-fav-classifier-source-{SNAPSHOT}.zip",
                       {"bilibili-fav-classifier/README.md": readme("bilibili.md")}),
        create_archive([(args.helper, "erke-source/desktop", "helper"),
                        (args.android, "erke-source/android", "android")],
                       args.output / f"erke-source-{SNAPSHOT}.zip",
                       {"erke-source/README.md": readme("erke.md"),
                        "erke-source/desktop/README.md": readme("erke-desktop.md"),
                        "erke-source/android/README.md": readme("erke-android.md"),
                        "erke-source/android/android/gradle/wrapper/gradle-wrapper.properties": readme("gradle-wrapper.properties")}),
    ]
    (args.output / "SHA256SUMS.txt").write_text(
        "".join(f"{item['sha256']}  {item['file']}\n" for item in summaries), encoding="utf-8")
    (args.output / "manifest.json").write_text(
        json.dumps({"snapshot": SNAPSHOT, "archives": summaries}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summaries, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
