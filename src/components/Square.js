import React, { Component } from 'react'


export default class Square extends Component {
  render() {
    return (
      <div className='square' onClick={() => this.props.selectSquare(this.props.id)}>
        <span>{this.props.value}</span>
      </div>
    )
  }
}
