
//Lógica Visual
document.addEventListener('DOMContentLoaded',()=>{
 const menu=document.querySelector('.menu-btn'),nav=document.querySelector('.nav');
 if(menu) menu.addEventListener('click',()=>nav.classList.toggle('open'));
 document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{
   document.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active'));
   document.querySelectorAll('.auth-panel').forEach(p=>p.classList.remove('active'));
   btn.classList.add('active'); document.getElementById(btn.dataset.tab).classList.add('active');
 }));
 const login=document.getElementById('loginForm'),register=document.getElementById('registerForm');
 if(register) register.addEventListener('submit',e=>{e.preventDefault();const email=register.email.value.trim(),pass=register.password.value;if(pass.length<4)return msg('A senha precisa ter ao menos 4 caracteres.');localStorage.setItem('codiceUser',JSON.stringify({email,pass}));msg('Conta criada. Você já pode entrar.');document.querySelector('[data-tab="loginPanel"]').click();});
 if(login) login.addEventListener('submit',e=>{e.preventDefault();const saved=JSON.parse(localStorage.getItem('codiceUser')||'null');if(!saved){msg('Crie uma conta primeiro.');return}if(login.email.value.trim()===saved.email&&login.password.value===saved.pass){localStorage.setItem('codiceAuth','1');location.href='livro.html'}else msg('E-mail ou senha incorretos.');});
 function msg(t){const el=document.querySelector('.form-message');if(el)el.textContent=t}
 // Character carousel: edit this list later with real assets and descriptions.
 const chars=[
  {name:'Arukã',image:'',text:'Insira aqui a descrição de Arukã. Este campo pode receber história, aparência, personalidade, relações e acontecimentos importantes.'},
  {name:'Aruna',image:'',text:'Insira aqui a descrição de Aruna e substitua o campo de imagem quando a arte estiver pronta.'},
  {name:'Rakaro',image:'',text:'Insira aqui a descrição de Rakaro. Os botões abaixo alternam entre os personagens cadastrados no arquivo script.js.'}
 ];
 let idx=0; const name=document.getElementById('charName'),text=document.getElementById('charText'),img=document.getElementById('charImage'),empty=document.getElementById('charEmpty'),dots=document.getElementById('charDots');
 function renderChar(){if(!name)return;const c=chars[idx];name.textContent=c.name;text.textContent=c.text;if(c.image){img.src=c.image;img.hidden=false;empty.hidden=true}else{img.hidden=true;empty.hidden=false}dots.innerHTML=chars.map((_,i)=>`<span class="dot ${i===idx?'active':''}"></span>`).join('');}
 document.getElementById('prevChar')?.addEventListener('click',()=>{idx=(idx-1+chars.length)%chars.length;renderChar()});document.getElementById('nextChar')?.addEventListener('click',()=>{idx=(idx+1)%chars.length;renderChar()});renderChar();
 document.querySelectorAll('[data-font]').forEach(b=>b.addEventListener('click',()=>{const s=document.querySelector('.book-scroll');const cur=parseFloat(getComputedStyle(s).fontSize);s.style.fontSize=Math.max(13,Math.min(26,cur+Number(b.dataset.font)))+'px'}));
 const emb=document.querySelector('.embers');if(emb){for(let i=0;i<30;i++){const e=document.createElement('i');e.className='ember';e.style.left=Math.random()*100+'%';e.style.bottom=(-10-Math.random()*40)+'px';e.style.animationDuration=(5+Math.random()*8)+'s';e.style.animationDelay=(-Math.random()*10)+'s';e.style.opacity=.25+Math.random()*.7;emb.appendChild(e)}}
});



// ==========================================
// INTEGRAÇÃO COM O BACKEND
// ==========================================
const form = document.getElementById('seuFormulario');

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dados = {
            nome: document.getElementById('campoNome').value,
            email: document.getElementById('campoEmail').value,
            mensagem: document.getElementById('campoMensagem').value
        };

        try {
            // 🛑 Como estava antes (Local):
            // const response = await fetch('http://localhost:8080/api/contatos', { ...

            // 🟢 Como ficará para a Hospedagem na Nuvem:
            const response = await fetch('https://ENDF.onrender.com/api/contatos', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert('Enviado com sucesso!');
                form.reset();
            } else {
                alert('Erro ao enviar.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });
}
