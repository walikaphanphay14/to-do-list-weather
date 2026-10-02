import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTasks from "../hooks/useTasks.js";
import { filterTasks } from "../lib/taskLogic.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const FILTERS = [["all", "ทั้งหมด"], ["active", "ยังไม่ได้ทำ"], ["done", "เสร็จแล้ว"]];

export default function TaskListScreen() {
  const navigate = useNavigate();
  const { tasks, error, add, toggle, remove, clearError } = useTasks();
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [pending, setPending] = useState(null);

  const shown = filterTasks(tasks, filter, query);
  const submit = () => { if (add(text)) setText(""); };
  const confirmRemove = () => { remove(pending.id); setPending(null); };

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <input
          style={styles.input} value={text} placeholder="เพิ่มงานใหม่…" aria-label="ชื่องานใหม่"
          aria-invalid={!!error} onChange={(e) => { setText(e.target.value); if (error) clearError(); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button style={styles.primary} onClick={submit}>เพิ่ม</button>
      </div>
      {error && <div role="alert" style={styles.error}>{error}</div>}
      <input style={{ ...styles.input, marginTop: 8 }} value={query} placeholder="ค้นหา…" aria-label="ค้นหางาน" onChange={(e) => setQuery(e.target.value)} />
      <div style={{ ...styles.row, margin: "12px 0" }} role="group" aria-label="กรองงาน">
        {FILTERS.map(([key, label]) => (
          <button key={key} aria-pressed={filter === key} style={filter === key ? { ...styles.chip, ...styles.chipOn } : styles.chip} onClick={() => setFilter(key)}>{label}</button>
        ))}
      </div>
      {shown.length === 0 && (
        <p style={styles.muted}>{tasks.length === 0 ? "ยังไม่มีงาน" : "ไม่พบงาน"}</p>
      )}
      <ul style={styles.list}>
        {shown.map((t) => (
          <li key={t.id} style={styles.card}>
            <input type="checkbox" style={styles.check} checked={t.done} aria-label={`ทำเครื่องหมายเสร็จ: ${t.title}`} onChange={() => toggle(t)} />
            <button style={t.done ? { ...styles.title, ...styles.titleDone } : styles.title} onClick={() => navigate(`/task/${t.id}`)}>{t.title}</button>
            <button style={styles.del} aria-label={`ต้องการลบงาน ${t.title}`} onClick={() => setPending(t)}>ลบ</button>
          </li>
        ))}
      </ul>
      {pending && (
        <ConfirmDialog
          title="ต้องการลบงานนี้?" message={`"${pending.title}" จะถูกลบ`} confirmText="ลบ"
          onConfirm={confirmRemove} onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 16,
    maxWidth: 560,
    margin: "0 auto",
    boxSizing: "border-box"
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  input: {
    flex: 1,
    width: "100%",
    boxSizing: "border-box",
    background: "white",
    border: "1px solid #E5D5C0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16
  },
  primary: {
    background: "#9F8772",
    color: "white",
    border: 0,
    borderRadius: 8,
    padding: "11px 16px",
    fontWeight: 600,
    cursor: "pointer"
  },
  error: {
    color: "#b3422f",
    fontSize: 14,
    marginTop: 6
  },
  chip: {
    background: "transparent",
    color: "#9F8772",
    border: "1px solid #9F8772",
    borderRadius: 16,
    padding: "6px 14px",
    cursor: "pointer"
  },
  chipOn: {
    background: "#9F8772",
    color: "white"
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8
  },
  check: {
    width: 20,
    height: 20,
    accentColor: "#9F8772"
  },
  title: {
    flex: 1,
    textAlign: "left",
    background: "none",
    border: 0,
    padding: 0,
    fontSize: 16,
    color: "inherit",
    cursor: "pointer"
  },
  titleDone: {
    textDecoration: "line-through",
    color: "#a89a8c"
  },
  del: {
    background: "#9F8772",
    color: "white",
    border: 1,
    borderRadius: 10,
    padding: "5px 14px",
    fontWeight: 600,
    cursor: "pointer"
  },
  muted: {
    color: "#8a7d70",
    textAlign: "center",
    marginTop: 24
  },
};
