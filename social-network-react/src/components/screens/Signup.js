import React, { useState, useEffect } from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Signup = ()=> {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [imgUrl, setImgUrl] = useState(undefined);

  useEffect(()=>{
    if(imgUrl) {
      onUploadFields();
    }
  }, [imgUrl]);

  const onSignup = ()=> {
    console.log("onSignup() called");

    if(image) {
      onUploadPic();
    } else {
      onUploadFields();
    }
  }

  const onUploadPic = ()=> {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'insta-clone');
    data.append('cloud_name', 'ddhuhurjc');

    fetch('https://api.cloudinary.com/v1_1/ddhuhurjc/image/upload', {
      method:"post",
      body: data
    })
    .then(res=>res.json())
    .then(data=> {
      console.log(data);
      setImgUrl(data.url);
    })
    .catch(err=> {
      console.log(err);
    });
  }

  const onUploadFields = ()=> {
    
    fetch("/users/signup", {
      method: "post",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name:name,
        email:email,
        password:password,
        photo: imgUrl
      })
    })
    .then(res => res.json())
    .then(data=> {
      //console.log(data);
      if(data.ERROR) {
        M.toast({html: data.ERROR, classes: "#c62828 red darken-3"});
      } else {
        console.log()
        M.toast({html: data.SUCCESS, classes: "#43a047 green darken-1"});
        history.push('/signin');
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
          placeholder="name"
          value={name}
          onChange={(e)=> setName(e.target.value)}
        />
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

        <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
                <span>Upload Pic</span>
                <input type="file" onChange={e=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
        </div>

        <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={onSignup}>
          Signup
        </button>
        <h5>
          <Link to='/signin'> Already have an account ?</Link>
        </h5>
      </div>
    </div>
  );
}

export default Signup;