const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema ({
    username : {
        type:String,
        required: true ,
        trim:true  
    },
    profileImg: {
        type : String
    },
    email : {
        type:String,
        required: true,
        unique:true  
    },
    password : {
        type:String,
        required: true,
        unique: true  
    },
    CIN : {
        type : String,
        unique : true,
        required: true
    },
    cinImg:{
        type : [String]
    },
    passportImg : {
        type : [String],
        required : true
    },
    diplomeImg : {
        type : [String]    
    },
    documentCnss : {
        type: [String]
    },
    cv : {
        type : [String]
    },
    domaine : {
        type: String
    },

    responsable : {
        type : mongoose.Schema.Types.ObjectId,
        required: true
    },
    statusDossier: {
        type : String,
        required:true,
        default:"nouveau"
    },
    typeContrat:{
        type : String,
        required : true,
    },
    dureeContrat:{
        type:Number,
        required: true
    },
    payment:{
        avance:{
            type :Number,
            required:true,
            default: 0
        },
        totalpayee:{
            type: Number,
            required: true
        },
        statusPayment: {
            type:String,
            required: true,
            default: "non payée"
        }
    },
    notification:{
        type : [String],

    },
    rendezvous :{
        tls:{
            type: Date,
            
        },
        ofii:{
            type:Date
        }
    },
    pays:{
        type: String,
        required: true,
    }

},
{
    timestamps : true
})
module.exports = mongoose.model('clients' , clientSchema)