# Litoral Microverdes

Site em Next.js, React e Tailwind CSS. Usa Node.js 24.x, definido em
`package.json` para os builds e deploys na Vercel.

```sh
npm ci
npm run dev
```

Para validar e executar a versão de produção:

```sh
npm run audit
npm run build
npm start
```

O Tailwind CSS 4 usa `@tailwindcss/postcss`; o tema está em
`styles/globals.css`. Requer Safari 16.4+, Chrome 111+ ou Firefox 128+,
conforme o [guia oficial de migração](https://tailwindcss.com/docs/upgrade-guide).

## Catálogo e painel

- `/catalogo`: catálogo público, com foto, nome e peso de cada embalagem.
- `/admin`: painel próprio em português, integrado ao SDK oficial do Sanity.
  A edição exige uma conta com acesso ao projeto. Cada usuário usa uma sessão
  individual; não há senhas próprias nem token compartilhado de escrita.
- O botão **Ver produto** está desativado até a definição do fluxo de detalhes.

O projeto `uoowndbg` e o dataset público `production` estão definidos em
`lib/sanity-config.js`. São identificadores públicos, não credenciais, e funcionam
também na Vercel. Para usar outro projeto, copie `.env.example` para `.env.local`
e altere as variáveis; na Vercel, configure-as antes do build.

O catálogo contém apenas
informações públicas dos produtos; não armazene dados pessoais nele. Adicione
as origens exatas do painel nas configurações CORS do Sanity, permitindo
credenciais: `http://localhost:3333`, o domínio de preview usado nos testes e
`https://litoralmicroverdes.com.br`. Não use origens curinga com credenciais.

Execute `npm run dev -- --hostname localhost --port 3333` para usar a origem local
autorizada. No painel, entre com sua conta Sanity, adicione produtos e preencha nome,
peso e foto. Para colar uma imagem copiada, clique na área da foto e pressione
⌘V no Mac ou Ctrl+V no Windows. O botão **Escolher foto** continua disponível;
ambas as opções aceitam JPG, PNG, WebP ou AVIF de até 10 MB.
Arraste pela alça ou use as setas para definir a ordem. O controle
**Exibir no catálogo** permite ocultar produtos sem excluí-los. Clique em
**Publicar alterações** para aplicar adições, alterações, exclusões e reordenações
juntas. Alterações ainda não publicadas ficam apenas na tela; há um aviso ao sair.
Os uploads são salvos no Sanity imediatamente, mas só entram na vitrine depois
da publicação. Fotos removidas dos produtos não são apagadas da biblioteca.
Uma verificação de revisão impede sobrescrever mudanças de outra pessoa.

O catálogo usa regeneração estática a cada 60 segundos: após esse intervalo,
uma visita aciona a atualização, e visitas seguintes recebem os dados novos.
Uma indisponibilidade temporária do Sanity preserva a última página gerada com
sucesso. Sem configuração ou sem produtos publicados, a página mostra um estado
vazio com contato pelo WhatsApp; não são inseridos produtos fictícios.

As imagens são entregues pelo CDN do Sanity com recorte quadrado,
sem passar pela otimização de imagens da Vercel. O SDK é carregado
apenas na rota administrativa.

O painel usa `@sanity/client` e os provedores de login oficiais do projeto,
com o mesmo fluxo de sessão do Sanity Studio. A senha é informada apenas no
provedor escolhido. Um estado aleatório vincula o retorno à aba que iniciou o
login. A sessão temporária retorna no fragmento da URL, é removida do histórico
e trocada por uma sessão pessoal limitada ao projeto, armazenada no navegador.
Sair revoga essa sessão no Sanity. Sessões expiradas exigem novo login.

### Plano gratuito

A integração usa somente o dataset público, assets, consultas e mutações da API
e autenticação Sanity. Não usa datasets privados, papel Editor, histórico pago,
agendamento, AI Assist, Content Releases, Functions nem Media Library add-on.
No Free, convide os donos como **Administrator** (pode editar); **Viewer** não
pode publicar. Esses são os dois papéis gratuitos, com até 20 usuários no projeto.
O painel de planos informa que o Growth Trial retorna automaticamente para Free.

Limites Free consultados em 04/10/2026: 10 mil documentos, 250 mil requisições de
API/mês, 1 milhão de requisições de API CDN/mês, 100 GB de assets e 100 GB de
tráfego/mês. O catálogo é um único documento e usa cache de 60 segundos. Consulte
o [plano oficial](https://www.sanity.io/pricing) antes de ampliar significativamente
o uso; a gratuidade depende dessas cotas. Não foi ativado nenhum serviço pago.

Execute `npm test`, `npm run audit` e `npm run build` para validar mudanças.
