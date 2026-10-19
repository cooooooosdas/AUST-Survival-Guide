"""Exercise source archive boundaries with isolated fixtures."""

import hashlib
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import zipfile

from package_project_sources import create_archive, should_include


class SourceArchiveTests(unittest.TestCase):
    def test_android_wrapper_overlay_is_portable(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            original = root / "android/gradle/wrapper/gradle-wrapper.properties"
            original.parent.mkdir(parents=True)
            original.write_text("distributionUrl=file\\:///D:/private/gradle.zip", encoding="utf-8")
            subprocess.run([
                sys.executable, str(Path(__file__).with_name("package_project_sources.py")),
                "--bilibili", str(root), "--helper", str(root), "--android", str(root),
                "--output", str(root / "output"),
            ], check=True, capture_output=True, text=True, encoding="utf-8")
            with zipfile.ZipFile(root / "output/erke-source-2026-10-20.zip") as archive:
                text = archive.read("erke-source/android/android/gradle/wrapper/gradle-wrapper.properties").decode()
                self.assertIn("distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip", text)
                self.assertNotIn("file\\:", text)
            self.assertIn("D:/private", original.read_text(encoding="utf-8"))

    def test_sources_and_templates_are_kept(self):
        for profile, name in [
            ("bilibili", "ui/app.py"),
            ("bilibili", "bilibili_fav_classifier/config_template.json"),
            ("helper", "backend/main.py"),
            ("helper", "config.example.json"),
            ("android", "android/gradle/wrapper/gradle-wrapper.jar"),
            ("android", "pubspec.lock"),
        ]:
            with self.subTest(name=name):
                self.assertTrue(should_include(Path(name), profile))

    def test_private_generated_and_unreviewed_files_are_rejected(self):
        names = [
            "config.json", "backend/config.json", "backend/cookies.json",
            "ui/credentials.bin", "ui/account.pem", "ui/token.json",
            "ui/debug.log", "backend/erke.db", "ui/.env.local",
            "ui/private.jks", "android/key.properties", "android/local.properties",
            "android/.gradle/8.7/cache.bin", "android/app/release/app.apk",
            "backend/__pycache__/app.pyc", "ui/.git/config", "build/main.py",
            "tools/_recon/bundle.js", "data/favs.json", "seed_mappings.json",
            "docs/screenshots/real-account.png", "tools/build_apk.py",
        ]
        for profile in ["bilibili", "helper", "android"]:
            for name in names:
                with self.subTest(profile=profile, name=name):
                    self.assertFalse(should_include(Path(name), profile))

    def test_archive_contains_sources_readme_and_verifiable_manifest(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "source"
            (source / "ui").mkdir(parents=True)
            (source / "ui/app.py").write_text("print('ready')", encoding="utf-8")
            (source / "ui/cookies.json").write_text('{"private":true}', encoding="utf-8")
            output = root / "result.zip"
            create_archive([(source, "bilibili-fav-classifier", "bilibili")], output,
                           {"bilibili-fav-classifier/README.md": "# 使用说明\n"})
            with zipfile.ZipFile(output) as archive:
                self.assertIsNone(archive.testzip())
                self.assertIn("bilibili-fav-classifier/ui/app.py", archive.namelist())
                self.assertNotIn("bilibili-fav-classifier/ui/cookies.json", archive.namelist())
                self.assertEqual(archive.read("bilibili-fav-classifier/README.md").decode(), "# 使用说明\n")
                for line in archive.read("SOURCE-MANIFEST.sha256").decode().splitlines():
                    digest, name = line.split("  ", 1)
                    self.assertEqual(hashlib.sha256(archive.read(name)).hexdigest(), digest)

    def test_symlink_sources_cannot_export_external_files(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "source"
            (source / "ui").mkdir(parents=True)
            outside = root / "private.py"
            outside.write_text("PRIVATE", encoding="utf-8")
            try:
                (source / "ui/link.py").symlink_to(outside)
                (source / "assets").symlink_to(root, target_is_directory=True)
            except OSError:
                self.skipTest("OS does not allow symlinks for this account")
            create_archive([(source, "project", "bilibili")], root / "out.zip", {})
            with zipfile.ZipFile(root / "out.zip") as archive:
                self.assertEqual(archive.namelist(), ["SOURCE-MANIFEST.sha256"])

    def test_unsafe_archive_prefix_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            with self.assertRaises(ValueError):
                create_archive([(Path(temporary), "../escape", "bilibili")],
                               Path(temporary) / "out.zip", {})


if __name__ == "__main__":
    unittest.main()
