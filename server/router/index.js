const Router = require("express").Router;
const userController = require("../controllers/user-controller.js");
const { body } = require("express-validator");
const routePaths = require("./routePaths.js");
const authMiddleware = require("../middlewares/auth-middleware.js");
const router = new Router();

const validateUserCredentials = [
  body("email").isEmail().withMessage("Неправильний формат електронної пошти"),
  body("password")
    .isLength({ min: 3, max: 32 })
    .withMessage("Пароль повинен бути від 3 до 32 символів"),
];

router.post(
  routePaths.registration,
  validateUserCredentials,
  userController.authentication
);
router.post(
  routePaths.login,
  validateUserCredentials,
  userController.authentication
);
router.post(routePaths.logout, userController.logout);
router.get(routePaths.activate, userController.activate);
router.get(routePaths.refresh, userController.refresh);
router.get(routePaths.users, authMiddleware, userController.getUsers);

module.exports = router;
