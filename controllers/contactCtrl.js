const contact = require('../models/contactModel')


const contactCtrl = {
addContact : async(req,res) => {
try {
    const {username , numtel , email , msg , image } = req.body;
    const newContact = new contact({username , numtel , email , msg , image })

    await newContact.save()
    res.status(200).send({message : 'feedback saved successfully'})
} catch (error) {
    return res.status(500).json({message : error.message})
}
},
getContact : async(req , res) =>{
    try {
        const getContact = await contact.find({})
        res.status(200).send({response:getContact}) 
        
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}
}

module.exports = contactCtrl