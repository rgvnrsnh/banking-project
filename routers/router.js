const express = require("express");
const authentication = require("../authentication/auth");
const usercontroller = require("../controllers/beneficiary");

const router = new express.Router();

router.get("/check", (req, res) => {
    res.status(200).send({
        message: "working properly",
    });
});

// to add new beneficiary
router.post("/production/testapi/dmt_request", usercontroller.addBeneficiary);

// to get all beneficiary
router.get("/production/testapi/dmt_request", authentication.authentication, usercontroller.getAllBeneficiary);

// to delete given beneficiary
router.delete("/production/testapi/dmt_request", authentication.authentication, usercontroller.deleteBeneficiary);






module.exports = router;