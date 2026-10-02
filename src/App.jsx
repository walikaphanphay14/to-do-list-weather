import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import TaskListScreen from "./screens/TaskListScreen.jsx";
import TaskDetailScreen from "./screens/TaskDetailScreen.jsx";
import WeatherScreen from "./screens/WeatherScreen.jsx";

const TITLES = { "/": "รายการที่ต้องทำ", "/weather": "สภาพอากาศ" };

export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === "/";
  const title = TITLES[pathname] || "รายละเอียดงาน";

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.side}>
          {!isHome && <button style={styles.headerBtn} onClick={() => navigate("/")}>ย้อนกลับ</button>}
        </div>
        <h1 style={styles.title}>{title}</h1>
        <div style={{ ...styles.side, textAlign: "right" }}>
          {isHome && <button style={styles.headerBtn} onClick={() => navigate("/weather")}>สภาพอากาศ</button>}
        </div>
      </header>
      <Routes>
        <Route path="/" element={<TaskListScreen />} />
        <Route path="/task/:id" element={<TaskDetailScreen />} />
        <Route path="/weather" element={<WeatherScreen />} />
        <Route path="*" element={<TaskListScreen />} />
      </Routes>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8F0E5",
    color: "#3b2f25"
  },
  header: {
    display: "flex",
    alignItems: "center",
    background: "#DAC0A3",
    color: "white",
    padding: "12px 16px",
    position: "sticky",
    top: 0,
    zIndex: 1
  },
  side: {
    flex: 1
  },
  title: {
    margin: 0,
    fontWeight: 600,
    fontSize: 18,
    textAlign: "center"
  },
  headerBtn: {
    background: "#9F8772",
    color: "white",
    border: 0,
    borderRadius: 8,
    padding: "6px 12px", 
    cursor: "pointer"
  },
};
