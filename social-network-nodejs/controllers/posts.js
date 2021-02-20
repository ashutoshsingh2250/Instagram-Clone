const _ = require('lodash');
const { Post, validatePost } = require('../models/posts');
const bcrypt = require('bcrypt');

module.exports.save_post= async (req, res) => {
  console.log(req.body.user);
  
  const { error } = validatePost(req.body);
  if (error) return res.status(400).json({"ERROR": error.details[0].message});

  req.body.postedBy=req.body.user;
  const post = new Post(_.pick(req.body, ['title', 'body', 'photo', 'postedBy']));

  const result = await post.save();
  console.log(result);

  res.json({post: result});
}

module.exports.all_get= async (req, res) => {
  const posts = await Post.find().populate('postedBy', '_id name photo followers following').populate('comments.postedBy', '_id name photo');

  if(posts) {
    console.log("ALL POSTS:");
    console.log(posts);
    res.json({posts: posts});  
  } else {
    console.log(err);
    res.status(400).json({"ERROR": 'Could not fetch all posts.'});  
  }  
}

module.exports.following_get= async (req, res) => {
  console.log("INSIDE POSTS / FOLLOWING!!!");
  console.log(req.body.user);
  Post
  .find({postedBy: {$in: req.body.user.following}})
  .populate('postedBy', '_id name photo')
  .populate('comments.postedBy', '_id name photo')
  .then(posts=>{
    console.log(posts);
    res.json({following_posts:posts});
  })
  .catch(err=>{
    console.log(err);
  })
}

// module.exports.my_get= async (req, res) => {
//   console.log(req.body.user);
//   const _id=req.body.user._id;
//   const posts = await Post.find({postedBy: _id}).populate('postedBy', '_id name');
//   //console.log("IN MY_GET "+posts);
//   if(posts) {
//     res.json({myposts: posts});  
//   } else {
//     console.log(err);
//     res.status(400).json({"ERROR": 'Could not fetch all posts.'});  
//   }  
// }

module.exports.like_put= async (req, res) => {
  //console.log("LIKES: ", req.body.user, "POSTID: ", req.body.postId);
  Post.findByIdAndUpdate(req.body.postId, {
    $push: {likes:req.body.user._id}
  }, {new: true})
  .populate("comments.postedBy", "_id name photo")
  .populate("postedBy", "_id name photo")
  .exec((err, resp)=> {
    console.log("\nLIKE RESP",resp);
    if(err) 
      return res.status(422).json({'ERROR': err});
    else return res.json(resp);
  });
}

module.exports.unlike_put= async (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $pull: {likes:req.body.user._id}
  }, {new: true})
  .populate("comments.postedBy", "_id name photo")
  .populate("postedBy", "_id name photo")
  .exec((err, resp)=> {
    console.log("\nUNLIKE RESP",resp);
    if(err) 
      return res.status(422).json({'ERROR': err});
    else return res.json(resp);
  });
}

module.exports.comment_put= async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.body.user._id
  }
  Post.findByIdAndUpdate(req.body.postId, {
    $push: {comments:comment}
  }, {new: true})
  .populate("comments.postedBy", "_id name photo")
  .populate("postedBy", "_id name photo")
  .exec((err, resp)=> {
    console.log("\nRESP COMMENT: ",resp);
    if(err) 
      return res.status(422).json({'ERROR': err});
    else return res.json(resp);
  });
}

module.exports.deletepost_delete= async (req, res) => {
  console.log("DELETE POST FUNCTION GETTING CALLED!!!!!!!!!!!!!!!!!!!!!")
  Post.findOne({_id: req.params.postId})
  .populate("postedBy", "_id")
  .exec((err, post)=> {
    if(err || !post) {
      return res.status(422).json({"ERROR": err});
    }
    if(post.postedBy._id.toString() === req.body.user._id.toString()) {
      post.remove()
      .then(result=>{
        console.log(result);
        return res.json(result);
      })
      .catch(err=>{
        console.log(err);
      })
    }
  })
}

module.exports.edit_body_put= async (req, res)=> {
  console.log("UPDATE BODY", req.body.body);
  Post.findByIdAndUpdate(req.body.postId, {
    body: req.body.body
  }, {new: true})
  .populate("comments.postedBy", "_id name photo")
  .populate("postedBy", "_id name photo")
  .exec((err, resp)=> {
    console.log("\nRESP EDIT BODY: ",resp);
    if(err) 
      return res.status(422).json({'ERROR': err});
    else return res.json(resp);
  });
}