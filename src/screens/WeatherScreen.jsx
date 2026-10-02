import useWeather from "../hooks/useWeather.js";
import { CODES } from "../lib/weatherService.js";

function WeatherCard({ data, t, note }) {
  const c = data.current;
  return (
    <div style={styles.card}>
      <div style={styles.muted}>กรุงเทพฯ</div>
      <div style={styles.temp}>{Math.round(c.temperature_2m)}°C</div>
      <div style={styles.desc}>{CODES[c.weather_code] || "—"}</div>
      <div style={styles.muted}>ความชื้น {c.relative_humidity_2m}% · ลม {c.wind_speed_10m} กม./ชม.</div>
      <div style={styles.muted}>อัปเดต {new Date(t).toLocaleTimeString("th-TH")}{note}</div>
    </div>
  );
}

export default function WeatherScreen() {
  const { state, reload } = useWeather();
  const loading = state.status === "loading";

  return (
    <div style={styles.container}>
      {loading && <p role="status" style={styles.muted}>กำลังโหลด…</p>}
      {state.status === "ok" && <WeatherCard data={state.data} t={state.t} note={state.fromCache ? " (จากแคช ≤10 นาที)" : ""} />}
      {state.status === "error" && (
        <>
          <div role="alert" style={styles.card}><span style={styles.error}>โหลดข้อมูลสภาพอากาศไม่สำเร็จ (อาจไม่มีอินเทอร์เน็ต)</span></div>
          {state.stale && <WeatherCard data={state.stale.d} t={state.stale.t} note=" (ข้อมูลเก่า)" />}
        </>
      )}
      <button style={styles.primary} disabled={loading} onClick={reload}>รีเฟรช</button>
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
  card: {
    background: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  temp: {
    fontSize: 48,
    fontWeight: 600
  },
  desc: {
    fontSize: 18,
    marginBottom: 4
  },
  muted: {
    color: "#8a7d70",
    fontSize: 14
  },
  error: {
    color: "#b3422f"
  },
  primary: {
    width: "100%",
    background: "#9F8772",
    color: "white",
    border: 0,
    borderRadius: 8,
    padding: 12,
    fontWeight: 600,
    cursor: "pointer"
  },
};
