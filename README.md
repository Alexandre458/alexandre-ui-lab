# Alexandre UI Lab

Catálogo interativo de componentes, seções e interfaces criados por [Alexandre Oliveira da Silva](https://alexandresilva.dev). Endereço de publicação: [ui.alexandresilva.dev](https://ui.alexandresilva.dev).

Cada exemplo tem um ID estável, uma página de detalhe e uma prévia funcional. O catálogo permite busca por ID, título, categoria, descrição e tags; as páginas de detalhe oferecem visualização em tamanhos desktop, tablet e mobile.

## Stack

Next.js 16 (App Router e exportação estática), React 19, TypeScript 5, Tailwind CSS 4, ESLint e Playwright. O gerenciador de pacotes é npm.

## Rodar localmente

Use Node.js 24 e npm 11. Em WSL, carregue o Node Linux do NVM antes dos comandos: `source /home/wsl/.nvm/nvm.sh`.

```bash
npm ci
npm run dev
```

## Qualidade

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npm run test:static
```

O build gera `out/`, um site estático que pode ser servido sem processo Node permanente. O Playwright testa o desenvolvimento em 1440, 768 e 375 px e o artifact exportado em desktop.

## Estrutura

- `src/app/`: páginas, metadados, SEO e rotas de detalhe/preview.
- `src/registry/entries.ts`: metadados leves, IDs e busca.
- `src/components/lab/`: catálogo, cards e controles de viewport.
- `src/demos/`: interfaces interativas importadas sob demanda na prévia.
- `tests/`: invariantes do Registry e testes de comportamento no navegador.

Para adicionar um exemplo, crie a demo, registre seus metadados em `entries.ts`, associe um import dinâmico em `preview-demo.tsx` e execute os gates. IDs e slugs publicados permanecem estáveis.

As demos usam apenas dados fictícios e interações locais. Formulários não autenticam nem enviam credenciais.

Código e histórico: [github.com/Alexandre458/alexandre-ui-lab](https://github.com/Alexandre458/alexandre-ui-lab).
