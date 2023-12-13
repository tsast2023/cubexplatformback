require('dotenv').config()
const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const fileUpload = require('express-fileupload')
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json({ limit: '150mb' }))
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true ,
    limits: { fileSize: 50 * 1024 * 1024 },
}))
app.use(cors({origin:"*"}))


// routes 
app.use('/admin/user' , require('./routes/userRouter'))
app.use('/admin/api' , require('./routes/offerRouter'))
app.use('/admin/contact' , require('./routes/contactRouter'))
app.use('/admin/client' , require('./routes/clientRouter'))
app.use('/admin/pays' , require('./routes/paysRouter'))
// connect to mongodb
const URI = process.env.MONGODB_DB
mongoose.connect(URI, {

    useNewUrlParser : true , 
    useUnifiedTopology : true 
}).then(() => 
{console.log('connected to mongodb')},(error)=>{console.log('not connected to db'+error);});

const PORT = process.env.PORT || 6000
app.listen(PORT , ()=> {
    console.log("server is running on port ", PORT)
})


