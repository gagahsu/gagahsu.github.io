/*
var canvas = document.getElementById('canvasSpace');
var ctx = canvas.getContext("2d");
ctx.fillText("hellowworld", 50, 120);
*/
var score = 0,
    gscore = 0,
    ghost = false,
    countBlink = 10,
    ghost2 = false;
var player = {
    x: 50,
    y: 100,
    pacMouth: 320,
    pacDir: 0,
    pSize: 32,
    speed: 10
};

var enemy = {
    x: 150,
    y: 200,
    speed: 10,
    moving: 0,
    dirx: 0,
    diry: 0,
    flash: 0,
    ghostNum: 0
};

var enemy2 = {
    x: 150,
    y: 200,
    speed: 10,
    moving: 0,
    dirx: 0,
    diry: 0,
    flash: 0,
    ghostNum: 0
};

var powerdot = {
    x: 10,
    y: 10,
    powerup: false,
    pCountDown: 0,
    ghostNum: 0,
    ghostNum2: 0,
    ghostEat: false
};

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.height = 400;
canvas.width = 600;

var mainImage = new Image();
mainImage.ready = false;
mainImage.onload = checkReady;
mainImage.src = "pac.png";

var keyClick = {};
document.addEventListener("keydown", function(event) {
    keyClick[event.keyCode] = true;
    move(keyClick);
}, false);

document.addEventListener("keyup", function(event) {
    delete keyClick[event.keyCode];
}, false);

function move(keyClick) {
    if (37 in keyClick) {
        player.x -= player.speed;
        player.pacDir = 64;
    }
    if (38 in keyClick) {
        player.y -= player.speed;
        player.pacDir = 96;
    }
    if (39 in keyClick) {
        player.x += player.speed;
        player.pacDir = 0;
    }
    if (40 in keyClick) {
        player.y += player.speed;
        player.pacDir = 32;
    }

    if (player.x >= (canvas.width - 32)) {
        player.x = 0;
    }
    if (player.y >= (canvas.height - 32)) {
        player.y = 0;
    }
    if (player.x < 0) {
        player.x = (canvas.width - 32);
    }
    if (player.y < 0) {
        player.y = (canvas.height - 32);
    }

    if (player.pacMouth == 320) {
        player.pacMouth = 352;
    } else {
        player.pacMouth = 320;
    }
    render();
}

function checkReady() {
    this.ready = true;
    playGame();
}

function playGame() {
    render();
    requestAnimationFrame(playGame);
}

function myNum(n) {
    return Math.floor(Math.random() * n);
}

function render() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (!powerdot.powerup && powerdot.pCountDown < 5) {
        powerdot.x = myNum(420) + 30;
        powerdot.y = myNum(250);
        powerdot.powerup = true;
    }

    if (!ghost) {
        enemy.ghostNum = myNum(5) * 64;
        enemy.x = myNum(450);
        enemy.y = myNum(250) + 30;
        ghost = true;
    }

    if (!ghost2) {
        enemy2.ghostNum = myNum(5) * 64;
        enemy2.x = myNum(450);
        enemy2.y = myNum(250) + 30;
        ghost2 = true;
    }

    if (enemy.moving < 0) {
        enemy.moving = (myNum(20) * 3) + myNum(1);
        enemy.speed = myNum(3) + 1;
        enemy.dirx = 0;
        enemy.diry = 0;
        if (powerdot.ghostEat) {
            enemy.speed = enemy.speed * -1;
        }
        if (enemy.moving % 2) {
            if (player.x < enemy.x) {
                enemy.dirx = -enemy.speed;
            } else {
                enemy.dirx = enemy.speed;
            }
        } else {
            if (player.y < enemy.y) {
                enemy.diry = -enemy.speed;
            } else {
                enemy.diry = enemy.speed;
            }
        }
    }
    enemy.moving--;
    enemy.x = enemy.x + enemy.dirx;
    enemy.y = enemy.y + enemy.diry;

    if (enemy.x >= (canvas.width - 32)) {
        enemy.x = 0;
    }
    if (enemy.y >= (canvas.height - 32)) {
        enemy.y = 0;
    }
    if (enemy.x < 0) {
        enemy.x = (canvas.width - 32);
    }
    if (enemy.y < 0) {
        enemy.y = (canvas.height - 32);
    }

    if (player.x <= (enemy.x + 26) && enemy.x <= (player.x + 26) &&
        player.y <= (enemy.y + 26) && enemy.y <= (player.y + 32)) {
        if (powerdot.ghostEat) {
            score++;
        } else {
            gscore++;
        }
        player.x = 10;
        player.y = 100;
        enemy.x = 300;
        enemy.y = 200;
        powerdot.pCountDown = 0;
    }

    if (player.x <= powerdot.x && powerdot.x <= (player.x + 32) &&
        player.y <= powerdot.y && powerdot.y <= (player.y + 32)) {
        powerdot.powerup = false;
        powerdot.pCountDown = 500;
        powerdot.ghostNum = enemy.ghostNum;
        powerdot.ghostNum2 = enemy2.ghostNum;
        enemy.ghostNum = 384;
        enemy2.ghostNum = 384;
        powerdot.x = 0;
        powerdot.y = 0;
        powerdot.ghostEat = true;
        player.speed = 20;
    }
    if (powerdot.ghostEat) {
        powerdot.pCountDown--;
        if (powerdot.pCountDown < 0) {
            powerdot.ghostEat = false;
            enemy.ghostNum = powerdot.ghostNum;
            enemy2.ghostNum = powerdot.ghostNum;
            player.speed = 10;
        }
    }

    if (powerdot.powerup) {
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(powerdot.x, powerdot.y, 10, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
    }

    if (countBlink > 0) {
        countBlink--;
    } else {
        countBlink = 20;
        if (enemy.flash === 0) {
            enemy.flash = 32;
            enemy2.flash = 32;
        } else {
            enemy.flash = 0;
            enemy2.flash = 0;
        }
    }
    context.font = "20px Verdana";
    context.fillStyle = "white";
    context.fillText("Pacman: " + score + " vs Ghost: " + gscore, 2, 18);
    context.drawImage(mainImage, enemy2.ghostNum, enemy.flash, 32, 32, enemy.x, enemy.y, player.pSize, player.pSize);
    context.drawImage(mainImage, enemy.ghostNum, enemy.flash, 32, 32, enemy.x, enemy.y, player.pSize, player.pSize);
    context.drawImage(mainImage, player.pacMouth, player.pacDir, 32, 32, player.x, player.y, player.pSize, player.pSize);
}

document.body.appendChild(canvas);
