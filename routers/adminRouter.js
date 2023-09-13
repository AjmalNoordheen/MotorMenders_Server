const express        = require('express')
const adminrouter    = express.Router()
const auth           = require('../middleWare/auth')
const adminController = require('../controller/adminController')
const bookingController = require('../controller/bookingController')

adminrouter.post('/login',adminController.adminLogin)
adminrouter.post('/blockuser',auth.verifyAdminToken,adminController.blockuser)
adminrouter.post('/listTypes',auth.verifyAdminToken,adminController.listType)
adminrouter.get('/listTypes',adminController.displayType)
adminrouter.delete('/deleteType',auth.verifyAdminToken,adminController.deleteType)
adminrouter.patch('/editType',auth.verifyAdminToken,adminController.editType)
adminrouter.get('/getuser',auth.verifyAdminToken,adminController.listUsers)
adminrouter.get('/getProfessionals',auth.verifyAdminToken,adminController.listFreelancer)
adminrouter.get('/getMechanic',auth.verifyAdminToken,adminController.getMechanic)
adminrouter.get('/getWithdrawelRequest',auth.verifyAdminToken,bookingController.getWithdrawelRequest)
adminrouter.patch('/updateWithdrawel',auth.verifyAdminToken,bookingController.updateWithdrawel)
adminrouter.get('/getDashbordDetails',auth.verifyAdminToken,adminController.getDashbordDetails)




module.exports = adminrouter