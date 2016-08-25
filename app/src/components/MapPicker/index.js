// @flow

import { spy } from 'mobx'
import { partial } from 'lodash'
import io from 'socket.io-client'
import React, { Component } from 'react'
import { inject, observer, Provider } from 'mobx-react'

import styles from './styles'
import MapStore from '../../stores/MapStore'

@observer
export default class MapPicker extends Component {
  socket: Object;
  killSpy: Function;
  lobbyId: number = this.props.routeParams.id;
  store: MapStore = new MapStore(`${API_BASE_URL}/lobbies/${this.lobbyId}`);

  componentWillMount() {
    this.socket = io(API_BASE_URL.split('/api')[0])
    this.socket.emit('join room', this.lobbyId)
    this.socket.on('data', (data) => Object.assign(this.store, data))

    this.killSpy = spy((change) => {
      if (change.type === 'action' && (change.name === 'update' || change.name === 'select')) {
        setTimeout(() => fetch(`${API_BASE_URL}/lobbies/${this.lobbyId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.store.contents())
        }), 0)
      }
    })
  }

  componentWillUnmount() {
    this.killSpy()
    this.socket.disconnect()
  }

  deleteLobby = () => {
    fetch(`${API_BASE_URL}/lobbies/${this.lobbyId}`, { method: 'DELETE' })
      .then(() => this.props.history.push('/'))
  }

  render() {
    const { team1, team2, update } = this.store

    return (
      <div>
        <h1 className="ui centered inverted header">Map Picker</h1>
        <div className="ui three column centered grid">
          <div className="ui inverted horizontal divider">Enter Team Names</div>
          <div className="ui column input">
            <input value={team1} onChange={partial(update, 'team1')} />
          </div>
          <div className="column">
            <button onClick={this.deleteLobby} className="ui inverted red button">
              Delete Lobby
            </button>
          </div>
          <div className="ui column input">
            <input value={team2} onChange={partial(update, 'team2')} />
          </div>
        </div>
        <div className="ui inverted horizontal divider">Pick Maps</div>
        <Provider store={this.store}>
          <Maps />
        </Provider>
      </div>
    )
  }
}

const Maps = inject('store')(observer(function Maps({ store } : { store: MapStore }) {
  switch (store.presetReq.state()) {
  case 'pending': return <div className="ui inverted header">Loading Maps...</div>
  case 'resolved':
    return (
      <div className="ui centered three column grid">
        {store.maps.map((map, index) =>
          <div key={map.name} className="column">
            <MapElem map={map} index={index} />
          </div>)}
      </div>
    )
  default: return <div className="ui inverted header">Something went wrong!</div>
  }
}))

const MapElem = inject('store')(observer(function MapElem({ map, index, store }) {
  const currentTeam = store.team(map.team).get()
  const background = { backgroundImage: `url(${map.image})` }

  return (
    <div
      style={background}
      className={`${styles.mapPanel} ${teamClass(map.team)}`}
      onClick={partial(store.select, index)}
    >
      <div className={styles.mapName}>{map.name}</div>
      <div>{currentTeam}</div>
      <div className={`${styles[map.type.toLowerCase()]} ${styles.status}`}>{map.type}</div>
    </div>
  )
}))

function teamClass(team) {
  switch (team) {
  case 0: return 'default'
  case 1: return 'team-1'
  case 2: return 'team-2'
  case 3: return 'random'
  default: return 'default'
  }
}
