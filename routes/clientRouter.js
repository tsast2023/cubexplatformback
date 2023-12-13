const router = require("express").Router();
const clientCtrl = require("../controllers/clientCtrl");
const userCtrl = require ('../controllers/userCtrl');
const auth = require('../middelware/auth');
const authResp = require("../middelware/authResp");

router.post('/register', auth ,authResp, clientCtrl.createClient);
router.post('/login' , clientCtrl.login);
router.put('/update/:id' , clientCtrl.updateClient);
router.get('/clients' , clientCtrl.getClients); 
router.get('/getTotalPerMonth' , clientCtrl.totalPerMonth);
router.put('/updateRDV/:id' , clientCtrl.updateRendezvous);
router.put('/updateStatusDosssier/:id' , clientCtrl.updateDossierStatus);
router.get('/getClientsByRespAdmin/:id' , clientCtrl.getClientsByRespAdmin);
router.delete('/delete/:id' , clientCtrl.deleteClient)
module.exports = router