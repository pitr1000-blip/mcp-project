const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--lang=ko-KR',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8' });
  await page.setViewport({ width: 1280, height: 900 });

  const url = 'https://search.naver.com/search.naver?where=news&query=%ED%95%9C%EA%B5%AD%EC%A0%84%EB%A0%A5%EA%B3%B5%EC%82%AC&sort=1';
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  try {
    await page.waitForSelector('[data-fender-bootstrapped]', { timeout: 10000 });
  } catch (e) {}
  await new Promise(r => setTimeout(r, 3000));

  const articles = await page.evaluate(() => {
    const results = [];
    const fenderRoot = document.querySelector('[data-fender-root]');
    if (!fenderRoot) return [];

    const cards = fenderRoot.querySelectorAll('[class*="Daw8Xs3TT"]');
    cards.forEach((card, idx) => {
      if (idx >= 20) return;
      const titleLink = card.querySelector('a[data-heatmap-target=".tit"]');
      let title = '', href = '';
      if (titleLink) {
        const titleSpan = titleLink.querySelector('.sds-comps-text-type-headline1, .sds-comps-text-type-headline2');
        title = titleSpan ? titleSpan.innerText.trim() : titleLink.innerText.trim();
        href = titleLink.href;
      }
      let source = '';
      const profileTitleText = card.querySelector('.sds-comps-profile-info-title-text');
      if (profileTitleText) source = profileTitleText.innerText.trim();

      let time = '';
      const subtexts = card.querySelectorAll('.sds-comps-profile-info-subtext');
      subtexts.forEach(el => {
        const t = el.innerText.trim();
        if (/\d+[분시일주달년]/.test(t) || /전$/.test(t)) time = t;
      });

      if (title) results.push({ rank: results.length + 1, title, source, time, href });
    });
    return results;
  });

  console.log('\n=== 한국전력공사 최신 뉴스 ===\n');
  articles.forEach(a => {
    console.log(`[${a.rank}] ${a.title}`);
    console.log(`    출처: ${a.source} | 시간: ${a.time}`);
    console.log(`    URL: ${a.href}\n`);
  });

  await browser.close();
})();
