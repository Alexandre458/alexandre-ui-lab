"use client";

import dynamic from "next/dynamic";

const demos = {
  "BTN-001": dynamic(() => import("@/demos/buttons/confirmation-button"), { ssr: false, loading: () => <div className="demo-loading" role="status">Carregando demonstração…</div> }),
  "INPUT-001": dynamic(() => import("@/demos/inputs/smart-email-field"), { ssr: false, loading: () => <div className="demo-loading" role="status">Carregando demonstração…</div> }),
  "CARD-001": dynamic(() => import("@/demos/cards/editorial-collection-card"), { ssr: false, loading: () => <div className="demo-loading" role="status">Carregando demonstração…</div> }),
  "LOGIN-001": dynamic(() => import("@/demos/login/workspace-login"), { ssr: false, loading: () => <div className="demo-loading" role="status">Carregando demonstração…</div> }),
  "HERO-001": dynamic(() => import("@/demos/hero/atelier-hero"), { ssr: false, loading: () => <div className="demo-loading" role="status">Carregando demonstração…</div> }),
  "FUND-0006": dynamic(() => import("@/demos/fundamentals/contextual-action-button"), { ssr: false, loading: () => <div className="demo-loading" role="status">Carregando demonstração…</div> }),
  "FUND-0007": dynamic(() => import("@/demos/fundamentals/contextual-action-store"), { ssr: false, loading: () => <div className="demo-loading" role="status">Carregando demonstração…</div> }),
};

export function PreviewDemo({ id }: { id: string }) { const Component = demos[id as keyof typeof demos]; return Component ? <Component /> : null; }
