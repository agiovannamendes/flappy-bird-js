const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// ======================
// ESTADOS DO JOGO
// ======================

let gameStarted = false;
let gameOver = false;

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

    "NEM O CANO\nACREDITOU 😭",

    "O CANO\nAGRADECE 💥",

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

// ======================
// TECLADO
// ======================

document.addEventListener("keydown", function(event) {

    if (event.code !== "Space") return;

    event.preventDefault();

    if (!gameStarted) {

        gameStarted = true;

        resetGame();

        return;
    }

    if (gameOver) {

        resetGame();

        return;
    }

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
            220
        );

        ctx.font = "18px Arial";

        ctx.fillText(
            "Pressione ESPACO",
            105,
            280
        );

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