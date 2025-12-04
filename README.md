**Como rodar localmente** (pré-requisitos: Node.js, MySQL):
1. Em `.env` ajuste as credenciais do banco.
2. Rode o script SQL: `mysql -u root -p < schema.sql` (ou use um client GUI).
3. Instale dependências: `npm install`
4. Inicie: `npm run dev` (requer nodemon) ou `npm start`
5. Acesse: http://localhost:3000/
