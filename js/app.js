//game setup, lives, highscore etc.
var Game = function() {
  this.cursorLoc = 60;
  this.playing = false;
  this.points = 0;
  this.lives = 3;
  this.playing = false;
  this.screenTime = 0;
  this.charSelected = false;
  this.highScore = 0;
  this.level = 1;
  this.chars = [
        "images/char-boy.png",
        "images/char-cat-girl.png",
        "images/char-horn-girl.png",
        "images/char-pink-girl.png",
        "images/char-princess-girl.png"
        ];
};

//function to handle input when game is not currently playing - for char slection
Game.prototype.handleInput = function(key) {
        if (key === "up" && this.cursorLoc > 60) {
            this.cursorLoc = this.cursorLoc - 100;
        } else if (key === "down" && this.cursorLoc <= 360) {
            this.cursorLoc = this.cursorLoc + 100;
        }

        //when enter is pressed it selects the char and starts the game
        if (key === "enter") {
            var Char = (this.cursorLoc - 60) / 100;
            player.sprite = this.chars[Char];
            player.alive = true;
            this.charSelected = true;
            this.playing = true;
        }
};

//select char functionality
Game.prototype.selectChar = function() {
      ctx.fillStyle = "rgba(0,0,0,.75)";
      ctx.fillRect(0, 20, canvas.width, (canvas.height -40));

      var xlocation = 400;
      var ylocation = 10;

      //show chars on screen
      for (i = 0; i < (this.chars.length ); i++) {
          ctx.drawImage(Resources.get(this.chars[i]), xlocation, ylocation, 101, 171);
          ylocation = ylocation + 100;
      }

      //draw the cursor around one of the characters
      ctx.strokeStyle = "rgba(0,255,30,1)";
      ctx.lineWidth = 3;
      ctx.strokeRect(400, this.cursorLoc, 101, 101);

      //add some text to tell user what to do
      ctx.textAlign="left";
      ctx.fillStyle = "rgba(0,255,30,1)";
      ctx.font = "28pt impact";
      ctx.fillText("Select your character:", 40, 120);

      ctx.fillStyle = "rgba(0,255,30,1)";
      ctx.font = "14pt impact";
      ctx.fillText("use up/down and enter", 70, 500);
  };

Game.prototype.score = function() {
  //score bar above the game
  ctx.fillStyle = "rgba(200,200,200,0.2)";
  ctx.fillRect(0, 20, canvas.width, 30);
  //add the important info
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.font = "12pt impact";
  ctx.textAlign="left";
  ctx.fillText("Lives: " + this.lives, 10, 40);
  ctx.fillText("Highscore: " + this.highScore, 100, 40);
  ctx.fillText("Level: " + this.level, canvas.width - 200, 40);
  ctx.fillText("Points: " + this.points, canvas.width - 120, 40);
};

//resets player to start location and sets screen time
Game.prototype.reset = function() {
  player.x = player.startX;
  player.y = player.startY;
  this.screenTime = 50;
}

Game.prototype.homeScreen = function() {
    ctx.fillStyle = "rgba(0,0,0,.75)";
    ctx.fillRect(0, 20, canvas.width, (canvas.height -40));
    //add text fill and then text outline
    ctx.fillStyle = "rgba(0,255,30,1)";
    ctx.font = "25pt impact";
    ctx.textAlign="center";
    ctx.fillText("Awesome!", (canvas.width/2), 160);

    ctx.fillStyle = "rgba(0,255,30,1)";
    ctx.font = "25pt impact";
    ctx.textAlign="center";
    ctx.fillText("Level " + this.level, (canvas.width/2), 260);

    //sets all entities for the next level
    if (this.screenTime <= 0) {
        this.playing = true;
        this.nextLevel();
    }
};

//adds and resets enemies and items based on the level
Game.prototype.nextLevel = function() {
    if (this.level % 4 === 0) {
        allEnemies.push(new Enemy());
      }
    if (this.level === 4) {
      allItems.push(new BlueGem());
      for (var i = 0; i < allItems.length; i++) {
          allItems[i].visible = true;
          allItems[i].Xloc();
          allItems[i].Yloc();
      }
    } else if (this.level === 8) {
      allItems.push(new GreenGem());
      for (var i = 0; i < allItems.length; i++) {
          allItems[i].visible = true;
          allItems[i].Xloc();
          allItems[i].Yloc();
      }
    } else if (this.level === 8) {
      allItems.push(new Key());
      for (var i = 0; i < allItems.length; i++) {
          allItems[i].visible = true;
          allItems[i].Xloc();
          allItems[i].Yloc();
        }
      } else if (this.level > 8 && this.level % 4 === 0) {
        for (var i = 0; i < allItems.length; i++) {
            allItems[i].visible = true;
            allItems[i].Xloc();
            allItems[i].Yloc();
      }
    }
};

Game.prototype.playerDied = function() {
  ctx.fillStyle = "rgba(0,0,0,.75)";
  ctx.fillRect(0, 20, canvas.width, (canvas.height -40));
  ctx.fillStyle = "rgba(255,0,0,1)";
  ctx.font = "25pt impact";
  ctx.textAlign="center";
  ctx.fillText("The bugs got you! " + game.lives + " lives left!", (canvas.width/2), 160);

  //start playing again
  if (this.screenTime <= 0) {
      player.alive = true;
      this.playing = true;
  }
};

Game.prototype.gameOver = function() {
  ctx.fillStyle = "rgba(0,0,0,.75)";
      ctx.fillRect(0, 20, canvas.width, (canvas.height -40));

      ctx.fillStyle = "rgba(255,0,0,1)";
      ctx.font = "40pt impact";
      ctx.textAlign="center";
      ctx.fillText("GAME OVER", (canvas.width/2), 160);

      if (this.screenTime <= 0) {
        //update highscore
        if (this.points > this.highScore) {
          this.highScore = this.points;
        }
        //reset game
        player.alive = false;
        this.playing = false;
        this.points = 0;
        this.charSelected = false;
        this.lives = 3;
        this.level = 1;
        //resets number of enemies
        if (allEnemies.length > 4) {
            var toDelete = allEnemies.length - 4;
            allEnemies.splice(4, toDelete);
          }
        //delete all existing items and create a new ones as if a new game was started
        allItems.splice(0, allItems.length);
        allItems.push(new Heart());
        allItems.push(new OrangeGem());

    }
};

Game.prototype.render = function(dt) {
  if (this.charSelected === false) {
    this.selectChar();
  }

  if (this.playing === true) {
      this.score();
  }

  if (this.screenTime > 0 && this.lives > 0 && player.alive === true) {
    this.screenTime = this.screenTime -1;
    this.playing = false;
    this.homeScreen();
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

// enemy object
var Enemy = function() {
    this.enemySpeed = this.setSpeed(100);
    this.enemyLane = this.setLane();
    this.x = this.setXloc();
    this.y = this.setYloc();
    this.sprite = 'images/enemy-bug.png';
};

// update enemy position
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.enemySpeed * dt;

    if (this.x > canvas.width) {
      this.x = -101;
      this.setLane();
    }
};

// set enemy speed
Enemy.prototype.setSpeed = function(speed) {
    speed = (speed / 4) + (Math.random() * 100 + 100);
    return speed;
};

//set enemy lane/row
Enemy.prototype.setLane = function() {
  var lane;
  lane = Math.floor(Math.random() * 3 + 1);
  this.enemyLane = lane;
  this.setYloc();
  return lane;
};

//set enemy initial yloc
Enemy.prototype.setYloc = function() {
  var yLoc;
  yLoc = ((this.enemyLane * 83) - 20);
  this.y = yLoc;
  return yLoc;
};

//set enemy x loc
Enemy.prototype.setXloc = function() {
  var xLoc;
  xLoc = (0 - (Math.random() * 400 +100));
  return xLoc;
};

//check for collisions with player
Enemy.prototype.collision = function() {
  var playerLeft = player.x + 10;
  var playerRight = player.x + 90;
  var playerTop = player.y;
  var playerBottom = player.y + 70;

//enemy space
  var enemyLeft = this.x + 10;
  var enemyRight = this.x + 90;
  var enemyTop = this.y;
  var enemyBottom = this.y + 70;

//check collision
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

//player class
var Player = function() {
  this.alive = false;
  this.startX = 202;
  this.startY = 402;
  this.x = this.startX;
  this.y = this.startY;
  this.sprite = "images/char-cat-girl.png";
};

//update player location
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

//reduce lives and reset game on death
Player.prototype.death = function() {
  game.lives = game.lives - 1;
  this.alive = false;
  game.reset();
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//handle key pres inputs to move the player around
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

//set item location and visibility
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

//check if the player walked over an item
Item.prototype.pickup = function() {
    //player space
    var playerLeft = player.x + 10;
    var playerRight = player.x + 90;
    var playerTop = player.y;
    var playerBottom = player.y + 70;

    //item space
    var itemLeft = this.x + 10;
    var itemRight = this.x + 90;
    var itemTop = this.y;
    var itemBottom = this.y + 70;

    //if item is visible and player walked over it - collect and give points/lives
    if (this.visible === true) {
      if (itemLeft <= playerRight &&
          itemRight >= playerLeft &&
          itemTop <= playerBottom &&
          itemBottom >= playerTop) {
          game.points = game.points + this.points;
          game.lives = game.lives + this.life;
          this.visible = false;
        }
    }
};

// draw items
Item.prototype.render = function() {
    if (this.visible === true) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

//heart object
var Heart = function() {
  Item.call(this);
  this.points = 0;
  this.life = 1;
  this.sprite = 'images/heart.png';
};
Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Heart;

//green gem
var GreenGem = function() {
    Item.call(this);
    this.points = 10;
    this.life = 0;
    this.sprite = 'images/Gem Green.png';
};
GreenGem.prototype = Object.create(Item.prototype);
GreenGem.prototype.constructor = GreenGem;

//blue gem
var BlueGem = function() {
    Item.call(this);
    this.points = 30;
    this.life = 0;
    this.sprite = 'images/Gem Blue.png';
};
BlueGem.prototype = Object.create(Item.prototype);
BlueGem.prototype.constructor = BlueGem;

//orange gem
var OrangeGem = function() {
    Item.call(this);
    this.points = 50;
    this.life = 0;
    this.sprite = 'images/Gem Orange.png';
};
OrangeGem.prototype = Object.create(Item.prototype);
OrangeGem.prototype.constructor = OrangeGem;

//key
var Key = function() {
    Item.call(this);
    this.points = 100;
    this.life = 0;
    this.sprite = 'images/Key.png';
};
Key.prototype = Object.create(Item.prototype);
Key.prototype.constructor = Key;

//define home space
var Home = function() {
  this.homeLeft = -1;
  this.homeWidth = 606;
  this.homeTop = 50;
  this.homeHeight = 60;
};

//when player reached Home Space
Home.prototype.reachedHome = function() {
  var playerLeft = player.x + 10;
  var playerRight = player.x + 90;
  var playerTop = player.y;
  var playerBottom = player.y + 70;

  //check if player is in home
  if (this.homeLeft <= playerRight &&
      this.homeWidth >= playerLeft &&
      this.homeTop <= playerBottom &&
      this.homeHeight >= playerTop) {

        game.level = game.level + 1;
        game.points = game.points + 50;
        game.reset();
  }
};

//object initiation
var game = new Game();
var home = new Home();
var allEnemies = [];
var numEnemies = 4;
for (var i = 0; i < numEnemies; i++) {
  allEnemies.push(new Enemy());
}

var allItems = [];
allItems.push(new Heart());
allItems.push(new OrangeGem());
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
