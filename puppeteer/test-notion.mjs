import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserURL: 'http://localhost:9222',
  defaultViewport: null,
});

const page = await browser.newPage();
await page.goto('https://www.notion.so', { waitUntil: 'networkidle2' });

const url = page.url();
console.log('현재 URL:', url);

if (url.includes('notion.so') && !url.includes('login')) {
  console.log('✅ 노션 로그인 상태 확인!');
} else {
  console.log('❌ 로그인 필요');
}

await page.screenshot({ path: 'notion-check.png', fullPage: false });
console.log('스크린샷 저장: notion-check.png');

await browser.disconnect();
