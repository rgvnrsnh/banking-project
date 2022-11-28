const mongoose = require("mongoose");
const validator = require("validator");


const beneficiary = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, max: 100, min: 10, required: true },
        state: { type: String, max: 50, required: true },
        city: { type: String, max: 50, required: true },
        pincode: { type: Number, min: 6, required: true },
        bank_account: { type: Number, unique: true, required: true },
        bank_name: { type: String, required: true },
        mobile_number: { type: Number, required: true },
        channel: { type: String, required: true },
        ifsc_code: { type: String, min: 11, required: true },
        linked_mobile: { type: Number, unique: true, required: true },
        orderId: { type: String, unique: true, max: 30, required: true },
        action: { type: String, required: true },
        api_key: { type: String, max: 255, unique: true },
        action: { type: String, required: true, default: "add_beneficiary" }
    }
);

const Beneficiary = new mongoose.model("Beneficiary", beneficiary);


module.exports = { Beneficiary };






