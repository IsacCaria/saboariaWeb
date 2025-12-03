const Contact = require('../models/contactModel');
exports.form = (req, res) => {
  try {
    return res.render('contato', { title: 'Contato' });
  } catch (e) {
    return res.send('<h1>Contato</h1><p>Formulário não disponível.</p>');
  }
};

exports.submit = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await Contact.create({ name, email, message });
    return res.send('<h1>Obrigado</h1><p>Mensagem recebida.</p>');
  } catch (e) {
    console.error(e);
    return res.status(500).send('Erro ao enviar mensagem');
  }
};
