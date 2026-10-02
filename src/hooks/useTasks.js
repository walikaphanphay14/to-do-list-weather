import { useState } from "react";
import { loadTasks, addTask, updateTask, removeTask } from "../storage.js";
import { validateTitle } from "../lib/taskLogic.js";

const SAVE_ERROR = "บันทึกลงเครื่องไม่ได้ (พื้นที่เต็มหรือถูกบล็อก)";

export default function useTasks() {
  const [tasks, setTasks] = useState(loadTasks);
  const [error, setError] = useState("");
  const refresh = () => setTasks(loadTasks());

  const add = (raw) => {
    const v = validateTitle(raw);
    if (!v.ok) { setError(v.error); return false; }
    if (!addTask(v.title)) { setError(SAVE_ERROR); return false; }
    setError("");
    refresh();
    return true;
  };
  const change = (fn) => {
    if (!fn()) setError(SAVE_ERROR);
    refresh();
  };
  const toggle = (t) => change(() => updateTask(t.id, { done: !t.done }));
  const remove = (id) => change(() => removeTask(id));
  const clearError = () => setError("");

  return { tasks, error, add, toggle, remove, clearError };
}
