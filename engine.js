
var canvas, ctx, WIDTH, HEIGHT, fps, tileSize, playing;
var snake, playLabel;
var globalTouch = [], offset = [];

var keys = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
}

window.addEventListener("touchstart", touchStart);  // Entra os gesto de touch do celular
window.addEventListener("touchmove", touchMove);  // Verifica o touch
window.addEventListener("touchend", touchEnd);  // passa as instruçoes final do touch

window.addEventListener("keydown", keyDown);  // Entrada das teclas
window.addEventListener("resize", resizeWindow);  // Faz com que a pagina fica responsiva em tempo real

function touchEnd(e) {
    if (Math.abs(offset[0]) > Math.abs(offset[1])) {
        snake.direction = [offset[0] / Math.abs(offset[0]), 0];
    }
    else {
        snake.direction = [0, offset[1] / Math.abs(offset[1])];
    }
}

function touchMove(e) {
    var touch = e.touches[0];

    offset = [touch.pageX - globalTouch[0], touch.pageY - globalTouch[1]];
}

function touchStart(e) {
    e.preventDefault();

    var touch = e.touches[0];
    globalTouch = [touch.pageX, touch.pageY];
}

function keyDown(e) {

    if (!playing && (e.keyCode == keys.up || e.keyCode == keys.left || e.keyCode == keys.right || e.keyCode == keys.down))
            playing = true;

        switch (e.keyCode) {
            case keys.left:
                snake.direction = [-1, 0];
                break;
            
            case keys.up:
                snake.direction = [0, -1];
                break
    
            case keys.right:
                snake.direction = [1, 0];
                break;
    
            case keys.down:
                snake.direction = [0, 1];
                break;
        }

}

function resizeWindow() {  // Define o tamanho da canvas
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    tileSize = Math.max(Math.floor(WIDTH / 60), Math.floor(HEIGHT / 60));  // Pega o maior valor inteiro e atribui na tileSize
}

function isMobileDevice() {  // Verifica se e um dispossivo mobile
    return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);  // Tem que returna verdadeiro 
}

function init () {  // inicia o jogo 
    canvas = document.createElement("canvas"); // cria um elemento html e atribui ele a variavel canvas
    resizeWindow();
    document.body.appendChild(canvas);  // Inseri a canvas no corpo do html

    ctx = canvas.getContext("2d");

    fps = 15;

    newGame();
    run();
}

    function newGame () {  // Reinicializa toda as funçoes do jogo
        snake = new Snake();
        playLabel = new PlayLabel();

        playing = false;
}

function PlayLabel() {
    this.text;
    this.color = "#fff";

    this.messages = {
        portrait: "Rotacione o dispositivo para poder jogar",
        landscape: "Arraste a tela para jogar",
        pc: "Pressione as setas para jogar"
    };

    if (isMobileDevice()) {
        this.text = this.messages["landscape"];
    }
    else {
        this.text = this.messages["pc"];
    }

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.font = tileSize * 2 + "px Arial";
        ctx.fillText(this.text, WIDTH / 2 - ctx.measureText(this.text) .width / 2, HEIGHT / 2);  // Coloca as mensagens no centro da tela do dispositivo
    }
    
}

function Snake() {  // Criaçao do player
    this.body = [[10,10], [10,11], [10,12]]; // Cada celula do corpo do player. Vetor de pares ordenados
    this.color = "#96d4ec"  // Cor do player
    this.direction = [0, -1];  // Indica onde o player esta indo

    this.update = function() {
        var nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];

        if (!playing) {  // Realiza as verificaçoes para mudar a direçao do player
            if (this.direction[1] == -1 && nextPos[1] <= (HEIGHT * 0.1 / tileSize)) {
                this.direction = [1, 0];
            }

            else if (this.direction[0] == 1 && nextPos[0] >= (WIDTH * 0.9 / tileSize)) {
                this.direction = [0, 1];
            }

            else if (this.direction[1] == 1 && nextPos[1] >= (HEIGHT * 0.9 / tileSize)) {
                this.direction = [-1, 0];
            }

            else if (this.direction[0] == -1 && nextPos[0] <= (WIDTH * 0.1 / tileSize)) {
                this.direction = [0, -1];
            }

        }

        if (nextPos[0] == this.body[1][0] && nextPos[1] == this.body[1][1]) {
            this.body.reverse();
            nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];
        }

        this.body.pop();
        this.body.splice(0, 0, nextPos);
        
    }

    this.draw = function () {
        ctx.fillStyle = this.color;

        for (var i = 0; i < this.body.length; i++) {
            ctx.fillRect(this.body[i][0] * tileSize, this.body[i][1] * tileSize, tileSize, tileSize);
        }
    }

}

function update () {
    snake.update();
}

function run () {
    update(); 
    draw();

    setTimeout(run, 1000 / fps);  // passo um tempo para funçao run. 15 frames por segundo
}

function draw () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    snake.draw();

    if (!playing)
        playLabel.draw();
}

init();

