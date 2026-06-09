[README.md](https://github.com/user-attachments/files/28729482/README.md)
# CN2-ensaios — App de Ensaios · Congregação Cidade Nova II (40 Anos)

App web para organização dos ensaios do ministério de louvor, rumo ao evento dos **40 Anos** (julho/2026). Acesso por celular ou computador, sem instalar nada.

🔗 **No ar em:** https://rhodiec8-tpt.github.io/CN2-ensaios/

> Este README é, ao mesmo tempo, a **documentação** do projeto e um **diário/guia de evolução**. Sempre que voltar ao projeto (ou começar uma conversa nova com o Claude), comece lendo este arquivo — ele guarda o contexto, as decisões e o que falta fazer.

---

## 1. O que o app faz

- **Dashboard** — visão geral: músicas prontas, dias para o evento, progresso por culto.
- **Calendário** — datas e horários dos ensaios; marcar presença e marcar músicas ensaiadas.
- **Músicas** — lista de músicas com cifra, vídeo do YouTube embutido, cifra por instrumento e **teleprompter em tela cheia**.
- **Letras** — letra de cada música, também com teleprompter.
- **Farda** — orientação de vestuário por culto.
- **Equipe** — escalação de quem toca/canta.

**Dois tipos de acesso:**

| Acesso | Como entra | Pode |
|---|---|---|
| **Visitante** | botão "Visitante", sem senha | só visualizar |
| **Levita CN2** | botão "Levita CN2" + senha | editar tudo: música, cifra, letra, vídeo, tom, presença |

---

## 2. Como o projeto está organizado (arquitetura)

O app é um **site estático** (não precisa de servidor próprio) hospedado no **GitHub Pages**, usando o **Firebase** como banco de dados em tempo real.

```
CN2-ensaios/
├── index.html      → a ESTRUTURA da página (o "esqueleto": cabeçalho, abas, modais)
├── style.css       → toda a APARÊNCIA (cores, fontes, espaçamentos, tema)
├── app.js          → toda a LÓGICA (login, salvar dados, montar telas, teleprompter)
├── firebase-rules.json → regras de segurança do banco (quem pode ler/escrever)
└── Logo_aniversario_40anos.svg → logo dos 40 anos
```

**A regra mental simples — "qual arquivo eu mexo?":**
- Quero mudar **uma cor, fonte, tamanho, espaçamento** → `style.css`
- Quero mudar **um texto fixo ou a estrutura de uma tela** → `index.html`
- Quero mudar **um comportamento** (o que acontece ao clicar, como salva) → `app.js`
- Quero mudar **quem pode editar o quê** → `firebase-rules.json` (no Console do Firebase)

> **Por que 3 arquivos e não 1 só?** No começo era tudo um `index.html` gigante (2.600+ linhas). Separar deixou cada parte com um propósito claro e fácil de achar. **Por que não 10 arquivos?** Porque mais arquivos = mais chance de erro no deploy, sem ganho real para um projeto deste tamanho. Três é o equilíbrio ideal.

---

## 3. Identidade visual (tema "caloroso e acolhedor")

Decisão de design: **verde profundo + dourado-mel + um toque de terracota**, com cantos arredondados, sombras suaves e quentes, e títulos em fonte serifada (Fraunces). Sensação: aconchegante e orgânico, mantendo a identidade dos 40 anos.

**Paleta principal** (definida no topo do `style.css`, em `:root`):
| Cor | Código | Uso |
|---|---|---|
| Verde profundo | `#1f3d2f` | cabeçalho, botões principais |
| Verde médio | `#3a7d5e` | detalhes, destaques |
| Dourado-mel | `#e8c876` | acentos, títulos sobre verde |
| Terracota | `#b5663a` | botão de vídeo, status |
| Creme (fundo) | `#f2e9d8` | fundo das páginas |
| Card creme | `#fdf9ef` | fundo dos cartões |

**Fontes:** Fraunces (títulos, serifada) + Hanken Grotesk (texto).

---

## 4. Banco de dados (Firebase) — o essencial

- O app usa **Firebase Realtime Database**. Os dados ficam todos sob o nó `cn2/`.
- O login usa **Firebase Authentication**. A conta de admin é `levita@cn2admin.app` (a senha você define no Console). **Você nunca digita o e-mail no app** — só clica em "Levita CN2" e digita a senha; o e-mail é montado por trás.
- As **regras de segurança** (`firebase-rules.json`) controlam quem grava:
  - Qualquer um **lê** (visitantes veem o app).
  - Só as contas admin **escrevem** a estrutura (adicionar/excluir música, ensaios).
  - Qualquer logado pode editar campos como cifra, letra, tom, **vídeo (videoUrl)**, presença.

> ⚠️ **Lição aprendida:** se um dia o "salvar" parar de funcionar, quase sempre é **regra do Firebase**, não o app. Conferir se o e-mail novo está na lista de admins e se o campo que você quer salvar está liberado nas regras.

---

## 5. Como trabalhar de forma profissional (guia de evolução)

> Esta seção é o seu **plano de crescimento**. Você não precisa fazer tudo de uma vez — é um caminho, no seu ritmo. O objetivo é sair do "editar e torcer pra não quebrar" para um fluxo seguro e profissional.

### 5.1. O ciclo de ouro: **ver ANTES de publicar**
O maior salto de produtividade não é saber mais código — é **testar localmente**. Hoje, quando você sobe direto pro GitHub, descobre os erros só depois (e ainda espera o cache). No computador, você pode ver o resultado na hora.

**Configuração única (~20 min):**
1. **Instale o [VS Code](https://code.visualstudio.com/)** (editor de código gratuito da Microsoft). É onde você vai editar os arquivos com conforto (cores, busca, etc.).
2. **Instale a extensão "Live Server"** dentro do VS Code (aba de extensões → buscar "Live Server" → Install).
3. Abra a pasta do projeto no VS Code, clique com o botão direito no `index.html` → **"Open with Live Server"**.
4. Pronto: o app abre no seu navegador e **atualiza sozinho** cada vez que você salva um arquivo. Você vê a mudança instantânea, sem subir nada.

**Seu novo ciclo de trabalho:**
```
editar no VS Code  →  salvar  →  ver na hora no navegador (Live Server)
   →  gostou?  →  AÍ sim subir pro GitHub
```
Isso sozinho elimina quase todos os perrengues que tivemos.

### 5.2. Git de verdade (quando se sentir confortável)
Hoje você edita pelo site do GitHub. O passo profissional é usar o **GitHub Desktop** (app gráfico, gratuito, não precisa de terminal):
- Você edita no VS Code, e o GitHub Desktop mostra **exatamente o que mudou** (linha por linha).
- Você escreve uma descrição curta ("corrigi cor da data") e clica em **Commit** → **Push**.
- **Vantagem enorme:** se algo quebrar, dá pra **voltar pra versão anterior com um clique** (em vez de refazer na mão).

### 5.3. Hábitos que fazem diferença
- **Uma mudança por vez.** Mexeu no visual? Testa e sobe. Não misture "novo visual + nova função + correção" no mesmo envio — se quebrar, você não sabe o que foi.
- **Sempre teste no Live Server antes de subir.**
- **Descreva cada alteração** ao commitar (vira um histórico do que você fez).
- **Mantenha este README atualizado** quando tomar uma decisão importante.
- **Cache:** depois de subir, force atualização (Ctrl+Shift+R no PC) ou use `?v=2`, `?v=3` no fim do link. Espere 1–2 min (o GitHub Pages demora a propagar).

---

## 6. Histórico de decisões (por que as coisas são como são)

Registrar decisões evita refazer discussões e ajuda quem pega o projeto depois (inclusive você no futuro).

- **Separar em 3 arquivos** (index/style/app) em vez de 1 só → manutenção mais fácil; 3 e não 10 → menor risco de deploy.
- **Tema caloroso (verde+dourado+terracota)** com Fraunces nos títulos → identidade dos 40 anos, sensação acolhedora.
- **Menu no topo** (não embaixo) → decisão do Rondiele.
- **Login simplificado** para 2 botões (Levita / Visitante) → eliminou bugs de e-mail com acento que travavam o acesso.
- **Teleprompter refeito em tela cheia** (modo palco escuro), com barra deslizante de velocidade (Lento/Médio/Rápido) → o anterior era rápido demais e atrapalhava ao tocar. Velocidades recalibradas: ~2px/s (lento) a ~34px/s (rápido).
- **`videoUrl` liberado nas regras do Firebase** → permite salvar o link do YouTube.

---

## 7. Próximos passos (roadmap)

- [ ] **PWA — "instalar como app":** criar `manifest.json` + ícone, para o app aparecer com ícone próprio na tela inicial do celular e abrir em tela cheia (sem a barra do navegador). Inclui um `service-worker.js` para funcionar parcialmente offline (atenção: service worker tem armadilha de cache — fazer com cuidado).
- [ ] Configurar o ambiente local (VS Code + Live Server) — ver seção 5.1.
- [ ] (Opcional) Migrar do "editar no navegador" para GitHub Desktop — ver seção 5.2.

---

## 8. Problemas comuns e soluções rápidas

| Sintoma | Causa provável | Solução |
|---|---|---|
| Site dá **404 / File not found** | arquivo não se chama `index.html` | renomear para exatamente `index.html` |
| App abre **sem estilo** (tudo branco/torto) | `style.css` não subiu ou caminho errado | conferir se os 3 arquivos estão na raiz, juntos |
| **"Erro ao salvar"** | regra do Firebase não autoriza | conferir e-mail admin e campo nas regras |
| Mudança **não aparece** após subir | cache do navegador/GitHub | Ctrl+Shift+R, ou `?v=N` no link, e esperar 1–2 min |
| Texto/número **invisível** | cor igual à do fundo | ajustar a cor no `style.css` |

---

*Projeto mantido por Rondiele · Congregação Cidade Nova II · "Semeando palavras, colhendo promessas".*
