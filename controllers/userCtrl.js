const users = require('../models/userModel')
const bcrypt =  require('bcrypt')
const jwt = require('jsonwebtoken')



const userCtrl ={
register : async (req , res)=>{
  try {
    const {username , email , password} = req.body;
    const user = await  users.findOne({email})
    if(user) 
      return res.status(400).json({msg:'the email already exists.'})
    
    if(password.length < 6 ) 
      return res.status(400).json({msg:'password is at least 6 characters long .'})
    //password encryption
     const passwordHash = await bcrypt.hash(password , 10)
     const newUser=new users ({
        username , email , password :passwordHash 
     })
     await newUser.save()

     // create jsonwebtoken to authentication
     const accesstoken = createAccessToken({id : newUser._id})
     const refreshtoken = createRefreshToken({id : newUser._id})
     res.cookie('refreshtoken' ,  refreshtoken, {
        httpOnly : true , 
        path :'/admin/user/refresh_token',
        maxAge: 7*24*60*60*1000
     })
     res.json({accesstoken})
    
    //  res.json({msg : 'Register Success'})
  } catch (error) {
    return res.status(500).json({msg : error.message})
  }
        
},
login : async (req , res) =>{
    try {
        const {email , password} = req.body;

        const user = await users.findOne({email})
        if(!user) return res.status(400).json({msg :'user does not exist.'})

        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch) return  res.status(400).json({msg :'Incorrect password'})

        // if login success , create access token and refresh token 
        const accesstoken = createAccessToken({id : user._id})
        const refreshtoken = createRefreshToken({id : user._id})
        res.cookie('refreshtoken' ,  refreshtoken, {
           httpOnly : true , 
           path :'/admin/user/refresh_token',
           maxAge: 7*24*60*60*1000
        })
        res.json({accesstoken})
        
    } catch (error) {
        return res.status(500).json({msg : error.message}) 
    }
},   
logout : async (req, res) => {
    try {
        res.clearCookie('refreshtoken' , {  path :'/user/refresh_token'})
        return res.json({msg :'Logged out'})
        
    } catch (error) {
    return res.status(500).json({msg : error.message})  
    }

},
refreshToken :(req , res) => {
    try {
        const rf_token = req.cookies.refreshtoken;
        if(!rf_token) return res.status(400).json({msg : 'Please Login or Register'})
         
        jwt.verify(rf_token , process.env.REFRESH_TOKEN_SECRET ,(error , user) => {
               
            if(error) return res.status(400).json({msg : 'Please Login or Register'})
          
            const accessToken = createAccessToken({id : user.id})
         
            res.json({accessToken})
        })


       // res.json({rf_token})
        
    } catch (error) {
        return res.status(500).json({msg : error.message}) 
    }

       
},
getUser : async(req , res) => {
    try {
        const user = await users.findById(req.user.id).select('-password')
         if(!user) return res.status(400).json({msg :"user does not exist."}) 
         res.json(user)
    } catch (error) {
        return res.status(500).json({msg : error.message})   
    }
},
getAllUseres : async(req , res) => {
    try {
        const getAllUseres = await users.find({})
        res.status(200).send({response:getAllUseres}) 
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
},
UpdateUser: async (req, res) => {
    try {
        console.log(req.params.id);
        console.log(req.body)
        const { username, email, password, role } = req.body;

        // Find the user by ID to get the current user data
        const currentUser = await users.findById(req.params.id);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Construct the update object
        const updateFields = {};
        
        if (username && username !== currentUser.username) {
            updateFields.username = username;
        }

        if (email && email !== currentUser.email) {
            updateFields.email = email;
        }

        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);
            console.log(passwordHash)
            updateFields.password = passwordHash;
        }

        if (role && role !== currentUser.role) {
            updateFields.role = role;
        }

        // Perform the update with the modified fields
        await users.findOneAndUpdate({ _id: req.params.id }, updateFields);
        res.json({ msg: "updated user" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
},


deleteUser : async(req,res)=>{
    try {
        await users.findByIdAndDelete(req.params.id)
        res.json({msg : "deleted user"})
        
    } catch (error) {
        return res.status(500).json({message : error.message})   
    }
   
},
block : async(req,res) =>{
    try {
        const userrr = await users.findById(req.params.id);
        if(userrr.isBlocked == true){
            userrr.isBlocked = false;
        }else{
            userrr.isBlocked = true
        }
        userrr.save();
        res.json(userrr)
    } catch (error) {
        res.json(error)
        console.log(error)
    }
}
}
const createAccessToken= (user) => {
    return jwt.sign(user , process.env.ACCESS_TOKEN_SECRET , {expiresIn : '11m'})
}
const  createRefreshToken= (user) => {
    return jwt.sign(user , process.env.REFRESH_TOKEN_SECRET , {expiresIn : '7d'})
}


module.exports = userCtrl