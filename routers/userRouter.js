const express        = require('express')
const router         = express.Router()
const userController = require('../controller/userController')
const bookingController = require('../controller/bookingController')
const auth           = require('../middleWare/auth')
const multer         = require('../config/multer')
const upload         = multer.createMulter()
const check          = require('../middleWare/checkBlocked')
const chatController = require('../controller/chatController')
const reviewController = require('../controller/reviewController')


router.post('/signUp',userController.userSignup)
router.post('/setVerified',userController.setVerified)
router.post('/login',check.isBlocked,userController.userLogin)
router.get('/getDetails',check.isBlocked,auth.verifyToken)
router.get('/blockAuth',check.isBlocked)
router.post('/verify',userController.UpdatedVerification)
router.post('/googleMail',check.isBlocked,userController.googleMailDetails)
router.post('/otpLogin',userController.checkMobile)
router.get('/getUserProfile',check.isBlocked,auth.verifyToken,userController.userProfile)
router.patch('/editUser',check.isBlocked,auth.verifyToken,upload.single('file'),userController.editUserProfile)
router.get('/proSingleDetails',check.isBlocked,userController.proSingleDetails)
router.post('/saveBookingDetails',check.isBlocked,auth.verifyToken,bookingController.BookingDetails)
router.get('/bookingExist',auth.verifyToken,bookingController.bookingExist)
router.get('/getUserBookings',check.isBlocked,bookingController.getUserBooking)
router.patch('/cancelBooking',bookingController.cancelBooking)
router.get('/loadChat',check.isBlocked,auth.verifyToken,chatController.loadChat)
router.post('/addMessage',chatController.addMessage)
router.get('/listChat',chatController.listChat)
router.get('/fetchMessages',chatController.fetchMessages)
router.get('/walletdetails',bookingController.walletdetails)
router.post('/withDrawelRequest',bookingController.withDrawelRequest)
router.post('/addReview',auth.verifyToken,reviewController.addReview)
router.get('/getReview',reviewController.getReview)


module.exports=router