import {toArray, toPromise, fromValue, onPush, pipe} from 'wonka'

import {
  reduce,
  makeAction,
  makeAsyncAction,
  makePromiseAction,
  makeActions,
  makeAsyncActions,
  makePromiseActions,
} from '../src/Reducer.gen'

describe('Reducer', () => {
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

    it('handles multiple async events', async () => {
      const state = {count: 1}
      const action = {type: Actions.Double}

      const dispatch = reduce(reducer, state)

      const mock = jest.fn()

      await pipe(
        makeAsyncActions([
          fromValue(action),
          fromValue(action),
          fromValue(action),
        ]),
        dispatch,
        onPush(mock),
        toPromise
      )

      expect(mock).toHaveBeenNthCalledWith(1, {count: 2})
      expect(mock).toHaveBeenNthCalledWith(2, {count: 4})
      expect(mock).toHaveBeenNthCalledWith(3, {count: 8})
    })

    it('handles multiple promised events', async () => {
      const state = {
        count: 2,
      }
      const action = {
        type: Actions.Square,
      }

      const dispatch = reduce(reducer, state)

      const mock = jest.fn()

      await pipe(
        makePromiseActions([
          Promise.resolve(action),
          Promise.resolve(action),
          Promise.resolve(action),
        ]),
        dispatch,
        onPush(mock),
        toPromise
      )

      expect(mock).toHaveBeenNthCalledWith(1, {count: 4})
      expect(mock).toHaveBeenNthCalledWith(2, {count: 16})
      expect(mock).toHaveBeenNthCalledWith(3, {count: 256})
    })
  })
})
