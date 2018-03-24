# slh

Store like in [Hyperapp](https://github.com/hyperapp/hyperapp)

Interface of slh store looks as redux store.

## API

`createStore(state, actions)`
* @param {Object} state - initial state
* @param {Object} actions - keyvalue object where value is action function
* @returns {Store} - created store that have methods subscribe(listener), actions and getState()

## Example

```js
import { createStore } from 'slh'

const sleep = sec => new Promise(resolve => { setTimeout(resolve, sec * 1000) })

const store = createStore(
  { count: 0 },
  {
    increase: () => (state, actions) => ({
      count: state.count + 1
    }),
    decrease: () => (state, actions) => ({
      count: state.count - 1
    }),
    increaseLater: () => (state, actions) => {
      setTimeout(() => {
        actions.increase()
      }, 1000)
    },
    decreaseLater: () => async (state, actions) => {
      await sleep(1)
      actions.decrease()
    }
  }
)

const unsubscribe = store.subscribe(() => {
  console.log(store.getState())
})

// > store.actions
// > { increase: Function, decrease: Function, increaseLater: Function, decreaseLater: Function }
// > store.actions.increase()
// > console.log(store.getState())
// > { count: 1 }
```
