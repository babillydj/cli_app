import {pokerController} from "../src/controller/poker.js";

import * as assert from "assert";

describe('poker', function () {
    describe('Royal Flush', function () {
        it('check royal flush', function () {
            let cards = [
                {value: 10, suit: "Spades"},
                {value: "Jack", suit: "Spades"},
                {value: "Queen", suit: "Spades"},
                {value: "King", suit: "Spades"},
                {value: "Ace", suit: "Spades"},
            ]
            let resp = pokerController.royalFlush(cards)
            assert.notEqual(false, resp)

            cards[0] = {value: 9, suit: "Spades"}
            resp = pokerController.royalFlush(cards)
            assert.equal(false, resp)

            cards[0] = {value: 10, suit: "Hearts"}
            resp = pokerController.royalFlush(cards)
            assert.equal(false, resp)

            cards[0] = {value: 10, suit: "Spades"}
            cards[cards.length-1] = {value: 9, suit: "Spades"}
            resp = pokerController.royalFlush(cards)
            assert.equal(false, resp)
        });
    });

    describe('Straight Flush', function () {
        it('check straight flush', function () {
            let cards = [
                {value: 9, suit: "Hearts"},
                {value: 10, suit: "Hearts"},
                {value: "Jack", suit: "Hearts"},
                {value: "Queen", suit: "Hearts"},
                {value: "King", suit: "Hearts"},
            ]
            let resp = pokerController.straightFlush(cards)
            assert.notEqual(false, resp)

            cards[0] = {value: 8, suit: "Hearts"}
            resp = pokerController.straightFlush(cards)
            assert.equal(false, resp)

            cards[0] = {value: 9, suit: "Spades"}
            resp = pokerController.straightFlush(cards)
            assert.equal(false, resp)
        });
    });

    describe('Four of a Kind', function () {
        it('check four pairs', function () {
            let cards = [
                {value: 9, suit: "Spades"},
                {value: 9, suit: "Hearts"},
                {value: 9, suit: "Clubs"},
                {value: 9, suit: "Diamonds"},
                {value: "King", suit: "Hearts"},
            ]
            let resp = pokerController.pairs(cards, 4, 1)
            assert.notEqual(false, resp)

            cards[0] = {value: 8, suit: "Hearts"}
            resp = pokerController.pairs(cards)
            assert.equal(false, resp)
        });
    })

    describe('Full House', function () {
        it('check full house', function () {
            let cards = [
                {value: 9, suit: "Spades"},
                {value: 9, suit: "Hearts"},
                {value: "King", suit: "Clubs"},
                {value: "King", suit: "Diamonds"},
                {value: "King", suit: "Hearts"},
            ]
            let resp = pokerController.fullHouse(cards)
            assert.notEqual(false, resp)

            cards[0] = {value: 8, suit: "Hearts"}
            resp = pokerController.fullHouse(cards)
            assert.equal(false, resp)
        });
    });

    describe('Flush', function () {
        it('check flush', function () {
            let cards = [
                {value: 9, suit: "Clubs"},
                {value: 2, suit: "Clubs"},
                {value: 5, suit: "Clubs"},
                {value: "King", suit: "Clubs"},
                {value: 7, suit: "Clubs"},
            ]
            let resp = pokerController.flush(cards)
            assert.notEqual(false, resp)

            cards[0] = {value: 8, suit: "Hearts"}
            resp = pokerController.flush(cards)
            assert.equal(false, resp)
        });
    });

    describe('Straight', function () {
        it('check straight', function () {
            let cards = [
                {value: 9, suit: "Spades"},
                {value: 10, suit: "Hearts"},
                {value: "Jack", suit: "Clubs"},
                {value: "Queen", suit: "Diamonds"},
                {value: "King", suit: "Spades"},
            ]
            let resp = pokerController.straight(cards)
            assert.notEqual(false, resp)

            cards[0] = {value: "Ace", suit: "Hearts"}
            resp = pokerController.straight(cards)
            assert.notEqual(false, resp)

            cards = [
                {value: 2, suit: "Spades"},
                {value: 3, suit: "Hearts"},
                {value: 4, suit: "Clubs"},
                {value: 5, suit: "Diamonds"},
                {value: "Ace", suit: "Spades"},
            ]
            resp = pokerController.straight(cards)
            assert.notEqual(false, resp)

            cards[0] = {value: 8, suit: "Hearts"}
            resp = pokerController.straight(cards)
            assert.equal(false, resp)
        });
    });

    describe('Three of a Kind', function () {
        it('check three pairs', function () {
            let cards = [
                {value: 9, suit: "Spades"},
                {value: 9, suit: "Hearts"},
                {value: 9, suit: "Clubs"},
                {value: 8, suit: "Diamonds"},
                {value: "King", suit: "Hearts"},
            ]
            let resp = pokerController.pairs(cards, 3, 1)
            assert.notEqual(false, resp)

            cards[0] = {value: 8, suit: "Hearts"}
            resp = pokerController.pairs(cards, 3, 1)
            assert.equal(false, resp)
        });
    })

    describe('Two Pairs', function () {
        it('check two pairs', function () {
            let cards = [
                {value: 9, suit: "Spades"},
                {value: 9, suit: "Hearts"},
                {value: 8, suit: "Clubs"},
                {value: 8, suit: "Diamonds"},
                {value: "King", suit: "Hearts"},
            ]
            let resp = pokerController.pairs(cards, 2, 2)
            assert.notEqual(false, resp)

            cards[0] = {value: 8, suit: "Hearts"}
            resp = pokerController.pairs(cards, 2, 2)
            assert.equal(false, resp)
        });
    })

    describe('One Pairs', function () {
        it('check One pairs', function () {
            let cards = [
                {value: 10, suit: "Spades"},
                {value: 9, suit: "Hearts"},
                {value: 8, suit: "Clubs"},
                {value: 8, suit: "Diamonds"},
                {value: "King", suit: "Hearts"},
            ]
            let resp = pokerController.pairs(cards, 2, 1)
            assert.notEqual(false, resp)

            cards[0] = {value: 8, suit: "Hearts"}
            resp = pokerController.pairs(cards, 2, 1)
            assert.equal(false, resp)
        });
    })

    describe('Highest Value', function () {
        it('check highest value', function () {
            let cards = [
                {value: "Ace", suit: "Spades"},
                {value: 5, suit: "Hearts"},
                {value: "Jack", suit: "Clubs"},
                {value: 2, suit: "Diamonds"},
                {value: 10, suit: "Hearts"},
            ]
            let resp = pokerController.checkOrdering(cards)
            assert.equal(14, resp.value)
            assert.equal("Spades", resp.suit)

            cards[0] = {value: 8, suit: "Hearts"}
            resp = pokerController.checkOrdering(cards)
            assert.equal(11, resp.value)
            assert.equal("Clubs", resp.suit)
        });
    })
});