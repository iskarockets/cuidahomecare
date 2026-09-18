import type { APIRoute } from "astro";

/**
 * robots.txt gerado no build, para a linha Sitemap acompanhar o domínio
 * configurado em site.config.mjs. Ver docs/requisitos-tecnicos-fixos.md §7.3.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site!.origin;

  const corpo = `# Cuida Home Care
# Crawlers de busca e de IA são bem-vindos.

User-agent: *
Allow: /

# Assistentes de IA (Navegação Agêntica)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${base}/sitemap.xml
`;

  return new Response(corpo, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
