// @flow

import React, { Component } from 'react'
import { partial } from 'lodash'
import io from 'socket.io-client'
import { remove } from 'lodash/fp'
import { observer } from 'mobx-react'
import { action, autorun, computed, observable, toJS } from 'mobx'
import c from './styles'

// Websocket connection
const socket = io('localhost:3000')
const COUNTER_MAX = 5
const statusTypes = ['Ban', 'Ban', 'Pick', 'Pick']
const mapPool = [
  { name: 'Hideout', image: 'http://i.imgur.com/RwEDe4g.png', team: '', type: '' },
  { name: 'Battlegrounds', image: 'http://i.imgur.com/RKse50K.png', team: '', type: '' },
  { name: 'Cove', image: 'http://i.imgur.com/hZJpmzJ.png', team: '', type: '' },
  { name: 'Hillside', image: 'http://i.imgur.com/lkZTlsz.png', team: '', type: '' },
  { name: 'Outpost', image: 'http://i.imgur.com/9g4ulbt.png', team: '', type: '' },
  { name: 'Stoneshill', image: 'http://i.imgur.com/eVTjMom.png', team: '', type: '' },
  { name: 'Darkforest', image: 'http://i.imgur.com/NBZyfBa.png', team: '', type: '' }
]

const state = {
  counter: 0,
  maps: mapPool,
  team1: 'Team 1',
  team2: 'Team 2',
  remaining: [...Array(mapPool.length).keys()]
}

@observer
export default class MapPicker extends Component {
  constructor(props) {
    super(props)
    autorun(() => socket.emit('data', toJS(this.status)))
  }

  @observable status = state

  @action update = (team, event) => {
    this.status[team] = event.target.value
  }

  @action select = (index) => {
    const map = this.status.maps[index]

    if (map.team) return
    if (this.status.counter > COUNTER_MAX) return

    const subset = remove((x) => x === index)(this.status.remaining)

    this.status.maps[index].type = statusTypes[this.status.counter % 4]
    this.status.maps[index].team = this.status.counter % 2 === 0
      ? computed(() => this.status.team1)
      : computed(() => this.status.team2)

    if (subset.length === 1) {
      const idx = subset[0]
      this.status.maps[idx].type = 'Random'
      this.status.maps[idx].team = computed(() => 'Random')
    }

    this.status.remaining = subset
    this.status.counter = this.status.counter + 1
  }

  teamClass = (team) => {
    switch (team) {
    case '': return 'default'
    case this.status.team1: return 'team-1'
    case this.status.team2: return 'team-2'
    default: return 'default'
    }
  }

  render() {
    return (
      <div>
        <div className="ui three column centered grid">
          <div className="ui inverted horizontal divider">Enter Team Names</div>
          <div className="ui column input">
            <input
              value={this.status.team1}
              onChange={action('Change "Team 1" name', partial(this.update, 'team1'))}
            />
          </div>
          <div className="column"></div>
          <div className="ui column input">
            <input
              value={this.status.team2}
              onChange={action('Change "Team 2" name', partial(this.update, 'team2'))}
            />
          </div>
        </div>
        <div className="ui inverted horizontal divider">Pick Maps</div>
        <div className="ui centered three column grid">
          {this.status.maps.map((map, index) =>
            <div className="column" key={map.name} onClick={action('select', partial(this.select, index))}>
              <div
                style={{ backgroundImage: `url(${map.image})` }}
                className={`${c.mapPanel} ${this.teamClass(map.team && map.team.get())}`}
              >
                <div className={c.mapName}>{map.name}</div>
                <div>{map.team && map.team.get()}</div>
                <div className={`${c[map.type.toLowerCase()]} ${c.status}`}>{map.type}</div>
              </div>
            </div>)
          }
        </div>
      </div>
    )
  }
}
