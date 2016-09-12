// @flow

import React from 'react'
import { useStrict } from 'mobx'
import ReactDOM from 'react-dom'
import DevTool from 'mobx-react-devtools'
import { watchHistory } from 'mobx-store'
import createHashHistory from 'history/lib/createHashHistory'
import { Router, Route, useRouterHistory } from 'react-router'

import Home from './components/Home'
import MapPicker from './components/MapPicker'

useStrict(true)
watchHistory()

function App() {
  return (
    <Router history={useRouterHistory(createHashHistory)({ queryKey: false })}>
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
