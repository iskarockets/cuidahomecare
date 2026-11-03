/**
 * Domínio principal do site — fonte única.
 *
 * Tudo que depende do domínio deriva daqui: a tag canonical, o robots.txt,
 * o sitemap.xml, os arquivos de Navegação Agêntica e o gate de links.
 * Trocar o domínio principal é mudar ESTA linha e rodar o build.
 *
 * ── Situação em 18/09/2026 ────────────────────────────────────────────────
 * O domínio .com.br foi registrado e apontado para a Vercel. Na configuração
 * do projeto, quem serve o site é o WWW; o apex redireciona para ele:
 *
 *   https://cuidahomecare.com.br      → 308 → https://www.cuidahomecare.com.br
 *   https://www.cuidahomecare.com.br  → 200   (serve o site)
 *
 * Por isso o valor abaixo tem www. O canonical precisa apontar para o endereço
 * que responde 200 — apontar para o que redireciona é sinal contraditório
 * para o Google.
 *
 * Se algum dia a Vercel for invertida (apex como Production e www como
 * redirect), esta linha tem que ser invertida junto, ou os dois passam a
 * discordar.
 *
 * O .com antigo ainda serve o site do Canva e será transformado em redirect
 * para cá — ver docs/guias/migracao-com-br.md.
 */
export const SITE_URL = "https://www.cuidahomecare.com.br";
