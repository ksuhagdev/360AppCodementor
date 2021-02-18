import { combineReducers } from 'redux';
import app from './app';
import account from './account_reducer';
import agent from './agent';
import property from './property';
import message from './message';
import follow from './follow';
import like from './like';

export default () =>
  combineReducers({
    app,
    account,
    agent,
    property,
    message,
    follow,
    like,
  });
