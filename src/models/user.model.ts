import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required:true
    },
    lastName:{
      type: String
    },
    email:{
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true
  }
);

export default model<IUser>('User', userSchema);