import React, { Component } from 'react';
import './App.css'
import Board from './components/Board'
import { Button } from 'react-bootstrap'
import FbBtn from './components/FbBtn'
import MyTable from './components/MyTable'

const TIME_OUT = 30
let t = null
let timer_is_on = false

export default class App extends Component {
  constructor() {
    super()
    this.size = 10
    this.playerChoices = this.setChoices()

    this.state = {
      userName: '',
      hasSignIn: 'Nah',
      array: Array(Math.pow(this.size, 2)).fill(null),
      hasEnd: true,
      winner: '',
      histories: [Array(Math.pow(this.size, 2)).fill(null)],
      cursor: 0,
      pplData: null,
      timeout: TIME_OUT,
      gameState: 'get Ready'
    }
  }

  setChoices() {
    let table = Array(Math.pow(this.size, 2))
    for (let i = 0; i < table.length; i++) {
      if (i % 2 === 0) table[i] = 'X'
      else table[i] = 'O'
    }

    return table
  }

  calculateWinner() {
    let array = this.state.array

    if (array.every((item) => item !== null)) {
      this.setState({ ...this.state, hasEnd: true, winner: "Tie game" })
      this.resetGame()
    }

    for (let i = 0; i < Math.pow(this.size, 2); i++) {
      let cell = array[i]
      if (cell === null) continue

      let cases = [
        [i - 2, i - 1, i, i + 1, i + 2],
        [i - 2 * this.size, i - this.size, i, i + this.size, i + 2 * this.size],
        [i-2*(this.size+1), i-(this.size+1), i, i+(this.size+1), i+2*(this.size+1)],
        [i-2*(this.size-1), i-(this.size-1), i, i+(this.size-1), i+2*(this.size-1)]
      ]

      for (let j=0; j< cases.length; j++){
        let [a,b,c,d,e] = cases[j]
        if (array[a] && array[a] === array[b] && array[a] === array[c] && array[a] === array[d] && array[a] === array[e]){
          this.setState({ ...this.state, hasEnd: true, winner: this.playerChoices[this.state.cursor - 1] })
          this.resetGame()
        }
      }
    }
  }

  componentDidUpdate() {
    if (this.state.hasEnd) return

    this.calculateWinner()
  }

  async resetGame() {
    timer_is_on = false

    await this.countDown(5)

    this.postAPI()

    this.setState({
      ...this.state, histories: [Array(Math.pow(this.size, 2)).fill(null)],
      winner: '', array: Array(Math.pow(this.size, 2)).fill(null),
      cursor: 0, hasEnd: true, timeout: TIME_OUT, gameState: 'get Ready'
    })
  }

  timeCount() {
    if (!timer_is_on) return

    if (this.state.timeout === 0) {
      this.resetGame()
      return
    }

    this.setState({ ...this.state, timeout: this.state.timeout - 1, hasEnd: false, gameState: 'Playing' })
    t = setTimeout(this.timeCount.bind(this), 1000)
  }

  start() {
    if (!timer_is_on) {
      timer_is_on = true
      this.fetchAPI()
      this.timeCount()
    }
  }

  pause() {
    clearTimeout(t)
    timer_is_on = false
    this.setState({ ...this.state, hasEnd: true })
  }

  sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds))
  }

  async countDown(time) {
    document.getElementById('start-btn').disabled = true
    document.getElementById('pause-btn').disabled = true

    for (let i = time; i >= 0; i--) {
      await this.sleep(1000)
      this.setState({ ...this.state, gameState: `Game over - reset in ${i}s`, hasEnd: true })
    }

    document.getElementById('start-btn').disabled = false
    document.getElementById('pause-btn').disabled = false
  }

  async postAPI() {
    let data = new URLSearchParams();
    data.append("player", this.state.userName);
    data.append("score", this.state.timeout);
    
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`;

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString(),
      json: true
    });
  }

  async fetchAPI() {
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`
    let response = await fetch(url, { limit: 20 })
    let data = await response.json()
    this.setState({ ...this.state, pplData: data })
  }

  render() {
    if (this.state.userName === '') return <FbBtn parent={this} />

    return (
      <div className='main-section'>

        <div className='container row dn-game'>

          <div className='dn-game col-md-5'>
            <h1>Tic tac toe</h1>
            <p>User signed in? {this.state.hasSignIn}</p>
            <p>Welcome to TicTacToe, {this.state.userName}</p>
            <h4>{`Who has won? ${this.state.winner}`}</h4>
            <h4>{`Next player: ${this.playerChoices[this.state.cursor]}`}</h4>
            <p>{`${this.state.timeout}s - ${this.state.gameState}`}</p>

            <Board parent={this}></Board>
            <Button id={'start-btn'} onClick={() => this.start()}>Start</Button>
            <Button id={'pause-btn'} onClick={() => this.pause()}>Pause</Button>
          </div>

          <div className='dn-history-wrapper col-md-2'>
            <div className='dn-history-areas'>
              {this.state.histories.map((item, index) => {
                let display = index === 0 ? "Go to game start" : `Go to move ${index}`

                return (
                  <Button
                    key={`btn-${index}`}
                    className='dn-state-btn btn-sm btn-outline-danger'
                    onClick={() => this.setState({ ...this.state, cursor: index })}>
                    {display}
                  </Button>)
              })
              }
            </div>
          </div>

          <div className='dn-table col-md-5'>
            <h2>Score board</h2><hr />
            {this.state.pplData === null ?
              <p>Click start to see score-board</p> :
              <MyTable data={this.state.pplData}></MyTable>
            }
          </div>

        </div>

      </div>
    );
  }
}
