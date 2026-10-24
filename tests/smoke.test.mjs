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

test("backup import rejects oversized files before reading them", () => {
  assert.match(app, /if\(f\.size>5\*1024\*1024\)throw 0;let d=JSON\.parse\(await f\.text\(\)\)/);
});

test("search results can be cleared with a keyboard-accessible control", () => {
  assert.match(html, /id=["\x27]clearSearchBtn["\x27][^>]*aria-label=["\x27]Clear search["\x27]/);
  assert.match(app, /\$\("#clearSearchBtn"\)\.hidden=!hasSearch/);
  assert.match(app, /\$\("#clearSearchBtn"\)\.onclick=\(\)=>\{\$\("#searchInput"\)\.value="";render\(\);\$\("#searchInput"\)\.focus\(\)\}/);
});

test("brand identity has a custom SVG favicon and consistent responsive mark", async () => {
  const favicon = await readFile(new URL("../favicon.svg", import.meta.url), "utf8");
  assert.match(html, /rel=["\x27]icon["\x27][^>]*href=["\x27]favicon\.svg["\x27]/);
  assert.match(html, /class=["\x27]brand-mark["\x27][^>]*><svg viewBox=/);
  assert.match(html, /DayPilot — Make Space for What Matters/);
  assert.match(favicon, /<svg[^>]*viewBox=["\x27]0 0 48 48/);
});
