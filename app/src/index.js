// @flow

import 'whatwg-fetch'
import React from 'react'
import { useStrict } from 'mobx'
import ReactDOM from 'react-dom'
import DevTool from 'mobx-react-devtools'
import { Router, Route, hashHistory } from 'react-router'

import Home from './components/Home'
import MapPicker from './components/MapPicker'

useStrict(true)

function App() {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={Home} />
      <Route path="/lobby/:id" component={MapPicker} />
    </Router>
  )
}

// Render application
ReactDOM.render(
  <div>
    <App />
    <DevTool />
  </div>,
document.getElementById('root'))
