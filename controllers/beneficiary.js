const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { Beneficiary } = require("../models/beneficiary");

const isValidRequest = function (data) {
    if (data === undefined || data === null || Object.keys(data).length === 0)
        return false;
    else
        return true;
};

const isValidObjectid = function (data) {
    return mongoose.isValidObjectId(data);
};

const isValidData = function (data) {
    if (data.length === 0 || data === null || data == undefined)
        return false;
    else
        return true;
}

const isValidNumber = function (data) {
    let copy = data + "";
    return copy.length;

}

const isValidIfsc = function (ifsc) {
    if (ifsc.length !== 11)
        return false;
}

const isValidBank = function (bankname) {
    if (["Bank of Baroda", "Bank of India", "Bank of Maharashtra", "Canara Bank", "Central Bank of India", "Indian Bank", "Indian Overseas Bank", "Punjab & Sind Bank", "Punjab National Bank", "State Bank of India", "UCO Bank", "Union Bank of India", "Axis Bank Ltd.", "Bandhan Bank Ltd.", "CSB Bank Ltd.", "City Union Bank Ltd.", "DCB Bank Ltd.", "Dhanlaxmi Bank Ltd.", "Federal Bank Ltd.", "HDFC Bank Ltd", "ICICI Bank Ltd.", "Induslnd Bank Ltd", "IDFC First Bank Ltd.", "Jammu & Kashmir Bank Ltd.", "Karnataka Bank Ltd.", "Karur Vysya Bank Ltd.", "Kotak Mahindra Bank Ltd", "Nainital Bank Ltd.", "RBL Bank Ltd.", "South Indian Bank Ltd.", "Tamilnad Mercantile Bank Ltd.", "YES Bank Ltd.", "IDBI Bank Ltd."].includes(bankname))
        return true;
    else
        return false;
}



// controllers :->
const addBeneficiary = async function (req, res) {

    try {

        const date = new Date();

        const d = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        const data = req.body;

        if (!isValidRequest(data)) {
            return res.status(400).send({
                status: "failed",
                message: "Please Send all required parameter with thier value in addBeneficiary response.",
                success: 0
            });
        };

        const { name, email, address, state, city, pincode, bank_account, bank_name, mobile_number, channel, ifsc_code, linked_mobile, orderId } = data;

        if (name == null || email == null || address == null || state == null || city == null || pincode == null || mobile_number == null || channel == null || ifsc_code == null || linked_mobile == null || orderId == null || bank_name == null) {
            return res.status(400).send({
                status: "failed",
                message: "Please Send all required parameter with their value in addBeneficiary response that is mention in your documention",
                success: 0
            });
        }

        var reg = /^[a-zA-Z][a-zA-Z\s]+$/;

        if (!reg.test(name) || name === undefined) {
            return res.status(400).send({
                status: "failed",
                message: "invalid name must be alphabet only",
                success: 0
            });
        };

        if (!validator.isEmail(email) || email === undefined) {
            return res.status(400).send({
                status: "failed",
                message: "invalid email",
                success: 0
            });
        };

        if (address.length < 10 || address === undefined) {
            return res.status(400).send({
                status: "failed",
                message: "invalid address atleast 10 letters required",
                success: 0
            });
        };

        if (state === null || state === undefined) {
            return res.status(400).send({
                status: "failed",
                message: "invalid state",
                success: 0
            });
        };

        if (city === null || city === undefined) {
            return res.status(400).send({
                status: "failed",
                message: "invalid city name",
                success: 0
            });
        };

        let pincodeSize = isValidNumber(pincode);

        if (pincodeSize !== 6) {
            return res.status(400).send({
                status: "failed",
                message: "invalid pincode",
                success: 0
            });
        };

        let bank_account_size = isValidNumber(bank_account);

        if (bank_account_size !== 14) {
            return res.status(400).send({
                status: "failed",
                message: "invalid bank account no.",
                success: 0
            });
        };

        if (!isValidBank(bank_name)) {
            return res.status(400).send({
                status: "failed",
                message: "invalid bank name",
                success: 0
            });
        }

        if (isValidNumber(linked_mobile) > 20) {
            return res.status(400).send({
                status: "failed",
                message: "invalid number",
                success: 0
            });
        };

        if (!["NEFT", "IMPS"].includes(channel)) {
            return res.status(400).send({
                status: "failed",
                message: "invalid channel",
                success: 0
            });
        };

        if (ifsc_code.length !== 11) {
            return res.status(400).send({
                status: "failed",
                message: "invalid ifsc Code",
                success: 0
            });
        };

        if (isValidNumber(mobile_number) > 15) {
            return res.status(400).send({
                status: "failed",
                message: "invalid number",
                success: 0
            });
        };

        if (orderId.length > 30) {
            return res.status(400).send({
                status: "failed",
                message: "invalid orderId",
                success: 0
            });
        };

        const token = jwt.sign(data, process.env.SECRET_KEY);

        data["api_key"] = token;

        const duplicateUser = await Beneficiary.find({ orderId });

        if (duplicateUser.length > 0) {
            return res.status(402).send({
                status: "failed",
                message: "Oops! your have send us a duplicate order id please send us it unique everytime",
                success: 0,
                date: d
            });
        };

        const userexist = await Beneficiary.find(data);

        if (userexist.length > 0) {
            return res.status(402).send({
                status: "failed",
                message: "Bank Account is Already exist with your beneficiry so please check it in your all beneficiry list!",
                success: 0,
                date: d
            });
        }

        res.setHeader("authorization", token);

        const savedbeneficiary = await Beneficiary.create(data);

        return res.status(402).send({
            restext: data,
            status: "success",
            orderId: orderId,
            success: 1,
            date: d,
        });
    }
    catch (error) {
        return res.status(500).send({
            status: "FAILED",
            message: "not get response from server side",
            response: 0,
            err: error.message
        });
    }
}


const getAllBeneficiary = async function (req, res) {
    try {

        const data = req.body;

        const { api_key, mobile_number, action } = data;

        const allBeneficiary = await Beneficiary.find({ action: "add_beneficiary" });

        if (allBeneficiary.length === 0) {
            return res.status(400).send({
                status: "FAILED",
                message: "Oops! No any record acccess by your order id",
                response: 0
            });
        }
        else {
            return res.status(200).send({
                datarecord: allBeneficiary,
                status: "success",
                success: 1,
                message: "successfully access your beneficiary account detail here"
            });
        }
    }
    catch (error) {
        return res.status(500).send({
            status: "FAILED",
            message: "not get response from server side",
            response: 0,
            err: error.message
        });
    }
}


const deleteBeneficiary = async function (req, res) {
    try {

        const data = req.body;

        const { bank_account, mobile_number } = data;

        if ((isValidNumber(bank_account) > 14)) {
            return res.status(400).send({
                status: "FAILED",
                message: "invalid bank_account number",
                response: 0
            });
        }
        const userdata = await Beneficiary.findOne({ bank_account });

        if (!userdata) {
            return res.status(400).send({
                status: "FAILED",
                message: "Oops! No any record acccess by your order id",
                success: 0
            });
        }

        const deleteduser = await Beneficiary.deleteOne({ bank_account });

        return res.status(200).send({
            status: "SUCCESS",
            message: "user deleted successfully",
            response: 1,
            data: userdata
        });

    }
    catch (error) {
        return res.status(500).send({
            status: "FAILED",
            message: "not get response from server side",
            response: 0,
            err: error.message
        });
    }
}


module.exports.addBeneficiary = addBeneficiary;
module.exports.getAllBeneficiary = getAllBeneficiary;
module.exports.deleteBeneficiary = deleteBeneficiary;