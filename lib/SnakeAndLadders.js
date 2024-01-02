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

    if (pos > 16) {
        const difference = pos-16
        pos = 16-difference
    }

    return pos
}

export const roll = () => {
    return random(1,6)
}

export const move = (currentPos, rolledNum) => {
    return currentPos + rolledNum
}
