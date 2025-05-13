import { combineReducers } from 'redux';
import carSlice from '../slice/carSlice';


const rootReducer = combineReducers({
  car: carSlice,
});


export default rootReducer;


