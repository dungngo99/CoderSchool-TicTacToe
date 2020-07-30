import React, { Component } from 'react'
import Square from './Square'

export default class Board extends Component {
  constructor(props) {
    super(props)
    this.computerTurn = false
  }

  selectSquare(id) {
    //Get the array and curPlayer
    let array = this.props.parent.state.array
    let players = this.props.parent.playerChoices
    let histories = this.props.parent.state.histories
    let cursor = this.props.parent.state.cursor

    //If a Square is already clicked or the game is over, return immediately
    if (this.props.parent.state.hasEnd) return

    if (cursor === histories.length - 1) {
      array = JSON.parse(JSON.stringify(array))
      if (array[id] !== null) return
    } else {
      array = JSON.parse(JSON.stringify(histories[cursor]))
      if (array[id] !== null) return
      else histories = histories.slice(0, cursor + 1)
    }

    //Update value
    array[id] = players[histories.length - 1]
    histories.push(array)

    //Make the next turn for computer to be true if the clicked Square is "X"
    if (array[id] === 'X') this.computerTurn = true

    //Update the current player and array for parent App
    this.props.parent.setState({
      ...this.props.parent.state, array: array, histories: histories, cursor: histories.length - 1
    })
  }

  sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds))
  }

  componentDidMount() {
    document.getElementById('dn-board').addEventListener('click', async () => {
      await this.sleep(100)

      if (this.computerTurn) {
        let latest = this.props.parent.state.array
        let size = this.props.parent.size
        
        let playerChoices = Object.keys(latest).filter((i) => latest[i] === 'X')
        let computerChoices = []

        for (let i=0; i<playerChoices.length; i++){
          let playerI = playerChoices[i]
          let choices = [
            playerI-(size+1), playerI-size, playerI-(size-1), 
            playerI-1, playerI+1, 
            playerI+(size-1), playerI+size, playerI+(size+1)
          ]

          for (let j=0; j<choices.length; j++){
            if (latest[choices[j]] !== null) continue
            else computerChoices.push(choices[j])
          }
        }

        let random = Math.floor(Math.random() * computerChoices.length)
        let nextId = computerChoices[random]

        this.computerTurn = false
        this.selectSquare(nextId)
      }
    })
  }

  render() {
    let cursor = this.props.parent.state.cursor
    let history = this.props.parent.state.histories[cursor]
    let size = this.props.parent.size

    return (
      <div id='dn-board'>
        {[...Array(size).keys()].map((i) => {
          return (
            <div key={`row-${i}`} style={{ 'display': 'flex' }}>
              {[...Array(size).keys()].map((j) => {
                return (
                  <Square
                    id={i * size + j} key={`cell-${i * size + j}`}
                    selectSquare={this.selectSquare.bind(this)}
                    value={history[i * size + j]}>
                  </Square>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}
