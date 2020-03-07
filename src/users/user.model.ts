import * as mongoose from "mongoose";
import User from "./user.interface";

const addressSchema = new mongoose.Schema({
    city: String,
    country: String,
    street: String,
  });
  
  const userSchema = new mongoose.Schema(
    {
      address: addressSchema,
      email: String,
      firstName: String,
      lastName: String,
      password: {
        type: String,
        get: (): undefined => undefined,
      },
      posts: [
        {
          ref: 'Post',
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
    },
    {
      toJSON: {
        virtuals: true,
        getters: true,
      },
    },
  );
  
  const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);
  
  export default userModel;