import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = "http://127.0.0.1:4317";
const dirs = { desktop: 1440, tablet: 768, mobile: 375 };
const routes = [
  "/preview/fundamentals/assisted-field-cultural-producer/",
  "/fundamentals/assisted-field-cultural-producer/",
];
mkdirSync("test-results/shot-0019", { recursive: true });

const browser = await chromium.launch();
for (const [name, width] of Object.entries(dirs)) {
  const page = await browser.newPage({ viewport: { width, height: width === 375 ? 812 : 900 } });
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(1500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    const bodyW = await page.evaluate(() => document.body.scrollWidth);
    console.log(`[${name} ${width}px] ${r} overflow=${overflow} bodyW=${bodyW} inner=${width}`);
    await page.screenshot({ path: `test-results/shot-0019/${name}-${r.split("/")[1]}.png`, fullPage: true });
  }
  await page.close();
}
await browser.close();
console.log("done");
