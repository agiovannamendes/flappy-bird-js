const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// ======================
// ESTADOS DO JOGO
// ======================

let gameStarted = false;
let gameOver = false;

let playerName = "";

// ======================
// PÁSSARO
// ======================

const birdX = 100;

let birdY = 250;

const birdWidth = 40;
const birdHeight = 40;

let velocityY = 0;

const gravity = 0.5;
const jumpForce = -8;

// ======================
// CANOS
// ======================

const pipeWidth = 60;
const gap = 170;

let pipeSpeed = 2;

let pipes = [];

// ======================
// PONTUAÇÃO
// ======================

let lastScore = 0;
let score = 0;
let ranking =
JSON.parse(
    localStorage.getItem("ranking")
) || [];
let highScore =
parseInt(
localStorage.getItem("highScore")
) || 0;

const gameOverMessages = [

    "PERDEU PLAYBA 😎",

    "PERDEU MANE 🤡",

    "TU E RUIM DMS 😂",

    "VAI JOGAR ROBLOX 🧱",

    "SKILL ISSUE 😏",

    "AI FALTOU HABILIDADE",

    "NT= NEM TENTOU"

];

let currentGameOverMessage =
    gameOverMessages[0];


// ======================
// FUNÇÕES
// ======================

function createPipe() {

    const topHeight =
        Math.floor(Math.random() * 250) + 50;

    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        passed: false
    });

}

function saveScore() {

    lastScore = score;

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "highScore",
            highScore
        );

    }

    let jogadorExiste = false;

    for (let jogador of ranking) {

        if (jogador.nome === playerName) {

            jogadorExiste = true;

            if (score > jogador.pontos) {

                jogador.pontos = score;

            }

        }

    }

    if (!jogadorExiste) {

        ranking.push({

            nome: playerName,

            pontos: score

        });

    }

    ranking.sort(
        (a, b) => b.pontos - a.pontos
    );

    localStorage.setItem(
        "ranking",
        JSON.stringify(ranking)
    );

    currentGameOverMessage =

    gameOverMessages[

        Math.floor(
            Math.random() *
            gameOverMessages.length
        )

    ];

}

function resetGame() {

    birdY = 250;

    velocityY = 0;

    pipes = [];

    score = 0;

    pipeSpeed = 2;

    gameOver = false;

    createPipe();

}

const menu =
    document.getElementById("menu");

const playerInput =
    document.getElementById("playerName");

const startButton =
    document.getElementById("startButton");

startButton.addEventListener(
    "click",
    function() {

        playerName =
            playerInput.value.trim();

        if(playerName === ""){

            alert(
                "Digite seu nome primeiro."
            );

            return;
        }

        menu.style.display = "none";

        gameStarted = true;

        resetGame();

    }
);

// ======================
// TECLADO
// ======================

document.addEventListener("keydown", function(event) {

    if (event.code !== "Space") return;

    event.preventDefault();

    // INICIAR JOGO
    if (!gameStarted) {

        gameStarted = true;

        resetGame();

        velocityY = jumpForce;

        return;

    }

    // REINICIAR APÓS GAME OVER
    if (gameOver) {

        resetGame();

        velocityY = jumpForce;

        return;

    }

    // PULO NORMAL
    velocityY = jumpForce;

});

// ======================
// LOOP
// ======================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Fundo
    ctx.fillStyle = "#87CEEB";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // ==================
    // TELA INICIAL
    // ==================

    if (!gameStarted) {

    ctx.fillStyle = "black";

    ctx.font = "30px Arial";

    ctx.fillText(
        "FLAPPY BIRD",
        95,
        180
    );

    ctx.font = "18px Arial";

    ctx.fillText(
        "Pressione ESPACO",
        105,
        230
    );

    // TOP 3

    ctx.font = "22px Arial";

    ctx.fillText(
        "🏆 TOP 3",
        130,
        300
    );

    ctx.font = "18px Arial";

    for(let i = 0; i < 3; i++) {

        if(ranking[i]) {

            let medalha = "";

if (i === 0) medalha = "🥇";
if (i === 1) medalha = "🥈";
if (i === 2) medalha = "🥉";

ctx.fillText(
    medalha + " " +
    ranking[i].nome +
    " - " +
    ranking[i].pontos,
    90,
    350 + (i * 30)
);

        }

    }

    requestAnimationFrame(draw);

    return;

}

    // ==================
    // GAME OVER
    // ==================

    if (gameOver) {

        ctx.fillStyle = "red";
    
        ctx.font = "32px Arial";
    
        const lines =
            currentGameOverMessage.split("\n");
    
        for(let i = 0; i < lines.length; i++){
    
            ctx.fillText(
                lines[i],
                20,
                230 + (i * 35)
            );
    
        }
    
        ctx.fillStyle = "black";
    
        ctx.font = "20px Arial";
    
        ctx.fillText(
            "Pontos: " + score,
            145,
            320
        );
    
        ctx.fillText(
            "ESPACO para reiniciar",
            75,
            380
        );
        
        ctx.font = "18px Arial";
        
        ctx.fillText(
            "🏆 TOP 3",
            140,
            430
        );
        
        for(let i = 0; i < 3; i++) {
        
            if(ranking[i]) {
        
                ctx.fillText(
                    (i + 1) + "º - " +
                    ranking[i].nome +
                    " : " +
                    ranking[i].pontos,
                    100,
                    470 + (i * 25)
                );
        
            }
        
        }
        
        requestAnimationFrame(draw);
        
        return;
    
    }

    // ==================
    // FISICA
    // ==================

    velocityY += gravity;

    birdY += velocityY;

    // TETO

    if (birdY < 0) {

        birdY = 0;

        velocityY = 0;

    }

    // CHAO

    if (birdY + birdHeight >= canvas.height) {

        saveScore();
    
        velocityY = 0;
    
        gameOver = true;
    
    }

    // ==================
    // GERAR CANOS
    // ==================

    if (
        pipes.length === 0 ||
        pipes[pipes.length - 1].x < 220
    ) {

        createPipe();

    }

    // ==================
    // CANOS
    // ==================

    ctx.fillStyle = "green";

    for (let pipe of pipes) {

        pipe.x -= pipeSpeed;

        // Cano superior

        ctx.fillRect(
            pipe.x,
            0,
            pipeWidth,
            pipe.topHeight
        );

        // Cano inferior

        ctx.fillRect(
            pipe.x,
            pipe.topHeight + gap,
            pipeWidth,
            canvas.height
        );

        // ==================
        // PONTUAÇÃO
        // ==================

        if (
            !pipe.passed &&
            pipe.x + pipeWidth < birdX
        ) {

            pipe.passed = true;

            score++;

            if (score % 5 === 0) {

                pipeSpeed += 0.2;

            }

        }

        // ==================
        // COLISÃO
        // ==================

        const bateuHorizontalmente =
            birdX + birdWidth > pipe.x &&
            birdX < pipe.x + pipeWidth;

        const bateuNoCanoDeCima =
            birdY < pipe.topHeight;

        const bateuNoCanoDeBaixo =
            birdY + birdHeight >
            pipe.topHeight + gap;

            if (

                bateuHorizontalmente &&
            
                (
            
                    bateuNoCanoDeCima ||
            
                    bateuNoCanoDeBaixo
            
                )
            
            ) {
            
                saveScore();

                velocityY = 0;

                gameOver = true;
            
            }

    }

    // Remove canos antigos

    pipes = pipes.filter(
        pipe => pipe.x + pipeWidth > 0
    );

    // ==================
    // PÁSSARO
    // ==================

    ctx.fillStyle = "yellow";

    ctx.fillRect(
        birdX,
        birdY,
        birdWidth,
        birdHeight
    );

    // Olho

    ctx.fillStyle = "black";

    ctx.beginPath();

    ctx.arc(
        birdX + 28,
        birdY + 12,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // ==================
    // SCORE
    // ==================

    ctx.fillStyle = "black";

    ctx.font = "30px Arial";

    ctx.fillText(
        score,
        20,
        50
    );
    
    ctx.font = "16px Arial";
    
    ctx.fillText(
        "REC: " + highScore,
        20,
        80
    );

    requestAnimationFrame(draw);

}

draw();