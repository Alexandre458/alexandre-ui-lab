import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";

const root = resolve("out");
const mime = {
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};

createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }
  const candidate = resolve(root, `.${pathname}`);
  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end();
    return;
  }
  const file = pathname.endsWith("/") ? join(candidate, "index.html") : candidate;
  try {
    if (!statSync(file).isFile()) throw new Error("Not a file");
  } catch {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": mime[extname(file)] ?? "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  createReadStream(file).pipe(response);
}).listen(4317, "127.0.0.1");
