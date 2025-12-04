// Script para criar usuário admin
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

async function createAdmin() {
  try {
    console.log('📝 Criando usuário admin...\n');

    // Dados do admin
    const adminEmail = 'admin@saboaria.com';
    const adminPassword = 'Admin@2024';
    const adminName = 'Administrador';

    // Criar usuário de auth
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Senha: ${adminPassword}`);
    
    const { data: { user }, error: signUpError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { name: adminName }
    });

    if (signUpError) {
      // Se já existe, tenta recuperar
      if (signUpError.message.includes('already exists')) {
        console.log('✅ Usuário já existe, atualizando...');
        const { data: { user: existingUser } } = await supabase.auth.admin.listUsers();
        const adminUser = existingUser?.find(u => u.email === adminEmail);
        if (adminUser) {
          await supabase.auth.admin.updateUserById(adminUser.id, { password: adminPassword });
        }
      } else {
        throw signUpError;
      }
    }

    const uid = user?.id;
    console.log(`✅ Usuário criado: ${uid}\n`);

    // Criar perfil de admin
    const { error: profileError } = await supabase
      .from('usuarios')
      .upsert({
        id: uid,
        name: adminName,
        role: 'admin',
        phone: '(11) 99999-9999'
      });

    if (profileError) throw profileError;

    console.log('✅ Perfil de admin criado!\n');
    console.log('═════════════════════════════════');
    console.log('🎉 Admin criado com sucesso!\n');
    console.log('Dados de login:');
    console.log(`  📧 Email: ${adminEmail}`);
    console.log(`  🔑 Senha: ${adminPassword}\n`);
    console.log('Acesse em: http://localhost:3000/admin');
    console.log('═════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
