import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

class UserValidator {
  public validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      name: Joi.string().min(6).required(),
      email:Joi.string().email().required(),
      username:Joi.string().min(8).required(),
      password:Joi.string().min(8).required()

    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };

  public validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    if(req.body.email){
      var schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().required()
  
      });
    }
    else{
      var schema = Joi.object({
        username:Joi.string().required(),
        password:Joi.string().required()
  
      });
    }
    
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };

}



export default UserValidator;