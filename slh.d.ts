export as namespace slh

/** The interface for the actions tree implementation.
 *
 * @memberOf [App]
 */
export type ActionsType<State, Actions> = {
  [P in keyof Actions]:
    | ActionType<State, Actions>
    | ActionsType<any, Actions[P]>
}

/** The createStore() create new store.
 *
 * @param state The state object.
 * @param actions The actions object implementation.
 * @returns The new store.
 * @memberOf [App]
 */
export function createStore<State, Actions>(
  state: State,
  actions: ActionsType<State, Actions>,
): Store
