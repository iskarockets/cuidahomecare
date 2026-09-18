# Importar o site na conta Vercel do cliente (pelo navegador)

**Contexto:** o código está no GitHub da **ISKR** (`iskarockets/cuidahomecare`, privado) e o
site precisa rodar na **conta Vercel do cliente**. Como não temos acesso CLI à conta do
cliente, a ligação é feita pelo navegador, uma vez só. Depois disso, todo push para `main`
publica sozinho.

> ⚠️ **Este guia NÃO toca no domínio.** Ao final você terá uma URL de preview da Vercel
> (`*.vercel.app`). O `cuidahomecare.com` continua apontando para o Canva até o cutover, que é
> a Story 2.3 e só acontece depois do seu aceite.

---

## O que você vai precisar

- Acesso à conta **Vercel do cliente** (login no navegador).
- Acesso ao GitHub **`iskarockets`** — para autorizar a Vercel a ler o repositório.

---

## Passo a passo

### 1. Entre na conta Vercel do cliente

Abra `vercel.com` e confirme, no canto superior esquerdo, que o time selecionado é o **do
cliente** — não `iskr projects`. Esse é o erro mais fácil de cometer e o mais chato de desfazer.

### 2. Novo projeto

**Add New… → Project**

### 3. Conecte o GitHub da ISKR

Na tela de importação, a Vercel vai listar os repositórios das contas GitHub já conectadas.
O repositório está na **ISKR**, que provavelmente ainda não aparece ali.

Clique em **Adjust GitHub App Permissions** (ou **Configure GitHub App**). Isso abre o GitHub.
Lá:

1. Escolha a conta/organização **`iskarockets`**.
2. Em *Repository access*, selecione **Only select repositories**.
3. Marque **`cuidahomecare`**.
4. **Save**.

Isso dá à Vercel do cliente acesso de leitura **só a esse repositório** — nada mais da ISKR.

### 4. Importe o repositório

De volta à Vercel, `iskarockets/cuidahomecare` aparece na lista. Clique em **Import**.

### 5. Confira as configurações (não mude nada)

A Vercel detecta Astro sozinha. Confirme que está assim:

| Campo | Valor esperado |
|---|---|
| Framework Preset | **Astro** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Root Directory | `./` |
| Node.js Version | 20 ou superior |

**Environment Variables:** nenhuma. O site não usa nenhuma.

### 6. Deploy

Clique em **Deploy** e aguarde. O build leva menos de um minuto.

### 7. Me mande a URL

Ao final a Vercel mostra a URL de produção do projeto (algo como
`cuidahomecare-xxxx.vercel.app`). **Me passe essa URL.** É com ela que eu rodo o PageSpeed
oficial e fecho a Story 2.1 — a medição que hoje está travada por falta de ambiente real.

---

## O que passa a acontecer sozinho

- Todo push para `main` republica o site.
- Todo push em outra branch gera uma URL de preview separada, sem afetar a principal.
- Os headers de segurança e o cache do `vercel.json` são aplicados automaticamente.

---

## Se o passo 3 não funcionar

Se a conta do cliente não puder instalar o GitHub App da Vercel (acontece quando a conta é
gerida por outra pessoa), há dois caminhos alternativos:

**A. Token da conta do cliente.** No painel da Vercel do cliente:
*Settings → Tokens → Create Token*. Você me passa o token e eu publico pelo CLI, sem precisar
de login. O token dá acesso à conta — trate como senha, e revogue quando quiser.

**B. Upload manual.** Rodo `npm run build` aqui e você arrasta a pasta `dist/` para
`vercel.com/new`. Funciona, mas perde o deploy automático a cada push: toda atualização vira
trabalho manual. Só recomendo como último recurso.

---

## Depois do preview aprovado

O cutover do domínio é a **Story 2.3** e tem pré-requisitos:

1. Seu aceite na Story 2.2 (comparação de fidelidade bloco a bloco).
2. PageSpeed no preview batendo a meta.
3. DNS atual documentado antes de qualquer mudança, como plano de rollback.
4. Acesso ao registrador do domínio — ainda pendente.
