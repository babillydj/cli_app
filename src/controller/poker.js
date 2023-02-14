

class PokerController {

    shuffleCards() {
        let cards = []
        let suits = [
            "Spades",
            "Hearts",
            "Clubs",
            "Diamonds"
        ]
        let kingdoms = [
            "Jack",
            "Queen",
            "King",
            "Ace"
        ]

        for (const suit of suits) {
            for (let i = 2; i < 11; i++) {
                cards.push({suit: suit, value: i})
            }
            for (const kingdom of kingdoms) {
                cards.push({suit: suit, value: kingdom})
            }
        }

        let currentIndex = cards.length
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            let temp = cards[currentIndex];
            cards[currentIndex] = cards[randomIndex];
            cards[randomIndex] = temp;
        }

        return cards
    }

    checkRankCards(cards) {
        let result;
        let ranks = [
            {"royalFlush": []},
            {"straightFlush": []},
            {"pairs": [4, 1]},
            {"fullHouse": []},
            {"flush": []},
            {"straight": []},
            {"pairs": [3, 1]},
            {"pairs": [2, 2]},
            {"pairs": [2, 1]},
            {"checkOrdering": []},
        ]

        for (let i=0; i<ranks.length; i++) {
            const [key, value] = Object.entries(ranks[i])[0]
            result = this[key].apply(this, [cards, ...value])
            if(result) {
                result = {
                    ...result,
                    rank: i
                }
                break
            }
        }

        return result
    }

    checkHighestRank(ranks) {
        let highest = { ...ranks[0], player: 1 }

        for (let i=1; i<ranks.length; i++) {
            const rank = ranks[i]
            if (highest.rank > rank.rank) {
                highest = { ...rank, player: i + 1 }
            } else if (highest.rank === rank.rank) {
                if (highest.value < rank.value) {
                    highest = { ...rank, player: i + 1 }
                } else if (highest.value === rank.value){
                    const highestSuit = this.checkHighestSuit(highest.suit, rank.suit)
                    if (highestSuit === rank.suit) {
                        highest = { ...rank, player: i + 1 }
                    }
                }
            }
        }

        return highest
    }

    defCard(name) {
        const cards = {
            "Jack": 11,
            "Queen": 12,
            "King": 13,
            "Ace": 14
        }
        if (name in cards) {
            return cards[name]
        }
        return name
    }

    checkHighestSuit(suit1, suit2) {
        const rank = {
            "Spades": 4,
            "Hearts": 3,
            "Clubs": 2,
            "Diamonds": 1,
        }

        if (rank[suit1] > rank[suit2]) {
            return suit1
        } else {
            return suit2
        }
    }

    checkOrdering(cards) {
        let ordered = true
        let valuesCard = []
        let ace
        for (const card of cards) {
            if (card.value !== "Ace") {
                valuesCard.push({
                    value: this.defCard(card.value),
                    suit: card.suit
                })
            } else {
                ace = {
                    value: 14,
                    suit: card.suit
                }
            }
        }

        valuesCard = valuesCard.sort((a, b) => a.value - b.value)
        let prev = null
        for (const card of valuesCard) {
            if (!prev) {
                prev = card
            } else if (card.value - prev.value !== 1) {
                ordered = false
            } else {
                prev = card
            }
        }

        let highest = valuesCard[valuesCard.length-1]
        if (ace) {
            if (ordered && valuesCard[0].value !== 2 && highest.value !== 13) {
                ordered = false
            }
            if (highest.value === 13 || !ordered) {
                highest = ace
            }
        }

        return {
            name: "Highest Value",
            value: highest.value,
            suit: highest.suit,
            ordered: ordered
        }
    }

    checkSuit(cards) {
        let prev = ""
        let allSame = true
        let highest = ""
        for (const card of cards) {
            if (!prev) {
                prev = card
                highest = card
            } else {
                if (prev.suit !== card.suit) {
                    allSame = false
                }
                if (highest.suit !== card.suit) {
                    const higher = this.checkHighestSuit(prev, card.suit)
                    if (higher === card.suit){
                        highest = card
                    }
                }
                prev = card
            }
        }
        return {
            allSame: allSame,
            value: highest.value,
            suit: highest.suit
        }
    }

    royalFlush(cards) {
        const ordering = this.checkOrdering(cards)
        if (!ordering.ordered || ordering.value !== 14) {
            return false
        }

        const sameSuit = this.checkSuit(cards)
        if (!sameSuit.allSame) {
            return false
        }

        return {
            name: "Royal Flush",
            value: ordering.value,
            suit: sameSuit.suit
        }
    }

    straightFlush(cards) {
        const ordering = this.checkOrdering(cards)
        if (!ordering.ordered) {
            return false
        }

        const sameSuit = this.checkSuit(cards)
        if (!sameSuit.allSame) {
            return false
        }

        return {
            name: "Straight Flush",
            value: ordering.value,
            suit: sameSuit.suit
        }
    }

    fullHouse(cards) {
        const pairThree = this.pairs(cards, 3, 1)
        const pairTwo = this.pairs(cards, 2, 1)

        if (pairThree && pairTwo) {
            const value = pairThree.pairs[0].value
            const suit = pairThree.pairs[0].suit
            return {
                name: "Full House",
                value: value,
                suit: suit
            }
        }
        return false
    }

    flush(cards) {
        const sameSuit = this.checkSuit(cards)
        if (!sameSuit.allSame) {
            return false
        }
        const highest = this.checkOrdering(cards)

        return {
            name: "Flush",
            suit: highest.suit,
            value: highest.value
        }
    }

    straight(cards) {
        const ordering = this.checkOrdering(cards)
        if (!ordering.ordered) {
            return false
        }
        return {
            name: "Straight",
            suit: ordering.suit,
            value: ordering.value
        }
    }

    pairs(cards, pair, total) {
        let mapVal = {}
        for (const card of cards) {
            if (!mapVal[card.value]) {
                mapVal[card.value] = {
                    total: 1,
                    suit: card.suit
                }
            } else {
                mapVal[card.value].total = mapVal[card.value].total + 1
                mapVal[card.value].suit = this.checkHighestSuit(mapVal[card.value].suit, card.suit)
            }
        }

        let pairs = []
        for (const [key, value] of Object.entries(mapVal)) {
            if(value.total === pair) {
                pairs.push({total: pair, value: key, suit: value.suit})
            }
        }
        if (pairs.length !== total) {
            return false
        }

        let highest = {
            value: 0
        }

        for (let i=0; i<pairs.length; i++) {
            const pair = pairs[i]
            highest.value = parseInt(this.defCard(highest.value))
            pair.value = parseInt(this.defCard(pair.value))
            if (highest.value < pair.value) {
                highest = pair
            }
        }

        let name;
        if( pair > 2 ) {
            name = pair === 3 ? 'Three' : 'Four' + ' of a Kind'
        } else {
            const totalStr = total === 1 ? 'One' : 'Two'
            name = totalStr + ' ' + (total === 1 ? 'Pair' : 'Pairs')
        }

        return {
            name: name,
            value: highest.value,
            suit: highest.suit,
            pairs: pairs,
        }
    }
}


export const pokerController = new PokerController()

export default {
    pokerController
}