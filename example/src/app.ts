import { api as router } from 'abyssa';
import { component, h } from 'dompteuse';

import { State as GlobalState } from './store';
import { incrementBlue } from './action';
import index from './index';
import blue from './blue';


export default component({
  key: 'app',
  pullState,
  render
});

interface State {
  count: number,
  route: string
}

function pullState(state: GlobalState): State {
  return {
    count: state.blue.count,
    route: state.route.fullName
  };
}

function render(options: { state: State }) {
  const { state } = options;

  return h('div', [
    h('header', [
      h('a', { attrs: { href: router.link('app.index'), 'data-nav': 'mousedown' } }, 'Index'),
      h('a', { attrs: { href: router.link('app.blue', { id: 33 }), 'data-nav': 'mousedown' } }, 'Blue'),
      String(state.count)
    ]),
    h('main', getChildren(state.route))
  ]);
}

function getChildren(route: string) {
  if (route === 'app.index') return [index()];
  if (route.indexOf('app.blue') === 0) return [blue()];
}

setInterval(incrementBlue, 2500);