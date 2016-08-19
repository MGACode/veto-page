// @flow

import './style.css'
import React from 'react'
import ReactDOM from 'react-dom'
import MapPicker from './components/MapPicker'

// Render application
ReactDOM.render(
  <div className="ui container">
    <MapPicker />
  </div>,
  document.getElementById('root')
)
