open Wonka;
open Wonka_types;

type event('action) =
  | Do('action)
  | Await(sourceT('action));

type reducer('state, 'action) = (. 'state, 'action) => 'state;

type dispatch('state, 'action) = operatorT(event('action), 'state);

[@genType]
let reduce =
    (reducer: reducer('state, 'action), initialState)
    : dispatch('state, 'action) =>
  curry(source =>
    source
    |> mergeMap((. event) =>
         switch (event) {
         | Do(action) => fromValue(action)
         | Await(source) => source
         }
       )
    |> scan(reducer, initialState)
  );

[@genType]
let toAction = action => Do(action);

[@genType]
let makeAction = action => action |> toAction |> fromValue;

[@genType]
let toActions = actions => actions |> Js.Array.map(toAction);

[@genType]
let makeActions = actions => actions |> toActions |> fromArray;

[@genType]
let toAsyncAction = source => Await(source);

[@genType]
let makeAsyncAction = source => source |> toAsyncAction |> fromValue;

[@genType]
let toAsyncActions = sources => sources |> Js.Array.map(toAsyncAction);

[@genType]
let makeAsyncActions = sources => sources |> toAsyncActions |> fromArray;

[@genType]
let toPromiseAction = promise => Await(promise |> fromPromise);

[@genType]
let makePromiseAction = promise => promise |> toPromiseAction |> fromValue;

[@genType]
let toPromiseActions = promises => promises |> Js.Array.map(toPromiseAction);

[@genType]
let makePromiseActions = promises => promises |> toPromiseActions |> fromArray;

[@genType]
let default = reduce;
