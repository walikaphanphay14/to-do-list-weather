import react from "@vitejs/plugin-react";
export default { plugins: [react()], server: { host: true, proxy: { "/api": "http://localhost:3000" } } };
