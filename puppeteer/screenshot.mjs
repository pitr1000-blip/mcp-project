import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
await page.goto('https://www.naver.com', { waitUntil: 'networkidle2', timeout: 30000 });
await page.screenshot({ path: 'naver_screenshot.png', fullPage: false });
console.log('Screenshot saved!');
await browser.close();
