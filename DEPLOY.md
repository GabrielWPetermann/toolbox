# Deploy na Vercel

## Frontend (Next.js)

### 1. Configurações no Painel da Vercel:
- **Framework Preset**: Next.js
- **Root Directory**: `packages/web`
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (padrão)
- **Install Command**: `npm install`

### 2. Variáveis de Ambiente:
```
NEXT_PUBLIC_API_URL=https://atoolbox.vercel.app/api
```

## Backend (Express API)

### 1. Deploy Separado (Recomendado):
- Crie um projeto separado na Vercel para a API
- **Root Directory**: `packages/api`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2. Variáveis de Ambiente da API:
```
NODE_ENV=production
FRONTEND_URL=https://atoolbox.vercel.app
PORT=3001
```

## Passos para Deploy:

1. **Commit e Push** do código para o GitHub
2. **Conecte o repositório** na Vercel
3. **Configure as variáveis** de ambiente
4. **Deploy automático** será executado

## URLs Finais:
- Frontend: `https://atoolbox.vercel.app`
- API: `https://atoolbox.vercel.app/api`

## Checklist de Deploy:
- ✅ Favicon configurado
- ✅ Variáveis de ambiente documentadas
- ✅ Build scripts funcionando
- ✅ CORS configurado
- ✅ Manifest PWA criado
- ✅ TypeScript configurado
