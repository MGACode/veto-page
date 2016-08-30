// @flow

import { remove } from 'lodash/fp'
import { action, computed, observable } from 'mobx'
import { fromPromise } from '../utils'

const COUNTER_MAX = 5
const statusTypes = ['Ban', 'Ban', 'Pick', 'Pick']

export default class MapStore {
  presetReq: IFromPromise;

  constructor(url: string) {
    this.presetReq = fromPromise(fetch(url).then((res) => res.json()))
    this.presetReq.promise
      .then(action('Init store', ({ lobby } : { lobby: MapStore }) => {
        this.maps = lobby.maps
        this.team1 = lobby.team1
        this.team2 = lobby.team2
        this.counter = lobby.counter
        this.remaining = lobby.remaining
      }))
  }

  counter = 0;
  remaining = [];
  @observable maps: any = [];
  @observable team1: any = 'Team 1';
  @observable team2: any = 'Team 2';

  @action select = (index: number) => {
    const map = this.maps[index]

    if (map.team) return
    if (this.counter > COUNTER_MAX) return

    const subset = remove((x) => x === index)(this.remaining)

    this.maps[index].type = statusTypes[this.counter % 4]
    this.maps[index].team = this.counter % 2 === 0 ? 1 : 2

    if (subset.length === 1) {
      const idx = subset[0]
      this.maps[idx].team = 3
      this.maps[idx].type = 'Random'
    }

    this.remaining = subset
    this.counter = this.counter + 1
  }

  @action update = (team: 'team1' | 'team2', event: Object) => {
    // $FlowIgnore
    this[team] = event.target.value
  }

  contents = () => ({
    maps: this.maps,
    team1: this.team1,
    team2: this.team2,
    counter: this.counter,
    remaining: this.remaining
  })

  team = (team: number) => computed(() => {
    switch (team) {
    case 0: return ''
    case 1: return this.team1
    case 2: return this.team2
    case 3: return 'Random'
    default: return 'default'
    }
  })
}
