const mongoose = require('mongoose')

const model = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    phone:{
        type:Number,
    },
    password:{
        type:String,
      
    },
    image:{
        type:String
    },
    location:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isgoogleVerified:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:'Active'
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    wallet:{
        type:Number,
        default:0
    },
   
})

const UserSchema = mongoose.model('users',model)

module.exports=UserSchema