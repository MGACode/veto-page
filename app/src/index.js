// @flow

import './style.css'
import React from 'react'
import ReactDOM from 'react-dom'
import mobxstore from 'mobx-store'
import { Provider } from 'mobx-react'
import App from './components/App'

// Setup store
const store = mobxstore({
  maps: [
    { name: 'Hideout', image: 'http://i.imgur.com/RwEDe4g.png', team: '', type: '' },
    { name: 'Battlegrounds', image: 'http://i.imgur.com/RKse50K.png', team: '', type: '' },
    { name: 'Cove', image: 'http://i.imgur.com/hZJpmzJ.png', team: '', type: '' },
    { name: 'Hillside', image: 'http://i.imgur.com/lkZTlsz.png', team: '', type: '' },
    { name: 'Outpost', image: 'http://i.imgur.com/9g4ulbt.png', team: '', type: '' },
    { name: 'Stoneshill', image: 'http://i.imgur.com/eVTjMom.png', team: '', type: '' },
    { name: 'Darkforest', image: 'http://i.imgur.com/NBZyfBa.png', team: '', type: '' }
  ], ui: {
    team1: 'Team 1',
    team2: 'Team 2',
    counter: 0
  }
})

// Render application
ReactDOM.render(
  <div className="ui container">
    <Provider store={store}>
      <App />
    </Provider>
  </div>,
  document.getElementById('root')
)
