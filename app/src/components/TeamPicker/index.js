// @flow

import React from 'react'
import { action } from 'mobx'
import { partial } from 'lodash'
import { inject, observer } from 'mobx-react'

function TeamPicker({ store }) {
  const ui = store('ui')

  return (
    <div className="ui three column centered grid">
      <div className="ui inverted horizontal divider">Enter Team Names</div>
      <div className="ui column input">
        <input
          value={ui.get('team1')}
          onChange={action('Change "Team 1" name', partial(update, 'team1'))}
        />
      </div>
      <div className="column">
        <button className="ui inverted basic button" onClick={function() {
          if (store.canUndo('ui')) store.undo('ui')
          if (store.canUndo('maps')) store.undo('maps')
        }}>Undo</button>
      </div>
      <div className="ui column input">
        <input
          value={ui.get('team2')}
          onChange={action('Change "Team 2" name', partial(update, 'team2'))}
        />
      </div>
    </div>
  )

  function update(team, event) {
    ui.set(team, event.target.value)
  }
}

export default inject('store')(observer(TeamPicker))
