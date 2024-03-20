// db khách hàng
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    address: { type: String, required: true },
    destination: { type: String, required: true }

})
module.exports = mongoose.model('Customer1', customerSchema)