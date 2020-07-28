import React, { Component } from 'react'
import Square from './Square'

export default class Board extends Component {
  constructor(props) {
    super(props)
    this.nextPlayer = { 'X': 'O', 'O': 'X' }
  }

  selectSquare(id) {
    //Get the array and curPlayer
    let array = JSON.parse(JSON.stringify(this.props.parent.state.array))
    let curPlayer = this.props.parent.state.nextPlayer
    let histories = this.props.parent.state.histories

    //If a Square is already clicked or the game is over, return immediately
    if (array[id] !== null || this.props.parent.state.hasEnd) return

    //Set the current player to this Square
    array[id] = curPlayer === 'X' ? 'X' : "O"

    //Push a new Board object to App history
    histories.push(array)

    //Update the current player and array for parent App
    this.props.parent.setState({ ...this.props.parent.state, array: array, nextPlayer: this.nextPlayer[curPlayer], histories: histories, cursor: histories.length - 1 })
  }

  render() {
    let cursor = this.props.parent.state.cursor
    let history = this.props.parent.state.histories[cursor]

    return (
      <div>
        <div style={{ 'display': 'flex' }}>
          <Square id={0} selectSquare={this.selectSquare.bind(this)} value={history[0]}></Square>
          <Square id={1} selectSquare={this.selectSquare.bind(this)} value={history[1]}></Square>
          <Square id={2} selectSquare={this.selectSquare.bind(this)} value={history[2]}></Square>
        </div>

        <div style={{ 'display': 'flex' }}>
          <Square id={3} selectSquare={this.selectSquare.bind(this)} value={history[3]}></Square>
          <Square id={4} selectSquare={this.selectSquare.bind(this)} value={history[4]}></Square>
          <Square id={5} selectSquare={this.selectSquare.bind(this)} value={history[5]}></Square>
        </div>

        <div style={{ 'display': 'flex' }}>
          <Square id={6} selectSquare={this.selectSquare.bind(this)} value={history[6]}></Square>
          <Square id={7} selectSquare={this.selectSquare.bind(this)} value={history[7]} ></Square>
          <Square id={8} selectSquare={this.selectSquare.bind(this)} value={history[8]}></Square>
        </div>

      </div>
    )
  }
}
