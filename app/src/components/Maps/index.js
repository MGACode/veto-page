// @flow

import React from 'react'
import { action, computed } from 'mobx'
import { partial } from 'lodash'
import { inject, observer } from 'mobx-react'
import c from './styles'

const COUNTER_MAX = 5
const statusTypes = ['Ban', 'Ban', 'Pick', 'Pick']

function Maps({ store }) {
  const ui = store('ui')
  const maps = store('maps')

  return (
    <div>
      <div className="ui inverted horizontal divider">Pick Maps</div>
      <div className="ui centered three column grid">
        {maps.map((map, index) =>
          <div className="column" key={map.name} onClick={action('select', partial(select, index))}>
            <div
              style={{ backgroundImage: `url(${map.image})` }}
              className={`${c.mapPanel} ${teamClass(map.team && map.team.get())}`}
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

  function select(index) {
    const map = maps[index]
    const counter = ui.get('counter')

    if (map.team) return
    if (counter > COUNTER_MAX) return

    maps[index] = {
      ...map,
      ...{
        type: statusTypes[counter % 4],
        team: counter % 2 === 0
          ? computed(() => ui.get('team1'))
          : computed(() => ui.get('team2'))
      }
    }
    
    ui.set('counter', counter + 1)
  }

  function teamClass(team) {
    switch (team) {
    case '': return 'default'
    case ui.get('team1'): return 'team-1'
    case ui.get('team2'): return 'team-2'
    default: return 'default'
    }
  }
}

export default inject('store')(observer(Maps))
