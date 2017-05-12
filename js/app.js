// Enemy class 
var Enemy = function(x,y,speed) {
    // Setting the enemy's initial location and speed
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for the enemies
    this.sprite = 'images/char-boy.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    // 505 is the canvas width
    // when the player reaches this point, or further
    // it will be set back to point 0 on the x-axis
    if (this.x >= 505) {
        this.x = 0;
    }
    // check for collision with enemies or canvas-walls
    checkCollision(this);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
    // Setting the player's initial location and speed
    this.x = x;
    this.y = y;
    this.speed = speed;
    // Loading the image by setting this.sprite to the 
    // following image in the images folder
    this.sprite = 'images/char-princess-girl.png';
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyPress) {
    if (keyPress == 'left') {
        player.x -= player.speed;
    }
    if (keyPress == 'right') {
        player.x += player.speed;
    }
    if (keyPress == 'up') {
        player.y -= player.speed - 20;
    }
    if (keyPress == 'down') {
        player.y += player.speed - 20;
    }
};

Player.prototype.update = function() {    
    // check for player reaching top of canvas and winning the game
    // if player wins, add 1 to the score and level
    // pass score as an argument to the increaseDifficulty function
    if (player.y + 63 <= 0) {        
        player.x = 202.5;
        player.y = 383;
        console.log('you made it!');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 505, 171);

        score += 1;
        gameLevel += 1;
        increaseDifficulty(score);
    }
}

var checkCollision = function(enemy) {
    // check for collision between enemy and player
    if (player.y + 131 >= enemy.y + 90
        && player.x + 25 <= enemy.x + 88
        && player.y + 73 <= enemy.y + 135
        && player.x + 76 >= enemy.x + 11) {
        player.x = 202.5;
        player.y = 383;
    }
    // check for player out of the canvas walls
    // reset the player to initial location
    if(player.x < 0 
    || player.x >= 495
    || player.y >= 440) {
        player.x = 202.5;
        player.y = 383;
    }
};

// this function increase the number of enemies on screen based on player's score
var increaseDifficulty = function(numberEnemies) {
    // remove all previous enemies on canvas
    allEnemies.length = 0;

      // load new set of enemies
    for (var i = 0; i <= numberEnemies; i++) {
        var enemy = new Enemy(0, Math.random() * 180 + 50, Math.random() * 256);
        allEnemies.push(enemy);
    }
};


var allEnemies = [];
var player = new Player(202.5, 383, 50);
var score = 0;
var gameLevel = 1;
var scoreLevelDiv = document.createElement('div');
var enemy = new Enemy(0, Math.random() * 180 + 50, Math.random() * 256);

allEnemies.push(enemy);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    console.log(allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
});
