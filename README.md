# Stateful Wonka

Minimal state management using Wonka's flexible streams.

- When using with ReasonML, you can use ADT's and pattern matching to ensure you are exhuastively handing all possible actions.
- When using with TypeScript, you can still gain strong type-safety by using enum properties on an object instead.

This library is written in [Reason](https://reasonml.github.io/), a dialect of OCaml, and can be used for native applications. It is also compiled using [BuckleScript](https://bucklescript.github.io) to plain JavaScript and has bindings for [TypeScript](https://www.typescriptlang.org/).

This means that out of the box this library is usable in any project that use the following:

- Plain JavaScript
- TypeScript
- Reason/OCaml with BuckleScript
- Reason/OCaml with `bs-native`
- Reason/OCaml with Dune and Esy

## Why?

To take advantage of Wonka's simple stream-based API to handle a variety of different kinds of async actions.

## Installation

In JavaScript or TypeScript:

```sh
yarn install stateful-wonka
```

To use with Reason/OCaml with BuckleScript, add it to your `bsconfig.json`:

```json
{
  // ...
  "bs-dependencies": ["wonka", "stateful-wonka"]
  // ...
}
```

## Usage

### Reducer

#### ReasonML

With ReasonML, you can use ADT's to eliminate the need for action types.

First, define a type to represent your state:

```re
type state = {count: int}
```

Define an action type:

```re
type action =
  | Increment
  | Double
  | Square;
```

Create your reducer:

```re
let reducer =
  (. state, action) =>
    switch (action) {
    | Increment => {count: state.count + 1}
    | Double => {count: state.count * 2}
    | Square => {count: state.count * state.count}
    };
```

To use it, create a dispatcher:

```re
open StatefulWonka.Reducer;

let dispatch = reduce(reducer, initialState);
```

The dispatcher is a Wonka [Operator](https://wonka.kitten.sh/api/operators), and it can be subscribed to using any kind of [Sink](https://wonka.kitten.sh/api/sinks).

```re
open StatefulWonka.Reducer;
open Wonka;

makeAsyncAction(getItemFromApi)
|> dispatch
|> map(addItemToItems)
|> toPromise;
```

#### TypeScript

First, define a type to represent your state:

```ts
interface State = {count: number}
```

Then, define your action types enum:

```ts
enum Actions {
  Increment,
  Double,
  Square,
}
```

Define an action type:

```ts
interface Action = {type: Actions}
```

Finally, create your reducer:

```ts
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
```

To use it, create a dispatcher:

```ts
import {reduce} from 'stateful-wonka'

const dispatch = reduce(reducer, initialState)
```

The dispatcher is a Wonka [Operator](https://wonka.kitten.sh/api/operators), and it can be subscribed to using any kind of [Sink](https://wonka.kitten.sh/api/sinks).

```ts
await pipe(
  makePromiseAction(getItemFromApi),
  dispatch,
  map(addItemToItems),
  toPromise
)
```
