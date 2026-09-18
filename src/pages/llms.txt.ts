import type { APIRoute } from "astro";
import { contatos } from "../data/contatos";

/**
 * /llms.txt — Navegação Agêntica (docs/requisitos-tecnicos-fixos.md §7.3).
 * Gerado no build para que os links acompanhem o domínio configurado.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site!.origin;

  const corpo = `# Cuida Home Care

> Cuidado domiciliar para idosos no ABC e região de São Paulo. Cuidadores treinados e supervisionados, cuidados paliativos, desospitalização, acompanhamento hospitalar e terceirização para ILPI. A empresa nasceu de quem já viveu o cuidado por dentro — na família, em casas de repouso e no home care.

## Serviços

- **Cuidado domiciliar continuado** — cuidadores treinados e supervisionados
- **Acompanhamento hospitalar** — cuidador no hospital e retorno seguro
- **Terceirização ILPI** — gestão de escala para instituições de longa permanência
- **Consultoria para famílias** — ajuda a decidir entre home care ou casa de repouso

## O que está incluído

Nutrição e preparo de refeições, transporte e acompanhamento a consultas, serviços domésticos, cuidados essenciais de higiene e medicação.

## Como funciona

1. Contato inicial
2. Visita de acolhimento e proposta de plano
3. Início do atendimento com acompanhamento contínuo

## Links

- [Site](${base}/)
- [Conteúdo completo](${base}/llms-full.txt)
- [WhatsApp](https://wa.me/5511995604988)
- [Instagram](${contatos.instagram})
- [Trabalhe conosco](${contatos.trabalheConosco})

## Contato

- Telefone e WhatsApp: (11) 99560-4988
- E-mail: ${contatos.email}
- Atendimento: ABC e região (São Paulo), sem ponto fixo
`;

  return new Response(corpo, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
