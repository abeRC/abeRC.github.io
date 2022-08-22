// Snake Game
// originally by Jacob Joaquin: https://www.openprocessing.org/sketch/387971
// CC Attribution-ShareAlike 3.0

// Global Vars for Spin-offs
var tileSize = 25;
var framesPerMove = 5;
var snakeColorFront;
var snakeColorBack;

// Global vars for game mechanics
var segments = [];
var keyStrokes = [];
var direction;
var position;
var lastTail;
var phase = 0.0;
var phaseInc = 1.0 / 64.0;
var possibleKeys;

//special
var img1;
var img2;
var img3;
var track;

// Scene
var sceneAttractIndex = 2;
var sceneInPlayIndex = 0;
var sceneGameOverIndex = 1;
var scene = sceneAttractIndex;

// Food
var food;

var rndcolor = function() {
    var r = Math.floor(256 * Math.random()); //between 0 and 255 (inclusive)
    var g = Math.floor(256 * Math.random());
    var b = Math.floor(256 * Math.random());
    
    return color(r, g, b);
};
function preload() {
    img1 = loadImage("assets/important1.jpeg");
    img2 = loadImage("assets/important2.jpeg");
    img3 = loadImage("assets/important3.jpeg");
    track = new Audio("assets/track.mp3");
};

var setup = function() {
    createCanvas(400, 400);
    snakeColorFront = color(255);
    snakeColorBack = color(255, 0, 255);
    direction = createVector(0, tileSize);
    position = createVector(0, 0);
    lastTail = createVector();
    possibleKeys = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW];

    food = {
        position: createVector(0, 0),
    };
    textAlign(CENTER, CENTER);
    ellipseMode(CORNER);

};

var drawFood = function() {
    push(); /*Save current graphical settings so we can reapply them with pop().*/
    colorMode(HSB);
    fill(255 * phase, 255, 255);
    noStroke();
    ellipse(food.position.x, food.position.y, tileSize, tileSize);
    pop();
};

var createFood = function() {
    var nTiles = width / tileSize;

    var onTail = false;
    /*Checks if food was spawned on tail.*/
    do {
        onTail = false;
        var x = floor(random(nTiles)) * tileSize;
        var y = floor(random(nTiles)) * tileSize;
        food.position.set(x, y);

        var bodyLength = segments.length;
        for (var i = 0; i < bodyLength; i++) {
            if (segments[i].x === food.position.x && segments[i].y === food.position.y) {
                onTail = true;
                break;
            }
        }
    } while (onTail);
};

var init = function() {
    scene = sceneInPlayIndex;
    direction = createVector(0, tileSize);
    position = createVector(0, 0);
    segments = [position];
    keyStrokes = [];
    createFood();
};

var drawBody = function() {
    push();
    //noStroke();
    var bodyLength = segments.length;
    var s = tileSize;
    for (var i = 0; i < bodyLength; i++) {
        fill(lerpColor(snakeColorFront, snakeColorBack, i / bodyLength)); //interpolate
        var offset = (tileSize - s) / 2.0; //so tail segments are centered
        var segment = segments[i];
        
        
        if(i%7==6){
            //track.currentTime = 0.0;
            track.play(); //idk how to reset it :(
            s=tileSize*1.25
            image(img1, segment.x + offset, segment.y + offset, s, s)
        }
        else if(i%8==7)
            image(img2, segment.x + offset, segment.y + offset, s, s)
        else if(i%9==8)
            image(img3, segment.x + offset, segment.y + offset, s, s)
        else if(i%3==0)
            rect(segment.x + offset, segment.y + offset, s, s);
        else if(i%3==1)
            ellipse(segment.x + offset, segment.y + offset, s*1.1, s*0.8);
        else if(i%3==2)
            arc(segment.x + offset, segment.y + offset, s, s, PI-301/360*PI, PI+301/360*PI); //pacman's mouth has an angle of 59 degrees
        
        
        s *= 0.9; //draw smaller squares
        s = max(s, tileSize * 0.5); //make sure they don't get too small
    }
    pop();
};

var moveBody = function() {
    lastTail = segments[segments.length - 1].copy();
    position.add(direction);
    var bodyLength = segments.length;

    for (var i = bodyLength - 1; i > 0; i--) {
        var segment = segments[i - 1];
        segments[i] = segment.copy();
    }
    segments[0] = position.copy();
};

var eat = function() {
    var segment = segments[segments.length - 1];
    segments.push(segment.copy());
};

var checkEatingSelf = function() {
    var bodyLength = segments.length;
    for (var i = 1; i < bodyLength; i++) {
        var segment = segments[i];
        if (position.x === segment.x && position.y === segment.y) {
            return true;
        }
    }
    return false;
};

var checkFood = function() {
    if (frameCount % framesPerMove === 0) {
        if (position.x === food.position.x && position.y === food.position.y) {
            eat();
            print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHn\n"); //this is never run
            createFood();
        }
    }
};

var updateBody = function() {
    if (frameCount % framesPerMove === 0) {
        moveBody();
        if (checkEatingSelf()) {
            scene = sceneGameOverIndex;
        }
        if (position.x === food.position.x && position.y === food.position.y) {
            eat();
            snakeColorBack = rndcolor();
            createFood();
        }
    }
};

var checkBoundary = function() {
    if (position.x < 0) {
        position.x = width - tileSize;
        segments[0] = position.copy();
    } else if (position.x >= width) {
        position.x = 0;
        segments[0] = position.copy();
    } else if (position.y >= height) {
        position.y -= height;
        segments[0] = position.copy();
    } else if (position.y < 0) {
        position.y += height;
        segments[0] = position.copy();
    }
};

var processKeyBuffer = function() {
    if (keyStrokes.length > 0) {
        var k = keyStrokes.shift();

        if (k === RIGHT_ARROW && direction.x !== -tileSize) {
            direction.set(tileSize, 0);
        }
        else if (k === LEFT_ARROW && direction.x !== tileSize) {
            direction.set(-tileSize, 0);
        }
        else if (k === UP_ARROW && direction.y !== tileSize) {
            direction.set(0, -tileSize);
        }
        else if (k === DOWN_ARROW && direction.y !== -tileSize) {
            direction.set(0, tileSize);
        }
    }
};

var sceneInPlay = function() {
    background(32);
  	push();
  	noStroke();
  	fill(0);
  	rect(0, 0, width, height);
  	pop();
    processKeyBuffer();
    updateBody();
    checkBoundary();
    checkFood();
    drawBody();
    drawFood();
};

var sceneGameOver = function() {
    push();
    colorMode(HSB);
    fill(phase * 255, 255, 255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("GAME OVER", width / 2.0, 100);
    textSize(25);
    text("Your Score is ", width / 2.0, 200);
    text(segments.length, width / 2.0, 250);
    textSize(15);
    text("Click Mouse to Play Again", width / 2.0, 350);
    pop();
};

var sceneAttract = function() {
    push();
    background(32);
    colorMode(HSB);
    fill(255 * phase, 255, 255);
    textSize(90);
    text("SNAKE", width / 2.0, 100);

    fill(255);
    textSize(30);
    text("How to Play:", width / 2.0, 200);
    textSize(15);
    text("Move Snake with Arrow Keys", width / 2.0, 250);
    text("Eat the Glowing Dots", width / 2.0, 270);
    text("Don't Eat Your Tail", width / 2.0, 290);

    fill(255 * phase, 255, 255);
    textSize(30);
    text("Click Mouse to Begin", width / 2.0, 350);
    pop();
};

var draw = function() {
    switch (scene) {
        case sceneAttractIndex:
            sceneAttract();
            break;
        case sceneInPlayIndex:
            sceneInPlay();
            break;
        case sceneGameOverIndex:
            sceneGameOver();
            break;
    }

    phase += phaseInc;
    if (phase >= 1.0) {
        phase -= 1.0;
    }
};

var keyPressed = function() {
    var k = key.toString();
    if (keyStrokes.length < 3 && possibleKeys.indexOf(keyCode) > -1) {
        keyStrokes.push(keyCode);
    }
};

var mouseClicked = function() {
    if (scene === sceneGameOverIndex) {
        track.addEventListener("canplay", function() {init();}, true);
        track.load(); //resets song
    }
    if (scene === sceneAttractIndex) {
        init();
    }
}; 
