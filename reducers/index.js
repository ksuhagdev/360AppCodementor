import { combineReducers } from 'redux';
import app from './app';

import property from './property';


export default () =>
  combineReducers({
    app,

    property,
   
  });
