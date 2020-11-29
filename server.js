const express = require('express')
const server = express()
const session = require('express-session')

const sessionConfig = {
    name:"monkey",
    secret:"keep it secret...",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false
}

const userRouter = require("./users/users-router")
const authRouter = require("./auth/auth-router")

server.use(express.json())
server.use(session(sessionConfig))
server.use("/api/users", userRouter)
server.use("/api/auth", authRouter)


server.get('/', (req, res) => {
    res.send("Server is active and running")
})

module.exports = server