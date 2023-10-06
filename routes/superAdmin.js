// const express = require("express");
// const router = express.Router();
// const admin = require("../controllers/admin");
// const users = require('../controllers/user')
// const projects = require("../controllers/project");
// const superAdmin = require("../controllers/superAdmin");
// const authMiddleware = require('../middleware/auth')

// // router.route("/super-admin/login").post(superAdmin.login);

// router.route('/super-admin/user/register')
//         .post(authMiddleware.checkSuperAdminByToken, users.register);

// router
//   .route("/super-admin/profile")
//   .get(authMiddleware.checkSuperAdminByToken, superAdmin.getprofile);

//   router
//   .route("/super-admin/project/add")
//   .post(authMiddleware.checkSuperAdminByToken, projects.addProject);

// router
//   .route("/super-admin/project/update")
//   .post(authMiddleware.checkSuperAdminByToken, projects.updateProject);

// router
//   .route("/super-admin/project/delete")
//   .delete(authMiddleware.checkSuperAdminByToken, projects.deleteProject);

// router
//   .route("/super-admin/user/projects")
//   .get(authMiddleware.checkSuperAdminByToken, projects.getProjects);

// router.route('/super-admin/update-admin')
//   .patch(authMiddleware.checkSuperAdminByToken, admin.updateAdmin)

// router
//   .route("/super-admin/user-status")
//   .patch(authMiddleware.checkSuperAdminByToken, superAdmin.updateUserStatus);

// router.route('/super-admin/update-user')
//   .patch(authMiddleware.checkSuperAdminByToken, superAdmin.updateUser)

// router
//   .route("/super-admin/user-details")
//   .get(authMiddleware.checkSuperAdminByToken, superAdmin.getUserDetails);

// module.exports = router ;