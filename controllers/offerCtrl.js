
const offer = require('../models/offerModel')
 
// filter sort pagination offer
class APIfeatures {
    constructor(query , queryString){
        this.query=query;
        this.queryString= queryString;
    }
    filtering(){
       const queryObj = {...this.queryString} //queryString = req.query
       const exludedFileds = ['page', 'sort' , 'limit']
       exludedFileds.forEach(el => delete(queryObj[el]))
       let queryStr = JSON.stringify(queryObj)
       queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g , match => '$' + match)
       this.query.find(JSON.parse(queryStr))
        return this ;
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }
        return this ; 
    }
    paginating(){ 
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page-1) * limit
        this.query = this.query.skip(skip).limit(limit )
         return this ; 
    }
}

const offerCtrl ={
getOffers : async (req, res) => {
        try {
            console.log(req.query)
            const features = new APIfeatures(offer.find(), req.query).filtering().sorting().paginating()
            const Offers = await features.query
            res.json({status : 'success' , result : Offers.length , Offers : Offers})
         }
          catch (error) {
             return res.status(500).json({msg : error.message})  
         }
     },
createOffers : async (req , res) => {
    try {
        const {_id , poste_id ,poste,description,compétences,experience,img,pays,Ville,region,checked,nbCandidat} = req.body
        if(!img) return res.status(400).json({msg:'no images upload'})
        const Offer = await offer.findOne({poste_id})
        if(Offer) return res.status(400).json({msg:'this offer already exists'})
        const newOffer = new offer({poste_id ,poste : poste.toLowerCase(),description ,compétences,experience,img,pays,Ville,region,checked, nbCandidat} )
        await newOffer.save()
          res.json(newOffer)
        
    } catch (error) {
        return res.status(500).json({msg : error.message})   
    }
},
deleteOffer : async (req , res) =>{
    try {
        // if user role ==1 ---> admin
        // only admin can create , update , delete pays
        await offer.findByIdAndDelete(req.params.id)
        res.json({msg : "deleted a offer"})
              
        } catch (error) {
            return res.status(500).json({msg : error.message}) 
        }
    },
updateOffer : async(req, res)=>{
    try {
        // if user role ==1 ---> admin
        // only admin can create , update , delete pays
        const {poste_id ,poste  ,description ,compétences,experience,img,pays,ville , region , checked, nbCandidat} = req.body;
        if(!img) return res.status(400).json({msg:'no images upload'})
        await offer.findOneAndUpdate(({_id : req.params.id} , {poste : poste.toLowerCase() ,description,compétences,experience,img,pays,ville,region,checked,nbCandidat} ))
          res.json({msg : "updated a offer"})  
        } catch (error) {
            return res.status(500).json({msg : error.message}) 
        }
}
    }


module.exports = offerCtrl