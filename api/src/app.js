const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

const secretKey = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxMjc0NTkxMywiaWF0IjoxNzEyNzQ1OTEzfQ.qzZCfvm_aENCj7doQWhDQ812zkdlkx6tX_abfh05GAg"
const { getAuthenticatedUser } = require("./functions/getAuthenticatedUser.js");

////////// MIDDLEWARES
// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json());
// enable cors
app.use(cors());
app.options("*", cors());
////////// END MIDDLEWARES

/////////// MONGO DB SETUP
const { insertPastriesInDb } = require("./functions/insertPastriesInDb.js");

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://soufwra:HgnWUnbhp3eWu8aA@yams-db.uh6ywht.mongodb.net/yams"
);
const User = require("./models/User");

insertPastriesInDb()
////////// END MONGO DB SETUP

////////// BCRYPT
const bcrypt = require("bcrypt");
const { launchDices } = require("./functions/launchDices.js");
const { getRandomPastries } = require("./functions/getRandomPastries.js");
const Pastry = require("./models/Pastry.js");
////////// END BCRYPT

app.get("/user", async function (req, res) {
  const token = req.query['token']
  // Verify the token using jwt.verify method
  const user = await getAuthenticatedUser(token, res, secretKey)
  if (user) {
    res.status(200).send(user);
  }
});

app.post("/signin", async function (req, res) {
  let user = null;

  user = await User.findOne({ mail: req.body.mail }).exec();

  if (user) {
    res.status(406).send("Ce mail est déjà lié à un utilisateur");
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user = new User({
      username: req.body.username,
      mail: req.body.mail,
      password: hashedPassword,
    });
    user.save().then(() => console.log("User saved :", user.username));

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).send({ token, user });
  }

});

app.post("/login", async function (req, res) {
  try {
    const user = await User.findOne({ mail: req.body.mail }).exec();

    if (user) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (passwordMatch) {
        const token = jwt.sign({ userId: user._id }, secretKey, {
          expiresIn: "1h",
        });
        return res.status(200).json({ token, user:  user});
      } else {
        return res.status(405).send("Mauvais mot de passe.");
      }
    } else {
      return res.status(401).send("Aucun utilisateur trouvé avec cette adresse mail");
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur de connexion" });
  }
});

app.post("/play", async function (req, res) { // Returns digits & pastries
  const token = req.headers.authorization.replace("Bearer ","");

  const user = await getAuthenticatedUser(token, res, secretKey)

  if (user.throwsLeft > 0) {
    await launchDices()
    .then(async digits => {
      const pastries = await getRandomPastries(digits)

      user.throwsLeft = user.throwsLeft - 1;
      pastries.forEach(pastry => {
        user.pastries.push(pastry)
      })
      user.save().then(() => console.log("User throws updated :", user.throwsLeft));
      res.status(200).send({ digits, pastries })
    })
    .finally(() => {
      // user.throwsLeft = user.throwsLeft - 1;

    })

  } else {
    res.status(400).send("Il ne vous reste plus de lancés.")
  }

});

app.get('/pastries', async (req, res) => {
  const pastries = await Pastry.find({stock: { $gt: 0 }})
  res.status(200).send({ pastries })
})

app.get('/results', async (req, res) => {
  const winningUsers = await User.find({'pastries.0': {$exists: true}})

  res.status(200).send({ winningUsers })
})

app.listen(8000, function () {
  console.log("Example app listening on port 8000!");
});