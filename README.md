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
