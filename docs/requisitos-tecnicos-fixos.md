# Requisitos técnicos fixos — padrão de toda LP

> Colado por inteiro do briefing (NFR14). Não referenciar por link: este arquivo é autossuficiente.
> Origem: `briefing-dev-cuidahomecare-performance-2026-09-17.md` §7, via PRD Apêndice A.

### 7.1 SEO on-page

- [ ] `<title>` 50-60 chars: "Cuida Home Care" + "ABC e região" (é service area business, **sem ponto fixo** — manter a área como já está no Google, sem inventar endereço)
- [ ] `<h1>` único, nome real **em texto puro** (não só dentro do logo)
- [ ] `meta description` 150-160 chars com CTA
- [ ] `<link rel="canonical">` pro domínio definitivo
- [ ] `meta robots: index, follow, max-image-preview:large`
- [ ] charset UTF-8, viewport, `theme-color`, `lang="pt-BR"`
- [ ] HTML semântico: header/nav/main/section/footer, hierarquia H2/H3

### 7.2 Performance (o objetivo do projeto)

- [ ] **Responsividade real** (o site atual não tem): mobile-first, breakpoints funcionando, sem scroll horizontal, toque confortável. Testar em 360px, 390px, 768px, 1280px, 1920px
- [ ] Zero framework de render no cliente. HTML estático servido pronto
- [ ] CSS crítico inline no `<head>`, resto adiado
- [ ] Fontes `.woff2` subset + `font-display: swap` + preload só do hero
- [ ] Imagens WebP/AVIF, dimensões explícitas, lazy fora do hero, `fetchpriority=high` no LCP
- [ ] Cache `immutable` de 1 ano pra `/assets/*` no `vercel.json`
- [ ] Meta de laboratório (Moto G / 4G): FCP e LCP < 1,5s · TBT < 100ms · CLS < 0,1 · Desempenho 90+

### 7.3 Navegação Agêntica 3/3

- [ ] `/llms.txt` na raiz, Markdown, **pelo menos 1 H1 + links** (hoje o site está 1/2 por não ter)
- [ ] `/llms-full.txt` expandido com o texto das seções
- [ ] `robots.txt` liberando crawlers de IA + linha `Sitemap:`

### 7.4 Acessibilidade (hoje está 87 — manter ou subir)

- [ ] Contraste AA, `alt` em toda imagem informativa, foco visível, labels em links de ícone (WhatsApp), ordem de heading correta

### 7.5 Segurança / headers

- [ ] `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security` aplicados ao site inteiro (não só `/`)
- [ ] Página 404 personalizada
