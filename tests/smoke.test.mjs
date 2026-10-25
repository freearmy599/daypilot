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
    assert.match(source, /\.task-actions \.delete-task\s*\{[^}]*min-width:\s*44px/s);
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


test("due-time sorting respects calendar dates before comparing times", () => {
  assert.ok(app.includes('sort==="time"?(x.date!==y.date?x.date.localeCompare(y.date):(x.time||"99:99").localeCompare(y.time||"99:99"))'));
});

test("closing the task dialog restores keyboard focus to its opener", () => {
  assert.match(app, /dialogReturnFocus=document\.activeElement/);
  assert.match(app, /dialogReturnFocus\?\.isConnected\)dialogReturnFocus\.focus\(\)/);
});

test("date-sensitive task status refreshes when the app returns to view", () => {
  assert.match(app, /document\.addEventListener\(\"visibilitychange\"/);
  assert.match(app, /window\.addEventListener\(\"focus\",refreshDateContext\)/);
});


test("Escape and other native close paths restore task-dialog focus", () => {
  assert.match(app, /\$\("#taskDialog"\)\.addEventListener\("close"/);
  assert.match(app, /function closeDialog\(\)\{\$\("#taskDialog"\)\.close\(\)\}/);
});

test("daily goal editor focuses its field and restores the opener on close", () => {
  assert.match(app, /goalReturnFocus=document\.activeElement/);
  assert.match(app, /\$\("#dailyGoalInput"\)\.focus\(\)/);
  assert.match(app, /\$\("#goalDialog"\)\.addEventListener\("close"/);
});

test("keyboard help shortcut shows actionable guidance instead of repeating its trigger", () => {
  assert.match(app, /Keyboard shortcuts — N: new task · \/: focus search · Esc: close an open dialog/);
  assert.doesNotMatch(app, /Shortcuts: N = new task · \/ = search · \? = this help/);
});

test("mobile task controls meet a 44px touch target and SEO section aligns with sidebar", async () => {
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(css, /\.task-actions \.edit-task\{[^}]*min-width:44px;min-height:44px\}/);
  assert.match(css, /\.task-actions \.delete-task\{min-width:44px;min-height:44px\}/);
  assert.match(css, /\.seo-content\{[^}]*margin-left:246px\}/);
});

test("progress indicators expose live values to assistive technology", () => {
  for (const id of ["taskProgressBar", "overallProgressBar", "goalProgressBar"]) {
    assert.match(html, new RegExp(`id=["\\x27]${id}["\\x27][^>]*role=["\\x27]progressbar["\\x27]`));
    assert.match(app, new RegExp(`#${id}\\"\\)\\.setAttribute\\(\\"aria-valuenow\\"`));
  }
});

test("long task metadata can wrap on narrow screens", async () => {
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(css, /\.task-meta>span\{overflow-wrap:anywhere;min-width:0\}/);
});

test("task form offers quick date presets and live character counters", () => {
  assert.match(html, /data-date-offset="0">Today/);
  assert.match(html, /data-date-offset="1">Tomorrow/);
  assert.match(html, /data-date-offset="7">Next week/);
  assert.match(html, /id="titleCount"/);
  assert.match(html, /id="notesCount"/);
  assert.match(app, /function updateCounters\(\)/);
  assert.match(app, /\$\$\("\.date-presets button"\)\.forEach/);
});

test("task list announces the number of visible results", () => {
  assert.match(html, /id="resultsCount" aria-live="polite"/);
  assert.match(app, /\$\("#resultsCount"\)\.textContent=tasks\.length\+" "\+\(tasks\.length===1\?"task":"tasks"\)\+" shown"/);
});

test("completed-task cleanup is limited to completed view and protects state on save failure", () => {
  assert.match(html, /id="clearCompletedBtn" hidden/);
  assert.match(app, /\$\("#clearCompletedBtn"\)\.hidden=view!==\"completed\"\|\|!state\.tasks\.some\(t=>t\.completed\)/);
  assert.match(app, /Permanently remove \"\+count\+\" completed/);
  assert.match(app, /state\.tasks=state\.tasks\.filter\(t=>!t\.completed\)/);
  assert.match(app, /if\(!save\(\)\)\{state\.tasks=previousTasks;render\(\);return\}render\(\);toast\(count/);
});
