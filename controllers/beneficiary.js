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

const isValidInput = function (data) {
    if (data != null && data != undefined) {
        return true;
    } else {
        return false;
    }
}

const getdate = function () {
    const date = new Date();

    const d = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    return d;
}

// Functions :->
const addBeneficiary = async function (req, res) {

    try {

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

        if (bank_account_size > 14) {
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
                date: getdate()
            });
        }

        res.setHeader("authorization", token);

        const savedbeneficiary = await Beneficiary.create(data);

        return res.status(202).send({
            restext: data,
            status: "success",
            orderId: orderId,
            success: 1,
            date: getdate(),
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

        const { api_key, mobile_number } = data;

        const allBeneficiary = await Beneficiary.find({ mobile_number });

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

        const filter = req.body;

        const { bank_account, mobile_number } = filter;


        if ((isValidNumber(bank_account) > 14)) {
            return res.status(400).send({
                status: "FAILED",
                message: "invalid bank_account number",
                response: 0
            });
        }

        if ((isValidNumber(mobile_number) < 10)) {
            return res.status(400).send({
                status: "FAILED",
                message: "invalid mobile number",
                response: 0
            });
        }
        const userdata = await Beneficiary.findOne({ bank_account, mobile_number });

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

const specialBeneficiary = async function (req, res) {
    try {
        let filter = {};

        let data = req.body;
        const { bank_account, mobile_number } = data;

        if (bank_account === null || bank_account === undefined || (isValidNumber(bank_account) > 14)) {
            return res.status(400).send({
                status: "failed",
                message: "invalid account number",
                success: 0
            });
        }
        else {
            filter["bank_account"] = bank_account;
        }

        if (mobile_number === null || mobile_number === undefined || (isValidNumber(mobile_number) < 10)) {
            return res.status(400).send({
                status: "failed",
                message: "invalid mobile number",
                success: 0
            });
        }
        else {
            filter["mobile_number"] = mobile_number;
        }

        const userfound = await Beneficiary.find(filter);

        if (userfound.length === 0) {
            return res.status(400).send({
                status: "FAILED",
                message: "Oops! No any record acccess by this account number",
                response: 0
            });
        }
        else {
            return res.status(200).send({
                datarecord: userfound,
                status: "success",
                success: 1,
                message: "successfully access your  beneficiary account detail here"
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


const accountVerification = async function (req, res) {

    try {
        let filter = {};

        const data = req.body;

        const { Beneficiary_id, mobile_number, mobile, name, ifsc_code, bank_account, bank_name, channel, email, address, state, city, pincode } = data;

        if (Beneficiary_id != null && Beneficiary_id != undefined) {
            filter["orderId"] = Beneficiary_id;
        }

        if (mobile_number != null && mobile_number != undefined && (isValidNumber(mobile_number)) >= 10) {
            filter["mobile_number"] = mobile_number;
        }

        if (mobile != null && mobile != undefined && (isValidNumber(mobile)) >= 10) {
            filter["linked_mobile"] = mobile;
        }

        if (name != null && name != undefined) {
            filter["name"] = name;
        }

        if (ifsc_code != null && ifsc_code != undefined) {
            filter["ifsc_code"] = ifsc_code;
        }

        if (bank_account != null && bank_account != undefined) {
            filter["bank_account"] = bank_account;
        }

        if (bank_name != null && bank_name != undefined) {
            filter["bank_name"] = bank_name;
        }

        if (channel != null && channel != undefined) {
            filter["channel"] = channel;
        }

        if (email != null && email != undefined) {
            filter["email"] = email;
        }

        if (address != null && address != undefined) {
            filter["address"] = address;
        }

        if (state != null && state != undefined) {
            filter["state"] = state;
        }

        if (city != null && city != undefined) {
            filter["city"] = city;
        }

        if (pincode != null && pincode != undefined) {
            filter["pincode"] = pincode;
        }

        const userfound = await Beneficiary.find(filter);

        if (userfound.length === 0) {
            return res.status(400).send({
                status: "FAILED",
                message: "Oops! No any record acccess by your order id",
                response: 0
            });
        }
        else {
            return res.status(200).send({
                datarecord: userfound,
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


const moneyTransfer = async function (req, res) {

    try {
        let reciever = {}, sender = {};

        const data = req.body;

        const { orderId, mobile_number, mobile, name, ifsc_code, bank_account, bank_name, channel, email, address, state, city, pincode, amount } = data;

        if (isValidInput(orderId)) {
            reciever["orderId"] = orderId;
        }

        if (isValidInput(mobile_number)) {
            reciever["linked_mobile"] = mobile_number;
        }

        if (isValidInput(mobile)) {
            sender["mobile_number"] = mobile;
        }

        if (isValidInput(name)) {
            reciever["name"] = name;
        }

        if (isValidInput(ifsc_code)) {
            reciever["ifsc_code"] = ifsc_code;
        }

        if (isValidInput(bank_name)) {
            reciever["bank_name"] = bank_name;
        }

        if (isValidInput(bank_account)) {
            reciever["bank_account"] = bank_account;
        }

        if (isValidInput(channel) && ["NEFT", "IMPS"].includes(channel)) {
            reciever["channel"] = channel;
        }

        if (isValidInput(email)) {
            reciever["email"] = email;
        }

        if (isValidInput(address)) {
            reciever["address"] = address;
        }

        if (isValidInput(state)) {
            reciever["state"] = state;
        }

        if (isValidInput(city)) {
            reciever["city"] = city;
        }

        if (isValidInput(pincode)) {
            reciever["pincode"] = pincode;
        }

        const senderdata = await Beneficiary.findOne(sender);

        if (!senderdata) {
            return res.status(400).send({
                status: "FAILED",
                message: "Oops! No any record acccess by this account number",
                response: 0
            });
        }

        const recieverdata = await Beneficiary.findOne(reciever);

        if (!recieverdata) {
            return res.status(400).send({
                status: "FAILED",
                message: "Oops! No any record acccess by this account number",
                response: 0
            });
        }

        return res.status(200).send({
            status: "pending",
            clientuniqueId: recieverdata.orderId,
            actCode: 1,
            message: "Transaction is under processing wait till FAILED or SUCCESS",
            txnDescription: recieverdata.channel,
            amount: amount,
            txnDate: getdate()
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


// action to be performed:->

const BeneficiaryAction = function (req, res) {
    try {
        const { action } = req.body;

        if (action === "add_beneficiary") {
            addBeneficiary(req, res);
        }
        else if (action === "get_all_beneficiary") {
            getAllBeneficiary(req, res);
        }
        else if (action === "removeBeneficiary") {
            deleteBeneficiary(req, res);
        }
        else if (action === "getBeneficiary") {
            specialBeneficiary(req, res);
        }
        else if (action === "verifyAccount") {
            accountVerification(req, res);
        }
        else if (action === "money_transfer") {
            moneyTransfer(req, res);
        }
        else {
            res.status(500).send({
                message: "invalid action given to be performed",
                status: false
            })
        }
    }
    catch (error) {
        return res.status(500).send({
            status: "FAILED",
            message: "not get response from server side",
            response: 0,
            err: error.message,
        });
    }
}


module.exports.BeneficiaryAction = BeneficiaryAction;