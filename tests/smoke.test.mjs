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
