var jwt = require('jsonwebtoken');

const auth=async(req,res,next)=>{
    const token=req.headers.authorization
if(token){
    try{
    jwt.verify(token.split(" ")[1], 'masai', function(err, decoded) {
    if(decoded){
        req.body.userId=decoded.userId
        next()
    }else{
        res.status(400).json({msg:"Token expired or wrong token "})
    }
      });
}catch(err){
    res.status(400).json({msg:err})
}}
else{
    res.status(400).json({msg:"please login first "})
}
}
module.exports={auth}