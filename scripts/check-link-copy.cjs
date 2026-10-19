// With the dev server on port 3100:
// npx --package @playwright/cli playwright-cli run-code --filename scripts/check-link-copy.cjs
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI evaluates this function expression.
async (page) => {
  await page.goto('http://localhost:3100/tools');
  // Capture the browser boundary without reading or overwriting the user's clipboard.
  await page.evaluate(() => {
    window.__copiedLink = null;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (value) => { window.__copiedLink = value; } },
    });
  });
  const cases = [
    {title: '神兽职场', expected: 'http://localhost:3100/projects/shenshou'},
    {title: 'DeepL 翻译', expected: 'https://www.deepl.com/translator'},
  ];
  for (const {title, expected} of cases) {
    const card = page.getByRole('article').filter({has: page.getByRole('heading', {name: title, exact: true})});
    await card.getByRole('button', {name: '复制链接', exact: true}).click();
    const actual = await page.evaluate(() => window.__copiedLink);
    if (actual !== expected) throw new Error(`${title}: expected ${expected}, got ${actual}`);
  }
}
