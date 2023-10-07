var jwt = require('jsonwebtoken')

const adminAuth=(req,res,next)=>{
    const token=req.headers.authorization
    if(token){
try{
    jwt.verify(token.split(" ")[1], 'masai', function(err, decoded) {
  if(decoded){
    req.body.AdminId=decoded.AdminId
    next()
  }else{
    res.status(400).json({msg:"Wrong Token/Token Expired"})
  }
      });
}catch(err){
    res.status(400).json({msg:"Something going Wrong!!"})
}
    }else{
        res.status(400).json({msg:"Please Login first/You Are Not authorised!!"})
    }
}
module.exports={adminAuth}