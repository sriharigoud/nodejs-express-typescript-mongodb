import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../users/userDto';
import userModel from './../users/user.model';
import LogInDto from './logIn.dto';
import { TokenData, DataStoredInToken } from '../interfaces/tokenData.interface';
import User from '../users/user.interface';
 
class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private user = userModel;
 
  constructor() {
    this.initializeRoutes();
  }
 
  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }
 
  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    if (
      await this.user.findOne({ email: userData.email })
    ) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      user.password = undefined;
      const token = this.createToken(user);
      response.setHeader("Set-Cookie", [this.createCookie(token)]);
      response.send(user);
    }
  }
  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private loggingOut(request: express.Request, response: express.Response, next: express.NextFunction){
    response.setHeader('Set-Cookie', ["Authorization=;Max-Age=0"]) //'Authorization=;Max-age=0'
    response.sendStatus(200);
  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    console.log(logInData, user)
    if (user) {
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.get('password', null, { getters: false }));
      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.createToken(user);
        console.log([this.createCookie(tokenData)], tokenData);
        response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }
}
 
export default AuthenticationController;