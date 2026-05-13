import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserURL: 'http://localhost:9222',
  defaultViewport: null,
});

const pages = await browser.pages();
const page = pages[0];

// 주간 할 일 목록 페이지로 이동
await page.goto('https://www.notion.so/68709c223d8e8309a7518102a44974af', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));

await page.screenshot({ path: 'todo-before.png' });
console.log('페이지 로드 완료, 스크린샷 저장');

// 페이지 본문 클릭 (빈 영역)
await page.click('.notion-page-content');
await new Promise(r => setTimeout(r, 500));

// 페이지 끝으로 이동
await page.keyboard.down('Meta');
await page.keyboard.press('End');
await page.keyboard.up('Meta');
await new Promise(r => setTimeout(r, 300));

// 새 줄에서 텍스트 입력
await page.keyboard.press('End');
await page.keyboard.press('Enter');
await new Promise(r => setTimeout(r, 300));

await page.keyboard.type('5월 13일 부서회식 - 18:30', { delay: 50 });
await new Promise(r => setTimeout(r, 500));

await page.screenshot({ path: 'todo-after.png' });
console.log('✅ 항목 추가 완료!');

await browser.disconnect();
