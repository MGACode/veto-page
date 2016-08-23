// @flow

import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import Home from './components/Home'
import MapPicker from './components/MapPicker'

function App() {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={Home} />
      <Route path="/lobby/:id" component={MapPicker} />
    </Router>
  )
}

// Render application
ReactDOM.render(<App />, document.getElementById('root'))
