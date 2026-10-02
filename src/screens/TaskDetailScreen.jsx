import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadTasks, updateTask } from "../storage.js";
import { validateTitle } from "../lib/taskLogic.js";

export default function TaskDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task] = useState(() => loadTasks().find((t) => t.id === id));
  const [title, setTitle] = useState(task ? task.title : "");
  const [note, setNote] = useState(task ? task.note : "");
  const [error, setError] = useState("");

  if (!task) return <div style={styles.container}><p role="alert" style={styles.label}>ไม่พบงานนี้ (อาจถูกลบแล้ว)</p></div>;

  const save = () => {
    const v = validateTitle(title);
    if (!v.ok) { setError(v.error); return; }
    if (!updateTask(id, { title: v.title, note })) { setError("บันทึกลงเครื่องไม่ได้ (พื้นที่เต็มหรือถูกบล็อก)"); return; }
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <label htmlFor="title" style={styles.label}>ชื่องาน</label>
      <input id="title" style={styles.input} value={title} aria-invalid={!!error} onChange={(e) => { setTitle(e.target.value); setError(""); }} />
      {error && <div role="alert" style={styles.error}>{error}</div>}
      <label htmlFor="note" style={styles.label}>รายละเอียด</label>
      <textarea id="note" style={{ ...styles.input, minHeight: 120 }} value={note} onChange={(e) => setNote(e.target.value)} />
      <button style={styles.primary} onClick={save}>บันทึก</button>
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
  label: {
    display: "block",
    color: "#8a7d70",
    margin: "12px 0 4px"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "white",
    border: "1px solid #E5D5C0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16
  },
  error: {
    color: "#b3422f",
    fontSize: 14,
    marginTop: 6
  },
  primary: {
    width: "100%",
    background: "#9F8772",
    color: "white",
    border: 0,
    borderRadius: 8,
    padding: 12,
    fontWeight: 600,
    marginTop: 20,
    cursor: "pointer"
  },
};
