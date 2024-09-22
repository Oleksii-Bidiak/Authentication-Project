require("dotenv").config();
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const mailService = require("./mail-service");
const userModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

class UsersService {
  async registration(email, password) {
    const candidate = await userModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest(
        `Користувач із поштовою адресою ${email} вже існує`
      );
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const activationLink = v4();
    const user = await userModel.create({
      email,
      password: hashPassword,
      activationLink,
    });

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    return await this.generateUserTokens(user);
  }

  async login(email, password) {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest("Користувача із таким email не знайдено");
    }

    const isPassEquals = bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw ApiError.BadRequest("Некоректний пароль");
    }

    return await this.generateUserTokens(user);
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink });

    if (!user) {
      throw ApiError.BadRequest("Некоректне посилання активації");
    }

    user.isActivated = true;
    user.save();
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshTocken(refreshToken);
    const tokenFromDb = tokenService.findToken(refreshToken);

    console.log("userData", userData);
    console.log("tokenFromDb", tokenFromDb);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await userModel.findById(userData.id);

    return await this.generateUserTokens(user);
  }

  async getAllUsers() {
    const users = await userModel.find();

    return users;
  }

  async generateUserTokens(user) {
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
}

module.exports = new UsersService();
