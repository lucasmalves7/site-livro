// ==========================================================
// CONFIGURAÇÃO DA API (BACKEND SPRING BOOT)
// ==========================================================
// Arquivo novo, criado para centralizar em um único lugar o
// endereço do backend. Assim, quando o Spring Boot estiver
// publicado (ex.: Render, Railway, servidor próprio etc.),
// basta trocar o valor abaixo — nenhum outro arquivo precisa
// ser alterado.
//
// Endpoints que o backend Spring Boot deve expor:
//   POST {API_BASE_URL}/auth/registro   -> cria usuário no banco
//   POST {API_BASE_URL}/auth/login      -> autentica e devolve um token
//
// Formato esperado pelo front-end:
//   Registro -> envia  { email, senha }
//              recebe 201 (criado) ou 409 (e-mail já existe)
//   Login    -> envia  { email, senha }
//              recebe 200 { token: "..." } ou 401 (credenciais inválidas)
// ==========================================================

// 🟢 Troque esta URL pela URL real do seu backend Spring Boot quando ele
//    estiver publicado. Durante o desenvolvimento local, use algo como
//    'http://localhost:8080/api'.
const API_BASE_URL = 'http://localhost:8080/api';
