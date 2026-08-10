
const CHAVE_TOKEN = 'endf_token';
const CHAVE_EMAIL = 'endf_email';

const PAGINAS_EM_CONSTRUCAO = [
'mapas.html',
'personagens.html',
'autor.html'
];

const PAGINAS_PROTEGIDAS = [
'livro.html',
'mapas.html',
'personagens.html',
'autor.html'
];

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

/* ==========================================================
PROTEÇÃO DAS PÁGINAS
========================================================== */

function protegerPaginaAtual() {

const pagina =
    location.pathname.split('/').pop() || 'index.html';

if (
    PAGINAS_PROTEGIDAS.includes(pagina) &&
    !usuarioAutenticado()
) {
    location.href = 'index.html';
}

}

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

function bloquearAcessoDiretoEmConstrucao() {

const pagina =
    location.pathname.split('/').pop() || 'index.html';

if (PAGINAS_EM_CONSTRUCAO.includes(pagina)) {

    alert('Página ainda em construção');

    location.href =
        usuarioAutenticado()
            ? 'livro.html'
            : 'index.html';
}

}

/* ==========================================================
FORMULÁRIOS
========================================================== */

function configurarFormulariosDeAcesso() {

const formRegistro =
    document.getElementById('registerForm');

const formLogin =
    document.getElementById('loginForm');

const mensagemEl =
    document.querySelector('.form-message');


function exibirMensagem(texto) {

    if (mensagemEl) {
        mensagemEl.textContent = texto;
    }
}


/* ======================================================
   CADASTRO
   ====================================================== */

if (formRegistro) {

    formRegistro.addEventListener(
        'submit',
        async (evento) => {

            evento.preventDefault();

            const email =
                formRegistro.email.value.trim();

            const senha =
                formRegistro.password.value;

            const botao =
                formRegistro.querySelector('button');


            if (senha.length < 4) {

                exibirMensagem(
                    'A senha precisa ter ao menos 4 caracteres.'
                );

                return;
            }


            try {

                if (botao) {
                    botao.disabled = true;
                    botao.textContent = 'Criando conta...';
                }


                const resultado =
                    await cadastrar({
                        email: email,
                        senha: senha
                    });


                if (
                    resultado.resposta.status === 201 ||
                    resultado.resposta.ok
                ) {

                    exibirMensagem(
                        'Conta criada com sucesso! Você já pode entrar.'
                    );

                    formRegistro.reset();

                    const abaLogin =
                        document.querySelector(
                            '[data-tab="loginPanel"]'
                        );

                    if (abaLogin) {
                        abaLogin.click();
                    }

                } else if (
                    resultado.resposta.status === 409
                ) {

                    exibirMensagem(
                        'Este e-mail já possui cadastro.'
                    );

                } else {

                    console.error(
                        'Erro no cadastro:',
                        resultado.dados
                    );

                    exibirMensagem(
                        'Não foi possível criar a conta.'
                    );
                }

            } catch (erro) {

                console.error(
                    'Erro ao registrar usuário:',
                    erro
                );

                exibirMensagem(
                    'Erro ao conectar com o servidor.'
                );

            } finally {

                if (botao) {
                    botao.disabled = false;
                    botao.textContent = 'Criar acesso';
                }
            }
        }
    );
}


/* ======================================================
   LOGIN
   ====================================================== */

if (formLogin) {

    formLogin.addEventListener(
        'submit',
        async (evento) => {

            evento.preventDefault();

            const email =
                formLogin.email.value.trim();

            const senha =
                formLogin.password.value;

            const botao =
                formLogin.querySelector('button');


            try {

                if (botao) {
                    botao.disabled = true;
                    botao.textContent = 'Entrando...';
                }


                const resultado =
                    await login(email, senha);


                if (resultado.resposta.ok) {

                    const token =
                        resultado.dados.token;


                    if (!token) {

                        console.error(
                            'O backend não retornou um token:',
                            resultado.dados
                        );

                        exibirMensagem(
                            'Login realizado, mas o token não foi recebido.'
                        );

                        return;
                    }


                    salvarSessao(token, email);

                    console.log(
                        'Login realizado com sucesso.'
                    );


                    location.href = 'livro.html';

                } else if (
                    resultado.resposta.status === 401
                ) {

                    exibirMensagem(
                        'E-mail ou senha incorretos.'
                    );

                } else {

                    console.error(
                        'Erro no login:',
                        resultado.dados
                    );

                    exibirMensagem(
                        'Não foi possível entrar. Tente novamente.'
                    );
                }

            } catch (erro) {

                console.error(
                    'Erro ao autenticar usuário:',
                    erro
                );

                exibirMensagem(
                    'Erro ao conectar com o servidor.'
                );

            } finally {

                if (botao) {
                    botao.disabled = false;
                    botao.textContent = 'Entrar';
                }
            }
        }
    );
}

}

/* ==========================================================
BOTÃO SAIR
========================================================== */

function configurarBotaoSair() {

const botaoSair =
    document.getElementById('logoutBtn');

if (botaoSair) {

    botaoSair.addEventListener(
        'click',
        () => {

            encerrarSessao();

            location.href = 'index.html';
        }
    );
}

}

/* ==========================================================
INICIALIZAÇÃO
========================================================== */

protegerPaginaAtual();
bloquearAcessoDiretoEmConstrucao();

document.addEventListener(
'DOMContentLoaded',
() => {

    bloquearLinksEmConstrucao();

    configurarFormulariosDeAcesso();

    configurarBotaoSair();
}

);