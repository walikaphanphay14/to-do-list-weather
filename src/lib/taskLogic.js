
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => Number(b.id) - Number(a.id));
}

export function filterTasks(tasks, filter, query = "") {
  const q = query.trim().toLowerCase();
  return tasks.filter(
    (t) => (filter === "all" || (filter === "done") === t.done) && t.title.toLowerCase().includes(q)
  );
}

export const MAX_TITLE = 200;
export function validateTitle(raw) {
  const title = String(raw ?? "").trim();
  if (!title) return { ok: false, error: "กรุณากรอกชื่องาน" };
  if (title.length > MAX_TITLE) return { ok: false, error: `ชื่องานต้องไม่เกิน ${MAX_TITLE} ตัวอักษร` };
  return { ok: true, title };
}
