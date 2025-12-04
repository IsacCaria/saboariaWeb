const Product = require('../models/productModel');
exports.list = async (req, res) => {
  // In a real app, you'd fetch from DB. Here we call the model which is wired to DB.
  try {
    const products = await Product.getAll();
    return res.render('produtos', { title: 'Produtos', products });
  } catch (e) {
    console.error(e);
    return res.send('<h1>Produtos</h1><p>Erro ao buscar produtos.</p>');
  }
};

exports.detail = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.getById(id);
    if(!product) return res.status(404).send('Produto não encontrado');
    return res.render('produto_detail', { title: product.name, product });
  } catch (e) {
    console.error(e);
    return res.status(500).send('Erro interno');
  }
};
