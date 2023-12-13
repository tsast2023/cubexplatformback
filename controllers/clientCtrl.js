
const client = require('../models/clientModel')
const bcrypt =  require('bcrypt')
const jwt = require('jsonwebtoken')
// filter sort pagination client
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

const clientCtrl ={
getClients : async (req, res) => {
        try {
            console.log(req.query)
            const features = new APIfeatures(client.find(), req.query).filtering().sorting().paginating()
            const clients = await features.query
            res.json({status : 'success' , result : clients.length , clients : clients})
        }
        catch (error) {
            return res.status(500).json({msg : error.message})  
        }
},
createClient : async (req , res) => {
    try {
        const {username , profileImg , email, password, CIN, cinImg ,  passportImg, pays , diplomeImg, documentCnss ,cv  , typeContrat , dureeContrat ,payment , statusDossier , rendezvous } = req.body
        const {avance ,statusPayment , totalpayee} = payment
        if(rendezvous){
          const {tls : tlsDate ,ofii : ofiiDate} = rendezvous
          tls = new Date(tlsDate.split('-').reverse().join('-'));
          ofii = new Date(ofiiDate.split('-').reverse().join('-'))
        }else{
          tls = Date.now();
          ofii = Date.now();
        }
       
        // if(!img) return res.status(400).json({msg:'no images upload'})
        const clientt = await client.findOne({email : email})
        if(clientt) return res.status(400).json({msg:'this client already exists'});
        const responsable = req.user.id;
        console.log(responsable)
        const passwordHash = await bcrypt.hash(password , 10);
        const newclient = new client({username , profileImg , email, password : passwordHash , CIN, cinImg,passportImg, diplomeImg, documentCnss ,cv , responsable ,typeContrat , dureeContrat ,pays, rendezvous:{tls, ofii},payment:{avance , statusPayment , totalpayee , statusDossier } } )
        await newclient.save()
        res.json(newclient)

    } catch (error) {
      console.log(error)
        return res.status(500).json({msg : error.message})   
    }
},
deleteClient : async (req , res) =>{
    try {
        // if user role ==1 ---> admin
        // only admin can create , update , delete pays
        await client.findByIdAndDelete(req.params.id)
        res.json({msg : "deleted a client"})

        } catch (error) {
          return res.status(500).json({msg : error.message}) 
        }
},
updateClient: async (req, res) => {
  try {
      const {
          username,
          profileImg,
          email,
          password,
          CIN,
          cinImg,
          passportImg,
          diplomeImg,
          documentCnss,
          cv,
          typeContrat,
          dureeContrat,
          payment,
          statusDossier,
          domaine
      } = req.body;

    // Update the client document using findOneAndUpdate
      const updatedClient = await client.findOneAndUpdate(
          {_id: req.params.id}, // Query condition (matching document by _id)
          {
              username,
              profileImg,
              email,
              password,
              CIN,
              cinImg,
              passportImg,
              diplomeImg,
              documentCnss,
              cv,
              typeContrat,
              dureeContrat,
              payment,
              statusDossier,
              domaine,
          },
          { new: true } // Option to return the updated document
      );

      if (!updatedClient) {
          return res.status(404).json({ msg: 'Client not found' });
      }

      return res.json({ msg: 'Client updated successfully', updatedClient });
  } catch (error) {
      return res.status(500).json({ msg: error.message });
  }
},
login : async(req,res) =>{
    try{
        const {email , password} =req.body;
        const clientLog = await client.findOne({email : email});
        console.log(clientLog)
        if(!clientLog) return res.status(400).json({msg : "client not found"})
        const isMatch = await bcrypt.compare(password , clientLog.password)
        console.log(isMatch)
        if (!isMatch) return res.status(400).json({msg : "password is incorrect"});
        console.log("this a test log")
        const accesstoken = createAccessToken({id : clientLog._id})
        const refreshtoken = createRefreshToken({id : clientLog._id})
        res.cookie('refreshtoken' ,  refreshtoken, {
            httpOnly : true , 
            path :'/admin/client/refresh_token',
            maxAge: 7*24*60*60*1000
        })
        
        res.send({accesstoken})
        
    }catch(err){
       console.log(err)
    }
},
totalPerMonth: async (req, res) => {
    try {
      const clients = await client.find();
      const totalsPerMonth = {};
      const newClientsPerMonth = {};
      const clientsPerCountry = {};
  
      clients.forEach(client => {
        const createdAt = new Date(client.createdAt);
        const yearMonth = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`; // Get year and month as YYYY-MM format
  
        // Calculate total payment for each client
        const totalPayment = client.payment.totalpayee || client.payment.avance;
  
        // Accumulate total payments per month
        if (totalsPerMonth[yearMonth]) {
          totalsPerMonth[yearMonth] += totalPayment;
        } else {
          totalsPerMonth[yearMonth] = totalPayment;
        }
  
        // Count new clients per month
        if (newClientsPerMonth[yearMonth]) {
          newClientsPerMonth[yearMonth]++;
        } else {
          newClientsPerMonth[yearMonth] = 1;
        }
  
        // Count clients per country
        const country = client.pays;
        if (clientsPerCountry[country]) {
          clientsPerCountry[country]++;
        } else {
          clientsPerCountry[country] = 1;
        }
      });
  
      res.json({
        status: 'success',
        totalsPerMonth,
        newClientsPerMonth,
        clientsPerCountry,
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
},
updateRendezvous: async (req, res) => {
  try {
    const { tls, ofii } = req.body;
    const clientToUpdate = await client.findOne({ _id: req.params.id });

    if (!clientToUpdate) {
      return res.status(404).json({ msg: 'Client not found' });
    }

    // Parse and set the dates if they exist in the request body
    if (tls) {
      clientToUpdate.rendezvous.tls = new Date(tls);
    }
    if (ofii) {
      clientToUpdate.rendezvous.ofii = new Date(ofii);
    }

    // Check if both dates were updated or not
    if (tls || ofii) {
      const formattedTlsDate = clientToUpdate.rendezvous.tls.toLocaleDateString('fr-FR');
      const formattedOfiiDate = clientToUpdate.rendezvous.ofii.toLocaleDateString('fr-FR');
      clientToUpdate.notification.push(`La date de votre rendez-vous a été changée à ${formattedTlsDate} pour le TLS et ${formattedOfiiDate} pour l'OFII`);
    }

    await clientToUpdate.save();
    res.json({ msg: 'Rendezvous dates updated successfully', client: clientToUpdate });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
},
updateDossierStatus : async(req,res)=>{
    try {
        const clientss = await client.findOneAndUpdate({_id : req.params.id} , {statusDossier : req.body.statusDossier}, { new: true });
        clientss.notification.push(`votre status été mis a jour : ${req.body.statusDossier} `);
        clientss.save();
        res.json({status : "success" , clientsss :clientss })
        
    } catch (error) {
        console.log(error)
        res.json(error)
        
    }
},
getClientsByRespAdmin : async(req,res)=> {
  try {
    const clientss = await client.find({responsable : req.params.id});
    res.json(clientss)
  } catch (error) {
    res.status(500).json(error)
  }
}


}
    const createAccessToken= (user) => {
        return jwt.sign(user , process.env.ACCESS_TOKEN_SECRET , {expiresIn : '11m'})
}
    const  createRefreshToken= (user) => {
        return jwt.sign(user , process.env.REFRESH_TOKEN_SECRET , {expiresIn : '7d'})
}
module.exports = clientCtrl