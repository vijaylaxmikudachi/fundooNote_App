import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import userValidator from '../validators/user.validator';
import { passwordResetAuth } from '../middlewares/auth.middleware';

class UserRoutes {
  private UserController = new userController();
  private router = express.Router();
  private UserValidator = new userValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {
    //route to create a new user
    this.router.post(
      '',
      this.UserValidator.newUser,
      this.UserController.registerUser
    );

    //route to login
    this.router.post(
      '/login',
      this.UserValidator.userlogin,
      this.UserController.loginUser
    );

    // Forget password route
    this.router.post('/forget-password', this.UserController.forgetPassword);

    // Reset password route
    this.router.post(
      '/reset-password',
      passwordResetAuth,
      this.UserController.resetPassword
    );
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
