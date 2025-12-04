exports.dashboard = (req, res) => {
  res.render('admin/dashboard', { title: 'Painel Administrativo' });
};

exports.produtos = (req, res) => {
  res.render('admin/produtos', { title: 'Gerenciar Produtos' });
};

exports.pedidos = (req, res) => {
  res.render('admin/pedidos', { title: 'Pedidos' });
};
