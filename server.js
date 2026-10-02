const express = require("express");
const path = require("path");
const app = express();


let cache = null;
app.get("/api/weather", async (req, res) => {
  if (cache && Date.now() - cache.t < 10 * 60 * 1000) return res.json(cache.d);
  try {
    const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.52&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code");
    const d = await r.json();
    cache = { t: Date.now(), d };
    res.json(d);
  } catch (e) {
    res.status(502).json({ error: "upstream" });
  }
});


const dist = path.join(__dirname, "dist");
app.use(express.static(dist));
app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
app.listen(process.env.PORT || 3000, "0.0.0.0", () => console.log("running"));
