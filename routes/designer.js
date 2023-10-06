const express = require('express');
const router = express.Router();
const users = require('../controllers/user')
const admin = require('../controllers/admin')
const designer = require('../controllers/designer')
const payment = require('../controllers/payment')
const middleware = require('../middleware/auth')
const project = require('../controllers/project')
const designs = require("../controllers/design");
const fileUpload = require('express-fileupload');


router.route('/designer/register')
        .post(fileUpload(), designer.register);

// router.route('/designer/login')
//         .post(designer.login)

// router.route('/designer/verify-otp')
//         .post(designer.verifyOTP)

router.route('/designer/profile')
        .get(middleware.authenticateToken,designer.getprofile);
        
router.route('/designer/update-designer')
        .patch(fileUpload(), middleware.authenticateToken, designer.updateDesigner)

router.route('/designer/project-status')
        .patch(middleware.authenticateToken, designer.updateProjectStatus)

router.route('/designer/add-media')
        .post(fileUpload(), middleware.authenticateToken, designer.addMedia);

router.route('/designer/project-response')
        .post(middleware.authenticateToken, designer.designerRespondToProject);

router.route('/designer/get-accepted-projects')
        .get(middleware.authenticateToken, designer.getAcceptedProjects);

router.route('/designer/get-projects')
        .get(middleware.authenticateToken,designer.getProjects);

router.route('/designer/update-media')
        .patch(fileUpload(), middleware.authenticateToken, designer.updateMedia)

module.exports = router;