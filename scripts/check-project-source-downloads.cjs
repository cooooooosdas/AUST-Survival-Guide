// Run with the main site listening on port 3100:
// npx --package @playwright/cli playwright-cli run-code --filename scripts/check-project-source-downloads.cjs
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- Playwright CLI evaluates this function expression.
async (page) => {
  const manifestResponse = await page.request.get('http://localhost:3100/downloads/source/manifest.json');
  if (!manifestResponse.ok()) throw new Error('Source manifest unavailable');
  const manifest = await manifestResponse.json();
  const projects = [
    {slug: 'bilibili-fav-classifier', title: 'B站收藏夹分类器', file: 'bilibili-fav-classifier-source-2026-10-20.zip'},
    {slug: 'erke-helper', title: '二课活动提醒助手', file: 'erke-source-2026-10-20.zip'},
  ];
  for (const project of projects) {
    const response = await page.goto(`http://localhost:3100/projects/${project.slug}`);
    if (response.status() !== 200) throw new Error(`${project.slug}: missing project page`);
    await page.getByRole('heading', {name: project.title, exact: true}).waitFor({timeout: 10000});
    if (await page.getByRole('link', {name: '在线演示', exact: true}).count()) throw new Error('Unexpected demo');
    const link = page.getByRole('link', {name: '下载源码 ZIP', exact: true});
    if (await link.getAttribute('download') !== project.file) throw new Error('Not a native download link');
    for (const dark of [false, true]) {
      await page.evaluate((enabled) => document.documentElement.classList.toggle('dark', enabled), dark);
      const contrast = await link.evaluate((element) => {
        const luminance = (color) => {
          const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map((value) => {
            const srgb = value / 255;
            return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
          });
          return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
        };
        const style = getComputedStyle(element);
        const values = [luminance(style.color), luminance(style.backgroundColor)].sort((a, b) => b - a);
        return (values[0] + 0.05) / (values[1] + 0.05);
      });
      if (contrast < 4.5) throw new Error(`Download contrast too low: ${contrast.toFixed(2)}, dark=${dark}`);
    }
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({width, height: 900});
      await page.getByText('查看 SHA-256 校验值', {exact: true}).click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      if (overflow) throw new Error(`${project.slug}: horizontal overflow at ${width}`);
      await page.getByText('查看 SHA-256 校验值', {exact: true}).click();
    }
    const downloaded = page.waitForEvent('download');
    await link.click();
    const download = await downloaded;
    if (download.suggestedFilename() !== project.file || await download.failure()) throw new Error('Download failed');
    const zip = await page.request.get(`http://localhost:3100/downloads/source/${project.file}`);
    if (!zip.ok()) throw new Error('ZIP HTTP request failed');
    const bytes = await zip.body();
    const digest = await page.evaluate(async (data) => {
      const hash = await crypto.subtle.digest('SHA-256', new Uint8Array(data));
      return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
    }, [...bytes]);
    const expected = manifest.archives.find((item) => item.file === project.file);
    if (digest !== expected.sha256 || bytes.length !== expected.bytes) throw new Error('HTTP archive checksum mismatch');
    console.log(`${project.slug}: download, hash, no demo, 4 viewport widths OK`);
  }
  await page.goto('http://localhost:3100/projects');
  for (const project of projects) {
    if (!await page.locator(`a[href="/projects/${project.slug}"]`).count()) throw new Error('Missing project card');
  }
  await page.goto('http://localhost:3100/software');
  for (const project of projects) {
    if (!await page.locator(`a[href="/projects/${project.slug}"]`).count()) throw new Error('Missing toolbox link');
  }
  for (const project of projects) {
    await page.goto(`http://localhost:3100/search?q=${encodeURIComponent(project.title)}`);
    await page.locator(`a[href="/projects/${project.slug}"]`).first().waitFor({timeout: 10000});
  }
  console.log('Project list, software entries and search OK');
}
