const mongoose = require("mongoose")

const offerschema = new mongoose.Schema({
    poste_id : {
        type:String,
        required:true,
        trim : true
    },

    poste : {
        type:String,
        required:true,
    
    },
    description : {
        type:String,
        required : true , 
    },
    compétences : {
        type : String , 
        required :false 
    },
    experience :{
        type : String , 
        required :false 
    },
    img :{
        type : String , 
        required : true
    },
    pays :{
        type:String,
        required :(true , "offer must belong to a pays")
    },
    Ville : {
        type:String, 
        required : true , 

    },
    region : {
        type:String, 
        required : true , 

    },
    nbCandidat :{
        type :Number, 
        required : false,
        default: 0
    },
    checked :{
        type:Boolean ,
        default: false
    }



},{
    timestamps : true
}
)
module.exports = mongoose.model("offer" , offerschema )