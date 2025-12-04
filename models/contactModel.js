const supabase = require('./supabase');

exports.create = async ({ name, email, message }) => {
  const { data, error } = await supabase.from('contacts').insert([{ name, email, message, created_at: new Date().toISOString() }]).select('id').single();
  if (error) throw error;
  return data?.id || null;
};
