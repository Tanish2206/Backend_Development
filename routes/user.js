const express = require('express');
const router = express.Router();
const users = require('../controllers/user')
const admin = require('../controllers/admin')
const payment = require('../controllers/payment')
const middleware = require('../middleware/auth')
const project = require('../controllers/project')
const designs = require("../controllers/design");

router.route('/register')
        .post(users.register);

router.route('/login')
        .post(users.login)

router.route('/verify-otp')
        .post(users.verifyOTP)

router.route('/profile')
        .get(middleware.authenticateToken,users.getprofile);

router.route('/projects')
        .get(middleware.authenticateToken, project.getProjects);

router.route('/update-user')
        .patch(middleware.authenticateToken, users.updateUser)

router.route('/enquiry')
        .post(users.enquiry)

router.route("/designs")
        .post(designs.getDesigns);

router.route('/payment/create-transaction-order')
        .post(middleware.authenticateToken, payment.createTransactionOrder)

router.route('/payment/verify')
        .post(middleware.authenticateToken, payment.verifyPayment)

router.route("/payment/transaction-order")
        .get(middleware.authenticateToken, payment.getTransactionOrder);

module.exports = router;