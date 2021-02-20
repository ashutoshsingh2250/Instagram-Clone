const config = require('config');
const jwt = require('jsonwebtoken');
const { User } = require('../models/users');

module.exports.authUser = function (req, res, next) {
  console.log('authUser:');
  console.log(req.body);
  const token = req.cookies.jwt;
  //const token = req.headers['x-auth-token'];
  console.log("TOKEN: "+ token);
  if(!token)  res.json({"ERROR": "User authentication failed!"});
  else {
    jwt.verify(token, config.get('jwtPrivateKey'), (err,decodedToken)=>{
      if(err) {
        console.log(err.message);
        res.json({"ERROR": "User authentication failed!!"});
      } else {
        req.body.name=decodedToken.name;
        console.log(decodedToken);
        next();
      }
    });
  }
}

module.exports.checkUser= function(req, res, next) {
  console.log('checkUser');
  
  const token = req.cookies.jwt;
  //const token = req.headers['x-auth-token'];
  if(!token)  {
    res.locals.user=null;
    next(); 
  }
  else {
    jwt.verify(token, config.get('jwtPrivateKey'), async (err,decodedToken)=>{
      if(err) {
        console.log(err.message);
        res.locals.user=null;
        req.body.user=null;
        next();
      } else {
        console.log(decodedToken);
        const user = await User.findOne({ name: decodedToken.name }, {password: 0});
        res.locals.user=user;
        req.body.user=user;
        next();
      }
    });
  }
}