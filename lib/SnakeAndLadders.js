import { random } from "./random.js";

const snakes_pos = [
    {first: 8, last: 2},
    {first: 15, last: 9}
]

const ladder_pos = [
    {first: 3, last: 5},
    {first: 11, last: 14}
]

export const processPos = (pos) => {
    // check for snakes
    for (let i = 0; i < snakes_pos.length; i++) {
        if (pos == snakes_pos[i].first) {
            pos = snakes_pos[i].last
        }
    }

    // check for ladders
    for (let i = 0; i < ladder_pos.length; i++) {
        if (pos == ladder_pos[i].first) {
            pos = ladder_pos[i].last
        }
    }

    return pos
}

export const roll = () => {
    return random(1,6)
}

export const move = (currentPos, rolledNum) => {
    return currentPos + rolledNum
}

export const giveQuestion = (game, callback) => {
    let answer = undefined

    const randomQuestion = random(1,10)

    const guiGroup = game.physics.add.staticGroup()

    const question = guiGroup.create(420, 165, `question${randomQuestion}`)
    question.setOrigin(0,0)

    const trueButton = guiGroup.create(502, 492, "true button")
    trueButton.setOrigin(0,0)
    trueButton.setInteractive({ useHandCursor: true })
    trueButton.on("pointerup", () => {
        answer = true
        callback(answer, randomQuestion)
        guiGroup.clear(true)
    })

    const falseButton = guiGroup.create(717, 492, "false button")
    falseButton.setOrigin(0,0)
    falseButton.setInteractive({ useHandCursor: true })
    falseButton.on("pointerup", () => {
        answer = false
        callback(answer, randomQuestion)
        guiGroup.clear(true)
    })
}
