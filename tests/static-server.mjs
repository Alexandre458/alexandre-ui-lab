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
  let st;
  try {
    st = statSync(file);
  } catch (erro) {
    // ENOENT = arquivo realmente ausente; EMFILE/ESTALE etc. são transitórios (navegações abortadas)
    if (erro.code === "ENOENT") response.writeHead(404).end();
    else response.writeHead(503, { "Retry-After": "1" }).end();
    return;
  }
  if (!st.isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": mime[extname(file)] ?? "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  // Navegações interrompidas (Playwright troca de página) abortam a resposta:
  // sem destruir o read stream, cada interrupção vaza um handle e o processo
  // acaba com EMFILE, traduzido por 404s em páginas válidas.
  const stream = createReadStream(file);
  request.on("close", () => {
    if (!response.writableEnded) stream.destroy();
  });
  request.on("aborted", () => stream.destroy());
  stream.on("error", () => response.destroy());
  stream.pipe(response);
}).listen(4317, "127.0.0.1");
