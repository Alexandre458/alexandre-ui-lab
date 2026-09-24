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
  assert.equal(searchEntries("CPF").some(entry => entry.id === "FUND-0011"), true);
  assert.deepEqual(searchEntries("clínica", "buttons"), []);
});
