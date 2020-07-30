import React, { Component } from 'react'
import { Table } from 'react-bootstrap'

export default class MyTable extends Component {
  render() {
    let data = this.props.data.items
    let explored = []
    
    return (
      <Table striped bordered hover style={{'color':'white', }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {
            data.map((item, index) => {
              if (item.player.length >= 50) return ''
              if (explored.includes(item.player)) return ''

              explored.push(item.player)
              return (
                <tr key={`table-row-${index}`}>
                  <td>{index+1}</td>
                  <td key={item.player}>{item.player}</td>
                  <td key={item.score}>{item.score}</td>
                </tr>
              )
            })
          }
        </tbody>

      </Table>
    )
  }
}
