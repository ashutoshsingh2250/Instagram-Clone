const _ = require('lodash');
const { User, validateRegistration, validateLogin } = require('../models/users');
const {Post} = require('../models/posts');
const bcrypt = require('bcrypt');

// module.exports.signup_get= async (req, res) => {
//   res.render('signup');  
// };

module.exports.signup_post= async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) return res.status(400).json({"ERROR": error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if(user)    return res.status(400).json({"ERROR":'User is already registered with this email'});

  user = new User(_.pick(req.body, ['name', 'email', 'password', 'photo']));

  const result = await user.save();
  console.log(result);
  const token = user.generateAuthToken(); // check user.js under model folder

  const maxAge = 1 * 60 * 60;
  res.cookie('jwt', token, {httpOnly: true/*, maxAge: maxAge*1000*/});
  const userInfo=_.pick(user, ['_id', 'name', 'email']);

  //res.header('x-auth-token', token).status(201).json({SUCCESS: "User registered successfully!"});
  //res.status(201).json(_.pick(req.body, ['name', 'email', 'password']));
  res.status(201).json({SUCCESS: "User registered successfully!"/*, user: userInfo, token: token*/});
}

module.exports.signin_post= async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({"ERROR": error.details[0].message});
  
  const { email, password } = req.body;
  
  let user = await User.findOne({ email });
  if(!user)  return res.status(400).json({"ERROR": 'Invalid email or password!'});
    
  const validPassword = await bcrypt.compare(password, user.password);
  if(!validPassword)  return res.status(400).json({"ERROR": 'Invalid email or password!'});
  
  const token = user.generateAuthToken(); // check user.js model
  const maxAge = 1 * 60 * 60;
  res.cookie('jwt', token, {httpOnly: true/*, maxAge: maxAge*1000*/});
  const userInfo=_.pick(user, ['_id', 'name', 'email', 'photo', 'followers', 'following']);
  //res.header('x-auth-token', token).status(201).json({SUCCESS: user.name+' has successfully signed in.', user: userInfo});
  res.status(201).json({SUCCESS: user.name+' has successfully signed in.', user: userInfo, token: token});
}

module.exports.signout_get = async (req, res) => {
  res.cookie('jwt', ''/*, {maxAge:1}*/);
  //res.redirect('/');
  res.headers['x-auth-token']='';
  res.json({SUCCESS: "logged out successfully!"});
}

module.exports.profile_get= async (req, res) => {
  console.log(req.body.user);
  const _id=req.body.user._id;
  const posts = await Post.find({postedBy: _id}).populate('postedBy', '_id name photo followers following').populate('comments.postedBy', '_id name photo');
  const user = await User.findById(_id).select("-password");
  console.log("IN MY_GET: ", {posts, user});
  if(posts) {
    res.json({myposts: posts, user: user});  
  } else {
    console.log(err);
    res.status(400).json({"ERROR": 'Could not fetch all posts.'});  
  }  
}

module.exports.view_a_user_get = async (req, res) => {
  console.log("INSIDE VIEW A USER GET!!!!!!!!!");
  User.findOne({_id: req.params.id})
  .select("-password")
  .then(user=> {
    Post.find({postedBy: req.params.id})
    .populate('postedBy', '_id name photo followers following')
    .populate('comments.postedBy', '_id name photo')
    .exec((err, posts)=> {
      if(err) {
        return res.status(422).json({"ERROR": error});
      }
      console.log({user, posts});
      res.json({user, posts});
    })
  })
  .catch((err)=> {
    return res.status(404).json({"ERROR": 'User not found!'});
  })
}

module.exports.follow_put= async (req, res) => {
  console.log("FOLLOW ID:", req.body.followId, " MY ID:", req.body.user._id);
  User.findByIdAndUpdate(req.body.followId, {
    $push: {followers: req.body.user._id}
  }, {
    new: true
  }, (err, result)=> {
    if(err) {
      return res.status(422).json({"ERROR": err});
    }

    User.findByIdAndUpdate(req.body.user._id, {
      $push: {following: req.body.followId}
    }, {new: true})
    .select("-password")
    .then(result=> {
      console.log("CAME INTO BACKEND RESULT!")
      console.log(result);
      return res.json(result);
    })
    .catch(err=>{
      return res.status(422).json({"ERROR": err});
    })

  })

}

module.exports.unfollow_put= async (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, {
    $pull: {followers: req.body.user._id}
  }, {
    new: true
  }, (err, result)=> {
    if(err) {
      return res.status(422).json({"ERROR": err});
    }

    User.findByIdAndUpdate(req.body.user._id, {
      $pull: {following: req.body.unfollowId}
    }, {new: true})
    .select("-password")  
    .then(result=> {
      return res.json(result);
    })
    .catch(err=>{
      return res.status(422).json({"ERROR": err});
    })

  })

}

module.exports.profile_update_photo_put= async (req, res) => {
  User.findByIdAndUpdate(req.body.user._id, {$set: {photo: req.body.photo}}, {new: true},  
    (err, result)=> {
      if(err) {
        return res.status(422).json({"ERROR": "Photo could not be uploaded! Try again!"});
      }
      res.json(result);
    }  
  )
}