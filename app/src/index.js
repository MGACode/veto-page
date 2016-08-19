// @flow

import './style.css'
import React from 'react'
import ReactDOM from 'react-dom'
import MapPicker from './components/MapPicker'
import io from 'socket.io-client'

// Websocket connection
io('localhost:3000')

// Render application
ReactDOM.render(
  <div className="ui container">
    <MapPicker />
  </div>,
  document.getElementById('root')
)
