import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};

const speed = 170
const angle_chunk_size = 2.5
const scaleSize = 0.23
const bulletSpeed = 250
const bulletTimeout = 5000
const resetX = sizes.width/4 
const resetY = sizes.height/4

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player
    this.cursor 
    this.playerSpeed = speed
    this.points = 0
    this.current_angle = 0
    this.bullets = {}
    this.tempvar
    this.bulletCntr = 0 
  }

  preload() {

    this.load.image("tank", "/assets/Tank.png");
    this.load.image("bullet", "/assets/Bullet.png");
  }

  create() {
    this.player = this.physics.add.image(sizes.width/2, sizes.height/2, "tank").setOrigin(0.5,0.5).setScale(scaleSize);
    this.player.setCollideWorldBounds(true);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown-SPACE', event =>
        {
             this.tempvar = this.physics.add.image(
                        this.calculateXPosition_FromCenterPoint_AndAngle(this.player.x, this.current_angle, this.player.height/2 * scaleSize),
                        this.calculateYPosition_FromCenterPoint_AndAngle(this.player.y, this.current_angle, this.player.height/2 * scaleSize),
                              "bullet")
                .setScale(scaleSize)
              .setVelocityX(this.getXSpeedFromAngle(90-this.current_angle) * bulletSpeed )
              .setVelocityY(this.getYSpeedFromAngle(90-this.current_angle) * -1*bulletSpeed )
              .setCollideWorldBounds(true)
              .setBounce(1) 

              this.bullets[this.bulletCntr] = this.tempvar

              // add a timer event to remove the bullet after 3 seconds
              this.time.addEvent({
                delay: bulletTimeout,
                callback: (bulletCntr) => {
                  if (this.bullets[bulletCntr] != undefined) {
                    this.bullets[bulletCntr].destroy()
                  }
                },
                args: [this.bulletCntr]
              })

              // create a collision event for the bullet and the player
              this.physics.add.collider(this.bullets[this.bulletCntr], this.player, (bullet, player) => {
                bullet.destroy()
                // reset the player to the re-set position 
                this.player.x = resetX
                this.player.y = resetY
              })

              this.bulletCntr+=1;

          
              
        })


  }

  update() {


    const { left, right, up, down, space } = this.cursor;

    
    if (left.isDown) {
      // this.player.setVelocityX(-this.playerSpeed);
      this.player.angle = this.player.angle - angle_chunk_size
      this.current_angle = this.current_angle - angle_chunk_size

    } else if (right.isDown) {
      // this.player.setVelocityX(this.playerSpeed);
      this.player.angle = this.player.angle + angle_chunk_size
      this.current_angle = this.current_angle +angle_chunk_size
    }
    
    if (up.isDown) {
      // this.player.setVelocityY(-this.playerSpeed);
      this.player.setVelocityX(this.getXSpeedFromAngle(90-this.current_angle) * speed)
      this.player.setVelocityY(this.getYSpeedFromAngle(90-this.current_angle) * -1*speed)
  
    } else if (down.isDown) {
      // this.player.setVelocityY(this.playerSpeed);
      this.player.setVelocityX(this.getXSpeedFromAngle(90-this.current_angle)* -1 * speed)
      this.player.setVelocityY(this.getYSpeedFromAngle(90-this.current_angle) *speed)
    }
    
    else {
      this.player.setVelocityY(0);
      this.player.setVelocityX(0);
    }



  }

  getXSpeedFromAngle = (angle) => {
    return Math.cos(angle * Math.PI / 180)
  }

  getYSpeedFromAngle = (angle) => {
    return Math.sin(angle * Math.PI / 180)
  }

  calculateXPosition_FromCenterPoint_AndAngle = (centerX, angle, radius) => {
    var xComponent = Math.sin(angle * Math.PI / 180) * radius 
    return centerX + xComponent
  }

  calculateYPosition_FromCenterPoint_AndAngle = (centerY, angle, radius) => {
    var yComponent = Math.cos(angle * Math.PI / 180) * radius
    return centerY - yComponent
  }

}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
