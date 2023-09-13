const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
        
      PaymentType: {
        type: String,
      },
      withdrawStatus:{ 
        type:String,
      },
      date: {
        type: Date,
      },
      bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookings",
      },
      userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
      },
      professional:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'mechanics'
      },
      type:{
        type:String
      },
      accDetails: 
        {
          accNo: {
            type: Number,
          },
          holderName:{
            type:String
          },
          bankName:{
            type:String
          },
          ifsc:{
            type:String
          },
          branch:{
            type:String
          },
          amount:{
            type:Number
          }
        },    
})

const transactinModel = mongoose.model("transactions", transactionSchema);

module.exports = transactinModel;


   