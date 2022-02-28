/**
 * 04-05-01.js - a simple JavaScript file that gets loaded with
 * page 5 of Workbook 4 (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020, February 2021
 *
 */

// @ts-check
/* jshint -W069, esversion:6 */

/**
 * If you want to read up on JavaScript classes, 
 * see the tutorial on the class website:
 * 
 * https://graphics.cs.wisc.edu/Courses/559-sp2021/tutorials/oop-in-js-1/
 */
let collisionRadius = 10;
let obstacleLength = 100;
class Boid {
    /**
     * 
     * @param {number} x    - initial X position
     * @param {number} y    - initial Y position
     * @param {number} vx   - initial X velocity
     * @param {number} vy   - initial Y velocity
     * @param {number} colorFrames   - frames left change color
     * @param {number} avoidBoidCollisionFrames   - frames avoid collision
     * @param {number} avoidBoundaryCollisionFrames   - frames avoid collision

     */
    constructor(x, y, vx = 1, vy = 0, colorFrames, avoidBoidCollisionFrames ,avoidBoundaryCollisionFrames) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.avoidBoidCollisionFrames = avoidBoidCollisionFrames;
        this.colorFrames = colorFrames;
        this.avoidBoundaryCollisionFrames = avoidBoundaryCollisionFrames;
        this.angle = Math.atan2(vy,vx);
     }

    
    /**
     * Draw the Boid
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.save();
        if(this.colorFrames!=0){
            context.fillStyle = "red";
        }
        else{
            context.fillStyle = "black";
        }
        context.translate(this.x, this.y);
        context.rotate(Math.atan2(this.vy,this.vx));
        context.beginPath();
        context.moveTo(15,0);
        context.lineTo(0,-5);
        context.lineTo(0,5);
        context.closePath();
        context.moveTo(0,0);
        context.fill();
        // context.fillRect(0,0,5,5);
        context.restore();
    }
    /**
     * Perform the "steering" behavior -
     * This function should update the velocity based on the other
     * members of the flock.
     * It is passed the entire flock (an array of Boids) - that includes
     * "this"!
     * Note: dealing with the boundaries does not need to be handled here
     * (in fact it can't be, since there is no awareness of the canvas)
     * *
     * And remember, (vx,vy) should always be a unit vector!
     * 
     */
     steer(flockStyle,averageAngle, averageX,averageY, mouseX, mouseY, sliderAngle){
        this.angle = Math.atan2(this.vy,this.vx);
        if(flockStyle===1){
            if(this.angle>averageAngle){
                this.angle-=0.05; 
            }
            else{
                this.angle+=0.05; 
            }
            this.vx = Math.cos(this.angle);
                this.vy = Math.sin(this.angle);
        }
        if(flockStyle===2){
            this.angle = Math.atan2(this.vy,this.vx);
                let toCenter = Math.atan2(averageY - this.y,averageX - this.x);
                if(this.angle>toCenter){
                    this.angle-=0.05; 
                }
                else{
                    this.angle+=0.05; 
                }
                this.vx = Math.cos(this.angle);
                this.vy = Math.sin(this.angle);
        }
        if(flockStyle===3){
            this.angle = Math.atan2(this.vy,this.vx);
                let toCenter = Math.atan2(mouseY-this.y,mouseX-this.x);
                if(this.angle>toCenter){
                    this.angle-=0.05; 
                }
                else{
                    this.angle+=0.05; 
                }
                this.vx = Math.cos(this.angle);
                this.vy = Math.sin(this.angle);
        }
        if(flockStyle===4){
            if(this.angle>sliderAngle){
                this.angle-=0.05; 
            }
            else{
                this.angle+=0.05; 
            }
            this.vx = Math.cos(this.angle);
                this.vy = Math.sin(this.angle);
        }
    }
}


/** the actual main program
 * this used to be inside of a function definition that window.onload
 * was set to - however, now we use defer for loading
 */

 /** @type Array<Boid> */
let theBoids = [];

let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("flock"));
let context = canvas.getContext("2d");

let speedSlider = /** @type {HTMLInputElement} */ (document.getElementById("speed"));
let angleSlider = /** @type {HTMLInputElement} */ (document.getElementById("sliderAngle"));




function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    theBoids.forEach(boid => boid.draw(context));
}

/**
 * Create some initial boids
 * STUDENT: may want to replace this
 */
// theBoids.push(new Boid(100, 100));
// theBoids.push(new Boid(200, 200, -1, 0));
// theBoids.push(new Boid(300, 300, 0, -1));
// theBoids.push(new Boid(400, 400, 0, 1));

/**
 * Handle the buttons
 */
document.getElementById("add").onclick = function () {
    for (let index = 0; index < 10; index++) {
        let newXPosition = Math.random()*canvas.width;
        let newYPosition = Math.random()*canvas.height;
        if(Math.abs(newXPosition-canvas.width/2)<obstacleLength/2+collisionRadius/2
    &&Math.abs(newYPosition-canvas.height/2)<obstacleLength/2+collisionRadius/2){
        index--;
        continue;
    }
        let newAngle = Math.random()*2*Math.PI;
        let newXVelocity = Math.cos(newAngle);
        let newYVelocity = Math.sin(newAngle);
        theBoids.push(new Boid(newXPosition, newYPosition,newXVelocity,newYVelocity,0,0,0));
    }
    
};
document.getElementById("clear").onclick = function () {
    theBoids = [];
};
let flockModel = 0;
let mouseX = 0;
let mouseY = 0;
let sliderAngle = 0;
document.getElementById("clearFlock").onclick = function (){
    flockModel = 0;
}
document.getElementById("align").onclick = function (){
    flockModel = 1;
}
document.getElementById("cohesion").onclick = function (){
    flockModel = 2;
}
document.getElementById("mouse").onclick = function (){
    flockModel = 3;
}
document.getElementById("slider").onclick = function (){
    flockModel = 4;
}

canvas.onmousemove = function(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function checkObstacle(boid){
    if(Math.abs(boid.x-canvas.width/2)<obstacleLength/2+collisionRadius/2
    &&Math.abs(boid.y-canvas.height/2)<obstacleLength/2+collisionRadius/2&&boid.avoidBoundaryCollisionFrames==0){
        //left
        if(boid.x<(canvas.width/2-obstacleLength/2)&&boid.y<(canvas.height/2+obstacleLength/2)&&boid.y>(canvas.height/2-obstacleLength/2)){
            boid.vx = -boid.vx;
            boid.avoidBoundaryCollisionFrames = 10;
            boid.colorFrames = 50;
        }
        //right
        if(boid.x>(canvas.width/2+obstacleLength/2)&&boid.y<(canvas.height/2+obstacleLength/2)&&boid.y>(canvas.height/2-obstacleLength/2)){
            boid.vx = -boid.vx;
            boid.avoidBoundaryCollisionFrames = 10;
            boid.colorFrames = 50;
        }
        //top
        if(boid.y<(canvas.width/2-obstacleLength/2)&&boid.x<(canvas.width/2+obstacleLength/2)&&boid.x>(canvas.width/2-obstacleLength/2)){
            boid.vy = -boid.vy;
            boid.avoidBoundaryCollisionFrames = 10;            
            boid.colorFrames = 50;
        }
        //bot
        if(boid.y>(canvas.width/2-obstacleLength/2)&&boid.x<(canvas.width/2+obstacleLength/2)&&boid.x>(canvas.width/2-obstacleLength/2)){
            boid.vy = -boid.vy;
            boid.avoidBoundaryCollisionFrames = 10;
            boid.colorFrames = 50;
        }
    }
    

}

let lastTime; // will be undefined by default
/**
 * The Actual Execution
 */
function loop(timestamp) {
    // time step - convert to 1/60th of a second frames
    // 1000ms / 60fps
    const delta = (lastTime ? timestamp-lastTime : 0) * 1000.0/60.0;

    // change directions
    theBoids.forEach(boid => boid.steer(theBoids));
    // move forward
    let speed = Number(speedSlider.value);
    theBoids.forEach(function (boid) {
        boid.x += boid.vx * speed;
        boid.y += boid.vy * speed;
    });
    let totalAngle = 0;
    let totalX = 0;
    let totalY = 0;
    // make sure that we stay on the screen
    theBoids.forEach(function (boid) {
        /**
         * Students should replace this with collision code
         */
        totalAngle+=boid.angle;
        totalX+=boid.x;
        totalY+=boid.y;
        if((boid.x<=0||boid.x>=canvas.width)&&boid.avoidBoundaryCollisionFrames==0){
            if(boid.x>canvas.width)boid.x = canvas.width;
            if(boid.x<0)boid.x = 0;
            boid.vx = -boid.vx;
            boid.avoidBoundaryCollisionFrames = 0;
            boid.colorFrames = 50;
        }
        if((boid.y<=0||boid.y>=canvas.height)&&boid.avoidBoundaryCollisionFrames==0){
            if(boid.y>canvas.height)boid.y = canvas.height;
            if(boid.y<0)boid.y = 0;
            boid.vy = -boid.vy;
            boid.avoidBoundaryCollisionFrames = 0;
            boid.colorFrames = 50;
        }
        theBoids.forEach(function(another){
            if(another.x!==boid.x&&another.y!==boid.y&&boid.avoidBoidCollisionFrames==0){
                if(((another.x-boid.x)**2+(another.y-boid.y)**2)**0.5*2<collisionRadius){
                    let tempVx = boid.vx;
                    let tempVy = boid.vy;
                    boid.vx = another.vx;
                    boid.vy = another.vy;
                    another.vx = tempVx;
                    another.vy = tempVy;
            
                    boid.colorFrames = 50;
                    another.colorFrames = 50;
                    boid.avoidBoidCollisionFrames = 1;
                    another.avoidBoidCollisionFrames = 1;
                }
            }
        });
    });
    let averageAngle = totalAngle/theBoids.length;
    let averageX = totalX/theBoids.length;
    let averageY = totalY/theBoids.length;
    theBoids.forEach(function(boid){
        checkObstacle(boid);
        sliderAngle = Number(angleSlider.value)*Math.PI*2/100;
        boid.steer(flockModel, averageAngle,averageX,averageY,mouseX,mouseY,sliderAngle)
        if(boid.colorFrames>0){
            boid.colorFrames--;
        }
        if(boid.avoidBoundaryCollisionFrames>0){
            boid.avoidBoundaryCollisionFrames--;
        }
        if(boid.avoidBoidCollisionFrames>0){
            boid.avoidBoidCollisionFrames--;
        }
    });
    // now we can draw
    draw();
    //
    context.fillRect(canvas.width/2-obstacleLength/2,canvas.height/2-obstacleLength/2,obstacleLength,obstacleLength);
    // and loop
    window.requestAnimationFrame(loop);

}
// start the loop with the first iteration
window.requestAnimationFrame(loop);


