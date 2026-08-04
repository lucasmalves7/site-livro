// ==========================================================
// AUTENTICAÇÃO E CONTROLE DE ACESSO
// ==========================================================
// Arquivo NOVO. Antes, o "login" ficava misturado dentro do
// script.js e apenas comparava usuário/senha salvos no
// localStorage do próprio navegador (não existia backend real
// nem proteção de páginas).
//
// Agora este arquivo cuida de 3 responsabilidades:
//   1) Registro e login enviando os dados para o backend
//      Spring Boot (via fetch), preparado para gravar em banco.
//   2) Proteção de rotas: livro.html, mapas.html, personagens.html
//      e autor.html só podem ser abertas por quem estiver
//      autenticado (token salvo). Se não estiver, o usuário é
//      redirecionado automaticamente para index.html.
//   3) Bloqueio temporário das páginas "Mapas", "Personagens" e
//      "Autor": ao clicar nesses links, mostramos um alert
//      avisando que a página está em construção e cancelamos a
//      navegação.
// ==========================================================

// ---- Chaves usadas no localStorage para guardar a sessão ----
const CHAVE_TOKEN = 'endf_token';
const CHAVE_EMAIL = 'endf_email';

// Páginas que ainda não estão prontas e não podem ser abertas
// pelo link do menu (nem digitando a URL diretamente).
const PAGINAS_EM_CONSTRUCAO = ['mapas.html', 'personagens.html', 'autor.html'];

// Páginas que exigem estar logado para serem acessadas.
const PAGINAS_PROTEGIDAS = ['livro.html', 'mapas.html', 'personagens.html', 'autor.html'];

// ----------------------------------------------------------
// Funções utilitárias de sessão
// ----------------------------------------------------------
function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

function usuarioAutenticado() {
  return !!obterToken();
}

function salvarSessao(token, email) {
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_EMAIL, email || '');
}

function encerrarSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_EMAIL);
}

// ----------------------------------------------------------
// 1) Proteção de páginas privadas
// ----------------------------------------------------------
// Roda IMEDIATAMENTE (fora do DOMContentLoaded, chamada no
// <head> de cada página protegida) para redirecionar antes
// mesmo da página terminar de carregar, evitando qualquer
// "flash" de conteúdo para quem não está logado.
function protegerPaginaAtual() {
  const pagina = location.pathname.split('/').pop() || 'index.html';
  if (PAGINAS_PROTEGIDAS.includes(pagina) && !usuarioAutenticado()) {
    location.href = 'index.html';
  }
}

// ----------------------------------------------------------
// 2) Bloqueio das páginas "Mapas", "Personagens" e "Autor"
// ----------------------------------------------------------
// a) Se alguém clicar nesses links do menu, cancela a navegação
//    e mostra o alert pedido.
function bloquearLinksEmConstrucao() {
  document.querySelectorAll('a[href]').forEach((link) => {
    const destino = link.getAttribute('href');
    if (PAGINAS_EM_CONSTRUCAO.includes(destino)) {
      link.addEventListener('click', (evento) => {
        evento.preventDefault();
        alert('Página ainda em construção');
      });
    }
  });
}

// b) Reforço: se alguém tentar acessar mapas.html, personagens.html
//    ou autor.html digitando a URL direto no navegador, também
//    bloqueamos e mandamos de volta (para livro.html se já estiver
//    logado, ou para index.html se não estiver).
function bloquearAcessoDiretoEmConstrucao() {
  const pagina = location.pathname.split('/').pop() || 'index.html';
  if (PAGINAS_EM_CONSTRUCAO.includes(pagina)) {
    alert('Página ainda em construção');
    location.href = usuarioAutenticado() ? 'livro.html' : 'index.html';
  }
}

// ----------------------------------------------------------
// 3) Registro (criar usuário) e Login via backend Spring Boot
// ----------------------------------------------------------
function configurarFormulariosDeAcesso() {
  const formRegistro = document.getElementById('registerForm');
  const formLogin = document.getElementById('loginForm');
  const mensagemEl = document.querySelector('.form-message');

  function exibirMensagem(texto) {
    if (mensagemEl) mensagemEl.textContent = texto;
  }

  // ---- Criar conta ----
  if (formRegistro) {
    formRegistro.addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const email = formRegistro.email.value.trim();
      const senha = formRegistro.password.value;
      const botao = formRegistro.querySelector('button');

      if (senha.length < 4) {
        exibirMensagem('A senha precisa ter ao menos 4 caracteres.');
        return;
      }

      try {
        if (botao) { botao.disabled = true; botao.textContent = 'Criando conta...'; }

        // Envia os dados para o backend Spring Boot gravar no banco.
        const resposta = await fetch(`${API_BASE_URL}/auth/registro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        });

        if (resposta.status === 201 || resposta.ok) {
          exibirMensagem('Conta criada com sucesso. Você já pode entrar.');
          formRegistro.reset();
          document.querySelector('[data-tab="loginPanel"]')?.click();
        } else if (resposta.status === 409) {
          exibirMensagem('Este e-mail já possui cadastro.');
        } else {
          exibirMensagem('Não foi possível criar a conta. Tente novamente.');
        }
      } catch (erro) {
        console.error('Erro ao registrar usuário:', erro);
        exibirMensagem('Erro ao conectar com o servidor.');
      } finally {
        if (botao) { botao.disabled = false; botao.textContent = 'Criar acesso'; }
      }
    });
  }

  // ---- Entrar ----
  if (formLogin) {
    formLogin.addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const email = formLogin.email.value.trim();
      const senha = formLogin.password.value;
      const botao = formLogin.querySelector('button');

      try {
        if (botao) { botao.disabled = true; botao.textContent = 'Entrando...'; }

        const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          // Backend deve devolver algo como { token: "..." }
          salvarSessao(dados.token, email);
          // Requisito: após autenticar, ir direto para a página do livro.
          location.href = 'livro.html';
        } else if (resposta.status === 401) {
          exibirMensagem('E-mail ou senha incorretos.');
        } else {
          exibirMensagem('Não foi possível entrar. Tente novamente.');
        }
      } catch (erro) {
        console.error('Erro ao autenticar usuário:', erro);
        exibirMensagem('Erro ao conectar com o servidor.');
      } finally {
        if (botao) { botao.disabled = false; botao.textContent = 'Entrar no mundo'; }
      }
    });
  }
}

// ----------------------------------------------------------
// 4) Botão "Sair"
// ----------------------------------------------------------
function configurarBotaoSair() {
  const botaoSair = document.getElementById('logoutBtn');
  if (botaoSair) {
    botaoSair.addEventListener('click', () => {
      encerrarSessao();
      location.href = 'index.html';
    });
  }
}

// ----------------------------------------------------------
// Inicialização (roda quando o HTML termina de carregar)
// ----------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  bloquearLinksEmConstrucao();
  configurarFormulariosDeAcesso();
  configurarBotaoSair();
});
