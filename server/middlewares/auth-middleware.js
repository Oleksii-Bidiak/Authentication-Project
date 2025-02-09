const ApiError = require("../exceptions/api-error");
const tokenService = require("../services/token-service");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accsessToken = authHeader.split(" ")[1];

    if (!accsessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessTocken(accsessToken);

    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};
