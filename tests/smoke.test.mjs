import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("app script parses as a self-contained browser IIFE", () => {
  assert.match(app, /^\(\(\)=>\{["']use strict["'];/);
  assert.match(app, /\}\)\(\);\s*$/);
});

test("task data is validated before it is accepted from storage", () => {
  assert.match(app, /const validTask\s*=/);
  assert.match(app, /const validTaskList\s*=/);
  assert.match(app, /s\?\.version===1&&validTaskList\(s\.tasks\)/);
  assert.match(app, /if\(s\?\.version!==1\|\|!validTaskList\(s\.tasks\)\)return/);
});

test("backup import has size and field validation safeguards", () => {
  assert.match(app, /d\.tasks\.length>10000/);
  assert.match(app, /new Set\(\)/);
  assert.match(app, /confirm\(["']Import/);
  assert.match(app, /That backup file is invalid or unreadable/);
});

test("failed writes restore the previous task state", () => {
  assert.match(app, /if\(!save\(\)\)\{state\.tasks=previousTasks;render\(\);return\}/);
  assert.match(app, /window\.addEventListener\(["']storage["']/);
});

test("all primary UI assets are linked from the homepage", () => {
  assert.match(html, /href=["']styles\.css["']/);
  assert.match(html, /src=["']app\.js["']/);
  assert.match(html, /id=["']taskList["']/);
  assert.match(html, /id=["']taskForm["']/);
});

test("mobile layout keeps task editing and deletion controls available", () => {
  const css = readFile(new URL("../styles.css", import.meta.url), "utf8");
  return css.then(source => {
    assert.match(source, /@media\s*\(max-width:\s*700px\)/);
    assert.match(source, /\.task-actions \.edit-task\s*\{[^}]*display:\s*inline-flex/s);
    assert.match(source, /\.task-actions \.delete-task\s*\{[^}]*min-width:\s*36px/s);
  });
});

test("backup download URL is kept alive briefly for browser download startup", () => {
  assert.match(app, /a\.click\(\);setTimeout\(\(\)=>URL\.revokeObjectURL\(u\),1000\)/);
});

test("homepage provides a keyboard skip link to the main content", async () => {
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(html, /class=["']skip-link["'] href=["']#mainContent["']/);
  assert.match(html, /<main class=["']main-content["'] id=["']mainContent["']/);
  assert.match(css, /\.skip-link:focus\s*\{/);
});
