const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = 1024
canvas.height = 576
var x = 0
let bombx
var a = 100
var b = 50
var space = 0;
var time = true;
var protecting = false;
var ilkzaman = true;
var color2 = "red";
var protectr = 150;
var degiyo = false;
var enemy_color = "red";
var buyuyenr = true;
var hasar = false;
var artmaizni = true;
var artma = true;
var bomb = false;
var bombt = false
var finishhimanimation = 0.1;
function carpisma(rect1, rect2) {
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.pos.x &&
        rect1.attackBox.position.x <= rect2.pos.x + rect2.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.pos.y &&
        rect1.attackBox.position.y <= rect2.pos.y + rect2.height
    )
}
function carpisma2(rect1, rect2) {
    return (
        rect1.posx + rect1.width >= rect2.pos.x &&
        rect1.posx <= rect2.pos.x + rect2.width &&
        rect1.posy + rect1.height >= rect2.pos.y &&
        rect1.posy <= rect2.pos.y + rect2.height
    )
}
let timer = 60
let timerid

function say() {
    if (timer > 0) {
        timerid = setTimeout(say, 1000);
        timer--
        document.getElementById("timer").innerText = timer
    }
    if (timer === 0) {
        kazananbelirle(player, enemy)
    }

}
function kazananbelirle(player, enemy) {
    clearTimeout(timerid)
    document.getElementById("displayText").style.display = "flex"
    if (player.health === enemy.health) {
        document.getElementById("displayText").innerText = "BERABERE"
    } else if (player.health > enemy.health) {
        document.getElementById("displayText").innerText = "player kazandi"
    } else if (player.health < enemy.health) {
        document.getElementById("displayText").innerText = "enemy kazandi"
    }

}
class Sprite {
    constructor({ pos, imageSrc, scale = 1, framesmax = 1, animOffset = { x: 0, y: 0 } }) {
        this.pos = pos
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesmax = framesmax
        this.framescurrent = 0
        this.frameselapsed = 0
        this.frameshold = 10
        this.animOffset = animOffset
    }
    draw() {


        ctx.drawImage(
            this.image,
            this.framescurrent * (this.image.width / this.framesmax),
            0,
            this.image.width / this.framesmax,
            this.image.height,
            this.pos.x - this.animOffset.x,
            this.pos.y - this.animOffset.y,
            this.image.width / this.framesmax * this.scale,
            this.image.height * this.scale

        )
    }
    update() {
        this.draw()
        this.animateFrames()

    }
    animateFrames() {
        this.frameselapsed++

        if (this.frameselapsed % this.frameshold === 0) {
            if (this.framescurrent < this.framesmax - 1) {
                this.framescurrent++
            } else {
                this.framescurrent = 0
            }

        }
    }
}

class Fighter extends Sprite {
    constructor({ pos, vel, color = "blue", imageSrc, scale = 1, framesmax = 1, animOffset = { x: 0, y: 0 }, sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined
        } }) {
        super({ pos, imageSrc, scale, framesmax, animOffset })
        this.vel = vel
        this.width = 50
        this.height = 150
        this.lastkey
        this.attackBox = {
            position: {
                x: this.pos.x,
                y: this.pos.y
            },
            width: attackBox.width,
            height: attackBox.height
            , offset: attackBox.offset,




        }
        this.protectr = protectr
        this.color = color
        this.color2 = color2
        this.isAttacking
        this.health = 100
        this.dead = false
        this.framescurrent = 0
        this.frameselapsed = 0
        this.frameshold = 10
        this.sprites = sprites
        for (const sprite in this.sprites) {
            this.sprites[sprite].image = new Image()
            this.sprites[sprite].image.src = this.sprites[sprite].imageSrc
        }
    }
    power() {

        if (protecting) {

            if (ilkzaman) {
                ctx.strokeStyle = "white"
            } else {
                ctx.strokeStyle = this.color2
            }

            ctx.beginPath();
            ctx.arc(player.pos.x + player.width / 2, player.pos.y + player.height / 2, protectr, 0, 2 * Math.PI);
            ctx.stroke();



        }
        if (hasar) {
            ctx.strokeStyle = "white"
            ctx.beginPath();
            ctx.arc(enemy.pos.x + enemy.width / 2, enemy.pos.y + enemy.height / 2, buyuyenr, 0, 2 * Math.PI);
            ctx.stroke();
        }



    }

    update() {
        this.draw()
        this.power()
        if (!this.dead) {
            this.animateFrames()
        }
        this.attackBox.position.x = this.pos.x + this.attackBox.offset.x
        this.attackBox.position.y = this.pos.y + this.attackBox.offset.y
        // ctx.fillStyle = 'green'
        // ctx.fillRect(
        //     this.attackBox.position.x,
        //     this.attackBox.position.y,
        //     this.attackBox.width,
        //     this.attackBox.height
        // )
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y

        if (this.pos.y + this.height + this.vel.y >= canvas.height - 96) {
            this.vel.y = 0
            this.pos.y = 330
        } else { this.vel.y += gravity }
    }
    attack() {
        this.switchSprite("attack1")
        this.isAttacking = true

    }

    switchSprite(sprite) {

        if (this.image === this.sprites.death.image) {
            if (this.framescurrent == this.sprites.death.framesmax - 1) {
                this.dead = true
            }
            return
        }

        if (this.image === this.sprites.attack1.image &&
            this.framescurrent < this.sprites.attack1.framesmax - 1) {
            return
        }
        if (this.image === this.sprites.takehit.image &&
            this.framescurrent < this.sprites.takehit.framesmax - 1) {
            return
        }

        switch (sprite) {
            case "idle":
                if (this.image != this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesmax = this.sprites.idle.framesmax
                    this.framescurrent = 0
                }
                break;
            case "run":
                if (this.image != this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesmax = this.sprites.run.framesmax
                    this.framescurrent = 0
                }
                break;
            case "jump":
                if (this.image != this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesmax = this.sprites.jump.framesmax
                    this.framescurrent = 0
                }
                break;
            case "fall":
                if (this.image != this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesmax = this.sprites.fall.framesmax
                    this.framescurrent = 0
                }
                break;
            case "attack1":
                if (this.image != this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesmax = this.sprites.attack1.framesmax
                    this.framescurrent = 0
                }
                break;
            case "takehit":
                if (this.image != this.sprites.takehit.image) {
                    this.image = this.sprites.takehit.image
                    this.framesmax = this.sprites.takehit.framesmax
                    this.framescurrent = 0

                }
                break;
            case "death":
                if (this.image != this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesmax = this.sprites.death.framesmax
                    this.framescurrent = 0
                }
                break;





            default:
                break;
        }
    }

}

class Bomb {
    constructor({ }) {
        this.posx = enemy.pos.x
        this.posy = enemy.pos.y
        this.x = 8
        this.y = -2
        if (enemy.lastkey == "ArrowRight") { this.x = this.x }
        if (enemy.lastkey == "ArrowLeft") { this.x = -this.x }
        this.width = 30
        this.height = 30
    }


    draw() {


        ctx.fillStyle = "red"

        ctx.fillRect(this.posx, this.posy, this.width, this.height)


    }
    update() {
        this.draw()

        this.posx += this.x
        this.posy += this.y
        this.y += 0.1


    }
}

console.log("1*95*54*45*79*-569*8/555/85469***777")
const gravity = 0.2
const background = new Sprite({

    pos: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/background.png"
})
const shop = new Sprite({

    pos: {
        x: 600,
        y: 128
    },
    imageSrc: "./img/shop.png",
    scale: 2.75,
    framesmax: 6,
})
const player = new Fighter({
    pos: {
        x: 50,
        y: 50
    },
    vel: {
        x: 0,
        y: -5
    }
    ,
    imageSrc: "./img/samuraiMack/Idle.png",
    framesmax: 8,
    scale: 2.5,
    animOffset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: "./img/samuraiMack/Idle.png",
            framesmax: 8,
        },
        run: {
            imageSrc: "./img/samuraiMack/Run.png",
            framesmax: 8,
        },
        jump: {
            imageSrc: "./img/samuraiMack/Jump.png",
            framesmax: 2,
        },
        fall: {
            imageSrc: "./img/samuraiMack/Fall.png",
            framesmax: 2,
        },
        attack1: {
            imageSrc: "./img/samuraiMack/Attack1.png",
            framesmax: 6,
        },
        takehit: {
            imageSrc: "./img/samuraiMack/white-take-hit.png",
            framesmax: 4,
        },
        death: {
            imageSrc: "./img/samuraiMack/Death.png",
            framesmax: 6,
            frameshold: 30
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50

    }


})

const enemy = new Fighter({
    pos: {
        x: 500,
        y: 50
    },
    vel: {
        x: 0,
        y: -5
    },

    color: enemy_color,
    imageSrc: "./img/kenji/Idle.png",
    framesmax: 4,
    scale: 2.5,
    animOffset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: "./img/kenji/Idle.png",
            framesmax: 4,
        },
        run: {
            imageSrc: "./img/kenji/Run.png",
            framesmax: 8,
        },
        jump: {
            imageSrc: "./img/kenji/Jump.png",
            framesmax: 2,
        },
        fall: {
            imageSrc: "./img/kenji/Fall.png",
            framesmax: 2,
        },
        attack1: {
            imageSrc: "./img/kenji/Attack1.png",
            framesmax: 4,
        },

        takehit: {
            imageSrc: "./img/kenji/take-hit.png",
            framesmax: 3,
        },
        death: {
            imageSrc: "./img/kenji/Death.png",
            framesmax: 7,
            frameshold: 30
        }

    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50

    }

})
const keys = {
    a: false,
    d: false,
    ArrowLeft: false,
    ArrowRight: false
}

say()
function animate() {
    requestAnimationFrame(animate)
    ctx.fillStyle = "rgba(255,255,255,finishhimanimation)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    ctx.fillStyle = "rgba(255,255,255,0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.vel.x = 0
    enemy.vel.x = 0

    if (!player.dead) {
        if (keys.a && player.lastkey === "a") {
            player.vel.x = -5
            // player.attackBox.offset.x = -125
            player.switchSprite("run")
        } else if (keys.d && player.lastkey === "d") {
            player.vel.x = 5
            // player.attackBox.offset.x = 125
            player.switchSprite("run")
        } else { player.switchSprite("idle") }

    }
    if (player.vel.y < 0) {
        player.switchSprite("jump")
    } else if (player.vel.y > 0) { player.switchSprite("fall") }

    if (!enemy.dead) {
        if (keys.ArrowLeft && enemy.lastkey === "ArrowLeft") {
            enemy.vel.x = -5
            // enemy.attackBox.offset.x = -125
            enemy.switchSprite("run")
        } else if (keys.ArrowRight && enemy.lastkey === "ArrowRight") {
            enemy.vel.x = 5
            // enemy.attackBox.offset.x = 125
            enemy.switchSprite("run")
        } else { enemy.switchSprite("idle") }
    }

    if (carpisma(player, enemy) && player.isAttacking == true && player.framescurrent == 4) {
        console.log("damage")
        player.isAttacking = false
        enemy.health -= 10
        if (enemy.health > 0) {
            gsap.to("#enemyHealth", { width: enemy.health + "%" })
            enemy.switchSprite("takehit");
        } else {
            gsap.to("#enemyHealth", { width: 0 + "%" })
            enemy.switchSprite("death")
        }

    }
    if (player.isAttacking == true && player.framescurrent == 4) {
        player.isAttacking = false
    }
    if (carpisma(enemy, player) && enemy.isAttacking == true && enemy.framescurrent == 2) {
        console.log("enemy.damage")
        enemy.isAttacking = false

        if (ilkzaman && protecting) { player.health -= 1 } else {
            player.health -= 5
            enemy.health += 2
            gsap.to("#enemyHealth", { width: enemy.health + "%" })
        }

        if (player.health > 0) {
            gsap.to("#playerHealth", { width: player.health + "%" })
            player.switchSprite("takehit");
        } else {
            player.switchSprite("death")
            gsap.to("#playerHealth", { width: 0 + "%" })



        }

    }

    if (enemy.isAttacking == true && enemy.framescurrent == 2) {
        enemy.isAttacking = false
    }
    if (!ilkzaman && protecting && player.pos.x + player.width / 2 + protectr >= enemy.pos.x &&
        player.pos.x + player.width / 2 - protectr <= enemy.pos.x + enemy.width &&
        player.pos.y + player.height / 2 - protectr <= enemy.pos.y + enemy.height

    ) {
        enemy.lastkey = "*"
        degiyo = true

    }

    if (player.health <= 0, enemy.health <= 0) {
        kazananbelirle(player, enemy)
    }
    if (bombx) {
        bombx.update()
        if (carpisma2(bombx, player)) {
            console.log("console")

        }

    }


}

animate()
window.addEventListener("keydown", function (e) {

    switch (e.key) {
        case "a":
            player.lastkey = "a"
            keys.a = true
            break;
        case "d":

            player.lastkey = "d"

            keys.d = true
            break;
        case "w":
            if (!player.dead) {
                player.vel.y = -10
            }


            break;
        case " ":
            player.attack()
            break
        case "e":
            if (time) {
                let durdurma = setInterval(() => {
                    player.lastkey = "e"
                }, 1);

                time = false
                protecting = true
                ilkzaman = true
                setTimeout(() => {
                    ilkzaman = false

                }, 800);
                setTimeout(() => {
                    if (degiyo) {
                        color2 = "black"
                        protectr = 5000
                        player.lastkey = "a"
                        enemy_color = "white"
                        clearInterval(durdurma)
                        hasar = true;
                        artmaizni = true
                        let bomba1 = setInterval(() => {
                            if (artmaizni) {
                                if (artma) {
                                    buyuyenr++;
                                } else if (!artma) {
                                    buyuyenr--;
                                }

                            }

                        }, 10);
                    } else {
                        protecting = false
                        player.lastkey = "a"
                        clearInterval(durdurma)

                    }


                }, 1500);
                setTimeout(() => {
                    artma = false;
                }, 3250);
                setTimeout(() => {
                    if (degiyo) {
                        let hasarartirma = 0
                        protecting = false
                        degiyo = false
                        enemy.health -= 20 + hasarartirma
                        enemy_color = "red"
                        player.health += 10 + hasarartirma / 3

                        protectr = 150
                        hasarartirma += 15
                        if (enemy.health > 0) {
                            document.getElementById("enemyHealth").style.width = enemy.health + "%"
                        } else { document.getElementById("enemyHealth").style.width = 0 + "%" }
                        if (player.health > 0) {
                            document.getElementById("playerHealth").style.width = player.health + "%"
                        } else { document.getElementById("playerHealth").style.width = 0 + "%" }

                    }

                    artma = true;
                    hasar = false;
                    buyuyenr = 0;
                    artmaizni = false;
                }, 5000);
                setTimeout(() => {
                    time = true
                }, 8000);
                console.log("shield");

            }

            break;
    }


})
if (enemy.lastkey != "*") {
    window.addEventListener("keydown", function (e) {
        switch (e.key) {
            case "ArrowRight":
                enemy.lastkey = "ArrowRight"
                keys.ArrowRight = true
                break;
            case "ArrowLeft":

                enemy.lastkey = "ArrowLeft"

                keys.ArrowLeft = true
                break;
            case "ArrowUp":
                if (!enemy.dead) {
                    enemy.vel.y = -10
                }


                break;
            case "ArrowDown":
                enemy.attack()

                break;
            case "1":
                if (!enemy.dead) {
                    bombx = new Bomb({})
                }



                break;


            case "*":

                break;
            default:
                break;
        }
    })
}

window.addEventListener("keyup", function (e) {

    switch (e.key) {
        case "a":

            keys.a = false
            break;
        case "d":
            keys.d = false
            break;
        case "ArrowRight":

            keys.ArrowRight = false
            break;
        case "ArrowLeft":



            keys.ArrowLeft = false
            break;


        default:
            break;
    }
})
