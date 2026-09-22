// Minimal static file server for the built `out/` directory.
// Usage: node serve-out.js <port>
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = parseInt(process.argv[2] || "4321", 10);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    // Strip the GitHub Pages basePath when present, since out/ already contains it.
    urlPath = urlPath.replace(/^\/Portfolio-Website/, "");
    if (urlPath === "/") urlPath = "/index.html";

    let filePath = path.join(root, urlPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const cand = path.join(filePath, "index.html");
      if (fs.existsSync(cand)) filePath = cand;
      else {
        res.writeHead(404);
        res.end("not found");
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500);
    res.end(String(err && err.message));
  }
});

server.listen(port, () => {
  console.log("Serving " + root + " on http://localhost:" + port);
});
