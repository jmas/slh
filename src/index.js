function createStore(state, actions) {
  var listeners = []
  var wiredActions = wireActions(actions, setState, getState)
  state = clone({}, state)

  function clone(target, source) {
    var out = {}
    for (var i in target) out[i] = target[i]
    for (var i in source) out[i] = source[i]
    return out
  }

  function subscribe(listener) {
    var index = listeners.push(listener) - 1
    return function() {
      listeners[index] = null
    }
  }

  function notify() {
    listeners.forEach(listener => (listener ? listener() : null))
  }

  function getState() {
    return state
  }

  function setState(newState) {
    state = clone(state, newState)
  }

  function wireActions(actions, setState, getState) {
    return Object.keys(actions).reduce(function(wiredActions, actionName) {
      if (typeof actions[actionName] === "function") {
        wiredActions[actionName] = function() {
          var actionResult = actions[actionName].apply(
            null,
            Array.prototype.slice.call(arguments)
          )
          if (typeof actionResult === "function") {
            actionResult = actionResult(getState(), wiredActions)
          }
          if (actionResult && !actionResult.then && actionResult !== state) {
            setState(actionResult)
            notify()
          }
          return actionResult
        }
      } else {
        wiredActions[actionName] = wireActions(
          actions[actionName],
          function(newState) {
            var state = {}
            state[actionName] = clone(getState()[actionName], newState)
            setState(state)
          },
          function() {
            return getState()[actionName]
          }
        )
      }
      return wiredActions
    }, {})
  }

  return {
    actions: wiredActions,
    getState: getState,
    subscribe: subscribe
  }
}

module.exports = {
  createStore: createStore
}
