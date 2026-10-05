// Encerra qualquer servidor de E2E que ainda escutar na porta 4317 ao final da suíte.
// No Windows o next dev pode morrer sozinho no meio de uma suíte longa; o teardown
// garante a porta livre para o próximo ciclo, independentemente de ter morrido ou sido reutilizado.
import { spawn } from "node:child_process";

const PORTA = 4317;

export default async function globalTeardown() {
  const pids = await pidsEscutando(PORTA);
  for (const pid of [...new Set(pids)]) {
    try {
      process.kill(pid, "SIGTERM");
      console.log(`[teardown-e2e] pid ${pid} da porta ${PORTA} encerrado`);
    } catch (erro) {
      console.log(`[teardown-e2e] pid ${pid} da porta ${PORTA} já não existe (${erro.code})`);
    }
  }
  if (pids.length === 0) console.log(`[teardown-e2e] porta ${PORTA} já estava livre`);
}

function pidsEscutando(porta) {
  return new Promise((resolver, rejeitar) => {
    const child = spawn("netstat", ["-ano"], { windowsHide: true });
    let saida = "";
    child.stdout.on("data", dados => {
      saida += dados;
    });
    child.on("error", rejeitar);
    child.on("close", () => {
      const pids = [];
      for (const linha of saida.split(/\r?\n/)) {
        // colunas: Proto | LocalAddress | ExternalAddress | State | PID
        const celulas = linha.trim().split(/\s+/);
        if (celulas.length < 5) continue;
        if (celulas[3] !== "LISTENING") continue;
        const local = celulas[1].split(":");
        if (Number(local[local.length - 1]) !== porta) continue;
        pids.push(Number(celulas[4]));
      }
      resolver(pids);
    });
  });
}
