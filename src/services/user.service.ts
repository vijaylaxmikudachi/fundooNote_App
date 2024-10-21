import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

class UserService {

  public registerUser =  async (
    name: string, 
    email: string, 
    username: string, 
    password: string, 
    confirmPassword: string)=>{

    // Check if the username or email already exists
    const existingUser = await User.findOne({$or: [{ email: email }, { username: username }] });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }
    
  //Here Adding Password Hashing , Before Saving Data In DB
    const salt= await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt)

    ;
    // Save the user with the hashed password
    const newUser = new User({
      name,
      email,
      username,
      password: hashPassword 
    });

    return await newUser.save();

  };

  // Define a function to log in a user
  public loginUser = async (email: string, username: string,password: string) => {
    const user = await User.findOne({$or: [{ email: email }, { username: username }] });
    if (!user) {
      throw new Error('User not found');
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

     // Generate JWT Token 
     const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },  // Payload data
      process.env.JWT_SECRET as string, 
      
    );
  

    return { token };
  
  };

}


export default UserService;