import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App';
import {useParams, Link} from 'react-router-dom';

const Profile = ()=> {
  const [mypics, setPics] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const {state, dispatch} = useContext(UserContext);
  const [image, setImage] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [bodyValue, setBodyValue] = useState("");
  const [isEditBody, setIsEditBody] = useState({flag: false, id: undefined});

  useEffect(()=>{
    fetch('/users/profile', {
      method:"get",
      credentials: 'include'
    })
    .then(res=>res.json())
    .then(result=>{
      console.log(result);
      setPics(result.myposts);
      setUserDetails(result.user);
      dispatch({type:'UPDATE', payload: {following: result.user.following, followers: result.user.followers}});
      localStorage.setItem("user", JSON.stringify(result.user));
    })
  }, []);

  useEffect(()=>{
    console.log('IMAGE GOT UPDATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    if(image) {
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
        localStorage.setItem("user", JSON.stringify({...state, photo: data.url}));
        dispatch({type: 'UPDATEPIC', payload: data.url});
        
        //while(imgUrl=="") {}
      })
      .catch(err=> {
        console.log(err);
      });
    }
  
  }, [image]);

  useEffect(()=> {
    console.log("IMG URL SET:", imgUrl);
    if(imgUrl) {
      fetch('/users/profile/update/photo', {
        method: "put",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          //photo: data.url
          photo: imgUrl
        })
      })
      .then(res=>res.json())
      .then(result=> {
        console.log('USER DETAILS COMING FROM BACKEND:::::::::::::::::::::::::\n',result);
        //localStorage.setItem("user", JSON.stringify({...state, photo: result.photo}));
        //dispatch({type: 'UPDATEPIC', payload: result.photo});
        const newUserDetails = {
          ...userDetails,
          photo: result.photo
        };
        console.log('NEW USER DETAILS:::::::::::::::::::::::\n',newUserDetails);
        setUserDetails(newUserDetails);
        
        //window.location.reload();
      })
      .catch(err=>{
        console.log(err);
      })
    }
  }, [imgUrl]);

  const updatePhoto = (file)=> {
    setImage(file);
  }

  const likePost = (id)=> {
    console.log("LIKED ID:", id);
    fetch('/posts/like', {
      method:'put',
      headers:{
        "Content-Type": "application/json"
      },
      credentials:'include',
      body:JSON.stringify({
        postId:id
      })
    })
    .then(res=>res.json())
    .then(result=>{
      console.log(result);
      const newPosts = mypics.map(item=>{
        if(item._id == result._id) {
          return result;
        } else {
          return item;
        }
      });
      setPics(newPosts);
      // setPics((prevState=> {
      //   const newPosts = mypics.map(item=>{
      //     if(item._id == result._id) {
      //       return result;
      //     } else {
      //       return item;
      //     }
      //   });
      //   return newPosts;
      // }));
    })
    .catch(err=>{
      console.log(err);
    })
  }

  const unlikePost = (id)=> {
    console.log("\n UNLIKED ID", id);
    fetch('/posts/unlike', {
      method:"put",
      headers:{
        "Content-Type": "application/json"
      },
      credentials:'include',
      body:JSON.stringify({
        postId:id
      })
    })
    .then(res=>res.json())
    .then(result=>{
      console.log(result); 
      const newPosts = mypics.map(item=>{
        if(item._id == result._id) {
          return result;
        } else {
          return item;
        }
      });
      setPics(newPosts);
      // setUserDetails((prevState=> {
      //   const newPosts = mypics.map(item=>{
      //     if(item._id == result._id) {
      //       return result;
      //     } else {
      //       return item;
      //     }
      //   });
      //   return  newPosts;
      // }));
    })
    .catch(err=>{
      console.log(err);
    })
  }

  const makeComment = (text, postId) => {
    fetch('/posts/comment', {
      method:"put",
      headers:{
        "Content-Type": "application/json"
      },
      credentials:'include',
      body:JSON.stringify({
        postId: postId,
        text: text
      })
    })
    .then(res=>res.json())
    .then(result => {
      console.log(result); 
      const newPosts = mypics.map(item=>{
        if(item._id == result._id) {
          return result;
        } else {
          return item;
        }
      });
      setPics(newPosts);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  const deletePost = (postid) => {
    fetch(`/posts/delete/${postid}`, {
      method: "delete",
      credentials:'include',
    })
    .then(res=>res.json())
    .then(result=> {
      console.log("AFTER RESP FROM DELETE: ",result);
      const newPosts = mypics.filter(item=> {
        return item._id !== result._id;
      })

      setPics(newPosts);
    })
  }

  const saveBody = (post) => {
    if(bodyValue) {
      const newPosts = mypics.map(item=>{
        if(item._id == post._id) {
          return {
            ...item,
            body: bodyValue
          };
        } else {
          return item;
        }
      });
      setPics(newPosts);
      
      fetch('/posts/edit/body', {
        method:"put",
        headers:{
          "Content-Type": "application/json"
        },
        credentials:'include',
        body:JSON.stringify({ 
          postId: post._id,
          body: bodyValue
        })
      })
      .then(res=>res.json())
      .then(result => {
        console.log(result); 
        const newPosts = mypics.map(item=>{
          if(item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPics(newPosts);
      })
      .catch(err=>{
        console.log(err);
      })
    
      setIsEditBody({flag: false, id: undefined});
    }
    
    //setIsEditBody({flag: false, id: undefined});
  }

  const editBody = (post) =>{
    console.log("POST BODY TO BE EDITED", post.body);
    setIsEditBody({flag: true, id: post._id});
  }

  return (
      <div style={{maxWidth:"550px", margin:"0px auto"}}>

        <div 
          style={{
            margin:"10px 0px 10px 52px",
            borderBottom: "solid grey"
        }}
        >

          <div style={{
            display:"flex",
            justifyContent:"space-around",
          }}>
            <div>
              <img style={{width: "160px", height: "160px", borderRadius: "80px"}} 
                src={userDetails?userDetails.photo:"Loading..."}
                alt="profile pic"
              />
            </div>
            <div>
              <h4>{state?state.name:'Loading...'}</h4>
              <h5>{state?state.email:'Loading...'}</h5>
              <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                <h6>{mypics.length} posts</h6>
                <h6>{userDetails.followers?userDetails.followers.length: "0"} followers</h6>
                <h6>{userDetails.followers?userDetails.following.length: "0"} following</h6>
              </div>
            </div>
          </div>

          <div className="file-field input-field" style={{margin: "10px"}} >
            <div className="btn #64b5f6 blue darken-1">
                <span>Update Photo</span>
                <input type="file" onChange={e=>{updatePhoto(e.target.files[0])}}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
          </div>

        </div>
        <div className="gallery">
  
          {
            mypics.map(item=> {
              const myid=item._id;
              return ( 
                <>
                <div key={item._id} className="card home-card" >
                <h5 style={{padding: "5px"}}>
                  <Link to={item.postedBy._id != state._id ? '/profile/'+item.postedBy._id : '/profile/'}> 
                    <img style={{width: "40px", height: "40px", borderRadius: "10px", marginRight: "10px"}} 
                      src={item.postedBy.photo}
                      alt="profile pic"
                    />
                    { item.postedBy.name } 
                    <i className="material-icons icon_delete" style={{float:"right"}} onClick={()=>deletePost(myid)}
                    >
                      delete
                    </i> 
                  </Link>
                  
                </h5>
                <div className="card-image">
                  <img src={item.photo} alt="post pic"
                  />
                </div>
                <div className="card-content">
                  <i className="material-icons" style={{color: 'red'}}>favorite</i>
                  { 
                    console.log("STATE ID:", state._id),
                    item.likes.includes(state._id)  
                    ? 
                    <i className="material-icons " onClick={()=> unlikePost(myid)}>thumb_down</i> 
                    :
                    <i className="material-icons" onClick={()=> likePost(myid)}>thumb_up</i>
                  }
                  <h6>{item.likes.length} likes</h6>

                  <h6 style={{marginTop:"15px"}}>
                    <b>{item.title}</b>
                  </h6>

                  <p style={{marginTop: "10px", marginBottom: "15px"}}>
                    { isEditBody.flag && isEditBody.id==item._id ? <input type="text" placeholder="add a body" onChange={e=>{console.log(e.target.value, '<<<========='); setBodyValue(e.target.value)}}></input> : item.body}
                    { isEditBody.flag && isEditBody.id==item._id
                        ?
                      <i className="material-icons" style={{float:"right"}} onClick={()=>saveBody(item)}>save</i> 
                        :  
                      <i className="material-icons" style={{float:"right"}} onClick={()=>editBody(item)}>edit</i> 
                    }
                  </p>
                  
                  {
                    item.comments.map(record=> {
                      return (
                        <h6 key={record._id}>
                          <span style={{fontWeight: "500"}}>
                            <Link to={record.postedBy._id != state._id ? '/profile/'+record.postedBy._id : '/profile/'}>   
                              <img style={{width: "10px", height: "10px", borderRadius: "5px", marginRight: "5px"}} 
                                src={record.postedBy.photo}
                                alt="profile pic"
                              />{record.postedBy.name}

                            </Link>
                          </span> {record.text}
                        </h6>
                      )
                    })
                  }

                  <form onSubmit={e=> {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                  }}
                  >
                    <input type="text" placeholder="add a comment" />
                  </form>
                </div>
              </div>


                </>
              )
            })
          }
          
        </div>
      </div>
  );
}

export default Profile;