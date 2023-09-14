const jwt = require('jsonwebtoken')
const env = require('dotenv').config()


// const verifyToken = async (req, res, next) => {
//     let token    = req.header('Authorization')
//     const {data} = req.query.data?req.query.data:''
//     try {
//         if (!token)return res.json({status:false,token:false, message: "Authentication failed: no token provided." });        

//         if (token.startsWith("Bearer ")) {
//             token = token.slice(7, token.length).trimLeft();
//         }
//         const verified = jwt.verify(token,process.env.jwtSecretKey);
//         if(data==1 && verified){
//             res.status(200)
//         }else if(verified){
//             next()
//          }else{
//             return res.json({status:false, message: "Authentication failed: invalid token." });
//         }
//     } catch (error) {
//         return res.json({status:false, message: "Authentication failed: invalid token." });
//     }
// };

const verifyToken = async (req, res, next) => {
    let token = req.header("Authorization");
    try {
      if (!token)
        return res
          .status(404)
          .json({status:false,token:false, message: "Authentication failed: no token provided." });
  
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
      }
      const verified = jwt.verify(token,process.env.jwtSecretKey);
      req.user = verified;
      if(verified){
        next();
      }else{
        res.json({status:false,token:false, message: "Authentication failed: no token provided." });
      }
    } catch (error) {
      return res
        .json({status:false,message: "Authentication failed: invalid token." });
    }
  };


const generateToken=(userDetails)=>{
    const token = jwt.sign({id:userDetails._id,name:userDetails.name,email:userDetails.email,role: "user" },process.env.jwtSecretKey,
    // {expiresIn:'2h'}
    )
    return token
}

const generateProToken = (data) => {
    const token = jwt.sign(
      { _id: data._id, email: data.email, name: data.name, role: "professional" },
      process.env.jwtSecretKey,
      // {expiresIn:'2h'}
    );
    return token;
  };


  const generateAdminToken = (data) => {
    console.log(data, "token data");
    const token = jwt.sign(
      { _id: data._id, email: data.email, role: "admin" },
      process.env.jwtSecretKey,
      // {expiresIn:'2h'}
    );
    return token;
  };

  const verifyAdminToken = async (req, res, next) => {
    try {
      // Use the verifyToken function to verify the token first
      await verifyToken(req, res, async () => {
        // Check if the user role is 'admin'
        if (req.user && req.user.role === 'admin') {
          next(); // If admin, proceed to the next middleware
        } else {
          res.json({status:false, message: 'Access denied: Not an admin.' });
        }
      });
    } catch (error) {
      console.log(error);
      return res
        .json({status:false, message: 'Authentication failed: invalid token.' });
    }
  };

  const verifyProToken = async (req, res, next) => {
    try {
      // Use the verifyToken function to verify the token first
      await verifyToken(req, res, async () => {
        // Check if the user role is 'professional'
        if (req.user && req.user.role === 'professional') {
          next(); // If professional, proceed to the next middleware
        } else {
          res.json({status:false, message: 'Access denied: Not an professional.' });
        }
      });
    } catch (error) {
      console.log(error);
      return res
        .json({status:false,message: 'Authentication failed: invalid token.' });
    }
  };

module.exports={generateToken,verifyToken,generateProToken,generateAdminToken,verifyAdminToken,verifyProToken}



