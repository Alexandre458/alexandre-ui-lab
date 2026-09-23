export type Entry = {
  id: string; challengeNumber: number; title: string; description: string;
  category: string; subcategory: string; slug: string; tags: string[];
  technologies: string[]; responsive: boolean; darkMode: boolean;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  createdAt: string; features: string[]; sourcePath: string;
  thumbnail: "button" | "input" | "card" | "login" | "hero" | "fundamentals";
};

export const categories = [
  { slug: "buttons", title: "Botões", description: "Ações pequenas, expressivas e acessíveis." },
  { slug: "inputs", title: "Campos", description: "Entradas claras para experiências melhores." },
  { slug: "cards", title: "Cards", description: "Informação com composição e personalidade." },
  { slug: "login", title: "Login", description: "Interfaces de acesso prontas para explorar." },
  { slug: "hero", title: "Hero", description: "Primeiras impressões que comunicam valor." },
  { slug: "fundamentals", title: "Fundamentos", description: "Interações essenciais para experiências completas." },
] as const;

export const entries: Entry[] = [
  { id: "BTN-001", challengeNumber: 1, title: "Botão de confirmação", description: "Uma ação com feedback imediato, estados de carregamento e sucesso.", category: "buttons", subcategory: "Actions", slug: "confirmation-button", tags: ["button", "feedback", "loading"], technologies: ["React", "CSS"], responsive: true, darkMode: false, difficulty: "Iniciante", createdAt: "2026-09-16", features: ["Loading local", "Confirmação visual", "Foco visível"], sourcePath: "src/demos/buttons/confirmation-button.tsx", thumbnail: "button" },
  { id: "INPUT-001", challengeNumber: 2, title: "Campo inteligente", description: "Campo de e-mail com orientação, validação e estados claros.", category: "inputs", subcategory: "Form Fields", slug: "smart-email-field", tags: ["input", "validation", "email"], technologies: ["React", "CSS"], responsive: true, darkMode: false, difficulty: "Iniciante", createdAt: "2026-09-16", features: ["Validação local", "Mensagens acessíveis", "Estados de foco"], sourcePath: "src/demos/inputs/smart-email-field.tsx", thumbnail: "input" },
  { id: "CARD-001", challengeNumber: 3, title: "Card de coleção", description: "Um convite editorial para descobrir uma coleção fictícia.", category: "cards", subcategory: "Editorial", slug: "editorial-collection-card", tags: ["card", "editorial", "collection"], technologies: ["React", "CSS"], responsive: true, darkMode: false, difficulty: "Iniciante", createdAt: "2026-09-16", features: ["Composição responsiva", "Ação interativa", "Sem imagens externas"], sourcePath: "src/demos/cards/editorial-collection-card.tsx", thumbnail: "card" },
  { id: "LOGIN-001", challengeNumber: 4, title: "Login Workspace", description: "Uma tela de acesso SaaS com feedback local e visual marcante.", category: "login", subcategory: "Auth", slug: "workspace-login", tags: ["login", "auth", "form", "saas"], technologies: ["React", "CSS"], responsive: true, darkMode: true, difficulty: "Intermediário", createdAt: "2026-09-16", features: ["Mostrar senha", "Validação local", "Nenhum envio de credenciais"], sourcePath: "src/demos/login/workspace-login.tsx", thumbnail: "login" },
  { id: "HERO-001", challengeNumber: 5, title: "Hero Atelier", description: "Seção de abertura editorial para um estúdio criativo fictício.", category: "hero", subcategory: "Landing", slug: "atelier-hero", tags: ["hero", "landing", "editorial"], technologies: ["React", "CSS"], responsive: true, darkMode: false, difficulty: "Intermediário", createdAt: "2026-09-16", features: ["Tipografia editorial", "Navegação local", "Layout adaptativo"], sourcePath: "src/demos/hero/atelier-hero.tsx", thumbnail: "hero" },
  { id: "FUND-0006", challengeNumber: 6, title: "Botão de ação contextual", description: "Botão que alterna entre repouso, execução e confirmação em uma escola criativa.", category: "fundamentals", subcategory: "Contextual Actions", slug: "contextual-action-button", tags: ["button", "contextual", "progress", "education"], technologies: ["React", "CSS"], responsive: true, darkMode: false, difficulty: "Iniciante", createdAt: "2026-09-17", features: ["Estados contextuais", "Barra de progresso", "Feedback visual"], sourcePath: "src/demos/fundamentals/contextual-action-button.tsx", thumbnail: "fundamentals" },
  { id: "FUND-0007", challengeNumber: 7, title: "Botão de ação contextual para loja de design", description: "Botão que alterna entre repouso, processamento e confirmação de pedido em uma loja de design.", category: "fundamentals", subcategory: "Contextual Actions", slug: "contextual-action-store", tags: ["button", "contextual", "order", "design"], technologies: ["React", "CSS"], responsive: true, darkMode: false, difficulty: "Iniciante", createdAt: "2026-09-18", features: ["Estados contextuais", "Barra de progresso", "Número de pedido"], sourcePath: "src/demos/fundamentals/contextual-action-store.tsx", thumbnail: "fundamentals" },
  { id: "FUND-0008", challengeNumber: 8, title: "Botão de ação contextual para plataforma ambiental", description: "Botão que alterna entre repouso, análise e atualização de indicadores de sustentabilidade.", category: "fundamentals", subcategory: "Contextual Actions", slug: "contextual-action-environmental", tags: ["button", "contextual", "indicator", "environmental"], technologies: ["React", "CSS"], responsive: true, darkMode: false, difficulty: "Iniciante", createdAt: "2026-09-21", features: ["Estados contextuais", "Barra de progresso", "Timestamp de atualização"], sourcePath: "src/demos/fundamentals/contextual-action-environmental.tsx", thumbnail: "fundamentals" },
  { id: "FUND-0009", challengeNumber: 9, title: "Botão de ação contextual para produtora cultural", description: "Botão que alterna entre repouso, reserva e confirmação de ingressos em uma produtora cultural.", category: "fundamentals", subcategory: "Contextual Actions", slug: "contextual-action-cultural-producer", tags: ["button", "contextual", "event", "tickets", "cultural"], technologies: ["React", "CSS"], responsive: true, darkMode: false, difficulty: "Iniciante", createdAt: "2026-09-22", features: ["Estados contextuais", "Barra de progresso", "Número de ingresso"], sourcePath: "src/demos/fundamentals/contextual-action-cultural-producer.tsx", thumbnail: "fundamentals" },
];

export function getEntry(category: string, slug: string) { return entries.find(entry => entry.category === category && entry.slug === slug); }
export function entryHref(entry: Entry) { return `/${entry.category}/${entry.slug}/`; }
export function previewHref(entry: Entry) { return `/preview/${entry.category}/${entry.slug}/`; }
export function searchEntries(query: string, category = "all") {
  const term = query.trim().toLocaleLowerCase("pt-BR");
  return entries.filter(entry => (category === "all" || entry.category === category) && (!term || [entry.id, entry.title, entry.description, entry.category, entry.subcategory, ...entry.tags].join(" ").toLocaleLowerCase("pt-BR").includes(term)));
}
