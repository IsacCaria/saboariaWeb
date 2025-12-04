// Supabase is initialized in the layout via window.supabaseConfig (injected by server).
// Initialize supabase client lazily when available.

// === Sistema de Notificações ===
function showNotification(title, message = '', type = 'info', duration = 4000) {
  const container = document.getElementById('notification-container');
  if (!container) return;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-icon">${icons[type] || '•'}</div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      ${message ? `<div class="notification-message">${message}</div>` : ''}
    </div>
    <button class="notification-close">&times;</button>
  `;

  container.appendChild(notification);

  const closeBtn = notification.querySelector('.notification-close');
  const remove = () => {
    notification.classList.add('hide');
    setTimeout(() => notification.remove(), 300);
  };

  closeBtn.addEventListener('click', remove);
  setTimeout(remove, duration);
}

let supabaseClient;
function ensureSupabase() {
  if (!supabaseClient) {
    if (window.supabaseClient) {
      supabaseClient = window.supabaseClient;
    } else if (window.supabase && window.supabaseConfig && window.supabaseConfig.url && window.supabaseConfig.anonKey) {
      try {
        supabaseClient = window.supabase.createClient(window.supabaseConfig.url, window.supabaseConfig.anonKey);
      } catch (e) {
        console.error('Supabase init error:', e);
      }
    }
  }
  return supabaseClient;
}

ensureSupabase();

// === Utilidades Gerais ===
function abrirModalLogin(e) {
  e.preventDefault();
  const modal = document.getElementById("login-modal");
  modal?.classList.remove("hidden");
}

function carregarAviso() {
  const avisoEl = document.getElementById("texto-aviso");
  if (!avisoEl) return;
  const supabase = ensureSupabase();
  if (!supabase) return;
  supabase.from('config').select('texto').eq('id', 'aviso').single()
    .then(({ data, error }) => {
      if (error) return console.error('Erro ao carregar aviso:', error);
      if (data && data.texto) avisoEl.textContent = data.texto;
    });
}

// === Modal Login ===
let loginMode = 'signin'; // 'signin' or 'signup'

// Validação de email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validação de telefone (11 dígitos)
function validarTelefone(phone) {
  const digitos = phone.replace(/\D/g, '');
  return digitos.length === 11;
}

// Validação de força de senha (maiúscula, número, 6+ caracteres)
function validarSenha(senha) {
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temTamanho = senha.length >= 6;
  return { valida: temMaiuscula && temNumero && temTamanho, temMaiuscula, temNumero, temTamanho };
}

// Atualizar validações em tempo real
document.getElementById("signup-email")?.addEventListener("input", function() {
  const email = this.value.trim();
  const errorEl = document.getElementById("email-error");
  if (email && !validarEmail(email)) {
    errorEl.textContent = "Email inválido (ex: usuario@email.com)";
    errorEl.style.display = "block";
  } else {
    errorEl.style.display = "none";
  }
  verificarFormCadastro();
});

document.getElementById("signup-phone")?.addEventListener("input", function() {
  const phone = this.value.trim();
  const errorEl = document.getElementById("phone-error");
  if (phone && !validarTelefone(phone)) {
    errorEl.textContent = "Telefone inválido (11 números)";
    errorEl.style.display = "block";
  } else {
    errorEl.style.display = "none";
  }
  verificarFormCadastro();
});

document.getElementById("signup-password")?.addEventListener("input", function() {
  const senha = this.value;
  const validacao = validarSenha(senha);
  const strengthEl = document.getElementById("password-strength");
  
  if (senha) {
    let msg = "Força: ";
    let cor = "orange";
    if (validacao.valida) {
      msg += "✓ Forte";
      cor = "green";
    } else {
      const faltam = [];
      if (!validacao.temMaiuscula) faltam.push("maiúscula");
      if (!validacao.temNumero) faltam.push("número");
      if (!validacao.temTamanho) faltam.push("6+ caracteres");
      msg += faltam.join(", ");
      cor = "red";
    }
    strengthEl.textContent = msg;
    strengthEl.style.color = cor;
    strengthEl.style.display = "block";
  } else {
    strengthEl.style.display = "none";
  }
  verificarFormCadastro();
});

document.getElementById("signup-password-confirm")?.addEventListener("input", function() {
  const senha = document.getElementById("signup-password").value;
  const confirmacao = this.value;
  const matchEl = document.getElementById("password-match");
  
  if (confirmacao) {
    if (senha === confirmacao) {
      matchEl.textContent = "✓ Senhas conferem";
      matchEl.style.color = "green";
      matchEl.style.display = "block";
    } else {
      matchEl.textContent = "✗ Senhas não conferem";
      matchEl.style.color = "red";
      matchEl.style.display = "block";
    }
  } else {
    matchEl.style.display = "none";
  }
  verificarFormCadastro();
});

function verificarFormCadastro() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const phone = document.getElementById("signup-phone").value.trim();
  const password = document.getElementById("signup-password").value;
  const passwordConfirm = document.getElementById("signup-password-confirm").value;
  
  const emailValido = !email || validarEmail(email);
  const phoneValido = !phone || validarTelefone(phone);
  const senhaValida = !password || validarSenha(password).valida;
  const senhasConferem = !password || !passwordConfirm || password === passwordConfirm;
  
  const todoCorreto = name && email && phone && password && passwordConfirm && emailValido && phoneValido && senhaValida && senhasConferem;
  
  const btnSubmit = document.getElementById("signup-submit");
  if (todoCorreto) {
    btnSubmit.disabled = false;
    btnSubmit.style.opacity = "1";
    btnSubmit.style.cursor = "pointer";
  } else {
    btnSubmit.disabled = true;
    btnSubmit.style.opacity = "0.5";
    btnSubmit.style.cursor = "not-allowed";
  }
}

function toggleLoginMode() {
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  const title = document.getElementById('modal-title');
  
  if (loginMode === 'signin') {
    loginMode = 'signup';
    signinForm.style.display = 'none';
    signupForm.style.display = 'block';
    title.textContent = 'Criar Conta';
  } else {
    loginMode = 'signin';
    signinForm.style.display = 'block';
    signupForm.style.display = 'none';
    title.textContent = 'Entrar';
  }
}

document.getElementById("btn-login")?.addEventListener("click", abrirModalLogin);

document.getElementById("login-submit")?.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-password").value;
  const supabase = ensureSupabase();
  if (!supabase) return showNotification('Erro', 'Supabase não inicializado.', 'error');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) throw error;
    showNotification('Sucesso', 'Login realizado com sucesso!', 'success');
    setTimeout(() => {
      document.getElementById("login-modal").classList.add("hidden");
    }, 500);
  } catch (err) {
    showNotification('Erro ao fazer login', err.message, 'error');
  }
});

document.getElementById("signup-submit")?.addEventListener("click", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const phone = document.getElementById("signup-phone").value.trim();
  const password = document.getElementById("signup-password").value;
  const passwordConfirm = document.getElementById("signup-password-confirm").value;
  
  if (!name || !email || !phone || !password) return showNotification('Atenção', 'Preencha todos os campos.', 'warning');
  if (!validarEmail(email)) return showNotification('Erro', 'Email inválido.', 'error');
  if (!validarTelefone(phone)) return showNotification('Erro', 'Telefone inválido (11 números).', 'error');
  if (!validarSenha(password).valida) return showNotification('Erro', 'Senha fraca. Use maiúscula, número e 6+ caracteres.', 'error');
  if (password !== passwordConfirm) return showNotification('Erro', 'As senhas não conferem.', 'error');
  
  const supabase = ensureSupabase();
  if (!supabase) return showNotification('Erro', 'Supabase não inicializado.', 'error');
  
  try {
    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;
    
    const uid = authData.user?.id;
    if (!uid) throw new Error('Usuário não foi criado com sucesso.');
    
    // Criar perfil do usuário na tabela usuarios
    const { error: profileError } = await supabase.from('usuarios').insert([
      { id: uid, name, phone, role: 'user' }
    ]);
    if (profileError) throw profileError;
    
    showNotification('Sucesso', 'Conta criada com sucesso! Faça login com suas credenciais.', 'success');
    
    // Limpar formulário e voltar para login
    document.getElementById("signup-name").value = '';
    document.getElementById("signup-email").value = '';
    document.getElementById("signup-phone").value = '';
    document.getElementById("signup-password").value = '';
    document.getElementById("signup-password-confirm").value = '';
    document.getElementById("email-error").style.display = "none";
    document.getElementById("phone-error").style.display = "none";
    document.getElementById("password-strength").style.display = "none";
    document.getElementById("password-match").style.display = "none";
    toggleLoginMode();
    
  } catch (err) {
    showNotification('Erro ao criar conta', err.message, 'error');
  }
});

document.getElementById("criar-conta")?.addEventListener("click", (e) => {
  e.preventDefault();
  toggleLoginMode();
});

document.getElementById("voltar-login")?.addEventListener("click", (e) => {
  e.preventDefault();
  toggleLoginMode();
});

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector("#login-modal .close");
  const modal = document.getElementById("login-modal");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Fechar menu de usuário ao clicar fora
  document.addEventListener("click", (e) => {
    const userMenu = document.getElementById("user-menu");
    const btnLogin = document.getElementById("btn-login");
    if (userMenu && btnLogin && !userMenu.contains(e.target) && !btnLogin.contains(e.target)) {
      userMenu.classList.add("hidden");
    }
  });
});

// === Autenticação + Admin ===
let currentUser = null;

async function _onAuthHandler(user) {
  const btnLogin = document.getElementById("btn-login");
  const userMenu = document.getElementById("user-menu");
  const userNameSpan = document.getElementById("user-name");
  const botaoPedido = document.getElementById("enviar-pedido");
  const avisoEl = document.getElementById("texto-aviso");
  const btnEditarAviso = document.getElementById("editar-aviso");

  if (!btnLogin) return;

  if (user) {
    currentUser = user;
    const uid = user.id || user.user?.id || user.uid;
    try {
      const supabase = ensureSupabase();
      if (!supabase) throw new Error('Supabase não inicializado');
      const { data: usuario, error: uErr } = await supabase.from('usuarios').select('role, name').eq('id', uid).single();
      if (uErr) console.warn('Erro ao buscar usuario:', uErr.message || uErr);
      const role = usuario?.role;
      const userName = usuario?.name || 'Usuário';

      // Atualizar nome no menu dropdown
      if (userNameSpan) userNameSpan.textContent = userName;

      if (role === "admin") {
        console.log("Usuário é administrador!");
        if (!sessionStorage.getItem("saudouAdmin")) {
          showNotification('Bem-vindo', 'Você está logado como administrador!', 'success');
          sessionStorage.setItem("saudouAdmin", "true");
        }

        if (btnEditarAviso) {
          btnEditarAviso.style.display = "inline-block";
          btnEditarAviso.addEventListener("click", async () => {
            const novoTexto = prompt("Digite o novo texto do aviso:", avisoEl.textContent);
            if (novoTexto !== null && novoTexto.trim() !== "") {
              try {
                await supabase.from('config').upsert({ id: 'aviso', texto: novoTexto });
                avisoEl.textContent = novoTexto;
                showNotification('Sucesso', 'Aviso atualizado com sucesso!', 'success');
              } catch (err) {
                showNotification('Erro', 'Falha ao atualizar o aviso.', 'error');
                alert("Falha ao atualizar o aviso.");
              }
            }
          });
        }

        const painel = document.getElementById("painel-admin");
        if (painel) {
          painel.style.display = "block";
          carregarListasAdmin();
        }
      }
    } catch (err) {
      console.error("Erro ao verificar permissoes:", err);
    }

    if (botaoPedido) {
      botaoPedido.disabled = false;
      botaoPedido.style.backgroundColor = "";
      botaoPedido.style.cursor = "pointer";
    }

    // Mostrar menu dropdown
    btnLogin.textContent = "👤 Minha Conta";
    btnLogin.removeEventListener("click", abrirModalLogin);
    btnLogin.addEventListener("click", (e) => {
      e.preventDefault();
      userMenu?.classList.toggle("hidden");
    });

  } else {
    currentUser = null;
    if (botaoPedido) {
      botaoPedido.disabled = true;
      botaoPedido.style.backgroundColor = "#ccc";
      botaoPedido.style.cursor = "not-allowed";
    }
    btnLogin.textContent = "Login";
    btnLogin.removeEventListener("click", abrirModalLogin);
    btnLogin.addEventListener("click", abrirModalLogin);
    
    // Esconder menu dropdown
    if (userMenu) userMenu.classList.add("hidden");
  }
}

function registerAuthHandler() {
  const supabase = ensureSupabase();
  if (supabase && supabase.auth && supabase.auth.onAuthStateChange) {
    supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      _onAuthHandler(user);
    });
    // initial check
    supabase.auth.getUser().then(({ data }) => {
      _onAuthHandler(data?.user || null);
    }).catch(() => {});
    return true;
  }
  return false;
}

if (!registerAuthHandler()) {
  const authTimer = setInterval(() => {
    try { ensureSupabase(); } catch (e) { console.warn('ensureSupabase failed', e); }
    if (registerAuthHandler()) clearInterval(authTimer);
  }, 300);
}

// === Menu de Usuário + Modais ===
function setupUserMenuHandlers() {
  const menuPerfil = document.getElementById("menu-perfil");
  const menuPedidos = document.getElementById("menu-pedidos");
  const menuGerenciar = document.getElementById("menu-gerenciar");
  const menuLogout = document.getElementById("menu-logout");
  const userMenu = document.getElementById("user-menu");

  const profileModal = document.getElementById("profile-modal");
  const ordersModal = document.getElementById("orders-modal");
  const manageModal = document.getElementById("manage-modal");

  function closeAllModals() {
    if (profileModal) profileModal.classList.remove("show");
    if (ordersModal) ordersModal.classList.remove("show");
    if (manageModal) manageModal.classList.remove("show");
  }

  function closeAllCloseButtons() {
    document.querySelectorAll(".account-modal-close").forEach(btn => {
      btn.addEventListener("click", closeAllModals);
    });
  }

  // Fechar modais ao clicar fora
  document.querySelectorAll(".account-modal").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  // Menu Perfil
  if (menuPerfil) {
    menuPerfil.addEventListener("click", async (e) => {
      e.preventDefault();
      if (userMenu) userMenu.classList.add("hidden");
      
      if (currentUser) {
        const supabase = ensureSupabase();
        const uid = currentUser.id || currentUser.user?.id || currentUser.uid;
        const { data: usuario } = await supabase.from('usuarios').select('*').eq('id', uid).single();
        
        if (usuario) {
          document.getElementById("profile-name").textContent = usuario.name || "-";
          document.getElementById("profile-email").textContent = currentUser.email || "-";
          document.getElementById("profile-phone").textContent = usuario.phone || "-";
        }
      }
      
      if (profileModal) {
        closeAllModals();
        profileModal.classList.add("show");
      }
    });
  }

  // Editar Perfil
  if (document.getElementById("edit-profile-btn")) {
    document.getElementById("edit-profile-btn").addEventListener("click", (e) => {
      e.preventDefault();
      const form = document.getElementById("edit-profile-form");
      const btn = e.target;
      
      if (form.style.display === "none") {
        document.getElementById("edit-name").value = document.getElementById("profile-name").textContent;
        document.getElementById("edit-phone").value = document.getElementById("profile-phone").textContent;
        form.style.display = "block";
        btn.textContent = "✏️ Cancelar Edição";
      } else {
        form.style.display = "none";
        btn.textContent = "✏️ Editar Perfil";
      }
    });
  }

  if (document.getElementById("save-profile-btn")) {
    document.getElementById("save-profile-btn").addEventListener("click", async (e) => {
      e.preventDefault();
      const supabase = ensureSupabase();
      const uid = currentUser.id || currentUser.user?.id || currentUser.uid;
      const newName = document.getElementById("edit-name").value.trim();
      const newPhone = document.getElementById("edit-phone").value.trim();

      if (!newName || !newPhone) return showNotification('Atenção', 'Preencha todos os campos.', 'warning');

      try {
        await supabase.from('usuarios').update({ name: newName, phone: newPhone }).eq('id', uid);
        showNotification('Sucesso', 'Perfil atualizado com sucesso!', 'success');
        document.getElementById("profile-name").textContent = newName;
        document.getElementById("profile-phone").textContent = newPhone;
        document.getElementById("edit-profile-form").style.display = "none";
        document.getElementById("edit-profile-btn").textContent = "✏️ Editar Perfil";
      } catch (err) {
        showNotification('Erro', 'Erro ao atualizar perfil: ' + err.message, 'error');
      }
    });
  }

  if (document.getElementById("cancel-profile-btn")) {
    document.getElementById("cancel-profile-btn").addEventListener("click", () => {
      document.getElementById("edit-profile-form").style.display = "none";
      document.getElementById("edit-profile-btn").textContent = "✏️ Editar Perfil";
    });
  }

  // Menu Pedidos
  if (menuPedidos) {
    menuPedidos.addEventListener("click", (e) => {
      e.preventDefault();
      if (userMenu) userMenu.classList.add("hidden");
      if (ordersModal) {
        closeAllModals();
        // Aqui você pode carregar pedidos do Supabase se houver tabela de pedidos
        ordersModal.classList.add("show");
      }
    });
  }

  // Menu Gerenciar Conta
  if (menuGerenciar) {
    menuGerenciar.addEventListener("click", (e) => {
      e.preventDefault();
      if (userMenu) userMenu.classList.add("hidden");
      if (manageModal) {
        closeAllModals();
        manageModal.classList.add("show");
        
        // Carregar dados
        if (currentUser) {
          const createdAt = new Date(currentUser.created_at).toLocaleDateString('pt-BR');
          document.getElementById("member-since").textContent = createdAt;
        }
      }
    });
  }

  // Alterar Senha
  if (document.getElementById("change-password-btn")) {
    document.getElementById("change-password-btn").addEventListener("click", (e) => {
      e.preventDefault();
      const form = document.getElementById("change-password-form");
      const btn = e.target;
      
      if (form.style.display === "none") {
        form.style.display = "block";
        btn.textContent = "🔐 Cancelar";
      } else {
        form.style.display = "none";
        btn.textContent = "🔐 Alterar Senha";
        document.getElementById("current-password").value = "";
        document.getElementById("new-password").value = "";
        document.getElementById("confirm-new-password").value = "";
      }
    });
  }

  if (document.getElementById("save-password-btn")) {
    document.getElementById("save-password-btn").addEventListener("click", async (e) => {
      e.preventDefault();
      const supabase = ensureSupabase();
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-new-password").value;

      if (!newPassword || !confirmPassword) return showNotification('Atenção', 'Preencha a nova senha.', 'warning');
      if (newPassword !== confirmPassword) return showNotification('Erro', 'As senhas não conferem.', 'error');
      if (newPassword.length < 6) return showNotification('Erro', 'A senha deve ter pelo menos 6 caracteres.', 'error');

      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        showNotification('Sucesso', 'Senha alterada com sucesso!', 'success');
        document.getElementById("change-password-form").style.display = "none";
        document.getElementById("change-password-btn").textContent = "🔐 Alterar Senha";
      } catch (err) {
        showNotification('Erro', 'Erro ao alterar senha: ' + err.message, 'error');
      }
    });
  }

  if (document.getElementById("cancel-password-btn")) {
    document.getElementById("cancel-password-btn").addEventListener("click", () => {
      document.getElementById("change-password-form").style.display = "none";
      document.getElementById("change-password-btn").textContent = "🔐 Alterar Senha";
    });
  }

  // Deletar Conta
  if (document.getElementById("delete-account-btn")) {
    document.getElementById("delete-account-btn").addEventListener("click", async (e) => {
      e.preventDefault();
      const ok1 = await showConfirm('Deletar conta', 'Tem certeza que deseja deletar sua conta? Esta ação é irreversível!');
      if (!ok1) return;
      const ok2 = await showConfirm('Aviso', '⚠️ AVISO: Todos os seus dados serão perdidos! Deseja continuar?');
      if (!ok2) return;

      const supabase = ensureSupabase();
      const uid = currentUser.id || currentUser.user?.id || currentUser.uid;

      try {
        // Deletar dados do usuário
        await supabase.from('usuarios').delete().eq('id', uid);
        
        // Deletar conta de auth
        await supabase.auth.admin.deleteUser(uid);
        
        showNotification('Sucesso', 'Conta deletada com sucesso!', 'success');
        closeAllModals();
        await supabase.auth.signOut();
      } catch (err) {
        // Se admin.deleteUser não funcionar, tenta signOut
        try {
          await supabase.from('usuarios').delete().eq('id', uid);
          showNotification('Sucesso', 'Dados deletados. Faça logout e crie uma nova conta.', 'success');
          closeAllModals();
          await supabase.auth.signOut();
        } catch (err2) {
          showNotification('Erro', 'Erro ao deletar conta: ' + err2.message, 'error');
        }
      }
    });
  }

  // Menu Logout
  if (menuLogout) {
    menuLogout.addEventListener("click", async (e) => {
      e.preventDefault();
      if (userMenu) userMenu.classList.add("hidden");
      
      const doLogout = await showConfirm('Sair', 'Tem certeza que deseja sair?');
      if (doLogout) {
        const supabase = ensureSupabase();
        if (supabase) {
          try {
            await supabase.auth.signOut();
            showNotification('Sucesso', 'Desconectado com sucesso!', 'success');
          } catch (err) {
            console.error("Erro ao fazer logout:", err);
          }
        }
      }
    });
  }

  closeAllCloseButtons();
}

// === Painel Admin ===
async function carregarListasAdmin() {
  const supabase = ensureSupabase();
  if (!supabase) return;
  const [{ data: essencias = [] } = {}, { data: cores = [] } = {}, { data: formas = [] } = {}] = await Promise.all([
    supabase.from('essencias').select('value'),
    supabase.from('cores').select('value'),
    supabase.from('formas').select('nome, preco')
  ]).catch(err => { console.error('Erro ao carregar listas admin:', err); return []; });

  renderLista('lista-essencias', (essencias || []).map(e => e.value), removerEssencia);
  renderLista('lista-cores', (cores || []).map(c => c.value), removerCor);
  renderLista('lista-formas', (formas || []).map(f => `${f.nome} - R$ ${parseFloat(f.preco).toFixed(2).replace('.', ',')}`), removerForma, (formas || []).map(f => f.nome));
}

function renderLista(id, valores, removerFunc, nomesOriginais) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  valores.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = typeof item === "string" ? item : item;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.style.marginLeft = "10px";
    btn.onclick = () => removerFunc(nomesOriginais ? nomesOriginais[i] : item);
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

async function adicionarEssencia() {
  const input = document.getElementById("nova-essencia");
  const nova = input.value.trim();
  if (!nova) return showNotification('Atenção', 'Digite uma essência.', 'warning');
  const supabase = ensureSupabase();
  if (!supabase) return showNotification('Erro', 'Supabase não inicializado.', 'error');
  // check exists
  const { data: exists } = await supabase.from('essencias').select('value').eq('value', nova).single();
  if (exists) return showNotification('Erro', 'Essa essência já existe.', 'error');
  await supabase.from('essencias').insert({ value: nova });
  showNotification('Sucesso', `Essência "${nova}" adicionada!`, 'success');
  input.value = '';
  carregarListasAdmin();
}

async function adicionarCor() {
  const input = document.getElementById("nova-cor");
  const nova = input.value.trim();
  if (!nova) return showNotification('Atenção', 'Digite uma cor.', 'warning');
  const supabase = ensureSupabase();
  if (!supabase) return showNotification('Erro', 'Supabase não inicializado.', 'error');
  const { data: exists } = await supabase.from('cores').select('value').eq('value', nova).single();
  if (exists) return showNotification('Erro', 'Essa cor já existe.', 'error');
  await supabase.from('cores').insert({ value: nova });
  showNotification('Sucesso', `Cor "${nova}" adicionada!`, 'success');
  input.value = '';
  carregarListasAdmin();
}

async function adicionarForma() {
  const nomeInput = document.getElementById("nova-forma");
  const precoInput = document.getElementById("preco-forma");
  const nome = nomeInput.value.trim();
  const preco = parseFloat(precoInput.value.trim().replace(",", "."));
  if (!nome || isNaN(preco)) return showNotification('Atenção', 'Preencha nome e preço corretamente.', 'warning');
  const supabase = ensureSupabase();
  if (!supabase) return showNotification('Erro', 'Supabase não inicializado.', 'error');
  const { data: exists } = await supabase.from('formas').select('nome').eq('nome', nome).single();
  if (exists) return showNotification('Erro', 'Essa forma já existe.', 'error');
  await supabase.from('formas').insert({ nome, preco });
  showNotification('Sucesso', `Forma "${nome}" adicionada!`, 'success');
  nomeInput.value = '';
  precoInput.value = '';
  carregarListasAdmin();
}

async function removerEssencia(nome) {
  const ok = await showConfirm('Remover essência', `Deseja remover a essência "${nome}"?`);
  if (!ok) return;
  const supabase = ensureSupabase();
  if (!supabase) return showNotification('Erro', 'Supabase não inicializado.', 'error');
  const { error } = await supabase.from('essencias').delete().eq('value', nome);
  if (error) return showNotification('Erro', 'Erro ao remover essência: ' + error.message, 'error');
  showNotification('Sucesso', `Essência "${nome}" removida!`, 'success');
  carregarListasAdmin();
}

async function removerCor(nome) {
  const ok = await showConfirm('Remover cor', `Deseja remover a cor "${nome}"?`);
  if (!ok) return;
  const supabase = ensureSupabase();
  if (!supabase) return showNotification('Erro', 'Supabase não inicializado.', 'error');
  const { error } = await supabase.from('cores').delete().eq('value', nome);
  if (error) return showNotification('Erro', 'Erro ao remover cor: ' + error.message, 'error');
  showNotification('Sucesso', `Cor "${nome}" removida!`, 'success');
  carregarListasAdmin();
}

async function removerForma(nome) {
  const ok = await showConfirm('Remover forma', `Deseja remover a forma "${nome}"?`);
  if (!ok) return;
  const supabase = ensureSupabase();
  if (!supabase) return showNotification('Erro', 'Supabase não inicializado.', 'error');
  const { error } = await supabase.from('formas').delete().eq('nome', nome);
  if (error) return showNotification('Erro', 'Erro ao remover forma: ' + error.message, 'error');
  showNotification('Sucesso', `Forma "${nome}" removida!`, 'success');
  carregarListasAdmin();
}

// === Página Personalização ===
document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("formPersonalizado");
  const botaoLeitor = document.getElementById("leitor-pagina");

  if (botaoLeitor) {
    botaoLeitor.addEventListener("click", () => {
      const conteudo = document.body.innerText;
      const synth = window.speechSynthesis;
      if (synth.speaking) synth.cancel();
      else {
        const utterance = new SpeechSynthesisUtterance(conteudo);
        utterance.lang = "pt-BR";
        synth.speak(utterance);
      }
    });
  }

  if (!form) return;

  const selectEssencia = document.getElementById("essencia");
  const selectCor = document.getElementById("cor");
  const selectForma = document.getElementById("forma");
  const inputQuantidade = document.getElementById("quantidade");
  const precoDisplay = document.getElementById("preco-forma-texto");
  const totalDisplay = document.getElementById("preco-total");

  let precos = {};

  try {
    const supabase = ensureSupabase();
    if (!supabase) throw new Error('Supabase não inicializado');
    
    const [{ data: essencias = [] } = {}, { data: cores = [] } = {}, { data: formas = [] } = {}] = await Promise.all([
      supabase.from('essencias').select('value'),
      supabase.from('cores').select('value'),
      supabase.from('formas').select('nome, preco')
    ]);

    (essencias || []).forEach(e => {
      const o = document.createElement("option");
      o.value = e.value;
      o.textContent = e.value;
      selectEssencia.appendChild(o);
    });
    (cores || []).forEach(c => {
      const o = document.createElement("option");
      o.value = c.value;
      o.textContent = c.value;
      selectCor.appendChild(o);
    });
    (formas || []).forEach(f => {
      const o = document.createElement("option");
      o.value = f.nome;
      o.textContent = f.nome;
      selectForma.appendChild(o);
      precos[f.nome] = parseFloat(f.preco);
    });
  } catch (err) {
    console.error("Erro ao carregar personalização:", err);
    alert("Erro ao carregar os dados do formulário.");
  }

  function atualizarPrecos() {
    const forma = selectForma.value;
    const qtd = parseInt(inputQuantidade.value) || 1;
    if (forma && precos[forma]) {
      const unit = precos[forma];
      const total = unit * qtd;
      precoDisplay.textContent = `Preço unitário: R$ ${unit.toFixed(2).replace(".", ",")}`;
      totalDisplay.textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
    } else {
      precoDisplay.textContent = "";
      totalDisplay.textContent = "";
    }
  }

  selectForma.addEventListener("change", atualizarPrecos);
  inputQuantidade.addEventListener("input", atualizarPrecos);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const essencia = selectEssencia.value;
    const cor = selectCor.value;
    const forma = selectForma.value;
    const qtd = parseInt(inputQuantidade.value) || 1;
    if (!essencia || !cor || !forma || qtd < 1) return showNotification('Atenção', 'Preencha todos os campos.', 'warning');
    const unit = precos[forma];
    const total = unit * qtd;
    const msg = `Olá! Gostaria de sabonetes personalizados com:\n- Essência: ${essencia}\n- Cor: ${cor}\n- Forma: ${forma}\n- Quantidade: ${qtd}\n- Preço unitário: R$ ${unit.toFixed(2).replace(".", ",")}\n- Total: R$ ${total.toFixed(2).replace(".", ",")}`;
    const url = `https://wa.me/5519993043355?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });

  // Produtos: primeiro tenta carregar do Supabase, se falhar, fallback para JSON estático
  async function loadHomeProducts() {
    const container = document.getElementById("lista-produtos");
    if (!container) return;
    container.innerHTML = '<div class="loading">Carregando produtos...</div>';
    try {
      const supabase = ensureSupabase();
      if (supabase) {
        const { data, error } = await supabase.from('products').select('id, name, image').order('id', { ascending: false });
        if (!error && data && data.length > 0) {
          container.innerHTML = '';
          data.forEach(item => {
            const card = document.createElement("div");
            card.className = "card-produto";
            const img = document.createElement("img");
            img.src = '/img/' + (item.image || 'quadrado.jpg');
            img.alt = item.name;
            img.onerror = function() { this.src = '/img/quadrado.jpg'; };
            const nome = document.createElement("p");
            nome.textContent = item.name;
            card.appendChild(img);
            card.appendChild(nome);
            container.appendChild(card);
          });
          return;
        }
      }
    } catch (err) {
      console.error('Erro ao carregar produtos do Supabase:', err);
    }

    // Fallback: carregar JSON estático
    fetch("json/produtos.json")
      .then(res => res.json())
      .then(produtos => {
        container.innerHTML = '';
        produtos.forEach(item => {
          const card = document.createElement("div");
          card.className = "card-produto";
          const img = document.createElement("img");
          img.src = item.imagem;
          img.alt = item.nome;
          const nome = document.createElement("p");
          nome.textContent = item.nome;
          card.appendChild(img);
          card.appendChild(nome);
          container.appendChild(card);
        });
      })
      .catch(err => console.error("Erro ao carregar produtos:", err));
  }

  // Executa carregamento de produtos da home
  loadHomeProducts();

    carregarAviso();
    setupUserMenuHandlers();
});
