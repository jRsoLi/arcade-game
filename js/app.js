// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    this.enemySpeed = this.setSpeed(100);
    this.enemyLane = this.setLane();
    this.x = this.setXloc();
    this.y = this.setYloc();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x = this.x + this.enemySpeed * dt;

    if (this.x > canvas.width) {
      this.x = -101;
      this.setLane();
    }
};

Enemy.prototype.setSpeed = function(speed) {
    speed = (speed / 4) + (Math.random() * 100 + 100);
    return speed;
};

Enemy.prototype.setLane = function() {
  var lane;
  lane = Math.floor(Math.random() * 3 + 1);
  this.enemyLane = lane;
  this.setYloc();
  return lane;
};

Enemy.prototype.setYloc = function() {
  var yLoc;
  yLoc = ((this.enemyLane * 83) - 20);
  this.y = yLoc;
  return yLoc;
};

Enemy.prototype.setXloc = function() {
  var xLoc;
  xLoc = (0 - (Math.random() * 400 +100));
  return xLoc;
};

Enemy.prototype.collision = function() {
  var playerLeft = player.x + 10;
  var playerRight = player.x + 90;
  var playerTop = player.y;
  var playerBottom = player.y + 70;

//define space used by enemy
  var enemyLeft = this.x + 10;
  var enemyRight = this.x + 90;
  var enemyTop = this.y;
  var enemyBottom = this.y + 70;

//check if they overlap
  if (enemyLeft <= playerRight &&
      enemyRight >= playerLeft &&
      enemyTop <= playerBottom &&
      enemyBottom >= playerTop) {
        player.x = player.startX;
        player.y = player.startY;
      }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.startX = 202;
  this.startY = 402;

  this.x = this.startX;
  this.y = this.startY;

  this.sprite = "images/char-boy.png";
};

Player.prototype.update = function(xMove, yMove) {

  if (xMove || yMove) {
    var xLoc = this.x + xMove;
    var yLoc = this.y + yMove;

    if (xLoc < canvas.width && xLoc >= 0) {
      this.x = xLoc;
    }
    if (yLoc < (canvas.height - 203) && yLoc >= -15) {
      this.y = yLoc;
    }
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {

  var xMove = 0;
  var yMove = 0;

  if (key === "left") {
    xMove = -101;
    yMove = 0;
  } else if (key === "right") {
    xMove = 101;
    yMove = 0;
  } else if (key === "up") {
    xMove = 0;
    yMove = -83;
  } else if (key === "down") {
    xMove = 0;
    yMove = 83;
  }

  this.update(xMove, yMove);
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var numEnemies = 4;
for (var i = 0; i < numEnemies; i++) {
  allEnemies.push(new Enemy());
}
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
