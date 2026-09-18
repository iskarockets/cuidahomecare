# Migração para o domínio .com.br

**Decisão:** o cliente vai comprar `cuidahomecare.com.br`, que passa a ser o **domínio
principal**. O `.com` continua registrado e **redireciona** para ele.

---

## O que já está pronto no código (18/09)

A troca do domínio principal é **uma linha**. Tudo que dependia do endereço passou a derivar
de um arquivo só:

```js
// site.config.mjs
export const SITE_URL = "https://cuidahomecare.com";
```

Derivam dele, automaticamente:

| Arquivo                        | O que usa o domínio               |
| ------------------------------ | --------------------------------- |
| `src/layouts/BaseLayout.astro` | tag `canonical`                   |
| `src/pages/robots.txt.ts`      | linha `Sitemap:`                  |
| `src/pages/sitemap.xml.ts`     | `<loc>` da home                   |
| `src/pages/llms.txt.ts`        | links do arquivo agêntico         |
| `src/pages/llms-full.txt.ts`   | linha "Fonte"                     |
| `scripts/check-links.mjs`      | hosts próprios permitidos no gate |

**Testado de ponta a ponta:** trocando a linha para `.com.br`, os cinco arquivos gerados saíram
com o domínio novo e o gate de qualidade continuou passando. Depois foi revertido — o valor
atual é o `.com`, e assim deve permanecer até o `.com.br` existir de verdade.

⚠️ **Não troque a linha antes do domínio estar no ar.** Canonical apontando para endereço
inexistente faz o Google desindexar o site, e reverter isso é lento.

---

## Antes de comprar: duas recomendações

1. **Registre no CNPJ do cliente**, não no da ISKR. O domínio é ativo da empresa dele. Se ficar
   no seu nome, qualquer troca de fornecedor no futuro vira negociação.
2. **O registro.br exige CPF ou CNPJ válido** e vincula o domínio a essa entidade. Quem compra
   define o dono — é uma decisão difícil de desfazer depois.

---

## Passo a passo da migração

### 1. Cliente compra o domínio

Em `registro.br`, com o CNPJ da Cuida Home Care. Você precisa de acesso ao painel, ou que
alguém com acesso execute o passo 3.

### 2. Adicionar o domínio na Vercel

No projeto da Vercel: _Settings → Domains → Add_ → `cuidahomecare.com.br`.

A Vercel mostra o que configurar. Ela aceita dois caminhos:

| Caminho                   | Quando usar                                                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nameservers da Vercel** | Recomendado aqui. O domínio é novo, não tem e-mail, nada a preservar. A Vercel passa a administrar a zona inteira, e o certificado sai sozinho |
| **Registros A / CNAME**   | Se quiserem manter o DNS no registro.br                                                                                                        |

Use **os valores que a Vercel mostrar na tela** — não valores de tutorial, que mudam com o tempo.

### 3. Configurar no registro.br

Se escolher nameservers: no painel do domínio, trocar os servidores DNS pelos que a Vercel
indicou. Se escolher registros: usar a opção de editar a zona e criar o `A` do apex e o `CNAME`
do `www`.

### 4. Esperar propagação e certificado

Poucos minutos, normalmente. A Vercel emite o HTTPS sozinha quando o DNS resolve. **Não siga
para o passo 5 antes de o site abrir em `https://cuidahomecare.com.br`.**

### 5. Trocar o domínio principal no código

```js
// site.config.mjs
export const SITE_URL = "https://cuidahomecare.com.br";
```

Commit e push em `main` → a Vercel republica com o canonical certo.

Na Vercel, marque o `.com.br` como **domínio principal** do projeto.

### 6. Colocar o .com para redirecionar

Adicione também o `.com` ao mesmo projeto e configure como **redirect** para o `.com.br`. A
Vercel faz 308 preservando o caminho, que o Google trata como 301.

Depois, no painel do `.com` (Tucows/revendedor), aponte o `A` do apex e o `www` para a Vercel.

⚠️ **Não toque no MX do `.com`.** O registro do Google continua lá, intacto. Ver
`docs/guias/dns-cutover.md`.

### 7. Google Search Console

1. Criar a propriedade de `cuidahomecare.com.br` e verificar.
2. Enviar o sitemap novo.
3. Na propriedade do `.com`, usar **Configurações → Mudança de endereço**, apontando para o
   `.com.br`. É isso que faz o Google transferir os sinais em vez de tratar como site novo.

A ferramenta exige que as duas propriedades estejam verificadas e que o redirect já funcione.

### 8. Atualizar o endereço fora do site

- **Perfil da Empresa no Google** — é o que mais pesa no ranking local. Atualizar a URL.
- **Instagram** (`@cuidahomecare`) — link da bio.
- Qualquer material impresso, assinatura de e-mail ou anúncio com o endereço antigo.

---

## Depois da migração

**Nunca deixe o `.com` expirar.** O redirect só vale enquanto vocês forem donos dele. Domínio
com histórico que cai na rede é recolhido rápido, e aí o redirect vira link para terceiro.

**Mantenha os dois apontando para o mesmo projeto Vercel.** Um serve o site, o outro
redireciona. Se os dois responderem 200 com o mesmo conteúdo, aí sim os dois competem entre si
no Google — que é exatamente o que essa configuração evita.
