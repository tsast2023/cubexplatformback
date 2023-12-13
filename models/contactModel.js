const  mongoose = require("mongoose")

const contactschema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        trim : true
    },
   
    email : {
        type:String,
         required:true,
    
    },
    numtel : {
        type:String,
        required : true , 
    },
    image : {
       type : String , 
       required :false 
},
   msg : {
    type:String ,
    required:false
 }



},{
    timestamps : true
}
)
module.exports = mongoose.model("contact" , contactschema )