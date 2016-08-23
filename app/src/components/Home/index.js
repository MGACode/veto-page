// @flow

import { Link } from 'react-router'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { fromPromise } from '../../utils'
import styles from './styles'

const chivalry = {
  maps: [
    { name: 'Hideout', image: 'http://i.imgur.com/RwEDe4g.png', team: 0, type: '' },
    { name: 'Battlegrounds', image: 'http://i.imgur.com/RKse50K.png', team: 0, type: '' },
    { name: 'Cove', image: 'http://i.imgur.com/hZJpmzJ.png', team: 0, type: '' },
    { name: 'Hillside', image: 'http://i.imgur.com/lkZTlsz.png', team: 0, type: '' },
    { name: 'Outpost', image: 'http://i.imgur.com/9g4ulbt.png', team: 0, type: '' },
    { name: 'Stoneshill', image: 'http://i.imgur.com/eVTjMom.png', team: 0, type: '' },
    { name: 'Darkforest', image: 'http://i.imgur.com/NBZyfBa.png', team: 0, type: '' }
  ],
  counter: 0,
  team1: 'Team 1',
  team2: 'Team 2',
  remaining: [0, 1, 2, 3, 4, 5, 6]
}

@observer
export default class Home extends Component {
  lobbyReq: IFromPromise

  componentWillMount() {
    this.lobbyReq = fromPromise(fetch('http://localhost:3000/api/lobbies').then((res) => res.json()))
  }

  createLobby = () =>
    fetch('http://localhost:3000/api/lobbies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chivalry)
    })
    .then((res) => res.json())
    .then(({ id } : { id: number }) => this.props.history.push(`/lobby/${id}`))


  render() {
    return (
      <div className="ui one column centered padded grid">
        <div className="column">
          <div className="ui horizontal inverted divider">Create a New Lobby</div>
          <button onClick={this.createLobby} className="ui green inverted button">Click Me</button>
        </div>
        <div className="column">
          <div className="ui horizontal inverted divider">Join an Existing Lobby</div>
          <Lobbies lobbyReq={this.lobbyReq} />
        </div>
      </div>
    )
  }
}

const Lobbies = observer(function Lobbies({ lobbyReq }: { lobbyReq: IFromPromise }) {
  switch (lobbyReq.state()) {
  case 'pending':
    return <div className="ui inverted header">Loading...</div>
  case 'resolved':
    const { lobbies } = lobbyReq.value()
    return (
      <div>
        <div className="ui inverted header">Current Lobbies</div>
        <div className="ui three column centered grid">
          {lobbies.length > 0
            ? lobbies.map((x) => <Lobby key={x} number={x} />)
            : <div className="ui inverted header">No existing lobbies!</div>}
        </div>
      </div>
    )
  default:
    return <div className="ui inverted header">Something went wrong!</div>
  }
})

const Lobby = observer(function Lobby({ number }) {
  return (
    <div className="column">
      <Link to={`lobby/${number}`} className={styles.lobby}>
        <div className="ui inverted header">{number}</div>
      </Link>
    </div>
  )
})
