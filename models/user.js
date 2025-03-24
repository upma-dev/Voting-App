const mongoose = require("mongoose");
const bcrypt= require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  age: {
    required: true,
    type: Number,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  mobile: {
    required: true,
    type: String,
  },
  address: {
    type: String,
    required: true
  },
  aadharCardNumber: {
    type: Number,
    required: true,
    unique: true
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    type: String,
    enum: ['voter', 'admin'],
    default: 'voter'
  },
  isVoted: {
    type: Boolean,
    default: false
  }
});

// hashes password before saving to database
userSchema.pre("save", async function(next){
const user = this;

  //hash the password only if it has been modified by the user
  if(!user.isModified('password')) return next();
  try{
      // hash password generation
      const salt = await bcrypt.genSalt(10);

      // hash password
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      // Override the plain password with the hashed one
      user.password = hashedPassword;
      next();
  }catch(err){
      return next(err);
  }
})

//compare password

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw err;
  }
}


const User = mongoose.model("User", userSchema);
module.exports = User;



// //self practice :

// userSchema.pre('save', async function(next){
// const person = User;

// if(!User.isModified('password')) return next();

// try {
  
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash( User.password, salt);

//   User.password = hashedPassword;
//   next();
// } catch (error) {
//   return next(err);
// }
// })

// userSchema.methods.comparePassword = async function(password) {
//   try {
//     const isMatch = await bcrypt.compare(password, this.password);
//     return isMatch;
//   } catch (error) {
//     throw err;
//   }
// }