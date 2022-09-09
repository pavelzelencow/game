const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let lastMouse = {
    x: 0,
    y: 0
}

let addBombs = false;
let addMeteors = false;
let meteorStep = 0;
let gameover = false;
let score = 0;

function Actor(path, x, y) {
    this.x = x;
    this.y = y;
    this.rotate = 0;
    this.image = new Image();
    this.image.src = path;

    this.onLoad = function (ctx) {
        if (this.image) {
            ctx.drawImage(this.image, this.x, this.y)
        } else {
            this.onLoad(ctx)
        }
    };

    this.onDraw = function (ctx) {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotate * Math.PI / 180);
        ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
        ctx.rotate(-this.rotate * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
    };
}

const bgImage = new Actor('img/bg3.jpg', canvas.width / 2, canvas.height / 2);
const spaceShip = new Actor('img/2.png', canvas.width / 2, canvas.height - 100);

function Bomb() {
    Actor.call(this, 'img/fire-bomb1.png', canvas.width / 2, canvas.height / 2);
}

function Meteor() {
    Actor.call(this, 'img/Asteroid.png', canvas.width / 2, canvas.height / 2);
}

function MeteorDebris() {
    Actor.call(this, 'img/Asteroid.png', canvas.width / 2, canvas.height / 2);
    this.vx = -5 + Math.random() * 10;
    this.vy = -5 + Math.random() * 10;
    this.diametr = 10;
    this.ax = Math.random() * this.image.width - this.diametr;
    this.ay = Math.random() * this.image.width - this.diametr;
    if (this.vx === 0 && this.vy === 0) {
        this.vx = 3;
    }
    this.onDraw = function (ctx) {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotate * Math.PI / 180);


        ctx.drawImage(this.image, this.ax, this.ay, 2 * this.diametr, 2 * this.diametr, -this.diametr, -this.diametr, 2 * this.diametr, 2 * this.diametr);
        ctx.rotate(-this.rotate * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
    };
}

function SpaceShipDebris() {
    Actor.call(this, 'img/2.png', canvas.width / 2, canvas.height / 2);
    this.vx = -5 + Math.random() * 10;
    this.vy = -5 + Math.random() * 10;
    this.diametr = 10;
    this.ax = Math.random() * this.image.width - this.diametr;
    this.ay = Math.random() * this.image.width - this.diametr;
    if (this.vx === 0 && this.vy === 0) {
        this.vx = 3;
    }
    this.onDraw = function (ctx) {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotate * Math.PI / 180);


        ctx.drawImage(this.image, this.ax, this.ay, 2 * this.diametr, 2 * this.diametr, -this.diametr, -this.diametr, 2 * this.diametr, 2 * this.diametr);
        ctx.rotate(-this.rotate * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
    };
}

const bombs = [];

const meteors = [];

const meteorsDebris = [];

const spaceShipsDebris = [];

function drawGame() {
    // draw bgImg
    bgImage.onDraw(ctx);

    if (!gameover) {
        //move follow mouse possition
        if (spaceShip.x < lastMouse.x) {
            spaceShip.x += 4;
            if (spaceShip.x > lastMouse.x) spaceShip.x = lastMouse.x
        } else if (spaceShip.x > lastMouse.x) {
            spaceShip.x -= 4;
            if (spaceShip.x < lastMouse.x) spaceShip.x = lastMouse.x
        }

        //draw spaceship
        spaceShip.onDraw(ctx);

        //add and move bomb
        if (addBombs) {
            const bomb = new Bomb();
            bomb.x = spaceShip.x;
            bomb.y = spaceShip.y - 80;
            bombs.push(bomb);
            addBombs = false;
        }
        for (let i = bombs.length - 1; i >= 0; i--) {
            if (bombs[i].y > -100) {
                bombs[i].y -= 5;
                bombs[i].onDraw(ctx);
            } else {
                bombs.splice(i, 1) // remove bomb when pos y less than -100
            }
        }
    }

    // add meteorits and move
    if (addMeteors) {
        const meteor = new Meteor();
        meteor.x = Math.round(Math.random() * canvas.width);
        meteor.y = -200;
        meteors.push(meteor);
        addMeteors = false;
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
        if (meteors[i].y < canvas.height + 200) {
            meteors[i].y += 4;
            meteors[i].onDraw(ctx);
            // boom rocket and meteor
            let explosion = false;
            for (let j = bombs.length - 1; j >= 0; j--) {
                let p1 = meteors[i].x + 0.5 * meteors[i].image.width - (bombs[j].x - 0.5 * bombs[j].image.width);
                let p2 = meteors[i].y + 0.5 * meteors[i].image.height - (bombs[j].y - 0.5 * bombs[j].image.height);
                let p3 = bombs[j].x + 0.5 * bombs[j].image.width - (meteors[i].x - 0.5 * meteors[i].image.width);
                let p4 = bombs[j].y + 0.5 * bombs[j].image.height - (meteors[i].y - 0.5 * meteors[i].image.height);
                if (p1 > 0 && p2 > 0 && p3 > 0 && p4 > 0) {
                    // add meteor debris
                    for (let n = 0; n < 10; n++) {
                        const meteorDebris = new MeteorDebris();
                        meteorDebris.x = meteors[i].x - 50 + Math.round(Math.random() * 100);
                        meteorDebris.y = meteors[i].y - 50 + Math.round(Math.random() * 100);
                        meteorsDebris.push(meteorDebris);
                    }
                    meteors[i].y = canvas.height + 500;
                    bombs[j].y = -500;
                    score++;
                    explosion = true;
                    break;
                }
            }

            if (!explosion) {
                let p1 = meteors[i].x + 0.5 * meteors[i].image.width - (spaceShip.x - 0.5 * spaceShip.image.width);
                let p2 = meteors[i].y + 0.5 * meteors[i].image.height - (spaceShip.y - 0.5 * spaceShip.image.height);
                let p3 = spaceShip.x + 0.5 * spaceShip.image.width - (meteors[i].x - 0.5 * meteors[i].image.width);
                let p4 = spaceShip.y + 0.5 * spaceShip.image.height - (meteors[i].y - 0.5 * meteors[i].image.height);
                if (p1 > 0 && p2 > 0 && p3 > 0 && p4 > 0) {
                    // add meteor debris
                    for (let n = 0; n < 10; n++) {
                        const meteorDebris = new MeteorDebris();
                        meteorDebris.x = meteors[i].x - 50 + Math.round(Math.random() * 100);
                        meteorDebris.y = meteors[i].y - 50 + Math.round(Math.random() * 100);
                        meteorsDebris.push(meteorDebris);
                    }
                    //add spaceship debris
                    for (let n = 0; n < 10; n++) {
                        const spaceShipDebris = new SpaceShipDebris();
                        spaceShipDebris.x = spaceShip.x - 50 + Math.round(Math.random() * 100);
                        spaceShipDebris.y = spaceShip.y - 50 + Math.round(Math.random() * 100);
                        spaceShipsDebris.push(spaceShipDebris);
                    }
                    meteors[i].y = canvas.height + 500;
                    spaceShip.y = -500;
                    score = score;
                    gameover = true;
                    break;
                }
            }
        } else {
            meteors.splice(i, 1) // remove meteor when pos more then canvas
        }
    }

    // move meteor debris
    for (let i = meteorsDebris.length - 1; i >= 0; i--) {
        if (meteorsDebris[i].y > -200 &&
            meteorsDebris[i].x > -200 &&
            meteorsDebris[i].y < canvas.height + 200 &&
            meteorsDebris[i].y < canvas.width + 200) {
            meteorsDebris[i].x += meteorsDebris[i].vx;
            meteorsDebris[i].y += meteorsDebris[i].vy;
            meteorsDebris[i].onDraw(ctx);
        } else {
            meteorsDebris.splice(i, 1)
        }
    }

    //move spaceship debris
    for (let i = spaceShipsDebris.length - 1; i >= 0; i--) {
        if (spaceShipsDebris[i].y > -200 &&
            spaceShipsDebris[i].x > -200 &&
            spaceShipsDebris[i].y < canvas.height + 200 &&
            spaceShipsDebris[i].y < canvas.width + 200) {
            spaceShipsDebris[i].x += spaceShipsDebris[i].vx;
            spaceShipsDebris[i].y += spaceShipsDebris[i].vy;
            spaceShipsDebris[i].onDraw(ctx);
        } else {
            spaceShipsDebris.splice(i, 1)
        }
    }

    if (meteorStep > 40) {
        meteorStep = 0
        addMeteors = true;
    } else {
        meteorStep++
    }

    //add name
    ctx.font = '30px Space Mono';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'white';
    ctx.fillText(localStorage.getItem('player'), Math.round(0.05 * canvas.width), 50);

    //add score
    ctx.font = '30px Space Mono';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, Math.round(0.95 * canvas.width), 50);

    if (gameover) {
        ctx.font = '60px Space Mono';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText('GAMEOVER', Math.round(0.5 * canvas.width), Math.round(0.5 * canvas.height));
    } 
    if (gameover) {
        ctx.font = '60px Space Mono';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(`${localStorage.getItem('player')}:${score}`, Math.round(0.5 * canvas.width), Math.round(0.65 * canvas.height));
    } 
    
    //add animation
    requestAnimationFrame(drawGame);
}


function init() {
    //init bgImage
    bgImage.onLoad(ctx); // onload

    //init spaceship
    spaceShip.onLoad(ctx);

    drawGame();
}

const requestAnimationFrame =
    window.requestAnimationFrame ||
    function (callback) {
        return setTimeout(callback, 100);
    }

window.addEventListener('load', init, false);
canvas.addEventListener('mousemove', mouseMove, false);
canvas.addEventListener('mousedown', mouseDown, false);


function getMousePos(c, evt) {
    let rect = c.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    }
}

function mouseMove(evt) {
    lastMouse = getMousePos(canvas, evt);
}


function mouseDown(evt) {
    addBombs = true;
}

const newBtn = document.querySelector('.playAgain');

function newGame() {
    
        newBtn.addEventListener('click', () => {
            console.log(111)
            window.location = "./game.html";
        })

}

newGame();

function clearSelection() {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else { // старый IE
      document.selection.empty();
    }
  }