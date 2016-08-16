// @flow

import React from 'react'

const maps = [
  { name: 'Hideout', image: 'http://i.imgur.com/RwEDe4g.png' },
  { name: 'Battlegrounds', image: 'http://i.imgur.com/RKse50K.png' },
  { name: 'Cove', image: 'http://i.imgur.com/hZJpmzJ.png' },
  { name: 'Hillside', image: 'http://i.imgur.com/lkZTlsz.png' },
  { name: 'Outpost', image: 'http://i.imgur.com/9g4ulbt.png' },
  { name: 'Stoneshill', image: 'http://i.imgur.com/eVTjMom.png' },
  { name: 'Darkforest', image: 'http://i.imgur.com/NBZyfBa.png' }
]

export default function Maps() {
  return (
    <div className="ui three column grid">
      {maps.map(({ name, image }) =>
        <div key={name} style={{ backgroundImage: `url(${image})` }} className="map-panel default">
          <div className="team-name"></div>
          <div className="map-name">{name}</div>
          <div className="status"></div>
        </div>)}
    </div>
  )
}
