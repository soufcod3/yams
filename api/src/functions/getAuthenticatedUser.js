const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function getAuthenticatedUser(token, res, secretKey) {
    try {
        const decode = jwt.verify(token, secretKey);
        return await User.findOne({'_id': decode.userId})
    } catch (error) {
        res.status(401).send("Problème d'authentification")
    }
}

module.exports = { getAuthenticatedUser }