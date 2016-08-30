// @flow

import { action, observable } from 'mobx'

export function fromPromise(promise: Promise<*>): IFromPromise {
  const value = observable(null)
  const state = observable('pending')

  promise
    .then(action('Resolve promise', function(res: any) {
      value.set(res)
      state.set('resolved')
      return res
    }))
    .catch(action('Reject promise', function(err: any) {
      value.set(err)
      state.set('rejected')
      return Promise.reject(err)
    }))

  return {
    promise,
    value: () => value.get(),
    state: () => state.get()
  }
}
