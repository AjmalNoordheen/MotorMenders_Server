const UserSchema = require("../Model/userSchema")

const isBlocked = async(req,res,next)=>{
    try {
        const {email} = req.query
        const {nav}   = req.query
        const {type}  = req.query
        if(type!='pro'){
            const user = await UserSchema.findOne({email:email})
            if (!user) {
               next()
              }
    
            if(user.isBlocked==true){
                res.json({message:'blocked'})
            }
            else if(nav!=true){
                next()
            }else{
                res.json({message:'not found'})
            }
        }else{
            next()
        }
      
       
    } catch (error) {
        res.status(500)
    }
}

module.exports={isBlocked}