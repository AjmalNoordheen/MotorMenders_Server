const reviewModel = require("../Model/reviewModel");
const userwModel = require("../Model/userSchema");
const proModel = require("../Model/mechanicSchema");



// add review 

const addReview=async(req,res)=>{
    try {
        const userId=req.user.id
        const data=req.body
        const samePro=await reviewModel.findOne({professional:data.proId}).populate('professional')
        
        if(!samePro){
        const saveReview = reviewModel.create({professional:data.proId,user:userId,description:data.reviewText,rating:data.rating})
        res.status(200).json({message:'Review submitted successfully'})
        }else{
            res.json({message:`You already reviewed ${samePro.professional.name} `})
        }

    } catch (error) {
        res.status(500).json('server error')
    }
}

const getReview=async(req,res)=>{
try {

    const proId=req.query.id

    const reviews = await reviewModel.find({professional:proId}).populate('professional').populate('user')
   if(reviews.length){
    const rating = reviews.map((doc)=>{
        return(doc.rating)
    }).reduce((a,b)=>{
        return(a+b)
    })
    const totalRating=rating/reviews.length
    res.status(200).json({reviews,totalRating,message:'success'})

   }else{
    res.status(200).json({message:'No Reviews Added'})
   }
} catch (error) {
    res.status(500).json('server error')
}
}
module.exports={
    addReview,
    getReview
}