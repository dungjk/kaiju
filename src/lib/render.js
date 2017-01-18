import h from 'snabbdom/h'
import { vnode as VNode } from 'snabbdom/vnode'
import log, { shouldLog } from './log'


let componentsToRender = []

let rendering = false
let nextRender = undefined
let renderBeginTime = undefined


const Render = { patch: undefined }
export default Render


let _isFirstRender = true
export function isFirstRender() {
  return _isFirstRender
}

/**
 * Generic render function for arbitrary VDOM rendering
 */
export function renderVDom(target, vdom, onComplete) {
  let cancelled = false

  // Some components are already rendering within an animation frame, piggy back and do it synchronously
  if (rendering) {
    patchInto(target, vdom)
    if (onComplete) onComplete()
  }
  // No component rendering is in progress; just schedule it asap
  else
    requestAnimationFrame(() => {
      if (cancelled) return
      renderSync(target, vdom)
      if (onComplete) onComplete()
    })

  return function cancel() { cancelled = true }
}

export function renderSync(target, vdom) {
  rendering = true

  logBeginRender()

  patchInto(target, vdom)

  processRenderQueue()

  logEndRender()

  _isFirstRender = false
  rendering = false
}


/* Render a component immediately. This is used internally and it is assumed a render phase is already ongoing */
export function renderComponentNow(component) {
  if (componentsToRender.indexOf(component) === -1)
    componentsToRender.push(component)
}

/* Optimization of the above function: A new component cannot be possibly found in the render queue */
export function renderNewComponentNow(component) {
  componentsToRender.push(component)
}

export function renderComponentNextFrame(component) {
  if (rendering) {
    // This is pretty bad but not breaking: It means the developer
    // synchronously send a message inside a render() function.
    // Probably just a mistake.
    console.warn('A component tried to re-render while a rendering was already ongoing', component.elm)
    return
  }

  // This component is already scheduled for the next redraw.
  // For instance, this can happen while the app's tab is inactive,
  // or when synchronously sending a few messages.
  // Avoids doing more work than necessary when re-activating it.
  if (componentsToRender.indexOf(component) !== -1) return

  componentsToRender.push(component)

  if (!nextRender)
    nextRender = requestAnimationFrame(renderNow)
}

function renderComponent(component) {
  const { props, store, messages, elm, render, vnode, context, destroyed } = component

  // Bail if the component is already destroyed.
  // This can happen if the parent renders first and decide a child component should be removed.
  if (destroyed) return

  const isNew = vnode === undefined
  const { patch } = Render

  let beforeRender

  if (log.render) beforeRender = performance.now()

  const newVNode = render({ props, state: store.state(), msg: messages, context })
  patchInto(vnode || elm, newVNode)

  if (shouldLog(log.render, component.key)) {
    const renderTime = Math.round((performance.now() - beforeRender) * 100) / 100
    console.log(`Render component %c${component.key}`,
      'font-weight: bold', renderTime + ' ms', '| props: ', props, '| state: ', store.state())
  }

  component.lifecycle.rendered(component, newVNode)
}

function renderNow() {
  rendering = true

  nextRender = undefined

  logBeginRender()

  // Render components in a top-down fashion.
  // This ensures the rendering order is predictive and props/states are consistent.
  // If we didn't do that, a component could first be rendered following a state change
  // but then miss out on a props change from its parent.
  componentsToRender.sort((compA, compB) => compA.depth - compB.depth)
  processRenderQueue()

  rendering = false

  logEndRender()
}

function processRenderQueue() {
  while (componentsToRender.length) {
    const component = componentsToRender.shift()
    renderComponent(component)
    if (component.onFirstRender) component.onFirstRender()
  }
  componentsToRender = []
}

function logBeginRender() {
  if (log.render) {
    renderBeginTime = performance.now()
    console.log('%cRender - begin', 'color: orange')
  }
}

function logEndRender() {
  if (log.render) {
    const time = Math.round((performance.now() - renderBeginTime) * 100) / 100
    console.log(`%cRender - end (${time}ms)\n\n\n`, 'color: orange')
  }
}


function patchInto(target, node) {
  const targetIsArray = Array.isArray(target)
  const nodeIsArray = Array.isArray(node)

  if (nodeIsArray)
    mapPrimitiveNodes(node)

  // First render inside an Element
  if (target.elm === undefined) {
    Render.patch(
      VNode('dummy', {}, [], undefined, target),
      VNode('dummy', {}, nodeIsArray ? node : [node])
    )

    if (nodeIsArray)
      node.elm = target
  }
  // Update using a previous VNode or VNode[] to patch against
  else {
    if (targetIsArray) {
      Render.patch(
        VNode('dummy', {}, target, undefined, target.elm),
        VNode('dummy', {}, nodeIsArray ? node : [node])
      )
    }
    else {
      Render.patch(target, node)
    }

    if (nodeIsArray)
      node.elm = target.elm
  }
}

/*
  Similar to what h() does. We have to do it here ourselves
  when we are passed an Array of Nodes as it didn't go through the h() transformation.
  The operation is mutative, so that the Array of Nodes can later be reused for patching.
  This is not particularly elegant but is consistent with the snabbdom's way.
*/
function mapPrimitiveNodes(arr) {
  for (let i = 0; i < arr.length; ++i) {
    const node = arr[i]
    if (typeof node === 'string' || typeof node === 'number')
      arr[i] = VNode(undefined, undefined, undefined, node)
  }
}
