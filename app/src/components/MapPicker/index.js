// @flow

import { partial } from 'lodash'
import io from 'socket.io-client'
import { remove } from 'lodash/fp'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { action, autorun, computed, observable } from 'mobx'
import styles from './styles'

// Websocket connection
const socket = io('localhost:3000')

// Data
const COUNTER_MAX = 5
const statusTypes = ['Ban', 'Ban', 'Pick', 'Pick']
const mapPool = [
  { name: 'Hideout', image: 'http://i.imgur.com/RwEDe4g.png', team: 0, type: '' },
  { name: 'Battlegrounds', image: 'http://i.imgur.com/RKse50K.png', team: 0, type: '' },
  { name: 'Cove', image: 'http://i.imgur.com/hZJpmzJ.png', team: 0, type: '' },
  { name: 'Hillside', image: 'http://i.imgur.com/lkZTlsz.png', team: 0, type: '' },
  { name: 'Outpost', image: 'http://i.imgur.com/9g4ulbt.png', team: 0, type: '' },
  { name: 'Stoneshill', image: 'http://i.imgur.com/eVTjMom.png', team: 0, type: '' },
  { name: 'Darkforest', image: 'http://i.imgur.com/NBZyfBa.png', team: 0, type: '' }
]

@observer
export default class MapPicker extends Component {
  constructor(props) {
    super(props)

    autorun(() => {
      if (this.changed) {
        this.changed = false
        return
      }
      socket.emit('data', {
        maps: this.maps,
        team1: this.team1,
        team2: this.team2,
        counter: this.counter,
        remaining: this.remaining
      })
    })

    socket.on('data', action('Receive changes', (data) => {
      this.changed = true
      this.maps = data.maps
      this.team1 = data.team1
      this.team2 = data.team2
      this.counter = data.counter
      this.remaining = data.remaining
    }))
  }

  changed = true;
  @observable counter = 0;
  @observable maps = mapPool;
  @observable team1 = 'Team 1';
  @observable team2 = 'Team 2';
  @observable remaining = [...Array(mapPool.length).keys()];

  @action update = (team, event) => {
    this[team] = event.target.value
  }

  @action select = (index) => {
    const map = this.maps[index]

    if (map.team) return
    if (this.counter > COUNTER_MAX) return

    const subset = remove((x) => x === index)(this.remaining)

    this.maps[index].type = statusTypes[this.counter % 4]
    this.maps[index].team = this.counter % 2 === 0 ? 1 : 2

    if (subset.length === 1) {
      const idx = subset[0]
      this.maps[idx].team = 3
      this.maps[idx].type = 'Random'
    }

    this.remaining = subset
    this.counter = this.counter + 1
  }

  team = (team) => computed(() => {
    switch (team) {
    case 0: return ''
    case 1: return this.team1
    case 2: return this.team2
    case 3: return 'Random'
    default: return 'default'
    }
  })

  teamClass = (team) => {
    switch (team) {
    case 0: return 'default'
    case 1: return 'team-1'
    case 2: return 'team-2'
    case 3: return 'random'
    default: return 'default'
    }
  }

  render() {
    const updateTeam1 = action('Change "Team 1" name', partial(this.update, 'team1'))
    const updateTeam2 = action('Change "Team 2" name', partial(this.update, 'team2'))

    return (
      <div>
        <div className="ui three column centered grid">
          <div className="ui inverted horizontal divider">Enter Team Names</div>
          <div className="ui column input">
            <input value={this.team1} onChange={updateTeam1} />
          </div>
          <div className="column"></div>
          <div className="ui column input">
            <input value={this.team2} onChange={updateTeam2} />
          </div>
        </div>
        <div className="ui inverted horizontal divider">Pick Maps</div>
        <div className="ui centered three column grid">
          {this.maps.map((map, index) =>
            <div className="column" key={map.name} onClick={action('select', partial(this.select, index))}>
              <div
                style={{ backgroundImage: `url(${map.image})` }}
                className={`${styles.mapPanel} ${this.teamClass(map.team)}`}
              >
                <div className={styles.mapName}>{map.name}</div>
                <div>{this.team(map.team).get()}</div>
                <div className={`${styles[map.type.toLowerCase()]} ${styles.status}`}>{map.type}</div>
              </div>
            </div>)
          }
        </div>
      </div>
    )
  }
}
