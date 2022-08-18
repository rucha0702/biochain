//For storing additional details of user
export const AddDetails = (data) => {
  return {
    type: 'ADD_DETAILS',
    payload: data,
  };
};

//For basic user details
export const UserDetails = (data) => {
  return {
    type: 'USER_DETAILS',
    payload: data,
  };
};

export const UserBlockchainDetails = (data) => {
  return {
    type: 'USER_BLOCKCHAIN_DETAILS',
    payload: data,
  };
};


export const LogoutUser = () => {
  return {
    type: 'LOGOUT',
  };
};
