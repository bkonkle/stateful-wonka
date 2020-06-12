import {toArray, toPromise, fromValue, pipe} from 'wonka'

import {
  reduce,
  makeAction,
  makeAsyncAction,
  makePromiseAction,
  makeActions,
  makeAsyncActions,
  makePromiseActions,
} from '../Reducer.gen'

describe('Reducer', () => {
  const identity = <State>(state: State) => state

  describe('makeAction()', () => {
    it('creates a synchronous action', () => {
      const action = {type: 'TEST'}
      const dispatch = reduce(identity, action)

      const [result] = pipe(makeAction(action), dispatch, toArray)

      expect(result).toEqual(action)
    })
  })

  describe('makeAsyncAction()', () => {
    it('creates an async action from a Wonka source', async () => {
      const action = {type: 'TEST'}
      const dispatch = reduce(identity, action)

      const result = await pipe(
        makeAsyncAction(fromValue(action)),
        dispatch,
        toPromise
      )

      expect(result).toEqual(action)
    })
  })

  describe('makePromiseAction()', () => {
    it('creates an async action from a Promise', async () => {
      const action = {type: 'TEST'}
      const dispatch = reduce(identity, action)

      const result = await pipe(
        makePromiseAction(Promise.resolve(action)),
        dispatch,
        toPromise
      )

      expect(result).toEqual(action)
    })
  })

  describe('reduce()', () => {
    enum Actions {
      Increment = 'Increment',
      Double = 'Double',
      Square = 'Square',
    }

    type State = {count: number}
    type Action = {type: Actions}

    const reducer = (state: State, action: Action) => {
      switch (action.type) {
        case Actions.Increment:
          return {...state, count: state.count + 1}
        case Actions.Double:
          return {...state, count: state.count * 2}
        case Actions.Square:
          return {...state, count: state.count * state.count}
        default:
          return state
      }
    }

    it('creates a dispatcher that handles events', () => {
      const state = {count: 1}
      const action = {type: Actions.Increment}

      const dispatch = reduce(reducer, state)

      const [result] = pipe(makeAction(action), dispatch, toArray)

      expect(result).toEqual({count: 2})
    })

    it('creates a dispatcher that handles async events', async () => {
      const state = {count: 1}
      const action = {type: Actions.Double}

      const dispatch = reduce(reducer, state)

      const result = await pipe(
        makeAsyncAction(fromValue(action)),
        dispatch,
        toPromise
      )

      expect(result).toEqual({count: 2})
    })

    it('creates a dispatcher that handles promised events', async () => {
      const state = {count: 2}
      const action = {type: Actions.Square}

      const dispatch = reduce(reducer, state)

      const result = await pipe(
        makePromiseAction(Promise.resolve(action)),
        dispatch,
        toPromise
      )

      expect(result).toEqual({count: 4})
    })

    it('handles multiple events', () => {
      const state = {count: 1}
      const action = {type: Actions.Increment}

      const dispatch = reduce(reducer, state)

      const result = pipe(
        makeActions([action, action, action]),
        dispatch,
        toArray
      )

      expect(result).toEqual([{count: 2}, {count: 3}, {count: 4}])
    })

    it('handles multiple async events', () => {
      const state = {count: 1}
      const action = {type: Actions.Double}

      const dispatch = reduce(reducer, state)

      const result = pipe(
        makeAsyncActions([
          fromValue(action),
          fromValue(action),
          fromValue(action),
        ]),
        dispatch,
        toArray
      )

      expect(result).toEqual([{count: 2}, {count: 4}, {count: 8}])
    })

    it('handles multiple promised events', async () => {
      const state = {count: 1}
      const action = {type: Actions.Square}

      const dispatch = reduce(reducer, state)

      const result = pipe(
        makePromiseActions([
          Promise.resolve(action),
          Promise.resolve(action),
          Promise.resolve(action),
        ]),
        dispatch,
        toArray
      )

      expect(result).toEqual([{count: 2}, {count: 4}, {count: 8}])
    })
  })
})
