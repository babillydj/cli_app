

class PokerController {

    defCard(name) {
        const cards = {
            "Jack": 11,
            "Queen": 12,
            "King": 13
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
        for (const card of cards) {
            if (card.suit !== "ace") {
                valuesCard.push(this.defCard(card.value))
            }
        }
        valuesCard = valuesCard.sort()
        let prev = null
        for (const card of valuesCard) {
            if (!prev) {
                prev = card
            } else if (card - prev !== 1) {
                ordered = false
                break
            }
        }

        let highest = valuesCard[valuesCard.length-1]
        if (valuesCard.length === 4) {
            if (highest === 13) {
                highest = 14
            } else if (valuesCard[0] !== 2) {
                ordered = false
            }
        }
        return {
            highest: highest,
            ordered: ordered
        }
    }

    checkSuit(cards) {
        let prevSuit = ""
        let allSame = true
        let highest = ""
        for (const card of cards) {
            if (!prevSuit) {
                prevSuit = card.suit
            } else {
                if (prevSuit !== card.suit) {
                    allSame = false
                }
                if (highest !== card.suit) {
                    highest = this.checkHighestSuit(prevSuit, card.suit)
                }
            }
        }
        return {
            allSame: allSame,
            highest: highest
        }
    }

    royalFlush(cards) {
        const ordering = this.checkOrdering()
        if (!ordering.ordered) {
            return false
        }

        const sameSuit = this.checkSuit()
        if (!sameSuit.allSame) {
            return false
        }

        return {
            name: "Royal Flush",
            value: ordering.highest,
            suit: sameSuit.highest
        }
    }
}