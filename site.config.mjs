/**
 * Domínio principal do site — fonte única.
 *
 * Tudo que depende do domínio deriva daqui: a tag canonical, o robots.txt,
 * o sitemap.xml, os arquivos de Navegação Agêntica e o gate de links.
 * Trocar o domínio principal é mudar ESTA linha e rodar o build.
 *
 * ── Migração planejada para .com.br ────────────────────────────────────────
 * O cliente vai comprar o domínio .com.br, que passa a ser o principal.
 * O .com continua registrado e redireciona para ele (308 pela Vercel).
 *
 * ORDEM CORRETA (não inverter):
 *   1. Comprar o .com.br e apontar o DNS para a Vercel.
 *   2. Adicionar os dois domínios no projeto da Vercel.
 *   3. SÓ ENTÃO trocar o valor abaixo para o .com.br e publicar.
 *
 * Trocar antes do domínio existir faz a tag canonical apontar para um
 * endereço morto — o Google desindexa o site e o estrago demora a reverter.
 */
export const SITE_URL = "https://cuidahomecare.com";

// Quando o .com.br estiver no ar, troque pela linha abaixo:
// export const SITE_URL = 'https://cuidahomecare.com.br';
