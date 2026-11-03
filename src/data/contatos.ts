/**
 * Fonte única de verdade dos canais de contato.
 *
 * REGRAS (PRD FR5, FR6, FR9, FR10):
 * - Nenhum número, link ou mensagem escrito direto no markup.
 * - Só os canais que já existem no site atual. Adicionar canal novo exige
 *   aval do Lucas; o gate `npm test` falha se aparecer host não declarado aqui.
 * - A mensagem do WhatsApp é montada com encodeURIComponent. É isso que impede
 *   a volta do caractere corrompido (%EF%BF%BD) que existe no site do Canva.
 *
 * Todos os valores foram confirmados no DOM renderizado em 17/09/2026.
 */

export const WHATSAPP_PRINCIPAL = "5511995604988";
export const MENSAGEM_ORCAMENTO = "Olá gostaria de um orçamento.";

/**
 * WhatsApp secundário (5511915777784) — REMOVIDO em 18/09, decisão do Lucas.
 *
 * O número existe 6 vezes no blob de dados do site do Canva, sempre ligado à
 * mesma mensagem do número principal, mas **não foi localizado na interface**
 * nem pelo Lucas nem na auditoria. A página não renderiza um único elemento
 * `<a>` (o Canva liga tudo por JS), então estar no código-fonte não prova estar
 * publicado. Critério aplicado: o que não está no site atual não entra no novo.
 *
 * Ver docs/reference/pendencias.md §4.
 */

export const contatos = {
  /** CTA principal: hero, "Solicite uma visita", "Fale com a Cuida" e CTA flutuante */
  whatsappOrcamento: `https://wa.me/${WHATSAPP_PRINCIPAL}?text=${encodeURIComponent(MENSAGEM_ORCAMENTO)}`,
  /** Google Forms de recrutamento — não é captação de lead (PRD §10, divergência 2) */
  trabalheConosco: "https://forms.gle/6UT8xqQmGfVTc1Pv5",
  email: "contato.cuidahomecare@gmail.com",
  instagram: "https://www.instagram.com/cuidahomecare",
  avaliacaoGoogle: "https://share.google/2A5HTlqv7qSVXIpPY",
  /**
   * Números exibidos usam espaço inseparável ( ) e hífen inseparável (‑):
   * impedem que o telefone quebre em duas linhas no mobile. Visualmente idênticos.
   */
  telefoneExibido: "(11) 99560‑4988",
  telefoneLink: `tel:+${WHATSAPP_PRINCIPAL}`,
} as const;
