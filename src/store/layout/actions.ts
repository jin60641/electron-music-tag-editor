import { createAction } from 'typesafe-actions';

import { Actions, AlertOption } from './types';

const makeAlert = createAction(Actions.MAKE_ALERT)<AlertOption>();
const dismissAlert = createAction(Actions.DISMISS_ALERT)();

const setDrawer = createAction(Actions.SET_DRAWER)<boolean>();

const setSearch = createAction(Actions.SET_SEARCH)<boolean>();

export default {
  makeAlert,
  dismissAlert,
  setDrawer,
  setSearch,
};
