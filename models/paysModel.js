const mongoose = require("mongoose")

const   paysSchema = new mongoose.Schema({
    name : {
        type:String, 
        required : true , 
        trim :true,
        unique : true
    },
    Ville : {
        type:String, 
        required : true , 
      
    },
    region : {
        type:String, 
        required : true , 
      
    },
    image :{
        type : String , 
        required : false 
    }

},{
    timestamps : true
})
module.exports = mongoose.model("pays" ,paysSchema)