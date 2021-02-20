import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App';
import {useParams, Link} from 'react-router-dom';

const UserProfile = ()=> {
  //const [data, setData] = useState([]);
  const [userProfile, setProfile] = useState(null);
  const {state, dispatch} = useContext(UserContext);
  const {userid} = useParams(); // used with :userid
  console.log(userid);
  const [showFollow, setShowFollow] = useState(true);
  //const [showFollow, setShowFollow] = useState(state?  state.following?!state.following.includes(userid) : true  : true);

  useEffect(()=>{
    setShowFollow(state?  state.following?!state.following.includes(userid) : true  : true );
    fetch(`/users/user/${userid}`, {
      method:"get",
      credentials: 'include'
    })
    .then(res=>res.json())
    .then(result=>{
      console.log("IN RESP USER PROF!!!");
      //console.log(result);
      setProfile(result);
      console.log({all_posts: result.posts});
      //setData(result.posts);
      dispatch({type:'UPDATE', payload: {following: result.user.following, followers: result.user.followers}});
    })
    .catch(err=> {
        console.log(err);
    })
  }, []);

  const followUser = ()=> {
    console.log("I WANT TO FOLLOW USERID: ", userid);
    fetch('/users/user/follow', {
      method: 'put',
      credentials: 'include',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        followId: userid
      })
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("FOLLOWED!");
      console.log(data);
      dispatch({type:'UPDATE', payload: {following: data.following, followers: data.followers}});
      localStorage.setItem("user", JSON.stringify(data));

      setProfile((prevState=> {
        return {
          ...prevState,
          user: {
            ...prevState.user,
            followers:[...prevState.user.followers, data._id]
          }
        }
      }));
      setShowFollow(false);
    })
  }

  const unfollowUser = ()=> {
    console.log("I WANT TO UNFOLLOW USERID: ", userid);
    fetch('/users/user/unfollow', {
      method: 'put',
      credentials: 'include',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    })
    .then(res=>res.json())
    .then(data=>{
      console.log("UNFOLLOWED!");
      console.log(data);
      dispatch({type:'UPDATE', payload: {following: data.following, followers: data.followers}});
      localStorage.setItem("user", JSON.stringify(data));

      setProfile((prevState=> {
        const newFollowers = prevState.user.followers.filter(item=>item != data._id);
        return {
          ...prevState,
          user: {
            ...prevState.user,
            followers:newFollowers
          }
        }
      }));
      setShowFollow(true);
    })
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
      setProfile((prevState=> {
        const newPosts = userProfile.posts.map(item=>{
          if(item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        return {
          ...prevState,
          posts: newPosts
        }
      }));
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
      setProfile((prevState=> {
        const newPosts = userProfile.posts.map(item=>{
          if(item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });

        return {
          ...prevState,
          posts: newPosts
        }
      }));
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
      setProfile((prevState=> {
        const newPosts = userProfile.posts.map(item=>{
          if(item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });

        return {
          ...prevState,
          posts: newPosts
        }
      }));
    })
    .catch(err=>{
      console.log(err);
    })
  }

  return (
      <>
      {userProfile
      ?
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
        <div style={{
          display:"flex",
          justifyContent:"space-around",
          margin:"18px 0px",
          borderBottom: "solid grey"
        }}>
          <div>
            <img style={{width: "160px", height: "160px", borderRadius: "80px"}} 
              /*src="https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlcnNvbnxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"*/ src={userProfile.user.photo}
              alt="profile pic"
            />
          </div>
          <div>
            <h4>{userProfile.user.name}</h4>
            <h5>{userProfile.user.email}</h5>
            <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
              <h6>{userProfile.posts.length} posts</h6>
              <h6>{userProfile.user.followers.length} followers</h6>
              <h6>{userProfile.user.following.length} following</h6>
              
              {showFollow
              ? <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>followUser()} >
                  Follow
                </button>
              : <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>unfollowUser()} >
                  Unfollow
                </button>
              }
              
            </div>
          </div>
        </div>

        <div className="gallery">
          {
            userProfile.posts.map(item=> {
              const myid=item._id;
              return ( 
                <>
                {/* <img key={item._id} className="item" src={item.photo} alt={item.title}/> */}


                <div key={item._id} className="card home-card" >
                <h5 style={{padding: "5px"}}>
                  <Link to={item.postedBy._id != state._id ? '/profile/'+item.postedBy._id : '/profile/'}> 
                    <img style={{width: "40px", height: "40px", borderRadius: "10px", marginRight: "10px"}} 
                      src={item.postedBy.photo}
                      alt="profile pic"
                    />

                    { item.postedBy.name } 
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
                    <i className="material-icons" onClick={()=> unlikePost(myid)}>thumb_down</i> 
                    :
                    <i className="material-icons" onClick={()=> likePost(myid)}>thumb_up</i>
                  }
                  {/* <i className="material-icons" onClick={()=> unlikePost(myid)}>thumb_down</i> 
                  <i className="material-icons" onClick={()=> likePost(myid)}>thumb_up</i> */}
                  <h6>{item.likes.length} likes</h6>
                  <h6>{item.title}</h6>
                  <p>{item.body}</p>
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
      
      :
        <h2>Loading ...</h2>
      }
      </>
  );
}

export default UserProfile;