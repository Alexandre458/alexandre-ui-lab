# Publicação

O CI instala dependências, executa lint, typecheck, testes de Registry, Playwright em três viewports, build estático, um teste de navegador do artifact exportado e inspeção de privacidade. O teste do artifact confirma que o iframe de produção mantém origem isolada e que as demos continuam interativas. Em push para `main`, publica o artifact `out/`. O workflow de produção roda somente após esse CI ter concluído com sucesso para um push do próprio repositório na branch `main`.

O deploy usa um usuário SSH dedicado, envia o artifact para uma release nomeada pelo SHA e troca o symlink `current` de forma atômica. O script `ops/activate-release.sh` verifica a home e a primeira demo; se falhar, restaura o symlink anterior. Pull Requests não recebem secrets de produção.

O site é servido como arquivos estáticos pelo Nginx. Não há processo Node nem porta interna da aplicação. A configuração de Nginx versionada está em `ops/nginx/`. As credenciais de SSH e a chave de host verificada são armazenadas no GitHub Environment `production`, nunca no repositório.

A chave SSH dedicada já está autorizada para o usuário de deploy; antes da primeira publicação, um administrador deve concluir a configuração do Environment e dos cinco secrets. O workflow falha explicitamente se faltar algum secret. Não publique artifacts manualmente para substituir o fluxo de CI/deploy.
