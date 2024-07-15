import React from 'react';
import {Provider} from 'react-redux';
import store from './store';
import CounterButton from './CounterButton';

// CounterButton의 상태 제공자 store라는 스토어
export default function App() {
  return (
    <Provider store={store}>
      <CounterButton />
    </Provider>
  );
}