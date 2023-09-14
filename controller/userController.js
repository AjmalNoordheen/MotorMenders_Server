const userSchema = require("../Model/userSchema");
const proSchema  = require('../Model/mechanicSchema')
const bcrypt     = require("bcrypt");
const authToken  = require('../middleWare/auth')
const env        = require('dotenv').config()
const nodemailer = require('nodemailer')
const cloudinary  = require('../config/cloudinary')
const fs = require('fs')


// ========User SignUp=========

const userSignup = async (req, res) => {
  try {
    let { name, email, mobile, password, repassword ,location } = req.body;
    if (password != repassword) {
      res.json({ status: false, message: "password dosent matched" });
    } else {
      const userDetails = await userSchema.findOne({email: email });
      const ExistPhone  = await userSchema.findOne({phone:mobile})
      if (!userDetails) {

        if(ExistPhone){
          return res.json({status:false,message:'phone number already exists'})
        }
        password = await bcrypt.hash(password, 10);
       const userDEtails =await userSchema.create({
          name,
          email,
          password,
          phone: mobile,
          location:location,
          isVerified:true
        });

        // const verifyEmail = await sendVerifyMail(userDEtails.name,userDEtails.email,userDEtails._id)
        // if(verifyEmail.result){
        //   res.json({ status: true, message: 'Registration Success Please Verify Your Mail' });
        //  }else{
        //   await userSchema.deleteOne({email:userDEtails.email})
        //   res.json({ status: false, message: 'Email Not Send' });
        //  }
        if(userDEtails){
          res.json({status:true})
        }else{
          await userSchema.deleteOne({email:userDEtails.email})
          res.json({ status: false});
        }
      } else {
       
         if(userDetails.isgoogleVerified==true){
          password = await bcrypt.hash(password, 10);
          const DBdetails =await userSchema.updateOne({email:userDetails.email},{$set:{
            name       :name,
            email      :email,
            phone      :mobile,
            password   :password,
            location   :location,
            isVerified :true
          }})
          console.log(DBdetails);
          res.json({ status: true, message: 'Registration Success please Login' });   
      }else{
        return res.json({ status: false, message: "User already exists" });
      }
      }
    }
  } catch (error) {
    console.log(error);
  }
};


// ==============User Login===========

const userLogin = async (req, res) => {
  let userSignUp = {
    Status: false,
    message: null,
    token: null,
    name: null,
    email: null
  };

  const { email, password } = req.body;
  try {
    const user = await userSchema.findOne({ email: email });

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return res.json({ status: false, message: 'Password entered is incorrect' });
    }

    if (user.isVerified === true) {
      const token = authToken.generateToken(user);
      console.log('okokokokokokokokokokok');
      userSignUp.Status = true;
      userSignUp.message = 'You are logged in';
      userSignUp.token = token;
      userSignUp.name = user.name;
      userSignUp.email = user.email;

      return res.json({ userSignUp,user });
    } else {
      res.json({ status: false, message: 'Email is not verified' });
    }
  } catch (error) {
    // Handle any other errors that might occur during the database query or password comparison.
    console.error(error);
    res.status(500).json({ status: false, message: 'An error occurred' });
  }
};

  
// ==============Verify Email==============

   const sendVerifyMail = async (username, email, user_id,pro) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "noorudheenajmal@gmail.com",
          pass: process.env.nodeMailerCode,
        },
      });
      
      if(pro){
        const mailOption = {
          from: "noorudheenajmal@gmail.com",
          to: email,
          subject: "Email verification",
          html: `<p>Hii ${username}, please click <a href="http://localhost:5173/proffesional?id=${user_id}">here</a> to verify your email.</p>`,
        };  
        return new Promise((resolve, reject) => {
          transporter.sendMail(mailOption,(error, info) => {
            if (error) {
              console.log(error.message);
              console.log("Email could not be sent");
              reject({result:false}); // Reject the promise with the error
            } else {
              resolve({result:true}); // Resolve the promise with the response
            }
          });
        });
      }else{
        const mailOption = {
          from: "noorudheenajmal@gmail.com",
          to: email,
          subject: "Email verification",
          html: `<p>Hii ${username}, please click <a href="http://localhost:5173/verify?id=${user_id}">here</a> to verify your email.</p>`,
        };  

     
      return new Promise((resolve, reject) => {
          transporter.sendMail(mailOption,(error, info) => {
            if (error) {
              console.log(error.message);
              console.log("Email could not be sent");
              reject({result:false}); // Reject the promise with the error
            } else {
              resolve({result:true}); // Resolve the promise with the response
            }
          });
        });
              }

      } catch (error) {
        console.log(error);
        console.log("Error occurred while sending email");
        throw error; // Throw the error to be caught in the caller function
     }
  };

  // ========Email Verification  Update =========

    const UpdatedVerification = async(req,res)=>{
      try {
        const user = req.body
        if(user.id){
          const k = await userSchema.findOne({_id:user.id})
          const Details = await userSchema.updateOne({_id:user.id},{$set:{
            isVerified:true
          }})
        }
      
      } catch (error) {
        console.log(error);
      }
    }


// ==========Login googleMailDetails============

const googleMailDetails = async(req,res)=>{
  try {
   const payloadDetails =  req.body
   const userDetails   = await userSchema.findOne({email:payloadDetails.email})
   console.log(userDetails,'kkkk');

   let userSignUp={
    Status  : false,
    message : null,
    token   : null,
    name    : null,
    email   :null
    }
   if(userDetails){
    if(userDetails.isgoogleVerified == false){
      userSchema.updateOne({_id:userDetails._id},{$set:{isgoogleVerified:true}})
    }
    const token        = authToken.generateToken(userDetails)    
    userSignUp.Status  = true,
    userSignUp.message = 'you are logged in',
    userSignUp.token   = token,
    userSignUp.name    = userDetails.name
    userSignUp.email   = userDetails.email
    return  res.json({userSignUp,user:userDetails})
   }else{
      const newUser    = await userSchema.create({
      name             : payloadDetails.name,
      email            : payloadDetails.email,
      isVerified       : true,
      isgoogleVerified : true 
    })
    const token        = authToken.generateToken(newUser)    

    userSignUp.Status  = true,
    userSignUp.message = 'you are logged in',
    userSignUp.token   = token,
    userSignUp.name    = newUser.name
    userSignUp.email   = payloadDetails.email

    return  res.json({userSignUp,user:userDetails})
   }
  } catch (error) {
    console.log(error);
  }
}


// =============== checkMobile =============
const checkMobile = async (req,res)=>{
  try {
      const {newPhone} = req.body
      const user = await userSchema.findOne({phone:newPhone})
      if(user){
          const token = authToken.generateToken(user)
          const data={
              token
          }
          res.status(200).json({data,message:'success'})
      }else{
        res.status(404).json({ errMsg: "User not found" });
      }
  } catch (error) {
      res.status(500).json({ errMsg: "Server Error"})
 }
}



// ==============================userProfile ==================
  const userProfile = async(req,res)=>{
    try {
      const email = req.query.email
      if(email){
        const user =await userSchema.findOne({email:email})
        if(user){
          res.status(200).json({user})
        }else{
          res.status(500)
        }
      }else{
        res.status(500)
      }
    } catch (error) {
      res.status(500)
    }
  }
 

// ================================EditUserProfile=============
    const editUserProfile = async(req,res)=>{
      try {
      const userDetails = req.body
      const file = req.file
      const user = await userSchema.findOne({email:userDetails.email})
      let img
      if(user){
        if(file){
          const uplode = await cloudinary.cloudinary.uploader.upload(file?.path)
          img =  uplode.secure_url
          const Updateduser = await userSchema.updateOne({_id:user._id},{$set:{name:req.body.name,phone:req.body.phone,location:req.body.location,image:img}})
         fs.unlinkSync(file.path)
          res.status(200).json({message:'success'})
        }else{
          const Updateduser = await userSchema.updateOne({_id:user._id},{$set:{name:req.body.name,phone:req.body.phone,location:req.body.location}})
          res.status(200).json({message:'success'})
        }
      
      }else{
        res.status(500)
      }
      } catch (error) {
        res.status(500)
      }
    }

   
  
// =========================proSingleDetailed Page=================
    const proSingleDetails = async(req,res)=>{
      try {
        const proemail = req.query.proEmail
        const pro = await proSchema.findOne({email:proemail}).populate('types')
        if(pro){
          res.status(200).json({status:"success",data:pro})
        }else{
          res.json({status:'failed'})
        }
      } catch (error) {
        res.status(500)
      }
    }



module.exports = { userSignup,userLogin,sendVerifyMail,
                  UpdatedVerification,googleMailDetails,
                  checkMobile,userProfile,editUserProfile,proSingleDetails};
