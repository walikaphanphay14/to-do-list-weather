import { useEffect, useRef } from "react";
export default function ConfirmDialog({ title, message, confirmText = "ตกลง", cancelText = "ยกเลิก", onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onCancelRef.current(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={styles.backdrop} onClick={onCancel}>
      <div
        role="alertdialog" aria-modal="true" aria-labelledby="dlg-title" aria-describedby="dlg-msg"
        style={styles.box} onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dlg-title" style={styles.title}>{title}</h2>
        <p id="dlg-msg" style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button ref={cancelRef} style={styles.cancel} onClick={onCancel}>{cancelText}</button>
          <button style={styles.danger} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 10
  },
  box: {
    background: "white",
    color: "#9F8772",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 360,
    boxSizing: "border-box"
  },
  title: {
    margin: "0 0 8px",
    fontSize: 18
  },
  message: {
    margin: "0 0 16px",
    color: "#6b5d50",
    wordBreak: "break-word"
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8
  },
  cancel: {
    background: "transparent",
    color: "#9F8772",
    border: "1px solid #9F8772",
    borderRadius: 8,
    padding: "9px 16px",
    cursor: "pointer"
  },
  danger: {
    background: "#9F8772",
    color: "white",
    border: 0,
    borderRadius: 8,
    padding: "9px 16px",
    fontWeight: 600,
    cursor: "pointer"
  },
};
