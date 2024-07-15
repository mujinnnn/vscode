// store : reducer를 통합 관리하기 위한 개념

import {configureStore} from '@reduxjs/toolkit';
import counterReducer from './counterReducer';

// counter라는 리듀서를 가진 store
const store = configureStore({
    reducer: {
        counter: counterReducer
    }
});

export default store;