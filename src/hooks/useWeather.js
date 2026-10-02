import { useState, useEffect, useRef, useCallback } from "react";
import { getWeather, readCache } from "../lib/weatherService.js";

export default function useWeather() {
  const [state, setState] = useState({ status: "loading" });
  const ctrl = useRef(null);
  const reqId = useRef(0);

  const load = useCallback(async (force = false) => {
    ctrl.current?.abort();             
    const ac = new AbortController();
    ctrl.current = ac;
    const id = ++reqId.current;          
    setState({ status: "loading" });
    try {
      const r = await getWeather({ force, signal: ac.signal });
      if (id === reqId.current) setState({ status: "ok", ...r });
    } catch {
      if (ac.signal.aborted || id !== reqId.current) return;
      setState({ status: "error", stale: readCache() });
    }
  }, []);

  useEffect(() => {
    load(false);
    return () => { reqId.current++; ctrl.current?.abort(); }; 
  }, [load]);

  return { state, reload: () => load(true) };
}
