const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Events = Matter.Events

var engine;
var world;
var flag = true
var particles = [];
var plinkos = [];
var bounds = [];
var cols = 15
var rows = 11;
var ding, ding2, ding3
var colorList = ["red", "orange", "yellow", "#5df542", "green", "#42adf5", "blue",
                 "blue", "#42adf5", "green", "#5df542", "yellow", "orange", "red"];
var scoreList = [1, 5, 10, 20, 50, 100, 200, 200, 100, 50, 20, 10, 5, 1];
var pointList = [];
var score = 0;
var maxParticles = 50;
var createdParticles = 0;

function preload() {
  ding = loadSound("ding4.mp3");
  ding2 = loadSound("ding3.mp3"); 
  ding3 = loadSound("ding.mp3");
}

function setup() {
  createCanvas(900, 1030);
  colorMode(HSB);
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 1.2;

  for (var i = 0; i < 14; i++) {
    point = new Point(i*60 + 60, 871, 60, 281.5);
    pointList.push(point);
  }

  function collision(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var labelA = pairs[i].bodyA.label;
      var labelB = pairs[i].bodyB.label;
      if ((labelA == 'particle' && labelB == 'plinko') ||
          (labelA == 'plinko' && labelB == 'particle')) {
        // Uncomment the line to hear sounds
        ding2.play();
      }
    }
  }

  Events.on(engine, 'collisionStart', collision);

  var spacing = width/cols;
  for (var j = 0; j < rows; j++) {
    if (j % 2 == 0) {
      cols = 15;
      var x = -spacing/2;
    } else {
      cols = 14;
      var x = 0;
    }
    var y = spacing + j * spacing;

    for (var i = 0; i < cols; i++) {
      x += spacing;
      var p = new Plinko(x, y, 7);
      plinkos.push(p);
    }    
  }

  var b1 = new Boundary(width/2, height + 30, width, 100);
  bounds.push(b1);
  var b2 = new Boundary(width+10, height/2, 20, height);
  bounds.push(b2);
  var b3 = new Boundary(-12, height/2, 20, height);
  bounds.push(b3);

  for (var i = 0; i < cols; i++) {
    var x = i * spacing + spacing/2;
    var h = 300;
    var w = 10;
    var y = height-h/2;
    var b = new Boundary(x, y, w, h);
    bounds.push(b);
  }
}

function mouseClicked() {
  if (mouseX > 35 && mouseX < 865 && createdParticles < maxParticles) {
    var p = new Particle(mouseX, 10, 12);
    createdParticles += 1;
    particles.push(p);
  }
}

function mouseClicked() {
  if (createdParticles < maxParticles) {
    var p = new Particle(random(35,865), 10, 12);
    createdParticles += 1;
    particles.push(p);
  }
}



function draw() {
  background("#000000");

  if(touches.length > 0) {
    if (createdParticles < maxParticles) {
      var p = new Particle(random(35,865), 10, 12);
      createdParticles += 1;
      particles.push(p);
    }
     touches = [];
  }

  for (var i = 0; i < 14; i++) {
    fill(colorList[i]);
    pointList[i].show();
  }

  Engine.update(engine);

  for (var i = 0; i < particles.length; i++) {
    particles[i].show();
    if (particles[i].inRestriction()) {
      World.remove(world, particles[i].body);
      particles.splice(i, 1);
      i--;
    }
  }

  if(createdParticles >= maxParticles){
    gamefail();

  }

  for (var i = 0; i < plinkos.length; i++) {
    plinkos[i].show();
  }

  for (var i = 0; i < bounds.length; i++) {
    bounds[i].show();
  } 

  if (particles.length != 0) {
    for (var i = 0; i < particles.length; i++) {
      if (particles[i].flag == false && particles[i].body.position.y > 750) {
        var x = particles[i].body.position.x;
        var index = floor((x - 30)/60);
        score += scoreList[index];
        particles[i].flag = true;
        
      }
    }
  }

  fill("white");
  text("Score: " + score, 800, 30);
  text("Particles Left: " + (maxParticles - createdParticles), 50, 30);
  textAlign(CENTER);
  textSize(20);
  for (var i = 0; i < pointList.length; i++) {
    text(scoreList[i], i*60+60, 800);
  }

}

function gamefail() {
  swal(
    {
      title: `Try again`,
      confirmButtonText: 'Play again'
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
        gamestate="play";
      }
    }
  );
}