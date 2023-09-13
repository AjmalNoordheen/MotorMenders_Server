const bookingSchema = require('../Model/BookingSchema');
const UserSchema = require('../Model/userSchema');
const proSchema  = require('../Model/mechanicSchema');
const transactionSchema  = require('../Model/transactionSchema');
// ============Save Booking Details==============
    const BookingDetails = async(req,res)=>{
        try {
            const {bookingData} = req.body
            
            const date =new Date( bookingData.date)
            // const options = { year: 'numeric', month: 'short', day: 'numeric' };
            // const formattedDate = date.toLocaleDateString('en-US', options);            
            const user = await UserSchema.findOne({email:bookingData.userEmail})
            const BookingSave = await bookingSchema.create({
                user:user._id,
                mechanic:bookingData.proDetails._id,
                BookingDate:date,
                unSavedDate:bookingData.date,
                fees:bookingData.fees,
                location:bookingData.location,
                landmark:bookingData.landMark
            })
            if(BookingSave){
                res.json({status:'success'})
            }else{
                res.status(500)
            }
        } catch (error) {
            res.status(500)
        }
    }


//============================bookingExist ==================

const bookingExist = async (req,res)=>{
   try {
    const {email} = req.query
    const pro =await proSchema.findOne({email:email})
    const dateExist = await bookingSchema.find({mechanic:pro._id}) 
    const unSavedDates = dateExist.map((doc) => doc.unSavedDate).map((doc)=> doc);
    if(unSavedDates){
        res.status(200).json({unSavedDates})
    }else{
        res.json({status:'no date'})
    }
    
   } catch (error) {
   res.status(500)
   }
}

// ======================getUserBooking ==================

const getUserBooking = async (req,res)=>{
    try {
        const email = req.query.email
        const status = req.query.status
        const user = await UserSchema.findOne({email:email})
        if(status=='pending'){
            const bookingDetails = await bookingSchema.find({user:user._id,status:'pending'}).populate('mechanic')
            const date =new Date( bookingDetails.BookingDate)
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                const formattedDate = date.toLocaleDateString('en-US', options);   
           if(bookingDetails){
            res.status(200).json({bookingDetails,Date:formattedDate})
        }
       
       }else if(status=='completed'){
        const bookingDetails = await bookingSchema.find({user:user._id,status:'completed'}).populate('mechanic')
        const date =new Date( bookingDetails.BookingDate)
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);   
        if(bookingDetails){
        res.status(200).json({bookingDetails,Date:formattedDate})
    }
       }else if(status=='cancelled'){
        const bookingDetails = await bookingSchema.find({user:user._id,status:'cancelled'}).populate('mechanic')
        const date =new Date( bookingDetails.BookingDate)
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);   
        if(bookingDetails){
        res.status(200).json({bookingDetails,Date:formattedDate})
       }
       res.json({message:'false'})
      } 
    } catch (error) {
        res.status(500)
    }
}


// ======================== CancelBooking ================
    const cancelBooking = async (req,res)=>{
        try {
            const {id} = req.query
            const updatedData = await bookingSchema.updateOne({_id:id},{$set:{status:'cancelled',request:'Rejected'},$unset:{unSavedDate:1}}) 
            if(updatedData){
                res.status(200).json({message:'success'})
            }else{
                res.json({message:'no data'})
            }
        } catch (error) {
            res.status(500)
        }
    }

// ================List BOOKings ============
const listAllBooking = async (req, res) => {
    try {
      const { id, status } = req.query;
      if (status === 'all') {
        const allBooking = await bookingSchema
          .find({ mechanic: id,status:'pending' })
          .populate('user')
          .sort({ unSavedDate: 1 })
          .limit(5);
  
        if (allBooking) {
          res.status(200).json(allBooking);
        } else {
          res.status(200).json([]);
        }
      } else if (status === 'total') {
        const bookingCount = await bookingSchema.countDocuments({ mechanic: id });
        res.status(200).json(bookingCount);
      } else if (status === 'completed') {
        const completedCount = await bookingSchema.countDocuments({
          mechanic: id,
          status: 'completed',
        });
        res.status(200).json(completedCount);
      } else if (status === 'pending') {
        const pendingCount = await bookingSchema.countDocuments({
          mechanic: id,
          status: 'pending',
        });
        res.status(200).json(pendingCount);
      } else {
        res.status(400).json({ message: 'Invalid status parameter' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
// ===============ProBookings =======================

const proBookings = async (req, res) => {
  try {
      const { id } = req.query;
      const bookings = await bookingSchema.find({ mechanic: id });

      if (bookings.length > 0) {
          res.json(bookings);
      } else {
          res.status(404).json({ message: 'No bookings found for this mechanic.' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================WalletDetails==================

  const walletdetails = async(req,res)=>{
    try {
      const {senderData,type} = req.query
      if(type=='user'){
        const userDetails = await UserSchema.findOne({_id:senderData})
        const transactionDetails = await transactionSchema.find({userId:userDetails._id,withdrawStatus:{ $exists:false}}).populate('bookingId').populate('professional').populate('userId')
        if(transactionDetails){
          res.json({wallet:userDetails.wallet,transactions:transactionDetails})
        }else{
          res.status(500)
        }
      }else{
        const proDetails = await proSchema.findOne({_id:senderData})
        const transactionDetails = await transactionSchema.find({professional:proDetails._id,withdrawStatus:{ $exists:false}}).populate('bookingId').populate('userId').populate('professional')
        if(transactionDetails){
          res.json({wallet:proDetails.wallet,transactions:transactionDetails})
        }else{
          res.status(500)
        } 
      }
     
    } catch (error) {
      res.status(500)
    }
  }

// ================================= withDrawelRequest ========================
  const withDrawelRequest = async(req,res)=>{
    try {
      const data = req.body.withDrawel
      let withdrawSavedData

      if(data.type=='user'){
       withdrawSavedData = await transactionSchema.create({
         type:'withdrawel',
         withdrawStatus:'requested',
         date:new Date(),
         userId:data.holderID,
         accDetails:{
          accNo:data.accountNumber,
          holderName:data.holderName,
          bankName:data.bankName,
          ifsc:data.ifscCode,
          branch:data.branch,
          amount:data.amount   
         }
        })
      }else{
        withdrawSavedData = await transactionSchema.create({
          type:'withdrawel',
          withdrawStatus:'requested',
          date:new Date(),
          professional:data.holderID,
          accDetails:{
           accNo:data.accountNumber,
           holderName:data.holderName,
           bankName:data.bankName,
           ifsc:data.ifscCode,
           branch:data.branch,
           amount:data.amount   
          }
         })
      }

      if(withdrawSavedData){
        res.status(200).json("success")
      }else{
        res.status(200).json("failed")
      }

    } catch (error) {
      res.status(500)
    }
  }

// ================Manage WithdrawelRequest =========================
const getWithdrawelRequest = async(req,res)=>{
  try {
      const requests = await transactionSchema.find({withdrawStatus:'requested'}).populate('userId').populate('professional')
      if(requests){
        res.json({status:'success',data:requests})
      }else{
        res.json({status:'failed'})
      }
  } catch (error) {
    res.status(500)
  }
}
// ============= Update the Withdrawel datas ====================

  const updateWithdrawel = async(req,res)=>{
    try {
      const {withdrawel,holderId,type} = req.body
      console.log(type=='user')
      const updatedWithDrawData = await transactionSchema.findOneAndUpdate({_id:withdrawel},{$set:{withdrawStatus:'accepted'}})
      console.log(updatedWithDrawData)
      if(type == 'user'){
        const userDetails = await UserSchema.findOneAndUpdate({_id:holderId},{$inc:{wallet:-updatedWithDrawData.accDetails.amount}})
        res.status(200).json({message:'success'})
        return 
      }else if(type == 'professional'){
        const proDetails = await proSchema.findOneAndUpdate({_id:holderId},{$inc:{wallet:-updatedWithDrawData.accDetails.amount}})
        res.status(200).json({message:'success'})
        return 
      }else{
        res.status(500)
      }

    } catch (error) {
      res.status(500)
    }
  }

 

 module.exports={BookingDetails,bookingExist,getUserBooking,cancelBooking,
                listAllBooking,proBookings,walletdetails,withDrawelRequest,getWithdrawelRequest,updateWithdrawel}