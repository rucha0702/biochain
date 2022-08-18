import AdditionalDetails from './AdditionalDetails';
import UserDetails from './UserDetails';
import UserBlockchainDetails from './UserBlockchainDetails';
import SetProduct from './SetProduct';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  AdditionalDetails,
  UserDetails,
  UserBlockchainDetails,
  SetProduct,

});

export default rootReducer;
