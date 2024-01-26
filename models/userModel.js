const crypto=require('crypto');
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide your email!"],
    lowerCase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default:'default.jpg'
  },
  role:{
    type:String,
    enum:['user','guide','lead-guide','admin'],
    default:'user'
  },
  password: {
    type: String,
    unique: true,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //This only work on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    }
  },
  passwordChangedAt:{
    type:Date,
    //required: [true, "Please provide a passwordChangedAt"]
  },
  passwordResetToken:String,
  passwordResetExpires:Date,
  active:{
    type:Boolean,
    default:true,
    select:false
  }
},
{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
}
);

userSchema.pre("save", async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  //Hash this password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete password confirm field
  this.passwordConfirm = undefined;
  next();
});



userSchema.pre('save', function(next){
  if(!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt=Date.now()-1000;
  next();
})

userSchema.pre(/^find/, function(next){
  this.find({active:{$ne:false}});
  next();
})

userSchema.methods.correctPassword = async function (
 candidatePassword,
  userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter= function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
    //console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp<changedTimestamp;
  }
  //false means NOT changed
  return false;
}
userSchema.methods.createPasswordResetToken=function(){
  const resetToken=crypto.randomBytes(32).toString('hex');
  this.passwordResetToken=crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex');
  //console.log({resetToken},this.passwordResetToken);
  this.passwordResetExpires=Date.now()+20*60*1000;
  return resetToken;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
