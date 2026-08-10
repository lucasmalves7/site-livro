

async function cadastrar(usuario) {

    const resposta = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    });

    const dados = await resposta.json().catch(() => ({}));

    return {
        resposta: resposta,
        dados: dados
    };
}

async function login(email, senha) {

    const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            senha: senha
        })
    });

    const dados = await resposta.json().catch(() => ({}));

    return {
        resposta: resposta,
        dados: dados
    };
}

async function obterUsuario() {

    const token = localStorage.getItem('endf_token');

    if (!token) {
        return null;
    }

    const resposta = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!resposta.ok) {
        return null;
    }

    return await resposta.json();
}