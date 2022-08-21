import AdditionalDetails from './AdditionalDetails';
import UserDetails from './UserDetails';
import UserBlockchainDetails from './UserBlockchainDetails';
import AllUsers from './AllUsers';
import SetProduct from './SetProduct';
import AvailableProduct from './AvailableProduct';
import SetCurrentProduct from './SetCurrentProduct';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  AdditionalDetails,
  UserDetails,
  UserBlockchainDetails,
  SetProduct,
  AllUsers,
  AvailableProduct,
  SetCurrentProduct,

});

export default rootReducer;
