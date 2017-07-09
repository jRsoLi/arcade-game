var Game = function() {
  this.cursorLoc = 60;
  this.playing = false;
  this.points = 0;
  this.lives = 3;
  this.playing = false;
  this.screenTime = 0;
  this.charSelected = false;
  this.highScore = 0;
  this.chars = [
        "images/char-boy.png",
        "images/char-cat-girl.png",
        "images/char-horn-girl.png",
        "images/char-pink-girl.png",
        "images/char-princess-girl.png"
        ];
};

Game.prototype.handleInput = function(key) {
        //changes curson location when using arrows
        if (key === "up" && this.cursorLoc > 60) {
            this.cursorLoc = this.cursorLoc - 100;
        } else if (key === "down" && this.cursorLoc <= 360) {
            this.cursorLoc = this.cursorLoc + 100;
        }

        //selects character when "enter" key is pressed
        if (key === "enter") {
            var Char = (this.cursorLoc - 60) / 100;
            player.sprite = this.chars[Char];
            player.alive = true;
            this.charSelected = true;
            this.playing = true;
        }
};

Game.prototype.selectChar = function() {

      //gray out game and overlay player selection
      ctx.fillStyle = "rgba(0,0,0,.75)";
      ctx.fillRect(0, 20, canvas.width, (canvas.height -40));

      var xlocation = 350;
      var ylocation = 10;

      //cycle through characters and draw on canvas
      for (i = 0; i < (this.chars.length ); i++) {
          ctx.drawImage(Resources.get(this.chars[i]), xlocation, ylocation, 101, 171);
          ylocation = ylocation + 100;
      }

      //draw the cursor around one of the characters
      ctx.strokeStyle = "rgba(255,0,0,1)";
      ctx.lineWidth = 5;
      ctx.strokeRect(350, this.cursorLoc, 101, 101);

      //add some text to tell user what to do
      ctx.textAlign="left";
      ctx.fillStyle = "rgba(255,0,0,1)";
      ctx.font = "36pt impact";
      ctx.fillText("Select a player", 40, 120);

      ctx.strokeStyle = "white";
      ctx.font = "36pt impact";
      ctx.lineWidth = 1;
      ctx.strokeText("Select a player", 40, 120);

      ctx.fillStyle = "rgba(255,0,0,1)";
      ctx.font = "14pt impact";
      ctx.fillText("use arrow and enter keys to select", 70, 500);
  };

Game.prototype.score = function() {
  ctx.fillStyle = "rgba(200,200,200,0.2)";
  ctx.fillRect(0, 20, canvas.width, 30);
  //add text showing lives & points
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.font = "12pt impact";
  ctx.textAlign="left";
  ctx.fillText("Lives: " + this.lives, 10, 40);
  ctx.fillText("Highscore: " + this.highScore, 100, 40);
  //ctx.fillText("Level: " + this.gameLevel, 10, 40);
  ctx.fillText("Points: " + this.points, canvas.width - 120, 40);
};

Game.prototype.reset = function() {
  player.x = player.startX;
  player.y = player.startY;
  this.screenTime = 50;
}

Game.prototype.playerDied = function() {
  //gray out game board an overlay message
  ctx.fillStyle = "rgba(0,0,0,.75)";
  ctx.fillRect(0, 20, canvas.width, (canvas.height -40));
  //add text fill and then text outline
  ctx.fillStyle = "rgba(255,0,0,1)";
  ctx.font = "36pt impact";
  ctx.textAlign="center";
  ctx.fillText("You have " + game.lives + " lives left!", (canvas.width/2), 160);

  ctx.strokeStyle = "white";
  ctx.font = "36pt impact";
  ctx.textAlign="center";
  ctx.lineWidth = 1;
  ctx.strokeText("You have " + game.lives + " lives left!", (canvas.width/2), 160);

  //reset for next life
  if (this.screenTime <= 0) {
      player.alive = true;
      this.playing = true;
  }
};

Game.prototype.gameOver = function() {
  ctx.fillStyle = "rgba(0,0,0,.75)";
      ctx.fillRect(0, 20, canvas.width, (canvas.height -40));

      ctx.fillStyle = "rgba(255,0,0,1)";
      ctx.font = "36pt impact";
      ctx.textAlign="center";
      ctx.fillText("Game Over!", (canvas.width/2), 160);

      ctx.strokeStyle = "white";
      ctx.font = "36pt impact";
      ctx.textAlign="center";
      ctx.lineWidth = 1;
      ctx.strokeText("Game Over!", (canvas.width/2), 160);

      //once the screen time runs out reset game
      if (this.screenTime <= 0) {
          if (this.points > this.highScore) {
            this.highScore = this.points;
          }
          player.alive = false;
          this.playing = false;
          this.points = 0;
          this.charSelected = false;
          this.lives = 3;
          /* this.gameLevel = 1;
          //returns enemies # and speed to level one settings
          if (allEnemies.length > 4) {
              var toDelete = allEnemies.length - 4;
              allEnemies.splice(4, toDelete);
           }
          for (var i = 0; i < allEnemies.length; i++){
              allEnemies[i].enemySpeed = allEnemies[i].setSpeed((this.gameLevel * 100));
          } */
          //reset Items
          for (var i = 0; i < allItems.length; i++) {
              allItems[i].visible = true;
              allItems[i].Xloc();
              allItems[i].Yloc();
          }
      }
};

Game.prototype.render = function(dt) {
if (this.charSelected === false) {
  this.selectChar();
}

  if (this.playing === true) {
      this.score();
  }
  if (this.screenTime > 0 && player.alive === false) {
    this.screenTime = this.screenTime - 1;
    if (this.lives > 0) {
      this.playing = false;
      this.playerDied();
    } else if (this.lives <= 0) {
      this.playing = false;
      this.gameOver();
    }
  }

};

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

        player.death();
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
  this.alive = false;
  this.startX = 202;
  this.startY = 402;

  this.x = this.startX;
  this.y = this.startY;

  this.sprite = "images/char-cat-girl.png";
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

Player.prototype.death = function() {
  game.lives = game.lives - 1;
  this.alive = false;
  game.reset();
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

var Item = function() {
    this.x = this.Xloc();
    this.y = this.Yloc();
    this.visible = true;
};

//generates random Y location
Item.prototype.Yloc = function() {
    var yLoc = Math.floor(Math.random() * 3 + 1);
    yLoc = (yLoc * 83) - 35;
    this.y = yLoc;
    return yLoc;
};

//generates random x location
Item.prototype.Xloc = function() {
    var xLoc = Math.floor(Math.random() * 5);
    xLoc = xLoc * 101;
    this.x = xLoc;
    return xLoc;
};

//check to see if player overlaps gems. If so pick up gem and give rewards
Item.prototype.pickup = function() {
    //define space used by player
    var playerLeft = player.x + 10;
    var playerRight = player.x + 90;
    var playerTop = player.y;
    var playerBottom = player.y + 70;

    //define space used by gem
    var itemLeft = this.x + 10;
    var itemRight = this.x + 90;
    var itemTop = this.y;
    var itemBottom = this.y + 70;

    //if gem is visible and hasn't been collected yet check if they overlap and give reward
    if (this.visible === true) {
      console.log("visible");
        if (itemLeft <= playerRight &&
            itemRight >= playerLeft &&
            itemTop <= playerBottom &&
            itemBottom >= playerTop) {
              console.log("pickup");
            game.points = game.points + this.points;
            game.lives = game.lives + this.life;
            this.visible = false;
        }
    }
};

// Draw the gems on the screen if they are set to visible
Item.prototype.render = function() {
    if (this.visible === true) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

var Heart = function() {
  Item.call(this);
  this.points = 0;
  this.life = 1;
  this.sprite = 'images/heart.png';
};
Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Heart;

//define points and sprite for green gem
var GreenGem = function() {
    Item.call(this);
    this.points = 10;
    this.life = 0;
    this.sprite = 'images/Gem Green.png';
};
GreenGem.prototype = Object.create(Item.prototype);
GreenGem.prototype.constructor = GreenGem;

//define points and sprite for blue gem
var BlueGem = function() {
    Item.call(this);
    this.points = 30;
    this.life = 0;
    this.sprite = 'images/Gem Blue.png';
};
BlueGem.prototype = Object.create(Item.prototype);
BlueGem.prototype.constructor = BlueGem;

//define points and sprite for orange gem
var OrangeGem = function() {
    Item.call(this);
    this.points = 50;
    this.life = 0;
    this.sprite = 'images/Gem Orange.png';
};
OrangeGem.prototype = Object.create(Item.prototype);
OrangeGem.prototype.constructor = OrangeGem;

//define points and sprite for orange gem
var Key = function() {
    Item.call(this);
    this.points = 100;
    this.life = 0;
    this.sprite = 'images/Key.png';
};
Key.prototype = Object.create(Item.prototype);
Key.prototype.constructor = Key;

var Home = function() {
  this.homeLeft = -1;
  this.homeWidth = 606;
  this.homeTop = 50;
  this.homeHeight = 60;
};

Home.prototype.reachedHome = function() {
  var playerLeft = player.x + 10;
  var playerRight = player.x + 90;
  var playerTop = player.y;
  var playerBottom = player.y + 70;

  //check if they overlap
  if (this.homeLeft <= playerRight &&
      this.homeWidth >= playerLeft &&
      this.homeTop <= playerBottom &&
      this.homeHeight >= playerTop) {

        game.points = game.points + 50;
        player.x = player.startX;
        player.y = player.startY;
  }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var game = new Game();
var home = new Home();
var allEnemies = [];
var numEnemies = 4;
for (var i = 0; i < numEnemies; i++) {
  allEnemies.push(new Enemy());
}

var allItems = [];
allItems.push(new Heart());
allItems.push(new Key());
allItems.push(new OrangeGem());
allItems.push(new BlueGem());
allItems.push(new GreenGem());

var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    if (game.playing === true) {
      player.handleInput(allowedKeys[e.keyCode]);
    } else if (game.playing === false) {
      game.handleInput(allowedKeys[e.keyCode]);
    }
});
