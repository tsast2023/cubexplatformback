const router = require("express").Router() 
const ContactCtrl = require("../controllers/contactCtrl")
const auth = require('../middelware/auth')
const authAdmin = require("../middelware/authAdmin") 


router.post('/addcontact' , ContactCtrl.addContact)
router.get('/getcontact' ,ContactCtrl.getContact)


module.exports = router