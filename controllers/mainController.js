exports.index = (req, res) => {
  // render views/home.ejs if exists, otherwise show simple page
  try {
    return res.render('home', { title: 'Home' });
  } catch (e) {
    return res.send('<h1>Home</h1><p>Template home not found.</p>');
  }
};

exports.sobre = (req, res) => {
  try {
    return res.render('sobre', { title: 'Sobre' });
  } catch (e) {
    return res.send('<h1>Sobre</h1><p>Template sobre não encontrado.</p>');
  }
};

exports.equipe = (req, res) => {
  try {
    return res.render('equipe', { title: 'Equipe' });
  } catch (e) {
    return res.send('<h1>Equipe</h1><p>Template equipe não encontrado.</p>');
  }
};

exports.faleconosco = (req, res) => {
  try {
    return res.render('faleconosco', { title: 'Fale Conosco' });
  } catch (e) {
    return res.send('<h1>Fale Conosco</h1><p>Template faleconosco não encontrado.</p>');
  }
};
