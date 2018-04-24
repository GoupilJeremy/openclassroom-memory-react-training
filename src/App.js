import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'
import HighScoreInput from './HighScoreInput'
import Button from './Button'
import Label from './Label'

import HallOfFame from './HallOfFame'

const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
const VISUAL_PAUSE_MSECS = 750

class App extends Component {
  state = { 
    cards: this.generateCards(),
    currentPair: [],
    guesses: 0,
    hallOfFame: null,
    matchedCardIndices: [],
    increment: 0,
  }

  generateCards() {
    const result = []
    const size = SIDE * SIDE
    const candidates = shuffle(SYMBOLS)
    while (result.length < size) {
      const card = candidates.pop()
      result.push(card, card)
    }
    return shuffle(result)
  }

  // Arrow fx for binding
  displayHallOfFame = hallOfFame => {
    this.setState({ hallOfFame })
  }

  handleNewPairClosedBy(index) {
    const { cards, currentPair, guesses, matchedCardIndices } = this.state

    const newPair = [currentPair[0], index]
    const newGuesses = guesses + 1
    const matched = cards[newPair[0]] === cards[newPair[1]]
    this.setState({ currentPair: newPair, guesses: newGuesses })
    if(matched) {
      this.setState({matchedCardIndices: [...matchedCardIndices, ...newPair]})
    }
    setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)

  }

  handleCardClick = (index) => {
    const { currentPair } = this.state

    if(currentPair.length === 2){
      return
    }

    if(currentPair.length === 0){
      this.setState({ currentPair: [index] })
      return
    }

    this.handleNewPairClosedBy(index)
  }

  getFeedbackForCard(index) {
    const { currentPair, matchedCardIndices } = this.state
    const indexMatched = matchedCardIndices.includes(index)
  
    if(currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? 'visible': 'hidden'
    }

    if(currentPair.includes(index)) {
      return indexMatched ? 'justMatched' : 'justMismatched'
    }

    return indexMatched ? 'visible' : 'hidden'
  }

  handleButtonIncrementClick = () => {
    const { increment } = this.state
    const newIncrement = increment + 1
    this.setState({increment: newIncrement})
    return
  }

  render() {
    const { cards, guesses, hallOfFame, matchedCardIndices, increment } = this.state
    const won = matchedCardIndices.lentgh === cards.length
    return (
      <div className="memory">
        <GuessCount guesses={guesses} />
        {
          cards.map((card, index) => (
            <Card 
              index={index} 
              key={index} 
              card={card} 
              feedback={this.getFeedbackForCard(index)}
              onClick={this.handleCardClick} 
            />
          ))
        }
        {won && 
        (hallOfFame ? (
            <HallOfFame entries={hallOfFame} />
          ) : (
            <HighScoreInput guesses={guesses} onStored={this.displayHallOfFame} />
          )
        )
          }
        <br />
        <hr />
        <Button onClick={this.handleButtonIncrementClick} />
        <Label value={increment} />
      </div>
    )
  }
}

export default App