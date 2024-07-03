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
