const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;

// express-ejs-layouts for layout support
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout');

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static files (public) - serve at root so /css, /js, /img, /index.html work
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Inject Supabase config (used by client-side code)
app.use((req, res, next) => {
  res.locals.supabaseConfig = {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || ''
  };
  next();
});

// routes
const mainRouter = require('./routes/main');
const produtosRouter = require('./routes/produtos');
const contatoRouter = require('./routes/contato');
const adminRouter = require('./routes/admin');

app.use('/', mainRouter);
app.use('/produtos', produtosRouter);
app.use('/contato', contatoRouter);
app.use('/admin', adminRouter);

// 404 handler - render views/404.ejs
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

// start server with explicit error handling (gives clearer message when port is in use)
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Error: port ${port} is already in use. Stop the process using it or set a different PORT (e.g. PORT=3002).`);
  } else {
    console.error('Server error:', err);
  }
  // optionally exit so the process doesn't stay in a bad state
  process.exit(1);
});
