const supabase = require('./supabase');

exports.getAll = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, image')
    .order('id', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
};

exports.getById = async (id) => {
  const { data, error } = await supabase.from('products').select('id, name, description, price, image').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw error; // allow not found
  return data || null;
};
