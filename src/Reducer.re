open Wonka;
open Wonka_types;

type state = {
  name: string,
  count: int,
};

type action =
  | IncrementCount
  | DoubleCount
  | SetCount(int);

type event =
  | Do(action)
  | Await(sourceT(action));

let initialState = {name: "Test", count: 0};

let handleEvents =
  mergeMap((. event) =>
    switch (event) {
    | Do(action) => fromValue(action)
    | Await(source) => source
    }
  );

let handleActions = initialState =>
  initialState
  |> scan((. state, event) =>
       switch (event) {
       | IncrementCount => {...state, count: state.count + 1}
       | DoubleCount => {...state, count: state.count * 2}
       | SetCount(number) => {...state, count: number}
       }
     );

let reducer = initialState =>
  curry(source => source |> handleEvents |> handleActions(initialState));

let makeAction = action => fromValue(Do(action));

let makeAsyncAction = source => fromValue(Await(source));

let updateCount = () =>
  makeAsyncAction(
    fromPromise(Js.Promise.resolve(100))
    |> map((. count) => SetCount(count)),
  );

let sync = makeAction(DoubleCount) |> reducer(initialState);

let async = updateCount() |> reducer(initialState);
