var admin = require("firebase-admin");

var serviceAccount = require("./clickerkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
db=admin.firestore();

const express = require("express")
var cors = require("cors")
const app = express()
const nodemailer = require("nodemailer")
const sendGridTransport = require("nodemailer-sendgrid-transport");

let ref = db.collection("OTP");
require('dotenv').config();






app.use(cors({origin:true}))




app.use(express.json())
const transporter = nodemailer.createTransport(sendGridTransport({
auth:{
api_key:process.env.REACT_APP_API_KEY
}
}))
function generateOtp(email){
    var text = "";
    var possible = "0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
   ref.add({
       Email:email,
       onetimepassword:text
   })
   return text;
}
app.post("/send", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
const { email } = req.body
let text=generateOtp(email);
transporter.sendMail({
to:email,
from: "greeta1999kavitha@gmail.com",
subject:"Clicker Game OTP",
html:`<h3>Dear user,</h3>
<p>This is your one time password:</p>
<p>${text}</p>`
}).then(resp => {
res.json({resp})
})
.catch(err => {
console.log(err)
})
})
