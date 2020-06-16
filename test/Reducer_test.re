open Jest;
open Reducer;
open Wonka;

type action =
  | Increment
  | Double
  | Square;

type state = {count: int};

[@bs.send] external call: ((. 'a) => 'b, 'c, 'a) => 'b = "call";
let call = (self, arg) => call(self, (), arg);

describe("Reducer", () => {
  open ExpectJs;
  open Js.Promise;

  let reducer =
    (. state, action) =>
      switch (action) {
      | Increment => {count: state.count + 1}
      | Double => {count: state.count * 2}
      | Square => {count: state.count * state.count}
      };

  describe("reduce()", () => {
    test("creates a dispatcher that handles events", () => {
      let state = {count: 1};

      let dispatch = reduce(reducer, state);

      let result = Do(Increment) |> fromValue |> dispatch |> toArray;

      expect(result) |> toEqual([|{count: 2}|]);
    });

    testPromise("creates a dispatcher that handles async events", () => {
      let state = {count: 1};

      let dispatch = reduce(reducer, state);

      let expectResult = result =>
        expect(result) |> toEqual({count: 2}) |> Js.Promise.resolve;

      Await(fromValue(Double))
      |> fromValue
      |> dispatch
      |> toPromise
      |> then_(expectResult);
    });

    testPromise("creates a dispatcher that handles promised events", () => {
      let state = {count: 2};

      let dispatch = reduce(reducer, state);

      let expectResult = result =>
        expect(result) |> toEqual({count: 4}) |> Js.Promise.resolve;

      Await(fromPromise(Js.Promise.resolve(Double)))
      |> fromValue
      |> dispatch
      |> toPromise
      |> then_(expectResult);
    });

    test("handles multiple events", () => {
      let state = {count: 1};

      let dispatch = reduce(reducer, state);

      let result =
        [|Do(Increment), Do(Increment), Do(Increment)|]
        |> fromArray
        |> dispatch
        |> toArray;

      expect(result) |> toEqual([|{count: 2}, {count: 3}, {count: 4}|]);
    });

    testPromise("handles multiple async events", () => {
      let state = {count: 1};

      let dispatch = reduce(reducer, state);

      let mock = JestJs.inferred_fn();
      let fn = MockJs.fn(mock);

      let expectCalls = _ => {
        mock
        |> MockJs.calls
        |> expect
        |> toEqual([|{count: 2}, {count: 4}, {count: 8}|])
        |> Js.Promise.resolve;
      };

      [|
        Await(fromValue(Double)),
        Await(fromValue(Double)),
        Await(fromValue(Double)),
      |]
      |> fromArray
      |> dispatch
      |> onPush((. event) => event |> call(fn) |> ignore)
      |> toPromise
      |> then_(expectCalls);
    });

    testPromise("handles multiple promised events", () => {
      let state = {count: 2};

      let dispatch = reduce(reducer, state);

      let mock = JestJs.inferred_fn();
      let fn = MockJs.fn(mock);

      let expectCalls = _ => {
        mock
        |> MockJs.calls
        |> expect
        |> toEqual([|{count: 4}, {count: 16}, {count: 256}|])
        |> Js.Promise.resolve;
      };

      [|
        Await(fromPromise(Js.Promise.resolve(Square))),
        Await(fromPromise(Js.Promise.resolve(Square))),
        Await(fromPromise(Js.Promise.resolve(Square))),
      |]
      |> fromArray
      |> dispatch
      |> onPush((. event) => event |> call(fn) |> ignore)
      |> toPromise
      |> then_(expectCalls);
    });
  });
});
