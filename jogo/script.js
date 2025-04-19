// script.js
const posicoes = {
    'Mi': [
        {y: 80, tipo: 'linha'},   // 1ª linha
        {y: 12, tipo: 'espaço'}   // Entre 1ª e 2ª linha (FÁ)
    ],
    'Sol': [
        {y: 60, tipo: 'linha'}    // 2ª linha
    ],
    'Si': [
        {y: 40, tipo: 'linha'}    // 3ª linha
    ],
    'Ré': [
        {y: 20, tipo: 'linha'}    // 4ª linha
    ],
    'Fá': [
        {y: 5, tipo: 'linha'},    // 5ª linha
        {y: 70, tipo: 'espaço'}   // Entre 1ª e 2ª linha (FÁ)
    ],
    'Lá': [
        {y: 50, tipo: 'espaço'}   // Entre 2ª e 3ª linha
    ],
    'Dó': [
        {y: 30, tipo: 'espaço'}   // Entre 3ª e 4ª linha
    ]
};


let notaAtual = 'Dó';
let pontuacao = 0;

function atualizarDesafio() {
    const notas = Object.keys(posicoes);
    notaAtual = notas[Math.floor(Math.random() * notas.length)];
    document.getElementById('nota-alvo').textContent = `Encontre: ${notaAtual.toUpperCase()}`;
}

function atualizarPontuacao() {
    document.getElementById('pontuacao').textContent = `Pontuação: ${pontuacao}`;
}

document.querySelectorAll('.nota-item').forEach(nota => {
    nota.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.dataset.nota);
    });
});

document.querySelector('.pentagrama').addEventListener('dragover', e => {
    e.preventDefault();
});

document.querySelector('.pentagrama').addEventListener('drop', e => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const y = (e.clientY - rect.top) / rect.height * 100;
    const nota = e.dataTransfer.getData('text/plain');

    const posicoesValidas = posicoes[notaAtual];
    let closestPos = null;
    let minDiff = Infinity;

    posicoesValidas.forEach(pos => {
        const diff = Math.abs(y - pos.y);
        if (diff < minDiff) {
            minDiff = diff;
            closestPos = pos;
        }
    });

    const posicaoCorreta = minDiff < 10;
    const feedback = document.getElementById('feedback');

    if (posicaoCorreta && nota === notaAtual) {
        pontuacao += 10;
        atualizarPontuacao();
        
        const notaFigura = document.createElement('div');
        notaFigura.className = 'nota-colocada';
        notaFigura.textContent = nota[0];
        notaFigura.style.left = `${(e.clientX - rect.left)/rect.width*100}%`;
        notaFigura.style.top = `calc(${closestPos.y}% - 12.5px)`;
        document.querySelector('.pentagrama').appendChild(notaFigura);

        feedback.textContent = "✅ Correto! Muito bem!";
        feedback.className = 'correto';
        
        setTimeout(() => {
            feedback.textContent = '';
            feedback.className = '';
            atualizarDesafio();
        }, 1500);
    } else {
        feedback.textContent = "❌ Local errado ou nota incorreta!";
        feedback.className = 'errado';
        
        setTimeout(() => {
            feedback.textContent = '';
            feedback.className = '';
        }, 1500);
    }
});

document.getElementById('reset').addEventListener('click', () => {
    pontuacao = 0;
    atualizarPontuacao();
    document.querySelectorAll('.nota-colocada').forEach(el => el.remove());
    atualizarDesafio();
});

// Inicia o jogo
atualizarDesafio();
