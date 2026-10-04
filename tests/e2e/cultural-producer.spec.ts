import { test, expect } from "@playwright/test";
import { entries, categories } from "../../src/registry/entries";

const preview = "/preview/fundamentals/assisted-field-cultural-producer/";
const detail = "/fundamentals/assisted-field-cultural-producer/";

test("bilheteria exige e-mail válido e quantidade inteira dentro do limite do show", async ({ page }) => {
  await page.goto(preview);
  const action = page.getByRole("button", { name: "Gerar bilhetes", exact: true });
  await expect(action).toBeDisabled();
  await page.getByLabel("Show da programação").selectOption("teatro");
  const quantity = page.getByLabel("Quantidade de ingressos");
  const name = page.getByLabel("Nome do participante");
  const email = page.getByLabel("E-mail para o bilhete");
  await expect(quantity).not.toHaveClass(/erro/);
  await quantity.fill("3");
  await name.fill("Beatriz Almeida");
  await expect(action).toBeDisabled(); // Regressão: e-mail vazio era considerado válido.
  await page.locator("form").evaluate((form) => (form as HTMLFormElement).requestSubmit());
  await expect(page.getByRole("region", { name: "Bilhete local gerado" })).toHaveCount(0);
  await email.fill("email-invalido");
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription(/Confira o formato/);
  await email.fill("beatriz@exemplo.com");
  await name.fill("123");
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(action).toBeDisabled();
  await name.fill("Beatriz Almeida");
  for (const value of ["0", "-1", "1.5", "10"]) {
    await quantity.fill(value);
    await expect(quantity).toHaveAttribute("aria-invalid", "true");
    await expect(quantity).toHaveAccessibleDescription(/número inteiro entre 1 e 9/);
    await expect(action).toBeDisabled();
  }
  await quantity.fill("9");
  await expect(action).toBeEnabled();
  await page.getByLabel("Show da programação").selectOption("jazz");
  await expect(quantity).toHaveAttribute("aria-invalid", "true");
  await expect(action).toBeDisabled();
  await quantity.fill("8");
  await expect(action).toBeEnabled();
});

test("bilhete é gerado por teclado uma única vez e novo pedido restaura o formulário", async ({ page }) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.url().startsWith("http") && new URL(request.url()).origin !== "http://127.0.0.1:4317") {
      externalRequests.push(request.url());
    }
  });
  await page.goto(preview);
  await page.getByLabel("Show da programação").selectOption("teatro");
  await page.getByLabel("Quantidade de ingressos").fill("3");
  await page.getByLabel("Nome do participante").fill("Béatriz D'Almeida");
  await page.getByLabel("E-mail para o bilhete").fill("beatriz@exemplo.com");
  const action = page.getByRole("button", { name: "Gerar bilhetes", exact: true });
  await action.focus();
  await expect(action).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Gerando bilhetes locais…" })).toBeDisabled();
  const ticket = page.getByRole("region", { name: "Bilhete local gerado" });
  await expect(ticket).toBeVisible();
  await expect(ticket).toBeFocused();
  await expect(ticket).toContainText("3 ingressos");
  await expect(ticket).toContainText("Béatriz D'Almeida");
  await expect(ticket).toContainText("beatriz@exemplo.com");
  await expect(page.getByRole("button", { name: "Bilhetes gerados", exact: true })).toBeDisabled();
  const code = await page.locator(".prod-code").textContent();
  await page.locator("form").evaluate((form) => {
    (form as HTMLFormElement).requestSubmit();
    (form as HTMLFormElement).requestSubmit();
  });
  await expect(ticket).toHaveCount(1);
  await expect(page.locator(".prod-code")).toHaveText(code!);
  await expect(page.getByRole("button", { name: "Gerando bilhetes locais…" })).toHaveCount(0);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Novo pedido" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Show da programação")).toHaveValue("");
  await expect(page.getByLabel("Show da programação")).toBeFocused();
  await expect(page.getByLabel("Nome do participante")).toHaveValue("");
  await expect(page.getByLabel("E-mail para o bilhete")).toHaveValue("");
  await expect(page.getByLabel("Quantidade de ingressos")).toHaveCount(0);
  await expect(ticket).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Gerar bilhetes", exact: true })).toBeDisabled();
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("texto longo e movimento reduzido não quebram a prévia", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(preview);
  await expect(page.locator(".prod-letreiro-trilha")).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "Pausar letreiro" }).click();
  await expect(page.getByRole("button", { name: "Retomar letreiro" })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Show da programação").selectOption("exposicao");
  await page.getByLabel("Quantidade de ingressos").fill("1");
  await page.getByLabel("Nome do participante").fill("A".repeat(80));
  await page.getByLabel("E-mail para o bilhete").fill(`${"a".repeat(60)}@${"b".repeat(60)}.com`);
  await page.getByRole("button", { name: "Gerar bilhetes", exact: true }).click();
  await expect(page.getByRole("region", { name: "Bilhete local gerado" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await page.screenshot({ path: test.info().outputPath("bilhete-texto-longo.png"), fullPage: true });
});

test("0019 está no catálogo, categoria, sitemap, iframe e link de tela cheia", async ({ page, request }) => {
  const blockedSubmissions: string[] = [];
  page.on("console", (message) => {
    if (message.text().includes("Blocked form submission")) blockedSubmissions.push(message.text());
  });
  await page.goto("/");
  await expect(page.locator(".demo-card")).toHaveCount(entries.length);
  await expect(page.locator(".category-links a")).toHaveCount(categories.length);
  await page.getByRole("searchbox", { name: "Buscar exemplos" }).fill("FUND-0019");
  await expect(page.locator(".demo-card")).toHaveCount(1);
  await page.getByRole("link", { name: /Abrir FUND-0019/ }).click();
  await expect(page).toHaveURL(new RegExp(`${detail}$`));
  const frame = page.locator("iframe");
  await expect(frame).toHaveAttribute("src", preview);
  if (process.env.E2E_STATIC === "1") await expect(frame).toHaveAttribute("sandbox", "allow-scripts");
  await page.frameLocator("iframe").getByLabel("Show da programação").selectOption("jazz");
  await page.frameLocator("iframe").getByLabel("Quantidade de ingressos").fill("2");
  await page.frameLocator("iframe").getByLabel("Nome do participante").fill("Ana Costa");
  await page.frameLocator("iframe").getByLabel("E-mail para o bilhete").fill("ana@exemplo.com");
  await page.frameLocator("iframe").getByLabel("E-mail para o bilhete").press("Enter");
  await expect(page.frameLocator("iframe").getByRole("region", { name: "Bilhete local gerado" })).toBeVisible();
  for (const device of ["Tablet", "Mobile"]) await page.getByRole("button", { name: device, exact: true }).click();
  await expect(page.getByRole("link", { name: /tela cheia/i })).toHaveAttribute("href", preview);
  await page.goto("/category/fundamentals/");
  await expect(page.getByRole("link", { name: /Abrir FUND-0019/ })).toBeVisible();
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain(`https://ui.alexandresilva.dev${detail}`);
  expect(blockedSubmissions).toEqual([]);
});
