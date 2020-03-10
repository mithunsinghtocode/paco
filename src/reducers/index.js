import { combineReducers } from 'redux';
import bannerReducer from './bannerReducer';

export default combineReducers({
    appData: bannerReducer
});