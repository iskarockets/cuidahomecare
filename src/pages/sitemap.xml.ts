import type { APIRoute } from "astro";

/**
 * Sitemap gerado no build. O site tem uma única página indexável
 * (a 404 é noindex), então não vale a pena uma integração dedicada.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site!.origin;
  const hoje = new Date().toISOString().slice(0, 10);

  const corpo = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${hoje}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

  return new Response(corpo, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
