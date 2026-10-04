import { test, expect } from "@playwright/test";
import { entries, entryHref, previewHref } from "../../src/registry/entries";

test("0001 confirma uma vez e permite desfazer por teclado", async ({ page }) => {
  await page.goto("/preview/buttons/confirmation-button/");
  await page.getByRole("button", { name: "Confirmar ação" }).dblclick();
  await expect(page.getByRole("button", { name: "Confirmado", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Desfazer confirmação" }).press("Enter");
  await expect(page.getByRole("button", { name: "Confirmar ação" })).toBeFocused();
  await expect(page.getByRole("button", { name: "Confirmar ação" })).toBeEnabled();
});

test("0002 distingue formato e sugestão de domínio", async ({ page }) => {
  await page.goto("/preview/inputs/smart-email-field/");
  await page.getByLabel("Seu e-mail").fill("ana@");
  await expect(page.getByRole("button", { name: /Continuar/ })).toBeDisabled();
  await page.getByLabel("Seu e-mail").fill("ana@gmial.com");
  await page.getByRole("button", { name: /Continuar/ }).click();
  await expect(page.getByRole("status")).toHaveText("Endereço revisado: ana@gmial.com");
  await page.getByRole("button", { name: "Aplicar sugestão" }).press("Enter");
  await expect(page.getByLabel("Seu e-mail")).toHaveValue("ana@gmail.com");
  await expect(page.getByRole("status")).toBeEmpty();
  await page.getByLabel("Seu e-mail").press("Enter");
  await expect(page.getByRole("status")).toHaveText("Endereço revisado: ana@gmail.com");
  await page.getByLabel("Seu e-mail").fill("ana@atelier.dev");
  await expect(page.getByRole("button", { name: "Aplicar sugestão" })).toHaveCount(0);
});

test("0003 explora coleção sem alterar favorito", async ({ page }) => {
  await page.goto("/preview/cards/editorial-collection-card/");
  await page.getByRole("button", { name: "Salvar na coleção" }).click();
  await page.getByRole("button", { name: "Explore a coleção" }).press("Enter");
  await expect(page.getByText("Vaso Alba", { exact: true })).toBeVisible();
  await expect(page.locator("#editorial-objects li")).toHaveCount(3);
  await page.getByRole("button", { name: "Recolher coleção" }).click();
  await expect(page.getByText("Vaso Alba", { exact: true })).toBeHidden();
  await expect(page.getByRole("button", { name: "Remover da coleção" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Remover da coleção" }).click();
  await expect(page.getByRole("status")).toContainText("0 favoritos");
});

test("0004 valida e limpa o acesso no iframe de produção", async ({ page }) => {
  await page.goto("/login/workspace-login/");
  const frame = page.frameLocator("iframe");
  await frame.getByLabel("E-mail", { exact: true }).fill("a@");
  await frame.getByLabel("Senha de teste").fill("abc");
  await expect(frame.getByRole("button", { name: "Entrar no workspace" })).toBeDisabled();
  await frame.getByLabel("E-mail", { exact: true }).fill("teste@exemplo.com");
  await frame.getByLabel("Senha de teste").fill("teste123");
  await frame.getByRole("button", { name: "Mostrar senha" }).click();
  await expect(frame.getByLabel("Senha de teste")).toHaveAttribute("type", "text");
  await frame.getByLabel("Senha de teste").press("Enter");
  await expect(frame.getByRole("status")).toContainText("Acesso simulado com sucesso");
  await expect(frame.getByLabel("E-mail", { exact: true })).toHaveValue("");
  await expect(frame.getByLabel("Senha de teste")).toHaveValue("");
  await expect(frame.getByLabel("Senha de teste")).toHaveAttribute("type", "password");
});

test("0005 navega para destinos e fecha menu com Escape", async ({ page }) => {
  await page.goto("/preview/hero/atelier-hero/");
  await page.getByRole("link", { name: "Descubra nosso trabalho" }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole("heading", { name: "Projetos com intenção." })).toBeInViewport();
  const menu = page.getByRole("button", { name: "Abrir menu" });
  if (await menu.isVisible()) {
    await menu.click();
    await page.getByRole("link", { name: "Sobre", exact: true }).focus();
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
    await expect(page.getByRole("link", { name: "Sobre", exact: true })).toBeHidden();
  }
});

test("0006 pré-requisitos e reabertura invalidam dependentes", async ({ page }) => {
  await page.goto("/preview/fundamentals/contextual-action-button/");
  await expect(page.getByRole("button", { name: "Concluir Composição final" })).toBeDisabled();
  await page.getByRole("button", { name: "Concluir Preparar paleta" }).press("Enter");
  await page.getByRole("button", { name: "Concluir Estudo de luz" }).click();
  await page.getByRole("button", { name: "Concluir Composição final" }).click();
  await expect(page.getByRole("status")).toContainText("3 de 3");
  await page.getByRole("button", { name: "Reabrir Estudo de luz" }).click();
  await expect(page.getByRole("status")).toContainText("1 de 3");
  await expect(page.getByRole("button", { name: "Concluir Composição final" })).toBeDisabled();
  await page.getByRole("button", { name: "Reiniciar prática" }).click();
  await expect(page.getByRole("status")).toContainText("0 de 3");
});

test("0007 estoque e subtotal acompanham reserva e devolução", async ({ page }) => {
  await page.goto("/preview/fundamentals/contextual-action-store/");
  await expect(page.getByRole("button", { name: "Reservar Luminária Arco" })).toBeDisabled();
  await page.getByRole("button", { name: "Reservar Vaso Alba" }).click();
  await page.getByRole("button", { name: "Reservar Vaso Alba" }).click();
  await expect(page.getByRole("button", { name: "Reservar Vaso Alba" })).toBeDisabled();
  await expect(page.getByRole("status")).toContainText(/R\$\s*578,00/);
  await page.getByRole("button", { name: "Desfazer reserva de Vaso Alba" }).click();
  await expect(page.getByRole("status")).toContainText(/R\$\s*289,00/);
  await expect(page.getByRole("button", { name: "Reservar Vaso Alba" })).toBeEnabled();
  await page.getByRole("button", { name: "Limpar reserva" }).click();
  await expect(page.getByRole("status")).toContainText(/R\$\s*0,00/);
  await expect(page.getByRole("button", { name: "Desfazer reserva de Vaso Alba" })).toBeDisabled();
});

test("0008 compara total, intensidade e denominador zero", async ({ page }) => {
  await page.goto("/preview/fundamentals/contextual-action-environmental/");
  await expect(page.getByRole("status")).toContainText("+10%");
  await page.getByRole("radio", { name: "Por unidade" }).check();
  await expect(page.getByRole("status")).toContainText("-8,3%");
  await expect(page.getByText("110 kg CO₂e / unidade", { exact: true })).toBeVisible();
  await page.getByLabel("Comparar com").selectOption("november");
  await expect(page.getByRole("status")).toContainText("Sem base de produção");
  await expect(page.getByText("Indisponível", { exact: true })).toBeVisible();
  await page.getByRole("radio", { name: "Total", exact: true }).check();
  await expect(page.getByRole("status")).toContainText("-87,5%");
  await page.getByRole("button", { name: "Reiniciar comparação" }).click();
  await expect(page.getByRole("status")).toContainText("+10%");
});

test("0009 respeita lugares ocupados, limite e revisão", async ({ page }) => {
  await page.goto("/preview/fundamentals/contextual-action-cultural-producer/");
  await expect(page.getByRole("button", { name: "Assento A2 ocupado", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Confirmar lugares" })).toBeDisabled();
  await page.getByRole("button", { name: "Assento A1", exact: true }).click();
  await page.getByRole("button", { name: "Assento A3", exact: true }).click();
  await expect(page.locator(".seats-ticket>strong")).toHaveText(/R\$\s*70,00/);
  await page.getByRole("button", { name: "Assento A4", exact: true }).click();
  await expect(page.getByRole("button", { name: "Assento A5", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Assento A3", exact: true }).click();
  await expect(page.getByRole("button", { name: "Assento A5", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Confirmar lugares" }).click();
  await expect(page.getByRole("button", { name: "Assento A1", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Revisar reserva" }).click();
  await expect(page.getByRole("button", { name: "Assento A1", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Reiniciar escolha" }).click();
  await expect(page.getByRole("status")).toHaveText("Nenhum lugar selecionado");
});

test("0010 depende de verificações e preserva histórico no rollback", async ({ page }) => {
  await page.goto("/preview/fundamentals/contextual-action-software-team/");
  await expect(page.getByRole("button", { name: "Publicar localmente" })).toBeDisabled();
  await page.getByRole("checkbox", { name: /^Testes/ }).check();
  await expect(page.getByRole("button", { name: "Publicar localmente" })).toBeDisabled();
  await page.getByRole("checkbox", { name: /^Migração/ }).check();
  await page.getByRole("button", { name: "Publicar localmente" }).dblclick();
  await expect(page.locator(".release-versions>div").first()).toContainText("2.4.0");
  await expect(page.locator(".release-history li")).toHaveCount(1);
  await page.getByRole("button", { name: "Reverter release" }).click();
  await expect(page.locator(".release-versions>div").first()).toContainText("2.3.0");
  await expect(page.locator(".release-history li")).toHaveCount(2);
  await expect(page.getByRole("checkbox", { name: /^Testes/ })).toBeChecked();
  await page.getByRole("button", { name: "Reiniciar release" }).click();
  await expect(page.locator(".release-history li")).toHaveCount(0);
});

test("0011 trocar dia invalida horário e confirmação", async ({ page }) => {
  await page.goto("/preview/fundamentals/assisted-field-preventive-clinic/");
  await page.getByLabel("Nome fictício completo").fill("Ana Paula");
  await expect(page.getByRole("radio", { name: /09:00 Ocupado/ })).toBeDisabled();
  await page.getByRole("radio", { name: /10:00 Disponível/ }).check();
  await expect(page.getByRole("button", { name: "Confirmar agendamento" })).toBeEnabled();
  await page.getByRole("radio", { name: "06 out · Terça" }).check();
  await expect(page.getByRole("button", { name: "Confirmar agendamento" })).toBeDisabled();
  await page.getByRole("radio", { name: /09:00 Disponível/ }).check();
  await page.getByRole("button", { name: "Confirmar agendamento" }).click();
  await expect(page.getByRole("status")).toContainText("Ana Paula · 06 out · Terça · 09:00");
  await page.getByRole("button", { name: "Revisar agendamento" }).click();
  await expect(page.getByRole("radio", { name: /09:00 Disponível/ })).toBeChecked();
  await page.getByRole("button", { name: "Reiniciar agenda" }).click();
  await expect(page.getByLabel("Nome fictício completo")).toHaveValue("");
});

test("0012 soma áreas e bloqueia excesso e entrada inválida", async ({ page }) => {
  await page.goto("/preview/fundamentals/assisted-field-architecture-studio/");
  await expect(page.getByRole("status")).toContainText("85 m² alocados");
  await expect(page.getByRole("status")).toContainText("15 m² livres");
  await page.getByLabel("Quartos (m²)").fill("60");
  await expect(page.getByRole("status")).toContainText("5 m² de excesso");
  await expect(page.getByRole("button", { name: "Salvar programa" })).toBeDisabled();
  await page.getByLabel("Quartos (m²)").fill("55");
  await expect(page.getByRole("status")).toContainText("0 m² livres");
  await page.getByRole("button", { name: "Salvar programa" }).click();
  await expect(page.getByRole("status")).toContainText("Programa salvo");
  await page.getByLabel("Quartos (m²)").fill("55,1");
  await expect(page.getByRole("status")).toContainText("0,1 m² de excesso");
  await expect(page.getByRole("button", { name: "Salvar programa" })).toBeDisabled();
  await page.getByLabel("Sala (m²)").fill("-1");
  await expect(page.getByRole("status")).toContainText("Corrija as áreas");
  await expect(page.getByRole("button", { name: "Salvar programa" })).toBeDisabled();
  await page.getByRole("button", { name: "Reiniciar programa" }).click();
  await expect(page.getByRole("status")).toContainText("85 m² alocados");
});

test("0013 centavos corretos e estorno sem efeito duplicado", async ({ page }) => {
  await page.goto("/preview/fundamentals/assisted-field-financial-platform/");
  await page.getByLabel("Descrição", { exact: true }).fill("Receita local");
  for (const invalid of ["0,00", "-30,00", "1,2,3", "1.25", "10,123", "1.000.000,01"]) {
    await page.getByLabel("Valor (R$)").fill(invalid);
    await expect(page.getByRole("button", { name: "Adicionar lançamento" })).toBeDisabled();
  }
  await page.getByLabel("Valor (R$)").fill("250,50");
  await page.getByRole("button", { name: "Adicionar lançamento" }).click();
  await expect(page.getByRole("status")).toContainText(/R\$\s*1.250,50/);
  await page.getByLabel("Descrição", { exact: true }).fill("Transporte local");
  await page.getByLabel("Valor (R$)").fill("30,25");
  await page.getByRole("combobox", { name: "Tipo", exact: true }).selectOption("expense");
  await page.getByLabel("Valor (R$)").press("Enter");
  await expect(page.getByRole("status")).toContainText(/R\$\s*1.220,25/);
  await page.getByRole("button", { name: "Estornar Transporte local" }).dblclick();
  await expect(page.getByRole("status")).toContainText(/R\$\s*1.250,50/);
  await expect(page.locator(".ledger-lines li")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Estornar Transporte local" })).toBeDisabled();
  await page.getByRole("button", { name: "Reiniciar livro-caixa" }).click();
  await expect(page.getByRole("status")).toContainText(/R\$\s*1.000,00/);
});

test("0014 ficha mantém spoiler escondido e avaliação por teclado", async ({ page }) => {
  await page.goto("/preview/fundamentals/assisted-field-reading-community/");
  await page.getByLabel("Título do livro").fill("Dom Casmurro");
  await page.getByLabel("Autor", { exact: true }).fill("Machado de Assis");
  await page.getByRole("radio", { name: "4 estrelas" }).check();
  await page.getByRole("radio", { name: "4 estrelas" }).press("ArrowRight");
  await expect(page.getByRole("radio", { name: "5 estrelas" })).toBeChecked();
  await page.getByLabel("Anotações").fill("Curta");
  await expect(page.getByRole("button", { name: "Registrar ficha" })).toBeDisabled();
  await page.getByLabel("Anotações").fill("A narrativa preserva uma dúvida que transforma toda a leitura.");
  await page.getByLabel("Contém spoiler").check();
  await page.getByRole("button", { name: "Registrar ficha" }).click();
  await expect(page.locator("#reading-saved-notes")).toBeHidden();
  await page.getByRole("button", { name: "Revelar anotação" }).click();
  await expect(page.locator("#reading-saved-notes")).toBeVisible();
  await page.getByRole("button", { name: "Editar ficha" }).click();
  await expect(page.getByRole("radio", { name: "5 estrelas" })).toBeChecked();
  await page.getByRole("button", { name: "Registrar ficha" }).click();
  await expect(page.locator("#reading-saved-notes")).toBeHidden();
  await page.getByRole("button", { name: "Nova ficha" }).click();
  await expect(page.getByLabel("Título do livro")).toHaveValue("");
});

test("0015 compara tempos e impede rota para a mesma origem", async ({ page }) => {
  await page.goto("/preview/fundamentals/assisted-field-mobility-brand/");
  await page.getByLabel("Origem", { exact: true }).fill("Praça Central");
  await page.getByLabel("Destino", { exact: true }).fill("Parque das Fontes");
  await page.getByLabel("Distância da rota (km)").fill("4,5");
  await expect(page.getByRole("radio", { name: /Bike Vita.*18 min/ })).toBeVisible();
  await expect(page.getByRole("radio", { name: /EcoCar 1.0.*5 min/ })).toBeVisible();
  await expect(page.getByRole("radio", { name: /MetroBus L3.*7 min/ })).toBeVisible();
  await page.getByRole("radio", { name: /EcoCar/ }).check();
  await page.getByRole("button", { name: "Planejar rota" }).click();
  await expect(page.getByRole("status")).toContainText("EcoCar 1.0 · 5 min");
  await page.getByLabel("Destino", { exact: true }).fill("  praca   CENTRAL ");
  await expect(page.getByRole("button", { name: "Planejar rota" })).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("precisam ser diferentes");
  await page.getByLabel("Destino", { exact: true }).fill("Parque das Fontes");
  for (const value of ["0", "201", "4,5,6"]) {
    await page.getByLabel("Distância da rota (km)").fill(value);
    await expect(page.getByRole("button", { name: "Planejar rota" })).toBeDisabled();
  }
});

test("0016 capacidade recalcula e exige correção explícita da meta", async ({ page }) => {
  await page.goto("/preview/fundamentals/assisted-field-creative-school/");
  await page.getByLabel("Nome do estudante").fill("Marina Costa");
  await page.getByLabel("Trilha de aulas").selectOption("Ilustração");
  await page.getByRole("slider", { name: "Meta de módulos" }).fill("6");
  await expect(page.getByRole("button", { name: "Confirmar plano" })).toBeEnabled();
  await page.getByRole("radio", { name: "1 aula/semana" }).check();
  await expect(page.getByRole("slider")).toHaveValue("6");
  await expect(page.getByRole("status")).toContainText("3 módulos acima");
  await expect(page.getByRole("button", { name: "Confirmar plano" })).toBeDisabled();
  await page.getByRole("button", { name: "Ajustar à capacidade" }).click();
  await expect(page.getByRole("slider")).toHaveValue("3");
  await page.getByRole("button", { name: "Confirmar plano" }).click();
  await expect(page.getByRole("status")).toContainText("Marina Costa · Ilustração · 3 módulos");
  await page.getByRole("button", { name: "Revisar plano" }).click();
  await expect(page.getByLabel("Nome do estudante")).toHaveValue("Marina Costa");
  await page.getByRole("button", { name: "Reiniciar plano" }).click();
  await expect(page.getByRole("slider")).toHaveValue("4");
});

test("0017 preço discriminado, quantidade limitada e pedido revisável", async ({ page }) => {
  await page.goto("/preview/fundamentals/assisted-field-design-store/");
  await expect(page.getByRole("button", { name: "Confirmar pedido" })).toBeDisabled();
  await page.getByRole("combobox", { name: "Coleção", exact: true }).selectOption("ceramica");
  await page.getByRole("button", { name: "Aumentar quantidade" }).click();
  await page.getByRole("radio", { name: /Expresso/ }).check();
  await expect(page.locator(".order-total")).toContainText(/R\$\s*417,00/);
  await expect(page.locator(".order-receipt")).toContainText(/R\$\s*378,00/);
  await page.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(page.getByRole("combobox", { name: "Coleção", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Revisar pedido" }).click();
  await expect(page.getByLabel("Quantidade", { exact: true })).toHaveValue("2");
  for (const value of ["0", "1,5", "9", ""]) {
    await page.getByLabel("Quantidade", { exact: true }).fill(value);
    await expect(page.getByRole("button", { name: "Confirmar pedido" })).toBeDisabled();
  }
  await page.getByLabel("Quantidade", { exact: true }).fill("8");
  await expect(page.getByRole("button", { name: "Aumentar quantidade" })).toBeDisabled();
  await page.getByRole("button", { name: "Novo pedido" }).click();
  await expect(page.getByLabel("Quantidade", { exact: true })).toHaveValue("1");
});

test("0018 valida unidade e limpa leitura ao mudar iniciativa no iframe", async ({ page }) => {
  const entry = entries.find(item => item.challengeNumber === 18)!;
  await page.goto(entryHref(entry));
  const frame = page.frameLocator("iframe");
  await frame.getByLabel("Iniciativa acompanhada").selectOption("aguas");
  await frame.getByLabel(/Valor acumulado/).fill("600000");
  await expect(frame.getByRole("meter")).toHaveAttribute("aria-valuenow", "50");
  await frame.getByLabel("Iniciativa acompanhada").selectOption("floresta");
  await expect(frame.getByLabel(/Valor acumulado/)).toHaveValue("");
  await frame.getByLabel(/Valor acumulado/).fill("1,5");
  await expect(frame.getByRole("button", { name: "Guardar leitura" })).toBeDisabled();
  await frame.getByLabel(/Valor acumulado/).fill("16000");
  await frame.getByLabel(/Valor acumulado/).press("Enter");
  await expect(frame.getByRole("status")).toContainText("50% da meta");
  await expect(frame.getByRole("status")).toBeFocused();
  await frame.getByRole("button", { name: "Novo registro" }).click();
  await expect(frame.getByLabel("Iniciativa acompanhada")).toBeFocused();
  await frame.getByLabel("Iniciativa acompanhada").selectOption("residuos");
  await frame.getByLabel(/Valor acumulado/).fill("170,5");
  await expect(frame.locator(".meter-scale>strong")).toHaveText("50,1%");
  for (const invalid of ["0", "341", "1,2,3"]) {
    await frame.getByLabel(/Valor acumulado/).fill(invalid);
    await expect(frame.getByRole("button", { name: "Guardar leitura" })).toBeDisabled();
  }
});

test("todos os exemplos carregam em detalhe e iframe sem overflow ou erro", async ({ page }) => {
  test.setTimeout(180000);
  const failures: string[] = [];
  page.on("pageerror", error => failures.push(error.message));
  page.on("console", message => { if (message.type() === "error") failures.push(message.text()); });
  for (const entry of entries) {
    await page.goto(entryHref(entry));
    await expect(page.getByRole("heading", { name: entry.title, exact: true, level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /tela cheia/i })).toHaveAttribute("href", previewHref(entry));
    const frame = page.frameLocator("iframe");
    await expect(frame.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${entry.id}: detalhe`).toBe(true);
    expect(await frame.locator("body").evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${entry.id}: iframe`).toBe(true);
  }
  expect(failures).toEqual([]);
});
