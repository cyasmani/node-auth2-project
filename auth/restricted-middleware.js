const jwt = require("jsonwebtoken")
const secrets = require("../config/secrets")

module.exports = (req, res, next) => {

    const [authType, token] = req.headers.authorization.split(" ");
    if(token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if(err) {
                res.status(401).json({you: "invalid token"})
            } else {
                req.decodedJwt = decodedToken
                next()
            }
        })

    } else {
        res.status(401).json({you: "Ya forgot the token"})
    }

}