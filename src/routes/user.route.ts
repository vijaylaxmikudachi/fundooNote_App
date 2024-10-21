import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import userValidator from '../validators/user.validator';
import {userAuth} from '../middlewares/auth.middleware';



class UserRoutes {
  private UserController = new userController();
  private router = express.Router();
  private UserValidator = new userValidator();

  constructor(){
    this.routes()
  }
  
  private routes=()=>{
    this.router.post('/register', this.UserValidator.validateRegistration, this.UserController.register);
    this.router.post('/login', this.UserValidator.validateLogin, userAuth , this.UserController.login);

  }
  
  public getRoutes=()=>{
    return this.router
  };

}

export default UserRoutes;

// //my Router
// const router = Router();

// router.post('/register', validateRegistration, register);
// router.post('/login', validateLogin, login);

// export default router;

