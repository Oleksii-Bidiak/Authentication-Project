require("dotenv").config();
const userService = require("../services/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const routePaths = require("../router/routePaths");

class UserController {
  async authentication(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Помилка при валідації", errors.array())
        );
      }

      const { email, password } = req.body;
      let userData;

      switch (req.url) {
        case routePaths.registration:
          userData = await userService.registration(email, password);
          break;

        case routePaths.login:
          userData = await userService.login(email, password);
          break;
      }

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 60 * 24 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);

      res.clearCookie("refreshToken");

      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;

      await userService.activate(activationLink);

      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      console.log("refreshToken", refreshToken);

      const userData = await userService.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 60 * 24 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();

      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
