import { createStore, applyMiddleware, compose } from 'redux';
import ReduxPromise from 'redux-promise';
import Thunk from 'redux-thunk';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import createRootReducer from '../reducers';

const RootReducer = createRootReducer();

const initialState = {};

const client = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://api.360app.io/api' : 'http://13.211.132.117:3600',
  responseType: 'json',
});

const middlewares = [Thunk, ReduxPromise, axiosMiddleware(client)];
// For Redux Chrome Extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(applyMiddleware(...middlewares));
const store = createStore(RootReducer, initialState, enhancer);

export default store;
