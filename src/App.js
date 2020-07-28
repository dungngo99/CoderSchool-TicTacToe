import React, { Component } from 'react';
import './App.css'

import Board from './components/Board'
import {Button} from 'react-bootstrap'

export default class App extends Component {
  constructor() {
    super()

    this.players = { 'X': "O", 'O': "X" }

    this.state = {
      userName: 'Dungngo',
      nextPlayer: 'X',
      array: Array(9).fill(null),
      hasEnd: false,
      winner: '',
      histories: [Array(9).fill(null)],
      cursor: 0,
    }
  }

  calculateWinner() {
    let cases = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

    for (let i = 0; i < cases.length; i++) {
      let [a, b, c] = cases[i]

      if (this.state.array[a] && this.state.array[a] === this.state.array[b] && this.state.array[b] === this.state.array[c]) {
        this.setState({ ...this.state, hasEnd: true, winner: this.players[this.state.nextPlayer] })
      }
    }
  }

  componentDidUpdate() {
    if (this.state.hasEnd) return

    // console.log(this.state.cursor)
    this.calculateWinner()
  }

  render() {
    return (
      <div className='main-section row'>
        <div className='dn-game col-md-6'>
          <h1>Tic tac toe</h1>
          <h3>My game</h3>
          <h4>{`Who has won? ${this.state.winner}`}</h4>
          <h4>{`Next player: ${this.state.nextPlayer}`}</h4>
          <Board parent={this}></Board>
        </div>

        <div className='dn-history-areas col-md-6'>
          {this.state.histories.map((item, index) => {
            return <Button className='dn-state-btn' onClick={() => this.setState({...this.state, cursor:index})}>{index===0 ? "Go to game start" : `Go to move ${index}`}</Button>
          })
          }
        </div>
      </div>
    );
  }
}
