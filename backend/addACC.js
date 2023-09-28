const express = require("express");
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const app = express();
const Account = require("./key.json");

initializeApp({
  credential: cert(Account)
});
const fsdb = getFirestore();
const basePath = __dirname.replace('backend', '');

app.use(express.urlencoded({ extended: true })); // Add this line to parse form data

app.get("/", (req, res) => {
  res.sendFile(basePath + "htmlfiles/addACC.html");
});



  app.get('/trans', 
function(rq, response){


  const phone = rq.query.username;
  const password = parseInt(rq.query.rupees,10);

  fsdb.collection('PAyON').add({
    username: phone,
    rupees: password
  })
  .then((docRef) => {
    // console.log('Document written with ID:', docRef.id);
    response.sendFile(basePath+"htmlfiles/SuccTrans.html");
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
    response.status(500).send("Internal Server Error");
  });


});
app.listen(8080, () => {
  console.log(`Server is listening on port ${8080}`);
});







