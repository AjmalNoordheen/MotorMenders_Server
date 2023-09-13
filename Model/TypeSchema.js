const mongoose = require('mongoose')

const typeSchema = new mongoose.Schema({
    name:{
        uppercase:true,
        trim:true,
        type:String    
    }
})


const typeModel= mongoose.model('types',typeSchema)
module.exports=typeModel