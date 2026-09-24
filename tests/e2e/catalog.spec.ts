import { test, expect } from "@playwright/test";

test("catálogo, busca, filtros e navegação", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Ideias ganham forma aqui/i })).toBeVisible();
  await expect(page.locator(".demo-card")).toHaveCount(11);
  const exampleCount = await page.locator(".demo-card").count();
  const categoryCount = await page.locator(".category-links a").count();
  await expect(page.locator(".stats > div").nth(0).locator("strong")).toHaveText(String(exampleCount).padStart(2, "0"));
  await expect(page.locator(".stats > div").nth(1).locator("strong")).toHaveText(String(categoryCount).padStart(2, "0"));
  await expect(page.locator(".catalog .pill")).toHaveText(`${exampleCount} exemplos disponíveis`);
  await page.getByRole("searchbox", { name: "Buscar exemplos" }).fill("LOGIN-001");
  await expect(page.locator(".demo-card")).toHaveCount(1);
  await page.getByRole("searchbox", { name: "Buscar exemplos" }).fill("");
  await page.getByRole("button", { name: "Botões" }).click();
  await expect(page.locator(".demo-card")).toHaveCount(1);
  await page.getByRole("link", { name: /Abrir BTN-001/ }).click();
  await expect(page).toHaveURL(/\/buttons\/confirmation-button\/$/, { timeout: 30000 });
  await expect(page.getByRole("heading", { name: "Botão de confirmação", level: 1 })).toBeVisible();
  await expect(page.locator("iframe")).toBeVisible();
  if (process.env.E2E_STATIC === "1") {
    await expect(page.locator("iframe")).toHaveAttribute("sandbox", "allow-scripts");
    const originIsolated = await page.locator("iframe").evaluate((frame) => {
      try {
        void (frame as HTMLIFrameElement).contentWindow?.document;
        return false;
      } catch {
        return true;
      }
    });
    expect(originIsolated).toBe(true);
  }
  await page.frameLocator("iframe").getByRole("button", { name: /Confirmar ação/ }).click();
  await expect(page.frameLocator("iframe").getByRole("button", { name: /Confirmado/ })).toBeVisible();
  await page.getByRole("button", { name: "Tablet" }).click();
  await expect(page.locator("iframe")).toHaveClass(/tablet/);
  await page.getByRole("button", { name: "Mobile" }).click();
  await expect(page.locator("iframe")).toHaveClass(/mobile/);
  await expect(page.getByRole("link", { name: /tela cheia/i })).toHaveAttribute("href", /\/preview\/buttons\/confirmation-button\//);
});

test("oito previews executam interações reais", async ({ page }) => {
  await page.goto("/preview/buttons/confirmation-button/");
  await page.getByRole("button", { name: /Confirmar ação/ }).click();
  await expect(page.getByRole("button", { name: /Confirmado/ })).toBeVisible();
  await page.goto("/preview/inputs/smart-email-field/");
  await page.getByLabel("Seu e-mail").fill("nome@exemplo.com");
  await expect(page.getByText(/E-mail pronto/)).toBeVisible();
  await page.goto("/preview/cards/editorial-collection-card/");
  await page.getByRole("button", { name: "Salvar na coleção" }).click();
  await expect(page.getByRole("button", { name: "Remover da coleção" })).toBeVisible();
  await page.goto("/preview/login/workspace-login/");
  await page.getByLabel("E-mail").fill("teste@exemplo.com");
  await page.getByLabel("Senha de teste").fill("teste123");
  await page.getByRole("button", { name: /Entrar no workspace/ }).click();
  await expect(page.getByRole("status")).toContainText("Nenhuma credencial foi enviada");
  await page.goto("/preview/hero/atelier-hero/");
  await expect(page.getByRole("heading", { name: /Forma/ })).toBeVisible();
  await page.goto("/preview/fundamentals/contextual-action-button/");
  await page.getByRole("button", { name: /Iniciar aula/ }).first().click();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Parabéns/i })).toBeVisible({ timeout: 10000 });
  await page.goto("/preview/fundamentals/contextual-action-store/");
  await page.getByRole("button", { name: /Solicitar pedido/ }).first().click();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Pedido confirmado/i })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/Referência:/)).toBeVisible();
  await page.goto("/preview/fundamentals/contextual-action-environmental/");
  await page.getByRole("button", { name: /Analisar indicador/ }).first().click();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Análise concluída/i })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/às/)).toBeVisible();
  await page.goto("/preview/fundamentals/contextual-action-cultural-producer/");
  await page.getByRole("button", { name: /Reservar ingresso/ }).first().click();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Ingresso Confirmado/i })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/Código:/)).toBeVisible();
  await page.goto("/preview/fundamentals/contextual-action-software-team/");
  await page.getByRole("button", { name: /Iniciar deploy/ }).first().click();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Deploy Confirmado/i })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/Deploy ID:/)).toBeVisible();
  await page.goto("/preview/fundamentals/assisted-field-preventive-clinic/");
  await page.getByRole("textbox", { name: "Nome Completo" }).fill("Ana Paula Silva");
  await expect(page.getByText("Cadastro completo")).toBeVisible();
  await page.getByRole("textbox", { name: "CPF" }).fill("12345678900");
  await expect(page.getByText("CPF validado")).toBeVisible();
  await page.locator("#preventive-date").fill("2027-03-15");
  await expect(page.getByText("Data confirmada")).toBeVisible();
  await expect(page.getByRole("button", { name: "Confirmar Agendamento" })).toBeEnabled();
});

test("não há overflow horizontal na home e no detalhe", async ({ page }) => {
  for (const route of ["/", "/buttons/confirmation-button/", "/login/workspace-login/"]) {
    await page.goto(route);
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hasOverflow, `${route} transbordou`).toBe(false);
  }
});

test("marca AOS e favicon carregam em todos os tamanhos", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator(".site-header .brand img")).toBeVisible();
  const icon = page.locator('link[rel="icon"][href*="icon.svg"]');
  await expect(icon).toHaveCount(1);
  const href = await icon.getAttribute("href");
  const response = await request.get(new URL(href!, page.url()).toString());
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("AOS");
});
