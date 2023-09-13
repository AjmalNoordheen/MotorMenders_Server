const mongoose = require('mongoose');

const BookingModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    mechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mechanics'
    },
    BookingDate: {
        type: Date, // Change the type to Date
        required: true
    },
    fees: {
        type: Number
    },
    location: {
        type: String
    },
    phone: {
        type: Number
    },
    landmark: {
        type: String
    },
    unSavedDate: {
        type: Date
    },
    status:{
        type:String,
        default:'pending'
    },
    request:{
        type:String,
        default:'requested'
    }
});

const BookingSchema = mongoose.model('bookings', BookingModel);
module.exports = BookingSchema;
