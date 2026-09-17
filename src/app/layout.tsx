import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ui.alexandresilva.dev"),
  title: { default: "Alexandre UI Lab", template: "%s | Alexandre UI Lab" },
  description: "Uma coleção viva de componentes e interfaces interativas criadas por Alexandre Oliveira da Silva.",
  openGraph: { title: "Alexandre UI Lab", description: "Componentes e interfaces para explorar, testar e imaginar possibilidades.", url: "https://ui.alexandresilva.dev", siteName: "Alexandre UI Lab", type: "website", locale: "pt_BR" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth"><body><div className="shell"><header className="site-header"><Link href="/" className="brand" aria-label="Alexandre UI Lab, início"><span className="brand-mark">A/</span> Alexandre UI Lab</Link><nav aria-label="Navegação principal"><Link href="/#catalogo">Explorar catálogo</Link><a href="https://alexandresilva.dev" target="_blank" rel="noopener noreferrer">Portfólio ↗</a><a href="https://github.com/Alexandre458/alexandre-ui-lab" target="_blank" rel="noopener noreferrer">GitHub ↗</a></nav></header></div><main>{children}</main><div className="shell"><footer className="site-footer"><span>© {new Date().getFullYear()} Alexandre UI Lab. Feito para explorar ideias reais.</span><span>Uma criação de Alexandre Oliveira da Silva</span></footer></div></body></html>;
}
