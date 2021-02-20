export const initialState = null;

export const reducer = (state, action) => {
  if (action.type === 'USER') {
    return action.payload;
  }
  if (action.type === 'CLEAR') {
    return (state = null);
  }
  if (action.type === 'UPDATE') {
    return {
      ...state,
      followers: action.payload.followers,
      following: action.payload.following
    }
  }
  if (action.type === 'UPDATEPIC') {
    //console.log("INSIDE REDUCER: ", action.payload.photo);
    return {
      ...state,
      photo: action.payload.photo  
    }
  }
  return state;

  // switch(action.type) {
  //   case 'USER':
  //     return action.payload;
  //   case 'CLEAR':
  //     return null;
  //   default:  
  //     return state;
  // }

}