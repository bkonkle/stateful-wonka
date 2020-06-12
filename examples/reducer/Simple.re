open Wonka;
open Reducer;

type state = {
  name: string,
  count: int,
};

type action =
  | IncrementCount
  | DoubleCount
  | SetCount(int);

let initialState = {name: "Test", count: 0};

let reducer =
  (. state, action) =>
    switch (action) {
    | IncrementCount => {...state, count: state.count + 1}
    | DoubleCount => {...state, count: state.count * 2}
    | SetCount(number) => {...state, count: number}
    };

let dispatch = reduce(reducer, initialState);

let asyncUpdate = () =>
  makeAsyncAction(fromValue(100) |> map((. count) => SetCount(count)));

let promiseUpdate = () =>
  Js.Promise.(
    makePromiseAction(
      resolve(100) |> then_(count => resolve(SetCount(count))),
    )
  );

let sync = makeAction(DoubleCount) |> dispatch;

let async = asyncUpdate() |> dispatch;

let promise = promiseUpdate() |> dispatch;
