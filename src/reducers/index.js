import AdditionalDetails from './AdditionalDetails';
import UserDetails from './UserDetails';
import UserBlockchainDetails from './UserBlockchainDetails';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  AdditionalDetails,
  UserDetails,
  UserBlockchainDetails

});

export default rootReducer;
