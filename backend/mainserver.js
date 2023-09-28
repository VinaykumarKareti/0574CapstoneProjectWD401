


const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
var Account = require("./key.json");
const express = require('express');
const app = express();




initializeApp({
    credential: cert(Account)
  });

var fsdb = getFirestore();
const basePath = __dirname.replace('backend', '');
app.get('/', function(rq, response){
  
    response.sendFile(basePath + 'htmlfiles/signin.html');
});
app.get('/log', function(rq, response){

    response.sendFile(basePath+'/htmlfiles/login.html');
})
app.get('/sigSub', 
function(rq, response){

  fsdb.collection("login").where("email","==",rq.query.email)
  .get().then((docs) =>{
    if (docs.size > 0){
      response.sendFile(basePath+"/htmlfiles/Already.html");
    }
    else{
      fsdb.collection('login').add({
        email : rq.query.email,
        password : rq.query.password,}).then(() => {
        response.sendFile(basePath+"/htmlfiles/loginSuccess.html")
    });
    }
  });



    // fsdb.collection('login').add({
    //     email : rq.query.email,
    //     password : rq.query.password,}).then(() => {
    //     response.send("Your signin is success.")
    // });    
})
app.get('/logSub', 
function(rq, response){
    fsdb.collection('login')
    .where('email', '==', rq.query.email)
    .where('password', '==', rq.query.password)
    .get()
    .then((ab) => {
        if(ab.size>0){
            response.redirect("http://127.0.0.1:5500/htmlfiles/home3page.html");

        }else{
            response.send("Your Login is failed.")
        }
    })
})


app.listen(5000);



