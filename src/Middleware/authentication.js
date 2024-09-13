const jwt = require('jsonwebtoken');
const global = require('../global')


module.exports =  (req, res, next) => {
  //console.log("req linea 7")
  //console.log(req)
  const token = req.headers.authorization;
  //console.log(token)
  const token_1 = String(token.slice(7, token.length));
  //console.log(token_1)
  if (!token){
    return res.status(403).json({message:'No token provided'})
  }
  
    jwt.verify(token_1, process.env.JWT_SECRET, (err, user)=>{
    
    if (err){
      console.log(err)
      return res.status(500).json({message: 'Failed to authenticate token'})
    }
    //console.log(user)
    req.user=user
    next();
    //req.user.id= decoded.id
  });
};

