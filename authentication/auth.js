const jwt = require("jsonwebtoken");
const { Beneficiary } = require("../models/beneficiary");


const authentication = async function (req, res, next) {
    try {

        const token = req.header("authentication");

        if (token === null || token === undefined) {
            return res.status(400).send({
                status: "FAILED",
                message: "You are not registered with our service, please connect with our support team for more details",
                response: 0
            });
        }
        const userData = jwt.verify(token, process.env.SECRET_KEY);

        const ispresent = await Beneficiary.findOne(userData);

        if (ispresent) {
            next();
        }
        else {
            return res.status(400).send({
                status: "FAILED",
                message: "You are not registered with our service, please connect with our support team for more details",
                response: 0
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



const authorization = async function (req, res, next) {
    try {
        const token = req.header("authentication");

        if (token === null || token === undefined) {
            return res.status(400).send({
                status: "FAILED",
                message: "You are not registered with our service, please connect with our support team for more details",
                response: 0
            });
        }
        const userData = jwt.verify(token, process.env.SECRET_KEY);

        const mobile = userData.mobile_number;

        const { mobile_number } = req.body;

        if (mobile === mobile_number) {
            next();
        }
        else {
            return res.status(400).send({
                status: "FAILED",
                message: "You are not registered with our service, please connect with our support team for more details",
                response: 0
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

module.exports.authentication = authentication;
module.exports.authorization = authorization;