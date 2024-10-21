/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import UserService from '../services/user.service';
import { Request, Response, NextFunction } from 'express';


class UserController {
    public UserService = new UserService();


  // Controller for registering a new user
  public register = async (req: Request, res: Response) => {
    try {
      const { name, email, username, password, confirmPassword } = req.body;
      const newUser = await this.UserService.registerUser(name, email, username,  password, confirmPassword); 
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


  // Controller for logging in a user
  public login = async (req: Request, res: Response) => {
    try {
      const { email,username, password } = req.body;
      const user = await this.UserService.loginUser(email,username, password); 
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
 
}

export default UserController;

