import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  }
});

const User = mongoose.model('User', userSchema);

// export default model<IUser>('User', userSchema);
export default User;