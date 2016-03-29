/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(1);
	var abyssa_1 = __webpack_require__(12);
	var dompteuse_1 = __webpack_require__(2);
	var snabbdom_1 = __webpack_require__(22);
	var app_1 = __webpack_require__(29);
	var action_1 = __webpack_require__(30);
	var store_1 = __webpack_require__(40);
	var router = abyssa_1.Router({
	    app: abyssa_1.State('', {}, {
	        index: abyssa_1.State('', {}),
	        blue: abyssa_1.State('blue/:id', {}, {
	            green: abyssa_1.State('green', {}),
	            red: abyssa_1.State('red', {})
	        })
	    })
	})
	    .on('ended', action_1.routeChanged)
	    .configure({ urlSync: 'hash' })
	    .init();
	dompteuse_1.startApp({ app: app_1.default, store: store_1.default, patch: snabbdom_1.default, elm: document.body });


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var dompteuse_1 = __webpack_require__(2);
	var fluxx_1 = __webpack_require__(8);
	fluxx_1.Store.log = true;
	dompteuse_1.Render.log = true;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.Render = exports.startApp = exports.component = undefined;
	
	var _render = __webpack_require__(3);
	
	var _render2 = _interopRequireDefault(_render);
	
	var _component = __webpack_require__(7);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function startApp(_ref) {
	  var app = _ref.app;
	  var patch = _ref.patch;
	  var elm = _ref.elm;
	
	  _render2.default.patch = patch;
	
	  // Non destructive patching inside the passed element
	  var elmToReplace = document.createElement('div');
	  var newVnode = patch(elmToReplace, app);
	
	  elm.appendChild(newVnode.elm);
	}
	
	exports.component = _component2.default;
	exports.startApp = startApp;
	exports.Render = _render2.default;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.renderComponent = renderComponent;
	exports.renderComponentNow = renderComponentNow;
	
	var _h = __webpack_require__(4);
	
	var _h2 = _interopRequireDefault(_h);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var componentsToRender = [];
	var rendering = false;
	var nextRender = void 0;
	
	var Render = { patch: undefined, log: false };
	exports.default = Render;
	function renderComponent(component) {
	  if (rendering) {
	    console.warn('A component tried to re-render while a rendering was already ongoing', component.elm);
	    return;
	  }
	
	  // This component is already scheduled for the next redraw.
	  // For instance, this can easily happen while the app's tab is inactive.
	  // Avoids doing more work than necessary when re-activating it.
	  if (componentsToRender.indexOf(component) !== -1) return;
	
	  componentsToRender.push(component);
	
	  if (!nextRender) nextRender = requestAnimationFrame(renderNow);
	};
	
	function renderComponentNow(component) {
	  var id = component.id;
	  var localState = component.localState;
	  var actions = component.actions;
	  var props = component.props;
	  var state = component.state;
	  var elm = component.elm;
	  var render = component.render;
	  var vnode = component.vnode;
	  var destroyed = component.destroyed;
	
	  // Bail if the component is already destroyed.
	  // This can happen if the parent renders first and decide a child component should be removed.
	
	  if (destroyed) return;
	
	  var patch = Render.patch;
	  var log = Render.log;
	
	
	  var beforeRender = void 0;
	
	  if (log) beforeRender = performance.now();
	  var newVnode = render({ props: props, state: state, localState: localState, actions: actions });
	
	  patch(vnode || elm, newVnode);
	
	  if (log) console.log('Render component \'' + component.key + '\'', performance.now() - beforeRender + ' ms', component);
	
	  component.onRender(component, newVnode);
	}
	
	function renderNow() {
	  rendering = true;
	
	  var components = componentsToRender;
	
	  nextRender = undefined;
	  componentsToRender = [];
	
	  if (Render.log) console.log('%cNew rendering frame', 'color: orange');
	
	  // Render components in a top-down fashion.
	  // This ensures the rendering order is predictive and props & states are consistent.
	  components.sort(function (compA, compB) {
	    return compA.depth - compB.depth;
	  });
	  components.forEach(renderComponentNow);
	
	  rendering = false;
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var VNode = __webpack_require__(5);
	var is = __webpack_require__(6);
	
	function addNS(data, children) {
	  data.ns = 'http://www.w3.org/2000/svg';
	  if (children !== undefined) {
	    for (var i = 0; i < children.length; ++i) {
	      addNS(children[i].data, children[i].children);
	    }
	  }
	}
	
	module.exports = function h(sel, b, c) {
	  var data = {}, children, text, i;
	  if (arguments.length === 3) {
	    data = b;
	    if (is.array(c)) { children = c; }
	    else if (is.primitive(c)) { text = c; }
	  } else if (arguments.length === 2) {
	    if (is.array(b)) { children = b; }
	    else if (is.primitive(b)) { text = b; }
	    else { data = b; }
	  }
	  if (is.array(children)) {
	    for (i = 0; i < children.length; ++i) {
	      if (is.primitive(children[i])) children[i] = VNode(undefined, undefined, undefined, children[i]);
	    }
	  }
	  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
	    addNS(data, children);
	  }
	  return VNode(sel, data, children, text, undefined);
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(sel, data, children, text, elm) {
	  var key = data === undefined ? undefined : data.key;
	  return {sel: sel, data: data, children: children,
	          text: text, elm: elm, key: key};
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
	  array: Array.isArray,
	  primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = component;
	
	var _h = __webpack_require__(4);
	
	var _h2 = _interopRequireDefault(_h);
	
	var _fluxx = __webpack_require__(8);
	
	var _render = __webpack_require__(3);
	
	var _shallowEqual = __webpack_require__(11);
	
	var _shallowEqual2 = _interopRequireDefault(_shallowEqual);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var empty = {};
	
	function component(options) {
	  var key = options.key;
	  var _options$props = options.props;
	  var props = _options$props === undefined ? empty : _options$props;
	  var pullState = options.pullState;
	  var localStore = options.localStore;
	  var render = options.render;
	  var hook = options.hook;
	
	
	  var compProps = {
	    key: key,
	    hook: { create: create, insert: insert, postpatch: postpatch, destroy: destroy },
	    component: { props: props, pullState: pullState, localStoreFn: localStore, render: render, key: key }
	  };
	
	  return (0, _h2.default)('div', compProps);
	};
	
	function create(_, vnode) {
	  var component = vnode.data.component;
	  var props = component.props;
	  var pullState = component.pullState;
	  var localStoreFn = component.localStoreFn;
	
	  // This component pulls state from the global store
	
	  if (pullState) {
	    var store = (0, _fluxx.globalStore)();
	    component.unsubFromStores = store.subscribe(function (state) {
	      return onGlobalStoreChange(component, state);
	    });
	    component.state = pullState(store.state);
	  }
	
	  // This component maintains local state
	  if (localStoreFn) {
	    (function () {
	      var localStore = localStoreFn(props);
	      var store = localStore.store;
	      var actions = localStore.actions;
	
	
	      Object.keys(actions).forEach(function (name) {
	        return actions[name]._store = store;
	      });
	
	      var unsubFromGlobalStore = component.unsubFromStores;
	      var unsubFromLocalStore = store.subscribe(function (state) {
	        return onLocalStoreChange(component, state);
	      });
	
	      component.unsubFromStores = function () {
	        unsubFromLocalStore();
	        if (unsubFromGlobalStore) unsubFromGlobalStore();
	      };
	
	      component.actions = actions;
	      component.localState = store.state;
	    })();
	  }
	
	  component.elm = vnode.elm;
	  component.onRender = onRender;
	  component.placeholder = vnode;
	
	  // Create and insert the component's content
	  // while its parent is still unattached for better perfs.
	  (0, _render.renderComponentNow)(component);
	
	  // Swap the fake/cheap div placeholder's elm with the proper elm that has just been created.
	  component.placeholder.elm = component.vnode.elm;
	}
	
	// Store the component depth once it's attached to the DOM so we can render
	// component hierarchies in a predictive manner.
	function insert(vnode) {
	  vnode.data.component.depth = vnode.elm.__depth__ = getDepth(vnode.elm);
	}
	
	// Called on every re-render, this is where the props passed by the component's parent may have changed.
	function postpatch(oldVnode, vnode) {
	  var oldData = oldVnode.data;
	  var newData = vnode.data;
	
	  // Pass on the component instance everytime a new Vnode instance is created,
	  // but update any important property that can change over time.
	  var component = oldData.component;
	  component.props = newData.component.props;
	  component.render = newData.component.render;
	  component.placeholder = vnode;
	  newData.component = component;
	
	  // if the props changed, schedule a re-render
	  if (!(0, _shallowEqual2.default)(newData.props, oldData.props)) (0, _render.renderComponent)(component);
	}
	
	function onRender(component, newVnode) {
	  var i = void 0;
	
	  // Store the new vnode inside the component so we can diff it next render
	  component.vnode = newVnode;
	
	  // Lift any 'remove' hook to our placeholder vnode for it to be called
	  // as the placeholder is all our parent vnode knows about.
	  if ((i = newVnode.data.hook) && (i = i.remove)) component.placeholder.data.hook.remove = i;
	}
	
	function destroy(vnode) {
	  var comp = vnode.data.component;
	  comp.unsubFromStores();
	  destroyVnode(comp.vnode);
	  comp.destroyed = true;
	}
	
	function destroyVnode(vnode) {
	  var data = vnode.data;
	
	  if (!data) return;
	  if (data.hook && data.hook.destroy) data.hook.destroy(vnode);
	  // Can't invoke modules' destroy hook as they're hidden in snabbdom's closure
	  if (vnode.children) vnode.children.forEach(destroyVnode);
	  if (data.vnode) destroyVnode(data.vnode);
	}
	
	function onGlobalStoreChange(component, newState) {
	  var oldStateSlice = component.state;
	  var newStateSlice = component.pullState(newState);
	
	  component.state = newStateSlice;
	
	  if (!(0, _shallowEqual2.default)(newStateSlice, oldStateSlice)) (0, _render.renderComponent)(component);
	}
	
	function onLocalStoreChange(component, newState) {
	  component.localState = newState;
	  (0, _render.renderComponent)(component);
	}
	
	function getDepth(elm) {
	  var parent = elm.parentElement;
	
	  while (parent) {
	    if (parent.__depth__ !== undefined) return parent.__depth__ + 1;
	    parent = parent.parentElement;
	  }
	
	  return 0;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.Action = exports.LocalStore = exports.globalStore = exports.GlobalStore = exports.Store = undefined;
	
	var _Action2 = __webpack_require__(9);
	
	var _Action3 = _interopRequireDefault(_Action2);
	
	var _Store2 = __webpack_require__(10);
	
	var _Store3 = _interopRequireDefault(_Store2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Store = exports.Store = _Store3.default;
	var GlobalStore = exports.GlobalStore = _Store2.GlobalStore;
	var globalStore = exports.globalStore = _Store2.globalStore;
	var LocalStore = exports.LocalStore = _Store2.LocalStore;
	var Action = exports.Action = _Action3.default;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = Action;
	
	var _Store = __webpack_require__(10);
	
	var _Store2 = _interopRequireDefault(_Store);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Unique Action ids.
	// This removes the need to provide unique names across the whole application.
	var id = 1;
	
	/**
	* Creates an unique action for a name.
	* The name is only useful for debugging purposes; different actions can have the same name.
	* The returned action function can then be used to dispatch one or more payloads.
	*
	* Ex:
	* var clickThread = Action('clickThread'); // Create the action once
	* clickThread(id); // Dispatch a payload any number of times
	*/
	function Action(name) {
	
	  // The actual action dispatch function
	  function action() {
	    var payloads = [].slice.call(arguments);
	
	    var isGlobalAction = action._store === undefined;
	
	    // Dispatch to our local store if we were given one or default to the global store.
	    var store = isGlobalAction ? (0, _Store.globalStore)() : action._store;
	
	    if (!store) throw new Error('Tried to dispatch an action (' + action._name + ') without an instanciated store');
	
	    if (_Store2.default.log) {
	      var payload = payloads.length > 1 ? payloads : payloads[0];
	      console.log('%c' + action._name, 'color: #F51DE3', 'dispatched with payload ', payload);
	    }
	
	    store._handleAction(action, payloads);
	
	    // Give a chance to all local Stores to react to this global Action
	    if (isGlobalAction) {
	      Object.keys(_Store.localStores).forEach(function (id) {
	        return _Store.localStores[id]._handleAction(action, payloads);
	      });
	    }
	  }
	
	  action._id = id++;
	  action._name = name;
	
	  // Allows Actions to be used as Object keys with the correct behavior
	  action.toString = function () {
	    return action._id;
	  };
	
	  return action;
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports.globalStore = globalStore;
	exports.GlobalStore = GlobalStore;
	exports.LocalStore = LocalStore;
	exports.default = Store;
	
	var _globalStore = undefined;
	function globalStore() {
	  return _globalStore;
	}
	
	var localStoreId = 1;
	var localStores = exports.localStores = {};
	
	function GlobalStore(optionsOrInitialState, registerHandlers) {
	  _globalStore = Store(optionsOrInitialState, registerHandlers, true);
	  return _globalStore;
	}
	
	function LocalStore(optionsOrInitialState, registerHandlers) {
	  return Store(optionsOrInitialState, registerHandlers);
	}
	
	function Store(optionsOrInitialState, registerHandlers, isGlobal) {
	  var _ref = registerHandlers ? {} : optionsOrInitialState;
	
	  var handlers = _ref.handlers;
	
	  var initialState = registerHandlers ? optionsOrInitialState : state;
	  var onHandlers = {};
	
	  var dispatching = false;
	  var callbacks = [];
	
	  var instance = { state: initialState };
	
	  if (!isGlobal) {
	    instance.id = localStoreId++;
	    localStores[instance.id] = instance;
	  }
	
	  // on(action, callback) registration style
	  if (registerHandlers) {
	    var on = function on(action, fn) {
	      onHandlers[action] = fn;
	    };
	    registerHandlers(on);
	  }
	
	  if (Store.log) console.log('%cInitial state:', 'color: green', initialState);
	
	  instance._handleAction = function (action, payloads) {
	    if (dispatching) throw new Error('Cannot dispatch an Action in the middle of another Action\'s dispatch');
	
	    // Bail fast if this store isn't interested.
	    var handler = handlers ? handlers[action._id] : onHandlers[action._id];
	    if (!handler) return;
	
	    dispatching = true;
	
	    var previousState = instance.state;
	
	    try {
	      instance.state = handlers ? handler.apply(null, [instance.state].concat(payloads)) : handler(instance.state, payloads[0]);
	    } finally {
	      if (Store.log) {
	        var storeKind = isGlobal ? 'global' : 'local';
	        console.log('%cNew ' + storeKind + ' state:', 'color: blue', instance.state);
	      }
	
	      dispatching = false;
	    }
	
	    if (previousState !== instance.state) callbacks.forEach(function (callback) {
	      return callback(instance.state);
	    });
	  };
	
	  instance.subscribe = function (callback) {
	    callbacks.push(callback);
	
	    return function unsubscribe() {
	      callbacks = callbacks.filter(function (_callback) {
	        return _callback !== callback;
	      });
	      if (!isGlobal && callbacks.length === 0) delete localStores[instance.id];
	    };
	  };
	
	  return instance;
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.default = shallowEqual;
	
	/* Efficient shallow comparison of two objects */
	
	function shallowEqual(objA, objB) {
	  if (objA === objB) return true;
	
	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);
	
	  // Test for A's keys different from B's.
	  for (var i = 0; i < keysA.length; i++) {
	    if (objA[keysA[i]] !== objB[keysA[i]]) return false;
	  }
	
	  // Test for B's keys different from A's.
	  // Handles the case where B has a property that A doesn't.
	  for (var i = 0; i < keysB.length; i++) {
	    if (objA[keysB[i]] !== objB[keysB[i]]) return false;
	  }
	
	  return true;
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';
	
	var util = __webpack_require__(13);
	
	var Abyssa = {
	  Router: __webpack_require__(14),
	  api: __webpack_require__(20),
	  async: __webpack_require__(21),
	  State: util.stateShorthand,
	
	  _util: util
	};
	
	module.exports = Abyssa;

/***/ },
/* 13 */
/***/ function(module, exports) {

	
	'use strict';
	
	var util = {};
	
	util.noop = function () {};
	
	util.arrayToObject = function (array) {
	  return array.reduce(function (obj, item) {
	    obj[item] = 1;
	    return obj;
	  }, {});
	};
	
	util.objectToArray = function (obj) {
	  var array = [];
	  for (var key in obj) {
	    array.push(obj[key]);
	  }return array;
	};
	
	util.copyObject = function (obj) {
	  var copy = {};
	  for (var key in obj) {
	    copy[key] = obj[key];
	  }return copy;
	};
	
	util.mergeObjects = function (to, from) {
	  for (var key in from) {
	    to[key] = from[key];
	  }return to;
	};
	
	util.mapValues = function (obj, fn) {
	  var result = {};
	  for (var key in obj) {
	    result[key] = fn(obj[key]);
	  }
	  return result;
	};
	
	/*
	* Return the set of all the keys that changed (either added, removed or modified).
	*/
	util.objectDiff = function (obj1, obj2) {
	  var update = {},
	      enter = {},
	      exit = {},
	      all = {},
	      name,
	      obj1 = obj1 || {};
	
	  for (name in obj1) {
	    if (!(name in obj2)) exit[name] = all[name] = true;else if (obj1[name] != obj2[name]) update[name] = all[name] = true;
	  }
	
	  for (name in obj2) {
	    if (!(name in obj1)) enter[name] = all[name] = true;
	  }
	
	  return { all: all, update: update, enter: enter, exit: exit };
	};
	
	util.makeMessage = function () {
	  var message = arguments[0],
	      tokens = Array.prototype.slice.call(arguments, 1);
	
	  for (var i = 0, l = tokens.length; i < l; i++) {
	    message = message.replace('{' + i + '}', tokens[i]);
	  }return message;
	};
	
	util.parsePaths = function (path) {
	  return path.split('/').filter(function (str) {
	    return str.length;
	  }).map(function (str) {
	    return decodeURIComponent(str);
	  });
	};
	
	util.parseQueryParams = function (query) {
	  return query ? query.split('&').reduce(function (res, paramValue) {
	    var pv = paramValue.split('=');
	    res[pv[0]] = decodeURIComponent(pv[1]);
	    return res;
	  }, {}) : {};
	};
	
	var LEADING_SLASHES = /^\/+/;
	var TRAILING_SLASHES = /^([^?]*?)\/+$/;
	var TRAILING_SLASHES_BEFORE_QUERY = /\/+\?/;
	util.normalizePathQuery = function (pathQuery) {
	  return '/' + pathQuery.replace(LEADING_SLASHES, '').replace(TRAILING_SLASHES, '$1').replace(TRAILING_SLASHES_BEFORE_QUERY, '?');
	};
	
	util.stateShorthand = function (uri, options, children) {
	  return util.mergeObjects({ uri: uri, children: children || {} }, options);
	};
	
	module.exports = util;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var EventEmitter = __webpack_require__(15),
	    interceptAnchors = __webpack_require__(16),
	    StateWithParams = __webpack_require__(17),
	    Transition = __webpack_require__(18),
	    util = __webpack_require__(13),
	    State = __webpack_require__(19),
	    api = __webpack_require__(20);
	
	/*
	* Create a new Router instance, passing any state defined declaratively.
	* More states can be added using addState().
	*
	* Because a router manages global state (the URL), only one instance of Router
	* should be used inside an application.
	*/
	function Router(declarativeStates) {
	  var router = {},
	      states = stateTrees(declarativeStates),
	      firstTransition = true,
	      options = {
	    enableLogs: false,
	    interceptAnchors: true,
	    notFound: null,
	    urlSync: 'history',
	    hashPrefix: ''
	  },
	      ignoreNextURLChange = false,
	      currentPathQuery,
	      currentParamsDiff = {},
	      currentState,
	      previousState,
	      transition,
	      leafStates,
	      urlChanged,
	      initialized,
	      hashSlashString;
	
	  /*
	  * Setting a new state will start a transition from the current state to the target state.
	  * A successful transition will result in the URL being changed.
	  * A failed transition will leave the router in its current state.
	  */
	  function setState(state, params, acc) {
	    var fromState = transition ? StateWithParams(transition.currentState, transition.toParams) : currentState;
	
	    var toState = StateWithParams(state, params);
	    var diff = util.objectDiff(fromState && fromState.params, params);
	
	    if (preventTransition(fromState, toState, diff)) {
	      if (transition && transition.exiting) cancelTransition();
	      return;
	    }
	
	    if (transition) cancelTransition();
	
	    // While the transition is running, any code asking the router about the previous/current state should
	    // get the end result state.
	    previousState = currentState;
	    currentState = toState;
	    currentParamsDiff = diff;
	
	    transition = Transition(fromState, toState, diff, acc, router, logger);
	
	    startingTransition(fromState, toState);
	
	    // In case of a redirect() called from 'startingTransition', the transition already ended.
	    if (transition) transition.run();
	
	    // In case of a redirect() called from the transition itself, the transition already ended
	    if (transition) {
	      if (transition.cancelled) currentState = fromState;else endingTransition(fromState, toState);
	    }
	
	    transition = null;
	  }
	
	  function cancelTransition() {
	    logger.log('Cancelling existing transition from {0} to {1}', transition.from, transition.to);
	
	    transition.cancel();
	
	    firstTransition = false;
	  }
	
	  function startingTransition(fromState, toState) {
	    logger.log('Starting transition from {0} to {1}', fromState, toState);
	
	    var from = fromState ? fromState.asPublic : null;
	    var to = toState.asPublic;
	
	    router.transition.emit('started', to, from);
	  }
	
	  function endingTransition(fromState, toState) {
	    if (!urlChanged && !firstTransition) {
	      logger.log('Updating URL: {0}', currentPathQuery);
	      updateURLFromState(currentPathQuery, document.title, currentPathQuery);
	    }
	
	    firstTransition = false;
	
	    logger.log('Transition from {0} to {1} ended', fromState, toState);
	
	    toState.state.lastParams = toState.params;
	
	    var from = fromState ? fromState.asPublic : null;
	    var to = toState.asPublic;
	    router.transition.emit('ended', to, from);
	  }
	
	  function updateURLFromState(state, title, url) {
	    if (isHashMode()) {
	      ignoreNextURLChange = true;
	      location.hash = options.hashPrefix + url;
	    } else history.pushState(state, title, url);
	  }
	
	  /*
	  * Return whether the passed state is the same as the current one;
	  * in which case the router can ignore the change.
	  */
	  function preventTransition(current, newState, diff) {
	    if (!current) return false;
	
	    return newState.state == current.state && Object.keys(diff.all).length == 0;
	  }
	
	  /*
	  * The state wasn't found;
	  * Transition to the 'notFound' state if the developer specified it or else throw an error.
	  */
	  function notFound(state) {
	    logger.log('State not found: {0}', state);
	
	    if (options.notFound) return setState(leafStates[options.notFound], {});else throw new Error('State "' + state + '" could not be found');
	  }
	
	  /*
	  * Configure the router before its initialization.
	  * The available options are:
	  *   enableLogs: Whether (debug and error) console logs should be enabled. Defaults to false.
	  *   interceptAnchors: Whether anchor mousedown/clicks should be intercepted and trigger a state change. Defaults to true.
	  *   notFound: The State to enter when no state matching the current path query or name could be found. Defaults to null.
	  *   urlSync: How should the router maintain the current state and the url in sync. Defaults to true (history API).
	  *   hashPrefix: Customize the hash separator. Set to '!' in order to have a hashbang like '/#!/'. Defaults to empty string.
	  */
	  function configure(withOptions) {
	    util.mergeObjects(options, withOptions);
	    return router;
	  }
	
	  /*
	  * Initialize the router.
	  * The router will immediately initiate a transition to, in order of priority:
	  * 1) The init state passed as an argument
	  * 2) The state captured by the current URL
	  */
	  function init(initState, initParams) {
	    if (options.enableLogs) Router.enableLogs();
	
	    if (options.interceptAnchors) interceptAnchors(router);
	
	    hashSlashString = '#' + options.hashPrefix + '/';
	
	    logger.log('Router init');
	
	    initStates();
	    logStateTree();
	
	    initState = initState !== undefined ? initState : urlPathQuery();
	
	    logger.log('Initializing to state {0}', initState || '""');
	    transitionTo(initState, initParams);
	
	    listenToURLChanges();
	
	    initialized = true;
	    return router;
	  }
	
	  /*
	  * Remove any possibility of side effect this router instance might cause.
	  * Used for testing purposes.
	  */
	  function terminate() {
	    window.onhashchange = null;
	    window.onpopstate = null;
	  }
	
	  function listenToURLChanges() {
	
	    function onURLChange(evt) {
	      if (ignoreNextURLChange) {
	        ignoreNextURLChange = false;
	        return;
	      }
	
	      var newState = evt.state || urlPathQuery();
	
	      logger.log('URL changed: {0}', newState);
	      urlChanged = true;
	      setStateForPathQuery(newState);
	    }
	
	    window[isHashMode() ? 'onhashchange' : 'onpopstate'] = onURLChange;
	  }
	
	  function initStates() {
	    var stateArray = util.objectToArray(states);
	
	    addDefaultStates(stateArray);
	
	    eachRootState(function (name, state) {
	      state.init(router, name);
	    });
	
	    assertPathUniqueness(stateArray);
	
	    leafStates = registerLeafStates(stateArray, {});
	
	    assertNoAmbiguousPaths();
	  }
	
	  function assertPathUniqueness(states) {
	    var paths = {};
	
	    states.forEach(function (state) {
	      if (paths[state.path]) {
	        var fullPaths = states.map(function (s) {
	          return s.fullPath() || 'empty';
	        });
	        throw new Error('Two sibling states have the same path (' + fullPaths + ')');
	      }
	
	      paths[state.path] = 1;
	      assertPathUniqueness(state.children);
	    });
	  }
	
	  function assertNoAmbiguousPaths() {
	    var paths = {};
	
	    for (var name in leafStates) {
	      var path = util.normalizePathQuery(leafStates[name].fullPath());
	      if (paths[path]) throw new Error('Ambiguous state paths: ' + path);
	      paths[path] = 1;
	    }
	  }
	
	  function addDefaultStates(states) {
	    states.forEach(function (state) {
	      var children = util.objectToArray(state.states);
	
	      // This is a parent state: Add a default state to it if there isn't already one
	      if (children.length) {
	        addDefaultStates(children);
	
	        var hasDefaultState = children.reduce(function (result, state) {
	          return state.path == '' || result;
	        }, false);
	
	        if (hasDefaultState) return;
	
	        var defaultState = State({ uri: '' });
	        state.states._default_ = defaultState;
	      }
	    });
	  }
	
	  function eachRootState(callback) {
	    for (var name in states) {
	      callback(name, states[name]);
	    }
	  }
	
	  function registerLeafStates(states, leafStates) {
	    return states.reduce(function (leafStates, state) {
	      if (state.children.length) return registerLeafStates(state.children, leafStates);else {
	        leafStates[state.fullName] = state;
	        state.paths = util.parsePaths(state.fullPath());
	        return leafStates;
	      }
	    }, leafStates);
	  }
	
	  /*
	  * Request a programmatic state change.
	  *
	  * Two notations are supported:
	  * transitionTo('my.target.state', {id: 33, filter: 'desc'})
	  * transitionTo('target/33?filter=desc')
	  */
	  function transitionTo(pathQueryOrName) {
	    var name = leafStates[pathQueryOrName];
	    var params = (name ? arguments[1] : null) || {};
	    var acc = name ? arguments[2] : arguments[1];
	
	    logger.log('Changing state to {0}', pathQueryOrName || '""');
	
	    urlChanged = false;
	
	    if (name) setStateByName(name, params, acc);else setStateForPathQuery(pathQueryOrName, acc);
	  }
	
	  /*
	  * Attempt to navigate to 'stateName' with its previous params or
	  * fallback to the defaultParams parameter if the state was never entered.
	  */
	  function backTo(stateName, defaultParams, acc) {
	    var params = leafStates[stateName].lastParams || defaultParams;
	    transitionTo(stateName, params, acc);
	  }
	
	  function setStateForPathQuery(pathQuery, acc) {
	    var state, params, _state, _params;
	
	    currentPathQuery = util.normalizePathQuery(pathQuery);
	
	    var pq = currentPathQuery.split('?');
	    var path = pq[0];
	    var query = pq[1];
	    var paths = util.parsePaths(path);
	    var queryParams = util.parseQueryParams(query);
	
	    for (var name in leafStates) {
	      _state = leafStates[name];
	      _params = _state.matches(paths);
	
	      if (_params) {
	        state = _state;
	        params = util.mergeObjects(_params, queryParams);
	        break;
	      }
	    }
	
	    if (state) setState(state, params, acc);else notFound(currentPathQuery);
	  }
	
	  function setStateByName(name, params, acc) {
	    var state = leafStates[name];
	
	    if (!state) return notFound(name);
	
	    var pathQuery = interpolate(state, params);
	    setStateForPathQuery(pathQuery, acc);
	  }
	
	  /*
	  * Add a new root state to the router.
	  * The name must be unique among root states.
	  */
	  function addState(name, state) {
	    if (states[name]) throw new Error('A state already exist in the router with the name ' + name);
	
	    state = stateTree(state);
	
	    states[name] = state;
	
	    if (initialized) {
	      state.init(router, name);
	      registerLeafStates({ _: state });
	    }
	
	    return router;
	  }
	
	  /*
	  * Read the path/query from the URL.
	  */
	  function urlPathQuery() {
	    var hashSlash = location.href.indexOf(hashSlashString);
	    var pathQuery;
	
	    if (hashSlash > -1) pathQuery = location.href.slice(hashSlash + hashSlashString.length);else if (isHashMode()) pathQuery = '/';else pathQuery = (location.pathname + location.search).slice(1);
	
	    return util.normalizePathQuery(pathQuery);
	  }
	
	  function isHashMode() {
	    return options.urlSync == 'hash';
	  }
	
	  /*
	  * Compute a link that can be used in anchors' href attributes
	  * from a state name and a list of params, a.k.a reverse routing.
	  */
	  function link(stateName, params) {
	    var state = leafStates[stateName];
	    if (!state) throw new Error('Cannot find state ' + stateName);
	
	    var interpolated = interpolate(state, params);
	    var uri = util.normalizePathQuery(interpolated);
	
	    return isHashMode() ? '#' + options.hashPrefix + uri : uri;
	  }
	
	  function interpolate(state, params) {
	    var encodedParams = {};
	
	    for (var key in params) {
	      encodedParams[key] = encodeURIComponent(params[key]);
	    }
	
	    return state.interpolate(encodedParams);
	  }
	
	  /*
	  * Returns an object representing the current state of the router.
	  */
	  function getCurrent() {
	    return currentState && currentState.asPublic;
	  }
	
	  /*
	  * Returns an object representing the previous state of the router
	  * or null if the router is still in its initial state.
	  */
	  function getPrevious() {
	    return previousState && previousState.asPublic;
	  }
	
	  /*
	  * Returns the diff between the current params and the previous ones.
	  */
	  function getParamsDiff() {
	    return currentParamsDiff;
	  }
	
	  function allStatesRec(states, acc) {
	    acc.push.apply(acc, states);
	    states.forEach(function (state) {
	      return allStatesRec(state.children, acc);
	    });
	    return acc;
	  }
	
	  function allStates() {
	    return allStatesRec(util.objectToArray(states), []);
	  }
	
	  /*
	  * Returns the state object that was built with the given options object or that has the given fullName.
	  * Returns undefined if the state doesn't exist.
	  */
	  function findState(by) {
	    var filterFn = (typeof by === 'undefined' ? 'undefined' : _typeof(by)) === 'object' ? function (state) {
	      return by === state.options;
	    } : function (state) {
	      return by === state.fullName;
	    };
	
	    var state = allStates().filter(filterFn)[0];
	    return state && state.asPublic;
	  }
	
	  /*
	  * Returns whether the router is executing its first transition.
	  */
	  function isFirstTransition() {
	    return previousState == null;
	  }
	
	  /* Fluent API alias */
	  function on() {
	    router.transition.on.apply(router.transition, arguments);
	    return router;
	  }
	
	  function stateTrees(states) {
	    return util.mapValues(states, stateTree);
	  }
	
	  /*
	  * Creates an internal State object from a specification POJO.
	  */
	  function stateTree(state) {
	    if (state.children) state.children = stateTrees(state.children);
	    return State(state);
	  }
	
	  function logStateTree() {
	    if (!logger.enabled) return;
	
	    var indent = function indent(level) {
	      if (level == 0) return '';
	      return new Array(2 + (level - 1) * 4).join(' ') + '── ';
	    };
	
	    var stateTree = function stateTree(state) {
	      var path = util.normalizePathQuery(state.fullPath());
	      var pathStr = state.children.length == 0 ? ' (@ path)'.replace('path', path) : '';
	      var str = indent(state.parents.length) + state.name + pathStr + '\n';
	      return str + state.children.map(stateTree).join('');
	    };
	
	    var msg = '\nState tree\n\n';
	    msg += util.objectToArray(states).map(stateTree).join('');
	    msg += '\n';
	
	    logger.log(msg);
	  }
	
	  // Public methods
	
	  router.configure = configure;
	  router.init = init;
	  router.transitionTo = transitionTo;
	  router.backTo = backTo;
	  router.addState = addState;
	  router.link = link;
	  router.current = getCurrent;
	  router.previous = getPrevious;
	  router.findState = findState;
	  router.isFirstTransition = isFirstTransition;
	  router.paramsDiff = getParamsDiff;
	  router.options = options;
	
	  router.transition = new EventEmitter();
	  router.on = on;
	
	  // Used for testing purposes only
	  router.urlPathQuery = urlPathQuery;
	  router.terminate = terminate;
	
	  util.mergeObjects(api, router);
	
	  return router;
	}
	
	// Logging
	
	var logger = {
	  log: util.noop,
	  error: util.noop,
	  enabled: false
	};
	
	Router.enableLogs = function () {
	  logger.enabled = true;
	
	  logger.log = function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    var message = util.makeMessage.apply(null, args);
	    console.log(message);
	  };
	
	  logger.error = function () {
	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }
	
	    var message = util.makeMessage.apply(null, args);
	    console.error(message);
	  };
	};
	
	module.exports = Router;

/***/ },
/* 15 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];
	
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 16 */
/***/ function(module, exports) {

	
	'use strict';
	
	var router;
	
	function onMouseDown(evt) {
	  var href = hrefForEvent(evt);
	
	  if (href !== undefined) router.transitionTo(href);
	}
	
	function onMouseClick(evt) {
	  var href = hrefForEvent(evt);
	
	  if (href !== undefined) {
	    evt.preventDefault();
	
	    router.transitionTo(href);
	  }
	}
	
	function hrefForEvent(evt) {
	  if (evt.defaultPrevented || evt.metaKey || evt.ctrlKey || !isLeftButton(evt)) return;
	
	  var target = evt.target;
	  var anchor = anchorTarget(target);
	  if (!anchor) return;
	
	  var dataNav = anchor.getAttribute('data-nav');
	
	  if (dataNav == 'ignore') return;
	  if (evt.type == 'mousedown' && dataNav != 'mousedown') return;
	
	  var href = anchor.getAttribute('href');
	
	  if (!href) return;
	  if (href.charAt(0) == '#') {
	    if (router.options.urlSync != 'hash') return;
	    href = href.slice(1);
	  }
	  if (anchor.getAttribute('target') == '_blank') return;
	  if (!isLocalLink(anchor)) return;
	
	  // At this point, we have a valid href to follow.
	  // Did the navigation already occur on mousedown though?
	  if (evt.type == 'click' && dataNav == 'mousedown') {
	    evt.preventDefault();
	    return;
	  }
	
	  return href;
	}
	
	function isLeftButton(evt) {
	  return evt.which == 1;
	}
	
	function anchorTarget(target) {
	  while (target) {
	    if (target.nodeName == 'A') return target;
	    target = target.parentNode;
	  }
	}
	
	function isLocalLink(anchor) {
	  var hostname = anchor.hostname;
	  var port = anchor.port;
	
	  // IE10 can lose the hostname/port property when setting a relative href from JS
	  if (!hostname) {
	    var tempAnchor = document.createElement("a");
	    tempAnchor.href = anchor.href;
	    hostname = tempAnchor.hostname;
	    port = tempAnchor.port;
	  }
	
	  var sameHostname = hostname == location.hostname;
	  var samePort = (port || '80') == (location.port || '80');
	
	  return sameHostname && samePort;
	}
	
	module.exports = function interceptAnchors(forRouter) {
	  router = forRouter;
	
	  document.addEventListener('mousedown', onMouseDown);
	  document.addEventListener('click', onMouseClick);
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	
	'use strict';
	
	/*
	* Creates a new StateWithParams instance.
	*
	* StateWithParams is the merge between a State object (created and added to the router before init)
	* and params (both path and query params, extracted from the URL after init)
	*
	* This is an internal model; The public model is the asPublic property.
	*/
	
	function StateWithParams(state, params, pathQuery) {
	  return {
	    state: state,
	    params: params,
	    toString: toString,
	    asPublic: makePublicAPI(state, params, pathQuery)
	  };
	}
	
	function makePublicAPI(state, params, pathQuery) {
	
	  /*
	  * Returns whether this state or any of its parents has the given fullName.
	  */
	  function isIn(fullStateName) {
	    var current = state;
	    while (current) {
	      if (current.fullName == fullStateName) return true;
	      current = current.parent;
	    }
	    return false;
	  }
	
	  return {
	    uri: pathQuery,
	    params: params,
	    name: state ? state.name : '',
	    fullName: state ? state.fullName : '',
	    data: state ? state.data : null,
	    isIn: isIn
	  };
	}
	
	function toString() {
	  var name = this.state && this.state.fullName;
	  return name + ':' + JSON.stringify(this.params);
	}
	
	module.exports = StateWithParams;

/***/ },
/* 18 */
/***/ function(module, exports) {

	
	'use strict';
	
	/*
	* Create a new Transition instance.
	*/
	
	function Transition(fromStateWithParams, toStateWithParams, paramsDiff, acc, router, logger) {
	  var root, enters, exits;
	
	  var fromState = fromStateWithParams && fromStateWithParams.state;
	  var toState = toStateWithParams.state;
	  var params = toStateWithParams.params;
	  var isUpdate = fromState == toState;
	
	  var transition = {
	    from: fromState,
	    to: toState,
	    toParams: params,
	    cancel: cancel,
	    cancelled: false,
	    currentState: fromState,
	    run: run
	  };
	
	  // The first transition has no fromState.
	  if (fromState) root = transitionRoot(fromState, toState, isUpdate, paramsDiff);
	
	  var inclusive = !root || isUpdate;
	  exits = fromState ? transitionStates(fromState, root, inclusive) : [];
	  enters = transitionStates(toState, root, inclusive).reverse();
	
	  function run() {
	    startTransition(enters, exits, params, transition, isUpdate, acc, router, logger);
	  }
	
	  function cancel() {
	    transition.cancelled = true;
	  }
	
	  return transition;
	}
	
	function startTransition(enters, exits, params, transition, isUpdate, acc, router, logger) {
	  acc = acc || {};
	
	  transition.exiting = true;
	  exits.forEach(function (state) {
	    if (isUpdate && state.update) return;
	    runStep(state, 'exit', params, transition, acc, router, logger);
	  });
	  transition.exiting = false;
	
	  enters.forEach(function (state) {
	    var fn = isUpdate && state.update ? 'update' : 'enter';
	    runStep(state, fn, params, transition, acc, router, logger);
	  });
	}
	
	function runStep(state, stepFn, params, transition, acc, router, logger) {
	  if (transition.cancelled) return;
	
	  if (logger.enabled) {
	    var capitalizedStep = stepFn[0].toUpperCase() + stepFn.slice(1);
	    logger.log(capitalizedStep + ' ' + state.fullName);
	  }
	
	  var result = state[stepFn](params, acc, router);
	
	  if (transition.cancelled) return;
	
	  transition.currentState = stepFn == 'exit' ? state.parent : state;
	
	  return result;
	}
	
	/*
	* The top-most current state's parent that must be exited.
	*/
	function transitionRoot(fromState, toState, isUpdate, paramsDiff) {
	  var root, parent, param;
	
	  // For a param-only change, the root is the top-most state owning the param(s),
	  if (isUpdate) {
	    [fromState].concat(fromState.parents).reverse().forEach(function (parent) {
	      if (root) return;
	
	      for (param in paramsDiff.all) {
	        if (parent.params[param] || parent.queryParams[param]) {
	          root = parent;
	          break;
	        }
	      }
	    });
	  }
	  // Else, the root is the closest common parent of the two states.
	  else {
	      for (var i = 0; i < fromState.parents.length; i++) {
	        parent = fromState.parents[i];
	        if (toState.parents.indexOf(parent) > -1) {
	          root = parent;
	          break;
	        }
	      }
	    }
	
	  return root;
	}
	
	function transitionStates(state, root, inclusive) {
	  root = root || state.root;
	
	  var p = state.parents,
	      end = Math.min(p.length, p.indexOf(root) + (inclusive ? 1 : 0));
	
	  return [state].concat(p.slice(0, end));
	}
	
	module.exports = Transition;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';
	
	var util = __webpack_require__(13);
	
	var PARAMS = /:[^\\?\/]*/g;
	
	/*
	* Creates a new State instance from a {uri, enter, exit, update, data, children} object.
	* This is the internal representation of a state used by the router.
	*/
	function State(options) {
	  var state = { options: options },
	      states = options.children;
	
	  state.path = pathFromURI(options.uri);
	  state.params = paramsFromURI(options.uri);
	  state.queryParams = queryParamsFromURI(options.uri);
	  state.states = states;
	
	  state.enter = options.enter || util.noop;
	  state.update = options.update;
	  state.exit = options.exit || util.noop;
	
	  state.ownData = options.data || {};
	
	  /*
	  * Initialize and freeze this state.
	  */
	  function init(router, name, parent) {
	    state.router = router;
	    state.name = name;
	    state.isDefault = name == '_default_';
	    state.parent = parent;
	    state.parents = getParents();
	    state.root = state.parent ? state.parents[state.parents.length - 1] : state;
	    state.children = util.objectToArray(states);
	    state.fullName = getFullName();
	    state.asPublic = makePublicAPI();
	
	    eachChildState(function (name, childState) {
	      childState.init(router, name, state);
	    });
	  }
	
	  /*
	  * The full path, composed of all the individual paths of this state and its parents.
	  */
	  function fullPath() {
	    var result = state.path,
	        stateParent = state.parent;
	
	    while (stateParent) {
	      if (stateParent.path) result = stateParent.path + '/' + result;
	      stateParent = stateParent.parent;
	    }
	
	    return result;
	  }
	
	  /*
	  * The list of all parents, starting from the closest ones.
	  */
	  function getParents() {
	    var parents = [],
	        parent = state.parent;
	
	    while (parent) {
	      parents.push(parent);
	      parent = parent.parent;
	    }
	
	    return parents;
	  }
	
	  /*
	  * The fully qualified name of this state.
	  * e.g granparentName.parentName.name
	  */
	  function getFullName() {
	    var result = state.parents.reduceRight(function (acc, parent) {
	      return acc + parent.name + '.';
	    }, '') + state.name;
	
	    return state.isDefault ? result.replace('._default_', '') : result;
	  }
	
	  function allQueryParams() {
	    return state.parents.reduce(function (acc, parent) {
	      return util.mergeObjects(acc, parent.queryParams);
	    }, util.copyObject(state.queryParams));
	  }
	
	  /*
	  * Get or Set some arbitrary data by key on this state.
	  * child states have access to their parents' data.
	  *
	  * This can be useful when using external models/services
	  * as a mean to communicate between states is not desired.
	  */
	  function data(key, value) {
	    if (value !== undefined) {
	      state.ownData[key] = value;
	      return state;
	    }
	
	    var currentState = state;
	
	    while (currentState.ownData[key] === undefined && currentState.parent) {
	      currentState = currentState.parent;
	    }return currentState.ownData[key];
	  }
	
	  function makePublicAPI() {
	    return {
	      name: state.name,
	      fullName: state.fullName,
	      parent: state.parent && state.parent.asPublic,
	      data: data
	    };
	  }
	
	  function eachChildState(callback) {
	    for (var name in states) {
	      callback(name, states[name]);
	    }
	  }
	
	  /*
	  * Returns whether this state matches the passed path Array.
	  * In case of a match, the actual param values are returned.
	  */
	  function matches(paths) {
	    var params = {};
	    var nonRestStatePaths = state.paths.filter(function (p) {
	      return p[p.length - 1] != '*';
	    });
	
	    /* This state has more paths than the passed paths, it cannot be a match */
	    if (nonRestStatePaths.length > paths.length) return false;
	
	    /* Checks if the paths match one by one */
	    for (var i = 0; i < paths.length; i++) {
	      var path = paths[i];
	      var thatPath = state.paths[i];
	
	      /* This state has less paths than the passed paths, it cannot be a match */
	      if (!thatPath) return false;
	
	      var isRest = thatPath[thatPath.length - 1] == '*';
	      if (isRest) {
	        var name = paramName(thatPath);
	        params[name] = paths.slice(i).join('/');
	        return params;
	      }
	
	      var isDynamic = thatPath[0] == ':';
	      if (isDynamic) {
	        var name = paramName(thatPath);
	        params[name] = path;
	      } else if (thatPath != path) return false;
	    }
	
	    return params;
	  }
	
	  /*
	  * Returns a URI built from this state and the passed params.
	  */
	  function interpolate(params) {
	    var path = state.fullPath().replace(PARAMS, function (p) {
	      return params[paramName(p)] || '';
	    });
	
	    var queryParams = allQueryParams();
	    var passedQueryParams = Object.keys(params).filter(function (p) {
	      return queryParams[p];
	    });
	
	    var query = passedQueryParams.map(function (p) {
	      return p + '=' + params[p];
	    }).join('&');
	
	    return path + (query.length ? '?' + query : '');
	  }
	
	  function toString() {
	    return state.fullName;
	  }
	
	  state.init = init;
	  state.fullPath = fullPath;
	  state.allQueryParams = allQueryParams;
	  state.matches = matches;
	  state.interpolate = interpolate;
	  state.data = data;
	  state.toString = toString;
	
	  return state;
	}
	
	function paramName(param) {
	  return param[param.length - 1] == '*' ? param.substr(1).slice(0, -1) : param.substr(1);
	}
	
	function pathFromURI(uri) {
	  return (uri || '').split('?')[0];
	}
	
	function paramsFromURI(uri) {
	  var matches = PARAMS.exec(uri);
	  return matches ? util.arrayToObject(matches.map(paramName)) : {};
	}
	
	function queryParamsFromURI(uri) {
	  var query = (uri || '').split('?')[1];
	  return query ? util.arrayToObject(query.split('&')) : {};
	}
	
	module.exports = State;

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	
	/* Represents the public API of the last instanciated router; Useful to break circular dependencies between router and its states */
	module.exports = {};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var api = __webpack_require__(20);
	
	/* Wraps a thennable/promise and only resolve it if the router didn't transition to another state in the meantime */
	function async(wrapped) {
	  var PromiseImpl = async.Promise || Promise;
	  var fire = true;
	
	  api.transition.once('started', function () {
	    fire = false;
	  });
	
	  var promise = new PromiseImpl(function (resolve, reject) {
	    wrapped.then(function (value) {
	      if (fire) resolve(value);
	    }, function (err) {
	      if (fire) reject(err);
	    });
	  });
	
	  return promise;
	};
	
	module.exports = async;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var snabbdom_1 = __webpack_require__(23);
	var patch = snabbdom_1.init([
	    __webpack_require__(25),
	    __webpack_require__(26),
	    __webpack_require__(27),
	    __webpack_require__(28)
	]);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = patch;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// jshint newcap: false
	/* global require, module, document, Node */
	'use strict';
	
	var VNode = __webpack_require__(5);
	var is = __webpack_require__(6);
	var domApi = __webpack_require__(24);
	
	function isUndef(s) { return s === undefined; }
	function isDef(s) { return s !== undefined; }
	
	var emptyNode = VNode('', {}, [], undefined, undefined);
	
	function sameVnode(vnode1, vnode2) {
	  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
	}
	
	function createKeyToOldIdx(children, beginIdx, endIdx) {
	  var i, map = {}, key;
	  for (i = beginIdx; i <= endIdx; ++i) {
	    key = children[i].key;
	    if (isDef(key)) map[key] = i;
	  }
	  return map;
	}
	
	var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
	
	function init(modules, api) {
	  var i, j, cbs = {};
	
	  if (isUndef(api)) api = domApi;
	
	  for (i = 0; i < hooks.length; ++i) {
	    cbs[hooks[i]] = [];
	    for (j = 0; j < modules.length; ++j) {
	      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
	    }
	  }
	
	  function emptyNodeAt(elm) {
	    return VNode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm);
	  }
	
	  function createRmCb(childElm, listeners) {
	    return function() {
	      if (--listeners === 0) {
	        var parent = api.parentNode(childElm);
	        api.removeChild(parent, childElm);
	      }
	    };
	  }
	
	  function createElm(vnode, insertedVnodeQueue) {
	    var i, thunk, data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode);
	      if (isDef(i = data.vnode)) {
	          thunk = vnode;
	          vnode = i;
	      }
	    }
	    var elm, children = vnode.children, sel = vnode.sel;
	    if (isDef(sel)) {
	      // Parse selector
	      var hashIdx = sel.indexOf('#');
	      var dotIdx = sel.indexOf('.', hashIdx);
	      var hash = hashIdx > 0 ? hashIdx : sel.length;
	      var dot = dotIdx > 0 ? dotIdx : sel.length;
	      var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
	      elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
	                                                          : api.createElement(tag);
	      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
	      if (dotIdx > 0) elm.className = sel.slice(dot+1).replace(/\./g, ' ');
	      if (is.array(children)) {
	        for (i = 0; i < children.length; ++i) {
	          api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
	        }
	      } else if (is.primitive(vnode.text)) {
	        api.appendChild(elm, api.createTextNode(vnode.text));
	      }
	      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
	      i = vnode.data.hook; // Reuse variable
	      if (isDef(i)) {
	        if (i.create) i.create(emptyNode, vnode);
	        if (i.insert) insertedVnodeQueue.push(vnode);
	      }
	    } else {
	      elm = vnode.elm = api.createTextNode(vnode.text);
	    }
	    if (isDef(thunk)) thunk.elm = vnode.elm;
	    return vnode.elm;
	  }
	
	  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
	    }
	  }
	
	  function invokeDestroyHook(vnode) {
	    var i, j, data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
	      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
	      if (isDef(i = vnode.children)) {
	        for (j = 0; j < vnode.children.length; ++j) {
	          invokeDestroyHook(vnode.children[j]);
	        }
	      }
	      if (isDef(i = data.vnode)) invokeDestroyHook(i);
	    }
	  }
	
	  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      var i, listeners, rm, ch = vnodes[startIdx];
	      if (isDef(ch)) {
	        if (isDef(ch.sel)) {
	          invokeDestroyHook(ch);
	          listeners = cbs.remove.length + 1;
	          rm = createRmCb(ch.elm, listeners);
	          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
	          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
	            i(ch, rm);
	          } else {
	            rm();
	          }
	        } else { // Text node
	          api.removeChild(parentElm, ch.elm);
	        }
	      }
	    }
	  }
	
	  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
	    var oldStartIdx = 0, newStartIdx = 0;
	    var oldEndIdx = oldCh.length - 1;
	    var oldStartVnode = oldCh[0];
	    var oldEndVnode = oldCh[oldEndIdx];
	    var newEndIdx = newCh.length - 1;
	    var newStartVnode = newCh[0];
	    var newEndVnode = newCh[newEndIdx];
	    var oldKeyToIdx, idxInOld, elmToMove, before;
	
	    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	      if (isUndef(oldStartVnode)) {
	        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
	      } else if (isUndef(oldEndVnode)) {
	        oldEndVnode = oldCh[--oldEndIdx];
	      } else if (sameVnode(oldStartVnode, newStartVnode)) {
	        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
	        oldStartVnode = oldCh[++oldStartIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else if (sameVnode(oldEndVnode, newEndVnode)) {
	        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
	        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
	        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
	        oldStartVnode = oldCh[++oldStartIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
	        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
	        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else {
	        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
	        idxInOld = oldKeyToIdx[newStartVnode.key];
	        if (isUndef(idxInOld)) { // New element
	          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
	          newStartVnode = newCh[++newStartIdx];
	        } else {
	          elmToMove = oldCh[idxInOld];
	          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
	          oldCh[idxInOld] = undefined;
	          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
	          newStartVnode = newCh[++newStartIdx];
	        }
	      }
	    }
	    if (oldStartIdx > oldEndIdx) {
	      before = isUndef(newCh[newEndIdx+1]) ? null : newCh[newEndIdx+1].elm;
	      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
	    } else if (newStartIdx > newEndIdx) {
	      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
	    }
	  }
	
	  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
	    var i, hook;
	    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
	      i(oldVnode, vnode);
	    }
	    if (isDef(i = oldVnode.data) && isDef(i = i.vnode)) oldVnode = i;
	    if (isDef(i = vnode.data) && isDef(i = i.vnode)) {
	      patchVnode(oldVnode, i, insertedVnodeQueue);
	      vnode.elm = i.elm;
	      return;
	    }
	    var elm = vnode.elm = oldVnode.elm, oldCh = oldVnode.children, ch = vnode.children;
	    if (oldVnode === vnode) return;
	    if (!sameVnode(oldVnode, vnode)) {
	      var parentElm = api.parentNode(oldVnode.elm);
	      elm = createElm(vnode, insertedVnodeQueue);
	      api.insertBefore(parentElm, elm, oldVnode.elm);
	      removeVnodes(parentElm, [oldVnode], 0, 0);
	      return;
	    }
	    if (isDef(vnode.data)) {
	      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
	      i = vnode.data.hook;
	      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
	    }
	    if (isUndef(vnode.text)) {
	      if (isDef(oldCh) && isDef(ch)) {
	        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
	      } else if (isDef(ch)) {
	        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
	        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
	      } else if (isDef(oldCh)) {
	        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
	      } else if (isDef(oldVnode.text)) {
	        api.setTextContent(elm, '');
	      }
	    } else if (oldVnode.text !== vnode.text) {
	      api.setTextContent(elm, vnode.text);
	    }
	    if (isDef(hook) && isDef(i = hook.postpatch)) {
	      i(oldVnode, vnode);
	    }
	  }
	
	  return function(oldVnode, vnode) {
	    var i, elm, parent;
	    var insertedVnodeQueue = [];
	    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
	
	    if (isUndef(oldVnode.sel)) {
	      oldVnode = emptyNodeAt(oldVnode);
	    }
	
	    if (sameVnode(oldVnode, vnode)) {
	      patchVnode(oldVnode, vnode, insertedVnodeQueue);
	    } else {
	      elm = oldVnode.elm;
	      parent = api.parentNode(elm);
	
	      createElm(vnode, insertedVnodeQueue);
	
	      if (parent !== null) {
	        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
	        removeVnodes(parent, [oldVnode], 0, 0);
	      }
	    }
	
	    for (i = 0; i < insertedVnodeQueue.length; ++i) {
	      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
	    }
	    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
	    return vnode;
	  };
	}
	
	module.exports = {init: init};


/***/ },
/* 24 */
/***/ function(module, exports) {

	function createElement(tagName){
	  return document.createElement(tagName);
	}
	
	function createElementNS(namespaceURI, qualifiedName){
	  return document.createElementNS(namespaceURI, qualifiedName);
	}
	
	function createTextNode(text){
	  return document.createTextNode(text);
	}
	
	
	function insertBefore(parentNode, newNode, referenceNode){
	  parentNode.insertBefore(newNode, referenceNode);
	}
	
	
	function removeChild(node, child){
	  node.removeChild(child);
	}
	
	function appendChild(node, child){
	  node.appendChild(child);
	}
	
	function parentNode(node){
	  return node.parentElement;
	}
	
	function nextSibling(node){
	  return node.nextSibling;
	}
	
	function tagName(node){
	  return node.tagName;
	}
	
	function setTextContent(node, text){
	  node.textContent = text;
	}
	
	module.exports = {
	  createElement: createElement,
	  createElementNS: createElementNS,
	  createTextNode: createTextNode,
	  appendChild: appendChild,
	  removeChild: removeChild,
	  insertBefore: insertBefore,
	  parentNode: parentNode,
	  nextSibling: nextSibling,
	  tagName: tagName,
	  setTextContent: setTextContent
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	function updateClass(oldVnode, vnode) {
	  var cur, name, elm = vnode.elm,
	      oldClass = oldVnode.data.class || {},
	      klass = vnode.data.class || {};
	  for (name in oldClass) {
	    if (!klass[name]) {
	      elm.classList.remove(name);
	    }
	  }
	  for (name in klass) {
	    cur = klass[name];
	    if (cur !== oldClass[name]) {
	      elm.classList[cur ? 'add' : 'remove'](name);
	    }
	  }
	}
	
	module.exports = {create: updateClass, update: updateClass};


/***/ },
/* 26 */
/***/ function(module, exports) {

	function updateProps(oldVnode, vnode) {
	  var key, cur, old, elm = vnode.elm,
	      oldProps = oldVnode.data.props || {}, props = vnode.data.props || {};
	  for (key in oldProps) {
	    if (!props[key]) {
	      delete elm[key];
	    }
	  }
	  for (key in props) {
	    cur = props[key];
	    old = oldProps[key];
	    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
	      elm[key] = cur;
	    }
	  }
	}
	
	module.exports = {create: updateProps, update: updateProps};


/***/ },
/* 27 */
/***/ function(module, exports) {

	var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare", 
	                "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable", 
	                "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple", 
	                "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly", 
	                "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate", 
	                "truespeed", "typemustmatch", "visible"];
	    
	var booleanAttrsDict = {};
	for(var i=0, len = booleanAttrs.length; i < len; i++) {
	  booleanAttrsDict[booleanAttrs[i]] = true;
	}
	    
	function updateAttrs(oldVnode, vnode) {
	  var key, cur, old, elm = vnode.elm,
	      oldAttrs = oldVnode.data.attrs || {}, attrs = vnode.data.attrs || {};
	  
	  // update modified attributes, add new attributes
	  for (key in attrs) {
	    cur = attrs[key];
	    old = oldAttrs[key];
	    if (old !== cur) {
	      // TODO: add support to namespaced attributes (setAttributeNS)
	      if(!cur && booleanAttrsDict[key])
	        elm.removeAttribute(key);
	      else
	        elm.setAttribute(key, cur);
	    }
	  }
	  //remove removed attributes
	  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
	  // the other option is to remove all attributes with value == undefined
	  for (key in oldAttrs) {
	    if (!(key in attrs)) {
	      elm.removeAttribute(key);
	    }
	  }
	}
	
	module.exports = {create: updateAttrs, update: updateAttrs};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(6);
	
	function arrInvoker(arr) {
	  return function() {
	    // Special case when length is two, for performance
	    arr.length === 2 ? arr[0](arr[1]) : arr[0].apply(undefined, arr.slice(1));
	  };
	}
	
	function fnInvoker(o) {
	  return function(ev) { o.fn(ev); };
	}
	
	function updateEventListeners(oldVnode, vnode) {
	  var name, cur, old, elm = vnode.elm,
	      oldOn = oldVnode.data.on || {}, on = vnode.data.on;
	  if (!on) return;
	  for (name in on) {
	    cur = on[name];
	    old = oldOn[name];
	    if (old === undefined) {
	      if (is.array(cur)) {
	        elm.addEventListener(name, arrInvoker(cur));
	      } else {
	        cur = {fn: cur};
	        on[name] = cur;
	        elm.addEventListener(name, fnInvoker(cur));
	      }
	    } else if (is.array(old)) {
	      // Deliberately modify old array since it's captured in closure created with `arrInvoker`
	      old.length = cur.length;
	      for (var i = 0; i < old.length; ++i) old[i] = cur[i];
	      on[name]  = old;
	    } else {
	      old.fn = cur;
	      on[name] = old;
	    }
	  }
	}
	
	module.exports = {create: updateEventListeners, update: updateEventListeners};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var h = __webpack_require__(4);
	var abyssa_1 = __webpack_require__(12);
	var dompteuse_1 = __webpack_require__(2);
	var action_1 = __webpack_require__(30);
	var index_1 = __webpack_require__(31);
	var blue_1 = __webpack_require__(36);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = dompteuse_1.component({
	    key: 'app',
	    pullState: pullState,
	    render: render
	});
	function pullState(state) {
	    return {
	        count: state.blue.count,
	        route: state.route.fullName
	    };
	}
	function render(options) {
	    var state = options.state;
	    return h('div', [
	        h('header', [
	            h('a', { attrs: { href: abyssa_1.api.link('app.index'), 'data-nav': 'mousedown' } }, 'Index'),
	            h('a', { attrs: { href: abyssa_1.api.link('app.blue', { id: 33 }), 'data-nav': 'mousedown' } }, 'Blue'),
	            String(state.count)
	        ]),
	        h('main', getChildren(state.route))
	    ]);
	}
	function getChildren(route) {
	    if (route === 'app.index')
	        return [index_1.default()];
	    if (route.indexOf('app.blue') === 0)
	        return [blue_1.default()];
	}
	setInterval(action_1.incrementBlue, 2500);


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fluxx_1 = __webpack_require__(8);
	exports.incrementBlue = fluxx_1.Action('incrementBlue');
	exports.routeChanged = fluxx_1.Action('routeChanged');


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var h = __webpack_require__(4);
	var animation_1 = __webpack_require__(32);
	function default_1() {
	    return h('h1', { hook: animation_1.contentAnimation }, 'Index');
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = default_1;
	;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var gsap_1 = __webpack_require__(33);
	var abyssa_1 = __webpack_require__(12);
	exports.contentAnimation = {
	    create: function (_, vnode) {
	        if (!vnode.elm || abyssa_1.api.isFirstTransition())
	            return;
	        vnode.elm.style.display = 'none';
	        gsap_1.TweenLite.fromTo(vnode.elm, 0.2, { css: { opacity: 0 } }, { css: { opacity: 1 }, delay: 0.22 }).eventCallback('onStart', function () { return vnode.elm.style.removeProperty('display'); });
	    },
	    remove: function (vnode, cb) {
	        if (!vnode.elm)
	            cb();
	        gsap_1.TweenLite.fromTo(vnode.elm, 0.2, { css: { opacity: 1 } }, { css: { opacity: 0 } }).eventCallback('onComplete', cb);
	    }
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	__webpack_require__(34);
	__webpack_require__(35);
	exports.TweenLite = window.TweenLite;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	/*!
	 * VERSION: 1.18.2
	 * DATE: 2015-12-22
	 * UPDATES AND DOCS AT: http://greensock.com
	 *
	 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
	 * This work is subject to the terms at http://greensock.com/standard-license or for
	 * Club GreenSock members, the software agreement that was issued with your membership.
	 * 
	 * @author: Jack Doyle, jack@greensock.com
	 */
	var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
	(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {
	
		"use strict";
	
		_gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin","TweenLite"], function(TweenPlugin, TweenLite) {
	
			/** @constructor **/
			var CSSPlugin = function() {
					TweenPlugin.call(this, "css");
					this._overwriteProps.length = 0;
					this.setRatio = CSSPlugin.prototype.setRatio; //speed optimization (avoid prototype lookup on this "hot" method)
				},
				_globals = _gsScope._gsDefine.globals,
				_hasPriority, //turns true whenever a CSSPropTween instance is created that has a priority other than 0. This helps us discern whether or not we should spend the time organizing the linked list or not after a CSSPlugin's _onInitTween() method is called.
				_suffixMap, //we set this in _onInitTween() each time as a way to have a persistent variable we can use in other methods like _parse() without having to pass it around as a parameter and we keep _parse() decoupled from a particular CSSPlugin instance
				_cs, //computed style (we store this in a shared variable to conserve memory and make minification tighter
				_overwriteProps, //alias to the currently instantiating CSSPlugin's _overwriteProps array. We use this closure in order to avoid having to pass a reference around from method to method and aid in minification.
				_specialProps = {},
				p = CSSPlugin.prototype = new TweenPlugin("css");
	
			p.constructor = CSSPlugin;
			CSSPlugin.version = "1.18.2";
			CSSPlugin.API = 2;
			CSSPlugin.defaultTransformPerspective = 0;
			CSSPlugin.defaultSkewType = "compensated";
			CSSPlugin.defaultSmoothOrigin = true;
			p = "px"; //we'll reuse the "p" variable to keep file size down
			CSSPlugin.suffixMap = {top:p, right:p, bottom:p, left:p, width:p, height:p, fontSize:p, padding:p, margin:p, perspective:p, lineHeight:""};
	
	
			var _numExp = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
				_relNumExp = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
				_valuesExp = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, //finds all the values that begin with numbers or += or -= and then a number. Includes suffixes. We use this to split complex values apart like "1px 5px 20px rgb(255,102,51)"
				_NaNExp = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g, //also allows scientific notation and doesn't kill the leading -/+ in -= and +=
				_suffixExp = /(?:\d|\-|\+|=|#|\.)*/g,
				_opacityExp = /opacity *= *([^)]*)/i,
				_opacityValExp = /opacity:([^;]*)/i,
				_alphaFilterExp = /alpha\(opacity *=.+?\)/i,
				_rgbhslExp = /^(rgb|hsl)/,
				_capsExp = /([A-Z])/g,
				_camelExp = /-([a-z])/gi,
				_urlExp = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, //for pulling out urls from url(...) or url("...") strings (some browsers wrap urls in quotes, some don't when reporting things like backgroundImage)
				_camelFunc = function(s, g) { return g.toUpperCase(); },
				_horizExp = /(?:Left|Right|Width)/i,
				_ieGetMatrixExp = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
				_ieSetMatrixExp = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
				_commasOutsideParenExp = /,(?=[^\)]*(?:\(|$))/gi, //finds any commas that are not within parenthesis
				_DEG2RAD = Math.PI / 180,
				_RAD2DEG = 180 / Math.PI,
				_forcePT = {},
				_doc = document,
				_createElement = function(type) {
					return _doc.createElementNS ? _doc.createElementNS("http://www.w3.org/1999/xhtml", type) : _doc.createElement(type);
				},
				_tempDiv = _createElement("div"),
				_tempImg = _createElement("img"),
				_internals = CSSPlugin._internals = {_specialProps:_specialProps}, //provides a hook to a few internal methods that we need to access from inside other plugins
				_agent = navigator.userAgent,
				_autoRound,
				_reqSafariFix, //we won't apply the Safari transform fix until we actually come across a tween that affects a transform property (to maintain best performance).
	
				_isSafari,
				_isFirefox, //Firefox has a bug that causes 3D transformed elements to randomly disappear unless a repaint is forced after each update on each element.
				_isSafariLT6, //Safari (and Android 4 which uses a flavor of Safari) has a bug that prevents changes to "top" and "left" properties from rendering properly if changed on the same frame as a transform UNLESS we set the element's WebkitBackfaceVisibility to hidden (weird, I know). Doing this for Android 3 and earlier seems to actually cause other problems, though (fun!)
				_ieVers,
				_supportsOpacity = (function() { //we set _isSafari, _ieVers, _isFirefox, and _supportsOpacity all in one function here to reduce file size slightly, especially in the minified version.
					var i = _agent.indexOf("Android"),
						a = _createElement("a");
					_isSafari = (_agent.indexOf("Safari") !== -1 && _agent.indexOf("Chrome") === -1 && (i === -1 || Number(_agent.substr(i+8, 1)) > 3));
					_isSafariLT6 = (_isSafari && (Number(_agent.substr(_agent.indexOf("Version/")+8, 1)) < 6));
					_isFirefox = (_agent.indexOf("Firefox") !== -1);
					if ((/MSIE ([0-9]{1,}[\.0-9]{0,})/).exec(_agent) || (/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/).exec(_agent)) {
						_ieVers = parseFloat( RegExp.$1 );
					}
					if (!a) {
						return false;
					}
					a.style.cssText = "top:1px;opacity:.55;";
					return /^0.55/.test(a.style.opacity);
				}()),
				_getIEOpacity = function(v) {
					return (_opacityExp.test( ((typeof(v) === "string") ? v : (v.currentStyle ? v.currentStyle.filter : v.style.filter) || "") ) ? ( parseFloat( RegExp.$1 ) / 100 ) : 1);
				},
				_log = function(s) {//for logging messages, but in a way that won't throw errors in old versions of IE.
					if (window.console) {
						console.log(s);
					}
				},
	
				_prefixCSS = "", //the non-camelCase vendor prefix like "-o-", "-moz-", "-ms-", or "-webkit-"
				_prefix = "", //camelCase vendor prefix like "O", "ms", "Webkit", or "Moz".
	
				// @private feed in a camelCase property name like "transform" and it will check to see if it is valid as-is or if it needs a vendor prefix. It returns the corrected camelCase property name (i.e. "WebkitTransform" or "MozTransform" or "transform" or null if no such property is found, like if the browser is IE8 or before, "transform" won't be found at all)
				_checkPropPrefix = function(p, e) {
					e = e || _tempDiv;
					var s = e.style,
						a, i;
					if (s[p] !== undefined) {
						return p;
					}
					p = p.charAt(0).toUpperCase() + p.substr(1);
					a = ["O","Moz","ms","Ms","Webkit"];
					i = 5;
					while (--i > -1 && s[a[i]+p] === undefined) { }
					if (i >= 0) {
						_prefix = (i === 3) ? "ms" : a[i];
						_prefixCSS = "-" + _prefix.toLowerCase() + "-";
						return _prefix + p;
					}
					return null;
				},
	
				_getComputedStyle = _doc.defaultView ? _doc.defaultView.getComputedStyle : function() {},
	
				/**
				 * @private Returns the css style for a particular property of an element. For example, to get whatever the current "left" css value for an element with an ID of "myElement", you could do:
				 * var currentLeft = CSSPlugin.getStyle( document.getElementById("myElement"), "left");
				 *
				 * @param {!Object} t Target element whose style property you want to query
				 * @param {!string} p Property name (like "left" or "top" or "marginTop", etc.)
				 * @param {Object=} cs Computed style object. This just provides a way to speed processing if you're going to get several properties on the same element in quick succession - you can reuse the result of the getComputedStyle() call.
				 * @param {boolean=} calc If true, the value will not be read directly from the element's "style" property (if it exists there), but instead the getComputedStyle() result will be used. This can be useful when you want to ensure that the browser itself is interpreting the value.
				 * @param {string=} dflt Default value that should be returned in the place of null, "none", "auto" or "auto auto".
				 * @return {?string} The current property value
				 */
				_getStyle = CSSPlugin.getStyle = function(t, p, cs, calc, dflt) {
					var rv;
					if (!_supportsOpacity) if (p === "opacity") { //several versions of IE don't use the standard "opacity" property - they use things like filter:alpha(opacity=50), so we parse that here.
						return _getIEOpacity(t);
					}
					if (!calc && t.style[p]) {
						rv = t.style[p];
					} else if ((cs = cs || _getComputedStyle(t))) {
						rv = cs[p] || cs.getPropertyValue(p) || cs.getPropertyValue(p.replace(_capsExp, "-$1").toLowerCase());
					} else if (t.currentStyle) {
						rv = t.currentStyle[p];
					}
					return (dflt != null && (!rv || rv === "none" || rv === "auto" || rv === "auto auto")) ? dflt : rv;
				},
	
				/**
				 * @private Pass the target element, the property name, the numeric value, and the suffix (like "%", "em", "px", etc.) and it will spit back the equivalent pixel number.
				 * @param {!Object} t Target element
				 * @param {!string} p Property name (like "left", "top", "marginLeft", etc.)
				 * @param {!number} v Value
				 * @param {string=} sfx Suffix (like "px" or "%" or "em")
				 * @param {boolean=} recurse If true, the call is a recursive one. In some browsers (like IE7/8), occasionally the value isn't accurately reported initially, but if we run the function again it will take effect.
				 * @return {number} value in pixels
				 */
				_convertToPixels = _internals.convertToPixels = function(t, p, v, sfx, recurse) {
					if (sfx === "px" || !sfx) { return v; }
					if (sfx === "auto" || !v) { return 0; }
					var horiz = _horizExp.test(p),
						node = t,
						style = _tempDiv.style,
						neg = (v < 0),
						pix, cache, time;
					if (neg) {
						v = -v;
					}
					if (sfx === "%" && p.indexOf("border") !== -1) {
						pix = (v / 100) * (horiz ? t.clientWidth : t.clientHeight);
					} else {
						style.cssText = "border:0 solid red;position:" + _getStyle(t, "position") + ";line-height:0;";
						if (sfx === "%" || !node.appendChild || sfx.charAt(0) === "v" || sfx === "rem") {
							node = t.parentNode || _doc.body;
							cache = node._gsCache;
							time = TweenLite.ticker.frame;
							if (cache && horiz && cache.time === time) { //performance optimization: we record the width of elements along with the ticker frame so that we can quickly get it again on the same tick (seems relatively safe to assume it wouldn't change on the same tick)
								return cache.width * v / 100;
							}
							style[(horiz ? "width" : "height")] = v + sfx;
						} else {
							style[(horiz ? "borderLeftWidth" : "borderTopWidth")] = v + sfx;
						}
						node.appendChild(_tempDiv);
						pix = parseFloat(_tempDiv[(horiz ? "offsetWidth" : "offsetHeight")]);
						node.removeChild(_tempDiv);
						if (horiz && sfx === "%" && CSSPlugin.cacheWidths !== false) {
							cache = node._gsCache = node._gsCache || {};
							cache.time = time;
							cache.width = pix / v * 100;
						}
						if (pix === 0 && !recurse) {
							pix = _convertToPixels(t, p, v, sfx, true);
						}
					}
					return neg ? -pix : pix;
				},
				_calculateOffset = _internals.calculateOffset = function(t, p, cs) { //for figuring out "top" or "left" in px when it's "auto". We need to factor in margin with the offsetLeft/offsetTop
					if (_getStyle(t, "position", cs) !== "absolute") { return 0; }
					var dim = ((p === "left") ? "Left" : "Top"),
						v = _getStyle(t, "margin" + dim, cs);
					return t["offset" + dim] - (_convertToPixels(t, p, parseFloat(v), v.replace(_suffixExp, "")) || 0);
				},
	
				// @private returns at object containing ALL of the style properties in camelCase and their associated values.
				_getAllStyles = function(t, cs) {
					var s = {},
						i, tr, p;
					if ((cs = cs || _getComputedStyle(t, null))) {
						if ((i = cs.length)) {
							while (--i > -1) {
								p = cs[i];
								if (p.indexOf("-transform") === -1 || _transformPropCSS === p) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
									s[p.replace(_camelExp, _camelFunc)] = cs.getPropertyValue(p);
								}
							}
						} else { //some browsers behave differently - cs.length is always 0, so we must do a for...in loop.
							for (i in cs) {
								if (i.indexOf("Transform") === -1 || _transformProp === i) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
									s[i] = cs[i];
								}
							}
						}
					} else if ((cs = t.currentStyle || t.style)) {
						for (i in cs) {
							if (typeof(i) === "string" && s[i] === undefined) {
								s[i.replace(_camelExp, _camelFunc)] = cs[i];
							}
						}
					}
					if (!_supportsOpacity) {
						s.opacity = _getIEOpacity(t);
					}
					tr = _getTransform(t, cs, false);
					s.rotation = tr.rotation;
					s.skewX = tr.skewX;
					s.scaleX = tr.scaleX;
					s.scaleY = tr.scaleY;
					s.x = tr.x;
					s.y = tr.y;
					if (_supports3D) {
						s.z = tr.z;
						s.rotationX = tr.rotationX;
						s.rotationY = tr.rotationY;
						s.scaleZ = tr.scaleZ;
					}
					if (s.filters) {
						delete s.filters;
					}
					return s;
				},
	
				// @private analyzes two style objects (as returned by _getAllStyles()) and only looks for differences between them that contain tweenable values (like a number or color). It returns an object with a "difs" property which refers to an object containing only those isolated properties and values for tweening, and a "firstMPT" property which refers to the first MiniPropTween instance in a linked list that recorded all the starting values of the different properties so that we can revert to them at the end or beginning of the tween - we don't want the cascading to get messed up. The forceLookup parameter is an optional generic object with properties that should be forced into the results - this is necessary for className tweens that are overwriting others because imagine a scenario where a rollover/rollout adds/removes a class and the user swipes the mouse over the target SUPER fast, thus nothing actually changed yet and the subsequent comparison of the properties would indicate they match (especially when px rounding is taken into consideration), thus no tweening is necessary even though it SHOULD tween and remove those properties after the tween (otherwise the inline styles will contaminate things). See the className SpecialProp code for details.
				_cssDif = function(t, s1, s2, vars, forceLookup) {
					var difs = {},
						style = t.style,
						val, p, mpt;
					for (p in s2) {
						if (p !== "cssText") if (p !== "length") if (isNaN(p)) if (s1[p] !== (val = s2[p]) || (forceLookup && forceLookup[p])) if (p.indexOf("Origin") === -1) if (typeof(val) === "number" || typeof(val) === "string") {
							difs[p] = (val === "auto" && (p === "left" || p === "top")) ? _calculateOffset(t, p) : ((val === "" || val === "auto" || val === "none") && typeof(s1[p]) === "string" && s1[p].replace(_NaNExp, "") !== "") ? 0 : val; //if the ending value is defaulting ("" or "auto"), we check the starting value and if it can be parsed into a number (a string which could have a suffix too, like 700px), then we swap in 0 for "" or "auto" so that things actually tween.
							if (style[p] !== undefined) { //for className tweens, we must remember which properties already existed inline - the ones that didn't should be removed when the tween isn't in progress because they were only introduced to facilitate the transition between classes.
								mpt = new MiniPropTween(style, p, style[p], mpt);
							}
						}
					}
					if (vars) {
						for (p in vars) { //copy properties (except className)
							if (p !== "className") {
								difs[p] = vars[p];
							}
						}
					}
					return {difs:difs, firstMPT:mpt};
				},
				_dimensions = {width:["Left","Right"], height:["Top","Bottom"]},
				_margins = ["marginLeft","marginRight","marginTop","marginBottom"],
	
				/**
				 * @private Gets the width or height of an element
				 * @param {!Object} t Target element
				 * @param {!string} p Property name ("width" or "height")
				 * @param {Object=} cs Computed style object (if one exists). Just a speed optimization.
				 * @return {number} Dimension (in pixels)
				 */
				_getDimension = function(t, p, cs) {
					var v = parseFloat((p === "width") ? t.offsetWidth : t.offsetHeight),
						a = _dimensions[p],
						i = a.length;
					cs = cs || _getComputedStyle(t, null);
					while (--i > -1) {
						v -= parseFloat( _getStyle(t, "padding" + a[i], cs, true) ) || 0;
						v -= parseFloat( _getStyle(t, "border" + a[i] + "Width", cs, true) ) || 0;
					}
					return v;
				},
	
				// @private Parses position-related complex strings like "top left" or "50px 10px" or "70% 20%", etc. which are used for things like transformOrigin or backgroundPosition. Optionally decorates a supplied object (recObj) with the following properties: "ox" (offsetX), "oy" (offsetY), "oxp" (if true, "ox" is a percentage not a pixel value), and "oxy" (if true, "oy" is a percentage not a pixel value)
				_parsePosition = function(v, recObj) {
					if (v === "contain" || v === "auto" || v === "auto auto") {
						return v + " ";
					}
					if (v == null || v === "") { //note: Firefox uses "auto auto" as default whereas Chrome uses "auto".
						v = "0 0";
					}
					var a = v.split(" "),
						x = (v.indexOf("left") !== -1) ? "0%" : (v.indexOf("right") !== -1) ? "100%" : a[0],
						y = (v.indexOf("top") !== -1) ? "0%" : (v.indexOf("bottom") !== -1) ? "100%" : a[1];
					if (y == null) {
						y = (x === "center") ? "50%" : "0";
					} else if (y === "center") {
						y = "50%";
					}
					if (x === "center" || (isNaN(parseFloat(x)) && (x + "").indexOf("=") === -1)) { //remember, the user could flip-flop the values and say "bottom center" or "center bottom", etc. "center" is ambiguous because it could be used to describe horizontal or vertical, hence the isNaN(). If there's an "=" sign in the value, it's relative.
						x = "50%";
					}
					v = x + " " + y + ((a.length > 2) ? " " + a[2] : "");
					if (recObj) {
						recObj.oxp = (x.indexOf("%") !== -1);
						recObj.oyp = (y.indexOf("%") !== -1);
						recObj.oxr = (x.charAt(1) === "=");
						recObj.oyr = (y.charAt(1) === "=");
						recObj.ox = parseFloat(x.replace(_NaNExp, ""));
						recObj.oy = parseFloat(y.replace(_NaNExp, ""));
						recObj.v = v;
					}
					return recObj || v;
				},
	
				/**
				 * @private Takes an ending value (typically a string, but can be a number) and a starting value and returns the change between the two, looking for relative value indicators like += and -= and it also ignores suffixes (but make sure the ending value starts with a number or +=/-= and that the starting value is a NUMBER!)
				 * @param {(number|string)} e End value which is typically a string, but could be a number
				 * @param {(number|string)} b Beginning value which is typically a string but could be a number
				 * @return {number} Amount of change between the beginning and ending values (relative values that have a "+=" or "-=" are recognized)
				 */
				_parseChange = function(e, b) {
					return (typeof(e) === "string" && e.charAt(1) === "=") ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) : parseFloat(e) - parseFloat(b);
				},
	
				/**
				 * @private Takes a value and a default number, checks if the value is relative, null, or numeric and spits back a normalized number accordingly. Primarily used in the _parseTransform() function.
				 * @param {Object} v Value to be parsed
				 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
				 * @return {number} Parsed value
				 */
				_parseVal = function(v, d) {
					return (v == null) ? d : (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0) + "1", 10) * parseFloat(v.substr(2)) + d : parseFloat(v);
				},
	
				/**
				 * @private Translates strings like "40deg" or "40" or 40rad" or "+=40deg" or "270_short" or "-90_cw" or "+=45_ccw" to a numeric radian angle. Of course a starting/default value must be fed in too so that relative values can be calculated properly.
				 * @param {Object} v Value to be parsed
				 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
				 * @param {string=} p property name for directionalEnd (optional - only used when the parsed value is directional ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation). Property name would be "rotation", "rotationX", or "rotationY"
				 * @param {Object=} directionalEnd An object that will store the raw end values for directional angles ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation.
				 * @return {number} parsed angle in radians
				 */
				_parseAngle = function(v, d, p, directionalEnd) {
					var min = 0.000001,
						cap, split, dif, result, isRelative;
					if (v == null) {
						result = d;
					} else if (typeof(v) === "number") {
						result = v;
					} else {
						cap = 360;
						split = v.split("_");
						isRelative = (v.charAt(1) === "=");
						dif = (isRelative ? parseInt(v.charAt(0) + "1", 10) * parseFloat(split[0].substr(2)) : parseFloat(split[0])) * ((v.indexOf("rad") === -1) ? 1 : _RAD2DEG) - (isRelative ? 0 : d);
						if (split.length) {
							if (directionalEnd) {
								directionalEnd[p] = d + dif;
							}
							if (v.indexOf("short") !== -1) {
								dif = dif % cap;
								if (dif !== dif % (cap / 2)) {
									dif = (dif < 0) ? dif + cap : dif - cap;
								}
							}
							if (v.indexOf("_cw") !== -1 && dif < 0) {
								dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
							} else if (v.indexOf("ccw") !== -1 && dif > 0) {
								dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
							}
						}
						result = d + dif;
					}
					if (result < min && result > -min) {
						result = 0;
					}
					return result;
				},
	
				_colorLookup = {aqua:[0,255,255],
					lime:[0,255,0],
					silver:[192,192,192],
					black:[0,0,0],
					maroon:[128,0,0],
					teal:[0,128,128],
					blue:[0,0,255],
					navy:[0,0,128],
					white:[255,255,255],
					fuchsia:[255,0,255],
					olive:[128,128,0],
					yellow:[255,255,0],
					orange:[255,165,0],
					gray:[128,128,128],
					purple:[128,0,128],
					green:[0,128,0],
					red:[255,0,0],
					pink:[255,192,203],
					cyan:[0,255,255],
					transparent:[255,255,255,0]},
	
				_hue = function(h, m1, m2) {
					h = (h < 0) ? h + 1 : (h > 1) ? h - 1 : h;
					return ((((h * 6 < 1) ? m1 + (m2 - m1) * h * 6 : (h < 0.5) ? m2 : (h * 3 < 2) ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * 255) + 0.5) | 0;
				},
	
				/**
				 * @private Parses a color (like #9F0, #FF9900, rgb(255,51,153) or hsl(108, 50%, 10%)) into an array with 3 elements for red, green, and blue or if toHSL parameter is true, it will populate the array with hue, saturation, and lightness values. If a relative value is found in an hsl() or hsla() string, it will preserve those relative prefixes and all the values in the array will be strings instead of numbers (in all other cases it will be populated with numbers).
				 * @param {(string|number)} v The value the should be parsed which could be a string like #9F0 or rgb(255,102,51) or rgba(255,0,0,0.5) or it could be a number like 0xFF00CC or even a named color like red, blue, purple, etc.
				 * @param {(boolean)} toHSL If true, an hsl() or hsla() value will be returned instead of rgb() or rgba()
				 * @return {Array.<number>} An array containing red, green, and blue (and optionally alpha) in that order, or if the toHSL parameter was true, the array will contain hue, saturation and lightness (and optionally alpha) in that order. Always numbers unless there's a relative prefix found in an hsl() or hsla() string and toHSL is true.
				 */
				_parseColor = CSSPlugin.parseColor = function(v, toHSL) {
					var a, r, g, b, h, s, l, max, min, d, wasHSL;
					if (!v) {
						a = _colorLookup.black;
					} else if (typeof(v) === "number") {
						a = [v >> 16, (v >> 8) & 255, v & 255];
					} else {
						if (v.charAt(v.length - 1) === ",") { //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
							v = v.substr(0, v.length - 1);
						}
						if (_colorLookup[v]) {
							a = _colorLookup[v];
						} else if (v.charAt(0) === "#") {
							if (v.length === 4) { //for shorthand like #9F0
								r = v.charAt(1);
								g = v.charAt(2);
								b = v.charAt(3);
								v = "#" + r + r + g + g + b + b;
							}
							v = parseInt(v.substr(1), 16);
							a = [v >> 16, (v >> 8) & 255, v & 255];
						} else if (v.substr(0, 3) === "hsl") {
							a = wasHSL = v.match(_numExp);
							if (!toHSL) {
								h = (Number(a[0]) % 360) / 360;
								s = Number(a[1]) / 100;
								l = Number(a[2]) / 100;
								g = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
								r = l * 2 - g;
								if (a.length > 3) {
									a[3] = Number(v[3]);
								}
								a[0] = _hue(h + 1 / 3, r, g);
								a[1] = _hue(h, r, g);
								a[2] = _hue(h - 1 / 3, r, g);
							} else if (v.indexOf("=") !== -1) { //if relative values are found, just return the raw strings with the relative prefixes in place.
								return v.match(_relNumExp);
							}
						} else {
							a = v.match(_numExp) || _colorLookup.transparent;
						}
						a[0] = Number(a[0]);
						a[1] = Number(a[1]);
						a[2] = Number(a[2]);
						if (a.length > 3) {
							a[3] = Number(a[3]);
						}
					}
					if (toHSL && !wasHSL) {
						r = a[0] / 255;
						g = a[1] / 255;
						b = a[2] / 255;
						max = Math.max(r, g, b);
						min = Math.min(r, g, b);
						l = (max + min) / 2;
						if (max === min) {
							h = s = 0;
						} else {
							d = max - min;
							s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
							h = (max === r) ? (g - b) / d + (g < b ? 6 : 0) : (max === g) ? (b - r) / d + 2 : (r - g) / d + 4;
							h *= 60;
						}
						a[0] = (h + 0.5) | 0;
						a[1] = (s * 100 + 0.5) | 0;
						a[2] = (l * 100 + 0.5) | 0;
					}
					return a;
				},
				_formatColors = function(s, toHSL) {
					var colors = s.match(_colorExp) || [],
						charIndex = 0,
						parsed = colors.length ? "" : s,
						i, color, temp;
					for (i = 0; i < colors.length; i++) {
						color = colors[i];
						temp = s.substr(charIndex, s.indexOf(color, charIndex)-charIndex);
						charIndex += temp.length + color.length;
						color = _parseColor(color, toHSL);
						if (color.length === 3) {
							color.push(1);
						}
						parsed += temp + (toHSL ? "hsla(" + color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : "rgba(" + color.join(",")) + ")";
					}
					return parsed;
				},
				_colorExp = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b"; //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.
	
			for (p in _colorLookup) {
				_colorExp += "|" + p + "\\b";
			}
			_colorExp = new RegExp(_colorExp+")", "gi");
	
			CSSPlugin.colorStringFilter = function(a) {
				var combined = a[0] + a[1],
					toHSL;
				_colorExp.lastIndex = 0;
				if (_colorExp.test(combined)) {
					toHSL = (combined.indexOf("hsl(") !== -1 || combined.indexOf("hsla(") !== -1);
					a[0] = _formatColors(a[0], toHSL);
					a[1] = _formatColors(a[1], toHSL);
				}
			};
	
			if (!TweenLite.defaultStringFilter) {
				TweenLite.defaultStringFilter = CSSPlugin.colorStringFilter;
			}
	
			/**
			 * @private Returns a formatter function that handles taking a string (or number in some cases) and returning a consistently formatted one in terms of delimiters, quantity of values, etc. For example, we may get boxShadow values defined as "0px red" or "0px 0px 10px rgb(255,0,0)" or "0px 0px 20px 20px #F00" and we need to ensure that what we get back is described with 4 numbers and a color. This allows us to feed it into the _parseComplex() method and split the values up appropriately. The neat thing about this _getFormatter() function is that the dflt defines a pattern as well as a default, so for example, _getFormatter("0px 0px 0px 0px #777", true) not only sets the default as 0px for all distances and #777 for the color, but also sets the pattern such that 4 numbers and a color will always get returned.
			 * @param {!string} dflt The default value and pattern to follow. So "0px 0px 0px 0px #777" will ensure that 4 numbers and a color will always get returned.
			 * @param {boolean=} clr If true, the values should be searched for color-related data. For example, boxShadow values typically contain a color whereas borderRadius don't.
			 * @param {boolean=} collapsible If true, the value is a top/left/right/bottom style one that acts like margin or padding, where if only one value is received, it's used for all 4; if 2 are received, the first is duplicated for 3rd (bottom) and the 2nd is duplicated for the 4th spot (left), etc.
			 * @return {Function} formatter function
			 */
			var _getFormatter = function(dflt, clr, collapsible, multi) {
					if (dflt == null) {
						return function(v) {return v;};
					}
					var dColor = clr ? (dflt.match(_colorExp) || [""])[0] : "",
						dVals = dflt.split(dColor).join("").match(_valuesExp) || [],
						pfx = dflt.substr(0, dflt.indexOf(dVals[0])),
						sfx = (dflt.charAt(dflt.length - 1) === ")") ? ")" : "",
						delim = (dflt.indexOf(" ") !== -1) ? " " : ",",
						numVals = dVals.length,
						dSfx = (numVals > 0) ? dVals[0].replace(_numExp, "") : "",
						formatter;
					if (!numVals) {
						return function(v) {return v;};
					}
					if (clr) {
						formatter = function(v) {
							var color, vals, i, a;
							if (typeof(v) === "number") {
								v += dSfx;
							} else if (multi && _commasOutsideParenExp.test(v)) {
								a = v.replace(_commasOutsideParenExp, "|").split("|");
								for (i = 0; i < a.length; i++) {
									a[i] = formatter(a[i]);
								}
								return a.join(",");
							}
							color = (v.match(_colorExp) || [dColor])[0];
							vals = v.split(color).join("").match(_valuesExp) || [];
							i = vals.length;
							if (numVals > i--) {
								while (++i < numVals) {
									vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
								}
							}
							return pfx + vals.join(delim) + delim + color + sfx + (v.indexOf("inset") !== -1 ? " inset" : "");
						};
						return formatter;
	
					}
					formatter = function(v) {
						var vals, a, i;
						if (typeof(v) === "number") {
							v += dSfx;
						} else if (multi && _commasOutsideParenExp.test(v)) {
							a = v.replace(_commasOutsideParenExp, "|").split("|");
							for (i = 0; i < a.length; i++) {
								a[i] = formatter(a[i]);
							}
							return a.join(",");
						}
						vals = v.match(_valuesExp) || [];
						i = vals.length;
						if (numVals > i--) {
							while (++i < numVals) {
								vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
							}
						}
						return pfx + vals.join(delim) + sfx;
					};
					return formatter;
				},
	
				/**
				 * @private returns a formatter function that's used for edge-related values like marginTop, marginLeft, paddingBottom, paddingRight, etc. Just pass a comma-delimited list of property names related to the edges.
				 * @param {!string} props a comma-delimited list of property names in order from top to left, like "marginTop,marginRight,marginBottom,marginLeft"
				 * @return {Function} a formatter function
				 */
				_getEdgeParser = function(props) {
					props = props.split(",");
					return function(t, e, p, cssp, pt, plugin, vars) {
						var a = (e + "").split(" "),
							i;
						vars = {};
						for (i = 0; i < 4; i++) {
							vars[props[i]] = a[i] = a[i] || a[(((i - 1) / 2) >> 0)];
						}
						return cssp.parse(t, vars, pt, plugin);
					};
				},
	
				// @private used when other plugins must tween values first, like BezierPlugin or ThrowPropsPlugin, etc. That plugin's setRatio() gets called first so that the values are updated, and then we loop through the MiniPropTweens  which handle copying the values into their appropriate slots so that they can then be applied correctly in the main CSSPlugin setRatio() method. Remember, we typically create a proxy object that has a bunch of uniquely-named properties that we feed to the sub-plugin and it does its magic normally, and then we must interpret those values and apply them to the css because often numbers must get combined/concatenated, suffixes added, etc. to work with css, like boxShadow could have 4 values plus a color.
				_setPluginRatio = _internals._setPluginRatio = function(v) {
					this.plugin.setRatio(v);
					var d = this.data,
						proxy = d.proxy,
						mpt = d.firstMPT,
						min = 0.000001,
						val, pt, i, str, p;
					while (mpt) {
						val = proxy[mpt.v];
						if (mpt.r) {
							val = Math.round(val);
						} else if (val < min && val > -min) {
							val = 0;
						}
						mpt.t[mpt.p] = val;
						mpt = mpt._next;
					}
					if (d.autoRotate) {
						d.autoRotate.rotation = proxy.rotation;
					}
					//at the end, we must set the CSSPropTween's "e" (end) value dynamically here because that's what is used in the final setRatio() method. Same for "b" at the beginning.
					if (v === 1 || v === 0) {
						mpt = d.firstMPT;
						p = (v === 1) ? "e" : "b";
						while (mpt) {
							pt = mpt.t;
							if (!pt.type) {
								pt[p] = pt.s + pt.xs0;
							} else if (pt.type === 1) {
								str = pt.xs0 + pt.s + pt.xs1;
								for (i = 1; i < pt.l; i++) {
									str += pt["xn"+i] + pt["xs"+(i+1)];
								}
								pt[p] = str;
							}
							mpt = mpt._next;
						}
					}
				},
	
				/**
				 * @private @constructor Used by a few SpecialProps to hold important values for proxies. For example, _parseToProxy() creates a MiniPropTween instance for each property that must get tweened on the proxy, and we record the original property name as well as the unique one we create for the proxy, plus whether or not the value needs to be rounded plus the original value.
				 * @param {!Object} t target object whose property we're tweening (often a CSSPropTween)
				 * @param {!string} p property name
				 * @param {(number|string|object)} v value
				 * @param {MiniPropTween=} next next MiniPropTween in the linked list
				 * @param {boolean=} r if true, the tweened value should be rounded to the nearest integer
				 */
				MiniPropTween = function(t, p, v, next, r) {
					this.t = t;
					this.p = p;
					this.v = v;
					this.r = r;
					if (next) {
						next._prev = this;
						this._next = next;
					}
				},
	
				/**
				 * @private Most other plugins (like BezierPlugin and ThrowPropsPlugin and others) can only tween numeric values, but CSSPlugin must accommodate special values that have a bunch of extra data (like a suffix or strings between numeric values, etc.). For example, boxShadow has values like "10px 10px 20px 30px rgb(255,0,0)" which would utterly confuse other plugins. This method allows us to split that data apart and grab only the numeric data and attach it to uniquely-named properties of a generic proxy object ({}) so that we can feed that to virtually any plugin to have the numbers tweened. However, we must also keep track of which properties from the proxy go with which CSSPropTween values and instances. So we create a linked list of MiniPropTweens. Each one records a target (the original CSSPropTween), property (like "s" or "xn1" or "xn2") that we're tweening and the unique property name that was used for the proxy (like "boxShadow_xn1" and "boxShadow_xn2") and whether or not they need to be rounded. That way, in the _setPluginRatio() method we can simply copy the values over from the proxy to the CSSPropTween instance(s). Then, when the main CSSPlugin setRatio() method runs and applies the CSSPropTween values accordingly, they're updated nicely. So the external plugin tweens the numbers, _setPluginRatio() copies them over, and setRatio() acts normally, applying css-specific values to the element.
				 * This method returns an object that has the following properties:
				 *  - proxy: a generic object containing the starting values for all the properties that will be tweened by the external plugin.  This is what we feed to the external _onInitTween() as the target
				 *  - end: a generic object containing the ending values for all the properties that will be tweened by the external plugin. This is what we feed to the external plugin's _onInitTween() as the destination values
				 *  - firstMPT: the first MiniPropTween in the linked list
				 *  - pt: the first CSSPropTween in the linked list that was created when parsing. If shallow is true, this linked list will NOT attach to the one passed into the _parseToProxy() as the "pt" (4th) parameter.
				 * @param {!Object} t target object to be tweened
				 * @param {!(Object|string)} vars the object containing the information about the tweening values (typically the end/destination values) that should be parsed
				 * @param {!CSSPlugin} cssp The CSSPlugin instance
				 * @param {CSSPropTween=} pt the next CSSPropTween in the linked list
				 * @param {TweenPlugin=} plugin the external TweenPlugin instance that will be handling tweening the numeric values
				 * @param {boolean=} shallow if true, the resulting linked list from the parse will NOT be attached to the CSSPropTween that was passed in as the "pt" (4th) parameter.
				 * @return An object containing the following properties: proxy, end, firstMPT, and pt (see above for descriptions)
				 */
				_parseToProxy = _internals._parseToProxy = function(t, vars, cssp, pt, plugin, shallow) {
					var bpt = pt,
						start = {},
						end = {},
						transform = cssp._transform,
						oldForce = _forcePT,
						i, p, xp, mpt, firstPT;
					cssp._transform = null;
					_forcePT = vars;
					pt = firstPT = cssp.parse(t, vars, pt, plugin);
					_forcePT = oldForce;
					//break off from the linked list so the new ones are isolated.
					if (shallow) {
						cssp._transform = transform;
						if (bpt) {
							bpt._prev = null;
							if (bpt._prev) {
								bpt._prev._next = null;
							}
						}
					}
					while (pt && pt !== bpt) {
						if (pt.type <= 1) {
							p = pt.p;
							end[p] = pt.s + pt.c;
							start[p] = pt.s;
							if (!shallow) {
								mpt = new MiniPropTween(pt, "s", p, mpt, pt.r);
								pt.c = 0;
							}
							if (pt.type === 1) {
								i = pt.l;
								while (--i > 0) {
									xp = "xn" + i;
									p = pt.p + "_" + xp;
									end[p] = pt.data[xp];
									start[p] = pt[xp];
									if (!shallow) {
										mpt = new MiniPropTween(pt, xp, p, mpt, pt.rxp[xp]);
									}
								}
							}
						}
						pt = pt._next;
					}
					return {proxy:start, end:end, firstMPT:mpt, pt:firstPT};
				},
	
	
	
				/**
				 * @constructor Each property that is tweened has at least one CSSPropTween associated with it. These instances store important information like the target, property, starting value, amount of change, etc. They can also optionally have a number of "extra" strings and numeric values named xs1, xn1, xs2, xn2, xs3, xn3, etc. where "s" indicates string and "n" indicates number. These can be pieced together in a complex-value tween (type:1) that has alternating types of data like a string, number, string, number, etc. For example, boxShadow could be "5px 5px 8px rgb(102, 102, 51)". In that value, there are 6 numbers that may need to tween and then pieced back together into a string again with spaces, suffixes, etc. xs0 is special in that it stores the suffix for standard (type:0) tweens, -OR- the first string (prefix) in a complex-value (type:1) CSSPropTween -OR- it can be the non-tweening value in a type:-1 CSSPropTween. We do this to conserve memory.
				 * CSSPropTweens have the following optional properties as well (not defined through the constructor):
				 *  - l: Length in terms of the number of extra properties that the CSSPropTween has (default: 0). For example, for a boxShadow we may need to tween 5 numbers in which case l would be 5; Keep in mind that the start/end values for the first number that's tweened are always stored in the s and c properties to conserve memory. All additional values thereafter are stored in xn1, xn2, etc.
				 *  - xfirst: The first instance of any sub-CSSPropTweens that are tweening properties of this instance. For example, we may split up a boxShadow tween so that there's a main CSSPropTween of type:1 that has various xs* and xn* values associated with the h-shadow, v-shadow, blur, color, etc. Then we spawn a CSSPropTween for each of those that has a higher priority and runs BEFORE the main CSSPropTween so that the values are all set by the time it needs to re-assemble them. The xfirst gives us an easy way to identify the first one in that chain which typically ends at the main one (because they're all prepende to the linked list)
				 *  - plugin: The TweenPlugin instance that will handle the tweening of any complex values. For example, sometimes we don't want to use normal subtweens (like xfirst refers to) to tween the values - we might want ThrowPropsPlugin or BezierPlugin some other plugin to do the actual tweening, so we create a plugin instance and store a reference here. We need this reference so that if we get a request to round values or disable a tween, we can pass along that request.
				 *  - data: Arbitrary data that needs to be stored with the CSSPropTween. Typically if we're going to have a plugin handle the tweening of a complex-value tween, we create a generic object that stores the END values that we're tweening to and the CSSPropTween's xs1, xs2, etc. have the starting values. We store that object as data. That way, we can simply pass that object to the plugin and use the CSSPropTween as the target.
				 *  - setRatio: Only used for type:2 tweens that require custom functionality. In this case, we call the CSSPropTween's setRatio() method and pass the ratio each time the tween updates. This isn't quite as efficient as doing things directly in the CSSPlugin's setRatio() method, but it's very convenient and flexible.
				 * @param {!Object} t Target object whose property will be tweened. Often a DOM element, but not always. It could be anything.
				 * @param {string} p Property to tween (name). For example, to tween element.width, p would be "width".
				 * @param {number} s Starting numeric value
				 * @param {number} c Change in numeric value over the course of the entire tween. For example, if element.width starts at 5 and should end at 100, c would be 95.
				 * @param {CSSPropTween=} next The next CSSPropTween in the linked list. If one is defined, we will define its _prev as the new instance, and the new instance's _next will be pointed at it.
				 * @param {number=} type The type of CSSPropTween where -1 = a non-tweening value, 0 = a standard simple tween, 1 = a complex value (like one that has multiple numbers in a comma- or space-delimited string like border:"1px solid red"), and 2 = one that uses a custom setRatio function that does all of the work of applying the values on each update.
				 * @param {string=} n Name of the property that should be used for overwriting purposes which is typically the same as p but not always. For example, we may need to create a subtween for the 2nd part of a "clip:rect(...)" tween in which case "p" might be xs1 but "n" is still "clip"
				 * @param {boolean=} r If true, the value(s) should be rounded
				 * @param {number=} pr Priority in the linked list order. Higher priority CSSPropTweens will be updated before lower priority ones. The default priority is 0.
				 * @param {string=} b Beginning value. We store this to ensure that it is EXACTLY what it was when the tween began without any risk of interpretation issues.
				 * @param {string=} e Ending value. We store this to ensure that it is EXACTLY what the user defined at the end of the tween without any risk of interpretation issues.
				 */
				CSSPropTween = _internals.CSSPropTween = function(t, p, s, c, next, type, n, r, pr, b, e) {
					this.t = t; //target
					this.p = p; //property
					this.s = s; //starting value
					this.c = c; //change value
					this.n = n || p; //name that this CSSPropTween should be associated to (usually the same as p, but not always - n is what overwriting looks at)
					if (!(t instanceof CSSPropTween)) {
						_overwriteProps.push(this.n);
					}
					this.r = r; //round (boolean)
					this.type = type || 0; //0 = normal tween, -1 = non-tweening (in which case xs0 will be applied to the target's property, like tp.t[tp.p] = tp.xs0), 1 = complex-value SpecialProp, 2 = custom setRatio() that does all the work
					if (pr) {
						this.pr = pr;
						_hasPriority = true;
					}
					this.b = (b === undefined) ? s : b;
					this.e = (e === undefined) ? s + c : e;
					if (next) {
						this._next = next;
						next._prev = this;
					}
				},
	
				_addNonTweeningNumericPT = function(target, prop, start, end, next, overwriteProp) { //cleans up some code redundancies and helps minification. Just a fast way to add a NUMERIC non-tweening CSSPropTween
					var pt = new CSSPropTween(target, prop, start, end - start, next, -1, overwriteProp);
					pt.b = start;
					pt.e = pt.xs0 = end;
					return pt;
				},
	
				/**
				 * Takes a target, the beginning value and ending value (as strings) and parses them into a CSSPropTween (possibly with child CSSPropTweens) that accommodates multiple numbers, colors, comma-delimited values, etc. For example:
				 * sp.parseComplex(element, "boxShadow", "5px 10px 20px rgb(255,102,51)", "0px 0px 0px red", true, "0px 0px 0px rgb(0,0,0,0)", pt);
				 * It will walk through the beginning and ending values (which should be in the same format with the same number and type of values) and figure out which parts are numbers, what strings separate the numeric/tweenable values, and then create the CSSPropTweens accordingly. If a plugin is defined, no child CSSPropTweens will be created. Instead, the ending values will be stored in the "data" property of the returned CSSPropTween like: {s:-5, xn1:-10, xn2:-20, xn3:255, xn4:0, xn5:0} so that it can be fed to any other plugin and it'll be plain numeric tweens but the recomposition of the complex value will be handled inside CSSPlugin's setRatio().
				 * If a setRatio is defined, the type of the CSSPropTween will be set to 2 and recomposition of the values will be the responsibility of that method.
				 *
				 * @param {!Object} t Target whose property will be tweened
				 * @param {!string} p Property that will be tweened (its name, like "left" or "backgroundColor" or "boxShadow")
				 * @param {string} b Beginning value
				 * @param {string} e Ending value
				 * @param {boolean} clrs If true, the value could contain a color value like "rgb(255,0,0)" or "#F00" or "red". The default is false, so no colors will be recognized (a performance optimization)
				 * @param {(string|number|Object)} dflt The default beginning value that should be used if no valid beginning value is defined or if the number of values inside the complex beginning and ending values don't match
				 * @param {?CSSPropTween} pt CSSPropTween instance that is the current head of the linked list (we'll prepend to this).
				 * @param {number=} pr Priority in the linked list order. Higher priority properties will be updated before lower priority ones. The default priority is 0.
				 * @param {TweenPlugin=} plugin If a plugin should handle the tweening of extra properties, pass the plugin instance here. If one is defined, then NO subtweens will be created for any extra properties (the properties will be created - just not additional CSSPropTween instances to tween them) because the plugin is expected to do so. However, the end values WILL be populated in the "data" property, like {s:100, xn1:50, xn2:300}
				 * @param {function(number)=} setRatio If values should be set in a custom function instead of being pieced together in a type:1 (complex-value) CSSPropTween, define that custom function here.
				 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parseComplex() call.
				 */
				_parseComplex = CSSPlugin.parseComplex = function(t, p, b, e, clrs, dflt, pt, pr, plugin, setRatio) {
					//DEBUG: _log("parseComplex: "+p+", b: "+b+", e: "+e);
					b = b || dflt || "";
					pt = new CSSPropTween(t, p, 0, 0, pt, (setRatio ? 2 : 1), null, false, pr, b, e);
					e += ""; //ensures it's a string
					var ba = b.split(", ").join(",").split(" "), //beginning array
						ea = e.split(", ").join(",").split(" "), //ending array
						l = ba.length,
						autoRound = (_autoRound !== false),
						i, xi, ni, bv, ev, bnums, enums, bn, hasAlpha, temp, cv, str, useHSL;
					if (e.indexOf(",") !== -1 || b.indexOf(",") !== -1) {
						ba = ba.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
						ea = ea.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
						l = ba.length;
					}
					if (l !== ea.length) {
						//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
						ba = (dflt || "").split(" ");
						l = ba.length;
					}
					pt.plugin = plugin;
					pt.setRatio = setRatio;
					_colorExp.lastIndex = 0;
					for (i = 0; i < l; i++) {
						bv = ba[i];
						ev = ea[i];
						bn = parseFloat(bv);
						//if the value begins with a number (most common). It's fine if it has a suffix like px
						if (bn || bn === 0) {
							pt.appendXtra("", bn, _parseChange(ev, bn), ev.replace(_relNumExp, ""), (autoRound && ev.indexOf("px") !== -1), true);
	
						//if the value is a color
						} else if (clrs && _colorExp.test(bv)) {
							str = ev.charAt(ev.length - 1) === "," ? ")," : ")"; //if there's a comma at the end, retain it.
							useHSL = (ev.indexOf("hsl") !== -1 && _supportsOpacity);
							bv = _parseColor(bv, useHSL);
							ev = _parseColor(ev, useHSL);
							hasAlpha = (bv.length + ev.length > 6);
							if (hasAlpha && !_supportsOpacity && ev[3] === 0) { //older versions of IE don't support rgba(), so if the destination alpha is 0, just use "transparent" for the end color
								pt["xs" + pt.l] += pt.l ? " transparent" : "transparent";
								pt.e = pt.e.split(ea[i]).join("transparent");
							} else {
								if (!_supportsOpacity) { //old versions of IE don't support rgba().
									hasAlpha = false;
								}
								if (useHSL) {
									pt.appendXtra((hasAlpha ? "hsla(" : "hsl("), bv[0], _parseChange(ev[0], bv[0]), ",", false, true)
										.appendXtra("", bv[1], _parseChange(ev[1], bv[1]), "%,", false)
										.appendXtra("", bv[2], _parseChange(ev[2], bv[2]), (hasAlpha ? "%," : "%" + str), false);
								} else {
									pt.appendXtra((hasAlpha ? "rgba(" : "rgb("), bv[0], ev[0] - bv[0], ",", true, true)
										.appendXtra("", bv[1], ev[1] - bv[1], ",", true)
										.appendXtra("", bv[2], ev[2] - bv[2], (hasAlpha ? "," : str), true);
								}
	
								if (hasAlpha) {
									bv = (bv.length < 4) ? 1 : bv[3];
									pt.appendXtra("", bv, ((ev.length < 4) ? 1 : ev[3]) - bv, str, false);
								}
							}
							_colorExp.lastIndex = 0; //otherwise the test() on the RegExp could move the lastIndex and taint future results.
	
						} else {
							bnums = bv.match(_numExp); //gets each group of numbers in the beginning value string and drops them into an array
	
							//if no number is found, treat it as a non-tweening value and just append the string to the current xs.
							if (!bnums) {
								pt["xs" + pt.l] += pt.l ? " " + ev : ev;
	
							//loop through all the numbers that are found and construct the extra values on the pt.
							} else {
								enums = ev.match(_relNumExp); //get each group of numbers in the end value string and drop them into an array. We allow relative values too, like +=50 or -=.5
								if (!enums || enums.length !== bnums.length) {
									//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
									return pt;
								}
								ni = 0;
								for (xi = 0; xi < bnums.length; xi++) {
									cv = bnums[xi];
									temp = bv.indexOf(cv, ni);
									pt.appendXtra(bv.substr(ni, temp - ni), Number(cv), _parseChange(enums[xi], cv), "", (autoRound && bv.substr(temp + cv.length, 2) === "px"), (xi === 0));
									ni = temp + cv.length;
								}
								pt["xs" + pt.l] += bv.substr(ni);
							}
						}
					}
					//if there are relative values ("+=" or "-=" prefix), we need to adjust the ending value to eliminate the prefixes and combine the values properly.
					if (e.indexOf("=") !== -1) if (pt.data) {
						str = pt.xs0 + pt.data.s;
						for (i = 1; i < pt.l; i++) {
							str += pt["xs" + i] + pt.data["xn" + i];
						}
						pt.e = str + pt["xs" + i];
					}
					if (!pt.l) {
						pt.type = -1;
						pt.xs0 = pt.e;
					}
					return pt.xfirst || pt;
				},
				i = 9;
	
	
			p = CSSPropTween.prototype;
			p.l = p.pr = 0; //length (number of extra properties like xn1, xn2, xn3, etc.
			while (--i > 0) {
				p["xn" + i] = 0;
				p["xs" + i] = "";
			}
			p.xs0 = "";
			p._next = p._prev = p.xfirst = p.data = p.plugin = p.setRatio = p.rxp = null;
	
	
			/**
			 * Appends and extra tweening value to a CSSPropTween and automatically manages any prefix and suffix strings. The first extra value is stored in the s and c of the main CSSPropTween instance, but thereafter any extras are stored in the xn1, xn2, xn3, etc. The prefixes and suffixes are stored in the xs0, xs1, xs2, etc. properties. For example, if I walk through a clip value like "rect(10px, 5px, 0px, 20px)", the values would be stored like this:
			 * xs0:"rect(", s:10, xs1:"px, ", xn1:5, xs2:"px, ", xn2:0, xs3:"px, ", xn3:20, xn4:"px)"
			 * And they'd all get joined together when the CSSPlugin renders (in the setRatio() method).
			 * @param {string=} pfx Prefix (if any)
			 * @param {!number} s Starting value
			 * @param {!number} c Change in numeric value over the course of the entire tween. For example, if the start is 5 and the end is 100, the change would be 95.
			 * @param {string=} sfx Suffix (if any)
			 * @param {boolean=} r Round (if true).
			 * @param {boolean=} pad If true, this extra value should be separated by the previous one by a space. If there is no previous extra and pad is true, it will automatically drop the space.
			 * @return {CSSPropTween} returns itself so that multiple methods can be chained together.
			 */
			p.appendXtra = function(pfx, s, c, sfx, r, pad) {
				var pt = this,
					l = pt.l;
				pt["xs" + l] += (pad && l) ? " " + pfx : pfx || "";
				if (!c) if (l !== 0 && !pt.plugin) { //typically we'll combine non-changing values right into the xs to optimize performance, but we don't combine them when there's a plugin that will be tweening the values because it may depend on the values being split apart, like for a bezier, if a value doesn't change between the first and second iteration but then it does on the 3rd, we'll run into trouble because there's no xn slot for that value!
					pt["xs" + l] += s + (sfx || "");
					return pt;
				}
				pt.l++;
				pt.type = pt.setRatio ? 2 : 1;
				pt["xs" + pt.l] = sfx || "";
				if (l > 0) {
					pt.data["xn" + l] = s + c;
					pt.rxp["xn" + l] = r; //round extra property (we need to tap into this in the _parseToProxy() method)
					pt["xn" + l] = s;
					if (!pt.plugin) {
						pt.xfirst = new CSSPropTween(pt, "xn" + l, s, c, pt.xfirst || pt, 0, pt.n, r, pt.pr);
						pt.xfirst.xs0 = 0; //just to ensure that the property stays numeric which helps modern browsers speed up processing. Remember, in the setRatio() method, we do pt.t[pt.p] = val + pt.xs0 so if pt.xs0 is "" (the default), it'll cast the end value as a string. When a property is a number sometimes and a string sometimes, it prevents the compiler from locking in the data type, slowing things down slightly.
					}
					return pt;
				}
				pt.data = {s:s + c};
				pt.rxp = {};
				pt.s = s;
				pt.c = c;
				pt.r = r;
				return pt;
			};
	
			/**
			 * @constructor A SpecialProp is basically a css property that needs to be treated in a non-standard way, like if it may contain a complex value like boxShadow:"5px 10px 15px rgb(255, 102, 51)" or if it is associated with another plugin like ThrowPropsPlugin or BezierPlugin. Every SpecialProp is associated with a particular property name like "boxShadow" or "throwProps" or "bezier" and it will intercept those values in the vars object that's passed to the CSSPlugin and handle them accordingly.
			 * @param {!string} p Property name (like "boxShadow" or "throwProps")
			 * @param {Object=} options An object containing any of the following configuration options:
			 *                      - defaultValue: the default value
			 *                      - parser: A function that should be called when the associated property name is found in the vars. This function should return a CSSPropTween instance and it should ensure that it is properly inserted into the linked list. It will receive 4 paramters: 1) The target, 2) The value defined in the vars, 3) The CSSPlugin instance (whose _firstPT should be used for the linked list), and 4) A computed style object if one was calculated (this is a speed optimization that allows retrieval of starting values quicker)
			 *                      - formatter: a function that formats any value received for this special property (for example, boxShadow could take "5px 5px red" and format it to "5px 5px 0px 0px red" so that both the beginning and ending values have a common order and quantity of values.)
			 *                      - prefix: if true, we'll determine whether or not this property requires a vendor prefix (like Webkit or Moz or ms or O)
			 *                      - color: set this to true if the value for this SpecialProp may contain color-related values like rgb(), rgba(), etc.
			 *                      - priority: priority in the linked list order. Higher priority SpecialProps will be updated before lower priority ones. The default priority is 0.
			 *                      - multi: if true, the formatter should accommodate a comma-delimited list of values, like boxShadow could have multiple boxShadows listed out.
			 *                      - collapsible: if true, the formatter should treat the value like it's a top/right/bottom/left value that could be collapsed, like "5px" would apply to all, "5px, 10px" would use 5px for top/bottom and 10px for right/left, etc.
			 *                      - keyword: a special keyword that can [optionally] be found inside the value (like "inset" for boxShadow). This allows us to validate beginning/ending values to make sure they match (if the keyword is found in one, it'll be added to the other for consistency by default).
			 */
			var SpecialProp = function(p, options) {
					options = options || {};
					this.p = options.prefix ? _checkPropPrefix(p) || p : p;
					_specialProps[p] = _specialProps[this.p] = this;
					this.format = options.formatter || _getFormatter(options.defaultValue, options.color, options.collapsible, options.multi);
					if (options.parser) {
						this.parse = options.parser;
					}
					this.clrs = options.color;
					this.multi = options.multi;
					this.keyword = options.keyword;
					this.dflt = options.defaultValue;
					this.pr = options.priority || 0;
				},
	
				//shortcut for creating a new SpecialProp that can accept multiple properties as a comma-delimited list (helps minification). dflt can be an array for multiple values (we don't do a comma-delimited list because the default value may contain commas, like rect(0px,0px,0px,0px)). We attach this method to the SpecialProp class/object instead of using a private _createSpecialProp() method so that we can tap into it externally if necessary, like from another plugin.
				_registerComplexSpecialProp = _internals._registerComplexSpecialProp = function(p, options, defaults) {
					if (typeof(options) !== "object") {
						options = {parser:defaults}; //to make backwards compatible with older versions of BezierPlugin and ThrowPropsPlugin
					}
					var a = p.split(","),
						d = options.defaultValue,
						i, temp;
					defaults = defaults || [d];
					for (i = 0; i < a.length; i++) {
						options.prefix = (i === 0 && options.prefix);
						options.defaultValue = defaults[i] || d;
						temp = new SpecialProp(a[i], options);
					}
				},
	
				//creates a placeholder special prop for a plugin so that the property gets caught the first time a tween of it is attempted, and at that time it makes the plugin register itself, thus taking over for all future tweens of that property. This allows us to not mandate that things load in a particular order and it also allows us to log() an error that informs the user when they attempt to tween an external plugin-related property without loading its .js file.
				_registerPluginProp = function(p) {
					if (!_specialProps[p]) {
						var pluginName = p.charAt(0).toUpperCase() + p.substr(1) + "Plugin";
						_registerComplexSpecialProp(p, {parser:function(t, e, p, cssp, pt, plugin, vars) {
							var pluginClass = _globals.com.greensock.plugins[pluginName];
							if (!pluginClass) {
								_log("Error: " + pluginName + " js file not loaded.");
								return pt;
							}
							pluginClass._cssRegister();
							return _specialProps[p].parse(t, e, p, cssp, pt, plugin, vars);
						}});
					}
				};
	
	
			p = SpecialProp.prototype;
	
			/**
			 * Alias for _parseComplex() that automatically plugs in certain values for this SpecialProp, like its property name, whether or not colors should be sensed, the default value, and priority. It also looks for any keyword that the SpecialProp defines (like "inset" for boxShadow) and ensures that the beginning and ending values have the same number of values for SpecialProps where multi is true (like boxShadow and textShadow can have a comma-delimited list)
			 * @param {!Object} t target element
			 * @param {(string|number|object)} b beginning value
			 * @param {(string|number|object)} e ending (destination) value
			 * @param {CSSPropTween=} pt next CSSPropTween in the linked list
			 * @param {TweenPlugin=} plugin If another plugin will be tweening the complex value, that TweenPlugin instance goes here.
			 * @param {function=} setRatio If a custom setRatio() method should be used to handle this complex value, that goes here.
			 * @return {CSSPropTween=} First CSSPropTween in the linked list
			 */
			p.parseComplex = function(t, b, e, pt, plugin, setRatio) {
				var kwd = this.keyword,
					i, ba, ea, l, bi, ei;
				//if this SpecialProp's value can contain a comma-delimited list of values (like boxShadow or textShadow), we must parse them in a special way, and look for a keyword (like "inset" for boxShadow) and ensure that the beginning and ending BOTH have it if the end defines it as such. We also must ensure that there are an equal number of values specified (we can't tween 1 boxShadow to 3 for example)
				if (this.multi) if (_commasOutsideParenExp.test(e) || _commasOutsideParenExp.test(b)) {
					ba = b.replace(_commasOutsideParenExp, "|").split("|");
					ea = e.replace(_commasOutsideParenExp, "|").split("|");
				} else if (kwd) {
					ba = [b];
					ea = [e];
				}
				if (ea) {
					l = (ea.length > ba.length) ? ea.length : ba.length;
					for (i = 0; i < l; i++) {
						b = ba[i] = ba[i] || this.dflt;
						e = ea[i] = ea[i] || this.dflt;
						if (kwd) {
							bi = b.indexOf(kwd);
							ei = e.indexOf(kwd);
							if (bi !== ei) {
								if (ei === -1) { //if the keyword isn't in the end value, remove it from the beginning one.
									ba[i] = ba[i].split(kwd).join("");
								} else if (bi === -1) { //if the keyword isn't in the beginning, add it.
									ba[i] += " " + kwd;
								}
							}
						}
					}
					b = ba.join(", ");
					e = ea.join(", ");
				}
				return _parseComplex(t, this.p, b, e, this.clrs, this.dflt, pt, this.pr, plugin, setRatio);
			};
	
			/**
			 * Accepts a target and end value and spits back a CSSPropTween that has been inserted into the CSSPlugin's linked list and conforms with all the conventions we use internally, like type:-1, 0, 1, or 2, setting up any extra property tweens, priority, etc. For example, if we have a boxShadow SpecialProp and call:
			 * this._firstPT = sp.parse(element, "5px 10px 20px rgb(2550,102,51)", "boxShadow", this);
			 * It should figure out the starting value of the element's boxShadow, compare it to the provided end value and create all the necessary CSSPropTweens of the appropriate types to tween the boxShadow. The CSSPropTween that gets spit back should already be inserted into the linked list (the 4th parameter is the current head, so prepend to that).
			 * @param {!Object} t Target object whose property is being tweened
			 * @param {Object} e End value as provided in the vars object (typically a string, but not always - like a throwProps would be an object).
			 * @param {!string} p Property name
			 * @param {!CSSPlugin} cssp The CSSPlugin instance that should be associated with this tween.
			 * @param {?CSSPropTween} pt The CSSPropTween that is the current head of the linked list (we'll prepend to it)
			 * @param {TweenPlugin=} plugin If a plugin will be used to tween the parsed value, this is the plugin instance.
			 * @param {Object=} vars Original vars object that contains the data for parsing.
			 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parse() call.
			 */
			p.parse = function(t, e, p, cssp, pt, plugin, vars) {
				return this.parseComplex(t.style, this.format(_getStyle(t, this.p, _cs, false, this.dflt)), this.format(e), pt, plugin);
			};
	
			/**
			 * Registers a special property that should be intercepted from any "css" objects defined in tweens. This allows you to handle them however you want without CSSPlugin doing it for you. The 2nd parameter should be a function that accepts 3 parameters:
			 *  1) Target object whose property should be tweened (typically a DOM element)
			 *  2) The end/destination value (could be a string, number, object, or whatever you want)
			 *  3) The tween instance (you probably don't need to worry about this, but it can be useful for looking up information like the duration)
			 *
			 * Then, your function should return a function which will be called each time the tween gets rendered, passing a numeric "ratio" parameter to your function that indicates the change factor (usually between 0 and 1). For example:
			 *
			 * CSSPlugin.registerSpecialProp("myCustomProp", function(target, value, tween) {
			 *      var start = target.style.width;
			 *      return function(ratio) {
			 *              target.style.width = (start + value * ratio) + "px";
			 *              console.log("set width to " + target.style.width);
			 *          }
			 * }, 0);
			 *
			 * Then, when I do this tween, it will trigger my special property:
			 *
			 * TweenLite.to(element, 1, {css:{myCustomProp:100}});
			 *
			 * In the example, of course, we're just changing the width, but you can do anything you want.
			 *
			 * @param {!string} name Property name (or comma-delimited list of property names) that should be intercepted and handled by your function. For example, if I define "myCustomProp", then it would handle that portion of the following tween: TweenLite.to(element, 1, {css:{myCustomProp:100}})
			 * @param {!function(Object, Object, Object, string):function(number)} onInitTween The function that will be called when a tween of this special property is performed. The function will receive 4 parameters: 1) Target object that should be tweened, 2) Value that was passed to the tween, 3) The tween instance itself (rarely used), and 4) The property name that's being tweened. Your function should return a function that should be called on every update of the tween. That function will receive a single parameter that is a "change factor" value (typically between 0 and 1) indicating the amount of change as a ratio. You can use this to determine how to set the values appropriately in your function.
			 * @param {number=} priority Priority that helps the engine determine the order in which to set the properties (default: 0). Higher priority properties will be updated before lower priority ones.
			 */
			CSSPlugin.registerSpecialProp = function(name, onInitTween, priority) {
				_registerComplexSpecialProp(name, {parser:function(t, e, p, cssp, pt, plugin, vars) {
					var rv = new CSSPropTween(t, p, 0, 0, pt, 2, p, false, priority);
					rv.plugin = plugin;
					rv.setRatio = onInitTween(t, e, cssp._tween, p);
					return rv;
				}, priority:priority});
			};
	
	
	
	
	
	
			//transform-related methods and properties
			CSSPlugin.useSVGTransformAttr = _isSafari || _isFirefox; //Safari and Firefox both have some rendering bugs when applying CSS transforms to SVG elements, so default to using the "transform" attribute instead (users can override this).
			var _transformProps = ("scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent").split(","),
				_transformProp = _checkPropPrefix("transform"), //the Javascript (camelCase) transform property, like msTransform, WebkitTransform, MozTransform, or OTransform.
				_transformPropCSS = _prefixCSS + "transform",
				_transformOriginProp = _checkPropPrefix("transformOrigin"),
				_supports3D = (_checkPropPrefix("perspective") !== null),
				Transform = _internals.Transform = function() {
					this.perspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0;
					this.force3D = (CSSPlugin.defaultForce3D === false || !_supports3D) ? false : CSSPlugin.defaultForce3D || "auto";
				},
				_SVGElement = window.SVGElement,
				_useSVGTransformAttr,
				//Some browsers (like Firefox and IE) don't honor transform-origin properly in SVG elements, so we need to manually adjust the matrix accordingly. We feature detect here rather than always doing the conversion for certain browsers because they may fix the problem at some point in the future.
	
				_createSVG = function(type, container, attributes) {
					var element = _doc.createElementNS("http://www.w3.org/2000/svg", type),
						reg = /([a-z])([A-Z])/g,
						p;
					for (p in attributes) {
						element.setAttributeNS(null, p.replace(reg, "$1-$2").toLowerCase(), attributes[p]);
					}
					container.appendChild(element);
					return element;
				},
				_docElement = _doc.documentElement,
				_forceSVGTransformAttr = (function() {
					//IE and Android stock don't support CSS transforms on SVG elements, so we must write them to the "transform" attribute. We populate this variable in the _parseTransform() method, and only if/when we come across an SVG element
					var force = _ieVers || (/Android/i.test(_agent) && !window.chrome),
						svg, rect, width;
					if (_doc.createElementNS && !force) { //IE8 and earlier doesn't support SVG anyway
						svg = _createSVG("svg", _docElement);
						rect = _createSVG("rect", svg, {width:100, height:50, x:100});
						width = rect.getBoundingClientRect().width;
						rect.style[_transformOriginProp] = "50% 50%";
						rect.style[_transformProp] = "scaleX(0.5)";
						force = (width === rect.getBoundingClientRect().width && !(_isFirefox && _supports3D)); //note: Firefox fails the test even though it does support CSS transforms in 3D. Since we can't push 3D stuff into the transform attribute, we force Firefox to pass the test here (as long as it does truly support 3D).
						_docElement.removeChild(svg);
					}
					return force;
				})(),
				_parseSVGOrigin = function(e, local, decoratee, absolute, smoothOrigin) {
					var tm = e._gsTransform,
						m = _getMatrix(e, true),
						v, x, y, xOrigin, yOrigin, a, b, c, d, tx, ty, determinant, xOriginOld, yOriginOld;
					if (tm) {
						xOriginOld = tm.xOrigin; //record the original values before we alter them.
						yOriginOld = tm.yOrigin;
					}
					if (!absolute || (v = absolute.split(" ")).length < 2) {
						b = e.getBBox();
						local = _parsePosition(local).split(" ");
						v = [(local[0].indexOf("%") !== -1 ? parseFloat(local[0]) / 100 * b.width : parseFloat(local[0])) + b.x,
							 (local[1].indexOf("%") !== -1 ? parseFloat(local[1]) / 100 * b.height : parseFloat(local[1])) + b.y];
					}
					decoratee.xOrigin = xOrigin = parseFloat(v[0]);
					decoratee.yOrigin = yOrigin = parseFloat(v[1]);
					if (absolute && m !== _identity2DMatrix) { //if svgOrigin is being set, we must invert the matrix and determine where the absolute point is, factoring in the current transforms. Otherwise, the svgOrigin would be based on the element's non-transformed position on the canvas.
						a = m[0];
						b = m[1];
						c = m[2];
						d = m[3];
						tx = m[4];
						ty = m[5];
						determinant = (a * d - b * c);
						x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + ((c * ty - d * tx) / determinant);
						y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - ((a * ty - b * tx) / determinant);
						xOrigin = decoratee.xOrigin = v[0] = x;
						yOrigin = decoratee.yOrigin = v[1] = y;
					}
					if (tm) { //avoid jump when transformOrigin is changed - adjust the x/y values accordingly
						if (smoothOrigin || (smoothOrigin !== false && CSSPlugin.defaultSmoothOrigin !== false)) {
							x = xOrigin - xOriginOld;
							y = yOrigin - yOriginOld;
							//originally, we simply adjusted the x and y values, but that would cause problems if, for example, you created a rotational tween part-way through an x/y tween. Managing the offset in a separate variable gives us ultimate flexibility.
							//tm.x -= x - (x * m[0] + y * m[2]);
							//tm.y -= y - (x * m[1] + y * m[3]);
							tm.xOffset += (x * m[0] + y * m[2]) - x;
							tm.yOffset += (x * m[1] + y * m[3]) - y;
						} else {
							tm.xOffset = tm.yOffset = 0;
						}
					}
					e.setAttribute("data-svg-origin", v.join(" "));
				},
				_isSVG = function(e) {
					return !!(_SVGElement && typeof(e.getBBox) === "function" && e.getCTM && (!e.parentNode || (e.parentNode.getBBox && e.parentNode.getCTM)));
				},
				_identity2DMatrix = [1,0,0,1,0,0],
				_getMatrix = function(e, force2D) {
					var tm = e._gsTransform || new Transform(),
						rnd = 100000,
						isDefault, s, m, n, dec;
					if (_transformProp) {
						s = _getStyle(e, _transformPropCSS, null, true);
					} else if (e.currentStyle) {
						//for older versions of IE, we need to interpret the filter portion that is in the format: progid:DXImageTransform.Microsoft.Matrix(M11=6.123233995736766e-17, M12=-1, M21=1, M22=6.123233995736766e-17, sizingMethod='auto expand') Notice that we need to swap b and c compared to a normal matrix.
						s = e.currentStyle.filter.match(_ieGetMatrixExp);
						s = (s && s.length === 4) ? [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), (tm.x || 0), (tm.y || 0)].join(",") : "";
					}
					isDefault = (!s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)");
					if (tm.svg || (e.getBBox && _isSVG(e))) {
						if (isDefault && (e.style[_transformProp] + "").indexOf("matrix") !== -1) { //some browsers (like Chrome 40) don't correctly report transforms that are applied inline on an SVG element (they don't get included in the computed style), so we double-check here and accept matrix values
							s = e.style[_transformProp];
							isDefault = 0;
						}
						m = e.getAttribute("transform");
						if (isDefault && m) {
							if (m.indexOf("matrix") !== -1) { //just in case there's a "transform" value specified as an attribute instead of CSS style. Accept either a matrix() or simple translate() value though.
								s = m;
								isDefault = 0;
							} else if (m.indexOf("translate") !== -1) {
								s = "matrix(1,0,0,1," + m.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")";
								isDefault = 0;
							}
						}
					}
					if (isDefault) {
						return _identity2DMatrix;
					}
					//split the matrix values out into an array (m for matrix)
					m = (s || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [];
					i = m.length;
					while (--i > -1) {
						n = Number(m[i]);
						m[i] = (dec = n - (n |= 0)) ? ((dec * rnd + (dec < 0 ? -0.5 : 0.5)) | 0) / rnd + n : n; //convert strings to Numbers and round to 5 decimal places to avoid issues with tiny numbers. Roughly 20x faster than Number.toFixed(). We also must make sure to round before dividing so that values like 0.9999999999 become 1 to avoid glitches in browser rendering and interpretation of flipped/rotated 3D matrices. And don't just multiply the number by rnd, floor it, and then divide by rnd because the bitwise operations max out at a 32-bit signed integer, thus it could get clipped at a relatively low value (like 22,000.00000 for example).
					}
					return (force2D && m.length > 6) ? [m[0], m[1], m[4], m[5], m[12], m[13]] : m;
				},
	
				/**
				 * Parses the transform values for an element, returning an object with x, y, z, scaleX, scaleY, scaleZ, rotation, rotationX, rotationY, skewX, and skewY properties. Note: by default (for performance reasons), all skewing is combined into skewX and rotation but skewY still has a place in the transform object so that we can record how much of the skew is attributed to skewX vs skewY. Remember, a skewY of 10 looks the same as a rotation of 10 and skewX of -10.
				 * @param {!Object} t target element
				 * @param {Object=} cs computed style object (optional)
				 * @param {boolean=} rec if true, the transform values will be recorded to the target element's _gsTransform object, like target._gsTransform = {x:0, y:0, z:0, scaleX:1...}
				 * @param {boolean=} parse if true, we'll ignore any _gsTransform values that already exist on the element, and force a reparsing of the css (calculated style)
				 * @return {object} object containing all of the transform properties/values like {x:0, y:0, z:0, scaleX:1...}
				 */
				_getTransform = _internals.getTransform = function(t, cs, rec, parse) {
					if (t._gsTransform && rec && !parse) {
						return t._gsTransform; //if the element already has a _gsTransform, use that. Note: some browsers don't accurately return the calculated style for the transform (particularly for SVG), so it's almost always safest to just use the values we've already applied rather than re-parsing things.
					}
					var tm = rec ? t._gsTransform || new Transform() : new Transform(),
						invX = (tm.scaleX < 0), //in order to interpret things properly, we need to know if the user applied a negative scaleX previously so that we can adjust the rotation and skewX accordingly. Otherwise, if we always interpret a flipped matrix as affecting scaleY and the user only wants to tween the scaleX on multiple sequential tweens, it would keep the negative scaleY without that being the user's intent.
						min = 0.00002,
						rnd = 100000,
						zOrigin = _supports3D ? parseFloat(_getStyle(t, _transformOriginProp, cs, false, "0 0 0").split(" ")[2]) || tm.zOrigin  || 0 : 0,
						defaultTransformPerspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0,
						m, i, scaleX, scaleY, rotation, skewX;
	
					tm.svg = !!(t.getBBox && _isSVG(t));
					if (tm.svg) {
						_parseSVGOrigin(t, _getStyle(t, _transformOriginProp, _cs, false, "50% 50%") + "", tm, t.getAttribute("data-svg-origin"));
						_useSVGTransformAttr = CSSPlugin.useSVGTransformAttr || _forceSVGTransformAttr;
					}
					m = _getMatrix(t);
					if (m !== _identity2DMatrix) {
	
						if (m.length === 16) {
							//we'll only look at these position-related 6 variables first because if x/y/z all match, it's relatively safe to assume we don't need to re-parse everything which risks losing important rotational information (like rotationX:180 plus rotationY:180 would look the same as rotation:180 - there's no way to know for sure which direction was taken based solely on the matrix3d() values)
							var a11 = m[0], a21 = m[1], a31 = m[2], a41 = m[3],
								a12 = m[4], a22 = m[5], a32 = m[6], a42 = m[7],
								a13 = m[8], a23 = m[9], a33 = m[10],
								a14 = m[12], a24 = m[13], a34 = m[14],
								a43 = m[11],
								angle = Math.atan2(a32, a33),
								t1, t2, t3, t4, cos, sin;
	
							//we manually compensate for non-zero z component of transformOrigin to work around bugs in Safari
							if (tm.zOrigin) {
								a34 = -tm.zOrigin;
								a14 = a13*a34-m[12];
								a24 = a23*a34-m[13];
								a34 = a33*a34+tm.zOrigin-m[14];
							}
							tm.rotationX = angle * _RAD2DEG;
							//rotationX
							if (angle) {
								cos = Math.cos(-angle);
								sin = Math.sin(-angle);
								t1 = a12*cos+a13*sin;
								t2 = a22*cos+a23*sin;
								t3 = a32*cos+a33*sin;
								a13 = a12*-sin+a13*cos;
								a23 = a22*-sin+a23*cos;
								a33 = a32*-sin+a33*cos;
								a43 = a42*-sin+a43*cos;
								a12 = t1;
								a22 = t2;
								a32 = t3;
							}
							//rotationY
							angle = Math.atan2(-a31, a33);
							tm.rotationY = angle * _RAD2DEG;
							if (angle) {
								cos = Math.cos(-angle);
								sin = Math.sin(-angle);
								t1 = a11*cos-a13*sin;
								t2 = a21*cos-a23*sin;
								t3 = a31*cos-a33*sin;
								a23 = a21*sin+a23*cos;
								a33 = a31*sin+a33*cos;
								a43 = a41*sin+a43*cos;
								a11 = t1;
								a21 = t2;
								a31 = t3;
							}
							//rotationZ
							angle = Math.atan2(a21, a11);
							tm.rotation = angle * _RAD2DEG;
							if (angle) {
								cos = Math.cos(-angle);
								sin = Math.sin(-angle);
								a11 = a11*cos+a12*sin;
								t2 = a21*cos+a22*sin;
								a22 = a21*-sin+a22*cos;
								a32 = a31*-sin+a32*cos;
								a21 = t2;
							}
	
							if (tm.rotationX && Math.abs(tm.rotationX) + Math.abs(tm.rotation) > 359.9) { //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
								tm.rotationX = tm.rotation = 0;
								tm.rotationY = 180 - tm.rotationY;
							}
	
							tm.scaleX = ((Math.sqrt(a11 * a11 + a21 * a21) * rnd + 0.5) | 0) / rnd;
							tm.scaleY = ((Math.sqrt(a22 * a22 + a23 * a23) * rnd + 0.5) | 0) / rnd;
							tm.scaleZ = ((Math.sqrt(a32 * a32 + a33 * a33) * rnd + 0.5) | 0) / rnd;
							tm.skewX = 0;
							tm.perspective = a43 ? 1 / ((a43 < 0) ? -a43 : a43) : 0;
							tm.x = a14;
							tm.y = a24;
							tm.z = a34;
							if (tm.svg) {
								tm.x -= tm.xOrigin - (tm.xOrigin * a11 - tm.yOrigin * a12);
								tm.y -= tm.yOrigin - (tm.yOrigin * a21 - tm.xOrigin * a22);
							}
	
						} else if ((!_supports3D || parse || !m.length || tm.x !== m[4] || tm.y !== m[5] || (!tm.rotationX && !tm.rotationY)) && !(tm.x !== undefined && _getStyle(t, "display", cs) === "none")) { //sometimes a 6-element matrix is returned even when we performed 3D transforms, like if rotationX and rotationY are 180. In cases like this, we still need to honor the 3D transforms. If we just rely on the 2D info, it could affect how the data is interpreted, like scaleY might get set to -1 or rotation could get offset by 180 degrees. For example, do a TweenLite.to(element, 1, {css:{rotationX:180, rotationY:180}}) and then later, TweenLite.to(element, 1, {css:{rotationX:0}}) and without this conditional logic in place, it'd jump to a state of being unrotated when the 2nd tween starts. Then again, we need to honor the fact that the user COULD alter the transforms outside of CSSPlugin, like by manually applying new css, so we try to sense that by looking at x and y because if those changed, we know the changes were made outside CSSPlugin and we force a reinterpretation of the matrix values. Also, in Webkit browsers, if the element's "display" is "none", its calculated style value will always return empty, so if we've already recorded the values in the _gsTransform object, we'll just rely on those.
							var k = (m.length >= 6),
								a = k ? m[0] : 1,
								b = m[1] || 0,
								c = m[2] || 0,
								d = k ? m[3] : 1;
							tm.x = m[4] || 0;
							tm.y = m[5] || 0;
							scaleX = Math.sqrt(a * a + b * b);
							scaleY = Math.sqrt(d * d + c * c);
							rotation = (a || b) ? Math.atan2(b, a) * _RAD2DEG : tm.rotation || 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).
							skewX = (c || d) ? Math.atan2(c, d) * _RAD2DEG + rotation : tm.skewX || 0;
							if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
								if (invX) {
									scaleX *= -1;
									skewX += (rotation <= 0) ? 180 : -180;
									rotation += (rotation <= 0) ? 180 : -180;
								} else {
									scaleY *= -1;
									skewX += (skewX <= 0) ? 180 : -180;
								}
							}
							tm.scaleX = scaleX;
							tm.scaleY = scaleY;
							tm.rotation = rotation;
							tm.skewX = skewX;
							if (_supports3D) {
								tm.rotationX = tm.rotationY = tm.z = 0;
								tm.perspective = defaultTransformPerspective;
								tm.scaleZ = 1;
							}
							if (tm.svg) {
								tm.x -= tm.xOrigin - (tm.xOrigin * a + tm.yOrigin * c);
								tm.y -= tm.yOrigin - (tm.xOrigin * b + tm.yOrigin * d);
							}
						}
						tm.zOrigin = zOrigin;
						//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 0 in these cases. The conditional logic here is faster than calling Math.abs(). Also, browsers tend to render a SLIGHTLY rotated object in a fuzzy way, so we need to snap to exactly 0 when appropriate.
						for (i in tm) {
							if (tm[i] < min) if (tm[i] > -min) {
								tm[i] = 0;
							}
						}
					}
					//DEBUG: _log("parsed rotation of " + t.getAttribute("id")+": "+(tm.rotationX)+", "+(tm.rotationY)+", "+(tm.rotation)+", scale: "+tm.scaleX+", "+tm.scaleY+", "+tm.scaleZ+", position: "+tm.x+", "+tm.y+", "+tm.z+", perspective: "+tm.perspective+ ", origin: "+ tm.xOrigin+ ","+ tm.yOrigin);
					if (rec) {
						t._gsTransform = tm; //record to the object's _gsTransform which we use so that tweens can control individual properties independently (we need all the properties to accurately recompose the matrix in the setRatio() method)
						if (tm.svg) { //if we're supposed to apply transforms to the SVG element's "transform" attribute, make sure there aren't any CSS transforms applied or they'll override the attribute ones. Also clear the transform attribute if we're using CSS, just to be clean.
							if (_useSVGTransformAttr && t.style[_transformProp]) {
								TweenLite.delayedCall(0.001, function(){ //if we apply this right away (before anything has rendered), we risk there being no transforms for a brief moment and it also interferes with adjusting the transformOrigin in a tween with immediateRender:true (it'd try reading the matrix and it wouldn't have the appropriate data in place because we just removed it).
									_removeProp(t.style, _transformProp);
								});
							} else if (!_useSVGTransformAttr && t.getAttribute("transform")) {
								TweenLite.delayedCall(0.001, function(){
									t.removeAttribute("transform");
								});
							}
						}
					}
					return tm;
				},
	
				//for setting 2D transforms in IE6, IE7, and IE8 (must use a "filter" to emulate the behavior of modern day browser transforms)
				_setIETransformRatio = function(v) {
					var t = this.data, //refers to the element's _gsTransform object
						ang = -t.rotation * _DEG2RAD,
						skew = ang + t.skewX * _DEG2RAD,
						rnd = 100000,
						a = ((Math.cos(ang) * t.scaleX * rnd) | 0) / rnd,
						b = ((Math.sin(ang) * t.scaleX * rnd) | 0) / rnd,
						c = ((Math.sin(skew) * -t.scaleY * rnd) | 0) / rnd,
						d = ((Math.cos(skew) * t.scaleY * rnd) | 0) / rnd,
						style = this.t.style,
						cs = this.t.currentStyle,
						filters, val;
					if (!cs) {
						return;
					}
					val = b; //just for swapping the variables an inverting them (reused "val" to avoid creating another variable in memory). IE's filter matrix uses a non-standard matrix configuration (angle goes the opposite way, and b and c are reversed and inverted)
					b = -c;
					c = -val;
					filters = cs.filter;
					style.filter = ""; //remove filters so that we can accurately measure offsetWidth/offsetHeight
					var w = this.t.offsetWidth,
						h = this.t.offsetHeight,
						clip = (cs.position !== "absolute"),
						m = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + b + ", M21=" + c + ", M22=" + d,
						ox = t.x + (w * t.xPercent / 100),
						oy = t.y + (h * t.yPercent / 100),
						dx, dy;
	
					//if transformOrigin is being used, adjust the offset x and y
					if (t.ox != null) {
						dx = ((t.oxp) ? w * t.ox * 0.01 : t.ox) - w / 2;
						dy = ((t.oyp) ? h * t.oy * 0.01 : t.oy) - h / 2;
						ox += dx - (dx * a + dy * b);
						oy += dy - (dx * c + dy * d);
					}
	
					if (!clip) {
						m += ", sizingMethod='auto expand')";
					} else {
						dx = (w / 2);
						dy = (h / 2);
						//translate to ensure that transformations occur around the correct origin (default is center).
						m += ", Dx=" + (dx - (dx * a + dy * b) + ox) + ", Dy=" + (dy - (dx * c + dy * d) + oy) + ")";
					}
					if (filters.indexOf("DXImageTransform.Microsoft.Matrix(") !== -1) {
						style.filter = filters.replace(_ieSetMatrixExp, m);
					} else {
						style.filter = m + " " + filters; //we must always put the transform/matrix FIRST (before alpha(opacity=xx)) to avoid an IE bug that slices part of the object when rotation is applied with alpha.
					}
	
					//at the end or beginning of the tween, if the matrix is normal (1, 0, 0, 1) and opacity is 100 (or doesn't exist), remove the filter to improve browser performance.
					if (v === 0 || v === 1) if (a === 1) if (b === 0) if (c === 0) if (d === 1) if (!clip || m.indexOf("Dx=0, Dy=0") !== -1) if (!_opacityExp.test(filters) || parseFloat(RegExp.$1) === 100) if (filters.indexOf("gradient(" && filters.indexOf("Alpha")) === -1) {
						style.removeAttribute("filter");
					}
	
					//we must set the margins AFTER applying the filter in order to avoid some bugs in IE8 that could (in rare scenarios) cause them to be ignored intermittently (vibration).
					if (!clip) {
						var mult = (_ieVers < 8) ? 1 : -1, //in Internet Explorer 7 and before, the box model is broken, causing the browser to treat the width/height of the actual rotated filtered image as the width/height of the box itself, but Microsoft corrected that in IE8. We must use a negative offset in IE8 on the right/bottom
							marg, prop, dif;
						dx = t.ieOffsetX || 0;
						dy = t.ieOffsetY || 0;
						t.ieOffsetX = Math.round((w - ((a < 0 ? -a : a) * w + (b < 0 ? -b : b) * h)) / 2 + ox);
						t.ieOffsetY = Math.round((h - ((d < 0 ? -d : d) * h + (c < 0 ? -c : c) * w)) / 2 + oy);
						for (i = 0; i < 4; i++) {
							prop = _margins[i];
							marg = cs[prop];
							//we need to get the current margin in case it is being tweened separately (we want to respect that tween's changes)
							val = (marg.indexOf("px") !== -1) ? parseFloat(marg) : _convertToPixels(this.t, prop, parseFloat(marg), marg.replace(_suffixExp, "")) || 0;
							if (val !== t[prop]) {
								dif = (i < 2) ? -t.ieOffsetX : -t.ieOffsetY; //if another tween is controlling a margin, we cannot only apply the difference in the ieOffsets, so we essentially zero-out the dx and dy here in that case. We record the margin(s) later so that we can keep comparing them, making this code very flexible.
							} else {
								dif = (i < 2) ? dx - t.ieOffsetX : dy - t.ieOffsetY;
							}
							style[prop] = (t[prop] = Math.round( val - dif * ((i === 0 || i === 2) ? 1 : mult) )) + "px";
						}
					}
				},
	
				/* translates a super small decimal to a string WITHOUT scientific notation
				_safeDecimal = function(n) {
					var s = (n < 0 ? -n : n) + "",
						a = s.split("e-");
					return (n < 0 ? "-0." : "0.") + new Array(parseInt(a[1], 10) || 0).join("0") + a[0].split(".").join("");
				},
				*/
	
				_setTransformRatio = _internals.set3DTransformRatio = _internals.setTransformRatio = function(v) {
					var t = this.data, //refers to the element's _gsTransform object
						style = this.t.style,
						angle = t.rotation,
						rotationX = t.rotationX,
						rotationY = t.rotationY,
						sx = t.scaleX,
						sy = t.scaleY,
						sz = t.scaleZ,
						x = t.x,
						y = t.y,
						z = t.z,
						isSVG = t.svg,
						perspective = t.perspective,
						force3D = t.force3D,
						a11, a12, a13, a21, a22, a23, a31, a32, a33, a41, a42, a43,
						zOrigin, min, cos, sin, t1, t2, transform, comma, zero, skew, rnd;
					//check to see if we should render as 2D (and SVGs must use 2D when _useSVGTransformAttr is true)
					if (((((v === 1 || v === 0) && force3D === "auto" && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime)) || !force3D) && !z && !perspective && !rotationY && !rotationX && sz === 1) || (_useSVGTransformAttr && isSVG) || !_supports3D) { //on the final render (which could be 0 for a from tween), if there are no 3D aspects, render in 2D to free up memory and improve performance especially on mobile devices. Check the tween's totalTime/totalDuration too in order to make sure it doesn't happen between repeats if it's a repeating tween.
	
						//2D
						if (angle || t.skewX || isSVG) {
							angle *= _DEG2RAD;
							skew = t.skewX * _DEG2RAD;
							rnd = 100000;
							a11 = Math.cos(angle) * sx;
							a21 = Math.sin(angle) * sx;
							a12 = Math.sin(angle - skew) * -sy;
							a22 = Math.cos(angle - skew) * sy;
							if (skew && t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
								t1 = Math.tan(skew);
								t1 = Math.sqrt(1 + t1 * t1);
								a12 *= t1;
								a22 *= t1;
								if (t.skewY) {
									a11 *= t1;
									a21 *= t1;
								}
							}
							if (isSVG) {
								x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
								y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
								if (_useSVGTransformAttr && (t.xPercent || t.yPercent)) { //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the matrix to simulate it.
									min = this.t.getBBox();
									x += t.xPercent * 0.01 * min.width;
									y += t.yPercent * 0.01 * min.height;
								}
								min = 0.000001;
								if (x < min) if (x > -min) {
									x = 0;
								}
								if (y < min) if (y > -min) {
									y = 0;
								}
							}
							transform = (((a11 * rnd) | 0) / rnd) + "," + (((a21 * rnd) | 0) / rnd) + "," + (((a12 * rnd) | 0) / rnd) + "," + (((a22 * rnd) | 0) / rnd) + "," + x + "," + y + ")";
							if (isSVG && _useSVGTransformAttr) {
								this.t.setAttribute("transform", "matrix(" + transform);
							} else {
								//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 5 decimal places.
								style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + transform;
							}
						} else {
							style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + sx + ",0,0," + sy + "," + x + "," + y + ")";
						}
						return;
	
					}
					if (_isFirefox) { //Firefox has a bug (at least in v25) that causes it to render the transparent part of 32-bit PNG images as black when displayed inside an iframe and the 3D scale is very small and doesn't change sufficiently enough between renders (like if you use a Power4.easeInOut to scale from 0 to 1 where the beginning values only change a tiny amount to begin the tween before accelerating). In this case, we force the scale to be 0.00002 instead which is visually the same but works around the Firefox issue.
						min = 0.0001;
						if (sx < min && sx > -min) {
							sx = sz = 0.00002;
						}
						if (sy < min && sy > -min) {
							sy = sz = 0.00002;
						}
						if (perspective && !t.z && !t.rotationX && !t.rotationY) { //Firefox has a bug that causes elements to have an odd super-thin, broken/dotted black border on elements that have a perspective set but aren't utilizing 3D space (no rotationX, rotationY, or z).
							perspective = 0;
						}
					}
					if (angle || t.skewX) {
						angle *= _DEG2RAD;
						cos = a11 = Math.cos(angle);
						sin = a21 = Math.sin(angle);
						if (t.skewX) {
							angle -= t.skewX * _DEG2RAD;
							cos = Math.cos(angle);
							sin = Math.sin(angle);
							if (t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
								t1 = Math.tan(t.skewX * _DEG2RAD);
								t1 = Math.sqrt(1 + t1 * t1);
								cos *= t1;
								sin *= t1;
								if (t.skewY) {
									a11 *= t1;
									a21 *= t1;
								}
							}
						}
						a12 = -sin;
						a22 = cos;
	
					} else if (!rotationY && !rotationX && sz === 1 && !perspective && !isSVG) { //if we're only translating and/or 2D scaling, this is faster...
						style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) translate3d(" : "translate3d(") + x + "px," + y + "px," + z +"px)" + ((sx !== 1 || sy !== 1) ? " scale(" + sx + "," + sy + ")" : "");
						return;
					} else {
						a11 = a22 = 1;
						a12 = a21 = 0;
					}
					// KEY  INDEX   AFFECTS
					// a11  0       rotation, rotationY, scaleX
					// a21  1       rotation, rotationY, scaleX
					// a31  2       rotationY, scaleX
					// a41  3       rotationY, scaleX
					// a12  4       rotation, skewX, rotationX, scaleY
					// a22  5       rotation, skewX, rotationX, scaleY
					// a32  6       rotationX, scaleY
					// a42  7       rotationX, scaleY
					// a13  8       rotationY, rotationX, scaleZ
					// a23  9       rotationY, rotationX, scaleZ
					// a33  10      rotationY, rotationX, scaleZ
					// a43  11      rotationY, rotationX, perspective, scaleZ
					// a14  12      x, zOrigin, svgOrigin
					// a24  13      y, zOrigin, svgOrigin
					// a34  14      z, zOrigin
					// a44  15
					// rotation: Math.atan2(a21, a11)
					// rotationY: Math.atan2(a13, a33) (or Math.atan2(a13, a11))
					// rotationX: Math.atan2(a32, a33)
					a33 = 1;
					a13 = a23 = a31 = a32 = a41 = a42 = 0;
					a43 = (perspective) ? -1 / perspective : 0;
					zOrigin = t.zOrigin;
					min = 0.000001; //threshold below which browsers use scientific notation which won't work.
					comma = ",";
					zero = "0";
					angle = rotationY * _DEG2RAD;
					if (angle) {
						cos = Math.cos(angle);
						sin = Math.sin(angle);
						a31 = -sin;
						a41 = a43*-sin;
						a13 = a11*sin;
						a23 = a21*sin;
						a33 = cos;
						a43 *= cos;
						a11 *= cos;
						a21 *= cos;
					}
					angle = rotationX * _DEG2RAD;
					if (angle) {
						cos = Math.cos(angle);
						sin = Math.sin(angle);
						t1 = a12*cos+a13*sin;
						t2 = a22*cos+a23*sin;
						a32 = a33*sin;
						a42 = a43*sin;
						a13 = a12*-sin+a13*cos;
						a23 = a22*-sin+a23*cos;
						a33 = a33*cos;
						a43 = a43*cos;
						a12 = t1;
						a22 = t2;
					}
					if (sz !== 1) {
						a13*=sz;
						a23*=sz;
						a33*=sz;
						a43*=sz;
					}
					if (sy !== 1) {
						a12*=sy;
						a22*=sy;
						a32*=sy;
						a42*=sy;
					}
					if (sx !== 1) {
						a11*=sx;
						a21*=sx;
						a31*=sx;
						a41*=sx;
					}
	
					if (zOrigin || isSVG) {
						if (zOrigin) {
							x += a13*-zOrigin;
							y += a23*-zOrigin;
							z += a33*-zOrigin+zOrigin;
						}
						if (isSVG) { //due to bugs in some browsers, we need to manage the transform-origin of SVG manually
							x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
							y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
						}
						if (x < min && x > -min) {
							x = zero;
						}
						if (y < min && y > -min) {
							y = zero;
						}
						if (z < min && z > -min) {
							z = 0; //don't use string because we calculate perspective later and need the number.
						}
					}
	
					//optimized way of concatenating all the values into a string. If we do it all in one shot, it's slower because of the way browsers have to create temp strings and the way it affects memory. If we do it piece-by-piece with +=, it's a bit slower too. We found that doing it in these sized chunks works best overall:
					transform = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix3d(" : "matrix3d(");
					transform += ((a11 < min && a11 > -min) ? zero : a11) + comma + ((a21 < min && a21 > -min) ? zero : a21) + comma + ((a31 < min && a31 > -min) ? zero : a31);
					transform += comma + ((a41 < min && a41 > -min) ? zero : a41) + comma + ((a12 < min && a12 > -min) ? zero : a12) + comma + ((a22 < min && a22 > -min) ? zero : a22);
					if (rotationX || rotationY || sz !== 1) { //performance optimization (often there's no rotationX or rotationY, so we can skip these calculations)
						transform += comma + ((a32 < min && a32 > -min) ? zero : a32) + comma + ((a42 < min && a42 > -min) ? zero : a42) + comma + ((a13 < min && a13 > -min) ? zero : a13);
						transform += comma + ((a23 < min && a23 > -min) ? zero : a23) + comma + ((a33 < min && a33 > -min) ? zero : a33) + comma + ((a43 < min && a43 > -min) ? zero : a43) + comma;
					} else {
						transform += ",0,0,0,0,1,0,";
					}
					transform += x + comma + y + comma + z + comma + (perspective ? (1 + (-z / perspective)) : 1) + ")";
	
					style[_transformProp] = transform;
				};
	
			p = Transform.prototype;
			p.x = p.y = p.z = p.skewX = p.skewY = p.rotation = p.rotationX = p.rotationY = p.zOrigin = p.xPercent = p.yPercent = p.xOffset = p.yOffset = 0;
			p.scaleX = p.scaleY = p.scaleZ = 1;
	
			_registerComplexSpecialProp("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {parser:function(t, e, p, cssp, pt, plugin, vars) {
				if (cssp._lastParsedTransform === vars) { return pt; } //only need to parse the transform once, and only if the browser supports it.
				cssp._lastParsedTransform = vars;
				var originalGSTransform = t._gsTransform,
					style = t.style,
					min = 0.000001,
					i = _transformProps.length,
					v = vars,
					endRotations = {},
					transformOriginString = "transformOrigin",
					m1, m2, skewY, copy, orig, has3D, hasChange, dr, x, y;
				if (vars.display) { //if the user is setting display during this tween, it may not be instantiated yet but we must force it here in order to get accurate readings. If display is "none", some browsers refuse to report the transform properties correctly.
					copy = _getStyle(t, "display");
					style.display = "block";
					m1 = _getTransform(t, _cs, true, vars.parseTransform);
					style.display = copy;
				} else {
					m1 = _getTransform(t, _cs, true, vars.parseTransform);
				}
				cssp._transform = m1;
				if (typeof(v.transform) === "string" && _transformProp) { //for values like transform:"rotate(60deg) scale(0.5, 0.8)"
					copy = _tempDiv.style; //don't use the original target because it might be SVG in which case some browsers don't report computed style correctly.
					copy[_transformProp] = v.transform;
					copy.display = "block"; //if display is "none", the browser often refuses to report the transform properties correctly.
					copy.position = "absolute";
					_doc.body.appendChild(_tempDiv);
					m2 = _getTransform(_tempDiv, null, false);
					_doc.body.removeChild(_tempDiv);
					if (!m2.perspective) {
						m2.perspective = m1.perspective; //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
					}
					if (v.xPercent != null) {
						m2.xPercent = _parseVal(v.xPercent, m1.xPercent);
					}
					if (v.yPercent != null) {
						m2.yPercent = _parseVal(v.yPercent, m1.yPercent);
					}
				} else if (typeof(v) === "object") { //for values like scaleX, scaleY, rotation, x, y, skewX, and skewY or transform:{...} (object)
					m2 = {scaleX:_parseVal((v.scaleX != null) ? v.scaleX : v.scale, m1.scaleX),
						scaleY:_parseVal((v.scaleY != null) ? v.scaleY : v.scale, m1.scaleY),
						scaleZ:_parseVal(v.scaleZ, m1.scaleZ),
						x:_parseVal(v.x, m1.x),
						y:_parseVal(v.y, m1.y),
						z:_parseVal(v.z, m1.z),
						xPercent:_parseVal(v.xPercent, m1.xPercent),
						yPercent:_parseVal(v.yPercent, m1.yPercent),
						perspective:_parseVal(v.transformPerspective, m1.perspective)};
					dr = v.directionalRotation;
					if (dr != null) {
						if (typeof(dr) === "object") {
							for (copy in dr) {
								v[copy] = dr[copy];
							}
						} else {
							v.rotation = dr;
						}
					}
					if (typeof(v.x) === "string" && v.x.indexOf("%") !== -1) {
						m2.x = 0;
						m2.xPercent = _parseVal(v.x, m1.xPercent);
					}
					if (typeof(v.y) === "string" && v.y.indexOf("%") !== -1) {
						m2.y = 0;
						m2.yPercent = _parseVal(v.y, m1.yPercent);
					}
	
					m2.rotation = _parseAngle(("rotation" in v) ? v.rotation : ("shortRotation" in v) ? v.shortRotation + "_short" : ("rotationZ" in v) ? v.rotationZ : m1.rotation, m1.rotation, "rotation", endRotations);
					if (_supports3D) {
						m2.rotationX = _parseAngle(("rotationX" in v) ? v.rotationX : ("shortRotationX" in v) ? v.shortRotationX + "_short" : m1.rotationX || 0, m1.rotationX, "rotationX", endRotations);
						m2.rotationY = _parseAngle(("rotationY" in v) ? v.rotationY : ("shortRotationY" in v) ? v.shortRotationY + "_short" : m1.rotationY || 0, m1.rotationY, "rotationY", endRotations);
					}
					m2.skewX = (v.skewX == null) ? m1.skewX : _parseAngle(v.skewX, m1.skewX);
	
					//note: for performance reasons, we combine all skewing into the skewX and rotation values, ignoring skewY but we must still record it so that we can discern how much of the overall skew is attributed to skewX vs. skewY. Otherwise, if the skewY would always act relative (tween skewY to 10deg, for example, multiple times and if we always combine things into skewX, we can't remember that skewY was 10 from last time). Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of -10 degrees.
					m2.skewY = (v.skewY == null) ? m1.skewY : _parseAngle(v.skewY, m1.skewY);
					if ((skewY = m2.skewY - m1.skewY)) {
						m2.skewX += skewY;
						m2.rotation += skewY;
					}
				}
				if (_supports3D && v.force3D != null) {
					m1.force3D = v.force3D;
					hasChange = true;
				}
	
				m1.skewType = v.skewType || m1.skewType || CSSPlugin.defaultSkewType;
	
				has3D = (m1.force3D || m1.z || m1.rotationX || m1.rotationY || m2.z || m2.rotationX || m2.rotationY || m2.perspective);
				if (!has3D && v.scale != null) {
					m2.scaleZ = 1; //no need to tween scaleZ.
				}
	
				while (--i > -1) {
					p = _transformProps[i];
					orig = m2[p] - m1[p];
					if (orig > min || orig < -min || v[p] != null || _forcePT[p] != null) {
						hasChange = true;
						pt = new CSSPropTween(m1, p, m1[p], orig, pt);
						if (p in endRotations) {
							pt.e = endRotations[p]; //directional rotations typically have compensated values during the tween, but we need to make sure they end at exactly what the user requested
						}
						pt.xs0 = 0; //ensures the value stays numeric in setRatio()
						pt.plugin = plugin;
						cssp._overwriteProps.push(pt.n);
					}
				}
	
				orig = v.transformOrigin;
				if (m1.svg && (orig || v.svgOrigin)) {
					x = m1.xOffset; //when we change the origin, in order to prevent things from jumping we adjust the x/y so we must record those here so that we can create PropTweens for them and flip them at the same time as the origin
					y = m1.yOffset;
					_parseSVGOrigin(t, _parsePosition(orig), m2, v.svgOrigin, v.smoothOrigin);
					pt = _addNonTweeningNumericPT(m1, "xOrigin", (originalGSTransform ? m1 : m2).xOrigin, m2.xOrigin, pt, transformOriginString); //note: if there wasn't a transformOrigin defined yet, just start with the destination one; it's wasteful otherwise, and it causes problems with fromTo() tweens. For example, TweenLite.to("#wheel", 3, {rotation:180, transformOrigin:"50% 50%", delay:1}); TweenLite.fromTo("#wheel", 3, {scale:0.5, transformOrigin:"50% 50%"}, {scale:1, delay:2}); would cause a jump when the from values revert at the beginning of the 2nd tween.
					pt = _addNonTweeningNumericPT(m1, "yOrigin", (originalGSTransform ? m1 : m2).yOrigin, m2.yOrigin, pt, transformOriginString);
					if (x !== m1.xOffset || y !== m1.yOffset) {
						pt = _addNonTweeningNumericPT(m1, "xOffset", (originalGSTransform ? x : m1.xOffset), m1.xOffset, pt, transformOriginString);
						pt = _addNonTweeningNumericPT(m1, "yOffset", (originalGSTransform ? y : m1.yOffset), m1.yOffset, pt, transformOriginString);
					}
					orig = _useSVGTransformAttr ? null : "0px 0px"; //certain browsers (like firefox) completely botch transform-origin, so we must remove it to prevent it from contaminating transforms. We manage it ourselves with xOrigin and yOrigin
				}
				if (orig || (_supports3D && has3D && m1.zOrigin)) { //if anything 3D is happening and there's a transformOrigin with a z component that's non-zero, we must ensure that the transformOrigin's z-component is set to 0 so that we can manually do those calculations to get around Safari bugs. Even if the user didn't specifically define a "transformOrigin" in this particular tween (maybe they did it via css directly).
					if (_transformProp) {
						hasChange = true;
						p = _transformOriginProp;
						orig = (orig || _getStyle(t, p, _cs, false, "50% 50%")) + ""; //cast as string to avoid errors
						pt = new CSSPropTween(style, p, 0, 0, pt, -1, transformOriginString);
						pt.b = style[p];
						pt.plugin = plugin;
						if (_supports3D) {
							copy = m1.zOrigin;
							orig = orig.split(" ");
							m1.zOrigin = ((orig.length > 2 && !(copy !== 0 && orig[2] === "0px")) ? parseFloat(orig[2]) : copy) || 0; //Safari doesn't handle the z part of transformOrigin correctly, so we'll manually handle it in the _set3DTransformRatio() method.
							pt.xs0 = pt.e = orig[0] + " " + (orig[1] || "50%") + " 0px"; //we must define a z value of 0px specifically otherwise iOS 5 Safari will stick with the old one (if one was defined)!
							pt = new CSSPropTween(m1, "zOrigin", 0, 0, pt, -1, pt.n); //we must create a CSSPropTween for the _gsTransform.zOrigin so that it gets reset properly at the beginning if the tween runs backward (as opposed to just setting m1.zOrigin here)
							pt.b = copy;
							pt.xs0 = pt.e = m1.zOrigin;
						} else {
							pt.xs0 = pt.e = orig;
						}
	
						//for older versions of IE (6-8), we need to manually calculate things inside the setRatio() function. We record origin x and y (ox and oy) and whether or not the values are percentages (oxp and oyp).
					} else {
						_parsePosition(orig + "", m1);
					}
				}
				if (hasChange) {
					cssp._transformType = (!(m1.svg && _useSVGTransformAttr) && (has3D || this._transformType === 3)) ? 3 : 2; //quicker than calling cssp._enableTransforms();
				}
				return pt;
			}, prefix:true});
	
			_registerComplexSpecialProp("boxShadow", {defaultValue:"0px 0px 0px 0px #999", prefix:true, color:true, multi:true, keyword:"inset"});
	
			_registerComplexSpecialProp("borderRadius", {defaultValue:"0px", parser:function(t, e, p, cssp, pt, plugin) {
				e = this.format(e);
				var props = ["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],
					style = t.style,
					ea1, i, es2, bs2, bs, es, bn, en, w, h, esfx, bsfx, rel, hn, vn, em;
				w = parseFloat(t.offsetWidth);
				h = parseFloat(t.offsetHeight);
				ea1 = e.split(" ");
				for (i = 0; i < props.length; i++) { //if we're dealing with percentages, we must convert things separately for the horizontal and vertical axis!
					if (this.p.indexOf("border")) { //older browsers used a prefix
						props[i] = _checkPropPrefix(props[i]);
					}
					bs = bs2 = _getStyle(t, props[i], _cs, false, "0px");
					if (bs.indexOf(" ") !== -1) {
						bs2 = bs.split(" ");
						bs = bs2[0];
						bs2 = bs2[1];
					}
					es = es2 = ea1[i];
					bn = parseFloat(bs);
					bsfx = bs.substr((bn + "").length);
					rel = (es.charAt(1) === "=");
					if (rel) {
						en = parseInt(es.charAt(0)+"1", 10);
						es = es.substr(2);
						en *= parseFloat(es);
						esfx = es.substr((en + "").length - (en < 0 ? 1 : 0)) || "";
					} else {
						en = parseFloat(es);
						esfx = es.substr((en + "").length);
					}
					if (esfx === "") {
						esfx = _suffixMap[p] || bsfx;
					}
					if (esfx !== bsfx) {
						hn = _convertToPixels(t, "borderLeft", bn, bsfx); //horizontal number (we use a bogus "borderLeft" property just because the _convertToPixels() method searches for the keywords "Left", "Right", "Top", and "Bottom" to determine of it's a horizontal or vertical property, and we need "border" in the name so that it knows it should measure relative to the element itself, not its parent.
						vn = _convertToPixels(t, "borderTop", bn, bsfx); //vertical number
						if (esfx === "%") {
							bs = (hn / w * 100) + "%";
							bs2 = (vn / h * 100) + "%";
						} else if (esfx === "em") {
							em = _convertToPixels(t, "borderLeft", 1, "em");
							bs = (hn / em) + "em";
							bs2 = (vn / em) + "em";
						} else {
							bs = hn + "px";
							bs2 = vn + "px";
						}
						if (rel) {
							es = (parseFloat(bs) + en) + esfx;
							es2 = (parseFloat(bs2) + en) + esfx;
						}
					}
					pt = _parseComplex(style, props[i], bs + " " + bs2, es + " " + es2, false, "0px", pt);
				}
				return pt;
			}, prefix:true, formatter:_getFormatter("0px 0px 0px 0px", false, true)});
			_registerComplexSpecialProp("backgroundPosition", {defaultValue:"0 0", parser:function(t, e, p, cssp, pt, plugin) {
				var bp = "background-position",
					cs = (_cs || _getComputedStyle(t, null)),
					bs = this.format( ((cs) ? _ieVers ? cs.getPropertyValue(bp + "-x") + " " + cs.getPropertyValue(bp + "-y") : cs.getPropertyValue(bp) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"), //Internet Explorer doesn't report background-position correctly - we must query background-position-x and background-position-y and combine them (even in IE10). Before IE9, we must do the same with the currentStyle object and use camelCase
					es = this.format(e),
					ba, ea, i, pct, overlap, src;
				if ((bs.indexOf("%") !== -1) !== (es.indexOf("%") !== -1)) {
					src = _getStyle(t, "backgroundImage").replace(_urlExp, "");
					if (src && src !== "none") {
						ba = bs.split(" ");
						ea = es.split(" ");
						_tempImg.setAttribute("src", src); //set the temp IMG's src to the background-image so that we can measure its width/height
						i = 2;
						while (--i > -1) {
							bs = ba[i];
							pct = (bs.indexOf("%") !== -1);
							if (pct !== (ea[i].indexOf("%") !== -1)) {
								overlap = (i === 0) ? t.offsetWidth - _tempImg.width : t.offsetHeight - _tempImg.height;
								ba[i] = pct ? (parseFloat(bs) / 100 * overlap) + "px" : (parseFloat(bs) / overlap * 100) + "%";
							}
						}
						bs = ba.join(" ");
					}
				}
				return this.parseComplex(t.style, bs, es, pt, plugin);
			}, formatter:_parsePosition});
			_registerComplexSpecialProp("backgroundSize", {defaultValue:"0 0", formatter:_parsePosition});
			_registerComplexSpecialProp("perspective", {defaultValue:"0px", prefix:true});
			_registerComplexSpecialProp("perspectiveOrigin", {defaultValue:"50% 50%", prefix:true});
			_registerComplexSpecialProp("transformStyle", {prefix:true});
			_registerComplexSpecialProp("backfaceVisibility", {prefix:true});
			_registerComplexSpecialProp("userSelect", {prefix:true});
			_registerComplexSpecialProp("margin", {parser:_getEdgeParser("marginTop,marginRight,marginBottom,marginLeft")});
			_registerComplexSpecialProp("padding", {parser:_getEdgeParser("paddingTop,paddingRight,paddingBottom,paddingLeft")});
			_registerComplexSpecialProp("clip", {defaultValue:"rect(0px,0px,0px,0px)", parser:function(t, e, p, cssp, pt, plugin){
				var b, cs, delim;
				if (_ieVers < 9) { //IE8 and earlier don't report a "clip" value in the currentStyle - instead, the values are split apart into clipTop, clipRight, clipBottom, and clipLeft. Also, in IE7 and earlier, the values inside rect() are space-delimited, not comma-delimited.
					cs = t.currentStyle;
					delim = _ieVers < 8 ? " " : ",";
					b = "rect(" + cs.clipTop + delim + cs.clipRight + delim + cs.clipBottom + delim + cs.clipLeft + ")";
					e = this.format(e).split(",").join(delim);
				} else {
					b = this.format(_getStyle(t, this.p, _cs, false, this.dflt));
					e = this.format(e);
				}
				return this.parseComplex(t.style, b, e, pt, plugin);
			}});
			_registerComplexSpecialProp("textShadow", {defaultValue:"0px 0px 0px #999", color:true, multi:true});
			_registerComplexSpecialProp("autoRound,strictUnits", {parser:function(t, e, p, cssp, pt) {return pt;}}); //just so that we can ignore these properties (not tween them)
			_registerComplexSpecialProp("border", {defaultValue:"0px solid #000", parser:function(t, e, p, cssp, pt, plugin) {
					return this.parseComplex(t.style, this.format(_getStyle(t, "borderTopWidth", _cs, false, "0px") + " " + _getStyle(t, "borderTopStyle", _cs, false, "solid") + " " + _getStyle(t, "borderTopColor", _cs, false, "#000")), this.format(e), pt, plugin);
				}, color:true, formatter:function(v) {
					var a = v.split(" ");
					return a[0] + " " + (a[1] || "solid") + " " + (v.match(_colorExp) || ["#000"])[0];
				}});
			_registerComplexSpecialProp("borderWidth", {parser:_getEdgeParser("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}); //Firefox doesn't pick up on borderWidth set in style sheets (only inline).
			_registerComplexSpecialProp("float,cssFloat,styleFloat", {parser:function(t, e, p, cssp, pt, plugin) {
				var s = t.style,
					prop = ("cssFloat" in s) ? "cssFloat" : "styleFloat";
				return new CSSPropTween(s, prop, 0, 0, pt, -1, p, false, 0, s[prop], e);
			}});
	
			//opacity-related
			var _setIEOpacityRatio = function(v) {
					var t = this.t, //refers to the element's style property
						filters = t.filter || _getStyle(this.data, "filter") || "",
						val = (this.s + this.c * v) | 0,
						skip;
					if (val === 100) { //for older versions of IE that need to use a filter to apply opacity, we should remove the filter if opacity hits 1 in order to improve performance, but make sure there isn't a transform (matrix) or gradient in the filters.
						if (filters.indexOf("atrix(") === -1 && filters.indexOf("radient(") === -1 && filters.indexOf("oader(") === -1) {
							t.removeAttribute("filter");
							skip = (!_getStyle(this.data, "filter")); //if a class is applied that has an alpha filter, it will take effect (we don't want that), so re-apply our alpha filter in that case. We must first remove it and then check.
						} else {
							t.filter = filters.replace(_alphaFilterExp, "");
							skip = true;
						}
					}
					if (!skip) {
						if (this.xn1) {
							t.filter = filters = filters || ("alpha(opacity=" + val + ")"); //works around bug in IE7/8 that prevents changes to "visibility" from being applied properly if the filter is changed to a different alpha on the same frame.
						}
						if (filters.indexOf("pacity") === -1) { //only used if browser doesn't support the standard opacity style property (IE 7 and 8). We omit the "O" to avoid case-sensitivity issues
							if (val !== 0 || !this.xn1) { //bugs in IE7/8 won't render the filter properly if opacity is ADDED on the same frame/render as "visibility" changes (this.xn1 is 1 if this tween is an "autoAlpha" tween)
								t.filter = filters + " alpha(opacity=" + val + ")"; //we round the value because otherwise, bugs in IE7/8 can prevent "visibility" changes from being applied properly.
							}
						} else {
							t.filter = filters.replace(_opacityExp, "opacity=" + val);
						}
					}
				};
			_registerComplexSpecialProp("opacity,alpha,autoAlpha", {defaultValue:"1", parser:function(t, e, p, cssp, pt, plugin) {
				var b = parseFloat(_getStyle(t, "opacity", _cs, false, "1")),
					style = t.style,
					isAutoAlpha = (p === "autoAlpha");
				if (typeof(e) === "string" && e.charAt(1) === "=") {
					e = ((e.charAt(0) === "-") ? -1 : 1) * parseFloat(e.substr(2)) + b;
				}
				if (isAutoAlpha && b === 1 && _getStyle(t, "visibility", _cs) === "hidden" && e !== 0) { //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
					b = 0;
				}
				if (_supportsOpacity) {
					pt = new CSSPropTween(style, "opacity", b, e - b, pt);
				} else {
					pt = new CSSPropTween(style, "opacity", b * 100, (e - b) * 100, pt);
					pt.xn1 = isAutoAlpha ? 1 : 0; //we need to record whether or not this is an autoAlpha so that in the setRatio(), we know to duplicate the setting of the alpha in order to work around a bug in IE7 and IE8 that prevents changes to "visibility" from taking effect if the filter is changed to a different alpha(opacity) at the same time. Setting it to the SAME value first, then the new value works around the IE7/8 bug.
					style.zoom = 1; //helps correct an IE issue.
					pt.type = 2;
					pt.b = "alpha(opacity=" + pt.s + ")";
					pt.e = "alpha(opacity=" + (pt.s + pt.c) + ")";
					pt.data = t;
					pt.plugin = plugin;
					pt.setRatio = _setIEOpacityRatio;
				}
				if (isAutoAlpha) { //we have to create the "visibility" PropTween after the opacity one in the linked list so that they run in the order that works properly in IE8 and earlier
					pt = new CSSPropTween(style, "visibility", 0, 0, pt, -1, null, false, 0, ((b !== 0) ? "inherit" : "hidden"), ((e === 0) ? "hidden" : "inherit"));
					pt.xs0 = "inherit";
					cssp._overwriteProps.push(pt.n);
					cssp._overwriteProps.push(p);
				}
				return pt;
			}});
	
	
			var _removeProp = function(s, p) {
					if (p) {
						if (s.removeProperty) {
							if (p.substr(0,2) === "ms" || p.substr(0,6) === "webkit") { //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
								p = "-" + p;
							}
							s.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
						} else { //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
							s.removeAttribute(p);
						}
					}
				},
				_setClassNameRatio = function(v) {
					this.t._gsClassPT = this;
					if (v === 1 || v === 0) {
						this.t.setAttribute("class", (v === 0) ? this.b : this.e);
						var mpt = this.data, //first MiniPropTween
							s = this.t.style;
						while (mpt) {
							if (!mpt.v) {
								_removeProp(s, mpt.p);
							} else {
								s[mpt.p] = mpt.v;
							}
							mpt = mpt._next;
						}
						if (v === 1 && this.t._gsClassPT === this) {
							this.t._gsClassPT = null;
						}
					} else if (this.t.getAttribute("class") !== this.e) {
						this.t.setAttribute("class", this.e);
					}
				};
			_registerComplexSpecialProp("className", {parser:function(t, e, p, cssp, pt, plugin, vars) {
				var b = t.getAttribute("class") || "", //don't use t.className because it doesn't work consistently on SVG elements; getAttribute("class") and setAttribute("class", value") is more reliable.
					cssText = t.style.cssText,
					difData, bs, cnpt, cnptLookup, mpt;
				pt = cssp._classNamePT = new CSSPropTween(t, p, 0, 0, pt, 2);
				pt.setRatio = _setClassNameRatio;
				pt.pr = -11;
				_hasPriority = true;
				pt.b = b;
				bs = _getAllStyles(t, _cs);
				//if there's a className tween already operating on the target, force it to its end so that the necessary inline styles are removed and the class name is applied before we determine the end state (we don't want inline styles interfering that were there just for class-specific values)
				cnpt = t._gsClassPT;
				if (cnpt) {
					cnptLookup = {};
					mpt = cnpt.data; //first MiniPropTween which stores the inline styles - we need to force these so that the inline styles don't contaminate things. Otherwise, there's a small chance that a tween could start and the inline values match the destination values and they never get cleaned.
					while (mpt) {
						cnptLookup[mpt.p] = 1;
						mpt = mpt._next;
					}
					cnpt.setRatio(1);
				}
				t._gsClassPT = pt;
				pt.e = (e.charAt(1) !== "=") ? e : b.replace(new RegExp("\\s*\\b" + e.substr(2) + "\\b"), "") + ((e.charAt(0) === "+") ? " " + e.substr(2) : "");
				t.setAttribute("class", pt.e);
				difData = _cssDif(t, bs, _getAllStyles(t), vars, cnptLookup);
				t.setAttribute("class", b);
				pt.data = difData.firstMPT;
				t.style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
				pt = pt.xfirst = cssp.parse(t, difData.difs, pt, plugin); //we record the CSSPropTween as the xfirst so that we can handle overwriting propertly (if "className" gets overwritten, we must kill all the properties associated with the className part of the tween, so we can loop through from xfirst to the pt itself)
				return pt;
			}});
	
	
			var _setClearPropsRatio = function(v) {
				if (v === 1 || v === 0) if (this.data._totalTime === this.data._totalDuration && this.data.data !== "isFromStart") { //this.data refers to the tween. Only clear at the END of the tween (remember, from() tweens make the ratio go from 1 to 0, so we can't just check that and if the tween is the zero-duration one that's created internally to render the starting values in a from() tween, ignore that because otherwise, for example, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in).
					var s = this.t.style,
						transformParse = _specialProps.transform.parse,
						a, p, i, clearTransform, transform;
					if (this.e === "all") {
						s.cssText = "";
						clearTransform = true;
					} else {
						a = this.e.split(" ").join("").split(",");
						i = a.length;
						while (--i > -1) {
							p = a[i];
							if (_specialProps[p]) {
								if (_specialProps[p].parse === transformParse) {
									clearTransform = true;
								} else {
									p = (p === "transformOrigin") ? _transformOriginProp : _specialProps[p].p; //ensures that special properties use the proper browser-specific property name, like "scaleX" might be "-webkit-transform" or "boxShadow" might be "-moz-box-shadow"
								}
							}
							_removeProp(s, p);
						}
					}
					if (clearTransform) {
						_removeProp(s, _transformProp);
						transform = this.t._gsTransform;
						if (transform) {
							if (transform.svg) {
								this.t.removeAttribute("data-svg-origin");
								this.t.removeAttribute("transform");
							}
							delete this.t._gsTransform;
						}
					}
	
				}
			};
			_registerComplexSpecialProp("clearProps", {parser:function(t, e, p, cssp, pt) {
				pt = new CSSPropTween(t, p, 0, 0, pt, 2);
				pt.setRatio = _setClearPropsRatio;
				pt.e = e;
				pt.pr = -10;
				pt.data = cssp._tween;
				_hasPriority = true;
				return pt;
			}});
	
			p = "bezier,throwProps,physicsProps,physics2D".split(",");
			i = p.length;
			while (i--) {
				_registerPluginProp(p[i]);
			}
	
	
	
	
	
	
	
	
			p = CSSPlugin.prototype;
			p._firstPT = p._lastParsedTransform = p._transform = null;
	
			//gets called when the tween renders for the first time. This kicks everything off, recording start/end values, etc.
			p._onInitTween = function(target, vars, tween) {
				if (!target.nodeType) { //css is only for dom elements
					return false;
				}
				this._target = target;
				this._tween = tween;
				this._vars = vars;
				_autoRound = vars.autoRound;
				_hasPriority = false;
				_suffixMap = vars.suffixMap || CSSPlugin.suffixMap;
				_cs = _getComputedStyle(target, "");
				_overwriteProps = this._overwriteProps;
				var style = target.style,
					v, pt, pt2, first, last, next, zIndex, tpt, threeD;
				if (_reqSafariFix) if (style.zIndex === "") {
					v = _getStyle(target, "zIndex", _cs);
					if (v === "auto" || v === "") {
						//corrects a bug in [non-Android] Safari that prevents it from repainting elements in their new positions if they don't have a zIndex set. We also can't just apply this inside _parseTransform() because anything that's moved in any way (like using "left" or "top" instead of transforms like "x" and "y") can be affected, so it is best to ensure that anything that's tweening has a z-index. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly. Plus zIndex is less memory-intensive.
						this._addLazySet(style, "zIndex", 0);
					}
				}
	
				if (typeof(vars) === "string") {
					first = style.cssText;
					v = _getAllStyles(target, _cs);
					style.cssText = first + ";" + vars;
					v = _cssDif(target, v, _getAllStyles(target)).difs;
					if (!_supportsOpacity && _opacityValExp.test(vars)) {
						v.opacity = parseFloat( RegExp.$1 );
					}
					vars = v;
					style.cssText = first;
				}
	
				if (vars.className) { //className tweens will combine any differences they find in the css with the vars that are passed in, so {className:"myClass", scale:0.5, left:20} would work.
					this._firstPT = pt = _specialProps.className.parse(target, vars.className, "className", this, null, null, vars);
				} else {
					this._firstPT = pt = this.parse(target, vars, null);
				}
	
				if (this._transformType) {
					threeD = (this._transformType === 3);
					if (!_transformProp) {
						style.zoom = 1; //helps correct an IE issue.
					} else if (_isSafari) {
						_reqSafariFix = true;
						//if zIndex isn't set, iOS Safari doesn't repaint things correctly sometimes (seemingly at random).
						if (style.zIndex === "") {
							zIndex = _getStyle(target, "zIndex", _cs);
							if (zIndex === "auto" || zIndex === "") {
								this._addLazySet(style, "zIndex", 0);
							}
						}
						//Setting WebkitBackfaceVisibility corrects 3 bugs:
						// 1) [non-Android] Safari skips rendering changes to "top" and "left" that are made on the same frame/render as a transform update.
						// 2) iOS Safari sometimes neglects to repaint elements in their new positions. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly.
						// 3) Safari sometimes displayed odd artifacts when tweening the transform (or WebkitTransform) property, like ghosts of the edges of the element remained. Definitely a browser bug.
						//Note: we allow the user to override the auto-setting by defining WebkitBackfaceVisibility in the vars of the tween.
						if (_isSafariLT6) {
							this._addLazySet(style, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (threeD ? "visible" : "hidden"));
						}
					}
					pt2 = pt;
					while (pt2 && pt2._next) {
						pt2 = pt2._next;
					}
					tpt = new CSSPropTween(target, "transform", 0, 0, null, 2);
					this._linkCSSP(tpt, null, pt2);
					tpt.setRatio = _transformProp ? _setTransformRatio : _setIETransformRatio;
					tpt.data = this._transform || _getTransform(target, _cs, true);
					tpt.tween = tween;
					tpt.pr = -1; //ensures that the transforms get applied after the components are updated.
					_overwriteProps.pop(); //we don't want to force the overwrite of all "transform" tweens of the target - we only care about individual transform properties like scaleX, rotation, etc. The CSSPropTween constructor automatically adds the property to _overwriteProps which is why we need to pop() here.
				}
	
				if (_hasPriority) {
					//reorders the linked list in order of pr (priority)
					while (pt) {
						next = pt._next;
						pt2 = first;
						while (pt2 && pt2.pr > pt.pr) {
							pt2 = pt2._next;
						}
						if ((pt._prev = pt2 ? pt2._prev : last)) {
							pt._prev._next = pt;
						} else {
							first = pt;
						}
						if ((pt._next = pt2)) {
							pt2._prev = pt;
						} else {
							last = pt;
						}
						pt = next;
					}
					this._firstPT = first;
				}
				return true;
			};
	
	
			p.parse = function(target, vars, pt, plugin) {
				var style = target.style,
					p, sp, bn, en, bs, es, bsfx, esfx, isStr, rel;
				for (p in vars) {
					es = vars[p]; //ending value string
					sp = _specialProps[p]; //SpecialProp lookup.
					if (sp) {
						pt = sp.parse(target, es, p, this, pt, plugin, vars);
	
					} else {
						bs = _getStyle(target, p, _cs) + "";
						isStr = (typeof(es) === "string");
						if (p === "color" || p === "fill" || p === "stroke" || p.indexOf("Color") !== -1 || (isStr && _rgbhslExp.test(es))) { //Opera uses background: to define color sometimes in addition to backgroundColor:
							if (!isStr) {
								es = _parseColor(es);
								es = ((es.length > 3) ? "rgba(" : "rgb(") + es.join(",") + ")";
							}
							pt = _parseComplex(style, p, bs, es, true, "transparent", pt, 0, plugin);
	
						} else if (isStr && (es.indexOf(" ") !== -1 || es.indexOf(",") !== -1)) {
							pt = _parseComplex(style, p, bs, es, true, null, pt, 0, plugin);
	
						} else {
							bn = parseFloat(bs);
							bsfx = (bn || bn === 0) ? bs.substr((bn + "").length) : ""; //remember, bs could be non-numeric like "normal" for fontWeight, so we should default to a blank suffix in that case.
	
							if (bs === "" || bs === "auto") {
								if (p === "width" || p === "height") {
									bn = _getDimension(target, p, _cs);
									bsfx = "px";
								} else if (p === "left" || p === "top") {
									bn = _calculateOffset(target, p, _cs);
									bsfx = "px";
								} else {
									bn = (p !== "opacity") ? 0 : 1;
									bsfx = "";
								}
							}
	
							rel = (isStr && es.charAt(1) === "=");
							if (rel) {
								en = parseInt(es.charAt(0) + "1", 10);
								es = es.substr(2);
								en *= parseFloat(es);
								esfx = es.replace(_suffixExp, "");
							} else {
								en = parseFloat(es);
								esfx = isStr ? es.replace(_suffixExp, "") : "";
							}
	
							if (esfx === "") {
								esfx = (p in _suffixMap) ? _suffixMap[p] : bsfx; //populate the end suffix, prioritizing the map, then if none is found, use the beginning suffix.
							}
	
							es = (en || en === 0) ? (rel ? en + bn : en) + esfx : vars[p]; //ensures that any += or -= prefixes are taken care of. Record the end value before normalizing the suffix because we always want to end the tween on exactly what they intended even if it doesn't match the beginning value's suffix.
	
							//if the beginning/ending suffixes don't match, normalize them...
							if (bsfx !== esfx) if (esfx !== "") if (en || en === 0) if (bn) { //note: if the beginning value (bn) is 0, we don't need to convert units!
								bn = _convertToPixels(target, p, bn, bsfx);
								if (esfx === "%") {
									bn /= _convertToPixels(target, p, 100, "%") / 100;
									if (vars.strictUnits !== true) { //some browsers report only "px" values instead of allowing "%" with getComputedStyle(), so we assume that if we're tweening to a %, we should start there too unless strictUnits:true is defined. This approach is particularly useful for responsive designs that use from() tweens.
										bs = bn + "%";
									}
	
								} else if (esfx === "em" || esfx === "rem" || esfx === "vw" || esfx === "vh") {
									bn /= _convertToPixels(target, p, 1, esfx);
	
								//otherwise convert to pixels.
								} else if (esfx !== "px") {
									en = _convertToPixels(target, p, en, esfx);
									esfx = "px"; //we don't use bsfx after this, so we don't need to set it to px too.
								}
								if (rel) if (en || en === 0) {
									es = (en + bn) + esfx; //the changes we made affect relative calculations, so adjust the end value here.
								}
							}
	
							if (rel) {
								en += bn;
							}
	
							if ((bn || bn === 0) && (en || en === 0)) { //faster than isNaN(). Also, previously we required en !== bn but that doesn't really gain much performance and it prevents _parseToProxy() from working properly if beginning and ending values match but need to get tweened by an external plugin anyway. For example, a bezier tween where the target starts at left:0 and has these points: [{left:50},{left:0}] wouldn't work properly because when parsing the last point, it'd match the first (current) one and a non-tweening CSSPropTween would be recorded when we actually need a normal tween (type:0) so that things get updated during the tween properly.
								pt = new CSSPropTween(style, p, bn, en - bn, pt, 0, p, (_autoRound !== false && (esfx === "px" || p === "zIndex")), 0, bs, es);
								pt.xs0 = esfx;
								//DEBUG: _log("tween "+p+" from "+pt.b+" ("+bn+esfx+") to "+pt.e+" with suffix: "+pt.xs0);
							} else if (style[p] === undefined || !es && (es + "" === "NaN" || es == null)) {
								_log("invalid " + p + " tween value: " + vars[p]);
							} else {
								pt = new CSSPropTween(style, p, en || bn || 0, 0, pt, -1, p, false, 0, bs, es);
								pt.xs0 = (es === "none" && (p === "display" || p.indexOf("Style") !== -1)) ? bs : es; //intermediate value should typically be set immediately (end value) except for "display" or things like borderTopStyle, borderBottomStyle, etc. which should use the beginning value during the tween.
								//DEBUG: _log("non-tweening value "+p+": "+pt.xs0);
							}
						}
					}
					if (plugin) if (pt && !pt.plugin) {
						pt.plugin = plugin;
					}
				}
				return pt;
			};
	
	
			//gets called every time the tween updates, passing the new ratio (typically a value between 0 and 1, but not always (for example, if an Elastic.easeOut is used, the value can jump above 1 mid-tween). It will always start and 0 and end at 1.
			p.setRatio = function(v) {
				var pt = this._firstPT,
					min = 0.000001,
					val, str, i;
				//at the end of the tween, we set the values to exactly what we received in order to make sure non-tweening values (like "position" or "float" or whatever) are set and so that if the beginning/ending suffixes (units) didn't match and we normalized to px, the value that the user passed in is used here. We check to see if the tween is at its beginning in case it's a from() tween in which case the ratio will actually go from 1 to 0 over the course of the tween (backwards).
				if (v === 1 && (this._tween._time === this._tween._duration || this._tween._time === 0)) {
					while (pt) {
						if (pt.type !== 2) {
							if (pt.r && pt.type !== -1) {
								val = Math.round(pt.s + pt.c);
								if (!pt.type) {
									pt.t[pt.p] = val + pt.xs0;
								} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
									i = pt.l;
									str = pt.xs0 + val + pt.xs1;
									for (i = 1; i < pt.l; i++) {
										str += pt["xn"+i] + pt["xs"+(i+1)];
									}
									pt.t[pt.p] = str;
								}
							} else {
								pt.t[pt.p] = pt.e;
							}
						} else {
							pt.setRatio(v);
						}
						pt = pt._next;
					}
	
				} else if (v || !(this._tween._time === this._tween._duration || this._tween._time === 0) || this._tween._rawPrevTime === -0.000001) {
					while (pt) {
						val = pt.c * v + pt.s;
						if (pt.r) {
							val = Math.round(val);
						} else if (val < min) if (val > -min) {
							val = 0;
						}
						if (!pt.type) {
							pt.t[pt.p] = val + pt.xs0;
						} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
							i = pt.l;
							if (i === 2) {
								pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2;
							} else if (i === 3) {
								pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3;
							} else if (i === 4) {
								pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4;
							} else if (i === 5) {
								pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4 + pt.xn4 + pt.xs5;
							} else {
								str = pt.xs0 + val + pt.xs1;
								for (i = 1; i < pt.l; i++) {
									str += pt["xn"+i] + pt["xs"+(i+1)];
								}
								pt.t[pt.p] = str;
							}
	
						} else if (pt.type === -1) { //non-tweening value
							pt.t[pt.p] = pt.xs0;
	
						} else if (pt.setRatio) { //custom setRatio() for things like SpecialProps, external plugins, etc.
							pt.setRatio(v);
						}
						pt = pt._next;
					}
	
				//if the tween is reversed all the way back to the beginning, we need to restore the original values which may have different units (like % instead of px or em or whatever).
				} else {
					while (pt) {
						if (pt.type !== 2) {
							pt.t[pt.p] = pt.b;
						} else {
							pt.setRatio(v);
						}
						pt = pt._next;
					}
				}
			};
	
			/**
			 * @private
			 * Forces rendering of the target's transforms (rotation, scale, etc.) whenever the CSSPlugin's setRatio() is called.
			 * Basically, this tells the CSSPlugin to create a CSSPropTween (type 2) after instantiation that runs last in the linked
			 * list and calls the appropriate (3D or 2D) rendering function. We separate this into its own method so that we can call
			 * it from other plugins like BezierPlugin if, for example, it needs to apply an autoRotation and this CSSPlugin
			 * doesn't have any transform-related properties of its own. You can call this method as many times as you
			 * want and it won't create duplicate CSSPropTweens.
			 *
			 * @param {boolean} threeD if true, it should apply 3D tweens (otherwise, just 2D ones are fine and typically faster)
			 */
			p._enableTransforms = function(threeD) {
				this._transform = this._transform || _getTransform(this._target, _cs, true); //ensures that the element has a _gsTransform property with the appropriate values.
				this._transformType = (!(this._transform.svg && _useSVGTransformAttr) && (threeD || this._transformType === 3)) ? 3 : 2;
			};
	
			var lazySet = function(v) {
				this.t[this.p] = this.e;
				this.data._linkCSSP(this, this._next, null, true); //we purposefully keep this._next even though it'd make sense to null it, but this is a performance optimization, as this happens during the while (pt) {} loop in setRatio() at the bottom of which it sets pt = pt._next, so if we null it, the linked list will be broken in that loop.
			};
			/** @private Gives us a way to set a value on the first render (and only the first render). **/
			p._addLazySet = function(t, p, v) {
				var pt = this._firstPT = new CSSPropTween(t, p, 0, 0, this._firstPT, 2);
				pt.e = v;
				pt.setRatio = lazySet;
				pt.data = this;
			};
	
			/** @private **/
			p._linkCSSP = function(pt, next, prev, remove) {
				if (pt) {
					if (next) {
						next._prev = pt;
					}
					if (pt._next) {
						pt._next._prev = pt._prev;
					}
					if (pt._prev) {
						pt._prev._next = pt._next;
					} else if (this._firstPT === pt) {
						this._firstPT = pt._next;
						remove = true; //just to prevent resetting this._firstPT 5 lines down in case pt._next is null. (optimized for speed)
					}
					if (prev) {
						prev._next = pt;
					} else if (!remove && this._firstPT === null) {
						this._firstPT = pt;
					}
					pt._next = next;
					pt._prev = prev;
				}
				return pt;
			};
	
			//we need to make sure that if alpha or autoAlpha is killed, opacity is too. And autoAlpha affects the "visibility" property.
			p._kill = function(lookup) {
				var copy = lookup,
					pt, p, xfirst;
				if (lookup.autoAlpha || lookup.alpha) {
					copy = {};
					for (p in lookup) { //copy the lookup so that we're not changing the original which may be passed elsewhere.
						copy[p] = lookup[p];
					}
					copy.opacity = 1;
					if (copy.autoAlpha) {
						copy.visibility = 1;
					}
				}
				if (lookup.className && (pt = this._classNamePT)) { //for className tweens, we need to kill any associated CSSPropTweens too; a linked list starts at the className's "xfirst".
					xfirst = pt.xfirst;
					if (xfirst && xfirst._prev) {
						this._linkCSSP(xfirst._prev, pt._next, xfirst._prev._prev); //break off the prev
					} else if (xfirst === this._firstPT) {
						this._firstPT = pt._next;
					}
					if (pt._next) {
						this._linkCSSP(pt._next, pt._next._next, xfirst._prev);
					}
					this._classNamePT = null;
				}
				return TweenPlugin.prototype._kill.call(this, copy);
			};
	
	
	
			//used by cascadeTo() for gathering all the style properties of each child element into an array for comparison.
			var _getChildStyles = function(e, props, targets) {
					var children, i, child, type;
					if (e.slice) {
						i = e.length;
						while (--i > -1) {
							_getChildStyles(e[i], props, targets);
						}
						return;
					}
					children = e.childNodes;
					i = children.length;
					while (--i > -1) {
						child = children[i];
						type = child.type;
						if (child.style) {
							props.push(_getAllStyles(child));
							if (targets) {
								targets.push(child);
							}
						}
						if ((type === 1 || type === 9 || type === 11) && child.childNodes.length) {
							_getChildStyles(child, props, targets);
						}
					}
				};
	
			/**
			 * Typically only useful for className tweens that may affect child elements, this method creates a TweenLite
			 * and then compares the style properties of all the target's child elements at the tween's start and end, and
			 * if any are different, it also creates tweens for those and returns an array containing ALL of the resulting
			 * tweens (so that you can easily add() them to a TimelineLite, for example). The reason this functionality is
			 * wrapped into a separate static method of CSSPlugin instead of being integrated into all regular className tweens
			 * is because it creates entirely new tweens that may have completely different targets than the original tween,
			 * so if they were all lumped into the original tween instance, it would be inconsistent with the rest of the API
			 * and it would create other problems. For example:
			 *  - If I create a tween of elementA, that tween instance may suddenly change its target to include 50 other elements (unintuitive if I specifically defined the target I wanted)
			 *  - We can't just create new independent tweens because otherwise, what happens if the original/parent tween is reversed or pause or dropped into a TimelineLite for tight control? You'd expect that tween's behavior to affect all the others.
			 *  - Analyzing every style property of every child before and after the tween is an expensive operation when there are many children, so this behavior shouldn't be imposed on all className tweens by default, especially since it's probably rare that this extra functionality is needed.
			 *
			 * @param {Object} target object to be tweened
			 * @param {number} Duration in seconds (or frames for frames-based tweens)
			 * @param {Object} Object containing the end values, like {className:"newClass", ease:Linear.easeNone}
			 * @return {Array} An array of TweenLite instances
			 */
			CSSPlugin.cascadeTo = function(target, duration, vars) {
				var tween = TweenLite.to(target, duration, vars),
					results = [tween],
					b = [],
					e = [],
					targets = [],
					_reservedProps = TweenLite._internals.reservedProps,
					i, difs, p, from;
				target = tween._targets || tween.target;
				_getChildStyles(target, b, targets);
				tween.render(duration, true, true);
				_getChildStyles(target, e);
				tween.render(0, true, true);
				tween._enabled(true);
				i = targets.length;
				while (--i > -1) {
					difs = _cssDif(targets[i], b[i], e[i]);
					if (difs.firstMPT) {
						difs = difs.difs;
						for (p in vars) {
							if (_reservedProps[p]) {
								difs[p] = vars[p];
							}
						}
						from = {};
						for (p in difs) {
							from[p] = b[i][p];
						}
						results.push(TweenLite.fromTo(targets[i], duration, from, difs));
					}
				}
				return results;
			};
	
			TweenPlugin.activate([CSSPlugin]);
			return CSSPlugin;
	
		}, true);
		
	}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }
	
	//export to AMD/RequireJS and CommonJS/Node (precursor to full modular build system coming at a later date)
	(function(name) {
		"use strict";
		var getGlobal = function() {
			return (_gsScope.GreenSockGlobals || _gsScope)[name];
		};
		if (typeof(define) === "function" && define.amd) { //AMD
			define(["TweenLite"], getGlobal);
		} else if (typeof(module) !== "undefined" && module.exports) { //node
			__webpack_require__(35);
			module.exports = getGlobal();
		}
	}("CSSPlugin"));
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 35 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/*** IMPORTS FROM imports-loader ***/
	var define = false;
	
	/*!
	 * VERSION: 1.18.2
	 * DATE: 2015-12-22
	 * UPDATES AND DOCS AT: http://greensock.com
	 *
	 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
	 * This work is subject to the terms at http://greensock.com/standard-license or for
	 * Club GreenSock members, the software agreement that was issued with your membership.
	 * 
	 * @author: Jack Doyle, jack@greensock.com
	 */
	(function(window, moduleName) {
	
			"use strict";
			var _globals = window.GreenSockGlobals = window.GreenSockGlobals || window;
			if (_globals.TweenLite) {
				return; //in case the core set of classes is already loaded, don't instantiate twice.
			}
			var _namespace = function(ns) {
					var a = ns.split("."),
						p = _globals, i;
					for (i = 0; i < a.length; i++) {
						p[a[i]] = p = p[a[i]] || {};
					}
					return p;
				},
				gs = _namespace("com.greensock"),
				_tinyNum = 0.0000000001,
				_slice = function(a) { //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
					var b = [],
						l = a.length,
						i;
					for (i = 0; i !== l; b.push(a[i++])) {}
					return b;
				},
				_emptyFunc = function() {},
				_isArray = (function() { //works around issues in iframe environments where the Array global isn't shared, thus if the object originates in a different window/iframe, "(obj instanceof Array)" will evaluate false. We added some speed optimizations to avoid Object.prototype.toString.call() unless it's absolutely necessary because it's VERY slow (like 20x slower)
					var toString = Object.prototype.toString,
						array = toString.call([]);
					return function(obj) {
						return obj != null && (obj instanceof Array || (typeof(obj) === "object" && !!obj.push && toString.call(obj) === array));
					};
				}()),
				a, i, p, _ticker, _tickerActive,
				_defLookup = {},
	
				/**
				 * @constructor
				 * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
				 * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
				 * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
				 * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
				 *
				 * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
				 * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
				 * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
				 * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
				 * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
				 * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
				 * sandbox the banner one like:
				 *
				 * <script>
				 *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
				 * </script>
				 * <script src="js/greensock/v1.7/TweenMax.js"></script>
				 * <script>
				 *     window.GreenSockGlobals = window._gsQueue = window._gsDefine = null; //reset it back to null (along with the special _gsQueue variable) so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
				 * </script>
				 * <script src="js/greensock/v1.6/TweenMax.js"></script>
				 * <script>
				 *     gs.TweenLite.to(...); //would use v1.7
				 *     TweenLite.to(...); //would use v1.6
				 * </script>
				 *
				 * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
				 * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
				 * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
				 * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
				 */
				Definition = function(ns, dependencies, func, global) {
					this.sc = (_defLookup[ns]) ? _defLookup[ns].sc : []; //subclasses
					_defLookup[ns] = this;
					this.gsClass = null;
					this.func = func;
					var _classes = [];
					this.check = function(init) {
						var i = dependencies.length,
							missing = i,
							cur, a, n, cl, hasModule;
						while (--i > -1) {
							if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
								_classes[i] = cur.gsClass;
								missing--;
							} else if (init) {
								cur.sc.push(this);
							}
						}
						if (missing === 0 && func) {
							a = ("com.greensock." + ns).split(".");
							n = a.pop();
							cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);
	
							//exports to multiple environments
							if (global) {
								_globals[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
								hasModule = (typeof(module) !== "undefined" && module.exports);
								if (!hasModule && typeof(define) === "function" && define.amd){ //AMD
									define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").pop(), [], function() { return cl; });
								} else if (ns === moduleName && hasModule){ //node
									module.exports = cl;
								}
							}
							for (i = 0; i < this.sc.length; i++) {
								this.sc[i].check();
							}
						}
					};
					this.check(true);
				},
	
				//used to create Definition instances (which basically registers a class that has dependencies).
				_gsDefine = window._gsDefine = function(ns, dependencies, func, global) {
					return new Definition(ns, dependencies, func, global);
				},
	
				//a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
				_class = gs._class = function(ns, func, global) {
					func = func || function() {};
					_gsDefine(ns, [], function(){ return func; }, global);
					return func;
				};
	
			_gsDefine.globals = _globals;
	
	
	
	/*
	 * ----------------------------------------------------------------
	 * Ease
	 * ----------------------------------------------------------------
	 */
			var _baseParams = [0, 0, 1, 1],
				_blankArray = [],
				Ease = _class("easing.Ease", function(func, extraParams, type, power) {
					this._func = func;
					this._type = type || 0;
					this._power = power || 0;
					this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
				}, true),
				_easeMap = Ease.map = {},
				_easeReg = Ease.register = function(ease, names, types, create) {
					var na = names.split(","),
						i = na.length,
						ta = (types || "easeIn,easeOut,easeInOut").split(","),
						e, name, j, type;
					while (--i > -1) {
						name = na[i];
						e = create ? _class("easing."+name, null, true) : gs.easing[name] || {};
						j = ta.length;
						while (--j > -1) {
							type = ta[j];
							_easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
						}
					}
				};
	
			p = Ease.prototype;
			p._calcEnd = false;
			p.getRatio = function(p) {
				if (this._func) {
					this._params[0] = p;
					return this._func.apply(null, this._params);
				}
				var t = this._type,
					pw = this._power,
					r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
				if (pw === 1) {
					r *= r;
				} else if (pw === 2) {
					r *= r * r;
				} else if (pw === 3) {
					r *= r * r * r;
				} else if (pw === 4) {
					r *= r * r * r * r;
				}
				return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
			};
	
			//create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
			a = ["Linear","Quad","Cubic","Quart","Quint,Strong"];
			i = a.length;
			while (--i > -1) {
				p = a[i]+",Power"+i;
				_easeReg(new Ease(null,null,1,i), p, "easeOut", true);
				_easeReg(new Ease(null,null,2,i), p, "easeIn" + ((i === 0) ? ",easeNone" : ""));
				_easeReg(new Ease(null,null,3,i), p, "easeInOut");
			}
			_easeMap.linear = gs.easing.Linear.easeIn;
			_easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks
	
	
	/*
	 * ----------------------------------------------------------------
	 * EventDispatcher
	 * ----------------------------------------------------------------
	 */
			var EventDispatcher = _class("events.EventDispatcher", function(target) {
				this._listeners = {};
				this._eventTarget = target || this;
			});
			p = EventDispatcher.prototype;
	
			p.addEventListener = function(type, callback, scope, useParam, priority) {
				priority = priority || 0;
				var list = this._listeners[type],
					index = 0,
					listener, i;
				if (list == null) {
					this._listeners[type] = list = [];
				}
				i = list.length;
				while (--i > -1) {
					listener = list[i];
					if (listener.c === callback && listener.s === scope) {
						list.splice(i, 1);
					} else if (index === 0 && listener.pr < priority) {
						index = i + 1;
					}
				}
				list.splice(index, 0, {c:callback, s:scope, up:useParam, pr:priority});
				if (this === _ticker && !_tickerActive) {
					_ticker.wake();
				}
			};
	
			p.removeEventListener = function(type, callback) {
				var list = this._listeners[type], i;
				if (list) {
					i = list.length;
					while (--i > -1) {
						if (list[i].c === callback) {
							list.splice(i, 1);
							return;
						}
					}
				}
			};
	
			p.dispatchEvent = function(type) {
				var list = this._listeners[type],
					i, t, listener;
				if (list) {
					i = list.length;
					t = this._eventTarget;
					while (--i > -1) {
						listener = list[i];
						if (listener) {
							if (listener.up) {
								listener.c.call(listener.s || t, {type:type, target:t});
							} else {
								listener.c.call(listener.s || t);
							}
						}
					}
				}
			};
	
	
	/*
	 * ----------------------------------------------------------------
	 * Ticker
	 * ----------------------------------------------------------------
	 */
	 		var _reqAnimFrame = window.requestAnimationFrame,
				_cancelAnimFrame = window.cancelAnimationFrame,
				_getTime = Date.now || function() {return new Date().getTime();},
				_lastUpdate = _getTime();
	
			//now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
			a = ["ms","moz","webkit","o"];
			i = a.length;
			while (--i > -1 && !_reqAnimFrame) {
				_reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
				_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
			}
	
			_class("Ticker", function(fps, useRAF) {
				var _self = this,
					_startTime = _getTime(),
					_useRAF = (useRAF !== false && _reqAnimFrame) ? "auto" : false,
					_lagThreshold = 500,
					_adjustedLag = 33,
					_tickWord = "tick", //helps reduce gc burden
					_fps, _req, _id, _gap, _nextTime,
					_tick = function(manual) {
						var elapsed = _getTime() - _lastUpdate,
							overlap, dispatch;
						if (elapsed > _lagThreshold) {
							_startTime += elapsed - _adjustedLag;
						}
						_lastUpdate += elapsed;
						_self.time = (_lastUpdate - _startTime) / 1000;
						overlap = _self.time - _nextTime;
						if (!_fps || overlap > 0 || manual === true) {
							_self.frame++;
							_nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
							dispatch = true;
						}
						if (manual !== true) { //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
							_id = _req(_tick);
						}
						if (dispatch) {
							_self.dispatchEvent(_tickWord);
						}
					};
	
				EventDispatcher.call(_self);
				_self.time = _self.frame = 0;
				_self.tick = function() {
					_tick(true);
				};
	
				_self.lagSmoothing = function(threshold, adjustedLag) {
					_lagThreshold = threshold || (1 / _tinyNum); //zero should be interpreted as basically unlimited
					_adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
				};
	
				_self.sleep = function() {
					if (_id == null) {
						return;
					}
					if (!_useRAF || !_cancelAnimFrame) {
						clearTimeout(_id);
					} else {
						_cancelAnimFrame(_id);
					}
					_req = _emptyFunc;
					_id = null;
					if (_self === _ticker) {
						_tickerActive = false;
					}
				};
	
				_self.wake = function(seamless) {
					if (_id !== null) {
						_self.sleep();
					} else if (seamless) {
						_startTime += -_lastUpdate + (_lastUpdate = _getTime());
					} else if (_self.frame > 10) { //don't trigger lagSmoothing if we're just waking up, and make sure that at least 10 frames have elapsed because of the iOS bug that we work around below with the 1.5-second setTimout().
						_lastUpdate = _getTime() - _lagThreshold + 5;
					}
					_req = (_fps === 0) ? _emptyFunc : (!_useRAF || !_reqAnimFrame) ? function(f) { return setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0); } : _reqAnimFrame;
					if (_self === _ticker) {
						_tickerActive = true;
					}
					_tick(2);
				};
	
				_self.fps = function(value) {
					if (!arguments.length) {
						return _fps;
					}
					_fps = value;
					_gap = 1 / (_fps || 60);
					_nextTime = this.time + _gap;
					_self.wake();
				};
	
				_self.useRAF = function(value) {
					if (!arguments.length) {
						return _useRAF;
					}
					_self.sleep();
					_useRAF = value;
					_self.fps(_fps);
				};
				_self.fps(fps);
	
				//a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.
				setTimeout(function() {
					if (_useRAF === "auto" && _self.frame < 5 && document.visibilityState !== "hidden") {
						_self.useRAF(false);
					}
				}, 1500);
			});
	
			p = gs.Ticker.prototype = new gs.events.EventDispatcher();
			p.constructor = gs.Ticker;
	
	
	/*
	 * ----------------------------------------------------------------
	 * Animation
	 * ----------------------------------------------------------------
	 */
			var Animation = _class("core.Animation", function(duration, vars) {
					this.vars = vars = vars || {};
					this._duration = this._totalDuration = duration || 0;
					this._delay = Number(vars.delay) || 0;
					this._timeScale = 1;
					this._active = (vars.immediateRender === true);
					this.data = vars.data;
					this._reversed = (vars.reversed === true);
	
					if (!_rootTimeline) {
						return;
					}
					if (!_tickerActive) { //some browsers (like iOS 6 Safari) shut down JavaScript execution when the tab is disabled and they [occasionally] neglect to start up requestAnimationFrame again when returning - this code ensures that the engine starts up again properly.
						_ticker.wake();
					}
	
					var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
					tl.add(this, tl._time);
	
					if (this.vars.paused) {
						this.paused(true);
					}
				});
	
			_ticker = Animation.ticker = new gs.Ticker();
			p = Animation.prototype;
			p._dirty = p._gc = p._initted = p._paused = false;
			p._totalTime = p._time = 0;
			p._rawPrevTime = -1;
			p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
			p._paused = false;
	
	
			//some browsers (like iOS) occasionally drop the requestAnimationFrame event when the user switches to a different tab and then comes back again, so we use a 2-second setTimeout() to sense if/when that condition occurs and then wake() the ticker.
			var _checkTimeout = function() {
					if (_tickerActive && _getTime() - _lastUpdate > 2000) {
						_ticker.wake();
					}
					setTimeout(_checkTimeout, 2000);
				};
			_checkTimeout();
	
	
			p.play = function(from, suppressEvents) {
				if (from != null) {
					this.seek(from, suppressEvents);
				}
				return this.reversed(false).paused(false);
			};
	
			p.pause = function(atTime, suppressEvents) {
				if (atTime != null) {
					this.seek(atTime, suppressEvents);
				}
				return this.paused(true);
			};
	
			p.resume = function(from, suppressEvents) {
				if (from != null) {
					this.seek(from, suppressEvents);
				}
				return this.paused(false);
			};
	
			p.seek = function(time, suppressEvents) {
				return this.totalTime(Number(time), suppressEvents !== false);
			};
	
			p.restart = function(includeDelay, suppressEvents) {
				return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, (suppressEvents !== false), true);
			};
	
			p.reverse = function(from, suppressEvents) {
				if (from != null) {
					this.seek((from || this.totalDuration()), suppressEvents);
				}
				return this.reversed(true).paused(false);
			};
	
			p.render = function(time, suppressEvents, force) {
				//stub - we override this method in subclasses.
			};
	
			p.invalidate = function() {
				this._time = this._totalTime = 0;
				this._initted = this._gc = false;
				this._rawPrevTime = -1;
				if (this._gc || !this.timeline) {
					this._enabled(true);
				}
				return this;
			};
	
			p.isActive = function() {
				var tl = this._timeline, //the 2 root timelines won't have a _timeline; they're always active.
					startTime = this._startTime,
					rawTime;
				return (!tl || (!this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime()) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale));
			};
	
			p._enabled = function (enabled, ignoreTimeline) {
				if (!_tickerActive) {
					_ticker.wake();
				}
				this._gc = !enabled;
				this._active = this.isActive();
				if (ignoreTimeline !== true) {
					if (enabled && !this.timeline) {
						this._timeline.add(this, this._startTime - this._delay);
					} else if (!enabled && this.timeline) {
						this._timeline._remove(this, true);
					}
				}
				return false;
			};
	
	
			p._kill = function(vars, target) {
				return this._enabled(false, false);
			};
	
			p.kill = function(vars, target) {
				this._kill(vars, target);
				return this;
			};
	
			p._uncache = function(includeSelf) {
				var tween = includeSelf ? this : this.timeline;
				while (tween) {
					tween._dirty = true;
					tween = tween.timeline;
				}
				return this;
			};
	
			p._swapSelfInParams = function(params) {
				var i = params.length,
					copy = params.concat();
				while (--i > -1) {
					if (params[i] === "{self}") {
						copy[i] = this;
					}
				}
				return copy;
			};
	
			p._callback = function(type) {
				var v = this.vars;
				v[type].apply(v[type + "Scope"] || v.callbackScope || this, v[type + "Params"] || _blankArray);
			};
	
	//----Animation getters/setters --------------------------------------------------------
	
			p.eventCallback = function(type, callback, params, scope) {
				if ((type || "").substr(0,2) === "on") {
					var v = this.vars;
					if (arguments.length === 1) {
						return v[type];
					}
					if (callback == null) {
						delete v[type];
					} else {
						v[type] = callback;
						v[type + "Params"] = (_isArray(params) && params.join("").indexOf("{self}") !== -1) ? this._swapSelfInParams(params) : params;
						v[type + "Scope"] = scope;
					}
					if (type === "onUpdate") {
						this._onUpdate = callback;
					}
				}
				return this;
			};
	
			p.delay = function(value) {
				if (!arguments.length) {
					return this._delay;
				}
				if (this._timeline.smoothChildTiming) {
					this.startTime( this._startTime + value - this._delay );
				}
				this._delay = value;
				return this;
			};
	
			p.duration = function(value) {
				if (!arguments.length) {
					this._dirty = false;
					return this._duration;
				}
				this._duration = this._totalDuration = value;
				this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.
				if (this._timeline.smoothChildTiming) if (this._time > 0) if (this._time < this._duration) if (value !== 0) {
					this.totalTime(this._totalTime * (value / this._duration), true);
				}
				return this;
			};
	
			p.totalDuration = function(value) {
				this._dirty = false;
				return (!arguments.length) ? this._totalDuration : this.duration(value);
			};
	
			p.time = function(value, suppressEvents) {
				if (!arguments.length) {
					return this._time;
				}
				if (this._dirty) {
					this.totalDuration();
				}
				return this.totalTime((value > this._duration) ? this._duration : value, suppressEvents);
			};
	
			p.totalTime = function(time, suppressEvents, uncapped) {
				if (!_tickerActive) {
					_ticker.wake();
				}
				if (!arguments.length) {
					return this._totalTime;
				}
				if (this._timeline) {
					if (time < 0 && !uncapped) {
						time += this.totalDuration();
					}
					if (this._timeline.smoothChildTiming) {
						if (this._dirty) {
							this.totalDuration();
						}
						var totalDuration = this._totalDuration,
							tl = this._timeline;
						if (time > totalDuration && !uncapped) {
							time = totalDuration;
						}
						this._startTime = (this._paused ? this._pauseTime : tl._time) - ((!this._reversed ? time : totalDuration - time) / this._timeScale);
						if (!tl._dirty) { //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
							this._uncache(false);
						}
						//in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The startTime of that child would get pushed out, but one of the ancestors may have completed.
						if (tl._timeline) {
							while (tl._timeline) {
								if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
									tl.totalTime(tl._totalTime, true);
								}
								tl = tl._timeline;
							}
						}
					}
					if (this._gc) {
						this._enabled(true, false);
					}
					if (this._totalTime !== time || this._duration === 0) {
						if (_lazyTweens.length) {
							_lazyRender();
						}
						this.render(time, suppressEvents, false);
						if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
							_lazyRender();
						}
					}
				}
				return this;
			};
	
			p.progress = p.totalProgress = function(value, suppressEvents) {
				var duration = this.duration();
				return (!arguments.length) ? (duration ? this._time / duration : this.ratio) : this.totalTime(duration * value, suppressEvents);
			};
	
			p.startTime = function(value) {
				if (!arguments.length) {
					return this._startTime;
				}
				if (value !== this._startTime) {
					this._startTime = value;
					if (this.timeline) if (this.timeline._sortChildren) {
						this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
					}
				}
				return this;
			};
	
			p.endTime = function(includeRepeats) {
				return this._startTime + ((includeRepeats != false) ? this.totalDuration() : this.duration()) / this._timeScale;
			};
	
			p.timeScale = function(value) {
				if (!arguments.length) {
					return this._timeScale;
				}
				value = value || _tinyNum; //can't allow zero because it'll throw the math off
				if (this._timeline && this._timeline.smoothChildTiming) {
					var pauseTime = this._pauseTime,
						t = (pauseTime || pauseTime === 0) ? pauseTime : this._timeline.totalTime();
					this._startTime = t - ((t - this._startTime) * this._timeScale / value);
				}
				this._timeScale = value;
				return this._uncache(false);
			};
	
			p.reversed = function(value) {
				if (!arguments.length) {
					return this._reversed;
				}
				if (value != this._reversed) {
					this._reversed = value;
					this.totalTime(((this._timeline && !this._timeline.smoothChildTiming) ? this.totalDuration() - this._totalTime : this._totalTime), true);
				}
				return this;
			};
	
			p.paused = function(value) {
				if (!arguments.length) {
					return this._paused;
				}
				var tl = this._timeline,
					raw, elapsed;
				if (value != this._paused) if (tl) {
					if (!_tickerActive && !value) {
						_ticker.wake();
					}
					raw = tl.rawTime();
					elapsed = raw - this._pauseTime;
					if (!value && tl.smoothChildTiming) {
						this._startTime += elapsed;
						this._uncache(false);
					}
					this._pauseTime = value ? raw : null;
					this._paused = value;
					this._active = this.isActive();
					if (!value && elapsed !== 0 && this._initted && this.duration()) {
						raw = tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale;
						this.render(raw, (raw === this._totalTime), true); //in case the target's properties changed via some other tween or manual update by the user, we should force a render.
					}
				}
				if (this._gc && !value) {
					this._enabled(true, false);
				}
				return this;
			};
	
	
	/*
	 * ----------------------------------------------------------------
	 * SimpleTimeline
	 * ----------------------------------------------------------------
	 */
			var SimpleTimeline = _class("core.SimpleTimeline", function(vars) {
				Animation.call(this, 0, vars);
				this.autoRemoveChildren = this.smoothChildTiming = true;
			});
	
			p = SimpleTimeline.prototype = new Animation();
			p.constructor = SimpleTimeline;
			p.kill()._gc = false;
			p._first = p._last = p._recent = null;
			p._sortChildren = false;
	
			p.add = p.insert = function(child, position, align, stagger) {
				var prevTween, st;
				child._startTime = Number(position || 0) + child._delay;
				if (child._paused) if (this !== child._timeline) { //we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order).
					child._pauseTime = child._startTime + ((this.rawTime() - child._startTime) / child._timeScale);
				}
				if (child.timeline) {
					child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.
				}
				child.timeline = child._timeline = this;
				if (child._gc) {
					child._enabled(true, true);
				}
				prevTween = this._last;
				if (this._sortChildren) {
					st = child._startTime;
					while (prevTween && prevTween._startTime > st) {
						prevTween = prevTween._prev;
					}
				}
				if (prevTween) {
					child._next = prevTween._next;
					prevTween._next = child;
				} else {
					child._next = this._first;
					this._first = child;
				}
				if (child._next) {
					child._next._prev = child;
				} else {
					this._last = child;
				}
				child._prev = prevTween;
				this._recent = child;
				if (this._timeline) {
					this._uncache(true);
				}
				return this;
			};
	
			p._remove = function(tween, skipDisable) {
				if (tween.timeline === this) {
					if (!skipDisable) {
						tween._enabled(false, true);
					}
	
					if (tween._prev) {
						tween._prev._next = tween._next;
					} else if (this._first === tween) {
						this._first = tween._next;
					}
					if (tween._next) {
						tween._next._prev = tween._prev;
					} else if (this._last === tween) {
						this._last = tween._prev;
					}
					tween._next = tween._prev = tween.timeline = null;
					if (tween === this._recent) {
						this._recent = this._last;
					}
	
					if (this._timeline) {
						this._uncache(true);
					}
				}
				return this;
			};
	
			p.render = function(time, suppressEvents, force) {
				var tween = this._first,
					next;
				this._totalTime = this._time = this._rawPrevTime = time;
				while (tween) {
					next = tween._next; //record it here because the value could change after rendering...
					if (tween._active || (time >= tween._startTime && !tween._paused)) {
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			};
	
			p.rawTime = function() {
				if (!_tickerActive) {
					_ticker.wake();
				}
				return this._totalTime;
			};
	
	/*
	 * ----------------------------------------------------------------
	 * TweenLite
	 * ----------------------------------------------------------------
	 */
			var TweenLite = _class("TweenLite", function(target, duration, vars) {
					Animation.call(this, duration, vars);
					this.render = TweenLite.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)
	
					if (target == null) {
						throw "Cannot tween a null target.";
					}
	
					this.target = target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
	
					var isSelector = (target.jquery || (target.length && target !== window && target[0] && (target[0] === window || (target[0].nodeType && target[0].style && !target.nodeType)))),
						overwrite = this.vars.overwrite,
						i, targ, targets;
	
					this._overwrite = overwrite = (overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof(overwrite) === "number") ? overwrite >> 0 : _overwriteLookup[overwrite];
	
					if ((isSelector || target instanceof Array || (target.push && _isArray(target))) && typeof(target[0]) !== "number") {
						this._targets = targets = _slice(target);  //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
						this._propLookup = [];
						this._siblings = [];
						for (i = 0; i < targets.length; i++) {
							targ = targets[i];
							if (!targ) {
								targets.splice(i--, 1);
								continue;
							} else if (typeof(targ) === "string") {
								targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings
								if (typeof(targ) === "string") {
									targets.splice(i+1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
								}
								continue;
							} else if (targ.length && targ !== window && targ[0] && (targ[0] === window || (targ[0].nodeType && targ[0].style && !targ.nodeType))) { //in case the user is passing in an array of selector objects (like jQuery objects), we need to check one more level and pull things out if necessary. Also note that <select> elements pass all the criteria regarding length and the first child having style, so we must also check to ensure the target isn't an HTML node itself.
								targets.splice(i--, 1);
								this._targets = targets = targets.concat(_slice(targ));
								continue;
							}
							this._siblings[i] = _register(targ, this, false);
							if (overwrite === 1) if (this._siblings[i].length > 1) {
								_applyOverwrite(targ, this, null, 1, this._siblings[i]);
							}
						}
	
					} else {
						this._propLookup = {};
						this._siblings = _register(target, this, false);
						if (overwrite === 1) if (this._siblings.length > 1) {
							_applyOverwrite(target, this, null, 1, this._siblings);
						}
					}
					if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
						this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
						this.render(-this._delay);
					}
				}, true),
				_isSelector = function(v) {
					return (v && v.length && v !== window && v[0] && (v[0] === window || (v[0].nodeType && v[0].style && !v.nodeType))); //we cannot check "nodeType" if the target is window from within an iframe, otherwise it will trigger a security error in some browsers like Firefox.
				},
				_autoCSS = function(vars, target) {
					var css = {},
						p;
					for (p in vars) {
						if (!_reservedProps[p] && (!(p in target) || p === "transform" || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || (_plugins[p] && _plugins[p]._autoCSS))) { //note: <img> elements contain read-only "x" and "y" properties. We should also prioritize editing css width/height rather than the element's properties.
							css[p] = vars[p];
							delete vars[p];
						}
					}
					vars.css = css;
				};
	
			p = TweenLite.prototype = new Animation();
			p.constructor = TweenLite;
			p.kill()._gc = false;
	
	//----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------
	
			p.ratio = 0;
			p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
			p._notifyPluginsOfEnabled = p._lazy = false;
	
			TweenLite.version = "1.18.2";
			TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
			TweenLite.defaultOverwrite = "auto";
			TweenLite.ticker = _ticker;
			TweenLite.autoSleep = 120;
			TweenLite.lagSmoothing = function(threshold, adjustedLag) {
				_ticker.lagSmoothing(threshold, adjustedLag);
			};
	
			TweenLite.selector = window.$ || window.jQuery || function(e) {
				var selector = window.$ || window.jQuery;
				if (selector) {
					TweenLite.selector = selector;
					return selector(e);
				}
				return (typeof(document) === "undefined") ? e : (document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById((e.charAt(0) === "#") ? e.substr(1) : e));
			};
	
			var _lazyTweens = [],
				_lazyLookup = {},
				_numbersExp = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
				//_nonNumbersExp = /(?:([\-+](?!(\d|=)))|[^\d\-+=e]|(e(?![\-+][\d])))+/ig,
				_setRatio = function(v) {
					var pt = this._firstPT,
						min = 0.000001,
						val;
					while (pt) {
						val = !pt.blob ? pt.c * v + pt.s : v ? this.join("") : this.start;
						if (pt.r) {
							val = Math.round(val);
						} else if (val < min) if (val > -min) { //prevents issues with converting very small numbers to strings in the browser
							val = 0;
						}
						if (!pt.f) {
							pt.t[pt.p] = val;
						} else if (pt.fp) {
							pt.t[pt.p](pt.fp, val);
						} else {
							pt.t[pt.p](val);
						}
						pt = pt._next;
					}
				},
				//compares two strings (start/end), finds the numbers that are different and spits back an array representing the whole value but with the changing values isolated as elements. For example, "rgb(0,0,0)" and "rgb(100,50,0)" would become ["rgb(", 0, ",", 50, ",0)"]. Notice it merges the parts that are identical (performance optimization). The array also has a linked list of PropTweens attached starting with _firstPT that contain the tweening data (t, p, s, c, f, etc.). It also stores the starting value as a "start" property so that we can revert to it if/when necessary, like when a tween rewinds fully. If the quantity of numbers differs between the start and end, it will always prioritize the end value(s). The pt parameter is optional - it's for a PropTween that will be appended to the end of the linked list and is typically for actually setting the value after all of the elements have been updated (with array.join("")).
				_blobDif = function(start, end, filter, pt) {
					var a = [start, end],
						charIndex = 0,
						s = "",
						color = 0,
						startNums, endNums, num, i, l, nonNumbers, currentNum;
					a.start = start;
					if (filter) {
						filter(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.
						start = a[0];
						end = a[1];
					}
					a.length = 0;
					startNums = start.match(_numbersExp) || [];
					endNums = end.match(_numbersExp) || [];
					if (pt) {
						pt._next = null;
						pt.blob = 1;
						a._firstPT = pt; //apply last in the linked list (which means inserting it first)
					}
					l = endNums.length;
					for (i = 0; i < l; i++) {
						currentNum = endNums[i];
						nonNumbers = end.substr(charIndex, end.indexOf(currentNum, charIndex)-charIndex);
						s += (nonNumbers || !i) ? nonNumbers : ","; //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
						charIndex += nonNumbers.length;
						if (color) { //sense rgba() values and round them.
							color = (color + 1) % 5;
						} else if (nonNumbers.substr(-5) === "rgba(") {
							color = 1;
						}
						if (currentNum === startNums[i] || startNums.length <= i) {
							s += currentNum;
						} else {
							if (s) {
								a.push(s);
								s = "";
							}
							num = parseFloat(startNums[i]);
							a.push(num);
							a._firstPT = {_next: a._firstPT, t:a, p: a.length-1, s:num, c:((currentNum.charAt(1) === "=") ? parseInt(currentNum.charAt(0) + "1", 10) * parseFloat(currentNum.substr(2)) : (parseFloat(currentNum) - num)) || 0, f:0, r:(color && color < 4)};
							//note: we don't set _prev because we'll never need to remove individual PropTweens from this list.
						}
						charIndex += currentNum.length;
					}
					s += end.substr(charIndex);
					if (s) {
						a.push(s);
					}
					a.setRatio = _setRatio;
					return a;
				},
				//note: "funcParam" is only necessary for function-based getters/setters that require an extra parameter like getAttribute("width") and setAttribute("width", value). In this example, funcParam would be "width". Used by AttrPlugin for example.
				_addPropTween = function(target, prop, start, end, overwriteProp, round, funcParam, stringFilter) {
					var s = (start === "get") ? target[prop] : start,
						type = typeof(target[prop]),
						isRelative = (typeof(end) === "string" && end.charAt(1) === "="),
						pt = {t:target, p:prop, s:s, f:(type === "function"), pg:0, n:overwriteProp || prop, r:round, pr:0, c:isRelative ? parseInt(end.charAt(0) + "1", 10) * parseFloat(end.substr(2)) : (parseFloat(end) - s) || 0},
						blob, getterName;
					if (type !== "number") {
						if (type === "function" && start === "get") {
							getterName = ((prop.indexOf("set") || typeof(target["get" + prop.substr(3)]) !== "function") ? prop : "get" + prop.substr(3));
							pt.s = s = funcParam ? target[getterName](funcParam) : target[getterName]();
						}
						if (typeof(s) === "string" && (funcParam || isNaN(s))) {
							//a blob (string that has multiple numbers in it)
							pt.fp = funcParam;
							blob = _blobDif(s, end, stringFilter || TweenLite.defaultStringFilter, pt);
							pt = {t:blob, p:"setRatio", s:0, c:1, f:2, pg:0, n:overwriteProp || prop, pr:0}; //"2" indicates it's a Blob property tween. Needed for RoundPropsPlugin for example.
						} else if (!isRelative) {
							pt.s = parseFloat(s);
							pt.c = (parseFloat(end) - pt.s) || 0;
						}
					}
					if (pt.c) { //only add it to the linked list if there's a change.
						if ((pt._next = this._firstPT)) {
							pt._next._prev = pt;
						}
						this._firstPT = pt;
						return pt;
					}
				},
				_internals = TweenLite._internals = {isArray:_isArray, isSelector:_isSelector, lazyTweens:_lazyTweens, blobDif:_blobDif}, //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
				_plugins = TweenLite._plugins = {},
				_tweenLookup = _internals.tweenLookup = {},
				_tweenLookupNum = 0,
				_reservedProps = _internals.reservedProps = {ease:1, delay:1, overwrite:1, onComplete:1, onCompleteParams:1, onCompleteScope:1, useFrames:1, runBackwards:1, startAt:1, onUpdate:1, onUpdateParams:1, onUpdateScope:1, onStart:1, onStartParams:1, onStartScope:1, onReverseComplete:1, onReverseCompleteParams:1, onReverseCompleteScope:1, onRepeat:1, onRepeatParams:1, onRepeatScope:1, easeParams:1, yoyo:1, immediateRender:1, repeat:1, repeatDelay:1, data:1, paused:1, reversed:1, autoCSS:1, lazy:1, onOverwrite:1, callbackScope:1, stringFilter:1},
				_overwriteLookup = {none:0, all:1, auto:2, concurrent:3, allOnStart:4, preexisting:5, "true":1, "false":0},
				_rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
				_rootTimeline = Animation._rootTimeline = new SimpleTimeline(),
				_nextGCFrame = 30,
				_lazyRender = _internals.lazyRender = function() {
					var i = _lazyTweens.length,
						tween;
					_lazyLookup = {};
					while (--i > -1) {
						tween = _lazyTweens[i];
						if (tween && tween._lazy !== false) {
							tween.render(tween._lazy[0], tween._lazy[1], true);
							tween._lazy = false;
						}
					}
					_lazyTweens.length = 0;
				};
	
			_rootTimeline._startTime = _ticker.time;
			_rootFramesTimeline._startTime = _ticker.frame;
			_rootTimeline._active = _rootFramesTimeline._active = true;
			setTimeout(_lazyRender, 1); //on some mobile devices, there isn't a "tick" before code runs which means any lazy renders wouldn't run before the next official "tick".
	
			Animation._updateRoot = TweenLite.render = function() {
					var i, a, p;
					if (_lazyTweens.length) { //if code is run outside of the requestAnimationFrame loop, there may be tweens queued AFTER the engine refreshed, so we need to ensure any pending renders occur before we refresh again.
						_lazyRender();
					}
					_rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
					_rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
					if (_lazyTweens.length) {
						_lazyRender();
					}
					if (_ticker.frame >= _nextGCFrame) { //dump garbage every 120 frames or whatever the user sets TweenLite.autoSleep to
						_nextGCFrame = _ticker.frame + (parseInt(TweenLite.autoSleep, 10) || 120);
						for (p in _tweenLookup) {
							a = _tweenLookup[p].tweens;
							i = a.length;
							while (--i > -1) {
								if (a[i]._gc) {
									a.splice(i, 1);
								}
							}
							if (a.length === 0) {
								delete _tweenLookup[p];
							}
						}
						//if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly
						p = _rootTimeline._first;
						if (!p || p._paused) if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
							while (p && p._paused) {
								p = p._next;
							}
							if (!p) {
								_ticker.sleep();
							}
						}
					}
				};
	
			_ticker.addEventListener("tick", Animation._updateRoot);
	
			var _register = function(target, tween, scrub) {
					var id = target._gsTweenID, a, i;
					if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
						_tweenLookup[id] = {target:target, tweens:[]};
					}
					if (tween) {
						a = _tweenLookup[id].tweens;
						a[(i = a.length)] = tween;
						if (scrub) {
							while (--i > -1) {
								if (a[i] === tween) {
									a.splice(i, 1);
								}
							}
						}
					}
					return _tweenLookup[id].tweens;
				},
				_onOverwrite = function(overwrittenTween, overwritingTween, target, killedProps) {
					var func = overwrittenTween.vars.onOverwrite, r1, r2;
					if (func) {
						r1 = func(overwrittenTween, overwritingTween, target, killedProps);
					}
					func = TweenLite.onOverwrite;
					if (func) {
						r2 = func(overwrittenTween, overwritingTween, target, killedProps);
					}
					return (r1 !== false && r2 !== false);
				},
				_applyOverwrite = function(target, tween, props, mode, siblings) {
					var i, changed, curTween, l;
					if (mode === 1 || mode >= 4) {
						l = siblings.length;
						for (i = 0; i < l; i++) {
							if ((curTween = siblings[i]) !== tween) {
								if (!curTween._gc) {
									if (curTween._kill(null, target, tween)) {
										changed = true;
									}
								}
							} else if (mode === 5) {
								break;
							}
						}
						return changed;
					}
					//NOTE: Add 0.0000000001 to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
					var startTime = tween._startTime + _tinyNum,
						overlaps = [],
						oCount = 0,
						zeroDur = (tween._duration === 0),
						globalStart;
					i = siblings.length;
					while (--i > -1) {
						if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {
							//ignore
						} else if (curTween._timeline !== tween._timeline) {
							globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
							if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
								overlaps[oCount++] = curTween;
							}
						} else if (curTween._startTime <= startTime) if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime) if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 0.0000000002)) {
							overlaps[oCount++] = curTween;
						}
					}
	
					i = oCount;
					while (--i > -1) {
						curTween = overlaps[i];
						if (mode === 2) if (curTween._kill(props, target, tween)) {
							changed = true;
						}
						if (mode !== 2 || (!curTween._firstPT && curTween._initted)) {
							if (mode !== 2 && !_onOverwrite(curTween, tween)) {
								continue;
							}
							if (curTween._enabled(false, false)) { //if all property tweens have been overwritten, kill the tween.
								changed = true;
							}
						}
					}
					return changed;
				},
				_checkOverlap = function(tween, reference, zeroDur) {
					var tl = tween._timeline,
						ts = tl._timeScale,
						t = tween._startTime;
					while (tl._timeline) {
						t += tl._startTime;
						ts *= tl._timeScale;
						if (tl._paused) {
							return -100;
						}
						tl = tl._timeline;
					}
					t /= ts;
					return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 2 * _tinyNum)) ? _tinyNum : ((t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum) ? 0 : t - reference - _tinyNum;
				};
	
	
	//---- TweenLite instance methods -----------------------------------------------------------------------------
	
			p._init = function() {
				var v = this.vars,
					op = this._overwrittenProps,
					dur = this._duration,
					immediate = !!v.immediateRender,
					ease = v.ease,
					i, initPlugins, pt, p, startVars;
				if (v.startAt) {
					if (this._startAt) {
						this._startAt.render(-1, true); //if we've run a startAt previously (when the tween instantiated), we should revert it so that the values re-instantiate correctly particularly for relative tweens. Without this, a TweenLite.fromTo(obj, 1, {x:"+=100"}, {x:"-=100"}), for example, would actually jump to +=200 because the startAt would run twice, doubling the relative change.
						this._startAt.kill();
					}
					startVars = {};
					for (p in v.startAt) { //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, 1, from, to).fromTo(e, 1, to, from);
						startVars[p] = v.startAt[p];
					}
					startVars.overwrite = false;
					startVars.immediateRender = true;
					startVars.lazy = (immediate && v.lazy !== false);
					startVars.startAt = startVars.delay = null; //no nesting of startAt objects allowed (otherwise it could cause an infinite loop).
					this._startAt = TweenLite.to(this.target, 0, startVars);
					if (immediate) {
						if (this._time > 0) {
							this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
						} else if (dur !== 0) {
							return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
						}
					}
				} else if (v.runBackwards && dur !== 0) {
					//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
					if (this._startAt) {
						this._startAt.render(-1, true);
						this._startAt.kill();
						this._startAt = null;
					} else {
						if (this._time !== 0) { //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
							immediate = false;
						}
						pt = {};
						for (p in v) { //copy props into a new object and skip any reserved props, otherwise onComplete or onUpdate or onStart could fire. We should, however, permit autoCSS to go through.
							if (!_reservedProps[p] || p === "autoCSS") {
								pt[p] = v[p];
							}
						}
						pt.overwrite = 0;
						pt.data = "isFromStart"; //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
						pt.lazy = (immediate && v.lazy !== false);
						pt.immediateRender = immediate; //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
						this._startAt = TweenLite.to(this.target, 0, pt);
						if (!immediate) {
							this._startAt._init(); //ensures that the initial values are recorded
							this._startAt._enabled(false); //no need to have the tween render on the next cycle. Disable it because we'll always manually control the renders of the _startAt tween.
							if (this.vars.immediateRender) {
								this._startAt = null;
							}
						} else if (this._time === 0) {
							return;
						}
					}
				}
				this._ease = ease = (!ease) ? TweenLite.defaultEase : (ease instanceof Ease) ? ease : (typeof(ease) === "function") ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
				if (v.easeParams instanceof Array && ease.config) {
					this._ease = ease.config.apply(ease, v.easeParams);
				}
				this._easeType = this._ease._type;
				this._easePower = this._ease._power;
				this._firstPT = null;
	
				if (this._targets) {
					i = this._targets.length;
					while (--i > -1) {
						if ( this._initProps( this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (op ? op[i] : null)) ) {
							initPlugins = true;
						}
					}
				} else {
					initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op);
				}
	
				if (initPlugins) {
					TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
				}
				if (op) if (!this._firstPT) if (typeof(this.target) !== "function") { //if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
					this._enabled(false, false);
				}
				if (v.runBackwards) {
					pt = this._firstPT;
					while (pt) {
						pt.s += pt.c;
						pt.c = -pt.c;
						pt = pt._next;
					}
				}
				this._onUpdate = v.onUpdate;
				this._initted = true;
			};
	
			p._initProps = function(target, propLookup, siblings, overwrittenProps) {
				var p, i, initPlugins, plugin, pt, v;
				if (target == null) {
					return false;
				}
	
				if (_lazyLookup[target._gsTweenID]) {
					_lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
				}
	
				if (!this.vars.css) if (target.style) if (target !== window && target.nodeType) if (_plugins.css) if (this.vars.autoCSS !== false) { //it's so common to use TweenLite/Max to animate the css of DOM elements, we assume that if the target is a DOM element, that's what is intended (a convenience so that users don't have to wrap things in css:{}, although we still recommend it for a slight performance boost and better specificity). Note: we cannot check "nodeType" on the window inside an iframe.
					_autoCSS(this.vars, target);
				}
				for (p in this.vars) {
					v = this.vars[p];
					if (_reservedProps[p]) {
						if (v) if ((v instanceof Array) || (v.push && _isArray(v))) if (v.join("").indexOf("{self}") !== -1) {
							this.vars[p] = v = this._swapSelfInParams(v, this);
						}
	
					} else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this)) {
	
						//t - target 		[object]
						//p - property 		[string]
						//s - start			[number]
						//c - change		[number]
						//f - isFunction	[boolean]
						//n - name			[string]
						//pg - isPlugin 	[boolean]
						//pr - priority		[number]
						this._firstPT = pt = {_next:this._firstPT, t:plugin, p:"setRatio", s:0, c:1, f:1, n:p, pg:1, pr:plugin._priority};
						i = plugin._overwriteProps.length;
						while (--i > -1) {
							propLookup[plugin._overwriteProps[i]] = this._firstPT;
						}
						if (plugin._priority || plugin._onInitAllProps) {
							initPlugins = true;
						}
						if (plugin._onDisable || plugin._onEnable) {
							this._notifyPluginsOfEnabled = true;
						}
						if (pt._next) {
							pt._next._prev = pt;
						}
	
					} else {
						propLookup[p] = _addPropTween.call(this, target, p, "get", v, p, 0, null, this.vars.stringFilter);
					}
				}
	
				if (overwrittenProps) if (this._kill(overwrittenProps, target)) { //another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
					return this._initProps(target, propLookup, siblings, overwrittenProps);
				}
				if (this._overwrite > 1) if (this._firstPT) if (siblings.length > 1) if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
					this._kill(propLookup, target);
					return this._initProps(target, propLookup, siblings, overwrittenProps);
				}
				if (this._firstPT) if ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration)) { //zero duration tweens don't lazy render by default; everything else does.
					_lazyLookup[target._gsTweenID] = true;
				}
				return initPlugins;
			};
	
			p.render = function(time, suppressEvents, force) {
				var prevTime = this._time,
					duration = this._duration,
					prevRawPrevTime = this._rawPrevTime,
					isComplete, callback, pt, rawPrevTime;
				if (time >= duration - 0.0000001) { //to work around occasional floating point math artifacts.
					this._totalTime = this._time = duration;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
					if (!this._reversed ) {
						isComplete = true;
						callback = "onComplete";
						force = (force || this._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
					}
					if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (this._startTime === this._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
							time = 0;
						}
						if (prevRawPrevTime < 0 || (time <= 0 && time >= -0.0000001) || (prevRawPrevTime === _tinyNum && this.data !== "isPause")) if (prevRawPrevTime !== time) { //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
							force = true;
							if (prevRawPrevTime > _tinyNum) {
								callback = "onReverseComplete";
							}
						}
						this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					}
	
				} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
					this._totalTime = this._time = 0;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
					if (prevTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
						callback = "onReverseComplete";
						isComplete = this._reversed;
					}
					if (time < 0) {
						this._active = false;
						if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
							if (prevRawPrevTime >= 0 && !(prevRawPrevTime === _tinyNum && this.data === "isPause")) {
								force = true;
							}
							this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
						}
					}
					if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
						force = true;
					}
				} else {
					this._totalTime = this._time = time;
	
					if (this._easeType) {
						var r = time / duration, type = this._easeType, pow = this._easePower;
						if (type === 1 || (type === 3 && r >= 0.5)) {
							r = 1 - r;
						}
						if (type === 3) {
							r *= 2;
						}
						if (pow === 1) {
							r *= r;
						} else if (pow === 2) {
							r *= r * r;
						} else if (pow === 3) {
							r *= r * r * r;
						} else if (pow === 4) {
							r *= r * r * r * r;
						}
	
						if (type === 1) {
							this.ratio = 1 - r;
						} else if (type === 2) {
							this.ratio = r;
						} else if (time / duration < 0.5) {
							this.ratio = r / 2;
						} else {
							this.ratio = 1 - (r / 2);
						}
	
					} else {
						this.ratio = this._ease.getRatio(time / duration);
					}
				}
	
				if (this._time === prevTime && !force) {
					return;
				} else if (!this._initted) {
					this._init();
					if (!this._initted || this._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
						return;
					} else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) {
						this._time = this._totalTime = prevTime;
						this._rawPrevTime = prevRawPrevTime;
						_lazyTweens.push(this);
						this._lazy = [time, suppressEvents];
						return;
					}
					//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
					if (this._time && !isComplete) {
						this.ratio = this._ease.getRatio(this._time / duration);
					} else if (isComplete && this._ease._calcEnd) {
						this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
					}
				}
				if (this._lazy !== false) { //in case a lazy render is pending, we should flush it because the new render is occurring now (imagine a lazy tween instantiating and then immediately the user calls tween.seek(tween.duration()), skipping to the end - the end render would be forced, and then if we didn't flush the lazy render, it'd fire AFTER the seek(), rendering it at the wrong time.
					this._lazy = false;
				}
				if (!this._active) if (!this._paused && this._time !== prevTime && time >= 0) {
					this._active = true;  //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
				}
				if (prevTime === 0) {
					if (this._startAt) {
						if (time >= 0) {
							this._startAt.render(time, suppressEvents, force);
						} else if (!callback) {
							callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
						}
					}
					if (this.vars.onStart) if (this._time !== 0 || duration === 0) if (!suppressEvents) {
						this._callback("onStart");
					}
				}
				pt = this._firstPT;
				while (pt) {
					if (pt.f) {
						pt.t[pt.p](pt.c * this.ratio + pt.s);
					} else {
						pt.t[pt.p] = pt.c * this.ratio + pt.s;
					}
					pt = pt._next;
				}
	
				if (this._onUpdate) {
					if (time < 0) if (this._startAt && time !== -0.0001) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
						this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
					}
					if (!suppressEvents) if (this._time !== prevTime || isComplete) {
						this._callback("onUpdate");
					}
				}
				if (callback) if (!this._gc || force) { //check _gc because there's a chance that kill() could be called in an onUpdate
					if (time < 0 && this._startAt && !this._onUpdate && time !== -0.0001) { //-0.0001 is a special value that we use when looping back to the beginning of a repeated TimelineMax, in which case we shouldn't render the _startAt values.
						this._startAt.render(time, suppressEvents, force);
					}
					if (isComplete) {
						if (this._timeline.autoRemoveChildren) {
							this._enabled(false, false);
						}
						this._active = false;
					}
					if (!suppressEvents && this.vars[callback]) {
						this._callback(callback);
					}
					if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
						this._rawPrevTime = 0;
					}
				}
			};
	
			p._kill = function(vars, target, overwritingTween) {
				if (vars === "all") {
					vars = null;
				}
				if (vars == null) if (target == null || target === this.target) {
					this._lazy = false;
					return this._enabled(false, false);
				}
				target = (typeof(target) !== "string") ? (target || this._targets || this.target) : TweenLite.selector(target) || target;
				var simultaneousOverwrite = (overwritingTween && this._time && overwritingTween._startTime === this._startTime && this._timeline === overwritingTween._timeline),
					i, overwrittenProps, p, pt, propLookup, changed, killProps, record, killed;
				if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
					i = target.length;
					while (--i > -1) {
						if (this._kill(vars, target[i], overwritingTween)) {
							changed = true;
						}
					}
				} else {
					if (this._targets) {
						i = this._targets.length;
						while (--i > -1) {
							if (target === this._targets[i]) {
								propLookup = this._propLookup[i] || {};
								this._overwrittenProps = this._overwrittenProps || [];
								overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
								break;
							}
						}
					} else if (target !== this.target) {
						return false;
					} else {
						propLookup = this._propLookup;
						overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
					}
	
					if (propLookup) {
						killProps = vars || propLookup;
						record = (vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (typeof(vars) !== "object" || !vars._tempKill)); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
						if (overwritingTween && (TweenLite.onOverwrite || this.vars.onOverwrite)) {
							for (p in killProps) {
								if (propLookup[p]) {
									if (!killed) {
										killed = [];
									}
									killed.push(p);
								}
							}
							if ((killed || !vars) && !_onOverwrite(this, overwritingTween, target, killed)) { //if the onOverwrite returned false, that means the user wants to override the overwriting (cancel it).
								return false;
							}
						}
	
						for (p in killProps) {
							if ((pt = propLookup[p])) {
								if (simultaneousOverwrite) { //if another tween overwrites this one and they both start at exactly the same time, yet this tween has already rendered once (for example, at 0.001) because it's first in the queue, we should revert the values to where they were at 0 so that the starting values aren't contaminated on the overwriting tween.
									if (pt.f) {
										pt.t[pt.p](pt.s);
									} else {
										pt.t[pt.p] = pt.s;
									}
									changed = true;
								}
								if (pt.pg && pt.t._kill(killProps)) {
									changed = true; //some plugins need to be notified so they can perform cleanup tasks first
								}
								if (!pt.pg || pt.t._overwriteProps.length === 0) {
									if (pt._prev) {
										pt._prev._next = pt._next;
									} else if (pt === this._firstPT) {
										this._firstPT = pt._next;
									}
									if (pt._next) {
										pt._next._prev = pt._prev;
									}
									pt._next = pt._prev = null;
								}
								delete propLookup[p];
							}
							if (record) {
								overwrittenProps[p] = 1;
							}
						}
						if (!this._firstPT && this._initted) { //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
							this._enabled(false, false);
						}
					}
				}
				return changed;
			};
	
			p.invalidate = function() {
				if (this._notifyPluginsOfEnabled) {
					TweenLite._onPluginEvent("_onDisable", this);
				}
				this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null;
				this._notifyPluginsOfEnabled = this._active = this._lazy = false;
				this._propLookup = (this._targets) ? {} : [];
				Animation.prototype.invalidate.call(this);
				if (this.vars.immediateRender) {
					this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
					this.render(-this._delay);
				}
				return this;
			};
	
			p._enabled = function(enabled, ignoreTimeline) {
				if (!_tickerActive) {
					_ticker.wake();
				}
				if (enabled && this._gc) {
					var targets = this._targets,
						i;
					if (targets) {
						i = targets.length;
						while (--i > -1) {
							this._siblings[i] = _register(targets[i], this, true);
						}
					} else {
						this._siblings = _register(this.target, this, true);
					}
				}
				Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
				if (this._notifyPluginsOfEnabled) if (this._firstPT) {
					return TweenLite._onPluginEvent((enabled ? "_onEnable" : "_onDisable"), this);
				}
				return false;
			};
	
	
	//----TweenLite static methods -----------------------------------------------------
	
			TweenLite.to = function(target, duration, vars) {
				return new TweenLite(target, duration, vars);
			};
	
			TweenLite.from = function(target, duration, vars) {
				vars.runBackwards = true;
				vars.immediateRender = (vars.immediateRender != false);
				return new TweenLite(target, duration, vars);
			};
	
			TweenLite.fromTo = function(target, duration, fromVars, toVars) {
				toVars.startAt = fromVars;
				toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
				return new TweenLite(target, duration, toVars);
			};
	
			TweenLite.delayedCall = function(delay, callback, params, scope, useFrames) {
				return new TweenLite(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, lazy:false, useFrames:useFrames, overwrite:0});
			};
	
			TweenLite.set = function(target, vars) {
				return new TweenLite(target, 0, vars);
			};
	
			TweenLite.getTweensOf = function(target, onlyActive) {
				if (target == null) { return []; }
				target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
				var i, a, j, t;
				if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
					i = target.length;
					a = [];
					while (--i > -1) {
						a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
					}
					i = a.length;
					//now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
					while (--i > -1) {
						t = a[i];
						j = i;
						while (--j > -1) {
							if (t === a[j]) {
								a.splice(i, 1);
							}
						}
					}
				} else {
					a = _register(target).concat();
					i = a.length;
					while (--i > -1) {
						if (a[i]._gc || (onlyActive && !a[i].isActive())) {
							a.splice(i, 1);
						}
					}
				}
				return a;
			};
	
			TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function(target, onlyActive, vars) {
				if (typeof(onlyActive) === "object") {
					vars = onlyActive; //for backwards compatibility (before "onlyActive" parameter was inserted)
					onlyActive = false;
				}
				var a = TweenLite.getTweensOf(target, onlyActive),
					i = a.length;
				while (--i > -1) {
					a[i]._kill(vars, target);
				}
			};
	
	
	
	/*
	 * ----------------------------------------------------------------
	 * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another script call before loading plugins which is easy to forget)
	 * ----------------------------------------------------------------
	 */
			var TweenPlugin = _class("plugins.TweenPlugin", function(props, priority) {
						this._overwriteProps = (props || "").split(",");
						this._propName = this._overwriteProps[0];
						this._priority = priority || 0;
						this._super = TweenPlugin.prototype;
					}, true);
	
			p = TweenPlugin.prototype;
			TweenPlugin.version = "1.18.0";
			TweenPlugin.API = 2;
			p._firstPT = null;
			p._addTween = _addPropTween;
			p.setRatio = _setRatio;
	
			p._kill = function(lookup) {
				var a = this._overwriteProps,
					pt = this._firstPT,
					i;
				if (lookup[this._propName] != null) {
					this._overwriteProps = [];
				} else {
					i = a.length;
					while (--i > -1) {
						if (lookup[a[i]] != null) {
							a.splice(i, 1);
						}
					}
				}
				while (pt) {
					if (lookup[pt.n] != null) {
						if (pt._next) {
							pt._next._prev = pt._prev;
						}
						if (pt._prev) {
							pt._prev._next = pt._next;
							pt._prev = null;
						} else if (this._firstPT === pt) {
							this._firstPT = pt._next;
						}
					}
					pt = pt._next;
				}
				return false;
			};
	
			p._roundProps = function(lookup, value) {
				var pt = this._firstPT;
				while (pt) {
					if (lookup[this._propName] || (pt.n != null && lookup[ pt.n.split(this._propName + "_").join("") ])) { //some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
						pt.r = value;
					}
					pt = pt._next;
				}
			};
	
			TweenLite._onPluginEvent = function(type, tween) {
				var pt = tween._firstPT,
					changed, pt2, first, last, next;
				if (type === "_onInitAllProps") {
					//sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
					while (pt) {
						next = pt._next;
						pt2 = first;
						while (pt2 && pt2.pr > pt.pr) {
							pt2 = pt2._next;
						}
						if ((pt._prev = pt2 ? pt2._prev : last)) {
							pt._prev._next = pt;
						} else {
							first = pt;
						}
						if ((pt._next = pt2)) {
							pt2._prev = pt;
						} else {
							last = pt;
						}
						pt = next;
					}
					pt = tween._firstPT = first;
				}
				while (pt) {
					if (pt.pg) if (typeof(pt.t[type]) === "function") if (pt.t[type]()) {
						changed = true;
					}
					pt = pt._next;
				}
				return changed;
			};
	
			TweenPlugin.activate = function(plugins) {
				var i = plugins.length;
				while (--i > -1) {
					if (plugins[i].API === TweenPlugin.API) {
						_plugins[(new plugins[i]())._propName] = plugins[i];
					}
				}
				return true;
			};
	
			//provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.
			_gsDefine.plugin = function(config) {
				if (!config || !config.propName || !config.init || !config.API) { throw "illegal plugin definition."; }
				var propName = config.propName,
					priority = config.priority || 0,
					overwriteProps = config.overwriteProps,
					map = {init:"_onInitTween", set:"setRatio", kill:"_kill", round:"_roundProps", initAll:"_onInitAllProps"},
					Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin",
						function() {
							TweenPlugin.call(this, propName, priority);
							this._overwriteProps = overwriteProps || [];
						}, (config.global === true)),
					p = Plugin.prototype = new TweenPlugin(propName),
					prop;
				p.constructor = Plugin;
				Plugin.API = config.API;
				for (prop in map) {
					if (typeof(config[prop]) === "function") {
						p[map[prop]] = config[prop];
					}
				}
				Plugin.version = config.version;
				TweenPlugin.activate([Plugin]);
				return Plugin;
			};
	
	
			//now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.
			a = window._gsQueue;
			if (a) {
				for (i = 0; i < a.length; i++) {
					a[i]();
				}
				for (p in _defLookup) {
					if (!_defLookup[p].func) {
						window.console.log("GSAP encountered missing dependency: com.greensock." + p);
					}
				}
			}
	
			_tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated
	
	})((typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window, "TweenLite");
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var h = __webpack_require__(4);
	var abyssa_1 = __webpack_require__(12);
	var dompteuse_1 = __webpack_require__(2);
	var animation_1 = __webpack_require__(32);
	var green_1 = __webpack_require__(37);
	var red_1 = __webpack_require__(38);
	var action_1 = __webpack_require__(30);
	function default_1() {
	    return dompteuse_1.component({
	        key: 'blue',
	        pullState: pullState,
	        render: render
	    });
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = default_1;
	;
	function pullState(state) {
	    return {
	        count: state.blue.count,
	        redCount: state.blue.red.count,
	        route: state.route.fullName,
	        id: state.route.params['id']
	    };
	}
	function render(options) {
	    var state = options.state;
	    var id = state.id, route = state.route;
	    return h('div#blue', { hook: animation_1.contentAnimation }, [
	        h('h1', 'Blue screen'),
	        h('a', { attrs: { href: abyssa_1.api.link('app.blue.green', { id: id }), 'data-nav': 'mousedown' } }, 'Green'),
	        h('a', { attrs: { href: abyssa_1.api.link('app.blue.red', { id: id }), 'data-nav': 'mousedown' } }, 'Red'),
	        h('div.increment', [
	            'Count: ' + state.count,
	            h('button', { on: { click: action_1.incrementBlue } }, 'Increment')
	        ]),
	        h('section', getChildren(state))
	    ]);
	}
	function getChildren(state) {
	    var route = state.route, redCount = state.redCount;
	    if (route === 'app.blue')
	        return [h('span', { hook: animation_1.contentAnimation }, 'I am blue')];
	    if (route === 'app.blue.green')
	        return [green_1.default()];
	    if (route === 'app.blue.red')
	        return [red_1.default({ openedByDefault: true }), red_1.default()];
	}


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var h = __webpack_require__(4);
	var dompteuse_1 = __webpack_require__(2);
	var animation_1 = __webpack_require__(32);
	function default_1() {
	    return dompteuse_1.component({
	        key: 'green',
	        pullState: pullState,
	        render: render
	    });
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = default_1;
	;
	function pullState(state) {
	    return {
	        id: state.route.params['id']
	    };
	}
	function render(options) {
	    var id = options.state.id;
	    return h('div#green', { hook: animation_1.contentAnimation }, "Green (route id = " + id + ")");
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var h = __webpack_require__(4);
	var immupdate_1 = __webpack_require__(39);
	var fluxx_1 = __webpack_require__(8);
	var dompteuse_1 = __webpack_require__(2);
	var animation_1 = __webpack_require__(32);
	function default_1(props) {
	    return dompteuse_1.component({
	        key: 'red',
	        localStore: localStore,
	        props: props,
	        render: render
	    });
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = default_1;
	;
	function localStore(_a) {
	    var openedByDefault = _a.openedByDefault;
	    var initialState = { opened: openedByDefault };
	    var actions = {
	        toggle: fluxx_1.Action('toggle')
	    };
	    var store = fluxx_1.LocalStore(initialState, function (on) {
	        on(actions.toggle, function (state) { return immupdate_1.default(state, { opened: !state.opened }); });
	    });
	    return { store: store, actions: actions };
	}
	function render(options) {
	    var opened = options.localState.opened, actions = options.actions;
	    return h('div.red', { hook: animation_1.contentAnimation, class: { opened: opened } }, [
	        h('button', { on: { click: onClick(actions) } }, 'Toggle')
	    ]);
	}
	function onClick(actions) {
	    return function () { return actions.toggle(); };
	}


/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.__esModule = true;
	exports.default = update;
	exports.updateKey = updateKey;
	exports.replace = replace;
	function update(host, spec) {
	  // If any of the branches of an object changed, then than object changed too: clone it.
	  // The type of the copy is inferred.
	  var copy = host ? Array.isArray(host) ? host.slice() : clone(host) : Array.isArray(spec) ? [] : {};
	
	  for (var key in spec) {
	    var specValue = spec[key];
	
	    if (specValue === DELETE) {
	      Array.isArray(copy) ? copy.splice(key, 1) : delete copy[key];
	    }
	    // The spec continues deeper
	    else if (isObject(specValue)) {
	        copy[key] = update(copy[key], specValue);
	      }
	      // Leaf update
	      else {
	          var newValue = typeof specValue === 'function' ? specValue(copy[key]) : specValue;
	
	          copy[key] = newValue;
	        }
	  }
	
	  return copy;
	}
	
	// Single path string update like: update(obj, 'path1.path2.name', 'John');
	function updateKey(host, keyPath, value) {
	  var paths = keyPath.split('.');
	  var spec = {};
	  var currentObj = spec;
	
	  paths.forEach(function (path, index) {
	    if (index === paths.length - 1) currentObj[path] = value;else currentObj[path] = currentObj = {};
	  });
	
	  return update(host, spec);
	}
	
	function clone(obj) {
	  var result = {};
	  Object.keys(obj).forEach(function (key) {
	    result[key] = obj[key];
	  });
	  return result;
	}
	
	function isObject(x) {
	  return x && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && !Array.isArray(x);
	}
	
	var DELETE = exports.DELETE = {};
	
	function replace(value) {
	  return function () {
	    return value;
	  };
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fluxx_1 = __webpack_require__(8);
	var immupdate_1 = __webpack_require__(39);
	var action_1 = __webpack_require__(30);
	;
	var initialState = {
	    blue: { count: 0, red: { count: 0 } }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = fluxx_1.GlobalStore(initialState, function (on) {
	    on(action_1.incrementBlue, function (state) {
	        return immupdate_1.default(state, { blue: { count: function (c) { return c + 1; } } });
	    });
	    on(action_1.routeChanged, function (state, route) {
	        return immupdate_1.default(state, { route: route });
	    });
	});


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzVhYTAzNGNiNTllYWI2MDQ4YTkiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvZ2dlci50cyIsIndlYnBhY2s6Ly8vLi9+L2RvbXB0ZXVzZS9saWIvZG9tcHRldXNlLmpzIiwid2VicGFjazovLy8uL34vZG9tcHRldXNlL2xpYi9yZW5kZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9zbmFiYmRvbS9oLmpzIiwid2VicGFjazovLy8uL34vc25hYmJkb20vdm5vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9zbmFiYmRvbS9pcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2RvbXB0ZXVzZS9saWIvY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL34vZmx1eHgvbGliL2ZsdXh4LmpzIiwid2VicGFjazovLy8uL34vZmx1eHgvbGliL0FjdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2ZsdXh4L2xpYi9TdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2RvbXB0ZXVzZS9saWIvc2hhbGxvd0VxdWFsLmpzIiwid2VicGFjazovLy8uL34vYWJ5c3NhL2xpYi9tYWluLmpzIiwid2VicGFjazovLy8uL34vYWJ5c3NhL2xpYi91dGlsLmpzIiwid2VicGFjazovLy8uL34vYWJ5c3NhL2xpYi9Sb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hYnlzc2Evfi9ldmVudHMvZXZlbnRzLmpzIiwid2VicGFjazovLy8uL34vYWJ5c3NhL2xpYi9hbmNob3JzLmpzIiwid2VicGFjazovLy8uL34vYWJ5c3NhL2xpYi9TdGF0ZVdpdGhQYXJhbXMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hYnlzc2EvbGliL1RyYW5zaXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vfi9hYnlzc2EvbGliL1N0YXRlLmpzIiwid2VicGFjazovLy8uL34vYWJ5c3NhL2xpYi9hcGkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hYnlzc2EvbGliL2FzeW5jLmpzIiwid2VicGFjazovLy8uL3NyYy9zbmFiYmRvbS50cyIsIndlYnBhY2s6Ly8vLi9+L3NuYWJiZG9tL3NuYWJiZG9tLmpzIiwid2VicGFjazovLy8uL34vc25hYmJkb20vaHRtbGRvbWFwaS5qcyIsIndlYnBhY2s6Ly8vLi9+L3NuYWJiZG9tL21vZHVsZXMvY2xhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vfi9zbmFiYmRvbS9tb2R1bGVzL3Byb3BzLmpzIiwid2VicGFjazovLy8uL34vc25hYmJkb20vbW9kdWxlcy9hdHRyaWJ1dGVzLmpzIiwid2VicGFjazovLy8uL34vc25hYmJkb20vbW9kdWxlcy9ldmVudGxpc3RlbmVycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9hbmltYXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dzYXAudHMiLCJ3ZWJwYWNrOi8vLy4vfi9nc2FwL3NyYy91bmNvbXByZXNzZWQvcGx1Z2lucy9DU1NQbHVnaW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9nc2FwL3NyYy91bmNvbXByZXNzZWQvVHdlZW5MaXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9ibHVlLnRzIiwid2VicGFjazovLy8uL3NyYy9ncmVlbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVkLnRzIiwid2VicGFjazovLy8uL34vaW1tdXBkYXRlL2xpYi9pbW11cGRhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsNkJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwREFBeUQ7QUFDekQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNEQUFxRCxFQUFFLEtBQUssRUFBRTs7QUFFOUQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxFQUFFLEtBQUssRUFBRTs7QUFFbkQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQ0FBaUMsRUFBRTtBQUNuQztBQUNBOztBQUVBOztBQUVBLGtDQUFpQyxFQUFFLEtBQUssRUFBRTs7QUFFMUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFrQyxFQUFFOztBQUVwQywyRUFBMEUsRUFBRTtBQUM1RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsd0NBQXVDLEVBQUU7QUFDekM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxpQ0FBZ0MsRUFBRTtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBLG1EQUFrRDs7QUFFbEQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFTOztBQUVUOztBQUVBLG1DQUFrQyxVQUFVO0FBQzVDO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0ZBQXVGO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXFDLHVCQUF1QjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0NBQW1DLEVBQUU7O0FBRXJDOztBQUVBLGlEQUFnRDtBQUNoRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE0QztBQUM1Qzs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDJCQUEwQixXQUFXO0FBQ3JDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZGQUE0Rix1Q0FBdUM7O0FBRW5JO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9FQUFtRSxhQUFhO0FBQ2hGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUVBQXNFLGVBQWU7QUFDckY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5Qjs7Ozs7O0FDcGpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixTQUFTO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsZ0JBQWUsU0FBUztBQUN4Qjs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWUsU0FBUztBQUN4QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFHO0FBQ0gscUJBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7OztBQzNTQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHOzs7Ozs7O0FDdEZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE0QjtBQUM1Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDOzs7Ozs7O0FDakRBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQiw4QkFBOEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw2Qjs7Ozs7OztBQ3JIQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLHdDQUF1Qyx5Q0FBeUM7QUFDaEY7QUFDQTtBQUNBO0FBQ0EsZ0JBQWUsbUJBQW1CO0FBQ2xDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBLG9CQUFtQixrQkFBa0I7QUFDckM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0I7Ozs7OztBQzNOQTs7QUFFQSw4REFBNkQ7QUFDN0QscUI7Ozs7OztBQ0hBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTCxJQUFHOztBQUVIO0FBQ0E7O0FBRUEsd0I7Ozs7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFJO0FBQ0osSUFBRzs7QUFFSDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyRUFBMEU7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXdCLEtBQUs7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsMEVBQXlFLEtBQUs7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF1RDtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVDQUFzQyxnTkFBZ047QUFDdFA7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUJBQXdCLFdBQVc7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJHQUEwRztBQUMxRztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxRUFBb0Usb0NBQW9DO0FBQ3hHO0FBQ0E7QUFDQTtBQUNBLFlBQVcsa0dBQWtHO0FBQzdHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxlQUFjLGNBQWM7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5QkFBd0I7O0FBRXhCLEVBQUM7Ozs7Ozs7O0FDbDJERDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLCtDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTBCLHFDQUFxQztBQUMvRDtBQUNBLGlCQUFnQixTQUFTLDRDQUE0QyxTQUFTLDRCQUE0QixFQUFFO0FBQzVHLGlCQUFnQixTQUFTLDBDQUEwQyxTQUFTLDRCQUE0QixFQUFFO0FBQzFHO0FBQ0E7QUFDQSwwQkFBeUIsTUFBTSxnQ0FBZ0MsRUFBRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQixxQ0FBcUM7QUFDaEU7QUFDQTtBQUNBO0FBQ0EsZ0NBQStCLHdCQUF3QjtBQUN2RDs7Ozs7OztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSwrQ0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBMkIscUNBQXFDO0FBQ2hFOzs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLCtDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQTZDLG9DQUFvQyx3QkFBd0IsRUFBRSxFQUFFO0FBQzdHLE1BQUs7QUFDTCxhQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCLDZDQUE2QyxpQkFBaUIsRUFBRTtBQUN6RixzQkFBcUIsTUFBTSwwQkFBMEIsRUFBRTtBQUN2RDtBQUNBO0FBQ0E7QUFDQSx5QkFBd0IseUJBQXlCO0FBQ2pEOzs7Ozs7O0FDcENBOztBQUVBLHFHQUFvRyxtQkFBbUIsRUFBRSxtQkFBbUIsa0dBQWtHOztBQUU5TztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUE2RDtBQUM3RCxJQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHOzs7Ozs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxpQkFBaUIsV0FBVztBQUN2QztBQUNBLCtDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQSw0Q0FBMkMsUUFBUSxzQkFBc0IsY0FBYyxFQUFFLEVBQUUsRUFBRTtBQUM3RixNQUFLO0FBQ0w7QUFDQSw0Q0FBMkMsZUFBZTtBQUMxRCxNQUFLO0FBQ0wsRUFBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA3NWFhMDM0Y2I1OWVhYjYwNDhhOVxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xucmVxdWlyZSgnLi9sb2dnZXInKTtcbnZhciBhYnlzc2FfMSA9IHJlcXVpcmUoJ2FieXNzYScpO1xudmFyIGRvbXB0ZXVzZV8xID0gcmVxdWlyZSgnZG9tcHRldXNlJyk7XG52YXIgc25hYmJkb21fMSA9IHJlcXVpcmUoJy4vc25hYmJkb20nKTtcbnZhciBhcHBfMSA9IHJlcXVpcmUoJy4vYXBwJyk7XG52YXIgYWN0aW9uXzEgPSByZXF1aXJlKCcuL2FjdGlvbicpO1xudmFyIHN0b3JlXzEgPSByZXF1aXJlKCcuL3N0b3JlJyk7XG52YXIgcm91dGVyID0gYWJ5c3NhXzEuUm91dGVyKHtcbiAgICBhcHA6IGFieXNzYV8xLlN0YXRlKCcnLCB7fSwge1xuICAgICAgICBpbmRleDogYWJ5c3NhXzEuU3RhdGUoJycsIHt9KSxcbiAgICAgICAgYmx1ZTogYWJ5c3NhXzEuU3RhdGUoJ2JsdWUvOmlkJywge30sIHtcbiAgICAgICAgICAgIGdyZWVuOiBhYnlzc2FfMS5TdGF0ZSgnZ3JlZW4nLCB7fSksXG4gICAgICAgICAgICByZWQ6IGFieXNzYV8xLlN0YXRlKCdyZWQnLCB7fSlcbiAgICAgICAgfSlcbiAgICB9KVxufSlcbiAgICAub24oJ2VuZGVkJywgYWN0aW9uXzEucm91dGVDaGFuZ2VkKVxuICAgIC5jb25maWd1cmUoeyB1cmxTeW5jOiAnaGFzaCcgfSlcbiAgICAuaW5pdCgpO1xuZG9tcHRldXNlXzEuc3RhcnRBcHAoeyBhcHA6IGFwcF8xLmRlZmF1bHQsIHN0b3JlOiBzdG9yZV8xLmRlZmF1bHQsIHBhdGNoOiBzbmFiYmRvbV8xLmRlZmF1bHQsIGVsbTogZG9jdW1lbnQuYm9keSB9KTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbWFpbi50c1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGRvbXB0ZXVzZV8xID0gcmVxdWlyZSgnZG9tcHRldXNlJyk7XG52YXIgZmx1eHhfMSA9IHJlcXVpcmUoJ2ZsdXh4Jyk7XG5mbHV4eF8xLlN0b3JlLmxvZyA9IHRydWU7XG5kb21wdGV1c2VfMS5SZW5kZXIubG9nID0gdHJ1ZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbG9nZ2VyLnRzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5SZW5kZXIgPSBleHBvcnRzLnN0YXJ0QXBwID0gZXhwb3J0cy5jb21wb25lbnQgPSB1bmRlZmluZWQ7XG5cbnZhciBfcmVuZGVyID0gcmVxdWlyZSgnLi9yZW5kZXInKTtcblxudmFyIF9yZW5kZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVuZGVyKTtcblxudmFyIF9jb21wb25lbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudCcpO1xuXG52YXIgX2NvbXBvbmVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb21wb25lbnQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBzdGFydEFwcChfcmVmKSB7XG4gIHZhciBhcHAgPSBfcmVmLmFwcDtcbiAgdmFyIHBhdGNoID0gX3JlZi5wYXRjaDtcbiAgdmFyIGVsbSA9IF9yZWYuZWxtO1xuXG4gIF9yZW5kZXIyLmRlZmF1bHQucGF0Y2ggPSBwYXRjaDtcblxuICAvLyBOb24gZGVzdHJ1Y3RpdmUgcGF0Y2hpbmcgaW5zaWRlIHRoZSBwYXNzZWQgZWxlbWVudFxuICB2YXIgZWxtVG9SZXBsYWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHZhciBuZXdWbm9kZSA9IHBhdGNoKGVsbVRvUmVwbGFjZSwgYXBwKTtcblxuICBlbG0uYXBwZW5kQ2hpbGQobmV3Vm5vZGUuZWxtKTtcbn1cblxuZXhwb3J0cy5jb21wb25lbnQgPSBfY29tcG9uZW50Mi5kZWZhdWx0O1xuZXhwb3J0cy5zdGFydEFwcCA9IHN0YXJ0QXBwO1xuZXhwb3J0cy5SZW5kZXIgPSBfcmVuZGVyMi5kZWZhdWx0O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2RvbXB0ZXVzZS9saWIvZG9tcHRldXNlLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5yZW5kZXJDb21wb25lbnQgPSByZW5kZXJDb21wb25lbnQ7XG5leHBvcnRzLnJlbmRlckNvbXBvbmVudE5vdyA9IHJlbmRlckNvbXBvbmVudE5vdztcblxudmFyIF9oID0gcmVxdWlyZSgnc25hYmJkb20vaCcpO1xuXG52YXIgX2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBjb21wb25lbnRzVG9SZW5kZXIgPSBbXTtcbnZhciByZW5kZXJpbmcgPSBmYWxzZTtcbnZhciBuZXh0UmVuZGVyID0gdm9pZCAwO1xuXG52YXIgUmVuZGVyID0geyBwYXRjaDogdW5kZWZpbmVkLCBsb2c6IGZhbHNlIH07XG5leHBvcnRzLmRlZmF1bHQgPSBSZW5kZXI7XG5mdW5jdGlvbiByZW5kZXJDb21wb25lbnQoY29tcG9uZW50KSB7XG4gIGlmIChyZW5kZXJpbmcpIHtcbiAgICBjb25zb2xlLndhcm4oJ0EgY29tcG9uZW50IHRyaWVkIHRvIHJlLXJlbmRlciB3aGlsZSBhIHJlbmRlcmluZyB3YXMgYWxyZWFkeSBvbmdvaW5nJywgY29tcG9uZW50LmVsbSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gVGhpcyBjb21wb25lbnQgaXMgYWxyZWFkeSBzY2hlZHVsZWQgZm9yIHRoZSBuZXh0IHJlZHJhdy5cbiAgLy8gRm9yIGluc3RhbmNlLCB0aGlzIGNhbiBlYXNpbHkgaGFwcGVuIHdoaWxlIHRoZSBhcHAncyB0YWIgaXMgaW5hY3RpdmUuXG4gIC8vIEF2b2lkcyBkb2luZyBtb3JlIHdvcmsgdGhhbiBuZWNlc3Nhcnkgd2hlbiByZS1hY3RpdmF0aW5nIGl0LlxuICBpZiAoY29tcG9uZW50c1RvUmVuZGVyLmluZGV4T2YoY29tcG9uZW50KSAhPT0gLTEpIHJldHVybjtcblxuICBjb21wb25lbnRzVG9SZW5kZXIucHVzaChjb21wb25lbnQpO1xuXG4gIGlmICghbmV4dFJlbmRlcikgbmV4dFJlbmRlciA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXJOb3cpO1xufTtcblxuZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50Tm93KGNvbXBvbmVudCkge1xuICB2YXIgaWQgPSBjb21wb25lbnQuaWQ7XG4gIHZhciBsb2NhbFN0YXRlID0gY29tcG9uZW50LmxvY2FsU3RhdGU7XG4gIHZhciBhY3Rpb25zID0gY29tcG9uZW50LmFjdGlvbnM7XG4gIHZhciBwcm9wcyA9IGNvbXBvbmVudC5wcm9wcztcbiAgdmFyIHN0YXRlID0gY29tcG9uZW50LnN0YXRlO1xuICB2YXIgZWxtID0gY29tcG9uZW50LmVsbTtcbiAgdmFyIHJlbmRlciA9IGNvbXBvbmVudC5yZW5kZXI7XG4gIHZhciB2bm9kZSA9IGNvbXBvbmVudC52bm9kZTtcbiAgdmFyIGRlc3Ryb3llZCA9IGNvbXBvbmVudC5kZXN0cm95ZWQ7XG5cbiAgLy8gQmFpbCBpZiB0aGUgY29tcG9uZW50IGlzIGFscmVhZHkgZGVzdHJveWVkLlxuICAvLyBUaGlzIGNhbiBoYXBwZW4gaWYgdGhlIHBhcmVudCByZW5kZXJzIGZpcnN0IGFuZCBkZWNpZGUgYSBjaGlsZCBjb21wb25lbnQgc2hvdWxkIGJlIHJlbW92ZWQuXG5cbiAgaWYgKGRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gIHZhciBwYXRjaCA9IFJlbmRlci5wYXRjaDtcbiAgdmFyIGxvZyA9IFJlbmRlci5sb2c7XG5cblxuICB2YXIgYmVmb3JlUmVuZGVyID0gdm9pZCAwO1xuXG4gIGlmIChsb2cpIGJlZm9yZVJlbmRlciA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICB2YXIgbmV3Vm5vZGUgPSByZW5kZXIoeyBwcm9wczogcHJvcHMsIHN0YXRlOiBzdGF0ZSwgbG9jYWxTdGF0ZTogbG9jYWxTdGF0ZSwgYWN0aW9uczogYWN0aW9ucyB9KTtcblxuICBwYXRjaCh2bm9kZSB8fCBlbG0sIG5ld1Zub2RlKTtcblxuICBpZiAobG9nKSBjb25zb2xlLmxvZygnUmVuZGVyIGNvbXBvbmVudCBcXCcnICsgY29tcG9uZW50LmtleSArICdcXCcnLCBwZXJmb3JtYW5jZS5ub3coKSAtIGJlZm9yZVJlbmRlciArICcgbXMnLCBjb21wb25lbnQpO1xuXG4gIGNvbXBvbmVudC5vblJlbmRlcihjb21wb25lbnQsIG5ld1Zub2RlKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyTm93KCkge1xuICByZW5kZXJpbmcgPSB0cnVlO1xuXG4gIHZhciBjb21wb25lbnRzID0gY29tcG9uZW50c1RvUmVuZGVyO1xuXG4gIG5leHRSZW5kZXIgPSB1bmRlZmluZWQ7XG4gIGNvbXBvbmVudHNUb1JlbmRlciA9IFtdO1xuXG4gIGlmIChSZW5kZXIubG9nKSBjb25zb2xlLmxvZygnJWNOZXcgcmVuZGVyaW5nIGZyYW1lJywgJ2NvbG9yOiBvcmFuZ2UnKTtcblxuICAvLyBSZW5kZXIgY29tcG9uZW50cyBpbiBhIHRvcC1kb3duIGZhc2hpb24uXG4gIC8vIFRoaXMgZW5zdXJlcyB0aGUgcmVuZGVyaW5nIG9yZGVyIGlzIHByZWRpY3RpdmUgYW5kIHByb3BzICYgc3RhdGVzIGFyZSBjb25zaXN0ZW50LlxuICBjb21wb25lbnRzLnNvcnQoZnVuY3Rpb24gKGNvbXBBLCBjb21wQikge1xuICAgIHJldHVybiBjb21wQS5kZXB0aCAtIGNvbXBCLmRlcHRoO1xuICB9KTtcbiAgY29tcG9uZW50cy5mb3JFYWNoKHJlbmRlckNvbXBvbmVudE5vdyk7XG5cbiAgcmVuZGVyaW5nID0gZmFsc2U7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZG9tcHRldXNlL2xpYi9yZW5kZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgVk5vZGUgPSByZXF1aXJlKCcuL3Zub2RlJyk7XG52YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG5cbmZ1bmN0aW9uIGFkZE5TKGRhdGEsIGNoaWxkcmVuKSB7XG4gIGRhdGEubnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuICBpZiAoY2hpbGRyZW4gIT09IHVuZGVmaW5lZCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgIGFkZE5TKGNoaWxkcmVuW2ldLmRhdGEsIGNoaWxkcmVuW2ldLmNoaWxkcmVuKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBoKHNlbCwgYiwgYykge1xuICB2YXIgZGF0YSA9IHt9LCBjaGlsZHJlbiwgdGV4dCwgaTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICBkYXRhID0gYjtcbiAgICBpZiAoaXMuYXJyYXkoYykpIHsgY2hpbGRyZW4gPSBjOyB9XG4gICAgZWxzZSBpZiAoaXMucHJpbWl0aXZlKGMpKSB7IHRleHQgPSBjOyB9XG4gIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIGlmIChpcy5hcnJheShiKSkgeyBjaGlsZHJlbiA9IGI7IH1cbiAgICBlbHNlIGlmIChpcy5wcmltaXRpdmUoYikpIHsgdGV4dCA9IGI7IH1cbiAgICBlbHNlIHsgZGF0YSA9IGI7IH1cbiAgfVxuICBpZiAoaXMuYXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoaXMucHJpbWl0aXZlKGNoaWxkcmVuW2ldKSkgY2hpbGRyZW5baV0gPSBWTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjaGlsZHJlbltpXSk7XG4gICAgfVxuICB9XG4gIGlmIChzZWxbMF0gPT09ICdzJyAmJiBzZWxbMV0gPT09ICd2JyAmJiBzZWxbMl0gPT09ICdnJykge1xuICAgIGFkZE5TKGRhdGEsIGNoaWxkcmVuKTtcbiAgfVxuICByZXR1cm4gVk5vZGUoc2VsLCBkYXRhLCBjaGlsZHJlbiwgdGV4dCwgdW5kZWZpbmVkKTtcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9zbmFiYmRvbS9oLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZWwsIGRhdGEsIGNoaWxkcmVuLCB0ZXh0LCBlbG0pIHtcbiAgdmFyIGtleSA9IGRhdGEgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IGRhdGEua2V5O1xuICByZXR1cm4ge3NlbDogc2VsLCBkYXRhOiBkYXRhLCBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgICAgICAgdGV4dDogdGV4dCwgZWxtOiBlbG0sIGtleToga2V5fTtcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9zbmFiYmRvbS92bm9kZS5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBhcnJheTogQXJyYXkuaXNBcnJheSxcbiAgcHJpbWl0aXZlOiBmdW5jdGlvbihzKSB7IHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHMgPT09ICdudW1iZXInOyB9LFxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3NuYWJiZG9tL2lzLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5kZWZhdWx0ID0gY29tcG9uZW50O1xuXG52YXIgX2ggPSByZXF1aXJlKCdzbmFiYmRvbS9oJyk7XG5cbnZhciBfaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oKTtcblxudmFyIF9mbHV4eCA9IHJlcXVpcmUoJ2ZsdXh4Jyk7XG5cbnZhciBfcmVuZGVyID0gcmVxdWlyZSgnLi9yZW5kZXInKTtcblxudmFyIF9zaGFsbG93RXF1YWwgPSByZXF1aXJlKCcuL3NoYWxsb3dFcXVhbCcpO1xuXG52YXIgX3NoYWxsb3dFcXVhbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zaGFsbG93RXF1YWwpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgZW1wdHkgPSB7fTtcblxuZnVuY3Rpb24gY29tcG9uZW50KG9wdGlvbnMpIHtcbiAgdmFyIGtleSA9IG9wdGlvbnMua2V5O1xuICB2YXIgX29wdGlvbnMkcHJvcHMgPSBvcHRpb25zLnByb3BzO1xuICB2YXIgcHJvcHMgPSBfb3B0aW9ucyRwcm9wcyA9PT0gdW5kZWZpbmVkID8gZW1wdHkgOiBfb3B0aW9ucyRwcm9wcztcbiAgdmFyIHB1bGxTdGF0ZSA9IG9wdGlvbnMucHVsbFN0YXRlO1xuICB2YXIgbG9jYWxTdG9yZSA9IG9wdGlvbnMubG9jYWxTdG9yZTtcbiAgdmFyIHJlbmRlciA9IG9wdGlvbnMucmVuZGVyO1xuICB2YXIgaG9vayA9IG9wdGlvbnMuaG9vaztcblxuXG4gIHZhciBjb21wUHJvcHMgPSB7XG4gICAga2V5OiBrZXksXG4gICAgaG9vazogeyBjcmVhdGU6IGNyZWF0ZSwgaW5zZXJ0OiBpbnNlcnQsIHBvc3RwYXRjaDogcG9zdHBhdGNoLCBkZXN0cm95OiBkZXN0cm95IH0sXG4gICAgY29tcG9uZW50OiB7IHByb3BzOiBwcm9wcywgcHVsbFN0YXRlOiBwdWxsU3RhdGUsIGxvY2FsU3RvcmVGbjogbG9jYWxTdG9yZSwgcmVuZGVyOiByZW5kZXIsIGtleToga2V5IH1cbiAgfTtcblxuICByZXR1cm4gKDAsIF9oMi5kZWZhdWx0KSgnZGl2JywgY29tcFByb3BzKTtcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZShfLCB2bm9kZSkge1xuICB2YXIgY29tcG9uZW50ID0gdm5vZGUuZGF0YS5jb21wb25lbnQ7XG4gIHZhciBwcm9wcyA9IGNvbXBvbmVudC5wcm9wcztcbiAgdmFyIHB1bGxTdGF0ZSA9IGNvbXBvbmVudC5wdWxsU3RhdGU7XG4gIHZhciBsb2NhbFN0b3JlRm4gPSBjb21wb25lbnQubG9jYWxTdG9yZUZuO1xuXG4gIC8vIFRoaXMgY29tcG9uZW50IHB1bGxzIHN0YXRlIGZyb20gdGhlIGdsb2JhbCBzdG9yZVxuXG4gIGlmIChwdWxsU3RhdGUpIHtcbiAgICB2YXIgc3RvcmUgPSAoMCwgX2ZsdXh4Lmdsb2JhbFN0b3JlKSgpO1xuICAgIGNvbXBvbmVudC51bnN1YkZyb21TdG9yZXMgPSBzdG9yZS5zdWJzY3JpYmUoZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICByZXR1cm4gb25HbG9iYWxTdG9yZUNoYW5nZShjb21wb25lbnQsIHN0YXRlKTtcbiAgICB9KTtcbiAgICBjb21wb25lbnQuc3RhdGUgPSBwdWxsU3RhdGUoc3RvcmUuc3RhdGUpO1xuICB9XG5cbiAgLy8gVGhpcyBjb21wb25lbnQgbWFpbnRhaW5zIGxvY2FsIHN0YXRlXG4gIGlmIChsb2NhbFN0b3JlRm4pIHtcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGxvY2FsU3RvcmUgPSBsb2NhbFN0b3JlRm4ocHJvcHMpO1xuICAgICAgdmFyIHN0b3JlID0gbG9jYWxTdG9yZS5zdG9yZTtcbiAgICAgIHZhciBhY3Rpb25zID0gbG9jYWxTdG9yZS5hY3Rpb25zO1xuXG5cbiAgICAgIE9iamVjdC5rZXlzKGFjdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbnNbbmFtZV0uX3N0b3JlID0gc3RvcmU7XG4gICAgICB9KTtcblxuICAgICAgdmFyIHVuc3ViRnJvbUdsb2JhbFN0b3JlID0gY29tcG9uZW50LnVuc3ViRnJvbVN0b3JlcztcbiAgICAgIHZhciB1bnN1YkZyb21Mb2NhbFN0b3JlID0gc3RvcmUuc3Vic2NyaWJlKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICByZXR1cm4gb25Mb2NhbFN0b3JlQ2hhbmdlKGNvbXBvbmVudCwgc3RhdGUpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbXBvbmVudC51bnN1YkZyb21TdG9yZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVuc3ViRnJvbUxvY2FsU3RvcmUoKTtcbiAgICAgICAgaWYgKHVuc3ViRnJvbUdsb2JhbFN0b3JlKSB1bnN1YkZyb21HbG9iYWxTdG9yZSgpO1xuICAgICAgfTtcblxuICAgICAgY29tcG9uZW50LmFjdGlvbnMgPSBhY3Rpb25zO1xuICAgICAgY29tcG9uZW50LmxvY2FsU3RhdGUgPSBzdG9yZS5zdGF0ZTtcbiAgICB9KSgpO1xuICB9XG5cbiAgY29tcG9uZW50LmVsbSA9IHZub2RlLmVsbTtcbiAgY29tcG9uZW50Lm9uUmVuZGVyID0gb25SZW5kZXI7XG4gIGNvbXBvbmVudC5wbGFjZWhvbGRlciA9IHZub2RlO1xuXG4gIC8vIENyZWF0ZSBhbmQgaW5zZXJ0IHRoZSBjb21wb25lbnQncyBjb250ZW50XG4gIC8vIHdoaWxlIGl0cyBwYXJlbnQgaXMgc3RpbGwgdW5hdHRhY2hlZCBmb3IgYmV0dGVyIHBlcmZzLlxuICAoMCwgX3JlbmRlci5yZW5kZXJDb21wb25lbnROb3cpKGNvbXBvbmVudCk7XG5cbiAgLy8gU3dhcCB0aGUgZmFrZS9jaGVhcCBkaXYgcGxhY2Vob2xkZXIncyBlbG0gd2l0aCB0aGUgcHJvcGVyIGVsbSB0aGF0IGhhcyBqdXN0IGJlZW4gY3JlYXRlZC5cbiAgY29tcG9uZW50LnBsYWNlaG9sZGVyLmVsbSA9IGNvbXBvbmVudC52bm9kZS5lbG07XG59XG5cbi8vIFN0b3JlIHRoZSBjb21wb25lbnQgZGVwdGggb25jZSBpdCdzIGF0dGFjaGVkIHRvIHRoZSBET00gc28gd2UgY2FuIHJlbmRlclxuLy8gY29tcG9uZW50IGhpZXJhcmNoaWVzIGluIGEgcHJlZGljdGl2ZSBtYW5uZXIuXG5mdW5jdGlvbiBpbnNlcnQodm5vZGUpIHtcbiAgdm5vZGUuZGF0YS5jb21wb25lbnQuZGVwdGggPSB2bm9kZS5lbG0uX19kZXB0aF9fID0gZ2V0RGVwdGgodm5vZGUuZWxtKTtcbn1cblxuLy8gQ2FsbGVkIG9uIGV2ZXJ5IHJlLXJlbmRlciwgdGhpcyBpcyB3aGVyZSB0aGUgcHJvcHMgcGFzc2VkIGJ5IHRoZSBjb21wb25lbnQncyBwYXJlbnQgbWF5IGhhdmUgY2hhbmdlZC5cbmZ1bmN0aW9uIHBvc3RwYXRjaChvbGRWbm9kZSwgdm5vZGUpIHtcbiAgdmFyIG9sZERhdGEgPSBvbGRWbm9kZS5kYXRhO1xuICB2YXIgbmV3RGF0YSA9IHZub2RlLmRhdGE7XG5cbiAgLy8gUGFzcyBvbiB0aGUgY29tcG9uZW50IGluc3RhbmNlIGV2ZXJ5dGltZSBhIG5ldyBWbm9kZSBpbnN0YW5jZSBpcyBjcmVhdGVkLFxuICAvLyBidXQgdXBkYXRlIGFueSBpbXBvcnRhbnQgcHJvcGVydHkgdGhhdCBjYW4gY2hhbmdlIG92ZXIgdGltZS5cbiAgdmFyIGNvbXBvbmVudCA9IG9sZERhdGEuY29tcG9uZW50O1xuICBjb21wb25lbnQucHJvcHMgPSBuZXdEYXRhLmNvbXBvbmVudC5wcm9wcztcbiAgY29tcG9uZW50LnJlbmRlciA9IG5ld0RhdGEuY29tcG9uZW50LnJlbmRlcjtcbiAgY29tcG9uZW50LnBsYWNlaG9sZGVyID0gdm5vZGU7XG4gIG5ld0RhdGEuY29tcG9uZW50ID0gY29tcG9uZW50O1xuXG4gIC8vIGlmIHRoZSBwcm9wcyBjaGFuZ2VkLCBzY2hlZHVsZSBhIHJlLXJlbmRlclxuICBpZiAoISgwLCBfc2hhbGxvd0VxdWFsMi5kZWZhdWx0KShuZXdEYXRhLnByb3BzLCBvbGREYXRhLnByb3BzKSkgKDAsIF9yZW5kZXIucmVuZGVyQ29tcG9uZW50KShjb21wb25lbnQpO1xufVxuXG5mdW5jdGlvbiBvblJlbmRlcihjb21wb25lbnQsIG5ld1Zub2RlKSB7XG4gIHZhciBpID0gdm9pZCAwO1xuXG4gIC8vIFN0b3JlIHRoZSBuZXcgdm5vZGUgaW5zaWRlIHRoZSBjb21wb25lbnQgc28gd2UgY2FuIGRpZmYgaXQgbmV4dCByZW5kZXJcbiAgY29tcG9uZW50LnZub2RlID0gbmV3Vm5vZGU7XG5cbiAgLy8gTGlmdCBhbnkgJ3JlbW92ZScgaG9vayB0byBvdXIgcGxhY2Vob2xkZXIgdm5vZGUgZm9yIGl0IHRvIGJlIGNhbGxlZFxuICAvLyBhcyB0aGUgcGxhY2Vob2xkZXIgaXMgYWxsIG91ciBwYXJlbnQgdm5vZGUga25vd3MgYWJvdXQuXG4gIGlmICgoaSA9IG5ld1Zub2RlLmRhdGEuaG9vaykgJiYgKGkgPSBpLnJlbW92ZSkpIGNvbXBvbmVudC5wbGFjZWhvbGRlci5kYXRhLmhvb2sucmVtb3ZlID0gaTtcbn1cblxuZnVuY3Rpb24gZGVzdHJveSh2bm9kZSkge1xuICB2YXIgY29tcCA9IHZub2RlLmRhdGEuY29tcG9uZW50O1xuICBjb21wLnVuc3ViRnJvbVN0b3JlcygpO1xuICBkZXN0cm95Vm5vZGUoY29tcC52bm9kZSk7XG4gIGNvbXAuZGVzdHJveWVkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZGVzdHJveVZub2RlKHZub2RlKSB7XG4gIHZhciBkYXRhID0gdm5vZGUuZGF0YTtcblxuICBpZiAoIWRhdGEpIHJldHVybjtcbiAgaWYgKGRhdGEuaG9vayAmJiBkYXRhLmhvb2suZGVzdHJveSkgZGF0YS5ob29rLmRlc3Ryb3kodm5vZGUpO1xuICAvLyBDYW4ndCBpbnZva2UgbW9kdWxlcycgZGVzdHJveSBob29rIGFzIHRoZXkncmUgaGlkZGVuIGluIHNuYWJiZG9tJ3MgY2xvc3VyZVxuICBpZiAodm5vZGUuY2hpbGRyZW4pIHZub2RlLmNoaWxkcmVuLmZvckVhY2goZGVzdHJveVZub2RlKTtcbiAgaWYgKGRhdGEudm5vZGUpIGRlc3Ryb3lWbm9kZShkYXRhLnZub2RlKTtcbn1cblxuZnVuY3Rpb24gb25HbG9iYWxTdG9yZUNoYW5nZShjb21wb25lbnQsIG5ld1N0YXRlKSB7XG4gIHZhciBvbGRTdGF0ZVNsaWNlID0gY29tcG9uZW50LnN0YXRlO1xuICB2YXIgbmV3U3RhdGVTbGljZSA9IGNvbXBvbmVudC5wdWxsU3RhdGUobmV3U3RhdGUpO1xuXG4gIGNvbXBvbmVudC5zdGF0ZSA9IG5ld1N0YXRlU2xpY2U7XG5cbiAgaWYgKCEoMCwgX3NoYWxsb3dFcXVhbDIuZGVmYXVsdCkobmV3U3RhdGVTbGljZSwgb2xkU3RhdGVTbGljZSkpICgwLCBfcmVuZGVyLnJlbmRlckNvbXBvbmVudCkoY29tcG9uZW50KTtcbn1cblxuZnVuY3Rpb24gb25Mb2NhbFN0b3JlQ2hhbmdlKGNvbXBvbmVudCwgbmV3U3RhdGUpIHtcbiAgY29tcG9uZW50LmxvY2FsU3RhdGUgPSBuZXdTdGF0ZTtcbiAgKDAsIF9yZW5kZXIucmVuZGVyQ29tcG9uZW50KShjb21wb25lbnQpO1xufVxuXG5mdW5jdGlvbiBnZXREZXB0aChlbG0pIHtcbiAgdmFyIHBhcmVudCA9IGVsbS5wYXJlbnRFbGVtZW50O1xuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50Ll9fZGVwdGhfXyAhPT0gdW5kZWZpbmVkKSByZXR1cm4gcGFyZW50Ll9fZGVwdGhfXyArIDE7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudEVsZW1lbnQ7XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9kb21wdGV1c2UvbGliL2NvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuQWN0aW9uID0gZXhwb3J0cy5Mb2NhbFN0b3JlID0gZXhwb3J0cy5nbG9iYWxTdG9yZSA9IGV4cG9ydHMuR2xvYmFsU3RvcmUgPSBleHBvcnRzLlN0b3JlID0gdW5kZWZpbmVkO1xuXG52YXIgX0FjdGlvbjIgPSByZXF1aXJlKCcuL0FjdGlvbicpO1xuXG52YXIgX0FjdGlvbjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9BY3Rpb24yKTtcblxudmFyIF9TdG9yZTIgPSByZXF1aXJlKCcuL1N0b3JlJyk7XG5cbnZhciBfU3RvcmUzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfU3RvcmUyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIFN0b3JlID0gZXhwb3J0cy5TdG9yZSA9IF9TdG9yZTMuZGVmYXVsdDtcbnZhciBHbG9iYWxTdG9yZSA9IGV4cG9ydHMuR2xvYmFsU3RvcmUgPSBfU3RvcmUyLkdsb2JhbFN0b3JlO1xudmFyIGdsb2JhbFN0b3JlID0gZXhwb3J0cy5nbG9iYWxTdG9yZSA9IF9TdG9yZTIuZ2xvYmFsU3RvcmU7XG52YXIgTG9jYWxTdG9yZSA9IGV4cG9ydHMuTG9jYWxTdG9yZSA9IF9TdG9yZTIuTG9jYWxTdG9yZTtcbnZhciBBY3Rpb24gPSBleHBvcnRzLkFjdGlvbiA9IF9BY3Rpb24zLmRlZmF1bHQ7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZmx1eHgvbGliL2ZsdXh4LmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5kZWZhdWx0ID0gQWN0aW9uO1xuXG52YXIgX1N0b3JlID0gcmVxdWlyZSgnLi9TdG9yZScpO1xuXG52YXIgX1N0b3JlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1N0b3JlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLy8gVW5pcXVlIEFjdGlvbiBpZHMuXG4vLyBUaGlzIHJlbW92ZXMgdGhlIG5lZWQgdG8gcHJvdmlkZSB1bmlxdWUgbmFtZXMgYWNyb3NzIHRoZSB3aG9sZSBhcHBsaWNhdGlvbi5cbnZhciBpZCA9IDE7XG5cbi8qKlxuKiBDcmVhdGVzIGFuIHVuaXF1ZSBhY3Rpb24gZm9yIGEgbmFtZS5cbiogVGhlIG5hbWUgaXMgb25seSB1c2VmdWwgZm9yIGRlYnVnZ2luZyBwdXJwb3NlczsgZGlmZmVyZW50IGFjdGlvbnMgY2FuIGhhdmUgdGhlIHNhbWUgbmFtZS5cbiogVGhlIHJldHVybmVkIGFjdGlvbiBmdW5jdGlvbiBjYW4gdGhlbiBiZSB1c2VkIHRvIGRpc3BhdGNoIG9uZSBvciBtb3JlIHBheWxvYWRzLlxuKlxuKiBFeDpcbiogdmFyIGNsaWNrVGhyZWFkID0gQWN0aW9uKCdjbGlja1RocmVhZCcpOyAvLyBDcmVhdGUgdGhlIGFjdGlvbiBvbmNlXG4qIGNsaWNrVGhyZWFkKGlkKTsgLy8gRGlzcGF0Y2ggYSBwYXlsb2FkIGFueSBudW1iZXIgb2YgdGltZXNcbiovXG5mdW5jdGlvbiBBY3Rpb24obmFtZSkge1xuXG4gIC8vIFRoZSBhY3R1YWwgYWN0aW9uIGRpc3BhdGNoIGZ1bmN0aW9uXG4gIGZ1bmN0aW9uIGFjdGlvbigpIHtcbiAgICB2YXIgcGF5bG9hZHMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgaXNHbG9iYWxBY3Rpb24gPSBhY3Rpb24uX3N0b3JlID09PSB1bmRlZmluZWQ7XG5cbiAgICAvLyBEaXNwYXRjaCB0byBvdXIgbG9jYWwgc3RvcmUgaWYgd2Ugd2VyZSBnaXZlbiBvbmUgb3IgZGVmYXVsdCB0byB0aGUgZ2xvYmFsIHN0b3JlLlxuICAgIHZhciBzdG9yZSA9IGlzR2xvYmFsQWN0aW9uID8gKDAsIF9TdG9yZS5nbG9iYWxTdG9yZSkoKSA6IGFjdGlvbi5fc3RvcmU7XG5cbiAgICBpZiAoIXN0b3JlKSB0aHJvdyBuZXcgRXJyb3IoJ1RyaWVkIHRvIGRpc3BhdGNoIGFuIGFjdGlvbiAoJyArIGFjdGlvbi5fbmFtZSArICcpIHdpdGhvdXQgYW4gaW5zdGFuY2lhdGVkIHN0b3JlJyk7XG5cbiAgICBpZiAoX1N0b3JlMi5kZWZhdWx0LmxvZykge1xuICAgICAgdmFyIHBheWxvYWQgPSBwYXlsb2Fkcy5sZW5ndGggPiAxID8gcGF5bG9hZHMgOiBwYXlsb2Fkc1swXTtcbiAgICAgIGNvbnNvbGUubG9nKCclYycgKyBhY3Rpb24uX25hbWUsICdjb2xvcjogI0Y1MURFMycsICdkaXNwYXRjaGVkIHdpdGggcGF5bG9hZCAnLCBwYXlsb2FkKTtcbiAgICB9XG5cbiAgICBzdG9yZS5faGFuZGxlQWN0aW9uKGFjdGlvbiwgcGF5bG9hZHMpO1xuXG4gICAgLy8gR2l2ZSBhIGNoYW5jZSB0byBhbGwgbG9jYWwgU3RvcmVzIHRvIHJlYWN0IHRvIHRoaXMgZ2xvYmFsIEFjdGlvblxuICAgIGlmIChpc0dsb2JhbEFjdGlvbikge1xuICAgICAgT2JqZWN0LmtleXMoX1N0b3JlLmxvY2FsU3RvcmVzKS5mb3JFYWNoKGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gX1N0b3JlLmxvY2FsU3RvcmVzW2lkXS5faGFuZGxlQWN0aW9uKGFjdGlvbiwgcGF5bG9hZHMpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYWN0aW9uLl9pZCA9IGlkKys7XG4gIGFjdGlvbi5fbmFtZSA9IG5hbWU7XG5cbiAgLy8gQWxsb3dzIEFjdGlvbnMgdG8gYmUgdXNlZCBhcyBPYmplY3Qga2V5cyB3aXRoIHRoZSBjb3JyZWN0IGJlaGF2aW9yXG4gIGFjdGlvbi50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYWN0aW9uLl9pZDtcbiAgfTtcblxuICByZXR1cm4gYWN0aW9uO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2ZsdXh4L2xpYi9BY3Rpb24uanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmdsb2JhbFN0b3JlID0gZ2xvYmFsU3RvcmU7XG5leHBvcnRzLkdsb2JhbFN0b3JlID0gR2xvYmFsU3RvcmU7XG5leHBvcnRzLkxvY2FsU3RvcmUgPSBMb2NhbFN0b3JlO1xuZXhwb3J0cy5kZWZhdWx0ID0gU3RvcmU7XG5cbnZhciBfZ2xvYmFsU3RvcmUgPSB1bmRlZmluZWQ7XG5mdW5jdGlvbiBnbG9iYWxTdG9yZSgpIHtcbiAgcmV0dXJuIF9nbG9iYWxTdG9yZTtcbn1cblxudmFyIGxvY2FsU3RvcmVJZCA9IDE7XG52YXIgbG9jYWxTdG9yZXMgPSBleHBvcnRzLmxvY2FsU3RvcmVzID0ge307XG5cbmZ1bmN0aW9uIEdsb2JhbFN0b3JlKG9wdGlvbnNPckluaXRpYWxTdGF0ZSwgcmVnaXN0ZXJIYW5kbGVycykge1xuICBfZ2xvYmFsU3RvcmUgPSBTdG9yZShvcHRpb25zT3JJbml0aWFsU3RhdGUsIHJlZ2lzdGVySGFuZGxlcnMsIHRydWUpO1xuICByZXR1cm4gX2dsb2JhbFN0b3JlO1xufVxuXG5mdW5jdGlvbiBMb2NhbFN0b3JlKG9wdGlvbnNPckluaXRpYWxTdGF0ZSwgcmVnaXN0ZXJIYW5kbGVycykge1xuICByZXR1cm4gU3RvcmUob3B0aW9uc09ySW5pdGlhbFN0YXRlLCByZWdpc3RlckhhbmRsZXJzKTtcbn1cblxuZnVuY3Rpb24gU3RvcmUob3B0aW9uc09ySW5pdGlhbFN0YXRlLCByZWdpc3RlckhhbmRsZXJzLCBpc0dsb2JhbCkge1xuICB2YXIgX3JlZiA9IHJlZ2lzdGVySGFuZGxlcnMgPyB7fSA6IG9wdGlvbnNPckluaXRpYWxTdGF0ZTtcblxuICB2YXIgaGFuZGxlcnMgPSBfcmVmLmhhbmRsZXJzO1xuXG4gIHZhciBpbml0aWFsU3RhdGUgPSByZWdpc3RlckhhbmRsZXJzID8gb3B0aW9uc09ySW5pdGlhbFN0YXRlIDogc3RhdGU7XG4gIHZhciBvbkhhbmRsZXJzID0ge307XG5cbiAgdmFyIGRpc3BhdGNoaW5nID0gZmFsc2U7XG4gIHZhciBjYWxsYmFja3MgPSBbXTtcblxuICB2YXIgaW5zdGFuY2UgPSB7IHN0YXRlOiBpbml0aWFsU3RhdGUgfTtcblxuICBpZiAoIWlzR2xvYmFsKSB7XG4gICAgaW5zdGFuY2UuaWQgPSBsb2NhbFN0b3JlSWQrKztcbiAgICBsb2NhbFN0b3Jlc1tpbnN0YW5jZS5pZF0gPSBpbnN0YW5jZTtcbiAgfVxuXG4gIC8vIG9uKGFjdGlvbiwgY2FsbGJhY2spIHJlZ2lzdHJhdGlvbiBzdHlsZVxuICBpZiAocmVnaXN0ZXJIYW5kbGVycykge1xuICAgIHZhciBvbiA9IGZ1bmN0aW9uIG9uKGFjdGlvbiwgZm4pIHtcbiAgICAgIG9uSGFuZGxlcnNbYWN0aW9uXSA9IGZuO1xuICAgIH07XG4gICAgcmVnaXN0ZXJIYW5kbGVycyhvbik7XG4gIH1cblxuICBpZiAoU3RvcmUubG9nKSBjb25zb2xlLmxvZygnJWNJbml0aWFsIHN0YXRlOicsICdjb2xvcjogZ3JlZW4nLCBpbml0aWFsU3RhdGUpO1xuXG4gIGluc3RhbmNlLl9oYW5kbGVBY3Rpb24gPSBmdW5jdGlvbiAoYWN0aW9uLCBwYXlsb2Fkcykge1xuICAgIGlmIChkaXNwYXRjaGluZykgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGlzcGF0Y2ggYW4gQWN0aW9uIGluIHRoZSBtaWRkbGUgb2YgYW5vdGhlciBBY3Rpb25cXCdzIGRpc3BhdGNoJyk7XG5cbiAgICAvLyBCYWlsIGZhc3QgaWYgdGhpcyBzdG9yZSBpc24ndCBpbnRlcmVzdGVkLlxuICAgIHZhciBoYW5kbGVyID0gaGFuZGxlcnMgPyBoYW5kbGVyc1thY3Rpb24uX2lkXSA6IG9uSGFuZGxlcnNbYWN0aW9uLl9pZF07XG4gICAgaWYgKCFoYW5kbGVyKSByZXR1cm47XG5cbiAgICBkaXNwYXRjaGluZyA9IHRydWU7XG5cbiAgICB2YXIgcHJldmlvdXNTdGF0ZSA9IGluc3RhbmNlLnN0YXRlO1xuXG4gICAgdHJ5IHtcbiAgICAgIGluc3RhbmNlLnN0YXRlID0gaGFuZGxlcnMgPyBoYW5kbGVyLmFwcGx5KG51bGwsIFtpbnN0YW5jZS5zdGF0ZV0uY29uY2F0KHBheWxvYWRzKSkgOiBoYW5kbGVyKGluc3RhbmNlLnN0YXRlLCBwYXlsb2Fkc1swXSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChTdG9yZS5sb2cpIHtcbiAgICAgICAgdmFyIHN0b3JlS2luZCA9IGlzR2xvYmFsID8gJ2dsb2JhbCcgOiAnbG9jYWwnO1xuICAgICAgICBjb25zb2xlLmxvZygnJWNOZXcgJyArIHN0b3JlS2luZCArICcgc3RhdGU6JywgJ2NvbG9yOiBibHVlJywgaW5zdGFuY2Uuc3RhdGUpO1xuICAgICAgfVxuXG4gICAgICBkaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChwcmV2aW91c1N0YXRlICE9PSBpbnN0YW5jZS5zdGF0ZSkgY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soaW5zdGFuY2Uuc3RhdGUpO1xuICAgIH0pO1xuICB9O1xuXG4gIGluc3RhbmNlLnN1YnNjcmliZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiB1bnN1YnNjcmliZSgpIHtcbiAgICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5maWx0ZXIoZnVuY3Rpb24gKF9jYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX2NhbGxiYWNrICE9PSBjYWxsYmFjaztcbiAgICAgIH0pO1xuICAgICAgaWYgKCFpc0dsb2JhbCAmJiBjYWxsYmFja3MubGVuZ3RoID09PSAwKSBkZWxldGUgbG9jYWxTdG9yZXNbaW5zdGFuY2UuaWRdO1xuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2ZsdXh4L2xpYi9TdG9yZS5qc1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHNoYWxsb3dFcXVhbDtcblxuLyogRWZmaWNpZW50IHNoYWxsb3cgY29tcGFyaXNvbiBvZiB0d28gb2JqZWN0cyAqL1xuXG5mdW5jdGlvbiBzaGFsbG93RXF1YWwob2JqQSwgb2JqQikge1xuICBpZiAob2JqQSA9PT0gb2JqQikgcmV0dXJuIHRydWU7XG5cbiAgdmFyIGtleXNBID0gT2JqZWN0LmtleXMob2JqQSk7XG4gIHZhciBrZXlzQiA9IE9iamVjdC5rZXlzKG9iakIpO1xuXG4gIC8vIFRlc3QgZm9yIEEncyBrZXlzIGRpZmZlcmVudCBmcm9tIEIncy5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzQS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChvYmpBW2tleXNBW2ldXSAhPT0gb2JqQltrZXlzQVtpXV0pIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFRlc3QgZm9yIEIncyBrZXlzIGRpZmZlcmVudCBmcm9tIEEncy5cbiAgLy8gSGFuZGxlcyB0aGUgY2FzZSB3aGVyZSBCIGhhcyBhIHByb3BlcnR5IHRoYXQgQSBkb2Vzbid0LlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXNCLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9iakFba2V5c0JbaV1dICE9PSBvYmpCW2tleXNCW2ldXSkgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZG9tcHRldXNlL2xpYi9zaGFsbG93RXF1YWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbnZhciBBYnlzc2EgPSB7XG4gIFJvdXRlcjogcmVxdWlyZSgnLi9Sb3V0ZXInKSxcbiAgYXBpOiByZXF1aXJlKCcuL2FwaScpLFxuICBhc3luYzogcmVxdWlyZSgnLi9hc3luYycpLFxuICBTdGF0ZTogdXRpbC5zdGF0ZVNob3J0aGFuZCxcblxuICBfdXRpbDogdXRpbFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBYnlzc2E7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vYWJ5c3NhL2xpYi9tYWluLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IHt9O1xuXG51dGlsLm5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcblxudXRpbC5hcnJheVRvT2JqZWN0ID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24gKG9iaiwgaXRlbSkge1xuICAgIG9ialtpdGVtXSA9IDE7XG4gICAgcmV0dXJuIG9iajtcbiAgfSwge30pO1xufTtcblxudXRpbC5vYmplY3RUb0FycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICB2YXIgYXJyYXkgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGFycmF5LnB1c2gob2JqW2tleV0pO1xuICB9cmV0dXJuIGFycmF5O1xufTtcblxudXRpbC5jb3B5T2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICB2YXIgY29weSA9IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgY29weVtrZXldID0gb2JqW2tleV07XG4gIH1yZXR1cm4gY29weTtcbn07XG5cbnV0aWwubWVyZ2VPYmplY3RzID0gZnVuY3Rpb24gKHRvLCBmcm9tKSB7XG4gIGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG4gICAgdG9ba2V5XSA9IGZyb21ba2V5XTtcbiAgfXJldHVybiB0bztcbn07XG5cbnV0aWwubWFwVmFsdWVzID0gZnVuY3Rpb24gKG9iaiwgZm4pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgcmVzdWx0W2tleV0gPSBmbihvYmpba2V5XSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qXG4qIFJldHVybiB0aGUgc2V0IG9mIGFsbCB0aGUga2V5cyB0aGF0IGNoYW5nZWQgKGVpdGhlciBhZGRlZCwgcmVtb3ZlZCBvciBtb2RpZmllZCkuXG4qL1xudXRpbC5vYmplY3REaWZmID0gZnVuY3Rpb24gKG9iajEsIG9iajIpIHtcbiAgdmFyIHVwZGF0ZSA9IHt9LFxuICAgICAgZW50ZXIgPSB7fSxcbiAgICAgIGV4aXQgPSB7fSxcbiAgICAgIGFsbCA9IHt9LFxuICAgICAgbmFtZSxcbiAgICAgIG9iajEgPSBvYmoxIHx8IHt9O1xuXG4gIGZvciAobmFtZSBpbiBvYmoxKSB7XG4gICAgaWYgKCEobmFtZSBpbiBvYmoyKSkgZXhpdFtuYW1lXSA9IGFsbFtuYW1lXSA9IHRydWU7ZWxzZSBpZiAob2JqMVtuYW1lXSAhPSBvYmoyW25hbWVdKSB1cGRhdGVbbmFtZV0gPSBhbGxbbmFtZV0gPSB0cnVlO1xuICB9XG5cbiAgZm9yIChuYW1lIGluIG9iajIpIHtcbiAgICBpZiAoIShuYW1lIGluIG9iajEpKSBlbnRlcltuYW1lXSA9IGFsbFtuYW1lXSA9IHRydWU7XG4gIH1cblxuICByZXR1cm4geyBhbGw6IGFsbCwgdXBkYXRlOiB1cGRhdGUsIGVudGVyOiBlbnRlciwgZXhpdDogZXhpdCB9O1xufTtcblxudXRpbC5tYWtlTWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG1lc3NhZ2UgPSBhcmd1bWVudHNbMF0sXG4gICAgICB0b2tlbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gdG9rZW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoJ3snICsgaSArICd9JywgdG9rZW5zW2ldKTtcbiAgfXJldHVybiBtZXNzYWdlO1xufTtcblxudXRpbC5wYXJzZVBhdGhzID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguc3BsaXQoJy8nKS5maWx0ZXIoZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBzdHIubGVuZ3RoO1xuICB9KS5tYXAoZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKTtcbiAgfSk7XG59O1xuXG51dGlsLnBhcnNlUXVlcnlQYXJhbXMgPSBmdW5jdGlvbiAocXVlcnkpIHtcbiAgcmV0dXJuIHF1ZXJ5ID8gcXVlcnkuc3BsaXQoJyYnKS5yZWR1Y2UoZnVuY3Rpb24gKHJlcywgcGFyYW1WYWx1ZSkge1xuICAgIHZhciBwdiA9IHBhcmFtVmFsdWUuc3BsaXQoJz0nKTtcbiAgICByZXNbcHZbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KHB2WzFdKTtcbiAgICByZXR1cm4gcmVzO1xuICB9LCB7fSkgOiB7fTtcbn07XG5cbnZhciBMRUFESU5HX1NMQVNIRVMgPSAvXlxcLysvO1xudmFyIFRSQUlMSU5HX1NMQVNIRVMgPSAvXihbXj9dKj8pXFwvKyQvO1xudmFyIFRSQUlMSU5HX1NMQVNIRVNfQkVGT1JFX1FVRVJZID0gL1xcLytcXD8vO1xudXRpbC5ub3JtYWxpemVQYXRoUXVlcnkgPSBmdW5jdGlvbiAocGF0aFF1ZXJ5KSB7XG4gIHJldHVybiAnLycgKyBwYXRoUXVlcnkucmVwbGFjZShMRUFESU5HX1NMQVNIRVMsICcnKS5yZXBsYWNlKFRSQUlMSU5HX1NMQVNIRVMsICckMScpLnJlcGxhY2UoVFJBSUxJTkdfU0xBU0hFU19CRUZPUkVfUVVFUlksICc/Jyk7XG59O1xuXG51dGlsLnN0YXRlU2hvcnRoYW5kID0gZnVuY3Rpb24gKHVyaSwgb3B0aW9ucywgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIHV0aWwubWVyZ2VPYmplY3RzKHsgdXJpOiB1cmksIGNoaWxkcmVuOiBjaGlsZHJlbiB8fCB7fSB9LCBvcHRpb25zKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9hYnlzc2EvbGliL3V0aWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyksXG4gICAgaW50ZXJjZXB0QW5jaG9ycyA9IHJlcXVpcmUoJy4vYW5jaG9ycycpLFxuICAgIFN0YXRlV2l0aFBhcmFtcyA9IHJlcXVpcmUoJy4vU3RhdGVXaXRoUGFyYW1zJyksXG4gICAgVHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vVHJhbnNpdGlvbicpLFxuICAgIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgICBTdGF0ZSA9IHJlcXVpcmUoJy4vU3RhdGUnKSxcbiAgICBhcGkgPSByZXF1aXJlKCcuL2FwaScpO1xuXG4vKlxuKiBDcmVhdGUgYSBuZXcgUm91dGVyIGluc3RhbmNlLCBwYXNzaW5nIGFueSBzdGF0ZSBkZWZpbmVkIGRlY2xhcmF0aXZlbHkuXG4qIE1vcmUgc3RhdGVzIGNhbiBiZSBhZGRlZCB1c2luZyBhZGRTdGF0ZSgpLlxuKlxuKiBCZWNhdXNlIGEgcm91dGVyIG1hbmFnZXMgZ2xvYmFsIHN0YXRlICh0aGUgVVJMKSwgb25seSBvbmUgaW5zdGFuY2Ugb2YgUm91dGVyXG4qIHNob3VsZCBiZSB1c2VkIGluc2lkZSBhbiBhcHBsaWNhdGlvbi5cbiovXG5mdW5jdGlvbiBSb3V0ZXIoZGVjbGFyYXRpdmVTdGF0ZXMpIHtcbiAgdmFyIHJvdXRlciA9IHt9LFxuICAgICAgc3RhdGVzID0gc3RhdGVUcmVlcyhkZWNsYXJhdGl2ZVN0YXRlcyksXG4gICAgICBmaXJzdFRyYW5zaXRpb24gPSB0cnVlLFxuICAgICAgb3B0aW9ucyA9IHtcbiAgICBlbmFibGVMb2dzOiBmYWxzZSxcbiAgICBpbnRlcmNlcHRBbmNob3JzOiB0cnVlLFxuICAgIG5vdEZvdW5kOiBudWxsLFxuICAgIHVybFN5bmM6ICdoaXN0b3J5JyxcbiAgICBoYXNoUHJlZml4OiAnJ1xuICB9LFxuICAgICAgaWdub3JlTmV4dFVSTENoYW5nZSA9IGZhbHNlLFxuICAgICAgY3VycmVudFBhdGhRdWVyeSxcbiAgICAgIGN1cnJlbnRQYXJhbXNEaWZmID0ge30sXG4gICAgICBjdXJyZW50U3RhdGUsXG4gICAgICBwcmV2aW91c1N0YXRlLFxuICAgICAgdHJhbnNpdGlvbixcbiAgICAgIGxlYWZTdGF0ZXMsXG4gICAgICB1cmxDaGFuZ2VkLFxuICAgICAgaW5pdGlhbGl6ZWQsXG4gICAgICBoYXNoU2xhc2hTdHJpbmc7XG5cbiAgLypcbiAgKiBTZXR0aW5nIGEgbmV3IHN0YXRlIHdpbGwgc3RhcnQgYSB0cmFuc2l0aW9uIGZyb20gdGhlIGN1cnJlbnQgc3RhdGUgdG8gdGhlIHRhcmdldCBzdGF0ZS5cbiAgKiBBIHN1Y2Nlc3NmdWwgdHJhbnNpdGlvbiB3aWxsIHJlc3VsdCBpbiB0aGUgVVJMIGJlaW5nIGNoYW5nZWQuXG4gICogQSBmYWlsZWQgdHJhbnNpdGlvbiB3aWxsIGxlYXZlIHRoZSByb3V0ZXIgaW4gaXRzIGN1cnJlbnQgc3RhdGUuXG4gICovXG4gIGZ1bmN0aW9uIHNldFN0YXRlKHN0YXRlLCBwYXJhbXMsIGFjYykge1xuICAgIHZhciBmcm9tU3RhdGUgPSB0cmFuc2l0aW9uID8gU3RhdGVXaXRoUGFyYW1zKHRyYW5zaXRpb24uY3VycmVudFN0YXRlLCB0cmFuc2l0aW9uLnRvUGFyYW1zKSA6IGN1cnJlbnRTdGF0ZTtcblxuICAgIHZhciB0b1N0YXRlID0gU3RhdGVXaXRoUGFyYW1zKHN0YXRlLCBwYXJhbXMpO1xuICAgIHZhciBkaWZmID0gdXRpbC5vYmplY3REaWZmKGZyb21TdGF0ZSAmJiBmcm9tU3RhdGUucGFyYW1zLCBwYXJhbXMpO1xuXG4gICAgaWYgKHByZXZlbnRUcmFuc2l0aW9uKGZyb21TdGF0ZSwgdG9TdGF0ZSwgZGlmZikpIHtcbiAgICAgIGlmICh0cmFuc2l0aW9uICYmIHRyYW5zaXRpb24uZXhpdGluZykgY2FuY2VsVHJhbnNpdGlvbigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0cmFuc2l0aW9uKSBjYW5jZWxUcmFuc2l0aW9uKCk7XG5cbiAgICAvLyBXaGlsZSB0aGUgdHJhbnNpdGlvbiBpcyBydW5uaW5nLCBhbnkgY29kZSBhc2tpbmcgdGhlIHJvdXRlciBhYm91dCB0aGUgcHJldmlvdXMvY3VycmVudCBzdGF0ZSBzaG91bGRcbiAgICAvLyBnZXQgdGhlIGVuZCByZXN1bHQgc3RhdGUuXG4gICAgcHJldmlvdXNTdGF0ZSA9IGN1cnJlbnRTdGF0ZTtcbiAgICBjdXJyZW50U3RhdGUgPSB0b1N0YXRlO1xuICAgIGN1cnJlbnRQYXJhbXNEaWZmID0gZGlmZjtcblxuICAgIHRyYW5zaXRpb24gPSBUcmFuc2l0aW9uKGZyb21TdGF0ZSwgdG9TdGF0ZSwgZGlmZiwgYWNjLCByb3V0ZXIsIGxvZ2dlcik7XG5cbiAgICBzdGFydGluZ1RyYW5zaXRpb24oZnJvbVN0YXRlLCB0b1N0YXRlKTtcblxuICAgIC8vIEluIGNhc2Ugb2YgYSByZWRpcmVjdCgpIGNhbGxlZCBmcm9tICdzdGFydGluZ1RyYW5zaXRpb24nLCB0aGUgdHJhbnNpdGlvbiBhbHJlYWR5IGVuZGVkLlxuICAgIGlmICh0cmFuc2l0aW9uKSB0cmFuc2l0aW9uLnJ1bigpO1xuXG4gICAgLy8gSW4gY2FzZSBvZiBhIHJlZGlyZWN0KCkgY2FsbGVkIGZyb20gdGhlIHRyYW5zaXRpb24gaXRzZWxmLCB0aGUgdHJhbnNpdGlvbiBhbHJlYWR5IGVuZGVkXG4gICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgIGlmICh0cmFuc2l0aW9uLmNhbmNlbGxlZCkgY3VycmVudFN0YXRlID0gZnJvbVN0YXRlO2Vsc2UgZW5kaW5nVHJhbnNpdGlvbihmcm9tU3RhdGUsIHRvU3RhdGUpO1xuICAgIH1cblxuICAgIHRyYW5zaXRpb24gPSBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsVHJhbnNpdGlvbigpIHtcbiAgICBsb2dnZXIubG9nKCdDYW5jZWxsaW5nIGV4aXN0aW5nIHRyYW5zaXRpb24gZnJvbSB7MH0gdG8gezF9JywgdHJhbnNpdGlvbi5mcm9tLCB0cmFuc2l0aW9uLnRvKTtcblxuICAgIHRyYW5zaXRpb24uY2FuY2VsKCk7XG5cbiAgICBmaXJzdFRyYW5zaXRpb24gPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0aW5nVHJhbnNpdGlvbihmcm9tU3RhdGUsIHRvU3RhdGUpIHtcbiAgICBsb2dnZXIubG9nKCdTdGFydGluZyB0cmFuc2l0aW9uIGZyb20gezB9IHRvIHsxfScsIGZyb21TdGF0ZSwgdG9TdGF0ZSk7XG5cbiAgICB2YXIgZnJvbSA9IGZyb21TdGF0ZSA/IGZyb21TdGF0ZS5hc1B1YmxpYyA6IG51bGw7XG4gICAgdmFyIHRvID0gdG9TdGF0ZS5hc1B1YmxpYztcblxuICAgIHJvdXRlci50cmFuc2l0aW9uLmVtaXQoJ3N0YXJ0ZWQnLCB0bywgZnJvbSk7XG4gIH1cblxuICBmdW5jdGlvbiBlbmRpbmdUcmFuc2l0aW9uKGZyb21TdGF0ZSwgdG9TdGF0ZSkge1xuICAgIGlmICghdXJsQ2hhbmdlZCAmJiAhZmlyc3RUcmFuc2l0aW9uKSB7XG4gICAgICBsb2dnZXIubG9nKCdVcGRhdGluZyBVUkw6IHswfScsIGN1cnJlbnRQYXRoUXVlcnkpO1xuICAgICAgdXBkYXRlVVJMRnJvbVN0YXRlKGN1cnJlbnRQYXRoUXVlcnksIGRvY3VtZW50LnRpdGxlLCBjdXJyZW50UGF0aFF1ZXJ5KTtcbiAgICB9XG5cbiAgICBmaXJzdFRyYW5zaXRpb24gPSBmYWxzZTtcblxuICAgIGxvZ2dlci5sb2coJ1RyYW5zaXRpb24gZnJvbSB7MH0gdG8gezF9IGVuZGVkJywgZnJvbVN0YXRlLCB0b1N0YXRlKTtcblxuICAgIHRvU3RhdGUuc3RhdGUubGFzdFBhcmFtcyA9IHRvU3RhdGUucGFyYW1zO1xuXG4gICAgdmFyIGZyb20gPSBmcm9tU3RhdGUgPyBmcm9tU3RhdGUuYXNQdWJsaWMgOiBudWxsO1xuICAgIHZhciB0byA9IHRvU3RhdGUuYXNQdWJsaWM7XG4gICAgcm91dGVyLnRyYW5zaXRpb24uZW1pdCgnZW5kZWQnLCB0bywgZnJvbSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVVUkxGcm9tU3RhdGUoc3RhdGUsIHRpdGxlLCB1cmwpIHtcbiAgICBpZiAoaXNIYXNoTW9kZSgpKSB7XG4gICAgICBpZ25vcmVOZXh0VVJMQ2hhbmdlID0gdHJ1ZTtcbiAgICAgIGxvY2F0aW9uLmhhc2ggPSBvcHRpb25zLmhhc2hQcmVmaXggKyB1cmw7XG4gICAgfSBlbHNlIGhpc3RvcnkucHVzaFN0YXRlKHN0YXRlLCB0aXRsZSwgdXJsKTtcbiAgfVxuXG4gIC8qXG4gICogUmV0dXJuIHdoZXRoZXIgdGhlIHBhc3NlZCBzdGF0ZSBpcyB0aGUgc2FtZSBhcyB0aGUgY3VycmVudCBvbmU7XG4gICogaW4gd2hpY2ggY2FzZSB0aGUgcm91dGVyIGNhbiBpZ25vcmUgdGhlIGNoYW5nZS5cbiAgKi9cbiAgZnVuY3Rpb24gcHJldmVudFRyYW5zaXRpb24oY3VycmVudCwgbmV3U3RhdGUsIGRpZmYpIHtcbiAgICBpZiAoIWN1cnJlbnQpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBuZXdTdGF0ZS5zdGF0ZSA9PSBjdXJyZW50LnN0YXRlICYmIE9iamVjdC5rZXlzKGRpZmYuYWxsKS5sZW5ndGggPT0gMDtcbiAgfVxuXG4gIC8qXG4gICogVGhlIHN0YXRlIHdhc24ndCBmb3VuZDtcbiAgKiBUcmFuc2l0aW9uIHRvIHRoZSAnbm90Rm91bmQnIHN0YXRlIGlmIHRoZSBkZXZlbG9wZXIgc3BlY2lmaWVkIGl0IG9yIGVsc2UgdGhyb3cgYW4gZXJyb3IuXG4gICovXG4gIGZ1bmN0aW9uIG5vdEZvdW5kKHN0YXRlKSB7XG4gICAgbG9nZ2VyLmxvZygnU3RhdGUgbm90IGZvdW5kOiB7MH0nLCBzdGF0ZSk7XG5cbiAgICBpZiAob3B0aW9ucy5ub3RGb3VuZCkgcmV0dXJuIHNldFN0YXRlKGxlYWZTdGF0ZXNbb3B0aW9ucy5ub3RGb3VuZF0sIHt9KTtlbHNlIHRocm93IG5ldyBFcnJvcignU3RhdGUgXCInICsgc3RhdGUgKyAnXCIgY291bGQgbm90IGJlIGZvdW5kJyk7XG4gIH1cblxuICAvKlxuICAqIENvbmZpZ3VyZSB0aGUgcm91dGVyIGJlZm9yZSBpdHMgaW5pdGlhbGl6YXRpb24uXG4gICogVGhlIGF2YWlsYWJsZSBvcHRpb25zIGFyZTpcbiAgKiAgIGVuYWJsZUxvZ3M6IFdoZXRoZXIgKGRlYnVnIGFuZCBlcnJvcikgY29uc29sZSBsb2dzIHNob3VsZCBiZSBlbmFibGVkLiBEZWZhdWx0cyB0byBmYWxzZS5cbiAgKiAgIGludGVyY2VwdEFuY2hvcnM6IFdoZXRoZXIgYW5jaG9yIG1vdXNlZG93bi9jbGlja3Mgc2hvdWxkIGJlIGludGVyY2VwdGVkIGFuZCB0cmlnZ2VyIGEgc3RhdGUgY2hhbmdlLiBEZWZhdWx0cyB0byB0cnVlLlxuICAqICAgbm90Rm91bmQ6IFRoZSBTdGF0ZSB0byBlbnRlciB3aGVuIG5vIHN0YXRlIG1hdGNoaW5nIHRoZSBjdXJyZW50IHBhdGggcXVlcnkgb3IgbmFtZSBjb3VsZCBiZSBmb3VuZC4gRGVmYXVsdHMgdG8gbnVsbC5cbiAgKiAgIHVybFN5bmM6IEhvdyBzaG91bGQgdGhlIHJvdXRlciBtYWludGFpbiB0aGUgY3VycmVudCBzdGF0ZSBhbmQgdGhlIHVybCBpbiBzeW5jLiBEZWZhdWx0cyB0byB0cnVlIChoaXN0b3J5IEFQSSkuXG4gICogICBoYXNoUHJlZml4OiBDdXN0b21pemUgdGhlIGhhc2ggc2VwYXJhdG9yLiBTZXQgdG8gJyEnIGluIG9yZGVyIHRvIGhhdmUgYSBoYXNoYmFuZyBsaWtlICcvIyEvJy4gRGVmYXVsdHMgdG8gZW1wdHkgc3RyaW5nLlxuICAqL1xuICBmdW5jdGlvbiBjb25maWd1cmUod2l0aE9wdGlvbnMpIHtcbiAgICB1dGlsLm1lcmdlT2JqZWN0cyhvcHRpb25zLCB3aXRoT3B0aW9ucyk7XG4gICAgcmV0dXJuIHJvdXRlcjtcbiAgfVxuXG4gIC8qXG4gICogSW5pdGlhbGl6ZSB0aGUgcm91dGVyLlxuICAqIFRoZSByb3V0ZXIgd2lsbCBpbW1lZGlhdGVseSBpbml0aWF0ZSBhIHRyYW5zaXRpb24gdG8sIGluIG9yZGVyIG9mIHByaW9yaXR5OlxuICAqIDEpIFRoZSBpbml0IHN0YXRlIHBhc3NlZCBhcyBhbiBhcmd1bWVudFxuICAqIDIpIFRoZSBzdGF0ZSBjYXB0dXJlZCBieSB0aGUgY3VycmVudCBVUkxcbiAgKi9cbiAgZnVuY3Rpb24gaW5pdChpbml0U3RhdGUsIGluaXRQYXJhbXMpIHtcbiAgICBpZiAob3B0aW9ucy5lbmFibGVMb2dzKSBSb3V0ZXIuZW5hYmxlTG9ncygpO1xuXG4gICAgaWYgKG9wdGlvbnMuaW50ZXJjZXB0QW5jaG9ycykgaW50ZXJjZXB0QW5jaG9ycyhyb3V0ZXIpO1xuXG4gICAgaGFzaFNsYXNoU3RyaW5nID0gJyMnICsgb3B0aW9ucy5oYXNoUHJlZml4ICsgJy8nO1xuXG4gICAgbG9nZ2VyLmxvZygnUm91dGVyIGluaXQnKTtcblxuICAgIGluaXRTdGF0ZXMoKTtcbiAgICBsb2dTdGF0ZVRyZWUoKTtcblxuICAgIGluaXRTdGF0ZSA9IGluaXRTdGF0ZSAhPT0gdW5kZWZpbmVkID8gaW5pdFN0YXRlIDogdXJsUGF0aFF1ZXJ5KCk7XG5cbiAgICBsb2dnZXIubG9nKCdJbml0aWFsaXppbmcgdG8gc3RhdGUgezB9JywgaW5pdFN0YXRlIHx8ICdcIlwiJyk7XG4gICAgdHJhbnNpdGlvblRvKGluaXRTdGF0ZSwgaW5pdFBhcmFtcyk7XG5cbiAgICBsaXN0ZW5Ub1VSTENoYW5nZXMoKTtcblxuICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICByZXR1cm4gcm91dGVyO1xuICB9XG5cbiAgLypcbiAgKiBSZW1vdmUgYW55IHBvc3NpYmlsaXR5IG9mIHNpZGUgZWZmZWN0IHRoaXMgcm91dGVyIGluc3RhbmNlIG1pZ2h0IGNhdXNlLlxuICAqIFVzZWQgZm9yIHRlc3RpbmcgcHVycG9zZXMuXG4gICovXG4gIGZ1bmN0aW9uIHRlcm1pbmF0ZSgpIHtcbiAgICB3aW5kb3cub25oYXNoY2hhbmdlID0gbnVsbDtcbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBsaXN0ZW5Ub1VSTENoYW5nZXMoKSB7XG5cbiAgICBmdW5jdGlvbiBvblVSTENoYW5nZShldnQpIHtcbiAgICAgIGlmIChpZ25vcmVOZXh0VVJMQ2hhbmdlKSB7XG4gICAgICAgIGlnbm9yZU5leHRVUkxDaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV3U3RhdGUgPSBldnQuc3RhdGUgfHwgdXJsUGF0aFF1ZXJ5KCk7XG5cbiAgICAgIGxvZ2dlci5sb2coJ1VSTCBjaGFuZ2VkOiB7MH0nLCBuZXdTdGF0ZSk7XG4gICAgICB1cmxDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIHNldFN0YXRlRm9yUGF0aFF1ZXJ5KG5ld1N0YXRlKTtcbiAgICB9XG5cbiAgICB3aW5kb3dbaXNIYXNoTW9kZSgpID8gJ29uaGFzaGNoYW5nZScgOiAnb25wb3BzdGF0ZSddID0gb25VUkxDaGFuZ2U7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0U3RhdGVzKCkge1xuICAgIHZhciBzdGF0ZUFycmF5ID0gdXRpbC5vYmplY3RUb0FycmF5KHN0YXRlcyk7XG5cbiAgICBhZGREZWZhdWx0U3RhdGVzKHN0YXRlQXJyYXkpO1xuXG4gICAgZWFjaFJvb3RTdGF0ZShmdW5jdGlvbiAobmFtZSwgc3RhdGUpIHtcbiAgICAgIHN0YXRlLmluaXQocm91dGVyLCBuYW1lKTtcbiAgICB9KTtcblxuICAgIGFzc2VydFBhdGhVbmlxdWVuZXNzKHN0YXRlQXJyYXkpO1xuXG4gICAgbGVhZlN0YXRlcyA9IHJlZ2lzdGVyTGVhZlN0YXRlcyhzdGF0ZUFycmF5LCB7fSk7XG5cbiAgICBhc3NlcnROb0FtYmlndW91c1BhdGhzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBhc3NlcnRQYXRoVW5pcXVlbmVzcyhzdGF0ZXMpIHtcbiAgICB2YXIgcGF0aHMgPSB7fTtcblxuICAgIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgaWYgKHBhdGhzW3N0YXRlLnBhdGhdKSB7XG4gICAgICAgIHZhciBmdWxsUGF0aHMgPSBzdGF0ZXMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgcmV0dXJuIHMuZnVsbFBhdGgoKSB8fCAnZW1wdHknO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUd28gc2libGluZyBzdGF0ZXMgaGF2ZSB0aGUgc2FtZSBwYXRoICgnICsgZnVsbFBhdGhzICsgJyknKTtcbiAgICAgIH1cblxuICAgICAgcGF0aHNbc3RhdGUucGF0aF0gPSAxO1xuICAgICAgYXNzZXJ0UGF0aFVuaXF1ZW5lc3Moc3RhdGUuY2hpbGRyZW4pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNzZXJ0Tm9BbWJpZ3VvdXNQYXRocygpIHtcbiAgICB2YXIgcGF0aHMgPSB7fTtcblxuICAgIGZvciAodmFyIG5hbWUgaW4gbGVhZlN0YXRlcykge1xuICAgICAgdmFyIHBhdGggPSB1dGlsLm5vcm1hbGl6ZVBhdGhRdWVyeShsZWFmU3RhdGVzW25hbWVdLmZ1bGxQYXRoKCkpO1xuICAgICAgaWYgKHBhdGhzW3BhdGhdKSB0aHJvdyBuZXcgRXJyb3IoJ0FtYmlndW91cyBzdGF0ZSBwYXRoczogJyArIHBhdGgpO1xuICAgICAgcGF0aHNbcGF0aF0gPSAxO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZERlZmF1bHRTdGF0ZXMoc3RhdGVzKSB7XG4gICAgc3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICB2YXIgY2hpbGRyZW4gPSB1dGlsLm9iamVjdFRvQXJyYXkoc3RhdGUuc3RhdGVzKTtcblxuICAgICAgLy8gVGhpcyBpcyBhIHBhcmVudCBzdGF0ZTogQWRkIGEgZGVmYXVsdCBzdGF0ZSB0byBpdCBpZiB0aGVyZSBpc24ndCBhbHJlYWR5IG9uZVxuICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICBhZGREZWZhdWx0U3RhdGVzKGNoaWxkcmVuKTtcblxuICAgICAgICB2YXIgaGFzRGVmYXVsdFN0YXRlID0gY2hpbGRyZW4ucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIHN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlLnBhdGggPT0gJycgfHwgcmVzdWx0O1xuICAgICAgICB9LCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKGhhc0RlZmF1bHRTdGF0ZSkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBkZWZhdWx0U3RhdGUgPSBTdGF0ZSh7IHVyaTogJycgfSk7XG4gICAgICAgIHN0YXRlLnN0YXRlcy5fZGVmYXVsdF8gPSBkZWZhdWx0U3RhdGU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBlYWNoUm9vdFN0YXRlKGNhbGxiYWNrKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiBzdGF0ZXMpIHtcbiAgICAgIGNhbGxiYWNrKG5hbWUsIHN0YXRlc1tuYW1lXSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJMZWFmU3RhdGVzKHN0YXRlcywgbGVhZlN0YXRlcykge1xuICAgIHJldHVybiBzdGF0ZXMucmVkdWNlKGZ1bmN0aW9uIChsZWFmU3RhdGVzLCBzdGF0ZSkge1xuICAgICAgaWYgKHN0YXRlLmNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIHJlZ2lzdGVyTGVhZlN0YXRlcyhzdGF0ZS5jaGlsZHJlbiwgbGVhZlN0YXRlcyk7ZWxzZSB7XG4gICAgICAgIGxlYWZTdGF0ZXNbc3RhdGUuZnVsbE5hbWVdID0gc3RhdGU7XG4gICAgICAgIHN0YXRlLnBhdGhzID0gdXRpbC5wYXJzZVBhdGhzKHN0YXRlLmZ1bGxQYXRoKCkpO1xuICAgICAgICByZXR1cm4gbGVhZlN0YXRlcztcbiAgICAgIH1cbiAgICB9LCBsZWFmU3RhdGVzKTtcbiAgfVxuXG4gIC8qXG4gICogUmVxdWVzdCBhIHByb2dyYW1tYXRpYyBzdGF0ZSBjaGFuZ2UuXG4gICpcbiAgKiBUd28gbm90YXRpb25zIGFyZSBzdXBwb3J0ZWQ6XG4gICogdHJhbnNpdGlvblRvKCdteS50YXJnZXQuc3RhdGUnLCB7aWQ6IDMzLCBmaWx0ZXI6ICdkZXNjJ30pXG4gICogdHJhbnNpdGlvblRvKCd0YXJnZXQvMzM/ZmlsdGVyPWRlc2MnKVxuICAqL1xuICBmdW5jdGlvbiB0cmFuc2l0aW9uVG8ocGF0aFF1ZXJ5T3JOYW1lKSB7XG4gICAgdmFyIG5hbWUgPSBsZWFmU3RhdGVzW3BhdGhRdWVyeU9yTmFtZV07XG4gICAgdmFyIHBhcmFtcyA9IChuYW1lID8gYXJndW1lbnRzWzFdIDogbnVsbCkgfHwge307XG4gICAgdmFyIGFjYyA9IG5hbWUgPyBhcmd1bWVudHNbMl0gOiBhcmd1bWVudHNbMV07XG5cbiAgICBsb2dnZXIubG9nKCdDaGFuZ2luZyBzdGF0ZSB0byB7MH0nLCBwYXRoUXVlcnlPck5hbWUgfHwgJ1wiXCInKTtcblxuICAgIHVybENoYW5nZWQgPSBmYWxzZTtcblxuICAgIGlmIChuYW1lKSBzZXRTdGF0ZUJ5TmFtZShuYW1lLCBwYXJhbXMsIGFjYyk7ZWxzZSBzZXRTdGF0ZUZvclBhdGhRdWVyeShwYXRoUXVlcnlPck5hbWUsIGFjYyk7XG4gIH1cblxuICAvKlxuICAqIEF0dGVtcHQgdG8gbmF2aWdhdGUgdG8gJ3N0YXRlTmFtZScgd2l0aCBpdHMgcHJldmlvdXMgcGFyYW1zIG9yXG4gICogZmFsbGJhY2sgdG8gdGhlIGRlZmF1bHRQYXJhbXMgcGFyYW1ldGVyIGlmIHRoZSBzdGF0ZSB3YXMgbmV2ZXIgZW50ZXJlZC5cbiAgKi9cbiAgZnVuY3Rpb24gYmFja1RvKHN0YXRlTmFtZSwgZGVmYXVsdFBhcmFtcywgYWNjKSB7XG4gICAgdmFyIHBhcmFtcyA9IGxlYWZTdGF0ZXNbc3RhdGVOYW1lXS5sYXN0UGFyYW1zIHx8IGRlZmF1bHRQYXJhbXM7XG4gICAgdHJhbnNpdGlvblRvKHN0YXRlTmFtZSwgcGFyYW1zLCBhY2MpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RhdGVGb3JQYXRoUXVlcnkocGF0aFF1ZXJ5LCBhY2MpIHtcbiAgICB2YXIgc3RhdGUsIHBhcmFtcywgX3N0YXRlLCBfcGFyYW1zO1xuXG4gICAgY3VycmVudFBhdGhRdWVyeSA9IHV0aWwubm9ybWFsaXplUGF0aFF1ZXJ5KHBhdGhRdWVyeSk7XG5cbiAgICB2YXIgcHEgPSBjdXJyZW50UGF0aFF1ZXJ5LnNwbGl0KCc/Jyk7XG4gICAgdmFyIHBhdGggPSBwcVswXTtcbiAgICB2YXIgcXVlcnkgPSBwcVsxXTtcbiAgICB2YXIgcGF0aHMgPSB1dGlsLnBhcnNlUGF0aHMocGF0aCk7XG4gICAgdmFyIHF1ZXJ5UGFyYW1zID0gdXRpbC5wYXJzZVF1ZXJ5UGFyYW1zKHF1ZXJ5KTtcblxuICAgIGZvciAodmFyIG5hbWUgaW4gbGVhZlN0YXRlcykge1xuICAgICAgX3N0YXRlID0gbGVhZlN0YXRlc1tuYW1lXTtcbiAgICAgIF9wYXJhbXMgPSBfc3RhdGUubWF0Y2hlcyhwYXRocyk7XG5cbiAgICAgIGlmIChfcGFyYW1zKSB7XG4gICAgICAgIHN0YXRlID0gX3N0YXRlO1xuICAgICAgICBwYXJhbXMgPSB1dGlsLm1lcmdlT2JqZWN0cyhfcGFyYW1zLCBxdWVyeVBhcmFtcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdGF0ZSkgc2V0U3RhdGUoc3RhdGUsIHBhcmFtcywgYWNjKTtlbHNlIG5vdEZvdW5kKGN1cnJlbnRQYXRoUXVlcnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RhdGVCeU5hbWUobmFtZSwgcGFyYW1zLCBhY2MpIHtcbiAgICB2YXIgc3RhdGUgPSBsZWFmU3RhdGVzW25hbWVdO1xuXG4gICAgaWYgKCFzdGF0ZSkgcmV0dXJuIG5vdEZvdW5kKG5hbWUpO1xuXG4gICAgdmFyIHBhdGhRdWVyeSA9IGludGVycG9sYXRlKHN0YXRlLCBwYXJhbXMpO1xuICAgIHNldFN0YXRlRm9yUGF0aFF1ZXJ5KHBhdGhRdWVyeSwgYWNjKTtcbiAgfVxuXG4gIC8qXG4gICogQWRkIGEgbmV3IHJvb3Qgc3RhdGUgdG8gdGhlIHJvdXRlci5cbiAgKiBUaGUgbmFtZSBtdXN0IGJlIHVuaXF1ZSBhbW9uZyByb290IHN0YXRlcy5cbiAgKi9cbiAgZnVuY3Rpb24gYWRkU3RhdGUobmFtZSwgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGVzW25hbWVdKSB0aHJvdyBuZXcgRXJyb3IoJ0Egc3RhdGUgYWxyZWFkeSBleGlzdCBpbiB0aGUgcm91dGVyIHdpdGggdGhlIG5hbWUgJyArIG5hbWUpO1xuXG4gICAgc3RhdGUgPSBzdGF0ZVRyZWUoc3RhdGUpO1xuXG4gICAgc3RhdGVzW25hbWVdID0gc3RhdGU7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHN0YXRlLmluaXQocm91dGVyLCBuYW1lKTtcbiAgICAgIHJlZ2lzdGVyTGVhZlN0YXRlcyh7IF86IHN0YXRlIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByb3V0ZXI7XG4gIH1cblxuICAvKlxuICAqIFJlYWQgdGhlIHBhdGgvcXVlcnkgZnJvbSB0aGUgVVJMLlxuICAqL1xuICBmdW5jdGlvbiB1cmxQYXRoUXVlcnkoKSB7XG4gICAgdmFyIGhhc2hTbGFzaCA9IGxvY2F0aW9uLmhyZWYuaW5kZXhPZihoYXNoU2xhc2hTdHJpbmcpO1xuICAgIHZhciBwYXRoUXVlcnk7XG5cbiAgICBpZiAoaGFzaFNsYXNoID4gLTEpIHBhdGhRdWVyeSA9IGxvY2F0aW9uLmhyZWYuc2xpY2UoaGFzaFNsYXNoICsgaGFzaFNsYXNoU3RyaW5nLmxlbmd0aCk7ZWxzZSBpZiAoaXNIYXNoTW9kZSgpKSBwYXRoUXVlcnkgPSAnLyc7ZWxzZSBwYXRoUXVlcnkgPSAobG9jYXRpb24ucGF0aG5hbWUgKyBsb2NhdGlvbi5zZWFyY2gpLnNsaWNlKDEpO1xuXG4gICAgcmV0dXJuIHV0aWwubm9ybWFsaXplUGF0aFF1ZXJ5KHBhdGhRdWVyeSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0hhc2hNb2RlKCkge1xuICAgIHJldHVybiBvcHRpb25zLnVybFN5bmMgPT0gJ2hhc2gnO1xuICB9XG5cbiAgLypcbiAgKiBDb21wdXRlIGEgbGluayB0aGF0IGNhbiBiZSB1c2VkIGluIGFuY2hvcnMnIGhyZWYgYXR0cmlidXRlc1xuICAqIGZyb20gYSBzdGF0ZSBuYW1lIGFuZCBhIGxpc3Qgb2YgcGFyYW1zLCBhLmsuYSByZXZlcnNlIHJvdXRpbmcuXG4gICovXG4gIGZ1bmN0aW9uIGxpbmsoc3RhdGVOYW1lLCBwYXJhbXMpIHtcbiAgICB2YXIgc3RhdGUgPSBsZWFmU3RhdGVzW3N0YXRlTmFtZV07XG4gICAgaWYgKCFzdGF0ZSkgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZmluZCBzdGF0ZSAnICsgc3RhdGVOYW1lKTtcblxuICAgIHZhciBpbnRlcnBvbGF0ZWQgPSBpbnRlcnBvbGF0ZShzdGF0ZSwgcGFyYW1zKTtcbiAgICB2YXIgdXJpID0gdXRpbC5ub3JtYWxpemVQYXRoUXVlcnkoaW50ZXJwb2xhdGVkKTtcblxuICAgIHJldHVybiBpc0hhc2hNb2RlKCkgPyAnIycgKyBvcHRpb25zLmhhc2hQcmVmaXggKyB1cmkgOiB1cmk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShzdGF0ZSwgcGFyYW1zKSB7XG4gICAgdmFyIGVuY29kZWRQYXJhbXMgPSB7fTtcblxuICAgIGZvciAodmFyIGtleSBpbiBwYXJhbXMpIHtcbiAgICAgIGVuY29kZWRQYXJhbXNba2V5XSA9IGVuY29kZVVSSUNvbXBvbmVudChwYXJhbXNba2V5XSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlLmludGVycG9sYXRlKGVuY29kZWRQYXJhbXMpO1xuICB9XG5cbiAgLypcbiAgKiBSZXR1cm5zIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHJvdXRlci5cbiAgKi9cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudCgpIHtcbiAgICByZXR1cm4gY3VycmVudFN0YXRlICYmIGN1cnJlbnRTdGF0ZS5hc1B1YmxpYztcbiAgfVxuXG4gIC8qXG4gICogUmV0dXJucyBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBwcmV2aW91cyBzdGF0ZSBvZiB0aGUgcm91dGVyXG4gICogb3IgbnVsbCBpZiB0aGUgcm91dGVyIGlzIHN0aWxsIGluIGl0cyBpbml0aWFsIHN0YXRlLlxuICAqL1xuICBmdW5jdGlvbiBnZXRQcmV2aW91cygpIHtcbiAgICByZXR1cm4gcHJldmlvdXNTdGF0ZSAmJiBwcmV2aW91c1N0YXRlLmFzUHVibGljO1xuICB9XG5cbiAgLypcbiAgKiBSZXR1cm5zIHRoZSBkaWZmIGJldHdlZW4gdGhlIGN1cnJlbnQgcGFyYW1zIGFuZCB0aGUgcHJldmlvdXMgb25lcy5cbiAgKi9cbiAgZnVuY3Rpb24gZ2V0UGFyYW1zRGlmZigpIHtcbiAgICByZXR1cm4gY3VycmVudFBhcmFtc0RpZmY7XG4gIH1cblxuICBmdW5jdGlvbiBhbGxTdGF0ZXNSZWMoc3RhdGVzLCBhY2MpIHtcbiAgICBhY2MucHVzaC5hcHBseShhY2MsIHN0YXRlcyk7XG4gICAgc3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICByZXR1cm4gYWxsU3RhdGVzUmVjKHN0YXRlLmNoaWxkcmVuLCBhY2MpO1xuICAgIH0pO1xuICAgIHJldHVybiBhY2M7XG4gIH1cblxuICBmdW5jdGlvbiBhbGxTdGF0ZXMoKSB7XG4gICAgcmV0dXJuIGFsbFN0YXRlc1JlYyh1dGlsLm9iamVjdFRvQXJyYXkoc3RhdGVzKSwgW10pO1xuICB9XG5cbiAgLypcbiAgKiBSZXR1cm5zIHRoZSBzdGF0ZSBvYmplY3QgdGhhdCB3YXMgYnVpbHQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBvYmplY3Qgb3IgdGhhdCBoYXMgdGhlIGdpdmVuIGZ1bGxOYW1lLlxuICAqIFJldHVybnMgdW5kZWZpbmVkIGlmIHRoZSBzdGF0ZSBkb2Vzbid0IGV4aXN0LlxuICAqL1xuICBmdW5jdGlvbiBmaW5kU3RhdGUoYnkpIHtcbiAgICB2YXIgZmlsdGVyRm4gPSAodHlwZW9mIGJ5ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihieSkpID09PSAnb2JqZWN0JyA/IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgcmV0dXJuIGJ5ID09PSBzdGF0ZS5vcHRpb25zO1xuICAgIH0gOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgIHJldHVybiBieSA9PT0gc3RhdGUuZnVsbE5hbWU7XG4gICAgfTtcblxuICAgIHZhciBzdGF0ZSA9IGFsbFN0YXRlcygpLmZpbHRlcihmaWx0ZXJGbilbMF07XG4gICAgcmV0dXJuIHN0YXRlICYmIHN0YXRlLmFzUHVibGljO1xuICB9XG5cbiAgLypcbiAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHJvdXRlciBpcyBleGVjdXRpbmcgaXRzIGZpcnN0IHRyYW5zaXRpb24uXG4gICovXG4gIGZ1bmN0aW9uIGlzRmlyc3RUcmFuc2l0aW9uKCkge1xuICAgIHJldHVybiBwcmV2aW91c1N0YXRlID09IG51bGw7XG4gIH1cblxuICAvKiBGbHVlbnQgQVBJIGFsaWFzICovXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHJvdXRlci50cmFuc2l0aW9uLm9uLmFwcGx5KHJvdXRlci50cmFuc2l0aW9uLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiByb3V0ZXI7XG4gIH1cblxuICBmdW5jdGlvbiBzdGF0ZVRyZWVzKHN0YXRlcykge1xuICAgIHJldHVybiB1dGlsLm1hcFZhbHVlcyhzdGF0ZXMsIHN0YXRlVHJlZSk7XG4gIH1cblxuICAvKlxuICAqIENyZWF0ZXMgYW4gaW50ZXJuYWwgU3RhdGUgb2JqZWN0IGZyb20gYSBzcGVjaWZpY2F0aW9uIFBPSk8uXG4gICovXG4gIGZ1bmN0aW9uIHN0YXRlVHJlZShzdGF0ZSkge1xuICAgIGlmIChzdGF0ZS5jaGlsZHJlbikgc3RhdGUuY2hpbGRyZW4gPSBzdGF0ZVRyZWVzKHN0YXRlLmNoaWxkcmVuKTtcbiAgICByZXR1cm4gU3RhdGUoc3RhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gbG9nU3RhdGVUcmVlKCkge1xuICAgIGlmICghbG9nZ2VyLmVuYWJsZWQpIHJldHVybjtcblxuICAgIHZhciBpbmRlbnQgPSBmdW5jdGlvbiBpbmRlbnQobGV2ZWwpIHtcbiAgICAgIGlmIChsZXZlbCA9PSAwKSByZXR1cm4gJyc7XG4gICAgICByZXR1cm4gbmV3IEFycmF5KDIgKyAobGV2ZWwgLSAxKSAqIDQpLmpvaW4oJyAnKSArICfilIDilIAgJztcbiAgICB9O1xuXG4gICAgdmFyIHN0YXRlVHJlZSA9IGZ1bmN0aW9uIHN0YXRlVHJlZShzdGF0ZSkge1xuICAgICAgdmFyIHBhdGggPSB1dGlsLm5vcm1hbGl6ZVBhdGhRdWVyeShzdGF0ZS5mdWxsUGF0aCgpKTtcbiAgICAgIHZhciBwYXRoU3RyID0gc3RhdGUuY2hpbGRyZW4ubGVuZ3RoID09IDAgPyAnIChAIHBhdGgpJy5yZXBsYWNlKCdwYXRoJywgcGF0aCkgOiAnJztcbiAgICAgIHZhciBzdHIgPSBpbmRlbnQoc3RhdGUucGFyZW50cy5sZW5ndGgpICsgc3RhdGUubmFtZSArIHBhdGhTdHIgKyAnXFxuJztcbiAgICAgIHJldHVybiBzdHIgKyBzdGF0ZS5jaGlsZHJlbi5tYXAoc3RhdGVUcmVlKS5qb2luKCcnKTtcbiAgICB9O1xuXG4gICAgdmFyIG1zZyA9ICdcXG5TdGF0ZSB0cmVlXFxuXFxuJztcbiAgICBtc2cgKz0gdXRpbC5vYmplY3RUb0FycmF5KHN0YXRlcykubWFwKHN0YXRlVHJlZSkuam9pbignJyk7XG4gICAgbXNnICs9ICdcXG4nO1xuXG4gICAgbG9nZ2VyLmxvZyhtc2cpO1xuICB9XG5cbiAgLy8gUHVibGljIG1ldGhvZHNcblxuICByb3V0ZXIuY29uZmlndXJlID0gY29uZmlndXJlO1xuICByb3V0ZXIuaW5pdCA9IGluaXQ7XG4gIHJvdXRlci50cmFuc2l0aW9uVG8gPSB0cmFuc2l0aW9uVG87XG4gIHJvdXRlci5iYWNrVG8gPSBiYWNrVG87XG4gIHJvdXRlci5hZGRTdGF0ZSA9IGFkZFN0YXRlO1xuICByb3V0ZXIubGluayA9IGxpbms7XG4gIHJvdXRlci5jdXJyZW50ID0gZ2V0Q3VycmVudDtcbiAgcm91dGVyLnByZXZpb3VzID0gZ2V0UHJldmlvdXM7XG4gIHJvdXRlci5maW5kU3RhdGUgPSBmaW5kU3RhdGU7XG4gIHJvdXRlci5pc0ZpcnN0VHJhbnNpdGlvbiA9IGlzRmlyc3RUcmFuc2l0aW9uO1xuICByb3V0ZXIucGFyYW1zRGlmZiA9IGdldFBhcmFtc0RpZmY7XG4gIHJvdXRlci5vcHRpb25zID0gb3B0aW9ucztcblxuICByb3V0ZXIudHJhbnNpdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcm91dGVyLm9uID0gb247XG5cbiAgLy8gVXNlZCBmb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5XG4gIHJvdXRlci51cmxQYXRoUXVlcnkgPSB1cmxQYXRoUXVlcnk7XG4gIHJvdXRlci50ZXJtaW5hdGUgPSB0ZXJtaW5hdGU7XG5cbiAgdXRpbC5tZXJnZU9iamVjdHMoYXBpLCByb3V0ZXIpO1xuXG4gIHJldHVybiByb3V0ZXI7XG59XG5cbi8vIExvZ2dpbmdcblxudmFyIGxvZ2dlciA9IHtcbiAgbG9nOiB1dGlsLm5vb3AsXG4gIGVycm9yOiB1dGlsLm5vb3AsXG4gIGVuYWJsZWQ6IGZhbHNlXG59O1xuXG5Sb3V0ZXIuZW5hYmxlTG9ncyA9IGZ1bmN0aW9uICgpIHtcbiAgbG9nZ2VyLmVuYWJsZWQgPSB0cnVlO1xuXG4gIGxvZ2dlci5sb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIG1lc3NhZ2UgPSB1dGlsLm1ha2VNZXNzYWdlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICB9O1xuXG4gIGxvZ2dlci5lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgYXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlID0gdXRpbC5tYWtlTWVzc2FnZS5hcHBseShudWxsLCBhcmdzKTtcbiAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vYWJ5c3NhL2xpYi9Sb3V0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vYWJ5c3NhL34vZXZlbnRzL2V2ZW50cy5qc1xuICoqIG1vZHVsZSBpZCA9IDE1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcbid1c2Ugc3RyaWN0JztcblxudmFyIHJvdXRlcjtcblxuZnVuY3Rpb24gb25Nb3VzZURvd24oZXZ0KSB7XG4gIHZhciBocmVmID0gaHJlZkZvckV2ZW50KGV2dCk7XG5cbiAgaWYgKGhyZWYgIT09IHVuZGVmaW5lZCkgcm91dGVyLnRyYW5zaXRpb25UbyhocmVmKTtcbn1cblxuZnVuY3Rpb24gb25Nb3VzZUNsaWNrKGV2dCkge1xuICB2YXIgaHJlZiA9IGhyZWZGb3JFdmVudChldnQpO1xuXG4gIGlmIChocmVmICE9PSB1bmRlZmluZWQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHJvdXRlci50cmFuc2l0aW9uVG8oaHJlZik7XG4gIH1cbn1cblxuZnVuY3Rpb24gaHJlZkZvckV2ZW50KGV2dCkge1xuICBpZiAoZXZ0LmRlZmF1bHRQcmV2ZW50ZWQgfHwgZXZ0Lm1ldGFLZXkgfHwgZXZ0LmN0cmxLZXkgfHwgIWlzTGVmdEJ1dHRvbihldnQpKSByZXR1cm47XG5cbiAgdmFyIHRhcmdldCA9IGV2dC50YXJnZXQ7XG4gIHZhciBhbmNob3IgPSBhbmNob3JUYXJnZXQodGFyZ2V0KTtcbiAgaWYgKCFhbmNob3IpIHJldHVybjtcblxuICB2YXIgZGF0YU5hdiA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmF2Jyk7XG5cbiAgaWYgKGRhdGFOYXYgPT0gJ2lnbm9yZScpIHJldHVybjtcbiAgaWYgKGV2dC50eXBlID09ICdtb3VzZWRvd24nICYmIGRhdGFOYXYgIT0gJ21vdXNlZG93bicpIHJldHVybjtcblxuICB2YXIgaHJlZiA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblxuICBpZiAoIWhyZWYpIHJldHVybjtcbiAgaWYgKGhyZWYuY2hhckF0KDApID09ICcjJykge1xuICAgIGlmIChyb3V0ZXIub3B0aW9ucy51cmxTeW5jICE9ICdoYXNoJykgcmV0dXJuO1xuICAgIGhyZWYgPSBocmVmLnNsaWNlKDEpO1xuICB9XG4gIGlmIChhbmNob3IuZ2V0QXR0cmlidXRlKCd0YXJnZXQnKSA9PSAnX2JsYW5rJykgcmV0dXJuO1xuICBpZiAoIWlzTG9jYWxMaW5rKGFuY2hvcikpIHJldHVybjtcblxuICAvLyBBdCB0aGlzIHBvaW50LCB3ZSBoYXZlIGEgdmFsaWQgaHJlZiB0byBmb2xsb3cuXG4gIC8vIERpZCB0aGUgbmF2aWdhdGlvbiBhbHJlYWR5IG9jY3VyIG9uIG1vdXNlZG93biB0aG91Z2g/XG4gIGlmIChldnQudHlwZSA9PSAnY2xpY2snICYmIGRhdGFOYXYgPT0gJ21vdXNlZG93bicpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gaHJlZjtcbn1cblxuZnVuY3Rpb24gaXNMZWZ0QnV0dG9uKGV2dCkge1xuICByZXR1cm4gZXZ0LndoaWNoID09IDE7XG59XG5cbmZ1bmN0aW9uIGFuY2hvclRhcmdldCh0YXJnZXQpIHtcbiAgd2hpbGUgKHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQubm9kZU5hbWUgPT0gJ0EnKSByZXR1cm4gdGFyZ2V0O1xuICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzTG9jYWxMaW5rKGFuY2hvcikge1xuICB2YXIgaG9zdG5hbWUgPSBhbmNob3IuaG9zdG5hbWU7XG4gIHZhciBwb3J0ID0gYW5jaG9yLnBvcnQ7XG5cbiAgLy8gSUUxMCBjYW4gbG9zZSB0aGUgaG9zdG5hbWUvcG9ydCBwcm9wZXJ0eSB3aGVuIHNldHRpbmcgYSByZWxhdGl2ZSBocmVmIGZyb20gSlNcbiAgaWYgKCFob3N0bmFtZSkge1xuICAgIHZhciB0ZW1wQW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgdGVtcEFuY2hvci5ocmVmID0gYW5jaG9yLmhyZWY7XG4gICAgaG9zdG5hbWUgPSB0ZW1wQW5jaG9yLmhvc3RuYW1lO1xuICAgIHBvcnQgPSB0ZW1wQW5jaG9yLnBvcnQ7XG4gIH1cblxuICB2YXIgc2FtZUhvc3RuYW1lID0gaG9zdG5hbWUgPT0gbG9jYXRpb24uaG9zdG5hbWU7XG4gIHZhciBzYW1lUG9ydCA9IChwb3J0IHx8ICc4MCcpID09IChsb2NhdGlvbi5wb3J0IHx8ICc4MCcpO1xuXG4gIHJldHVybiBzYW1lSG9zdG5hbWUgJiYgc2FtZVBvcnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW50ZXJjZXB0QW5jaG9ycyhmb3JSb3V0ZXIpIHtcbiAgcm91dGVyID0gZm9yUm91dGVyO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk1vdXNlQ2xpY2spO1xufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9hYnlzc2EvbGliL2FuY2hvcnMuanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXG4ndXNlIHN0cmljdCc7XG5cbi8qXG4qIENyZWF0ZXMgYSBuZXcgU3RhdGVXaXRoUGFyYW1zIGluc3RhbmNlLlxuKlxuKiBTdGF0ZVdpdGhQYXJhbXMgaXMgdGhlIG1lcmdlIGJldHdlZW4gYSBTdGF0ZSBvYmplY3QgKGNyZWF0ZWQgYW5kIGFkZGVkIHRvIHRoZSByb3V0ZXIgYmVmb3JlIGluaXQpXG4qIGFuZCBwYXJhbXMgKGJvdGggcGF0aCBhbmQgcXVlcnkgcGFyYW1zLCBleHRyYWN0ZWQgZnJvbSB0aGUgVVJMIGFmdGVyIGluaXQpXG4qXG4qIFRoaXMgaXMgYW4gaW50ZXJuYWwgbW9kZWw7IFRoZSBwdWJsaWMgbW9kZWwgaXMgdGhlIGFzUHVibGljIHByb3BlcnR5LlxuKi9cblxuZnVuY3Rpb24gU3RhdGVXaXRoUGFyYW1zKHN0YXRlLCBwYXJhbXMsIHBhdGhRdWVyeSkge1xuICByZXR1cm4ge1xuICAgIHN0YXRlOiBzdGF0ZSxcbiAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICB0b1N0cmluZzogdG9TdHJpbmcsXG4gICAgYXNQdWJsaWM6IG1ha2VQdWJsaWNBUEkoc3RhdGUsIHBhcmFtcywgcGF0aFF1ZXJ5KVxuICB9O1xufVxuXG5mdW5jdGlvbiBtYWtlUHVibGljQVBJKHN0YXRlLCBwYXJhbXMsIHBhdGhRdWVyeSkge1xuXG4gIC8qXG4gICogUmV0dXJucyB3aGV0aGVyIHRoaXMgc3RhdGUgb3IgYW55IG9mIGl0cyBwYXJlbnRzIGhhcyB0aGUgZ2l2ZW4gZnVsbE5hbWUuXG4gICovXG4gIGZ1bmN0aW9uIGlzSW4oZnVsbFN0YXRlTmFtZSkge1xuICAgIHZhciBjdXJyZW50ID0gc3RhdGU7XG4gICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICAgIGlmIChjdXJyZW50LmZ1bGxOYW1lID09IGZ1bGxTdGF0ZU5hbWUpIHJldHVybiB0cnVlO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHVyaTogcGF0aFF1ZXJ5LFxuICAgIHBhcmFtczogcGFyYW1zLFxuICAgIG5hbWU6IHN0YXRlID8gc3RhdGUubmFtZSA6ICcnLFxuICAgIGZ1bGxOYW1lOiBzdGF0ZSA/IHN0YXRlLmZ1bGxOYW1lIDogJycsXG4gICAgZGF0YTogc3RhdGUgPyBzdGF0ZS5kYXRhIDogbnVsbCxcbiAgICBpc0luOiBpc0luXG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICB2YXIgbmFtZSA9IHRoaXMuc3RhdGUgJiYgdGhpcy5zdGF0ZS5mdWxsTmFtZTtcbiAgcmV0dXJuIG5hbWUgKyAnOicgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnBhcmFtcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGVXaXRoUGFyYW1zO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2FieXNzYS9saWIvU3RhdGVXaXRoUGFyYW1zLmpzXG4gKiogbW9kdWxlIGlkID0gMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlxuJ3VzZSBzdHJpY3QnO1xuXG4vKlxuKiBDcmVhdGUgYSBuZXcgVHJhbnNpdGlvbiBpbnN0YW5jZS5cbiovXG5cbmZ1bmN0aW9uIFRyYW5zaXRpb24oZnJvbVN0YXRlV2l0aFBhcmFtcywgdG9TdGF0ZVdpdGhQYXJhbXMsIHBhcmFtc0RpZmYsIGFjYywgcm91dGVyLCBsb2dnZXIpIHtcbiAgdmFyIHJvb3QsIGVudGVycywgZXhpdHM7XG5cbiAgdmFyIGZyb21TdGF0ZSA9IGZyb21TdGF0ZVdpdGhQYXJhbXMgJiYgZnJvbVN0YXRlV2l0aFBhcmFtcy5zdGF0ZTtcbiAgdmFyIHRvU3RhdGUgPSB0b1N0YXRlV2l0aFBhcmFtcy5zdGF0ZTtcbiAgdmFyIHBhcmFtcyA9IHRvU3RhdGVXaXRoUGFyYW1zLnBhcmFtcztcbiAgdmFyIGlzVXBkYXRlID0gZnJvbVN0YXRlID09IHRvU3RhdGU7XG5cbiAgdmFyIHRyYW5zaXRpb24gPSB7XG4gICAgZnJvbTogZnJvbVN0YXRlLFxuICAgIHRvOiB0b1N0YXRlLFxuICAgIHRvUGFyYW1zOiBwYXJhbXMsXG4gICAgY2FuY2VsOiBjYW5jZWwsXG4gICAgY2FuY2VsbGVkOiBmYWxzZSxcbiAgICBjdXJyZW50U3RhdGU6IGZyb21TdGF0ZSxcbiAgICBydW46IHJ1blxuICB9O1xuXG4gIC8vIFRoZSBmaXJzdCB0cmFuc2l0aW9uIGhhcyBubyBmcm9tU3RhdGUuXG4gIGlmIChmcm9tU3RhdGUpIHJvb3QgPSB0cmFuc2l0aW9uUm9vdChmcm9tU3RhdGUsIHRvU3RhdGUsIGlzVXBkYXRlLCBwYXJhbXNEaWZmKTtcblxuICB2YXIgaW5jbHVzaXZlID0gIXJvb3QgfHwgaXNVcGRhdGU7XG4gIGV4aXRzID0gZnJvbVN0YXRlID8gdHJhbnNpdGlvblN0YXRlcyhmcm9tU3RhdGUsIHJvb3QsIGluY2x1c2l2ZSkgOiBbXTtcbiAgZW50ZXJzID0gdHJhbnNpdGlvblN0YXRlcyh0b1N0YXRlLCByb290LCBpbmNsdXNpdmUpLnJldmVyc2UoKTtcblxuICBmdW5jdGlvbiBydW4oKSB7XG4gICAgc3RhcnRUcmFuc2l0aW9uKGVudGVycywgZXhpdHMsIHBhcmFtcywgdHJhbnNpdGlvbiwgaXNVcGRhdGUsIGFjYywgcm91dGVyLCBsb2dnZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIHRyYW5zaXRpb24uY2FuY2VsbGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB0cmFuc2l0aW9uO1xufVxuXG5mdW5jdGlvbiBzdGFydFRyYW5zaXRpb24oZW50ZXJzLCBleGl0cywgcGFyYW1zLCB0cmFuc2l0aW9uLCBpc1VwZGF0ZSwgYWNjLCByb3V0ZXIsIGxvZ2dlcikge1xuICBhY2MgPSBhY2MgfHwge307XG5cbiAgdHJhbnNpdGlvbi5leGl0aW5nID0gdHJ1ZTtcbiAgZXhpdHMuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICBpZiAoaXNVcGRhdGUgJiYgc3RhdGUudXBkYXRlKSByZXR1cm47XG4gICAgcnVuU3RlcChzdGF0ZSwgJ2V4aXQnLCBwYXJhbXMsIHRyYW5zaXRpb24sIGFjYywgcm91dGVyLCBsb2dnZXIpO1xuICB9KTtcbiAgdHJhbnNpdGlvbi5leGl0aW5nID0gZmFsc2U7XG5cbiAgZW50ZXJzLmZvckVhY2goZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGZuID0gaXNVcGRhdGUgJiYgc3RhdGUudXBkYXRlID8gJ3VwZGF0ZScgOiAnZW50ZXInO1xuICAgIHJ1blN0ZXAoc3RhdGUsIGZuLCBwYXJhbXMsIHRyYW5zaXRpb24sIGFjYywgcm91dGVyLCBsb2dnZXIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcnVuU3RlcChzdGF0ZSwgc3RlcEZuLCBwYXJhbXMsIHRyYW5zaXRpb24sIGFjYywgcm91dGVyLCBsb2dnZXIpIHtcbiAgaWYgKHRyYW5zaXRpb24uY2FuY2VsbGVkKSByZXR1cm47XG5cbiAgaWYgKGxvZ2dlci5lbmFibGVkKSB7XG4gICAgdmFyIGNhcGl0YWxpemVkU3RlcCA9IHN0ZXBGblswXS50b1VwcGVyQ2FzZSgpICsgc3RlcEZuLnNsaWNlKDEpO1xuICAgIGxvZ2dlci5sb2coY2FwaXRhbGl6ZWRTdGVwICsgJyAnICsgc3RhdGUuZnVsbE5hbWUpO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IHN0YXRlW3N0ZXBGbl0ocGFyYW1zLCBhY2MsIHJvdXRlcik7XG5cbiAgaWYgKHRyYW5zaXRpb24uY2FuY2VsbGVkKSByZXR1cm47XG5cbiAgdHJhbnNpdGlvbi5jdXJyZW50U3RhdGUgPSBzdGVwRm4gPT0gJ2V4aXQnID8gc3RhdGUucGFyZW50IDogc3RhdGU7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLypcbiogVGhlIHRvcC1tb3N0IGN1cnJlbnQgc3RhdGUncyBwYXJlbnQgdGhhdCBtdXN0IGJlIGV4aXRlZC5cbiovXG5mdW5jdGlvbiB0cmFuc2l0aW9uUm9vdChmcm9tU3RhdGUsIHRvU3RhdGUsIGlzVXBkYXRlLCBwYXJhbXNEaWZmKSB7XG4gIHZhciByb290LCBwYXJlbnQsIHBhcmFtO1xuXG4gIC8vIEZvciBhIHBhcmFtLW9ubHkgY2hhbmdlLCB0aGUgcm9vdCBpcyB0aGUgdG9wLW1vc3Qgc3RhdGUgb3duaW5nIHRoZSBwYXJhbShzKSxcbiAgaWYgKGlzVXBkYXRlKSB7XG4gICAgW2Zyb21TdGF0ZV0uY29uY2F0KGZyb21TdGF0ZS5wYXJlbnRzKS5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICBpZiAocm9vdCkgcmV0dXJuO1xuXG4gICAgICBmb3IgKHBhcmFtIGluIHBhcmFtc0RpZmYuYWxsKSB7XG4gICAgICAgIGlmIChwYXJlbnQucGFyYW1zW3BhcmFtXSB8fCBwYXJlbnQucXVlcnlQYXJhbXNbcGFyYW1dKSB7XG4gICAgICAgICAgcm9vdCA9IHBhcmVudDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8vIEVsc2UsIHRoZSByb290IGlzIHRoZSBjbG9zZXN0IGNvbW1vbiBwYXJlbnQgb2YgdGhlIHR3byBzdGF0ZXMuXG4gIGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcm9tU3RhdGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBwYXJlbnQgPSBmcm9tU3RhdGUucGFyZW50c1tpXTtcbiAgICAgICAgaWYgKHRvU3RhdGUucGFyZW50cy5pbmRleE9mKHBhcmVudCkgPiAtMSkge1xuICAgICAgICAgIHJvb3QgPSBwYXJlbnQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgcmV0dXJuIHJvb3Q7XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25TdGF0ZXMoc3RhdGUsIHJvb3QsIGluY2x1c2l2ZSkge1xuICByb290ID0gcm9vdCB8fCBzdGF0ZS5yb290O1xuXG4gIHZhciBwID0gc3RhdGUucGFyZW50cyxcbiAgICAgIGVuZCA9IE1hdGgubWluKHAubGVuZ3RoLCBwLmluZGV4T2Yocm9vdCkgKyAoaW5jbHVzaXZlID8gMSA6IDApKTtcblxuICByZXR1cm4gW3N0YXRlXS5jb25jYXQocC5zbGljZSgwLCBlbmQpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2l0aW9uO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2FieXNzYS9saWIvVHJhbnNpdGlvbi5qc1xuICoqIG1vZHVsZSBpZCA9IDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcbid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIFBBUkFNUyA9IC86W15cXFxcP1xcL10qL2c7XG5cbi8qXG4qIENyZWF0ZXMgYSBuZXcgU3RhdGUgaW5zdGFuY2UgZnJvbSBhIHt1cmksIGVudGVyLCBleGl0LCB1cGRhdGUsIGRhdGEsIGNoaWxkcmVufSBvYmplY3QuXG4qIFRoaXMgaXMgdGhlIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIGEgc3RhdGUgdXNlZCBieSB0aGUgcm91dGVyLlxuKi9cbmZ1bmN0aW9uIFN0YXRlKG9wdGlvbnMpIHtcbiAgdmFyIHN0YXRlID0geyBvcHRpb25zOiBvcHRpb25zIH0sXG4gICAgICBzdGF0ZXMgPSBvcHRpb25zLmNoaWxkcmVuO1xuXG4gIHN0YXRlLnBhdGggPSBwYXRoRnJvbVVSSShvcHRpb25zLnVyaSk7XG4gIHN0YXRlLnBhcmFtcyA9IHBhcmFtc0Zyb21VUkkob3B0aW9ucy51cmkpO1xuICBzdGF0ZS5xdWVyeVBhcmFtcyA9IHF1ZXJ5UGFyYW1zRnJvbVVSSShvcHRpb25zLnVyaSk7XG4gIHN0YXRlLnN0YXRlcyA9IHN0YXRlcztcblxuICBzdGF0ZS5lbnRlciA9IG9wdGlvbnMuZW50ZXIgfHwgdXRpbC5ub29wO1xuICBzdGF0ZS51cGRhdGUgPSBvcHRpb25zLnVwZGF0ZTtcbiAgc3RhdGUuZXhpdCA9IG9wdGlvbnMuZXhpdCB8fCB1dGlsLm5vb3A7XG5cbiAgc3RhdGUub3duRGF0YSA9IG9wdGlvbnMuZGF0YSB8fCB7fTtcblxuICAvKlxuICAqIEluaXRpYWxpemUgYW5kIGZyZWV6ZSB0aGlzIHN0YXRlLlxuICAqL1xuICBmdW5jdGlvbiBpbml0KHJvdXRlciwgbmFtZSwgcGFyZW50KSB7XG4gICAgc3RhdGUucm91dGVyID0gcm91dGVyO1xuICAgIHN0YXRlLm5hbWUgPSBuYW1lO1xuICAgIHN0YXRlLmlzRGVmYXVsdCA9IG5hbWUgPT0gJ19kZWZhdWx0Xyc7XG4gICAgc3RhdGUucGFyZW50ID0gcGFyZW50O1xuICAgIHN0YXRlLnBhcmVudHMgPSBnZXRQYXJlbnRzKCk7XG4gICAgc3RhdGUucm9vdCA9IHN0YXRlLnBhcmVudCA/IHN0YXRlLnBhcmVudHNbc3RhdGUucGFyZW50cy5sZW5ndGggLSAxXSA6IHN0YXRlO1xuICAgIHN0YXRlLmNoaWxkcmVuID0gdXRpbC5vYmplY3RUb0FycmF5KHN0YXRlcyk7XG4gICAgc3RhdGUuZnVsbE5hbWUgPSBnZXRGdWxsTmFtZSgpO1xuICAgIHN0YXRlLmFzUHVibGljID0gbWFrZVB1YmxpY0FQSSgpO1xuXG4gICAgZWFjaENoaWxkU3RhdGUoZnVuY3Rpb24gKG5hbWUsIGNoaWxkU3RhdGUpIHtcbiAgICAgIGNoaWxkU3RhdGUuaW5pdChyb3V0ZXIsIG5hbWUsIHN0YXRlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qXG4gICogVGhlIGZ1bGwgcGF0aCwgY29tcG9zZWQgb2YgYWxsIHRoZSBpbmRpdmlkdWFsIHBhdGhzIG9mIHRoaXMgc3RhdGUgYW5kIGl0cyBwYXJlbnRzLlxuICAqL1xuICBmdW5jdGlvbiBmdWxsUGF0aCgpIHtcbiAgICB2YXIgcmVzdWx0ID0gc3RhdGUucGF0aCxcbiAgICAgICAgc3RhdGVQYXJlbnQgPSBzdGF0ZS5wYXJlbnQ7XG5cbiAgICB3aGlsZSAoc3RhdGVQYXJlbnQpIHtcbiAgICAgIGlmIChzdGF0ZVBhcmVudC5wYXRoKSByZXN1bHQgPSBzdGF0ZVBhcmVudC5wYXRoICsgJy8nICsgcmVzdWx0O1xuICAgICAgc3RhdGVQYXJlbnQgPSBzdGF0ZVBhcmVudC5wYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qXG4gICogVGhlIGxpc3Qgb2YgYWxsIHBhcmVudHMsIHN0YXJ0aW5nIGZyb20gdGhlIGNsb3Nlc3Qgb25lcy5cbiAgKi9cbiAgZnVuY3Rpb24gZ2V0UGFyZW50cygpIHtcbiAgICB2YXIgcGFyZW50cyA9IFtdLFxuICAgICAgICBwYXJlbnQgPSBzdGF0ZS5wYXJlbnQ7XG5cbiAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICBwYXJlbnRzLnB1c2gocGFyZW50KTtcbiAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudHM7XG4gIH1cblxuICAvKlxuICAqIFRoZSBmdWxseSBxdWFsaWZpZWQgbmFtZSBvZiB0aGlzIHN0YXRlLlxuICAqIGUuZyBncmFucGFyZW50TmFtZS5wYXJlbnROYW1lLm5hbWVcbiAgKi9cbiAgZnVuY3Rpb24gZ2V0RnVsbE5hbWUoKSB7XG4gICAgdmFyIHJlc3VsdCA9IHN0YXRlLnBhcmVudHMucmVkdWNlUmlnaHQoZnVuY3Rpb24gKGFjYywgcGFyZW50KSB7XG4gICAgICByZXR1cm4gYWNjICsgcGFyZW50Lm5hbWUgKyAnLic7XG4gICAgfSwgJycpICsgc3RhdGUubmFtZTtcblxuICAgIHJldHVybiBzdGF0ZS5pc0RlZmF1bHQgPyByZXN1bHQucmVwbGFjZSgnLl9kZWZhdWx0XycsICcnKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFsbFF1ZXJ5UGFyYW1zKCkge1xuICAgIHJldHVybiBzdGF0ZS5wYXJlbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwYXJlbnQpIHtcbiAgICAgIHJldHVybiB1dGlsLm1lcmdlT2JqZWN0cyhhY2MsIHBhcmVudC5xdWVyeVBhcmFtcyk7XG4gICAgfSwgdXRpbC5jb3B5T2JqZWN0KHN0YXRlLnF1ZXJ5UGFyYW1zKSk7XG4gIH1cblxuICAvKlxuICAqIEdldCBvciBTZXQgc29tZSBhcmJpdHJhcnkgZGF0YSBieSBrZXkgb24gdGhpcyBzdGF0ZS5cbiAgKiBjaGlsZCBzdGF0ZXMgaGF2ZSBhY2Nlc3MgdG8gdGhlaXIgcGFyZW50cycgZGF0YS5cbiAgKlxuICAqIFRoaXMgY2FuIGJlIHVzZWZ1bCB3aGVuIHVzaW5nIGV4dGVybmFsIG1vZGVscy9zZXJ2aWNlc1xuICAqIGFzIGEgbWVhbiB0byBjb21tdW5pY2F0ZSBiZXR3ZWVuIHN0YXRlcyBpcyBub3QgZGVzaXJlZC5cbiAgKi9cbiAgZnVuY3Rpb24gZGF0YShrZXksIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0YXRlLm93bkRhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50U3RhdGUgPSBzdGF0ZTtcblxuICAgIHdoaWxlIChjdXJyZW50U3RhdGUub3duRGF0YVtrZXldID09PSB1bmRlZmluZWQgJiYgY3VycmVudFN0YXRlLnBhcmVudCkge1xuICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudFN0YXRlLnBhcmVudDtcbiAgICB9cmV0dXJuIGN1cnJlbnRTdGF0ZS5vd25EYXRhW2tleV07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlUHVibGljQVBJKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBzdGF0ZS5uYW1lLFxuICAgICAgZnVsbE5hbWU6IHN0YXRlLmZ1bGxOYW1lLFxuICAgICAgcGFyZW50OiBzdGF0ZS5wYXJlbnQgJiYgc3RhdGUucGFyZW50LmFzUHVibGljLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBlYWNoQ2hpbGRTdGF0ZShjYWxsYmFjaykge1xuICAgIGZvciAodmFyIG5hbWUgaW4gc3RhdGVzKSB7XG4gICAgICBjYWxsYmFjayhuYW1lLCBzdGF0ZXNbbmFtZV0pO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICogUmV0dXJucyB3aGV0aGVyIHRoaXMgc3RhdGUgbWF0Y2hlcyB0aGUgcGFzc2VkIHBhdGggQXJyYXkuXG4gICogSW4gY2FzZSBvZiBhIG1hdGNoLCB0aGUgYWN0dWFsIHBhcmFtIHZhbHVlcyBhcmUgcmV0dXJuZWQuXG4gICovXG4gIGZ1bmN0aW9uIG1hdGNoZXMocGF0aHMpIHtcbiAgICB2YXIgcGFyYW1zID0ge307XG4gICAgdmFyIG5vblJlc3RTdGF0ZVBhdGhzID0gc3RhdGUucGF0aHMuZmlsdGVyKGZ1bmN0aW9uIChwKSB7XG4gICAgICByZXR1cm4gcFtwLmxlbmd0aCAtIDFdICE9ICcqJztcbiAgICB9KTtcblxuICAgIC8qIFRoaXMgc3RhdGUgaGFzIG1vcmUgcGF0aHMgdGhhbiB0aGUgcGFzc2VkIHBhdGhzLCBpdCBjYW5ub3QgYmUgYSBtYXRjaCAqL1xuICAgIGlmIChub25SZXN0U3RhdGVQYXRocy5sZW5ndGggPiBwYXRocy5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgIC8qIENoZWNrcyBpZiB0aGUgcGF0aHMgbWF0Y2ggb25lIGJ5IG9uZSAqL1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwYXRoID0gcGF0aHNbaV07XG4gICAgICB2YXIgdGhhdFBhdGggPSBzdGF0ZS5wYXRoc1tpXTtcblxuICAgICAgLyogVGhpcyBzdGF0ZSBoYXMgbGVzcyBwYXRocyB0aGFuIHRoZSBwYXNzZWQgcGF0aHMsIGl0IGNhbm5vdCBiZSBhIG1hdGNoICovXG4gICAgICBpZiAoIXRoYXRQYXRoKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHZhciBpc1Jlc3QgPSB0aGF0UGF0aFt0aGF0UGF0aC5sZW5ndGggLSAxXSA9PSAnKic7XG4gICAgICBpZiAoaXNSZXN0KSB7XG4gICAgICAgIHZhciBuYW1lID0gcGFyYW1OYW1lKHRoYXRQYXRoKTtcbiAgICAgICAgcGFyYW1zW25hbWVdID0gcGF0aHMuc2xpY2UoaSkuam9pbignLycpO1xuICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgICAgfVxuXG4gICAgICB2YXIgaXNEeW5hbWljID0gdGhhdFBhdGhbMF0gPT0gJzonO1xuICAgICAgaWYgKGlzRHluYW1pYykge1xuICAgICAgICB2YXIgbmFtZSA9IHBhcmFtTmFtZSh0aGF0UGF0aCk7XG4gICAgICAgIHBhcmFtc1tuYW1lXSA9IHBhdGg7XG4gICAgICB9IGVsc2UgaWYgKHRoYXRQYXRoICE9IHBhdGgpIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9XG5cbiAgLypcbiAgKiBSZXR1cm5zIGEgVVJJIGJ1aWx0IGZyb20gdGhpcyBzdGF0ZSBhbmQgdGhlIHBhc3NlZCBwYXJhbXMuXG4gICovXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlKHBhcmFtcykge1xuICAgIHZhciBwYXRoID0gc3RhdGUuZnVsbFBhdGgoKS5yZXBsYWNlKFBBUkFNUywgZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBwYXJhbXNbcGFyYW1OYW1lKHApXSB8fCAnJztcbiAgICB9KTtcblxuICAgIHZhciBxdWVyeVBhcmFtcyA9IGFsbFF1ZXJ5UGFyYW1zKCk7XG4gICAgdmFyIHBhc3NlZFF1ZXJ5UGFyYW1zID0gT2JqZWN0LmtleXMocGFyYW1zKS5maWx0ZXIoZnVuY3Rpb24gKHApIHtcbiAgICAgIHJldHVybiBxdWVyeVBhcmFtc1twXTtcbiAgICB9KTtcblxuICAgIHZhciBxdWVyeSA9IHBhc3NlZFF1ZXJ5UGFyYW1zLm1hcChmdW5jdGlvbiAocCkge1xuICAgICAgcmV0dXJuIHAgKyAnPScgKyBwYXJhbXNbcF07XG4gICAgfSkuam9pbignJicpO1xuXG4gICAgcmV0dXJuIHBhdGggKyAocXVlcnkubGVuZ3RoID8gJz8nICsgcXVlcnkgOiAnJyk7XG4gIH1cblxuICBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gc3RhdGUuZnVsbE5hbWU7XG4gIH1cblxuICBzdGF0ZS5pbml0ID0gaW5pdDtcbiAgc3RhdGUuZnVsbFBhdGggPSBmdWxsUGF0aDtcbiAgc3RhdGUuYWxsUXVlcnlQYXJhbXMgPSBhbGxRdWVyeVBhcmFtcztcbiAgc3RhdGUubWF0Y2hlcyA9IG1hdGNoZXM7XG4gIHN0YXRlLmludGVycG9sYXRlID0gaW50ZXJwb2xhdGU7XG4gIHN0YXRlLmRhdGEgPSBkYXRhO1xuICBzdGF0ZS50b1N0cmluZyA9IHRvU3RyaW5nO1xuXG4gIHJldHVybiBzdGF0ZTtcbn1cblxuZnVuY3Rpb24gcGFyYW1OYW1lKHBhcmFtKSB7XG4gIHJldHVybiBwYXJhbVtwYXJhbS5sZW5ndGggLSAxXSA9PSAnKicgPyBwYXJhbS5zdWJzdHIoMSkuc2xpY2UoMCwgLTEpIDogcGFyYW0uc3Vic3RyKDEpO1xufVxuXG5mdW5jdGlvbiBwYXRoRnJvbVVSSSh1cmkpIHtcbiAgcmV0dXJuICh1cmkgfHwgJycpLnNwbGl0KCc/JylbMF07XG59XG5cbmZ1bmN0aW9uIHBhcmFtc0Zyb21VUkkodXJpKSB7XG4gIHZhciBtYXRjaGVzID0gUEFSQU1TLmV4ZWModXJpKTtcbiAgcmV0dXJuIG1hdGNoZXMgPyB1dGlsLmFycmF5VG9PYmplY3QobWF0Y2hlcy5tYXAocGFyYW1OYW1lKSkgOiB7fTtcbn1cblxuZnVuY3Rpb24gcXVlcnlQYXJhbXNGcm9tVVJJKHVyaSkge1xuICB2YXIgcXVlcnkgPSAodXJpIHx8ICcnKS5zcGxpdCgnPycpWzFdO1xuICByZXR1cm4gcXVlcnkgPyB1dGlsLmFycmF5VG9PYmplY3QocXVlcnkuc3BsaXQoJyYnKSkgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9hYnlzc2EvbGliL1N0YXRlLmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBSZXByZXNlbnRzIHRoZSBwdWJsaWMgQVBJIG9mIHRoZSBsYXN0IGluc3RhbmNpYXRlZCByb3V0ZXI7IFVzZWZ1bCB0byBicmVhayBjaXJjdWxhciBkZXBlbmRlbmNpZXMgYmV0d2VlbiByb3V0ZXIgYW5kIGl0cyBzdGF0ZXMgKi9cbm1vZHVsZS5leHBvcnRzID0ge307XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vYWJ5c3NhL2xpYi9hcGkuanNcbiAqKiBtb2R1bGUgaWQgPSAyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXBpID0gcmVxdWlyZSgnLi9hcGknKTtcblxuLyogV3JhcHMgYSB0aGVubmFibGUvcHJvbWlzZSBhbmQgb25seSByZXNvbHZlIGl0IGlmIHRoZSByb3V0ZXIgZGlkbid0IHRyYW5zaXRpb24gdG8gYW5vdGhlciBzdGF0ZSBpbiB0aGUgbWVhbnRpbWUgKi9cbmZ1bmN0aW9uIGFzeW5jKHdyYXBwZWQpIHtcbiAgdmFyIFByb21pc2VJbXBsID0gYXN5bmMuUHJvbWlzZSB8fCBQcm9taXNlO1xuICB2YXIgZmlyZSA9IHRydWU7XG5cbiAgYXBpLnRyYW5zaXRpb24ub25jZSgnc3RhcnRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBmaXJlID0gZmFsc2U7XG4gIH0pO1xuXG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB3cmFwcGVkLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoZmlyZSkgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKGZpcmUpIHJlamVjdChlcnIpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmM7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vYWJ5c3NhL2xpYi9hc3luYy5qc1xuICoqIG1vZHVsZSBpZCA9IDIxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBzbmFiYmRvbV8xID0gcmVxdWlyZSgnc25hYmJkb20nKTtcbnZhciBwYXRjaCA9IHNuYWJiZG9tXzEuaW5pdChbXG4gICAgcmVxdWlyZSgnc25hYmJkb20vbW9kdWxlcy9jbGFzcycpLFxuICAgIHJlcXVpcmUoJ3NuYWJiZG9tL21vZHVsZXMvcHJvcHMnKSxcbiAgICByZXF1aXJlKCdzbmFiYmRvbS9tb2R1bGVzL2F0dHJpYnV0ZXMnKSxcbiAgICByZXF1aXJlKCdzbmFiYmRvbS9tb2R1bGVzL2V2ZW50bGlzdGVuZXJzJylcbl0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gcGF0Y2g7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3NuYWJiZG9tLnRzXG4gKiogbW9kdWxlIGlkID0gMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIGpzaGludCBuZXdjYXA6IGZhbHNlXG4vKiBnbG9iYWwgcmVxdWlyZSwgbW9kdWxlLCBkb2N1bWVudCwgTm9kZSAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgVk5vZGUgPSByZXF1aXJlKCcuL3Zub2RlJyk7XG52YXIgaXMgPSByZXF1aXJlKCcuL2lzJyk7XG52YXIgZG9tQXBpID0gcmVxdWlyZSgnLi9odG1sZG9tYXBpLmpzJyk7XG5cbmZ1bmN0aW9uIGlzVW5kZWYocykgeyByZXR1cm4gcyA9PT0gdW5kZWZpbmVkOyB9XG5mdW5jdGlvbiBpc0RlZihzKSB7IHJldHVybiBzICE9PSB1bmRlZmluZWQ7IH1cblxudmFyIGVtcHR5Tm9kZSA9IFZOb2RlKCcnLCB7fSwgW10sIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcblxuZnVuY3Rpb24gc2FtZVZub2RlKHZub2RlMSwgdm5vZGUyKSB7XG4gIHJldHVybiB2bm9kZTEua2V5ID09PSB2bm9kZTIua2V5ICYmIHZub2RlMS5zZWwgPT09IHZub2RlMi5zZWw7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUtleVRvT2xkSWR4KGNoaWxkcmVuLCBiZWdpbklkeCwgZW5kSWR4KSB7XG4gIHZhciBpLCBtYXAgPSB7fSwga2V5O1xuICBmb3IgKGkgPSBiZWdpbklkeDsgaSA8PSBlbmRJZHg7ICsraSkge1xuICAgIGtleSA9IGNoaWxkcmVuW2ldLmtleTtcbiAgICBpZiAoaXNEZWYoa2V5KSkgbWFwW2tleV0gPSBpO1xuICB9XG4gIHJldHVybiBtYXA7XG59XG5cbnZhciBob29rcyA9IFsnY3JlYXRlJywgJ3VwZGF0ZScsICdyZW1vdmUnLCAnZGVzdHJveScsICdwcmUnLCAncG9zdCddO1xuXG5mdW5jdGlvbiBpbml0KG1vZHVsZXMsIGFwaSkge1xuICB2YXIgaSwgaiwgY2JzID0ge307XG5cbiAgaWYgKGlzVW5kZWYoYXBpKSkgYXBpID0gZG9tQXBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBob29rcy5sZW5ndGg7ICsraSkge1xuICAgIGNic1tob29rc1tpXV0gPSBbXTtcbiAgICBmb3IgKGogPSAwOyBqIDwgbW9kdWxlcy5sZW5ndGg7ICsraikge1xuICAgICAgaWYgKG1vZHVsZXNbal1baG9va3NbaV1dICE9PSB1bmRlZmluZWQpIGNic1tob29rc1tpXV0ucHVzaChtb2R1bGVzW2pdW2hvb2tzW2ldXSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW1wdHlOb2RlQXQoZWxtKSB7XG4gICAgcmV0dXJuIFZOb2RlKGFwaS50YWdOYW1lKGVsbSkudG9Mb3dlckNhc2UoKSwge30sIFtdLCB1bmRlZmluZWQsIGVsbSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVSbUNiKGNoaWxkRWxtLCBsaXN0ZW5lcnMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS1saXN0ZW5lcnMgPT09IDApIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IGFwaS5wYXJlbnROb2RlKGNoaWxkRWxtKTtcbiAgICAgICAgYXBpLnJlbW92ZUNoaWxkKHBhcmVudCwgY2hpbGRFbG0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbG0odm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSkge1xuICAgIHZhciBpLCB0aHVuaywgZGF0YSA9IHZub2RlLmRhdGE7XG4gICAgaWYgKGlzRGVmKGRhdGEpKSB7XG4gICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkuaW5pdCkpIGkodm5vZGUpO1xuICAgICAgaWYgKGlzRGVmKGkgPSBkYXRhLnZub2RlKSkge1xuICAgICAgICAgIHRodW5rID0gdm5vZGU7XG4gICAgICAgICAgdm5vZGUgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZWxtLCBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuLCBzZWwgPSB2bm9kZS5zZWw7XG4gICAgaWYgKGlzRGVmKHNlbCkpIHtcbiAgICAgIC8vIFBhcnNlIHNlbGVjdG9yXG4gICAgICB2YXIgaGFzaElkeCA9IHNlbC5pbmRleE9mKCcjJyk7XG4gICAgICB2YXIgZG90SWR4ID0gc2VsLmluZGV4T2YoJy4nLCBoYXNoSWR4KTtcbiAgICAgIHZhciBoYXNoID0gaGFzaElkeCA+IDAgPyBoYXNoSWR4IDogc2VsLmxlbmd0aDtcbiAgICAgIHZhciBkb3QgPSBkb3RJZHggPiAwID8gZG90SWR4IDogc2VsLmxlbmd0aDtcbiAgICAgIHZhciB0YWcgPSBoYXNoSWR4ICE9PSAtMSB8fCBkb3RJZHggIT09IC0xID8gc2VsLnNsaWNlKDAsIE1hdGgubWluKGhhc2gsIGRvdCkpIDogc2VsO1xuICAgICAgZWxtID0gdm5vZGUuZWxtID0gaXNEZWYoZGF0YSkgJiYgaXNEZWYoaSA9IGRhdGEubnMpID8gYXBpLmNyZWF0ZUVsZW1lbnROUyhpLCB0YWcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhcGkuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgICAgaWYgKGhhc2ggPCBkb3QpIGVsbS5pZCA9IHNlbC5zbGljZShoYXNoICsgMSwgZG90KTtcbiAgICAgIGlmIChkb3RJZHggPiAwKSBlbG0uY2xhc3NOYW1lID0gc2VsLnNsaWNlKGRvdCsxKS5yZXBsYWNlKC9cXC4vZywgJyAnKTtcbiAgICAgIGlmIChpcy5hcnJheShjaGlsZHJlbikpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgYXBpLmFwcGVuZENoaWxkKGVsbSwgY3JlYXRlRWxtKGNoaWxkcmVuW2ldLCBpbnNlcnRlZFZub2RlUXVldWUpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpcy5wcmltaXRpdmUodm5vZGUudGV4dCkpIHtcbiAgICAgICAgYXBpLmFwcGVuZENoaWxkKGVsbSwgYXBpLmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpKTtcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMuY3JlYXRlLmxlbmd0aDsgKytpKSBjYnMuY3JlYXRlW2ldKGVtcHR5Tm9kZSwgdm5vZGUpO1xuICAgICAgaSA9IHZub2RlLmRhdGEuaG9vazsgLy8gUmV1c2UgdmFyaWFibGVcbiAgICAgIGlmIChpc0RlZihpKSkge1xuICAgICAgICBpZiAoaS5jcmVhdGUpIGkuY3JlYXRlKGVtcHR5Tm9kZSwgdm5vZGUpO1xuICAgICAgICBpZiAoaS5pbnNlcnQpIGluc2VydGVkVm5vZGVRdWV1ZS5wdXNoKHZub2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWxtID0gdm5vZGUuZWxtID0gYXBpLmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpO1xuICAgIH1cbiAgICBpZiAoaXNEZWYodGh1bmspKSB0aHVuay5lbG0gPSB2bm9kZS5lbG07XG4gICAgcmV0dXJuIHZub2RlLmVsbTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFZub2RlcyhwYXJlbnRFbG0sIGJlZm9yZSwgdm5vZGVzLCBzdGFydElkeCwgZW5kSWR4LCBpbnNlcnRlZFZub2RlUXVldWUpIHtcbiAgICBmb3IgKDsgc3RhcnRJZHggPD0gZW5kSWR4OyArK3N0YXJ0SWR4KSB7XG4gICAgICBhcGkuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgY3JlYXRlRWxtKHZub2Rlc1tzdGFydElkeF0sIGluc2VydGVkVm5vZGVRdWV1ZSksIGJlZm9yZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRGVzdHJveUhvb2sodm5vZGUpIHtcbiAgICB2YXIgaSwgaiwgZGF0YSA9IHZub2RlLmRhdGE7XG4gICAgaWYgKGlzRGVmKGRhdGEpKSB7XG4gICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkuZGVzdHJveSkpIGkodm5vZGUpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNicy5kZXN0cm95Lmxlbmd0aDsgKytpKSBjYnMuZGVzdHJveVtpXSh2bm9kZSk7XG4gICAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmNoaWxkcmVuKSkge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgdm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICBpbnZva2VEZXN0cm95SG9vayh2bm9kZS5jaGlsZHJlbltqXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0RlZihpID0gZGF0YS52bm9kZSkpIGludm9rZURlc3Ryb3lIb29rKGkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZVZub2RlcyhwYXJlbnRFbG0sIHZub2Rlcywgc3RhcnRJZHgsIGVuZElkeCkge1xuICAgIGZvciAoOyBzdGFydElkeCA8PSBlbmRJZHg7ICsrc3RhcnRJZHgpIHtcbiAgICAgIHZhciBpLCBsaXN0ZW5lcnMsIHJtLCBjaCA9IHZub2Rlc1tzdGFydElkeF07XG4gICAgICBpZiAoaXNEZWYoY2gpKSB7XG4gICAgICAgIGlmIChpc0RlZihjaC5zZWwpKSB7XG4gICAgICAgICAgaW52b2tlRGVzdHJveUhvb2soY2gpO1xuICAgICAgICAgIGxpc3RlbmVycyA9IGNicy5yZW1vdmUubGVuZ3RoICsgMTtcbiAgICAgICAgICBybSA9IGNyZWF0ZVJtQ2IoY2guZWxtLCBsaXN0ZW5lcnMpO1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMucmVtb3ZlLmxlbmd0aDsgKytpKSBjYnMucmVtb3ZlW2ldKGNoLCBybSk7XG4gICAgICAgICAgaWYgKGlzRGVmKGkgPSBjaC5kYXRhKSAmJiBpc0RlZihpID0gaS5ob29rKSAmJiBpc0RlZihpID0gaS5yZW1vdmUpKSB7XG4gICAgICAgICAgICBpKGNoLCBybSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJtKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBUZXh0IG5vZGVcbiAgICAgICAgICBhcGkucmVtb3ZlQ2hpbGQocGFyZW50RWxtLCBjaC5lbG0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlQ2hpbGRyZW4ocGFyZW50RWxtLCBvbGRDaCwgbmV3Q2gsIGluc2VydGVkVm5vZGVRdWV1ZSkge1xuICAgIHZhciBvbGRTdGFydElkeCA9IDAsIG5ld1N0YXJ0SWR4ID0gMDtcbiAgICB2YXIgb2xkRW5kSWR4ID0gb2xkQ2gubGVuZ3RoIC0gMTtcbiAgICB2YXIgb2xkU3RhcnRWbm9kZSA9IG9sZENoWzBdO1xuICAgIHZhciBvbGRFbmRWbm9kZSA9IG9sZENoW29sZEVuZElkeF07XG4gICAgdmFyIG5ld0VuZElkeCA9IG5ld0NoLmxlbmd0aCAtIDE7XG4gICAgdmFyIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFswXTtcbiAgICB2YXIgbmV3RW5kVm5vZGUgPSBuZXdDaFtuZXdFbmRJZHhdO1xuICAgIHZhciBvbGRLZXlUb0lkeCwgaWR4SW5PbGQsIGVsbVRvTW92ZSwgYmVmb3JlO1xuXG4gICAgd2hpbGUgKG9sZFN0YXJ0SWR4IDw9IG9sZEVuZElkeCAmJiBuZXdTdGFydElkeCA8PSBuZXdFbmRJZHgpIHtcbiAgICAgIGlmIChpc1VuZGVmKG9sZFN0YXJ0Vm5vZGUpKSB7XG4gICAgICAgIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaFsrK29sZFN0YXJ0SWR4XTsgLy8gVm5vZGUgaGFzIGJlZW4gbW92ZWQgbGVmdFxuICAgICAgfSBlbHNlIGlmIChpc1VuZGVmKG9sZEVuZFZub2RlKSkge1xuICAgICAgICBvbGRFbmRWbm9kZSA9IG9sZENoWy0tb2xkRW5kSWR4XTtcbiAgICAgIH0gZWxzZSBpZiAoc2FtZVZub2RlKG9sZFN0YXJ0Vm5vZGUsIG5ld1N0YXJ0Vm5vZGUpKSB7XG4gICAgICAgIHBhdGNoVm5vZGUob2xkU3RhcnRWbm9kZSwgbmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdO1xuICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XG4gICAgICB9IGVsc2UgaWYgKHNhbWVWbm9kZShvbGRFbmRWbm9kZSwgbmV3RW5kVm5vZGUpKSB7XG4gICAgICAgIHBhdGNoVm5vZGUob2xkRW5kVm5vZGUsIG5ld0VuZFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICBvbGRFbmRWbm9kZSA9IG9sZENoWy0tb2xkRW5kSWR4XTtcbiAgICAgICAgbmV3RW5kVm5vZGUgPSBuZXdDaFstLW5ld0VuZElkeF07XG4gICAgICB9IGVsc2UgaWYgKHNhbWVWbm9kZShvbGRTdGFydFZub2RlLCBuZXdFbmRWbm9kZSkpIHsgLy8gVm5vZGUgbW92ZWQgcmlnaHRcbiAgICAgICAgcGF0Y2hWbm9kZShvbGRTdGFydFZub2RlLCBuZXdFbmRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgYXBpLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtLCBhcGkubmV4dFNpYmxpbmcob2xkRW5kVm5vZGUuZWxtKSk7XG4gICAgICAgIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaFsrK29sZFN0YXJ0SWR4XTtcbiAgICAgICAgbmV3RW5kVm5vZGUgPSBuZXdDaFstLW5ld0VuZElkeF07XG4gICAgICB9IGVsc2UgaWYgKHNhbWVWbm9kZShvbGRFbmRWbm9kZSwgbmV3U3RhcnRWbm9kZSkpIHsgLy8gVm5vZGUgbW92ZWQgbGVmdFxuICAgICAgICBwYXRjaFZub2RlKG9sZEVuZFZub2RlLCBuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICBhcGkuaW5zZXJ0QmVmb3JlKHBhcmVudEVsbSwgb2xkRW5kVm5vZGUuZWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XG4gICAgICAgIG9sZEVuZFZub2RlID0gb2xkQ2hbLS1vbGRFbmRJZHhdO1xuICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNVbmRlZihvbGRLZXlUb0lkeCkpIG9sZEtleVRvSWR4ID0gY3JlYXRlS2V5VG9PbGRJZHgob2xkQ2gsIG9sZFN0YXJ0SWR4LCBvbGRFbmRJZHgpO1xuICAgICAgICBpZHhJbk9sZCA9IG9sZEtleVRvSWR4W25ld1N0YXJ0Vm5vZGUua2V5XTtcbiAgICAgICAgaWYgKGlzVW5kZWYoaWR4SW5PbGQpKSB7IC8vIE5ldyBlbGVtZW50XG4gICAgICAgICAgYXBpLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIGNyZWF0ZUVsbShuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpLCBvbGRTdGFydFZub2RlLmVsbSk7XG4gICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsbVRvTW92ZSA9IG9sZENoW2lkeEluT2xkXTtcbiAgICAgICAgICBwYXRjaFZub2RlKGVsbVRvTW92ZSwgbmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgICBvbGRDaFtpZHhJbk9sZF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgYXBpLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIGVsbVRvTW92ZS5lbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtKTtcbiAgICAgICAgICBuZXdTdGFydFZub2RlID0gbmV3Q2hbKytuZXdTdGFydElkeF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9sZFN0YXJ0SWR4ID4gb2xkRW5kSWR4KSB7XG4gICAgICBiZWZvcmUgPSBpc1VuZGVmKG5ld0NoW25ld0VuZElkeCsxXSkgPyBudWxsIDogbmV3Q2hbbmV3RW5kSWR4KzFdLmVsbTtcbiAgICAgIGFkZFZub2RlcyhwYXJlbnRFbG0sIGJlZm9yZSwgbmV3Q2gsIG5ld1N0YXJ0SWR4LCBuZXdFbmRJZHgsIGluc2VydGVkVm5vZGVRdWV1ZSk7XG4gICAgfSBlbHNlIGlmIChuZXdTdGFydElkeCA+IG5ld0VuZElkeCkge1xuICAgICAgcmVtb3ZlVm5vZGVzKHBhcmVudEVsbSwgb2xkQ2gsIG9sZFN0YXJ0SWR4LCBvbGRFbmRJZHgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhdGNoVm5vZGUob2xkVm5vZGUsIHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpIHtcbiAgICB2YXIgaSwgaG9vaztcbiAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmRhdGEpICYmIGlzRGVmKGhvb2sgPSBpLmhvb2spICYmIGlzRGVmKGkgPSBob29rLnByZXBhdGNoKSkge1xuICAgICAgaShvbGRWbm9kZSwgdm5vZGUpO1xuICAgIH1cbiAgICBpZiAoaXNEZWYoaSA9IG9sZFZub2RlLmRhdGEpICYmIGlzRGVmKGkgPSBpLnZub2RlKSkgb2xkVm5vZGUgPSBpO1xuICAgIGlmIChpc0RlZihpID0gdm5vZGUuZGF0YSkgJiYgaXNEZWYoaSA9IGkudm5vZGUpKSB7XG4gICAgICBwYXRjaFZub2RlKG9sZFZub2RlLCBpLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgdm5vZGUuZWxtID0gaS5lbG07XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBlbG0gPSB2bm9kZS5lbG0gPSBvbGRWbm9kZS5lbG0sIG9sZENoID0gb2xkVm5vZGUuY2hpbGRyZW4sIGNoID0gdm5vZGUuY2hpbGRyZW47XG4gICAgaWYgKG9sZFZub2RlID09PSB2bm9kZSkgcmV0dXJuO1xuICAgIGlmICghc2FtZVZub2RlKG9sZFZub2RlLCB2bm9kZSkpIHtcbiAgICAgIHZhciBwYXJlbnRFbG0gPSBhcGkucGFyZW50Tm9kZShvbGRWbm9kZS5lbG0pO1xuICAgICAgZWxtID0gY3JlYXRlRWxtKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgYXBpLmluc2VydEJlZm9yZShwYXJlbnRFbG0sIGVsbSwgb2xkVm5vZGUuZWxtKTtcbiAgICAgIHJlbW92ZVZub2RlcyhwYXJlbnRFbG0sIFtvbGRWbm9kZV0sIDAsIDApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNEZWYodm5vZGUuZGF0YSkpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMudXBkYXRlLmxlbmd0aDsgKytpKSBjYnMudXBkYXRlW2ldKG9sZFZub2RlLCB2bm9kZSk7XG4gICAgICBpID0gdm5vZGUuZGF0YS5ob29rO1xuICAgICAgaWYgKGlzRGVmKGkpICYmIGlzRGVmKGkgPSBpLnVwZGF0ZSkpIGkob2xkVm5vZGUsIHZub2RlKTtcbiAgICB9XG4gICAgaWYgKGlzVW5kZWYodm5vZGUudGV4dCkpIHtcbiAgICAgIGlmIChpc0RlZihvbGRDaCkgJiYgaXNEZWYoY2gpKSB7XG4gICAgICAgIGlmIChvbGRDaCAhPT0gY2gpIHVwZGF0ZUNoaWxkcmVuKGVsbSwgb2xkQ2gsIGNoLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgfSBlbHNlIGlmIChpc0RlZihjaCkpIHtcbiAgICAgICAgaWYgKGlzRGVmKG9sZFZub2RlLnRleHQpKSBhcGkuc2V0VGV4dENvbnRlbnQoZWxtLCAnJyk7XG4gICAgICAgIGFkZFZub2RlcyhlbG0sIG51bGwsIGNoLCAwLCBjaC5sZW5ndGggLSAxLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRDaCkpIHtcbiAgICAgICAgcmVtb3ZlVm5vZGVzKGVsbSwgb2xkQ2gsIDAsIG9sZENoLmxlbmd0aCAtIDEpO1xuICAgICAgfSBlbHNlIGlmIChpc0RlZihvbGRWbm9kZS50ZXh0KSkge1xuICAgICAgICBhcGkuc2V0VGV4dENvbnRlbnQoZWxtLCAnJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvbGRWbm9kZS50ZXh0ICE9PSB2bm9kZS50ZXh0KSB7XG4gICAgICBhcGkuc2V0VGV4dENvbnRlbnQoZWxtLCB2bm9kZS50ZXh0KTtcbiAgICB9XG4gICAgaWYgKGlzRGVmKGhvb2spICYmIGlzRGVmKGkgPSBob29rLnBvc3RwYXRjaCkpIHtcbiAgICAgIGkob2xkVm5vZGUsIHZub2RlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24ob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgdmFyIGksIGVsbSwgcGFyZW50O1xuICAgIHZhciBpbnNlcnRlZFZub2RlUXVldWUgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLnByZS5sZW5ndGg7ICsraSkgY2JzLnByZVtpXSgpO1xuXG4gICAgaWYgKGlzVW5kZWYob2xkVm5vZGUuc2VsKSkge1xuICAgICAgb2xkVm5vZGUgPSBlbXB0eU5vZGVBdChvbGRWbm9kZSk7XG4gICAgfVxuXG4gICAgaWYgKHNhbWVWbm9kZShvbGRWbm9kZSwgdm5vZGUpKSB7XG4gICAgICBwYXRjaFZub2RlKG9sZFZub2RlLCB2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxtID0gb2xkVm5vZGUuZWxtO1xuICAgICAgcGFyZW50ID0gYXBpLnBhcmVudE5vZGUoZWxtKTtcblxuICAgICAgY3JlYXRlRWxtKHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuXG4gICAgICBpZiAocGFyZW50ICE9PSBudWxsKSB7XG4gICAgICAgIGFwaS5pbnNlcnRCZWZvcmUocGFyZW50LCB2bm9kZS5lbG0sIGFwaS5uZXh0U2libGluZyhlbG0pKTtcbiAgICAgICAgcmVtb3ZlVm5vZGVzKHBhcmVudCwgW29sZFZub2RlXSwgMCwgMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGluc2VydGVkVm5vZGVRdWV1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgaW5zZXJ0ZWRWbm9kZVF1ZXVlW2ldLmRhdGEuaG9vay5pbnNlcnQoaW5zZXJ0ZWRWbm9kZVF1ZXVlW2ldKTtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGNicy5wb3N0Lmxlbmd0aDsgKytpKSBjYnMucG9zdFtpXSgpO1xuICAgIHJldHVybiB2bm9kZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7aW5pdDogaW5pdH07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9zbmFiYmRvbS9zbmFiYmRvbS5qc1xuICoqIG1vZHVsZSBpZCA9IDIzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHRhZ05hbWUpe1xuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgcXVhbGlmaWVkTmFtZSl7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBxdWFsaWZpZWROYW1lKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGV4dE5vZGUodGV4dCl7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcbn1cblxuXG5mdW5jdGlvbiBpbnNlcnRCZWZvcmUocGFyZW50Tm9kZSwgbmV3Tm9kZSwgcmVmZXJlbmNlTm9kZSl7XG4gIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld05vZGUsIHJlZmVyZW5jZU5vZGUpO1xufVxuXG5cbmZ1bmN0aW9uIHJlbW92ZUNoaWxkKG5vZGUsIGNoaWxkKXtcbiAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZCk7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZENoaWxkKG5vZGUsIGNoaWxkKXtcbiAgbm9kZS5hcHBlbmRDaGlsZChjaGlsZCk7XG59XG5cbmZ1bmN0aW9uIHBhcmVudE5vZGUobm9kZSl7XG4gIHJldHVybiBub2RlLnBhcmVudEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIG5leHRTaWJsaW5nKG5vZGUpe1xuICByZXR1cm4gbm9kZS5uZXh0U2libGluZztcbn1cblxuZnVuY3Rpb24gdGFnTmFtZShub2RlKXtcbiAgcmV0dXJuIG5vZGUudGFnTmFtZTtcbn1cblxuZnVuY3Rpb24gc2V0VGV4dENvbnRlbnQobm9kZSwgdGV4dCl7XG4gIG5vZGUudGV4dENvbnRlbnQgPSB0ZXh0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlRWxlbWVudDogY3JlYXRlRWxlbWVudCxcbiAgY3JlYXRlRWxlbWVudE5TOiBjcmVhdGVFbGVtZW50TlMsXG4gIGNyZWF0ZVRleHROb2RlOiBjcmVhdGVUZXh0Tm9kZSxcbiAgYXBwZW5kQ2hpbGQ6IGFwcGVuZENoaWxkLFxuICByZW1vdmVDaGlsZDogcmVtb3ZlQ2hpbGQsXG4gIGluc2VydEJlZm9yZTogaW5zZXJ0QmVmb3JlLFxuICBwYXJlbnROb2RlOiBwYXJlbnROb2RlLFxuICBuZXh0U2libGluZzogbmV4dFNpYmxpbmcsXG4gIHRhZ05hbWU6IHRhZ05hbWUsXG4gIHNldFRleHRDb250ZW50OiBzZXRUZXh0Q29udGVudFxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3NuYWJiZG9tL2h0bWxkb21hcGkuanNcbiAqKiBtb2R1bGUgaWQgPSAyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gdXBkYXRlQ2xhc3Mob2xkVm5vZGUsIHZub2RlKSB7XG4gIHZhciBjdXIsIG5hbWUsIGVsbSA9IHZub2RlLmVsbSxcbiAgICAgIG9sZENsYXNzID0gb2xkVm5vZGUuZGF0YS5jbGFzcyB8fCB7fSxcbiAgICAgIGtsYXNzID0gdm5vZGUuZGF0YS5jbGFzcyB8fCB7fTtcbiAgZm9yIChuYW1lIGluIG9sZENsYXNzKSB7XG4gICAgaWYgKCFrbGFzc1tuYW1lXSkge1xuICAgICAgZWxtLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgfVxuICB9XG4gIGZvciAobmFtZSBpbiBrbGFzcykge1xuICAgIGN1ciA9IGtsYXNzW25hbWVdO1xuICAgIGlmIChjdXIgIT09IG9sZENsYXNzW25hbWVdKSB7XG4gICAgICBlbG0uY2xhc3NMaXN0W2N1ciA/ICdhZGQnIDogJ3JlbW92ZSddKG5hbWUpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtjcmVhdGU6IHVwZGF0ZUNsYXNzLCB1cGRhdGU6IHVwZGF0ZUNsYXNzfTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3NuYWJiZG9tL21vZHVsZXMvY2xhc3MuanNcbiAqKiBtb2R1bGUgaWQgPSAyNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiZnVuY3Rpb24gdXBkYXRlUHJvcHMob2xkVm5vZGUsIHZub2RlKSB7XG4gIHZhciBrZXksIGN1ciwgb2xkLCBlbG0gPSB2bm9kZS5lbG0sXG4gICAgICBvbGRQcm9wcyA9IG9sZFZub2RlLmRhdGEucHJvcHMgfHwge30sIHByb3BzID0gdm5vZGUuZGF0YS5wcm9wcyB8fCB7fTtcbiAgZm9yIChrZXkgaW4gb2xkUHJvcHMpIHtcbiAgICBpZiAoIXByb3BzW2tleV0pIHtcbiAgICAgIGRlbGV0ZSBlbG1ba2V5XTtcbiAgICB9XG4gIH1cbiAgZm9yIChrZXkgaW4gcHJvcHMpIHtcbiAgICBjdXIgPSBwcm9wc1trZXldO1xuICAgIG9sZCA9IG9sZFByb3BzW2tleV07XG4gICAgaWYgKG9sZCAhPT0gY3VyICYmIChrZXkgIT09ICd2YWx1ZScgfHwgZWxtW2tleV0gIT09IGN1cikpIHtcbiAgICAgIGVsbVtrZXldID0gY3VyO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtjcmVhdGU6IHVwZGF0ZVByb3BzLCB1cGRhdGU6IHVwZGF0ZVByb3BzfTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3NuYWJiZG9tL21vZHVsZXMvcHJvcHMuanNcbiAqKiBtb2R1bGUgaWQgPSAyNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGJvb2xlYW5BdHRycyA9IFtcImFsbG93ZnVsbHNjcmVlblwiLCBcImFzeW5jXCIsIFwiYXV0b2ZvY3VzXCIsIFwiYXV0b3BsYXlcIiwgXCJjaGVja2VkXCIsIFwiY29tcGFjdFwiLCBcImNvbnRyb2xzXCIsIFwiZGVjbGFyZVwiLCBcbiAgICAgICAgICAgICAgICBcImRlZmF1bHRcIiwgXCJkZWZhdWx0Y2hlY2tlZFwiLCBcImRlZmF1bHRtdXRlZFwiLCBcImRlZmF1bHRzZWxlY3RlZFwiLCBcImRlZmVyXCIsIFwiZGlzYWJsZWRcIiwgXCJkcmFnZ2FibGVcIiwgXG4gICAgICAgICAgICAgICAgXCJlbmFibGVkXCIsIFwiZm9ybW5vdmFsaWRhdGVcIiwgXCJoaWRkZW5cIiwgXCJpbmRldGVybWluYXRlXCIsIFwiaW5lcnRcIiwgXCJpc21hcFwiLCBcIml0ZW1zY29wZVwiLCBcImxvb3BcIiwgXCJtdWx0aXBsZVwiLCBcbiAgICAgICAgICAgICAgICBcIm11dGVkXCIsIFwibm9ocmVmXCIsIFwibm9yZXNpemVcIiwgXCJub3NoYWRlXCIsIFwibm92YWxpZGF0ZVwiLCBcIm5vd3JhcFwiLCBcIm9wZW5cIiwgXCJwYXVzZW9uZXhpdFwiLCBcInJlYWRvbmx5XCIsIFxuICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIiwgXCJyZXZlcnNlZFwiLCBcInNjb3BlZFwiLCBcInNlYW1sZXNzXCIsIFwic2VsZWN0ZWRcIiwgXCJzb3J0YWJsZVwiLCBcInNwZWxsY2hlY2tcIiwgXCJ0cmFuc2xhdGVcIiwgXG4gICAgICAgICAgICAgICAgXCJ0cnVlc3BlZWRcIiwgXCJ0eXBlbXVzdG1hdGNoXCIsIFwidmlzaWJsZVwiXTtcbiAgICBcbnZhciBib29sZWFuQXR0cnNEaWN0ID0ge307XG5mb3IodmFyIGk9MCwgbGVuID0gYm9vbGVhbkF0dHJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gIGJvb2xlYW5BdHRyc0RpY3RbYm9vbGVhbkF0dHJzW2ldXSA9IHRydWU7XG59XG4gICAgXG5mdW5jdGlvbiB1cGRhdGVBdHRycyhvbGRWbm9kZSwgdm5vZGUpIHtcbiAgdmFyIGtleSwgY3VyLCBvbGQsIGVsbSA9IHZub2RlLmVsbSxcbiAgICAgIG9sZEF0dHJzID0gb2xkVm5vZGUuZGF0YS5hdHRycyB8fCB7fSwgYXR0cnMgPSB2bm9kZS5kYXRhLmF0dHJzIHx8IHt9O1xuICBcbiAgLy8gdXBkYXRlIG1vZGlmaWVkIGF0dHJpYnV0ZXMsIGFkZCBuZXcgYXR0cmlidXRlc1xuICBmb3IgKGtleSBpbiBhdHRycykge1xuICAgIGN1ciA9IGF0dHJzW2tleV07XG4gICAgb2xkID0gb2xkQXR0cnNba2V5XTtcbiAgICBpZiAob2xkICE9PSBjdXIpIHtcbiAgICAgIC8vIFRPRE86IGFkZCBzdXBwb3J0IHRvIG5hbWVzcGFjZWQgYXR0cmlidXRlcyAoc2V0QXR0cmlidXRlTlMpXG4gICAgICBpZighY3VyICYmIGJvb2xlYW5BdHRyc0RpY3Rba2V5XSlcbiAgICAgICAgZWxtLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgICAgZWxzZVxuICAgICAgICBlbG0uc2V0QXR0cmlidXRlKGtleSwgY3VyKTtcbiAgICB9XG4gIH1cbiAgLy9yZW1vdmUgcmVtb3ZlZCBhdHRyaWJ1dGVzXG4gIC8vIHVzZSBgaW5gIG9wZXJhdG9yIHNpbmNlIHRoZSBwcmV2aW91cyBgZm9yYCBpdGVyYXRpb24gdXNlcyBpdCAoLmkuZS4gYWRkIGV2ZW4gYXR0cmlidXRlcyB3aXRoIHVuZGVmaW5lZCB2YWx1ZSlcbiAgLy8gdGhlIG90aGVyIG9wdGlvbiBpcyB0byByZW1vdmUgYWxsIGF0dHJpYnV0ZXMgd2l0aCB2YWx1ZSA9PSB1bmRlZmluZWRcbiAgZm9yIChrZXkgaW4gb2xkQXR0cnMpIHtcbiAgICBpZiAoIShrZXkgaW4gYXR0cnMpKSB7XG4gICAgICBlbG0ucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge2NyZWF0ZTogdXBkYXRlQXR0cnMsIHVwZGF0ZTogdXBkYXRlQXR0cnN9O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vc25hYmJkb20vbW9kdWxlcy9hdHRyaWJ1dGVzLmpzXG4gKiogbW9kdWxlIGlkID0gMjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBpcyA9IHJlcXVpcmUoJy4uL2lzJyk7XG5cbmZ1bmN0aW9uIGFyckludm9rZXIoYXJyKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2Ugd2hlbiBsZW5ndGggaXMgdHdvLCBmb3IgcGVyZm9ybWFuY2VcbiAgICBhcnIubGVuZ3RoID09PSAyID8gYXJyWzBdKGFyclsxXSkgOiBhcnJbMF0uYXBwbHkodW5kZWZpbmVkLCBhcnIuc2xpY2UoMSkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBmbkludm9rZXIobykge1xuICByZXR1cm4gZnVuY3Rpb24oZXYpIHsgby5mbihldik7IH07XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUV2ZW50TGlzdGVuZXJzKG9sZFZub2RlLCB2bm9kZSkge1xuICB2YXIgbmFtZSwgY3VyLCBvbGQsIGVsbSA9IHZub2RlLmVsbSxcbiAgICAgIG9sZE9uID0gb2xkVm5vZGUuZGF0YS5vbiB8fCB7fSwgb24gPSB2bm9kZS5kYXRhLm9uO1xuICBpZiAoIW9uKSByZXR1cm47XG4gIGZvciAobmFtZSBpbiBvbikge1xuICAgIGN1ciA9IG9uW25hbWVdO1xuICAgIG9sZCA9IG9sZE9uW25hbWVdO1xuICAgIGlmIChvbGQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGlzLmFycmF5KGN1cikpIHtcbiAgICAgICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgYXJySW52b2tlcihjdXIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1ciA9IHtmbjogY3VyfTtcbiAgICAgICAgb25bbmFtZV0gPSBjdXI7XG4gICAgICAgIGVsbS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZuSW52b2tlcihjdXIpKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzLmFycmF5KG9sZCkpIHtcbiAgICAgIC8vIERlbGliZXJhdGVseSBtb2RpZnkgb2xkIGFycmF5IHNpbmNlIGl0J3MgY2FwdHVyZWQgaW4gY2xvc3VyZSBjcmVhdGVkIHdpdGggYGFyckludm9rZXJgXG4gICAgICBvbGQubGVuZ3RoID0gY3VyLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkLmxlbmd0aDsgKytpKSBvbGRbaV0gPSBjdXJbaV07XG4gICAgICBvbltuYW1lXSAgPSBvbGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9sZC5mbiA9IGN1cjtcbiAgICAgIG9uW25hbWVdID0gb2xkO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtjcmVhdGU6IHVwZGF0ZUV2ZW50TGlzdGVuZXJzLCB1cGRhdGU6IHVwZGF0ZUV2ZW50TGlzdGVuZXJzfTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3NuYWJiZG9tL21vZHVsZXMvZXZlbnRsaXN0ZW5lcnMuanNcbiAqKiBtb2R1bGUgaWQgPSAyOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgaCA9IHJlcXVpcmUoJ3NuYWJiZG9tL2gnKTtcbnZhciBhYnlzc2FfMSA9IHJlcXVpcmUoJ2FieXNzYScpO1xudmFyIGRvbXB0ZXVzZV8xID0gcmVxdWlyZSgnZG9tcHRldXNlJyk7XG52YXIgYWN0aW9uXzEgPSByZXF1aXJlKCcuL2FjdGlvbicpO1xudmFyIGluZGV4XzEgPSByZXF1aXJlKCcuL2luZGV4Jyk7XG52YXIgYmx1ZV8xID0gcmVxdWlyZSgnLi9ibHVlJyk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBkb21wdGV1c2VfMS5jb21wb25lbnQoe1xuICAgIGtleTogJ2FwcCcsXG4gICAgcHVsbFN0YXRlOiBwdWxsU3RhdGUsXG4gICAgcmVuZGVyOiByZW5kZXJcbn0pO1xuZnVuY3Rpb24gcHVsbFN0YXRlKHN0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY291bnQ6IHN0YXRlLmJsdWUuY291bnQsXG4gICAgICAgIHJvdXRlOiBzdGF0ZS5yb3V0ZS5mdWxsTmFtZVxuICAgIH07XG59XG5mdW5jdGlvbiByZW5kZXIob3B0aW9ucykge1xuICAgIHZhciBzdGF0ZSA9IG9wdGlvbnMuc3RhdGU7XG4gICAgcmV0dXJuIGgoJ2RpdicsIFtcbiAgICAgICAgaCgnaGVhZGVyJywgW1xuICAgICAgICAgICAgaCgnYScsIHsgYXR0cnM6IHsgaHJlZjogYWJ5c3NhXzEuYXBpLmxpbmsoJ2FwcC5pbmRleCcpLCAnZGF0YS1uYXYnOiAnbW91c2Vkb3duJyB9IH0sICdJbmRleCcpLFxuICAgICAgICAgICAgaCgnYScsIHsgYXR0cnM6IHsgaHJlZjogYWJ5c3NhXzEuYXBpLmxpbmsoJ2FwcC5ibHVlJywgeyBpZDogMzMgfSksICdkYXRhLW5hdic6ICdtb3VzZWRvd24nIH0gfSwgJ0JsdWUnKSxcbiAgICAgICAgICAgIFN0cmluZyhzdGF0ZS5jb3VudClcbiAgICAgICAgXSksXG4gICAgICAgIGgoJ21haW4nLCBnZXRDaGlsZHJlbihzdGF0ZS5yb3V0ZSkpXG4gICAgXSk7XG59XG5mdW5jdGlvbiBnZXRDaGlsZHJlbihyb3V0ZSkge1xuICAgIGlmIChyb3V0ZSA9PT0gJ2FwcC5pbmRleCcpXG4gICAgICAgIHJldHVybiBbaW5kZXhfMS5kZWZhdWx0KCldO1xuICAgIGlmIChyb3V0ZS5pbmRleE9mKCdhcHAuYmx1ZScpID09PSAwKVxuICAgICAgICByZXR1cm4gW2JsdWVfMS5kZWZhdWx0KCldO1xufVxuc2V0SW50ZXJ2YWwoYWN0aW9uXzEuaW5jcmVtZW50Qmx1ZSwgMjUwMCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2FwcC50c1xuICoqIG1vZHVsZSBpZCA9IDI5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBmbHV4eF8xID0gcmVxdWlyZSgnZmx1eHgnKTtcbmV4cG9ydHMuaW5jcmVtZW50Qmx1ZSA9IGZsdXh4XzEuQWN0aW9uKCdpbmNyZW1lbnRCbHVlJyk7XG5leHBvcnRzLnJvdXRlQ2hhbmdlZCA9IGZsdXh4XzEuQWN0aW9uKCdyb3V0ZUNoYW5nZWQnKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYWN0aW9uLnRzXG4gKiogbW9kdWxlIGlkID0gMzBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGggPSByZXF1aXJlKCdzbmFiYmRvbS9oJyk7XG52YXIgYW5pbWF0aW9uXzEgPSByZXF1aXJlKCcuL2FuaW1hdGlvbicpO1xuZnVuY3Rpb24gZGVmYXVsdF8xKCkge1xuICAgIHJldHVybiBoKCdoMScsIHsgaG9vazogYW5pbWF0aW9uXzEuY29udGVudEFuaW1hdGlvbiB9LCAnSW5kZXgnKTtcbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGRlZmF1bHRfMTtcbjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvaW5kZXgudHNcbiAqKiBtb2R1bGUgaWQgPSAzMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZ3NhcF8xID0gcmVxdWlyZSgnLi9nc2FwJyk7XG52YXIgYWJ5c3NhXzEgPSByZXF1aXJlKCdhYnlzc2EnKTtcbmV4cG9ydHMuY29udGVudEFuaW1hdGlvbiA9IHtcbiAgICBjcmVhdGU6IGZ1bmN0aW9uIChfLCB2bm9kZSkge1xuICAgICAgICBpZiAoIXZub2RlLmVsbSB8fCBhYnlzc2FfMS5hcGkuaXNGaXJzdFRyYW5zaXRpb24oKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdm5vZGUuZWxtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGdzYXBfMS5Ud2VlbkxpdGUuZnJvbVRvKHZub2RlLmVsbSwgMC4yLCB7IGNzczogeyBvcGFjaXR5OiAwIH0gfSwgeyBjc3M6IHsgb3BhY2l0eTogMSB9LCBkZWxheTogMC4yMiB9KS5ldmVudENhbGxiYWNrKCdvblN0YXJ0JywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdm5vZGUuZWxtLnN0eWxlLnJlbW92ZVByb3BlcnR5KCdkaXNwbGF5Jyk7IH0pO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiAodm5vZGUsIGNiKSB7XG4gICAgICAgIGlmICghdm5vZGUuZWxtKVxuICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgZ3NhcF8xLlR3ZWVuTGl0ZS5mcm9tVG8odm5vZGUuZWxtLCAwLjIsIHsgY3NzOiB7IG9wYWNpdHk6IDEgfSB9LCB7IGNzczogeyBvcGFjaXR5OiAwIH0gfSkuZXZlbnRDYWxsYmFjaygnb25Db21wbGV0ZScsIGNiKTtcbiAgICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9hbmltYXRpb24udHNcbiAqKiBtb2R1bGUgaWQgPSAzMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKioqIElNUE9SVFMgRlJPTSBpbXBvcnRzLWxvYWRlciAqKiovXG52YXIgZGVmaW5lID0gZmFsc2U7XG5yZXF1aXJlKCdnc2FwL3NyYy91bmNvbXByZXNzZWQvcGx1Z2lucy9DU1NQbHVnaW4nKTtcbnJlcXVpcmUoJ2dzYXAvc3JjL3VuY29tcHJlc3NlZC9Ud2VlbkxpdGUnKTtcbmV4cG9ydHMuVHdlZW5MaXRlID0gd2luZG93LlR3ZWVuTGl0ZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZ3NhcC50c1xuICoqIG1vZHVsZSBpZCA9IDMzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKioqIElNUE9SVFMgRlJPTSBpbXBvcnRzLWxvYWRlciAqKiovXG52YXIgZGVmaW5lID0gZmFsc2U7XG5cbi8qIVxuICogVkVSU0lPTjogMS4xOC4yXG4gKiBEQVRFOiAyMDE1LTEyLTIyXG4gKiBVUERBVEVTIEFORCBET0NTIEFUOiBodHRwOi8vZ3JlZW5zb2NrLmNvbVxuICpcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwOC0yMDE2LCBHcmVlblNvY2suIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIHdvcmsgaXMgc3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cDovL2dyZWVuc29jay5jb20vc3RhbmRhcmQtbGljZW5zZSBvciBmb3JcbiAqIENsdWIgR3JlZW5Tb2NrIG1lbWJlcnMsIHRoZSBzb2Z0d2FyZSBhZ3JlZW1lbnQgdGhhdCB3YXMgaXNzdWVkIHdpdGggeW91ciBtZW1iZXJzaGlwLlxuICogXG4gKiBAYXV0aG9yOiBKYWNrIERveWxlLCBqYWNrQGdyZWVuc29jay5jb21cbiAqL1xudmFyIF9nc1Njb3BlID0gKHR5cGVvZihtb2R1bGUpICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZihnbG9iYWwpICE9PSBcInVuZGVmaW5lZFwiKSA/IGdsb2JhbCA6IHRoaXMgfHwgd2luZG93OyAvL2hlbHBzIGVuc3VyZSBjb21wYXRpYmlsaXR5IHdpdGggQU1EL1JlcXVpcmVKUyBhbmQgQ29tbW9uSlMvTm9kZVxuKF9nc1Njb3BlLl9nc1F1ZXVlIHx8IChfZ3NTY29wZS5fZ3NRdWV1ZSA9IFtdKSkucHVzaCggZnVuY3Rpb24oKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0X2dzU2NvcGUuX2dzRGVmaW5lKFwicGx1Z2lucy5DU1NQbHVnaW5cIiwgW1wicGx1Z2lucy5Ud2VlblBsdWdpblwiLFwiVHdlZW5MaXRlXCJdLCBmdW5jdGlvbihUd2VlblBsdWdpbiwgVHdlZW5MaXRlKSB7XG5cblx0XHQvKiogQGNvbnN0cnVjdG9yICoqL1xuXHRcdHZhciBDU1NQbHVnaW4gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0VHdlZW5QbHVnaW4uY2FsbCh0aGlzLCBcImNzc1wiKTtcblx0XHRcdFx0dGhpcy5fb3ZlcndyaXRlUHJvcHMubGVuZ3RoID0gMDtcblx0XHRcdFx0dGhpcy5zZXRSYXRpbyA9IENTU1BsdWdpbi5wcm90b3R5cGUuc2V0UmF0aW87IC8vc3BlZWQgb3B0aW1pemF0aW9uIChhdm9pZCBwcm90b3R5cGUgbG9va3VwIG9uIHRoaXMgXCJob3RcIiBtZXRob2QpXG5cdFx0XHR9LFxuXHRcdFx0X2dsb2JhbHMgPSBfZ3NTY29wZS5fZ3NEZWZpbmUuZ2xvYmFscyxcblx0XHRcdF9oYXNQcmlvcml0eSwgLy90dXJucyB0cnVlIHdoZW5ldmVyIGEgQ1NTUHJvcFR3ZWVuIGluc3RhbmNlIGlzIGNyZWF0ZWQgdGhhdCBoYXMgYSBwcmlvcml0eSBvdGhlciB0aGFuIDAuIFRoaXMgaGVscHMgdXMgZGlzY2VybiB3aGV0aGVyIG9yIG5vdCB3ZSBzaG91bGQgc3BlbmQgdGhlIHRpbWUgb3JnYW5pemluZyB0aGUgbGlua2VkIGxpc3Qgb3Igbm90IGFmdGVyIGEgQ1NTUGx1Z2luJ3MgX29uSW5pdFR3ZWVuKCkgbWV0aG9kIGlzIGNhbGxlZC5cblx0XHRcdF9zdWZmaXhNYXAsIC8vd2Ugc2V0IHRoaXMgaW4gX29uSW5pdFR3ZWVuKCkgZWFjaCB0aW1lIGFzIGEgd2F5IHRvIGhhdmUgYSBwZXJzaXN0ZW50IHZhcmlhYmxlIHdlIGNhbiB1c2UgaW4gb3RoZXIgbWV0aG9kcyBsaWtlIF9wYXJzZSgpIHdpdGhvdXQgaGF2aW5nIHRvIHBhc3MgaXQgYXJvdW5kIGFzIGEgcGFyYW1ldGVyIGFuZCB3ZSBrZWVwIF9wYXJzZSgpIGRlY291cGxlZCBmcm9tIGEgcGFydGljdWxhciBDU1NQbHVnaW4gaW5zdGFuY2Vcblx0XHRcdF9jcywgLy9jb21wdXRlZCBzdHlsZSAod2Ugc3RvcmUgdGhpcyBpbiBhIHNoYXJlZCB2YXJpYWJsZSB0byBjb25zZXJ2ZSBtZW1vcnkgYW5kIG1ha2UgbWluaWZpY2F0aW9uIHRpZ2h0ZXJcblx0XHRcdF9vdmVyd3JpdGVQcm9wcywgLy9hbGlhcyB0byB0aGUgY3VycmVudGx5IGluc3RhbnRpYXRpbmcgQ1NTUGx1Z2luJ3MgX292ZXJ3cml0ZVByb3BzIGFycmF5LiBXZSB1c2UgdGhpcyBjbG9zdXJlIGluIG9yZGVyIHRvIGF2b2lkIGhhdmluZyB0byBwYXNzIGEgcmVmZXJlbmNlIGFyb3VuZCBmcm9tIG1ldGhvZCB0byBtZXRob2QgYW5kIGFpZCBpbiBtaW5pZmljYXRpb24uXG5cdFx0XHRfc3BlY2lhbFByb3BzID0ge30sXG5cdFx0XHRwID0gQ1NTUGx1Z2luLnByb3RvdHlwZSA9IG5ldyBUd2VlblBsdWdpbihcImNzc1wiKTtcblxuXHRcdHAuY29uc3RydWN0b3IgPSBDU1NQbHVnaW47XG5cdFx0Q1NTUGx1Z2luLnZlcnNpb24gPSBcIjEuMTguMlwiO1xuXHRcdENTU1BsdWdpbi5BUEkgPSAyO1xuXHRcdENTU1BsdWdpbi5kZWZhdWx0VHJhbnNmb3JtUGVyc3BlY3RpdmUgPSAwO1xuXHRcdENTU1BsdWdpbi5kZWZhdWx0U2tld1R5cGUgPSBcImNvbXBlbnNhdGVkXCI7XG5cdFx0Q1NTUGx1Z2luLmRlZmF1bHRTbW9vdGhPcmlnaW4gPSB0cnVlO1xuXHRcdHAgPSBcInB4XCI7IC8vd2UnbGwgcmV1c2UgdGhlIFwicFwiIHZhcmlhYmxlIHRvIGtlZXAgZmlsZSBzaXplIGRvd25cblx0XHRDU1NQbHVnaW4uc3VmZml4TWFwID0ge3RvcDpwLCByaWdodDpwLCBib3R0b206cCwgbGVmdDpwLCB3aWR0aDpwLCBoZWlnaHQ6cCwgZm9udFNpemU6cCwgcGFkZGluZzpwLCBtYXJnaW46cCwgcGVyc3BlY3RpdmU6cCwgbGluZUhlaWdodDpcIlwifTtcblxuXG5cdFx0dmFyIF9udW1FeHAgPSAvKD86XFxkfFxcLVxcZHxcXC5cXGR8XFwtXFwuXFxkKSsvZyxcblx0XHRcdF9yZWxOdW1FeHAgPSAvKD86XFxkfFxcLVxcZHxcXC5cXGR8XFwtXFwuXFxkfFxcKz1cXGR8XFwtPVxcZHxcXCs9LlxcZHxcXC09XFwuXFxkKSsvZyxcblx0XHRcdF92YWx1ZXNFeHAgPSAvKD86XFwrPXxcXC09fFxcLXxcXGIpW1xcZFxcLVxcLl0rW2EtekEtWjAtOV0qKD86JXxcXGIpL2dpLCAvL2ZpbmRzIGFsbCB0aGUgdmFsdWVzIHRoYXQgYmVnaW4gd2l0aCBudW1iZXJzIG9yICs9IG9yIC09IGFuZCB0aGVuIGEgbnVtYmVyLiBJbmNsdWRlcyBzdWZmaXhlcy4gV2UgdXNlIHRoaXMgdG8gc3BsaXQgY29tcGxleCB2YWx1ZXMgYXBhcnQgbGlrZSBcIjFweCA1cHggMjBweCByZ2IoMjU1LDEwMiw1MSlcIlxuXHRcdFx0X05hTkV4cCA9IC8oPyFbKy1dP1xcZCpcXC4/XFxkK3xbKy1dfGVbKy1dXFxkKylbXjAtOV0vZywgLy9hbHNvIGFsbG93cyBzY2llbnRpZmljIG5vdGF0aW9uIGFuZCBkb2Vzbid0IGtpbGwgdGhlIGxlYWRpbmcgLS8rIGluIC09IGFuZCArPVxuXHRcdFx0X3N1ZmZpeEV4cCA9IC8oPzpcXGR8XFwtfFxcK3w9fCN8XFwuKSovZyxcblx0XHRcdF9vcGFjaXR5RXhwID0gL29wYWNpdHkgKj0gKihbXildKikvaSxcblx0XHRcdF9vcGFjaXR5VmFsRXhwID0gL29wYWNpdHk6KFteO10qKS9pLFxuXHRcdFx0X2FscGhhRmlsdGVyRXhwID0gL2FscGhhXFwob3BhY2l0eSAqPS4rP1xcKS9pLFxuXHRcdFx0X3JnYmhzbEV4cCA9IC9eKHJnYnxoc2wpLyxcblx0XHRcdF9jYXBzRXhwID0gLyhbQS1aXSkvZyxcblx0XHRcdF9jYW1lbEV4cCA9IC8tKFthLXpdKS9naSxcblx0XHRcdF91cmxFeHAgPSAvKF4oPzp1cmxcXChcXFwifHVybFxcKCkpfCg/OihcXFwiXFwpKSR8XFwpJCkvZ2ksIC8vZm9yIHB1bGxpbmcgb3V0IHVybHMgZnJvbSB1cmwoLi4uKSBvciB1cmwoXCIuLi5cIikgc3RyaW5ncyAoc29tZSBicm93c2VycyB3cmFwIHVybHMgaW4gcXVvdGVzLCBzb21lIGRvbid0IHdoZW4gcmVwb3J0aW5nIHRoaW5ncyBsaWtlIGJhY2tncm91bmRJbWFnZSlcblx0XHRcdF9jYW1lbEZ1bmMgPSBmdW5jdGlvbihzLCBnKSB7IHJldHVybiBnLnRvVXBwZXJDYXNlKCk7IH0sXG5cdFx0XHRfaG9yaXpFeHAgPSAvKD86TGVmdHxSaWdodHxXaWR0aCkvaSxcblx0XHRcdF9pZUdldE1hdHJpeEV4cCA9IC8oTTExfE0xMnxNMjF8TTIyKT1bXFxkXFwtXFwuZV0rL2dpLFxuXHRcdFx0X2llU2V0TWF0cml4RXhwID0gL3Byb2dpZFxcOkRYSW1hZ2VUcmFuc2Zvcm1cXC5NaWNyb3NvZnRcXC5NYXRyaXhcXCguKz9cXCkvaSxcblx0XHRcdF9jb21tYXNPdXRzaWRlUGFyZW5FeHAgPSAvLCg/PVteXFwpXSooPzpcXCh8JCkpL2dpLCAvL2ZpbmRzIGFueSBjb21tYXMgdGhhdCBhcmUgbm90IHdpdGhpbiBwYXJlbnRoZXNpc1xuXHRcdFx0X0RFRzJSQUQgPSBNYXRoLlBJIC8gMTgwLFxuXHRcdFx0X1JBRDJERUcgPSAxODAgLyBNYXRoLlBJLFxuXHRcdFx0X2ZvcmNlUFQgPSB7fSxcblx0XHRcdF9kb2MgPSBkb2N1bWVudCxcblx0XHRcdF9jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24odHlwZSkge1xuXHRcdFx0XHRyZXR1cm4gX2RvYy5jcmVhdGVFbGVtZW50TlMgPyBfZG9jLmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIiwgdHlwZSkgOiBfZG9jLmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cdFx0XHR9LFxuXHRcdFx0X3RlbXBEaXYgPSBfY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRcdF90ZW1wSW1nID0gX2NyZWF0ZUVsZW1lbnQoXCJpbWdcIiksXG5cdFx0XHRfaW50ZXJuYWxzID0gQ1NTUGx1Z2luLl9pbnRlcm5hbHMgPSB7X3NwZWNpYWxQcm9wczpfc3BlY2lhbFByb3BzfSwgLy9wcm92aWRlcyBhIGhvb2sgdG8gYSBmZXcgaW50ZXJuYWwgbWV0aG9kcyB0aGF0IHdlIG5lZWQgdG8gYWNjZXNzIGZyb20gaW5zaWRlIG90aGVyIHBsdWdpbnNcblx0XHRcdF9hZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQsXG5cdFx0XHRfYXV0b1JvdW5kLFxuXHRcdFx0X3JlcVNhZmFyaUZpeCwgLy93ZSB3b24ndCBhcHBseSB0aGUgU2FmYXJpIHRyYW5zZm9ybSBmaXggdW50aWwgd2UgYWN0dWFsbHkgY29tZSBhY3Jvc3MgYSB0d2VlbiB0aGF0IGFmZmVjdHMgYSB0cmFuc2Zvcm0gcHJvcGVydHkgKHRvIG1haW50YWluIGJlc3QgcGVyZm9ybWFuY2UpLlxuXG5cdFx0XHRfaXNTYWZhcmksXG5cdFx0XHRfaXNGaXJlZm94LCAvL0ZpcmVmb3ggaGFzIGEgYnVnIHRoYXQgY2F1c2VzIDNEIHRyYW5zZm9ybWVkIGVsZW1lbnRzIHRvIHJhbmRvbWx5IGRpc2FwcGVhciB1bmxlc3MgYSByZXBhaW50IGlzIGZvcmNlZCBhZnRlciBlYWNoIHVwZGF0ZSBvbiBlYWNoIGVsZW1lbnQuXG5cdFx0XHRfaXNTYWZhcmlMVDYsIC8vU2FmYXJpIChhbmQgQW5kcm9pZCA0IHdoaWNoIHVzZXMgYSBmbGF2b3Igb2YgU2FmYXJpKSBoYXMgYSBidWcgdGhhdCBwcmV2ZW50cyBjaGFuZ2VzIHRvIFwidG9wXCIgYW5kIFwibGVmdFwiIHByb3BlcnRpZXMgZnJvbSByZW5kZXJpbmcgcHJvcGVybHkgaWYgY2hhbmdlZCBvbiB0aGUgc2FtZSBmcmFtZSBhcyBhIHRyYW5zZm9ybSBVTkxFU1Mgd2Ugc2V0IHRoZSBlbGVtZW50J3MgV2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5IHRvIGhpZGRlbiAod2VpcmQsIEkga25vdykuIERvaW5nIHRoaXMgZm9yIEFuZHJvaWQgMyBhbmQgZWFybGllciBzZWVtcyB0byBhY3R1YWxseSBjYXVzZSBvdGhlciBwcm9ibGVtcywgdGhvdWdoIChmdW4hKVxuXHRcdFx0X2llVmVycyxcblx0XHRcdF9zdXBwb3J0c09wYWNpdHkgPSAoZnVuY3Rpb24oKSB7IC8vd2Ugc2V0IF9pc1NhZmFyaSwgX2llVmVycywgX2lzRmlyZWZveCwgYW5kIF9zdXBwb3J0c09wYWNpdHkgYWxsIGluIG9uZSBmdW5jdGlvbiBoZXJlIHRvIHJlZHVjZSBmaWxlIHNpemUgc2xpZ2h0bHksIGVzcGVjaWFsbHkgaW4gdGhlIG1pbmlmaWVkIHZlcnNpb24uXG5cdFx0XHRcdHZhciBpID0gX2FnZW50LmluZGV4T2YoXCJBbmRyb2lkXCIpLFxuXHRcdFx0XHRcdGEgPSBfY3JlYXRlRWxlbWVudChcImFcIik7XG5cdFx0XHRcdF9pc1NhZmFyaSA9IChfYWdlbnQuaW5kZXhPZihcIlNhZmFyaVwiKSAhPT0gLTEgJiYgX2FnZW50LmluZGV4T2YoXCJDaHJvbWVcIikgPT09IC0xICYmIChpID09PSAtMSB8fCBOdW1iZXIoX2FnZW50LnN1YnN0cihpKzgsIDEpKSA+IDMpKTtcblx0XHRcdFx0X2lzU2FmYXJpTFQ2ID0gKF9pc1NhZmFyaSAmJiAoTnVtYmVyKF9hZ2VudC5zdWJzdHIoX2FnZW50LmluZGV4T2YoXCJWZXJzaW9uL1wiKSs4LCAxKSkgPCA2KSk7XG5cdFx0XHRcdF9pc0ZpcmVmb3ggPSAoX2FnZW50LmluZGV4T2YoXCJGaXJlZm94XCIpICE9PSAtMSk7XG5cdFx0XHRcdGlmICgoL01TSUUgKFswLTldezEsfVtcXC4wLTldezAsfSkvKS5leGVjKF9hZ2VudCkgfHwgKC9UcmlkZW50XFwvLipydjooWzAtOV17MSx9W1xcLjAtOV17MCx9KS8pLmV4ZWMoX2FnZW50KSkge1xuXHRcdFx0XHRcdF9pZVZlcnMgPSBwYXJzZUZsb2F0KCBSZWdFeHAuJDEgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWEpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0YS5zdHlsZS5jc3NUZXh0ID0gXCJ0b3A6MXB4O29wYWNpdHk6LjU1O1wiO1xuXHRcdFx0XHRyZXR1cm4gL14wLjU1Ly50ZXN0KGEuc3R5bGUub3BhY2l0eSk7XG5cdFx0XHR9KCkpLFxuXHRcdFx0X2dldElFT3BhY2l0eSA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0cmV0dXJuIChfb3BhY2l0eUV4cC50ZXN0KCAoKHR5cGVvZih2KSA9PT0gXCJzdHJpbmdcIikgPyB2IDogKHYuY3VycmVudFN0eWxlID8gdi5jdXJyZW50U3R5bGUuZmlsdGVyIDogdi5zdHlsZS5maWx0ZXIpIHx8IFwiXCIpICkgPyAoIHBhcnNlRmxvYXQoIFJlZ0V4cC4kMSApIC8gMTAwICkgOiAxKTtcblx0XHRcdH0sXG5cdFx0XHRfbG9nID0gZnVuY3Rpb24ocykgey8vZm9yIGxvZ2dpbmcgbWVzc2FnZXMsIGJ1dCBpbiBhIHdheSB0aGF0IHdvbid0IHRocm93IGVycm9ycyBpbiBvbGQgdmVyc2lvbnMgb2YgSUUuXG5cdFx0XHRcdGlmICh3aW5kb3cuY29uc29sZSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRfcHJlZml4Q1NTID0gXCJcIiwgLy90aGUgbm9uLWNhbWVsQ2FzZSB2ZW5kb3IgcHJlZml4IGxpa2UgXCItby1cIiwgXCItbW96LVwiLCBcIi1tcy1cIiwgb3IgXCItd2Via2l0LVwiXG5cdFx0XHRfcHJlZml4ID0gXCJcIiwgLy9jYW1lbENhc2UgdmVuZG9yIHByZWZpeCBsaWtlIFwiT1wiLCBcIm1zXCIsIFwiV2Via2l0XCIsIG9yIFwiTW96XCIuXG5cblx0XHRcdC8vIEBwcml2YXRlIGZlZWQgaW4gYSBjYW1lbENhc2UgcHJvcGVydHkgbmFtZSBsaWtlIFwidHJhbnNmb3JtXCIgYW5kIGl0IHdpbGwgY2hlY2sgdG8gc2VlIGlmIGl0IGlzIHZhbGlkIGFzLWlzIG9yIGlmIGl0IG5lZWRzIGEgdmVuZG9yIHByZWZpeC4gSXQgcmV0dXJucyB0aGUgY29ycmVjdGVkIGNhbWVsQ2FzZSBwcm9wZXJ0eSBuYW1lIChpLmUuIFwiV2Via2l0VHJhbnNmb3JtXCIgb3IgXCJNb3pUcmFuc2Zvcm1cIiBvciBcInRyYW5zZm9ybVwiIG9yIG51bGwgaWYgbm8gc3VjaCBwcm9wZXJ0eSBpcyBmb3VuZCwgbGlrZSBpZiB0aGUgYnJvd3NlciBpcyBJRTggb3IgYmVmb3JlLCBcInRyYW5zZm9ybVwiIHdvbid0IGJlIGZvdW5kIGF0IGFsbClcblx0XHRcdF9jaGVja1Byb3BQcmVmaXggPSBmdW5jdGlvbihwLCBlKSB7XG5cdFx0XHRcdGUgPSBlIHx8IF90ZW1wRGl2O1xuXHRcdFx0XHR2YXIgcyA9IGUuc3R5bGUsXG5cdFx0XHRcdFx0YSwgaTtcblx0XHRcdFx0aWYgKHNbcF0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHJldHVybiBwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHAgPSBwLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcC5zdWJzdHIoMSk7XG5cdFx0XHRcdGEgPSBbXCJPXCIsXCJNb3pcIixcIm1zXCIsXCJNc1wiLFwiV2Via2l0XCJdO1xuXHRcdFx0XHRpID0gNTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xICYmIHNbYVtpXStwXSA9PT0gdW5kZWZpbmVkKSB7IH1cblx0XHRcdFx0aWYgKGkgPj0gMCkge1xuXHRcdFx0XHRcdF9wcmVmaXggPSAoaSA9PT0gMykgPyBcIm1zXCIgOiBhW2ldO1xuXHRcdFx0XHRcdF9wcmVmaXhDU1MgPSBcIi1cIiArIF9wcmVmaXgudG9Mb3dlckNhc2UoKSArIFwiLVwiO1xuXHRcdFx0XHRcdHJldHVybiBfcHJlZml4ICsgcDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH0sXG5cblx0XHRcdF9nZXRDb21wdXRlZFN0eWxlID0gX2RvYy5kZWZhdWx0VmlldyA/IF9kb2MuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSA6IGZ1bmN0aW9uKCkge30sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgUmV0dXJucyB0aGUgY3NzIHN0eWxlIGZvciBhIHBhcnRpY3VsYXIgcHJvcGVydHkgb2YgYW4gZWxlbWVudC4gRm9yIGV4YW1wbGUsIHRvIGdldCB3aGF0ZXZlciB0aGUgY3VycmVudCBcImxlZnRcIiBjc3MgdmFsdWUgZm9yIGFuIGVsZW1lbnQgd2l0aCBhbiBJRCBvZiBcIm15RWxlbWVudFwiLCB5b3UgY291bGQgZG86XG5cdFx0XHQgKiB2YXIgY3VycmVudExlZnQgPSBDU1NQbHVnaW4uZ2V0U3R5bGUoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlFbGVtZW50XCIpLCBcImxlZnRcIik7XG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCBlbGVtZW50IHdob3NlIHN0eWxlIHByb3BlcnR5IHlvdSB3YW50IHRvIHF1ZXJ5XG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IHAgUHJvcGVydHkgbmFtZSAobGlrZSBcImxlZnRcIiBvciBcInRvcFwiIG9yIFwibWFyZ2luVG9wXCIsIGV0Yy4pXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdD19IGNzIENvbXB1dGVkIHN0eWxlIG9iamVjdC4gVGhpcyBqdXN0IHByb3ZpZGVzIGEgd2F5IHRvIHNwZWVkIHByb2Nlc3NpbmcgaWYgeW91J3JlIGdvaW5nIHRvIGdldCBzZXZlcmFsIHByb3BlcnRpZXMgb24gdGhlIHNhbWUgZWxlbWVudCBpbiBxdWljayBzdWNjZXNzaW9uIC0geW91IGNhbiByZXVzZSB0aGUgcmVzdWx0IG9mIHRoZSBnZXRDb21wdXRlZFN0eWxlKCkgY2FsbC5cblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IGNhbGMgSWYgdHJ1ZSwgdGhlIHZhbHVlIHdpbGwgbm90IGJlIHJlYWQgZGlyZWN0bHkgZnJvbSB0aGUgZWxlbWVudCdzIFwic3R5bGVcIiBwcm9wZXJ0eSAoaWYgaXQgZXhpc3RzIHRoZXJlKSwgYnV0IGluc3RlYWQgdGhlIGdldENvbXB1dGVkU3R5bGUoKSByZXN1bHQgd2lsbCBiZSB1c2VkLiBUaGlzIGNhbiBiZSB1c2VmdWwgd2hlbiB5b3Ugd2FudCB0byBlbnN1cmUgdGhhdCB0aGUgYnJvd3NlciBpdHNlbGYgaXMgaW50ZXJwcmV0aW5nIHRoZSB2YWx1ZS5cblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gZGZsdCBEZWZhdWx0IHZhbHVlIHRoYXQgc2hvdWxkIGJlIHJldHVybmVkIGluIHRoZSBwbGFjZSBvZiBudWxsLCBcIm5vbmVcIiwgXCJhdXRvXCIgb3IgXCJhdXRvIGF1dG9cIi5cblx0XHRcdCAqIEByZXR1cm4gez9zdHJpbmd9IFRoZSBjdXJyZW50IHByb3BlcnR5IHZhbHVlXG5cdFx0XHQgKi9cblx0XHRcdF9nZXRTdHlsZSA9IENTU1BsdWdpbi5nZXRTdHlsZSA9IGZ1bmN0aW9uKHQsIHAsIGNzLCBjYWxjLCBkZmx0KSB7XG5cdFx0XHRcdHZhciBydjtcblx0XHRcdFx0aWYgKCFfc3VwcG9ydHNPcGFjaXR5KSBpZiAocCA9PT0gXCJvcGFjaXR5XCIpIHsgLy9zZXZlcmFsIHZlcnNpb25zIG9mIElFIGRvbid0IHVzZSB0aGUgc3RhbmRhcmQgXCJvcGFjaXR5XCIgcHJvcGVydHkgLSB0aGV5IHVzZSB0aGluZ3MgbGlrZSBmaWx0ZXI6YWxwaGEob3BhY2l0eT01MCksIHNvIHdlIHBhcnNlIHRoYXQgaGVyZS5cblx0XHRcdFx0XHRyZXR1cm4gX2dldElFT3BhY2l0eSh0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWNhbGMgJiYgdC5zdHlsZVtwXSkge1xuXHRcdFx0XHRcdHJ2ID0gdC5zdHlsZVtwXTtcblx0XHRcdFx0fSBlbHNlIGlmICgoY3MgPSBjcyB8fCBfZ2V0Q29tcHV0ZWRTdHlsZSh0KSkpIHtcblx0XHRcdFx0XHRydiA9IGNzW3BdIHx8IGNzLmdldFByb3BlcnR5VmFsdWUocCkgfHwgY3MuZ2V0UHJvcGVydHlWYWx1ZShwLnJlcGxhY2UoX2NhcHNFeHAsIFwiLSQxXCIpLnRvTG93ZXJDYXNlKCkpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHQuY3VycmVudFN0eWxlKSB7XG5cdFx0XHRcdFx0cnYgPSB0LmN1cnJlbnRTdHlsZVtwXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gKGRmbHQgIT0gbnVsbCAmJiAoIXJ2IHx8IHJ2ID09PSBcIm5vbmVcIiB8fCBydiA9PT0gXCJhdXRvXCIgfHwgcnYgPT09IFwiYXV0byBhdXRvXCIpKSA/IGRmbHQgOiBydjtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgUGFzcyB0aGUgdGFyZ2V0IGVsZW1lbnQsIHRoZSBwcm9wZXJ0eSBuYW1lLCB0aGUgbnVtZXJpYyB2YWx1ZSwgYW5kIHRoZSBzdWZmaXggKGxpa2UgXCIlXCIsIFwiZW1cIiwgXCJweFwiLCBldGMuKSBhbmQgaXQgd2lsbCBzcGl0IGJhY2sgdGhlIGVxdWl2YWxlbnQgcGl4ZWwgbnVtYmVyLlxuXHRcdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCBlbGVtZW50XG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IHAgUHJvcGVydHkgbmFtZSAobGlrZSBcImxlZnRcIiwgXCJ0b3BcIiwgXCJtYXJnaW5MZWZ0XCIsIGV0Yy4pXG5cdFx0XHQgKiBAcGFyYW0geyFudW1iZXJ9IHYgVmFsdWVcblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gc2Z4IFN1ZmZpeCAobGlrZSBcInB4XCIgb3IgXCIlXCIgb3IgXCJlbVwiKVxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFuPX0gcmVjdXJzZSBJZiB0cnVlLCB0aGUgY2FsbCBpcyBhIHJlY3Vyc2l2ZSBvbmUuIEluIHNvbWUgYnJvd3NlcnMgKGxpa2UgSUU3LzgpLCBvY2Nhc2lvbmFsbHkgdGhlIHZhbHVlIGlzbid0IGFjY3VyYXRlbHkgcmVwb3J0ZWQgaW5pdGlhbGx5LCBidXQgaWYgd2UgcnVuIHRoZSBmdW5jdGlvbiBhZ2FpbiBpdCB3aWxsIHRha2UgZWZmZWN0LlxuXHRcdFx0ICogQHJldHVybiB7bnVtYmVyfSB2YWx1ZSBpbiBwaXhlbHNcblx0XHRcdCAqL1xuXHRcdFx0X2NvbnZlcnRUb1BpeGVscyA9IF9pbnRlcm5hbHMuY29udmVydFRvUGl4ZWxzID0gZnVuY3Rpb24odCwgcCwgdiwgc2Z4LCByZWN1cnNlKSB7XG5cdFx0XHRcdGlmIChzZnggPT09IFwicHhcIiB8fCAhc2Z4KSB7IHJldHVybiB2OyB9XG5cdFx0XHRcdGlmIChzZnggPT09IFwiYXV0b1wiIHx8ICF2KSB7IHJldHVybiAwOyB9XG5cdFx0XHRcdHZhciBob3JpeiA9IF9ob3JpekV4cC50ZXN0KHApLFxuXHRcdFx0XHRcdG5vZGUgPSB0LFxuXHRcdFx0XHRcdHN0eWxlID0gX3RlbXBEaXYuc3R5bGUsXG5cdFx0XHRcdFx0bmVnID0gKHYgPCAwKSxcblx0XHRcdFx0XHRwaXgsIGNhY2hlLCB0aW1lO1xuXHRcdFx0XHRpZiAobmVnKSB7XG5cdFx0XHRcdFx0diA9IC12O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzZnggPT09IFwiJVwiICYmIHAuaW5kZXhPZihcImJvcmRlclwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRwaXggPSAodiAvIDEwMCkgKiAoaG9yaXogPyB0LmNsaWVudFdpZHRoIDogdC5jbGllbnRIZWlnaHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHN0eWxlLmNzc1RleHQgPSBcImJvcmRlcjowIHNvbGlkIHJlZDtwb3NpdGlvbjpcIiArIF9nZXRTdHlsZSh0LCBcInBvc2l0aW9uXCIpICsgXCI7bGluZS1oZWlnaHQ6MDtcIjtcblx0XHRcdFx0XHRpZiAoc2Z4ID09PSBcIiVcIiB8fCAhbm9kZS5hcHBlbmRDaGlsZCB8fCBzZnguY2hhckF0KDApID09PSBcInZcIiB8fCBzZnggPT09IFwicmVtXCIpIHtcblx0XHRcdFx0XHRcdG5vZGUgPSB0LnBhcmVudE5vZGUgfHwgX2RvYy5ib2R5O1xuXHRcdFx0XHRcdFx0Y2FjaGUgPSBub2RlLl9nc0NhY2hlO1xuXHRcdFx0XHRcdFx0dGltZSA9IFR3ZWVuTGl0ZS50aWNrZXIuZnJhbWU7XG5cdFx0XHRcdFx0XHRpZiAoY2FjaGUgJiYgaG9yaXogJiYgY2FjaGUudGltZSA9PT0gdGltZSkgeyAvL3BlcmZvcm1hbmNlIG9wdGltaXphdGlvbjogd2UgcmVjb3JkIHRoZSB3aWR0aCBvZiBlbGVtZW50cyBhbG9uZyB3aXRoIHRoZSB0aWNrZXIgZnJhbWUgc28gdGhhdCB3ZSBjYW4gcXVpY2tseSBnZXQgaXQgYWdhaW4gb24gdGhlIHNhbWUgdGljayAoc2VlbXMgcmVsYXRpdmVseSBzYWZlIHRvIGFzc3VtZSBpdCB3b3VsZG4ndCBjaGFuZ2Ugb24gdGhlIHNhbWUgdGljaylcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhY2hlLndpZHRoICogdiAvIDEwMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHN0eWxlWyhob3JpeiA/IFwid2lkdGhcIiA6IFwiaGVpZ2h0XCIpXSA9IHYgKyBzZng7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN0eWxlWyhob3JpeiA/IFwiYm9yZGVyTGVmdFdpZHRoXCIgOiBcImJvcmRlclRvcFdpZHRoXCIpXSA9IHYgKyBzZng7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoX3RlbXBEaXYpO1xuXHRcdFx0XHRcdHBpeCA9IHBhcnNlRmxvYXQoX3RlbXBEaXZbKGhvcml6ID8gXCJvZmZzZXRXaWR0aFwiIDogXCJvZmZzZXRIZWlnaHRcIildKTtcblx0XHRcdFx0XHRub2RlLnJlbW92ZUNoaWxkKF90ZW1wRGl2KTtcblx0XHRcdFx0XHRpZiAoaG9yaXogJiYgc2Z4ID09PSBcIiVcIiAmJiBDU1NQbHVnaW4uY2FjaGVXaWR0aHMgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRjYWNoZSA9IG5vZGUuX2dzQ2FjaGUgPSBub2RlLl9nc0NhY2hlIHx8IHt9O1xuXHRcdFx0XHRcdFx0Y2FjaGUudGltZSA9IHRpbWU7XG5cdFx0XHRcdFx0XHRjYWNoZS53aWR0aCA9IHBpeCAvIHYgKiAxMDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwaXggPT09IDAgJiYgIXJlY3Vyc2UpIHtcblx0XHRcdFx0XHRcdHBpeCA9IF9jb252ZXJ0VG9QaXhlbHModCwgcCwgdiwgc2Z4LCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5lZyA/IC1waXggOiBwaXg7XG5cdFx0XHR9LFxuXHRcdFx0X2NhbGN1bGF0ZU9mZnNldCA9IF9pbnRlcm5hbHMuY2FsY3VsYXRlT2Zmc2V0ID0gZnVuY3Rpb24odCwgcCwgY3MpIHsgLy9mb3IgZmlndXJpbmcgb3V0IFwidG9wXCIgb3IgXCJsZWZ0XCIgaW4gcHggd2hlbiBpdCdzIFwiYXV0b1wiLiBXZSBuZWVkIHRvIGZhY3RvciBpbiBtYXJnaW4gd2l0aCB0aGUgb2Zmc2V0TGVmdC9vZmZzZXRUb3Bcblx0XHRcdFx0aWYgKF9nZXRTdHlsZSh0LCBcInBvc2l0aW9uXCIsIGNzKSAhPT0gXCJhYnNvbHV0ZVwiKSB7IHJldHVybiAwOyB9XG5cdFx0XHRcdHZhciBkaW0gPSAoKHAgPT09IFwibGVmdFwiKSA/IFwiTGVmdFwiIDogXCJUb3BcIiksXG5cdFx0XHRcdFx0diA9IF9nZXRTdHlsZSh0LCBcIm1hcmdpblwiICsgZGltLCBjcyk7XG5cdFx0XHRcdHJldHVybiB0W1wib2Zmc2V0XCIgKyBkaW1dIC0gKF9jb252ZXJ0VG9QaXhlbHModCwgcCwgcGFyc2VGbG9hdCh2KSwgdi5yZXBsYWNlKF9zdWZmaXhFeHAsIFwiXCIpKSB8fCAwKTtcblx0XHRcdH0sXG5cblx0XHRcdC8vIEBwcml2YXRlIHJldHVybnMgYXQgb2JqZWN0IGNvbnRhaW5pbmcgQUxMIG9mIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIGluIGNhbWVsQ2FzZSBhbmQgdGhlaXIgYXNzb2NpYXRlZCB2YWx1ZXMuXG5cdFx0XHRfZ2V0QWxsU3R5bGVzID0gZnVuY3Rpb24odCwgY3MpIHtcblx0XHRcdFx0dmFyIHMgPSB7fSxcblx0XHRcdFx0XHRpLCB0ciwgcDtcblx0XHRcdFx0aWYgKChjcyA9IGNzIHx8IF9nZXRDb21wdXRlZFN0eWxlKHQsIG51bGwpKSkge1xuXHRcdFx0XHRcdGlmICgoaSA9IGNzLmxlbmd0aCkpIHtcblx0XHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRwID0gY3NbaV07XG5cdFx0XHRcdFx0XHRcdGlmIChwLmluZGV4T2YoXCItdHJhbnNmb3JtXCIpID09PSAtMSB8fCBfdHJhbnNmb3JtUHJvcENTUyA9PT0gcCkgeyAvL1NvbWUgd2Via2l0IGJyb3dzZXJzIGR1cGxpY2F0ZSB0cmFuc2Zvcm0gdmFsdWVzLCBvbmUgbm9uLXByZWZpeGVkIGFuZCBvbmUgcHJlZml4ZWQgKFwidHJhbnNmb3JtXCIgYW5kIFwiV2Via2l0VHJhbnNmb3JtXCIpLCBzbyB3ZSBtdXN0IHdlZWQgb3V0IHRoZSBleHRyYSBvbmUgaGVyZS5cblx0XHRcdFx0XHRcdFx0XHRzW3AucmVwbGFjZShfY2FtZWxFeHAsIF9jYW1lbEZ1bmMpXSA9IGNzLmdldFByb3BlcnR5VmFsdWUocCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgeyAvL3NvbWUgYnJvd3NlcnMgYmVoYXZlIGRpZmZlcmVudGx5IC0gY3MubGVuZ3RoIGlzIGFsd2F5cyAwLCBzbyB3ZSBtdXN0IGRvIGEgZm9yLi4uaW4gbG9vcC5cblx0XHRcdFx0XHRcdGZvciAoaSBpbiBjcykge1xuXHRcdFx0XHRcdFx0XHRpZiAoaS5pbmRleE9mKFwiVHJhbnNmb3JtXCIpID09PSAtMSB8fCBfdHJhbnNmb3JtUHJvcCA9PT0gaSkgeyAvL1NvbWUgd2Via2l0IGJyb3dzZXJzIGR1cGxpY2F0ZSB0cmFuc2Zvcm0gdmFsdWVzLCBvbmUgbm9uLXByZWZpeGVkIGFuZCBvbmUgcHJlZml4ZWQgKFwidHJhbnNmb3JtXCIgYW5kIFwiV2Via2l0VHJhbnNmb3JtXCIpLCBzbyB3ZSBtdXN0IHdlZWQgb3V0IHRoZSBleHRyYSBvbmUgaGVyZS5cblx0XHRcdFx0XHRcdFx0XHRzW2ldID0gY3NbaV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoKGNzID0gdC5jdXJyZW50U3R5bGUgfHwgdC5zdHlsZSkpIHtcblx0XHRcdFx0XHRmb3IgKGkgaW4gY3MpIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YoaSkgPT09IFwic3RyaW5nXCIgJiYgc1tpXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdHNbaS5yZXBsYWNlKF9jYW1lbEV4cCwgX2NhbWVsRnVuYyldID0gY3NbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghX3N1cHBvcnRzT3BhY2l0eSkge1xuXHRcdFx0XHRcdHMub3BhY2l0eSA9IF9nZXRJRU9wYWNpdHkodCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHIgPSBfZ2V0VHJhbnNmb3JtKHQsIGNzLCBmYWxzZSk7XG5cdFx0XHRcdHMucm90YXRpb24gPSB0ci5yb3RhdGlvbjtcblx0XHRcdFx0cy5za2V3WCA9IHRyLnNrZXdYO1xuXHRcdFx0XHRzLnNjYWxlWCA9IHRyLnNjYWxlWDtcblx0XHRcdFx0cy5zY2FsZVkgPSB0ci5zY2FsZVk7XG5cdFx0XHRcdHMueCA9IHRyLng7XG5cdFx0XHRcdHMueSA9IHRyLnk7XG5cdFx0XHRcdGlmIChfc3VwcG9ydHMzRCkge1xuXHRcdFx0XHRcdHMueiA9IHRyLno7XG5cdFx0XHRcdFx0cy5yb3RhdGlvblggPSB0ci5yb3RhdGlvblg7XG5cdFx0XHRcdFx0cy5yb3RhdGlvblkgPSB0ci5yb3RhdGlvblk7XG5cdFx0XHRcdFx0cy5zY2FsZVogPSB0ci5zY2FsZVo7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHMuZmlsdGVycykge1xuXHRcdFx0XHRcdGRlbGV0ZSBzLmZpbHRlcnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHM7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBAcHJpdmF0ZSBhbmFseXplcyB0d28gc3R5bGUgb2JqZWN0cyAoYXMgcmV0dXJuZWQgYnkgX2dldEFsbFN0eWxlcygpKSBhbmQgb25seSBsb29rcyBmb3IgZGlmZmVyZW5jZXMgYmV0d2VlbiB0aGVtIHRoYXQgY29udGFpbiB0d2VlbmFibGUgdmFsdWVzIChsaWtlIGEgbnVtYmVyIG9yIGNvbG9yKS4gSXQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhIFwiZGlmc1wiIHByb3BlcnR5IHdoaWNoIHJlZmVycyB0byBhbiBvYmplY3QgY29udGFpbmluZyBvbmx5IHRob3NlIGlzb2xhdGVkIHByb3BlcnRpZXMgYW5kIHZhbHVlcyBmb3IgdHdlZW5pbmcsIGFuZCBhIFwiZmlyc3RNUFRcIiBwcm9wZXJ0eSB3aGljaCByZWZlcnMgdG8gdGhlIGZpcnN0IE1pbmlQcm9wVHdlZW4gaW5zdGFuY2UgaW4gYSBsaW5rZWQgbGlzdCB0aGF0IHJlY29yZGVkIGFsbCB0aGUgc3RhcnRpbmcgdmFsdWVzIG9mIHRoZSBkaWZmZXJlbnQgcHJvcGVydGllcyBzbyB0aGF0IHdlIGNhbiByZXZlcnQgdG8gdGhlbSBhdCB0aGUgZW5kIG9yIGJlZ2lubmluZyBvZiB0aGUgdHdlZW4gLSB3ZSBkb24ndCB3YW50IHRoZSBjYXNjYWRpbmcgdG8gZ2V0IG1lc3NlZCB1cC4gVGhlIGZvcmNlTG9va3VwIHBhcmFtZXRlciBpcyBhbiBvcHRpb25hbCBnZW5lcmljIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgdGhhdCBzaG91bGQgYmUgZm9yY2VkIGludG8gdGhlIHJlc3VsdHMgLSB0aGlzIGlzIG5lY2Vzc2FyeSBmb3IgY2xhc3NOYW1lIHR3ZWVucyB0aGF0IGFyZSBvdmVyd3JpdGluZyBvdGhlcnMgYmVjYXVzZSBpbWFnaW5lIGEgc2NlbmFyaW8gd2hlcmUgYSByb2xsb3Zlci9yb2xsb3V0IGFkZHMvcmVtb3ZlcyBhIGNsYXNzIGFuZCB0aGUgdXNlciBzd2lwZXMgdGhlIG1vdXNlIG92ZXIgdGhlIHRhcmdldCBTVVBFUiBmYXN0LCB0aHVzIG5vdGhpbmcgYWN0dWFsbHkgY2hhbmdlZCB5ZXQgYW5kIHRoZSBzdWJzZXF1ZW50IGNvbXBhcmlzb24gb2YgdGhlIHByb3BlcnRpZXMgd291bGQgaW5kaWNhdGUgdGhleSBtYXRjaCAoZXNwZWNpYWxseSB3aGVuIHB4IHJvdW5kaW5nIGlzIHRha2VuIGludG8gY29uc2lkZXJhdGlvbiksIHRodXMgbm8gdHdlZW5pbmcgaXMgbmVjZXNzYXJ5IGV2ZW4gdGhvdWdoIGl0IFNIT1VMRCB0d2VlbiBhbmQgcmVtb3ZlIHRob3NlIHByb3BlcnRpZXMgYWZ0ZXIgdGhlIHR3ZWVuIChvdGhlcndpc2UgdGhlIGlubGluZSBzdHlsZXMgd2lsbCBjb250YW1pbmF0ZSB0aGluZ3MpLiBTZWUgdGhlIGNsYXNzTmFtZSBTcGVjaWFsUHJvcCBjb2RlIGZvciBkZXRhaWxzLlxuXHRcdFx0X2Nzc0RpZiA9IGZ1bmN0aW9uKHQsIHMxLCBzMiwgdmFycywgZm9yY2VMb29rdXApIHtcblx0XHRcdFx0dmFyIGRpZnMgPSB7fSxcblx0XHRcdFx0XHRzdHlsZSA9IHQuc3R5bGUsXG5cdFx0XHRcdFx0dmFsLCBwLCBtcHQ7XG5cdFx0XHRcdGZvciAocCBpbiBzMikge1xuXHRcdFx0XHRcdGlmIChwICE9PSBcImNzc1RleHRcIikgaWYgKHAgIT09IFwibGVuZ3RoXCIpIGlmIChpc05hTihwKSkgaWYgKHMxW3BdICE9PSAodmFsID0gczJbcF0pIHx8IChmb3JjZUxvb2t1cCAmJiBmb3JjZUxvb2t1cFtwXSkpIGlmIChwLmluZGV4T2YoXCJPcmlnaW5cIikgPT09IC0xKSBpZiAodHlwZW9mKHZhbCkgPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mKHZhbCkgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRcdGRpZnNbcF0gPSAodmFsID09PSBcImF1dG9cIiAmJiAocCA9PT0gXCJsZWZ0XCIgfHwgcCA9PT0gXCJ0b3BcIikpID8gX2NhbGN1bGF0ZU9mZnNldCh0LCBwKSA6ICgodmFsID09PSBcIlwiIHx8IHZhbCA9PT0gXCJhdXRvXCIgfHwgdmFsID09PSBcIm5vbmVcIikgJiYgdHlwZW9mKHMxW3BdKSA9PT0gXCJzdHJpbmdcIiAmJiBzMVtwXS5yZXBsYWNlKF9OYU5FeHAsIFwiXCIpICE9PSBcIlwiKSA/IDAgOiB2YWw7IC8vaWYgdGhlIGVuZGluZyB2YWx1ZSBpcyBkZWZhdWx0aW5nIChcIlwiIG9yIFwiYXV0b1wiKSwgd2UgY2hlY2sgdGhlIHN0YXJ0aW5nIHZhbHVlIGFuZCBpZiBpdCBjYW4gYmUgcGFyc2VkIGludG8gYSBudW1iZXIgKGEgc3RyaW5nIHdoaWNoIGNvdWxkIGhhdmUgYSBzdWZmaXggdG9vLCBsaWtlIDcwMHB4KSwgdGhlbiB3ZSBzd2FwIGluIDAgZm9yIFwiXCIgb3IgXCJhdXRvXCIgc28gdGhhdCB0aGluZ3MgYWN0dWFsbHkgdHdlZW4uXG5cdFx0XHRcdFx0XHRpZiAoc3R5bGVbcF0gIT09IHVuZGVmaW5lZCkgeyAvL2ZvciBjbGFzc05hbWUgdHdlZW5zLCB3ZSBtdXN0IHJlbWVtYmVyIHdoaWNoIHByb3BlcnRpZXMgYWxyZWFkeSBleGlzdGVkIGlubGluZSAtIHRoZSBvbmVzIHRoYXQgZGlkbid0IHNob3VsZCBiZSByZW1vdmVkIHdoZW4gdGhlIHR3ZWVuIGlzbid0IGluIHByb2dyZXNzIGJlY2F1c2UgdGhleSB3ZXJlIG9ubHkgaW50cm9kdWNlZCB0byBmYWNpbGl0YXRlIHRoZSB0cmFuc2l0aW9uIGJldHdlZW4gY2xhc3Nlcy5cblx0XHRcdFx0XHRcdFx0bXB0ID0gbmV3IE1pbmlQcm9wVHdlZW4oc3R5bGUsIHAsIHN0eWxlW3BdLCBtcHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodmFycykge1xuXHRcdFx0XHRcdGZvciAocCBpbiB2YXJzKSB7IC8vY29weSBwcm9wZXJ0aWVzIChleGNlcHQgY2xhc3NOYW1lKVxuXHRcdFx0XHRcdFx0aWYgKHAgIT09IFwiY2xhc3NOYW1lXCIpIHtcblx0XHRcdFx0XHRcdFx0ZGlmc1twXSA9IHZhcnNbcF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB7ZGlmczpkaWZzLCBmaXJzdE1QVDptcHR9O1xuXHRcdFx0fSxcblx0XHRcdF9kaW1lbnNpb25zID0ge3dpZHRoOltcIkxlZnRcIixcIlJpZ2h0XCJdLCBoZWlnaHQ6W1wiVG9wXCIsXCJCb3R0b21cIl19LFxuXHRcdFx0X21hcmdpbnMgPSBbXCJtYXJnaW5MZWZ0XCIsXCJtYXJnaW5SaWdodFwiLFwibWFyZ2luVG9wXCIsXCJtYXJnaW5Cb3R0b21cIl0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgR2V0cyB0aGUgd2lkdGggb3IgaGVpZ2h0IG9mIGFuIGVsZW1lbnRcblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCBUYXJnZXQgZWxlbWVudFxuXHRcdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IG5hbWUgKFwid2lkdGhcIiBvciBcImhlaWdodFwiKVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3Q9fSBjcyBDb21wdXRlZCBzdHlsZSBvYmplY3QgKGlmIG9uZSBleGlzdHMpLiBKdXN0IGEgc3BlZWQgb3B0aW1pemF0aW9uLlxuXHRcdFx0ICogQHJldHVybiB7bnVtYmVyfSBEaW1lbnNpb24gKGluIHBpeGVscylcblx0XHRcdCAqL1xuXHRcdFx0X2dldERpbWVuc2lvbiA9IGZ1bmN0aW9uKHQsIHAsIGNzKSB7XG5cdFx0XHRcdHZhciB2ID0gcGFyc2VGbG9hdCgocCA9PT0gXCJ3aWR0aFwiKSA/IHQub2Zmc2V0V2lkdGggOiB0Lm9mZnNldEhlaWdodCksXG5cdFx0XHRcdFx0YSA9IF9kaW1lbnNpb25zW3BdLFxuXHRcdFx0XHRcdGkgPSBhLmxlbmd0aDtcblx0XHRcdFx0Y3MgPSBjcyB8fCBfZ2V0Q29tcHV0ZWRTdHlsZSh0LCBudWxsKTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0diAtPSBwYXJzZUZsb2F0KCBfZ2V0U3R5bGUodCwgXCJwYWRkaW5nXCIgKyBhW2ldLCBjcywgdHJ1ZSkgKSB8fCAwO1xuXHRcdFx0XHRcdHYgLT0gcGFyc2VGbG9hdCggX2dldFN0eWxlKHQsIFwiYm9yZGVyXCIgKyBhW2ldICsgXCJXaWR0aFwiLCBjcywgdHJ1ZSkgKSB8fCAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB2O1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gQHByaXZhdGUgUGFyc2VzIHBvc2l0aW9uLXJlbGF0ZWQgY29tcGxleCBzdHJpbmdzIGxpa2UgXCJ0b3AgbGVmdFwiIG9yIFwiNTBweCAxMHB4XCIgb3IgXCI3MCUgMjAlXCIsIGV0Yy4gd2hpY2ggYXJlIHVzZWQgZm9yIHRoaW5ncyBsaWtlIHRyYW5zZm9ybU9yaWdpbiBvciBiYWNrZ3JvdW5kUG9zaXRpb24uIE9wdGlvbmFsbHkgZGVjb3JhdGVzIGEgc3VwcGxpZWQgb2JqZWN0IChyZWNPYmopIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOiBcIm94XCIgKG9mZnNldFgpLCBcIm95XCIgKG9mZnNldFkpLCBcIm94cFwiIChpZiB0cnVlLCBcIm94XCIgaXMgYSBwZXJjZW50YWdlIG5vdCBhIHBpeGVsIHZhbHVlKSwgYW5kIFwib3h5XCIgKGlmIHRydWUsIFwib3lcIiBpcyBhIHBlcmNlbnRhZ2Ugbm90IGEgcGl4ZWwgdmFsdWUpXG5cdFx0XHRfcGFyc2VQb3NpdGlvbiA9IGZ1bmN0aW9uKHYsIHJlY09iaikge1xuXHRcdFx0XHRpZiAodiA9PT0gXCJjb250YWluXCIgfHwgdiA9PT0gXCJhdXRvXCIgfHwgdiA9PT0gXCJhdXRvIGF1dG9cIikge1xuXHRcdFx0XHRcdHJldHVybiB2ICsgXCIgXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHYgPT0gbnVsbCB8fCB2ID09PSBcIlwiKSB7IC8vbm90ZTogRmlyZWZveCB1c2VzIFwiYXV0byBhdXRvXCIgYXMgZGVmYXVsdCB3aGVyZWFzIENocm9tZSB1c2VzIFwiYXV0b1wiLlxuXHRcdFx0XHRcdHYgPSBcIjAgMFwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBhID0gdi5zcGxpdChcIiBcIiksXG5cdFx0XHRcdFx0eCA9ICh2LmluZGV4T2YoXCJsZWZ0XCIpICE9PSAtMSkgPyBcIjAlXCIgOiAodi5pbmRleE9mKFwicmlnaHRcIikgIT09IC0xKSA/IFwiMTAwJVwiIDogYVswXSxcblx0XHRcdFx0XHR5ID0gKHYuaW5kZXhPZihcInRvcFwiKSAhPT0gLTEpID8gXCIwJVwiIDogKHYuaW5kZXhPZihcImJvdHRvbVwiKSAhPT0gLTEpID8gXCIxMDAlXCIgOiBhWzFdO1xuXHRcdFx0XHRpZiAoeSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0eSA9ICh4ID09PSBcImNlbnRlclwiKSA/IFwiNTAlXCIgOiBcIjBcIjtcblx0XHRcdFx0fSBlbHNlIGlmICh5ID09PSBcImNlbnRlclwiKSB7XG5cdFx0XHRcdFx0eSA9IFwiNTAlXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHggPT09IFwiY2VudGVyXCIgfHwgKGlzTmFOKHBhcnNlRmxvYXQoeCkpICYmICh4ICsgXCJcIikuaW5kZXhPZihcIj1cIikgPT09IC0xKSkgeyAvL3JlbWVtYmVyLCB0aGUgdXNlciBjb3VsZCBmbGlwLWZsb3AgdGhlIHZhbHVlcyBhbmQgc2F5IFwiYm90dG9tIGNlbnRlclwiIG9yIFwiY2VudGVyIGJvdHRvbVwiLCBldGMuIFwiY2VudGVyXCIgaXMgYW1iaWd1b3VzIGJlY2F1c2UgaXQgY291bGQgYmUgdXNlZCB0byBkZXNjcmliZSBob3Jpem9udGFsIG9yIHZlcnRpY2FsLCBoZW5jZSB0aGUgaXNOYU4oKS4gSWYgdGhlcmUncyBhbiBcIj1cIiBzaWduIGluIHRoZSB2YWx1ZSwgaXQncyByZWxhdGl2ZS5cblx0XHRcdFx0XHR4ID0gXCI1MCVcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHR2ID0geCArIFwiIFwiICsgeSArICgoYS5sZW5ndGggPiAyKSA/IFwiIFwiICsgYVsyXSA6IFwiXCIpO1xuXHRcdFx0XHRpZiAocmVjT2JqKSB7XG5cdFx0XHRcdFx0cmVjT2JqLm94cCA9ICh4LmluZGV4T2YoXCIlXCIpICE9PSAtMSk7XG5cdFx0XHRcdFx0cmVjT2JqLm95cCA9ICh5LmluZGV4T2YoXCIlXCIpICE9PSAtMSk7XG5cdFx0XHRcdFx0cmVjT2JqLm94ciA9ICh4LmNoYXJBdCgxKSA9PT0gXCI9XCIpO1xuXHRcdFx0XHRcdHJlY09iai5veXIgPSAoeS5jaGFyQXQoMSkgPT09IFwiPVwiKTtcblx0XHRcdFx0XHRyZWNPYmoub3ggPSBwYXJzZUZsb2F0KHgucmVwbGFjZShfTmFORXhwLCBcIlwiKSk7XG5cdFx0XHRcdFx0cmVjT2JqLm95ID0gcGFyc2VGbG9hdCh5LnJlcGxhY2UoX05hTkV4cCwgXCJcIikpO1xuXHRcdFx0XHRcdHJlY09iai52ID0gdjtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVjT2JqIHx8IHY7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIFRha2VzIGFuIGVuZGluZyB2YWx1ZSAodHlwaWNhbGx5IGEgc3RyaW5nLCBidXQgY2FuIGJlIGEgbnVtYmVyKSBhbmQgYSBzdGFydGluZyB2YWx1ZSBhbmQgcmV0dXJucyB0aGUgY2hhbmdlIGJldHdlZW4gdGhlIHR3bywgbG9va2luZyBmb3IgcmVsYXRpdmUgdmFsdWUgaW5kaWNhdG9ycyBsaWtlICs9IGFuZCAtPSBhbmQgaXQgYWxzbyBpZ25vcmVzIHN1ZmZpeGVzIChidXQgbWFrZSBzdXJlIHRoZSBlbmRpbmcgdmFsdWUgc3RhcnRzIHdpdGggYSBudW1iZXIgb3IgKz0vLT0gYW5kIHRoYXQgdGhlIHN0YXJ0aW5nIHZhbHVlIGlzIGEgTlVNQkVSISlcblx0XHRcdCAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSBlIEVuZCB2YWx1ZSB3aGljaCBpcyB0eXBpY2FsbHkgYSBzdHJpbmcsIGJ1dCBjb3VsZCBiZSBhIG51bWJlclxuXHRcdFx0ICogQHBhcmFtIHsobnVtYmVyfHN0cmluZyl9IGIgQmVnaW5uaW5nIHZhbHVlIHdoaWNoIGlzIHR5cGljYWxseSBhIHN0cmluZyBidXQgY291bGQgYmUgYSBudW1iZXJcblx0XHRcdCAqIEByZXR1cm4ge251bWJlcn0gQW1vdW50IG9mIGNoYW5nZSBiZXR3ZWVuIHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgKHJlbGF0aXZlIHZhbHVlcyB0aGF0IGhhdmUgYSBcIis9XCIgb3IgXCItPVwiIGFyZSByZWNvZ25pemVkKVxuXHRcdFx0ICovXG5cdFx0XHRfcGFyc2VDaGFuZ2UgPSBmdW5jdGlvbihlLCBiKSB7XG5cdFx0XHRcdHJldHVybiAodHlwZW9mKGUpID09PSBcInN0cmluZ1wiICYmIGUuY2hhckF0KDEpID09PSBcIj1cIikgPyBwYXJzZUludChlLmNoYXJBdCgwKSArIFwiMVwiLCAxMCkgKiBwYXJzZUZsb2F0KGUuc3Vic3RyKDIpKSA6IHBhcnNlRmxvYXQoZSkgLSBwYXJzZUZsb2F0KGIpO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZSBUYWtlcyBhIHZhbHVlIGFuZCBhIGRlZmF1bHQgbnVtYmVyLCBjaGVja3MgaWYgdGhlIHZhbHVlIGlzIHJlbGF0aXZlLCBudWxsLCBvciBudW1lcmljIGFuZCBzcGl0cyBiYWNrIGEgbm9ybWFsaXplZCBudW1iZXIgYWNjb3JkaW5nbHkuIFByaW1hcmlseSB1c2VkIGluIHRoZSBfcGFyc2VUcmFuc2Zvcm0oKSBmdW5jdGlvbi5cblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSB2IFZhbHVlIHRvIGJlIHBhcnNlZFxuXHRcdFx0ICogQHBhcmFtIHshbnVtYmVyfSBkIERlZmF1bHQgdmFsdWUgKHdoaWNoIGlzIGFsc28gdXNlZCBmb3IgcmVsYXRpdmUgY2FsY3VsYXRpb25zIGlmIFwiKz1cIiBvciBcIi09XCIgaXMgZm91bmQgaW4gdGhlIGZpcnN0IHBhcmFtZXRlcilcblx0XHRcdCAqIEByZXR1cm4ge251bWJlcn0gUGFyc2VkIHZhbHVlXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZVZhbCA9IGZ1bmN0aW9uKHYsIGQpIHtcblx0XHRcdFx0cmV0dXJuICh2ID09IG51bGwpID8gZCA6ICh0eXBlb2YodikgPT09IFwic3RyaW5nXCIgJiYgdi5jaGFyQXQoMSkgPT09IFwiPVwiKSA/IHBhcnNlSW50KHYuY2hhckF0KDApICsgXCIxXCIsIDEwKSAqIHBhcnNlRmxvYXQodi5zdWJzdHIoMikpICsgZCA6IHBhcnNlRmxvYXQodik7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIFRyYW5zbGF0ZXMgc3RyaW5ncyBsaWtlIFwiNDBkZWdcIiBvciBcIjQwXCIgb3IgNDByYWRcIiBvciBcIis9NDBkZWdcIiBvciBcIjI3MF9zaG9ydFwiIG9yIFwiLTkwX2N3XCIgb3IgXCIrPTQ1X2Njd1wiIHRvIGEgbnVtZXJpYyByYWRpYW4gYW5nbGUuIE9mIGNvdXJzZSBhIHN0YXJ0aW5nL2RlZmF1bHQgdmFsdWUgbXVzdCBiZSBmZWQgaW4gdG9vIHNvIHRoYXQgcmVsYXRpdmUgdmFsdWVzIGNhbiBiZSBjYWxjdWxhdGVkIHByb3Blcmx5LlxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3R9IHYgVmFsdWUgdG8gYmUgcGFyc2VkXG5cdFx0XHQgKiBAcGFyYW0geyFudW1iZXJ9IGQgRGVmYXVsdCB2YWx1ZSAod2hpY2ggaXMgYWxzbyB1c2VkIGZvciByZWxhdGl2ZSBjYWxjdWxhdGlvbnMgaWYgXCIrPVwiIG9yIFwiLT1cIiBpcyBmb3VuZCBpbiB0aGUgZmlyc3QgcGFyYW1ldGVyKVxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBwIHByb3BlcnR5IG5hbWUgZm9yIGRpcmVjdGlvbmFsRW5kIChvcHRpb25hbCAtIG9ubHkgdXNlZCB3aGVuIHRoZSBwYXJzZWQgdmFsdWUgaXMgZGlyZWN0aW9uYWwgKFwiX3Nob3J0XCIsIFwiX2N3XCIsIG9yIFwiX2Njd1wiIHN1ZmZpeCkuIFdlIG5lZWQgYSB3YXkgdG8gc3RvcmUgdGhlIHVuY29tcGVuc2F0ZWQgdmFsdWUgc28gdGhhdCBhdCB0aGUgZW5kIG9mIHRoZSB0d2Vlbiwgd2Ugc2V0IGl0IHRvIGV4YWN0bHkgd2hhdCB3YXMgcmVxdWVzdGVkIHdpdGggbm8gZGlyZWN0aW9uYWwgY29tcGVuc2F0aW9uKS4gUHJvcGVydHkgbmFtZSB3b3VsZCBiZSBcInJvdGF0aW9uXCIsIFwicm90YXRpb25YXCIsIG9yIFwicm90YXRpb25ZXCJcblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0PX0gZGlyZWN0aW9uYWxFbmQgQW4gb2JqZWN0IHRoYXQgd2lsbCBzdG9yZSB0aGUgcmF3IGVuZCB2YWx1ZXMgZm9yIGRpcmVjdGlvbmFsIGFuZ2xlcyAoXCJfc2hvcnRcIiwgXCJfY3dcIiwgb3IgXCJfY2N3XCIgc3VmZml4KS4gV2UgbmVlZCBhIHdheSB0byBzdG9yZSB0aGUgdW5jb21wZW5zYXRlZCB2YWx1ZSBzbyB0aGF0IGF0IHRoZSBlbmQgb2YgdGhlIHR3ZWVuLCB3ZSBzZXQgaXQgdG8gZXhhY3RseSB3aGF0IHdhcyByZXF1ZXN0ZWQgd2l0aCBubyBkaXJlY3Rpb25hbCBjb21wZW5zYXRpb24uXG5cdFx0XHQgKiBAcmV0dXJuIHtudW1iZXJ9IHBhcnNlZCBhbmdsZSBpbiByYWRpYW5zXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZUFuZ2xlID0gZnVuY3Rpb24odiwgZCwgcCwgZGlyZWN0aW9uYWxFbmQpIHtcblx0XHRcdFx0dmFyIG1pbiA9IDAuMDAwMDAxLFxuXHRcdFx0XHRcdGNhcCwgc3BsaXQsIGRpZiwgcmVzdWx0LCBpc1JlbGF0aXZlO1xuXHRcdFx0XHRpZiAodiA9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gZDtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YodikgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHRyZXN1bHQgPSB2O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNhcCA9IDM2MDtcblx0XHRcdFx0XHRzcGxpdCA9IHYuc3BsaXQoXCJfXCIpO1xuXHRcdFx0XHRcdGlzUmVsYXRpdmUgPSAodi5jaGFyQXQoMSkgPT09IFwiPVwiKTtcblx0XHRcdFx0XHRkaWYgPSAoaXNSZWxhdGl2ZSA/IHBhcnNlSW50KHYuY2hhckF0KDApICsgXCIxXCIsIDEwKSAqIHBhcnNlRmxvYXQoc3BsaXRbMF0uc3Vic3RyKDIpKSA6IHBhcnNlRmxvYXQoc3BsaXRbMF0pKSAqICgodi5pbmRleE9mKFwicmFkXCIpID09PSAtMSkgPyAxIDogX1JBRDJERUcpIC0gKGlzUmVsYXRpdmUgPyAwIDogZCk7XG5cdFx0XHRcdFx0aWYgKHNwbGl0Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0aWYgKGRpcmVjdGlvbmFsRW5kKSB7XG5cdFx0XHRcdFx0XHRcdGRpcmVjdGlvbmFsRW5kW3BdID0gZCArIGRpZjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICh2LmluZGV4T2YoXCJzaG9ydFwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0ZGlmID0gZGlmICUgY2FwO1xuXHRcdFx0XHRcdFx0XHRpZiAoZGlmICE9PSBkaWYgJSAoY2FwIC8gMikpIHtcblx0XHRcdFx0XHRcdFx0XHRkaWYgPSAoZGlmIDwgMCkgPyBkaWYgKyBjYXAgOiBkaWYgLSBjYXA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICh2LmluZGV4T2YoXCJfY3dcIikgIT09IC0xICYmIGRpZiA8IDApIHtcblx0XHRcdFx0XHRcdFx0ZGlmID0gKChkaWYgKyBjYXAgKiA5OTk5OTk5OTk5KSAlIGNhcCkgLSAoKGRpZiAvIGNhcCkgfCAwKSAqIGNhcDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodi5pbmRleE9mKFwiY2N3XCIpICE9PSAtMSAmJiBkaWYgPiAwKSB7XG5cdFx0XHRcdFx0XHRcdGRpZiA9ICgoZGlmIC0gY2FwICogOTk5OTk5OTk5OSkgJSBjYXApIC0gKChkaWYgLyBjYXApIHwgMCkgKiBjYXA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlc3VsdCA9IGQgKyBkaWY7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHJlc3VsdCA8IG1pbiAmJiByZXN1bHQgPiAtbWluKSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fSxcblxuXHRcdFx0X2NvbG9yTG9va3VwID0ge2FxdWE6WzAsMjU1LDI1NV0sXG5cdFx0XHRcdGxpbWU6WzAsMjU1LDBdLFxuXHRcdFx0XHRzaWx2ZXI6WzE5MiwxOTIsMTkyXSxcblx0XHRcdFx0YmxhY2s6WzAsMCwwXSxcblx0XHRcdFx0bWFyb29uOlsxMjgsMCwwXSxcblx0XHRcdFx0dGVhbDpbMCwxMjgsMTI4XSxcblx0XHRcdFx0Ymx1ZTpbMCwwLDI1NV0sXG5cdFx0XHRcdG5hdnk6WzAsMCwxMjhdLFxuXHRcdFx0XHR3aGl0ZTpbMjU1LDI1NSwyNTVdLFxuXHRcdFx0XHRmdWNoc2lhOlsyNTUsMCwyNTVdLFxuXHRcdFx0XHRvbGl2ZTpbMTI4LDEyOCwwXSxcblx0XHRcdFx0eWVsbG93OlsyNTUsMjU1LDBdLFxuXHRcdFx0XHRvcmFuZ2U6WzI1NSwxNjUsMF0sXG5cdFx0XHRcdGdyYXk6WzEyOCwxMjgsMTI4XSxcblx0XHRcdFx0cHVycGxlOlsxMjgsMCwxMjhdLFxuXHRcdFx0XHRncmVlbjpbMCwxMjgsMF0sXG5cdFx0XHRcdHJlZDpbMjU1LDAsMF0sXG5cdFx0XHRcdHBpbms6WzI1NSwxOTIsMjAzXSxcblx0XHRcdFx0Y3lhbjpbMCwyNTUsMjU1XSxcblx0XHRcdFx0dHJhbnNwYXJlbnQ6WzI1NSwyNTUsMjU1LDBdfSxcblxuXHRcdFx0X2h1ZSA9IGZ1bmN0aW9uKGgsIG0xLCBtMikge1xuXHRcdFx0XHRoID0gKGggPCAwKSA/IGggKyAxIDogKGggPiAxKSA/IGggLSAxIDogaDtcblx0XHRcdFx0cmV0dXJuICgoKChoICogNiA8IDEpID8gbTEgKyAobTIgLSBtMSkgKiBoICogNiA6IChoIDwgMC41KSA/IG0yIDogKGggKiAzIDwgMikgPyBtMSArIChtMiAtIG0xKSAqICgyIC8gMyAtIGgpICogNiA6IG0xKSAqIDI1NSkgKyAwLjUpIHwgMDtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgUGFyc2VzIGEgY29sb3IgKGxpa2UgIzlGMCwgI0ZGOTkwMCwgcmdiKDI1NSw1MSwxNTMpIG9yIGhzbCgxMDgsIDUwJSwgMTAlKSkgaW50byBhbiBhcnJheSB3aXRoIDMgZWxlbWVudHMgZm9yIHJlZCwgZ3JlZW4sIGFuZCBibHVlIG9yIGlmIHRvSFNMIHBhcmFtZXRlciBpcyB0cnVlLCBpdCB3aWxsIHBvcHVsYXRlIHRoZSBhcnJheSB3aXRoIGh1ZSwgc2F0dXJhdGlvbiwgYW5kIGxpZ2h0bmVzcyB2YWx1ZXMuIElmIGEgcmVsYXRpdmUgdmFsdWUgaXMgZm91bmQgaW4gYW4gaHNsKCkgb3IgaHNsYSgpIHN0cmluZywgaXQgd2lsbCBwcmVzZXJ2ZSB0aG9zZSByZWxhdGl2ZSBwcmVmaXhlcyBhbmQgYWxsIHRoZSB2YWx1ZXMgaW4gdGhlIGFycmF5IHdpbGwgYmUgc3RyaW5ncyBpbnN0ZWFkIG9mIG51bWJlcnMgKGluIGFsbCBvdGhlciBjYXNlcyBpdCB3aWxsIGJlIHBvcHVsYXRlZCB3aXRoIG51bWJlcnMpLlxuXHRcdFx0ICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IHYgVGhlIHZhbHVlIHRoZSBzaG91bGQgYmUgcGFyc2VkIHdoaWNoIGNvdWxkIGJlIGEgc3RyaW5nIGxpa2UgIzlGMCBvciByZ2IoMjU1LDEwMiw1MSkgb3IgcmdiYSgyNTUsMCwwLDAuNSkgb3IgaXQgY291bGQgYmUgYSBudW1iZXIgbGlrZSAweEZGMDBDQyBvciBldmVuIGEgbmFtZWQgY29sb3IgbGlrZSByZWQsIGJsdWUsIHB1cnBsZSwgZXRjLlxuXHRcdFx0ICogQHBhcmFtIHsoYm9vbGVhbil9IHRvSFNMIElmIHRydWUsIGFuIGhzbCgpIG9yIGhzbGEoKSB2YWx1ZSB3aWxsIGJlIHJldHVybmVkIGluc3RlYWQgb2YgcmdiKCkgb3IgcmdiYSgpXG5cdFx0XHQgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn0gQW4gYXJyYXkgY29udGFpbmluZyByZWQsIGdyZWVuLCBhbmQgYmx1ZSAoYW5kIG9wdGlvbmFsbHkgYWxwaGEpIGluIHRoYXQgb3JkZXIsIG9yIGlmIHRoZSB0b0hTTCBwYXJhbWV0ZXIgd2FzIHRydWUsIHRoZSBhcnJheSB3aWxsIGNvbnRhaW4gaHVlLCBzYXR1cmF0aW9uIGFuZCBsaWdodG5lc3MgKGFuZCBvcHRpb25hbGx5IGFscGhhKSBpbiB0aGF0IG9yZGVyLiBBbHdheXMgbnVtYmVycyB1bmxlc3MgdGhlcmUncyBhIHJlbGF0aXZlIHByZWZpeCBmb3VuZCBpbiBhbiBoc2woKSBvciBoc2xhKCkgc3RyaW5nIGFuZCB0b0hTTCBpcyB0cnVlLlxuXHRcdFx0ICovXG5cdFx0XHRfcGFyc2VDb2xvciA9IENTU1BsdWdpbi5wYXJzZUNvbG9yID0gZnVuY3Rpb24odiwgdG9IU0wpIHtcblx0XHRcdFx0dmFyIGEsIHIsIGcsIGIsIGgsIHMsIGwsIG1heCwgbWluLCBkLCB3YXNIU0w7XG5cdFx0XHRcdGlmICghdikge1xuXHRcdFx0XHRcdGEgPSBfY29sb3JMb29rdXAuYmxhY2s7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mKHYpID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0YSA9IFt2ID4+IDE2LCAodiA+PiA4KSAmIDI1NSwgdiAmIDI1NV07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHYuY2hhckF0KHYubGVuZ3RoIC0gMSkgPT09IFwiLFwiKSB7IC8vc29tZXRpbWVzIGEgdHJhaWxpbmcgY29tbWEgaXMgaW5jbHVkZWQgYW5kIHdlIHNob3VsZCBjaG9wIGl0IG9mZiAodHlwaWNhbGx5IGZyb20gYSBjb21tYS1kZWxpbWl0ZWQgbGlzdCBvZiB2YWx1ZXMgbGlrZSBhIHRleHRTaGFkb3c6XCIycHggMnB4IDJweCBibHVlLCA1cHggNXB4IDVweCByZ2IoMjU1LDAsMClcIiAtIGluIHRoaXMgZXhhbXBsZSBcImJsdWUsXCIgaGFzIGEgdHJhaWxpbmcgY29tbWEuIFdlIGNvdWxkIHN0cmlwIGl0IG91dCBpbnNpZGUgcGFyc2VDb21wbGV4KCkgYnV0IHdlJ2QgbmVlZCB0byBkbyBpdCB0byB0aGUgYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzIHBsdXMgaXQgd291bGRuJ3QgcHJvdmlkZSBwcm90ZWN0aW9uIGZyb20gb3RoZXIgcG90ZW50aWFsIHNjZW5hcmlvcyBsaWtlIGlmIHRoZSB1c2VyIHBhc3NlcyBpbiBhIHNpbWlsYXIgdmFsdWUuXG5cdFx0XHRcdFx0XHR2ID0gdi5zdWJzdHIoMCwgdi5sZW5ndGggLSAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKF9jb2xvckxvb2t1cFt2XSkge1xuXHRcdFx0XHRcdFx0YSA9IF9jb2xvckxvb2t1cFt2XTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHYuY2hhckF0KDApID09PSBcIiNcIikge1xuXHRcdFx0XHRcdFx0aWYgKHYubGVuZ3RoID09PSA0KSB7IC8vZm9yIHNob3J0aGFuZCBsaWtlICM5RjBcblx0XHRcdFx0XHRcdFx0ciA9IHYuY2hhckF0KDEpO1xuXHRcdFx0XHRcdFx0XHRnID0gdi5jaGFyQXQoMik7XG5cdFx0XHRcdFx0XHRcdGIgPSB2LmNoYXJBdCgzKTtcblx0XHRcdFx0XHRcdFx0diA9IFwiI1wiICsgciArIHIgKyBnICsgZyArIGIgKyBiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0diA9IHBhcnNlSW50KHYuc3Vic3RyKDEpLCAxNik7XG5cdFx0XHRcdFx0XHRhID0gW3YgPj4gMTYsICh2ID4+IDgpICYgMjU1LCB2ICYgMjU1XTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHYuc3Vic3RyKDAsIDMpID09PSBcImhzbFwiKSB7XG5cdFx0XHRcdFx0XHRhID0gd2FzSFNMID0gdi5tYXRjaChfbnVtRXhwKTtcblx0XHRcdFx0XHRcdGlmICghdG9IU0wpIHtcblx0XHRcdFx0XHRcdFx0aCA9IChOdW1iZXIoYVswXSkgJSAzNjApIC8gMzYwO1xuXHRcdFx0XHRcdFx0XHRzID0gTnVtYmVyKGFbMV0pIC8gMTAwO1xuXHRcdFx0XHRcdFx0XHRsID0gTnVtYmVyKGFbMl0pIC8gMTAwO1xuXHRcdFx0XHRcdFx0XHRnID0gKGwgPD0gMC41KSA/IGwgKiAocyArIDEpIDogbCArIHMgLSBsICogcztcblx0XHRcdFx0XHRcdFx0ciA9IGwgKiAyIC0gZztcblx0XHRcdFx0XHRcdFx0aWYgKGEubGVuZ3RoID4gMykge1xuXHRcdFx0XHRcdFx0XHRcdGFbM10gPSBOdW1iZXIodlszXSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0YVswXSA9IF9odWUoaCArIDEgLyAzLCByLCBnKTtcblx0XHRcdFx0XHRcdFx0YVsxXSA9IF9odWUoaCwgciwgZyk7XG5cdFx0XHRcdFx0XHRcdGFbMl0gPSBfaHVlKGggLSAxIC8gMywgciwgZyk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHYuaW5kZXhPZihcIj1cIikgIT09IC0xKSB7IC8vaWYgcmVsYXRpdmUgdmFsdWVzIGFyZSBmb3VuZCwganVzdCByZXR1cm4gdGhlIHJhdyBzdHJpbmdzIHdpdGggdGhlIHJlbGF0aXZlIHByZWZpeGVzIGluIHBsYWNlLlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdi5tYXRjaChfcmVsTnVtRXhwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YSA9IHYubWF0Y2goX251bUV4cCkgfHwgX2NvbG9yTG9va3VwLnRyYW5zcGFyZW50O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhWzBdID0gTnVtYmVyKGFbMF0pO1xuXHRcdFx0XHRcdGFbMV0gPSBOdW1iZXIoYVsxXSk7XG5cdFx0XHRcdFx0YVsyXSA9IE51bWJlcihhWzJdKTtcblx0XHRcdFx0XHRpZiAoYS5sZW5ndGggPiAzKSB7XG5cdFx0XHRcdFx0XHRhWzNdID0gTnVtYmVyKGFbM10pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodG9IU0wgJiYgIXdhc0hTTCkge1xuXHRcdFx0XHRcdHIgPSBhWzBdIC8gMjU1O1xuXHRcdFx0XHRcdGcgPSBhWzFdIC8gMjU1O1xuXHRcdFx0XHRcdGIgPSBhWzJdIC8gMjU1O1xuXHRcdFx0XHRcdG1heCA9IE1hdGgubWF4KHIsIGcsIGIpO1xuXHRcdFx0XHRcdG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuXHRcdFx0XHRcdGwgPSAobWF4ICsgbWluKSAvIDI7XG5cdFx0XHRcdFx0aWYgKG1heCA9PT0gbWluKSB7XG5cdFx0XHRcdFx0XHRoID0gcyA9IDA7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGQgPSBtYXggLSBtaW47XG5cdFx0XHRcdFx0XHRzID0gbCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbik7XG5cdFx0XHRcdFx0XHRoID0gKG1heCA9PT0gcikgPyAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKSA6IChtYXggPT09IGcpID8gKGIgLSByKSAvIGQgKyAyIDogKHIgLSBnKSAvIGQgKyA0O1xuXHRcdFx0XHRcdFx0aCAqPSA2MDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YVswXSA9IChoICsgMC41KSB8IDA7XG5cdFx0XHRcdFx0YVsxXSA9IChzICogMTAwICsgMC41KSB8IDA7XG5cdFx0XHRcdFx0YVsyXSA9IChsICogMTAwICsgMC41KSB8IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGE7XG5cdFx0XHR9LFxuXHRcdFx0X2Zvcm1hdENvbG9ycyA9IGZ1bmN0aW9uKHMsIHRvSFNMKSB7XG5cdFx0XHRcdHZhciBjb2xvcnMgPSBzLm1hdGNoKF9jb2xvckV4cCkgfHwgW10sXG5cdFx0XHRcdFx0Y2hhckluZGV4ID0gMCxcblx0XHRcdFx0XHRwYXJzZWQgPSBjb2xvcnMubGVuZ3RoID8gXCJcIiA6IHMsXG5cdFx0XHRcdFx0aSwgY29sb3IsIHRlbXA7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjb2xvcnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRjb2xvciA9IGNvbG9yc1tpXTtcblx0XHRcdFx0XHR0ZW1wID0gcy5zdWJzdHIoY2hhckluZGV4LCBzLmluZGV4T2YoY29sb3IsIGNoYXJJbmRleCktY2hhckluZGV4KTtcblx0XHRcdFx0XHRjaGFySW5kZXggKz0gdGVtcC5sZW5ndGggKyBjb2xvci5sZW5ndGg7XG5cdFx0XHRcdFx0Y29sb3IgPSBfcGFyc2VDb2xvcihjb2xvciwgdG9IU0wpO1xuXHRcdFx0XHRcdGlmIChjb2xvci5sZW5ndGggPT09IDMpIHtcblx0XHRcdFx0XHRcdGNvbG9yLnB1c2goMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHBhcnNlZCArPSB0ZW1wICsgKHRvSFNMID8gXCJoc2xhKFwiICsgY29sb3JbMF0gKyBcIixcIiArIGNvbG9yWzFdICsgXCIlLFwiICsgY29sb3JbMl0gKyBcIiUsXCIgKyBjb2xvclszXSA6IFwicmdiYShcIiArIGNvbG9yLmpvaW4oXCIsXCIpKSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwYXJzZWQ7XG5cdFx0XHR9LFxuXHRcdFx0X2NvbG9yRXhwID0gXCIoPzpcXFxcYig/Oig/OnJnYnxyZ2JhfGhzbHxoc2xhKVxcXFwoLis/XFxcXCkpfFxcXFxCIyg/OlswLTlhLWZdezN9KXsxLDJ9XFxcXGJcIjsgLy93ZSdsbCBkeW5hbWljYWxseSBidWlsZCB0aGlzIFJlZ3VsYXIgRXhwcmVzc2lvbiB0byBjb25zZXJ2ZSBmaWxlIHNpemUuIEFmdGVyIGJ1aWxkaW5nIGl0LCBpdCB3aWxsIGJlIGFibGUgdG8gZmluZCByZ2IoKSwgcmdiYSgpLCAjIChoZXhhZGVjaW1hbCksIGFuZCBuYW1lZCBjb2xvciB2YWx1ZXMgbGlrZSByZWQsIGJsdWUsIHB1cnBsZSwgZXRjLlxuXG5cdFx0Zm9yIChwIGluIF9jb2xvckxvb2t1cCkge1xuXHRcdFx0X2NvbG9yRXhwICs9IFwifFwiICsgcCArIFwiXFxcXGJcIjtcblx0XHR9XG5cdFx0X2NvbG9yRXhwID0gbmV3IFJlZ0V4cChfY29sb3JFeHArXCIpXCIsIFwiZ2lcIik7XG5cblx0XHRDU1NQbHVnaW4uY29sb3JTdHJpbmdGaWx0ZXIgPSBmdW5jdGlvbihhKSB7XG5cdFx0XHR2YXIgY29tYmluZWQgPSBhWzBdICsgYVsxXSxcblx0XHRcdFx0dG9IU0w7XG5cdFx0XHRfY29sb3JFeHAubGFzdEluZGV4ID0gMDtcblx0XHRcdGlmIChfY29sb3JFeHAudGVzdChjb21iaW5lZCkpIHtcblx0XHRcdFx0dG9IU0wgPSAoY29tYmluZWQuaW5kZXhPZihcImhzbChcIikgIT09IC0xIHx8IGNvbWJpbmVkLmluZGV4T2YoXCJoc2xhKFwiKSAhPT0gLTEpO1xuXHRcdFx0XHRhWzBdID0gX2Zvcm1hdENvbG9ycyhhWzBdLCB0b0hTTCk7XG5cdFx0XHRcdGFbMV0gPSBfZm9ybWF0Q29sb3JzKGFbMV0sIHRvSFNMKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aWYgKCFUd2VlbkxpdGUuZGVmYXVsdFN0cmluZ0ZpbHRlcikge1xuXHRcdFx0VHdlZW5MaXRlLmRlZmF1bHRTdHJpbmdGaWx0ZXIgPSBDU1NQbHVnaW4uY29sb3JTdHJpbmdGaWx0ZXI7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQHByaXZhdGUgUmV0dXJucyBhIGZvcm1hdHRlciBmdW5jdGlvbiB0aGF0IGhhbmRsZXMgdGFraW5nIGEgc3RyaW5nIChvciBudW1iZXIgaW4gc29tZSBjYXNlcykgYW5kIHJldHVybmluZyBhIGNvbnNpc3RlbnRseSBmb3JtYXR0ZWQgb25lIGluIHRlcm1zIG9mIGRlbGltaXRlcnMsIHF1YW50aXR5IG9mIHZhbHVlcywgZXRjLiBGb3IgZXhhbXBsZSwgd2UgbWF5IGdldCBib3hTaGFkb3cgdmFsdWVzIGRlZmluZWQgYXMgXCIwcHggcmVkXCIgb3IgXCIwcHggMHB4IDEwcHggcmdiKDI1NSwwLDApXCIgb3IgXCIwcHggMHB4IDIwcHggMjBweCAjRjAwXCIgYW5kIHdlIG5lZWQgdG8gZW5zdXJlIHRoYXQgd2hhdCB3ZSBnZXQgYmFjayBpcyBkZXNjcmliZWQgd2l0aCA0IG51bWJlcnMgYW5kIGEgY29sb3IuIFRoaXMgYWxsb3dzIHVzIHRvIGZlZWQgaXQgaW50byB0aGUgX3BhcnNlQ29tcGxleCgpIG1ldGhvZCBhbmQgc3BsaXQgdGhlIHZhbHVlcyB1cCBhcHByb3ByaWF0ZWx5LiBUaGUgbmVhdCB0aGluZyBhYm91dCB0aGlzIF9nZXRGb3JtYXR0ZXIoKSBmdW5jdGlvbiBpcyB0aGF0IHRoZSBkZmx0IGRlZmluZXMgYSBwYXR0ZXJuIGFzIHdlbGwgYXMgYSBkZWZhdWx0LCBzbyBmb3IgZXhhbXBsZSwgX2dldEZvcm1hdHRlcihcIjBweCAwcHggMHB4IDBweCAjNzc3XCIsIHRydWUpIG5vdCBvbmx5IHNldHMgdGhlIGRlZmF1bHQgYXMgMHB4IGZvciBhbGwgZGlzdGFuY2VzIGFuZCAjNzc3IGZvciB0aGUgY29sb3IsIGJ1dCBhbHNvIHNldHMgdGhlIHBhdHRlcm4gc3VjaCB0aGF0IDQgbnVtYmVycyBhbmQgYSBjb2xvciB3aWxsIGFsd2F5cyBnZXQgcmV0dXJuZWQuXG5cdFx0ICogQHBhcmFtIHshc3RyaW5nfSBkZmx0IFRoZSBkZWZhdWx0IHZhbHVlIGFuZCBwYXR0ZXJuIHRvIGZvbGxvdy4gU28gXCIwcHggMHB4IDBweCAwcHggIzc3N1wiIHdpbGwgZW5zdXJlIHRoYXQgNCBudW1iZXJzIGFuZCBhIGNvbG9yIHdpbGwgYWx3YXlzIGdldCByZXR1cm5lZC5cblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBjbHIgSWYgdHJ1ZSwgdGhlIHZhbHVlcyBzaG91bGQgYmUgc2VhcmNoZWQgZm9yIGNvbG9yLXJlbGF0ZWQgZGF0YS4gRm9yIGV4YW1wbGUsIGJveFNoYWRvdyB2YWx1ZXMgdHlwaWNhbGx5IGNvbnRhaW4gYSBjb2xvciB3aGVyZWFzIGJvcmRlclJhZGl1cyBkb24ndC5cblx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBjb2xsYXBzaWJsZSBJZiB0cnVlLCB0aGUgdmFsdWUgaXMgYSB0b3AvbGVmdC9yaWdodC9ib3R0b20gc3R5bGUgb25lIHRoYXQgYWN0cyBsaWtlIG1hcmdpbiBvciBwYWRkaW5nLCB3aGVyZSBpZiBvbmx5IG9uZSB2YWx1ZSBpcyByZWNlaXZlZCwgaXQncyB1c2VkIGZvciBhbGwgNDsgaWYgMiBhcmUgcmVjZWl2ZWQsIHRoZSBmaXJzdCBpcyBkdXBsaWNhdGVkIGZvciAzcmQgKGJvdHRvbSkgYW5kIHRoZSAybmQgaXMgZHVwbGljYXRlZCBmb3IgdGhlIDR0aCBzcG90IChsZWZ0KSwgZXRjLlxuXHRcdCAqIEByZXR1cm4ge0Z1bmN0aW9ufSBmb3JtYXR0ZXIgZnVuY3Rpb25cblx0XHQgKi9cblx0XHR2YXIgX2dldEZvcm1hdHRlciA9IGZ1bmN0aW9uKGRmbHQsIGNsciwgY29sbGFwc2libGUsIG11bHRpKSB7XG5cdFx0XHRcdGlmIChkZmx0ID09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odikge3JldHVybiB2O307XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIGRDb2xvciA9IGNsciA/IChkZmx0Lm1hdGNoKF9jb2xvckV4cCkgfHwgW1wiXCJdKVswXSA6IFwiXCIsXG5cdFx0XHRcdFx0ZFZhbHMgPSBkZmx0LnNwbGl0KGRDb2xvcikuam9pbihcIlwiKS5tYXRjaChfdmFsdWVzRXhwKSB8fCBbXSxcblx0XHRcdFx0XHRwZnggPSBkZmx0LnN1YnN0cigwLCBkZmx0LmluZGV4T2YoZFZhbHNbMF0pKSxcblx0XHRcdFx0XHRzZnggPSAoZGZsdC5jaGFyQXQoZGZsdC5sZW5ndGggLSAxKSA9PT0gXCIpXCIpID8gXCIpXCIgOiBcIlwiLFxuXHRcdFx0XHRcdGRlbGltID0gKGRmbHQuaW5kZXhPZihcIiBcIikgIT09IC0xKSA/IFwiIFwiIDogXCIsXCIsXG5cdFx0XHRcdFx0bnVtVmFscyA9IGRWYWxzLmxlbmd0aCxcblx0XHRcdFx0XHRkU2Z4ID0gKG51bVZhbHMgPiAwKSA/IGRWYWxzWzBdLnJlcGxhY2UoX251bUV4cCwgXCJcIikgOiBcIlwiLFxuXHRcdFx0XHRcdGZvcm1hdHRlcjtcblx0XHRcdFx0aWYgKCFudW1WYWxzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHYpIHtyZXR1cm4gdjt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjbHIpIHtcblx0XHRcdFx0XHRmb3JtYXR0ZXIgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3IsIHZhbHMsIGksIGE7XG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mKHYpID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0XHRcdHYgKz0gZFNmeDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobXVsdGkgJiYgX2NvbW1hc091dHNpZGVQYXJlbkV4cC50ZXN0KHYpKSB7XG5cdFx0XHRcdFx0XHRcdGEgPSB2LnJlcGxhY2UoX2NvbW1hc091dHNpZGVQYXJlbkV4cCwgXCJ8XCIpLnNwbGl0KFwifFwiKTtcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRhW2ldID0gZm9ybWF0dGVyKGFbaV0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhLmpvaW4oXCIsXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29sb3IgPSAodi5tYXRjaChfY29sb3JFeHApIHx8IFtkQ29sb3JdKVswXTtcblx0XHRcdFx0XHRcdHZhbHMgPSB2LnNwbGl0KGNvbG9yKS5qb2luKFwiXCIpLm1hdGNoKF92YWx1ZXNFeHApIHx8IFtdO1xuXHRcdFx0XHRcdFx0aSA9IHZhbHMubGVuZ3RoO1xuXHRcdFx0XHRcdFx0aWYgKG51bVZhbHMgPiBpLS0pIHtcblx0XHRcdFx0XHRcdFx0d2hpbGUgKCsraSA8IG51bVZhbHMpIHtcblx0XHRcdFx0XHRcdFx0XHR2YWxzW2ldID0gY29sbGFwc2libGUgPyB2YWxzWygoKGkgLSAxKSAvIDIpIHwgMCldIDogZFZhbHNbaV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBwZnggKyB2YWxzLmpvaW4oZGVsaW0pICsgZGVsaW0gKyBjb2xvciArIHNmeCArICh2LmluZGV4T2YoXCJpbnNldFwiKSAhPT0gLTEgPyBcIiBpbnNldFwiIDogXCJcIik7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVyO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9ybWF0dGVyID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdHZhciB2YWxzLCBhLCBpO1xuXHRcdFx0XHRcdGlmICh0eXBlb2YodikgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHRcdHYgKz0gZFNmeDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG11bHRpICYmIF9jb21tYXNPdXRzaWRlUGFyZW5FeHAudGVzdCh2KSkge1xuXHRcdFx0XHRcdFx0YSA9IHYucmVwbGFjZShfY29tbWFzT3V0c2lkZVBhcmVuRXhwLCBcInxcIikuc3BsaXQoXCJ8XCIpO1xuXHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0YVtpXSA9IGZvcm1hdHRlcihhW2ldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBhLmpvaW4oXCIsXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YWxzID0gdi5tYXRjaChfdmFsdWVzRXhwKSB8fCBbXTtcblx0XHRcdFx0XHRpID0gdmFscy5sZW5ndGg7XG5cdFx0XHRcdFx0aWYgKG51bVZhbHMgPiBpLS0pIHtcblx0XHRcdFx0XHRcdHdoaWxlICgrK2kgPCBudW1WYWxzKSB7XG5cdFx0XHRcdFx0XHRcdHZhbHNbaV0gPSBjb2xsYXBzaWJsZSA/IHZhbHNbKCgoaSAtIDEpIC8gMikgfCAwKV0gOiBkVmFsc1tpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHBmeCArIHZhbHMuam9pbihkZWxpbSkgKyBzZng7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJldHVybiBmb3JtYXR0ZXI7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIHJldHVybnMgYSBmb3JtYXR0ZXIgZnVuY3Rpb24gdGhhdCdzIHVzZWQgZm9yIGVkZ2UtcmVsYXRlZCB2YWx1ZXMgbGlrZSBtYXJnaW5Ub3AsIG1hcmdpbkxlZnQsIHBhZGRpbmdCb3R0b20sIHBhZGRpbmdSaWdodCwgZXRjLiBKdXN0IHBhc3MgYSBjb21tYS1kZWxpbWl0ZWQgbGlzdCBvZiBwcm9wZXJ0eSBuYW1lcyByZWxhdGVkIHRvIHRoZSBlZGdlcy5cblx0XHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gcHJvcHMgYSBjb21tYS1kZWxpbWl0ZWQgbGlzdCBvZiBwcm9wZXJ0eSBuYW1lcyBpbiBvcmRlciBmcm9tIHRvcCB0byBsZWZ0LCBsaWtlIFwibWFyZ2luVG9wLG1hcmdpblJpZ2h0LG1hcmdpbkJvdHRvbSxtYXJnaW5MZWZ0XCJcblx0XHRcdCAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIGZvcm1hdHRlciBmdW5jdGlvblxuXHRcdFx0ICovXG5cdFx0XHRfZ2V0RWRnZVBhcnNlciA9IGZ1bmN0aW9uKHByb3BzKSB7XG5cdFx0XHRcdHByb3BzID0gcHJvcHMuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbiwgdmFycykge1xuXHRcdFx0XHRcdHZhciBhID0gKGUgKyBcIlwiKS5zcGxpdChcIiBcIiksXG5cdFx0XHRcdFx0XHRpO1xuXHRcdFx0XHRcdHZhcnMgPSB7fTtcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgNDsgaSsrKSB7XG5cdFx0XHRcdFx0XHR2YXJzW3Byb3BzW2ldXSA9IGFbaV0gPSBhW2ldIHx8IGFbKCgoaSAtIDEpIC8gMikgPj4gMCldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gY3NzcC5wYXJzZSh0LCB2YXJzLCBwdCwgcGx1Z2luKTtcblx0XHRcdFx0fTtcblx0XHRcdH0sXG5cblx0XHRcdC8vIEBwcml2YXRlIHVzZWQgd2hlbiBvdGhlciBwbHVnaW5zIG11c3QgdHdlZW4gdmFsdWVzIGZpcnN0LCBsaWtlIEJlemllclBsdWdpbiBvciBUaHJvd1Byb3BzUGx1Z2luLCBldGMuIFRoYXQgcGx1Z2luJ3Mgc2V0UmF0aW8oKSBnZXRzIGNhbGxlZCBmaXJzdCBzbyB0aGF0IHRoZSB2YWx1ZXMgYXJlIHVwZGF0ZWQsIGFuZCB0aGVuIHdlIGxvb3AgdGhyb3VnaCB0aGUgTWluaVByb3BUd2VlbnMgIHdoaWNoIGhhbmRsZSBjb3B5aW5nIHRoZSB2YWx1ZXMgaW50byB0aGVpciBhcHByb3ByaWF0ZSBzbG90cyBzbyB0aGF0IHRoZXkgY2FuIHRoZW4gYmUgYXBwbGllZCBjb3JyZWN0bHkgaW4gdGhlIG1haW4gQ1NTUGx1Z2luIHNldFJhdGlvKCkgbWV0aG9kLiBSZW1lbWJlciwgd2UgdHlwaWNhbGx5IGNyZWF0ZSBhIHByb3h5IG9iamVjdCB0aGF0IGhhcyBhIGJ1bmNoIG9mIHVuaXF1ZWx5LW5hbWVkIHByb3BlcnRpZXMgdGhhdCB3ZSBmZWVkIHRvIHRoZSBzdWItcGx1Z2luIGFuZCBpdCBkb2VzIGl0cyBtYWdpYyBub3JtYWxseSwgYW5kIHRoZW4gd2UgbXVzdCBpbnRlcnByZXQgdGhvc2UgdmFsdWVzIGFuZCBhcHBseSB0aGVtIHRvIHRoZSBjc3MgYmVjYXVzZSBvZnRlbiBudW1iZXJzIG11c3QgZ2V0IGNvbWJpbmVkL2NvbmNhdGVuYXRlZCwgc3VmZml4ZXMgYWRkZWQsIGV0Yy4gdG8gd29yayB3aXRoIGNzcywgbGlrZSBib3hTaGFkb3cgY291bGQgaGF2ZSA0IHZhbHVlcyBwbHVzIGEgY29sb3IuXG5cdFx0XHRfc2V0UGx1Z2luUmF0aW8gPSBfaW50ZXJuYWxzLl9zZXRQbHVnaW5SYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0UmF0aW8odik7XG5cdFx0XHRcdHZhciBkID0gdGhpcy5kYXRhLFxuXHRcdFx0XHRcdHByb3h5ID0gZC5wcm94eSxcblx0XHRcdFx0XHRtcHQgPSBkLmZpcnN0TVBULFxuXHRcdFx0XHRcdG1pbiA9IDAuMDAwMDAxLFxuXHRcdFx0XHRcdHZhbCwgcHQsIGksIHN0ciwgcDtcblx0XHRcdFx0d2hpbGUgKG1wdCkge1xuXHRcdFx0XHRcdHZhbCA9IHByb3h5W21wdC52XTtcblx0XHRcdFx0XHRpZiAobXB0LnIpIHtcblx0XHRcdFx0XHRcdHZhbCA9IE1hdGgucm91bmQodmFsKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHZhbCA8IG1pbiAmJiB2YWwgPiAtbWluKSB7XG5cdFx0XHRcdFx0XHR2YWwgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRtcHQudFttcHQucF0gPSB2YWw7XG5cdFx0XHRcdFx0bXB0ID0gbXB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkLmF1dG9Sb3RhdGUpIHtcblx0XHRcdFx0XHRkLmF1dG9Sb3RhdGUucm90YXRpb24gPSBwcm94eS5yb3RhdGlvbjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL2F0IHRoZSBlbmQsIHdlIG11c3Qgc2V0IHRoZSBDU1NQcm9wVHdlZW4ncyBcImVcIiAoZW5kKSB2YWx1ZSBkeW5hbWljYWxseSBoZXJlIGJlY2F1c2UgdGhhdCdzIHdoYXQgaXMgdXNlZCBpbiB0aGUgZmluYWwgc2V0UmF0aW8oKSBtZXRob2QuIFNhbWUgZm9yIFwiYlwiIGF0IHRoZSBiZWdpbm5pbmcuXG5cdFx0XHRcdGlmICh2ID09PSAxIHx8IHYgPT09IDApIHtcblx0XHRcdFx0XHRtcHQgPSBkLmZpcnN0TVBUO1xuXHRcdFx0XHRcdHAgPSAodiA9PT0gMSkgPyBcImVcIiA6IFwiYlwiO1xuXHRcdFx0XHRcdHdoaWxlIChtcHQpIHtcblx0XHRcdFx0XHRcdHB0ID0gbXB0LnQ7XG5cdFx0XHRcdFx0XHRpZiAoIXB0LnR5cGUpIHtcblx0XHRcdFx0XHRcdFx0cHRbcF0gPSBwdC5zICsgcHQueHMwO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChwdC50eXBlID09PSAxKSB7XG5cdFx0XHRcdFx0XHRcdHN0ciA9IHB0LnhzMCArIHB0LnMgKyBwdC54czE7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDE7IGkgPCBwdC5sOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRzdHIgKz0gcHRbXCJ4blwiK2ldICsgcHRbXCJ4c1wiKyhpKzEpXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRwdFtwXSA9IHN0cjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1wdCA9IG1wdC5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgQGNvbnN0cnVjdG9yIFVzZWQgYnkgYSBmZXcgU3BlY2lhbFByb3BzIHRvIGhvbGQgaW1wb3J0YW50IHZhbHVlcyBmb3IgcHJveGllcy4gRm9yIGV4YW1wbGUsIF9wYXJzZVRvUHJveHkoKSBjcmVhdGVzIGEgTWluaVByb3BUd2VlbiBpbnN0YW5jZSBmb3IgZWFjaCBwcm9wZXJ0eSB0aGF0IG11c3QgZ2V0IHR3ZWVuZWQgb24gdGhlIHByb3h5LCBhbmQgd2UgcmVjb3JkIHRoZSBvcmlnaW5hbCBwcm9wZXJ0eSBuYW1lIGFzIHdlbGwgYXMgdGhlIHVuaXF1ZSBvbmUgd2UgY3JlYXRlIGZvciB0aGUgcHJveHksIHBsdXMgd2hldGhlciBvciBub3QgdGhlIHZhbHVlIG5lZWRzIHRvIGJlIHJvdW5kZWQgcGx1cyB0aGUgb3JpZ2luYWwgdmFsdWUuXG5cdFx0XHQgKiBAcGFyYW0geyFPYmplY3R9IHQgdGFyZ2V0IG9iamVjdCB3aG9zZSBwcm9wZXJ0eSB3ZSdyZSB0d2VlbmluZyAob2Z0ZW4gYSBDU1NQcm9wVHdlZW4pXG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IHAgcHJvcGVydHkgbmFtZVxuXHRcdFx0ICogQHBhcmFtIHsobnVtYmVyfHN0cmluZ3xvYmplY3QpfSB2IHZhbHVlXG5cdFx0XHQgKiBAcGFyYW0ge01pbmlQcm9wVHdlZW49fSBuZXh0IG5leHQgTWluaVByb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3Rcblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHIgaWYgdHJ1ZSwgdGhlIHR3ZWVuZWQgdmFsdWUgc2hvdWxkIGJlIHJvdW5kZWQgdG8gdGhlIG5lYXJlc3QgaW50ZWdlclxuXHRcdFx0ICovXG5cdFx0XHRNaW5pUHJvcFR3ZWVuID0gZnVuY3Rpb24odCwgcCwgdiwgbmV4dCwgcikge1xuXHRcdFx0XHR0aGlzLnQgPSB0O1xuXHRcdFx0XHR0aGlzLnAgPSBwO1xuXHRcdFx0XHR0aGlzLnYgPSB2O1xuXHRcdFx0XHR0aGlzLnIgPSByO1xuXHRcdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRcdG5leHQuX3ByZXYgPSB0aGlzO1xuXHRcdFx0XHRcdHRoaXMuX25leHQgPSBuZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIE1vc3Qgb3RoZXIgcGx1Z2lucyAobGlrZSBCZXppZXJQbHVnaW4gYW5kIFRocm93UHJvcHNQbHVnaW4gYW5kIG90aGVycykgY2FuIG9ubHkgdHdlZW4gbnVtZXJpYyB2YWx1ZXMsIGJ1dCBDU1NQbHVnaW4gbXVzdCBhY2NvbW1vZGF0ZSBzcGVjaWFsIHZhbHVlcyB0aGF0IGhhdmUgYSBidW5jaCBvZiBleHRyYSBkYXRhIChsaWtlIGEgc3VmZml4IG9yIHN0cmluZ3MgYmV0d2VlbiBudW1lcmljIHZhbHVlcywgZXRjLikuIEZvciBleGFtcGxlLCBib3hTaGFkb3cgaGFzIHZhbHVlcyBsaWtlIFwiMTBweCAxMHB4IDIwcHggMzBweCByZ2IoMjU1LDAsMClcIiB3aGljaCB3b3VsZCB1dHRlcmx5IGNvbmZ1c2Ugb3RoZXIgcGx1Z2lucy4gVGhpcyBtZXRob2QgYWxsb3dzIHVzIHRvIHNwbGl0IHRoYXQgZGF0YSBhcGFydCBhbmQgZ3JhYiBvbmx5IHRoZSBudW1lcmljIGRhdGEgYW5kIGF0dGFjaCBpdCB0byB1bmlxdWVseS1uYW1lZCBwcm9wZXJ0aWVzIG9mIGEgZ2VuZXJpYyBwcm94eSBvYmplY3QgKHt9KSBzbyB0aGF0IHdlIGNhbiBmZWVkIHRoYXQgdG8gdmlydHVhbGx5IGFueSBwbHVnaW4gdG8gaGF2ZSB0aGUgbnVtYmVycyB0d2VlbmVkLiBIb3dldmVyLCB3ZSBtdXN0IGFsc28ga2VlcCB0cmFjayBvZiB3aGljaCBwcm9wZXJ0aWVzIGZyb20gdGhlIHByb3h5IGdvIHdpdGggd2hpY2ggQ1NTUHJvcFR3ZWVuIHZhbHVlcyBhbmQgaW5zdGFuY2VzLiBTbyB3ZSBjcmVhdGUgYSBsaW5rZWQgbGlzdCBvZiBNaW5pUHJvcFR3ZWVucy4gRWFjaCBvbmUgcmVjb3JkcyBhIHRhcmdldCAodGhlIG9yaWdpbmFsIENTU1Byb3BUd2VlbiksIHByb3BlcnR5IChsaWtlIFwic1wiIG9yIFwieG4xXCIgb3IgXCJ4bjJcIikgdGhhdCB3ZSdyZSB0d2VlbmluZyBhbmQgdGhlIHVuaXF1ZSBwcm9wZXJ0eSBuYW1lIHRoYXQgd2FzIHVzZWQgZm9yIHRoZSBwcm94eSAobGlrZSBcImJveFNoYWRvd194bjFcIiBhbmQgXCJib3hTaGFkb3dfeG4yXCIpIGFuZCB3aGV0aGVyIG9yIG5vdCB0aGV5IG5lZWQgdG8gYmUgcm91bmRlZC4gVGhhdCB3YXksIGluIHRoZSBfc2V0UGx1Z2luUmF0aW8oKSBtZXRob2Qgd2UgY2FuIHNpbXBseSBjb3B5IHRoZSB2YWx1ZXMgb3ZlciBmcm9tIHRoZSBwcm94eSB0byB0aGUgQ1NTUHJvcFR3ZWVuIGluc3RhbmNlKHMpLiBUaGVuLCB3aGVuIHRoZSBtYWluIENTU1BsdWdpbiBzZXRSYXRpbygpIG1ldGhvZCBydW5zIGFuZCBhcHBsaWVzIHRoZSBDU1NQcm9wVHdlZW4gdmFsdWVzIGFjY29yZGluZ2x5LCB0aGV5J3JlIHVwZGF0ZWQgbmljZWx5LiBTbyB0aGUgZXh0ZXJuYWwgcGx1Z2luIHR3ZWVucyB0aGUgbnVtYmVycywgX3NldFBsdWdpblJhdGlvKCkgY29waWVzIHRoZW0gb3ZlciwgYW5kIHNldFJhdGlvKCkgYWN0cyBub3JtYWxseSwgYXBwbHlpbmcgY3NzLXNwZWNpZmljIHZhbHVlcyB0byB0aGUgZWxlbWVudC5cblx0XHRcdCAqIFRoaXMgbWV0aG9kIHJldHVybnMgYW4gb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcblx0XHRcdCAqICAtIHByb3h5OiBhIGdlbmVyaWMgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHN0YXJ0aW5nIHZhbHVlcyBmb3IgYWxsIHRoZSBwcm9wZXJ0aWVzIHRoYXQgd2lsbCBiZSB0d2VlbmVkIGJ5IHRoZSBleHRlcm5hbCBwbHVnaW4uICBUaGlzIGlzIHdoYXQgd2UgZmVlZCB0byB0aGUgZXh0ZXJuYWwgX29uSW5pdFR3ZWVuKCkgYXMgdGhlIHRhcmdldFxuXHRcdFx0ICogIC0gZW5kOiBhIGdlbmVyaWMgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGVuZGluZyB2YWx1ZXMgZm9yIGFsbCB0aGUgcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgdHdlZW5lZCBieSB0aGUgZXh0ZXJuYWwgcGx1Z2luLiBUaGlzIGlzIHdoYXQgd2UgZmVlZCB0byB0aGUgZXh0ZXJuYWwgcGx1Z2luJ3MgX29uSW5pdFR3ZWVuKCkgYXMgdGhlIGRlc3RpbmF0aW9uIHZhbHVlc1xuXHRcdFx0ICogIC0gZmlyc3RNUFQ6IHRoZSBmaXJzdCBNaW5pUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdFxuXHRcdFx0ICogIC0gcHQ6IHRoZSBmaXJzdCBDU1NQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0IHRoYXQgd2FzIGNyZWF0ZWQgd2hlbiBwYXJzaW5nLiBJZiBzaGFsbG93IGlzIHRydWUsIHRoaXMgbGlua2VkIGxpc3Qgd2lsbCBOT1QgYXR0YWNoIHRvIHRoZSBvbmUgcGFzc2VkIGludG8gdGhlIF9wYXJzZVRvUHJveHkoKSBhcyB0aGUgXCJwdFwiICg0dGgpIHBhcmFtZXRlci5cblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCB0YXJnZXQgb2JqZWN0IHRvIGJlIHR3ZWVuZWRcblx0XHRcdCAqIEBwYXJhbSB7IShPYmplY3R8c3RyaW5nKX0gdmFycyB0aGUgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSB0d2VlbmluZyB2YWx1ZXMgKHR5cGljYWxseSB0aGUgZW5kL2Rlc3RpbmF0aW9uIHZhbHVlcykgdGhhdCBzaG91bGQgYmUgcGFyc2VkXG5cdFx0XHQgKiBAcGFyYW0geyFDU1NQbHVnaW59IGNzc3AgVGhlIENTU1BsdWdpbiBpbnN0YW5jZVxuXHRcdFx0ICogQHBhcmFtIHtDU1NQcm9wVHdlZW49fSBwdCB0aGUgbmV4dCBDU1NQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0XG5cdFx0XHQgKiBAcGFyYW0ge1R3ZWVuUGx1Z2luPX0gcGx1Z2luIHRoZSBleHRlcm5hbCBUd2VlblBsdWdpbiBpbnN0YW5jZSB0aGF0IHdpbGwgYmUgaGFuZGxpbmcgdHdlZW5pbmcgdGhlIG51bWVyaWMgdmFsdWVzXG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBzaGFsbG93IGlmIHRydWUsIHRoZSByZXN1bHRpbmcgbGlua2VkIGxpc3QgZnJvbSB0aGUgcGFyc2Ugd2lsbCBOT1QgYmUgYXR0YWNoZWQgdG8gdGhlIENTU1Byb3BUd2VlbiB0aGF0IHdhcyBwYXNzZWQgaW4gYXMgdGhlIFwicHRcIiAoNHRoKSBwYXJhbWV0ZXIuXG5cdFx0XHQgKiBAcmV0dXJuIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczogcHJveHksIGVuZCwgZmlyc3RNUFQsIGFuZCBwdCAoc2VlIGFib3ZlIGZvciBkZXNjcmlwdGlvbnMpXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZVRvUHJveHkgPSBfaW50ZXJuYWxzLl9wYXJzZVRvUHJveHkgPSBmdW5jdGlvbih0LCB2YXJzLCBjc3NwLCBwdCwgcGx1Z2luLCBzaGFsbG93KSB7XG5cdFx0XHRcdHZhciBicHQgPSBwdCxcblx0XHRcdFx0XHRzdGFydCA9IHt9LFxuXHRcdFx0XHRcdGVuZCA9IHt9LFxuXHRcdFx0XHRcdHRyYW5zZm9ybSA9IGNzc3AuX3RyYW5zZm9ybSxcblx0XHRcdFx0XHRvbGRGb3JjZSA9IF9mb3JjZVBULFxuXHRcdFx0XHRcdGksIHAsIHhwLCBtcHQsIGZpcnN0UFQ7XG5cdFx0XHRcdGNzc3AuX3RyYW5zZm9ybSA9IG51bGw7XG5cdFx0XHRcdF9mb3JjZVBUID0gdmFycztcblx0XHRcdFx0cHQgPSBmaXJzdFBUID0gY3NzcC5wYXJzZSh0LCB2YXJzLCBwdCwgcGx1Z2luKTtcblx0XHRcdFx0X2ZvcmNlUFQgPSBvbGRGb3JjZTtcblx0XHRcdFx0Ly9icmVhayBvZmYgZnJvbSB0aGUgbGlua2VkIGxpc3Qgc28gdGhlIG5ldyBvbmVzIGFyZSBpc29sYXRlZC5cblx0XHRcdFx0aWYgKHNoYWxsb3cpIHtcblx0XHRcdFx0XHRjc3NwLl90cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cdFx0XHRcdFx0aWYgKGJwdCkge1xuXHRcdFx0XHRcdFx0YnB0Ll9wcmV2ID0gbnVsbDtcblx0XHRcdFx0XHRcdGlmIChicHQuX3ByZXYpIHtcblx0XHRcdFx0XHRcdFx0YnB0Ll9wcmV2Ll9uZXh0ID0gbnVsbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0d2hpbGUgKHB0ICYmIHB0ICE9PSBicHQpIHtcblx0XHRcdFx0XHRpZiAocHQudHlwZSA8PSAxKSB7XG5cdFx0XHRcdFx0XHRwID0gcHQucDtcblx0XHRcdFx0XHRcdGVuZFtwXSA9IHB0LnMgKyBwdC5jO1xuXHRcdFx0XHRcdFx0c3RhcnRbcF0gPSBwdC5zO1xuXHRcdFx0XHRcdFx0aWYgKCFzaGFsbG93KSB7XG5cdFx0XHRcdFx0XHRcdG1wdCA9IG5ldyBNaW5pUHJvcFR3ZWVuKHB0LCBcInNcIiwgcCwgbXB0LCBwdC5yKTtcblx0XHRcdFx0XHRcdFx0cHQuYyA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAocHQudHlwZSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRpID0gcHQubDtcblx0XHRcdFx0XHRcdFx0d2hpbGUgKC0taSA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHR4cCA9IFwieG5cIiArIGk7XG5cdFx0XHRcdFx0XHRcdFx0cCA9IHB0LnAgKyBcIl9cIiArIHhwO1xuXHRcdFx0XHRcdFx0XHRcdGVuZFtwXSA9IHB0LmRhdGFbeHBdO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXJ0W3BdID0gcHRbeHBdO1xuXHRcdFx0XHRcdFx0XHRcdGlmICghc2hhbGxvdykge1xuXHRcdFx0XHRcdFx0XHRcdFx0bXB0ID0gbmV3IE1pbmlQcm9wVHdlZW4ocHQsIHhwLCBwLCBtcHQsIHB0LnJ4cFt4cF0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB7cHJveHk6c3RhcnQsIGVuZDplbmQsIGZpcnN0TVBUOm1wdCwgcHQ6Zmlyc3RQVH07XG5cdFx0XHR9LFxuXG5cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAY29uc3RydWN0b3IgRWFjaCBwcm9wZXJ0eSB0aGF0IGlzIHR3ZWVuZWQgaGFzIGF0IGxlYXN0IG9uZSBDU1NQcm9wVHdlZW4gYXNzb2NpYXRlZCB3aXRoIGl0LiBUaGVzZSBpbnN0YW5jZXMgc3RvcmUgaW1wb3J0YW50IGluZm9ybWF0aW9uIGxpa2UgdGhlIHRhcmdldCwgcHJvcGVydHksIHN0YXJ0aW5nIHZhbHVlLCBhbW91bnQgb2YgY2hhbmdlLCBldGMuIFRoZXkgY2FuIGFsc28gb3B0aW9uYWxseSBoYXZlIGEgbnVtYmVyIG9mIFwiZXh0cmFcIiBzdHJpbmdzIGFuZCBudW1lcmljIHZhbHVlcyBuYW1lZCB4czEsIHhuMSwgeHMyLCB4bjIsIHhzMywgeG4zLCBldGMuIHdoZXJlIFwic1wiIGluZGljYXRlcyBzdHJpbmcgYW5kIFwiblwiIGluZGljYXRlcyBudW1iZXIuIFRoZXNlIGNhbiBiZSBwaWVjZWQgdG9nZXRoZXIgaW4gYSBjb21wbGV4LXZhbHVlIHR3ZWVuICh0eXBlOjEpIHRoYXQgaGFzIGFsdGVybmF0aW5nIHR5cGVzIG9mIGRhdGEgbGlrZSBhIHN0cmluZywgbnVtYmVyLCBzdHJpbmcsIG51bWJlciwgZXRjLiBGb3IgZXhhbXBsZSwgYm94U2hhZG93IGNvdWxkIGJlIFwiNXB4IDVweCA4cHggcmdiKDEwMiwgMTAyLCA1MSlcIi4gSW4gdGhhdCB2YWx1ZSwgdGhlcmUgYXJlIDYgbnVtYmVycyB0aGF0IG1heSBuZWVkIHRvIHR3ZWVuIGFuZCB0aGVuIHBpZWNlZCBiYWNrIHRvZ2V0aGVyIGludG8gYSBzdHJpbmcgYWdhaW4gd2l0aCBzcGFjZXMsIHN1ZmZpeGVzLCBldGMuIHhzMCBpcyBzcGVjaWFsIGluIHRoYXQgaXQgc3RvcmVzIHRoZSBzdWZmaXggZm9yIHN0YW5kYXJkICh0eXBlOjApIHR3ZWVucywgLU9SLSB0aGUgZmlyc3Qgc3RyaW5nIChwcmVmaXgpIGluIGEgY29tcGxleC12YWx1ZSAodHlwZToxKSBDU1NQcm9wVHdlZW4gLU9SLSBpdCBjYW4gYmUgdGhlIG5vbi10d2VlbmluZyB2YWx1ZSBpbiBhIHR5cGU6LTEgQ1NTUHJvcFR3ZWVuLiBXZSBkbyB0aGlzIHRvIGNvbnNlcnZlIG1lbW9yeS5cblx0XHRcdCAqIENTU1Byb3BUd2VlbnMgaGF2ZSB0aGUgZm9sbG93aW5nIG9wdGlvbmFsIHByb3BlcnRpZXMgYXMgd2VsbCAobm90IGRlZmluZWQgdGhyb3VnaCB0aGUgY29uc3RydWN0b3IpOlxuXHRcdFx0ICogIC0gbDogTGVuZ3RoIGluIHRlcm1zIG9mIHRoZSBudW1iZXIgb2YgZXh0cmEgcHJvcGVydGllcyB0aGF0IHRoZSBDU1NQcm9wVHdlZW4gaGFzIChkZWZhdWx0OiAwKS4gRm9yIGV4YW1wbGUsIGZvciBhIGJveFNoYWRvdyB3ZSBtYXkgbmVlZCB0byB0d2VlbiA1IG51bWJlcnMgaW4gd2hpY2ggY2FzZSBsIHdvdWxkIGJlIDU7IEtlZXAgaW4gbWluZCB0aGF0IHRoZSBzdGFydC9lbmQgdmFsdWVzIGZvciB0aGUgZmlyc3QgbnVtYmVyIHRoYXQncyB0d2VlbmVkIGFyZSBhbHdheXMgc3RvcmVkIGluIHRoZSBzIGFuZCBjIHByb3BlcnRpZXMgdG8gY29uc2VydmUgbWVtb3J5LiBBbGwgYWRkaXRpb25hbCB2YWx1ZXMgdGhlcmVhZnRlciBhcmUgc3RvcmVkIGluIHhuMSwgeG4yLCBldGMuXG5cdFx0XHQgKiAgLSB4Zmlyc3Q6IFRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhbnkgc3ViLUNTU1Byb3BUd2VlbnMgdGhhdCBhcmUgdHdlZW5pbmcgcHJvcGVydGllcyBvZiB0aGlzIGluc3RhbmNlLiBGb3IgZXhhbXBsZSwgd2UgbWF5IHNwbGl0IHVwIGEgYm94U2hhZG93IHR3ZWVuIHNvIHRoYXQgdGhlcmUncyBhIG1haW4gQ1NTUHJvcFR3ZWVuIG9mIHR5cGU6MSB0aGF0IGhhcyB2YXJpb3VzIHhzKiBhbmQgeG4qIHZhbHVlcyBhc3NvY2lhdGVkIHdpdGggdGhlIGgtc2hhZG93LCB2LXNoYWRvdywgYmx1ciwgY29sb3IsIGV0Yy4gVGhlbiB3ZSBzcGF3biBhIENTU1Byb3BUd2VlbiBmb3IgZWFjaCBvZiB0aG9zZSB0aGF0IGhhcyBhIGhpZ2hlciBwcmlvcml0eSBhbmQgcnVucyBCRUZPUkUgdGhlIG1haW4gQ1NTUHJvcFR3ZWVuIHNvIHRoYXQgdGhlIHZhbHVlcyBhcmUgYWxsIHNldCBieSB0aGUgdGltZSBpdCBuZWVkcyB0byByZS1hc3NlbWJsZSB0aGVtLiBUaGUgeGZpcnN0IGdpdmVzIHVzIGFuIGVhc3kgd2F5IHRvIGlkZW50aWZ5IHRoZSBmaXJzdCBvbmUgaW4gdGhhdCBjaGFpbiB3aGljaCB0eXBpY2FsbHkgZW5kcyBhdCB0aGUgbWFpbiBvbmUgKGJlY2F1c2UgdGhleSdyZSBhbGwgcHJlcGVuZGUgdG8gdGhlIGxpbmtlZCBsaXN0KVxuXHRcdFx0ICogIC0gcGx1Z2luOiBUaGUgVHdlZW5QbHVnaW4gaW5zdGFuY2UgdGhhdCB3aWxsIGhhbmRsZSB0aGUgdHdlZW5pbmcgb2YgYW55IGNvbXBsZXggdmFsdWVzLiBGb3IgZXhhbXBsZSwgc29tZXRpbWVzIHdlIGRvbid0IHdhbnQgdG8gdXNlIG5vcm1hbCBzdWJ0d2VlbnMgKGxpa2UgeGZpcnN0IHJlZmVycyB0bykgdG8gdHdlZW4gdGhlIHZhbHVlcyAtIHdlIG1pZ2h0IHdhbnQgVGhyb3dQcm9wc1BsdWdpbiBvciBCZXppZXJQbHVnaW4gc29tZSBvdGhlciBwbHVnaW4gdG8gZG8gdGhlIGFjdHVhbCB0d2VlbmluZywgc28gd2UgY3JlYXRlIGEgcGx1Z2luIGluc3RhbmNlIGFuZCBzdG9yZSBhIHJlZmVyZW5jZSBoZXJlLiBXZSBuZWVkIHRoaXMgcmVmZXJlbmNlIHNvIHRoYXQgaWYgd2UgZ2V0IGEgcmVxdWVzdCB0byByb3VuZCB2YWx1ZXMgb3IgZGlzYWJsZSBhIHR3ZWVuLCB3ZSBjYW4gcGFzcyBhbG9uZyB0aGF0IHJlcXVlc3QuXG5cdFx0XHQgKiAgLSBkYXRhOiBBcmJpdHJhcnkgZGF0YSB0aGF0IG5lZWRzIHRvIGJlIHN0b3JlZCB3aXRoIHRoZSBDU1NQcm9wVHdlZW4uIFR5cGljYWxseSBpZiB3ZSdyZSBnb2luZyB0byBoYXZlIGEgcGx1Z2luIGhhbmRsZSB0aGUgdHdlZW5pbmcgb2YgYSBjb21wbGV4LXZhbHVlIHR3ZWVuLCB3ZSBjcmVhdGUgYSBnZW5lcmljIG9iamVjdCB0aGF0IHN0b3JlcyB0aGUgRU5EIHZhbHVlcyB0aGF0IHdlJ3JlIHR3ZWVuaW5nIHRvIGFuZCB0aGUgQ1NTUHJvcFR3ZWVuJ3MgeHMxLCB4czIsIGV0Yy4gaGF2ZSB0aGUgc3RhcnRpbmcgdmFsdWVzLiBXZSBzdG9yZSB0aGF0IG9iamVjdCBhcyBkYXRhLiBUaGF0IHdheSwgd2UgY2FuIHNpbXBseSBwYXNzIHRoYXQgb2JqZWN0IHRvIHRoZSBwbHVnaW4gYW5kIHVzZSB0aGUgQ1NTUHJvcFR3ZWVuIGFzIHRoZSB0YXJnZXQuXG5cdFx0XHQgKiAgLSBzZXRSYXRpbzogT25seSB1c2VkIGZvciB0eXBlOjIgdHdlZW5zIHRoYXQgcmVxdWlyZSBjdXN0b20gZnVuY3Rpb25hbGl0eS4gSW4gdGhpcyBjYXNlLCB3ZSBjYWxsIHRoZSBDU1NQcm9wVHdlZW4ncyBzZXRSYXRpbygpIG1ldGhvZCBhbmQgcGFzcyB0aGUgcmF0aW8gZWFjaCB0aW1lIHRoZSB0d2VlbiB1cGRhdGVzLiBUaGlzIGlzbid0IHF1aXRlIGFzIGVmZmljaWVudCBhcyBkb2luZyB0aGluZ3MgZGlyZWN0bHkgaW4gdGhlIENTU1BsdWdpbidzIHNldFJhdGlvKCkgbWV0aG9kLCBidXQgaXQncyB2ZXJ5IGNvbnZlbmllbnQgYW5kIGZsZXhpYmxlLlxuXHRcdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCBvYmplY3Qgd2hvc2UgcHJvcGVydHkgd2lsbCBiZSB0d2VlbmVkLiBPZnRlbiBhIERPTSBlbGVtZW50LCBidXQgbm90IGFsd2F5cy4gSXQgY291bGQgYmUgYW55dGhpbmcuXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gcCBQcm9wZXJ0eSB0byB0d2VlbiAobmFtZSkuIEZvciBleGFtcGxlLCB0byB0d2VlbiBlbGVtZW50LndpZHRoLCBwIHdvdWxkIGJlIFwid2lkdGhcIi5cblx0XHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBzIFN0YXJ0aW5nIG51bWVyaWMgdmFsdWVcblx0XHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBjIENoYW5nZSBpbiBudW1lcmljIHZhbHVlIG92ZXIgdGhlIGNvdXJzZSBvZiB0aGUgZW50aXJlIHR3ZWVuLiBGb3IgZXhhbXBsZSwgaWYgZWxlbWVudC53aWR0aCBzdGFydHMgYXQgNSBhbmQgc2hvdWxkIGVuZCBhdCAxMDAsIGMgd291bGQgYmUgOTUuXG5cdFx0XHQgKiBAcGFyYW0ge0NTU1Byb3BUd2Vlbj19IG5leHQgVGhlIG5leHQgQ1NTUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdC4gSWYgb25lIGlzIGRlZmluZWQsIHdlIHdpbGwgZGVmaW5lIGl0cyBfcHJldiBhcyB0aGUgbmV3IGluc3RhbmNlLCBhbmQgdGhlIG5ldyBpbnN0YW5jZSdzIF9uZXh0IHdpbGwgYmUgcG9pbnRlZCBhdCBpdC5cblx0XHRcdCAqIEBwYXJhbSB7bnVtYmVyPX0gdHlwZSBUaGUgdHlwZSBvZiBDU1NQcm9wVHdlZW4gd2hlcmUgLTEgPSBhIG5vbi10d2VlbmluZyB2YWx1ZSwgMCA9IGEgc3RhbmRhcmQgc2ltcGxlIHR3ZWVuLCAxID0gYSBjb21wbGV4IHZhbHVlIChsaWtlIG9uZSB0aGF0IGhhcyBtdWx0aXBsZSBudW1iZXJzIGluIGEgY29tbWEtIG9yIHNwYWNlLWRlbGltaXRlZCBzdHJpbmcgbGlrZSBib3JkZXI6XCIxcHggc29saWQgcmVkXCIpLCBhbmQgMiA9IG9uZSB0aGF0IHVzZXMgYSBjdXN0b20gc2V0UmF0aW8gZnVuY3Rpb24gdGhhdCBkb2VzIGFsbCBvZiB0aGUgd29yayBvZiBhcHBseWluZyB0aGUgdmFsdWVzIG9uIGVhY2ggdXBkYXRlLlxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBuIE5hbWUgb2YgdGhlIHByb3BlcnR5IHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIG92ZXJ3cml0aW5nIHB1cnBvc2VzIHdoaWNoIGlzIHR5cGljYWxseSB0aGUgc2FtZSBhcyBwIGJ1dCBub3QgYWx3YXlzLiBGb3IgZXhhbXBsZSwgd2UgbWF5IG5lZWQgdG8gY3JlYXRlIGEgc3VidHdlZW4gZm9yIHRoZSAybmQgcGFydCBvZiBhIFwiY2xpcDpyZWN0KC4uLilcIiB0d2VlbiBpbiB3aGljaCBjYXNlIFwicFwiIG1pZ2h0IGJlIHhzMSBidXQgXCJuXCIgaXMgc3RpbGwgXCJjbGlwXCJcblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHIgSWYgdHJ1ZSwgdGhlIHZhbHVlKHMpIHNob3VsZCBiZSByb3VuZGVkXG5cdFx0XHQgKiBAcGFyYW0ge251bWJlcj19IHByIFByaW9yaXR5IGluIHRoZSBsaW5rZWQgbGlzdCBvcmRlci4gSGlnaGVyIHByaW9yaXR5IENTU1Byb3BUd2VlbnMgd2lsbCBiZSB1cGRhdGVkIGJlZm9yZSBsb3dlciBwcmlvcml0eSBvbmVzLiBUaGUgZGVmYXVsdCBwcmlvcml0eSBpcyAwLlxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBiIEJlZ2lubmluZyB2YWx1ZS4gV2Ugc3RvcmUgdGhpcyB0byBlbnN1cmUgdGhhdCBpdCBpcyBFWEFDVExZIHdoYXQgaXQgd2FzIHdoZW4gdGhlIHR3ZWVuIGJlZ2FuIHdpdGhvdXQgYW55IHJpc2sgb2YgaW50ZXJwcmV0YXRpb24gaXNzdWVzLlxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBlIEVuZGluZyB2YWx1ZS4gV2Ugc3RvcmUgdGhpcyB0byBlbnN1cmUgdGhhdCBpdCBpcyBFWEFDVExZIHdoYXQgdGhlIHVzZXIgZGVmaW5lZCBhdCB0aGUgZW5kIG9mIHRoZSB0d2VlbiB3aXRob3V0IGFueSByaXNrIG9mIGludGVycHJldGF0aW9uIGlzc3Vlcy5cblx0XHRcdCAqL1xuXHRcdFx0Q1NTUHJvcFR3ZWVuID0gX2ludGVybmFscy5DU1NQcm9wVHdlZW4gPSBmdW5jdGlvbih0LCBwLCBzLCBjLCBuZXh0LCB0eXBlLCBuLCByLCBwciwgYiwgZSkge1xuXHRcdFx0XHR0aGlzLnQgPSB0OyAvL3RhcmdldFxuXHRcdFx0XHR0aGlzLnAgPSBwOyAvL3Byb3BlcnR5XG5cdFx0XHRcdHRoaXMucyA9IHM7IC8vc3RhcnRpbmcgdmFsdWVcblx0XHRcdFx0dGhpcy5jID0gYzsgLy9jaGFuZ2UgdmFsdWVcblx0XHRcdFx0dGhpcy5uID0gbiB8fCBwOyAvL25hbWUgdGhhdCB0aGlzIENTU1Byb3BUd2VlbiBzaG91bGQgYmUgYXNzb2NpYXRlZCB0byAodXN1YWxseSB0aGUgc2FtZSBhcyBwLCBidXQgbm90IGFsd2F5cyAtIG4gaXMgd2hhdCBvdmVyd3JpdGluZyBsb29rcyBhdClcblx0XHRcdFx0aWYgKCEodCBpbnN0YW5jZW9mIENTU1Byb3BUd2VlbikpIHtcblx0XHRcdFx0XHRfb3ZlcndyaXRlUHJvcHMucHVzaCh0aGlzLm4pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuciA9IHI7IC8vcm91bmQgKGJvb2xlYW4pXG5cdFx0XHRcdHRoaXMudHlwZSA9IHR5cGUgfHwgMDsgLy8wID0gbm9ybWFsIHR3ZWVuLCAtMSA9IG5vbi10d2VlbmluZyAoaW4gd2hpY2ggY2FzZSB4czAgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSB0YXJnZXQncyBwcm9wZXJ0eSwgbGlrZSB0cC50W3RwLnBdID0gdHAueHMwKSwgMSA9IGNvbXBsZXgtdmFsdWUgU3BlY2lhbFByb3AsIDIgPSBjdXN0b20gc2V0UmF0aW8oKSB0aGF0IGRvZXMgYWxsIHRoZSB3b3JrXG5cdFx0XHRcdGlmIChwcikge1xuXHRcdFx0XHRcdHRoaXMucHIgPSBwcjtcblx0XHRcdFx0XHRfaGFzUHJpb3JpdHkgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuYiA9IChiID09PSB1bmRlZmluZWQpID8gcyA6IGI7XG5cdFx0XHRcdHRoaXMuZSA9IChlID09PSB1bmRlZmluZWQpID8gcyArIGMgOiBlO1xuXHRcdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRcdHRoaXMuX25leHQgPSBuZXh0O1xuXHRcdFx0XHRcdG5leHQuX3ByZXYgPSB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRfYWRkTm9uVHdlZW5pbmdOdW1lcmljUFQgPSBmdW5jdGlvbih0YXJnZXQsIHByb3AsIHN0YXJ0LCBlbmQsIG5leHQsIG92ZXJ3cml0ZVByb3ApIHsgLy9jbGVhbnMgdXAgc29tZSBjb2RlIHJlZHVuZGFuY2llcyBhbmQgaGVscHMgbWluaWZpY2F0aW9uLiBKdXN0IGEgZmFzdCB3YXkgdG8gYWRkIGEgTlVNRVJJQyBub24tdHdlZW5pbmcgQ1NTUHJvcFR3ZWVuXG5cdFx0XHRcdHZhciBwdCA9IG5ldyBDU1NQcm9wVHdlZW4odGFyZ2V0LCBwcm9wLCBzdGFydCwgZW5kIC0gc3RhcnQsIG5leHQsIC0xLCBvdmVyd3JpdGVQcm9wKTtcblx0XHRcdFx0cHQuYiA9IHN0YXJ0O1xuXHRcdFx0XHRwdC5lID0gcHQueHMwID0gZW5kO1xuXHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFRha2VzIGEgdGFyZ2V0LCB0aGUgYmVnaW5uaW5nIHZhbHVlIGFuZCBlbmRpbmcgdmFsdWUgKGFzIHN0cmluZ3MpIGFuZCBwYXJzZXMgdGhlbSBpbnRvIGEgQ1NTUHJvcFR3ZWVuIChwb3NzaWJseSB3aXRoIGNoaWxkIENTU1Byb3BUd2VlbnMpIHRoYXQgYWNjb21tb2RhdGVzIG11bHRpcGxlIG51bWJlcnMsIGNvbG9ycywgY29tbWEtZGVsaW1pdGVkIHZhbHVlcywgZXRjLiBGb3IgZXhhbXBsZTpcblx0XHRcdCAqIHNwLnBhcnNlQ29tcGxleChlbGVtZW50LCBcImJveFNoYWRvd1wiLCBcIjVweCAxMHB4IDIwcHggcmdiKDI1NSwxMDIsNTEpXCIsIFwiMHB4IDBweCAwcHggcmVkXCIsIHRydWUsIFwiMHB4IDBweCAwcHggcmdiKDAsMCwwLDApXCIsIHB0KTtcblx0XHRcdCAqIEl0IHdpbGwgd2FsayB0aHJvdWdoIHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgKHdoaWNoIHNob3VsZCBiZSBpbiB0aGUgc2FtZSBmb3JtYXQgd2l0aCB0aGUgc2FtZSBudW1iZXIgYW5kIHR5cGUgb2YgdmFsdWVzKSBhbmQgZmlndXJlIG91dCB3aGljaCBwYXJ0cyBhcmUgbnVtYmVycywgd2hhdCBzdHJpbmdzIHNlcGFyYXRlIHRoZSBudW1lcmljL3R3ZWVuYWJsZSB2YWx1ZXMsIGFuZCB0aGVuIGNyZWF0ZSB0aGUgQ1NTUHJvcFR3ZWVucyBhY2NvcmRpbmdseS4gSWYgYSBwbHVnaW4gaXMgZGVmaW5lZCwgbm8gY2hpbGQgQ1NTUHJvcFR3ZWVucyB3aWxsIGJlIGNyZWF0ZWQuIEluc3RlYWQsIHRoZSBlbmRpbmcgdmFsdWVzIHdpbGwgYmUgc3RvcmVkIGluIHRoZSBcImRhdGFcIiBwcm9wZXJ0eSBvZiB0aGUgcmV0dXJuZWQgQ1NTUHJvcFR3ZWVuIGxpa2U6IHtzOi01LCB4bjE6LTEwLCB4bjI6LTIwLCB4bjM6MjU1LCB4bjQ6MCwgeG41OjB9IHNvIHRoYXQgaXQgY2FuIGJlIGZlZCB0byBhbnkgb3RoZXIgcGx1Z2luIGFuZCBpdCdsbCBiZSBwbGFpbiBudW1lcmljIHR3ZWVucyBidXQgdGhlIHJlY29tcG9zaXRpb24gb2YgdGhlIGNvbXBsZXggdmFsdWUgd2lsbCBiZSBoYW5kbGVkIGluc2lkZSBDU1NQbHVnaW4ncyBzZXRSYXRpbygpLlxuXHRcdFx0ICogSWYgYSBzZXRSYXRpbyBpcyBkZWZpbmVkLCB0aGUgdHlwZSBvZiB0aGUgQ1NTUHJvcFR3ZWVuIHdpbGwgYmUgc2V0IHRvIDIgYW5kIHJlY29tcG9zaXRpb24gb2YgdGhlIHZhbHVlcyB3aWxsIGJlIHRoZSByZXNwb25zaWJpbGl0eSBvZiB0aGF0IG1ldGhvZC5cblx0XHRcdCAqXG5cdFx0XHQgKiBAcGFyYW0geyFPYmplY3R9IHQgVGFyZ2V0IHdob3NlIHByb3BlcnR5IHdpbGwgYmUgdHdlZW5lZFxuXHRcdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IHRoYXQgd2lsbCBiZSB0d2VlbmVkIChpdHMgbmFtZSwgbGlrZSBcImxlZnRcIiBvciBcImJhY2tncm91bmRDb2xvclwiIG9yIFwiYm94U2hhZG93XCIpXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gYiBCZWdpbm5pbmcgdmFsdWVcblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBlIEVuZGluZyB2YWx1ZVxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFufSBjbHJzIElmIHRydWUsIHRoZSB2YWx1ZSBjb3VsZCBjb250YWluIGEgY29sb3IgdmFsdWUgbGlrZSBcInJnYigyNTUsMCwwKVwiIG9yIFwiI0YwMFwiIG9yIFwicmVkXCIuIFRoZSBkZWZhdWx0IGlzIGZhbHNlLCBzbyBubyBjb2xvcnMgd2lsbCBiZSByZWNvZ25pemVkIChhIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbilcblx0XHRcdCAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXJ8T2JqZWN0KX0gZGZsdCBUaGUgZGVmYXVsdCBiZWdpbm5pbmcgdmFsdWUgdGhhdCBzaG91bGQgYmUgdXNlZCBpZiBubyB2YWxpZCBiZWdpbm5pbmcgdmFsdWUgaXMgZGVmaW5lZCBvciBpZiB0aGUgbnVtYmVyIG9mIHZhbHVlcyBpbnNpZGUgdGhlIGNvbXBsZXggYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzIGRvbid0IG1hdGNoXG5cdFx0XHQgKiBAcGFyYW0gez9DU1NQcm9wVHdlZW59IHB0IENTU1Byb3BUd2VlbiBpbnN0YW5jZSB0aGF0IGlzIHRoZSBjdXJyZW50IGhlYWQgb2YgdGhlIGxpbmtlZCBsaXN0ICh3ZSdsbCBwcmVwZW5kIHRvIHRoaXMpLlxuXHRcdFx0ICogQHBhcmFtIHtudW1iZXI9fSBwciBQcmlvcml0eSBpbiB0aGUgbGlua2VkIGxpc3Qgb3JkZXIuIEhpZ2hlciBwcmlvcml0eSBwcm9wZXJ0aWVzIHdpbGwgYmUgdXBkYXRlZCBiZWZvcmUgbG93ZXIgcHJpb3JpdHkgb25lcy4gVGhlIGRlZmF1bHQgcHJpb3JpdHkgaXMgMC5cblx0XHRcdCAqIEBwYXJhbSB7VHdlZW5QbHVnaW49fSBwbHVnaW4gSWYgYSBwbHVnaW4gc2hvdWxkIGhhbmRsZSB0aGUgdHdlZW5pbmcgb2YgZXh0cmEgcHJvcGVydGllcywgcGFzcyB0aGUgcGx1Z2luIGluc3RhbmNlIGhlcmUuIElmIG9uZSBpcyBkZWZpbmVkLCB0aGVuIE5PIHN1YnR3ZWVucyB3aWxsIGJlIGNyZWF0ZWQgZm9yIGFueSBleHRyYSBwcm9wZXJ0aWVzICh0aGUgcHJvcGVydGllcyB3aWxsIGJlIGNyZWF0ZWQgLSBqdXN0IG5vdCBhZGRpdGlvbmFsIENTU1Byb3BUd2VlbiBpbnN0YW5jZXMgdG8gdHdlZW4gdGhlbSkgYmVjYXVzZSB0aGUgcGx1Z2luIGlzIGV4cGVjdGVkIHRvIGRvIHNvLiBIb3dldmVyLCB0aGUgZW5kIHZhbHVlcyBXSUxMIGJlIHBvcHVsYXRlZCBpbiB0aGUgXCJkYXRhXCIgcHJvcGVydHksIGxpa2Uge3M6MTAwLCB4bjE6NTAsIHhuMjozMDB9XG5cdFx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9uKG51bWJlcik9fSBzZXRSYXRpbyBJZiB2YWx1ZXMgc2hvdWxkIGJlIHNldCBpbiBhIGN1c3RvbSBmdW5jdGlvbiBpbnN0ZWFkIG9mIGJlaW5nIHBpZWNlZCB0b2dldGhlciBpbiBhIHR5cGU6MSAoY29tcGxleC12YWx1ZSkgQ1NTUHJvcFR3ZWVuLCBkZWZpbmUgdGhhdCBjdXN0b20gZnVuY3Rpb24gaGVyZS5cblx0XHRcdCAqIEByZXR1cm4ge0NTU1Byb3BUd2Vlbn0gVGhlIGZpcnN0IENTU1Byb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3Qgd2hpY2ggaW5jbHVkZXMgdGhlIG5ldyBvbmUocykgYWRkZWQgYnkgdGhlIHBhcnNlQ29tcGxleCgpIGNhbGwuXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZUNvbXBsZXggPSBDU1NQbHVnaW4ucGFyc2VDb21wbGV4ID0gZnVuY3Rpb24odCwgcCwgYiwgZSwgY2xycywgZGZsdCwgcHQsIHByLCBwbHVnaW4sIHNldFJhdGlvKSB7XG5cdFx0XHRcdC8vREVCVUc6IF9sb2coXCJwYXJzZUNvbXBsZXg6IFwiK3ArXCIsIGI6IFwiK2IrXCIsIGU6IFwiK2UpO1xuXHRcdFx0XHRiID0gYiB8fCBkZmx0IHx8IFwiXCI7XG5cdFx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2Vlbih0LCBwLCAwLCAwLCBwdCwgKHNldFJhdGlvID8gMiA6IDEpLCBudWxsLCBmYWxzZSwgcHIsIGIsIGUpO1xuXHRcdFx0XHRlICs9IFwiXCI7IC8vZW5zdXJlcyBpdCdzIGEgc3RyaW5nXG5cdFx0XHRcdHZhciBiYSA9IGIuc3BsaXQoXCIsIFwiKS5qb2luKFwiLFwiKS5zcGxpdChcIiBcIiksIC8vYmVnaW5uaW5nIGFycmF5XG5cdFx0XHRcdFx0ZWEgPSBlLnNwbGl0KFwiLCBcIikuam9pbihcIixcIikuc3BsaXQoXCIgXCIpLCAvL2VuZGluZyBhcnJheVxuXHRcdFx0XHRcdGwgPSBiYS5sZW5ndGgsXG5cdFx0XHRcdFx0YXV0b1JvdW5kID0gKF9hdXRvUm91bmQgIT09IGZhbHNlKSxcblx0XHRcdFx0XHRpLCB4aSwgbmksIGJ2LCBldiwgYm51bXMsIGVudW1zLCBibiwgaGFzQWxwaGEsIHRlbXAsIGN2LCBzdHIsIHVzZUhTTDtcblx0XHRcdFx0aWYgKGUuaW5kZXhPZihcIixcIikgIT09IC0xIHx8IGIuaW5kZXhPZihcIixcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0YmEgPSBiYS5qb2luKFwiIFwiKS5yZXBsYWNlKF9jb21tYXNPdXRzaWRlUGFyZW5FeHAsIFwiLCBcIikuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRcdGVhID0gZWEuam9pbihcIiBcIikucmVwbGFjZShfY29tbWFzT3V0c2lkZVBhcmVuRXhwLCBcIiwgXCIpLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0XHRsID0gYmEubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChsICE9PSBlYS5sZW5ndGgpIHtcblx0XHRcdFx0XHQvL0RFQlVHOiBfbG9nKFwibWlzbWF0Y2hlZCBmb3JtYXR0aW5nIGRldGVjdGVkIG9uIFwiICsgcCArIFwiIChcIiArIGIgKyBcIiB2cyBcIiArIGUgKyBcIilcIik7XG5cdFx0XHRcdFx0YmEgPSAoZGZsdCB8fCBcIlwiKS5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0bCA9IGJhLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdHB0LnNldFJhdGlvID0gc2V0UmF0aW87XG5cdFx0XHRcdF9jb2xvckV4cC5sYXN0SW5kZXggPSAwO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0YnYgPSBiYVtpXTtcblx0XHRcdFx0XHRldiA9IGVhW2ldO1xuXHRcdFx0XHRcdGJuID0gcGFyc2VGbG9hdChidik7XG5cdFx0XHRcdFx0Ly9pZiB0aGUgdmFsdWUgYmVnaW5zIHdpdGggYSBudW1iZXIgKG1vc3QgY29tbW9uKS4gSXQncyBmaW5lIGlmIGl0IGhhcyBhIHN1ZmZpeCBsaWtlIHB4XG5cdFx0XHRcdFx0aWYgKGJuIHx8IGJuID09PSAwKSB7XG5cdFx0XHRcdFx0XHRwdC5hcHBlbmRYdHJhKFwiXCIsIGJuLCBfcGFyc2VDaGFuZ2UoZXYsIGJuKSwgZXYucmVwbGFjZShfcmVsTnVtRXhwLCBcIlwiKSwgKGF1dG9Sb3VuZCAmJiBldi5pbmRleE9mKFwicHhcIikgIT09IC0xKSwgdHJ1ZSk7XG5cblx0XHRcdFx0XHQvL2lmIHRoZSB2YWx1ZSBpcyBhIGNvbG9yXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjbHJzICYmIF9jb2xvckV4cC50ZXN0KGJ2KSkge1xuXHRcdFx0XHRcdFx0c3RyID0gZXYuY2hhckF0KGV2Lmxlbmd0aCAtIDEpID09PSBcIixcIiA/IFwiKSxcIiA6IFwiKVwiOyAvL2lmIHRoZXJlJ3MgYSBjb21tYSBhdCB0aGUgZW5kLCByZXRhaW4gaXQuXG5cdFx0XHRcdFx0XHR1c2VIU0wgPSAoZXYuaW5kZXhPZihcImhzbFwiKSAhPT0gLTEgJiYgX3N1cHBvcnRzT3BhY2l0eSk7XG5cdFx0XHRcdFx0XHRidiA9IF9wYXJzZUNvbG9yKGJ2LCB1c2VIU0wpO1xuXHRcdFx0XHRcdFx0ZXYgPSBfcGFyc2VDb2xvcihldiwgdXNlSFNMKTtcblx0XHRcdFx0XHRcdGhhc0FscGhhID0gKGJ2Lmxlbmd0aCArIGV2Lmxlbmd0aCA+IDYpO1xuXHRcdFx0XHRcdFx0aWYgKGhhc0FscGhhICYmICFfc3VwcG9ydHNPcGFjaXR5ICYmIGV2WzNdID09PSAwKSB7IC8vb2xkZXIgdmVyc2lvbnMgb2YgSUUgZG9uJ3Qgc3VwcG9ydCByZ2JhKCksIHNvIGlmIHRoZSBkZXN0aW5hdGlvbiBhbHBoYSBpcyAwLCBqdXN0IHVzZSBcInRyYW5zcGFyZW50XCIgZm9yIHRoZSBlbmQgY29sb3Jcblx0XHRcdFx0XHRcdFx0cHRbXCJ4c1wiICsgcHQubF0gKz0gcHQubCA/IFwiIHRyYW5zcGFyZW50XCIgOiBcInRyYW5zcGFyZW50XCI7XG5cdFx0XHRcdFx0XHRcdHB0LmUgPSBwdC5lLnNwbGl0KGVhW2ldKS5qb2luKFwidHJhbnNwYXJlbnRcIik7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpZiAoIV9zdXBwb3J0c09wYWNpdHkpIHsgLy9vbGQgdmVyc2lvbnMgb2YgSUUgZG9uJ3Qgc3VwcG9ydCByZ2JhKCkuXG5cdFx0XHRcdFx0XHRcdFx0aGFzQWxwaGEgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAodXNlSFNMKSB7XG5cdFx0XHRcdFx0XHRcdFx0cHQuYXBwZW5kWHRyYSgoaGFzQWxwaGEgPyBcImhzbGEoXCIgOiBcImhzbChcIiksIGJ2WzBdLCBfcGFyc2VDaGFuZ2UoZXZbMF0sIGJ2WzBdKSwgXCIsXCIsIGZhbHNlLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0LmFwcGVuZFh0cmEoXCJcIiwgYnZbMV0sIF9wYXJzZUNoYW5nZShldlsxXSwgYnZbMV0pLCBcIiUsXCIsIGZhbHNlKVxuXHRcdFx0XHRcdFx0XHRcdFx0LmFwcGVuZFh0cmEoXCJcIiwgYnZbMl0sIF9wYXJzZUNoYW5nZShldlsyXSwgYnZbMl0pLCAoaGFzQWxwaGEgPyBcIiUsXCIgOiBcIiVcIiArIHN0ciksIGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRwdC5hcHBlbmRYdHJhKChoYXNBbHBoYSA/IFwicmdiYShcIiA6IFwicmdiKFwiKSwgYnZbMF0sIGV2WzBdIC0gYnZbMF0sIFwiLFwiLCB0cnVlLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0LmFwcGVuZFh0cmEoXCJcIiwgYnZbMV0sIGV2WzFdIC0gYnZbMV0sIFwiLFwiLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0LmFwcGVuZFh0cmEoXCJcIiwgYnZbMl0sIGV2WzJdIC0gYnZbMl0sIChoYXNBbHBoYSA/IFwiLFwiIDogc3RyKSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoaGFzQWxwaGEpIHtcblx0XHRcdFx0XHRcdFx0XHRidiA9IChidi5sZW5ndGggPCA0KSA/IDEgOiBidlszXTtcblx0XHRcdFx0XHRcdFx0XHRwdC5hcHBlbmRYdHJhKFwiXCIsIGJ2LCAoKGV2Lmxlbmd0aCA8IDQpID8gMSA6IGV2WzNdKSAtIGJ2LCBzdHIsIGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0X2NvbG9yRXhwLmxhc3RJbmRleCA9IDA7IC8vb3RoZXJ3aXNlIHRoZSB0ZXN0KCkgb24gdGhlIFJlZ0V4cCBjb3VsZCBtb3ZlIHRoZSBsYXN0SW5kZXggYW5kIHRhaW50IGZ1dHVyZSByZXN1bHRzLlxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGJudW1zID0gYnYubWF0Y2goX251bUV4cCk7IC8vZ2V0cyBlYWNoIGdyb3VwIG9mIG51bWJlcnMgaW4gdGhlIGJlZ2lubmluZyB2YWx1ZSBzdHJpbmcgYW5kIGRyb3BzIHRoZW0gaW50byBhbiBhcnJheVxuXG5cdFx0XHRcdFx0XHQvL2lmIG5vIG51bWJlciBpcyBmb3VuZCwgdHJlYXQgaXQgYXMgYSBub24tdHdlZW5pbmcgdmFsdWUgYW5kIGp1c3QgYXBwZW5kIHRoZSBzdHJpbmcgdG8gdGhlIGN1cnJlbnQgeHMuXG5cdFx0XHRcdFx0XHRpZiAoIWJudW1zKSB7XG5cdFx0XHRcdFx0XHRcdHB0W1wieHNcIiArIHB0LmxdICs9IHB0LmwgPyBcIiBcIiArIGV2IDogZXY7XG5cblx0XHRcdFx0XHRcdC8vbG9vcCB0aHJvdWdoIGFsbCB0aGUgbnVtYmVycyB0aGF0IGFyZSBmb3VuZCBhbmQgY29uc3RydWN0IHRoZSBleHRyYSB2YWx1ZXMgb24gdGhlIHB0LlxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0ZW51bXMgPSBldi5tYXRjaChfcmVsTnVtRXhwKTsgLy9nZXQgZWFjaCBncm91cCBvZiBudW1iZXJzIGluIHRoZSBlbmQgdmFsdWUgc3RyaW5nIGFuZCBkcm9wIHRoZW0gaW50byBhbiBhcnJheS4gV2UgYWxsb3cgcmVsYXRpdmUgdmFsdWVzIHRvbywgbGlrZSArPTUwIG9yIC09LjVcblx0XHRcdFx0XHRcdFx0aWYgKCFlbnVtcyB8fCBlbnVtcy5sZW5ndGggIT09IGJudW1zLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdC8vREVCVUc6IF9sb2coXCJtaXNtYXRjaGVkIGZvcm1hdHRpbmcgZGV0ZWN0ZWQgb24gXCIgKyBwICsgXCIgKFwiICsgYiArIFwiIHZzIFwiICsgZSArIFwiKVwiKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0bmkgPSAwO1xuXHRcdFx0XHRcdFx0XHRmb3IgKHhpID0gMDsgeGkgPCBibnVtcy5sZW5ndGg7IHhpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRjdiA9IGJudW1zW3hpXTtcblx0XHRcdFx0XHRcdFx0XHR0ZW1wID0gYnYuaW5kZXhPZihjdiwgbmkpO1xuXHRcdFx0XHRcdFx0XHRcdHB0LmFwcGVuZFh0cmEoYnYuc3Vic3RyKG5pLCB0ZW1wIC0gbmkpLCBOdW1iZXIoY3YpLCBfcGFyc2VDaGFuZ2UoZW51bXNbeGldLCBjdiksIFwiXCIsIChhdXRvUm91bmQgJiYgYnYuc3Vic3RyKHRlbXAgKyBjdi5sZW5ndGgsIDIpID09PSBcInB4XCIpLCAoeGkgPT09IDApKTtcblx0XHRcdFx0XHRcdFx0XHRuaSA9IHRlbXAgKyBjdi5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cHRbXCJ4c1wiICsgcHQubF0gKz0gYnYuc3Vic3RyKG5pKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9pZiB0aGVyZSBhcmUgcmVsYXRpdmUgdmFsdWVzIChcIis9XCIgb3IgXCItPVwiIHByZWZpeCksIHdlIG5lZWQgdG8gYWRqdXN0IHRoZSBlbmRpbmcgdmFsdWUgdG8gZWxpbWluYXRlIHRoZSBwcmVmaXhlcyBhbmQgY29tYmluZSB0aGUgdmFsdWVzIHByb3Blcmx5LlxuXHRcdFx0XHRpZiAoZS5pbmRleE9mKFwiPVwiKSAhPT0gLTEpIGlmIChwdC5kYXRhKSB7XG5cdFx0XHRcdFx0c3RyID0gcHQueHMwICsgcHQuZGF0YS5zO1xuXHRcdFx0XHRcdGZvciAoaSA9IDE7IGkgPCBwdC5sOyBpKyspIHtcblx0XHRcdFx0XHRcdHN0ciArPSBwdFtcInhzXCIgKyBpXSArIHB0LmRhdGFbXCJ4blwiICsgaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0LmUgPSBzdHIgKyBwdFtcInhzXCIgKyBpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXB0LmwpIHtcblx0XHRcdFx0XHRwdC50eXBlID0gLTE7XG5cdFx0XHRcdFx0cHQueHMwID0gcHQuZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcHQueGZpcnN0IHx8IHB0O1xuXHRcdFx0fSxcblx0XHRcdGkgPSA5O1xuXG5cblx0XHRwID0gQ1NTUHJvcFR3ZWVuLnByb3RvdHlwZTtcblx0XHRwLmwgPSBwLnByID0gMDsgLy9sZW5ndGggKG51bWJlciBvZiBleHRyYSBwcm9wZXJ0aWVzIGxpa2UgeG4xLCB4bjIsIHhuMywgZXRjLlxuXHRcdHdoaWxlICgtLWkgPiAwKSB7XG5cdFx0XHRwW1wieG5cIiArIGldID0gMDtcblx0XHRcdHBbXCJ4c1wiICsgaV0gPSBcIlwiO1xuXHRcdH1cblx0XHRwLnhzMCA9IFwiXCI7XG5cdFx0cC5fbmV4dCA9IHAuX3ByZXYgPSBwLnhmaXJzdCA9IHAuZGF0YSA9IHAucGx1Z2luID0gcC5zZXRSYXRpbyA9IHAucnhwID0gbnVsbDtcblxuXG5cdFx0LyoqXG5cdFx0ICogQXBwZW5kcyBhbmQgZXh0cmEgdHdlZW5pbmcgdmFsdWUgdG8gYSBDU1NQcm9wVHdlZW4gYW5kIGF1dG9tYXRpY2FsbHkgbWFuYWdlcyBhbnkgcHJlZml4IGFuZCBzdWZmaXggc3RyaW5ncy4gVGhlIGZpcnN0IGV4dHJhIHZhbHVlIGlzIHN0b3JlZCBpbiB0aGUgcyBhbmQgYyBvZiB0aGUgbWFpbiBDU1NQcm9wVHdlZW4gaW5zdGFuY2UsIGJ1dCB0aGVyZWFmdGVyIGFueSBleHRyYXMgYXJlIHN0b3JlZCBpbiB0aGUgeG4xLCB4bjIsIHhuMywgZXRjLiBUaGUgcHJlZml4ZXMgYW5kIHN1ZmZpeGVzIGFyZSBzdG9yZWQgaW4gdGhlIHhzMCwgeHMxLCB4czIsIGV0Yy4gcHJvcGVydGllcy4gRm9yIGV4YW1wbGUsIGlmIEkgd2FsayB0aHJvdWdoIGEgY2xpcCB2YWx1ZSBsaWtlIFwicmVjdCgxMHB4LCA1cHgsIDBweCwgMjBweClcIiwgdGhlIHZhbHVlcyB3b3VsZCBiZSBzdG9yZWQgbGlrZSB0aGlzOlxuXHRcdCAqIHhzMDpcInJlY3QoXCIsIHM6MTAsIHhzMTpcInB4LCBcIiwgeG4xOjUsIHhzMjpcInB4LCBcIiwgeG4yOjAsIHhzMzpcInB4LCBcIiwgeG4zOjIwLCB4bjQ6XCJweClcIlxuXHRcdCAqIEFuZCB0aGV5J2QgYWxsIGdldCBqb2luZWQgdG9nZXRoZXIgd2hlbiB0aGUgQ1NTUGx1Z2luIHJlbmRlcnMgKGluIHRoZSBzZXRSYXRpbygpIG1ldGhvZCkuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBwZnggUHJlZml4IChpZiBhbnkpXG5cdFx0ICogQHBhcmFtIHshbnVtYmVyfSBzIFN0YXJ0aW5nIHZhbHVlXG5cdFx0ICogQHBhcmFtIHshbnVtYmVyfSBjIENoYW5nZSBpbiBudW1lcmljIHZhbHVlIG92ZXIgdGhlIGNvdXJzZSBvZiB0aGUgZW50aXJlIHR3ZWVuLiBGb3IgZXhhbXBsZSwgaWYgdGhlIHN0YXJ0IGlzIDUgYW5kIHRoZSBlbmQgaXMgMTAwLCB0aGUgY2hhbmdlIHdvdWxkIGJlIDk1LlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gc2Z4IFN1ZmZpeCAoaWYgYW55KVxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHIgUm91bmQgKGlmIHRydWUpLlxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHBhZCBJZiB0cnVlLCB0aGlzIGV4dHJhIHZhbHVlIHNob3VsZCBiZSBzZXBhcmF0ZWQgYnkgdGhlIHByZXZpb3VzIG9uZSBieSBhIHNwYWNlLiBJZiB0aGVyZSBpcyBubyBwcmV2aW91cyBleHRyYSBhbmQgcGFkIGlzIHRydWUsIGl0IHdpbGwgYXV0b21hdGljYWxseSBkcm9wIHRoZSBzcGFjZS5cblx0XHQgKiBAcmV0dXJuIHtDU1NQcm9wVHdlZW59IHJldHVybnMgaXRzZWxmIHNvIHRoYXQgbXVsdGlwbGUgbWV0aG9kcyBjYW4gYmUgY2hhaW5lZCB0b2dldGhlci5cblx0XHQgKi9cblx0XHRwLmFwcGVuZFh0cmEgPSBmdW5jdGlvbihwZngsIHMsIGMsIHNmeCwgciwgcGFkKSB7XG5cdFx0XHR2YXIgcHQgPSB0aGlzLFxuXHRcdFx0XHRsID0gcHQubDtcblx0XHRcdHB0W1wieHNcIiArIGxdICs9IChwYWQgJiYgbCkgPyBcIiBcIiArIHBmeCA6IHBmeCB8fCBcIlwiO1xuXHRcdFx0aWYgKCFjKSBpZiAobCAhPT0gMCAmJiAhcHQucGx1Z2luKSB7IC8vdHlwaWNhbGx5IHdlJ2xsIGNvbWJpbmUgbm9uLWNoYW5naW5nIHZhbHVlcyByaWdodCBpbnRvIHRoZSB4cyB0byBvcHRpbWl6ZSBwZXJmb3JtYW5jZSwgYnV0IHdlIGRvbid0IGNvbWJpbmUgdGhlbSB3aGVuIHRoZXJlJ3MgYSBwbHVnaW4gdGhhdCB3aWxsIGJlIHR3ZWVuaW5nIHRoZSB2YWx1ZXMgYmVjYXVzZSBpdCBtYXkgZGVwZW5kIG9uIHRoZSB2YWx1ZXMgYmVpbmcgc3BsaXQgYXBhcnQsIGxpa2UgZm9yIGEgYmV6aWVyLCBpZiBhIHZhbHVlIGRvZXNuJ3QgY2hhbmdlIGJldHdlZW4gdGhlIGZpcnN0IGFuZCBzZWNvbmQgaXRlcmF0aW9uIGJ1dCB0aGVuIGl0IGRvZXMgb24gdGhlIDNyZCwgd2UnbGwgcnVuIGludG8gdHJvdWJsZSBiZWNhdXNlIHRoZXJlJ3Mgbm8geG4gc2xvdCBmb3IgdGhhdCB2YWx1ZSFcblx0XHRcdFx0cHRbXCJ4c1wiICsgbF0gKz0gcyArIChzZnggfHwgXCJcIik7XG5cdFx0XHRcdHJldHVybiBwdDtcblx0XHRcdH1cblx0XHRcdHB0LmwrKztcblx0XHRcdHB0LnR5cGUgPSBwdC5zZXRSYXRpbyA/IDIgOiAxO1xuXHRcdFx0cHRbXCJ4c1wiICsgcHQubF0gPSBzZnggfHwgXCJcIjtcblx0XHRcdGlmIChsID4gMCkge1xuXHRcdFx0XHRwdC5kYXRhW1wieG5cIiArIGxdID0gcyArIGM7XG5cdFx0XHRcdHB0LnJ4cFtcInhuXCIgKyBsXSA9IHI7IC8vcm91bmQgZXh0cmEgcHJvcGVydHkgKHdlIG5lZWQgdG8gdGFwIGludG8gdGhpcyBpbiB0aGUgX3BhcnNlVG9Qcm94eSgpIG1ldGhvZClcblx0XHRcdFx0cHRbXCJ4blwiICsgbF0gPSBzO1xuXHRcdFx0XHRpZiAoIXB0LnBsdWdpbikge1xuXHRcdFx0XHRcdHB0LnhmaXJzdCA9IG5ldyBDU1NQcm9wVHdlZW4ocHQsIFwieG5cIiArIGwsIHMsIGMsIHB0LnhmaXJzdCB8fCBwdCwgMCwgcHQubiwgciwgcHQucHIpO1xuXHRcdFx0XHRcdHB0LnhmaXJzdC54czAgPSAwOyAvL2p1c3QgdG8gZW5zdXJlIHRoYXQgdGhlIHByb3BlcnR5IHN0YXlzIG51bWVyaWMgd2hpY2ggaGVscHMgbW9kZXJuIGJyb3dzZXJzIHNwZWVkIHVwIHByb2Nlc3NpbmcuIFJlbWVtYmVyLCBpbiB0aGUgc2V0UmF0aW8oKSBtZXRob2QsIHdlIGRvIHB0LnRbcHQucF0gPSB2YWwgKyBwdC54czAgc28gaWYgcHQueHMwIGlzIFwiXCIgKHRoZSBkZWZhdWx0KSwgaXQnbGwgY2FzdCB0aGUgZW5kIHZhbHVlIGFzIGEgc3RyaW5nLiBXaGVuIGEgcHJvcGVydHkgaXMgYSBudW1iZXIgc29tZXRpbWVzIGFuZCBhIHN0cmluZyBzb21ldGltZXMsIGl0IHByZXZlbnRzIHRoZSBjb21waWxlciBmcm9tIGxvY2tpbmcgaW4gdGhlIGRhdGEgdHlwZSwgc2xvd2luZyB0aGluZ3MgZG93biBzbGlnaHRseS5cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHR9XG5cdFx0XHRwdC5kYXRhID0ge3M6cyArIGN9O1xuXHRcdFx0cHQucnhwID0ge307XG5cdFx0XHRwdC5zID0gcztcblx0XHRcdHB0LmMgPSBjO1xuXHRcdFx0cHQuciA9IHI7XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEBjb25zdHJ1Y3RvciBBIFNwZWNpYWxQcm9wIGlzIGJhc2ljYWxseSBhIGNzcyBwcm9wZXJ0eSB0aGF0IG5lZWRzIHRvIGJlIHRyZWF0ZWQgaW4gYSBub24tc3RhbmRhcmQgd2F5LCBsaWtlIGlmIGl0IG1heSBjb250YWluIGEgY29tcGxleCB2YWx1ZSBsaWtlIGJveFNoYWRvdzpcIjVweCAxMHB4IDE1cHggcmdiKDI1NSwgMTAyLCA1MSlcIiBvciBpZiBpdCBpcyBhc3NvY2lhdGVkIHdpdGggYW5vdGhlciBwbHVnaW4gbGlrZSBUaHJvd1Byb3BzUGx1Z2luIG9yIEJlemllclBsdWdpbi4gRXZlcnkgU3BlY2lhbFByb3AgaXMgYXNzb2NpYXRlZCB3aXRoIGEgcGFydGljdWxhciBwcm9wZXJ0eSBuYW1lIGxpa2UgXCJib3hTaGFkb3dcIiBvciBcInRocm93UHJvcHNcIiBvciBcImJlemllclwiIGFuZCBpdCB3aWxsIGludGVyY2VwdCB0aG9zZSB2YWx1ZXMgaW4gdGhlIHZhcnMgb2JqZWN0IHRoYXQncyBwYXNzZWQgdG8gdGhlIENTU1BsdWdpbiBhbmQgaGFuZGxlIHRoZW0gYWNjb3JkaW5nbHkuXG5cdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IG5hbWUgKGxpa2UgXCJib3hTaGFkb3dcIiBvciBcInRocm93UHJvcHNcIilcblx0XHQgKiBAcGFyYW0ge09iamVjdD19IG9wdGlvbnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgYW55IG9mIHRoZSBmb2xsb3dpbmcgY29uZmlndXJhdGlvbiBvcHRpb25zOlxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgIC0gZGVmYXVsdFZhbHVlOiB0aGUgZGVmYXVsdCB2YWx1ZVxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgIC0gcGFyc2VyOiBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCB3aGVuIHRoZSBhc3NvY2lhdGVkIHByb3BlcnR5IG5hbWUgaXMgZm91bmQgaW4gdGhlIHZhcnMuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIENTU1Byb3BUd2VlbiBpbnN0YW5jZSBhbmQgaXQgc2hvdWxkIGVuc3VyZSB0aGF0IGl0IGlzIHByb3Blcmx5IGluc2VydGVkIGludG8gdGhlIGxpbmtlZCBsaXN0LiBJdCB3aWxsIHJlY2VpdmUgNCBwYXJhbXRlcnM6IDEpIFRoZSB0YXJnZXQsIDIpIFRoZSB2YWx1ZSBkZWZpbmVkIGluIHRoZSB2YXJzLCAzKSBUaGUgQ1NTUGx1Z2luIGluc3RhbmNlICh3aG9zZSBfZmlyc3RQVCBzaG91bGQgYmUgdXNlZCBmb3IgdGhlIGxpbmtlZCBsaXN0KSwgYW5kIDQpIEEgY29tcHV0ZWQgc3R5bGUgb2JqZWN0IGlmIG9uZSB3YXMgY2FsY3VsYXRlZCAodGhpcyBpcyBhIHNwZWVkIG9wdGltaXphdGlvbiB0aGF0IGFsbG93cyByZXRyaWV2YWwgb2Ygc3RhcnRpbmcgdmFsdWVzIHF1aWNrZXIpXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgLSBmb3JtYXR0ZXI6IGEgZnVuY3Rpb24gdGhhdCBmb3JtYXRzIGFueSB2YWx1ZSByZWNlaXZlZCBmb3IgdGhpcyBzcGVjaWFsIHByb3BlcnR5IChmb3IgZXhhbXBsZSwgYm94U2hhZG93IGNvdWxkIHRha2UgXCI1cHggNXB4IHJlZFwiIGFuZCBmb3JtYXQgaXQgdG8gXCI1cHggNXB4IDBweCAwcHggcmVkXCIgc28gdGhhdCBib3RoIHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgaGF2ZSBhIGNvbW1vbiBvcmRlciBhbmQgcXVhbnRpdHkgb2YgdmFsdWVzLilcblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIHByZWZpeDogaWYgdHJ1ZSwgd2UnbGwgZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRoaXMgcHJvcGVydHkgcmVxdWlyZXMgYSB2ZW5kb3IgcHJlZml4IChsaWtlIFdlYmtpdCBvciBNb3ogb3IgbXMgb3IgTylcblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIGNvbG9yOiBzZXQgdGhpcyB0byB0cnVlIGlmIHRoZSB2YWx1ZSBmb3IgdGhpcyBTcGVjaWFsUHJvcCBtYXkgY29udGFpbiBjb2xvci1yZWxhdGVkIHZhbHVlcyBsaWtlIHJnYigpLCByZ2JhKCksIGV0Yy5cblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIHByaW9yaXR5OiBwcmlvcml0eSBpbiB0aGUgbGlua2VkIGxpc3Qgb3JkZXIuIEhpZ2hlciBwcmlvcml0eSBTcGVjaWFsUHJvcHMgd2lsbCBiZSB1cGRhdGVkIGJlZm9yZSBsb3dlciBwcmlvcml0eSBvbmVzLiBUaGUgZGVmYXVsdCBwcmlvcml0eSBpcyAwLlxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgIC0gbXVsdGk6IGlmIHRydWUsIHRoZSBmb3JtYXR0ZXIgc2hvdWxkIGFjY29tbW9kYXRlIGEgY29tbWEtZGVsaW1pdGVkIGxpc3Qgb2YgdmFsdWVzLCBsaWtlIGJveFNoYWRvdyBjb3VsZCBoYXZlIG11bHRpcGxlIGJveFNoYWRvd3MgbGlzdGVkIG91dC5cblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIGNvbGxhcHNpYmxlOiBpZiB0cnVlLCB0aGUgZm9ybWF0dGVyIHNob3VsZCB0cmVhdCB0aGUgdmFsdWUgbGlrZSBpdCdzIGEgdG9wL3JpZ2h0L2JvdHRvbS9sZWZ0IHZhbHVlIHRoYXQgY291bGQgYmUgY29sbGFwc2VkLCBsaWtlIFwiNXB4XCIgd291bGQgYXBwbHkgdG8gYWxsLCBcIjVweCwgMTBweFwiIHdvdWxkIHVzZSA1cHggZm9yIHRvcC9ib3R0b20gYW5kIDEwcHggZm9yIHJpZ2h0L2xlZnQsIGV0Yy5cblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIGtleXdvcmQ6IGEgc3BlY2lhbCBrZXl3b3JkIHRoYXQgY2FuIFtvcHRpb25hbGx5XSBiZSBmb3VuZCBpbnNpZGUgdGhlIHZhbHVlIChsaWtlIFwiaW5zZXRcIiBmb3IgYm94U2hhZG93KS4gVGhpcyBhbGxvd3MgdXMgdG8gdmFsaWRhdGUgYmVnaW5uaW5nL2VuZGluZyB2YWx1ZXMgdG8gbWFrZSBzdXJlIHRoZXkgbWF0Y2ggKGlmIHRoZSBrZXl3b3JkIGlzIGZvdW5kIGluIG9uZSwgaXQnbGwgYmUgYWRkZWQgdG8gdGhlIG90aGVyIGZvciBjb25zaXN0ZW5jeSBieSBkZWZhdWx0KS5cblx0XHQgKi9cblx0XHR2YXIgU3BlY2lhbFByb3AgPSBmdW5jdGlvbihwLCBvcHRpb25zKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdFx0XHR0aGlzLnAgPSBvcHRpb25zLnByZWZpeCA/IF9jaGVja1Byb3BQcmVmaXgocCkgfHwgcCA6IHA7XG5cdFx0XHRcdF9zcGVjaWFsUHJvcHNbcF0gPSBfc3BlY2lhbFByb3BzW3RoaXMucF0gPSB0aGlzO1xuXHRcdFx0XHR0aGlzLmZvcm1hdCA9IG9wdGlvbnMuZm9ybWF0dGVyIHx8IF9nZXRGb3JtYXR0ZXIob3B0aW9ucy5kZWZhdWx0VmFsdWUsIG9wdGlvbnMuY29sb3IsIG9wdGlvbnMuY29sbGFwc2libGUsIG9wdGlvbnMubXVsdGkpO1xuXHRcdFx0XHRpZiAob3B0aW9ucy5wYXJzZXIpIHtcblx0XHRcdFx0XHR0aGlzLnBhcnNlID0gb3B0aW9ucy5wYXJzZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jbHJzID0gb3B0aW9ucy5jb2xvcjtcblx0XHRcdFx0dGhpcy5tdWx0aSA9IG9wdGlvbnMubXVsdGk7XG5cdFx0XHRcdHRoaXMua2V5d29yZCA9IG9wdGlvbnMua2V5d29yZDtcblx0XHRcdFx0dGhpcy5kZmx0ID0gb3B0aW9ucy5kZWZhdWx0VmFsdWU7XG5cdFx0XHRcdHRoaXMucHIgPSBvcHRpb25zLnByaW9yaXR5IHx8IDA7XG5cdFx0XHR9LFxuXG5cdFx0XHQvL3Nob3J0Y3V0IGZvciBjcmVhdGluZyBhIG5ldyBTcGVjaWFsUHJvcCB0aGF0IGNhbiBhY2NlcHQgbXVsdGlwbGUgcHJvcGVydGllcyBhcyBhIGNvbW1hLWRlbGltaXRlZCBsaXN0IChoZWxwcyBtaW5pZmljYXRpb24pLiBkZmx0IGNhbiBiZSBhbiBhcnJheSBmb3IgbXVsdGlwbGUgdmFsdWVzICh3ZSBkb24ndCBkbyBhIGNvbW1hLWRlbGltaXRlZCBsaXN0IGJlY2F1c2UgdGhlIGRlZmF1bHQgdmFsdWUgbWF5IGNvbnRhaW4gY29tbWFzLCBsaWtlIHJlY3QoMHB4LDBweCwwcHgsMHB4KSkuIFdlIGF0dGFjaCB0aGlzIG1ldGhvZCB0byB0aGUgU3BlY2lhbFByb3AgY2xhc3Mvb2JqZWN0IGluc3RlYWQgb2YgdXNpbmcgYSBwcml2YXRlIF9jcmVhdGVTcGVjaWFsUHJvcCgpIG1ldGhvZCBzbyB0aGF0IHdlIGNhbiB0YXAgaW50byBpdCBleHRlcm5hbGx5IGlmIG5lY2Vzc2FyeSwgbGlrZSBmcm9tIGFub3RoZXIgcGx1Z2luLlxuXHRcdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wID0gX2ludGVybmFscy5fcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AgPSBmdW5jdGlvbihwLCBvcHRpb25zLCBkZWZhdWx0cykge1xuXHRcdFx0XHRpZiAodHlwZW9mKG9wdGlvbnMpICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0b3B0aW9ucyA9IHtwYXJzZXI6ZGVmYXVsdHN9OyAvL3RvIG1ha2UgYmFja3dhcmRzIGNvbXBhdGlibGUgd2l0aCBvbGRlciB2ZXJzaW9ucyBvZiBCZXppZXJQbHVnaW4gYW5kIFRocm93UHJvcHNQbHVnaW5cblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgYSA9IHAuc3BsaXQoXCIsXCIpLFxuXHRcdFx0XHRcdGQgPSBvcHRpb25zLmRlZmF1bHRWYWx1ZSxcblx0XHRcdFx0XHRpLCB0ZW1wO1xuXHRcdFx0XHRkZWZhdWx0cyA9IGRlZmF1bHRzIHx8IFtkXTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRvcHRpb25zLnByZWZpeCA9IChpID09PSAwICYmIG9wdGlvbnMucHJlZml4KTtcblx0XHRcdFx0XHRvcHRpb25zLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRzW2ldIHx8IGQ7XG5cdFx0XHRcdFx0dGVtcCA9IG5ldyBTcGVjaWFsUHJvcChhW2ldLCBvcHRpb25zKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0Ly9jcmVhdGVzIGEgcGxhY2Vob2xkZXIgc3BlY2lhbCBwcm9wIGZvciBhIHBsdWdpbiBzbyB0aGF0IHRoZSBwcm9wZXJ0eSBnZXRzIGNhdWdodCB0aGUgZmlyc3QgdGltZSBhIHR3ZWVuIG9mIGl0IGlzIGF0dGVtcHRlZCwgYW5kIGF0IHRoYXQgdGltZSBpdCBtYWtlcyB0aGUgcGx1Z2luIHJlZ2lzdGVyIGl0c2VsZiwgdGh1cyB0YWtpbmcgb3ZlciBmb3IgYWxsIGZ1dHVyZSB0d2VlbnMgb2YgdGhhdCBwcm9wZXJ0eS4gVGhpcyBhbGxvd3MgdXMgdG8gbm90IG1hbmRhdGUgdGhhdCB0aGluZ3MgbG9hZCBpbiBhIHBhcnRpY3VsYXIgb3JkZXIgYW5kIGl0IGFsc28gYWxsb3dzIHVzIHRvIGxvZygpIGFuIGVycm9yIHRoYXQgaW5mb3JtcyB0aGUgdXNlciB3aGVuIHRoZXkgYXR0ZW1wdCB0byB0d2VlbiBhbiBleHRlcm5hbCBwbHVnaW4tcmVsYXRlZCBwcm9wZXJ0eSB3aXRob3V0IGxvYWRpbmcgaXRzIC5qcyBmaWxlLlxuXHRcdFx0X3JlZ2lzdGVyUGx1Z2luUHJvcCA9IGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0aWYgKCFfc3BlY2lhbFByb3BzW3BdKSB7XG5cdFx0XHRcdFx0dmFyIHBsdWdpbk5hbWUgPSBwLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcC5zdWJzdHIoMSkgKyBcIlBsdWdpblwiO1xuXHRcdFx0XHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChwLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdFx0XHRcdHZhciBwbHVnaW5DbGFzcyA9IF9nbG9iYWxzLmNvbS5ncmVlbnNvY2sucGx1Z2luc1twbHVnaW5OYW1lXTtcblx0XHRcdFx0XHRcdGlmICghcGx1Z2luQ2xhc3MpIHtcblx0XHRcdFx0XHRcdFx0X2xvZyhcIkVycm9yOiBcIiArIHBsdWdpbk5hbWUgKyBcIiBqcyBmaWxlIG5vdCBsb2FkZWQuXCIpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRwbHVnaW5DbGFzcy5fY3NzUmVnaXN0ZXIoKTtcblx0XHRcdFx0XHRcdHJldHVybiBfc3BlY2lhbFByb3BzW3BdLnBhcnNlKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpO1xuXHRcdFx0XHRcdH19KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXG5cdFx0cCA9IFNwZWNpYWxQcm9wLnByb3RvdHlwZTtcblxuXHRcdC8qKlxuXHRcdCAqIEFsaWFzIGZvciBfcGFyc2VDb21wbGV4KCkgdGhhdCBhdXRvbWF0aWNhbGx5IHBsdWdzIGluIGNlcnRhaW4gdmFsdWVzIGZvciB0aGlzIFNwZWNpYWxQcm9wLCBsaWtlIGl0cyBwcm9wZXJ0eSBuYW1lLCB3aGV0aGVyIG9yIG5vdCBjb2xvcnMgc2hvdWxkIGJlIHNlbnNlZCwgdGhlIGRlZmF1bHQgdmFsdWUsIGFuZCBwcmlvcml0eS4gSXQgYWxzbyBsb29rcyBmb3IgYW55IGtleXdvcmQgdGhhdCB0aGUgU3BlY2lhbFByb3AgZGVmaW5lcyAobGlrZSBcImluc2V0XCIgZm9yIGJveFNoYWRvdykgYW5kIGVuc3VyZXMgdGhhdCB0aGUgYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzIGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIHZhbHVlcyBmb3IgU3BlY2lhbFByb3BzIHdoZXJlIG11bHRpIGlzIHRydWUgKGxpa2UgYm94U2hhZG93IGFuZCB0ZXh0U2hhZG93IGNhbiBoYXZlIGEgY29tbWEtZGVsaW1pdGVkIGxpc3QpXG5cdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IHRhcmdldCBlbGVtZW50XG5cdFx0ICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcnxvYmplY3QpfSBiIGJlZ2lubmluZyB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXJ8b2JqZWN0KX0gZSBlbmRpbmcgKGRlc3RpbmF0aW9uKSB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7Q1NTUHJvcFR3ZWVuPX0gcHQgbmV4dCBDU1NQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0XG5cdFx0ICogQHBhcmFtIHtUd2VlblBsdWdpbj19IHBsdWdpbiBJZiBhbm90aGVyIHBsdWdpbiB3aWxsIGJlIHR3ZWVuaW5nIHRoZSBjb21wbGV4IHZhbHVlLCB0aGF0IFR3ZWVuUGx1Z2luIGluc3RhbmNlIGdvZXMgaGVyZS5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9uPX0gc2V0UmF0aW8gSWYgYSBjdXN0b20gc2V0UmF0aW8oKSBtZXRob2Qgc2hvdWxkIGJlIHVzZWQgdG8gaGFuZGxlIHRoaXMgY29tcGxleCB2YWx1ZSwgdGhhdCBnb2VzIGhlcmUuXG5cdFx0ICogQHJldHVybiB7Q1NTUHJvcFR3ZWVuPX0gRmlyc3QgQ1NTUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdFxuXHRcdCAqL1xuXHRcdHAucGFyc2VDb21wbGV4ID0gZnVuY3Rpb24odCwgYiwgZSwgcHQsIHBsdWdpbiwgc2V0UmF0aW8pIHtcblx0XHRcdHZhciBrd2QgPSB0aGlzLmtleXdvcmQsXG5cdFx0XHRcdGksIGJhLCBlYSwgbCwgYmksIGVpO1xuXHRcdFx0Ly9pZiB0aGlzIFNwZWNpYWxQcm9wJ3MgdmFsdWUgY2FuIGNvbnRhaW4gYSBjb21tYS1kZWxpbWl0ZWQgbGlzdCBvZiB2YWx1ZXMgKGxpa2UgYm94U2hhZG93IG9yIHRleHRTaGFkb3cpLCB3ZSBtdXN0IHBhcnNlIHRoZW0gaW4gYSBzcGVjaWFsIHdheSwgYW5kIGxvb2sgZm9yIGEga2V5d29yZCAobGlrZSBcImluc2V0XCIgZm9yIGJveFNoYWRvdykgYW5kIGVuc3VyZSB0aGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyBCT1RIIGhhdmUgaXQgaWYgdGhlIGVuZCBkZWZpbmVzIGl0IGFzIHN1Y2guIFdlIGFsc28gbXVzdCBlbnN1cmUgdGhhdCB0aGVyZSBhcmUgYW4gZXF1YWwgbnVtYmVyIG9mIHZhbHVlcyBzcGVjaWZpZWQgKHdlIGNhbid0IHR3ZWVuIDEgYm94U2hhZG93IHRvIDMgZm9yIGV4YW1wbGUpXG5cdFx0XHRpZiAodGhpcy5tdWx0aSkgaWYgKF9jb21tYXNPdXRzaWRlUGFyZW5FeHAudGVzdChlKSB8fCBfY29tbWFzT3V0c2lkZVBhcmVuRXhwLnRlc3QoYikpIHtcblx0XHRcdFx0YmEgPSBiLnJlcGxhY2UoX2NvbW1hc091dHNpZGVQYXJlbkV4cCwgXCJ8XCIpLnNwbGl0KFwifFwiKTtcblx0XHRcdFx0ZWEgPSBlLnJlcGxhY2UoX2NvbW1hc091dHNpZGVQYXJlbkV4cCwgXCJ8XCIpLnNwbGl0KFwifFwiKTtcblx0XHRcdH0gZWxzZSBpZiAoa3dkKSB7XG5cdFx0XHRcdGJhID0gW2JdO1xuXHRcdFx0XHRlYSA9IFtlXTtcblx0XHRcdH1cblx0XHRcdGlmIChlYSkge1xuXHRcdFx0XHRsID0gKGVhLmxlbmd0aCA+IGJhLmxlbmd0aCkgPyBlYS5sZW5ndGggOiBiYS5sZW5ndGg7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRiID0gYmFbaV0gPSBiYVtpXSB8fCB0aGlzLmRmbHQ7XG5cdFx0XHRcdFx0ZSA9IGVhW2ldID0gZWFbaV0gfHwgdGhpcy5kZmx0O1xuXHRcdFx0XHRcdGlmIChrd2QpIHtcblx0XHRcdFx0XHRcdGJpID0gYi5pbmRleE9mKGt3ZCk7XG5cdFx0XHRcdFx0XHRlaSA9IGUuaW5kZXhPZihrd2QpO1xuXHRcdFx0XHRcdFx0aWYgKGJpICE9PSBlaSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZWkgPT09IC0xKSB7IC8vaWYgdGhlIGtleXdvcmQgaXNuJ3QgaW4gdGhlIGVuZCB2YWx1ZSwgcmVtb3ZlIGl0IGZyb20gdGhlIGJlZ2lubmluZyBvbmUuXG5cdFx0XHRcdFx0XHRcdFx0YmFbaV0gPSBiYVtpXS5zcGxpdChrd2QpLmpvaW4oXCJcIik7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYmkgPT09IC0xKSB7IC8vaWYgdGhlIGtleXdvcmQgaXNuJ3QgaW4gdGhlIGJlZ2lubmluZywgYWRkIGl0LlxuXHRcdFx0XHRcdFx0XHRcdGJhW2ldICs9IFwiIFwiICsga3dkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGIgPSBiYS5qb2luKFwiLCBcIik7XG5cdFx0XHRcdGUgPSBlYS5qb2luKFwiLCBcIik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gX3BhcnNlQ29tcGxleCh0LCB0aGlzLnAsIGIsIGUsIHRoaXMuY2xycywgdGhpcy5kZmx0LCBwdCwgdGhpcy5wciwgcGx1Z2luLCBzZXRSYXRpbyk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEFjY2VwdHMgYSB0YXJnZXQgYW5kIGVuZCB2YWx1ZSBhbmQgc3BpdHMgYmFjayBhIENTU1Byb3BUd2VlbiB0aGF0IGhhcyBiZWVuIGluc2VydGVkIGludG8gdGhlIENTU1BsdWdpbidzIGxpbmtlZCBsaXN0IGFuZCBjb25mb3JtcyB3aXRoIGFsbCB0aGUgY29udmVudGlvbnMgd2UgdXNlIGludGVybmFsbHksIGxpa2UgdHlwZTotMSwgMCwgMSwgb3IgMiwgc2V0dGluZyB1cCBhbnkgZXh0cmEgcHJvcGVydHkgdHdlZW5zLCBwcmlvcml0eSwgZXRjLiBGb3IgZXhhbXBsZSwgaWYgd2UgaGF2ZSBhIGJveFNoYWRvdyBTcGVjaWFsUHJvcCBhbmQgY2FsbDpcblx0XHQgKiB0aGlzLl9maXJzdFBUID0gc3AucGFyc2UoZWxlbWVudCwgXCI1cHggMTBweCAyMHB4IHJnYigyNTUwLDEwMiw1MSlcIiwgXCJib3hTaGFkb3dcIiwgdGhpcyk7XG5cdFx0ICogSXQgc2hvdWxkIGZpZ3VyZSBvdXQgdGhlIHN0YXJ0aW5nIHZhbHVlIG9mIHRoZSBlbGVtZW50J3MgYm94U2hhZG93LCBjb21wYXJlIGl0IHRvIHRoZSBwcm92aWRlZCBlbmQgdmFsdWUgYW5kIGNyZWF0ZSBhbGwgdGhlIG5lY2Vzc2FyeSBDU1NQcm9wVHdlZW5zIG9mIHRoZSBhcHByb3ByaWF0ZSB0eXBlcyB0byB0d2VlbiB0aGUgYm94U2hhZG93LiBUaGUgQ1NTUHJvcFR3ZWVuIHRoYXQgZ2V0cyBzcGl0IGJhY2sgc2hvdWxkIGFscmVhZHkgYmUgaW5zZXJ0ZWQgaW50byB0aGUgbGlua2VkIGxpc3QgKHRoZSA0dGggcGFyYW1ldGVyIGlzIHRoZSBjdXJyZW50IGhlYWQsIHNvIHByZXBlbmQgdG8gdGhhdCkuXG5cdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCBvYmplY3Qgd2hvc2UgcHJvcGVydHkgaXMgYmVpbmcgdHdlZW5lZFxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBlIEVuZCB2YWx1ZSBhcyBwcm92aWRlZCBpbiB0aGUgdmFycyBvYmplY3QgKHR5cGljYWxseSBhIHN0cmluZywgYnV0IG5vdCBhbHdheXMgLSBsaWtlIGEgdGhyb3dQcm9wcyB3b3VsZCBiZSBhbiBvYmplY3QpLlxuXHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gcCBQcm9wZXJ0eSBuYW1lXG5cdFx0ICogQHBhcmFtIHshQ1NTUGx1Z2lufSBjc3NwIFRoZSBDU1NQbHVnaW4gaW5zdGFuY2UgdGhhdCBzaG91bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdHdlZW4uXG5cdFx0ICogQHBhcmFtIHs/Q1NTUHJvcFR3ZWVufSBwdCBUaGUgQ1NTUHJvcFR3ZWVuIHRoYXQgaXMgdGhlIGN1cnJlbnQgaGVhZCBvZiB0aGUgbGlua2VkIGxpc3QgKHdlJ2xsIHByZXBlbmQgdG8gaXQpXG5cdFx0ICogQHBhcmFtIHtUd2VlblBsdWdpbj19IHBsdWdpbiBJZiBhIHBsdWdpbiB3aWxsIGJlIHVzZWQgdG8gdHdlZW4gdGhlIHBhcnNlZCB2YWx1ZSwgdGhpcyBpcyB0aGUgcGx1Z2luIGluc3RhbmNlLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0PX0gdmFycyBPcmlnaW5hbCB2YXJzIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhIGZvciBwYXJzaW5nLlxuXHRcdCAqIEByZXR1cm4ge0NTU1Byb3BUd2Vlbn0gVGhlIGZpcnN0IENTU1Byb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3Qgd2hpY2ggaW5jbHVkZXMgdGhlIG5ldyBvbmUocykgYWRkZWQgYnkgdGhlIHBhcnNlKCkgY2FsbC5cblx0XHQgKi9cblx0XHRwLnBhcnNlID0gZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbiwgdmFycykge1xuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VDb21wbGV4KHQuc3R5bGUsIHRoaXMuZm9ybWF0KF9nZXRTdHlsZSh0LCB0aGlzLnAsIF9jcywgZmFsc2UsIHRoaXMuZGZsdCkpLCB0aGlzLmZvcm1hdChlKSwgcHQsIHBsdWdpbik7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFJlZ2lzdGVycyBhIHNwZWNpYWwgcHJvcGVydHkgdGhhdCBzaG91bGQgYmUgaW50ZXJjZXB0ZWQgZnJvbSBhbnkgXCJjc3NcIiBvYmplY3RzIGRlZmluZWQgaW4gdHdlZW5zLiBUaGlzIGFsbG93cyB5b3UgdG8gaGFuZGxlIHRoZW0gaG93ZXZlciB5b3Ugd2FudCB3aXRob3V0IENTU1BsdWdpbiBkb2luZyBpdCBmb3IgeW91LiBUaGUgMm5kIHBhcmFtZXRlciBzaG91bGQgYmUgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgMyBwYXJhbWV0ZXJzOlxuXHRcdCAqICAxKSBUYXJnZXQgb2JqZWN0IHdob3NlIHByb3BlcnR5IHNob3VsZCBiZSB0d2VlbmVkICh0eXBpY2FsbHkgYSBET00gZWxlbWVudClcblx0XHQgKiAgMikgVGhlIGVuZC9kZXN0aW5hdGlvbiB2YWx1ZSAoY291bGQgYmUgYSBzdHJpbmcsIG51bWJlciwgb2JqZWN0LCBvciB3aGF0ZXZlciB5b3Ugd2FudClcblx0XHQgKiAgMykgVGhlIHR3ZWVuIGluc3RhbmNlICh5b3UgcHJvYmFibHkgZG9uJ3QgbmVlZCB0byB3b3JyeSBhYm91dCB0aGlzLCBidXQgaXQgY2FuIGJlIHVzZWZ1bCBmb3IgbG9va2luZyB1cCBpbmZvcm1hdGlvbiBsaWtlIHRoZSBkdXJhdGlvbilcblx0XHQgKlxuXHRcdCAqIFRoZW4sIHlvdXIgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGVhY2ggdGltZSB0aGUgdHdlZW4gZ2V0cyByZW5kZXJlZCwgcGFzc2luZyBhIG51bWVyaWMgXCJyYXRpb1wiIHBhcmFtZXRlciB0byB5b3VyIGZ1bmN0aW9uIHRoYXQgaW5kaWNhdGVzIHRoZSBjaGFuZ2UgZmFjdG9yICh1c3VhbGx5IGJldHdlZW4gMCBhbmQgMSkuIEZvciBleGFtcGxlOlxuXHRcdCAqXG5cdFx0ICogQ1NTUGx1Z2luLnJlZ2lzdGVyU3BlY2lhbFByb3AoXCJteUN1c3RvbVByb3BcIiwgZnVuY3Rpb24odGFyZ2V0LCB2YWx1ZSwgdHdlZW4pIHtcblx0XHQgKiAgICAgIHZhciBzdGFydCA9IHRhcmdldC5zdHlsZS53aWR0aDtcblx0XHQgKiAgICAgIHJldHVybiBmdW5jdGlvbihyYXRpbykge1xuXHRcdCAqICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUud2lkdGggPSAoc3RhcnQgKyB2YWx1ZSAqIHJhdGlvKSArIFwicHhcIjtcblx0XHQgKiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXQgd2lkdGggdG8gXCIgKyB0YXJnZXQuc3R5bGUud2lkdGgpO1xuXHRcdCAqICAgICAgICAgIH1cblx0XHQgKiB9LCAwKTtcblx0XHQgKlxuXHRcdCAqIFRoZW4sIHdoZW4gSSBkbyB0aGlzIHR3ZWVuLCBpdCB3aWxsIHRyaWdnZXIgbXkgc3BlY2lhbCBwcm9wZXJ0eTpcblx0XHQgKlxuXHRcdCAqIFR3ZWVuTGl0ZS50byhlbGVtZW50LCAxLCB7Y3NzOntteUN1c3RvbVByb3A6MTAwfX0pO1xuXHRcdCAqXG5cdFx0ICogSW4gdGhlIGV4YW1wbGUsIG9mIGNvdXJzZSwgd2UncmUganVzdCBjaGFuZ2luZyB0aGUgd2lkdGgsIGJ1dCB5b3UgY2FuIGRvIGFueXRoaW5nIHlvdSB3YW50LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHshc3RyaW5nfSBuYW1lIFByb3BlcnR5IG5hbWUgKG9yIGNvbW1hLWRlbGltaXRlZCBsaXN0IG9mIHByb3BlcnR5IG5hbWVzKSB0aGF0IHNob3VsZCBiZSBpbnRlcmNlcHRlZCBhbmQgaGFuZGxlZCBieSB5b3VyIGZ1bmN0aW9uLiBGb3IgZXhhbXBsZSwgaWYgSSBkZWZpbmUgXCJteUN1c3RvbVByb3BcIiwgdGhlbiBpdCB3b3VsZCBoYW5kbGUgdGhhdCBwb3J0aW9uIG9mIHRoZSBmb2xsb3dpbmcgdHdlZW46IFR3ZWVuTGl0ZS50byhlbGVtZW50LCAxLCB7Y3NzOntteUN1c3RvbVByb3A6MTAwfX0pXG5cdFx0ICogQHBhcmFtIHshZnVuY3Rpb24oT2JqZWN0LCBPYmplY3QsIE9iamVjdCwgc3RyaW5nKTpmdW5jdGlvbihudW1iZXIpfSBvbkluaXRUd2VlbiBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIGEgdHdlZW4gb2YgdGhpcyBzcGVjaWFsIHByb3BlcnR5IGlzIHBlcmZvcm1lZC4gVGhlIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSA0IHBhcmFtZXRlcnM6IDEpIFRhcmdldCBvYmplY3QgdGhhdCBzaG91bGQgYmUgdHdlZW5lZCwgMikgVmFsdWUgdGhhdCB3YXMgcGFzc2VkIHRvIHRoZSB0d2VlbiwgMykgVGhlIHR3ZWVuIGluc3RhbmNlIGl0c2VsZiAocmFyZWx5IHVzZWQpLCBhbmQgNCkgVGhlIHByb3BlcnR5IG5hbWUgdGhhdCdzIGJlaW5nIHR3ZWVuZWQuIFlvdXIgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCBvbiBldmVyeSB1cGRhdGUgb2YgdGhlIHR3ZWVuLiBUaGF0IGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSBhIHNpbmdsZSBwYXJhbWV0ZXIgdGhhdCBpcyBhIFwiY2hhbmdlIGZhY3RvclwiIHZhbHVlICh0eXBpY2FsbHkgYmV0d2VlbiAwIGFuZCAxKSBpbmRpY2F0aW5nIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFzIGEgcmF0aW8uIFlvdSBjYW4gdXNlIHRoaXMgdG8gZGV0ZXJtaW5lIGhvdyB0byBzZXQgdGhlIHZhbHVlcyBhcHByb3ByaWF0ZWx5IGluIHlvdXIgZnVuY3Rpb24uXG5cdFx0ICogQHBhcmFtIHtudW1iZXI9fSBwcmlvcml0eSBQcmlvcml0eSB0aGF0IGhlbHBzIHRoZSBlbmdpbmUgZGV0ZXJtaW5lIHRoZSBvcmRlciBpbiB3aGljaCB0byBzZXQgdGhlIHByb3BlcnRpZXMgKGRlZmF1bHQ6IDApLiBIaWdoZXIgcHJpb3JpdHkgcHJvcGVydGllcyB3aWxsIGJlIHVwZGF0ZWQgYmVmb3JlIGxvd2VyIHByaW9yaXR5IG9uZXMuXG5cdFx0ICovXG5cdFx0Q1NTUGx1Z2luLnJlZ2lzdGVyU3BlY2lhbFByb3AgPSBmdW5jdGlvbihuYW1lLCBvbkluaXRUd2VlbiwgcHJpb3JpdHkpIHtcblx0XHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChuYW1lLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdFx0dmFyIHJ2ID0gbmV3IENTU1Byb3BUd2Vlbih0LCBwLCAwLCAwLCBwdCwgMiwgcCwgZmFsc2UsIHByaW9yaXR5KTtcblx0XHRcdFx0cnYucGx1Z2luID0gcGx1Z2luO1xuXHRcdFx0XHRydi5zZXRSYXRpbyA9IG9uSW5pdFR3ZWVuKHQsIGUsIGNzc3AuX3R3ZWVuLCBwKTtcblx0XHRcdFx0cmV0dXJuIHJ2O1xuXHRcdFx0fSwgcHJpb3JpdHk6cHJpb3JpdHl9KTtcblx0XHR9O1xuXG5cblxuXG5cblxuXHRcdC8vdHJhbnNmb3JtLXJlbGF0ZWQgbWV0aG9kcyBhbmQgcHJvcGVydGllc1xuXHRcdENTU1BsdWdpbi51c2VTVkdUcmFuc2Zvcm1BdHRyID0gX2lzU2FmYXJpIHx8IF9pc0ZpcmVmb3g7IC8vU2FmYXJpIGFuZCBGaXJlZm94IGJvdGggaGF2ZSBzb21lIHJlbmRlcmluZyBidWdzIHdoZW4gYXBwbHlpbmcgQ1NTIHRyYW5zZm9ybXMgdG8gU1ZHIGVsZW1lbnRzLCBzbyBkZWZhdWx0IHRvIHVzaW5nIHRoZSBcInRyYW5zZm9ybVwiIGF0dHJpYnV0ZSBpbnN0ZWFkICh1c2VycyBjYW4gb3ZlcnJpZGUgdGhpcykuXG5cdFx0dmFyIF90cmFuc2Zvcm1Qcm9wcyA9IChcInNjYWxlWCxzY2FsZVksc2NhbGVaLHgseSx6LHNrZXdYLHNrZXdZLHJvdGF0aW9uLHJvdGF0aW9uWCxyb3RhdGlvblkscGVyc3BlY3RpdmUseFBlcmNlbnQseVBlcmNlbnRcIikuc3BsaXQoXCIsXCIpLFxuXHRcdFx0X3RyYW5zZm9ybVByb3AgPSBfY2hlY2tQcm9wUHJlZml4KFwidHJhbnNmb3JtXCIpLCAvL3RoZSBKYXZhc2NyaXB0IChjYW1lbENhc2UpIHRyYW5zZm9ybSBwcm9wZXJ0eSwgbGlrZSBtc1RyYW5zZm9ybSwgV2Via2l0VHJhbnNmb3JtLCBNb3pUcmFuc2Zvcm0sIG9yIE9UcmFuc2Zvcm0uXG5cdFx0XHRfdHJhbnNmb3JtUHJvcENTUyA9IF9wcmVmaXhDU1MgKyBcInRyYW5zZm9ybVwiLFxuXHRcdFx0X3RyYW5zZm9ybU9yaWdpblByb3AgPSBfY2hlY2tQcm9wUHJlZml4KFwidHJhbnNmb3JtT3JpZ2luXCIpLFxuXHRcdFx0X3N1cHBvcnRzM0QgPSAoX2NoZWNrUHJvcFByZWZpeChcInBlcnNwZWN0aXZlXCIpICE9PSBudWxsKSxcblx0XHRcdFRyYW5zZm9ybSA9IF9pbnRlcm5hbHMuVHJhbnNmb3JtID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMucGVyc3BlY3RpdmUgPSBwYXJzZUZsb2F0KENTU1BsdWdpbi5kZWZhdWx0VHJhbnNmb3JtUGVyc3BlY3RpdmUpIHx8IDA7XG5cdFx0XHRcdHRoaXMuZm9yY2UzRCA9IChDU1NQbHVnaW4uZGVmYXVsdEZvcmNlM0QgPT09IGZhbHNlIHx8ICFfc3VwcG9ydHMzRCkgPyBmYWxzZSA6IENTU1BsdWdpbi5kZWZhdWx0Rm9yY2UzRCB8fCBcImF1dG9cIjtcblx0XHRcdH0sXG5cdFx0XHRfU1ZHRWxlbWVudCA9IHdpbmRvdy5TVkdFbGVtZW50LFxuXHRcdFx0X3VzZVNWR1RyYW5zZm9ybUF0dHIsXG5cdFx0XHQvL1NvbWUgYnJvd3NlcnMgKGxpa2UgRmlyZWZveCBhbmQgSUUpIGRvbid0IGhvbm9yIHRyYW5zZm9ybS1vcmlnaW4gcHJvcGVybHkgaW4gU1ZHIGVsZW1lbnRzLCBzbyB3ZSBuZWVkIHRvIG1hbnVhbGx5IGFkanVzdCB0aGUgbWF0cml4IGFjY29yZGluZ2x5LiBXZSBmZWF0dXJlIGRldGVjdCBoZXJlIHJhdGhlciB0aGFuIGFsd2F5cyBkb2luZyB0aGUgY29udmVyc2lvbiBmb3IgY2VydGFpbiBicm93c2VycyBiZWNhdXNlIHRoZXkgbWF5IGZpeCB0aGUgcHJvYmxlbSBhdCBzb21lIHBvaW50IGluIHRoZSBmdXR1cmUuXG5cblx0XHRcdF9jcmVhdGVTVkcgPSBmdW5jdGlvbih0eXBlLCBjb250YWluZXIsIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0dmFyIGVsZW1lbnQgPSBfZG9jLmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIHR5cGUpLFxuXHRcdFx0XHRcdHJlZyA9IC8oW2Etel0pKFtBLVpdKS9nLFxuXHRcdFx0XHRcdHA7XG5cdFx0XHRcdGZvciAocCBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCBwLnJlcGxhY2UocmVnLCBcIiQxLSQyXCIpLnRvTG93ZXJDYXNlKCksIGF0dHJpYnV0ZXNbcF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtZW50KTtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdFx0XHR9LFxuXHRcdFx0X2RvY0VsZW1lbnQgPSBfZG9jLmRvY3VtZW50RWxlbWVudCxcblx0XHRcdF9mb3JjZVNWR1RyYW5zZm9ybUF0dHIgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vSUUgYW5kIEFuZHJvaWQgc3RvY2sgZG9uJ3Qgc3VwcG9ydCBDU1MgdHJhbnNmb3JtcyBvbiBTVkcgZWxlbWVudHMsIHNvIHdlIG11c3Qgd3JpdGUgdGhlbSB0byB0aGUgXCJ0cmFuc2Zvcm1cIiBhdHRyaWJ1dGUuIFdlIHBvcHVsYXRlIHRoaXMgdmFyaWFibGUgaW4gdGhlIF9wYXJzZVRyYW5zZm9ybSgpIG1ldGhvZCwgYW5kIG9ubHkgaWYvd2hlbiB3ZSBjb21lIGFjcm9zcyBhbiBTVkcgZWxlbWVudFxuXHRcdFx0XHR2YXIgZm9yY2UgPSBfaWVWZXJzIHx8ICgvQW5kcm9pZC9pLnRlc3QoX2FnZW50KSAmJiAhd2luZG93LmNocm9tZSksXG5cdFx0XHRcdFx0c3ZnLCByZWN0LCB3aWR0aDtcblx0XHRcdFx0aWYgKF9kb2MuY3JlYXRlRWxlbWVudE5TICYmICFmb3JjZSkgeyAvL0lFOCBhbmQgZWFybGllciBkb2Vzbid0IHN1cHBvcnQgU1ZHIGFueXdheVxuXHRcdFx0XHRcdHN2ZyA9IF9jcmVhdGVTVkcoXCJzdmdcIiwgX2RvY0VsZW1lbnQpO1xuXHRcdFx0XHRcdHJlY3QgPSBfY3JlYXRlU1ZHKFwicmVjdFwiLCBzdmcsIHt3aWR0aDoxMDAsIGhlaWdodDo1MCwgeDoxMDB9KTtcblx0XHRcdFx0XHR3aWR0aCA9IHJlY3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cdFx0XHRcdFx0cmVjdC5zdHlsZVtfdHJhbnNmb3JtT3JpZ2luUHJvcF0gPSBcIjUwJSA1MCVcIjtcblx0XHRcdFx0XHRyZWN0LnN0eWxlW190cmFuc2Zvcm1Qcm9wXSA9IFwic2NhbGVYKDAuNSlcIjtcblx0XHRcdFx0XHRmb3JjZSA9ICh3aWR0aCA9PT0gcmVjdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAmJiAhKF9pc0ZpcmVmb3ggJiYgX3N1cHBvcnRzM0QpKTsgLy9ub3RlOiBGaXJlZm94IGZhaWxzIHRoZSB0ZXN0IGV2ZW4gdGhvdWdoIGl0IGRvZXMgc3VwcG9ydCBDU1MgdHJhbnNmb3JtcyBpbiAzRC4gU2luY2Ugd2UgY2FuJ3QgcHVzaCAzRCBzdHVmZiBpbnRvIHRoZSB0cmFuc2Zvcm0gYXR0cmlidXRlLCB3ZSBmb3JjZSBGaXJlZm94IHRvIHBhc3MgdGhlIHRlc3QgaGVyZSAoYXMgbG9uZyBhcyBpdCBkb2VzIHRydWx5IHN1cHBvcnQgM0QpLlxuXHRcdFx0XHRcdF9kb2NFbGVtZW50LnJlbW92ZUNoaWxkKHN2Zyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZvcmNlO1xuXHRcdFx0fSkoKSxcblx0XHRcdF9wYXJzZVNWR09yaWdpbiA9IGZ1bmN0aW9uKGUsIGxvY2FsLCBkZWNvcmF0ZWUsIGFic29sdXRlLCBzbW9vdGhPcmlnaW4pIHtcblx0XHRcdFx0dmFyIHRtID0gZS5fZ3NUcmFuc2Zvcm0sXG5cdFx0XHRcdFx0bSA9IF9nZXRNYXRyaXgoZSwgdHJ1ZSksXG5cdFx0XHRcdFx0diwgeCwgeSwgeE9yaWdpbiwgeU9yaWdpbiwgYSwgYiwgYywgZCwgdHgsIHR5LCBkZXRlcm1pbmFudCwgeE9yaWdpbk9sZCwgeU9yaWdpbk9sZDtcblx0XHRcdFx0aWYgKHRtKSB7XG5cdFx0XHRcdFx0eE9yaWdpbk9sZCA9IHRtLnhPcmlnaW47IC8vcmVjb3JkIHRoZSBvcmlnaW5hbCB2YWx1ZXMgYmVmb3JlIHdlIGFsdGVyIHRoZW0uXG5cdFx0XHRcdFx0eU9yaWdpbk9sZCA9IHRtLnlPcmlnaW47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFhYnNvbHV0ZSB8fCAodiA9IGFic29sdXRlLnNwbGl0KFwiIFwiKSkubGVuZ3RoIDwgMikge1xuXHRcdFx0XHRcdGIgPSBlLmdldEJCb3goKTtcblx0XHRcdFx0XHRsb2NhbCA9IF9wYXJzZVBvc2l0aW9uKGxvY2FsKS5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0diA9IFsobG9jYWxbMF0uaW5kZXhPZihcIiVcIikgIT09IC0xID8gcGFyc2VGbG9hdChsb2NhbFswXSkgLyAxMDAgKiBiLndpZHRoIDogcGFyc2VGbG9hdChsb2NhbFswXSkpICsgYi54LFxuXHRcdFx0XHRcdFx0IChsb2NhbFsxXS5pbmRleE9mKFwiJVwiKSAhPT0gLTEgPyBwYXJzZUZsb2F0KGxvY2FsWzFdKSAvIDEwMCAqIGIuaGVpZ2h0IDogcGFyc2VGbG9hdChsb2NhbFsxXSkpICsgYi55XTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWNvcmF0ZWUueE9yaWdpbiA9IHhPcmlnaW4gPSBwYXJzZUZsb2F0KHZbMF0pO1xuXHRcdFx0XHRkZWNvcmF0ZWUueU9yaWdpbiA9IHlPcmlnaW4gPSBwYXJzZUZsb2F0KHZbMV0pO1xuXHRcdFx0XHRpZiAoYWJzb2x1dGUgJiYgbSAhPT0gX2lkZW50aXR5MkRNYXRyaXgpIHsgLy9pZiBzdmdPcmlnaW4gaXMgYmVpbmcgc2V0LCB3ZSBtdXN0IGludmVydCB0aGUgbWF0cml4IGFuZCBkZXRlcm1pbmUgd2hlcmUgdGhlIGFic29sdXRlIHBvaW50IGlzLCBmYWN0b3JpbmcgaW4gdGhlIGN1cnJlbnQgdHJhbnNmb3Jtcy4gT3RoZXJ3aXNlLCB0aGUgc3ZnT3JpZ2luIHdvdWxkIGJlIGJhc2VkIG9uIHRoZSBlbGVtZW50J3Mgbm9uLXRyYW5zZm9ybWVkIHBvc2l0aW9uIG9uIHRoZSBjYW52YXMuXG5cdFx0XHRcdFx0YSA9IG1bMF07XG5cdFx0XHRcdFx0YiA9IG1bMV07XG5cdFx0XHRcdFx0YyA9IG1bMl07XG5cdFx0XHRcdFx0ZCA9IG1bM107XG5cdFx0XHRcdFx0dHggPSBtWzRdO1xuXHRcdFx0XHRcdHR5ID0gbVs1XTtcblx0XHRcdFx0XHRkZXRlcm1pbmFudCA9IChhICogZCAtIGIgKiBjKTtcblx0XHRcdFx0XHR4ID0geE9yaWdpbiAqIChkIC8gZGV0ZXJtaW5hbnQpICsgeU9yaWdpbiAqICgtYyAvIGRldGVybWluYW50KSArICgoYyAqIHR5IC0gZCAqIHR4KSAvIGRldGVybWluYW50KTtcblx0XHRcdFx0XHR5ID0geE9yaWdpbiAqICgtYiAvIGRldGVybWluYW50KSArIHlPcmlnaW4gKiAoYSAvIGRldGVybWluYW50KSAtICgoYSAqIHR5IC0gYiAqIHR4KSAvIGRldGVybWluYW50KTtcblx0XHRcdFx0XHR4T3JpZ2luID0gZGVjb3JhdGVlLnhPcmlnaW4gPSB2WzBdID0geDtcblx0XHRcdFx0XHR5T3JpZ2luID0gZGVjb3JhdGVlLnlPcmlnaW4gPSB2WzFdID0geTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodG0pIHsgLy9hdm9pZCBqdW1wIHdoZW4gdHJhbnNmb3JtT3JpZ2luIGlzIGNoYW5nZWQgLSBhZGp1c3QgdGhlIHgveSB2YWx1ZXMgYWNjb3JkaW5nbHlcblx0XHRcdFx0XHRpZiAoc21vb3RoT3JpZ2luIHx8IChzbW9vdGhPcmlnaW4gIT09IGZhbHNlICYmIENTU1BsdWdpbi5kZWZhdWx0U21vb3RoT3JpZ2luICE9PSBmYWxzZSkpIHtcblx0XHRcdFx0XHRcdHggPSB4T3JpZ2luIC0geE9yaWdpbk9sZDtcblx0XHRcdFx0XHRcdHkgPSB5T3JpZ2luIC0geU9yaWdpbk9sZDtcblx0XHRcdFx0XHRcdC8vb3JpZ2luYWxseSwgd2Ugc2ltcGx5IGFkanVzdGVkIHRoZSB4IGFuZCB5IHZhbHVlcywgYnV0IHRoYXQgd291bGQgY2F1c2UgcHJvYmxlbXMgaWYsIGZvciBleGFtcGxlLCB5b3UgY3JlYXRlZCBhIHJvdGF0aW9uYWwgdHdlZW4gcGFydC13YXkgdGhyb3VnaCBhbiB4L3kgdHdlZW4uIE1hbmFnaW5nIHRoZSBvZmZzZXQgaW4gYSBzZXBhcmF0ZSB2YXJpYWJsZSBnaXZlcyB1cyB1bHRpbWF0ZSBmbGV4aWJpbGl0eS5cblx0XHRcdFx0XHRcdC8vdG0ueCAtPSB4IC0gKHggKiBtWzBdICsgeSAqIG1bMl0pO1xuXHRcdFx0XHRcdFx0Ly90bS55IC09IHkgLSAoeCAqIG1bMV0gKyB5ICogbVszXSk7XG5cdFx0XHRcdFx0XHR0bS54T2Zmc2V0ICs9ICh4ICogbVswXSArIHkgKiBtWzJdKSAtIHg7XG5cdFx0XHRcdFx0XHR0bS55T2Zmc2V0ICs9ICh4ICogbVsxXSArIHkgKiBtWzNdKSAtIHk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRtLnhPZmZzZXQgPSB0bS55T2Zmc2V0ID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXN2Zy1vcmlnaW5cIiwgdi5qb2luKFwiIFwiKSk7XG5cdFx0XHR9LFxuXHRcdFx0X2lzU1ZHID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRyZXR1cm4gISEoX1NWR0VsZW1lbnQgJiYgdHlwZW9mKGUuZ2V0QkJveCkgPT09IFwiZnVuY3Rpb25cIiAmJiBlLmdldENUTSAmJiAoIWUucGFyZW50Tm9kZSB8fCAoZS5wYXJlbnROb2RlLmdldEJCb3ggJiYgZS5wYXJlbnROb2RlLmdldENUTSkpKTtcblx0XHRcdH0sXG5cdFx0XHRfaWRlbnRpdHkyRE1hdHJpeCA9IFsxLDAsMCwxLDAsMF0sXG5cdFx0XHRfZ2V0TWF0cml4ID0gZnVuY3Rpb24oZSwgZm9yY2UyRCkge1xuXHRcdFx0XHR2YXIgdG0gPSBlLl9nc1RyYW5zZm9ybSB8fCBuZXcgVHJhbnNmb3JtKCksXG5cdFx0XHRcdFx0cm5kID0gMTAwMDAwLFxuXHRcdFx0XHRcdGlzRGVmYXVsdCwgcywgbSwgbiwgZGVjO1xuXHRcdFx0XHRpZiAoX3RyYW5zZm9ybVByb3ApIHtcblx0XHRcdFx0XHRzID0gX2dldFN0eWxlKGUsIF90cmFuc2Zvcm1Qcm9wQ1NTLCBudWxsLCB0cnVlKTtcblx0XHRcdFx0fSBlbHNlIGlmIChlLmN1cnJlbnRTdHlsZSkge1xuXHRcdFx0XHRcdC8vZm9yIG9sZGVyIHZlcnNpb25zIG9mIElFLCB3ZSBuZWVkIHRvIGludGVycHJldCB0aGUgZmlsdGVyIHBvcnRpb24gdGhhdCBpcyBpbiB0aGUgZm9ybWF0OiBwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuTWF0cml4KE0xMT02LjEyMzIzMzk5NTczNjc2NmUtMTcsIE0xMj0tMSwgTTIxPTEsIE0yMj02LjEyMzIzMzk5NTczNjc2NmUtMTcsIHNpemluZ01ldGhvZD0nYXV0byBleHBhbmQnKSBOb3RpY2UgdGhhdCB3ZSBuZWVkIHRvIHN3YXAgYiBhbmQgYyBjb21wYXJlZCB0byBhIG5vcm1hbCBtYXRyaXguXG5cdFx0XHRcdFx0cyA9IGUuY3VycmVudFN0eWxlLmZpbHRlci5tYXRjaChfaWVHZXRNYXRyaXhFeHApO1xuXHRcdFx0XHRcdHMgPSAocyAmJiBzLmxlbmd0aCA9PT0gNCkgPyBbc1swXS5zdWJzdHIoNCksIE51bWJlcihzWzJdLnN1YnN0cig0KSksIE51bWJlcihzWzFdLnN1YnN0cig0KSksIHNbM10uc3Vic3RyKDQpLCAodG0ueCB8fCAwKSwgKHRtLnkgfHwgMCldLmpvaW4oXCIsXCIpIDogXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpc0RlZmF1bHQgPSAoIXMgfHwgcyA9PT0gXCJub25lXCIgfHwgcyA9PT0gXCJtYXRyaXgoMSwgMCwgMCwgMSwgMCwgMClcIik7XG5cdFx0XHRcdGlmICh0bS5zdmcgfHwgKGUuZ2V0QkJveCAmJiBfaXNTVkcoZSkpKSB7XG5cdFx0XHRcdFx0aWYgKGlzRGVmYXVsdCAmJiAoZS5zdHlsZVtfdHJhbnNmb3JtUHJvcF0gKyBcIlwiKS5pbmRleE9mKFwibWF0cml4XCIpICE9PSAtMSkgeyAvL3NvbWUgYnJvd3NlcnMgKGxpa2UgQ2hyb21lIDQwKSBkb24ndCBjb3JyZWN0bHkgcmVwb3J0IHRyYW5zZm9ybXMgdGhhdCBhcmUgYXBwbGllZCBpbmxpbmUgb24gYW4gU1ZHIGVsZW1lbnQgKHRoZXkgZG9uJ3QgZ2V0IGluY2x1ZGVkIGluIHRoZSBjb21wdXRlZCBzdHlsZSksIHNvIHdlIGRvdWJsZS1jaGVjayBoZXJlIGFuZCBhY2NlcHQgbWF0cml4IHZhbHVlc1xuXHRcdFx0XHRcdFx0cyA9IGUuc3R5bGVbX3RyYW5zZm9ybVByb3BdO1xuXHRcdFx0XHRcdFx0aXNEZWZhdWx0ID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bSA9IGUuZ2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIpO1xuXHRcdFx0XHRcdGlmIChpc0RlZmF1bHQgJiYgbSkge1xuXHRcdFx0XHRcdFx0aWYgKG0uaW5kZXhPZihcIm1hdHJpeFwiKSAhPT0gLTEpIHsgLy9qdXN0IGluIGNhc2UgdGhlcmUncyBhIFwidHJhbnNmb3JtXCIgdmFsdWUgc3BlY2lmaWVkIGFzIGFuIGF0dHJpYnV0ZSBpbnN0ZWFkIG9mIENTUyBzdHlsZS4gQWNjZXB0IGVpdGhlciBhIG1hdHJpeCgpIG9yIHNpbXBsZSB0cmFuc2xhdGUoKSB2YWx1ZSB0aG91Z2guXG5cdFx0XHRcdFx0XHRcdHMgPSBtO1xuXHRcdFx0XHRcdFx0XHRpc0RlZmF1bHQgPSAwO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChtLmluZGV4T2YoXCJ0cmFuc2xhdGVcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHMgPSBcIm1hdHJpeCgxLDAsMCwxLFwiICsgbS5tYXRjaCgvKD86XFwtfFxcYilbXFxkXFwtXFwuZV0rXFxiL2dpKS5qb2luKFwiLFwiKSArIFwiKVwiO1xuXHRcdFx0XHRcdFx0XHRpc0RlZmF1bHQgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaXNEZWZhdWx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIF9pZGVudGl0eTJETWF0cml4O1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vc3BsaXQgdGhlIG1hdHJpeCB2YWx1ZXMgb3V0IGludG8gYW4gYXJyYXkgKG0gZm9yIG1hdHJpeClcblx0XHRcdFx0bSA9IChzIHx8IFwiXCIpLm1hdGNoKC8oPzpcXC18XFxiKVtcXGRcXC1cXC5lXStcXGIvZ2kpIHx8IFtdO1xuXHRcdFx0XHRpID0gbS5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdG4gPSBOdW1iZXIobVtpXSk7XG5cdFx0XHRcdFx0bVtpXSA9IChkZWMgPSBuIC0gKG4gfD0gMCkpID8gKChkZWMgKiBybmQgKyAoZGVjIDwgMCA/IC0wLjUgOiAwLjUpKSB8IDApIC8gcm5kICsgbiA6IG47IC8vY29udmVydCBzdHJpbmdzIHRvIE51bWJlcnMgYW5kIHJvdW5kIHRvIDUgZGVjaW1hbCBwbGFjZXMgdG8gYXZvaWQgaXNzdWVzIHdpdGggdGlueSBudW1iZXJzLiBSb3VnaGx5IDIweCBmYXN0ZXIgdGhhbiBOdW1iZXIudG9GaXhlZCgpLiBXZSBhbHNvIG11c3QgbWFrZSBzdXJlIHRvIHJvdW5kIGJlZm9yZSBkaXZpZGluZyBzbyB0aGF0IHZhbHVlcyBsaWtlIDAuOTk5OTk5OTk5OSBiZWNvbWUgMSB0byBhdm9pZCBnbGl0Y2hlcyBpbiBicm93c2VyIHJlbmRlcmluZyBhbmQgaW50ZXJwcmV0YXRpb24gb2YgZmxpcHBlZC9yb3RhdGVkIDNEIG1hdHJpY2VzLiBBbmQgZG9uJ3QganVzdCBtdWx0aXBseSB0aGUgbnVtYmVyIGJ5IHJuZCwgZmxvb3IgaXQsIGFuZCB0aGVuIGRpdmlkZSBieSBybmQgYmVjYXVzZSB0aGUgYml0d2lzZSBvcGVyYXRpb25zIG1heCBvdXQgYXQgYSAzMi1iaXQgc2lnbmVkIGludGVnZXIsIHRodXMgaXQgY291bGQgZ2V0IGNsaXBwZWQgYXQgYSByZWxhdGl2ZWx5IGxvdyB2YWx1ZSAobGlrZSAyMiwwMDAuMDAwMDAgZm9yIGV4YW1wbGUpLlxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAoZm9yY2UyRCAmJiBtLmxlbmd0aCA+IDYpID8gW21bMF0sIG1bMV0sIG1bNF0sIG1bNV0sIG1bMTJdLCBtWzEzXV0gOiBtO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBQYXJzZXMgdGhlIHRyYW5zZm9ybSB2YWx1ZXMgZm9yIGFuIGVsZW1lbnQsIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCB4LCB5LCB6LCBzY2FsZVgsIHNjYWxlWSwgc2NhbGVaLCByb3RhdGlvbiwgcm90YXRpb25YLCByb3RhdGlvblksIHNrZXdYLCBhbmQgc2tld1kgcHJvcGVydGllcy4gTm90ZTogYnkgZGVmYXVsdCAoZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMpLCBhbGwgc2tld2luZyBpcyBjb21iaW5lZCBpbnRvIHNrZXdYIGFuZCByb3RhdGlvbiBidXQgc2tld1kgc3RpbGwgaGFzIGEgcGxhY2UgaW4gdGhlIHRyYW5zZm9ybSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gcmVjb3JkIGhvdyBtdWNoIG9mIHRoZSBza2V3IGlzIGF0dHJpYnV0ZWQgdG8gc2tld1ggdnMgc2tld1kuIFJlbWVtYmVyLCBhIHNrZXdZIG9mIDEwIGxvb2tzIHRoZSBzYW1lIGFzIGEgcm90YXRpb24gb2YgMTAgYW5kIHNrZXdYIG9mIC0xMC5cblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCB0YXJnZXQgZWxlbWVudFxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3Q9fSBjcyBjb21wdXRlZCBzdHlsZSBvYmplY3QgKG9wdGlvbmFsKVxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFuPX0gcmVjIGlmIHRydWUsIHRoZSB0cmFuc2Zvcm0gdmFsdWVzIHdpbGwgYmUgcmVjb3JkZWQgdG8gdGhlIHRhcmdldCBlbGVtZW50J3MgX2dzVHJhbnNmb3JtIG9iamVjdCwgbGlrZSB0YXJnZXQuX2dzVHJhbnNmb3JtID0ge3g6MCwgeTowLCB6OjAsIHNjYWxlWDoxLi4ufVxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFuPX0gcGFyc2UgaWYgdHJ1ZSwgd2UnbGwgaWdub3JlIGFueSBfZ3NUcmFuc2Zvcm0gdmFsdWVzIHRoYXQgYWxyZWFkeSBleGlzdCBvbiB0aGUgZWxlbWVudCwgYW5kIGZvcmNlIGEgcmVwYXJzaW5nIG9mIHRoZSBjc3MgKGNhbGN1bGF0ZWQgc3R5bGUpXG5cdFx0XHQgKiBAcmV0dXJuIHtvYmplY3R9IG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgdHJhbnNmb3JtIHByb3BlcnRpZXMvdmFsdWVzIGxpa2Uge3g6MCwgeTowLCB6OjAsIHNjYWxlWDoxLi4ufVxuXHRcdFx0ICovXG5cdFx0XHRfZ2V0VHJhbnNmb3JtID0gX2ludGVybmFscy5nZXRUcmFuc2Zvcm0gPSBmdW5jdGlvbih0LCBjcywgcmVjLCBwYXJzZSkge1xuXHRcdFx0XHRpZiAodC5fZ3NUcmFuc2Zvcm0gJiYgcmVjICYmICFwYXJzZSkge1xuXHRcdFx0XHRcdHJldHVybiB0Ll9nc1RyYW5zZm9ybTsgLy9pZiB0aGUgZWxlbWVudCBhbHJlYWR5IGhhcyBhIF9nc1RyYW5zZm9ybSwgdXNlIHRoYXQuIE5vdGU6IHNvbWUgYnJvd3NlcnMgZG9uJ3QgYWNjdXJhdGVseSByZXR1cm4gdGhlIGNhbGN1bGF0ZWQgc3R5bGUgZm9yIHRoZSB0cmFuc2Zvcm0gKHBhcnRpY3VsYXJseSBmb3IgU1ZHKSwgc28gaXQncyBhbG1vc3QgYWx3YXlzIHNhZmVzdCB0byBqdXN0IHVzZSB0aGUgdmFsdWVzIHdlJ3ZlIGFscmVhZHkgYXBwbGllZCByYXRoZXIgdGhhbiByZS1wYXJzaW5nIHRoaW5ncy5cblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgdG0gPSByZWMgPyB0Ll9nc1RyYW5zZm9ybSB8fCBuZXcgVHJhbnNmb3JtKCkgOiBuZXcgVHJhbnNmb3JtKCksXG5cdFx0XHRcdFx0aW52WCA9ICh0bS5zY2FsZVggPCAwKSwgLy9pbiBvcmRlciB0byBpbnRlcnByZXQgdGhpbmdzIHByb3Blcmx5LCB3ZSBuZWVkIHRvIGtub3cgaWYgdGhlIHVzZXIgYXBwbGllZCBhIG5lZ2F0aXZlIHNjYWxlWCBwcmV2aW91c2x5IHNvIHRoYXQgd2UgY2FuIGFkanVzdCB0aGUgcm90YXRpb24gYW5kIHNrZXdYIGFjY29yZGluZ2x5LiBPdGhlcndpc2UsIGlmIHdlIGFsd2F5cyBpbnRlcnByZXQgYSBmbGlwcGVkIG1hdHJpeCBhcyBhZmZlY3Rpbmcgc2NhbGVZIGFuZCB0aGUgdXNlciBvbmx5IHdhbnRzIHRvIHR3ZWVuIHRoZSBzY2FsZVggb24gbXVsdGlwbGUgc2VxdWVudGlhbCB0d2VlbnMsIGl0IHdvdWxkIGtlZXAgdGhlIG5lZ2F0aXZlIHNjYWxlWSB3aXRob3V0IHRoYXQgYmVpbmcgdGhlIHVzZXIncyBpbnRlbnQuXG5cdFx0XHRcdFx0bWluID0gMC4wMDAwMixcblx0XHRcdFx0XHRybmQgPSAxMDAwMDAsXG5cdFx0XHRcdFx0ek9yaWdpbiA9IF9zdXBwb3J0czNEID8gcGFyc2VGbG9hdChfZ2V0U3R5bGUodCwgX3RyYW5zZm9ybU9yaWdpblByb3AsIGNzLCBmYWxzZSwgXCIwIDAgMFwiKS5zcGxpdChcIiBcIilbMl0pIHx8IHRtLnpPcmlnaW4gIHx8IDAgOiAwLFxuXHRcdFx0XHRcdGRlZmF1bHRUcmFuc2Zvcm1QZXJzcGVjdGl2ZSA9IHBhcnNlRmxvYXQoQ1NTUGx1Z2luLmRlZmF1bHRUcmFuc2Zvcm1QZXJzcGVjdGl2ZSkgfHwgMCxcblx0XHRcdFx0XHRtLCBpLCBzY2FsZVgsIHNjYWxlWSwgcm90YXRpb24sIHNrZXdYO1xuXG5cdFx0XHRcdHRtLnN2ZyA9ICEhKHQuZ2V0QkJveCAmJiBfaXNTVkcodCkpO1xuXHRcdFx0XHRpZiAodG0uc3ZnKSB7XG5cdFx0XHRcdFx0X3BhcnNlU1ZHT3JpZ2luKHQsIF9nZXRTdHlsZSh0LCBfdHJhbnNmb3JtT3JpZ2luUHJvcCwgX2NzLCBmYWxzZSwgXCI1MCUgNTAlXCIpICsgXCJcIiwgdG0sIHQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdmctb3JpZ2luXCIpKTtcblx0XHRcdFx0XHRfdXNlU1ZHVHJhbnNmb3JtQXR0ciA9IENTU1BsdWdpbi51c2VTVkdUcmFuc2Zvcm1BdHRyIHx8IF9mb3JjZVNWR1RyYW5zZm9ybUF0dHI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bSA9IF9nZXRNYXRyaXgodCk7XG5cdFx0XHRcdGlmIChtICE9PSBfaWRlbnRpdHkyRE1hdHJpeCkge1xuXG5cdFx0XHRcdFx0aWYgKG0ubGVuZ3RoID09PSAxNikge1xuXHRcdFx0XHRcdFx0Ly93ZSdsbCBvbmx5IGxvb2sgYXQgdGhlc2UgcG9zaXRpb24tcmVsYXRlZCA2IHZhcmlhYmxlcyBmaXJzdCBiZWNhdXNlIGlmIHgveS96IGFsbCBtYXRjaCwgaXQncyByZWxhdGl2ZWx5IHNhZmUgdG8gYXNzdW1lIHdlIGRvbid0IG5lZWQgdG8gcmUtcGFyc2UgZXZlcnl0aGluZyB3aGljaCByaXNrcyBsb3NpbmcgaW1wb3J0YW50IHJvdGF0aW9uYWwgaW5mb3JtYXRpb24gKGxpa2Ugcm90YXRpb25YOjE4MCBwbHVzIHJvdGF0aW9uWToxODAgd291bGQgbG9vayB0aGUgc2FtZSBhcyByb3RhdGlvbjoxODAgLSB0aGVyZSdzIG5vIHdheSB0byBrbm93IGZvciBzdXJlIHdoaWNoIGRpcmVjdGlvbiB3YXMgdGFrZW4gYmFzZWQgc29sZWx5IG9uIHRoZSBtYXRyaXgzZCgpIHZhbHVlcylcblx0XHRcdFx0XHRcdHZhciBhMTEgPSBtWzBdLCBhMjEgPSBtWzFdLCBhMzEgPSBtWzJdLCBhNDEgPSBtWzNdLFxuXHRcdFx0XHRcdFx0XHRhMTIgPSBtWzRdLCBhMjIgPSBtWzVdLCBhMzIgPSBtWzZdLCBhNDIgPSBtWzddLFxuXHRcdFx0XHRcdFx0XHRhMTMgPSBtWzhdLCBhMjMgPSBtWzldLCBhMzMgPSBtWzEwXSxcblx0XHRcdFx0XHRcdFx0YTE0ID0gbVsxMl0sIGEyNCA9IG1bMTNdLCBhMzQgPSBtWzE0XSxcblx0XHRcdFx0XHRcdFx0YTQzID0gbVsxMV0sXG5cdFx0XHRcdFx0XHRcdGFuZ2xlID0gTWF0aC5hdGFuMihhMzIsIGEzMyksXG5cdFx0XHRcdFx0XHRcdHQxLCB0MiwgdDMsIHQ0LCBjb3MsIHNpbjtcblxuXHRcdFx0XHRcdFx0Ly93ZSBtYW51YWxseSBjb21wZW5zYXRlIGZvciBub24temVybyB6IGNvbXBvbmVudCBvZiB0cmFuc2Zvcm1PcmlnaW4gdG8gd29yayBhcm91bmQgYnVncyBpbiBTYWZhcmlcblx0XHRcdFx0XHRcdGlmICh0bS56T3JpZ2luKSB7XG5cdFx0XHRcdFx0XHRcdGEzNCA9IC10bS56T3JpZ2luO1xuXHRcdFx0XHRcdFx0XHRhMTQgPSBhMTMqYTM0LW1bMTJdO1xuXHRcdFx0XHRcdFx0XHRhMjQgPSBhMjMqYTM0LW1bMTNdO1xuXHRcdFx0XHRcdFx0XHRhMzQgPSBhMzMqYTM0K3RtLnpPcmlnaW4tbVsxNF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0bS5yb3RhdGlvblggPSBhbmdsZSAqIF9SQUQyREVHO1xuXHRcdFx0XHRcdFx0Ly9yb3RhdGlvblhcblx0XHRcdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdFx0XHRjb3MgPSBNYXRoLmNvcygtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbigtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHR0MSA9IGExMipjb3MrYTEzKnNpbjtcblx0XHRcdFx0XHRcdFx0dDIgPSBhMjIqY29zK2EyMypzaW47XG5cdFx0XHRcdFx0XHRcdHQzID0gYTMyKmNvcythMzMqc2luO1xuXHRcdFx0XHRcdFx0XHRhMTMgPSBhMTIqLXNpbithMTMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMjMgPSBhMjIqLXNpbithMjMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMzMgPSBhMzIqLXNpbithMzMqY29zO1xuXHRcdFx0XHRcdFx0XHRhNDMgPSBhNDIqLXNpbithNDMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMTIgPSB0MTtcblx0XHRcdFx0XHRcdFx0YTIyID0gdDI7XG5cdFx0XHRcdFx0XHRcdGEzMiA9IHQzO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly9yb3RhdGlvbllcblx0XHRcdFx0XHRcdGFuZ2xlID0gTWF0aC5hdGFuMigtYTMxLCBhMzMpO1xuXHRcdFx0XHRcdFx0dG0ucm90YXRpb25ZID0gYW5nbGUgKiBfUkFEMkRFRztcblx0XHRcdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdFx0XHRjb3MgPSBNYXRoLmNvcygtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbigtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHR0MSA9IGExMSpjb3MtYTEzKnNpbjtcblx0XHRcdFx0XHRcdFx0dDIgPSBhMjEqY29zLWEyMypzaW47XG5cdFx0XHRcdFx0XHRcdHQzID0gYTMxKmNvcy1hMzMqc2luO1xuXHRcdFx0XHRcdFx0XHRhMjMgPSBhMjEqc2luK2EyMypjb3M7XG5cdFx0XHRcdFx0XHRcdGEzMyA9IGEzMSpzaW4rYTMzKmNvcztcblx0XHRcdFx0XHRcdFx0YTQzID0gYTQxKnNpbithNDMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMTEgPSB0MTtcblx0XHRcdFx0XHRcdFx0YTIxID0gdDI7XG5cdFx0XHRcdFx0XHRcdGEzMSA9IHQzO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly9yb3RhdGlvblpcblx0XHRcdFx0XHRcdGFuZ2xlID0gTWF0aC5hdGFuMihhMjEsIGExMSk7XG5cdFx0XHRcdFx0XHR0bS5yb3RhdGlvbiA9IGFuZ2xlICogX1JBRDJERUc7XG5cdFx0XHRcdFx0XHRpZiAoYW5nbGUpIHtcblx0XHRcdFx0XHRcdFx0Y29zID0gTWF0aC5jb3MoLWFuZ2xlKTtcblx0XHRcdFx0XHRcdFx0c2luID0gTWF0aC5zaW4oLWFuZ2xlKTtcblx0XHRcdFx0XHRcdFx0YTExID0gYTExKmNvcythMTIqc2luO1xuXHRcdFx0XHRcdFx0XHR0MiA9IGEyMSpjb3MrYTIyKnNpbjtcblx0XHRcdFx0XHRcdFx0YTIyID0gYTIxKi1zaW4rYTIyKmNvcztcblx0XHRcdFx0XHRcdFx0YTMyID0gYTMxKi1zaW4rYTMyKmNvcztcblx0XHRcdFx0XHRcdFx0YTIxID0gdDI7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICh0bS5yb3RhdGlvblggJiYgTWF0aC5hYnModG0ucm90YXRpb25YKSArIE1hdGguYWJzKHRtLnJvdGF0aW9uKSA+IDM1OS45KSB7IC8vd2hlbiByb3RhdGlvblkgaXMgc2V0LCBpdCB3aWxsIG9mdGVuIGJlIHBhcnNlZCBhcyAxODAgZGVncmVlcyBkaWZmZXJlbnQgdGhhbiBpdCBzaG91bGQgYmUsIGFuZCByb3RhdGlvblggYW5kIHJvdGF0aW9uIGJvdGggYmVpbmcgMTgwIChpdCBsb29rcyB0aGUgc2FtZSksIHNvIHdlIGFkanVzdCBmb3IgdGhhdCBoZXJlLlxuXHRcdFx0XHRcdFx0XHR0bS5yb3RhdGlvblggPSB0bS5yb3RhdGlvbiA9IDA7XG5cdFx0XHRcdFx0XHRcdHRtLnJvdGF0aW9uWSA9IDE4MCAtIHRtLnJvdGF0aW9uWTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dG0uc2NhbGVYID0gKChNYXRoLnNxcnQoYTExICogYTExICsgYTIxICogYTIxKSAqIHJuZCArIDAuNSkgfCAwKSAvIHJuZDtcblx0XHRcdFx0XHRcdHRtLnNjYWxlWSA9ICgoTWF0aC5zcXJ0KGEyMiAqIGEyMiArIGEyMyAqIGEyMykgKiBybmQgKyAwLjUpIHwgMCkgLyBybmQ7XG5cdFx0XHRcdFx0XHR0bS5zY2FsZVogPSAoKE1hdGguc3FydChhMzIgKiBhMzIgKyBhMzMgKiBhMzMpICogcm5kICsgMC41KSB8IDApIC8gcm5kO1xuXHRcdFx0XHRcdFx0dG0uc2tld1ggPSAwO1xuXHRcdFx0XHRcdFx0dG0ucGVyc3BlY3RpdmUgPSBhNDMgPyAxIC8gKChhNDMgPCAwKSA/IC1hNDMgOiBhNDMpIDogMDtcblx0XHRcdFx0XHRcdHRtLnggPSBhMTQ7XG5cdFx0XHRcdFx0XHR0bS55ID0gYTI0O1xuXHRcdFx0XHRcdFx0dG0ueiA9IGEzNDtcblx0XHRcdFx0XHRcdGlmICh0bS5zdmcpIHtcblx0XHRcdFx0XHRcdFx0dG0ueCAtPSB0bS54T3JpZ2luIC0gKHRtLnhPcmlnaW4gKiBhMTEgLSB0bS55T3JpZ2luICogYTEyKTtcblx0XHRcdFx0XHRcdFx0dG0ueSAtPSB0bS55T3JpZ2luIC0gKHRtLnlPcmlnaW4gKiBhMjEgLSB0bS54T3JpZ2luICogYTIyKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoKCFfc3VwcG9ydHMzRCB8fCBwYXJzZSB8fCAhbS5sZW5ndGggfHwgdG0ueCAhPT0gbVs0XSB8fCB0bS55ICE9PSBtWzVdIHx8ICghdG0ucm90YXRpb25YICYmICF0bS5yb3RhdGlvblkpKSAmJiAhKHRtLnggIT09IHVuZGVmaW5lZCAmJiBfZ2V0U3R5bGUodCwgXCJkaXNwbGF5XCIsIGNzKSA9PT0gXCJub25lXCIpKSB7IC8vc29tZXRpbWVzIGEgNi1lbGVtZW50IG1hdHJpeCBpcyByZXR1cm5lZCBldmVuIHdoZW4gd2UgcGVyZm9ybWVkIDNEIHRyYW5zZm9ybXMsIGxpa2UgaWYgcm90YXRpb25YIGFuZCByb3RhdGlvblkgYXJlIDE4MC4gSW4gY2FzZXMgbGlrZSB0aGlzLCB3ZSBzdGlsbCBuZWVkIHRvIGhvbm9yIHRoZSAzRCB0cmFuc2Zvcm1zLiBJZiB3ZSBqdXN0IHJlbHkgb24gdGhlIDJEIGluZm8sIGl0IGNvdWxkIGFmZmVjdCBob3cgdGhlIGRhdGEgaXMgaW50ZXJwcmV0ZWQsIGxpa2Ugc2NhbGVZIG1pZ2h0IGdldCBzZXQgdG8gLTEgb3Igcm90YXRpb24gY291bGQgZ2V0IG9mZnNldCBieSAxODAgZGVncmVlcy4gRm9yIGV4YW1wbGUsIGRvIGEgVHdlZW5MaXRlLnRvKGVsZW1lbnQsIDEsIHtjc3M6e3JvdGF0aW9uWDoxODAsIHJvdGF0aW9uWToxODB9fSkgYW5kIHRoZW4gbGF0ZXIsIFR3ZWVuTGl0ZS50byhlbGVtZW50LCAxLCB7Y3NzOntyb3RhdGlvblg6MH19KSBhbmQgd2l0aG91dCB0aGlzIGNvbmRpdGlvbmFsIGxvZ2ljIGluIHBsYWNlLCBpdCdkIGp1bXAgdG8gYSBzdGF0ZSBvZiBiZWluZyB1bnJvdGF0ZWQgd2hlbiB0aGUgMm5kIHR3ZWVuIHN0YXJ0cy4gVGhlbiBhZ2Fpbiwgd2UgbmVlZCB0byBob25vciB0aGUgZmFjdCB0aGF0IHRoZSB1c2VyIENPVUxEIGFsdGVyIHRoZSB0cmFuc2Zvcm1zIG91dHNpZGUgb2YgQ1NTUGx1Z2luLCBsaWtlIGJ5IG1hbnVhbGx5IGFwcGx5aW5nIG5ldyBjc3MsIHNvIHdlIHRyeSB0byBzZW5zZSB0aGF0IGJ5IGxvb2tpbmcgYXQgeCBhbmQgeSBiZWNhdXNlIGlmIHRob3NlIGNoYW5nZWQsIHdlIGtub3cgdGhlIGNoYW5nZXMgd2VyZSBtYWRlIG91dHNpZGUgQ1NTUGx1Z2luIGFuZCB3ZSBmb3JjZSBhIHJlaW50ZXJwcmV0YXRpb24gb2YgdGhlIG1hdHJpeCB2YWx1ZXMuIEFsc28sIGluIFdlYmtpdCBicm93c2VycywgaWYgdGhlIGVsZW1lbnQncyBcImRpc3BsYXlcIiBpcyBcIm5vbmVcIiwgaXRzIGNhbGN1bGF0ZWQgc3R5bGUgdmFsdWUgd2lsbCBhbHdheXMgcmV0dXJuIGVtcHR5LCBzbyBpZiB3ZSd2ZSBhbHJlYWR5IHJlY29yZGVkIHRoZSB2YWx1ZXMgaW4gdGhlIF9nc1RyYW5zZm9ybSBvYmplY3QsIHdlJ2xsIGp1c3QgcmVseSBvbiB0aG9zZS5cblx0XHRcdFx0XHRcdHZhciBrID0gKG0ubGVuZ3RoID49IDYpLFxuXHRcdFx0XHRcdFx0XHRhID0gayA/IG1bMF0gOiAxLFxuXHRcdFx0XHRcdFx0XHRiID0gbVsxXSB8fCAwLFxuXHRcdFx0XHRcdFx0XHRjID0gbVsyXSB8fCAwLFxuXHRcdFx0XHRcdFx0XHRkID0gayA/IG1bM10gOiAxO1xuXHRcdFx0XHRcdFx0dG0ueCA9IG1bNF0gfHwgMDtcblx0XHRcdFx0XHRcdHRtLnkgPSBtWzVdIHx8IDA7XG5cdFx0XHRcdFx0XHRzY2FsZVggPSBNYXRoLnNxcnQoYSAqIGEgKyBiICogYik7XG5cdFx0XHRcdFx0XHRzY2FsZVkgPSBNYXRoLnNxcnQoZCAqIGQgKyBjICogYyk7XG5cdFx0XHRcdFx0XHRyb3RhdGlvbiA9IChhIHx8IGIpID8gTWF0aC5hdGFuMihiLCBhKSAqIF9SQUQyREVHIDogdG0ucm90YXRpb24gfHwgMDsgLy9ub3RlOiBpZiBzY2FsZVggaXMgMCwgd2UgY2Fubm90IGFjY3VyYXRlbHkgbWVhc3VyZSByb3RhdGlvbi4gU2FtZSBmb3Igc2tld1ggd2l0aCBhIHNjYWxlWSBvZiAwLiBUaGVyZWZvcmUsIHdlIGRlZmF1bHQgdG8gdGhlIHByZXZpb3VzbHkgcmVjb3JkZWQgdmFsdWUgKG9yIHplcm8gaWYgdGhhdCBkb2Vzbid0IGV4aXN0KS5cblx0XHRcdFx0XHRcdHNrZXdYID0gKGMgfHwgZCkgPyBNYXRoLmF0YW4yKGMsIGQpICogX1JBRDJERUcgKyByb3RhdGlvbiA6IHRtLnNrZXdYIHx8IDA7XG5cdFx0XHRcdFx0XHRpZiAoTWF0aC5hYnMoc2tld1gpID4gOTAgJiYgTWF0aC5hYnMoc2tld1gpIDwgMjcwKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChpbnZYKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2NhbGVYICo9IC0xO1xuXHRcdFx0XHRcdFx0XHRcdHNrZXdYICs9IChyb3RhdGlvbiA8PSAwKSA/IDE4MCA6IC0xODA7XG5cdFx0XHRcdFx0XHRcdFx0cm90YXRpb24gKz0gKHJvdGF0aW9uIDw9IDApID8gMTgwIDogLTE4MDtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRzY2FsZVkgKj0gLTE7XG5cdFx0XHRcdFx0XHRcdFx0c2tld1ggKz0gKHNrZXdYIDw9IDApID8gMTgwIDogLTE4MDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dG0uc2NhbGVYID0gc2NhbGVYO1xuXHRcdFx0XHRcdFx0dG0uc2NhbGVZID0gc2NhbGVZO1xuXHRcdFx0XHRcdFx0dG0ucm90YXRpb24gPSByb3RhdGlvbjtcblx0XHRcdFx0XHRcdHRtLnNrZXdYID0gc2tld1g7XG5cdFx0XHRcdFx0XHRpZiAoX3N1cHBvcnRzM0QpIHtcblx0XHRcdFx0XHRcdFx0dG0ucm90YXRpb25YID0gdG0ucm90YXRpb25ZID0gdG0ueiA9IDA7XG5cdFx0XHRcdFx0XHRcdHRtLnBlcnNwZWN0aXZlID0gZGVmYXVsdFRyYW5zZm9ybVBlcnNwZWN0aXZlO1xuXHRcdFx0XHRcdFx0XHR0bS5zY2FsZVogPSAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHRtLnN2Zykge1xuXHRcdFx0XHRcdFx0XHR0bS54IC09IHRtLnhPcmlnaW4gLSAodG0ueE9yaWdpbiAqIGEgKyB0bS55T3JpZ2luICogYyk7XG5cdFx0XHRcdFx0XHRcdHRtLnkgLT0gdG0ueU9yaWdpbiAtICh0bS54T3JpZ2luICogYiArIHRtLnlPcmlnaW4gKiBkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dG0uek9yaWdpbiA9IHpPcmlnaW47XG5cdFx0XHRcdFx0Ly9zb21lIGJyb3dzZXJzIGhhdmUgYSBoYXJkIHRpbWUgd2l0aCB2ZXJ5IHNtYWxsIHZhbHVlcyBsaWtlIDIuNDQ5MjkzNTk4Mjk0NzA2NGUtMTYgKG5vdGljZSB0aGUgXCJlLVwiIHRvd2FyZHMgdGhlIGVuZCkgYW5kIHdvdWxkIHJlbmRlciB0aGUgb2JqZWN0IHNsaWdodGx5IG9mZi4gU28gd2Ugcm91bmQgdG8gMCBpbiB0aGVzZSBjYXNlcy4gVGhlIGNvbmRpdGlvbmFsIGxvZ2ljIGhlcmUgaXMgZmFzdGVyIHRoYW4gY2FsbGluZyBNYXRoLmFicygpLiBBbHNvLCBicm93c2VycyB0ZW5kIHRvIHJlbmRlciBhIFNMSUdIVExZIHJvdGF0ZWQgb2JqZWN0IGluIGEgZnV6enkgd2F5LCBzbyB3ZSBuZWVkIHRvIHNuYXAgdG8gZXhhY3RseSAwIHdoZW4gYXBwcm9wcmlhdGUuXG5cdFx0XHRcdFx0Zm9yIChpIGluIHRtKSB7XG5cdFx0XHRcdFx0XHRpZiAodG1baV0gPCBtaW4pIGlmICh0bVtpXSA+IC1taW4pIHtcblx0XHRcdFx0XHRcdFx0dG1baV0gPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvL0RFQlVHOiBfbG9nKFwicGFyc2VkIHJvdGF0aW9uIG9mIFwiICsgdC5nZXRBdHRyaWJ1dGUoXCJpZFwiKStcIjogXCIrKHRtLnJvdGF0aW9uWCkrXCIsIFwiKyh0bS5yb3RhdGlvblkpK1wiLCBcIisodG0ucm90YXRpb24pK1wiLCBzY2FsZTogXCIrdG0uc2NhbGVYK1wiLCBcIit0bS5zY2FsZVkrXCIsIFwiK3RtLnNjYWxlWitcIiwgcG9zaXRpb246IFwiK3RtLngrXCIsIFwiK3RtLnkrXCIsIFwiK3RtLnorXCIsIHBlcnNwZWN0aXZlOiBcIit0bS5wZXJzcGVjdGl2ZSsgXCIsIG9yaWdpbjogXCIrIHRtLnhPcmlnaW4rIFwiLFwiKyB0bS55T3JpZ2luKTtcblx0XHRcdFx0aWYgKHJlYykge1xuXHRcdFx0XHRcdHQuX2dzVHJhbnNmb3JtID0gdG07IC8vcmVjb3JkIHRvIHRoZSBvYmplY3QncyBfZ3NUcmFuc2Zvcm0gd2hpY2ggd2UgdXNlIHNvIHRoYXQgdHdlZW5zIGNhbiBjb250cm9sIGluZGl2aWR1YWwgcHJvcGVydGllcyBpbmRlcGVuZGVudGx5ICh3ZSBuZWVkIGFsbCB0aGUgcHJvcGVydGllcyB0byBhY2N1cmF0ZWx5IHJlY29tcG9zZSB0aGUgbWF0cml4IGluIHRoZSBzZXRSYXRpbygpIG1ldGhvZClcblx0XHRcdFx0XHRpZiAodG0uc3ZnKSB7IC8vaWYgd2UncmUgc3VwcG9zZWQgdG8gYXBwbHkgdHJhbnNmb3JtcyB0byB0aGUgU1ZHIGVsZW1lbnQncyBcInRyYW5zZm9ybVwiIGF0dHJpYnV0ZSwgbWFrZSBzdXJlIHRoZXJlIGFyZW4ndCBhbnkgQ1NTIHRyYW5zZm9ybXMgYXBwbGllZCBvciB0aGV5J2xsIG92ZXJyaWRlIHRoZSBhdHRyaWJ1dGUgb25lcy4gQWxzbyBjbGVhciB0aGUgdHJhbnNmb3JtIGF0dHJpYnV0ZSBpZiB3ZSdyZSB1c2luZyBDU1MsIGp1c3QgdG8gYmUgY2xlYW4uXG5cdFx0XHRcdFx0XHRpZiAoX3VzZVNWR1RyYW5zZm9ybUF0dHIgJiYgdC5zdHlsZVtfdHJhbnNmb3JtUHJvcF0pIHtcblx0XHRcdFx0XHRcdFx0VHdlZW5MaXRlLmRlbGF5ZWRDYWxsKDAuMDAxLCBmdW5jdGlvbigpeyAvL2lmIHdlIGFwcGx5IHRoaXMgcmlnaHQgYXdheSAoYmVmb3JlIGFueXRoaW5nIGhhcyByZW5kZXJlZCksIHdlIHJpc2sgdGhlcmUgYmVpbmcgbm8gdHJhbnNmb3JtcyBmb3IgYSBicmllZiBtb21lbnQgYW5kIGl0IGFsc28gaW50ZXJmZXJlcyB3aXRoIGFkanVzdGluZyB0aGUgdHJhbnNmb3JtT3JpZ2luIGluIGEgdHdlZW4gd2l0aCBpbW1lZGlhdGVSZW5kZXI6dHJ1ZSAoaXQnZCB0cnkgcmVhZGluZyB0aGUgbWF0cml4IGFuZCBpdCB3b3VsZG4ndCBoYXZlIHRoZSBhcHByb3ByaWF0ZSBkYXRhIGluIHBsYWNlIGJlY2F1c2Ugd2UganVzdCByZW1vdmVkIGl0KS5cblx0XHRcdFx0XHRcdFx0XHRfcmVtb3ZlUHJvcCh0LnN0eWxlLCBfdHJhbnNmb3JtUHJvcCk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICghX3VzZVNWR1RyYW5zZm9ybUF0dHIgJiYgdC5nZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIikpIHtcblx0XHRcdFx0XHRcdFx0VHdlZW5MaXRlLmRlbGF5ZWRDYWxsKDAuMDAxLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdHQucmVtb3ZlQXR0cmlidXRlKFwidHJhbnNmb3JtXCIpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRtO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly9mb3Igc2V0dGluZyAyRCB0cmFuc2Zvcm1zIGluIElFNiwgSUU3LCBhbmQgSUU4IChtdXN0IHVzZSBhIFwiZmlsdGVyXCIgdG8gZW11bGF0ZSB0aGUgYmVoYXZpb3Igb2YgbW9kZXJuIGRheSBicm93c2VyIHRyYW5zZm9ybXMpXG5cdFx0XHRfc2V0SUVUcmFuc2Zvcm1SYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0dmFyIHQgPSB0aGlzLmRhdGEsIC8vcmVmZXJzIHRvIHRoZSBlbGVtZW50J3MgX2dzVHJhbnNmb3JtIG9iamVjdFxuXHRcdFx0XHRcdGFuZyA9IC10LnJvdGF0aW9uICogX0RFRzJSQUQsXG5cdFx0XHRcdFx0c2tldyA9IGFuZyArIHQuc2tld1ggKiBfREVHMlJBRCxcblx0XHRcdFx0XHRybmQgPSAxMDAwMDAsXG5cdFx0XHRcdFx0YSA9ICgoTWF0aC5jb3MoYW5nKSAqIHQuc2NhbGVYICogcm5kKSB8IDApIC8gcm5kLFxuXHRcdFx0XHRcdGIgPSAoKE1hdGguc2luKGFuZykgKiB0LnNjYWxlWCAqIHJuZCkgfCAwKSAvIHJuZCxcblx0XHRcdFx0XHRjID0gKChNYXRoLnNpbihza2V3KSAqIC10LnNjYWxlWSAqIHJuZCkgfCAwKSAvIHJuZCxcblx0XHRcdFx0XHRkID0gKChNYXRoLmNvcyhza2V3KSAqIHQuc2NhbGVZICogcm5kKSB8IDApIC8gcm5kLFxuXHRcdFx0XHRcdHN0eWxlID0gdGhpcy50LnN0eWxlLFxuXHRcdFx0XHRcdGNzID0gdGhpcy50LmN1cnJlbnRTdHlsZSxcblx0XHRcdFx0XHRmaWx0ZXJzLCB2YWw7XG5cdFx0XHRcdGlmICghY3MpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFsID0gYjsgLy9qdXN0IGZvciBzd2FwcGluZyB0aGUgdmFyaWFibGVzIGFuIGludmVydGluZyB0aGVtIChyZXVzZWQgXCJ2YWxcIiB0byBhdm9pZCBjcmVhdGluZyBhbm90aGVyIHZhcmlhYmxlIGluIG1lbW9yeSkuIElFJ3MgZmlsdGVyIG1hdHJpeCB1c2VzIGEgbm9uLXN0YW5kYXJkIG1hdHJpeCBjb25maWd1cmF0aW9uIChhbmdsZSBnb2VzIHRoZSBvcHBvc2l0ZSB3YXksIGFuZCBiIGFuZCBjIGFyZSByZXZlcnNlZCBhbmQgaW52ZXJ0ZWQpXG5cdFx0XHRcdGIgPSAtYztcblx0XHRcdFx0YyA9IC12YWw7XG5cdFx0XHRcdGZpbHRlcnMgPSBjcy5maWx0ZXI7XG5cdFx0XHRcdHN0eWxlLmZpbHRlciA9IFwiXCI7IC8vcmVtb3ZlIGZpbHRlcnMgc28gdGhhdCB3ZSBjYW4gYWNjdXJhdGVseSBtZWFzdXJlIG9mZnNldFdpZHRoL29mZnNldEhlaWdodFxuXHRcdFx0XHR2YXIgdyA9IHRoaXMudC5vZmZzZXRXaWR0aCxcblx0XHRcdFx0XHRoID0gdGhpcy50Lm9mZnNldEhlaWdodCxcblx0XHRcdFx0XHRjbGlwID0gKGNzLnBvc2l0aW9uICE9PSBcImFic29sdXRlXCIpLFxuXHRcdFx0XHRcdG0gPSBcInByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5NYXRyaXgoTTExPVwiICsgYSArIFwiLCBNMTI9XCIgKyBiICsgXCIsIE0yMT1cIiArIGMgKyBcIiwgTTIyPVwiICsgZCxcblx0XHRcdFx0XHRveCA9IHQueCArICh3ICogdC54UGVyY2VudCAvIDEwMCksXG5cdFx0XHRcdFx0b3kgPSB0LnkgKyAoaCAqIHQueVBlcmNlbnQgLyAxMDApLFxuXHRcdFx0XHRcdGR4LCBkeTtcblxuXHRcdFx0XHQvL2lmIHRyYW5zZm9ybU9yaWdpbiBpcyBiZWluZyB1c2VkLCBhZGp1c3QgdGhlIG9mZnNldCB4IGFuZCB5XG5cdFx0XHRcdGlmICh0Lm94ICE9IG51bGwpIHtcblx0XHRcdFx0XHRkeCA9ICgodC5veHApID8gdyAqIHQub3ggKiAwLjAxIDogdC5veCkgLSB3IC8gMjtcblx0XHRcdFx0XHRkeSA9ICgodC5veXApID8gaCAqIHQub3kgKiAwLjAxIDogdC5veSkgLSBoIC8gMjtcblx0XHRcdFx0XHRveCArPSBkeCAtIChkeCAqIGEgKyBkeSAqIGIpO1xuXHRcdFx0XHRcdG95ICs9IGR5IC0gKGR4ICogYyArIGR5ICogZCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIWNsaXApIHtcblx0XHRcdFx0XHRtICs9IFwiLCBzaXppbmdNZXRob2Q9J2F1dG8gZXhwYW5kJylcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkeCA9ICh3IC8gMik7XG5cdFx0XHRcdFx0ZHkgPSAoaCAvIDIpO1xuXHRcdFx0XHRcdC8vdHJhbnNsYXRlIHRvIGVuc3VyZSB0aGF0IHRyYW5zZm9ybWF0aW9ucyBvY2N1ciBhcm91bmQgdGhlIGNvcnJlY3Qgb3JpZ2luIChkZWZhdWx0IGlzIGNlbnRlcikuXG5cdFx0XHRcdFx0bSArPSBcIiwgRHg9XCIgKyAoZHggLSAoZHggKiBhICsgZHkgKiBiKSArIG94KSArIFwiLCBEeT1cIiArIChkeSAtIChkeCAqIGMgKyBkeSAqIGQpICsgb3kpICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGZpbHRlcnMuaW5kZXhPZihcIkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0Lk1hdHJpeChcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0c3R5bGUuZmlsdGVyID0gZmlsdGVycy5yZXBsYWNlKF9pZVNldE1hdHJpeEV4cCwgbSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c3R5bGUuZmlsdGVyID0gbSArIFwiIFwiICsgZmlsdGVyczsgLy93ZSBtdXN0IGFsd2F5cyBwdXQgdGhlIHRyYW5zZm9ybS9tYXRyaXggRklSU1QgKGJlZm9yZSBhbHBoYShvcGFjaXR5PXh4KSkgdG8gYXZvaWQgYW4gSUUgYnVnIHRoYXQgc2xpY2VzIHBhcnQgb2YgdGhlIG9iamVjdCB3aGVuIHJvdGF0aW9uIGlzIGFwcGxpZWQgd2l0aCBhbHBoYS5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vYXQgdGhlIGVuZCBvciBiZWdpbm5pbmcgb2YgdGhlIHR3ZWVuLCBpZiB0aGUgbWF0cml4IGlzIG5vcm1hbCAoMSwgMCwgMCwgMSkgYW5kIG9wYWNpdHkgaXMgMTAwIChvciBkb2Vzbid0IGV4aXN0KSwgcmVtb3ZlIHRoZSBmaWx0ZXIgdG8gaW1wcm92ZSBicm93c2VyIHBlcmZvcm1hbmNlLlxuXHRcdFx0XHRpZiAodiA9PT0gMCB8fCB2ID09PSAxKSBpZiAoYSA9PT0gMSkgaWYgKGIgPT09IDApIGlmIChjID09PSAwKSBpZiAoZCA9PT0gMSkgaWYgKCFjbGlwIHx8IG0uaW5kZXhPZihcIkR4PTAsIER5PTBcIikgIT09IC0xKSBpZiAoIV9vcGFjaXR5RXhwLnRlc3QoZmlsdGVycykgfHwgcGFyc2VGbG9hdChSZWdFeHAuJDEpID09PSAxMDApIGlmIChmaWx0ZXJzLmluZGV4T2YoXCJncmFkaWVudChcIiAmJiBmaWx0ZXJzLmluZGV4T2YoXCJBbHBoYVwiKSkgPT09IC0xKSB7XG5cdFx0XHRcdFx0c3R5bGUucmVtb3ZlQXR0cmlidXRlKFwiZmlsdGVyXCIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly93ZSBtdXN0IHNldCB0aGUgbWFyZ2lucyBBRlRFUiBhcHBseWluZyB0aGUgZmlsdGVyIGluIG9yZGVyIHRvIGF2b2lkIHNvbWUgYnVncyBpbiBJRTggdGhhdCBjb3VsZCAoaW4gcmFyZSBzY2VuYXJpb3MpIGNhdXNlIHRoZW0gdG8gYmUgaWdub3JlZCBpbnRlcm1pdHRlbnRseSAodmlicmF0aW9uKS5cblx0XHRcdFx0aWYgKCFjbGlwKSB7XG5cdFx0XHRcdFx0dmFyIG11bHQgPSAoX2llVmVycyA8IDgpID8gMSA6IC0xLCAvL2luIEludGVybmV0IEV4cGxvcmVyIDcgYW5kIGJlZm9yZSwgdGhlIGJveCBtb2RlbCBpcyBicm9rZW4sIGNhdXNpbmcgdGhlIGJyb3dzZXIgdG8gdHJlYXQgdGhlIHdpZHRoL2hlaWdodCBvZiB0aGUgYWN0dWFsIHJvdGF0ZWQgZmlsdGVyZWQgaW1hZ2UgYXMgdGhlIHdpZHRoL2hlaWdodCBvZiB0aGUgYm94IGl0c2VsZiwgYnV0IE1pY3Jvc29mdCBjb3JyZWN0ZWQgdGhhdCBpbiBJRTguIFdlIG11c3QgdXNlIGEgbmVnYXRpdmUgb2Zmc2V0IGluIElFOCBvbiB0aGUgcmlnaHQvYm90dG9tXG5cdFx0XHRcdFx0XHRtYXJnLCBwcm9wLCBkaWY7XG5cdFx0XHRcdFx0ZHggPSB0LmllT2Zmc2V0WCB8fCAwO1xuXHRcdFx0XHRcdGR5ID0gdC5pZU9mZnNldFkgfHwgMDtcblx0XHRcdFx0XHR0LmllT2Zmc2V0WCA9IE1hdGgucm91bmQoKHcgLSAoKGEgPCAwID8gLWEgOiBhKSAqIHcgKyAoYiA8IDAgPyAtYiA6IGIpICogaCkpIC8gMiArIG94KTtcblx0XHRcdFx0XHR0LmllT2Zmc2V0WSA9IE1hdGgucm91bmQoKGggLSAoKGQgPCAwID8gLWQgOiBkKSAqIGggKyAoYyA8IDAgPyAtYyA6IGMpICogdykpIC8gMiArIG95KTtcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgNDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRwcm9wID0gX21hcmdpbnNbaV07XG5cdFx0XHRcdFx0XHRtYXJnID0gY3NbcHJvcF07XG5cdFx0XHRcdFx0XHQvL3dlIG5lZWQgdG8gZ2V0IHRoZSBjdXJyZW50IG1hcmdpbiBpbiBjYXNlIGl0IGlzIGJlaW5nIHR3ZWVuZWQgc2VwYXJhdGVseSAod2Ugd2FudCB0byByZXNwZWN0IHRoYXQgdHdlZW4ncyBjaGFuZ2VzKVxuXHRcdFx0XHRcdFx0dmFsID0gKG1hcmcuaW5kZXhPZihcInB4XCIpICE9PSAtMSkgPyBwYXJzZUZsb2F0KG1hcmcpIDogX2NvbnZlcnRUb1BpeGVscyh0aGlzLnQsIHByb3AsIHBhcnNlRmxvYXQobWFyZyksIG1hcmcucmVwbGFjZShfc3VmZml4RXhwLCBcIlwiKSkgfHwgMDtcblx0XHRcdFx0XHRcdGlmICh2YWwgIT09IHRbcHJvcF0pIHtcblx0XHRcdFx0XHRcdFx0ZGlmID0gKGkgPCAyKSA/IC10LmllT2Zmc2V0WCA6IC10LmllT2Zmc2V0WTsgLy9pZiBhbm90aGVyIHR3ZWVuIGlzIGNvbnRyb2xsaW5nIGEgbWFyZ2luLCB3ZSBjYW5ub3Qgb25seSBhcHBseSB0aGUgZGlmZmVyZW5jZSBpbiB0aGUgaWVPZmZzZXRzLCBzbyB3ZSBlc3NlbnRpYWxseSB6ZXJvLW91dCB0aGUgZHggYW5kIGR5IGhlcmUgaW4gdGhhdCBjYXNlLiBXZSByZWNvcmQgdGhlIG1hcmdpbihzKSBsYXRlciBzbyB0aGF0IHdlIGNhbiBrZWVwIGNvbXBhcmluZyB0aGVtLCBtYWtpbmcgdGhpcyBjb2RlIHZlcnkgZmxleGlibGUuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRkaWYgPSAoaSA8IDIpID8gZHggLSB0LmllT2Zmc2V0WCA6IGR5IC0gdC5pZU9mZnNldFk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzdHlsZVtwcm9wXSA9ICh0W3Byb3BdID0gTWF0aC5yb3VuZCggdmFsIC0gZGlmICogKChpID09PSAwIHx8IGkgPT09IDIpID8gMSA6IG11bHQpICkpICsgXCJweFwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0LyogdHJhbnNsYXRlcyBhIHN1cGVyIHNtYWxsIGRlY2ltYWwgdG8gYSBzdHJpbmcgV0lUSE9VVCBzY2llbnRpZmljIG5vdGF0aW9uXG5cdFx0XHRfc2FmZURlY2ltYWwgPSBmdW5jdGlvbihuKSB7XG5cdFx0XHRcdHZhciBzID0gKG4gPCAwID8gLW4gOiBuKSArIFwiXCIsXG5cdFx0XHRcdFx0YSA9IHMuc3BsaXQoXCJlLVwiKTtcblx0XHRcdFx0cmV0dXJuIChuIDwgMCA/IFwiLTAuXCIgOiBcIjAuXCIpICsgbmV3IEFycmF5KHBhcnNlSW50KGFbMV0sIDEwKSB8fCAwKS5qb2luKFwiMFwiKSArIGFbMF0uc3BsaXQoXCIuXCIpLmpvaW4oXCJcIik7XG5cdFx0XHR9LFxuXHRcdFx0Ki9cblxuXHRcdFx0X3NldFRyYW5zZm9ybVJhdGlvID0gX2ludGVybmFscy5zZXQzRFRyYW5zZm9ybVJhdGlvID0gX2ludGVybmFscy5zZXRUcmFuc2Zvcm1SYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0dmFyIHQgPSB0aGlzLmRhdGEsIC8vcmVmZXJzIHRvIHRoZSBlbGVtZW50J3MgX2dzVHJhbnNmb3JtIG9iamVjdFxuXHRcdFx0XHRcdHN0eWxlID0gdGhpcy50LnN0eWxlLFxuXHRcdFx0XHRcdGFuZ2xlID0gdC5yb3RhdGlvbixcblx0XHRcdFx0XHRyb3RhdGlvblggPSB0LnJvdGF0aW9uWCxcblx0XHRcdFx0XHRyb3RhdGlvblkgPSB0LnJvdGF0aW9uWSxcblx0XHRcdFx0XHRzeCA9IHQuc2NhbGVYLFxuXHRcdFx0XHRcdHN5ID0gdC5zY2FsZVksXG5cdFx0XHRcdFx0c3ogPSB0LnNjYWxlWixcblx0XHRcdFx0XHR4ID0gdC54LFxuXHRcdFx0XHRcdHkgPSB0LnksXG5cdFx0XHRcdFx0eiA9IHQueixcblx0XHRcdFx0XHRpc1NWRyA9IHQuc3ZnLFxuXHRcdFx0XHRcdHBlcnNwZWN0aXZlID0gdC5wZXJzcGVjdGl2ZSxcblx0XHRcdFx0XHRmb3JjZTNEID0gdC5mb3JjZTNELFxuXHRcdFx0XHRcdGExMSwgYTEyLCBhMTMsIGEyMSwgYTIyLCBhMjMsIGEzMSwgYTMyLCBhMzMsIGE0MSwgYTQyLCBhNDMsXG5cdFx0XHRcdFx0ek9yaWdpbiwgbWluLCBjb3MsIHNpbiwgdDEsIHQyLCB0cmFuc2Zvcm0sIGNvbW1hLCB6ZXJvLCBza2V3LCBybmQ7XG5cdFx0XHRcdC8vY2hlY2sgdG8gc2VlIGlmIHdlIHNob3VsZCByZW5kZXIgYXMgMkQgKGFuZCBTVkdzIG11c3QgdXNlIDJEIHdoZW4gX3VzZVNWR1RyYW5zZm9ybUF0dHIgaXMgdHJ1ZSlcblx0XHRcdFx0aWYgKCgoKCh2ID09PSAxIHx8IHYgPT09IDApICYmIGZvcmNlM0QgPT09IFwiYXV0b1wiICYmICh0aGlzLnR3ZWVuLl90b3RhbFRpbWUgPT09IHRoaXMudHdlZW4uX3RvdGFsRHVyYXRpb24gfHwgIXRoaXMudHdlZW4uX3RvdGFsVGltZSkpIHx8ICFmb3JjZTNEKSAmJiAheiAmJiAhcGVyc3BlY3RpdmUgJiYgIXJvdGF0aW9uWSAmJiAhcm90YXRpb25YICYmIHN6ID09PSAxKSB8fCAoX3VzZVNWR1RyYW5zZm9ybUF0dHIgJiYgaXNTVkcpIHx8ICFfc3VwcG9ydHMzRCkgeyAvL29uIHRoZSBmaW5hbCByZW5kZXIgKHdoaWNoIGNvdWxkIGJlIDAgZm9yIGEgZnJvbSB0d2VlbiksIGlmIHRoZXJlIGFyZSBubyAzRCBhc3BlY3RzLCByZW5kZXIgaW4gMkQgdG8gZnJlZSB1cCBtZW1vcnkgYW5kIGltcHJvdmUgcGVyZm9ybWFuY2UgZXNwZWNpYWxseSBvbiBtb2JpbGUgZGV2aWNlcy4gQ2hlY2sgdGhlIHR3ZWVuJ3MgdG90YWxUaW1lL3RvdGFsRHVyYXRpb24gdG9vIGluIG9yZGVyIHRvIG1ha2Ugc3VyZSBpdCBkb2Vzbid0IGhhcHBlbiBiZXR3ZWVuIHJlcGVhdHMgaWYgaXQncyBhIHJlcGVhdGluZyB0d2Vlbi5cblxuXHRcdFx0XHRcdC8vMkRcblx0XHRcdFx0XHRpZiAoYW5nbGUgfHwgdC5za2V3WCB8fCBpc1NWRykge1xuXHRcdFx0XHRcdFx0YW5nbGUgKj0gX0RFRzJSQUQ7XG5cdFx0XHRcdFx0XHRza2V3ID0gdC5za2V3WCAqIF9ERUcyUkFEO1xuXHRcdFx0XHRcdFx0cm5kID0gMTAwMDAwO1xuXHRcdFx0XHRcdFx0YTExID0gTWF0aC5jb3MoYW5nbGUpICogc3g7XG5cdFx0XHRcdFx0XHRhMjEgPSBNYXRoLnNpbihhbmdsZSkgKiBzeDtcblx0XHRcdFx0XHRcdGExMiA9IE1hdGguc2luKGFuZ2xlIC0gc2tldykgKiAtc3k7XG5cdFx0XHRcdFx0XHRhMjIgPSBNYXRoLmNvcyhhbmdsZSAtIHNrZXcpICogc3k7XG5cdFx0XHRcdFx0XHRpZiAoc2tldyAmJiB0LnNrZXdUeXBlID09PSBcInNpbXBsZVwiKSB7IC8vYnkgZGVmYXVsdCwgd2UgY29tcGVuc2F0ZSBza2V3aW5nIG9uIHRoZSBvdGhlciBheGlzIHRvIG1ha2UgaXQgbG9vayBtb3JlIG5hdHVyYWwsIGJ1dCB5b3UgY2FuIHNldCB0aGUgc2tld1R5cGUgdG8gXCJzaW1wbGVcIiB0byB1c2UgdGhlIHVuY29tcGVuc2F0ZWQgc2tld2luZyB0aGF0IENTUyBkb2VzXG5cdFx0XHRcdFx0XHRcdHQxID0gTWF0aC50YW4oc2tldyk7XG5cdFx0XHRcdFx0XHRcdHQxID0gTWF0aC5zcXJ0KDEgKyB0MSAqIHQxKTtcblx0XHRcdFx0XHRcdFx0YTEyICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRhMjIgKj0gdDE7XG5cdFx0XHRcdFx0XHRcdGlmICh0LnNrZXdZKSB7XG5cdFx0XHRcdFx0XHRcdFx0YTExICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRcdGEyMSAqPSB0MTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGlzU1ZHKSB7XG5cdFx0XHRcdFx0XHRcdHggKz0gdC54T3JpZ2luIC0gKHQueE9yaWdpbiAqIGExMSArIHQueU9yaWdpbiAqIGExMikgKyB0LnhPZmZzZXQ7XG5cdFx0XHRcdFx0XHRcdHkgKz0gdC55T3JpZ2luIC0gKHQueE9yaWdpbiAqIGEyMSArIHQueU9yaWdpbiAqIGEyMikgKyB0LnlPZmZzZXQ7XG5cdFx0XHRcdFx0XHRcdGlmIChfdXNlU1ZHVHJhbnNmb3JtQXR0ciAmJiAodC54UGVyY2VudCB8fCB0LnlQZXJjZW50KSkgeyAvL1RoZSBTVkcgc3BlYyBkb2Vzbid0IHN1cHBvcnQgcGVyY2VudGFnZS1iYXNlZCB0cmFuc2xhdGlvbiBpbiB0aGUgXCJ0cmFuc2Zvcm1cIiBhdHRyaWJ1dGUsIHNvIHdlIG1lcmdlIGl0IGludG8gdGhlIG1hdHJpeCB0byBzaW11bGF0ZSBpdC5cblx0XHRcdFx0XHRcdFx0XHRtaW4gPSB0aGlzLnQuZ2V0QkJveCgpO1xuXHRcdFx0XHRcdFx0XHRcdHggKz0gdC54UGVyY2VudCAqIDAuMDEgKiBtaW4ud2lkdGg7XG5cdFx0XHRcdFx0XHRcdFx0eSArPSB0LnlQZXJjZW50ICogMC4wMSAqIG1pbi5oZWlnaHQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0bWluID0gMC4wMDAwMDE7XG5cdFx0XHRcdFx0XHRcdGlmICh4IDwgbWluKSBpZiAoeCA+IC1taW4pIHtcblx0XHRcdFx0XHRcdFx0XHR4ID0gMDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoeSA8IG1pbikgaWYgKHkgPiAtbWluKSB7XG5cdFx0XHRcdFx0XHRcdFx0eSA9IDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRyYW5zZm9ybSA9ICgoKGExMSAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArICgoKGEyMSAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArICgoKGExMiAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArICgoKGEyMiAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArIHggKyBcIixcIiArIHkgKyBcIilcIjtcblx0XHRcdFx0XHRcdGlmIChpc1NWRyAmJiBfdXNlU1ZHVHJhbnNmb3JtQXR0cikge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwibWF0cml4KFwiICsgdHJhbnNmb3JtKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdC8vc29tZSBicm93c2VycyBoYXZlIGEgaGFyZCB0aW1lIHdpdGggdmVyeSBzbWFsbCB2YWx1ZXMgbGlrZSAyLjQ0OTI5MzU5ODI5NDcwNjRlLTE2IChub3RpY2UgdGhlIFwiZS1cIiB0b3dhcmRzIHRoZSBlbmQpIGFuZCB3b3VsZCByZW5kZXIgdGhlIG9iamVjdCBzbGlnaHRseSBvZmYuIFNvIHdlIHJvdW5kIHRvIDUgZGVjaW1hbCBwbGFjZXMuXG5cdFx0XHRcdFx0XHRcdHN0eWxlW190cmFuc2Zvcm1Qcm9wXSA9ICgodC54UGVyY2VudCB8fCB0LnlQZXJjZW50KSA/IFwidHJhbnNsYXRlKFwiICsgdC54UGVyY2VudCArIFwiJSxcIiArIHQueVBlcmNlbnQgKyBcIiUpIG1hdHJpeChcIiA6IFwibWF0cml4KFwiKSArIHRyYW5zZm9ybTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3R5bGVbX3RyYW5zZm9ybVByb3BdID0gKCh0LnhQZXJjZW50IHx8IHQueVBlcmNlbnQpID8gXCJ0cmFuc2xhdGUoXCIgKyB0LnhQZXJjZW50ICsgXCIlLFwiICsgdC55UGVyY2VudCArIFwiJSkgbWF0cml4KFwiIDogXCJtYXRyaXgoXCIpICsgc3ggKyBcIiwwLDAsXCIgKyBzeSArIFwiLFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoX2lzRmlyZWZveCkgeyAvL0ZpcmVmb3ggaGFzIGEgYnVnIChhdCBsZWFzdCBpbiB2MjUpIHRoYXQgY2F1c2VzIGl0IHRvIHJlbmRlciB0aGUgdHJhbnNwYXJlbnQgcGFydCBvZiAzMi1iaXQgUE5HIGltYWdlcyBhcyBibGFjayB3aGVuIGRpc3BsYXllZCBpbnNpZGUgYW4gaWZyYW1lIGFuZCB0aGUgM0Qgc2NhbGUgaXMgdmVyeSBzbWFsbCBhbmQgZG9lc24ndCBjaGFuZ2Ugc3VmZmljaWVudGx5IGVub3VnaCBiZXR3ZWVuIHJlbmRlcnMgKGxpa2UgaWYgeW91IHVzZSBhIFBvd2VyNC5lYXNlSW5PdXQgdG8gc2NhbGUgZnJvbSAwIHRvIDEgd2hlcmUgdGhlIGJlZ2lubmluZyB2YWx1ZXMgb25seSBjaGFuZ2UgYSB0aW55IGFtb3VudCB0byBiZWdpbiB0aGUgdHdlZW4gYmVmb3JlIGFjY2VsZXJhdGluZykuIEluIHRoaXMgY2FzZSwgd2UgZm9yY2UgdGhlIHNjYWxlIHRvIGJlIDAuMDAwMDIgaW5zdGVhZCB3aGljaCBpcyB2aXN1YWxseSB0aGUgc2FtZSBidXQgd29ya3MgYXJvdW5kIHRoZSBGaXJlZm94IGlzc3VlLlxuXHRcdFx0XHRcdG1pbiA9IDAuMDAwMTtcblx0XHRcdFx0XHRpZiAoc3ggPCBtaW4gJiYgc3ggPiAtbWluKSB7XG5cdFx0XHRcdFx0XHRzeCA9IHN6ID0gMC4wMDAwMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHN5IDwgbWluICYmIHN5ID4gLW1pbikge1xuXHRcdFx0XHRcdFx0c3kgPSBzeiA9IDAuMDAwMDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwZXJzcGVjdGl2ZSAmJiAhdC56ICYmICF0LnJvdGF0aW9uWCAmJiAhdC5yb3RhdGlvblkpIHsgLy9GaXJlZm94IGhhcyBhIGJ1ZyB0aGF0IGNhdXNlcyBlbGVtZW50cyB0byBoYXZlIGFuIG9kZCBzdXBlci10aGluLCBicm9rZW4vZG90dGVkIGJsYWNrIGJvcmRlciBvbiBlbGVtZW50cyB0aGF0IGhhdmUgYSBwZXJzcGVjdGl2ZSBzZXQgYnV0IGFyZW4ndCB1dGlsaXppbmcgM0Qgc3BhY2UgKG5vIHJvdGF0aW9uWCwgcm90YXRpb25ZLCBvciB6KS5cblx0XHRcdFx0XHRcdHBlcnNwZWN0aXZlID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGFuZ2xlIHx8IHQuc2tld1gpIHtcblx0XHRcdFx0XHRhbmdsZSAqPSBfREVHMlJBRDtcblx0XHRcdFx0XHRjb3MgPSBhMTEgPSBNYXRoLmNvcyhhbmdsZSk7XG5cdFx0XHRcdFx0c2luID0gYTIxID0gTWF0aC5zaW4oYW5nbGUpO1xuXHRcdFx0XHRcdGlmICh0LnNrZXdYKSB7XG5cdFx0XHRcdFx0XHRhbmdsZSAtPSB0LnNrZXdYICogX0RFRzJSQUQ7XG5cdFx0XHRcdFx0XHRjb3MgPSBNYXRoLmNvcyhhbmdsZSk7XG5cdFx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cdFx0XHRcdFx0XHRpZiAodC5za2V3VHlwZSA9PT0gXCJzaW1wbGVcIikgeyAvL2J5IGRlZmF1bHQsIHdlIGNvbXBlbnNhdGUgc2tld2luZyBvbiB0aGUgb3RoZXIgYXhpcyB0byBtYWtlIGl0IGxvb2sgbW9yZSBuYXR1cmFsLCBidXQgeW91IGNhbiBzZXQgdGhlIHNrZXdUeXBlIHRvIFwic2ltcGxlXCIgdG8gdXNlIHRoZSB1bmNvbXBlbnNhdGVkIHNrZXdpbmcgdGhhdCBDU1MgZG9lc1xuXHRcdFx0XHRcdFx0XHR0MSA9IE1hdGgudGFuKHQuc2tld1ggKiBfREVHMlJBRCk7XG5cdFx0XHRcdFx0XHRcdHQxID0gTWF0aC5zcXJ0KDEgKyB0MSAqIHQxKTtcblx0XHRcdFx0XHRcdFx0Y29zICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRzaW4gKj0gdDE7XG5cdFx0XHRcdFx0XHRcdGlmICh0LnNrZXdZKSB7XG5cdFx0XHRcdFx0XHRcdFx0YTExICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRcdGEyMSAqPSB0MTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhMTIgPSAtc2luO1xuXHRcdFx0XHRcdGEyMiA9IGNvcztcblxuXHRcdFx0XHR9IGVsc2UgaWYgKCFyb3RhdGlvblkgJiYgIXJvdGF0aW9uWCAmJiBzeiA9PT0gMSAmJiAhcGVyc3BlY3RpdmUgJiYgIWlzU1ZHKSB7IC8vaWYgd2UncmUgb25seSB0cmFuc2xhdGluZyBhbmQvb3IgMkQgc2NhbGluZywgdGhpcyBpcyBmYXN0ZXIuLi5cblx0XHRcdFx0XHRzdHlsZVtfdHJhbnNmb3JtUHJvcF0gPSAoKHQueFBlcmNlbnQgfHwgdC55UGVyY2VudCkgPyBcInRyYW5zbGF0ZShcIiArIHQueFBlcmNlbnQgKyBcIiUsXCIgKyB0LnlQZXJjZW50ICsgXCIlKSB0cmFuc2xhdGUzZChcIiA6IFwidHJhbnNsYXRlM2QoXCIpICsgeCArIFwicHgsXCIgKyB5ICsgXCJweCxcIiArIHogK1wicHgpXCIgKyAoKHN4ICE9PSAxIHx8IHN5ICE9PSAxKSA/IFwiIHNjYWxlKFwiICsgc3ggKyBcIixcIiArIHN5ICsgXCIpXCIgOiBcIlwiKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YTExID0gYTIyID0gMTtcblx0XHRcdFx0XHRhMTIgPSBhMjEgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEtFWSAgSU5ERVggICBBRkZFQ1RTXG5cdFx0XHRcdC8vIGExMSAgMCAgICAgICByb3RhdGlvbiwgcm90YXRpb25ZLCBzY2FsZVhcblx0XHRcdFx0Ly8gYTIxICAxICAgICAgIHJvdGF0aW9uLCByb3RhdGlvblksIHNjYWxlWFxuXHRcdFx0XHQvLyBhMzEgIDIgICAgICAgcm90YXRpb25ZLCBzY2FsZVhcblx0XHRcdFx0Ly8gYTQxICAzICAgICAgIHJvdGF0aW9uWSwgc2NhbGVYXG5cdFx0XHRcdC8vIGExMiAgNCAgICAgICByb3RhdGlvbiwgc2tld1gsIHJvdGF0aW9uWCwgc2NhbGVZXG5cdFx0XHRcdC8vIGEyMiAgNSAgICAgICByb3RhdGlvbiwgc2tld1gsIHJvdGF0aW9uWCwgc2NhbGVZXG5cdFx0XHRcdC8vIGEzMiAgNiAgICAgICByb3RhdGlvblgsIHNjYWxlWVxuXHRcdFx0XHQvLyBhNDIgIDcgICAgICAgcm90YXRpb25YLCBzY2FsZVlcblx0XHRcdFx0Ly8gYTEzICA4ICAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBzY2FsZVpcblx0XHRcdFx0Ly8gYTIzICA5ICAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBzY2FsZVpcblx0XHRcdFx0Ly8gYTMzICAxMCAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBzY2FsZVpcblx0XHRcdFx0Ly8gYTQzICAxMSAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBwZXJzcGVjdGl2ZSwgc2NhbGVaXG5cdFx0XHRcdC8vIGExNCAgMTIgICAgICB4LCB6T3JpZ2luLCBzdmdPcmlnaW5cblx0XHRcdFx0Ly8gYTI0ICAxMyAgICAgIHksIHpPcmlnaW4sIHN2Z09yaWdpblxuXHRcdFx0XHQvLyBhMzQgIDE0ICAgICAgeiwgek9yaWdpblxuXHRcdFx0XHQvLyBhNDQgIDE1XG5cdFx0XHRcdC8vIHJvdGF0aW9uOiBNYXRoLmF0YW4yKGEyMSwgYTExKVxuXHRcdFx0XHQvLyByb3RhdGlvblk6IE1hdGguYXRhbjIoYTEzLCBhMzMpIChvciBNYXRoLmF0YW4yKGExMywgYTExKSlcblx0XHRcdFx0Ly8gcm90YXRpb25YOiBNYXRoLmF0YW4yKGEzMiwgYTMzKVxuXHRcdFx0XHRhMzMgPSAxO1xuXHRcdFx0XHRhMTMgPSBhMjMgPSBhMzEgPSBhMzIgPSBhNDEgPSBhNDIgPSAwO1xuXHRcdFx0XHRhNDMgPSAocGVyc3BlY3RpdmUpID8gLTEgLyBwZXJzcGVjdGl2ZSA6IDA7XG5cdFx0XHRcdHpPcmlnaW4gPSB0LnpPcmlnaW47XG5cdFx0XHRcdG1pbiA9IDAuMDAwMDAxOyAvL3RocmVzaG9sZCBiZWxvdyB3aGljaCBicm93c2VycyB1c2Ugc2NpZW50aWZpYyBub3RhdGlvbiB3aGljaCB3b24ndCB3b3JrLlxuXHRcdFx0XHRjb21tYSA9IFwiLFwiO1xuXHRcdFx0XHR6ZXJvID0gXCIwXCI7XG5cdFx0XHRcdGFuZ2xlID0gcm90YXRpb25ZICogX0RFRzJSQUQ7XG5cdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcblx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cdFx0XHRcdFx0YTMxID0gLXNpbjtcblx0XHRcdFx0XHRhNDEgPSBhNDMqLXNpbjtcblx0XHRcdFx0XHRhMTMgPSBhMTEqc2luO1xuXHRcdFx0XHRcdGEyMyA9IGEyMSpzaW47XG5cdFx0XHRcdFx0YTMzID0gY29zO1xuXHRcdFx0XHRcdGE0MyAqPSBjb3M7XG5cdFx0XHRcdFx0YTExICo9IGNvcztcblx0XHRcdFx0XHRhMjEgKj0gY29zO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFuZ2xlID0gcm90YXRpb25YICogX0RFRzJSQUQ7XG5cdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcblx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cdFx0XHRcdFx0dDEgPSBhMTIqY29zK2ExMypzaW47XG5cdFx0XHRcdFx0dDIgPSBhMjIqY29zK2EyMypzaW47XG5cdFx0XHRcdFx0YTMyID0gYTMzKnNpbjtcblx0XHRcdFx0XHRhNDIgPSBhNDMqc2luO1xuXHRcdFx0XHRcdGExMyA9IGExMiotc2luK2ExMypjb3M7XG5cdFx0XHRcdFx0YTIzID0gYTIyKi1zaW4rYTIzKmNvcztcblx0XHRcdFx0XHRhMzMgPSBhMzMqY29zO1xuXHRcdFx0XHRcdGE0MyA9IGE0Mypjb3M7XG5cdFx0XHRcdFx0YTEyID0gdDE7XG5cdFx0XHRcdFx0YTIyID0gdDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHN6ICE9PSAxKSB7XG5cdFx0XHRcdFx0YTEzKj1zejtcblx0XHRcdFx0XHRhMjMqPXN6O1xuXHRcdFx0XHRcdGEzMyo9c3o7XG5cdFx0XHRcdFx0YTQzKj1zejtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc3kgIT09IDEpIHtcblx0XHRcdFx0XHRhMTIqPXN5O1xuXHRcdFx0XHRcdGEyMio9c3k7XG5cdFx0XHRcdFx0YTMyKj1zeTtcblx0XHRcdFx0XHRhNDIqPXN5O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzeCAhPT0gMSkge1xuXHRcdFx0XHRcdGExMSo9c3g7XG5cdFx0XHRcdFx0YTIxKj1zeDtcblx0XHRcdFx0XHRhMzEqPXN4O1xuXHRcdFx0XHRcdGE0MSo9c3g7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoek9yaWdpbiB8fCBpc1NWRykge1xuXHRcdFx0XHRcdGlmICh6T3JpZ2luKSB7XG5cdFx0XHRcdFx0XHR4ICs9IGExMyotek9yaWdpbjtcblx0XHRcdFx0XHRcdHkgKz0gYTIzKi16T3JpZ2luO1xuXHRcdFx0XHRcdFx0eiArPSBhMzMqLXpPcmlnaW4rek9yaWdpbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGlzU1ZHKSB7IC8vZHVlIHRvIGJ1Z3MgaW4gc29tZSBicm93c2Vycywgd2UgbmVlZCB0byBtYW5hZ2UgdGhlIHRyYW5zZm9ybS1vcmlnaW4gb2YgU1ZHIG1hbnVhbGx5XG5cdFx0XHRcdFx0XHR4ICs9IHQueE9yaWdpbiAtICh0LnhPcmlnaW4gKiBhMTEgKyB0LnlPcmlnaW4gKiBhMTIpICsgdC54T2Zmc2V0O1xuXHRcdFx0XHRcdFx0eSArPSB0LnlPcmlnaW4gLSAodC54T3JpZ2luICogYTIxICsgdC55T3JpZ2luICogYTIyKSArIHQueU9mZnNldDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHggPCBtaW4gJiYgeCA+IC1taW4pIHtcblx0XHRcdFx0XHRcdHggPSB6ZXJvO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoeSA8IG1pbiAmJiB5ID4gLW1pbikge1xuXHRcdFx0XHRcdFx0eSA9IHplcm87XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh6IDwgbWluICYmIHogPiAtbWluKSB7XG5cdFx0XHRcdFx0XHR6ID0gMDsgLy9kb24ndCB1c2Ugc3RyaW5nIGJlY2F1c2Ugd2UgY2FsY3VsYXRlIHBlcnNwZWN0aXZlIGxhdGVyIGFuZCBuZWVkIHRoZSBudW1iZXIuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9vcHRpbWl6ZWQgd2F5IG9mIGNvbmNhdGVuYXRpbmcgYWxsIHRoZSB2YWx1ZXMgaW50byBhIHN0cmluZy4gSWYgd2UgZG8gaXQgYWxsIGluIG9uZSBzaG90LCBpdCdzIHNsb3dlciBiZWNhdXNlIG9mIHRoZSB3YXkgYnJvd3NlcnMgaGF2ZSB0byBjcmVhdGUgdGVtcCBzdHJpbmdzIGFuZCB0aGUgd2F5IGl0IGFmZmVjdHMgbWVtb3J5LiBJZiB3ZSBkbyBpdCBwaWVjZS1ieS1waWVjZSB3aXRoICs9LCBpdCdzIGEgYml0IHNsb3dlciB0b28uIFdlIGZvdW5kIHRoYXQgZG9pbmcgaXQgaW4gdGhlc2Ugc2l6ZWQgY2h1bmtzIHdvcmtzIGJlc3Qgb3ZlcmFsbDpcblx0XHRcdFx0dHJhbnNmb3JtID0gKCh0LnhQZXJjZW50IHx8IHQueVBlcmNlbnQpID8gXCJ0cmFuc2xhdGUoXCIgKyB0LnhQZXJjZW50ICsgXCIlLFwiICsgdC55UGVyY2VudCArIFwiJSkgbWF0cml4M2QoXCIgOiBcIm1hdHJpeDNkKFwiKTtcblx0XHRcdFx0dHJhbnNmb3JtICs9ICgoYTExIDwgbWluICYmIGExMSA+IC1taW4pID8gemVybyA6IGExMSkgKyBjb21tYSArICgoYTIxIDwgbWluICYmIGEyMSA+IC1taW4pID8gemVybyA6IGEyMSkgKyBjb21tYSArICgoYTMxIDwgbWluICYmIGEzMSA+IC1taW4pID8gemVybyA6IGEzMSk7XG5cdFx0XHRcdHRyYW5zZm9ybSArPSBjb21tYSArICgoYTQxIDwgbWluICYmIGE0MSA+IC1taW4pID8gemVybyA6IGE0MSkgKyBjb21tYSArICgoYTEyIDwgbWluICYmIGExMiA+IC1taW4pID8gemVybyA6IGExMikgKyBjb21tYSArICgoYTIyIDwgbWluICYmIGEyMiA+IC1taW4pID8gemVybyA6IGEyMik7XG5cdFx0XHRcdGlmIChyb3RhdGlvblggfHwgcm90YXRpb25ZIHx8IHN6ICE9PSAxKSB7IC8vcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uIChvZnRlbiB0aGVyZSdzIG5vIHJvdGF0aW9uWCBvciByb3RhdGlvblksIHNvIHdlIGNhbiBza2lwIHRoZXNlIGNhbGN1bGF0aW9ucylcblx0XHRcdFx0XHR0cmFuc2Zvcm0gKz0gY29tbWEgKyAoKGEzMiA8IG1pbiAmJiBhMzIgPiAtbWluKSA/IHplcm8gOiBhMzIpICsgY29tbWEgKyAoKGE0MiA8IG1pbiAmJiBhNDIgPiAtbWluKSA/IHplcm8gOiBhNDIpICsgY29tbWEgKyAoKGExMyA8IG1pbiAmJiBhMTMgPiAtbWluKSA/IHplcm8gOiBhMTMpO1xuXHRcdFx0XHRcdHRyYW5zZm9ybSArPSBjb21tYSArICgoYTIzIDwgbWluICYmIGEyMyA+IC1taW4pID8gemVybyA6IGEyMykgKyBjb21tYSArICgoYTMzIDwgbWluICYmIGEzMyA+IC1taW4pID8gemVybyA6IGEzMykgKyBjb21tYSArICgoYTQzIDwgbWluICYmIGE0MyA+IC1taW4pID8gemVybyA6IGE0MykgKyBjb21tYTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gKz0gXCIsMCwwLDAsMCwxLDAsXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHJhbnNmb3JtICs9IHggKyBjb21tYSArIHkgKyBjb21tYSArIHogKyBjb21tYSArIChwZXJzcGVjdGl2ZSA/ICgxICsgKC16IC8gcGVyc3BlY3RpdmUpKSA6IDEpICsgXCIpXCI7XG5cblx0XHRcdFx0c3R5bGVbX3RyYW5zZm9ybVByb3BdID0gdHJhbnNmb3JtO1xuXHRcdFx0fTtcblxuXHRcdHAgPSBUcmFuc2Zvcm0ucHJvdG90eXBlO1xuXHRcdHAueCA9IHAueSA9IHAueiA9IHAuc2tld1ggPSBwLnNrZXdZID0gcC5yb3RhdGlvbiA9IHAucm90YXRpb25YID0gcC5yb3RhdGlvblkgPSBwLnpPcmlnaW4gPSBwLnhQZXJjZW50ID0gcC55UGVyY2VudCA9IHAueE9mZnNldCA9IHAueU9mZnNldCA9IDA7XG5cdFx0cC5zY2FsZVggPSBwLnNjYWxlWSA9IHAuc2NhbGVaID0gMTtcblxuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInRyYW5zZm9ybSxzY2FsZSxzY2FsZVgsc2NhbGVZLHNjYWxlWix4LHkseixyb3RhdGlvbixyb3RhdGlvblgscm90YXRpb25ZLHJvdGF0aW9uWixza2V3WCxza2V3WSxzaG9ydFJvdGF0aW9uLHNob3J0Um90YXRpb25YLHNob3J0Um90YXRpb25ZLHNob3J0Um90YXRpb25aLHRyYW5zZm9ybU9yaWdpbixzdmdPcmlnaW4sdHJhbnNmb3JtUGVyc3BlY3RpdmUsZGlyZWN0aW9uYWxSb3RhdGlvbixwYXJzZVRyYW5zZm9ybSxmb3JjZTNELHNrZXdUeXBlLHhQZXJjZW50LHlQZXJjZW50LHNtb290aE9yaWdpblwiLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdGlmIChjc3NwLl9sYXN0UGFyc2VkVHJhbnNmb3JtID09PSB2YXJzKSB7IHJldHVybiBwdDsgfSAvL29ubHkgbmVlZCB0byBwYXJzZSB0aGUgdHJhbnNmb3JtIG9uY2UsIGFuZCBvbmx5IGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIGl0LlxuXHRcdFx0Y3NzcC5fbGFzdFBhcnNlZFRyYW5zZm9ybSA9IHZhcnM7XG5cdFx0XHR2YXIgb3JpZ2luYWxHU1RyYW5zZm9ybSA9IHQuX2dzVHJhbnNmb3JtLFxuXHRcdFx0XHRzdHlsZSA9IHQuc3R5bGUsXG5cdFx0XHRcdG1pbiA9IDAuMDAwMDAxLFxuXHRcdFx0XHRpID0gX3RyYW5zZm9ybVByb3BzLmxlbmd0aCxcblx0XHRcdFx0diA9IHZhcnMsXG5cdFx0XHRcdGVuZFJvdGF0aW9ucyA9IHt9LFxuXHRcdFx0XHR0cmFuc2Zvcm1PcmlnaW5TdHJpbmcgPSBcInRyYW5zZm9ybU9yaWdpblwiLFxuXHRcdFx0XHRtMSwgbTIsIHNrZXdZLCBjb3B5LCBvcmlnLCBoYXMzRCwgaGFzQ2hhbmdlLCBkciwgeCwgeTtcblx0XHRcdGlmICh2YXJzLmRpc3BsYXkpIHsgLy9pZiB0aGUgdXNlciBpcyBzZXR0aW5nIGRpc3BsYXkgZHVyaW5nIHRoaXMgdHdlZW4sIGl0IG1heSBub3QgYmUgaW5zdGFudGlhdGVkIHlldCBidXQgd2UgbXVzdCBmb3JjZSBpdCBoZXJlIGluIG9yZGVyIHRvIGdldCBhY2N1cmF0ZSByZWFkaW5ncy4gSWYgZGlzcGxheSBpcyBcIm5vbmVcIiwgc29tZSBicm93c2VycyByZWZ1c2UgdG8gcmVwb3J0IHRoZSB0cmFuc2Zvcm0gcHJvcGVydGllcyBjb3JyZWN0bHkuXG5cdFx0XHRcdGNvcHkgPSBfZ2V0U3R5bGUodCwgXCJkaXNwbGF5XCIpO1xuXHRcdFx0XHRzdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXHRcdFx0XHRtMSA9IF9nZXRUcmFuc2Zvcm0odCwgX2NzLCB0cnVlLCB2YXJzLnBhcnNlVHJhbnNmb3JtKTtcblx0XHRcdFx0c3R5bGUuZGlzcGxheSA9IGNvcHk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtMSA9IF9nZXRUcmFuc2Zvcm0odCwgX2NzLCB0cnVlLCB2YXJzLnBhcnNlVHJhbnNmb3JtKTtcblx0XHRcdH1cblx0XHRcdGNzc3AuX3RyYW5zZm9ybSA9IG0xO1xuXHRcdFx0aWYgKHR5cGVvZih2LnRyYW5zZm9ybSkgPT09IFwic3RyaW5nXCIgJiYgX3RyYW5zZm9ybVByb3ApIHsgLy9mb3IgdmFsdWVzIGxpa2UgdHJhbnNmb3JtOlwicm90YXRlKDYwZGVnKSBzY2FsZSgwLjUsIDAuOClcIlxuXHRcdFx0XHRjb3B5ID0gX3RlbXBEaXYuc3R5bGU7IC8vZG9uJ3QgdXNlIHRoZSBvcmlnaW5hbCB0YXJnZXQgYmVjYXVzZSBpdCBtaWdodCBiZSBTVkcgaW4gd2hpY2ggY2FzZSBzb21lIGJyb3dzZXJzIGRvbid0IHJlcG9ydCBjb21wdXRlZCBzdHlsZSBjb3JyZWN0bHkuXG5cdFx0XHRcdGNvcHlbX3RyYW5zZm9ybVByb3BdID0gdi50cmFuc2Zvcm07XG5cdFx0XHRcdGNvcHkuZGlzcGxheSA9IFwiYmxvY2tcIjsgLy9pZiBkaXNwbGF5IGlzIFwibm9uZVwiLCB0aGUgYnJvd3NlciBvZnRlbiByZWZ1c2VzIHRvIHJlcG9ydCB0aGUgdHJhbnNmb3JtIHByb3BlcnRpZXMgY29ycmVjdGx5LlxuXHRcdFx0XHRjb3B5LnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHRcdFx0XHRfZG9jLmJvZHkuYXBwZW5kQ2hpbGQoX3RlbXBEaXYpO1xuXHRcdFx0XHRtMiA9IF9nZXRUcmFuc2Zvcm0oX3RlbXBEaXYsIG51bGwsIGZhbHNlKTtcblx0XHRcdFx0X2RvYy5ib2R5LnJlbW92ZUNoaWxkKF90ZW1wRGl2KTtcblx0XHRcdFx0aWYgKCFtMi5wZXJzcGVjdGl2ZSkge1xuXHRcdFx0XHRcdG0yLnBlcnNwZWN0aXZlID0gbTEucGVyc3BlY3RpdmU7IC8vdHdlZW5pbmcgdG8gbm8gcGVyc3BlY3RpdmUgZ2l2ZXMgdmVyeSB1bmludHVpdGl2ZSByZXN1bHRzIC0ganVzdCBrZWVwIHRoZSBzYW1lIHBlcnNwZWN0aXZlIGluIHRoYXQgY2FzZS5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodi54UGVyY2VudCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0bTIueFBlcmNlbnQgPSBfcGFyc2VWYWwodi54UGVyY2VudCwgbTEueFBlcmNlbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2LnlQZXJjZW50ICE9IG51bGwpIHtcblx0XHRcdFx0XHRtMi55UGVyY2VudCA9IF9wYXJzZVZhbCh2LnlQZXJjZW50LCBtMS55UGVyY2VudCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mKHYpID09PSBcIm9iamVjdFwiKSB7IC8vZm9yIHZhbHVlcyBsaWtlIHNjYWxlWCwgc2NhbGVZLCByb3RhdGlvbiwgeCwgeSwgc2tld1gsIGFuZCBza2V3WSBvciB0cmFuc2Zvcm06ey4uLn0gKG9iamVjdClcblx0XHRcdFx0bTIgPSB7c2NhbGVYOl9wYXJzZVZhbCgodi5zY2FsZVggIT0gbnVsbCkgPyB2LnNjYWxlWCA6IHYuc2NhbGUsIG0xLnNjYWxlWCksXG5cdFx0XHRcdFx0c2NhbGVZOl9wYXJzZVZhbCgodi5zY2FsZVkgIT0gbnVsbCkgPyB2LnNjYWxlWSA6IHYuc2NhbGUsIG0xLnNjYWxlWSksXG5cdFx0XHRcdFx0c2NhbGVaOl9wYXJzZVZhbCh2LnNjYWxlWiwgbTEuc2NhbGVaKSxcblx0XHRcdFx0XHR4Ol9wYXJzZVZhbCh2LngsIG0xLngpLFxuXHRcdFx0XHRcdHk6X3BhcnNlVmFsKHYueSwgbTEueSksXG5cdFx0XHRcdFx0ejpfcGFyc2VWYWwodi56LCBtMS56KSxcblx0XHRcdFx0XHR4UGVyY2VudDpfcGFyc2VWYWwodi54UGVyY2VudCwgbTEueFBlcmNlbnQpLFxuXHRcdFx0XHRcdHlQZXJjZW50Ol9wYXJzZVZhbCh2LnlQZXJjZW50LCBtMS55UGVyY2VudCksXG5cdFx0XHRcdFx0cGVyc3BlY3RpdmU6X3BhcnNlVmFsKHYudHJhbnNmb3JtUGVyc3BlY3RpdmUsIG0xLnBlcnNwZWN0aXZlKX07XG5cdFx0XHRcdGRyID0gdi5kaXJlY3Rpb25hbFJvdGF0aW9uO1xuXHRcdFx0XHRpZiAoZHIgIT0gbnVsbCkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YoZHIpID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGNvcHkgaW4gZHIpIHtcblx0XHRcdFx0XHRcdFx0dltjb3B5XSA9IGRyW2NvcHldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2LnJvdGF0aW9uID0gZHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0eXBlb2Yodi54KSA9PT0gXCJzdHJpbmdcIiAmJiB2LnguaW5kZXhPZihcIiVcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0bTIueCA9IDA7XG5cdFx0XHRcdFx0bTIueFBlcmNlbnQgPSBfcGFyc2VWYWwodi54LCBtMS54UGVyY2VudCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGVvZih2LnkpID09PSBcInN0cmluZ1wiICYmIHYueS5pbmRleE9mKFwiJVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRtMi55ID0gMDtcblx0XHRcdFx0XHRtMi55UGVyY2VudCA9IF9wYXJzZVZhbCh2LnksIG0xLnlQZXJjZW50KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG0yLnJvdGF0aW9uID0gX3BhcnNlQW5nbGUoKFwicm90YXRpb25cIiBpbiB2KSA/IHYucm90YXRpb24gOiAoXCJzaG9ydFJvdGF0aW9uXCIgaW4gdikgPyB2LnNob3J0Um90YXRpb24gKyBcIl9zaG9ydFwiIDogKFwicm90YXRpb25aXCIgaW4gdikgPyB2LnJvdGF0aW9uWiA6IG0xLnJvdGF0aW9uLCBtMS5yb3RhdGlvbiwgXCJyb3RhdGlvblwiLCBlbmRSb3RhdGlvbnMpO1xuXHRcdFx0XHRpZiAoX3N1cHBvcnRzM0QpIHtcblx0XHRcdFx0XHRtMi5yb3RhdGlvblggPSBfcGFyc2VBbmdsZSgoXCJyb3RhdGlvblhcIiBpbiB2KSA/IHYucm90YXRpb25YIDogKFwic2hvcnRSb3RhdGlvblhcIiBpbiB2KSA/IHYuc2hvcnRSb3RhdGlvblggKyBcIl9zaG9ydFwiIDogbTEucm90YXRpb25YIHx8IDAsIG0xLnJvdGF0aW9uWCwgXCJyb3RhdGlvblhcIiwgZW5kUm90YXRpb25zKTtcblx0XHRcdFx0XHRtMi5yb3RhdGlvblkgPSBfcGFyc2VBbmdsZSgoXCJyb3RhdGlvbllcIiBpbiB2KSA/IHYucm90YXRpb25ZIDogKFwic2hvcnRSb3RhdGlvbllcIiBpbiB2KSA/IHYuc2hvcnRSb3RhdGlvblkgKyBcIl9zaG9ydFwiIDogbTEucm90YXRpb25ZIHx8IDAsIG0xLnJvdGF0aW9uWSwgXCJyb3RhdGlvbllcIiwgZW5kUm90YXRpb25zKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRtMi5za2V3WCA9ICh2LnNrZXdYID09IG51bGwpID8gbTEuc2tld1ggOiBfcGFyc2VBbmdsZSh2LnNrZXdYLCBtMS5za2V3WCk7XG5cblx0XHRcdFx0Ly9ub3RlOiBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgd2UgY29tYmluZSBhbGwgc2tld2luZyBpbnRvIHRoZSBza2V3WCBhbmQgcm90YXRpb24gdmFsdWVzLCBpZ25vcmluZyBza2V3WSBidXQgd2UgbXVzdCBzdGlsbCByZWNvcmQgaXQgc28gdGhhdCB3ZSBjYW4gZGlzY2VybiBob3cgbXVjaCBvZiB0aGUgb3ZlcmFsbCBza2V3IGlzIGF0dHJpYnV0ZWQgdG8gc2tld1ggdnMuIHNrZXdZLiBPdGhlcndpc2UsIGlmIHRoZSBza2V3WSB3b3VsZCBhbHdheXMgYWN0IHJlbGF0aXZlICh0d2VlbiBza2V3WSB0byAxMGRlZywgZm9yIGV4YW1wbGUsIG11bHRpcGxlIHRpbWVzIGFuZCBpZiB3ZSBhbHdheXMgY29tYmluZSB0aGluZ3MgaW50byBza2V3WCwgd2UgY2FuJ3QgcmVtZW1iZXIgdGhhdCBza2V3WSB3YXMgMTAgZnJvbSBsYXN0IHRpbWUpLiBSZW1lbWJlciwgYSBza2V3WSBvZiAxMCBkZWdyZWVzIGxvb2tzIHRoZSBzYW1lIGFzIGEgcm90YXRpb24gb2YgMTAgZGVncmVlcyBwbHVzIGEgc2tld1ggb2YgLTEwIGRlZ3JlZXMuXG5cdFx0XHRcdG0yLnNrZXdZID0gKHYuc2tld1kgPT0gbnVsbCkgPyBtMS5za2V3WSA6IF9wYXJzZUFuZ2xlKHYuc2tld1ksIG0xLnNrZXdZKTtcblx0XHRcdFx0aWYgKChza2V3WSA9IG0yLnNrZXdZIC0gbTEuc2tld1kpKSB7XG5cdFx0XHRcdFx0bTIuc2tld1ggKz0gc2tld1k7XG5cdFx0XHRcdFx0bTIucm90YXRpb24gKz0gc2tld1k7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChfc3VwcG9ydHMzRCAmJiB2LmZvcmNlM0QgIT0gbnVsbCkge1xuXHRcdFx0XHRtMS5mb3JjZTNEID0gdi5mb3JjZTNEO1xuXHRcdFx0XHRoYXNDaGFuZ2UgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRtMS5za2V3VHlwZSA9IHYuc2tld1R5cGUgfHwgbTEuc2tld1R5cGUgfHwgQ1NTUGx1Z2luLmRlZmF1bHRTa2V3VHlwZTtcblxuXHRcdFx0aGFzM0QgPSAobTEuZm9yY2UzRCB8fCBtMS56IHx8IG0xLnJvdGF0aW9uWCB8fCBtMS5yb3RhdGlvblkgfHwgbTIueiB8fCBtMi5yb3RhdGlvblggfHwgbTIucm90YXRpb25ZIHx8IG0yLnBlcnNwZWN0aXZlKTtcblx0XHRcdGlmICghaGFzM0QgJiYgdi5zY2FsZSAhPSBudWxsKSB7XG5cdFx0XHRcdG0yLnNjYWxlWiA9IDE7IC8vbm8gbmVlZCB0byB0d2VlbiBzY2FsZVouXG5cdFx0XHR9XG5cblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRwID0gX3RyYW5zZm9ybVByb3BzW2ldO1xuXHRcdFx0XHRvcmlnID0gbTJbcF0gLSBtMVtwXTtcblx0XHRcdFx0aWYgKG9yaWcgPiBtaW4gfHwgb3JpZyA8IC1taW4gfHwgdltwXSAhPSBudWxsIHx8IF9mb3JjZVBUW3BdICE9IG51bGwpIHtcblx0XHRcdFx0XHRoYXNDaGFuZ2UgPSB0cnVlO1xuXHRcdFx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2VlbihtMSwgcCwgbTFbcF0sIG9yaWcsIHB0KTtcblx0XHRcdFx0XHRpZiAocCBpbiBlbmRSb3RhdGlvbnMpIHtcblx0XHRcdFx0XHRcdHB0LmUgPSBlbmRSb3RhdGlvbnNbcF07IC8vZGlyZWN0aW9uYWwgcm90YXRpb25zIHR5cGljYWxseSBoYXZlIGNvbXBlbnNhdGVkIHZhbHVlcyBkdXJpbmcgdGhlIHR3ZWVuLCBidXQgd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhleSBlbmQgYXQgZXhhY3RseSB3aGF0IHRoZSB1c2VyIHJlcXVlc3RlZFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdC54czAgPSAwOyAvL2Vuc3VyZXMgdGhlIHZhbHVlIHN0YXlzIG51bWVyaWMgaW4gc2V0UmF0aW8oKVxuXHRcdFx0XHRcdHB0LnBsdWdpbiA9IHBsdWdpbjtcblx0XHRcdFx0XHRjc3NwLl9vdmVyd3JpdGVQcm9wcy5wdXNoKHB0Lm4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdG9yaWcgPSB2LnRyYW5zZm9ybU9yaWdpbjtcblx0XHRcdGlmIChtMS5zdmcgJiYgKG9yaWcgfHwgdi5zdmdPcmlnaW4pKSB7XG5cdFx0XHRcdHggPSBtMS54T2Zmc2V0OyAvL3doZW4gd2UgY2hhbmdlIHRoZSBvcmlnaW4sIGluIG9yZGVyIHRvIHByZXZlbnQgdGhpbmdzIGZyb20ganVtcGluZyB3ZSBhZGp1c3QgdGhlIHgveSBzbyB3ZSBtdXN0IHJlY29yZCB0aG9zZSBoZXJlIHNvIHRoYXQgd2UgY2FuIGNyZWF0ZSBQcm9wVHdlZW5zIGZvciB0aGVtIGFuZCBmbGlwIHRoZW0gYXQgdGhlIHNhbWUgdGltZSBhcyB0aGUgb3JpZ2luXG5cdFx0XHRcdHkgPSBtMS55T2Zmc2V0O1xuXHRcdFx0XHRfcGFyc2VTVkdPcmlnaW4odCwgX3BhcnNlUG9zaXRpb24ob3JpZyksIG0yLCB2LnN2Z09yaWdpbiwgdi5zbW9vdGhPcmlnaW4pO1xuXHRcdFx0XHRwdCA9IF9hZGROb25Ud2VlbmluZ051bWVyaWNQVChtMSwgXCJ4T3JpZ2luXCIsIChvcmlnaW5hbEdTVHJhbnNmb3JtID8gbTEgOiBtMikueE9yaWdpbiwgbTIueE9yaWdpbiwgcHQsIHRyYW5zZm9ybU9yaWdpblN0cmluZyk7IC8vbm90ZTogaWYgdGhlcmUgd2Fzbid0IGEgdHJhbnNmb3JtT3JpZ2luIGRlZmluZWQgeWV0LCBqdXN0IHN0YXJ0IHdpdGggdGhlIGRlc3RpbmF0aW9uIG9uZTsgaXQncyB3YXN0ZWZ1bCBvdGhlcndpc2UsIGFuZCBpdCBjYXVzZXMgcHJvYmxlbXMgd2l0aCBmcm9tVG8oKSB0d2VlbnMuIEZvciBleGFtcGxlLCBUd2VlbkxpdGUudG8oXCIjd2hlZWxcIiwgMywge3JvdGF0aW9uOjE4MCwgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJVwiLCBkZWxheToxfSk7IFR3ZWVuTGl0ZS5mcm9tVG8oXCIjd2hlZWxcIiwgMywge3NjYWxlOjAuNSwgdHJhbnNmb3JtT3JpZ2luOlwiNTAlIDUwJVwifSwge3NjYWxlOjEsIGRlbGF5OjJ9KTsgd291bGQgY2F1c2UgYSBqdW1wIHdoZW4gdGhlIGZyb20gdmFsdWVzIHJldmVydCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSAybmQgdHdlZW4uXG5cdFx0XHRcdHB0ID0gX2FkZE5vblR3ZWVuaW5nTnVtZXJpY1BUKG0xLCBcInlPcmlnaW5cIiwgKG9yaWdpbmFsR1NUcmFuc2Zvcm0gPyBtMSA6IG0yKS55T3JpZ2luLCBtMi55T3JpZ2luLCBwdCwgdHJhbnNmb3JtT3JpZ2luU3RyaW5nKTtcblx0XHRcdFx0aWYgKHggIT09IG0xLnhPZmZzZXQgfHwgeSAhPT0gbTEueU9mZnNldCkge1xuXHRcdFx0XHRcdHB0ID0gX2FkZE5vblR3ZWVuaW5nTnVtZXJpY1BUKG0xLCBcInhPZmZzZXRcIiwgKG9yaWdpbmFsR1NUcmFuc2Zvcm0gPyB4IDogbTEueE9mZnNldCksIG0xLnhPZmZzZXQsIHB0LCB0cmFuc2Zvcm1PcmlnaW5TdHJpbmcpO1xuXHRcdFx0XHRcdHB0ID0gX2FkZE5vblR3ZWVuaW5nTnVtZXJpY1BUKG0xLCBcInlPZmZzZXRcIiwgKG9yaWdpbmFsR1NUcmFuc2Zvcm0gPyB5IDogbTEueU9mZnNldCksIG0xLnlPZmZzZXQsIHB0LCB0cmFuc2Zvcm1PcmlnaW5TdHJpbmcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG9yaWcgPSBfdXNlU1ZHVHJhbnNmb3JtQXR0ciA/IG51bGwgOiBcIjBweCAwcHhcIjsgLy9jZXJ0YWluIGJyb3dzZXJzIChsaWtlIGZpcmVmb3gpIGNvbXBsZXRlbHkgYm90Y2ggdHJhbnNmb3JtLW9yaWdpbiwgc28gd2UgbXVzdCByZW1vdmUgaXQgdG8gcHJldmVudCBpdCBmcm9tIGNvbnRhbWluYXRpbmcgdHJhbnNmb3Jtcy4gV2UgbWFuYWdlIGl0IG91cnNlbHZlcyB3aXRoIHhPcmlnaW4gYW5kIHlPcmlnaW5cblx0XHRcdH1cblx0XHRcdGlmIChvcmlnIHx8IChfc3VwcG9ydHMzRCAmJiBoYXMzRCAmJiBtMS56T3JpZ2luKSkgeyAvL2lmIGFueXRoaW5nIDNEIGlzIGhhcHBlbmluZyBhbmQgdGhlcmUncyBhIHRyYW5zZm9ybU9yaWdpbiB3aXRoIGEgeiBjb21wb25lbnQgdGhhdCdzIG5vbi16ZXJvLCB3ZSBtdXN0IGVuc3VyZSB0aGF0IHRoZSB0cmFuc2Zvcm1PcmlnaW4ncyB6LWNvbXBvbmVudCBpcyBzZXQgdG8gMCBzbyB0aGF0IHdlIGNhbiBtYW51YWxseSBkbyB0aG9zZSBjYWxjdWxhdGlvbnMgdG8gZ2V0IGFyb3VuZCBTYWZhcmkgYnVncy4gRXZlbiBpZiB0aGUgdXNlciBkaWRuJ3Qgc3BlY2lmaWNhbGx5IGRlZmluZSBhIFwidHJhbnNmb3JtT3JpZ2luXCIgaW4gdGhpcyBwYXJ0aWN1bGFyIHR3ZWVuIChtYXliZSB0aGV5IGRpZCBpdCB2aWEgY3NzIGRpcmVjdGx5KS5cblx0XHRcdFx0aWYgKF90cmFuc2Zvcm1Qcm9wKSB7XG5cdFx0XHRcdFx0aGFzQ2hhbmdlID0gdHJ1ZTtcblx0XHRcdFx0XHRwID0gX3RyYW5zZm9ybU9yaWdpblByb3A7XG5cdFx0XHRcdFx0b3JpZyA9IChvcmlnIHx8IF9nZXRTdHlsZSh0LCBwLCBfY3MsIGZhbHNlLCBcIjUwJSA1MCVcIikpICsgXCJcIjsgLy9jYXN0IGFzIHN0cmluZyB0byBhdm9pZCBlcnJvcnNcblx0XHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIHAsIDAsIDAsIHB0LCAtMSwgdHJhbnNmb3JtT3JpZ2luU3RyaW5nKTtcblx0XHRcdFx0XHRwdC5iID0gc3R5bGVbcF07XG5cdFx0XHRcdFx0cHQucGx1Z2luID0gcGx1Z2luO1xuXHRcdFx0XHRcdGlmIChfc3VwcG9ydHMzRCkge1xuXHRcdFx0XHRcdFx0Y29weSA9IG0xLnpPcmlnaW47XG5cdFx0XHRcdFx0XHRvcmlnID0gb3JpZy5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0XHRtMS56T3JpZ2luID0gKChvcmlnLmxlbmd0aCA+IDIgJiYgIShjb3B5ICE9PSAwICYmIG9yaWdbMl0gPT09IFwiMHB4XCIpKSA/IHBhcnNlRmxvYXQob3JpZ1syXSkgOiBjb3B5KSB8fCAwOyAvL1NhZmFyaSBkb2Vzbid0IGhhbmRsZSB0aGUgeiBwYXJ0IG9mIHRyYW5zZm9ybU9yaWdpbiBjb3JyZWN0bHksIHNvIHdlJ2xsIG1hbnVhbGx5IGhhbmRsZSBpdCBpbiB0aGUgX3NldDNEVHJhbnNmb3JtUmF0aW8oKSBtZXRob2QuXG5cdFx0XHRcdFx0XHRwdC54czAgPSBwdC5lID0gb3JpZ1swXSArIFwiIFwiICsgKG9yaWdbMV0gfHwgXCI1MCVcIikgKyBcIiAwcHhcIjsgLy93ZSBtdXN0IGRlZmluZSBhIHogdmFsdWUgb2YgMHB4IHNwZWNpZmljYWxseSBvdGhlcndpc2UgaU9TIDUgU2FmYXJpIHdpbGwgc3RpY2sgd2l0aCB0aGUgb2xkIG9uZSAoaWYgb25lIHdhcyBkZWZpbmVkKSFcblx0XHRcdFx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2VlbihtMSwgXCJ6T3JpZ2luXCIsIDAsIDAsIHB0LCAtMSwgcHQubik7IC8vd2UgbXVzdCBjcmVhdGUgYSBDU1NQcm9wVHdlZW4gZm9yIHRoZSBfZ3NUcmFuc2Zvcm0uek9yaWdpbiBzbyB0aGF0IGl0IGdldHMgcmVzZXQgcHJvcGVybHkgYXQgdGhlIGJlZ2lubmluZyBpZiB0aGUgdHdlZW4gcnVucyBiYWNrd2FyZCAoYXMgb3Bwb3NlZCB0byBqdXN0IHNldHRpbmcgbTEuek9yaWdpbiBoZXJlKVxuXHRcdFx0XHRcdFx0cHQuYiA9IGNvcHk7XG5cdFx0XHRcdFx0XHRwdC54czAgPSBwdC5lID0gbTEuek9yaWdpbjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cHQueHMwID0gcHQuZSA9IG9yaWc7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly9mb3Igb2xkZXIgdmVyc2lvbnMgb2YgSUUgKDYtOCksIHdlIG5lZWQgdG8gbWFudWFsbHkgY2FsY3VsYXRlIHRoaW5ncyBpbnNpZGUgdGhlIHNldFJhdGlvKCkgZnVuY3Rpb24uIFdlIHJlY29yZCBvcmlnaW4geCBhbmQgeSAob3ggYW5kIG95KSBhbmQgd2hldGhlciBvciBub3QgdGhlIHZhbHVlcyBhcmUgcGVyY2VudGFnZXMgKG94cCBhbmQgb3lwKS5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfcGFyc2VQb3NpdGlvbihvcmlnICsgXCJcIiwgbTEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoaGFzQ2hhbmdlKSB7XG5cdFx0XHRcdGNzc3AuX3RyYW5zZm9ybVR5cGUgPSAoIShtMS5zdmcgJiYgX3VzZVNWR1RyYW5zZm9ybUF0dHIpICYmIChoYXMzRCB8fCB0aGlzLl90cmFuc2Zvcm1UeXBlID09PSAzKSkgPyAzIDogMjsgLy9xdWlja2VyIHRoYW4gY2FsbGluZyBjc3NwLl9lbmFibGVUcmFuc2Zvcm1zKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fSwgcHJlZml4OnRydWV9KTtcblxuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJveFNoYWRvd1wiLCB7ZGVmYXVsdFZhbHVlOlwiMHB4IDBweCAwcHggMHB4ICM5OTlcIiwgcHJlZml4OnRydWUsIGNvbG9yOnRydWUsIG11bHRpOnRydWUsIGtleXdvcmQ6XCJpbnNldFwifSk7XG5cblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJib3JkZXJSYWRpdXNcIiwge2RlZmF1bHRWYWx1ZTpcIjBweFwiLCBwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbikge1xuXHRcdFx0ZSA9IHRoaXMuZm9ybWF0KGUpO1xuXHRcdFx0dmFyIHByb3BzID0gW1wiYm9yZGVyVG9wTGVmdFJhZGl1c1wiLFwiYm9yZGVyVG9wUmlnaHRSYWRpdXNcIixcImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzXCIsXCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzXCJdLFxuXHRcdFx0XHRzdHlsZSA9IHQuc3R5bGUsXG5cdFx0XHRcdGVhMSwgaSwgZXMyLCBiczIsIGJzLCBlcywgYm4sIGVuLCB3LCBoLCBlc2Z4LCBic2Z4LCByZWwsIGhuLCB2biwgZW07XG5cdFx0XHR3ID0gcGFyc2VGbG9hdCh0Lm9mZnNldFdpZHRoKTtcblx0XHRcdGggPSBwYXJzZUZsb2F0KHQub2Zmc2V0SGVpZ2h0KTtcblx0XHRcdGVhMSA9IGUuc3BsaXQoXCIgXCIpO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IC8vaWYgd2UncmUgZGVhbGluZyB3aXRoIHBlcmNlbnRhZ2VzLCB3ZSBtdXN0IGNvbnZlcnQgdGhpbmdzIHNlcGFyYXRlbHkgZm9yIHRoZSBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBheGlzIVxuXHRcdFx0XHRpZiAodGhpcy5wLmluZGV4T2YoXCJib3JkZXJcIikpIHsgLy9vbGRlciBicm93c2VycyB1c2VkIGEgcHJlZml4XG5cdFx0XHRcdFx0cHJvcHNbaV0gPSBfY2hlY2tQcm9wUHJlZml4KHByb3BzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicyA9IGJzMiA9IF9nZXRTdHlsZSh0LCBwcm9wc1tpXSwgX2NzLCBmYWxzZSwgXCIwcHhcIik7XG5cdFx0XHRcdGlmIChicy5pbmRleE9mKFwiIFwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRiczIgPSBicy5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0YnMgPSBiczJbMF07XG5cdFx0XHRcdFx0YnMyID0gYnMyWzFdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVzID0gZXMyID0gZWExW2ldO1xuXHRcdFx0XHRibiA9IHBhcnNlRmxvYXQoYnMpO1xuXHRcdFx0XHRic2Z4ID0gYnMuc3Vic3RyKChibiArIFwiXCIpLmxlbmd0aCk7XG5cdFx0XHRcdHJlbCA9IChlcy5jaGFyQXQoMSkgPT09IFwiPVwiKTtcblx0XHRcdFx0aWYgKHJlbCkge1xuXHRcdFx0XHRcdGVuID0gcGFyc2VJbnQoZXMuY2hhckF0KDApK1wiMVwiLCAxMCk7XG5cdFx0XHRcdFx0ZXMgPSBlcy5zdWJzdHIoMik7XG5cdFx0XHRcdFx0ZW4gKj0gcGFyc2VGbG9hdChlcyk7XG5cdFx0XHRcdFx0ZXNmeCA9IGVzLnN1YnN0cigoZW4gKyBcIlwiKS5sZW5ndGggLSAoZW4gPCAwID8gMSA6IDApKSB8fCBcIlwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVuID0gcGFyc2VGbG9hdChlcyk7XG5cdFx0XHRcdFx0ZXNmeCA9IGVzLnN1YnN0cigoZW4gKyBcIlwiKS5sZW5ndGgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlc2Z4ID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0ZXNmeCA9IF9zdWZmaXhNYXBbcF0gfHwgYnNmeDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZXNmeCAhPT0gYnNmeCkge1xuXHRcdFx0XHRcdGhuID0gX2NvbnZlcnRUb1BpeGVscyh0LCBcImJvcmRlckxlZnRcIiwgYm4sIGJzZngpOyAvL2hvcml6b250YWwgbnVtYmVyICh3ZSB1c2UgYSBib2d1cyBcImJvcmRlckxlZnRcIiBwcm9wZXJ0eSBqdXN0IGJlY2F1c2UgdGhlIF9jb252ZXJ0VG9QaXhlbHMoKSBtZXRob2Qgc2VhcmNoZXMgZm9yIHRoZSBrZXl3b3JkcyBcIkxlZnRcIiwgXCJSaWdodFwiLCBcIlRvcFwiLCBhbmQgXCJCb3R0b21cIiB0byBkZXRlcm1pbmUgb2YgaXQncyBhIGhvcml6b250YWwgb3IgdmVydGljYWwgcHJvcGVydHksIGFuZCB3ZSBuZWVkIFwiYm9yZGVyXCIgaW4gdGhlIG5hbWUgc28gdGhhdCBpdCBrbm93cyBpdCBzaG91bGQgbWVhc3VyZSByZWxhdGl2ZSB0byB0aGUgZWxlbWVudCBpdHNlbGYsIG5vdCBpdHMgcGFyZW50LlxuXHRcdFx0XHRcdHZuID0gX2NvbnZlcnRUb1BpeGVscyh0LCBcImJvcmRlclRvcFwiLCBibiwgYnNmeCk7IC8vdmVydGljYWwgbnVtYmVyXG5cdFx0XHRcdFx0aWYgKGVzZnggPT09IFwiJVwiKSB7XG5cdFx0XHRcdFx0XHRicyA9IChobiAvIHcgKiAxMDApICsgXCIlXCI7XG5cdFx0XHRcdFx0XHRiczIgPSAodm4gLyBoICogMTAwKSArIFwiJVwiO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoZXNmeCA9PT0gXCJlbVwiKSB7XG5cdFx0XHRcdFx0XHRlbSA9IF9jb252ZXJ0VG9QaXhlbHModCwgXCJib3JkZXJMZWZ0XCIsIDEsIFwiZW1cIik7XG5cdFx0XHRcdFx0XHRicyA9IChobiAvIGVtKSArIFwiZW1cIjtcblx0XHRcdFx0XHRcdGJzMiA9ICh2biAvIGVtKSArIFwiZW1cIjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0YnMgPSBobiArIFwicHhcIjtcblx0XHRcdFx0XHRcdGJzMiA9IHZuICsgXCJweFwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocmVsKSB7XG5cdFx0XHRcdFx0XHRlcyA9IChwYXJzZUZsb2F0KGJzKSArIGVuKSArIGVzZng7XG5cdFx0XHRcdFx0XHRlczIgPSAocGFyc2VGbG9hdChiczIpICsgZW4pICsgZXNmeDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBfcGFyc2VDb21wbGV4KHN0eWxlLCBwcm9wc1tpXSwgYnMgKyBcIiBcIiArIGJzMiwgZXMgKyBcIiBcIiArIGVzMiwgZmFsc2UsIFwiMHB4XCIsIHB0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwdDtcblx0XHR9LCBwcmVmaXg6dHJ1ZSwgZm9ybWF0dGVyOl9nZXRGb3JtYXR0ZXIoXCIwcHggMHB4IDBweCAwcHhcIiwgZmFsc2UsIHRydWUpfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiYmFja2dyb3VuZFBvc2l0aW9uXCIsIHtkZWZhdWx0VmFsdWU6XCIwIDBcIiwgcGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4pIHtcblx0XHRcdHZhciBicCA9IFwiYmFja2dyb3VuZC1wb3NpdGlvblwiLFxuXHRcdFx0XHRjcyA9IChfY3MgfHwgX2dldENvbXB1dGVkU3R5bGUodCwgbnVsbCkpLFxuXHRcdFx0XHRicyA9IHRoaXMuZm9ybWF0KCAoKGNzKSA/IF9pZVZlcnMgPyBjcy5nZXRQcm9wZXJ0eVZhbHVlKGJwICsgXCIteFwiKSArIFwiIFwiICsgY3MuZ2V0UHJvcGVydHlWYWx1ZShicCArIFwiLXlcIikgOiBjcy5nZXRQcm9wZXJ0eVZhbHVlKGJwKSA6IHQuY3VycmVudFN0eWxlLmJhY2tncm91bmRQb3NpdGlvblggKyBcIiBcIiArIHQuY3VycmVudFN0eWxlLmJhY2tncm91bmRQb3NpdGlvblkpIHx8IFwiMCAwXCIpLCAvL0ludGVybmV0IEV4cGxvcmVyIGRvZXNuJ3QgcmVwb3J0IGJhY2tncm91bmQtcG9zaXRpb24gY29ycmVjdGx5IC0gd2UgbXVzdCBxdWVyeSBiYWNrZ3JvdW5kLXBvc2l0aW9uLXggYW5kIGJhY2tncm91bmQtcG9zaXRpb24teSBhbmQgY29tYmluZSB0aGVtIChldmVuIGluIElFMTApLiBCZWZvcmUgSUU5LCB3ZSBtdXN0IGRvIHRoZSBzYW1lIHdpdGggdGhlIGN1cnJlbnRTdHlsZSBvYmplY3QgYW5kIHVzZSBjYW1lbENhc2Vcblx0XHRcdFx0ZXMgPSB0aGlzLmZvcm1hdChlKSxcblx0XHRcdFx0YmEsIGVhLCBpLCBwY3QsIG92ZXJsYXAsIHNyYztcblx0XHRcdGlmICgoYnMuaW5kZXhPZihcIiVcIikgIT09IC0xKSAhPT0gKGVzLmluZGV4T2YoXCIlXCIpICE9PSAtMSkpIHtcblx0XHRcdFx0c3JjID0gX2dldFN0eWxlKHQsIFwiYmFja2dyb3VuZEltYWdlXCIpLnJlcGxhY2UoX3VybEV4cCwgXCJcIik7XG5cdFx0XHRcdGlmIChzcmMgJiYgc3JjICE9PSBcIm5vbmVcIikge1xuXHRcdFx0XHRcdGJhID0gYnMuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRcdGVhID0gZXMuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRcdF90ZW1wSW1nLnNldEF0dHJpYnV0ZShcInNyY1wiLCBzcmMpOyAvL3NldCB0aGUgdGVtcCBJTUcncyBzcmMgdG8gdGhlIGJhY2tncm91bmQtaW1hZ2Ugc28gdGhhdCB3ZSBjYW4gbWVhc3VyZSBpdHMgd2lkdGgvaGVpZ2h0XG5cdFx0XHRcdFx0aSA9IDI7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRicyA9IGJhW2ldO1xuXHRcdFx0XHRcdFx0cGN0ID0gKGJzLmluZGV4T2YoXCIlXCIpICE9PSAtMSk7XG5cdFx0XHRcdFx0XHRpZiAocGN0ICE9PSAoZWFbaV0uaW5kZXhPZihcIiVcIikgIT09IC0xKSkge1xuXHRcdFx0XHRcdFx0XHRvdmVybGFwID0gKGkgPT09IDApID8gdC5vZmZzZXRXaWR0aCAtIF90ZW1wSW1nLndpZHRoIDogdC5vZmZzZXRIZWlnaHQgLSBfdGVtcEltZy5oZWlnaHQ7XG5cdFx0XHRcdFx0XHRcdGJhW2ldID0gcGN0ID8gKHBhcnNlRmxvYXQoYnMpIC8gMTAwICogb3ZlcmxhcCkgKyBcInB4XCIgOiAocGFyc2VGbG9hdChicykgLyBvdmVybGFwICogMTAwKSArIFwiJVwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicyA9IGJhLmpvaW4oXCIgXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUNvbXBsZXgodC5zdHlsZSwgYnMsIGVzLCBwdCwgcGx1Z2luKTtcblx0XHR9LCBmb3JtYXR0ZXI6X3BhcnNlUG9zaXRpb259KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJiYWNrZ3JvdW5kU2l6ZVwiLCB7ZGVmYXVsdFZhbHVlOlwiMCAwXCIsIGZvcm1hdHRlcjpfcGFyc2VQb3NpdGlvbn0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInBlcnNwZWN0aXZlXCIsIHtkZWZhdWx0VmFsdWU6XCIwcHhcIiwgcHJlZml4OnRydWV9KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJwZXJzcGVjdGl2ZU9yaWdpblwiLCB7ZGVmYXVsdFZhbHVlOlwiNTAlIDUwJVwiLCBwcmVmaXg6dHJ1ZX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInRyYW5zZm9ybVN0eWxlXCIsIHtwcmVmaXg6dHJ1ZX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJhY2tmYWNlVmlzaWJpbGl0eVwiLCB7cHJlZml4OnRydWV9KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJ1c2VyU2VsZWN0XCIsIHtwcmVmaXg6dHJ1ZX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcIm1hcmdpblwiLCB7cGFyc2VyOl9nZXRFZGdlUGFyc2VyKFwibWFyZ2luVG9wLG1hcmdpblJpZ2h0LG1hcmdpbkJvdHRvbSxtYXJnaW5MZWZ0XCIpfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwicGFkZGluZ1wiLCB7cGFyc2VyOl9nZXRFZGdlUGFyc2VyKFwicGFkZGluZ1RvcCxwYWRkaW5nUmlnaHQscGFkZGluZ0JvdHRvbSxwYWRkaW5nTGVmdFwiKX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImNsaXBcIiwge2RlZmF1bHRWYWx1ZTpcInJlY3QoMHB4LDBweCwwcHgsMHB4KVwiLCBwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbil7XG5cdFx0XHR2YXIgYiwgY3MsIGRlbGltO1xuXHRcdFx0aWYgKF9pZVZlcnMgPCA5KSB7IC8vSUU4IGFuZCBlYXJsaWVyIGRvbid0IHJlcG9ydCBhIFwiY2xpcFwiIHZhbHVlIGluIHRoZSBjdXJyZW50U3R5bGUgLSBpbnN0ZWFkLCB0aGUgdmFsdWVzIGFyZSBzcGxpdCBhcGFydCBpbnRvIGNsaXBUb3AsIGNsaXBSaWdodCwgY2xpcEJvdHRvbSwgYW5kIGNsaXBMZWZ0LiBBbHNvLCBpbiBJRTcgYW5kIGVhcmxpZXIsIHRoZSB2YWx1ZXMgaW5zaWRlIHJlY3QoKSBhcmUgc3BhY2UtZGVsaW1pdGVkLCBub3QgY29tbWEtZGVsaW1pdGVkLlxuXHRcdFx0XHRjcyA9IHQuY3VycmVudFN0eWxlO1xuXHRcdFx0XHRkZWxpbSA9IF9pZVZlcnMgPCA4ID8gXCIgXCIgOiBcIixcIjtcblx0XHRcdFx0YiA9IFwicmVjdChcIiArIGNzLmNsaXBUb3AgKyBkZWxpbSArIGNzLmNsaXBSaWdodCArIGRlbGltICsgY3MuY2xpcEJvdHRvbSArIGRlbGltICsgY3MuY2xpcExlZnQgKyBcIilcIjtcblx0XHRcdFx0ZSA9IHRoaXMuZm9ybWF0KGUpLnNwbGl0KFwiLFwiKS5qb2luKGRlbGltKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGIgPSB0aGlzLmZvcm1hdChfZ2V0U3R5bGUodCwgdGhpcy5wLCBfY3MsIGZhbHNlLCB0aGlzLmRmbHQpKTtcblx0XHRcdFx0ZSA9IHRoaXMuZm9ybWF0KGUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VDb21wbGV4KHQuc3R5bGUsIGIsIGUsIHB0LCBwbHVnaW4pO1xuXHRcdH19KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJ0ZXh0U2hhZG93XCIsIHtkZWZhdWx0VmFsdWU6XCIwcHggMHB4IDBweCAjOTk5XCIsIGNvbG9yOnRydWUsIG11bHRpOnRydWV9KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJhdXRvUm91bmQsc3RyaWN0VW5pdHNcIiwge3BhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCkge3JldHVybiBwdDt9fSk7IC8vanVzdCBzbyB0aGF0IHdlIGNhbiBpZ25vcmUgdGhlc2UgcHJvcGVydGllcyAobm90IHR3ZWVuIHRoZW0pXG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiYm9yZGVyXCIsIHtkZWZhdWx0VmFsdWU6XCIwcHggc29saWQgIzAwMFwiLCBwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbikge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUNvbXBsZXgodC5zdHlsZSwgdGhpcy5mb3JtYXQoX2dldFN0eWxlKHQsIFwiYm9yZGVyVG9wV2lkdGhcIiwgX2NzLCBmYWxzZSwgXCIwcHhcIikgKyBcIiBcIiArIF9nZXRTdHlsZSh0LCBcImJvcmRlclRvcFN0eWxlXCIsIF9jcywgZmFsc2UsIFwic29saWRcIikgKyBcIiBcIiArIF9nZXRTdHlsZSh0LCBcImJvcmRlclRvcENvbG9yXCIsIF9jcywgZmFsc2UsIFwiIzAwMFwiKSksIHRoaXMuZm9ybWF0KGUpLCBwdCwgcGx1Z2luKTtcblx0XHRcdH0sIGNvbG9yOnRydWUsIGZvcm1hdHRlcjpmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHZhciBhID0gdi5zcGxpdChcIiBcIik7XG5cdFx0XHRcdHJldHVybiBhWzBdICsgXCIgXCIgKyAoYVsxXSB8fCBcInNvbGlkXCIpICsgXCIgXCIgKyAodi5tYXRjaChfY29sb3JFeHApIHx8IFtcIiMwMDBcIl0pWzBdO1xuXHRcdFx0fX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJvcmRlcldpZHRoXCIsIHtwYXJzZXI6X2dldEVkZ2VQYXJzZXIoXCJib3JkZXJUb3BXaWR0aCxib3JkZXJSaWdodFdpZHRoLGJvcmRlckJvdHRvbVdpZHRoLGJvcmRlckxlZnRXaWR0aFwiKX0pOyAvL0ZpcmVmb3ggZG9lc24ndCBwaWNrIHVwIG9uIGJvcmRlcldpZHRoIHNldCBpbiBzdHlsZSBzaGVldHMgKG9ubHkgaW5saW5lKS5cblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJmbG9hdCxjc3NGbG9hdCxzdHlsZUZsb2F0XCIsIHtwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbikge1xuXHRcdFx0dmFyIHMgPSB0LnN0eWxlLFxuXHRcdFx0XHRwcm9wID0gKFwiY3NzRmxvYXRcIiBpbiBzKSA/IFwiY3NzRmxvYXRcIiA6IFwic3R5bGVGbG9hdFwiO1xuXHRcdFx0cmV0dXJuIG5ldyBDU1NQcm9wVHdlZW4ocywgcHJvcCwgMCwgMCwgcHQsIC0xLCBwLCBmYWxzZSwgMCwgc1twcm9wXSwgZSk7XG5cdFx0fX0pO1xuXG5cdFx0Ly9vcGFjaXR5LXJlbGF0ZWRcblx0XHR2YXIgX3NldElFT3BhY2l0eVJhdGlvID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHR2YXIgdCA9IHRoaXMudCwgLy9yZWZlcnMgdG8gdGhlIGVsZW1lbnQncyBzdHlsZSBwcm9wZXJ0eVxuXHRcdFx0XHRcdGZpbHRlcnMgPSB0LmZpbHRlciB8fCBfZ2V0U3R5bGUodGhpcy5kYXRhLCBcImZpbHRlclwiKSB8fCBcIlwiLFxuXHRcdFx0XHRcdHZhbCA9ICh0aGlzLnMgKyB0aGlzLmMgKiB2KSB8IDAsXG5cdFx0XHRcdFx0c2tpcDtcblx0XHRcdFx0aWYgKHZhbCA9PT0gMTAwKSB7IC8vZm9yIG9sZGVyIHZlcnNpb25zIG9mIElFIHRoYXQgbmVlZCB0byB1c2UgYSBmaWx0ZXIgdG8gYXBwbHkgb3BhY2l0eSwgd2Ugc2hvdWxkIHJlbW92ZSB0aGUgZmlsdGVyIGlmIG9wYWNpdHkgaGl0cyAxIGluIG9yZGVyIHRvIGltcHJvdmUgcGVyZm9ybWFuY2UsIGJ1dCBtYWtlIHN1cmUgdGhlcmUgaXNuJ3QgYSB0cmFuc2Zvcm0gKG1hdHJpeCkgb3IgZ3JhZGllbnQgaW4gdGhlIGZpbHRlcnMuXG5cdFx0XHRcdFx0aWYgKGZpbHRlcnMuaW5kZXhPZihcImF0cml4KFwiKSA9PT0gLTEgJiYgZmlsdGVycy5pbmRleE9mKFwicmFkaWVudChcIikgPT09IC0xICYmIGZpbHRlcnMuaW5kZXhPZihcIm9hZGVyKFwiKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdHQucmVtb3ZlQXR0cmlidXRlKFwiZmlsdGVyXCIpO1xuXHRcdFx0XHRcdFx0c2tpcCA9ICghX2dldFN0eWxlKHRoaXMuZGF0YSwgXCJmaWx0ZXJcIikpOyAvL2lmIGEgY2xhc3MgaXMgYXBwbGllZCB0aGF0IGhhcyBhbiBhbHBoYSBmaWx0ZXIsIGl0IHdpbGwgdGFrZSBlZmZlY3QgKHdlIGRvbid0IHdhbnQgdGhhdCksIHNvIHJlLWFwcGx5IG91ciBhbHBoYSBmaWx0ZXIgaW4gdGhhdCBjYXNlLiBXZSBtdXN0IGZpcnN0IHJlbW92ZSBpdCBhbmQgdGhlbiBjaGVjay5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dC5maWx0ZXIgPSBmaWx0ZXJzLnJlcGxhY2UoX2FscGhhRmlsdGVyRXhwLCBcIlwiKTtcblx0XHRcdFx0XHRcdHNraXAgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXNraXApIHtcblx0XHRcdFx0XHRpZiAodGhpcy54bjEpIHtcblx0XHRcdFx0XHRcdHQuZmlsdGVyID0gZmlsdGVycyA9IGZpbHRlcnMgfHwgKFwiYWxwaGEob3BhY2l0eT1cIiArIHZhbCArIFwiKVwiKTsgLy93b3JrcyBhcm91bmQgYnVnIGluIElFNy84IHRoYXQgcHJldmVudHMgY2hhbmdlcyB0byBcInZpc2liaWxpdHlcIiBmcm9tIGJlaW5nIGFwcGxpZWQgcHJvcGVybHkgaWYgdGhlIGZpbHRlciBpcyBjaGFuZ2VkIHRvIGEgZGlmZmVyZW50IGFscGhhIG9uIHRoZSBzYW1lIGZyYW1lLlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoZmlsdGVycy5pbmRleE9mKFwicGFjaXR5XCIpID09PSAtMSkgeyAvL29ubHkgdXNlZCBpZiBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCB0aGUgc3RhbmRhcmQgb3BhY2l0eSBzdHlsZSBwcm9wZXJ0eSAoSUUgNyBhbmQgOCkuIFdlIG9taXQgdGhlIFwiT1wiIHRvIGF2b2lkIGNhc2Utc2Vuc2l0aXZpdHkgaXNzdWVzXG5cdFx0XHRcdFx0XHRpZiAodmFsICE9PSAwIHx8ICF0aGlzLnhuMSkgeyAvL2J1Z3MgaW4gSUU3Lzggd29uJ3QgcmVuZGVyIHRoZSBmaWx0ZXIgcHJvcGVybHkgaWYgb3BhY2l0eSBpcyBBRERFRCBvbiB0aGUgc2FtZSBmcmFtZS9yZW5kZXIgYXMgXCJ2aXNpYmlsaXR5XCIgY2hhbmdlcyAodGhpcy54bjEgaXMgMSBpZiB0aGlzIHR3ZWVuIGlzIGFuIFwiYXV0b0FscGhhXCIgdHdlZW4pXG5cdFx0XHRcdFx0XHRcdHQuZmlsdGVyID0gZmlsdGVycyArIFwiIGFscGhhKG9wYWNpdHk9XCIgKyB2YWwgKyBcIilcIjsgLy93ZSByb3VuZCB0aGUgdmFsdWUgYmVjYXVzZSBvdGhlcndpc2UsIGJ1Z3MgaW4gSUU3LzggY2FuIHByZXZlbnQgXCJ2aXNpYmlsaXR5XCIgY2hhbmdlcyBmcm9tIGJlaW5nIGFwcGxpZWQgcHJvcGVybHkuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHQuZmlsdGVyID0gZmlsdGVycy5yZXBsYWNlKF9vcGFjaXR5RXhwLCBcIm9wYWNpdHk9XCIgKyB2YWwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJvcGFjaXR5LGFscGhhLGF1dG9BbHBoYVwiLCB7ZGVmYXVsdFZhbHVlOlwiMVwiLCBwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbikge1xuXHRcdFx0dmFyIGIgPSBwYXJzZUZsb2F0KF9nZXRTdHlsZSh0LCBcIm9wYWNpdHlcIiwgX2NzLCBmYWxzZSwgXCIxXCIpKSxcblx0XHRcdFx0c3R5bGUgPSB0LnN0eWxlLFxuXHRcdFx0XHRpc0F1dG9BbHBoYSA9IChwID09PSBcImF1dG9BbHBoYVwiKTtcblx0XHRcdGlmICh0eXBlb2YoZSkgPT09IFwic3RyaW5nXCIgJiYgZS5jaGFyQXQoMSkgPT09IFwiPVwiKSB7XG5cdFx0XHRcdGUgPSAoKGUuY2hhckF0KDApID09PSBcIi1cIikgPyAtMSA6IDEpICogcGFyc2VGbG9hdChlLnN1YnN0cigyKSkgKyBiO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzQXV0b0FscGhhICYmIGIgPT09IDEgJiYgX2dldFN0eWxlKHQsIFwidmlzaWJpbGl0eVwiLCBfY3MpID09PSBcImhpZGRlblwiICYmIGUgIT09IDApIHsgLy9pZiB2aXNpYmlsaXR5IGlzIGluaXRpYWxseSBzZXQgdG8gXCJoaWRkZW5cIiwgd2Ugc2hvdWxkIGludGVycHJldCB0aGF0IGFzIGludGVudCB0byBtYWtlIG9wYWNpdHkgMCAoYSBjb252ZW5pZW5jZSlcblx0XHRcdFx0YiA9IDA7XG5cdFx0XHR9XG5cdFx0XHRpZiAoX3N1cHBvcnRzT3BhY2l0eSkge1xuXHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIFwib3BhY2l0eVwiLCBiLCBlIC0gYiwgcHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHN0eWxlLCBcIm9wYWNpdHlcIiwgYiAqIDEwMCwgKGUgLSBiKSAqIDEwMCwgcHQpO1xuXHRcdFx0XHRwdC54bjEgPSBpc0F1dG9BbHBoYSA/IDEgOiAwOyAvL3dlIG5lZWQgdG8gcmVjb3JkIHdoZXRoZXIgb3Igbm90IHRoaXMgaXMgYW4gYXV0b0FscGhhIHNvIHRoYXQgaW4gdGhlIHNldFJhdGlvKCksIHdlIGtub3cgdG8gZHVwbGljYXRlIHRoZSBzZXR0aW5nIG9mIHRoZSBhbHBoYSBpbiBvcmRlciB0byB3b3JrIGFyb3VuZCBhIGJ1ZyBpbiBJRTcgYW5kIElFOCB0aGF0IHByZXZlbnRzIGNoYW5nZXMgdG8gXCJ2aXNpYmlsaXR5XCIgZnJvbSB0YWtpbmcgZWZmZWN0IGlmIHRoZSBmaWx0ZXIgaXMgY2hhbmdlZCB0byBhIGRpZmZlcmVudCBhbHBoYShvcGFjaXR5KSBhdCB0aGUgc2FtZSB0aW1lLiBTZXR0aW5nIGl0IHRvIHRoZSBTQU1FIHZhbHVlIGZpcnN0LCB0aGVuIHRoZSBuZXcgdmFsdWUgd29ya3MgYXJvdW5kIHRoZSBJRTcvOCBidWcuXG5cdFx0XHRcdHN0eWxlLnpvb20gPSAxOyAvL2hlbHBzIGNvcnJlY3QgYW4gSUUgaXNzdWUuXG5cdFx0XHRcdHB0LnR5cGUgPSAyO1xuXHRcdFx0XHRwdC5iID0gXCJhbHBoYShvcGFjaXR5PVwiICsgcHQucyArIFwiKVwiO1xuXHRcdFx0XHRwdC5lID0gXCJhbHBoYShvcGFjaXR5PVwiICsgKHB0LnMgKyBwdC5jKSArIFwiKVwiO1xuXHRcdFx0XHRwdC5kYXRhID0gdDtcblx0XHRcdFx0cHQucGx1Z2luID0gcGx1Z2luO1xuXHRcdFx0XHRwdC5zZXRSYXRpbyA9IF9zZXRJRU9wYWNpdHlSYXRpbztcblx0XHRcdH1cblx0XHRcdGlmIChpc0F1dG9BbHBoYSkgeyAvL3dlIGhhdmUgdG8gY3JlYXRlIHRoZSBcInZpc2liaWxpdHlcIiBQcm9wVHdlZW4gYWZ0ZXIgdGhlIG9wYWNpdHkgb25lIGluIHRoZSBsaW5rZWQgbGlzdCBzbyB0aGF0IHRoZXkgcnVuIGluIHRoZSBvcmRlciB0aGF0IHdvcmtzIHByb3Blcmx5IGluIElFOCBhbmQgZWFybGllclxuXHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIFwidmlzaWJpbGl0eVwiLCAwLCAwLCBwdCwgLTEsIG51bGwsIGZhbHNlLCAwLCAoKGIgIT09IDApID8gXCJpbmhlcml0XCIgOiBcImhpZGRlblwiKSwgKChlID09PSAwKSA/IFwiaGlkZGVuXCIgOiBcImluaGVyaXRcIikpO1xuXHRcdFx0XHRwdC54czAgPSBcImluaGVyaXRcIjtcblx0XHRcdFx0Y3NzcC5fb3ZlcndyaXRlUHJvcHMucHVzaChwdC5uKTtcblx0XHRcdFx0Y3NzcC5fb3ZlcndyaXRlUHJvcHMucHVzaChwKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwdDtcblx0XHR9fSk7XG5cblxuXHRcdHZhciBfcmVtb3ZlUHJvcCA9IGZ1bmN0aW9uKHMsIHApIHtcblx0XHRcdFx0aWYgKHApIHtcblx0XHRcdFx0XHRpZiAocy5yZW1vdmVQcm9wZXJ0eSkge1xuXHRcdFx0XHRcdFx0aWYgKHAuc3Vic3RyKDAsMikgPT09IFwibXNcIiB8fCBwLnN1YnN0cigwLDYpID09PSBcIndlYmtpdFwiKSB7IC8vTWljcm9zb2Z0IGFuZCBzb21lIFdlYmtpdCBicm93c2VycyBkb24ndCBjb25mb3JtIHRvIHRoZSBzdGFuZGFyZCBvZiBjYXBpdGFsaXppbmcgdGhlIGZpcnN0IHByZWZpeCBjaGFyYWN0ZXIsIHNvIHdlIGFkanVzdCBzbyB0aGF0IHdoZW4gd2UgcHJlZml4IHRoZSBjYXBzIHdpdGggYSBkYXNoLCBpdCdzIGNvcnJlY3QgKG90aGVyd2lzZSBpdCdkIGJlIFwibXMtdHJhbnNmb3JtXCIgaW5zdGVhZCBvZiBcIi1tcy10cmFuc2Zvcm1cIiBmb3IgSUU5LCBmb3IgZXhhbXBsZSlcblx0XHRcdFx0XHRcdFx0cCA9IFwiLVwiICsgcDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHMucmVtb3ZlUHJvcGVydHkocC5yZXBsYWNlKF9jYXBzRXhwLCBcIi0kMVwiKS50b0xvd2VyQ2FzZSgpKTtcblx0XHRcdFx0XHR9IGVsc2UgeyAvL25vdGU6IG9sZCB2ZXJzaW9ucyBvZiBJRSB1c2UgXCJyZW1vdmVBdHRyaWJ1dGUoKVwiIGluc3RlYWQgb2YgXCJyZW1vdmVQcm9wZXJ0eSgpXCJcblx0XHRcdFx0XHRcdHMucmVtb3ZlQXR0cmlidXRlKHApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdF9zZXRDbGFzc05hbWVSYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0dGhpcy50Ll9nc0NsYXNzUFQgPSB0aGlzO1xuXHRcdFx0XHRpZiAodiA9PT0gMSB8fCB2ID09PSAwKSB7XG5cdFx0XHRcdFx0dGhpcy50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsICh2ID09PSAwKSA/IHRoaXMuYiA6IHRoaXMuZSk7XG5cdFx0XHRcdFx0dmFyIG1wdCA9IHRoaXMuZGF0YSwgLy9maXJzdCBNaW5pUHJvcFR3ZWVuXG5cdFx0XHRcdFx0XHRzID0gdGhpcy50LnN0eWxlO1xuXHRcdFx0XHRcdHdoaWxlIChtcHQpIHtcblx0XHRcdFx0XHRcdGlmICghbXB0LnYpIHtcblx0XHRcdFx0XHRcdFx0X3JlbW92ZVByb3AocywgbXB0LnApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c1ttcHQucF0gPSBtcHQudjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1wdCA9IG1wdC5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHYgPT09IDEgJiYgdGhpcy50Ll9nc0NsYXNzUFQgPT09IHRoaXMpIHtcblx0XHRcdFx0XHRcdHRoaXMudC5fZ3NDbGFzc1BUID0gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy50LmdldEF0dHJpYnV0ZShcImNsYXNzXCIpICE9PSB0aGlzLmUpIHtcblx0XHRcdFx0XHR0aGlzLnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5lKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJjbGFzc05hbWVcIiwge3BhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luLCB2YXJzKSB7XG5cdFx0XHR2YXIgYiA9IHQuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIiwgLy9kb24ndCB1c2UgdC5jbGFzc05hbWUgYmVjYXVzZSBpdCBkb2Vzbid0IHdvcmsgY29uc2lzdGVudGx5IG9uIFNWRyBlbGVtZW50czsgZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgYW5kIHNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHZhbHVlXCIpIGlzIG1vcmUgcmVsaWFibGUuXG5cdFx0XHRcdGNzc1RleHQgPSB0LnN0eWxlLmNzc1RleHQsXG5cdFx0XHRcdGRpZkRhdGEsIGJzLCBjbnB0LCBjbnB0TG9va3VwLCBtcHQ7XG5cdFx0XHRwdCA9IGNzc3AuX2NsYXNzTmFtZVBUID0gbmV3IENTU1Byb3BUd2Vlbih0LCBwLCAwLCAwLCBwdCwgMik7XG5cdFx0XHRwdC5zZXRSYXRpbyA9IF9zZXRDbGFzc05hbWVSYXRpbztcblx0XHRcdHB0LnByID0gLTExO1xuXHRcdFx0X2hhc1ByaW9yaXR5ID0gdHJ1ZTtcblx0XHRcdHB0LmIgPSBiO1xuXHRcdFx0YnMgPSBfZ2V0QWxsU3R5bGVzKHQsIF9jcyk7XG5cdFx0XHQvL2lmIHRoZXJlJ3MgYSBjbGFzc05hbWUgdHdlZW4gYWxyZWFkeSBvcGVyYXRpbmcgb24gdGhlIHRhcmdldCwgZm9yY2UgaXQgdG8gaXRzIGVuZCBzbyB0aGF0IHRoZSBuZWNlc3NhcnkgaW5saW5lIHN0eWxlcyBhcmUgcmVtb3ZlZCBhbmQgdGhlIGNsYXNzIG5hbWUgaXMgYXBwbGllZCBiZWZvcmUgd2UgZGV0ZXJtaW5lIHRoZSBlbmQgc3RhdGUgKHdlIGRvbid0IHdhbnQgaW5saW5lIHN0eWxlcyBpbnRlcmZlcmluZyB0aGF0IHdlcmUgdGhlcmUganVzdCBmb3IgY2xhc3Mtc3BlY2lmaWMgdmFsdWVzKVxuXHRcdFx0Y25wdCA9IHQuX2dzQ2xhc3NQVDtcblx0XHRcdGlmIChjbnB0KSB7XG5cdFx0XHRcdGNucHRMb29rdXAgPSB7fTtcblx0XHRcdFx0bXB0ID0gY25wdC5kYXRhOyAvL2ZpcnN0IE1pbmlQcm9wVHdlZW4gd2hpY2ggc3RvcmVzIHRoZSBpbmxpbmUgc3R5bGVzIC0gd2UgbmVlZCB0byBmb3JjZSB0aGVzZSBzbyB0aGF0IHRoZSBpbmxpbmUgc3R5bGVzIGRvbid0IGNvbnRhbWluYXRlIHRoaW5ncy4gT3RoZXJ3aXNlLCB0aGVyZSdzIGEgc21hbGwgY2hhbmNlIHRoYXQgYSB0d2VlbiBjb3VsZCBzdGFydCBhbmQgdGhlIGlubGluZSB2YWx1ZXMgbWF0Y2ggdGhlIGRlc3RpbmF0aW9uIHZhbHVlcyBhbmQgdGhleSBuZXZlciBnZXQgY2xlYW5lZC5cblx0XHRcdFx0d2hpbGUgKG1wdCkge1xuXHRcdFx0XHRcdGNucHRMb29rdXBbbXB0LnBdID0gMTtcblx0XHRcdFx0XHRtcHQgPSBtcHQuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y25wdC5zZXRSYXRpbygxKTtcblx0XHRcdH1cblx0XHRcdHQuX2dzQ2xhc3NQVCA9IHB0O1xuXHRcdFx0cHQuZSA9IChlLmNoYXJBdCgxKSAhPT0gXCI9XCIpID8gZSA6IGIucmVwbGFjZShuZXcgUmVnRXhwKFwiXFxcXHMqXFxcXGJcIiArIGUuc3Vic3RyKDIpICsgXCJcXFxcYlwiKSwgXCJcIikgKyAoKGUuY2hhckF0KDApID09PSBcIitcIikgPyBcIiBcIiArIGUuc3Vic3RyKDIpIDogXCJcIik7XG5cdFx0XHR0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHB0LmUpO1xuXHRcdFx0ZGlmRGF0YSA9IF9jc3NEaWYodCwgYnMsIF9nZXRBbGxTdHlsZXModCksIHZhcnMsIGNucHRMb29rdXApO1xuXHRcdFx0dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBiKTtcblx0XHRcdHB0LmRhdGEgPSBkaWZEYXRhLmZpcnN0TVBUO1xuXHRcdFx0dC5zdHlsZS5jc3NUZXh0ID0gY3NzVGV4dDsgLy93ZSByZWNvcmRlZCBjc3NUZXh0IGJlZm9yZSB3ZSBzd2FwcGVkIGNsYXNzZXMgYW5kIHJhbiBfZ2V0QWxsU3R5bGVzKCkgYmVjYXVzZSBpbiBjYXNlcyB3aGVuIGEgY2xhc3NOYW1lIHR3ZWVuIGlzIG92ZXJ3cml0dGVuLCB3ZSByZW1vdmUgYWxsIHRoZSByZWxhdGVkIHR3ZWVuaW5nIHByb3BlcnRpZXMgZnJvbSB0aGF0IGNsYXNzIGNoYW5nZSAob3RoZXJ3aXNlIGNsYXNzLXNwZWNpZmljIHN0dWZmIGNhbid0IG92ZXJyaWRlIHByb3BlcnRpZXMgd2UndmUgZGlyZWN0bHkgc2V0IG9uIHRoZSB0YXJnZXQncyBzdHlsZSBvYmplY3QgZHVlIHRvIHNwZWNpZmljaXR5KS5cblx0XHRcdHB0ID0gcHQueGZpcnN0ID0gY3NzcC5wYXJzZSh0LCBkaWZEYXRhLmRpZnMsIHB0LCBwbHVnaW4pOyAvL3dlIHJlY29yZCB0aGUgQ1NTUHJvcFR3ZWVuIGFzIHRoZSB4Zmlyc3Qgc28gdGhhdCB3ZSBjYW4gaGFuZGxlIG92ZXJ3cml0aW5nIHByb3BlcnRseSAoaWYgXCJjbGFzc05hbWVcIiBnZXRzIG92ZXJ3cml0dGVuLCB3ZSBtdXN0IGtpbGwgYWxsIHRoZSBwcm9wZXJ0aWVzIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2xhc3NOYW1lIHBhcnQgb2YgdGhlIHR3ZWVuLCBzbyB3ZSBjYW4gbG9vcCB0aHJvdWdoIGZyb20geGZpcnN0IHRvIHRoZSBwdCBpdHNlbGYpXG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fX0pO1xuXG5cblx0XHR2YXIgX3NldENsZWFyUHJvcHNSYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdGlmICh2ID09PSAxIHx8IHYgPT09IDApIGlmICh0aGlzLmRhdGEuX3RvdGFsVGltZSA9PT0gdGhpcy5kYXRhLl90b3RhbER1cmF0aW9uICYmIHRoaXMuZGF0YS5kYXRhICE9PSBcImlzRnJvbVN0YXJ0XCIpIHsgLy90aGlzLmRhdGEgcmVmZXJzIHRvIHRoZSB0d2Vlbi4gT25seSBjbGVhciBhdCB0aGUgRU5EIG9mIHRoZSB0d2VlbiAocmVtZW1iZXIsIGZyb20oKSB0d2VlbnMgbWFrZSB0aGUgcmF0aW8gZ28gZnJvbSAxIHRvIDAsIHNvIHdlIGNhbid0IGp1c3QgY2hlY2sgdGhhdCBhbmQgaWYgdGhlIHR3ZWVuIGlzIHRoZSB6ZXJvLWR1cmF0aW9uIG9uZSB0aGF0J3MgY3JlYXRlZCBpbnRlcm5hbGx5IHRvIHJlbmRlciB0aGUgc3RhcnRpbmcgdmFsdWVzIGluIGEgZnJvbSgpIHR3ZWVuLCBpZ25vcmUgdGhhdCBiZWNhdXNlIG90aGVyd2lzZSwgZm9yIGV4YW1wbGUsIGZyb20oLi4ue2hlaWdodDoxMDAsIGNsZWFyUHJvcHM6XCJoZWlnaHRcIiwgZGVsYXk6MX0pIHdvdWxkIHdpcGUgdGhlIGhlaWdodCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0d2VlbiBhbmQgYWZ0ZXIgMSBzZWNvbmQsIGl0J2Qga2ljayBiYWNrIGluKS5cblx0XHRcdFx0dmFyIHMgPSB0aGlzLnQuc3R5bGUsXG5cdFx0XHRcdFx0dHJhbnNmb3JtUGFyc2UgPSBfc3BlY2lhbFByb3BzLnRyYW5zZm9ybS5wYXJzZSxcblx0XHRcdFx0XHRhLCBwLCBpLCBjbGVhclRyYW5zZm9ybSwgdHJhbnNmb3JtO1xuXHRcdFx0XHRpZiAodGhpcy5lID09PSBcImFsbFwiKSB7XG5cdFx0XHRcdFx0cy5jc3NUZXh0ID0gXCJcIjtcblx0XHRcdFx0XHRjbGVhclRyYW5zZm9ybSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YSA9IHRoaXMuZS5zcGxpdChcIiBcIikuam9pbihcIlwiKS5zcGxpdChcIixcIik7XG5cdFx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0cCA9IGFbaV07XG5cdFx0XHRcdFx0XHRpZiAoX3NwZWNpYWxQcm9wc1twXSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoX3NwZWNpYWxQcm9wc1twXS5wYXJzZSA9PT0gdHJhbnNmb3JtUGFyc2UpIHtcblx0XHRcdFx0XHRcdFx0XHRjbGVhclRyYW5zZm9ybSA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cCA9IChwID09PSBcInRyYW5zZm9ybU9yaWdpblwiKSA/IF90cmFuc2Zvcm1PcmlnaW5Qcm9wIDogX3NwZWNpYWxQcm9wc1twXS5wOyAvL2Vuc3VyZXMgdGhhdCBzcGVjaWFsIHByb3BlcnRpZXMgdXNlIHRoZSBwcm9wZXIgYnJvd3Nlci1zcGVjaWZpYyBwcm9wZXJ0eSBuYW1lLCBsaWtlIFwic2NhbGVYXCIgbWlnaHQgYmUgXCItd2Via2l0LXRyYW5zZm9ybVwiIG9yIFwiYm94U2hhZG93XCIgbWlnaHQgYmUgXCItbW96LWJveC1zaGFkb3dcIlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRfcmVtb3ZlUHJvcChzLCBwKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNsZWFyVHJhbnNmb3JtKSB7XG5cdFx0XHRcdFx0X3JlbW92ZVByb3AocywgX3RyYW5zZm9ybVByb3ApO1xuXHRcdFx0XHRcdHRyYW5zZm9ybSA9IHRoaXMudC5fZ3NUcmFuc2Zvcm07XG5cdFx0XHRcdFx0aWYgKHRyYW5zZm9ybSkge1xuXHRcdFx0XHRcdFx0aWYgKHRyYW5zZm9ybS5zdmcpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy50LnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtc3ZnLW9yaWdpblwiKTtcblx0XHRcdFx0XHRcdFx0dGhpcy50LnJlbW92ZUF0dHJpYnV0ZShcInRyYW5zZm9ybVwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzLnQuX2dzVHJhbnNmb3JtO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJjbGVhclByb3BzXCIsIHtwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQpIHtcblx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2Vlbih0LCBwLCAwLCAwLCBwdCwgMik7XG5cdFx0XHRwdC5zZXRSYXRpbyA9IF9zZXRDbGVhclByb3BzUmF0aW87XG5cdFx0XHRwdC5lID0gZTtcblx0XHRcdHB0LnByID0gLTEwO1xuXHRcdFx0cHQuZGF0YSA9IGNzc3AuX3R3ZWVuO1xuXHRcdFx0X2hhc1ByaW9yaXR5ID0gdHJ1ZTtcblx0XHRcdHJldHVybiBwdDtcblx0XHR9fSk7XG5cblx0XHRwID0gXCJiZXppZXIsdGhyb3dQcm9wcyxwaHlzaWNzUHJvcHMscGh5c2ljczJEXCIuc3BsaXQoXCIsXCIpO1xuXHRcdGkgPSBwLmxlbmd0aDtcblx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHRfcmVnaXN0ZXJQbHVnaW5Qcm9wKHBbaV0pO1xuXHRcdH1cblxuXG5cblxuXG5cblxuXG5cdFx0cCA9IENTU1BsdWdpbi5wcm90b3R5cGU7XG5cdFx0cC5fZmlyc3RQVCA9IHAuX2xhc3RQYXJzZWRUcmFuc2Zvcm0gPSBwLl90cmFuc2Zvcm0gPSBudWxsO1xuXG5cdFx0Ly9nZXRzIGNhbGxlZCB3aGVuIHRoZSB0d2VlbiByZW5kZXJzIGZvciB0aGUgZmlyc3QgdGltZS4gVGhpcyBraWNrcyBldmVyeXRoaW5nIG9mZiwgcmVjb3JkaW5nIHN0YXJ0L2VuZCB2YWx1ZXMsIGV0Yy5cblx0XHRwLl9vbkluaXRUd2VlbiA9IGZ1bmN0aW9uKHRhcmdldCwgdmFycywgdHdlZW4pIHtcblx0XHRcdGlmICghdGFyZ2V0Lm5vZGVUeXBlKSB7IC8vY3NzIGlzIG9ubHkgZm9yIGRvbSBlbGVtZW50c1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XG5cdFx0XHR0aGlzLl90d2VlbiA9IHR3ZWVuO1xuXHRcdFx0dGhpcy5fdmFycyA9IHZhcnM7XG5cdFx0XHRfYXV0b1JvdW5kID0gdmFycy5hdXRvUm91bmQ7XG5cdFx0XHRfaGFzUHJpb3JpdHkgPSBmYWxzZTtcblx0XHRcdF9zdWZmaXhNYXAgPSB2YXJzLnN1ZmZpeE1hcCB8fCBDU1NQbHVnaW4uc3VmZml4TWFwO1xuXHRcdFx0X2NzID0gX2dldENvbXB1dGVkU3R5bGUodGFyZ2V0LCBcIlwiKTtcblx0XHRcdF9vdmVyd3JpdGVQcm9wcyA9IHRoaXMuX292ZXJ3cml0ZVByb3BzO1xuXHRcdFx0dmFyIHN0eWxlID0gdGFyZ2V0LnN0eWxlLFxuXHRcdFx0XHR2LCBwdCwgcHQyLCBmaXJzdCwgbGFzdCwgbmV4dCwgekluZGV4LCB0cHQsIHRocmVlRDtcblx0XHRcdGlmIChfcmVxU2FmYXJpRml4KSBpZiAoc3R5bGUuekluZGV4ID09PSBcIlwiKSB7XG5cdFx0XHRcdHYgPSBfZ2V0U3R5bGUodGFyZ2V0LCBcInpJbmRleFwiLCBfY3MpO1xuXHRcdFx0XHRpZiAodiA9PT0gXCJhdXRvXCIgfHwgdiA9PT0gXCJcIikge1xuXHRcdFx0XHRcdC8vY29ycmVjdHMgYSBidWcgaW4gW25vbi1BbmRyb2lkXSBTYWZhcmkgdGhhdCBwcmV2ZW50cyBpdCBmcm9tIHJlcGFpbnRpbmcgZWxlbWVudHMgaW4gdGhlaXIgbmV3IHBvc2l0aW9ucyBpZiB0aGV5IGRvbid0IGhhdmUgYSB6SW5kZXggc2V0LiBXZSBhbHNvIGNhbid0IGp1c3QgYXBwbHkgdGhpcyBpbnNpZGUgX3BhcnNlVHJhbnNmb3JtKCkgYmVjYXVzZSBhbnl0aGluZyB0aGF0J3MgbW92ZWQgaW4gYW55IHdheSAobGlrZSB1c2luZyBcImxlZnRcIiBvciBcInRvcFwiIGluc3RlYWQgb2YgdHJhbnNmb3JtcyBsaWtlIFwieFwiIGFuZCBcInlcIikgY2FuIGJlIGFmZmVjdGVkLCBzbyBpdCBpcyBiZXN0IHRvIGVuc3VyZSB0aGF0IGFueXRoaW5nIHRoYXQncyB0d2VlbmluZyBoYXMgYSB6LWluZGV4LiBTZXR0aW5nIFwiV2Via2l0UGVyc3BlY3RpdmVcIiB0byBhIG5vbi16ZXJvIHZhbHVlIHdvcmtlZCB0b28gZXhjZXB0IHRoYXQgb24gaU9TIFNhZmFyaSB0aGluZ3Mgd291bGQgZmxpY2tlciByYW5kb21seS4gUGx1cyB6SW5kZXggaXMgbGVzcyBtZW1vcnktaW50ZW5zaXZlLlxuXHRcdFx0XHRcdHRoaXMuX2FkZExhenlTZXQoc3R5bGUsIFwiekluZGV4XCIsIDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlb2YodmFycykgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0Zmlyc3QgPSBzdHlsZS5jc3NUZXh0O1xuXHRcdFx0XHR2ID0gX2dldEFsbFN0eWxlcyh0YXJnZXQsIF9jcyk7XG5cdFx0XHRcdHN0eWxlLmNzc1RleHQgPSBmaXJzdCArIFwiO1wiICsgdmFycztcblx0XHRcdFx0diA9IF9jc3NEaWYodGFyZ2V0LCB2LCBfZ2V0QWxsU3R5bGVzKHRhcmdldCkpLmRpZnM7XG5cdFx0XHRcdGlmICghX3N1cHBvcnRzT3BhY2l0eSAmJiBfb3BhY2l0eVZhbEV4cC50ZXN0KHZhcnMpKSB7XG5cdFx0XHRcdFx0di5vcGFjaXR5ID0gcGFyc2VGbG9hdCggUmVnRXhwLiQxICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFycyA9IHY7XG5cdFx0XHRcdHN0eWxlLmNzc1RleHQgPSBmaXJzdDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHZhcnMuY2xhc3NOYW1lKSB7IC8vY2xhc3NOYW1lIHR3ZWVucyB3aWxsIGNvbWJpbmUgYW55IGRpZmZlcmVuY2VzIHRoZXkgZmluZCBpbiB0aGUgY3NzIHdpdGggdGhlIHZhcnMgdGhhdCBhcmUgcGFzc2VkIGluLCBzbyB7Y2xhc3NOYW1lOlwibXlDbGFzc1wiLCBzY2FsZTowLjUsIGxlZnQ6MjB9IHdvdWxkIHdvcmsuXG5cdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdCA9IF9zcGVjaWFsUHJvcHMuY2xhc3NOYW1lLnBhcnNlKHRhcmdldCwgdmFycy5jbGFzc05hbWUsIFwiY2xhc3NOYW1lXCIsIHRoaXMsIG51bGwsIG51bGwsIHZhcnMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0ID0gdGhpcy5wYXJzZSh0YXJnZXQsIHZhcnMsIG51bGwpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fdHJhbnNmb3JtVHlwZSkge1xuXHRcdFx0XHR0aHJlZUQgPSAodGhpcy5fdHJhbnNmb3JtVHlwZSA9PT0gMyk7XG5cdFx0XHRcdGlmICghX3RyYW5zZm9ybVByb3ApIHtcblx0XHRcdFx0XHRzdHlsZS56b29tID0gMTsgLy9oZWxwcyBjb3JyZWN0IGFuIElFIGlzc3VlLlxuXHRcdFx0XHR9IGVsc2UgaWYgKF9pc1NhZmFyaSkge1xuXHRcdFx0XHRcdF9yZXFTYWZhcmlGaXggPSB0cnVlO1xuXHRcdFx0XHRcdC8vaWYgekluZGV4IGlzbid0IHNldCwgaU9TIFNhZmFyaSBkb2Vzbid0IHJlcGFpbnQgdGhpbmdzIGNvcnJlY3RseSBzb21ldGltZXMgKHNlZW1pbmdseSBhdCByYW5kb20pLlxuXHRcdFx0XHRcdGlmIChzdHlsZS56SW5kZXggPT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdHpJbmRleCA9IF9nZXRTdHlsZSh0YXJnZXQsIFwiekluZGV4XCIsIF9jcyk7XG5cdFx0XHRcdFx0XHRpZiAoekluZGV4ID09PSBcImF1dG9cIiB8fCB6SW5kZXggPT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fYWRkTGF6eVNldChzdHlsZSwgXCJ6SW5kZXhcIiwgMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vU2V0dGluZyBXZWJraXRCYWNrZmFjZVZpc2liaWxpdHkgY29ycmVjdHMgMyBidWdzOlxuXHRcdFx0XHRcdC8vIDEpIFtub24tQW5kcm9pZF0gU2FmYXJpIHNraXBzIHJlbmRlcmluZyBjaGFuZ2VzIHRvIFwidG9wXCIgYW5kIFwibGVmdFwiIHRoYXQgYXJlIG1hZGUgb24gdGhlIHNhbWUgZnJhbWUvcmVuZGVyIGFzIGEgdHJhbnNmb3JtIHVwZGF0ZS5cblx0XHRcdFx0XHQvLyAyKSBpT1MgU2FmYXJpIHNvbWV0aW1lcyBuZWdsZWN0cyB0byByZXBhaW50IGVsZW1lbnRzIGluIHRoZWlyIG5ldyBwb3NpdGlvbnMuIFNldHRpbmcgXCJXZWJraXRQZXJzcGVjdGl2ZVwiIHRvIGEgbm9uLXplcm8gdmFsdWUgd29ya2VkIHRvbyBleGNlcHQgdGhhdCBvbiBpT1MgU2FmYXJpIHRoaW5ncyB3b3VsZCBmbGlja2VyIHJhbmRvbWx5LlxuXHRcdFx0XHRcdC8vIDMpIFNhZmFyaSBzb21ldGltZXMgZGlzcGxheWVkIG9kZCBhcnRpZmFjdHMgd2hlbiB0d2VlbmluZyB0aGUgdHJhbnNmb3JtIChvciBXZWJraXRUcmFuc2Zvcm0pIHByb3BlcnR5LCBsaWtlIGdob3N0cyBvZiB0aGUgZWRnZXMgb2YgdGhlIGVsZW1lbnQgcmVtYWluZWQuIERlZmluaXRlbHkgYSBicm93c2VyIGJ1Zy5cblx0XHRcdFx0XHQvL05vdGU6IHdlIGFsbG93IHRoZSB1c2VyIHRvIG92ZXJyaWRlIHRoZSBhdXRvLXNldHRpbmcgYnkgZGVmaW5pbmcgV2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5IGluIHRoZSB2YXJzIG9mIHRoZSB0d2Vlbi5cblx0XHRcdFx0XHRpZiAoX2lzU2FmYXJpTFQ2KSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9hZGRMYXp5U2V0KHN0eWxlLCBcIldlYmtpdEJhY2tmYWNlVmlzaWJpbGl0eVwiLCB0aGlzLl92YXJzLldlYmtpdEJhY2tmYWNlVmlzaWJpbGl0eSB8fCAodGhyZWVEID8gXCJ2aXNpYmxlXCIgOiBcImhpZGRlblwiKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHB0MiA9IHB0O1xuXHRcdFx0XHR3aGlsZSAocHQyICYmIHB0Mi5fbmV4dCkge1xuXHRcdFx0XHRcdHB0MiA9IHB0Mi5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHR0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHRhcmdldCwgXCJ0cmFuc2Zvcm1cIiwgMCwgMCwgbnVsbCwgMik7XG5cdFx0XHRcdHRoaXMuX2xpbmtDU1NQKHRwdCwgbnVsbCwgcHQyKTtcblx0XHRcdFx0dHB0LnNldFJhdGlvID0gX3RyYW5zZm9ybVByb3AgPyBfc2V0VHJhbnNmb3JtUmF0aW8gOiBfc2V0SUVUcmFuc2Zvcm1SYXRpbztcblx0XHRcdFx0dHB0LmRhdGEgPSB0aGlzLl90cmFuc2Zvcm0gfHwgX2dldFRyYW5zZm9ybSh0YXJnZXQsIF9jcywgdHJ1ZSk7XG5cdFx0XHRcdHRwdC50d2VlbiA9IHR3ZWVuO1xuXHRcdFx0XHR0cHQucHIgPSAtMTsgLy9lbnN1cmVzIHRoYXQgdGhlIHRyYW5zZm9ybXMgZ2V0IGFwcGxpZWQgYWZ0ZXIgdGhlIGNvbXBvbmVudHMgYXJlIHVwZGF0ZWQuXG5cdFx0XHRcdF9vdmVyd3JpdGVQcm9wcy5wb3AoKTsgLy93ZSBkb24ndCB3YW50IHRvIGZvcmNlIHRoZSBvdmVyd3JpdGUgb2YgYWxsIFwidHJhbnNmb3JtXCIgdHdlZW5zIG9mIHRoZSB0YXJnZXQgLSB3ZSBvbmx5IGNhcmUgYWJvdXQgaW5kaXZpZHVhbCB0cmFuc2Zvcm0gcHJvcGVydGllcyBsaWtlIHNjYWxlWCwgcm90YXRpb24sIGV0Yy4gVGhlIENTU1Byb3BUd2VlbiBjb25zdHJ1Y3RvciBhdXRvbWF0aWNhbGx5IGFkZHMgdGhlIHByb3BlcnR5IHRvIF9vdmVyd3JpdGVQcm9wcyB3aGljaCBpcyB3aHkgd2UgbmVlZCB0byBwb3AoKSBoZXJlLlxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoX2hhc1ByaW9yaXR5KSB7XG5cdFx0XHRcdC8vcmVvcmRlcnMgdGhlIGxpbmtlZCBsaXN0IGluIG9yZGVyIG9mIHByIChwcmlvcml0eSlcblx0XHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdFx0bmV4dCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdHB0MiA9IGZpcnN0O1xuXHRcdFx0XHRcdHdoaWxlIChwdDIgJiYgcHQyLnByID4gcHQucHIpIHtcblx0XHRcdFx0XHRcdHB0MiA9IHB0Mi5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKChwdC5fcHJldiA9IHB0MiA/IHB0Mi5fcHJldiA6IGxhc3QpKSB7XG5cdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IHB0O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRmaXJzdCA9IHB0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoKHB0Ll9uZXh0ID0gcHQyKSkge1xuXHRcdFx0XHRcdFx0cHQyLl9wcmV2ID0gcHQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxhc3QgPSBwdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSBuZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBmaXJzdDtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH07XG5cblxuXHRcdHAucGFyc2UgPSBmdW5jdGlvbih0YXJnZXQsIHZhcnMsIHB0LCBwbHVnaW4pIHtcblx0XHRcdHZhciBzdHlsZSA9IHRhcmdldC5zdHlsZSxcblx0XHRcdFx0cCwgc3AsIGJuLCBlbiwgYnMsIGVzLCBic2Z4LCBlc2Z4LCBpc1N0ciwgcmVsO1xuXHRcdFx0Zm9yIChwIGluIHZhcnMpIHtcblx0XHRcdFx0ZXMgPSB2YXJzW3BdOyAvL2VuZGluZyB2YWx1ZSBzdHJpbmdcblx0XHRcdFx0c3AgPSBfc3BlY2lhbFByb3BzW3BdOyAvL1NwZWNpYWxQcm9wIGxvb2t1cC5cblx0XHRcdFx0aWYgKHNwKSB7XG5cdFx0XHRcdFx0cHQgPSBzcC5wYXJzZSh0YXJnZXQsIGVzLCBwLCB0aGlzLCBwdCwgcGx1Z2luLCB2YXJzKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGJzID0gX2dldFN0eWxlKHRhcmdldCwgcCwgX2NzKSArIFwiXCI7XG5cdFx0XHRcdFx0aXNTdHIgPSAodHlwZW9mKGVzKSA9PT0gXCJzdHJpbmdcIik7XG5cdFx0XHRcdFx0aWYgKHAgPT09IFwiY29sb3JcIiB8fCBwID09PSBcImZpbGxcIiB8fCBwID09PSBcInN0cm9rZVwiIHx8IHAuaW5kZXhPZihcIkNvbG9yXCIpICE9PSAtMSB8fCAoaXNTdHIgJiYgX3JnYmhzbEV4cC50ZXN0KGVzKSkpIHsgLy9PcGVyYSB1c2VzIGJhY2tncm91bmQ6IHRvIGRlZmluZSBjb2xvciBzb21ldGltZXMgaW4gYWRkaXRpb24gdG8gYmFja2dyb3VuZENvbG9yOlxuXHRcdFx0XHRcdFx0aWYgKCFpc1N0cikge1xuXHRcdFx0XHRcdFx0XHRlcyA9IF9wYXJzZUNvbG9yKGVzKTtcblx0XHRcdFx0XHRcdFx0ZXMgPSAoKGVzLmxlbmd0aCA+IDMpID8gXCJyZ2JhKFwiIDogXCJyZ2IoXCIpICsgZXMuam9pbihcIixcIikgKyBcIilcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHB0ID0gX3BhcnNlQ29tcGxleChzdHlsZSwgcCwgYnMsIGVzLCB0cnVlLCBcInRyYW5zcGFyZW50XCIsIHB0LCAwLCBwbHVnaW4pO1xuXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChpc1N0ciAmJiAoZXMuaW5kZXhPZihcIiBcIikgIT09IC0xIHx8IGVzLmluZGV4T2YoXCIsXCIpICE9PSAtMSkpIHtcblx0XHRcdFx0XHRcdHB0ID0gX3BhcnNlQ29tcGxleChzdHlsZSwgcCwgYnMsIGVzLCB0cnVlLCBudWxsLCBwdCwgMCwgcGx1Z2luKTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRibiA9IHBhcnNlRmxvYXQoYnMpO1xuXHRcdFx0XHRcdFx0YnNmeCA9IChibiB8fCBibiA9PT0gMCkgPyBicy5zdWJzdHIoKGJuICsgXCJcIikubGVuZ3RoKSA6IFwiXCI7IC8vcmVtZW1iZXIsIGJzIGNvdWxkIGJlIG5vbi1udW1lcmljIGxpa2UgXCJub3JtYWxcIiBmb3IgZm9udFdlaWdodCwgc28gd2Ugc2hvdWxkIGRlZmF1bHQgdG8gYSBibGFuayBzdWZmaXggaW4gdGhhdCBjYXNlLlxuXG5cdFx0XHRcdFx0XHRpZiAoYnMgPT09IFwiXCIgfHwgYnMgPT09IFwiYXV0b1wiKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChwID09PSBcIndpZHRoXCIgfHwgcCA9PT0gXCJoZWlnaHRcIikge1xuXHRcdFx0XHRcdFx0XHRcdGJuID0gX2dldERpbWVuc2lvbih0YXJnZXQsIHAsIF9jcyk7XG5cdFx0XHRcdFx0XHRcdFx0YnNmeCA9IFwicHhcIjtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChwID09PSBcImxlZnRcIiB8fCBwID09PSBcInRvcFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym4gPSBfY2FsY3VsYXRlT2Zmc2V0KHRhcmdldCwgcCwgX2NzKTtcblx0XHRcdFx0XHRcdFx0XHRic2Z4ID0gXCJweFwiO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGJuID0gKHAgIT09IFwib3BhY2l0eVwiKSA/IDAgOiAxO1xuXHRcdFx0XHRcdFx0XHRcdGJzZnggPSBcIlwiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJlbCA9IChpc1N0ciAmJiBlcy5jaGFyQXQoMSkgPT09IFwiPVwiKTtcblx0XHRcdFx0XHRcdGlmIChyZWwpIHtcblx0XHRcdFx0XHRcdFx0ZW4gPSBwYXJzZUludChlcy5jaGFyQXQoMCkgKyBcIjFcIiwgMTApO1xuXHRcdFx0XHRcdFx0XHRlcyA9IGVzLnN1YnN0cigyKTtcblx0XHRcdFx0XHRcdFx0ZW4gKj0gcGFyc2VGbG9hdChlcyk7XG5cdFx0XHRcdFx0XHRcdGVzZnggPSBlcy5yZXBsYWNlKF9zdWZmaXhFeHAsIFwiXCIpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0ZW4gPSBwYXJzZUZsb2F0KGVzKTtcblx0XHRcdFx0XHRcdFx0ZXNmeCA9IGlzU3RyID8gZXMucmVwbGFjZShfc3VmZml4RXhwLCBcIlwiKSA6IFwiXCI7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChlc2Z4ID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRcdGVzZnggPSAocCBpbiBfc3VmZml4TWFwKSA/IF9zdWZmaXhNYXBbcF0gOiBic2Z4OyAvL3BvcHVsYXRlIHRoZSBlbmQgc3VmZml4LCBwcmlvcml0aXppbmcgdGhlIG1hcCwgdGhlbiBpZiBub25lIGlzIGZvdW5kLCB1c2UgdGhlIGJlZ2lubmluZyBzdWZmaXguXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGVzID0gKGVuIHx8IGVuID09PSAwKSA/IChyZWwgPyBlbiArIGJuIDogZW4pICsgZXNmeCA6IHZhcnNbcF07IC8vZW5zdXJlcyB0aGF0IGFueSArPSBvciAtPSBwcmVmaXhlcyBhcmUgdGFrZW4gY2FyZSBvZi4gUmVjb3JkIHRoZSBlbmQgdmFsdWUgYmVmb3JlIG5vcm1hbGl6aW5nIHRoZSBzdWZmaXggYmVjYXVzZSB3ZSBhbHdheXMgd2FudCB0byBlbmQgdGhlIHR3ZWVuIG9uIGV4YWN0bHkgd2hhdCB0aGV5IGludGVuZGVkIGV2ZW4gaWYgaXQgZG9lc24ndCBtYXRjaCB0aGUgYmVnaW5uaW5nIHZhbHVlJ3Mgc3VmZml4LlxuXG5cdFx0XHRcdFx0XHQvL2lmIHRoZSBiZWdpbm5pbmcvZW5kaW5nIHN1ZmZpeGVzIGRvbid0IG1hdGNoLCBub3JtYWxpemUgdGhlbS4uLlxuXHRcdFx0XHRcdFx0aWYgKGJzZnggIT09IGVzZngpIGlmIChlc2Z4ICE9PSBcIlwiKSBpZiAoZW4gfHwgZW4gPT09IDApIGlmIChibikgeyAvL25vdGU6IGlmIHRoZSBiZWdpbm5pbmcgdmFsdWUgKGJuKSBpcyAwLCB3ZSBkb24ndCBuZWVkIHRvIGNvbnZlcnQgdW5pdHMhXG5cdFx0XHRcdFx0XHRcdGJuID0gX2NvbnZlcnRUb1BpeGVscyh0YXJnZXQsIHAsIGJuLCBic2Z4KTtcblx0XHRcdFx0XHRcdFx0aWYgKGVzZnggPT09IFwiJVwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym4gLz0gX2NvbnZlcnRUb1BpeGVscyh0YXJnZXQsIHAsIDEwMCwgXCIlXCIpIC8gMTAwO1xuXHRcdFx0XHRcdFx0XHRcdGlmICh2YXJzLnN0cmljdFVuaXRzICE9PSB0cnVlKSB7IC8vc29tZSBicm93c2VycyByZXBvcnQgb25seSBcInB4XCIgdmFsdWVzIGluc3RlYWQgb2YgYWxsb3dpbmcgXCIlXCIgd2l0aCBnZXRDb21wdXRlZFN0eWxlKCksIHNvIHdlIGFzc3VtZSB0aGF0IGlmIHdlJ3JlIHR3ZWVuaW5nIHRvIGEgJSwgd2Ugc2hvdWxkIHN0YXJ0IHRoZXJlIHRvbyB1bmxlc3Mgc3RyaWN0VW5pdHM6dHJ1ZSBpcyBkZWZpbmVkLiBUaGlzIGFwcHJvYWNoIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHJlc3BvbnNpdmUgZGVzaWducyB0aGF0IHVzZSBmcm9tKCkgdHdlZW5zLlxuXHRcdFx0XHRcdFx0XHRcdFx0YnMgPSBibiArIFwiJVwiO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGVzZnggPT09IFwiZW1cIiB8fCBlc2Z4ID09PSBcInJlbVwiIHx8IGVzZnggPT09IFwidndcIiB8fCBlc2Z4ID09PSBcInZoXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRibiAvPSBfY29udmVydFRvUGl4ZWxzKHRhcmdldCwgcCwgMSwgZXNmeCk7XG5cblx0XHRcdFx0XHRcdFx0Ly9vdGhlcndpc2UgY29udmVydCB0byBwaXhlbHMuXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZXNmeCAhPT0gXCJweFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZW4gPSBfY29udmVydFRvUGl4ZWxzKHRhcmdldCwgcCwgZW4sIGVzZngpO1xuXHRcdFx0XHRcdFx0XHRcdGVzZnggPSBcInB4XCI7IC8vd2UgZG9uJ3QgdXNlIGJzZnggYWZ0ZXIgdGhpcywgc28gd2UgZG9uJ3QgbmVlZCB0byBzZXQgaXQgdG8gcHggdG9vLlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChyZWwpIGlmIChlbiB8fCBlbiA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdGVzID0gKGVuICsgYm4pICsgZXNmeDsgLy90aGUgY2hhbmdlcyB3ZSBtYWRlIGFmZmVjdCByZWxhdGl2ZSBjYWxjdWxhdGlvbnMsIHNvIGFkanVzdCB0aGUgZW5kIHZhbHVlIGhlcmUuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHJlbCkge1xuXHRcdFx0XHRcdFx0XHRlbiArPSBibjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKChibiB8fCBibiA9PT0gMCkgJiYgKGVuIHx8IGVuID09PSAwKSkgeyAvL2Zhc3RlciB0aGFuIGlzTmFOKCkuIEFsc28sIHByZXZpb3VzbHkgd2UgcmVxdWlyZWQgZW4gIT09IGJuIGJ1dCB0aGF0IGRvZXNuJ3QgcmVhbGx5IGdhaW4gbXVjaCBwZXJmb3JtYW5jZSBhbmQgaXQgcHJldmVudHMgX3BhcnNlVG9Qcm94eSgpIGZyb20gd29ya2luZyBwcm9wZXJseSBpZiBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgbWF0Y2ggYnV0IG5lZWQgdG8gZ2V0IHR3ZWVuZWQgYnkgYW4gZXh0ZXJuYWwgcGx1Z2luIGFueXdheS4gRm9yIGV4YW1wbGUsIGEgYmV6aWVyIHR3ZWVuIHdoZXJlIHRoZSB0YXJnZXQgc3RhcnRzIGF0IGxlZnQ6MCBhbmQgaGFzIHRoZXNlIHBvaW50czogW3tsZWZ0OjUwfSx7bGVmdDowfV0gd291bGRuJ3Qgd29yayBwcm9wZXJseSBiZWNhdXNlIHdoZW4gcGFyc2luZyB0aGUgbGFzdCBwb2ludCwgaXQnZCBtYXRjaCB0aGUgZmlyc3QgKGN1cnJlbnQpIG9uZSBhbmQgYSBub24tdHdlZW5pbmcgQ1NTUHJvcFR3ZWVuIHdvdWxkIGJlIHJlY29yZGVkIHdoZW4gd2UgYWN0dWFsbHkgbmVlZCBhIG5vcm1hbCB0d2VlbiAodHlwZTowKSBzbyB0aGF0IHRoaW5ncyBnZXQgdXBkYXRlZCBkdXJpbmcgdGhlIHR3ZWVuIHByb3Blcmx5LlxuXHRcdFx0XHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIHAsIGJuLCBlbiAtIGJuLCBwdCwgMCwgcCwgKF9hdXRvUm91bmQgIT09IGZhbHNlICYmIChlc2Z4ID09PSBcInB4XCIgfHwgcCA9PT0gXCJ6SW5kZXhcIikpLCAwLCBicywgZXMpO1xuXHRcdFx0XHRcdFx0XHRwdC54czAgPSBlc2Z4O1xuXHRcdFx0XHRcdFx0XHQvL0RFQlVHOiBfbG9nKFwidHdlZW4gXCIrcCtcIiBmcm9tIFwiK3B0LmIrXCIgKFwiK2JuK2VzZngrXCIpIHRvIFwiK3B0LmUrXCIgd2l0aCBzdWZmaXg6IFwiK3B0LnhzMCk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0eWxlW3BdID09PSB1bmRlZmluZWQgfHwgIWVzICYmIChlcyArIFwiXCIgPT09IFwiTmFOXCIgfHwgZXMgPT0gbnVsbCkpIHtcblx0XHRcdFx0XHRcdFx0X2xvZyhcImludmFsaWQgXCIgKyBwICsgXCIgdHdlZW4gdmFsdWU6IFwiICsgdmFyc1twXSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIHAsIGVuIHx8IGJuIHx8IDAsIDAsIHB0LCAtMSwgcCwgZmFsc2UsIDAsIGJzLCBlcyk7XG5cdFx0XHRcdFx0XHRcdHB0LnhzMCA9IChlcyA9PT0gXCJub25lXCIgJiYgKHAgPT09IFwiZGlzcGxheVwiIHx8IHAuaW5kZXhPZihcIlN0eWxlXCIpICE9PSAtMSkpID8gYnMgOiBlczsgLy9pbnRlcm1lZGlhdGUgdmFsdWUgc2hvdWxkIHR5cGljYWxseSBiZSBzZXQgaW1tZWRpYXRlbHkgKGVuZCB2YWx1ZSkgZXhjZXB0IGZvciBcImRpc3BsYXlcIiBvciB0aGluZ3MgbGlrZSBib3JkZXJUb3BTdHlsZSwgYm9yZGVyQm90dG9tU3R5bGUsIGV0Yy4gd2hpY2ggc2hvdWxkIHVzZSB0aGUgYmVnaW5uaW5nIHZhbHVlIGR1cmluZyB0aGUgdHdlZW4uXG5cdFx0XHRcdFx0XHRcdC8vREVCVUc6IF9sb2coXCJub24tdHdlZW5pbmcgdmFsdWUgXCIrcCtcIjogXCIrcHQueHMwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBsdWdpbikgaWYgKHB0ICYmICFwdC5wbHVnaW4pIHtcblx0XHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBwdDtcblx0XHR9O1xuXG5cblx0XHQvL2dldHMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHR3ZWVuIHVwZGF0ZXMsIHBhc3NpbmcgdGhlIG5ldyByYXRpbyAodHlwaWNhbGx5IGEgdmFsdWUgYmV0d2VlbiAwIGFuZCAxLCBidXQgbm90IGFsd2F5cyAoZm9yIGV4YW1wbGUsIGlmIGFuIEVsYXN0aWMuZWFzZU91dCBpcyB1c2VkLCB0aGUgdmFsdWUgY2FuIGp1bXAgYWJvdmUgMSBtaWQtdHdlZW4pLiBJdCB3aWxsIGFsd2F5cyBzdGFydCBhbmQgMCBhbmQgZW5kIGF0IDEuXG5cdFx0cC5zZXRSYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdHZhciBwdCA9IHRoaXMuX2ZpcnN0UFQsXG5cdFx0XHRcdG1pbiA9IDAuMDAwMDAxLFxuXHRcdFx0XHR2YWwsIHN0ciwgaTtcblx0XHRcdC8vYXQgdGhlIGVuZCBvZiB0aGUgdHdlZW4sIHdlIHNldCB0aGUgdmFsdWVzIHRvIGV4YWN0bHkgd2hhdCB3ZSByZWNlaXZlZCBpbiBvcmRlciB0byBtYWtlIHN1cmUgbm9uLXR3ZWVuaW5nIHZhbHVlcyAobGlrZSBcInBvc2l0aW9uXCIgb3IgXCJmbG9hdFwiIG9yIHdoYXRldmVyKSBhcmUgc2V0IGFuZCBzbyB0aGF0IGlmIHRoZSBiZWdpbm5pbmcvZW5kaW5nIHN1ZmZpeGVzICh1bml0cykgZGlkbid0IG1hdGNoIGFuZCB3ZSBub3JtYWxpemVkIHRvIHB4LCB0aGUgdmFsdWUgdGhhdCB0aGUgdXNlciBwYXNzZWQgaW4gaXMgdXNlZCBoZXJlLiBXZSBjaGVjayB0byBzZWUgaWYgdGhlIHR3ZWVuIGlzIGF0IGl0cyBiZWdpbm5pbmcgaW4gY2FzZSBpdCdzIGEgZnJvbSgpIHR3ZWVuIGluIHdoaWNoIGNhc2UgdGhlIHJhdGlvIHdpbGwgYWN0dWFsbHkgZ28gZnJvbSAxIHRvIDAgb3ZlciB0aGUgY291cnNlIG9mIHRoZSB0d2VlbiAoYmFja3dhcmRzKS5cblx0XHRcdGlmICh2ID09PSAxICYmICh0aGlzLl90d2Vlbi5fdGltZSA9PT0gdGhpcy5fdHdlZW4uX2R1cmF0aW9uIHx8IHRoaXMuX3R3ZWVuLl90aW1lID09PSAwKSkge1xuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHRpZiAocHQudHlwZSAhPT0gMikge1xuXHRcdFx0XHRcdFx0aWYgKHB0LnIgJiYgcHQudHlwZSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0dmFsID0gTWF0aC5yb3VuZChwdC5zICsgcHQuYyk7XG5cdFx0XHRcdFx0XHRcdGlmICghcHQudHlwZSkge1xuXHRcdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSB2YWwgKyBwdC54czA7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocHQudHlwZSA9PT0gMSkgeyAvL2NvbXBsZXggdmFsdWUgKG9uZSB0aGF0IHR5cGljYWxseSBoYXMgbXVsdGlwbGUgbnVtYmVycyBpbnNpZGUgYSBzdHJpbmcsIGxpa2UgXCJyZWN0KDVweCwxMHB4LDIwcHgsMjVweClcIlxuXHRcdFx0XHRcdFx0XHRcdGkgPSBwdC5sO1xuXHRcdFx0XHRcdFx0XHRcdHN0ciA9IHB0LnhzMCArIHZhbCArIHB0LnhzMTtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAxOyBpIDwgcHQubDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdHIgKz0gcHRbXCJ4blwiK2ldICsgcHRbXCJ4c1wiKyhpKzEpXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHN0cjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LmU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHB0LnNldFJhdGlvKHYpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSBpZiAodiB8fCAhKHRoaXMuX3R3ZWVuLl90aW1lID09PSB0aGlzLl90d2Vlbi5fZHVyYXRpb24gfHwgdGhpcy5fdHdlZW4uX3RpbWUgPT09IDApIHx8IHRoaXMuX3R3ZWVuLl9yYXdQcmV2VGltZSA9PT0gLTAuMDAwMDAxKSB7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdHZhbCA9IHB0LmMgKiB2ICsgcHQucztcblx0XHRcdFx0XHRpZiAocHQucikge1xuXHRcdFx0XHRcdFx0dmFsID0gTWF0aC5yb3VuZCh2YWwpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodmFsIDwgbWluKSBpZiAodmFsID4gLW1pbikge1xuXHRcdFx0XHRcdFx0dmFsID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFwdC50eXBlKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gdmFsICsgcHQueHMwO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHQudHlwZSA9PT0gMSkgeyAvL2NvbXBsZXggdmFsdWUgKG9uZSB0aGF0IHR5cGljYWxseSBoYXMgbXVsdGlwbGUgbnVtYmVycyBpbnNpZGUgYSBzdHJpbmcsIGxpa2UgXCJyZWN0KDVweCwxMHB4LDIwcHgsMjVweClcIlxuXHRcdFx0XHRcdFx0aSA9IHB0Lmw7XG5cdFx0XHRcdFx0XHRpZiAoaSA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQueHMwICsgdmFsICsgcHQueHMxICsgcHQueG4xICsgcHQueHMyO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChpID09PSAzKSB7XG5cdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSBwdC54czAgKyB2YWwgKyBwdC54czEgKyBwdC54bjEgKyBwdC54czIgKyBwdC54bjIgKyBwdC54czM7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGkgPT09IDQpIHtcblx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LnhzMCArIHZhbCArIHB0LnhzMSArIHB0LnhuMSArIHB0LnhzMiArIHB0LnhuMiArIHB0LnhzMyArIHB0LnhuMyArIHB0LnhzNDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoaSA9PT0gNSkge1xuXHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQueHMwICsgdmFsICsgcHQueHMxICsgcHQueG4xICsgcHQueHMyICsgcHQueG4yICsgcHQueHMzICsgcHQueG4zICsgcHQueHM0ICsgcHQueG40ICsgcHQueHM1O1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c3RyID0gcHQueHMwICsgdmFsICsgcHQueHMxO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAxOyBpIDwgcHQubDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0c3RyICs9IHB0W1wieG5cIitpXSArIHB0W1wieHNcIisoaSsxKV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHN0cjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHQudHlwZSA9PT0gLTEpIHsgLy9ub24tdHdlZW5pbmcgdmFsdWVcblx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSBwdC54czA7XG5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0LnNldFJhdGlvKSB7IC8vY3VzdG9tIHNldFJhdGlvKCkgZm9yIHRoaW5ncyBsaWtlIFNwZWNpYWxQcm9wcywgZXh0ZXJuYWwgcGx1Z2lucywgZXRjLlxuXHRcdFx0XHRcdFx0cHQuc2V0UmF0aW8odik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0Ly9pZiB0aGUgdHdlZW4gaXMgcmV2ZXJzZWQgYWxsIHRoZSB3YXkgYmFjayB0byB0aGUgYmVnaW5uaW5nLCB3ZSBuZWVkIHRvIHJlc3RvcmUgdGhlIG9yaWdpbmFsIHZhbHVlcyB3aGljaCBtYXkgaGF2ZSBkaWZmZXJlbnQgdW5pdHMgKGxpa2UgJSBpbnN0ZWFkIG9mIHB4IG9yIGVtIG9yIHdoYXRldmVyKS5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdGlmIChwdC50eXBlICE9PSAyKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQuYjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cHQuc2V0UmF0aW8odik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBGb3JjZXMgcmVuZGVyaW5nIG9mIHRoZSB0YXJnZXQncyB0cmFuc2Zvcm1zIChyb3RhdGlvbiwgc2NhbGUsIGV0Yy4pIHdoZW5ldmVyIHRoZSBDU1NQbHVnaW4ncyBzZXRSYXRpbygpIGlzIGNhbGxlZC5cblx0XHQgKiBCYXNpY2FsbHksIHRoaXMgdGVsbHMgdGhlIENTU1BsdWdpbiB0byBjcmVhdGUgYSBDU1NQcm9wVHdlZW4gKHR5cGUgMikgYWZ0ZXIgaW5zdGFudGlhdGlvbiB0aGF0IHJ1bnMgbGFzdCBpbiB0aGUgbGlua2VkXG5cdFx0ICogbGlzdCBhbmQgY2FsbHMgdGhlIGFwcHJvcHJpYXRlICgzRCBvciAyRCkgcmVuZGVyaW5nIGZ1bmN0aW9uLiBXZSBzZXBhcmF0ZSB0aGlzIGludG8gaXRzIG93biBtZXRob2Qgc28gdGhhdCB3ZSBjYW4gY2FsbFxuXHRcdCAqIGl0IGZyb20gb3RoZXIgcGx1Z2lucyBsaWtlIEJlemllclBsdWdpbiBpZiwgZm9yIGV4YW1wbGUsIGl0IG5lZWRzIHRvIGFwcGx5IGFuIGF1dG9Sb3RhdGlvbiBhbmQgdGhpcyBDU1NQbHVnaW5cblx0XHQgKiBkb2Vzbid0IGhhdmUgYW55IHRyYW5zZm9ybS1yZWxhdGVkIHByb3BlcnRpZXMgb2YgaXRzIG93bi4gWW91IGNhbiBjYWxsIHRoaXMgbWV0aG9kIGFzIG1hbnkgdGltZXMgYXMgeW91XG5cdFx0ICogd2FudCBhbmQgaXQgd29uJ3QgY3JlYXRlIGR1cGxpY2F0ZSBDU1NQcm9wVHdlZW5zLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSB0aHJlZUQgaWYgdHJ1ZSwgaXQgc2hvdWxkIGFwcGx5IDNEIHR3ZWVucyAob3RoZXJ3aXNlLCBqdXN0IDJEIG9uZXMgYXJlIGZpbmUgYW5kIHR5cGljYWxseSBmYXN0ZXIpXG5cdFx0ICovXG5cdFx0cC5fZW5hYmxlVHJhbnNmb3JtcyA9IGZ1bmN0aW9uKHRocmVlRCkge1xuXHRcdFx0dGhpcy5fdHJhbnNmb3JtID0gdGhpcy5fdHJhbnNmb3JtIHx8IF9nZXRUcmFuc2Zvcm0odGhpcy5fdGFyZ2V0LCBfY3MsIHRydWUpOyAvL2Vuc3VyZXMgdGhhdCB0aGUgZWxlbWVudCBoYXMgYSBfZ3NUcmFuc2Zvcm0gcHJvcGVydHkgd2l0aCB0aGUgYXBwcm9wcmlhdGUgdmFsdWVzLlxuXHRcdFx0dGhpcy5fdHJhbnNmb3JtVHlwZSA9ICghKHRoaXMuX3RyYW5zZm9ybS5zdmcgJiYgX3VzZVNWR1RyYW5zZm9ybUF0dHIpICYmICh0aHJlZUQgfHwgdGhpcy5fdHJhbnNmb3JtVHlwZSA9PT0gMykpID8gMyA6IDI7XG5cdFx0fTtcblxuXHRcdHZhciBsYXp5U2V0ID0gZnVuY3Rpb24odikge1xuXHRcdFx0dGhpcy50W3RoaXMucF0gPSB0aGlzLmU7XG5cdFx0XHR0aGlzLmRhdGEuX2xpbmtDU1NQKHRoaXMsIHRoaXMuX25leHQsIG51bGwsIHRydWUpOyAvL3dlIHB1cnBvc2VmdWxseSBrZWVwIHRoaXMuX25leHQgZXZlbiB0aG91Z2ggaXQnZCBtYWtlIHNlbnNlIHRvIG51bGwgaXQsIGJ1dCB0aGlzIGlzIGEgcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uLCBhcyB0aGlzIGhhcHBlbnMgZHVyaW5nIHRoZSB3aGlsZSAocHQpIHt9IGxvb3AgaW4gc2V0UmF0aW8oKSBhdCB0aGUgYm90dG9tIG9mIHdoaWNoIGl0IHNldHMgcHQgPSBwdC5fbmV4dCwgc28gaWYgd2UgbnVsbCBpdCwgdGhlIGxpbmtlZCBsaXN0IHdpbGwgYmUgYnJva2VuIGluIHRoYXQgbG9vcC5cblx0XHR9O1xuXHRcdC8qKiBAcHJpdmF0ZSBHaXZlcyB1cyBhIHdheSB0byBzZXQgYSB2YWx1ZSBvbiB0aGUgZmlyc3QgcmVuZGVyIChhbmQgb25seSB0aGUgZmlyc3QgcmVuZGVyKS4gKiovXG5cdFx0cC5fYWRkTGF6eVNldCA9IGZ1bmN0aW9uKHQsIHAsIHYpIHtcblx0XHRcdHZhciBwdCA9IHRoaXMuX2ZpcnN0UFQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHQsIHAsIDAsIDAsIHRoaXMuX2ZpcnN0UFQsIDIpO1xuXHRcdFx0cHQuZSA9IHY7XG5cdFx0XHRwdC5zZXRSYXRpbyA9IGxhenlTZXQ7XG5cdFx0XHRwdC5kYXRhID0gdGhpcztcblx0XHR9O1xuXG5cdFx0LyoqIEBwcml2YXRlICoqL1xuXHRcdHAuX2xpbmtDU1NQID0gZnVuY3Rpb24ocHQsIG5leHQsIHByZXYsIHJlbW92ZSkge1xuXHRcdFx0aWYgKHB0KSB7XG5cdFx0XHRcdGlmIChuZXh0KSB7XG5cdFx0XHRcdFx0bmV4dC5fcHJldiA9IHB0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwdC5fbmV4dCkge1xuXHRcdFx0XHRcdHB0Ll9uZXh0Ll9wcmV2ID0gcHQuX3ByZXY7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHB0Ll9wcmV2KSB7XG5cdFx0XHRcdFx0cHQuX3ByZXYuX25leHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9maXJzdFBUID09PSBwdCkge1xuXHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHRyZW1vdmUgPSB0cnVlOyAvL2p1c3QgdG8gcHJldmVudCByZXNldHRpbmcgdGhpcy5fZmlyc3RQVCA1IGxpbmVzIGRvd24gaW4gY2FzZSBwdC5fbmV4dCBpcyBudWxsLiAob3B0aW1pemVkIGZvciBzcGVlZClcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJldikge1xuXHRcdFx0XHRcdHByZXYuX25leHQgPSBwdDtcblx0XHRcdFx0fSBlbHNlIGlmICghcmVtb3ZlICYmIHRoaXMuX2ZpcnN0UFQgPT09IG51bGwpIHtcblx0XHRcdFx0XHR0aGlzLl9maXJzdFBUID0gcHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQuX25leHQgPSBuZXh0O1xuXHRcdFx0XHRwdC5fcHJldiA9IHByZXY7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fTtcblxuXHRcdC8vd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhhdCBpZiBhbHBoYSBvciBhdXRvQWxwaGEgaXMga2lsbGVkLCBvcGFjaXR5IGlzIHRvby4gQW5kIGF1dG9BbHBoYSBhZmZlY3RzIHRoZSBcInZpc2liaWxpdHlcIiBwcm9wZXJ0eS5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24obG9va3VwKSB7XG5cdFx0XHR2YXIgY29weSA9IGxvb2t1cCxcblx0XHRcdFx0cHQsIHAsIHhmaXJzdDtcblx0XHRcdGlmIChsb29rdXAuYXV0b0FscGhhIHx8IGxvb2t1cC5hbHBoYSkge1xuXHRcdFx0XHRjb3B5ID0ge307XG5cdFx0XHRcdGZvciAocCBpbiBsb29rdXApIHsgLy9jb3B5IHRoZSBsb29rdXAgc28gdGhhdCB3ZSdyZSBub3QgY2hhbmdpbmcgdGhlIG9yaWdpbmFsIHdoaWNoIG1heSBiZSBwYXNzZWQgZWxzZXdoZXJlLlxuXHRcdFx0XHRcdGNvcHlbcF0gPSBsb29rdXBbcF07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29weS5vcGFjaXR5ID0gMTtcblx0XHRcdFx0aWYgKGNvcHkuYXV0b0FscGhhKSB7XG5cdFx0XHRcdFx0Y29weS52aXNpYmlsaXR5ID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGxvb2t1cC5jbGFzc05hbWUgJiYgKHB0ID0gdGhpcy5fY2xhc3NOYW1lUFQpKSB7IC8vZm9yIGNsYXNzTmFtZSB0d2VlbnMsIHdlIG5lZWQgdG8ga2lsbCBhbnkgYXNzb2NpYXRlZCBDU1NQcm9wVHdlZW5zIHRvbzsgYSBsaW5rZWQgbGlzdCBzdGFydHMgYXQgdGhlIGNsYXNzTmFtZSdzIFwieGZpcnN0XCIuXG5cdFx0XHRcdHhmaXJzdCA9IHB0LnhmaXJzdDtcblx0XHRcdFx0aWYgKHhmaXJzdCAmJiB4Zmlyc3QuX3ByZXYpIHtcblx0XHRcdFx0XHR0aGlzLl9saW5rQ1NTUCh4Zmlyc3QuX3ByZXYsIHB0Ll9uZXh0LCB4Zmlyc3QuX3ByZXYuX3ByZXYpOyAvL2JyZWFrIG9mZiB0aGUgcHJldlxuXHRcdFx0XHR9IGVsc2UgaWYgKHhmaXJzdCA9PT0gdGhpcy5fZmlyc3RQVCkge1xuXHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHQuX25leHQpIHtcblx0XHRcdFx0XHR0aGlzLl9saW5rQ1NTUChwdC5fbmV4dCwgcHQuX25leHQuX25leHQsIHhmaXJzdC5fcHJldik7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fY2xhc3NOYW1lUFQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFR3ZWVuUGx1Z2luLnByb3RvdHlwZS5fa2lsbC5jYWxsKHRoaXMsIGNvcHkpO1xuXHRcdH07XG5cblxuXG5cdFx0Ly91c2VkIGJ5IGNhc2NhZGVUbygpIGZvciBnYXRoZXJpbmcgYWxsIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIG9mIGVhY2ggY2hpbGQgZWxlbWVudCBpbnRvIGFuIGFycmF5IGZvciBjb21wYXJpc29uLlxuXHRcdHZhciBfZ2V0Q2hpbGRTdHlsZXMgPSBmdW5jdGlvbihlLCBwcm9wcywgdGFyZ2V0cykge1xuXHRcdFx0XHR2YXIgY2hpbGRyZW4sIGksIGNoaWxkLCB0eXBlO1xuXHRcdFx0XHRpZiAoZS5zbGljZSkge1xuXHRcdFx0XHRcdGkgPSBlLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdF9nZXRDaGlsZFN0eWxlcyhlW2ldLCBwcm9wcywgdGFyZ2V0cyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGlsZHJlbiA9IGUuY2hpbGROb2Rlcztcblx0XHRcdFx0aSA9IGNoaWxkcmVuLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0Y2hpbGQgPSBjaGlsZHJlbltpXTtcblx0XHRcdFx0XHR0eXBlID0gY2hpbGQudHlwZTtcblx0XHRcdFx0XHRpZiAoY2hpbGQuc3R5bGUpIHtcblx0XHRcdFx0XHRcdHByb3BzLnB1c2goX2dldEFsbFN0eWxlcyhjaGlsZCkpO1xuXHRcdFx0XHRcdFx0aWYgKHRhcmdldHMpIHtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0cy5wdXNoKGNoaWxkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCh0eXBlID09PSAxIHx8IHR5cGUgPT09IDkgfHwgdHlwZSA9PT0gMTEpICYmIGNoaWxkLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRfZ2V0Q2hpbGRTdHlsZXMoY2hpbGQsIHByb3BzLCB0YXJnZXRzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBUeXBpY2FsbHkgb25seSB1c2VmdWwgZm9yIGNsYXNzTmFtZSB0d2VlbnMgdGhhdCBtYXkgYWZmZWN0IGNoaWxkIGVsZW1lbnRzLCB0aGlzIG1ldGhvZCBjcmVhdGVzIGEgVHdlZW5MaXRlXG5cdFx0ICogYW5kIHRoZW4gY29tcGFyZXMgdGhlIHN0eWxlIHByb3BlcnRpZXMgb2YgYWxsIHRoZSB0YXJnZXQncyBjaGlsZCBlbGVtZW50cyBhdCB0aGUgdHdlZW4ncyBzdGFydCBhbmQgZW5kLCBhbmRcblx0XHQgKiBpZiBhbnkgYXJlIGRpZmZlcmVudCwgaXQgYWxzbyBjcmVhdGVzIHR3ZWVucyBmb3IgdGhvc2UgYW5kIHJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBBTEwgb2YgdGhlIHJlc3VsdGluZ1xuXHRcdCAqIHR3ZWVucyAoc28gdGhhdCB5b3UgY2FuIGVhc2lseSBhZGQoKSB0aGVtIHRvIGEgVGltZWxpbmVMaXRlLCBmb3IgZXhhbXBsZSkuIFRoZSByZWFzb24gdGhpcyBmdW5jdGlvbmFsaXR5IGlzXG5cdFx0ICogd3JhcHBlZCBpbnRvIGEgc2VwYXJhdGUgc3RhdGljIG1ldGhvZCBvZiBDU1NQbHVnaW4gaW5zdGVhZCBvZiBiZWluZyBpbnRlZ3JhdGVkIGludG8gYWxsIHJlZ3VsYXIgY2xhc3NOYW1lIHR3ZWVuc1xuXHRcdCAqIGlzIGJlY2F1c2UgaXQgY3JlYXRlcyBlbnRpcmVseSBuZXcgdHdlZW5zIHRoYXQgbWF5IGhhdmUgY29tcGxldGVseSBkaWZmZXJlbnQgdGFyZ2V0cyB0aGFuIHRoZSBvcmlnaW5hbCB0d2Vlbixcblx0XHQgKiBzbyBpZiB0aGV5IHdlcmUgYWxsIGx1bXBlZCBpbnRvIHRoZSBvcmlnaW5hbCB0d2VlbiBpbnN0YW5jZSwgaXQgd291bGQgYmUgaW5jb25zaXN0ZW50IHdpdGggdGhlIHJlc3Qgb2YgdGhlIEFQSVxuXHRcdCAqIGFuZCBpdCB3b3VsZCBjcmVhdGUgb3RoZXIgcHJvYmxlbXMuIEZvciBleGFtcGxlOlxuXHRcdCAqICAtIElmIEkgY3JlYXRlIGEgdHdlZW4gb2YgZWxlbWVudEEsIHRoYXQgdHdlZW4gaW5zdGFuY2UgbWF5IHN1ZGRlbmx5IGNoYW5nZSBpdHMgdGFyZ2V0IHRvIGluY2x1ZGUgNTAgb3RoZXIgZWxlbWVudHMgKHVuaW50dWl0aXZlIGlmIEkgc3BlY2lmaWNhbGx5IGRlZmluZWQgdGhlIHRhcmdldCBJIHdhbnRlZClcblx0XHQgKiAgLSBXZSBjYW4ndCBqdXN0IGNyZWF0ZSBuZXcgaW5kZXBlbmRlbnQgdHdlZW5zIGJlY2F1c2Ugb3RoZXJ3aXNlLCB3aGF0IGhhcHBlbnMgaWYgdGhlIG9yaWdpbmFsL3BhcmVudCB0d2VlbiBpcyByZXZlcnNlZCBvciBwYXVzZSBvciBkcm9wcGVkIGludG8gYSBUaW1lbGluZUxpdGUgZm9yIHRpZ2h0IGNvbnRyb2w/IFlvdSdkIGV4cGVjdCB0aGF0IHR3ZWVuJ3MgYmVoYXZpb3IgdG8gYWZmZWN0IGFsbCB0aGUgb3RoZXJzLlxuXHRcdCAqICAtIEFuYWx5emluZyBldmVyeSBzdHlsZSBwcm9wZXJ0eSBvZiBldmVyeSBjaGlsZCBiZWZvcmUgYW5kIGFmdGVyIHRoZSB0d2VlbiBpcyBhbiBleHBlbnNpdmUgb3BlcmF0aW9uIHdoZW4gdGhlcmUgYXJlIG1hbnkgY2hpbGRyZW4sIHNvIHRoaXMgYmVoYXZpb3Igc2hvdWxkbid0IGJlIGltcG9zZWQgb24gYWxsIGNsYXNzTmFtZSB0d2VlbnMgYnkgZGVmYXVsdCwgZXNwZWNpYWxseSBzaW5jZSBpdCdzIHByb2JhYmx5IHJhcmUgdGhhdCB0aGlzIGV4dHJhIGZ1bmN0aW9uYWxpdHkgaXMgbmVlZGVkLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBvYmplY3QgdG8gYmUgdHdlZW5lZFxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBEdXJhdGlvbiBpbiBzZWNvbmRzIChvciBmcmFtZXMgZm9yIGZyYW1lcy1iYXNlZCB0d2VlbnMpXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IE9iamVjdCBjb250YWluaW5nIHRoZSBlbmQgdmFsdWVzLCBsaWtlIHtjbGFzc05hbWU6XCJuZXdDbGFzc1wiLCBlYXNlOkxpbmVhci5lYXNlTm9uZX1cblx0XHQgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgVHdlZW5MaXRlIGluc3RhbmNlc1xuXHRcdCAqL1xuXHRcdENTU1BsdWdpbi5jYXNjYWRlVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHR2YXIgdHdlZW4gPSBUd2VlbkxpdGUudG8odGFyZ2V0LCBkdXJhdGlvbiwgdmFycyksXG5cdFx0XHRcdHJlc3VsdHMgPSBbdHdlZW5dLFxuXHRcdFx0XHRiID0gW10sXG5cdFx0XHRcdGUgPSBbXSxcblx0XHRcdFx0dGFyZ2V0cyA9IFtdLFxuXHRcdFx0XHRfcmVzZXJ2ZWRQcm9wcyA9IFR3ZWVuTGl0ZS5faW50ZXJuYWxzLnJlc2VydmVkUHJvcHMsXG5cdFx0XHRcdGksIGRpZnMsIHAsIGZyb207XG5cdFx0XHR0YXJnZXQgPSB0d2Vlbi5fdGFyZ2V0cyB8fCB0d2Vlbi50YXJnZXQ7XG5cdFx0XHRfZ2V0Q2hpbGRTdHlsZXModGFyZ2V0LCBiLCB0YXJnZXRzKTtcblx0XHRcdHR3ZWVuLnJlbmRlcihkdXJhdGlvbiwgdHJ1ZSwgdHJ1ZSk7XG5cdFx0XHRfZ2V0Q2hpbGRTdHlsZXModGFyZ2V0LCBlKTtcblx0XHRcdHR3ZWVuLnJlbmRlcigwLCB0cnVlLCB0cnVlKTtcblx0XHRcdHR3ZWVuLl9lbmFibGVkKHRydWUpO1xuXHRcdFx0aSA9IHRhcmdldHMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGRpZnMgPSBfY3NzRGlmKHRhcmdldHNbaV0sIGJbaV0sIGVbaV0pO1xuXHRcdFx0XHRpZiAoZGlmcy5maXJzdE1QVCkge1xuXHRcdFx0XHRcdGRpZnMgPSBkaWZzLmRpZnM7XG5cdFx0XHRcdFx0Zm9yIChwIGluIHZhcnMpIHtcblx0XHRcdFx0XHRcdGlmIChfcmVzZXJ2ZWRQcm9wc1twXSkge1xuXHRcdFx0XHRcdFx0XHRkaWZzW3BdID0gdmFyc1twXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZnJvbSA9IHt9O1xuXHRcdFx0XHRcdGZvciAocCBpbiBkaWZzKSB7XG5cdFx0XHRcdFx0XHRmcm9tW3BdID0gYltpXVtwXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKFR3ZWVuTGl0ZS5mcm9tVG8odGFyZ2V0c1tpXSwgZHVyYXRpb24sIGZyb20sIGRpZnMpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0fTtcblxuXHRcdFR3ZWVuUGx1Z2luLmFjdGl2YXRlKFtDU1NQbHVnaW5dKTtcblx0XHRyZXR1cm4gQ1NTUGx1Z2luO1xuXG5cdH0sIHRydWUpO1xuXHRcbn0pOyBpZiAoX2dzU2NvcGUuX2dzRGVmaW5lKSB7IF9nc1Njb3BlLl9nc1F1ZXVlLnBvcCgpKCk7IH1cblxuLy9leHBvcnQgdG8gQU1EL1JlcXVpcmVKUyBhbmQgQ29tbW9uSlMvTm9kZSAocHJlY3Vyc29yIHRvIGZ1bGwgbW9kdWxhciBidWlsZCBzeXN0ZW0gY29taW5nIGF0IGEgbGF0ZXIgZGF0ZSlcbihmdW5jdGlvbihuYW1lKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXHR2YXIgZ2V0R2xvYmFsID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChfZ3NTY29wZS5HcmVlblNvY2tHbG9iYWxzIHx8IF9nc1Njb3BlKVtuYW1lXTtcblx0fTtcblx0aWYgKHR5cGVvZihkZWZpbmUpID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkgeyAvL0FNRFxuXHRcdGRlZmluZShbXCJUd2VlbkxpdGVcIl0sIGdldEdsb2JhbCk7XG5cdH0gZWxzZSBpZiAodHlwZW9mKG1vZHVsZSkgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHsgLy9ub2RlXG5cdFx0cmVxdWlyZShcIi4uL1R3ZWVuTGl0ZS5qc1wiKTtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGdldEdsb2JhbCgpO1xuXHR9XG59KFwiQ1NTUGx1Z2luXCIpKTtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vZ3NhcC9zcmMvdW5jb21wcmVzc2VkL3BsdWdpbnMvQ1NTUGx1Z2luLmpzXG4gKiogbW9kdWxlIGlkID0gMzRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKiogSU1QT1JUUyBGUk9NIGltcG9ydHMtbG9hZGVyICoqKi9cbnZhciBkZWZpbmUgPSBmYWxzZTtcblxuLyohXG4gKiBWRVJTSU9OOiAxLjE4LjJcbiAqIERBVEU6IDIwMTUtMTItMjJcbiAqIFVQREFURVMgQU5EIERPQ1MgQVQ6IGh0dHA6Ly9ncmVlbnNvY2suY29tXG4gKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDA4LTIwMTYsIEdyZWVuU29jay4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgd29yayBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBhdCBodHRwOi8vZ3JlZW5zb2NrLmNvbS9zdGFuZGFyZC1saWNlbnNlIG9yIGZvclxuICogQ2x1YiBHcmVlblNvY2sgbWVtYmVycywgdGhlIHNvZnR3YXJlIGFncmVlbWVudCB0aGF0IHdhcyBpc3N1ZWQgd2l0aCB5b3VyIG1lbWJlcnNoaXAuXG4gKiBcbiAqIEBhdXRob3I6IEphY2sgRG95bGUsIGphY2tAZ3JlZW5zb2NrLmNvbVxuICovXG4oZnVuY3Rpb24od2luZG93LCBtb2R1bGVOYW1lKSB7XG5cblx0XHRcInVzZSBzdHJpY3RcIjtcblx0XHR2YXIgX2dsb2JhbHMgPSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyA9IHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzIHx8IHdpbmRvdztcblx0XHRpZiAoX2dsb2JhbHMuVHdlZW5MaXRlKSB7XG5cdFx0XHRyZXR1cm47IC8vaW4gY2FzZSB0aGUgY29yZSBzZXQgb2YgY2xhc3NlcyBpcyBhbHJlYWR5IGxvYWRlZCwgZG9uJ3QgaW5zdGFudGlhdGUgdHdpY2UuXG5cdFx0fVxuXHRcdHZhciBfbmFtZXNwYWNlID0gZnVuY3Rpb24obnMpIHtcblx0XHRcdFx0dmFyIGEgPSBucy5zcGxpdChcIi5cIiksXG5cdFx0XHRcdFx0cCA9IF9nbG9iYWxzLCBpO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHBbYVtpXV0gPSBwID0gcFthW2ldXSB8fCB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcDtcblx0XHRcdH0sXG5cdFx0XHRncyA9IF9uYW1lc3BhY2UoXCJjb20uZ3JlZW5zb2NrXCIpLFxuXHRcdFx0X3RpbnlOdW0gPSAwLjAwMDAwMDAwMDEsXG5cdFx0XHRfc2xpY2UgPSBmdW5jdGlvbihhKSB7IC8vZG9uJ3QgdXNlIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRhcmdldCwgMCkgYmVjYXVzZSB0aGF0IGRvZXNuJ3Qgd29yayBpbiBJRTggd2l0aCBhIE5vZGVMaXN0IHRoYXQncyByZXR1cm5lZCBieSBxdWVyeVNlbGVjdG9yQWxsKClcblx0XHRcdFx0dmFyIGIgPSBbXSxcblx0XHRcdFx0XHRsID0gYS5sZW5ndGgsXG5cdFx0XHRcdFx0aTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSAhPT0gbDsgYi5wdXNoKGFbaSsrXSkpIHt9XG5cdFx0XHRcdHJldHVybiBiO1xuXHRcdFx0fSxcblx0XHRcdF9lbXB0eUZ1bmMgPSBmdW5jdGlvbigpIHt9LFxuXHRcdFx0X2lzQXJyYXkgPSAoZnVuY3Rpb24oKSB7IC8vd29ya3MgYXJvdW5kIGlzc3VlcyBpbiBpZnJhbWUgZW52aXJvbm1lbnRzIHdoZXJlIHRoZSBBcnJheSBnbG9iYWwgaXNuJ3Qgc2hhcmVkLCB0aHVzIGlmIHRoZSBvYmplY3Qgb3JpZ2luYXRlcyBpbiBhIGRpZmZlcmVudCB3aW5kb3cvaWZyYW1lLCBcIihvYmogaW5zdGFuY2VvZiBBcnJheSlcIiB3aWxsIGV2YWx1YXRlIGZhbHNlLiBXZSBhZGRlZCBzb21lIHNwZWVkIG9wdGltaXphdGlvbnMgdG8gYXZvaWQgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCkgdW5sZXNzIGl0J3MgYWJzb2x1dGVseSBuZWNlc3NhcnkgYmVjYXVzZSBpdCdzIFZFUlkgc2xvdyAobGlrZSAyMHggc2xvd2VyKVxuXHRcdFx0XHR2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuXHRcdFx0XHRcdGFycmF5ID0gdG9TdHJpbmcuY2FsbChbXSk7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbihvYmopIHtcblx0XHRcdFx0XHRyZXR1cm4gb2JqICE9IG51bGwgJiYgKG9iaiBpbnN0YW5jZW9mIEFycmF5IHx8ICh0eXBlb2Yob2JqKSA9PT0gXCJvYmplY3RcIiAmJiAhIW9iai5wdXNoICYmIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gYXJyYXkpKTtcblx0XHRcdFx0fTtcblx0XHRcdH0oKSksXG5cdFx0XHRhLCBpLCBwLCBfdGlja2VyLCBfdGlja2VyQWN0aXZlLFxuXHRcdFx0X2RlZkxvb2t1cCA9IHt9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBjb25zdHJ1Y3RvclxuXHRcdFx0ICogRGVmaW5lcyBhIEdyZWVuU29jayBjbGFzcywgb3B0aW9uYWxseSB3aXRoIGFuIGFycmF5IG9mIGRlcGVuZGVuY2llcyB0aGF0IG11c3QgYmUgaW5zdGFudGlhdGVkIGZpcnN0IGFuZCBwYXNzZWQgaW50byB0aGUgZGVmaW5pdGlvbi5cblx0XHRcdCAqIFRoaXMgYWxsb3dzIHVzZXJzIHRvIGxvYWQgR3JlZW5Tb2NrIEpTIGZpbGVzIGluIGFueSBvcmRlciBldmVuIGlmIHRoZXkgaGF2ZSBpbnRlcmRlcGVuZGVuY2llcyAobGlrZSBDU1NQbHVnaW4gZXh0ZW5kcyBUd2VlblBsdWdpbiB3aGljaCBpc1xuXHRcdFx0ICogaW5zaWRlIFR3ZWVuTGl0ZS5qcywgYnV0IGlmIENTU1BsdWdpbiBpcyBsb2FkZWQgZmlyc3QsIGl0IHNob3VsZCB3YWl0IHRvIHJ1biBpdHMgY29kZSB1bnRpbCBUd2VlbkxpdGUuanMgbG9hZHMgYW5kIGluc3RhbnRpYXRlcyBUd2VlblBsdWdpblxuXHRcdFx0ICogYW5kIHRoZW4gcGFzcyBUd2VlblBsdWdpbiB0byBDU1NQbHVnaW4ncyBkZWZpbml0aW9uKS4gVGhpcyBpcyBhbGwgZG9uZSBhdXRvbWF0aWNhbGx5IGFuZCBpbnRlcm5hbGx5LlxuXHRcdFx0ICpcblx0XHRcdCAqIEV2ZXJ5IGRlZmluaXRpb24gd2lsbCBiZSBhZGRlZCB0byBhIFwiY29tLmdyZWVuc29ja1wiIGdsb2JhbCBvYmplY3QgKHR5cGljYWxseSB3aW5kb3csIGJ1dCBpZiBhIHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzIG9iamVjdCBpcyBmb3VuZCxcblx0XHRcdCAqIGl0IHdpbGwgZ28gdGhlcmUgYXMgb2YgdjEuNykuIEZvciBleGFtcGxlLCBUd2VlbkxpdGUgd2lsbCBiZSBmb3VuZCBhdCB3aW5kb3cuY29tLmdyZWVuc29jay5Ud2VlbkxpdGUgYW5kIHNpbmNlIGl0J3MgYSBnbG9iYWwgY2xhc3MgdGhhdCBzaG91bGQgYmUgYXZhaWxhYmxlIGFueXdoZXJlLFxuXHRcdFx0ICogaXQgaXMgQUxTTyByZWZlcmVuY2VkIGF0IHdpbmRvdy5Ud2VlbkxpdGUuIEhvd2V2ZXIgc29tZSBjbGFzc2VzIGFyZW4ndCBjb25zaWRlcmVkIGdsb2JhbCwgbGlrZSB0aGUgYmFzZSBjb20uZ3JlZW5zb2NrLmNvcmUuQW5pbWF0aW9uIGNsYXNzLCBzb1xuXHRcdFx0ICogdGhvc2Ugd2lsbCBvbmx5IGJlIGF0IHRoZSBwYWNrYWdlIGxpa2Ugd2luZG93LmNvbS5ncmVlbnNvY2suY29yZS5BbmltYXRpb24uIEFnYWluLCBpZiB5b3UgZGVmaW5lIGEgR3JlZW5Tb2NrR2xvYmFscyBvYmplY3Qgb24gdGhlIHdpbmRvdywgZXZlcnl0aGluZ1xuXHRcdFx0ICogZ2V0cyB0dWNrZWQgbmVhdGx5IGluc2lkZSB0aGVyZSBpbnN0ZWFkIG9mIG9uIHRoZSB3aW5kb3cgZGlyZWN0bHkuIFRoaXMgYWxsb3dzIHlvdSB0byBkbyBhZHZhbmNlZCB0aGluZ3MgbGlrZSBsb2FkIG11bHRpcGxlIHZlcnNpb25zIG9mIEdyZWVuU29ja1xuXHRcdFx0ICogZmlsZXMgYW5kIHB1dCB0aGVtIGludG8gZGlzdGluY3Qgb2JqZWN0cyAoaW1hZ2luZSBhIGJhbm5lciBhZCB1c2VzIGEgbmV3ZXIgdmVyc2lvbiBidXQgdGhlIG1haW4gc2l0ZSB1c2VzIGFuIG9sZGVyIG9uZSkuIEluIHRoYXQgY2FzZSwgeW91IGNvdWxkXG5cdFx0XHQgKiBzYW5kYm94IHRoZSBiYW5uZXIgb25lIGxpa2U6XG5cdFx0XHQgKlxuXHRcdFx0ICogPHNjcmlwdD5cblx0XHRcdCAqICAgICB2YXIgZ3MgPSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyA9IHt9OyAvL3RoZSBuZXdlciB2ZXJzaW9uIHdlJ3JlIGFib3V0IHRvIGxvYWQgY291bGQgbm93IGJlIHJlZmVyZW5jZWQgaW4gYSBcImdzXCIgb2JqZWN0LCBsaWtlIGdzLlR3ZWVuTGl0ZS50byguLi4pLiBVc2Ugd2hhdGV2ZXIgYWxpYXMgeW91IHdhbnQgYXMgbG9uZyBhcyBpdCdzIHVuaXF1ZSwgXCJnc1wiIG9yIFwiYmFubmVyXCIgb3Igd2hhdGV2ZXIuXG5cdFx0XHQgKiA8L3NjcmlwdD5cblx0XHRcdCAqIDxzY3JpcHQgc3JjPVwianMvZ3JlZW5zb2NrL3YxLjcvVHdlZW5NYXguanNcIj48L3NjcmlwdD5cblx0XHRcdCAqIDxzY3JpcHQ+XG5cdFx0XHQgKiAgICAgd2luZG93LkdyZWVuU29ja0dsb2JhbHMgPSB3aW5kb3cuX2dzUXVldWUgPSB3aW5kb3cuX2dzRGVmaW5lID0gbnVsbDsgLy9yZXNldCBpdCBiYWNrIHRvIG51bGwgKGFsb25nIHdpdGggdGhlIHNwZWNpYWwgX2dzUXVldWUgdmFyaWFibGUpIHNvIHRoYXQgdGhlIG5leHQgbG9hZCBvZiBUd2Vlbk1heCBhZmZlY3RzIHRoZSB3aW5kb3cgYW5kIHdlIGNhbiByZWZlcmVuY2UgdGhpbmdzIGRpcmVjdGx5IGxpa2UgVHdlZW5MaXRlLnRvKC4uLilcblx0XHRcdCAqIDwvc2NyaXB0PlxuXHRcdFx0ICogPHNjcmlwdCBzcmM9XCJqcy9ncmVlbnNvY2svdjEuNi9Ud2Vlbk1heC5qc1wiPjwvc2NyaXB0PlxuXHRcdFx0ICogPHNjcmlwdD5cblx0XHRcdCAqICAgICBncy5Ud2VlbkxpdGUudG8oLi4uKTsgLy93b3VsZCB1c2UgdjEuN1xuXHRcdFx0ICogICAgIFR3ZWVuTGl0ZS50byguLi4pOyAvL3dvdWxkIHVzZSB2MS42XG5cdFx0XHQgKiA8L3NjcmlwdD5cblx0XHRcdCAqXG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IG5zIFRoZSBuYW1lc3BhY2Ugb2YgdGhlIGNsYXNzIGRlZmluaXRpb24sIGxlYXZpbmcgb2ZmIFwiY29tLmdyZWVuc29jay5cIiBhcyB0aGF0J3MgYXNzdW1lZC4gRm9yIGV4YW1wbGUsIFwiVHdlZW5MaXRlXCIgb3IgXCJwbHVnaW5zLkNTU1BsdWdpblwiIG9yIFwiZWFzaW5nLkJhY2tcIi5cblx0XHRcdCAqIEBwYXJhbSB7IUFycmF5LjxzdHJpbmc+fSBkZXBlbmRlbmNpZXMgQW4gYXJyYXkgb2YgZGVwZW5kZW5jaWVzIChkZXNjcmliZWQgYXMgdGhlaXIgbmFtZXNwYWNlcyBtaW51cyBcImNvbS5ncmVlbnNvY2suXCIgcHJlZml4KS4gRm9yIGV4YW1wbGUgW1wiVHdlZW5MaXRlXCIsXCJwbHVnaW5zLlR3ZWVuUGx1Z2luXCIsXCJjb3JlLkFuaW1hdGlvblwiXVxuXHRcdFx0ICogQHBhcmFtIHshZnVuY3Rpb24oKTpPYmplY3R9IGZ1bmMgVGhlIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCBhbmQgcGFzc2VkIHRoZSByZXNvbHZlZCBkZXBlbmRlbmNpZXMgd2hpY2ggd2lsbCByZXR1cm4gdGhlIGFjdHVhbCBjbGFzcyBmb3IgdGhpcyBkZWZpbml0aW9uLlxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFuPX0gZ2xvYmFsIElmIHRydWUsIHRoZSBjbGFzcyB3aWxsIGJlIGFkZGVkIHRvIHRoZSBnbG9iYWwgc2NvcGUgKHR5cGljYWxseSB3aW5kb3cgdW5sZXNzIHlvdSBkZWZpbmUgYSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyBvYmplY3QpXG5cdFx0XHQgKi9cblx0XHRcdERlZmluaXRpb24gPSBmdW5jdGlvbihucywgZGVwZW5kZW5jaWVzLCBmdW5jLCBnbG9iYWwpIHtcblx0XHRcdFx0dGhpcy5zYyA9IChfZGVmTG9va3VwW25zXSkgPyBfZGVmTG9va3VwW25zXS5zYyA6IFtdOyAvL3N1YmNsYXNzZXNcblx0XHRcdFx0X2RlZkxvb2t1cFtuc10gPSB0aGlzO1xuXHRcdFx0XHR0aGlzLmdzQ2xhc3MgPSBudWxsO1xuXHRcdFx0XHR0aGlzLmZ1bmMgPSBmdW5jO1xuXHRcdFx0XHR2YXIgX2NsYXNzZXMgPSBbXTtcblx0XHRcdFx0dGhpcy5jaGVjayA9IGZ1bmN0aW9uKGluaXQpIHtcblx0XHRcdFx0XHR2YXIgaSA9IGRlcGVuZGVuY2llcy5sZW5ndGgsXG5cdFx0XHRcdFx0XHRtaXNzaW5nID0gaSxcblx0XHRcdFx0XHRcdGN1ciwgYSwgbiwgY2wsIGhhc01vZHVsZTtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmICgoY3VyID0gX2RlZkxvb2t1cFtkZXBlbmRlbmNpZXNbaV1dIHx8IG5ldyBEZWZpbml0aW9uKGRlcGVuZGVuY2llc1tpXSwgW10pKS5nc0NsYXNzKSB7XG5cdFx0XHRcdFx0XHRcdF9jbGFzc2VzW2ldID0gY3VyLmdzQ2xhc3M7XG5cdFx0XHRcdFx0XHRcdG1pc3NpbmctLTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoaW5pdCkge1xuXHRcdFx0XHRcdFx0XHRjdXIuc2MucHVzaCh0aGlzKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG1pc3NpbmcgPT09IDAgJiYgZnVuYykge1xuXHRcdFx0XHRcdFx0YSA9IChcImNvbS5ncmVlbnNvY2suXCIgKyBucykuc3BsaXQoXCIuXCIpO1xuXHRcdFx0XHRcdFx0biA9IGEucG9wKCk7XG5cdFx0XHRcdFx0XHRjbCA9IF9uYW1lc3BhY2UoYS5qb2luKFwiLlwiKSlbbl0gPSB0aGlzLmdzQ2xhc3MgPSBmdW5jLmFwcGx5KGZ1bmMsIF9jbGFzc2VzKTtcblxuXHRcdFx0XHRcdFx0Ly9leHBvcnRzIHRvIG11bHRpcGxlIGVudmlyb25tZW50c1xuXHRcdFx0XHRcdFx0aWYgKGdsb2JhbCkge1xuXHRcdFx0XHRcdFx0XHRfZ2xvYmFsc1tuXSA9IGNsOyAvL3Byb3ZpZGVzIGEgd2F5IHRvIGF2b2lkIGdsb2JhbCBuYW1lc3BhY2UgcG9sbHV0aW9uLiBCeSBkZWZhdWx0LCB0aGUgbWFpbiBjbGFzc2VzIGxpa2UgVHdlZW5MaXRlLCBQb3dlcjEsIFN0cm9uZywgZXRjLiBhcmUgYWRkZWQgdG8gd2luZG93IHVubGVzcyBhIEdyZWVuU29ja0dsb2JhbHMgaXMgZGVmaW5lZC4gU28gaWYgeW91IHdhbnQgdG8gaGF2ZSB0aGluZ3MgYWRkZWQgdG8gYSBjdXN0b20gb2JqZWN0IGluc3RlYWQsIGp1c3QgZG8gc29tZXRoaW5nIGxpa2Ugd2luZG93LkdyZWVuU29ja0dsb2JhbHMgPSB7fSBiZWZvcmUgbG9hZGluZyBhbnkgR3JlZW5Tb2NrIGZpbGVzLiBZb3UgY2FuIGV2ZW4gc2V0IHVwIGFuIGFsaWFzIGxpa2Ugd2luZG93LkdyZWVuU29ja0dsb2JhbHMgPSB3aW5kb3dzLmdzID0ge30gc28gdGhhdCB5b3UgY2FuIGFjY2VzcyBldmVyeXRoaW5nIGxpa2UgZ3MuVHdlZW5MaXRlLiBBbHNvIHJlbWVtYmVyIHRoYXQgQUxMIGNsYXNzZXMgYXJlIGFkZGVkIHRvIHRoZSB3aW5kb3cuY29tLmdyZWVuc29jayBvYmplY3QgKGluIHRoZWlyIHJlc3BlY3RpdmUgcGFja2FnZXMsIGxpa2UgY29tLmdyZWVuc29jay5lYXNpbmcuUG93ZXIxLCBjb20uZ3JlZW5zb2NrLlR3ZWVuTGl0ZSwgZXRjLilcblx0XHRcdFx0XHRcdFx0aGFzTW9kdWxlID0gKHR5cGVvZihtb2R1bGUpICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKTtcblx0XHRcdFx0XHRcdFx0aWYgKCFoYXNNb2R1bGUgJiYgdHlwZW9mKGRlZmluZSkgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKXsgLy9BTURcblx0XHRcdFx0XHRcdFx0XHRkZWZpbmUoKHdpbmRvdy5HcmVlblNvY2tBTURQYXRoID8gd2luZG93LkdyZWVuU29ja0FNRFBhdGggKyBcIi9cIiA6IFwiXCIpICsgbnMuc3BsaXQoXCIuXCIpLnBvcCgpLCBbXSwgZnVuY3Rpb24oKSB7IHJldHVybiBjbDsgfSk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobnMgPT09IG1vZHVsZU5hbWUgJiYgaGFzTW9kdWxlKXsgLy9ub2RlXG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlLmV4cG9ydHMgPSBjbDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuc2MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5zY1tpXS5jaGVjaygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dGhpcy5jaGVjayh0cnVlKTtcblx0XHRcdH0sXG5cblx0XHRcdC8vdXNlZCB0byBjcmVhdGUgRGVmaW5pdGlvbiBpbnN0YW5jZXMgKHdoaWNoIGJhc2ljYWxseSByZWdpc3RlcnMgYSBjbGFzcyB0aGF0IGhhcyBkZXBlbmRlbmNpZXMpLlxuXHRcdFx0X2dzRGVmaW5lID0gd2luZG93Ll9nc0RlZmluZSA9IGZ1bmN0aW9uKG5zLCBkZXBlbmRlbmNpZXMsIGZ1bmMsIGdsb2JhbCkge1xuXHRcdFx0XHRyZXR1cm4gbmV3IERlZmluaXRpb24obnMsIGRlcGVuZGVuY2llcywgZnVuYywgZ2xvYmFsKTtcblx0XHRcdH0sXG5cblx0XHRcdC8vYSBxdWljayB3YXkgdG8gY3JlYXRlIGEgY2xhc3MgdGhhdCBkb2Vzbid0IGhhdmUgYW55IGRlcGVuZGVuY2llcy4gUmV0dXJucyB0aGUgY2xhc3MsIGJ1dCBmaXJzdCByZWdpc3RlcnMgaXQgaW4gdGhlIEdyZWVuU29jayBuYW1lc3BhY2Ugc28gdGhhdCBvdGhlciBjbGFzc2VzIGNhbiBncmFiIGl0IChvdGhlciBjbGFzc2VzIG1pZ2h0IGJlIGRlcGVuZGVudCBvbiB0aGUgY2xhc3MpLlxuXHRcdFx0X2NsYXNzID0gZ3MuX2NsYXNzID0gZnVuY3Rpb24obnMsIGZ1bmMsIGdsb2JhbCkge1xuXHRcdFx0XHRmdW5jID0gZnVuYyB8fCBmdW5jdGlvbigpIHt9O1xuXHRcdFx0XHRfZ3NEZWZpbmUobnMsIFtdLCBmdW5jdGlvbigpeyByZXR1cm4gZnVuYzsgfSwgZ2xvYmFsKTtcblx0XHRcdFx0cmV0dXJuIGZ1bmM7XG5cdFx0XHR9O1xuXG5cdFx0X2dzRGVmaW5lLmdsb2JhbHMgPSBfZ2xvYmFscztcblxuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBFYXNlXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0XHR2YXIgX2Jhc2VQYXJhbXMgPSBbMCwgMCwgMSwgMV0sXG5cdFx0XHRfYmxhbmtBcnJheSA9IFtdLFxuXHRcdFx0RWFzZSA9IF9jbGFzcyhcImVhc2luZy5FYXNlXCIsIGZ1bmN0aW9uKGZ1bmMsIGV4dHJhUGFyYW1zLCB0eXBlLCBwb3dlcikge1xuXHRcdFx0XHR0aGlzLl9mdW5jID0gZnVuYztcblx0XHRcdFx0dGhpcy5fdHlwZSA9IHR5cGUgfHwgMDtcblx0XHRcdFx0dGhpcy5fcG93ZXIgPSBwb3dlciB8fCAwO1xuXHRcdFx0XHR0aGlzLl9wYXJhbXMgPSBleHRyYVBhcmFtcyA/IF9iYXNlUGFyYW1zLmNvbmNhdChleHRyYVBhcmFtcykgOiBfYmFzZVBhcmFtcztcblx0XHRcdH0sIHRydWUpLFxuXHRcdFx0X2Vhc2VNYXAgPSBFYXNlLm1hcCA9IHt9LFxuXHRcdFx0X2Vhc2VSZWcgPSBFYXNlLnJlZ2lzdGVyID0gZnVuY3Rpb24oZWFzZSwgbmFtZXMsIHR5cGVzLCBjcmVhdGUpIHtcblx0XHRcdFx0dmFyIG5hID0gbmFtZXMuc3BsaXQoXCIsXCIpLFxuXHRcdFx0XHRcdGkgPSBuYS5sZW5ndGgsXG5cdFx0XHRcdFx0dGEgPSAodHlwZXMgfHwgXCJlYXNlSW4sZWFzZU91dCxlYXNlSW5PdXRcIikuc3BsaXQoXCIsXCIpLFxuXHRcdFx0XHRcdGUsIG5hbWUsIGosIHR5cGU7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdG5hbWUgPSBuYVtpXTtcblx0XHRcdFx0XHRlID0gY3JlYXRlID8gX2NsYXNzKFwiZWFzaW5nLlwiK25hbWUsIG51bGwsIHRydWUpIDogZ3MuZWFzaW5nW25hbWVdIHx8IHt9O1xuXHRcdFx0XHRcdGogPSB0YS5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taiA+IC0xKSB7XG5cdFx0XHRcdFx0XHR0eXBlID0gdGFbal07XG5cdFx0XHRcdFx0XHRfZWFzZU1hcFtuYW1lICsgXCIuXCIgKyB0eXBlXSA9IF9lYXNlTWFwW3R5cGUgKyBuYW1lXSA9IGVbdHlwZV0gPSBlYXNlLmdldFJhdGlvID8gZWFzZSA6IGVhc2VbdHlwZV0gfHwgbmV3IGVhc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRwID0gRWFzZS5wcm90b3R5cGU7XG5cdFx0cC5fY2FsY0VuZCA9IGZhbHNlO1xuXHRcdHAuZ2V0UmF0aW8gPSBmdW5jdGlvbihwKSB7XG5cdFx0XHRpZiAodGhpcy5fZnVuYykge1xuXHRcdFx0XHR0aGlzLl9wYXJhbXNbMF0gPSBwO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZnVuYy5hcHBseShudWxsLCB0aGlzLl9wYXJhbXMpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHQgPSB0aGlzLl90eXBlLFxuXHRcdFx0XHRwdyA9IHRoaXMuX3Bvd2VyLFxuXHRcdFx0XHRyID0gKHQgPT09IDEpID8gMSAtIHAgOiAodCA9PT0gMikgPyBwIDogKHAgPCAwLjUpID8gcCAqIDIgOiAoMSAtIHApICogMjtcblx0XHRcdGlmIChwdyA9PT0gMSkge1xuXHRcdFx0XHRyICo9IHI7XG5cdFx0XHR9IGVsc2UgaWYgKHB3ID09PSAyKSB7XG5cdFx0XHRcdHIgKj0gciAqIHI7XG5cdFx0XHR9IGVsc2UgaWYgKHB3ID09PSAzKSB7XG5cdFx0XHRcdHIgKj0gciAqIHIgKiByO1xuXHRcdFx0fSBlbHNlIGlmIChwdyA9PT0gNCkge1xuXHRcdFx0XHRyICo9IHIgKiByICogciAqIHI7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKHQgPT09IDEpID8gMSAtIHIgOiAodCA9PT0gMikgPyByIDogKHAgPCAwLjUpID8gciAvIDIgOiAxIC0gKHIgLyAyKTtcblx0XHR9O1xuXG5cdFx0Ly9jcmVhdGUgYWxsIHRoZSBzdGFuZGFyZCBlYXNlcyBsaWtlIExpbmVhciwgUXVhZCwgQ3ViaWMsIFF1YXJ0LCBRdWludCwgU3Ryb25nLCBQb3dlcjAsIFBvd2VyMSwgUG93ZXIyLCBQb3dlcjMsIGFuZCBQb3dlcjQgKGVhY2ggd2l0aCBlYXNlSW4sIGVhc2VPdXQsIGFuZCBlYXNlSW5PdXQpXG5cdFx0YSA9IFtcIkxpbmVhclwiLFwiUXVhZFwiLFwiQ3ViaWNcIixcIlF1YXJ0XCIsXCJRdWludCxTdHJvbmdcIl07XG5cdFx0aSA9IGEubGVuZ3RoO1xuXHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0cCA9IGFbaV0rXCIsUG93ZXJcIitpO1xuXHRcdFx0X2Vhc2VSZWcobmV3IEVhc2UobnVsbCxudWxsLDEsaSksIHAsIFwiZWFzZU91dFwiLCB0cnVlKTtcblx0XHRcdF9lYXNlUmVnKG5ldyBFYXNlKG51bGwsbnVsbCwyLGkpLCBwLCBcImVhc2VJblwiICsgKChpID09PSAwKSA/IFwiLGVhc2VOb25lXCIgOiBcIlwiKSk7XG5cdFx0XHRfZWFzZVJlZyhuZXcgRWFzZShudWxsLG51bGwsMyxpKSwgcCwgXCJlYXNlSW5PdXRcIik7XG5cdFx0fVxuXHRcdF9lYXNlTWFwLmxpbmVhciA9IGdzLmVhc2luZy5MaW5lYXIuZWFzZUluO1xuXHRcdF9lYXNlTWFwLnN3aW5nID0gZ3MuZWFzaW5nLlF1YWQuZWFzZUluT3V0OyAvL2ZvciBqUXVlcnkgZm9sa3NcblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRXZlbnREaXNwYXRjaGVyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0XHR2YXIgRXZlbnREaXNwYXRjaGVyID0gX2NsYXNzKFwiZXZlbnRzLkV2ZW50RGlzcGF0Y2hlclwiLCBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHRcdHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuXHRcdFx0dGhpcy5fZXZlbnRUYXJnZXQgPSB0YXJnZXQgfHwgdGhpcztcblx0XHR9KTtcblx0XHRwID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZTtcblxuXHRcdHAuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBzY29wZSwgdXNlUGFyYW0sIHByaW9yaXR5KSB7XG5cdFx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0XHR2YXIgbGlzdCA9IHRoaXMuX2xpc3RlbmVyc1t0eXBlXSxcblx0XHRcdFx0aW5kZXggPSAwLFxuXHRcdFx0XHRsaXN0ZW5lciwgaTtcblx0XHRcdGlmIChsaXN0ID09IG51bGwpIHtcblx0XHRcdFx0dGhpcy5fbGlzdGVuZXJzW3R5cGVdID0gbGlzdCA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0aSA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGxpc3RlbmVyID0gbGlzdFtpXTtcblx0XHRcdFx0aWYgKGxpc3RlbmVyLmMgPT09IGNhbGxiYWNrICYmIGxpc3RlbmVyLnMgPT09IHNjb3BlKSB7XG5cdFx0XHRcdFx0bGlzdC5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoaW5kZXggPT09IDAgJiYgbGlzdGVuZXIucHIgPCBwcmlvcml0eSkge1xuXHRcdFx0XHRcdGluZGV4ID0gaSArIDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxpc3Quc3BsaWNlKGluZGV4LCAwLCB7YzpjYWxsYmFjaywgczpzY29wZSwgdXA6dXNlUGFyYW0sIHByOnByaW9yaXR5fSk7XG5cdFx0XHRpZiAodGhpcyA9PT0gX3RpY2tlciAmJiAhX3RpY2tlckFjdGl2ZSkge1xuXHRcdFx0XHRfdGlja2VyLndha2UoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cC5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgY2FsbGJhY2spIHtcblx0XHRcdHZhciBsaXN0ID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLCBpO1xuXHRcdFx0aWYgKGxpc3QpIHtcblx0XHRcdFx0aSA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRpZiAobGlzdFtpXS5jID09PSBjYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0bGlzdC5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHAuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRcdHZhciBsaXN0ID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLFxuXHRcdFx0XHRpLCB0LCBsaXN0ZW5lcjtcblx0XHRcdGlmIChsaXN0KSB7XG5cdFx0XHRcdGkgPSBsaXN0Lmxlbmd0aDtcblx0XHRcdFx0dCA9IHRoaXMuX2V2ZW50VGFyZ2V0O1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRsaXN0ZW5lciA9IGxpc3RbaV07XG5cdFx0XHRcdFx0aWYgKGxpc3RlbmVyKSB7XG5cdFx0XHRcdFx0XHRpZiAobGlzdGVuZXIudXApIHtcblx0XHRcdFx0XHRcdFx0bGlzdGVuZXIuYy5jYWxsKGxpc3RlbmVyLnMgfHwgdCwge3R5cGU6dHlwZSwgdGFyZ2V0OnR9KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGxpc3RlbmVyLmMuY2FsbChsaXN0ZW5lci5zIHx8IHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFRpY2tlclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG4gXHRcdHZhciBfcmVxQW5pbUZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSxcblx0XHRcdF9jYW5jZWxBbmltRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUsXG5cdFx0XHRfZ2V0VGltZSA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge3JldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTt9LFxuXHRcdFx0X2xhc3RVcGRhdGUgPSBfZ2V0VGltZSgpO1xuXG5cdFx0Ly9ub3cgdHJ5IHRvIGRldGVybWluZSB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGFuZCBjYW5jZWxBbmltYXRpb25GcmFtZSBmdW5jdGlvbnMgYW5kIGlmIG5vbmUgYXJlIGZvdW5kLCB3ZSdsbCB1c2UgYSBzZXRUaW1lb3V0KCkvY2xlYXJUaW1lb3V0KCkgcG9seWZpbGwuXG5cdFx0YSA9IFtcIm1zXCIsXCJtb3pcIixcIndlYmtpdFwiLFwib1wiXTtcblx0XHRpID0gYS5sZW5ndGg7XG5cdFx0d2hpbGUgKC0taSA+IC0xICYmICFfcmVxQW5pbUZyYW1lKSB7XG5cdFx0XHRfcmVxQW5pbUZyYW1lID0gd2luZG93W2FbaV0gKyBcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcblx0XHRcdF9jYW5jZWxBbmltRnJhbWUgPSB3aW5kb3dbYVtpXSArIFwiQ2FuY2VsQW5pbWF0aW9uRnJhbWVcIl0gfHwgd2luZG93W2FbaV0gKyBcIkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcblx0XHR9XG5cblx0XHRfY2xhc3MoXCJUaWNrZXJcIiwgZnVuY3Rpb24oZnBzLCB1c2VSQUYpIHtcblx0XHRcdHZhciBfc2VsZiA9IHRoaXMsXG5cdFx0XHRcdF9zdGFydFRpbWUgPSBfZ2V0VGltZSgpLFxuXHRcdFx0XHRfdXNlUkFGID0gKHVzZVJBRiAhPT0gZmFsc2UgJiYgX3JlcUFuaW1GcmFtZSkgPyBcImF1dG9cIiA6IGZhbHNlLFxuXHRcdFx0XHRfbGFnVGhyZXNob2xkID0gNTAwLFxuXHRcdFx0XHRfYWRqdXN0ZWRMYWcgPSAzMyxcblx0XHRcdFx0X3RpY2tXb3JkID0gXCJ0aWNrXCIsIC8vaGVscHMgcmVkdWNlIGdjIGJ1cmRlblxuXHRcdFx0XHRfZnBzLCBfcmVxLCBfaWQsIF9nYXAsIF9uZXh0VGltZSxcblx0XHRcdFx0X3RpY2sgPSBmdW5jdGlvbihtYW51YWwpIHtcblx0XHRcdFx0XHR2YXIgZWxhcHNlZCA9IF9nZXRUaW1lKCkgLSBfbGFzdFVwZGF0ZSxcblx0XHRcdFx0XHRcdG92ZXJsYXAsIGRpc3BhdGNoO1xuXHRcdFx0XHRcdGlmIChlbGFwc2VkID4gX2xhZ1RocmVzaG9sZCkge1xuXHRcdFx0XHRcdFx0X3N0YXJ0VGltZSArPSBlbGFwc2VkIC0gX2FkanVzdGVkTGFnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRfbGFzdFVwZGF0ZSArPSBlbGFwc2VkO1xuXHRcdFx0XHRcdF9zZWxmLnRpbWUgPSAoX2xhc3RVcGRhdGUgLSBfc3RhcnRUaW1lKSAvIDEwMDA7XG5cdFx0XHRcdFx0b3ZlcmxhcCA9IF9zZWxmLnRpbWUgLSBfbmV4dFRpbWU7XG5cdFx0XHRcdFx0aWYgKCFfZnBzIHx8IG92ZXJsYXAgPiAwIHx8IG1hbnVhbCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0X3NlbGYuZnJhbWUrKztcblx0XHRcdFx0XHRcdF9uZXh0VGltZSArPSBvdmVybGFwICsgKG92ZXJsYXAgPj0gX2dhcCA/IDAuMDA0IDogX2dhcCAtIG92ZXJsYXApO1xuXHRcdFx0XHRcdFx0ZGlzcGF0Y2ggPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobWFudWFsICE9PSB0cnVlKSB7IC8vbWFrZSBzdXJlIHRoZSByZXF1ZXN0IGlzIG1hZGUgYmVmb3JlIHdlIGRpc3BhdGNoIHRoZSBcInRpY2tcIiBldmVudCBzbyB0aGF0IHRpbWluZyBpcyBtYWludGFpbmVkLiBPdGhlcndpc2UsIGlmIHByb2Nlc3NpbmcgdGhlIFwidGlja1wiIHJlcXVpcmVzIGEgYnVuY2ggb2YgdGltZSAobGlrZSAxNW1zKSBhbmQgd2UncmUgdXNpbmcgYSBzZXRUaW1lb3V0KCkgdGhhdCdzIGJhc2VkIG9uIDE2LjdtcywgaXQnZCB0ZWNobmljYWxseSB0YWtlIDMxLjdtcyBiZXR3ZWVuIGZyYW1lcyBvdGhlcndpc2UuXG5cdFx0XHRcdFx0XHRfaWQgPSBfcmVxKF90aWNrKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGRpc3BhdGNoKSB7XG5cdFx0XHRcdFx0XHRfc2VsZi5kaXNwYXRjaEV2ZW50KF90aWNrV29yZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRFdmVudERpc3BhdGNoZXIuY2FsbChfc2VsZik7XG5cdFx0XHRfc2VsZi50aW1lID0gX3NlbGYuZnJhbWUgPSAwO1xuXHRcdFx0X3NlbGYudGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRfdGljayh0cnVlKTtcblx0XHRcdH07XG5cblx0XHRcdF9zZWxmLmxhZ1Ntb290aGluZyA9IGZ1bmN0aW9uKHRocmVzaG9sZCwgYWRqdXN0ZWRMYWcpIHtcblx0XHRcdFx0X2xhZ1RocmVzaG9sZCA9IHRocmVzaG9sZCB8fCAoMSAvIF90aW55TnVtKTsgLy96ZXJvIHNob3VsZCBiZSBpbnRlcnByZXRlZCBhcyBiYXNpY2FsbHkgdW5saW1pdGVkXG5cdFx0XHRcdF9hZGp1c3RlZExhZyA9IE1hdGgubWluKGFkanVzdGVkTGFnLCBfbGFnVGhyZXNob2xkLCAwKTtcblx0XHRcdH07XG5cblx0XHRcdF9zZWxmLnNsZWVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChfaWQgPT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIV91c2VSQUYgfHwgIV9jYW5jZWxBbmltRnJhbWUpIHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoX2lkKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfY2FuY2VsQW5pbUZyYW1lKF9pZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3JlcSA9IF9lbXB0eUZ1bmM7XG5cdFx0XHRcdF9pZCA9IG51bGw7XG5cdFx0XHRcdGlmIChfc2VsZiA9PT0gX3RpY2tlcikge1xuXHRcdFx0XHRcdF90aWNrZXJBY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0X3NlbGYud2FrZSA9IGZ1bmN0aW9uKHNlYW1sZXNzKSB7XG5cdFx0XHRcdGlmIChfaWQgIT09IG51bGwpIHtcblx0XHRcdFx0XHRfc2VsZi5zbGVlcCgpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHNlYW1sZXNzKSB7XG5cdFx0XHRcdFx0X3N0YXJ0VGltZSArPSAtX2xhc3RVcGRhdGUgKyAoX2xhc3RVcGRhdGUgPSBfZ2V0VGltZSgpKTtcblx0XHRcdFx0fSBlbHNlIGlmIChfc2VsZi5mcmFtZSA+IDEwKSB7IC8vZG9uJ3QgdHJpZ2dlciBsYWdTbW9vdGhpbmcgaWYgd2UncmUganVzdCB3YWtpbmcgdXAsIGFuZCBtYWtlIHN1cmUgdGhhdCBhdCBsZWFzdCAxMCBmcmFtZXMgaGF2ZSBlbGFwc2VkIGJlY2F1c2Ugb2YgdGhlIGlPUyBidWcgdGhhdCB3ZSB3b3JrIGFyb3VuZCBiZWxvdyB3aXRoIHRoZSAxLjUtc2Vjb25kIHNldFRpbW91dCgpLlxuXHRcdFx0XHRcdF9sYXN0VXBkYXRlID0gX2dldFRpbWUoKSAtIF9sYWdUaHJlc2hvbGQgKyA1O1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9yZXEgPSAoX2ZwcyA9PT0gMCkgPyBfZW1wdHlGdW5jIDogKCFfdXNlUkFGIHx8ICFfcmVxQW5pbUZyYW1lKSA/IGZ1bmN0aW9uKGYpIHsgcmV0dXJuIHNldFRpbWVvdXQoZiwgKChfbmV4dFRpbWUgLSBfc2VsZi50aW1lKSAqIDEwMDAgKyAxKSB8IDApOyB9IDogX3JlcUFuaW1GcmFtZTtcblx0XHRcdFx0aWYgKF9zZWxmID09PSBfdGlja2VyKSB7XG5cdFx0XHRcdFx0X3RpY2tlckFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3RpY2soMik7XG5cdFx0XHR9O1xuXG5cdFx0XHRfc2VsZi5mcHMgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gX2Zwcztcblx0XHRcdFx0fVxuXHRcdFx0XHRfZnBzID0gdmFsdWU7XG5cdFx0XHRcdF9nYXAgPSAxIC8gKF9mcHMgfHwgNjApO1xuXHRcdFx0XHRfbmV4dFRpbWUgPSB0aGlzLnRpbWUgKyBfZ2FwO1xuXHRcdFx0XHRfc2VsZi53YWtlKCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRfc2VsZi51c2VSQUYgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gX3VzZVJBRjtcblx0XHRcdFx0fVxuXHRcdFx0XHRfc2VsZi5zbGVlcCgpO1xuXHRcdFx0XHRfdXNlUkFGID0gdmFsdWU7XG5cdFx0XHRcdF9zZWxmLmZwcyhfZnBzKTtcblx0XHRcdH07XG5cdFx0XHRfc2VsZi5mcHMoZnBzKTtcblxuXHRcdFx0Ly9hIGJ1ZyBpbiBpT1MgNiBTYWZhcmkgb2NjYXNpb25hbGx5IHByZXZlbnRzIHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZnJvbSB3b3JraW5nIGluaXRpYWxseSwgc28gd2UgdXNlIGEgMS41LXNlY29uZCB0aW1lb3V0IHRoYXQgYXV0b21hdGljYWxseSBmYWxscyBiYWNrIHRvIHNldFRpbWVvdXQoKSBpZiBpdCBzZW5zZXMgdGhpcyBjb25kaXRpb24uXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoX3VzZVJBRiA9PT0gXCJhdXRvXCIgJiYgX3NlbGYuZnJhbWUgPCA1ICYmIGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSAhPT0gXCJoaWRkZW5cIikge1xuXHRcdFx0XHRcdF9zZWxmLnVzZVJBRihmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIDE1MDApO1xuXHRcdH0pO1xuXG5cdFx0cCA9IGdzLlRpY2tlci5wcm90b3R5cGUgPSBuZXcgZ3MuZXZlbnRzLkV2ZW50RGlzcGF0Y2hlcigpO1xuXHRcdHAuY29uc3RydWN0b3IgPSBncy5UaWNrZXI7XG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEFuaW1hdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIEFuaW1hdGlvbiA9IF9jbGFzcyhcImNvcmUuQW5pbWF0aW9uXCIsIGZ1bmN0aW9uKGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHRcdHRoaXMudmFycyA9IHZhcnMgPSB2YXJzIHx8IHt9O1xuXHRcdFx0XHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX3RvdGFsRHVyYXRpb24gPSBkdXJhdGlvbiB8fCAwO1xuXHRcdFx0XHR0aGlzLl9kZWxheSA9IE51bWJlcih2YXJzLmRlbGF5KSB8fCAwO1xuXHRcdFx0XHR0aGlzLl90aW1lU2NhbGUgPSAxO1xuXHRcdFx0XHR0aGlzLl9hY3RpdmUgPSAodmFycy5pbW1lZGlhdGVSZW5kZXIgPT09IHRydWUpO1xuXHRcdFx0XHR0aGlzLmRhdGEgPSB2YXJzLmRhdGE7XG5cdFx0XHRcdHRoaXMuX3JldmVyc2VkID0gKHZhcnMucmV2ZXJzZWQgPT09IHRydWUpO1xuXG5cdFx0XHRcdGlmICghX3Jvb3RUaW1lbGluZSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHsgLy9zb21lIGJyb3dzZXJzIChsaWtlIGlPUyA2IFNhZmFyaSkgc2h1dCBkb3duIEphdmFTY3JpcHQgZXhlY3V0aW9uIHdoZW4gdGhlIHRhYiBpcyBkaXNhYmxlZCBhbmQgdGhleSBbb2NjYXNpb25hbGx5XSBuZWdsZWN0IHRvIHN0YXJ0IHVwIHJlcXVlc3RBbmltYXRpb25GcmFtZSBhZ2FpbiB3aGVuIHJldHVybmluZyAtIHRoaXMgY29kZSBlbnN1cmVzIHRoYXQgdGhlIGVuZ2luZSBzdGFydHMgdXAgYWdhaW4gcHJvcGVybHkuXG5cdFx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgdGwgPSB0aGlzLnZhcnMudXNlRnJhbWVzID8gX3Jvb3RGcmFtZXNUaW1lbGluZSA6IF9yb290VGltZWxpbmU7XG5cdFx0XHRcdHRsLmFkZCh0aGlzLCB0bC5fdGltZSk7XG5cblx0XHRcdFx0aWYgKHRoaXMudmFycy5wYXVzZWQpIHtcblx0XHRcdFx0XHR0aGlzLnBhdXNlZCh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRfdGlja2VyID0gQW5pbWF0aW9uLnRpY2tlciA9IG5ldyBncy5UaWNrZXIoKTtcblx0XHRwID0gQW5pbWF0aW9uLnByb3RvdHlwZTtcblx0XHRwLl9kaXJ0eSA9IHAuX2djID0gcC5faW5pdHRlZCA9IHAuX3BhdXNlZCA9IGZhbHNlO1xuXHRcdHAuX3RvdGFsVGltZSA9IHAuX3RpbWUgPSAwO1xuXHRcdHAuX3Jhd1ByZXZUaW1lID0gLTE7XG5cdFx0cC5fbmV4dCA9IHAuX2xhc3QgPSBwLl9vblVwZGF0ZSA9IHAuX3RpbWVsaW5lID0gcC50aW1lbGluZSA9IG51bGw7XG5cdFx0cC5fcGF1c2VkID0gZmFsc2U7XG5cblxuXHRcdC8vc29tZSBicm93c2VycyAobGlrZSBpT1MpIG9jY2FzaW9uYWxseSBkcm9wIHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZXZlbnQgd2hlbiB0aGUgdXNlciBzd2l0Y2hlcyB0byBhIGRpZmZlcmVudCB0YWIgYW5kIHRoZW4gY29tZXMgYmFjayBhZ2Fpbiwgc28gd2UgdXNlIGEgMi1zZWNvbmQgc2V0VGltZW91dCgpIHRvIHNlbnNlIGlmL3doZW4gdGhhdCBjb25kaXRpb24gb2NjdXJzIGFuZCB0aGVuIHdha2UoKSB0aGUgdGlja2VyLlxuXHRcdHZhciBfY2hlY2tUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChfdGlja2VyQWN0aXZlICYmIF9nZXRUaW1lKCkgLSBfbGFzdFVwZGF0ZSA+IDIwMDApIHtcblx0XHRcdFx0XHRfdGlja2VyLndha2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZXRUaW1lb3V0KF9jaGVja1RpbWVvdXQsIDIwMDApO1xuXHRcdFx0fTtcblx0XHRfY2hlY2tUaW1lb3V0KCk7XG5cblxuXHRcdHAucGxheSA9IGZ1bmN0aW9uKGZyb20sIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRpZiAoZnJvbSAhPSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuc2Vlayhmcm9tLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZChmYWxzZSkucGF1c2VkKGZhbHNlKTtcblx0XHR9O1xuXG5cdFx0cC5wYXVzZSA9IGZ1bmN0aW9uKGF0VGltZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmIChhdFRpbWUgIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnNlZWsoYXRUaW1lLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXVzZWQodHJ1ZSk7XG5cdFx0fTtcblxuXHRcdHAucmVzdW1lID0gZnVuY3Rpb24oZnJvbSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmIChmcm9tICE9IG51bGwpIHtcblx0XHRcdFx0dGhpcy5zZWVrKGZyb20sIHN1cHByZXNzRXZlbnRzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnBhdXNlZChmYWxzZSk7XG5cdFx0fTtcblxuXHRcdHAuc2VlayA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy50b3RhbFRpbWUoTnVtYmVyKHRpbWUpLCBzdXBwcmVzc0V2ZW50cyAhPT0gZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJlc3RhcnQgPSBmdW5jdGlvbihpbmNsdWRlRGVsYXksIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZChmYWxzZSkucGF1c2VkKGZhbHNlKS50b3RhbFRpbWUoaW5jbHVkZURlbGF5ID8gLXRoaXMuX2RlbGF5IDogMCwgKHN1cHByZXNzRXZlbnRzICE9PSBmYWxzZSksIHRydWUpO1xuXHRcdH07XG5cblx0XHRwLnJldmVyc2UgPSBmdW5jdGlvbihmcm9tLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0aWYgKGZyb20gIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnNlZWsoKGZyb20gfHwgdGhpcy50b3RhbER1cmF0aW9uKCkpLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZCh0cnVlKS5wYXVzZWQoZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJlbmRlciA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuXHRcdFx0Ly9zdHViIC0gd2Ugb3ZlcnJpZGUgdGhpcyBtZXRob2QgaW4gc3ViY2xhc3Nlcy5cblx0XHR9O1xuXG5cdFx0cC5pbnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLl90aW1lID0gdGhpcy5fdG90YWxUaW1lID0gMDtcblx0XHRcdHRoaXMuX2luaXR0ZWQgPSB0aGlzLl9nYyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAtMTtcblx0XHRcdGlmICh0aGlzLl9nYyB8fCAhdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHR0aGlzLl9lbmFibGVkKHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuaXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0bCA9IHRoaXMuX3RpbWVsaW5lLCAvL3RoZSAyIHJvb3QgdGltZWxpbmVzIHdvbid0IGhhdmUgYSBfdGltZWxpbmU7IHRoZXkncmUgYWx3YXlzIGFjdGl2ZS5cblx0XHRcdFx0c3RhcnRUaW1lID0gdGhpcy5fc3RhcnRUaW1lLFxuXHRcdFx0XHRyYXdUaW1lO1xuXHRcdFx0cmV0dXJuICghdGwgfHwgKCF0aGlzLl9nYyAmJiAhdGhpcy5fcGF1c2VkICYmIHRsLmlzQWN0aXZlKCkgJiYgKHJhd1RpbWUgPSB0bC5yYXdUaW1lKCkpID49IHN0YXJ0VGltZSAmJiByYXdUaW1lIDwgc3RhcnRUaW1lICsgdGhpcy50b3RhbER1cmF0aW9uKCkgLyB0aGlzLl90aW1lU2NhbGUpKTtcblx0XHR9O1xuXG5cdFx0cC5fZW5hYmxlZCA9IGZ1bmN0aW9uIChlbmFibGVkLCBpZ25vcmVUaW1lbGluZSkge1xuXHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlKSB7XG5cdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZ2MgPSAhZW5hYmxlZDtcblx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRoaXMuaXNBY3RpdmUoKTtcblx0XHRcdGlmIChpZ25vcmVUaW1lbGluZSAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRpZiAoZW5hYmxlZCAmJiAhdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWVsaW5lLmFkZCh0aGlzLCB0aGlzLl9zdGFydFRpbWUgLSB0aGlzLl9kZWxheSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIWVuYWJsZWQgJiYgdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWVsaW5lLl9yZW1vdmUodGhpcywgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24odmFycywgdGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLmtpbGwgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXQpIHtcblx0XHRcdHRoaXMuX2tpbGwodmFycywgdGFyZ2V0KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl91bmNhY2hlID0gZnVuY3Rpb24oaW5jbHVkZVNlbGYpIHtcblx0XHRcdHZhciB0d2VlbiA9IGluY2x1ZGVTZWxmID8gdGhpcyA6IHRoaXMudGltZWxpbmU7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0dHdlZW4uX2RpcnR5ID0gdHJ1ZTtcblx0XHRcdFx0dHdlZW4gPSB0d2Vlbi50aW1lbGluZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl9zd2FwU2VsZkluUGFyYW1zID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cdFx0XHR2YXIgaSA9IHBhcmFtcy5sZW5ndGgsXG5cdFx0XHRcdGNvcHkgPSBwYXJhbXMuY29uY2F0KCk7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0aWYgKHBhcmFtc1tpXSA9PT0gXCJ7c2VsZn1cIikge1xuXHRcdFx0XHRcdGNvcHlbaV0gPSB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY29weTtcblx0XHR9O1xuXG5cdFx0cC5fY2FsbGJhY2sgPSBmdW5jdGlvbih0eXBlKSB7XG5cdFx0XHR2YXIgdiA9IHRoaXMudmFycztcblx0XHRcdHZbdHlwZV0uYXBwbHkodlt0eXBlICsgXCJTY29wZVwiXSB8fCB2LmNhbGxiYWNrU2NvcGUgfHwgdGhpcywgdlt0eXBlICsgXCJQYXJhbXNcIl0gfHwgX2JsYW5rQXJyYXkpO1xuXHRcdH07XG5cbi8vLS0tLUFuaW1hdGlvbiBnZXR0ZXJzL3NldHRlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdHAuZXZlbnRDYWxsYmFjayA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlKSB7XG5cdFx0XHRpZiAoKHR5cGUgfHwgXCJcIikuc3Vic3RyKDAsMikgPT09IFwib25cIikge1xuXHRcdFx0XHR2YXIgdiA9IHRoaXMudmFycztcblx0XHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdlt0eXBlXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGRlbGV0ZSB2W3R5cGVdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZbdHlwZV0gPSBjYWxsYmFjaztcblx0XHRcdFx0XHR2W3R5cGUgKyBcIlBhcmFtc1wiXSA9IChfaXNBcnJheShwYXJhbXMpICYmIHBhcmFtcy5qb2luKFwiXCIpLmluZGV4T2YoXCJ7c2VsZn1cIikgIT09IC0xKSA/IHRoaXMuX3N3YXBTZWxmSW5QYXJhbXMocGFyYW1zKSA6IHBhcmFtcztcblx0XHRcdFx0XHR2W3R5cGUgKyBcIlNjb3BlXCJdID0gc2NvcGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGUgPT09IFwib25VcGRhdGVcIikge1xuXHRcdFx0XHRcdHRoaXMuX29uVXBkYXRlID0gY2FsbGJhY2s7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmRlbGF5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZGVsYXk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIHtcblx0XHRcdFx0dGhpcy5zdGFydFRpbWUoIHRoaXMuX3N0YXJ0VGltZSArIHZhbHVlIC0gdGhpcy5fZGVsYXkgKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2RlbGF5ID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5kdXJhdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0dGhpcy5fZGlydHkgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZHVyYXRpb24gPSB0aGlzLl90b3RhbER1cmF0aW9uID0gdmFsdWU7XG5cdFx0XHR0aGlzLl91bmNhY2hlKHRydWUpOyAvL3RydWUgaW4gY2FzZSBpdCdzIGEgVHdlZW5NYXggb3IgVGltZWxpbmVNYXggdGhhdCBoYXMgYSByZXBlYXQgLSB3ZSdsbCBuZWVkIHRvIHJlZnJlc2ggdGhlIHRvdGFsRHVyYXRpb24uXG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIGlmICh0aGlzLl90aW1lID4gMCkgaWYgKHRoaXMuX3RpbWUgPCB0aGlzLl9kdXJhdGlvbikgaWYgKHZhbHVlICE9PSAwKSB7XG5cdFx0XHRcdHRoaXMudG90YWxUaW1lKHRoaXMuX3RvdGFsVGltZSAqICh2YWx1ZSAvIHRoaXMuX2R1cmF0aW9uKSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC50b3RhbER1cmF0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXMuX2RpcnR5ID0gZmFsc2U7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RvdGFsRHVyYXRpb24gOiB0aGlzLmR1cmF0aW9uKHZhbHVlKTtcblx0XHR9O1xuXG5cdFx0cC50aW1lID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RpbWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fZGlydHkpIHtcblx0XHRcdFx0dGhpcy50b3RhbER1cmF0aW9uKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy50b3RhbFRpbWUoKHZhbHVlID4gdGhpcy5fZHVyYXRpb24pID8gdGhpcy5fZHVyYXRpb24gOiB2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnRvdGFsVGltZSA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCB1bmNhcHBlZCkge1xuXHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlKSB7XG5cdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl90b3RhbFRpbWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUpIHtcblx0XHRcdFx0aWYgKHRpbWUgPCAwICYmICF1bmNhcHBlZCkge1xuXHRcdFx0XHRcdHRpbWUgKz0gdGhpcy50b3RhbER1cmF0aW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2RpcnR5KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRvdGFsRHVyYXRpb24oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIHRvdGFsRHVyYXRpb24gPSB0aGlzLl90b3RhbER1cmF0aW9uLFxuXHRcdFx0XHRcdFx0dGwgPSB0aGlzLl90aW1lbGluZTtcblx0XHRcdFx0XHRpZiAodGltZSA+IHRvdGFsRHVyYXRpb24gJiYgIXVuY2FwcGVkKSB7XG5cdFx0XHRcdFx0XHR0aW1lID0gdG90YWxEdXJhdGlvbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRUaW1lID0gKHRoaXMuX3BhdXNlZCA/IHRoaXMuX3BhdXNlVGltZSA6IHRsLl90aW1lKSAtICgoIXRoaXMuX3JldmVyc2VkID8gdGltZSA6IHRvdGFsRHVyYXRpb24gLSB0aW1lKSAvIHRoaXMuX3RpbWVTY2FsZSk7XG5cdFx0XHRcdFx0aWYgKCF0bC5fZGlydHkpIHsgLy9mb3IgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnQuIElmIHRoZSBwYXJlbnQncyBjYWNoZSBpcyBhbHJlYWR5IGRpcnR5LCBpdCBhbHJlYWR5IHRvb2sgY2FyZSBvZiBtYXJraW5nIHRoZSBhbmNlc3RvcnMgYXMgZGlydHkgdG9vLCBzbyBza2lwIHRoZSBmdW5jdGlvbiBjYWxsIGhlcmUuXG5cdFx0XHRcdFx0XHR0aGlzLl91bmNhY2hlKGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9pbiBjYXNlIGFueSBvZiB0aGUgYW5jZXN0b3IgdGltZWxpbmVzIGhhZCBjb21wbGV0ZWQgYnV0IHNob3VsZCBub3cgYmUgZW5hYmxlZCwgd2Ugc2hvdWxkIHJlc2V0IHRoZWlyIHRvdGFsVGltZSgpIHdoaWNoIHdpbGwgYWxzbyBlbnN1cmUgdGhhdCB0aGV5J3JlIGxpbmVkIHVwIHByb3Blcmx5IGFuZCBlbmFibGVkLiBTa2lwIGZvciBhbmltYXRpb25zIHRoYXQgYXJlIG9uIHRoZSByb290ICh3YXN0ZWZ1bCkuIEV4YW1wbGU6IGEgVGltZWxpbmVMaXRlLmV4cG9ydFJvb3QoKSBpcyBwZXJmb3JtZWQgd2hlbiB0aGVyZSdzIGEgcGF1c2VkIHR3ZWVuIG9uIHRoZSByb290LCB0aGUgZXhwb3J0IHdpbGwgbm90IGNvbXBsZXRlIHVudGlsIHRoYXQgdHdlZW4gaXMgdW5wYXVzZWQsIGJ1dCBpbWFnaW5lIGEgY2hpbGQgZ2V0cyByZXN0YXJ0ZWQgbGF0ZXIsIGFmdGVyIGFsbCBbdW5wYXVzZWRdIHR3ZWVucyBoYXZlIGNvbXBsZXRlZC4gVGhlIHN0YXJ0VGltZSBvZiB0aGF0IGNoaWxkIHdvdWxkIGdldCBwdXNoZWQgb3V0LCBidXQgb25lIG9mIHRoZSBhbmNlc3RvcnMgbWF5IGhhdmUgY29tcGxldGVkLlxuXHRcdFx0XHRcdGlmICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdHdoaWxlICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHRsLl90aW1lbGluZS5fdGltZSAhPT0gKHRsLl9zdGFydFRpbWUgKyB0bC5fdG90YWxUaW1lKSAvIHRsLl90aW1lU2NhbGUpIHtcblx0XHRcdFx0XHRcdFx0XHR0bC50b3RhbFRpbWUodGwuX3RvdGFsVGltZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dGwgPSB0bC5fdGltZWxpbmU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl9nYykge1xuXHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl90b3RhbFRpbWUgIT09IHRpbWUgfHwgdGhpcy5fZHVyYXRpb24gPT09IDApIHtcblx0XHRcdFx0XHRpZiAoX2xhenlUd2VlbnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZmFsc2UpO1xuXHRcdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHsgLy9pbiBjYXNlIHJlbmRlcmluZyBjYXVzZWQgYW55IHR3ZWVucyB0byBsYXp5LWluaXQsIHdlIHNob3VsZCByZW5kZXIgdGhlbSBiZWNhdXNlIHR5cGljYWxseSB3aGVuIHNvbWVvbmUgY2FsbHMgc2VlaygpIG9yIHRpbWUoKSBvciBwcm9ncmVzcygpLCB0aGV5IGV4cGVjdCBhbiBpbW1lZGlhdGUgcmVuZGVyLlxuXHRcdFx0XHRcdFx0X2xhenlSZW5kZXIoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnByb2dyZXNzID0gcC50b3RhbFByb2dyZXNzID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHR2YXIgZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uKCk7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IChkdXJhdGlvbiA/IHRoaXMuX3RpbWUgLyBkdXJhdGlvbiA6IHRoaXMucmF0aW8pIDogdGhpcy50b3RhbFRpbWUoZHVyYXRpb24gKiB2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnN0YXJ0VGltZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3N0YXJ0VGltZTtcblx0XHRcdH1cblx0XHRcdGlmICh2YWx1ZSAhPT0gdGhpcy5fc3RhcnRUaW1lKSB7XG5cdFx0XHRcdHRoaXMuX3N0YXJ0VGltZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAodGhpcy50aW1lbGluZSkgaWYgKHRoaXMudGltZWxpbmUuX3NvcnRDaGlsZHJlbikge1xuXHRcdFx0XHRcdHRoaXMudGltZWxpbmUuYWRkKHRoaXMsIHZhbHVlIC0gdGhpcy5fZGVsYXkpOyAvL2Vuc3VyZXMgdGhhdCBhbnkgbmVjZXNzYXJ5IHJlLXNlcXVlbmNpbmcgb2YgQW5pbWF0aW9ucyBpbiB0aGUgdGltZWxpbmUgb2NjdXJzIHRvIG1ha2Ugc3VyZSB0aGUgcmVuZGVyaW5nIG9yZGVyIGlzIGNvcnJlY3QuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmVuZFRpbWUgPSBmdW5jdGlvbihpbmNsdWRlUmVwZWF0cykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0YXJ0VGltZSArICgoaW5jbHVkZVJlcGVhdHMgIT0gZmFsc2UpID8gdGhpcy50b3RhbER1cmF0aW9uKCkgOiB0aGlzLmR1cmF0aW9uKCkpIC8gdGhpcy5fdGltZVNjYWxlO1xuXHRcdH07XG5cblx0XHRwLnRpbWVTY2FsZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RpbWVTY2FsZTtcblx0XHRcdH1cblx0XHRcdHZhbHVlID0gdmFsdWUgfHwgX3RpbnlOdW07IC8vY2FuJ3QgYWxsb3cgemVybyBiZWNhdXNlIGl0J2xsIHRocm93IHRoZSBtYXRoIG9mZlxuXHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lICYmIHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKSB7XG5cdFx0XHRcdHZhciBwYXVzZVRpbWUgPSB0aGlzLl9wYXVzZVRpbWUsXG5cdFx0XHRcdFx0dCA9IChwYXVzZVRpbWUgfHwgcGF1c2VUaW1lID09PSAwKSA/IHBhdXNlVGltZSA6IHRoaXMuX3RpbWVsaW5lLnRvdGFsVGltZSgpO1xuXHRcdFx0XHR0aGlzLl9zdGFydFRpbWUgPSB0IC0gKCh0IC0gdGhpcy5fc3RhcnRUaW1lKSAqIHRoaXMuX3RpbWVTY2FsZSAvIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3RpbWVTY2FsZSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuY2FjaGUoZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJldmVyc2VkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcmV2ZXJzZWQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAodmFsdWUgIT0gdGhpcy5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0dGhpcy5fcmV2ZXJzZWQgPSB2YWx1ZTtcblx0XHRcdFx0dGhpcy50b3RhbFRpbWUoKCh0aGlzLl90aW1lbGluZSAmJiAhdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpID8gdGhpcy50b3RhbER1cmF0aW9uKCkgLSB0aGlzLl90b3RhbFRpbWUgOiB0aGlzLl90b3RhbFRpbWUpLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnBhdXNlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3BhdXNlZDtcblx0XHRcdH1cblx0XHRcdHZhciB0bCA9IHRoaXMuX3RpbWVsaW5lLFxuXHRcdFx0XHRyYXcsIGVsYXBzZWQ7XG5cdFx0XHRpZiAodmFsdWUgIT0gdGhpcy5fcGF1c2VkKSBpZiAodGwpIHtcblx0XHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlICYmICF2YWx1ZSkge1xuXHRcdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJhdyA9IHRsLnJhd1RpbWUoKTtcblx0XHRcdFx0ZWxhcHNlZCA9IHJhdyAtIHRoaXMuX3BhdXNlVGltZTtcblx0XHRcdFx0aWYgKCF2YWx1ZSAmJiB0bC5zbW9vdGhDaGlsZFRpbWluZykge1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0VGltZSArPSBlbGFwc2VkO1xuXHRcdFx0XHRcdHRoaXMuX3VuY2FjaGUoZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3BhdXNlVGltZSA9IHZhbHVlID8gcmF3IDogbnVsbDtcblx0XHRcdFx0dGhpcy5fcGF1c2VkID0gdmFsdWU7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRoaXMuaXNBY3RpdmUoKTtcblx0XHRcdFx0aWYgKCF2YWx1ZSAmJiBlbGFwc2VkICE9PSAwICYmIHRoaXMuX2luaXR0ZWQgJiYgdGhpcy5kdXJhdGlvbigpKSB7XG5cdFx0XHRcdFx0cmF3ID0gdGwuc21vb3RoQ2hpbGRUaW1pbmcgPyB0aGlzLl90b3RhbFRpbWUgOiAocmF3IC0gdGhpcy5fc3RhcnRUaW1lKSAvIHRoaXMuX3RpbWVTY2FsZTtcblx0XHRcdFx0XHR0aGlzLnJlbmRlcihyYXcsIChyYXcgPT09IHRoaXMuX3RvdGFsVGltZSksIHRydWUpOyAvL2luIGNhc2UgdGhlIHRhcmdldCdzIHByb3BlcnRpZXMgY2hhbmdlZCB2aWEgc29tZSBvdGhlciB0d2VlbiBvciBtYW51YWwgdXBkYXRlIGJ5IHRoZSB1c2VyLCB3ZSBzaG91bGQgZm9yY2UgYSByZW5kZXIuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9nYyAmJiAhdmFsdWUpIHtcblx0XHRcdFx0dGhpcy5fZW5hYmxlZCh0cnVlLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBTaW1wbGVUaW1lbGluZVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIFNpbXBsZVRpbWVsaW5lID0gX2NsYXNzKFwiY29yZS5TaW1wbGVUaW1lbGluZVwiLCBmdW5jdGlvbih2YXJzKSB7XG5cdFx0XHRBbmltYXRpb24uY2FsbCh0aGlzLCAwLCB2YXJzKTtcblx0XHRcdHRoaXMuYXV0b1JlbW92ZUNoaWxkcmVuID0gdGhpcy5zbW9vdGhDaGlsZFRpbWluZyA9IHRydWU7XG5cdFx0fSk7XG5cblx0XHRwID0gU2ltcGxlVGltZWxpbmUucHJvdG90eXBlID0gbmV3IEFuaW1hdGlvbigpO1xuXHRcdHAuY29uc3RydWN0b3IgPSBTaW1wbGVUaW1lbGluZTtcblx0XHRwLmtpbGwoKS5fZ2MgPSBmYWxzZTtcblx0XHRwLl9maXJzdCA9IHAuX2xhc3QgPSBwLl9yZWNlbnQgPSBudWxsO1xuXHRcdHAuX3NvcnRDaGlsZHJlbiA9IGZhbHNlO1xuXG5cdFx0cC5hZGQgPSBwLmluc2VydCA9IGZ1bmN0aW9uKGNoaWxkLCBwb3NpdGlvbiwgYWxpZ24sIHN0YWdnZXIpIHtcblx0XHRcdHZhciBwcmV2VHdlZW4sIHN0O1xuXHRcdFx0Y2hpbGQuX3N0YXJ0VGltZSA9IE51bWJlcihwb3NpdGlvbiB8fCAwKSArIGNoaWxkLl9kZWxheTtcblx0XHRcdGlmIChjaGlsZC5fcGF1c2VkKSBpZiAodGhpcyAhPT0gY2hpbGQuX3RpbWVsaW5lKSB7IC8vd2Ugb25seSBhZGp1c3QgdGhlIF9wYXVzZVRpbWUgaWYgaXQgd2Fzbid0IGluIHRoaXMgdGltZWxpbmUgYWxyZWFkeS4gUmVtZW1iZXIsIHNvbWV0aW1lcyBhIHR3ZWVuIHdpbGwgYmUgaW5zZXJ0ZWQgYWdhaW4gaW50byB0aGUgc2FtZSB0aW1lbGluZSB3aGVuIGl0cyBzdGFydFRpbWUgaXMgY2hhbmdlZCBzbyB0aGF0IHRoZSB0d2VlbnMgaW4gdGhlIFRpbWVsaW5lTGl0ZS9NYXggYXJlIHJlLW9yZGVyZWQgcHJvcGVybHkgaW4gdGhlIGxpbmtlZCBsaXN0IChzbyBldmVyeXRoaW5nIHJlbmRlcnMgaW4gdGhlIHByb3BlciBvcmRlcikuXG5cdFx0XHRcdGNoaWxkLl9wYXVzZVRpbWUgPSBjaGlsZC5fc3RhcnRUaW1lICsgKCh0aGlzLnJhd1RpbWUoKSAtIGNoaWxkLl9zdGFydFRpbWUpIC8gY2hpbGQuX3RpbWVTY2FsZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2hpbGQudGltZWxpbmUpIHtcblx0XHRcdFx0Y2hpbGQudGltZWxpbmUuX3JlbW92ZShjaGlsZCwgdHJ1ZSk7IC8vcmVtb3ZlcyBmcm9tIGV4aXN0aW5nIHRpbWVsaW5lIHNvIHRoYXQgaXQgY2FuIGJlIHByb3Blcmx5IGFkZGVkIHRvIHRoaXMgb25lLlxuXHRcdFx0fVxuXHRcdFx0Y2hpbGQudGltZWxpbmUgPSBjaGlsZC5fdGltZWxpbmUgPSB0aGlzO1xuXHRcdFx0aWYgKGNoaWxkLl9nYykge1xuXHRcdFx0XHRjaGlsZC5fZW5hYmxlZCh0cnVlLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdHByZXZUd2VlbiA9IHRoaXMuX2xhc3Q7XG5cdFx0XHRpZiAodGhpcy5fc29ydENoaWxkcmVuKSB7XG5cdFx0XHRcdHN0ID0gY2hpbGQuX3N0YXJ0VGltZTtcblx0XHRcdFx0d2hpbGUgKHByZXZUd2VlbiAmJiBwcmV2VHdlZW4uX3N0YXJ0VGltZSA+IHN0KSB7XG5cdFx0XHRcdFx0cHJldlR3ZWVuID0gcHJldlR3ZWVuLl9wcmV2O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAocHJldlR3ZWVuKSB7XG5cdFx0XHRcdGNoaWxkLl9uZXh0ID0gcHJldlR3ZWVuLl9uZXh0O1xuXHRcdFx0XHRwcmV2VHdlZW4uX25leHQgPSBjaGlsZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNoaWxkLl9uZXh0ID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHRcdHRoaXMuX2ZpcnN0ID0gY2hpbGQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2hpbGQuX25leHQpIHtcblx0XHRcdFx0Y2hpbGQuX25leHQuX3ByZXYgPSBjaGlsZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX2xhc3QgPSBjaGlsZDtcblx0XHRcdH1cblx0XHRcdGNoaWxkLl9wcmV2ID0gcHJldlR3ZWVuO1xuXHRcdFx0dGhpcy5fcmVjZW50ID0gY2hpbGQ7XG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUpIHtcblx0XHRcdFx0dGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl9yZW1vdmUgPSBmdW5jdGlvbih0d2Vlbiwgc2tpcERpc2FibGUpIHtcblx0XHRcdGlmICh0d2Vlbi50aW1lbGluZSA9PT0gdGhpcykge1xuXHRcdFx0XHRpZiAoIXNraXBEaXNhYmxlKSB7XG5cdFx0XHRcdFx0dHdlZW4uX2VuYWJsZWQoZmFsc2UsIHRydWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHR3ZWVuLl9wcmV2KSB7XG5cdFx0XHRcdFx0dHdlZW4uX3ByZXYuX25leHQgPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9maXJzdCA9PT0gdHdlZW4pIHtcblx0XHRcdFx0XHR0aGlzLl9maXJzdCA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0d2Vlbi5fbmV4dCkge1xuXHRcdFx0XHRcdHR3ZWVuLl9uZXh0Ll9wcmV2ID0gdHdlZW4uX3ByZXY7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbGFzdCA9PT0gdHdlZW4pIHtcblx0XHRcdFx0XHR0aGlzLl9sYXN0ID0gdHdlZW4uX3ByZXY7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHdlZW4uX25leHQgPSB0d2Vlbi5fcHJldiA9IHR3ZWVuLnRpbWVsaW5lID0gbnVsbDtcblx0XHRcdFx0aWYgKHR3ZWVuID09PSB0aGlzLl9yZWNlbnQpIHtcblx0XHRcdFx0XHR0aGlzLl9yZWNlbnQgPSB0aGlzLl9sYXN0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lKSB7XG5cdFx0XHRcdFx0dGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAucmVuZGVyID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG5cdFx0XHR2YXIgdHdlZW4gPSB0aGlzLl9maXJzdCxcblx0XHRcdFx0bmV4dDtcblx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSB0aGlzLl9yYXdQcmV2VGltZSA9IHRpbWU7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0bmV4dCA9IHR3ZWVuLl9uZXh0OyAvL3JlY29yZCBpdCBoZXJlIGJlY2F1c2UgdGhlIHZhbHVlIGNvdWxkIGNoYW5nZSBhZnRlciByZW5kZXJpbmcuLi5cblx0XHRcdFx0aWYgKHR3ZWVuLl9hY3RpdmUgfHwgKHRpbWUgPj0gdHdlZW4uX3N0YXJ0VGltZSAmJiAhdHdlZW4uX3BhdXNlZCkpIHtcblx0XHRcdFx0XHRpZiAoIXR3ZWVuLl9yZXZlcnNlZCkge1xuXHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIoKCghdHdlZW4uX2RpcnR5KSA/IHR3ZWVuLl90b3RhbER1cmF0aW9uIDogdHdlZW4udG90YWxEdXJhdGlvbigpKSAtICgodGltZSAtIHR3ZWVuLl9zdGFydFRpbWUpICogdHdlZW4uX3RpbWVTY2FsZSksIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHR3ZWVuID0gbmV4dDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cC5yYXdUaW1lID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHtcblx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fdG90YWxUaW1lO1xuXHRcdH07XG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBUd2VlbkxpdGVcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHRcdHZhciBUd2VlbkxpdGUgPSBfY2xhc3MoXCJUd2VlbkxpdGVcIiwgZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0XHRBbmltYXRpb24uY2FsbCh0aGlzLCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0XHRcdHRoaXMucmVuZGVyID0gVHdlZW5MaXRlLnByb3RvdHlwZS5yZW5kZXI7IC8vc3BlZWQgb3B0aW1pemF0aW9uIChhdm9pZCBwcm90b3R5cGUgbG9va3VwIG9uIHRoaXMgXCJob3RcIiBtZXRob2QpXG5cblx0XHRcdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7XG5cdFx0XHRcdFx0dGhyb3cgXCJDYW5ub3QgdHdlZW4gYSBudWxsIHRhcmdldC5cIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMudGFyZ2V0ID0gdGFyZ2V0ID0gKHR5cGVvZih0YXJnZXQpICE9PSBcInN0cmluZ1wiKSA/IHRhcmdldCA6IFR3ZWVuTGl0ZS5zZWxlY3Rvcih0YXJnZXQpIHx8IHRhcmdldDtcblxuXHRcdFx0XHR2YXIgaXNTZWxlY3RvciA9ICh0YXJnZXQuanF1ZXJ5IHx8ICh0YXJnZXQubGVuZ3RoICYmIHRhcmdldCAhPT0gd2luZG93ICYmIHRhcmdldFswXSAmJiAodGFyZ2V0WzBdID09PSB3aW5kb3cgfHwgKHRhcmdldFswXS5ub2RlVHlwZSAmJiB0YXJnZXRbMF0uc3R5bGUgJiYgIXRhcmdldC5ub2RlVHlwZSkpKSksXG5cdFx0XHRcdFx0b3ZlcndyaXRlID0gdGhpcy52YXJzLm92ZXJ3cml0ZSxcblx0XHRcdFx0XHRpLCB0YXJnLCB0YXJnZXRzO1xuXG5cdFx0XHRcdHRoaXMuX292ZXJ3cml0ZSA9IG92ZXJ3cml0ZSA9IChvdmVyd3JpdGUgPT0gbnVsbCkgPyBfb3ZlcndyaXRlTG9va3VwW1R3ZWVuTGl0ZS5kZWZhdWx0T3ZlcndyaXRlXSA6ICh0eXBlb2Yob3ZlcndyaXRlKSA9PT0gXCJudW1iZXJcIikgPyBvdmVyd3JpdGUgPj4gMCA6IF9vdmVyd3JpdGVMb29rdXBbb3ZlcndyaXRlXTtcblxuXHRcdFx0XHRpZiAoKGlzU2VsZWN0b3IgfHwgdGFyZ2V0IGluc3RhbmNlb2YgQXJyYXkgfHwgKHRhcmdldC5wdXNoICYmIF9pc0FycmF5KHRhcmdldCkpKSAmJiB0eXBlb2YodGFyZ2V0WzBdKSAhPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdHRoaXMuX3RhcmdldHMgPSB0YXJnZXRzID0gX3NsaWNlKHRhcmdldCk7ICAvL2Rvbid0IHVzZSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0YXJnZXQsIDApIGJlY2F1c2UgdGhhdCBkb2Vzbid0IHdvcmsgaW4gSUU4IHdpdGggYSBOb2RlTGlzdCB0aGF0J3MgcmV0dXJuZWQgYnkgcXVlcnlTZWxlY3RvckFsbCgpXG5cdFx0XHRcdFx0dGhpcy5fcHJvcExvb2t1cCA9IFtdO1xuXHRcdFx0XHRcdHRoaXMuX3NpYmxpbmdzID0gW107XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHRhcmdldHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHRhcmcgPSB0YXJnZXRzW2ldO1xuXHRcdFx0XHRcdFx0aWYgKCF0YXJnKSB7XG5cdFx0XHRcdFx0XHRcdHRhcmdldHMuc3BsaWNlKGktLSwgMSk7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YodGFyZykgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRcdFx0dGFyZyA9IHRhcmdldHNbaS0tXSA9IFR3ZWVuTGl0ZS5zZWxlY3Rvcih0YXJnKTsgLy9pbiBjYXNlIGl0J3MgYW4gYXJyYXkgb2Ygc3RyaW5nc1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mKHRhcmcpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0cy5zcGxpY2UoaSsxLCAxKTsgLy90byBhdm9pZCBhbiBlbmRsZXNzIGxvb3AgKGNhbid0IGltYWdpbmUgd2h5IHRoZSBzZWxlY3RvciB3b3VsZCByZXR1cm4gYSBzdHJpbmcsIGJ1dCBqdXN0IGluIGNhc2UpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHRhcmcubGVuZ3RoICYmIHRhcmcgIT09IHdpbmRvdyAmJiB0YXJnWzBdICYmICh0YXJnWzBdID09PSB3aW5kb3cgfHwgKHRhcmdbMF0ubm9kZVR5cGUgJiYgdGFyZ1swXS5zdHlsZSAmJiAhdGFyZy5ub2RlVHlwZSkpKSB7IC8vaW4gY2FzZSB0aGUgdXNlciBpcyBwYXNzaW5nIGluIGFuIGFycmF5IG9mIHNlbGVjdG9yIG9iamVjdHMgKGxpa2UgalF1ZXJ5IG9iamVjdHMpLCB3ZSBuZWVkIHRvIGNoZWNrIG9uZSBtb3JlIGxldmVsIGFuZCBwdWxsIHRoaW5ncyBvdXQgaWYgbmVjZXNzYXJ5LiBBbHNvIG5vdGUgdGhhdCA8c2VsZWN0PiBlbGVtZW50cyBwYXNzIGFsbCB0aGUgY3JpdGVyaWEgcmVnYXJkaW5nIGxlbmd0aCBhbmQgdGhlIGZpcnN0IGNoaWxkIGhhdmluZyBzdHlsZSwgc28gd2UgbXVzdCBhbHNvIGNoZWNrIHRvIGVuc3VyZSB0aGUgdGFyZ2V0IGlzbid0IGFuIEhUTUwgbm9kZSBpdHNlbGYuXG5cdFx0XHRcdFx0XHRcdHRhcmdldHMuc3BsaWNlKGktLSwgMSk7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3RhcmdldHMgPSB0YXJnZXRzID0gdGFyZ2V0cy5jb25jYXQoX3NsaWNlKHRhcmcpKTtcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLl9zaWJsaW5nc1tpXSA9IF9yZWdpc3Rlcih0YXJnLCB0aGlzLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHRpZiAob3ZlcndyaXRlID09PSAxKSBpZiAodGhpcy5fc2libGluZ3NbaV0ubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRfYXBwbHlPdmVyd3JpdGUodGFyZywgdGhpcywgbnVsbCwgMSwgdGhpcy5fc2libGluZ3NbaV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3Byb3BMb29rdXAgPSB7fTtcblx0XHRcdFx0XHR0aGlzLl9zaWJsaW5ncyA9IF9yZWdpc3Rlcih0YXJnZXQsIHRoaXMsIGZhbHNlKTtcblx0XHRcdFx0XHRpZiAob3ZlcndyaXRlID09PSAxKSBpZiAodGhpcy5fc2libGluZ3MubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0X2FwcGx5T3ZlcndyaXRlKHRhcmdldCwgdGhpcywgbnVsbCwgMSwgdGhpcy5fc2libGluZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlciB8fCAoZHVyYXRpb24gPT09IDAgJiYgdGhpcy5fZGVsYXkgPT09IDAgJiYgdGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlciAhPT0gZmFsc2UpKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IC1fdGlueU51bTsgLy9mb3JjZXMgYSByZW5kZXIgd2l0aG91dCBoYXZpbmcgdG8gc2V0IHRoZSByZW5kZXIoKSBcImZvcmNlXCIgcGFyYW1ldGVyIHRvIHRydWUgYmVjYXVzZSB3ZSB3YW50IHRvIGFsbG93IGxhenlpbmcgYnkgZGVmYXVsdCAodXNpbmcgdGhlIFwiZm9yY2VcIiBwYXJhbWV0ZXIgYWx3YXlzIGZvcmNlcyBhbiBpbW1lZGlhdGUgZnVsbCByZW5kZXIpXG5cdFx0XHRcdFx0dGhpcy5yZW5kZXIoLXRoaXMuX2RlbGF5KTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdHJ1ZSksXG5cdFx0XHRfaXNTZWxlY3RvciA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0cmV0dXJuICh2ICYmIHYubGVuZ3RoICYmIHYgIT09IHdpbmRvdyAmJiB2WzBdICYmICh2WzBdID09PSB3aW5kb3cgfHwgKHZbMF0ubm9kZVR5cGUgJiYgdlswXS5zdHlsZSAmJiAhdi5ub2RlVHlwZSkpKTsgLy93ZSBjYW5ub3QgY2hlY2sgXCJub2RlVHlwZVwiIGlmIHRoZSB0YXJnZXQgaXMgd2luZG93IGZyb20gd2l0aGluIGFuIGlmcmFtZSwgb3RoZXJ3aXNlIGl0IHdpbGwgdHJpZ2dlciBhIHNlY3VyaXR5IGVycm9yIGluIHNvbWUgYnJvd3NlcnMgbGlrZSBGaXJlZm94LlxuXHRcdFx0fSxcblx0XHRcdF9hdXRvQ1NTID0gZnVuY3Rpb24odmFycywgdGFyZ2V0KSB7XG5cdFx0XHRcdHZhciBjc3MgPSB7fSxcblx0XHRcdFx0XHRwO1xuXHRcdFx0XHRmb3IgKHAgaW4gdmFycykge1xuXHRcdFx0XHRcdGlmICghX3Jlc2VydmVkUHJvcHNbcF0gJiYgKCEocCBpbiB0YXJnZXQpIHx8IHAgPT09IFwidHJhbnNmb3JtXCIgfHwgcCA9PT0gXCJ4XCIgfHwgcCA9PT0gXCJ5XCIgfHwgcCA9PT0gXCJ3aWR0aFwiIHx8IHAgPT09IFwiaGVpZ2h0XCIgfHwgcCA9PT0gXCJjbGFzc05hbWVcIiB8fCBwID09PSBcImJvcmRlclwiKSAmJiAoIV9wbHVnaW5zW3BdIHx8IChfcGx1Z2luc1twXSAmJiBfcGx1Z2luc1twXS5fYXV0b0NTUykpKSB7IC8vbm90ZTogPGltZz4gZWxlbWVudHMgY29udGFpbiByZWFkLW9ubHkgXCJ4XCIgYW5kIFwieVwiIHByb3BlcnRpZXMuIFdlIHNob3VsZCBhbHNvIHByaW9yaXRpemUgZWRpdGluZyBjc3Mgd2lkdGgvaGVpZ2h0IHJhdGhlciB0aGFuIHRoZSBlbGVtZW50J3MgcHJvcGVydGllcy5cblx0XHRcdFx0XHRcdGNzc1twXSA9IHZhcnNbcF07XG5cdFx0XHRcdFx0XHRkZWxldGUgdmFyc1twXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFycy5jc3MgPSBjc3M7XG5cdFx0XHR9O1xuXG5cdFx0cCA9IFR3ZWVuTGl0ZS5wcm90b3R5cGUgPSBuZXcgQW5pbWF0aW9uKCk7XG5cdFx0cC5jb25zdHJ1Y3RvciA9IFR3ZWVuTGl0ZTtcblx0XHRwLmtpbGwoKS5fZ2MgPSBmYWxzZTtcblxuLy8tLS0tVHdlZW5MaXRlIGRlZmF1bHRzLCBvdmVyd3JpdGUgbWFuYWdlbWVudCwgYW5kIHJvb3QgdXBkYXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRwLnJhdGlvID0gMDtcblx0XHRwLl9maXJzdFBUID0gcC5fdGFyZ2V0cyA9IHAuX292ZXJ3cml0dGVuUHJvcHMgPSBwLl9zdGFydEF0ID0gbnVsbDtcblx0XHRwLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkID0gcC5fbGF6eSA9IGZhbHNlO1xuXG5cdFx0VHdlZW5MaXRlLnZlcnNpb24gPSBcIjEuMTguMlwiO1xuXHRcdFR3ZWVuTGl0ZS5kZWZhdWx0RWFzZSA9IHAuX2Vhc2UgPSBuZXcgRWFzZShudWxsLCBudWxsLCAxLCAxKTtcblx0XHRUd2VlbkxpdGUuZGVmYXVsdE92ZXJ3cml0ZSA9IFwiYXV0b1wiO1xuXHRcdFR3ZWVuTGl0ZS50aWNrZXIgPSBfdGlja2VyO1xuXHRcdFR3ZWVuTGl0ZS5hdXRvU2xlZXAgPSAxMjA7XG5cdFx0VHdlZW5MaXRlLmxhZ1Ntb290aGluZyA9IGZ1bmN0aW9uKHRocmVzaG9sZCwgYWRqdXN0ZWRMYWcpIHtcblx0XHRcdF90aWNrZXIubGFnU21vb3RoaW5nKHRocmVzaG9sZCwgYWRqdXN0ZWRMYWcpO1xuXHRcdH07XG5cblx0XHRUd2VlbkxpdGUuc2VsZWN0b3IgPSB3aW5kb3cuJCB8fCB3aW5kb3cualF1ZXJ5IHx8IGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBzZWxlY3RvciA9IHdpbmRvdy4kIHx8IHdpbmRvdy5qUXVlcnk7XG5cdFx0XHRpZiAoc2VsZWN0b3IpIHtcblx0XHRcdFx0VHdlZW5MaXRlLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5cdFx0XHRcdHJldHVybiBzZWxlY3RvcihlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAodHlwZW9mKGRvY3VtZW50KSA9PT0gXCJ1bmRlZmluZWRcIikgPyBlIDogKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGUpIDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoKGUuY2hhckF0KDApID09PSBcIiNcIikgPyBlLnN1YnN0cigxKSA6IGUpKTtcblx0XHR9O1xuXG5cdFx0dmFyIF9sYXp5VHdlZW5zID0gW10sXG5cdFx0XHRfbGF6eUxvb2t1cCA9IHt9LFxuXHRcdFx0X251bWJlcnNFeHAgPSAvKD86KC18LT18XFwrPSk/XFxkKlxcLj9cXGQqKD86ZVtcXC0rXT9cXGQrKT8pWzAtOV0vaWcsXG5cdFx0XHQvL19ub25OdW1iZXJzRXhwID0gLyg/OihbXFwtK10oPyEoXFxkfD0pKSl8W15cXGRcXC0rPWVdfChlKD8hW1xcLStdW1xcZF0pKSkrL2lnLFxuXHRcdFx0X3NldFJhdGlvID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHR2YXIgcHQgPSB0aGlzLl9maXJzdFBULFxuXHRcdFx0XHRcdG1pbiA9IDAuMDAwMDAxLFxuXHRcdFx0XHRcdHZhbDtcblx0XHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdFx0dmFsID0gIXB0LmJsb2IgPyBwdC5jICogdiArIHB0LnMgOiB2ID8gdGhpcy5qb2luKFwiXCIpIDogdGhpcy5zdGFydDtcblx0XHRcdFx0XHRpZiAocHQucikge1xuXHRcdFx0XHRcdFx0dmFsID0gTWF0aC5yb3VuZCh2YWwpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodmFsIDwgbWluKSBpZiAodmFsID4gLW1pbikgeyAvL3ByZXZlbnRzIGlzc3VlcyB3aXRoIGNvbnZlcnRpbmcgdmVyeSBzbWFsbCBudW1iZXJzIHRvIHN0cmluZ3MgaW4gdGhlIGJyb3dzZXJcblx0XHRcdFx0XHRcdHZhbCA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghcHQuZikge1xuXHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHZhbDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0LmZwKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdKHB0LmZwLCB2YWwpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdKHZhbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQvL2NvbXBhcmVzIHR3byBzdHJpbmdzIChzdGFydC9lbmQpLCBmaW5kcyB0aGUgbnVtYmVycyB0aGF0IGFyZSBkaWZmZXJlbnQgYW5kIHNwaXRzIGJhY2sgYW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSB3aG9sZSB2YWx1ZSBidXQgd2l0aCB0aGUgY2hhbmdpbmcgdmFsdWVzIGlzb2xhdGVkIGFzIGVsZW1lbnRzLiBGb3IgZXhhbXBsZSwgXCJyZ2IoMCwwLDApXCIgYW5kIFwicmdiKDEwMCw1MCwwKVwiIHdvdWxkIGJlY29tZSBbXCJyZ2IoXCIsIDAsIFwiLFwiLCA1MCwgXCIsMClcIl0uIE5vdGljZSBpdCBtZXJnZXMgdGhlIHBhcnRzIHRoYXQgYXJlIGlkZW50aWNhbCAocGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uKS4gVGhlIGFycmF5IGFsc28gaGFzIGEgbGlua2VkIGxpc3Qgb2YgUHJvcFR3ZWVucyBhdHRhY2hlZCBzdGFydGluZyB3aXRoIF9maXJzdFBUIHRoYXQgY29udGFpbiB0aGUgdHdlZW5pbmcgZGF0YSAodCwgcCwgcywgYywgZiwgZXRjLikuIEl0IGFsc28gc3RvcmVzIHRoZSBzdGFydGluZyB2YWx1ZSBhcyBhIFwic3RhcnRcIiBwcm9wZXJ0eSBzbyB0aGF0IHdlIGNhbiByZXZlcnQgdG8gaXQgaWYvd2hlbiBuZWNlc3NhcnksIGxpa2Ugd2hlbiBhIHR3ZWVuIHJld2luZHMgZnVsbHkuIElmIHRoZSBxdWFudGl0eSBvZiBudW1iZXJzIGRpZmZlcnMgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCwgaXQgd2lsbCBhbHdheXMgcHJpb3JpdGl6ZSB0aGUgZW5kIHZhbHVlKHMpLiBUaGUgcHQgcGFyYW1ldGVyIGlzIG9wdGlvbmFsIC0gaXQncyBmb3IgYSBQcm9wVHdlZW4gdGhhdCB3aWxsIGJlIGFwcGVuZGVkIHRvIHRoZSBlbmQgb2YgdGhlIGxpbmtlZCBsaXN0IGFuZCBpcyB0eXBpY2FsbHkgZm9yIGFjdHVhbGx5IHNldHRpbmcgdGhlIHZhbHVlIGFmdGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgaGF2ZSBiZWVuIHVwZGF0ZWQgKHdpdGggYXJyYXkuam9pbihcIlwiKSkuXG5cdFx0XHRfYmxvYkRpZiA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIGZpbHRlciwgcHQpIHtcblx0XHRcdFx0dmFyIGEgPSBbc3RhcnQsIGVuZF0sXG5cdFx0XHRcdFx0Y2hhckluZGV4ID0gMCxcblx0XHRcdFx0XHRzID0gXCJcIixcblx0XHRcdFx0XHRjb2xvciA9IDAsXG5cdFx0XHRcdFx0c3RhcnROdW1zLCBlbmROdW1zLCBudW0sIGksIGwsIG5vbk51bWJlcnMsIGN1cnJlbnROdW07XG5cdFx0XHRcdGEuc3RhcnQgPSBzdGFydDtcblx0XHRcdFx0aWYgKGZpbHRlcikge1xuXHRcdFx0XHRcdGZpbHRlcihhKTsgLy9wYXNzIGFuIGFycmF5IHdpdGggdGhlIHN0YXJ0aW5nIGFuZCBlbmRpbmcgdmFsdWVzIGFuZCBsZXQgdGhlIGZpbHRlciBkbyB3aGF0ZXZlciBpdCBuZWVkcyB0byB0aGUgdmFsdWVzLlxuXHRcdFx0XHRcdHN0YXJ0ID0gYVswXTtcblx0XHRcdFx0XHRlbmQgPSBhWzFdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGEubGVuZ3RoID0gMDtcblx0XHRcdFx0c3RhcnROdW1zID0gc3RhcnQubWF0Y2goX251bWJlcnNFeHApIHx8IFtdO1xuXHRcdFx0XHRlbmROdW1zID0gZW5kLm1hdGNoKF9udW1iZXJzRXhwKSB8fCBbXTtcblx0XHRcdFx0aWYgKHB0KSB7XG5cdFx0XHRcdFx0cHQuX25leHQgPSBudWxsO1xuXHRcdFx0XHRcdHB0LmJsb2IgPSAxO1xuXHRcdFx0XHRcdGEuX2ZpcnN0UFQgPSBwdDsgLy9hcHBseSBsYXN0IGluIHRoZSBsaW5rZWQgbGlzdCAod2hpY2ggbWVhbnMgaW5zZXJ0aW5nIGl0IGZpcnN0KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGwgPSBlbmROdW1zLmxlbmd0aDtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdGN1cnJlbnROdW0gPSBlbmROdW1zW2ldO1xuXHRcdFx0XHRcdG5vbk51bWJlcnMgPSBlbmQuc3Vic3RyKGNoYXJJbmRleCwgZW5kLmluZGV4T2YoY3VycmVudE51bSwgY2hhckluZGV4KS1jaGFySW5kZXgpO1xuXHRcdFx0XHRcdHMgKz0gKG5vbk51bWJlcnMgfHwgIWkpID8gbm9uTnVtYmVycyA6IFwiLFwiOyAvL25vdGU6IFNWRyBzcGVjIGFsbG93cyBvbWlzc2lvbiBvZiBjb21tYS9zcGFjZSB3aGVuIGEgbmVnYXRpdmUgc2lnbiBpcyB3ZWRnZWQgYmV0d2VlbiB0d28gbnVtYmVycywgbGlrZSAyLjUtNS4zIGluc3RlYWQgb2YgMi41LC01LjMgYnV0IHdoZW4gdHdlZW5pbmcsIHRoZSBuZWdhdGl2ZSB2YWx1ZSBtYXkgc3dpdGNoIHRvIHBvc2l0aXZlLCBzbyB3ZSBpbnNlcnQgdGhlIGNvbW1hIGp1c3QgaW4gY2FzZS5cblx0XHRcdFx0XHRjaGFySW5kZXggKz0gbm9uTnVtYmVycy5sZW5ndGg7XG5cdFx0XHRcdFx0aWYgKGNvbG9yKSB7IC8vc2Vuc2UgcmdiYSgpIHZhbHVlcyBhbmQgcm91bmQgdGhlbS5cblx0XHRcdFx0XHRcdGNvbG9yID0gKGNvbG9yICsgMSkgJSA1O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAobm9uTnVtYmVycy5zdWJzdHIoLTUpID09PSBcInJnYmEoXCIpIHtcblx0XHRcdFx0XHRcdGNvbG9yID0gMTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnROdW0gPT09IHN0YXJ0TnVtc1tpXSB8fCBzdGFydE51bXMubGVuZ3RoIDw9IGkpIHtcblx0XHRcdFx0XHRcdHMgKz0gY3VycmVudE51bTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKHMpIHtcblx0XHRcdFx0XHRcdFx0YS5wdXNoKHMpO1xuXHRcdFx0XHRcdFx0XHRzID0gXCJcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG51bSA9IHBhcnNlRmxvYXQoc3RhcnROdW1zW2ldKTtcblx0XHRcdFx0XHRcdGEucHVzaChudW0pO1xuXHRcdFx0XHRcdFx0YS5fZmlyc3RQVCA9IHtfbmV4dDogYS5fZmlyc3RQVCwgdDphLCBwOiBhLmxlbmd0aC0xLCBzOm51bSwgYzooKGN1cnJlbnROdW0uY2hhckF0KDEpID09PSBcIj1cIikgPyBwYXJzZUludChjdXJyZW50TnVtLmNoYXJBdCgwKSArIFwiMVwiLCAxMCkgKiBwYXJzZUZsb2F0KGN1cnJlbnROdW0uc3Vic3RyKDIpKSA6IChwYXJzZUZsb2F0KGN1cnJlbnROdW0pIC0gbnVtKSkgfHwgMCwgZjowLCByOihjb2xvciAmJiBjb2xvciA8IDQpfTtcblx0XHRcdFx0XHRcdC8vbm90ZTogd2UgZG9uJ3Qgc2V0IF9wcmV2IGJlY2F1c2Ugd2UnbGwgbmV2ZXIgbmVlZCB0byByZW1vdmUgaW5kaXZpZHVhbCBQcm9wVHdlZW5zIGZyb20gdGhpcyBsaXN0LlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjaGFySW5kZXggKz0gY3VycmVudE51bS5sZW5ndGg7XG5cdFx0XHRcdH1cblx0XHRcdFx0cyArPSBlbmQuc3Vic3RyKGNoYXJJbmRleCk7XG5cdFx0XHRcdGlmIChzKSB7XG5cdFx0XHRcdFx0YS5wdXNoKHMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGEuc2V0UmF0aW8gPSBfc2V0UmF0aW87XG5cdFx0XHRcdHJldHVybiBhO1xuXHRcdFx0fSxcblx0XHRcdC8vbm90ZTogXCJmdW5jUGFyYW1cIiBpcyBvbmx5IG5lY2Vzc2FyeSBmb3IgZnVuY3Rpb24tYmFzZWQgZ2V0dGVycy9zZXR0ZXJzIHRoYXQgcmVxdWlyZSBhbiBleHRyYSBwYXJhbWV0ZXIgbGlrZSBnZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiKSBhbmQgc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgdmFsdWUpLiBJbiB0aGlzIGV4YW1wbGUsIGZ1bmNQYXJhbSB3b3VsZCBiZSBcIndpZHRoXCIuIFVzZWQgYnkgQXR0clBsdWdpbiBmb3IgZXhhbXBsZS5cblx0XHRcdF9hZGRQcm9wVHdlZW4gPSBmdW5jdGlvbih0YXJnZXQsIHByb3AsIHN0YXJ0LCBlbmQsIG92ZXJ3cml0ZVByb3AsIHJvdW5kLCBmdW5jUGFyYW0sIHN0cmluZ0ZpbHRlcikge1xuXHRcdFx0XHR2YXIgcyA9IChzdGFydCA9PT0gXCJnZXRcIikgPyB0YXJnZXRbcHJvcF0gOiBzdGFydCxcblx0XHRcdFx0XHR0eXBlID0gdHlwZW9mKHRhcmdldFtwcm9wXSksXG5cdFx0XHRcdFx0aXNSZWxhdGl2ZSA9ICh0eXBlb2YoZW5kKSA9PT0gXCJzdHJpbmdcIiAmJiBlbmQuY2hhckF0KDEpID09PSBcIj1cIiksXG5cdFx0XHRcdFx0cHQgPSB7dDp0YXJnZXQsIHA6cHJvcCwgczpzLCBmOih0eXBlID09PSBcImZ1bmN0aW9uXCIpLCBwZzowLCBuOm92ZXJ3cml0ZVByb3AgfHwgcHJvcCwgcjpyb3VuZCwgcHI6MCwgYzppc1JlbGF0aXZlID8gcGFyc2VJbnQoZW5kLmNoYXJBdCgwKSArIFwiMVwiLCAxMCkgKiBwYXJzZUZsb2F0KGVuZC5zdWJzdHIoMikpIDogKHBhcnNlRmxvYXQoZW5kKSAtIHMpIHx8IDB9LFxuXHRcdFx0XHRcdGJsb2IsIGdldHRlck5hbWU7XG5cdFx0XHRcdGlmICh0eXBlICE9PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIiAmJiBzdGFydCA9PT0gXCJnZXRcIikge1xuXHRcdFx0XHRcdFx0Z2V0dGVyTmFtZSA9ICgocHJvcC5pbmRleE9mKFwic2V0XCIpIHx8IHR5cGVvZih0YXJnZXRbXCJnZXRcIiArIHByb3Auc3Vic3RyKDMpXSkgIT09IFwiZnVuY3Rpb25cIikgPyBwcm9wIDogXCJnZXRcIiArIHByb3Auc3Vic3RyKDMpKTtcblx0XHRcdFx0XHRcdHB0LnMgPSBzID0gZnVuY1BhcmFtID8gdGFyZ2V0W2dldHRlck5hbWVdKGZ1bmNQYXJhbSkgOiB0YXJnZXRbZ2V0dGVyTmFtZV0oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHR5cGVvZihzKSA9PT0gXCJzdHJpbmdcIiAmJiAoZnVuY1BhcmFtIHx8IGlzTmFOKHMpKSkge1xuXHRcdFx0XHRcdFx0Ly9hIGJsb2IgKHN0cmluZyB0aGF0IGhhcyBtdWx0aXBsZSBudW1iZXJzIGluIGl0KVxuXHRcdFx0XHRcdFx0cHQuZnAgPSBmdW5jUGFyYW07XG5cdFx0XHRcdFx0XHRibG9iID0gX2Jsb2JEaWYocywgZW5kLCBzdHJpbmdGaWx0ZXIgfHwgVHdlZW5MaXRlLmRlZmF1bHRTdHJpbmdGaWx0ZXIsIHB0KTtcblx0XHRcdFx0XHRcdHB0ID0ge3Q6YmxvYiwgcDpcInNldFJhdGlvXCIsIHM6MCwgYzoxLCBmOjIsIHBnOjAsIG46b3ZlcndyaXRlUHJvcCB8fCBwcm9wLCBwcjowfTsgLy9cIjJcIiBpbmRpY2F0ZXMgaXQncyBhIEJsb2IgcHJvcGVydHkgdHdlZW4uIE5lZWRlZCBmb3IgUm91bmRQcm9wc1BsdWdpbiBmb3IgZXhhbXBsZS5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKCFpc1JlbGF0aXZlKSB7XG5cdFx0XHRcdFx0XHRwdC5zID0gcGFyc2VGbG9hdChzKTtcblx0XHRcdFx0XHRcdHB0LmMgPSAocGFyc2VGbG9hdChlbmQpIC0gcHQucykgfHwgMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHB0LmMpIHsgLy9vbmx5IGFkZCBpdCB0byB0aGUgbGlua2VkIGxpc3QgaWYgdGhlcmUncyBhIGNoYW5nZS5cblx0XHRcdFx0XHRpZiAoKHB0Ll9uZXh0ID0gdGhpcy5fZmlyc3RQVCkpIHtcblx0XHRcdFx0XHRcdHB0Ll9uZXh0Ll9wcmV2ID0gcHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdDtcblx0XHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRfaW50ZXJuYWxzID0gVHdlZW5MaXRlLl9pbnRlcm5hbHMgPSB7aXNBcnJheTpfaXNBcnJheSwgaXNTZWxlY3RvcjpfaXNTZWxlY3RvciwgbGF6eVR3ZWVuczpfbGF6eVR3ZWVucywgYmxvYkRpZjpfYmxvYkRpZn0sIC8vZ2l2ZXMgdXMgYSB3YXkgdG8gZXhwb3NlIGNlcnRhaW4gcHJpdmF0ZSB2YWx1ZXMgdG8gb3RoZXIgR3JlZW5Tb2NrIGNsYXNzZXMgd2l0aG91dCBjb250YW1pbmF0aW5nIHRoYSBtYWluIFR3ZWVuTGl0ZSBvYmplY3QuXG5cdFx0XHRfcGx1Z2lucyA9IFR3ZWVuTGl0ZS5fcGx1Z2lucyA9IHt9LFxuXHRcdFx0X3R3ZWVuTG9va3VwID0gX2ludGVybmFscy50d2Vlbkxvb2t1cCA9IHt9LFxuXHRcdFx0X3R3ZWVuTG9va3VwTnVtID0gMCxcblx0XHRcdF9yZXNlcnZlZFByb3BzID0gX2ludGVybmFscy5yZXNlcnZlZFByb3BzID0ge2Vhc2U6MSwgZGVsYXk6MSwgb3ZlcndyaXRlOjEsIG9uQ29tcGxldGU6MSwgb25Db21wbGV0ZVBhcmFtczoxLCBvbkNvbXBsZXRlU2NvcGU6MSwgdXNlRnJhbWVzOjEsIHJ1bkJhY2t3YXJkczoxLCBzdGFydEF0OjEsIG9uVXBkYXRlOjEsIG9uVXBkYXRlUGFyYW1zOjEsIG9uVXBkYXRlU2NvcGU6MSwgb25TdGFydDoxLCBvblN0YXJ0UGFyYW1zOjEsIG9uU3RhcnRTY29wZToxLCBvblJldmVyc2VDb21wbGV0ZToxLCBvblJldmVyc2VDb21wbGV0ZVBhcmFtczoxLCBvblJldmVyc2VDb21wbGV0ZVNjb3BlOjEsIG9uUmVwZWF0OjEsIG9uUmVwZWF0UGFyYW1zOjEsIG9uUmVwZWF0U2NvcGU6MSwgZWFzZVBhcmFtczoxLCB5b3lvOjEsIGltbWVkaWF0ZVJlbmRlcjoxLCByZXBlYXQ6MSwgcmVwZWF0RGVsYXk6MSwgZGF0YToxLCBwYXVzZWQ6MSwgcmV2ZXJzZWQ6MSwgYXV0b0NTUzoxLCBsYXp5OjEsIG9uT3ZlcndyaXRlOjEsIGNhbGxiYWNrU2NvcGU6MSwgc3RyaW5nRmlsdGVyOjF9LFxuXHRcdFx0X292ZXJ3cml0ZUxvb2t1cCA9IHtub25lOjAsIGFsbDoxLCBhdXRvOjIsIGNvbmN1cnJlbnQ6MywgYWxsT25TdGFydDo0LCBwcmVleGlzdGluZzo1LCBcInRydWVcIjoxLCBcImZhbHNlXCI6MH0sXG5cdFx0XHRfcm9vdEZyYW1lc1RpbWVsaW5lID0gQW5pbWF0aW9uLl9yb290RnJhbWVzVGltZWxpbmUgPSBuZXcgU2ltcGxlVGltZWxpbmUoKSxcblx0XHRcdF9yb290VGltZWxpbmUgPSBBbmltYXRpb24uX3Jvb3RUaW1lbGluZSA9IG5ldyBTaW1wbGVUaW1lbGluZSgpLFxuXHRcdFx0X25leHRHQ0ZyYW1lID0gMzAsXG5cdFx0XHRfbGF6eVJlbmRlciA9IF9pbnRlcm5hbHMubGF6eVJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgaSA9IF9sYXp5VHdlZW5zLmxlbmd0aCxcblx0XHRcdFx0XHR0d2Vlbjtcblx0XHRcdFx0X2xhenlMb29rdXAgPSB7fTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0dHdlZW4gPSBfbGF6eVR3ZWVuc1tpXTtcblx0XHRcdFx0XHRpZiAodHdlZW4gJiYgdHdlZW4uX2xhenkgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHR0d2Vlbi5yZW5kZXIodHdlZW4uX2xhenlbMF0sIHR3ZWVuLl9sYXp5WzFdLCB0cnVlKTtcblx0XHRcdFx0XHRcdHR3ZWVuLl9sYXp5ID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdF9sYXp5VHdlZW5zLmxlbmd0aCA9IDA7XG5cdFx0XHR9O1xuXG5cdFx0X3Jvb3RUaW1lbGluZS5fc3RhcnRUaW1lID0gX3RpY2tlci50aW1lO1xuXHRcdF9yb290RnJhbWVzVGltZWxpbmUuX3N0YXJ0VGltZSA9IF90aWNrZXIuZnJhbWU7XG5cdFx0X3Jvb3RUaW1lbGluZS5fYWN0aXZlID0gX3Jvb3RGcmFtZXNUaW1lbGluZS5fYWN0aXZlID0gdHJ1ZTtcblx0XHRzZXRUaW1lb3V0KF9sYXp5UmVuZGVyLCAxKTsgLy9vbiBzb21lIG1vYmlsZSBkZXZpY2VzLCB0aGVyZSBpc24ndCBhIFwidGlja1wiIGJlZm9yZSBjb2RlIHJ1bnMgd2hpY2ggbWVhbnMgYW55IGxhenkgcmVuZGVycyB3b3VsZG4ndCBydW4gYmVmb3JlIHRoZSBuZXh0IG9mZmljaWFsIFwidGlja1wiLlxuXG5cdFx0QW5pbWF0aW9uLl91cGRhdGVSb290ID0gVHdlZW5MaXRlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgaSwgYSwgcDtcblx0XHRcdFx0aWYgKF9sYXp5VHdlZW5zLmxlbmd0aCkgeyAvL2lmIGNvZGUgaXMgcnVuIG91dHNpZGUgb2YgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBsb29wLCB0aGVyZSBtYXkgYmUgdHdlZW5zIHF1ZXVlZCBBRlRFUiB0aGUgZW5naW5lIHJlZnJlc2hlZCwgc28gd2UgbmVlZCB0byBlbnN1cmUgYW55IHBlbmRpbmcgcmVuZGVycyBvY2N1ciBiZWZvcmUgd2UgcmVmcmVzaCBhZ2Fpbi5cblx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9yb290VGltZWxpbmUucmVuZGVyKChfdGlja2VyLnRpbWUgLSBfcm9vdFRpbWVsaW5lLl9zdGFydFRpbWUpICogX3Jvb3RUaW1lbGluZS5fdGltZVNjYWxlLCBmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRfcm9vdEZyYW1lc1RpbWVsaW5lLnJlbmRlcigoX3RpY2tlci5mcmFtZSAtIF9yb290RnJhbWVzVGltZWxpbmUuX3N0YXJ0VGltZSkgKiBfcm9vdEZyYW1lc1RpbWVsaW5lLl90aW1lU2NhbGUsIGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHtcblx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChfdGlja2VyLmZyYW1lID49IF9uZXh0R0NGcmFtZSkgeyAvL2R1bXAgZ2FyYmFnZSBldmVyeSAxMjAgZnJhbWVzIG9yIHdoYXRldmVyIHRoZSB1c2VyIHNldHMgVHdlZW5MaXRlLmF1dG9TbGVlcCB0b1xuXHRcdFx0XHRcdF9uZXh0R0NGcmFtZSA9IF90aWNrZXIuZnJhbWUgKyAocGFyc2VJbnQoVHdlZW5MaXRlLmF1dG9TbGVlcCwgMTApIHx8IDEyMCk7XG5cdFx0XHRcdFx0Zm9yIChwIGluIF90d2Vlbkxvb2t1cCkge1xuXHRcdFx0XHRcdFx0YSA9IF90d2Vlbkxvb2t1cFtwXS50d2VlbnM7XG5cdFx0XHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGFbaV0uX2djKSB7XG5cdFx0XHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChhLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRkZWxldGUgX3R3ZWVuTG9va3VwW3BdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL2lmIHRoZXJlIGFyZSBubyBtb3JlIHR3ZWVucyBpbiB0aGUgcm9vdCB0aW1lbGluZXMsIG9yIGlmIHRoZXkncmUgYWxsIHBhdXNlZCwgbWFrZSB0aGUgX3RpbWVyIHNsZWVwIHRvIHJlZHVjZSBsb2FkIG9uIHRoZSBDUFUgc2xpZ2h0bHlcblx0XHRcdFx0XHRwID0gX3Jvb3RUaW1lbGluZS5fZmlyc3Q7XG5cdFx0XHRcdFx0aWYgKCFwIHx8IHAuX3BhdXNlZCkgaWYgKFR3ZWVuTGl0ZS5hdXRvU2xlZXAgJiYgIV9yb290RnJhbWVzVGltZWxpbmUuX2ZpcnN0ICYmIF90aWNrZXIuX2xpc3RlbmVycy50aWNrLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdFx0d2hpbGUgKHAgJiYgcC5fcGF1c2VkKSB7XG5cdFx0XHRcdFx0XHRcdHAgPSBwLl9uZXh0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCFwKSB7XG5cdFx0XHRcdFx0XHRcdF90aWNrZXIuc2xlZXAoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRfdGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0aWNrXCIsIEFuaW1hdGlvbi5fdXBkYXRlUm9vdCk7XG5cblx0XHR2YXIgX3JlZ2lzdGVyID0gZnVuY3Rpb24odGFyZ2V0LCB0d2Vlbiwgc2NydWIpIHtcblx0XHRcdFx0dmFyIGlkID0gdGFyZ2V0Ll9nc1R3ZWVuSUQsIGEsIGk7XG5cdFx0XHRcdGlmICghX3R3ZWVuTG9va3VwW2lkIHx8ICh0YXJnZXQuX2dzVHdlZW5JRCA9IGlkID0gXCJ0XCIgKyAoX3R3ZWVuTG9va3VwTnVtKyspKV0pIHtcblx0XHRcdFx0XHRfdHdlZW5Mb29rdXBbaWRdID0ge3RhcmdldDp0YXJnZXQsIHR3ZWVuczpbXX07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0YSA9IF90d2Vlbkxvb2t1cFtpZF0udHdlZW5zO1xuXHRcdFx0XHRcdGFbKGkgPSBhLmxlbmd0aCldID0gdHdlZW47XG5cdFx0XHRcdFx0aWYgKHNjcnViKSB7XG5cdFx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGFbaV0gPT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIF90d2Vlbkxvb2t1cFtpZF0udHdlZW5zO1xuXHRcdFx0fSxcblx0XHRcdF9vbk92ZXJ3cml0ZSA9IGZ1bmN0aW9uKG92ZXJ3cml0dGVuVHdlZW4sIG92ZXJ3cml0aW5nVHdlZW4sIHRhcmdldCwga2lsbGVkUHJvcHMpIHtcblx0XHRcdFx0dmFyIGZ1bmMgPSBvdmVyd3JpdHRlblR3ZWVuLnZhcnMub25PdmVyd3JpdGUsIHIxLCByMjtcblx0XHRcdFx0aWYgKGZ1bmMpIHtcblx0XHRcdFx0XHRyMSA9IGZ1bmMob3ZlcndyaXR0ZW5Ud2Vlbiwgb3ZlcndyaXRpbmdUd2VlbiwgdGFyZ2V0LCBraWxsZWRQcm9wcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZnVuYyA9IFR3ZWVuTGl0ZS5vbk92ZXJ3cml0ZTtcblx0XHRcdFx0aWYgKGZ1bmMpIHtcblx0XHRcdFx0XHRyMiA9IGZ1bmMob3ZlcndyaXR0ZW5Ud2Vlbiwgb3ZlcndyaXRpbmdUd2VlbiwgdGFyZ2V0LCBraWxsZWRQcm9wcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChyMSAhPT0gZmFsc2UgJiYgcjIgIT09IGZhbHNlKTtcblx0XHRcdH0sXG5cdFx0XHRfYXBwbHlPdmVyd3JpdGUgPSBmdW5jdGlvbih0YXJnZXQsIHR3ZWVuLCBwcm9wcywgbW9kZSwgc2libGluZ3MpIHtcblx0XHRcdFx0dmFyIGksIGNoYW5nZWQsIGN1clR3ZWVuLCBsO1xuXHRcdFx0XHRpZiAobW9kZSA9PT0gMSB8fCBtb2RlID49IDQpIHtcblx0XHRcdFx0XHRsID0gc2libGluZ3MubGVuZ3RoO1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICgoY3VyVHdlZW4gPSBzaWJsaW5nc1tpXSkgIT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghY3VyVHdlZW4uX2djKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGN1clR3ZWVuLl9raWxsKG51bGwsIHRhcmdldCwgdHdlZW4pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobW9kZSA9PT0gNSkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9OT1RFOiBBZGQgMC4wMDAwMDAwMDAxIHRvIG92ZXJjb21lIGZsb2F0aW5nIHBvaW50IGVycm9ycyB0aGF0IGNhbiBjYXVzZSB0aGUgc3RhcnRUaW1lIHRvIGJlIFZFUlkgc2xpZ2h0bHkgb2ZmICh3aGVuIGEgdHdlZW4ncyB0aW1lKCkgaXMgc2V0IGZvciBleGFtcGxlKVxuXHRcdFx0XHR2YXIgc3RhcnRUaW1lID0gdHdlZW4uX3N0YXJ0VGltZSArIF90aW55TnVtLFxuXHRcdFx0XHRcdG92ZXJsYXBzID0gW10sXG5cdFx0XHRcdFx0b0NvdW50ID0gMCxcblx0XHRcdFx0XHR6ZXJvRHVyID0gKHR3ZWVuLl9kdXJhdGlvbiA9PT0gMCksXG5cdFx0XHRcdFx0Z2xvYmFsU3RhcnQ7XG5cdFx0XHRcdGkgPSBzaWJsaW5ncy5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmICgoY3VyVHdlZW4gPSBzaWJsaW5nc1tpXSkgPT09IHR3ZWVuIHx8IGN1clR3ZWVuLl9nYyB8fCBjdXJUd2Vlbi5fcGF1c2VkKSB7XG5cdFx0XHRcdFx0XHQvL2lnbm9yZVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY3VyVHdlZW4uX3RpbWVsaW5lICE9PSB0d2Vlbi5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdGdsb2JhbFN0YXJ0ID0gZ2xvYmFsU3RhcnQgfHwgX2NoZWNrT3ZlcmxhcCh0d2VlbiwgMCwgemVyb0R1cik7XG5cdFx0XHRcdFx0XHRpZiAoX2NoZWNrT3ZlcmxhcChjdXJUd2VlbiwgZ2xvYmFsU3RhcnQsIHplcm9EdXIpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXBzW29Db3VudCsrXSA9IGN1clR3ZWVuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY3VyVHdlZW4uX3N0YXJ0VGltZSA8PSBzdGFydFRpbWUpIGlmIChjdXJUd2Vlbi5fc3RhcnRUaW1lICsgY3VyVHdlZW4udG90YWxEdXJhdGlvbigpIC8gY3VyVHdlZW4uX3RpbWVTY2FsZSA+IHN0YXJ0VGltZSkgaWYgKCEoKHplcm9EdXIgfHwgIWN1clR3ZWVuLl9pbml0dGVkKSAmJiBzdGFydFRpbWUgLSBjdXJUd2Vlbi5fc3RhcnRUaW1lIDw9IDAuMDAwMDAwMDAwMikpIHtcblx0XHRcdFx0XHRcdG92ZXJsYXBzW29Db3VudCsrXSA9IGN1clR3ZWVuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGkgPSBvQ291bnQ7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGN1clR3ZWVuID0gb3ZlcmxhcHNbaV07XG5cdFx0XHRcdFx0aWYgKG1vZGUgPT09IDIpIGlmIChjdXJUd2Vlbi5fa2lsbChwcm9wcywgdGFyZ2V0LCB0d2VlbikpIHtcblx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobW9kZSAhPT0gMiB8fCAoIWN1clR3ZWVuLl9maXJzdFBUICYmIGN1clR3ZWVuLl9pbml0dGVkKSkge1xuXHRcdFx0XHRcdFx0aWYgKG1vZGUgIT09IDIgJiYgIV9vbk92ZXJ3cml0ZShjdXJUd2VlbiwgdHdlZW4pKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGN1clR3ZWVuLl9lbmFibGVkKGZhbHNlLCBmYWxzZSkpIHsgLy9pZiBhbGwgcHJvcGVydHkgdHdlZW5zIGhhdmUgYmVlbiBvdmVyd3JpdHRlbiwga2lsbCB0aGUgdHdlZW4uXG5cdFx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHRcdH0sXG5cdFx0XHRfY2hlY2tPdmVybGFwID0gZnVuY3Rpb24odHdlZW4sIHJlZmVyZW5jZSwgemVyb0R1cikge1xuXHRcdFx0XHR2YXIgdGwgPSB0d2Vlbi5fdGltZWxpbmUsXG5cdFx0XHRcdFx0dHMgPSB0bC5fdGltZVNjYWxlLFxuXHRcdFx0XHRcdHQgPSB0d2Vlbi5fc3RhcnRUaW1lO1xuXHRcdFx0XHR3aGlsZSAodGwuX3RpbWVsaW5lKSB7XG5cdFx0XHRcdFx0dCArPSB0bC5fc3RhcnRUaW1lO1xuXHRcdFx0XHRcdHRzICo9IHRsLl90aW1lU2NhbGU7XG5cdFx0XHRcdFx0aWYgKHRsLl9wYXVzZWQpIHtcblx0XHRcdFx0XHRcdHJldHVybiAtMTAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0bCA9IHRsLl90aW1lbGluZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0IC89IHRzO1xuXHRcdFx0XHRyZXR1cm4gKHQgPiByZWZlcmVuY2UpID8gdCAtIHJlZmVyZW5jZSA6ICgoemVyb0R1ciAmJiB0ID09PSByZWZlcmVuY2UpIHx8ICghdHdlZW4uX2luaXR0ZWQgJiYgdCAtIHJlZmVyZW5jZSA8IDIgKiBfdGlueU51bSkpID8gX3RpbnlOdW0gOiAoKHQgKz0gdHdlZW4udG90YWxEdXJhdGlvbigpIC8gdHdlZW4uX3RpbWVTY2FsZSAvIHRzKSA+IHJlZmVyZW5jZSArIF90aW55TnVtKSA/IDAgOiB0IC0gcmVmZXJlbmNlIC0gX3RpbnlOdW07XG5cdFx0XHR9O1xuXG5cbi8vLS0tLSBUd2VlbkxpdGUgaW5zdGFuY2UgbWV0aG9kcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0cC5faW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHYgPSB0aGlzLnZhcnMsXG5cdFx0XHRcdG9wID0gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyxcblx0XHRcdFx0ZHVyID0gdGhpcy5fZHVyYXRpb24sXG5cdFx0XHRcdGltbWVkaWF0ZSA9ICEhdi5pbW1lZGlhdGVSZW5kZXIsXG5cdFx0XHRcdGVhc2UgPSB2LmVhc2UsXG5cdFx0XHRcdGksIGluaXRQbHVnaW5zLCBwdCwgcCwgc3RhcnRWYXJzO1xuXHRcdFx0aWYgKHYuc3RhcnRBdCkge1xuXHRcdFx0XHRpZiAodGhpcy5fc3RhcnRBdCkge1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQucmVuZGVyKC0xLCB0cnVlKTsgLy9pZiB3ZSd2ZSBydW4gYSBzdGFydEF0IHByZXZpb3VzbHkgKHdoZW4gdGhlIHR3ZWVuIGluc3RhbnRpYXRlZCksIHdlIHNob3VsZCByZXZlcnQgaXQgc28gdGhhdCB0aGUgdmFsdWVzIHJlLWluc3RhbnRpYXRlIGNvcnJlY3RseSBwYXJ0aWN1bGFybHkgZm9yIHJlbGF0aXZlIHR3ZWVucy4gV2l0aG91dCB0aGlzLCBhIFR3ZWVuTGl0ZS5mcm9tVG8ob2JqLCAxLCB7eDpcIis9MTAwXCJ9LCB7eDpcIi09MTAwXCJ9KSwgZm9yIGV4YW1wbGUsIHdvdWxkIGFjdHVhbGx5IGp1bXAgdG8gKz0yMDAgYmVjYXVzZSB0aGUgc3RhcnRBdCB3b3VsZCBydW4gdHdpY2UsIGRvdWJsaW5nIHRoZSByZWxhdGl2ZSBjaGFuZ2UuXG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5raWxsKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RhcnRWYXJzID0ge307XG5cdFx0XHRcdGZvciAocCBpbiB2LnN0YXJ0QXQpIHsgLy9jb3B5IHRoZSBwcm9wZXJ0aWVzL3ZhbHVlcyBpbnRvIGEgbmV3IG9iamVjdCB0byBhdm9pZCBjb2xsaXNpb25zLCBsaWtlIHZhciB0byA9IHt4OjB9LCBmcm9tID0ge3g6NTAwfTsgdGltZWxpbmUuZnJvbVRvKGUsIDEsIGZyb20sIHRvKS5mcm9tVG8oZSwgMSwgdG8sIGZyb20pO1xuXHRcdFx0XHRcdHN0YXJ0VmFyc1twXSA9IHYuc3RhcnRBdFtwXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzdGFydFZhcnMub3ZlcndyaXRlID0gZmFsc2U7XG5cdFx0XHRcdHN0YXJ0VmFycy5pbW1lZGlhdGVSZW5kZXIgPSB0cnVlO1xuXHRcdFx0XHRzdGFydFZhcnMubGF6eSA9IChpbW1lZGlhdGUgJiYgdi5sYXp5ICE9PSBmYWxzZSk7XG5cdFx0XHRcdHN0YXJ0VmFycy5zdGFydEF0ID0gc3RhcnRWYXJzLmRlbGF5ID0gbnVsbDsgLy9ubyBuZXN0aW5nIG9mIHN0YXJ0QXQgb2JqZWN0cyBhbGxvd2VkIChvdGhlcndpc2UgaXQgY291bGQgY2F1c2UgYW4gaW5maW5pdGUgbG9vcCkuXG5cdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBUd2VlbkxpdGUudG8odGhpcy50YXJnZXQsIDAsIHN0YXJ0VmFycyk7XG5cdFx0XHRcdGlmIChpbW1lZGlhdGUpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fdGltZSA+IDApIHtcblx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBudWxsOyAvL3R3ZWVucyB0aGF0IHJlbmRlciBpbW1lZGlhdGVseSAobGlrZSBtb3N0IGZyb20oKSBhbmQgZnJvbVRvKCkgdHdlZW5zKSBzaG91bGRuJ3QgcmV2ZXJ0IHdoZW4gdGhlaXIgcGFyZW50IHRpbWVsaW5lJ3MgcGxheWhlYWQgZ29lcyBiYWNrd2FyZCBwYXN0IHRoZSBzdGFydFRpbWUgYmVjYXVzZSB0aGUgaW5pdGlhbCByZW5kZXIgY291bGQgaGF2ZSBoYXBwZW5lZCBhbnl0aW1lIGFuZCBpdCBzaG91bGRuJ3QgYmUgZGlyZWN0bHkgY29ycmVsYXRlZCB0byB0aGlzIHR3ZWVuJ3Mgc3RhcnRUaW1lLiBJbWFnaW5lIHNldHRpbmcgdXAgYSBjb21wbGV4IGFuaW1hdGlvbiB3aGVyZSB0aGUgYmVnaW5uaW5nIHN0YXRlcyBvZiB2YXJpb3VzIG9iamVjdHMgYXJlIHJlbmRlcmVkIGltbWVkaWF0ZWx5IGJ1dCB0aGUgdHdlZW4gZG9lc24ndCBoYXBwZW4gZm9yIHF1aXRlIHNvbWUgdGltZSAtIGlmIHdlIHJldmVydCB0byB0aGUgc3RhcnRpbmcgdmFsdWVzIGFzIHNvb24gYXMgdGhlIHBsYXloZWFkIGdvZXMgYmFja3dhcmQgcGFzdCB0aGUgdHdlZW4ncyBzdGFydFRpbWUsIGl0IHdpbGwgdGhyb3cgdGhpbmdzIG9mZiB2aXN1YWxseS4gUmV2ZXJzaW9uIHNob3VsZCBvbmx5IGhhcHBlbiBpbiBUaW1lbGluZUxpdGUvTWF4IGluc3RhbmNlcyB3aGVyZSBpbW1lZGlhdGVSZW5kZXIgd2FzIGZhbHNlICh3aGljaCBpcyB0aGUgZGVmYXVsdCBpbiB0aGUgY29udmVuaWVuY2UgbWV0aG9kcyBsaWtlIGZyb20oKSkuXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChkdXIgIT09IDApIHtcblx0XHRcdFx0XHRcdHJldHVybjsgLy93ZSBza2lwIGluaXRpYWxpemF0aW9uIGhlcmUgc28gdGhhdCBvdmVyd3JpdGluZyBkb2Vzbid0IG9jY3VyIHVudGlsIHRoZSB0d2VlbiBhY3R1YWxseSBiZWdpbnMuIE90aGVyd2lzZSwgaWYgeW91IGNyZWF0ZSBzZXZlcmFsIGltbWVkaWF0ZVJlbmRlcjp0cnVlIHR3ZWVucyBvZiB0aGUgc2FtZSB0YXJnZXQvcHJvcGVydGllcyB0byBkcm9wIGludG8gYSBUaW1lbGluZUxpdGUgb3IgVGltZWxpbmVNYXgsIHRoZSBsYXN0IG9uZSBjcmVhdGVkIHdvdWxkIG92ZXJ3cml0ZSB0aGUgZmlyc3Qgb25lcyBiZWNhdXNlIHRoZXkgZGlkbid0IGdldCBwbGFjZWQgaW50byB0aGUgdGltZWxpbmUgeWV0IGJlZm9yZSB0aGUgZmlyc3QgcmVuZGVyIG9jY3VycyBhbmQga2lja3MgaW4gb3ZlcndyaXRpbmcuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHYucnVuQmFja3dhcmRzICYmIGR1ciAhPT0gMCkge1xuXHRcdFx0XHQvL2Zyb20oKSB0d2VlbnMgbXVzdCBiZSBoYW5kbGVkIHVuaXF1ZWx5OiB0aGVpciBiZWdpbm5pbmcgdmFsdWVzIG11c3QgYmUgcmVuZGVyZWQgYnV0IHdlIGRvbid0IHdhbnQgb3ZlcndyaXRpbmcgdG8gb2NjdXIgeWV0ICh3aGVuIHRpbWUgaXMgc3RpbGwgMCkuIFdhaXQgdW50aWwgdGhlIHR3ZWVuIGFjdHVhbGx5IGJlZ2lucyBiZWZvcmUgZG9pbmcgYWxsIHRoZSByb3V0aW5lcyBsaWtlIG92ZXJ3cml0aW5nLiBBdCB0aGF0IHRpbWUsIHdlIHNob3VsZCByZW5kZXIgYXQgdGhlIEVORCBvZiB0aGUgdHdlZW4gdG8gZW5zdXJlIHRoYXQgdGhpbmdzIGluaXRpYWxpemUgY29ycmVjdGx5IChyZW1lbWJlciwgZnJvbSgpIHR3ZWVucyBnbyBiYWNrd2FyZHMpXG5cdFx0XHRcdGlmICh0aGlzLl9zdGFydEF0KSB7XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIoLTEsIHRydWUpO1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQua2lsbCgpO1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBudWxsO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lICE9PSAwKSB7IC8vaW4gcmFyZSBjYXNlcyAobGlrZSBpZiBhIGZyb20oKSB0d2VlbiBydW5zIGFuZCB0aGVuIGlzIGludmFsaWRhdGUoKS1lZCksIGltbWVkaWF0ZVJlbmRlciBjb3VsZCBiZSB0cnVlIGJ1dCB0aGUgaW5pdGlhbCBmb3JjZWQtcmVuZGVyIGdldHMgc2tpcHBlZCwgc28gdGhlcmUncyBubyBuZWVkIHRvIGZvcmNlIHRoZSByZW5kZXIgaW4gdGhpcyBjb250ZXh0IHdoZW4gdGhlIF90aW1lIGlzIGdyZWF0ZXIgdGhhbiAwXG5cdFx0XHRcdFx0XHRpbW1lZGlhdGUgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSB7fTtcblx0XHRcdFx0XHRmb3IgKHAgaW4gdikgeyAvL2NvcHkgcHJvcHMgaW50byBhIG5ldyBvYmplY3QgYW5kIHNraXAgYW55IHJlc2VydmVkIHByb3BzLCBvdGhlcndpc2Ugb25Db21wbGV0ZSBvciBvblVwZGF0ZSBvciBvblN0YXJ0IGNvdWxkIGZpcmUuIFdlIHNob3VsZCwgaG93ZXZlciwgcGVybWl0IGF1dG9DU1MgdG8gZ28gdGhyb3VnaC5cblx0XHRcdFx0XHRcdGlmICghX3Jlc2VydmVkUHJvcHNbcF0gfHwgcCA9PT0gXCJhdXRvQ1NTXCIpIHtcblx0XHRcdFx0XHRcdFx0cHRbcF0gPSB2W3BdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdC5vdmVyd3JpdGUgPSAwO1xuXHRcdFx0XHRcdHB0LmRhdGEgPSBcImlzRnJvbVN0YXJ0XCI7IC8vd2UgdGFnIHRoZSB0d2VlbiB3aXRoIGFzIFwiaXNGcm9tU3RhcnRcIiBzbyB0aGF0IGlmIFtpbnNpZGUgYSBwbHVnaW5dIHdlIG5lZWQgdG8gb25seSBkbyBzb21ldGhpbmcgYXQgdGhlIHZlcnkgRU5EIG9mIGEgdHdlZW4sIHdlIGhhdmUgYSB3YXkgb2YgaWRlbnRpZnlpbmcgdGhpcyB0d2VlbiBhcyBtZXJlbHkgdGhlIG9uZSB0aGF0J3Mgc2V0dGluZyB0aGUgYmVnaW5uaW5nIHZhbHVlcyBmb3IgYSBcImZyb20oKVwiIHR3ZWVuLiBGb3IgZXhhbXBsZSwgY2xlYXJQcm9wcyBpbiBDU1NQbHVnaW4gc2hvdWxkIG9ubHkgZ2V0IGFwcGxpZWQgYXQgdGhlIHZlcnkgRU5EIG9mIGEgdHdlZW4gYW5kIHdpdGhvdXQgdGhpcyB0YWcsIGZyb20oLi4ue2hlaWdodDoxMDAsIGNsZWFyUHJvcHM6XCJoZWlnaHRcIiwgZGVsYXk6MX0pIHdvdWxkIHdpcGUgdGhlIGhlaWdodCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0d2VlbiBhbmQgYWZ0ZXIgMSBzZWNvbmQsIGl0J2Qga2ljayBiYWNrIGluLlxuXHRcdFx0XHRcdHB0LmxhenkgPSAoaW1tZWRpYXRlICYmIHYubGF6eSAhPT0gZmFsc2UpO1xuXHRcdFx0XHRcdHB0LmltbWVkaWF0ZVJlbmRlciA9IGltbWVkaWF0ZTsgLy96ZXJvLWR1cmF0aW9uIHR3ZWVucyByZW5kZXIgaW1tZWRpYXRlbHkgYnkgZGVmYXVsdCwgYnV0IGlmIHdlJ3JlIG5vdCBzcGVjaWZpY2FsbHkgaW5zdHJ1Y3RlZCB0byByZW5kZXIgdGhpcyB0d2VlbiBpbW1lZGlhdGVseSwgd2Ugc2hvdWxkIHNraXAgdGhpcyBhbmQgbWVyZWx5IF9pbml0KCkgdG8gcmVjb3JkIHRoZSBzdGFydGluZyB2YWx1ZXMgKHJlbmRlcmluZyB0aGVtIGltbWVkaWF0ZWx5IHdvdWxkIHB1c2ggdGhlbSB0byBjb21wbGV0aW9uIHdoaWNoIGlzIHdhc3RlZnVsIGluIHRoYXQgY2FzZSAtIHdlJ2QgaGF2ZSB0byByZW5kZXIoLTEpIGltbWVkaWF0ZWx5IGFmdGVyKVxuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBUd2VlbkxpdGUudG8odGhpcy50YXJnZXQsIDAsIHB0KTtcblx0XHRcdFx0XHRpZiAoIWltbWVkaWF0ZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5faW5pdCgpOyAvL2Vuc3VyZXMgdGhhdCB0aGUgaW5pdGlhbCB2YWx1ZXMgYXJlIHJlY29yZGVkXG5cdFx0XHRcdFx0XHR0aGlzLl9zdGFydEF0Ll9lbmFibGVkKGZhbHNlKTsgLy9ubyBuZWVkIHRvIGhhdmUgdGhlIHR3ZWVuIHJlbmRlciBvbiB0aGUgbmV4dCBjeWNsZS4gRGlzYWJsZSBpdCBiZWNhdXNlIHdlJ2xsIGFsd2F5cyBtYW51YWxseSBjb250cm9sIHRoZSByZW5kZXJzIG9mIHRoZSBfc3RhcnRBdCB0d2Vlbi5cblx0XHRcdFx0XHRcdGlmICh0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQgPSBudWxsO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fdGltZSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZWFzZSA9IGVhc2UgPSAoIWVhc2UpID8gVHdlZW5MaXRlLmRlZmF1bHRFYXNlIDogKGVhc2UgaW5zdGFuY2VvZiBFYXNlKSA/IGVhc2UgOiAodHlwZW9mKGVhc2UpID09PSBcImZ1bmN0aW9uXCIpID8gbmV3IEVhc2UoZWFzZSwgdi5lYXNlUGFyYW1zKSA6IF9lYXNlTWFwW2Vhc2VdIHx8IFR3ZWVuTGl0ZS5kZWZhdWx0RWFzZTtcblx0XHRcdGlmICh2LmVhc2VQYXJhbXMgaW5zdGFuY2VvZiBBcnJheSAmJiBlYXNlLmNvbmZpZykge1xuXHRcdFx0XHR0aGlzLl9lYXNlID0gZWFzZS5jb25maWcuYXBwbHkoZWFzZSwgdi5lYXNlUGFyYW1zKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2Vhc2VUeXBlID0gdGhpcy5fZWFzZS5fdHlwZTtcblx0XHRcdHRoaXMuX2Vhc2VQb3dlciA9IHRoaXMuX2Vhc2UuX3Bvd2VyO1xuXHRcdFx0dGhpcy5fZmlyc3RQVCA9IG51bGw7XG5cblx0XHRcdGlmICh0aGlzLl90YXJnZXRzKSB7XG5cdFx0XHRcdGkgPSB0aGlzLl90YXJnZXRzLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKCB0aGlzLl9pbml0UHJvcHMoIHRoaXMuX3RhcmdldHNbaV0sICh0aGlzLl9wcm9wTG9va3VwW2ldID0ge30pLCB0aGlzLl9zaWJsaW5nc1tpXSwgKG9wID8gb3BbaV0gOiBudWxsKSkgKSB7XG5cdFx0XHRcdFx0XHRpbml0UGx1Z2lucyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpbml0UGx1Z2lucyA9IHRoaXMuX2luaXRQcm9wcyh0aGlzLnRhcmdldCwgdGhpcy5fcHJvcExvb2t1cCwgdGhpcy5fc2libGluZ3MsIG9wKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGluaXRQbHVnaW5zKSB7XG5cdFx0XHRcdFR3ZWVuTGl0ZS5fb25QbHVnaW5FdmVudChcIl9vbkluaXRBbGxQcm9wc1wiLCB0aGlzKTsgLy9yZW9yZGVycyB0aGUgYXJyYXkgaW4gb3JkZXIgb2YgcHJpb3JpdHkuIFVzZXMgYSBzdGF0aWMgVHdlZW5QbHVnaW4gbWV0aG9kIGluIG9yZGVyIHRvIG1pbmltaXplIGZpbGUgc2l6ZSBpbiBUd2VlbkxpdGVcblx0XHRcdH1cblx0XHRcdGlmIChvcCkgaWYgKCF0aGlzLl9maXJzdFBUKSBpZiAodHlwZW9mKHRoaXMudGFyZ2V0KSAhPT0gXCJmdW5jdGlvblwiKSB7IC8vaWYgYWxsIHR3ZWVuaW5nIHByb3BlcnRpZXMgaGF2ZSBiZWVuIG92ZXJ3cml0dGVuLCBraWxsIHRoZSB0d2Vlbi4gSWYgdGhlIHRhcmdldCBpcyBhIGZ1bmN0aW9uLCBpdCdzIHByb2JhYmx5IGEgZGVsYXllZENhbGwgc28gbGV0IGl0IGxpdmUuXG5cdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdH1cblx0XHRcdGlmICh2LnJ1bkJhY2t3YXJkcykge1xuXHRcdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdHB0LnMgKz0gcHQuYztcblx0XHRcdFx0XHRwdC5jID0gLXB0LmM7XG5cdFx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fb25VcGRhdGUgPSB2Lm9uVXBkYXRlO1xuXHRcdFx0dGhpcy5faW5pdHRlZCA9IHRydWU7XG5cdFx0fTtcblxuXHRcdHAuX2luaXRQcm9wcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcExvb2t1cCwgc2libGluZ3MsIG92ZXJ3cml0dGVuUHJvcHMpIHtcblx0XHRcdHZhciBwLCBpLCBpbml0UGx1Z2lucywgcGx1Z2luLCBwdCwgdjtcblx0XHRcdGlmICh0YXJnZXQgPT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChfbGF6eUxvb2t1cFt0YXJnZXQuX2dzVHdlZW5JRF0pIHtcblx0XHRcdFx0X2xhenlSZW5kZXIoKTsgLy9pZiBvdGhlciB0d2VlbnMgb2YgdGhlIHNhbWUgdGFyZ2V0IGhhdmUgcmVjZW50bHkgaW5pdHRlZCBidXQgaGF2ZW4ndCByZW5kZXJlZCB5ZXQsIHdlJ3ZlIGdvdCB0byBmb3JjZSB0aGUgcmVuZGVyIHNvIHRoYXQgdGhlIHN0YXJ0aW5nIHZhbHVlcyBhcmUgY29ycmVjdCAoaW1hZ2luZSBwb3B1bGF0aW5nIGEgdGltZWxpbmUgd2l0aCBhIGJ1bmNoIG9mIHNlcXVlbnRpYWwgdHdlZW5zIGFuZCB0aGVuIGp1bXBpbmcgdG8gdGhlIGVuZClcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLnZhcnMuY3NzKSBpZiAodGFyZ2V0LnN0eWxlKSBpZiAodGFyZ2V0ICE9PSB3aW5kb3cgJiYgdGFyZ2V0Lm5vZGVUeXBlKSBpZiAoX3BsdWdpbnMuY3NzKSBpZiAodGhpcy52YXJzLmF1dG9DU1MgIT09IGZhbHNlKSB7IC8vaXQncyBzbyBjb21tb24gdG8gdXNlIFR3ZWVuTGl0ZS9NYXggdG8gYW5pbWF0ZSB0aGUgY3NzIG9mIERPTSBlbGVtZW50cywgd2UgYXNzdW1lIHRoYXQgaWYgdGhlIHRhcmdldCBpcyBhIERPTSBlbGVtZW50LCB0aGF0J3Mgd2hhdCBpcyBpbnRlbmRlZCAoYSBjb252ZW5pZW5jZSBzbyB0aGF0IHVzZXJzIGRvbid0IGhhdmUgdG8gd3JhcCB0aGluZ3MgaW4gY3NzOnt9LCBhbHRob3VnaCB3ZSBzdGlsbCByZWNvbW1lbmQgaXQgZm9yIGEgc2xpZ2h0IHBlcmZvcm1hbmNlIGJvb3N0IGFuZCBiZXR0ZXIgc3BlY2lmaWNpdHkpLiBOb3RlOiB3ZSBjYW5ub3QgY2hlY2sgXCJub2RlVHlwZVwiIG9uIHRoZSB3aW5kb3cgaW5zaWRlIGFuIGlmcmFtZS5cblx0XHRcdFx0X2F1dG9DU1ModGhpcy52YXJzLCB0YXJnZXQpO1xuXHRcdFx0fVxuXHRcdFx0Zm9yIChwIGluIHRoaXMudmFycykge1xuXHRcdFx0XHR2ID0gdGhpcy52YXJzW3BdO1xuXHRcdFx0XHRpZiAoX3Jlc2VydmVkUHJvcHNbcF0pIHtcblx0XHRcdFx0XHRpZiAodikgaWYgKCh2IGluc3RhbmNlb2YgQXJyYXkpIHx8ICh2LnB1c2ggJiYgX2lzQXJyYXkodikpKSBpZiAodi5qb2luKFwiXCIpLmluZGV4T2YoXCJ7c2VsZn1cIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnZhcnNbcF0gPSB2ID0gdGhpcy5fc3dhcFNlbGZJblBhcmFtcyh2LCB0aGlzKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIGlmIChfcGx1Z2luc1twXSAmJiAocGx1Z2luID0gbmV3IF9wbHVnaW5zW3BdKCkpLl9vbkluaXRUd2Vlbih0YXJnZXQsIHRoaXMudmFyc1twXSwgdGhpcykpIHtcblxuXHRcdFx0XHRcdC8vdCAtIHRhcmdldCBcdFx0W29iamVjdF1cblx0XHRcdFx0XHQvL3AgLSBwcm9wZXJ0eSBcdFx0W3N0cmluZ11cblx0XHRcdFx0XHQvL3MgLSBzdGFydFx0XHRcdFtudW1iZXJdXG5cdFx0XHRcdFx0Ly9jIC0gY2hhbmdlXHRcdFtudW1iZXJdXG5cdFx0XHRcdFx0Ly9mIC0gaXNGdW5jdGlvblx0W2Jvb2xlYW5dXG5cdFx0XHRcdFx0Ly9uIC0gbmFtZVx0XHRcdFtzdHJpbmddXG5cdFx0XHRcdFx0Ly9wZyAtIGlzUGx1Z2luIFx0W2Jvb2xlYW5dXG5cdFx0XHRcdFx0Ly9wciAtIHByaW9yaXR5XHRcdFtudW1iZXJdXG5cdFx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0ID0ge19uZXh0OnRoaXMuX2ZpcnN0UFQsIHQ6cGx1Z2luLCBwOlwic2V0UmF0aW9cIiwgczowLCBjOjEsIGY6MSwgbjpwLCBwZzoxLCBwcjpwbHVnaW4uX3ByaW9yaXR5fTtcblx0XHRcdFx0XHRpID0gcGx1Z2luLl9vdmVyd3JpdGVQcm9wcy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRwcm9wTG9va3VwW3BsdWdpbi5fb3ZlcndyaXRlUHJvcHNbaV1dID0gdGhpcy5fZmlyc3RQVDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHBsdWdpbi5fcHJpb3JpdHkgfHwgcGx1Z2luLl9vbkluaXRBbGxQcm9wcykge1xuXHRcdFx0XHRcdFx0aW5pdFBsdWdpbnMgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocGx1Z2luLl9vbkRpc2FibGUgfHwgcGx1Z2luLl9vbkVuYWJsZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwdC5fbmV4dCkge1xuXHRcdFx0XHRcdFx0cHQuX25leHQuX3ByZXYgPSBwdDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwcm9wTG9va3VwW3BdID0gX2FkZFByb3BUd2Vlbi5jYWxsKHRoaXMsIHRhcmdldCwgcCwgXCJnZXRcIiwgdiwgcCwgMCwgbnVsbCwgdGhpcy52YXJzLnN0cmluZ0ZpbHRlcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG92ZXJ3cml0dGVuUHJvcHMpIGlmICh0aGlzLl9raWxsKG92ZXJ3cml0dGVuUHJvcHMsIHRhcmdldCkpIHsgLy9hbm90aGVyIHR3ZWVuIG1heSBoYXZlIHRyaWVkIHRvIG92ZXJ3cml0ZSBwcm9wZXJ0aWVzIG9mIHRoaXMgdHdlZW4gYmVmb3JlIGluaXQoKSB3YXMgY2FsbGVkIChsaWtlIGlmIHR3byB0d2VlbnMgc3RhcnQgYXQgdGhlIHNhbWUgdGltZSwgdGhlIG9uZSBjcmVhdGVkIHNlY29uZCB3aWxsIHJ1biBmaXJzdClcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2luaXRQcm9wcyh0YXJnZXQsIHByb3BMb29rdXAsIHNpYmxpbmdzLCBvdmVyd3JpdHRlblByb3BzKTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9vdmVyd3JpdGUgPiAxKSBpZiAodGhpcy5fZmlyc3RQVCkgaWYgKHNpYmxpbmdzLmxlbmd0aCA+IDEpIGlmIChfYXBwbHlPdmVyd3JpdGUodGFyZ2V0LCB0aGlzLCBwcm9wTG9va3VwLCB0aGlzLl9vdmVyd3JpdGUsIHNpYmxpbmdzKSkge1xuXHRcdFx0XHR0aGlzLl9raWxsKHByb3BMb29rdXAsIHRhcmdldCk7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9pbml0UHJvcHModGFyZ2V0LCBwcm9wTG9va3VwLCBzaWJsaW5ncywgb3ZlcndyaXR0ZW5Qcm9wcyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fZmlyc3RQVCkgaWYgKCh0aGlzLnZhcnMubGF6eSAhPT0gZmFsc2UgJiYgdGhpcy5fZHVyYXRpb24pIHx8ICh0aGlzLnZhcnMubGF6eSAmJiAhdGhpcy5fZHVyYXRpb24pKSB7IC8vemVybyBkdXJhdGlvbiB0d2VlbnMgZG9uJ3QgbGF6eSByZW5kZXIgYnkgZGVmYXVsdDsgZXZlcnl0aGluZyBlbHNlIGRvZXMuXG5cdFx0XHRcdF9sYXp5TG9va3VwW3RhcmdldC5fZ3NUd2VlbklEXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5pdFBsdWdpbnM7XG5cdFx0fTtcblxuXHRcdHAucmVuZGVyID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG5cdFx0XHR2YXIgcHJldlRpbWUgPSB0aGlzLl90aW1lLFxuXHRcdFx0XHRkdXJhdGlvbiA9IHRoaXMuX2R1cmF0aW9uLFxuXHRcdFx0XHRwcmV2UmF3UHJldlRpbWUgPSB0aGlzLl9yYXdQcmV2VGltZSxcblx0XHRcdFx0aXNDb21wbGV0ZSwgY2FsbGJhY2ssIHB0LCByYXdQcmV2VGltZTtcblx0XHRcdGlmICh0aW1lID49IGR1cmF0aW9uIC0gMC4wMDAwMDAxKSB7IC8vdG8gd29yayBhcm91bmQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCBtYXRoIGFydGlmYWN0cy5cblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IGR1cmF0aW9uO1xuXHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMSkgOiAxO1xuXHRcdFx0XHRpZiAoIXRoaXMuX3JldmVyc2VkICkge1xuXHRcdFx0XHRcdGlzQ29tcGxldGUgPSB0cnVlO1xuXHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvbkNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0Zm9yY2UgPSAoZm9yY2UgfHwgdGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuKTsgLy9vdGhlcndpc2UsIGlmIHRoZSBhbmltYXRpb24gaXMgdW5wYXVzZWQvYWN0aXZhdGVkIGFmdGVyIGl0J3MgYWxyZWFkeSBmaW5pc2hlZCwgaXQgZG9lc24ndCBnZXQgcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnQgdGltZWxpbmUuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGR1cmF0aW9uID09PSAwKSBpZiAodGhpcy5faW5pdHRlZCB8fCAhdGhpcy52YXJzLmxhenkgfHwgZm9yY2UpIHsgLy96ZXJvLWR1cmF0aW9uIHR3ZWVucyBhcmUgdHJpY2t5IGJlY2F1c2Ugd2UgbXVzdCBkaXNjZXJuIHRoZSBtb21lbnR1bS9kaXJlY3Rpb24gb2YgdGltZSBpbiBvcmRlciB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgc3RhcnRpbmcgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCBvciB0aGUgZW5kaW5nIHZhbHVlcy4gSWYgdGhlIFwicGxheWhlYWRcIiBvZiBpdHMgdGltZWxpbmUgZ29lcyBwYXN0IHRoZSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIGluIHRoZSBmb3J3YXJkIGRpcmVjdGlvbiBvciBsYW5kcyBkaXJlY3RseSBvbiBpdCwgdGhlIGVuZCB2YWx1ZXMgc2hvdWxkIGJlIHJlbmRlcmVkLCBidXQgaWYgdGhlIHRpbWVsaW5lJ3MgXCJwbGF5aGVhZFwiIG1vdmVzIHBhc3QgaXQgaW4gdGhlIGJhY2t3YXJkIGRpcmVjdGlvbiAoZnJvbSBhIHBvc3RpdGl2ZSB0aW1lIHRvIGEgbmVnYXRpdmUgdGltZSksIHRoZSBzdGFydGluZyB2YWx1ZXMgbXVzdCBiZSByZW5kZXJlZC5cblx0XHRcdFx0XHRpZiAodGhpcy5fc3RhcnRUaW1lID09PSB0aGlzLl90aW1lbGluZS5fZHVyYXRpb24pIHsgLy9pZiBhIHplcm8tZHVyYXRpb24gdHdlZW4gaXMgYXQgdGhlIFZFUlkgZW5kIG9mIGEgdGltZWxpbmUgYW5kIHRoYXQgdGltZWxpbmUgcmVuZGVycyBhdCBpdHMgZW5kLCBpdCB3aWxsIHR5cGljYWxseSBhZGQgYSB0aW55IGJpdCBvZiBjdXNoaW9uIHRvIHRoZSByZW5kZXIgdGltZSB0byBwcmV2ZW50IHJvdW5kaW5nIGVycm9ycyBmcm9tIGdldHRpbmcgaW4gdGhlIHdheSBvZiB0d2VlbnMgcmVuZGVyaW5nIHRoZWlyIFZFUlkgZW5kLiBJZiB3ZSB0aGVuIHJldmVyc2UoKSB0aGF0IHRpbWVsaW5lLCB0aGUgemVyby1kdXJhdGlvbiB0d2VlbiB3aWxsIHRyaWdnZXIgaXRzIG9uUmV2ZXJzZUNvbXBsZXRlIGV2ZW4gdGhvdWdoIHRlY2huaWNhbGx5IHRoZSBwbGF5aGVhZCBkaWRuJ3QgcGFzcyBvdmVyIGl0IGFnYWluLiBJdCdzIGEgdmVyeSBzcGVjaWZpYyBlZGdlIGNhc2Ugd2UgbXVzdCBhY2NvbW1vZGF0ZS5cblx0XHRcdFx0XHRcdHRpbWUgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocHJldlJhd1ByZXZUaW1lIDwgMCB8fCAodGltZSA8PSAwICYmIHRpbWUgPj0gLTAuMDAwMDAwMSkgfHwgKHByZXZSYXdQcmV2VGltZSA9PT0gX3RpbnlOdW0gJiYgdGhpcy5kYXRhICE9PSBcImlzUGF1c2VcIikpIGlmIChwcmV2UmF3UHJldlRpbWUgIT09IHRpbWUpIHsgLy9ub3RlOiB3aGVuIHRoaXMuZGF0YSBpcyBcImlzUGF1c2VcIiwgaXQncyBhIGNhbGxiYWNrIGFkZGVkIGJ5IGFkZFBhdXNlKCkgb24gYSB0aW1lbGluZSB0aGF0IHdlIHNob3VsZCBub3QgYmUgdHJpZ2dlcmVkIHdoZW4gTEVBVklORyBpdHMgZXhhY3Qgc3RhcnQgdGltZS4gSW4gb3RoZXIgd29yZHMsIHRsLmFkZFBhdXNlKDEpLnBsYXkoMSkgc2hvdWxkbid0IHBhdXNlLlxuXHRcdFx0XHRcdFx0Zm9yY2UgPSB0cnVlO1xuXHRcdFx0XHRcdFx0aWYgKHByZXZSYXdQcmV2VGltZSA+IF90aW55TnVtKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvblJldmVyc2VDb21wbGV0ZVwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IHJhd1ByZXZUaW1lID0gKCFzdXBwcmVzc0V2ZW50cyB8fCB0aW1lIHx8IHByZXZSYXdQcmV2VGltZSA9PT0gdGltZSkgPyB0aW1lIDogX3RpbnlOdW07IC8vd2hlbiB0aGUgcGxheWhlYWQgYXJyaXZlcyBhdCBFWEFDVExZIHRpbWUgMCAocmlnaHQgb24gdG9wKSBvZiBhIHplcm8tZHVyYXRpb24gdHdlZW4sIHdlIG5lZWQgdG8gZGlzY2VybiBpZiBldmVudHMgYXJlIHN1cHByZXNzZWQgc28gdGhhdCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBhZ2FpbiAobmV4dCB0aW1lKSwgaXQnbGwgdHJpZ2dlciB0aGUgY2FsbGJhY2suIElmIGV2ZW50cyBhcmUgTk9UIHN1cHByZXNzZWQsIG9idmlvdXNseSB0aGUgY2FsbGJhY2sgd291bGQgYmUgdHJpZ2dlcmVkIGluIHRoaXMgcmVuZGVyLiBCYXNpY2FsbHksIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZSBlaXRoZXIgd2hlbiB0aGUgcGxheWhlYWQgQVJSSVZFUyBvciBMRUFWRVMgdGhpcyBleGFjdCBzcG90LCBub3QgYm90aC4gSW1hZ2luZSBkb2luZyBhIHRpbWVsaW5lLnNlZWsoMCkgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayB0aGF0IHNpdHMgYXQgMC4gU2luY2UgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIG9uIHRoYXQgc2VlaygpIGJ5IGRlZmF1bHQsIG5vdGhpbmcgd2lsbCBmaXJlLCBidXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgb2ZmIG9mIHRoYXQgcG9zaXRpb24sIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZS4gVGhpcyBiZWhhdmlvciBpcyB3aGF0IHBlb3BsZSBpbnR1aXRpdmVseSBleHBlY3QuIFdlIHNldCB0aGUgX3Jhd1ByZXZUaW1lIHRvIGJlIGEgcHJlY2lzZSB0aW55IG51bWJlciB0byBpbmRpY2F0ZSB0aGlzIHNjZW5hcmlvIHJhdGhlciB0aGFuIHVzaW5nIGFub3RoZXIgcHJvcGVydHkvdmFyaWFibGUgd2hpY2ggd291bGQgaW5jcmVhc2UgbWVtb3J5IHVzYWdlLiBUaGlzIHRlY2huaXF1ZSBpcyBsZXNzIHJlYWRhYmxlLCBidXQgbW9yZSBlZmZpY2llbnQuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIGlmICh0aW1lIDwgMC4wMDAwMDAxKSB7IC8vdG8gd29yayBhcm91bmQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCBtYXRoIGFydGlmYWN0cywgcm91bmQgc3VwZXIgc21hbGwgdmFsdWVzIHRvIDAuXG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSAwO1xuXHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMCkgOiAwO1xuXHRcdFx0XHRpZiAocHJldlRpbWUgIT09IDAgfHwgKGR1cmF0aW9uID09PSAwICYmIHByZXZSYXdQcmV2VGltZSA+IDApKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0aXNDb21wbGV0ZSA9IHRoaXMuX3JldmVyc2VkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aW1lIDwgMCkge1xuXHRcdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdGlmIChkdXJhdGlvbiA9PT0gMCkgaWYgKHRoaXMuX2luaXR0ZWQgfHwgIXRoaXMudmFycy5sYXp5IHx8IGZvcmNlKSB7IC8vemVyby1kdXJhdGlvbiB0d2VlbnMgYXJlIHRyaWNreSBiZWNhdXNlIHdlIG11c3QgZGlzY2VybiB0aGUgbW9tZW50dW0vZGlyZWN0aW9uIG9mIHRpbWUgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHN0YXJ0aW5nIHZhbHVlcyBzaG91bGQgYmUgcmVuZGVyZWQgb3IgdGhlIGVuZGluZyB2YWx1ZXMuIElmIHRoZSBcInBsYXloZWFkXCIgb2YgaXRzIHRpbWVsaW5lIGdvZXMgcGFzdCB0aGUgemVyby1kdXJhdGlvbiB0d2VlbiBpbiB0aGUgZm9yd2FyZCBkaXJlY3Rpb24gb3IgbGFuZHMgZGlyZWN0bHkgb24gaXQsIHRoZSBlbmQgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCwgYnV0IGlmIHRoZSB0aW1lbGluZSdzIFwicGxheWhlYWRcIiBtb3ZlcyBwYXN0IGl0IGluIHRoZSBiYWNrd2FyZCBkaXJlY3Rpb24gKGZyb20gYSBwb3N0aXRpdmUgdGltZSB0byBhIG5lZ2F0aXZlIHRpbWUpLCB0aGUgc3RhcnRpbmcgdmFsdWVzIG11c3QgYmUgcmVuZGVyZWQuXG5cdFx0XHRcdFx0XHRpZiAocHJldlJhd1ByZXZUaW1lID49IDAgJiYgIShwcmV2UmF3UHJldlRpbWUgPT09IF90aW55TnVtICYmIHRoaXMuZGF0YSA9PT0gXCJpc1BhdXNlXCIpKSB7XG5cdFx0XHRcdFx0XHRcdGZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcmF3UHJldlRpbWUgPSAoIXN1cHByZXNzRXZlbnRzIHx8IHRpbWUgfHwgcHJldlJhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCF0aGlzLl9pbml0dGVkKSB7IC8vaWYgd2UgcmVuZGVyIHRoZSB2ZXJ5IGJlZ2lubmluZyAodGltZSA9PSAwKSBvZiBhIGZyb21UbygpLCB3ZSBtdXN0IGZvcmNlIHRoZSByZW5kZXIgKG5vcm1hbCB0d2VlbnMgd291bGRuJ3QgbmVlZCB0byByZW5kZXIgYXQgYSB0aW1lIG9mIDAgd2hlbiB0aGUgcHJldlRpbWUgd2FzIGFsc28gMCkuIFRoaXMgaXMgYWxzbyBtYW5kYXRvcnkgdG8gbWFrZSBzdXJlIG92ZXJ3cml0aW5nIGtpY2tzIGluIGltbWVkaWF0ZWx5LlxuXHRcdFx0XHRcdGZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IHRpbWU7XG5cblx0XHRcdFx0aWYgKHRoaXMuX2Vhc2VUeXBlKSB7XG5cdFx0XHRcdFx0dmFyIHIgPSB0aW1lIC8gZHVyYXRpb24sIHR5cGUgPSB0aGlzLl9lYXNlVHlwZSwgcG93ID0gdGhpcy5fZWFzZVBvd2VyO1xuXHRcdFx0XHRcdGlmICh0eXBlID09PSAxIHx8ICh0eXBlID09PSAzICYmIHIgPj0gMC41KSkge1xuXHRcdFx0XHRcdFx0ciA9IDEgLSByO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gMykge1xuXHRcdFx0XHRcdFx0ciAqPSAyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocG93ID09PSAxKSB7XG5cdFx0XHRcdFx0XHRyICo9IHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwb3cgPT09IDIpIHtcblx0XHRcdFx0XHRcdHIgKj0gciAqIHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwb3cgPT09IDMpIHtcblx0XHRcdFx0XHRcdHIgKj0gciAqIHIgKiByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocG93ID09PSA0KSB7XG5cdFx0XHRcdFx0XHRyICo9IHIgKiByICogciAqIHI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IDEpIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSAxIC0gcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IDIpIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGltZSAvIGR1cmF0aW9uIDwgMC41KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJhdGlvID0gciAvIDI7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSAxIC0gKHIgLyAyKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5nZXRSYXRpbyh0aW1lIC8gZHVyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl90aW1lID09PSBwcmV2VGltZSAmJiAhZm9yY2UpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIGlmICghdGhpcy5faW5pdHRlZCkge1xuXHRcdFx0XHR0aGlzLl9pbml0KCk7XG5cdFx0XHRcdGlmICghdGhpcy5faW5pdHRlZCB8fCB0aGlzLl9nYykgeyAvL2ltbWVkaWF0ZVJlbmRlciB0d2VlbnMgdHlwaWNhbGx5IHdvbid0IGluaXRpYWxpemUgdW50aWwgdGhlIHBsYXloZWFkIGFkdmFuY2VzIChfdGltZSBpcyBncmVhdGVyIHRoYW4gMCkgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgb3ZlcndyaXRpbmcgb2NjdXJzIHByb3Blcmx5LiBBbHNvLCBpZiBhbGwgb2YgdGhlIHR3ZWVuaW5nIHByb3BlcnRpZXMgaGF2ZSBiZWVuIG92ZXJ3cml0dGVuICh3aGljaCB3b3VsZCBjYXVzZSBfZ2MgdG8gYmUgdHJ1ZSwgYXMgc2V0IGluIF9pbml0KCkpLCB3ZSBzaG91bGRuJ3QgY29udGludWUgb3RoZXJ3aXNlIGFuIG9uU3RhcnQgY2FsbGJhY2sgY291bGQgYmUgY2FsbGVkIGZvciBleGFtcGxlLlxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fSBlbHNlIGlmICghZm9yY2UgJiYgdGhpcy5fZmlyc3RQVCAmJiAoKHRoaXMudmFycy5sYXp5ICE9PSBmYWxzZSAmJiB0aGlzLl9kdXJhdGlvbikgfHwgKHRoaXMudmFycy5sYXp5ICYmICF0aGlzLl9kdXJhdGlvbikpKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IHRoaXMuX3RvdGFsVGltZSA9IHByZXZUaW1lO1xuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcHJldlJhd1ByZXZUaW1lO1xuXHRcdFx0XHRcdF9sYXp5VHdlZW5zLnB1c2godGhpcyk7XG5cdFx0XHRcdFx0dGhpcy5fbGF6eSA9IFt0aW1lLCBzdXBwcmVzc0V2ZW50c107XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vX2Vhc2UgaXMgaW5pdGlhbGx5IHNldCB0byBkZWZhdWx0RWFzZSwgc28gbm93IHRoYXQgaW5pdCgpIGhhcyBydW4sIF9lYXNlIGlzIHNldCBwcm9wZXJseSBhbmQgd2UgbmVlZCB0byByZWNhbGN1bGF0ZSB0aGUgcmF0aW8uIE92ZXJhbGwgdGhpcyBpcyBmYXN0ZXIgdGhhbiB1c2luZyBjb25kaXRpb25hbCBsb2dpYyBlYXJsaWVyIGluIHRoZSBtZXRob2QgdG8gYXZvaWQgaGF2aW5nIHRvIHNldCByYXRpbyB0d2ljZSBiZWNhdXNlIHdlIG9ubHkgaW5pdCgpIG9uY2UgYnV0IHJlbmRlclRpbWUoKSBnZXRzIGNhbGxlZCBWRVJZIGZyZXF1ZW50bHkuXG5cdFx0XHRcdGlmICh0aGlzLl90aW1lICYmICFpc0NvbXBsZXRlKSB7XG5cdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHRoaXMuX2Vhc2UuZ2V0UmF0aW8odGhpcy5fdGltZSAvIGR1cmF0aW9uKTtcblx0XHRcdFx0fSBlbHNlIGlmIChpc0NvbXBsZXRlICYmIHRoaXMuX2Vhc2UuX2NhbGNFbmQpIHtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5nZXRSYXRpbygodGhpcy5fdGltZSA9PT0gMCkgPyAwIDogMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9sYXp5ICE9PSBmYWxzZSkgeyAvL2luIGNhc2UgYSBsYXp5IHJlbmRlciBpcyBwZW5kaW5nLCB3ZSBzaG91bGQgZmx1c2ggaXQgYmVjYXVzZSB0aGUgbmV3IHJlbmRlciBpcyBvY2N1cnJpbmcgbm93IChpbWFnaW5lIGEgbGF6eSB0d2VlbiBpbnN0YW50aWF0aW5nIGFuZCB0aGVuIGltbWVkaWF0ZWx5IHRoZSB1c2VyIGNhbGxzIHR3ZWVuLnNlZWsodHdlZW4uZHVyYXRpb24oKSksIHNraXBwaW5nIHRvIHRoZSBlbmQgLSB0aGUgZW5kIHJlbmRlciB3b3VsZCBiZSBmb3JjZWQsIGFuZCB0aGVuIGlmIHdlIGRpZG4ndCBmbHVzaCB0aGUgbGF6eSByZW5kZXIsIGl0J2QgZmlyZSBBRlRFUiB0aGUgc2VlaygpLCByZW5kZXJpbmcgaXQgYXQgdGhlIHdyb25nIHRpbWUuXG5cdFx0XHRcdHRoaXMuX2xhenkgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICghdGhpcy5fYWN0aXZlKSBpZiAoIXRoaXMuX3BhdXNlZCAmJiB0aGlzLl90aW1lICE9PSBwcmV2VGltZSAmJiB0aW1lID49IDApIHtcblx0XHRcdFx0dGhpcy5fYWN0aXZlID0gdHJ1ZTsgIC8vc28gdGhhdCBpZiB0aGUgdXNlciByZW5kZXJzIGEgdHdlZW4gKGFzIG9wcG9zZWQgdG8gdGhlIHRpbWVsaW5lIHJlbmRlcmluZyBpdCksIHRoZSB0aW1lbGluZSBpcyBmb3JjZWQgdG8gcmUtcmVuZGVyIGFuZCBhbGlnbiBpdCB3aXRoIHRoZSBwcm9wZXIgdGltZS9mcmFtZSBvbiB0aGUgbmV4dCByZW5kZXJpbmcgY3ljbGUuIE1heWJlIHRoZSB0d2VlbiBhbHJlYWR5IGZpbmlzaGVkIGJ1dCB0aGUgdXNlciBtYW51YWxseSByZS1yZW5kZXJzIGl0IGFzIGhhbGZ3YXkgZG9uZS5cblx0XHRcdH1cblx0XHRcdGlmIChwcmV2VGltZSA9PT0gMCkge1xuXHRcdFx0XHRpZiAodGhpcy5fc3RhcnRBdCkge1xuXHRcdFx0XHRcdGlmICh0aW1lID49IDApIHtcblx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQucmVuZGVyKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICghY2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrID0gXCJfZHVtbXlHU1wiOyAvL2lmIG5vIGNhbGxiYWNrIGlzIGRlZmluZWQsIHVzZSBhIGR1bW15IHZhbHVlIGp1c3Qgc28gdGhhdCB0aGUgY29uZGl0aW9uIGF0IHRoZSBlbmQgZXZhbHVhdGVzIGFzIHRydWUgYmVjYXVzZSBfc3RhcnRBdCBzaG91bGQgcmVuZGVyIEFGVEVSIHRoZSBub3JtYWwgcmVuZGVyIGxvb3Agd2hlbiB0aGUgdGltZSBpcyBuZWdhdGl2ZS4gV2UgY291bGQgaGFuZGxlIHRoaXMgaW4gYSBtb3JlIGludHVpdGl2ZSB3YXksIG9mIGNvdXJzZSwgYnV0IHRoZSByZW5kZXIgbG9vcCBpcyB0aGUgTU9TVCBpbXBvcnRhbnQgdGhpbmcgdG8gb3B0aW1pemUsIHNvIHRoaXMgdGVjaG5pcXVlIGFsbG93cyB1cyB0byBhdm9pZCBhZGRpbmcgZXh0cmEgY29uZGl0aW9uYWwgbG9naWMgaW4gYSBoaWdoLWZyZXF1ZW5jeSBhcmVhLlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy52YXJzLm9uU3RhcnQpIGlmICh0aGlzLl90aW1lICE9PSAwIHx8IGR1cmF0aW9uID09PSAwKSBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblN0YXJ0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0aWYgKHB0LmYpIHtcblx0XHRcdFx0XHRwdC50W3B0LnBdKHB0LmMgKiB0aGlzLnJhdGlvICsgcHQucyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LmMgKiB0aGlzLnJhdGlvICsgcHQucztcblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fb25VcGRhdGUpIHtcblx0XHRcdFx0aWYgKHRpbWUgPCAwKSBpZiAodGhpcy5fc3RhcnRBdCAmJiB0aW1lICE9PSAtMC4wMDAxKSB7IC8vaWYgdGhlIHR3ZWVuIGlzIHBvc2l0aW9uZWQgYXQgdGhlIFZFUlkgYmVnaW5uaW5nIChfc3RhcnRUaW1lIDApIG9mIGl0cyBwYXJlbnQgdGltZWxpbmUsIGl0J3MgaWxsZWdhbCBmb3IgdGhlIHBsYXloZWFkIHRvIGdvIGJhY2sgZnVydGhlciwgc28gd2Ugc2hvdWxkIG5vdCByZW5kZXIgdGhlIHJlY29yZGVkIHN0YXJ0QXQgdmFsdWVzLlxuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQucmVuZGVyKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7IC8vbm90ZTogZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHdlIHR1Y2sgdGhpcyBjb25kaXRpb25hbCBsb2dpYyBpbnNpZGUgbGVzcyB0cmF2ZWxlZCBhcmVhcyAobW9zdCB0d2VlbnMgZG9uJ3QgaGF2ZSBhbiBvblVwZGF0ZSkuIFdlJ2QganVzdCBoYXZlIGl0IGF0IHRoZSBlbmQgYmVmb3JlIHRoZSBvbkNvbXBsZXRlLCBidXQgdGhlIHZhbHVlcyBzaG91bGQgYmUgdXBkYXRlZCBiZWZvcmUgYW55IG9uVXBkYXRlIGlzIGNhbGxlZCwgc28gd2UgQUxTTyBwdXQgaXQgaGVyZSBhbmQgdGhlbiBpZiBpdCdzIG5vdCBjYWxsZWQsIHdlIGRvIHNvIGxhdGVyIG5lYXIgdGhlIG9uQ29tcGxldGUuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFzdXBwcmVzc0V2ZW50cykgaWYgKHRoaXMuX3RpbWUgIT09IHByZXZUaW1lIHx8IGlzQ29tcGxldGUpIHtcblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uVXBkYXRlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2FsbGJhY2spIGlmICghdGhpcy5fZ2MgfHwgZm9yY2UpIHsgLy9jaGVjayBfZ2MgYmVjYXVzZSB0aGVyZSdzIGEgY2hhbmNlIHRoYXQga2lsbCgpIGNvdWxkIGJlIGNhbGxlZCBpbiBhbiBvblVwZGF0ZVxuXHRcdFx0XHRpZiAodGltZSA8IDAgJiYgdGhpcy5fc3RhcnRBdCAmJiAhdGhpcy5fb25VcGRhdGUgJiYgdGltZSAhPT0gLTAuMDAwMSkgeyAvLy0wLjAwMDEgaXMgYSBzcGVjaWFsIHZhbHVlIHRoYXQgd2UgdXNlIHdoZW4gbG9vcGluZyBiYWNrIHRvIHRoZSBiZWdpbm5pbmcgb2YgYSByZXBlYXRlZCBUaW1lbGluZU1heCwgaW4gd2hpY2ggY2FzZSB3ZSBzaG91bGRuJ3QgcmVuZGVyIHRoZSBfc3RhcnRBdCB2YWx1ZXMuXG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIodGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaXNDb21wbGV0ZSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFzdXBwcmVzc0V2ZW50cyAmJiB0aGlzLnZhcnNbY2FsbGJhY2tdKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soY2FsbGJhY2spO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkdXJhdGlvbiA9PT0gMCAmJiB0aGlzLl9yYXdQcmV2VGltZSA9PT0gX3RpbnlOdW0gJiYgcmF3UHJldlRpbWUgIT09IF90aW55TnVtKSB7IC8vdGhlIG9uQ29tcGxldGUgb3Igb25SZXZlcnNlQ29tcGxldGUgY291bGQgdHJpZ2dlciBtb3ZlbWVudCBvZiB0aGUgcGxheWhlYWQgYW5kIGZvciB6ZXJvLWR1cmF0aW9uIHR3ZWVucyAod2hpY2ggbXVzdCBkaXNjZXJuIGRpcmVjdGlvbikgdGhhdCBsYW5kIGRpcmVjdGx5IGJhY2sgb24gdGhlaXIgc3RhcnQgdGltZSwgd2UgZG9uJ3Qgd2FudCB0byBmaXJlIGFnYWluIG9uIHRoZSBuZXh0IHJlbmRlci4gVGhpbmsgb2Ygc2V2ZXJhbCBhZGRQYXVzZSgpJ3MgaW4gYSB0aW1lbGluZSB0aGF0IGZvcmNlcyB0aGUgcGxheWhlYWQgdG8gYSBjZXJ0YWluIHNwb3QsIGJ1dCB3aGF0IGlmIGl0J3MgYWxyZWFkeSBwYXVzZWQgYW5kIGFub3RoZXIgdHdlZW4gaXMgdHdlZW5pbmcgdGhlIFwidGltZVwiIG9mIHRoZSB0aW1lbGluZT8gRWFjaCB0aW1lIGl0IG1vdmVzIFtmb3J3YXJkXSBwYXN0IHRoYXQgc3BvdCwgaXQgd291bGQgbW92ZSBiYWNrLCBhbmQgc2luY2Ugc3VwcHJlc3NFdmVudHMgaXMgdHJ1ZSwgaXQnZCByZXNldCBfcmF3UHJldlRpbWUgdG8gX3RpbnlOdW0gc28gdGhhdCB3aGVuIGl0IGJlZ2lucyBhZ2FpbiwgdGhlIGNhbGxiYWNrIHdvdWxkIGZpcmUgKHNvIHVsdGltYXRlbHkgaXQgY291bGQgYm91bmNlIGJhY2sgYW5kIGZvcnRoIGR1cmluZyB0aGF0IHR3ZWVuKS4gQWdhaW4sIHRoaXMgaXMgYSB2ZXJ5IHVuY29tbW9uIHNjZW5hcmlvLCBidXQgcG9zc2libGUgbm9uZXRoZWxlc3MuXG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHAuX2tpbGwgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXQsIG92ZXJ3cml0aW5nVHdlZW4pIHtcblx0XHRcdGlmICh2YXJzID09PSBcImFsbFwiKSB7XG5cdFx0XHRcdHZhcnMgPSBudWxsO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhcnMgPT0gbnVsbCkgaWYgKHRhcmdldCA9PSBudWxsIHx8IHRhcmdldCA9PT0gdGhpcy50YXJnZXQpIHtcblx0XHRcdFx0dGhpcy5fbGF6eSA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0dGFyZ2V0ID0gKHR5cGVvZih0YXJnZXQpICE9PSBcInN0cmluZ1wiKSA/ICh0YXJnZXQgfHwgdGhpcy5fdGFyZ2V0cyB8fCB0aGlzLnRhcmdldCkgOiBUd2VlbkxpdGUuc2VsZWN0b3IodGFyZ2V0KSB8fCB0YXJnZXQ7XG5cdFx0XHR2YXIgc2ltdWx0YW5lb3VzT3ZlcndyaXRlID0gKG92ZXJ3cml0aW5nVHdlZW4gJiYgdGhpcy5fdGltZSAmJiBvdmVyd3JpdGluZ1R3ZWVuLl9zdGFydFRpbWUgPT09IHRoaXMuX3N0YXJ0VGltZSAmJiB0aGlzLl90aW1lbGluZSA9PT0gb3ZlcndyaXRpbmdUd2Vlbi5fdGltZWxpbmUpLFxuXHRcdFx0XHRpLCBvdmVyd3JpdHRlblByb3BzLCBwLCBwdCwgcHJvcExvb2t1cCwgY2hhbmdlZCwga2lsbFByb3BzLCByZWNvcmQsIGtpbGxlZDtcblx0XHRcdGlmICgoX2lzQXJyYXkodGFyZ2V0KSB8fCBfaXNTZWxlY3Rvcih0YXJnZXQpKSAmJiB0eXBlb2YodGFyZ2V0WzBdKSAhPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRpID0gdGFyZ2V0Lmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2tpbGwodmFycywgdGFyZ2V0W2ldLCBvdmVyd3JpdGluZ1R3ZWVuKSkge1xuXHRcdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAodGhpcy5fdGFyZ2V0cykge1xuXHRcdFx0XHRcdGkgPSB0aGlzLl90YXJnZXRzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmICh0YXJnZXQgPT09IHRoaXMuX3RhcmdldHNbaV0pIHtcblx0XHRcdFx0XHRcdFx0cHJvcExvb2t1cCA9IHRoaXMuX3Byb3BMb29rdXBbaV0gfHwge307XG5cdFx0XHRcdFx0XHRcdHRoaXMuX292ZXJ3cml0dGVuUHJvcHMgPSB0aGlzLl9vdmVyd3JpdHRlblByb3BzIHx8IFtdO1xuXHRcdFx0XHRcdFx0XHRvdmVyd3JpdHRlblByb3BzID0gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wc1tpXSA9IHZhcnMgPyB0aGlzLl9vdmVyd3JpdHRlblByb3BzW2ldIHx8IHt9IDogXCJhbGxcIjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHRhcmdldCAhPT0gdGhpcy50YXJnZXQpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cHJvcExvb2t1cCA9IHRoaXMuX3Byb3BMb29rdXA7XG5cdFx0XHRcdFx0b3ZlcndyaXR0ZW5Qcm9wcyA9IHRoaXMuX292ZXJ3cml0dGVuUHJvcHMgPSB2YXJzID8gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyB8fCB7fSA6IFwiYWxsXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAocHJvcExvb2t1cCkge1xuXHRcdFx0XHRcdGtpbGxQcm9wcyA9IHZhcnMgfHwgcHJvcExvb2t1cDtcblx0XHRcdFx0XHRyZWNvcmQgPSAodmFycyAhPT0gb3ZlcndyaXR0ZW5Qcm9wcyAmJiBvdmVyd3JpdHRlblByb3BzICE9PSBcImFsbFwiICYmIHZhcnMgIT09IHByb3BMb29rdXAgJiYgKHR5cGVvZih2YXJzKSAhPT0gXCJvYmplY3RcIiB8fCAhdmFycy5fdGVtcEtpbGwpKTsgLy9fdGVtcEtpbGwgaXMgYSBzdXBlci1zZWNyZXQgd2F5IHRvIGRlbGV0ZSBhIHBhcnRpY3VsYXIgdHdlZW5pbmcgcHJvcGVydHkgYnV0IE5PVCBoYXZlIGl0IHJlbWVtYmVyZWQgYXMgYW4gb2ZmaWNpYWwgb3ZlcndyaXR0ZW4gcHJvcGVydHkgKGxpa2UgaW4gQmV6aWVyUGx1Z2luKVxuXHRcdFx0XHRcdGlmIChvdmVyd3JpdGluZ1R3ZWVuICYmIChUd2VlbkxpdGUub25PdmVyd3JpdGUgfHwgdGhpcy52YXJzLm9uT3ZlcndyaXRlKSkge1xuXHRcdFx0XHRcdFx0Zm9yIChwIGluIGtpbGxQcm9wcykge1xuXHRcdFx0XHRcdFx0XHRpZiAocHJvcExvb2t1cFtwXSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICgha2lsbGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRraWxsZWQgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0a2lsbGVkLnB1c2gocCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICgoa2lsbGVkIHx8ICF2YXJzKSAmJiAhX29uT3ZlcndyaXRlKHRoaXMsIG92ZXJ3cml0aW5nVHdlZW4sIHRhcmdldCwga2lsbGVkKSkgeyAvL2lmIHRoZSBvbk92ZXJ3cml0ZSByZXR1cm5lZCBmYWxzZSwgdGhhdCBtZWFucyB0aGUgdXNlciB3YW50cyB0byBvdmVycmlkZSB0aGUgb3ZlcndyaXRpbmcgKGNhbmNlbCBpdCkuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IgKHAgaW4ga2lsbFByb3BzKSB7XG5cdFx0XHRcdFx0XHRpZiAoKHB0ID0gcHJvcExvb2t1cFtwXSkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNpbXVsdGFuZW91c092ZXJ3cml0ZSkgeyAvL2lmIGFub3RoZXIgdHdlZW4gb3ZlcndyaXRlcyB0aGlzIG9uZSBhbmQgdGhleSBib3RoIHN0YXJ0IGF0IGV4YWN0bHkgdGhlIHNhbWUgdGltZSwgeWV0IHRoaXMgdHdlZW4gaGFzIGFscmVhZHkgcmVuZGVyZWQgb25jZSAoZm9yIGV4YW1wbGUsIGF0IDAuMDAxKSBiZWNhdXNlIGl0J3MgZmlyc3QgaW4gdGhlIHF1ZXVlLCB3ZSBzaG91bGQgcmV2ZXJ0IHRoZSB2YWx1ZXMgdG8gd2hlcmUgdGhleSB3ZXJlIGF0IDAgc28gdGhhdCB0aGUgc3RhcnRpbmcgdmFsdWVzIGFyZW4ndCBjb250YW1pbmF0ZWQgb24gdGhlIG92ZXJ3cml0aW5nIHR3ZWVuLlxuXHRcdFx0XHRcdFx0XHRcdGlmIChwdC5mKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdKHB0LnMpO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQucztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKHB0LnBnICYmIHB0LnQuX2tpbGwoa2lsbFByb3BzKSkge1xuXHRcdFx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlOyAvL3NvbWUgcGx1Z2lucyBuZWVkIHRvIGJlIG5vdGlmaWVkIHNvIHRoZXkgY2FuIHBlcmZvcm0gY2xlYW51cCB0YXNrcyBmaXJzdFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICghcHQucGcgfHwgcHQudC5fb3ZlcndyaXRlUHJvcHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHB0Ll9wcmV2KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocHQgPT09IHRoaXMuX2ZpcnN0UFQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHB0Ll9uZXh0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwdC5fbmV4dC5fcHJldiA9IHB0Ll9wcmV2O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRwdC5fbmV4dCA9IHB0Ll9wcmV2ID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRkZWxldGUgcHJvcExvb2t1cFtwXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChyZWNvcmQpIHtcblx0XHRcdFx0XHRcdFx0b3ZlcndyaXR0ZW5Qcm9wc1twXSA9IDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghdGhpcy5fZmlyc3RQVCAmJiB0aGlzLl9pbml0dGVkKSB7IC8vaWYgYWxsIHR3ZWVuaW5nIHByb3BlcnRpZXMgYXJlIGtpbGxlZCwga2lsbCB0aGUgdHdlZW4uIFdpdGhvdXQgdGhpcyBsaW5lLCBpZiB0aGVyZSdzIGEgdHdlZW4gd2l0aCBtdWx0aXBsZSB0YXJnZXRzIGFuZCB0aGVuIHlvdSBraWxsVHdlZW5zT2YoKSBlYWNoIHRhcmdldCBpbmRpdmlkdWFsbHksIHRoZSB0d2VlbiB3b3VsZCB0ZWNobmljYWxseSBzdGlsbCByZW1haW4gYWN0aXZlIGFuZCBmaXJlIGl0cyBvbkNvbXBsZXRlIGV2ZW4gdGhvdWdoIHRoZXJlIGFyZW4ndCBhbnkgbW9yZSBwcm9wZXJ0aWVzIHR3ZWVuaW5nLlxuXHRcdFx0XHRcdFx0dGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0fTtcblxuXHRcdHAuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQpIHtcblx0XHRcdFx0VHdlZW5MaXRlLl9vblBsdWdpbkV2ZW50KFwiX29uRGlzYWJsZVwiLCB0aGlzKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2ZpcnN0UFQgPSB0aGlzLl9vdmVyd3JpdHRlblByb3BzID0gdGhpcy5fc3RhcnRBdCA9IHRoaXMuX29uVXBkYXRlID0gbnVsbDtcblx0XHRcdHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQgPSB0aGlzLl9hY3RpdmUgPSB0aGlzLl9sYXp5ID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9wcm9wTG9va3VwID0gKHRoaXMuX3RhcmdldHMpID8ge30gOiBbXTtcblx0XHRcdEFuaW1hdGlvbi5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpO1xuXHRcdFx0aWYgKHRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXIpIHtcblx0XHRcdFx0dGhpcy5fdGltZSA9IC1fdGlueU51bTsgLy9mb3JjZXMgYSByZW5kZXIgd2l0aG91dCBoYXZpbmcgdG8gc2V0IHRoZSByZW5kZXIoKSBcImZvcmNlXCIgcGFyYW1ldGVyIHRvIHRydWUgYmVjYXVzZSB3ZSB3YW50IHRvIGFsbG93IGxhenlpbmcgYnkgZGVmYXVsdCAodXNpbmcgdGhlIFwiZm9yY2VcIiBwYXJhbWV0ZXIgYWx3YXlzIGZvcmNlcyBhbiBpbW1lZGlhdGUgZnVsbCByZW5kZXIpXG5cdFx0XHRcdHRoaXMucmVuZGVyKC10aGlzLl9kZWxheSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5fZW5hYmxlZCA9IGZ1bmN0aW9uKGVuYWJsZWQsIGlnbm9yZVRpbWVsaW5lKSB7XG5cdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHtcblx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZW5hYmxlZCAmJiB0aGlzLl9nYykge1xuXHRcdFx0XHR2YXIgdGFyZ2V0cyA9IHRoaXMuX3RhcmdldHMsXG5cdFx0XHRcdFx0aTtcblx0XHRcdFx0aWYgKHRhcmdldHMpIHtcblx0XHRcdFx0XHRpID0gdGFyZ2V0cy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zaWJsaW5nc1tpXSA9IF9yZWdpc3Rlcih0YXJnZXRzW2ldLCB0aGlzLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fc2libGluZ3MgPSBfcmVnaXN0ZXIodGhpcy50YXJnZXQsIHRoaXMsIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRBbmltYXRpb24ucHJvdG90eXBlLl9lbmFibGVkLmNhbGwodGhpcywgZW5hYmxlZCwgaWdub3JlVGltZWxpbmUpO1xuXHRcdFx0aWYgKHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQpIGlmICh0aGlzLl9maXJzdFBUKSB7XG5cdFx0XHRcdHJldHVybiBUd2VlbkxpdGUuX29uUGx1Z2luRXZlbnQoKGVuYWJsZWQgPyBcIl9vbkVuYWJsZVwiIDogXCJfb25EaXNhYmxlXCIpLCB0aGlzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cbi8vLS0tLVR3ZWVuTGl0ZSBzdGF0aWMgbWV0aG9kcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0VHdlZW5MaXRlLnRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUodGFyZ2V0LCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5mcm9tID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycykge1xuXHRcdFx0dmFycy5ydW5CYWNrd2FyZHMgPSB0cnVlO1xuXHRcdFx0dmFycy5pbW1lZGlhdGVSZW5kZXIgPSAodmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UpO1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUodGFyZ2V0LCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5mcm9tVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCBmcm9tVmFycywgdG9WYXJzKSB7XG5cdFx0XHR0b1ZhcnMuc3RhcnRBdCA9IGZyb21WYXJzO1xuXHRcdFx0dG9WYXJzLmltbWVkaWF0ZVJlbmRlciA9ICh0b1ZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlICYmIGZyb21WYXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSk7XG5cdFx0XHRyZXR1cm4gbmV3IFR3ZWVuTGl0ZSh0YXJnZXQsIGR1cmF0aW9uLCB0b1ZhcnMpO1xuXHRcdH07XG5cblx0XHRUd2VlbkxpdGUuZGVsYXllZENhbGwgPSBmdW5jdGlvbihkZWxheSwgY2FsbGJhY2ssIHBhcmFtcywgc2NvcGUsIHVzZUZyYW1lcykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUoY2FsbGJhY2ssIDAsIHtkZWxheTpkZWxheSwgb25Db21wbGV0ZTpjYWxsYmFjaywgb25Db21wbGV0ZVBhcmFtczpwYXJhbXMsIGNhbGxiYWNrU2NvcGU6c2NvcGUsIG9uUmV2ZXJzZUNvbXBsZXRlOmNhbGxiYWNrLCBvblJldmVyc2VDb21wbGV0ZVBhcmFtczpwYXJhbXMsIGltbWVkaWF0ZVJlbmRlcjpmYWxzZSwgbGF6eTpmYWxzZSwgdXNlRnJhbWVzOnVzZUZyYW1lcywgb3ZlcndyaXRlOjB9KTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLnNldCA9IGZ1bmN0aW9uKHRhcmdldCwgdmFycykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUodGFyZ2V0LCAwLCB2YXJzKTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLmdldFR3ZWVuc09mID0gZnVuY3Rpb24odGFyZ2V0LCBvbmx5QWN0aXZlKSB7XG5cdFx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHsgcmV0dXJuIFtdOyB9XG5cdFx0XHR0YXJnZXQgPSAodHlwZW9mKHRhcmdldCkgIT09IFwic3RyaW5nXCIpID8gdGFyZ2V0IDogVHdlZW5MaXRlLnNlbGVjdG9yKHRhcmdldCkgfHwgdGFyZ2V0O1xuXHRcdFx0dmFyIGksIGEsIGosIHQ7XG5cdFx0XHRpZiAoKF9pc0FycmF5KHRhcmdldCkgfHwgX2lzU2VsZWN0b3IodGFyZ2V0KSkgJiYgdHlwZW9mKHRhcmdldFswXSkgIT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0aSA9IHRhcmdldC5sZW5ndGg7XG5cdFx0XHRcdGEgPSBbXTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0YSA9IGEuY29uY2F0KFR3ZWVuTGl0ZS5nZXRUd2VlbnNPZih0YXJnZXRbaV0sIG9ubHlBY3RpdmUpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdC8vbm93IGdldCByaWQgb2YgYW55IGR1cGxpY2F0ZXMgKHR3ZWVucyBvZiBhcnJheXMgb2Ygb2JqZWN0cyBjb3VsZCBjYXVzZSBkdXBsaWNhdGVzKVxuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHR0ID0gYVtpXTtcblx0XHRcdFx0XHRqID0gaTtcblx0XHRcdFx0XHR3aGlsZSAoLS1qID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmICh0ID09PSBhW2pdKSB7XG5cdFx0XHRcdFx0XHRcdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YSA9IF9yZWdpc3Rlcih0YXJnZXQpLmNvbmNhdCgpO1xuXHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmIChhW2ldLl9nYyB8fCAob25seUFjdGl2ZSAmJiAhYVtpXS5pc0FjdGl2ZSgpKSkge1xuXHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLmtpbGxUd2VlbnNPZiA9IFR3ZWVuTGl0ZS5raWxsRGVsYXllZENhbGxzVG8gPSBmdW5jdGlvbih0YXJnZXQsIG9ubHlBY3RpdmUsIHZhcnMpIHtcblx0XHRcdGlmICh0eXBlb2Yob25seUFjdGl2ZSkgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0dmFycyA9IG9ubHlBY3RpdmU7IC8vZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IChiZWZvcmUgXCJvbmx5QWN0aXZlXCIgcGFyYW1ldGVyIHdhcyBpbnNlcnRlZClcblx0XHRcdFx0b25seUFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGEgPSBUd2VlbkxpdGUuZ2V0VHdlZW5zT2YodGFyZ2V0LCBvbmx5QWN0aXZlKSxcblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGFbaV0uX2tpbGwodmFycywgdGFyZ2V0KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFR3ZWVuUGx1Z2luICAgKGNvdWxkIGVhc2lseSBiZSBzcGxpdCBvdXQgYXMgYSBzZXBhcmF0ZSBmaWxlL2NsYXNzLCBidXQgaW5jbHVkZWQgZm9yIGVhc2Ugb2YgdXNlIChzbyB0aGF0IHBlb3BsZSBkb24ndCBuZWVkIHRvIGluY2x1ZGUgYW5vdGhlciBzY3JpcHQgY2FsbCBiZWZvcmUgbG9hZGluZyBwbHVnaW5zIHdoaWNoIGlzIGVhc3kgdG8gZm9yZ2V0KVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIFR3ZWVuUGx1Z2luID0gX2NsYXNzKFwicGx1Z2lucy5Ud2VlblBsdWdpblwiLCBmdW5jdGlvbihwcm9wcywgcHJpb3JpdHkpIHtcblx0XHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcyA9IChwcm9wcyB8fCBcIlwiKS5zcGxpdChcIixcIik7XG5cdFx0XHRcdFx0dGhpcy5fcHJvcE5hbWUgPSB0aGlzLl9vdmVyd3JpdGVQcm9wc1swXTtcblx0XHRcdFx0XHR0aGlzLl9wcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0XHRcdFx0dGhpcy5fc3VwZXIgPSBUd2VlblBsdWdpbi5wcm90b3R5cGU7XG5cdFx0XHRcdH0sIHRydWUpO1xuXG5cdFx0cCA9IFR3ZWVuUGx1Z2luLnByb3RvdHlwZTtcblx0XHRUd2VlblBsdWdpbi52ZXJzaW9uID0gXCIxLjE4LjBcIjtcblx0XHRUd2VlblBsdWdpbi5BUEkgPSAyO1xuXHRcdHAuX2ZpcnN0UFQgPSBudWxsO1xuXHRcdHAuX2FkZFR3ZWVuID0gX2FkZFByb3BUd2Vlbjtcblx0XHRwLnNldFJhdGlvID0gX3NldFJhdGlvO1xuXG5cdFx0cC5fa2lsbCA9IGZ1bmN0aW9uKGxvb2t1cCkge1xuXHRcdFx0dmFyIGEgPSB0aGlzLl9vdmVyd3JpdGVQcm9wcyxcblx0XHRcdFx0cHQgPSB0aGlzLl9maXJzdFBULFxuXHRcdFx0XHRpO1xuXHRcdFx0aWYgKGxvb2t1cFt0aGlzLl9wcm9wTmFtZV0gIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcyA9IFtdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRpZiAobG9va3VwW2FbaV1dICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdGlmIChsb29rdXBbcHQubl0gIT0gbnVsbCkge1xuXHRcdFx0XHRcdGlmIChwdC5fbmV4dCkge1xuXHRcdFx0XHRcdFx0cHQuX25leHQuX3ByZXYgPSBwdC5fcHJldjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHB0Ll9wcmV2KSB7XG5cdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdFx0cHQuX3ByZXYgPSBudWxsO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fZmlyc3RQVCA9PT0gcHQpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdFx0cC5fcm91bmRQcm9wcyA9IGZ1bmN0aW9uKGxvb2t1cCwgdmFsdWUpIHtcblx0XHRcdHZhciBwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0aWYgKGxvb2t1cFt0aGlzLl9wcm9wTmFtZV0gfHwgKHB0Lm4gIT0gbnVsbCAmJiBsb29rdXBbIHB0Lm4uc3BsaXQodGhpcy5fcHJvcE5hbWUgKyBcIl9cIikuam9pbihcIlwiKSBdKSkgeyAvL3NvbWUgcHJvcGVydGllcyB0aGF0IGFyZSB2ZXJ5IHBsdWdpbi1zcGVjaWZpYyBhZGQgYSBwcmVmaXggbmFtZWQgYWZ0ZXIgdGhlIF9wcm9wTmFtZSBwbHVzIGFuIHVuZGVyc2NvcmUsIHNvIHdlIG5lZWQgdG8gaWdub3JlIHRoYXQgZXh0cmEgc3R1ZmYgaGVyZS5cblx0XHRcdFx0XHRwdC5yID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLl9vblBsdWdpbkV2ZW50ID0gZnVuY3Rpb24odHlwZSwgdHdlZW4pIHtcblx0XHRcdHZhciBwdCA9IHR3ZWVuLl9maXJzdFBULFxuXHRcdFx0XHRjaGFuZ2VkLCBwdDIsIGZpcnN0LCBsYXN0LCBuZXh0O1xuXHRcdFx0aWYgKHR5cGUgPT09IFwiX29uSW5pdEFsbFByb3BzXCIpIHtcblx0XHRcdFx0Ly9zb3J0cyB0aGUgUHJvcFR3ZWVuIGxpbmtlZCBsaXN0IGluIG9yZGVyIG9mIHByaW9yaXR5IGJlY2F1c2Ugc29tZSBwbHVnaW5zIG5lZWQgdG8gcmVuZGVyIGVhcmxpZXIvbGF0ZXIgdGhhbiBvdGhlcnMsIGxpa2UgTW90aW9uQmx1clBsdWdpbiBhcHBsaWVzIGl0cyBlZmZlY3RzIGFmdGVyIGFsbCB4L3kvYWxwaGEgdHdlZW5zIGhhdmUgcmVuZGVyZWQgb24gZWFjaCBmcmFtZS5cblx0XHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdFx0bmV4dCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdHB0MiA9IGZpcnN0O1xuXHRcdFx0XHRcdHdoaWxlIChwdDIgJiYgcHQyLnByID4gcHQucHIpIHtcblx0XHRcdFx0XHRcdHB0MiA9IHB0Mi5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKChwdC5fcHJldiA9IHB0MiA/IHB0Mi5fcHJldiA6IGxhc3QpKSB7XG5cdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IHB0O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRmaXJzdCA9IHB0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoKHB0Ll9uZXh0ID0gcHQyKSkge1xuXHRcdFx0XHRcdFx0cHQyLl9wcmV2ID0gcHQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxhc3QgPSBwdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cHQgPSBuZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gdHdlZW4uX2ZpcnN0UFQgPSBmaXJzdDtcblx0XHRcdH1cblx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRpZiAocHQucGcpIGlmICh0eXBlb2YocHQudFt0eXBlXSkgPT09IFwiZnVuY3Rpb25cIikgaWYgKHB0LnRbdHlwZV0oKSkge1xuXHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHR9O1xuXG5cdFx0VHdlZW5QbHVnaW4uYWN0aXZhdGUgPSBmdW5jdGlvbihwbHVnaW5zKSB7XG5cdFx0XHR2YXIgaSA9IHBsdWdpbnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGlmIChwbHVnaW5zW2ldLkFQSSA9PT0gVHdlZW5QbHVnaW4uQVBJKSB7XG5cdFx0XHRcdFx0X3BsdWdpbnNbKG5ldyBwbHVnaW5zW2ldKCkpLl9wcm9wTmFtZV0gPSBwbHVnaW5zW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9O1xuXG5cdFx0Ly9wcm92aWRlcyBhIG1vcmUgY29uY2lzZSB3YXkgdG8gZGVmaW5lIHBsdWdpbnMgdGhhdCBoYXZlIG5vIGRlcGVuZGVuY2llcyBiZXNpZGVzIFR3ZWVuUGx1Z2luIGFuZCBUd2VlbkxpdGUsIHdyYXBwaW5nIGNvbW1vbiBib2lsZXJwbGF0ZSBzdHVmZiBpbnRvIG9uZSBmdW5jdGlvbiAoYWRkZWQgaW4gMS45LjApLiBZb3UgZG9uJ3QgTkVFRCB0byB1c2UgdGhpcyB0byBkZWZpbmUgYSBwbHVnaW4gLSB0aGUgb2xkIHdheSBzdGlsbCB3b3JrcyBhbmQgY2FuIGJlIHVzZWZ1bCBpbiBjZXJ0YWluIChyYXJlKSBzaXR1YXRpb25zLlxuXHRcdF9nc0RlZmluZS5wbHVnaW4gPSBmdW5jdGlvbihjb25maWcpIHtcblx0XHRcdGlmICghY29uZmlnIHx8ICFjb25maWcucHJvcE5hbWUgfHwgIWNvbmZpZy5pbml0IHx8ICFjb25maWcuQVBJKSB7IHRocm93IFwiaWxsZWdhbCBwbHVnaW4gZGVmaW5pdGlvbi5cIjsgfVxuXHRcdFx0dmFyIHByb3BOYW1lID0gY29uZmlnLnByb3BOYW1lLFxuXHRcdFx0XHRwcmlvcml0eSA9IGNvbmZpZy5wcmlvcml0eSB8fCAwLFxuXHRcdFx0XHRvdmVyd3JpdGVQcm9wcyA9IGNvbmZpZy5vdmVyd3JpdGVQcm9wcyxcblx0XHRcdFx0bWFwID0ge2luaXQ6XCJfb25Jbml0VHdlZW5cIiwgc2V0Olwic2V0UmF0aW9cIiwga2lsbDpcIl9raWxsXCIsIHJvdW5kOlwiX3JvdW5kUHJvcHNcIiwgaW5pdEFsbDpcIl9vbkluaXRBbGxQcm9wc1wifSxcblx0XHRcdFx0UGx1Z2luID0gX2NsYXNzKFwicGx1Z2lucy5cIiArIHByb3BOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcE5hbWUuc3Vic3RyKDEpICsgXCJQbHVnaW5cIixcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFR3ZWVuUGx1Z2luLmNhbGwodGhpcywgcHJvcE5hbWUsIHByaW9yaXR5KTtcblx0XHRcdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzID0gb3ZlcndyaXRlUHJvcHMgfHwgW107XG5cdFx0XHRcdFx0fSwgKGNvbmZpZy5nbG9iYWwgPT09IHRydWUpKSxcblx0XHRcdFx0cCA9IFBsdWdpbi5wcm90b3R5cGUgPSBuZXcgVHdlZW5QbHVnaW4ocHJvcE5hbWUpLFxuXHRcdFx0XHRwcm9wO1xuXHRcdFx0cC5jb25zdHJ1Y3RvciA9IFBsdWdpbjtcblx0XHRcdFBsdWdpbi5BUEkgPSBjb25maWcuQVBJO1xuXHRcdFx0Zm9yIChwcm9wIGluIG1hcCkge1xuXHRcdFx0XHRpZiAodHlwZW9mKGNvbmZpZ1twcm9wXSkgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdHBbbWFwW3Byb3BdXSA9IGNvbmZpZ1twcm9wXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0UGx1Z2luLnZlcnNpb24gPSBjb25maWcudmVyc2lvbjtcblx0XHRcdFR3ZWVuUGx1Z2luLmFjdGl2YXRlKFtQbHVnaW5dKTtcblx0XHRcdHJldHVybiBQbHVnaW47XG5cdFx0fTtcblxuXG5cdFx0Ly9ub3cgcnVuIHRocm91Z2ggYWxsIHRoZSBkZXBlbmRlbmNpZXMgZGlzY292ZXJlZCBhbmQgaWYgYW55IGFyZSBtaXNzaW5nLCBsb2cgdGhhdCB0byB0aGUgY29uc29sZSBhcyBhIHdhcm5pbmcuIFRoaXMgaXMgd2h5IGl0J3MgYmVzdCB0byBoYXZlIFR3ZWVuTGl0ZSBsb2FkIGxhc3QgLSBpdCBjYW4gY2hlY2sgYWxsIHRoZSBkZXBlbmRlbmNpZXMgZm9yIHlvdS5cblx0XHRhID0gd2luZG93Ll9nc1F1ZXVlO1xuXHRcdGlmIChhKSB7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRhW2ldKCk7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHAgaW4gX2RlZkxvb2t1cCkge1xuXHRcdFx0XHRpZiAoIV9kZWZMb29rdXBbcF0uZnVuYykge1xuXHRcdFx0XHRcdHdpbmRvdy5jb25zb2xlLmxvZyhcIkdTQVAgZW5jb3VudGVyZWQgbWlzc2luZyBkZXBlbmRlbmN5OiBjb20uZ3JlZW5zb2NrLlwiICsgcCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRfdGlja2VyQWN0aXZlID0gZmFsc2U7IC8vZW5zdXJlcyB0aGF0IHRoZSBmaXJzdCBvZmZpY2lhbCBhbmltYXRpb24gZm9yY2VzIGEgdGlja2VyLnRpY2soKSB0byB1cGRhdGUgdGhlIHRpbWUgd2hlbiBpdCBpcyBpbnN0YW50aWF0ZWRcblxufSkoKHR5cGVvZihtb2R1bGUpICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzICYmIHR5cGVvZihnbG9iYWwpICE9PSBcInVuZGVmaW5lZFwiKSA/IGdsb2JhbCA6IHRoaXMgfHwgd2luZG93LCBcIlR3ZWVuTGl0ZVwiKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2dzYXAvc3JjL3VuY29tcHJlc3NlZC9Ud2VlbkxpdGUuanNcbiAqKiBtb2R1bGUgaWQgPSAzNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgaCA9IHJlcXVpcmUoJ3NuYWJiZG9tL2gnKTtcbnZhciBhYnlzc2FfMSA9IHJlcXVpcmUoJ2FieXNzYScpO1xudmFyIGRvbXB0ZXVzZV8xID0gcmVxdWlyZSgnZG9tcHRldXNlJyk7XG52YXIgYW5pbWF0aW9uXzEgPSByZXF1aXJlKCcuL2FuaW1hdGlvbicpO1xudmFyIGdyZWVuXzEgPSByZXF1aXJlKCcuL2dyZWVuJyk7XG52YXIgcmVkXzEgPSByZXF1aXJlKCcuL3JlZCcpO1xudmFyIGFjdGlvbl8xID0gcmVxdWlyZSgnLi9hY3Rpb24nKTtcbmZ1bmN0aW9uIGRlZmF1bHRfMSgpIHtcbiAgICByZXR1cm4gZG9tcHRldXNlXzEuY29tcG9uZW50KHtcbiAgICAgICAga2V5OiAnYmx1ZScsXG4gICAgICAgIHB1bGxTdGF0ZTogcHVsbFN0YXRlLFxuICAgICAgICByZW5kZXI6IHJlbmRlclxuICAgIH0pO1xufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZGVmYXVsdF8xO1xuO1xuZnVuY3Rpb24gcHVsbFN0YXRlKHN0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY291bnQ6IHN0YXRlLmJsdWUuY291bnQsXG4gICAgICAgIHJlZENvdW50OiBzdGF0ZS5ibHVlLnJlZC5jb3VudCxcbiAgICAgICAgcm91dGU6IHN0YXRlLnJvdXRlLmZ1bGxOYW1lLFxuICAgICAgICBpZDogc3RhdGUucm91dGUucGFyYW1zWydpZCddXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHJlbmRlcihvcHRpb25zKSB7XG4gICAgdmFyIHN0YXRlID0gb3B0aW9ucy5zdGF0ZTtcbiAgICB2YXIgaWQgPSBzdGF0ZS5pZCwgcm91dGUgPSBzdGF0ZS5yb3V0ZTtcbiAgICByZXR1cm4gaCgnZGl2I2JsdWUnLCB7IGhvb2s6IGFuaW1hdGlvbl8xLmNvbnRlbnRBbmltYXRpb24gfSwgW1xuICAgICAgICBoKCdoMScsICdCbHVlIHNjcmVlbicpLFxuICAgICAgICBoKCdhJywgeyBhdHRyczogeyBocmVmOiBhYnlzc2FfMS5hcGkubGluaygnYXBwLmJsdWUuZ3JlZW4nLCB7IGlkOiBpZCB9KSwgJ2RhdGEtbmF2JzogJ21vdXNlZG93bicgfSB9LCAnR3JlZW4nKSxcbiAgICAgICAgaCgnYScsIHsgYXR0cnM6IHsgaHJlZjogYWJ5c3NhXzEuYXBpLmxpbmsoJ2FwcC5ibHVlLnJlZCcsIHsgaWQ6IGlkIH0pLCAnZGF0YS1uYXYnOiAnbW91c2Vkb3duJyB9IH0sICdSZWQnKSxcbiAgICAgICAgaCgnZGl2LmluY3JlbWVudCcsIFtcbiAgICAgICAgICAgICdDb3VudDogJyArIHN0YXRlLmNvdW50LFxuICAgICAgICAgICAgaCgnYnV0dG9uJywgeyBvbjogeyBjbGljazogYWN0aW9uXzEuaW5jcmVtZW50Qmx1ZSB9IH0sICdJbmNyZW1lbnQnKVxuICAgICAgICBdKSxcbiAgICAgICAgaCgnc2VjdGlvbicsIGdldENoaWxkcmVuKHN0YXRlKSlcbiAgICBdKTtcbn1cbmZ1bmN0aW9uIGdldENoaWxkcmVuKHN0YXRlKSB7XG4gICAgdmFyIHJvdXRlID0gc3RhdGUucm91dGUsIHJlZENvdW50ID0gc3RhdGUucmVkQ291bnQ7XG4gICAgaWYgKHJvdXRlID09PSAnYXBwLmJsdWUnKVxuICAgICAgICByZXR1cm4gW2goJ3NwYW4nLCB7IGhvb2s6IGFuaW1hdGlvbl8xLmNvbnRlbnRBbmltYXRpb24gfSwgJ0kgYW0gYmx1ZScpXTtcbiAgICBpZiAocm91dGUgPT09ICdhcHAuYmx1ZS5ncmVlbicpXG4gICAgICAgIHJldHVybiBbZ3JlZW5fMS5kZWZhdWx0KCldO1xuICAgIGlmIChyb3V0ZSA9PT0gJ2FwcC5ibHVlLnJlZCcpXG4gICAgICAgIHJldHVybiBbcmVkXzEuZGVmYXVsdCh7IG9wZW5lZEJ5RGVmYXVsdDogdHJ1ZSB9KSwgcmVkXzEuZGVmYXVsdCgpXTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYmx1ZS50c1xuICoqIG1vZHVsZSBpZCA9IDM2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBoID0gcmVxdWlyZSgnc25hYmJkb20vaCcpO1xudmFyIGRvbXB0ZXVzZV8xID0gcmVxdWlyZSgnZG9tcHRldXNlJyk7XG52YXIgYW5pbWF0aW9uXzEgPSByZXF1aXJlKCcuL2FuaW1hdGlvbicpO1xuZnVuY3Rpb24gZGVmYXVsdF8xKCkge1xuICAgIHJldHVybiBkb21wdGV1c2VfMS5jb21wb25lbnQoe1xuICAgICAgICBrZXk6ICdncmVlbicsXG4gICAgICAgIHB1bGxTdGF0ZTogcHVsbFN0YXRlLFxuICAgICAgICByZW5kZXI6IHJlbmRlclxuICAgIH0pO1xufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZGVmYXVsdF8xO1xuO1xuZnVuY3Rpb24gcHVsbFN0YXRlKHN0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHN0YXRlLnJvdXRlLnBhcmFtc1snaWQnXVxuICAgIH07XG59XG5mdW5jdGlvbiByZW5kZXIob3B0aW9ucykge1xuICAgIHZhciBpZCA9IG9wdGlvbnMuc3RhdGUuaWQ7XG4gICAgcmV0dXJuIGgoJ2RpdiNncmVlbicsIHsgaG9vazogYW5pbWF0aW9uXzEuY29udGVudEFuaW1hdGlvbiB9LCBcIkdyZWVuIChyb3V0ZSBpZCA9IFwiICsgaWQgKyBcIilcIik7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2dyZWVuLnRzXG4gKiogbW9kdWxlIGlkID0gMzdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGggPSByZXF1aXJlKCdzbmFiYmRvbS9oJyk7XG52YXIgaW1tdXBkYXRlXzEgPSByZXF1aXJlKCdpbW11cGRhdGUnKTtcbnZhciBmbHV4eF8xID0gcmVxdWlyZSgnZmx1eHgnKTtcbnZhciBkb21wdGV1c2VfMSA9IHJlcXVpcmUoJ2RvbXB0ZXVzZScpO1xudmFyIGFuaW1hdGlvbl8xID0gcmVxdWlyZSgnLi9hbmltYXRpb24nKTtcbmZ1bmN0aW9uIGRlZmF1bHRfMShwcm9wcykge1xuICAgIHJldHVybiBkb21wdGV1c2VfMS5jb21wb25lbnQoe1xuICAgICAgICBrZXk6ICdyZWQnLFxuICAgICAgICBsb2NhbFN0b3JlOiBsb2NhbFN0b3JlLFxuICAgICAgICBwcm9wczogcHJvcHMsXG4gICAgICAgIHJlbmRlcjogcmVuZGVyXG4gICAgfSk7XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0XzE7XG47XG5mdW5jdGlvbiBsb2NhbFN0b3JlKF9hKSB7XG4gICAgdmFyIG9wZW5lZEJ5RGVmYXVsdCA9IF9hLm9wZW5lZEJ5RGVmYXVsdDtcbiAgICB2YXIgaW5pdGlhbFN0YXRlID0geyBvcGVuZWQ6IG9wZW5lZEJ5RGVmYXVsdCB9O1xuICAgIHZhciBhY3Rpb25zID0ge1xuICAgICAgICB0b2dnbGU6IGZsdXh4XzEuQWN0aW9uKCd0b2dnbGUnKVxuICAgIH07XG4gICAgdmFyIHN0b3JlID0gZmx1eHhfMS5Mb2NhbFN0b3JlKGluaXRpYWxTdGF0ZSwgZnVuY3Rpb24gKG9uKSB7XG4gICAgICAgIG9uKGFjdGlvbnMudG9nZ2xlLCBmdW5jdGlvbiAoc3RhdGUpIHsgcmV0dXJuIGltbXVwZGF0ZV8xLmRlZmF1bHQoc3RhdGUsIHsgb3BlbmVkOiAhc3RhdGUub3BlbmVkIH0pOyB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4geyBzdG9yZTogc3RvcmUsIGFjdGlvbnM6IGFjdGlvbnMgfTtcbn1cbmZ1bmN0aW9uIHJlbmRlcihvcHRpb25zKSB7XG4gICAgdmFyIG9wZW5lZCA9IG9wdGlvbnMubG9jYWxTdGF0ZS5vcGVuZWQsIGFjdGlvbnMgPSBvcHRpb25zLmFjdGlvbnM7XG4gICAgcmV0dXJuIGgoJ2Rpdi5yZWQnLCB7IGhvb2s6IGFuaW1hdGlvbl8xLmNvbnRlbnRBbmltYXRpb24sIGNsYXNzOiB7IG9wZW5lZDogb3BlbmVkIH0gfSwgW1xuICAgICAgICBoKCdidXR0b24nLCB7IG9uOiB7IGNsaWNrOiBvbkNsaWNrKGFjdGlvbnMpIH0gfSwgJ1RvZ2dsZScpXG4gICAgXSk7XG59XG5mdW5jdGlvbiBvbkNsaWNrKGFjdGlvbnMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gYWN0aW9ucy50b2dnbGUoKTsgfTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvcmVkLnRzXG4gKiogbW9kdWxlIGlkID0gMzhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmRlZmF1bHQgPSB1cGRhdGU7XG5leHBvcnRzLnVwZGF0ZUtleSA9IHVwZGF0ZUtleTtcbmV4cG9ydHMucmVwbGFjZSA9IHJlcGxhY2U7XG5mdW5jdGlvbiB1cGRhdGUoaG9zdCwgc3BlYykge1xuICAvLyBJZiBhbnkgb2YgdGhlIGJyYW5jaGVzIG9mIGFuIG9iamVjdCBjaGFuZ2VkLCB0aGVuIHRoYW4gb2JqZWN0IGNoYW5nZWQgdG9vOiBjbG9uZSBpdC5cbiAgLy8gVGhlIHR5cGUgb2YgdGhlIGNvcHkgaXMgaW5mZXJyZWQuXG4gIHZhciBjb3B5ID0gaG9zdCA/IEFycmF5LmlzQXJyYXkoaG9zdCkgPyBob3N0LnNsaWNlKCkgOiBjbG9uZShob3N0KSA6IEFycmF5LmlzQXJyYXkoc3BlYykgPyBbXSA6IHt9O1xuXG4gIGZvciAodmFyIGtleSBpbiBzcGVjKSB7XG4gICAgdmFyIHNwZWNWYWx1ZSA9IHNwZWNba2V5XTtcblxuICAgIGlmIChzcGVjVmFsdWUgPT09IERFTEVURSkge1xuICAgICAgQXJyYXkuaXNBcnJheShjb3B5KSA/IGNvcHkuc3BsaWNlKGtleSwgMSkgOiBkZWxldGUgY29weVtrZXldO1xuICAgIH1cbiAgICAvLyBUaGUgc3BlYyBjb250aW51ZXMgZGVlcGVyXG4gICAgZWxzZSBpZiAoaXNPYmplY3Qoc3BlY1ZhbHVlKSkge1xuICAgICAgICBjb3B5W2tleV0gPSB1cGRhdGUoY29weVtrZXldLCBzcGVjVmFsdWUpO1xuICAgICAgfVxuICAgICAgLy8gTGVhZiB1cGRhdGVcbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IHR5cGVvZiBzcGVjVmFsdWUgPT09ICdmdW5jdGlvbicgPyBzcGVjVmFsdWUoY29weVtrZXldKSA6IHNwZWNWYWx1ZTtcblxuICAgICAgICAgIGNvcHlba2V5XSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gIH1cblxuICByZXR1cm4gY29weTtcbn1cblxuLy8gU2luZ2xlIHBhdGggc3RyaW5nIHVwZGF0ZSBsaWtlOiB1cGRhdGUob2JqLCAncGF0aDEucGF0aDIubmFtZScsICdKb2huJyk7XG5mdW5jdGlvbiB1cGRhdGVLZXkoaG9zdCwga2V5UGF0aCwgdmFsdWUpIHtcbiAgdmFyIHBhdGhzID0ga2V5UGF0aC5zcGxpdCgnLicpO1xuICB2YXIgc3BlYyA9IHt9O1xuICB2YXIgY3VycmVudE9iaiA9IHNwZWM7XG5cbiAgcGF0aHMuZm9yRWFjaChmdW5jdGlvbiAocGF0aCwgaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPT09IHBhdGhzLmxlbmd0aCAtIDEpIGN1cnJlbnRPYmpbcGF0aF0gPSB2YWx1ZTtlbHNlIGN1cnJlbnRPYmpbcGF0aF0gPSBjdXJyZW50T2JqID0ge307XG4gIH0pO1xuXG4gIHJldHVybiB1cGRhdGUoaG9zdCwgc3BlYyk7XG59XG5cbmZ1bmN0aW9uIGNsb25lKG9iaikge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSBvYmpba2V5XTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHgpIHtcbiAgcmV0dXJuIHggJiYgKHR5cGVvZiB4ID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih4KSkgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHgpO1xufVxuXG52YXIgREVMRVRFID0gZXhwb3J0cy5ERUxFVEUgPSB7fTtcblxuZnVuY3Rpb24gcmVwbGFjZSh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vaW1tdXBkYXRlL2xpYi9pbW11cGRhdGUuanNcbiAqKiBtb2R1bGUgaWQgPSAzOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZmx1eHhfMSA9IHJlcXVpcmUoJ2ZsdXh4Jyk7XG52YXIgaW1tdXBkYXRlXzEgPSByZXF1aXJlKCdpbW11cGRhdGUnKTtcbnZhciBhY3Rpb25fMSA9IHJlcXVpcmUoJy4vYWN0aW9uJyk7XG47XG52YXIgaW5pdGlhbFN0YXRlID0ge1xuICAgIGJsdWU6IHsgY291bnQ6IDAsIHJlZDogeyBjb3VudDogMCB9IH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBmbHV4eF8xLkdsb2JhbFN0b3JlKGluaXRpYWxTdGF0ZSwgZnVuY3Rpb24gKG9uKSB7XG4gICAgb24oYWN0aW9uXzEuaW5jcmVtZW50Qmx1ZSwgZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBpbW11cGRhdGVfMS5kZWZhdWx0KHN0YXRlLCB7IGJsdWU6IHsgY291bnQ6IGZ1bmN0aW9uIChjKSB7IHJldHVybiBjICsgMTsgfSB9IH0pO1xuICAgIH0pO1xuICAgIG9uKGFjdGlvbl8xLnJvdXRlQ2hhbmdlZCwgZnVuY3Rpb24gKHN0YXRlLCByb3V0ZSkge1xuICAgICAgICByZXR1cm4gaW1tdXBkYXRlXzEuZGVmYXVsdChzdGF0ZSwgeyByb3V0ZTogcm91dGUgfSk7XG4gICAgfSk7XG59KTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvc3RvcmUudHNcbiAqKiBtb2R1bGUgaWQgPSA0MFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==