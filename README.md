# Painel de Administração - Universo dos Cachos

Painel administrativo separado para gerenciar o conteúdo do site Universo dos Cachos.

## 🚀 Tecnologias

- React 18 + TypeScript
- Vite
- React Router DOM
- Supabase
- Tailwind CSS
- TipTap (Editor de texto rico)

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase
- Projeto Supabase configurado

## 🔧 Configuração

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

3. **Editar o arquivo `.env`** com suas credenciais do Supabase

4. **Configurar o armazenamento de imagens:** crie um bucket público chamado `images` no Supabase Storage (ou informe outro nome em `VITE_SUPABASE_STORAGE_BUCKET`) e configure as políticas para permitir uploads aos usuários autenticados que administram o painel.

O painel envia os arquivos ao bucket e salva a URL pública no registro. Não use uma chave `service_role` no frontend.

## 🎯 Funcionalidades

- ✅ Dashboard com estatísticas
- ✅ Gerenciar Produtos (CRUD)
- ✅ Gerenciar Blog com editor de texto rico
- ✅ Gerenciar Glossário
- ✅ Gerenciar Quiz
- ✅ Gerenciar Rotinas
- ✅ Gerenciar Cuidados
- ✅ Upload de imagens (URL ou arquivo)
- ✅ Editor de texto rico (TipTap)

## 🚀 Executar Localmente

```bash
npm run dev
```

Acesse: http://localhost:5173

## 📦 Deploy

### Vercel

1. Instalar Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configurar variáveis de ambiente no Vercel

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Configurar variáveis de ambiente

## 🔐 Segurança

- Usa apenas a chave pública/anon do Supabase no frontend
- Autenticação via Supabase Auth
- RLS policies no banco de dados
- Service role key somente em ambiente server-side
- Projeto separado do site público

## 📝 Estrutura

```
src/
├── components/
│   ├── Layout.tsx
│   ├── RichTextEditor.tsx
│   └── ImageUpload.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Products.tsx
│   ├── Posts.tsx
│   ├── PostForm.tsx
│   ├── Glossary.tsx
│   ├── Quiz.tsx
│   ├── Routines.tsx
│   └── Care.tsx
└── lib/
    └── supabase.ts
```

## 🎨 Personalização

- **Cores:** Edite `tailwind.config.js`
- **Layout:** Edite `components/Layout.tsx`
- **Editor:** Edite `components/RichTextEditor.tsx`

## 🔮 Próximas Passos

- [ ] Implementar upload para Supabase Storage
- [ ] Adicionar autenticação robusta
- [ ] Adicionar validação de formulários
- [ ] Adicionar paginação nas listas
- [ ] Adicionar filtros avançados
- [ ] Adicionar logs de auditoria
