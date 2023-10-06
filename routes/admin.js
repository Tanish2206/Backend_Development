const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload');
const admin = require("../controllers/admin");
const users = require('../controllers/user')
const projects = require("../controllers/project");
const designs = require("../controllers/design");
const authMiddleware = require("../middleware/auth");

const app = express();
app.use(fileUpload());

router.route('/admin/user/register')
  .post(authMiddleware.checkAdminByToken, admin.register);

router.route('/admin/designer/register')
  .post(fileUpload(), authMiddleware.checkAdminByToken, admin.registerDesigner);

router.route('/admin/designer/update-designer')
  .patch(fileUpload(), authMiddleware.checkAdminByToken, admin.updateDesigner)

router.route("/admin/login").post(admin.login);

router
  .route("/admin/profile")
  .get(authMiddleware.checkAdminByToken, admin.getprofile);

router
  .route("/admin/project/add")
  .post(fileUpload(), authMiddleware.checkAdminByToken, projects.addProject);

router
  .route("/admin/project/update")
  .patch(fileUpload(), authMiddleware.checkAdminByToken, projects.updateProject);

router
  .route("/admin/project/delete")
  .delete(authMiddleware.checkAdminByToken, projects.deleteProject);

router
  .route("/admin/user/projects")
  .get(authMiddleware.checkAdminByToken, projects.getProjectsForAdmin);

router
  .route("/admin/project/assign")
  .post(authMiddleware.checkAdminByToken, admin.assignProjectToDesigner);

router.route('/admin/update-admin')
  .patch(authMiddleware.checkAdminByToken, admin.updateAdmin)

router
  .route("/admin/user-status")
  .patch(authMiddleware.checkAdminByToken, admin.updateUserStatus);

router
  .route("/admin/designer-status")
  .patch(authMiddleware.checkAdminByToken, admin.updateDesignerStatus);

router.route('/admin/update-user')
  .patch(authMiddleware.checkAdminByToken, admin.updateUser)
  
router
  .route("/admin/user-details")
  .get(authMiddleware.checkAdminByToken, admin.getUserDetails);

router
  .route("/admin/design/add")
  .post(fileUpload(), authMiddleware.checkAdminByToken, designs.addDesign);

router
  .route("/admin/design/update")
  .patch(fileUpload(), authMiddleware.checkAdminByToken, designs.updateDesign);

router
  .route("/admin/design/delete")
  .delete(authMiddleware.checkAdminByToken, designs.deleteDesign);

router
  .route("/admin/designs")
  .post(authMiddleware.checkAdminByToken, designs.getDesigns);

router
  .route("/admin/add-banner")
  .post(fileUpload(), authMiddleware.checkAdminByToken, admin.addBanner);

router
  .route("/admin/add-popular-design")
  .post(fileUpload(), authMiddleware.checkAdminByToken, admin.addPopularDesigns);

router
  .route("/admin/enquiry")
  .get(authMiddleware.checkAdminByToken, admin.getEnquiries);

router
  .route("/admin/designer-details")
  .get(authMiddleware.checkAdminByToken, admin.getDesignerDetails);
router
  .route("/admin/get-all-projects")
  .get(authMiddleware.checkAdminByToken,admin.getallprojects);


module.exports = router;
