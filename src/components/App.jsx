import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import Gameplay from './Gameplay.jsx';
import ChooseLevel from './ChooseLevel.jsx';

export default class App extends React.Component {
  static initialState() {
    return {
      gameStatus: null,
      word: null,
      levels: ['easy', 'medium', 'hard'],
      currentChar: '',
      missedChars: [],
      guessedChars: [],
      triesLeft: 3,
      numberOfUserTries: 0,
    };
  }
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getWord = this.getWord.bind(this);
    this.checkLetterOccurance = this.checkLetterOccurance.bind(this);
    this.updateGameStatus = this.updateGameStatus.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.state = App.initialState();
  }
  /** Downaload word from file */
  getWord(level) {
    axios.get('words.json')
      .then(resp => {
        let data = resp.data[level];
        const wordNumber = Math.floor(Math.random() * data.length);
        this.setState({ word: data[wordNumber].toUpperCase() });
      })
      .catch(error => console.log(error));
  }
  handleChange(event) {
    const inputChar = event.target.value.toUpperCase();
    this.setState({
      currentChar: inputChar,
    });
  }
  handleSubmit(event) {
    // Case: no tries left
    if (this.state.triesLeft === 0) {
      event.preventDefault();
      return;
    }
    this.setState((prevState) => {
      // Case: wrong letter submitted
      if (!this.checkLetterOccurance(prevState.currentChar) && prevState.missedChars.indexOf(prevState.currentChar) === -1) {
        return {
          missedChars: prevState.missedChars.concat(this.state.currentChar),
          currentChar: '',
          triesLeft: prevState.triesLeft - 1,
          numberOfUserTries: prevState.numberOfUserTries + 1,
        };
      }
      // Case: correct letter guessed
      if (this.checkLetterOccurance(prevState.currentChar) && prevState.guessedChars.indexOf(prevState.currentChar) === -1) {
        return {
          guessedChars: prevState.guessedChars.concat(this.state.currentChar),
          currentChar: '',
        };
      }
    }, this.updateGameStatus);
    event.preventDefault();
  }
  // Checks if the user has any retries left or guessed all letters
  updateGameStatus() {
    this.setState(prevState => {
      if (_.difference([...this.state.word], this.state.guessedChars).length === 0) {
        return { gameStatus: { message: 'Gratulacje! Wygrałeś', playerWon: true } };
      }
      if (this.state.triesLeft === 0) {
        return { gameStatus: { message: 'Przegrałeś', playerWon: false } };
      }
    });
  }
  checkLetterOccurance(letter) {
    return this.state.word.indexOf(letter) > -1 ? true : false;
  }
  restartGame() {
    this.setState(App.initialState());
  }
  render() {
    const {
      missedChars,
      guessedChars,
      gameStatus,
      triesLeft,
      numberOfUserTries,
      currentChar,
      levels,
      word,
    } = this.state;
    return (
      <div style={{ marginTop: 50 }} className="container">
        <h2>React Hangman</h2>
        <hr/>
        {word ?
          <Gameplay handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    missedChars={missedChars}
                    guessedChars={guessedChars}
                    gameStatus={gameStatus}
                    currentChar={currentChar}
                    triesLeft={triesLeft}
                    numberOfUserTries={numberOfUserTries}
                    word={word}/> :
          <ChooseLevel getWord={this.getWord}
                       levels={levels}
                       word={word}/>
        }
        <br/>
        {gameStatus ?
            <div className="text-center">
              <div className={gameStatus.playerWon ? 'alert alert-success' : 'alert alert-danger'}>{gameStatus.message}</div>
              <button className="btn btn-lg btn-warning" onClick={this.restartGame}>Nowa gra</button>
            </div> :
            null}
      </div>

    );
  }
}
