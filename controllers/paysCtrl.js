
const pays = require('../models/paysModel')
// filter sort pagination pays
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

const paysCtrl ={
getPayss : async (req, res) => {
        try {
            console.log(req.query)
            const features = new APIfeatures(pays.find(), req.query).filtering().sorting().paginating()
            const Pays = await features.query
            res.json({status : 'success' , result : Pays.length , Pays : Pays})
        }
        catch (error) {
            return res.status(500).json({msg : error.message})  
        }
    },
createPayss : async (req , res) => {
    try {
        const {name , Ville , region ,img } = req.body
        if(!img) return res.status(400).json({msg:'no images upload'})
        const Pays = await pays.findOne({name : name})
        if(Pays) return res.status(400).json({msg:'this pays already exists'})
        const newPays = new pays({name , Ville , region ,img})
        await newPays.save()
        res.json(newPays)
        
    } catch (error) {
        return res.status(500).json({msg : error.message})   
    }
},
deletePays : async (req , res) =>{
    try {
        // if user role ==1 ---> admin
        // only admin can create , update , delete pays
        await pays.findByIdAndDelete(req.params.id)
        res.json({msg : "deleted a pays"})

        } catch (error) {
            return res.status(500).json({msg : error.message}) 
        }
    },
updatePays : async(req, res)=>{
    try {
        // if user role ==1 ---> admin
        // only admin can create , update , delete pays
        const {name , Ville , region ,img} = req.body;
        if(!img) return res.status(400).json({msg:'no images upload'})
        await pays.findOneAndUpdate(({_id : req.params.id} , {name , Ville , region ,img} ))
        res.json({msg : "updated a pays"})  
        } catch (error) {
            return res.status(500).json({msg : error.message}) 
        }
}
}


module.exports = paysCtrl