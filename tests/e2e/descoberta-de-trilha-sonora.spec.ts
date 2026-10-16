import { test, expect } from "@playwright/test";

// 0024 — Descoberta de trilha sonora (FUND-0024)
// Caso de referência: faixas de 120, 180 e 60 s → total 6 min 00 s.

test("0024 caso de referência soma 6 min e abre estrutura por teclado", async ({ page }) => {
  await page.goto("/preview/fundamentals/descoberta-de-trilha-sonora/");
  await expect(page.getByText("3 faixas · total 6 min 00 s")).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /Primeira Luz/ })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: /Maré Alta/ })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: /Respiro/ })).toBeChecked();
  await expect(page.getByText("00:00–02:00")).toBeVisible();
  await expect(page.getByText("02:00–05:00")).toBeVisible();
  await expect(page.getByText("05:00–06:00")).toBeVisible();
  await page.getByRole("button", { name: "Ver estrutura de Maré Alta" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Recolher estrutura de Maré Alta" })).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Clímax")).toBeVisible();
});

test("0024 fronteira recalcula e desfazer restaura sem estado antigo", async ({ page }) => {
  await page.goto("/preview/fundamentals/descoberta-de-trilha-sonora/");
  await page.getByRole("checkbox", { name: /Stinger do Portão/ }).check();
  await expect(page.getByRole("status")).toContainText("6 min 30 s");
  await expect(page.getByText("4 faixas · total 6 min 30 s")).toBeVisible();
  await page.getByRole("button", { name: "Desfazer última alteração" }).click();
  await expect(page.getByRole("checkbox", { name: /Stinger do Portão/ })).not.toBeChecked();
  await expect(page.getByText("3 faixas · total 6 min 00 s")).toBeVisible();
  await expect(page.getByRole("button", { name: "Desfazer última alteração" })).toBeDisabled();
});

test("0024 filtro preserva seleção por identificador", async ({ page }) => {
  await page.goto("/preview/fundamentals/descoberta-de-trilha-sonora/");
  await page.getByLabel("Filtrar por clima").selectOption("pulsante");
  await expect(page.getByRole("checkbox", { name: /Maré Alta/ })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: /Respiro/ })).toHaveCount(0);
  await expect(page.getByText("3 faixas · total 6 min 00 s")).toBeVisible();
});

test("0024 faixa inelegível permanece explicável e sem duração não entra no total", async ({ page }) => {
  await page.goto("/preview/fundamentals/descoberta-de-trilha-sonora/");
  const viva = page.getByRole("checkbox", { name: /Gravação ao Vivo 07/ });
  await expect(viva).toBeDisabled();
  await expect(page.getByText("Gravação ao vivo não pode compor trilha montada por estrutura de duração.")).toBeVisible();
  await page.getByRole("checkbox", { name: /Tema Improvisado/ }).check();
  await expect(page.getByText("sem duração registrada — visível na lista, fora do total")).toBeVisible();
  await expect(page.getByText("4 faixas · total 6 min 00 s")).toBeVisible();
  await page.getByRole("button", { name: "Reiniciar demonstração" }).click();
  await expect(page.getByText("3 faixas · total 6 min 00 s")).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /Tema Improvisado/ })).not.toBeChecked();
});
