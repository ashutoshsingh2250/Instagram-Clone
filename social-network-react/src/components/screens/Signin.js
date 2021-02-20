import React, { useState, useContext } from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../../App'
import M from 'materialize-css';

const Signin = ()=> {
  const {state, dispatch} = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const onSignin = ()=> {
    console.log("onSignin() called");
    fetch("/users/signin", {
      method: "post",
      credentials: 'include',
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email:email,
        password:password
      })
    })
    .then(res => res.json())
    .then(data=> {
      //console.log(data);
      if(data.ERROR) {
        M.toast({html: data.ERROR, classes: "#c62828 red darken-3"});
      } else {
        console.log(data.user);
        localStorage.setItem('jwt', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({type:"USER", payload:data.user});
        M.toast({html: data.SUCCESS, classes: "#43a047 green darken-1"});
        history.push('/');
      } 
    })
    .catch(error=> console.log(error)) ;
  }
  
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input 
          type="text"
          placeholder="email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
        />
        <input 
          type="password"
          placeholder="password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
        />
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={onSignin} >
          Signin
        </button>
        <h5>
          <Link to='/signup'> Don't have an account ?</Link>
        </h5>
      </div>
    </div>
  );
}

export default Signin;