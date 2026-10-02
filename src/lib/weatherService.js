
export const TTL = 10 * 60 * 1000; 
const KEY = "weather";
const OPEN_METEO = "https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.52&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";
export const CODES = { 0: "ท้องฟ้าแจ่มใส", 1: "ส่วนใหญ่แจ่มใส", 2: "มีเมฆบางส่วน", 3: "เมฆมาก", 45: "หมอก", 51: "ฝนปรอย", 61: "ฝนเล็กน้อย", 63: "ฝนปานกลาง", 65: "ฝนหนัก", 80: "ฝนตกเป็นช่วง", 95: "พายุฟ้าคะนอง" };

export function readCache() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
function writeCache(d, t) {
  try { localStorage.setItem(KEY, JSON.stringify({ t, d })); } catch {}
}
export function isFresh(cached, now = Date.now()) {
  return !!cached && now - cached.t < TTL;
}

async function getJson(url, signal) {
  const r = await fetch(url, { signal });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
}


export async function getWeather({ force = false, signal } = {}) {
  const cached = readCache();
  if (!force && isFresh(cached)) return { data: cached.d, t: cached.t, fromCache: true };
  let data;
  try {
    data = await getJson("/api/weather", signal);
  } catch (e) {
    if (signal?.aborted) throw e;
    data = await getJson(OPEN_METEO, signal);
  }
  const t = Date.now();
  writeCache(data, t);
  return { data, t, fromCache: false };
}
