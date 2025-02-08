const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

// generae jwt
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

// Register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Create and save a new user (this triggers the pre-save middleware to hash the password)
      const user = new User({ name, email, password });
      await user.save();
  
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// login user
const loginUser = async (req, res)=>{
    const {email, password} = req.body;

    try {
       const user = await User.findOne({email}) 

    //check if the user exists and passwords matches
    if(user && (await user.matchPassword(password))){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(401).json({message: 'Invalid email or passwords'})
    }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {registerUser, loginUser}