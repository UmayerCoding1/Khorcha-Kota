import mongoose, { Schema }  from "mongoose";

const userSchema = new Schema({
    fullname:{type: String, required: true},
    number:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    avatar:{type: String, default: ""},
},{timestamps:true});


export  const User = mongoose.model('User', userSchema);