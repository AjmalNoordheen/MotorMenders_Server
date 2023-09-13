const mongoose = require('mongoose')

const mechanicSchema=  new mongoose.Schema({
    name:{
        type    :String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    types:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'types'
    }],
    fees:{
        type:Number,
       default:0
    },
    workingTime:{
        type:String,
    },
    address:{
        type:String,
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    location:{
        type:String,
    },
    work:{
        type:String
    },
    isVerified:{
        type:Boolean
    },
    isgoogleVerified:{
        type:Boolean
    },
    status:{
        type:String,
        default:'Active'
    },
    isBlocked:{
        type:Boolean,
        default:'false'
    },
    image:{
        type:String
    },
    map:{
        type:Object
    },
    wallet: {
       type:Number,
       default:0
      },
      gallery:[
        {
            image:{
                type:String
            }
        }
      ]
})

const mechanicModel = mongoose.model('mechanics',mechanicSchema)
module.exports=mechanicModel
