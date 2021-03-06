var myGamePiece;
var myObstacles = [];
var myScore;
var hitsound;
var jumpsound;
function startGame() {
    myGamePiece = new component(60, 45, "din1.jpg", 15, 270,"image");
    myGamePiece.gravity = 0.05;
    jumpsound= new sound ("jump.mp3");
    hitsound= new sound ("hit.mp3")
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y,type) {
    this.type=type;
     if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
    this.score= 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity=0;
    this.gravitySpeed=0;
    this.update = function() {
        ctx = myGameArea.context;
       if (type == "image") {
      ctx.drawImage(this.image, 
        this.x, 
        this.y,
        this.width, this.height);
        }    
          else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else{ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);}
    }
    this.newPos = function() {
        this.gravitySpeed +=this.gravity;
        this.x += this.speedX;
        this.y += this.speedY+this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, y,minGap,maxGap,gap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            hitsound.play();
            myGameArea.stop();

            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(100)) {
       minWidth= 5;
       maxWidth= 20;
       Width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
        y = myGameArea.canvas.height-20 ;
         minGap = 400;
        maxGap = 480;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(Width, 23, "obs.jpg", gap, y,"image"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
         myObstacles[i].x += -3;
        myObstacles[i].update();
        myObstacles[i].newPos();
    }
     if (myGameArea.key && myGameArea.key == 32) {accelerate(-0.2);jumpsound.play(); }
    else{accelerate(0.08); }
     myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
function accelerate(n) {
    if (!myGameArea.interval) {myGameArea.interval = setInterval(updateGameArea, 20);}

    myGamePiece.gravity = n;
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}