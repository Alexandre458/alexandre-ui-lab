import test from "node:test";
import assert from "node:assert/strict";
import { entries, categories, getEntry, searchEntries } from "../src/registry/entries.ts";

test("Registry mantém IDs, números e URLs únicos", () => {
  assert.equal(entries.length, 5);
  for (const key of ["id", "challengeNumber", "slug"]) assert.equal(new Set(entries.map(entry => entry[key])).size, entries.length, key);
  const knownCategories = new Set(categories.map(category => category.slug));
  for (const entry of entries) { assert.ok(knownCategories.has(entry.category)); assert.equal(getEntry(entry.category, entry.slug)?.id, entry.id); }
});

test("busca localiza IDs, descrição, categoria e tags", () => {
  assert.equal(searchEntries("LOGIN-001")[0]?.id, "LOGIN-001");
  assert.equal(searchEntries("validação").some(entry => entry.id === "INPUT-001"), true);
  assert.equal(searchEntries("editorial").some(entry => entry.id === "CARD-001"), true);
  assert.deepEqual(searchEntries("login", "buttons"), []);
});
