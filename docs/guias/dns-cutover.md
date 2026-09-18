# DNS do cuidahomecare.com — situação real e plano de cutover

**Levantado em:** 2026-09-18, por consulta pública (RDAP da Verisign + DNS-over-HTTPS do Google)
**Status:** ⚠️ **contradiz o briefing em um ponto crítico**

---

## 🔴 O achado que muda o plano

O briefing afirma, na §6:

> ✅ **SEM e-mail no domínio** (confirmado pelo Lucas em 17/09). Por isso o apontamento total é
> seguro: **não há MX pra preservar**. Este é o caso em que se pode trocar nameservers sem risco.

**Isso está errado. O domínio TEM e-mail ativo.**

```
MX:  1 smtp.google.com    (TTL 300)
TXT: google-site-verification=g8loayq82hzujo7yuitwlfjy9yy9aoszejl5ehtmlmw
```

`smtp.google.com` é o registro MX do **Google Workspace**. O TXT de verificação confirma.
Existe e-mail corporativo funcionando nesse domínio.

**Consequência se seguíssemos o briefing:** apontar os nameservers para a Vercel apagaria a zona
DNS atual, junto com o MX. **O e-mail do cliente pararia de funcionar** — provavelmente sem
ninguém entender o motivo, porque o site estaria no ar normalmente.

Era exatamente o desastre que o briefing dizia ser impossível.

---

## Situação atual do domínio

| Item                    | Valor                                                |
| ----------------------- | ---------------------------------------------------- |
| Registrador de registro | **Tucows Domains Inc.** (IANA 69)                    |
| Registrado em           | 2025-07-04                                           |
| Expira em               | 2027-07-04                                           |
| Última alteração        | 2026-09-01                                           |
| Status no registro      | `clientTransferProhibited`, `clientUpdateProhibited` |
| Nameservers             | `ns1/ns2/ns3.systemdns.com`                          |
| Operador da zona        | OpenSRS / Tucows (`hostmaster.systemdns.com`)        |
| A (apex)                | `103.169.142.0` → rede **CANVAPTYLTD-AU** (Canva)    |
| A (www)                 | `103.169.142.0` (mesmo destino)                      |
| MX                      | `1 smtp.google.com` — **Google Workspace ativo**     |
| TXT                     | verificação do Google                                |

**Sobre o registrador:** a Tucows é registradora de atacado — ela não vende direto ao
consumidor. Quem comprou o domínio comprou de um **revendedor** da Tucows/OpenSRS. O painel de
acesso é o do revendedor, não o `tucows.com`. O revendedor não aparece na consulta pública.

---

## O e-mail está configurado, mas provavelmente nunca foi usado (18/09)

O cliente informou que não usa e-mail corporativo, só Gmail. As consultas de DNS sustentam
isso:

| Registro                       | Situação       | O que indica                                     |
| ------------------------------ | -------------- | ------------------------------------------------ |
| MX `smtp.google.com`           | existe         | Google Workspace foi **iniciado** no domínio     |
| `google-site-verification`     | existe         | a propriedade do domínio chegou a ser verificada |
| **SPF** (`v=spf1`)             | **não existe** | envio nunca foi configurado                      |
| **DKIM** (`google._domainkey`) | **não existe** | assinatura nunca foi configurada                 |
| **DMARC** (`_dmarc`)           | **não existe** | política nunca foi configurada                   |

Um Workspace em uso real tem, no mínimo, SPF. A ausência dos três indica configuração
**começada e abandonada** — bate com o relato do cliente. O contato de verdade é o
`contato.cuidahomecare@gmail.com`, Gmail comum, que é inclusive o publicado no site.

**Mesmo assim, não apague o MX.** Só o MX já basta para **receber**. Se alguém escreveu para
`@cuidahomecare.com` em algum momento, essas mensagens caem numa caixa do Workspace. Manter o
registro custa zero e elimina a chance de descobrir o contrário do jeito ruim.

---

## Não existe painel de hospedagem

Verificado em 18/09: nenhum dos subdomínios típicos de hospedagem responde.

```
cpanel  webmail  mail  ftp  autodiscover  painel  admin   →  todos inexistentes
```

O site é servido pela **Canva** (headers confirmam Cloudflare na frente, IP na rede
`CANVAPTYLTD-AU`). Não há servidor, cPanel, FTP ou webmail em lugar nenhum.

**O que existe é um painel de domínio/DNS**, no revendedor da Tucows. É só isso que precisa
ser pedido.

⚠️ **O domínio é `.com`, não `.com.br` — o registro.br não tem nada a ver com ele.** O
registro.br administra apenas domínios brasileiros. Pedir acesso a ele é caminho sem saída.

**Hipótese mais provável de onde está:** comprado **dentro da própria Canva**. As evidências
apontam para isso — domínio registrado em 04/07/2025 (perto da publicação do site), registradora
de atacado (Tucows) com nameservers padrão do OpenSRS, site publicado pela Canva, e nenhum outro
serviço configurado no domínio. A Canva vende domínios dentro do editor de sites e administra o
DNS deles.

**Onde conferir:** na conta Canva do cliente, abrir o projeto do site → _Configurações →
Domínio_. Se o domínio aparecer ali como gerenciado pela Canva, o painel é esse — e o acesso
provavelmente já existe, já que alguém publica o site por lá.

---

## Plano de cutover corrigido

### ❌ O que NÃO fazer

Não trocar os nameservers para a Vercel. Isso descarta a zona atual e derruba o e-mail.

### ✅ O que fazer

Manter a zona DNS onde está e alterar **apenas os registros do site**:

| Registro                          | De                  | Para                                     |
| --------------------------------- | ------------------- | ---------------------------------------- |
| `A` do apex (`cuidahomecare.com`) | `103.169.142.0`     | o IP que a Vercel indicar                |
| `www`                             | `103.169.142.0`     | `CNAME` para o alvo que a Vercel indicar |
| **MX**                            | `1 smtp.google.com` | **não tocar**                            |
| **TXT** do Google                 | verificação         | **não tocar**                            |

Os valores exatos de destino aparecem na Vercel em _Settings → Domains_, ao adicionar o
domínio. Use **os que a Vercel mostrar**, não valores decorados de tutorial.

### Por que essa abordagem é melhor aqui

1. **O e-mail não corre risco** — o MX nem é tocado.
2. **O bloqueio `clientUpdateProhibited` não atrapalha.** Esse status impede alterações no
   registro do domínio (nameservers, contatos), mas não impede editar registros dentro da zona.
   Trocar nameservers exigiria remover o bloqueio antes; trocar registros, não.
3. **Rollback em minutos.** Basta devolver o A anterior (`103.169.142.0`). O TTL do MX é de
   300 segundos, e o da zona é baixo — a volta é rápida.

---

## O que pedir ao cliente

O acesso necessário é ao **painel de DNS do domínio**. Roteiro para pedir sem gerar confusão:

> "Preciso de acesso ao painel onde o domínio cuidahomecare.com foi comprado, para apontar o
> site novo. Não vou mexer no e-mail — ele continua funcionando igual.
>
> Se não souberem qual é o painel, procure no e-mail por mensagens de renovação ou compra do
> domínio: o remetente é a empresa onde ele está. O registro consta na Tucows, que trabalha por
> revendedores, então o painel é o de quem vendeu."

Se não acharem, três caminhos:

1. **Buscar no e-mail** por "cuidahomecare.com", "renovação de domínio", "domain renewal".
2. **Ver quem gerencia o Google Workspace** — quem configurou o e-mail provavelmente também
   configurou o domínio, e costuma ser a mesma pessoa ou agência.
3. **Último recurso:** o e-mail administrativo do domínio recebe as notificações de renovação.
   Um "esqueci minha senha" no painel do revendedor, quando descoberto, resolve.

**Do que precisamos, no mínimo:** permissão para editar os registros `A` e `CNAME` da zona.
Não precisamos de acesso de transferência nem de propriedade do domínio.

---

## Ordem de execução no dia do cutover

1. Preview validado e aceito (Story 2.2).
2. Exportar e salvar a zona DNS atual inteira — plano de rollback.
3. Adicionar o domínio no projeto da Vercel e anotar os valores que ela pedir.
4. Alterar **só** o `A` do apex e o `www` no painel do domínio.
5. Aguardar propagação (TTL baixo — minutos).
6. Verificar, nesta ordem:
   - site abre em `https://cuidahomecare.com` e em `https://www.cuidahomecare.com`;
   - certificado HTTPS emitido pela Vercel;
   - **enviar e receber um e-mail de teste no domínio** — a verificação que o briefing não previu;
   - headers de segurança respondendo (`curl -I`);
   - PageSpeed em produção.
