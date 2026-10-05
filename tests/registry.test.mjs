import test from "node:test";
import assert from "node:assert/strict";
import { entries, categories, getEntry, searchEntries } from "../src/registry/entries.ts";

test("Registry mantém IDs, números e URLs únicos", () => {
  for (const key of ["id", "challengeNumber", "slug"]) assert.equal(new Set(entries.map(entry => entry[key])).size, entries.length, key);
  const knownCategories = new Set(categories.map(category => category.slug));
  assert.equal(new Set(entries.map(entry => entry.category)).size, categories.length, "categorias representadas");
  for (const entry of entries) { assert.ok(knownCategories.has(entry.category)); assert.equal(getEntry(entry.category, entry.slug)?.id, entry.id); }
});

test("busca localiza IDs, descrição, categoria e tags", () => {
  assert.equal(searchEntries("LOGIN-001")[0]?.id, "LOGIN-001");
  assert.equal(searchEntries("validação").some(entry => entry.id === "INPUT-001"), true);
  assert.equal(searchEntries("editorial").some(entry => entry.id === "CARD-001"), true);
  assert.equal(searchEntries("FUND-0008")[0]?.id, "FUND-0008");
  assert.equal(searchEntries("contextual")[0]?.id, "FUND-0006");
  assert.equal(searchEntries("FUND-0009")[0]?.id, "FUND-0009");
  assert.equal(searchEntries("cultural").some(entry => entry.id === "FUND-0009"), true);
  assert.equal(searchEntries("FUND-0010")[0]?.id, "FUND-0010");
  assert.equal(searchEntries("software").some(entry => entry.id === "FUND-0010"), true);
  assert.equal(searchEntries("FUND-0011")[0]?.id, "FUND-0011");
  assert.equal(searchEntries("clínica").some(entry => entry.id === "FUND-0011"), true);
  assert.equal(searchEntries("horários").some(entry => entry.id === "FUND-0011"), true);
  assert.equal(searchEntries("FUND-0012")[0]?.id, "FUND-0012");
  assert.equal(searchEntries("arquitetura").some(entry => entry.id === "FUND-0012"), true);
  assert.equal(searchEntries("áreas").some(entry => entry.id === "FUND-0012"), true);
  assert.equal(searchEntries("FUND-0013")[0]?.id, "FUND-0013");
  assert.equal(searchEntries("financeira").some(entry => entry.id === "FUND-0013"), true);
  assert.equal(searchEntries("transações").some(entry => entry.id === "FUND-0013"), true);
  assert.equal(searchEntries("valor").some(entry => entry.id === "FUND-0013"), true);
  assert.equal(searchEntries("FUND-0014")[0]?.id, "FUND-0014");
  assert.equal(searchEntries("leitura").some(entry => entry.id === "FUND-0014"), true);
  assert.equal(searchEntries("comunidade").some(entry => entry.id === "FUND-0014"), true);
  assert.equal(searchEntries("FUND-0015")[0]?.id, "FUND-0015");
  assert.equal(searchEntries("mobilidade").some(entry => entry.id === "FUND-0015"), true);
  assert.equal(searchEntries("rota").some(entry => entry.id === "FUND-0015"), true);
  assert.equal(searchEntries("FUND-0016")[0]?.id, "FUND-0016");
  assert.equal(searchEntries("escola").some(entry => entry.id === "FUND-0016"), true);
  assert.equal(searchEntries("trilha").some(entry => entry.id === "FUND-0016"), true);
  assert.equal(searchEntries("FUND-0017")[0]?.id, "FUND-0017");
  assert.equal(searchEntries("coleção").some(entry => entry.id === "FUND-0017"), true);
  assert.equal(searchEntries("pedido").some(entry => entry.id === "FUND-0017"), true);
  assert.equal(searchEntries("FUND-0018")[0]?.id, "FUND-0018");
  assert.equal(searchEntries("ambiental").some(entry => entry.id === "FUND-0018"), true);
  assert.equal(searchEntries("acessibilidade").some(entry => entry.id === "FUND-0018"), true);
  assert.equal(searchEntries("FUND-0019")[0]?.id, "FUND-0019");
  assert.equal(searchEntries("bilheteria").some(entry => entry.id === "FUND-0019"), true);
  assert.equal(searchEntries("produtora").some(entry => entry.id === "FUND-0019"), true);
  assert.equal(searchEntries("eventos").some(entry => entry.id === "FUND-0019"), true);
  assert.equal(searchEntries("FUND-0020")[0]?.id, "FUND-0020");
  assert.equal(searchEntries("branch").some(entry => entry.id === "FUND-0020"), true);
  assert.equal(searchEntries("colisão").some(entry => entry.id === "FUND-0020"), true);
  assert.deepEqual(searchEntries("mobilidade", "buttons"), []);
  assert.deepEqual(searchEntries("leitura", "buttons"), []);
  assert.deepEqual(searchEntries("financeira", "buttons"), []);
  assert.deepEqual(searchEntries("arquitetura", "buttons"), []);
  assert.deepEqual(searchEntries("clínica", "buttons"), []);
});
