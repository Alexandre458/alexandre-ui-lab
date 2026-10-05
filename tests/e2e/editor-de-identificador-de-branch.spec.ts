import { test, expect } from "@playwright/test";
import { entries, categories } from "../../src/registry/entries";

const preview = "/preview/fundamentals/editor-de-identificador-de-branch/";
const detail = "/fundamentals/editor-de-identificador-de-branch/";

test("canto de referência: preview normalizada, aria e avaliacao por teclado sem envio nativo", async ({ page }) => {
  const errors: string[] = [];
  const blockedSubmissions: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.text().includes("Blocked form submission")) blockedSubmissions.push(message.text());
  });
  await page.goto(preview);
  const codigo = page.locator(".branch-codigo");
  const nome = page.getByRole("textbox", { name: "Nome" });

  // fixture: feature/Minha Tela → feature/minha-tela
  await expect(codigo).toHaveText("feature/minha-tela");
  await expect(nome).not.toHaveAttribute("aria-invalid");
  // o <p#branch-descricao> é o alvo da aria-describedby do input; o texto vai nele, não no <p>
  await expect(nome).toHaveAccessibleDescription(/normalizada em tempo real/);

  // regra: minúsculas, sem acentos, espaços → hífens
  await nome.fill("Ajustes  Visuais");
  await expect(codigo).toHaveText("feature/ajustes-visuais");

  // Enter avalia uma vez e foca a região de status; o form nunca faz submit nativo
  await nome.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toBeFocused();
  await expect(page.getByRole("status")).toContainText("Identificador livre: feature/ajustes-visuais");
  await expect(page.locator(".branch-historico-lista").first()).toContainText("livre");

  // o foco no status é programado via requestAnimationFrame: o teste espera o
  // frame assentar antes de refocar o input; sem isso o rAF seguinte rouba o
  // foco de volta e o 2º Enter cai no handler com alvo≠input (ignorado de propósito)
  await page.waitForTimeout(150);
  await nome.focus();
  await page.keyboard.press("Enter");
  // o histórico é uma única <ol> acumulativa; o que cresce é a quantidade de <li>
  await expect(page.locator(".branch-historico-lista")).toHaveCount(1);
  await expect(page.locator(".branch-historico-lista li")).toHaveCount(2);

  expect(errors).toEqual([]);
  expect(blockedSubmissions).toEqual([]);
});

test("colisão local: diagnóstico nomeia o ramo, corrige a causa, desfaz e reinicia", async ({ page }) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.url().startsWith("http") && new URL(request.url()).origin !== "http://127.0.0.1:4317") {
      externalRequests.push(request.url());
    }
  });
  await page.goto(preview);
  const codigo = page.locator(".branch-codigo");
  const nome = page.getByRole("textbox", { name: "Nome" });
  // o rótulo muda com a sugestão atual (fix/login-novo, fix/ajustes-de-layout-novo)
  const corrigir = page.getByRole("button", { name: /Corrigir para/ });
  const desfazer = page.getByRole("button", { name: /^Desfazer/ });
  const status = page.getByRole("status");

  await nome.fill("Login");
  await page.getByRole("button", { name: "fix/", exact: true }).click();
  await expect(nome).toHaveAttribute("aria-invalid", "true");
  await expect(corrigir).toBeVisible();
  await expect(page.locator(".branch-diagnostico")).toContainText("colide: existe localmente desde 02/10");

  await corrigir.click();
  await expect(nome).toHaveValue("login-novo");
  await expect(codigo).toHaveText("fix/login-novo");
  await expect(page.locator(".branch-diagnostico")).toContainText("Nenhuma colisão entre os 7 ramos locais.");
  await expect(status).toBeFocused();
  await expect(status).toContainText("Correção aplicada: fix/login virou fix/login-novo, que está livre.");
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);

  // desfazer restaura exatamente o valor que colidia (LIFO)
  await expect(desfazer).toHaveText("Desfazer (1)");
  await desfazer.click();
  await expect(nome).toHaveValue("Login");
  await expect(codigo).toHaveText("fix/login");
  await expect(nome).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator(".branch-diagnostico")).toContainText("desde 02/10");
  await expect(status).toContainText("Desfeito: o editor voltou a fix/login (colisão).");
  await expect(corrigir).toBeVisible();

  // corrigir de novo: o snapshot do desfazimento é substituído, não acumulado
  await corrigir.click();
  await expect(nome).toHaveValue("login-novo");
  await expect(desfazer).toHaveText("Desfazer (1)");

  // segunda colisão (outra entrada local) enquanto a primeira ainda está na pilha
  await nome.fill("Ajustes de Layout");
  await expect(corrigir).toHaveText(/Corrigir para fix\/ajustes-de-layout-novo/);
  await expect(desfazer).toHaveText("Desfazer (1)");

  await corrigir.click();
  await expect(nome).toHaveValue("ajustes-de-layout-novo");
  await expect(codigo).toHaveText("fix/ajustes-de-layout-novo");
  await expect(desfazer).toHaveText("Desfazer (2)");

  // desfazimento LIFO: volta primeiro ao valor da última correção e, depois, ao primeiro — ambos ainda colidem
  await desfazer.click();
  await expect(nome).toHaveValue("Ajustes de Layout");
  await expect(codigo).toHaveText("fix/ajustes-de-layout");
  await expect(nome).toHaveAttribute("aria-invalid", "true");
  await expect(desfazer).toHaveText("Desfazer (1)");

  await desfazer.click();
  await expect(nome).toHaveValue("Login");
  await expect(codigo).toHaveText("fix/login");
  await expect(nome).toHaveAttribute("aria-invalid", "true");
  await expect(desfazer).toBeDisabled();

  // corrigir de novo reabre a pilha com um único snapshot
  await expect(corrigir).toBeVisible();
  await corrigir.click();
  await expect(nome).toHaveValue("login-novo");
  await expect(desfazer).toBeEnabled();

  // reinício restaura a fixture (prefixo, nome, status, histórico) sem duplicar efeitos
  await page.getByRole("button", { name: /Começar de novo/ }).click();
  await expect(nome).toHaveValue("Minha Tela");
  await expect(page.getByRole("button", { name: "feature/", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(codigo).toHaveText("feature/minha-tela");
  await expect(page.locator(".branch-historico")).toHaveCount(0);
  await expect(desfazer).toBeDisabled();
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("nome reservado, teclado longo e movimento reduzido não quebram a prévia", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(preview);
  await expect(page.locator(".branch-codigo")).toHaveCSS("transition-duration", "0s");

  const nome = page.getByRole("textbox", { name: "Nome" });
  await nome.fill("Main");
  await expect(nome).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("status")).toContainText("reservado");
  await expect(page.locator(".branch-diagnostico")).toContainText("nome reservado");

  await nome.fill("A".repeat(80));
  await expect(page.locator(".branch-codigo")).toContainText("feature/");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

  await nome.fill("Login");
  await page.getByRole("button", { name: "fix/", exact: true }).click();
  // o clique no prefixo anuncia com o rótulo acentuado (não o identificador interno)
  await expect(page.getByRole("status")).toContainText("(colisão)");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await page.screenshot({ path: test.info().outputPath("branch-texto-longo-reduzido.png"), fullPage: true });
});

test("0020 está no catálogo, categoria, sitemap, iframe, sandbox e tela cheia", async ({ page, request }) => {
  const blockedSubmissions: string[] = [];
  page.on("console", (message) => {
    if (message.text().includes("Blocked form submission")) blockedSubmissions.push(message.text());
  });
  await page.goto("/");
  await expect(page.locator(".demo-card")).toHaveCount(entries.length);
  await expect(page.locator(".category-links a")).toHaveCount(categories.length);
  await page.getByRole("searchbox", { name: "Buscar exemplos" }).fill("FUND-0020");
  await expect(page.locator(".demo-card")).toHaveCount(1);
  await page.getByRole("link", { name: /Abrir FUND-0020/ }).click();
  await expect(page).toHaveURL(new RegExp(`${detail}$`));

  const frame = page.locator("iframe");
  await expect(frame).toHaveAttribute("src", preview);
  if (process.env.E2E_STATIC === "1") await expect(frame).toHaveAttribute("sandbox", "allow-scripts");
  await expect(page.frameLocator("iframe").getByRole("textbox", { name: "Nome" })).toHaveValue("Minha Tela");
  await page.frameLocator("iframe").getByRole("textbox", { name: "Nome" }).fill("Login");
  await page.frameLocator("iframe").getByRole("button", { name: "fix/", exact: true }).click();
  await expect(page.frameLocator("iframe").getByRole("textbox", { name: "Nome" })).toHaveAttribute("aria-invalid", "true");
  await page.frameLocator("iframe").getByRole("button", { name: /Corrigir para fix\/login/ }).click();
  await expect(page.frameLocator("iframe").locator(".branch-codigo")).toContainText("fix/login-novo");

  for (const device of ["Tablet", "Mobile"]) await page.getByRole("button", { name: device, exact: true }).click();
  await expect(page.getByRole("link", { name: /tela cheia/i })).toHaveAttribute("href", preview);
  await page.goto("/category/fundamentals/");
  await expect(page.getByRole("link", { name: /Abrir FUND-0020/ })).toBeVisible();

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain(`https://ui.alexandresilva.dev${detail}`);
  expect(blockedSubmissions).toEqual([]);
});
