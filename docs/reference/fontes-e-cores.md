# Fontes e cores do site atual

> Medido dos estilos computados em 2026-09-17.

## Tipografia medida

Duas famílias, com nomes ofuscados pelo Canva e **tabela `name` apagada** nos arquivos
(família = `"."`), o que impede identificação e verificação de licença.

| Nome no site  | Papel            | Tamanhos encontrados (canvas 1920) |
| ------------- | ---------------- | ---------------------------------- |
| `YAFdJkQTgbI` | Display serifada | 67 · 64 · 58 · 46 · 28 · 25 px     |
| `YAEnXArs1iQ` | Sans             | 41 · 25 · 24 · 21 · 19 px          |

### Uso por elemento

| Elemento                     | Família | Tamanho | Peso                   |
| ---------------------------- | ------- | ------- | ---------------------- |
| Frase do hero                | Display | 67 px   | 400, com trecho em 700 |
| "Nossos serviços"            | Display | 64 px   | 700                    |
| "Porque a gente entende"     | Display | 58 px   | 400 + 700              |
| Frase de destaque            | Display | 46 px   | 400 + 700              |
| "Trabalhe conosco!"          | Display | 28 px   | 400                    |
| "Cuidadores de idosos em SP" | Display | 25 px   | 400                    |
| Institucional (corpo)        | Sans    | 41 px   | 400 + 700              |
| Título dos cards de serviço  | Sans    | 24 px   | 700                    |
| Subtítulo dos cards          | Sans    | 19 px   | 400                    |
| "faça um orçamento"          | Sans    | 25 px   | 700                    |
| "Solicite uma visita"        | Sans    | 19 px   | 700                    |

### Substitutos adotados

| Papel   | Substituto       | Licença |
| ------- | ---------------- | ------- |
| Display | Playfair Display | SIL OFL |
| Sans    | Poppins          | SIL OFL |

Pendente de confirmação — ver `pendencias.md` §1.

## Paleta medida

Ordenada por área ocupada na página.

| Hex       | Nome no projeto     | Onde aparece                      |
| --------- | ------------------- | --------------------------------- |
| `#FFFFFF` | `--cor-branco`      | Fundos neutros                    |
| `#0F1015` | `--cor-preto`       | Faixas escuras                    |
| `#F1F1F0` | `--cor-cinza-claro` | Seções alternadas                 |
| `#FAF4E9` | `--cor-creme`       | Hero e rodapé                     |
| `#988CA1` | `--cor-roxo`        | Cards de serviço, ícones          |
| `#FBDB68` | `--cor-amarelo`     | "Como funciona?", botão de visita |
| `#AB93B1` | `--cor-lilas`       | Etiqueta e faixa de destaque      |
| `#A5B3A1` | `--cor-verde-sage`  | "Por que a Cuida?"                |
| `#353539` | `--cor-texto`       | Texto principal                   |
| `#222222` | `--cor-texto-forte` | Títulos                           |
| `#F4F1EC` | `--cor-creme-claro` | Texto sobre fundo escuro          |

## Correções de contraste aplicadas

Três combinações do site original reprovam no WCAG AA. Correção autorizada pelo Lucas em
17/09 (PRD FR2.1).

| Combinação                 | Antes     | Depois        | Como                       |
| -------------------------- | --------- | ------------- | -------------------------- |
| Texto nos cards de serviço | 3,19:1 ❌ | **4,53:1** ✅ | Roxo `#988CA1` → `#7E7191` |
| Texto sobre o verde sage   | 2,20:1 ❌ | **5,6:1** ✅  | Branco → `#353539`         |
| Texto sobre o lilás        | 2,59:1 ❌ | **4,72:1** ✅ | Branco → `#353539`         |

A terceira foi descoberta durante a implementação (Stories 1.4 e 1.7), depois da spec.
