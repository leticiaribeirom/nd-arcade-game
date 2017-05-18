'use strict';

var appConfig = {
    playerInitialPosX: 202,
    playerInitialPosY: 413,
}
// Enemy class 
var Enemy = function (x, y, speed) {
    // Setting the enemy's initial location and speed
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for the enemies
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    this.x += this.speed * dt;
    // 505 is the canvas width
    // when the enemy reaches this point, or further
    // it will be set back to point -50 on the x-axis
    if (this.x >= 505) {
        this.x = -100;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (x, y, speed) {
    // Setting the player's initial location and speed
    this.x = x;
    this.y = y;
    this.speed = speed;
    // Loading the image by setting this.sprite to the 
    // following image in the images folder
    this.sprite = 'images/char-princess-girl.png';
};

// Draw the player on the screen, required method for game
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    displayScore(score);
    displayLevel(gameLevel);
};

Player.prototype.handleInput = function (keyPress) {
    if (keyPress == 'left') {
        this.x -= this.speed;
    }
    if (keyPress == 'right') {
        this.x += this.speed;
    }
    if (keyPress == 'up') {
        this.y -= this.speed - 20;
    }
    if (keyPress == 'down') {
        this.y += this.speed - 20;
    }
};

Player.prototype.collides = function (enemy) {
    if (this.y + 131 >= enemy.y + 90 &&
        this.x + 25 <= enemy.x + 88 &&
        this.y + 73 <= enemy.y + 135 &&
        this.x + 76 >= enemy.x + 11) {
        return true;
    }
    return false;
}

Player.prototype.collidesCanvas = function () {
    if (this.x < 0 ||
        this.x >= 450 ||
        this.y >= 440) {
        return true;
    }
    return false;
}

Player.prototype.resetPlayer = function () {
    this.x = appConfig.playerInitialPosX;
    this.y = appConfig.playerInitialPosY;
}

Player.prototype.update = function () {
    // check for player reaching top of canvas and winning the game
    // if player wins, add 1 to the score and level
    // pass score as an argument to the increaseDifficulty function
    var p = this;

    if (this.collidesCanvas()) {
        this.resetPlayer();
    }

    allEnemies.forEach(function (e) {
        if (p.collides(e)) {
            p.resetPlayer();
        }
    });

    if (this.y + 7 <= 0) {
        this.x = 202.5;
        this.y = 413;
        console.log('you made it!');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 505, 171);

        score += 1;
        gameLevel += 1;
        increaseDifficulty(score);
    }
}

var displayScore = function (aScore) {
    var canvas = document.getElementsByTagName('canvas');
    var firstCanvasTag = canvas[0];

    // add player score div element created
    scoreDiv.innerHTML = 'Score: ' + aScore;
    document.body.insertBefore(scoreDiv, firstCanvasTag[0]);
};

var displayLevel = function (aLevel) {
    var canvas = document.getElementsByTagName('canvas');
    var firstCanvasTag = canvas[0];

    // add player level to div element created
    levelDiv.innerHTML = 'Level: ' + aLevel;
    document.body.insertBefore(levelDiv, firstCanvasTag[0]);
};


// this function increase the number of enemies on screen based on player's score
var increaseDifficulty = function (numberEnemies) {
    // remove all previous enemies on canvas
    allEnemies.length = 0;

    // load new set of enemies
    for (var i = 0; i <= numberEnemies; i++) {
        var enemy = new Enemy(0, Math.random() * 180 + 50, Math.random() * 256);
        allEnemies.push(enemy);
    }
};


var allEnemies = [];
var player = new Player(202.5, 413, 50);
var score = 0;
var gameLevel = 1;
var scoreDiv = document.createElement('div');
var levelDiv = document.createElement('div');
var enemy = new Enemy(0, Math.random() * 180 + 50, Math.random() * 256);

allEnemies.push(enemy);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    console.log(allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
});