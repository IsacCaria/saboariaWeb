# Projeto Saboaria - versão MVC (Node.js + Express)

**O que foi feito**:
- Projeto original extraído de `Projeto_SaboariaWeb-main.zip` e copiado para `/public`.
- HTMLs principais convertidos para EJS e colocados em `/views`.
- Estrutura MVC criada com `controllers/`, `models/`, `routes/`, `views/` e `public/`.
- Backend com Express, conexão MySQL (mysql2) e exemplos de controllers para produtos e contato.
- Arquivo `schema.sql` com criação de banco e tabelas (MySQL) incluído.
- `package.json` com dependências e scripts.

**Como rodar localmente** (pré-requisitos: Node.js, MySQL):
1. Em `.env` ajuste as credenciais do banco.
2. Rode o script SQL: `mysql -u root -p < schema.sql`.
3. Instale dependências: `npm install`
4. Inicie: `npm run dev` ou `npm start`
5. Acesse: http://localhost:3000/
