
import { sortTasks } from "./lib/taskLogic.js";

const KEY = "tasks";

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]").filter((t) => !t.deleted);
  } catch { return []; }
}

function writeAll(all) {
  try { localStorage.setItem(KEY, JSON.stringify(all)); return true; } catch { return false; }
}

export function loadTasks() {
  return sortTasks(readAll());
}
export function addTask(title) {
  const all = readAll();
  all.push({ id: String(Date.now()), title, note: "", done: false });
  return writeAll(all);
}
export function updateTask(id, patch) {
  return writeAll(readAll().map((t) => (t.id === id ? { ...t, ...patch } : t)));
}
export function removeTask(id) {
  return writeAll(readAll().filter((t) => t.id !== id));
}
