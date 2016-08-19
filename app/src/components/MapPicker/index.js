// @flow

import React, { Component } from 'react'
import { partial } from 'lodash'
import { remove } from 'lodash/fp'
import { action, autorun, computed, observable } from 'mobx'
import { observer } from 'mobx-react'
import c from './styles'

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

@observer
export default class MapPicker extends Component {
  constructor(props) {
    super(props)
    autorun(() => {
      console.log(this.maps)
      console.log(this.team1)
      console.log(this.team2)
      console.log(this.counter)
      console.log(this.remaining)
    })
  }

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
    this.maps[index].team = this.counter % 2 === 0
      ? computed(() => this.team1)
      : computed(() => this.team2)

    if (subset.length === 1) {
      const idx = subset[0]
      this.maps[idx].type = 'Random'
      this.maps[idx].team = computed(() => 'Random')
    }

    this.remaining = subset
    this.counter = this.counter + 1
  }

  teamClass = (team) => {
    switch (team) {
    case '': return 'default'
    case this.team1: return 'team-1'
    case this.team2: return 'team-2'
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
              value={this.team1}
              onChange={action('Change "Team 1" name', partial(this.update, 'team1'))}
            />
          </div>
          <div className="column"></div>
          <div className="ui column input">
            <input
              value={this.team2}
              onChange={action('Change "Team 2" name', partial(this.update, 'team2'))}
            />
          </div>
        </div>
        <div className="ui inverted horizontal divider">Pick Maps</div>
        <div className="ui centered three column grid">
          {this.maps.map((map, index) =>
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
