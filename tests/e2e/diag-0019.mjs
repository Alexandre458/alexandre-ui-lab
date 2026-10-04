import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const erros = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") erros.push(`[${msg.type()}] ${msg.text()}`);
});
page.on("pageerror", (err) => erros.push(`[pageerror] ${err.message}`));
await page.goto("http://127.0.0.1:3000/preview/fundamentals/assisted-field-cultural-producer/", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(2500);
const temForm = await page.getByRole("combobox", { name: "Show da programação" }).count();
console.log("combobox count:", temForm);
console.log("body text (primeiros 400):", (await page.locator("body").innerText()).slice(0, 400).replaceAll("\n", " | "));
console.log("ERROS DO CONSOLE/REDACTED:", erros.length ? erros.join("\n") : "(nenhum)");
await browser.close();
