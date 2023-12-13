const router = require("express").Router()  
const offerCtrl = require("../controllers/offerCtrl")
const auth = require("../middelware/auth")
const authAdmin = require("../middelware/authAdmin")


router.route('/offer')
    .get(offerCtrl.getOffers)
    .post(offerCtrl.createOffers)

router.route('/offer/:id') 
    .delete(offerCtrl.deleteOffer)
    .put(offerCtrl.updateOffer)





module.exports = router