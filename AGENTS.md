# Alexandre UI Lab

Este é um repositório Git independente. Confirme `git rev-parse --show-toplevel` antes de qualquer operação Git e preserve alterações existentes. Responda ao proprietário em pt-BR.

## Arquitetura pública

Next.js App Router, React, TypeScript, Tailwind CSS e exportação estática. `src/registry/entries.ts` contém metadados leves; o catálogo não deve importar demos. Cada demo vive em `src/demos/` e é carregada por import dinâmico em `src/components/lab/preview-demo.tsx`. A página `/{category}/{slug}/` apresenta o exemplo, e `/preview/{category}/{slug}/` executa a demo isolada em iframe.

## Convenções

- Cada exemplo publicado tem ID, número, slug e categoria únicos e estáveis.
- Novas categorias devem ser adicionadas ao Registry sem criar rotas manuais por item.
- Use conteúdo realista e dados locais. Não conecte login, pagamentos ou formulários a serviços reais.
- Prefira elementos semânticos, labels, teclado, foco visível e movimento reduzido quando necessário.
- Teste desktop, tablet e mobile; evite overflow horizontal.
- Não edite `out/` ou `.next/` como fonte.

## Comandos

Use npm com Node Linux no WSL, carregando NVM antes do primeiro comando. Execute `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e` e `npm run build`. O CI deve passar antes de publicação.

Não faça commit ou push sem pedido explícito ou autorização aplicável à tarefa corrente.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
