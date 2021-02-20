import React, { createContext, useEffect, useReducer, useContext } from 'react';  
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';

import NavBar from './components/Navbar';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import {reducer, initialState} from './reducers/userReducer';
import UserProfile from './components/screens/UserProfile'
import FollowingUserPosts from './components/screens/FollowingUserPosts';
import './App.css';

export const UserContext = createContext();

const Routing = ()=> {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);
  
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user) {
      dispatch({type: "USER", payload: user});
      //history.push('/');
    } else {
      history.push('/signin')
    }
    console.log(typeof(user), user);
  },[]);

  return(
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route> 
      <Route exact path="/post/add">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/post/following">
        <FollowingUserPosts />
      </Route>
    </Switch>      
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{state:state, dispatch:dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
