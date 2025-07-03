import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 4000;

// For ESM module support (like import in Node)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Proxy configuration (add your APIs here)
const proxies = [
    { route: "/students", target: "https://student-payment-app-production.up.railway.app" },
    { route: "/payments", target: "https://student-payment-app-production.up.railway.app" },
    { route: "/admin", target: "https://student-payment-app-production.up.railway.app" },
    { route: "/reports", target: "https://student-payment-app-production.up.railway.app" }
];

proxies.forEach(({ route, target }) => {
    app.use(
        route,
        createProxyMiddleware({
            target,
            changeOrigin: true,
            pathRewrite: { [`^${route}`]: "/" },
            logLevel: process.env.NODE_ENV === "production" ? "warn" : "debug",
            onProxyReq: (proxyReq, req, res) => {
                console.log(`➡️ Forwarding: ${req.method} ${req.originalUrl} → ${target}`);
            },
        })
    );
});

// Serve frontend static files (for production build)
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
