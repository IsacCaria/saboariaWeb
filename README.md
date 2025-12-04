# Projeto Saboaria - versão MVC (Node.js + Express)

**O que foi feito**:
- Projeto original extraído de `Projeto_SaboariaWeb-main.zip` e copiado para `/public` (arquivos estáticos).
- HTMLs principais convertidos para EJS e colocados em `/views` (tentei preservar conteúdo).
- Estrutura MVC criada com `controllers/`, `models/`, `routes/`, `views/` e `public/`.
- Backend mínimo com Express, conexão MySQL (mysql2) e exemplos de controllers para produtos e contato.
- Arquivo `schema.sql` com criação de banco e tabelas (MySQL) incluído.
- `.env.example` para configuração local.
- `package.json` com dependências e scripts.

**Como rodar localmente** (pré-requisitos: Node.js, MySQL):
1. Em `.env` ajuste as credenciais do banco.
2. Rode o script SQL: `mysql -u root -p < schema.sql` (ou use um client GUI).
3. Instale dependências: `npm install`
4. Inicie: `npm run dev` (requer nodemon) ou `npm start`
5. Acesse: http://localhost:3000/
