import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
const app = express()
dotenv.config({});
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const __dirname = path.resolve();
app.use(express.static(__dirname + '/build'));

app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (!err) {
        console.log("Connection Succeded")
    } else {
        console.log("Error in connection" + err)
    }
})

// app.get('/', (req,res) => {
//     res.send("API is called")
// })

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/build/index.html');
});

app.post("/api/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user, code: 'L1'})
            } else {
                res.send({ message: "Password didn't match", code: 'L2'})
            }
        } else {
            res.send({message: "User not registered", code: 'L3'})
        }
    })
}) 

const validateEmail = function(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
app.post("/api/register", (req, res)=> {
    // console.log(req.body)
    const {name, email, password} = req.body
    if(validateEmail(req.body.email)){
        User.findOne({email: email}, (err, user) => {
            if(user){
                res.send({message: "User already registerd", code: "R1"})
            } else {
                const user = new User({
                    name,
                    email,
                    password
                })
                user.save(err => {
                    if(err) {
                        res.send(err)
                    } else {
                        res.send( { message: "Successfully Registered, Please Login now !", code: "R2"})
                    }
                })
            }
        })
    }else{
        res.send( { message: "Error saving your email!", code: "R3"})
    }
}) 

app.listen(process.env.PORT,() => {
    console.log(`Server is running on port ${process.env.PORT}`)
})









// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://Lambton-Ansh:<password>@cluster0.aip9iwu.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// mongodb+srv://Lambton-Ansh:Ansh%401234@cluster0.aip9iwu.mongodb.net/?retryWrites=true&w=majority