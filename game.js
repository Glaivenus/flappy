const canvas = document.getElementById('flappyBirdGame');
const ctx = canvas.getContext('2d');

canvas.width = 900;
canvas.height = 900;

let score = 0;
let gameSpeed = 0.08 ;
const gravity = 0.0002;
const maxFallSpeed = 0.07; // 最大下落速度


const birdImage = new Image();
birdImage.src = 'jyy.png';
const bird = {
    x: 50,
    y: 150,
    width: 90,
    height: 90,
    velocity: 0,
    delayFall: false // 延时下落
};


const pipes = [];
const pipeWidth = 100;
const pipeGap = 400;

const pipeTopMinSpace = 10; // 管道顶部
const pipeBottomMinSpace = 10; //管道底部

const pipeLoc = () => Math.random() * ((canvas.height - pipeGap - pipeTopMinSpace - pipeBottomMinSpace) - pipeWidth) + pipeTopMinSpace + pipeWidth;


function handleBird() {
    bird.y += bird.velocity;
    if (!bird.delayFall && bird.velocity < maxFallSpeed) {
        bird.velocity += gravity;
    }
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver();
    }
}



function handlePipes() {
    if (frames % 4000 === 0) {
        let pipeTopY = pipeLoc() - pipeWidth;
        let pipeBottomY = pipeTopY + pipeGap + pipeWidth;
        pipes.push({
            x: canvas.width,
            topY: pipeTopY,
            bottomY: pipeBottomY
        });
    }

    
       
// 检查管道碰撞
pipes.forEach(function(pipe, index) {
    pipe.x -= gameSpeed;
    // 绘制上半部分管道
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topY);
    // 绘制下半部分管道
    ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);

    // 移除超出画布的管道
    if (pipe.x + pipeWidth < 0) {
        pipes.splice(index, 1);
        score++;
    }

    // 水平碰撞检测
    let birdInPipeHorizontal = bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x;
    // 垂直碰撞检测（上半部分管道）
    let hitTopPipe = bird.y < pipe.topY;
    // 垂直碰撞检测（下半部分管道）
    let hitBottomPipe = bird.y + bird.height > pipe.bottomY;

    if (birdInPipeHorizontal && (hitTopPipe || hitBottomPipe)) {
        gameOver();
    }
});


}

function handleScore() {
    ctx.font = '25px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 20, canvas.height - 20);
}

function gameOver() {
    isGameRunning = false; 

    const gameOverImage = new Image();
    gameOverImage.src = 'gg.jpg';
    gameOverImage.onload = function() {
       
        const centerX = (canvas.width - gameOverImage.width) / 2;
        const centerY = (canvas.height - gameOverImage.height) / 2;
        ctx.drawImage(gameOverImage, centerX, centerY);
    };
}


document.addEventListener('keydown', function(e) {
    if (!isGameRunning) return;
    if (e.code === 'Space') {
        birdJump();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && isGameRunning) {
        birdJump();
    }
});

canvas.addEventListener('touchstart', function(e) {
    if (isGameRunning) {
        birdJump();
        e.preventDefault(); 
    }
}, { passive: false });


canvas.addEventListener('mousedown', function() {
    if (isGameRunning) {
        birdJump();
    }
});

function birdJump() {
    bird.velocity = -0.04;
    bird.delayFall = true;
    setTimeout(function() {
        bird.delayFall = false;
    }, 400); 
}



let frames = 0;
function animate() {
    if (!isGameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBird();
    handlePipes();
    handleScore();
    frames++;
    requestAnimationFrame(animate);
}

const interval = setInterval(() => {
    animate();
}, 1000 / 60);


function resetGame() {
    score = 0;
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    frames = 0;
}

//移动端

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8; 
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
let touchTimer; 
const zoomFactor = 1.2; 

canvas.addEventListener('touchstart', function(e) {
    touchTimer = setTimeout(function() {
        canvas.style.width = `${canvas.width * zoomFactor}px`;
        canvas.style.height = `${canvas.height * zoomFactor}px`;
    }, 500);
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', function() {
    clearTimeout(touchTimer); 
});
