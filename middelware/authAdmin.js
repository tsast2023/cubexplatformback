const users = require('../models/userModel')

const authAdmin= async(req , res , next) => {
try {
    // get user information by id
    const user = await users.findOne({
        _id : req.user.id
    })
    if(user.role == 0)
       res.status(400).json({msg : "admin ressource acces denied"})
    next()
    
} catch (error) {
    return res.status(500).json({msg : error.message})  
}
}

module.exports = authAdmin