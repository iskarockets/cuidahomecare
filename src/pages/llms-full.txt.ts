import type { APIRoute } from "astro";

/**
 * /llms-full.txt — texto integral da página para assistentes de IA.
 * Gerado no build para acompanhar o domínio configurado em site.config.mjs.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site!.origin;
  const hoje = new Date().toISOString().slice(0, 10);

  const corpo = `# Cuida Home Care — conteúdo completo

> Cuidado domiciliar para idosos no ABC e região de São Paulo.
> Fonte: ${base}/ · Atualizado em ${hoje}

## Hero

Cuidadores de idosos em SP

Cuidar exige mais do que amor. Exige experiência, rotina e presença.

Contamos com uma equipe de cuidadores altamente capacitada e especializada. Cuidados paliativos, desospitalização e atendimento em domicílio com ética, qualidade e segurança, experiência real, equipe capacitada, atendimento humanizado e apoio á familia, é com a Cuida.

CTA: faça um orçamento → WhatsApp (11) 99560-4988

## Trabalhe conosco

Trabalhe conosco! → https://forms.gle/6UT8xqQmGfVTc1Pv5

Cuidar exige mais do que amor. Exige experiência, rotina e presença.

## Diferenciais

- Equipe supervisionada e com formação contínua
- Apoio emocional também para a família
- Escuta acolhedora antes de qualquer proposta
- Experiência real com mais de 10 anos na gestão de cuidados

## Institucional

Porque a gente entende antes de oferecer.

A Cuida. nasceu de quem já viveu o cuidado por dentro — na família, em casas de repouso e no home care.

## Nossos serviços

- **Terceirização ILPI** — Sem burocracia e com confiança
- **Cuidado domiciliar continuado** — Cuidadores treinados e supervisionados
- **Acompanhamento hospitalar** — Cuidador no hospital e retorno seguro
- **Consultoria para famílias** — Decida entre home care ou casa de repouso

CTA: Solicite uma visita → WhatsApp (11) 99560-4988

## Como funciona?

1. **Contato Inicial**
2. **Visita de Acolhimento** — Proposta de plano
3. **Início do atendimento** — Acompanhamento contínuo

## Por que a Cuida?

- Cuidar com quem já viveu o cuidado na pele
- Atendimento consultivo: escutamos antes de oferecer
- Equipe supervisionada e com treinamento contínuo
- Relacionamento próximo com a família

## Frase de destaque

Quando cuidar de quem você ama exige mais do que amor, a Cuida entende.

## O que a Cuida faz?

- **Nutrição** — Preparo de refeições, planejamento da dieta. Ideal para a pessoa assistida que fica sozinha e precisa de além do cuidado.
- **Transporte e tarefas** — Acompanhamento á consultas, exames, e atividades.
- **Serviços domésticos** — Troca de cama, retirada de lixo, cuidados com o pet de estimação, lavanderia.
- **Cuidado Essenciais** — Higiene e banho, cuidado com a pele e cabelos, higiene dental, medicações, rotina.
- **Terceirização para ILPI** — Precisa reduzir custos e contratar profissionais de confiança? Deixe a gestão de escala com a Cuida;

## Fale com a Cuida

Experiência real · Equipe capacitada · Atendimento humanizado · Apoio à família · Cursos e Palestras · Suporte ILPI

- Telefone e WhatsApp: (11) 99560-4988
- WhatsApp alternativo: (11) 91577-7784
- E-mail: contato.cuidahomecare@gmail.com
- Instagram: @cuidahomecare
- Avaliação no Google: https://share.google/2A5HTlqv7qSVXIpPY

## Área de atendimento

Service area business: atendimento no ABC e região (São Paulo), sem endereço fixo de atendimento ao público.
`;

  return new Response(corpo, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
