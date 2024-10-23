
require("dotenv").config();

const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser');

const app= express()

const port = process.env.PORT || 5000

//middleware    
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Specify allowed methods
    credentials: true, // Allow credentials if necessary
  }));

//db connection
require('./db/connection')

//require routes
const employeeRoutes = require('./routes/employeeRoutes')
const employerRoutes = require('./routes/employerRoutes')
const authRoutes = require("./routes/authRoutes")

//routes 
app.use('/api/auth', authRoutes )
app.use('/api/employee', employeeRoutes )
app.use('/api/employer', employerRoutes )

app.get("/", (req,res) => {
    res.send('hello world')
})

app.listen(port, async () => {
    console.log(`server is running at port number ${port}`)
})