#!/usr/bin/env node


import promptSync from "prompt-sync"
const prompt = promptSync({sigint: true})

import { pokerController } from "../controller/poker.js";

console.clear()
console.log("Welcome to Billboo Poker")
console.log("Type 'play' to start")
console.log()


let guess = ""
while (guess !== "exit") {
    guess = prompt('');

    const inputs = guess.split(" ")
    const command = inputs.shift()
    switch (command) {
        case "play":
            console.log("Shuffling Cards...")
            const cards = pokerController.shuffleCards()

            console.log("Dealing Cards to 4 players...")
            const players = [[], [], [], []]
            for (let i=0; i<=19; i++) {
                players[i%4].push(cards.shift())
            }

            console.log("Showing Cards...")
            console.log()
            let ranks = []
            for (let i=0; i<players.length; i++) {
                let dealtCards = []
                console.log(`Player ${i+1}`)
                for (const card of players[i]) {
                    console.log(displayCard(card))
                    dealtCards.push(card)
                }
                console.log("--------")
                ranks.push(pokerController.checkRankCards(dealtCards))
            }

            console.log()
            const winner = pokerController.checkHighestRank(ranks)
            console.log(`player ${winner.player} win with ${winner.name}!`)

            // let ranks = []
            // for (const dealt of dealtCards) {
            //     ranks.push(pokerController.checkRankCards(dealt))
            // }
            // const winner = pokerController.checkHighestRank(ranks)
            // console.log(`The Winner is player${winner}!`)

            break

        case "exit":
            console.log(`Closing Poker`)
            break

        default:
            console.log(`available commands:
- play
- exit
`)
            break
    }

    console.log()
}


function displayCard(card) {
    const suitSymbol = {
        "Spades": "♠",
        "Hearts": "♥",
        "Clubs": "♣",
        "Diamonds": "♦",
    }
    return `${card.value} ${suitSymbol[card.suit]}`
}
