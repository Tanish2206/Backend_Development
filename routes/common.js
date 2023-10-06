const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');
const admin = require("../controllers/admin");
const users = require('../controllers/user');
const common = require('../controllers/common')
const projects = require("../controllers/project");
const designs = require("../controllers/design");
const authMiddleware = require("../middleware/auth");

router
  .route("/common/enquiry")
  .post(common.enquiry);

router
  .route("/popular-design")
  .get(common.getPopularDesigns);

router
  .route("/banner")
  .get(common.getBanners);

  router
  .route("/download")
  .get(common.download);

module.exports = router;