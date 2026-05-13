import puppeteer from 'puppeteer-core';

const browser = await puppeteer.connect({
  browserURL: 'http://localhost:9222',
  defaultViewport: null,
});

const pages = await browser.pages();
const page = pages[0];

await page.goto('https://www.notion.so/68709c223d8e8309a7518102a44974af', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 3000));

const blocks = await page.$$('[contenteditable="true"]');
console.log(`편집 가능한 블록 수: ${blocks.length}`);

if (blocks.length > 0) {
  const lastBlock = blocks[blocks.length - 1];
  await lastBlock.click();
  await new Promise(r => setTimeout(r, 500));

  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 500));

  await page.keyboard.type('5월 13일 부서회식 - 18:30', { delay: 60 });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'todo-result.png' });
  console.log('✅ 항목 추가 완료!');
} else {
  await page.screenshot({ path: 'todo-result.png' });
  console.log('❌ 편집 블록을 찾지 못했습니다.');
}

await browser.disconnect();
