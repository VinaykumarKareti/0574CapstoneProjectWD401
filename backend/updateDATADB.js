
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
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(basePath + "/htmlfiles/transaction.html");
  });

  app.get("/tranToOthers", (req, res) => {

    const FromAcc = req.query.fromAcc;
    const ToAcc = req.query.toAcc;
    const rupees = parseInt(req.query.rupees);

var userRef = fsdb.collection("PAyON").where("username", "==", ToAcc);

userRef.get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    var userData = doc.data();

    userData.rupees = userData.rupees + rupees;
    // console.log(rupees+100); 
    // console.log(userData.rupees);
    // console.log("jhghjbgjhgugju");
    doc.ref.set(userData, { merge: true });
  });
});

var userRef2 = fsdb.collection("PAyON").where("username", "==", FromAcc);
userRef2.get().then(function(querySnapshot1) {
    querySnapshot1.forEach(function(doc1) {
      var userData1 = doc1.data();
      userData1.rupees = userData1.rupees - rupees; 
      var a = userData1.rupees;
      doc1.ref.set(userData1, { merge: true });
      res.send(`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Transaction Success</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
              }
      
              .container {
                  text-align: center;
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                  animation: fadeIn 0.5s ease-in-out;
              }
      
              h2 {
                  color: #007bff;
                  font-size: 24px;
                  margin-bottom: 20px;
              }
      
              p {
                  font-size: 18px;
                  margin-bottom: 10px;
              }
      
              .success-text {
                  color: #28a745;
                  font-weight: bold;
              }
      
              .balance-text {
                  color: #333;
              }
      
              @keyframes fadeIn {
                  0% { opacity: 0; transform: translateY(-10px); }
                  100% { opacity: 1; transform: translateY(0); }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Your Transaction is Successful.</h2>
              <p class="success-text">Your ACC Name: ${FromAcc}</p>
              <p class="success-text">Transferred to: ${ToAcc}</p>
              <p class="balance-text">Your Account Balance: ${a}</p>
          </div>
      </body>
      </html>
      `);
    });
  });

});

app.listen(8000, () => {
    console.log(`Server is listening on port ${8000}`);
  });