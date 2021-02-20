import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../../App';
import {Link} from 'react-router-dom';

const FollowingUserPosts = ()=> {
  const [data, setData] = useState([]);
  const {state, dispatch} = useContext(UserContext);
  useEffect(()=>{
    fetch('/posts/following', {
      method:"get",
      credentials: 'include'
    })
    .then(res=>res.json())
    .then(res=>{
      console.log(res);
      setData(res.following_posts);
    })
  }, []);


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
      const newData = data.map(item=>{
        if(item._id==result._id){
          return result;
        } else {
          return item;
        }
      })
      setData(newData);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  const unlikePost = (id)=> {
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
      const newData = data.map(item=>{
        if(item._id==result._id){
          return result;
        } else {
          return item;
        }
      })
      setData(newData);
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
      const newData = data.map(item=>{
        if(item._id==result._id){
          return result;
        } else {
          return item;
        }
      })
      setData(newData);
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
      const newData = data.filter(item=> {
        return item._id !== result._id;
      })
      setData(newData);
    })
  }

  return (
      <div className="home">

        { data.length!=0
          ?
          data.map(item=> {
            console.log("ITEM: ", item._id);
            const myid=item._id;
            return (
              <div key={item._id} className="card home-card" >
                <h5 style={{padding: "5px"}}>
                  <Link to={item.postedBy._id != state._id ? '/profile/'+item.postedBy._id : '/profile/'}> 
                    <img style={{width: "40px", height: "40px", borderRadius: "10px", marginRight: "10px"}} 
                      src={item.postedBy.photo}
                      alt="profile pic"
                    />

                    { item.postedBy.name } 
                  </Link>
                  {
                    item.postedBy._id==state._id 
                    && 
                    <i className="material-icons" style={{float:"right"}} onClick={()=>deletePost(item._id)}
                    >
                      delete
                    </i>
                  }
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
            )
          })

          :
            <center><h5> Please follow someone... </h5></center>
        }
      </div>
  );
}

export default FollowingUserPosts;