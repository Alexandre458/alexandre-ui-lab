# Arquitetura

## Catálogo

O Registry é uma lista de objetos tipados em `src/registry/entries.ts`. Busca e filtros atuam em texto local, sem API. Cinco entradas iniciais são uma amostra; a lista pode crescer para aproximadamente mil metadados. A home importa apenas essa lista e o componente visual de cards.

## Rotas

- `/`: home e catálogo.
- `/category/[category]/`: listagem filtrada.
- `/[category]/[slug]/`: detalhe com controles de viewport e informação técnica secundária.
- `/preview/[category]/[slug]/`: interface real, também aberta em tela cheia.

Todas as rotas dinâmicas usam `generateStaticParams`. `next build` exporta HTML, CSS e JS para `out/`. O site não usa runtime de API, cookies, Server Actions nem dados por requisição. Se uma demo futura precisar dessas capacidades, reavalie esta arquitetura antes de implementá-la.

## Isolamento e bundle

Cada preview roda em iframe. Na exportação de produção ele usa `sandbox="allow-scripts"`, sem acesso à origem do catálogo; o Nginx permite CORS nos arquivos públicos para que os módulos JavaScript carreguem no iframe de origem opaca. O servidor de desenvolvimento Next.js bloqueia esses módulos quando a origem é opaca, então somente no desenvolvimento o iframe também recebe `allow-same-origin`. A folha de estilos das demos usa prefixos próprios, e `preview-demo.tsx` define imports dinâmicos em chunks separados. Adicionar uma demo exige metadados e uma entrada no mapa de imports, sem criar página manual. Uma futura demo externa ainda exige revisão das permissões e das dependências executadas.

## Segurança e acessibilidade

As demos são código próprio do repositório, com dados fictícios e estado local. Não há backend, coleta de credenciais nem chamadas a serviços sensíveis. Formulários demonstrativos usam `preventDefault`. O catálogo é navegável por teclado e os controles expõem seu estado. O build público deve ser inspecionado para evitar inclusão de arquivos locais não destinados à distribuição.
