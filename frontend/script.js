// ==========================================================
// LÓGICA VISUAL (menu, abas, carrossel de personagens, etc.)
// ==========================================================
// ALTERAÇÕES FEITAS NESTE ARQUIVO:
// 1) O login/registro que ficava aqui foi REMOVIDO e movido
//    para o novo arquivo auth.js, que agora fala com o backend
//    Spring Boot em vez de comparar dados salvos no localStorage.
// 2) O bloco final "INTEGRAÇÃO COM O BACKEND" (que procurava um
//    formulário com id="seuFormulario") foi removido: esse id
//    não existe em nenhuma página do site, então era código
//    morto que nunca era executado.
// A lógica abaixo é só de interface (não mexe em login nem em
// dados sensíveis).
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile (abre/fecha a navegação em telas pequenas)
  const menu = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  if (menu) menu.addEventListener('click', () => nav.classList.toggle('open'));

  // Abas "Entrar" / "Criar conta" na tela inicial
  document.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  }));

  // Carrossel de personagens: edite esta lista depois com os
  // dados e imagens reais.
  const chars = [
    { name: 'Arukã', image: '', text: 'Insira aqui a descrição de Arukã. Este campo pode receber história, aparência, personalidade, relações e acontecimentos importantes.' },
    { name: 'Aruna', image: '', text: 'Insira aqui a descrição de Aruna e substitua o campo de imagem quando a arte estiver pronta.' },
    { name: 'Rakaro', image: '', text: 'Insira aqui a descrição de Rakaro. Os botões abaixo alternam entre os personagens cadastrados no arquivo script.js.' }
  ];
  let idx = 0;
  const name = document.getElementById('charName'), text = document.getElementById('charText'),
        img = document.getElementById('charImage'), empty = document.getElementById('charEmpty'),
        dots = document.getElementById('charDots');
  function renderChar() {
    if (!name) return;
    const c = chars[idx];
    name.textContent = c.name;
    text.textContent = c.text;
    if (c.image) { img.src = c.image; img.hidden = false; empty.hidden = true; }
    else { img.hidden = true; empty.hidden = false; }
    dots.innerHTML = chars.map((_, i) => `<span class="dot ${i === idx ? 'active' : ''}"></span>`).join('');
  }
  document.getElementById('prevChar')?.addEventListener('click', () => { idx = (idx - 1 + chars.length) % chars.length; renderChar(); });
  document.getElementById('nextChar')?.addEventListener('click', () => { idx = (idx + 1) % chars.length; renderChar(); });
  renderChar();

  // Botões A- / A+ da página do livro (aumentam/diminuem a fonte)
  document.querySelectorAll('[data-font]').forEach(b => b.addEventListener('click', () => {
    const s = document.querySelector('.book-scroll');
    const cur = parseFloat(getComputedStyle(s).fontSize);
    s.style.fontSize = Math.max(13, Math.min(26, cur + Number(b.dataset.font))) + 'px';
  }));

  // Efeito visual de brasas subindo na tela inicial
  const emb = document.querySelector('.embers');
  if (emb) {
    for (let i = 0; i < 30; i++) {
      const e = document.createElement('i');
      e.className = 'ember';
      e.style.left = Math.random() * 100 + '%';
      e.style.bottom = (-10 - Math.random() * 40) + 'px';
      e.style.animationDuration = (5 + Math.random() * 8) + 's';
      e.style.animationDelay = (-Math.random() * 10) + 's';
      e.style.opacity = .25 + Math.random() * .7;
      emb.appendChild(e);
    }
  }
});
