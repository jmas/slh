var assert = require('assert')
var createStore = require('../src/index').createStore

var counterState = { count: 0 }
var counterActions = {
  increase: function() {
    return function(state) {
      return {
        count: state.count + 1
      }
    }
  },
  decrease: function() {
    return function(state) {
      return {
        count: state.count - 1
      }
    }
  }
}

describe('store = createStore(counterState, counterActions)', function() {
  var store
  beforeEach(function() {
    store = createStore(counterState, counterActions)
  })
  it('store.getState()', function() {
    assert.deepEqual(store.getState(), counterState)
  })
  it('store.subscribe()', function(done) {
    store.subscribe(function() {
      done()
    })
    store.actions.increase()
  })
  it('store.unsubscribe()', function() {
    var unsubscribe = store.subscribe(function() {
      assert.fail('unsubscribe() do not remove store listener')
    })
    unsubscribe()
    store.actions.increase()
  })
  it('store.actions', function() {
    store.actions.increase()
    assert.deepEqual(store.getState(), { count: 1 })
    store.actions.decrease()
    assert.deepEqual(store.getState(), { count: 0 })
  })
})

describe('store = createStore(<nested state>, <nested actions>)', function() {
  var store
  beforeEach(function() {
    var actions = {}
    actions.a = counterActions
    actions.b = counterActions
    actions.increase = counterActions.increase
    actions.decrease = counterActions.decrease
    store = createStore(
      {
        a: counterState,
        b: counterState,
        count: 0
      },
      actions
    )
  })
  it('store.getState()', function() {
    assert.deepEqual(store.getState(), {
      a: { count: 0 },
      b: { count: 0 },
      count: 0
    })
  })
  it('store.actions', function() {
    store.actions.a.increase()
    assert.deepEqual(store.getState(), {
      a: { count: 1 },
      b: { count: 0 },
      count: 0
    })
    store.actions.b.increase()
    assert.deepEqual(store.getState(), {
      a: { count: 1 },
      b: { count: 1 },
      count: 0
    })
    store.actions.a.decrease()
    assert.deepEqual(store.getState(), {
      a: { count: 0 },
      b: { count: 1 },
      count: 0
    })
    store.actions.b.decrease()
    assert.deepEqual(store.getState(), {
      a: { count: 0 },
      b: { count: 0 },
      count: 0
    })
    store.actions.increase()
    assert.deepEqual(store.getState(), {
      a: { count: 0 },
      b: { count: 0 },
      count: 1
    })
    store.actions.decrease()
    assert.deepEqual(store.getState(), {
      a: { count: 0 },
      b: { count: 0 },
      count: 0
    })
  })
})
