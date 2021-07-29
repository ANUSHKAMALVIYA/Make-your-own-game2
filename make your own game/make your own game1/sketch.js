var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bird, bird_flying, bird_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, tree1, tree2, tree3, tree4, tree5, tree6;
var localStorage;
var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  bird_flying =   loadAnimation("images/bird_8_4.png");
  bird_collided = loadAnimation("images/bird_collided_3_30.png");
  
  groundImage = loadImage("images/ground2.png");
  
  cloudImage = loadImage("images/cloud.png");
  
  tree1 = loadImage("images/tree_1_1_50-removebg-preview (1).png");
  tree2 = loadImage("images/tree_2_50.png");
  tree3 = loadImage("images/tree_3_2_10.png");
  tree4 = loadImage("images/tree_4_1_40.png");
  tree5 = loadImage("images/tree_5_3_60.png");
  tree6 = loadImage("images/tree_6_60.png");
  
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
 canvas = createCanvas(displayWidth - 20, displayHeight-30);  
  bird = createSprite(50,180,50,100);
  
  bird.addAnimation("flying", bird_flying);
  bird.addAnimation("collided", bird_collided);
  bird.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //bird.debug = true;

  camera.x = bird.x;
  gameOver.position.x = restart.position.x = camera.x;

  background(255);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && bird.y >= 159) {
      bird.velocityY = -12;
    }
  
    bird.velocityY = bird.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    bird.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(bird)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    bird.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the bird animation
    bird.changeAnimation("collided",bird_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.x+width/2,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = bird.depth;
    bird.depth = bird.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x+width/2,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(tree1);
              break;
      case 2: obstacle.addImage(tree2);
              break;
      case 3: obstacle.addImage(tree3);
              break;
      case 4: obstacle.addImage(tree4);
              break;
      case 5: obstacle.addImage(tree5);
              break;
      case 6: obstacle.addImage(tree6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.4;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  bird.changeAnimation("running",bird_flying);
  
  if(localStorage["HighestScore"]<score){
    localStorage["highestScore"]=score;
  }
 console.log(localStorage["highestScore"]);
  
  score = 0;
  
}