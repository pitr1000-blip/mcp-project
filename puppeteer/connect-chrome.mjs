import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserURL: 'http://localhost:9222',
  defaultViewport: null,
});

const pages = await browser.pages();
console.log(`현재 열린 탭 수: ${pages.length}`);
pages.forEach((p, i) => console.log(`  [${i+1}] ${p.url()}`));

await browser.disconnect();
