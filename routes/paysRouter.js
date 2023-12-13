const router = require("express").Router()  
const paysCtrl = require("../controllers/paysCtrl")
const auth = require("../middelware/auth")
const authAdmin = require("../middelware/authAdmin")


router.route('/pays')
    .get(paysCtrl.getPayss)
    .post(auth  ,paysCtrl.createPayss)

router.route('/pays/:id') 
    .delete(auth  , paysCtrl.deletePays)
    .put(auth  , paysCtrl.updatePays)





module.exports = router