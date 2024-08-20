
require("dotenv").config();

const express = require("express")
const cors = require('cors')

const app= express()

const port = process.env.PORT || 5000

//middleware
app.use(express.json());
app.use(cors())

//db connection
require('./db/connection')

//require routes
const userRoutes = require('./routes/userRoutes')
const authRoutes = require("./routes/authRoutes")

//routes 
app.use('/api/auth', authRoutes )
app.use('/api', userRoutes )

app.get("/", (req,res) => {
    res.send('hello')
})

app.listen(port, async () => {
    console.log(`server is running at port number ${port}`)
})