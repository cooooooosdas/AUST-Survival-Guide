import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = "D:/AUST-plan/.preview";
fs.mkdirSync(outDir, { recursive: true });
const profile = path.join(outDir, "chrome-tmp-dark");
fs.mkdirSync(profile, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1800 },
    colorScheme: "dark",
  });
  const page = await context.newPage();

  // Use a clean profile so no theme is cached in localStorage
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
  // Wait for layout.tsx's theme script to read prefers-color-scheme and add .dark
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outDir, "home-dark-2.png"), fullPage: false });
  console.log("✓ home-dark-2.png");

  // Also take a light mode with a different profile
  const profileLight = path.join(outDir, "chrome-tmp-light");
  fs.mkdirSync(profileLight, { recursive: true });
  const contextLight = await browser.newContext({
    viewport: { width: 1440, height: 1800 },
    colorScheme: "light",
  });
  const pageLight = await contextLight.newPage();
  await pageLight.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
  await pageLight.waitForTimeout(3000);
  await pageLight.screenshot({ path: path.join(outDir, "home-light-2.png"), fullPage: false });
  console.log("✓ home-light-2.png");

  // Mobile dark
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 1800 },
    colorScheme: "dark",
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
  await pageMobile.waitForTimeout(3000);
  await pageMobile.screenshot({ path: path.join(outDir, "home-mobile-dark.png"), fullPage: false });
  console.log("✓ home-mobile-dark.png");

  await browser.close();
  fs.rmSync(profile, { recursive: true, force: true });
  fs.rmSync(profileLight, { recursive: true, force: true });
  console.log("Done");
})().catch(console.error);
